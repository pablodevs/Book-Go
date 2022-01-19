"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Service, Dispo, Book, Business
from api.utils import generate_sitemap, APIException
import cloudinary
import cloudinary.uploader
import os
from sqlalchemy import and_

from flask_mail import Mail, Message

import math

#para la autenticación y generar el token
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)



app = Flask(__name__)

#CONFIGURACIÓN DE FLASK MAIL
# app.config['DEBUG'] = True
# app.config['TESTING'] = False
# app.config['MAIL_DEBUG'] = True
app.config['MAIL_SERVER'] = 'smtp.servidor-correo.net'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'spa@jmanvel.com'
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = 'spa@jmanvel.com'
app.config['MAIL_MAX_EMAILS'] = None
app.config['MAIL_SUPPRESS_SEND'] = False
app.config['MAIL_ASCII_ATTACHMENTS'] = False

mail = Mail(app)


### FUNCTIONS ###

def resetTimeFormat(hours, minutes):
    '''
    Function to add 0 if < 10
        example input: 
            - hours (integer): 7
            - minutes (integer): 5
        output (string) >>> "07:05"
    '''
    hours = str(hours)
    minutes = str(minutes)
    outputList = []
    for i in [hours, minutes]:
        if len(i) == 1:
            outputList.append('0' + i)
        else: outputList.append(i)

    return f"{outputList[0]}:{outputList[1]}"

def getDispo(schedule, duration):
    '''
        Example input:
            - schedule (array of [open, close]): ["10:00", "20:00"]
            - duration (integer, in minutes): 45

        output (array of strings) >>> ['10:00', '10:45', '11:30', '12:15', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30', '18:15', '19:00']
    '''

    timeFrom = int(schedule[0].split(':')[0]) * 60 + int(schedule[0].split(':')[1])
    timeTo = int(schedule[1].split(':')[0]) * 60 + int(schedule[1].split(':')[1])
    timeInterval = (timeTo - timeFrom)

    output = []

    for i in range(timeFrom, timeTo, duration):
        if (i + duration < timeTo):
            output.append(resetTimeFormat(math.floor(i / 60), i % 60))

    return output


### ENDPOINTS ###

# GET ALL SERVICES
@api.route('/services', methods=['GET'])
def get_services():

    """
    All services
    """
    services = Service.query.all()
    all_services = list(map(lambda x: x.serialize(), services))

    return jsonify(all_services), 200

# CREATE A SERVICE
@api.route('/services', methods=['POST'])
@jwt_required()
def create_service():
    """
    All Services
    """

    # Admin validation
    current_user_id = get_jwt_identity() # obtiene el id del usuario asociado al token (id == sub en jwt decode)
    user = User.query.get(current_user_id)
    if user.serialize()["is_admin"] == False:
        raise APIException('Error de identificación', status_code=401)
    
    body_service = request.json

    # Data validation
    if body_service is None:
        raise APIException("You need to specify the request body as a json object", status_code=400)
    if 'name' not in body_service or body_service['name'] == "" or body_service['name'] == None:
        raise APIException('You need to specify the name', status_code=400)
    elif len(body_service['name']) > 120:
        return jsonify({"message": "El nombre no puede superar los 120 caracteres"}), 400
    if 'price' not in body_service or body_service['price'] == "" or body_service['price'] == None:
        raise APIException('You need to specify the price', status_code=400)
    if 'description' not in body_service or body_service['description'] == "" or body_service['description'] == None:
        raise APIException('You need to create a description', status_code=400)
    elif len(body_service['description']) > 1000:
        return jsonify({"message": "La descripción no puede superar los 1000 caracteres"}), 400
    if 'duration' not in body_service or body_service['duration'] == "" or body_service['duration'] == None:
        raise APIException('You need to specify the duration', status_code=400)
    if 'is_active' not in body_service or body_service['is_active'] == "" or body_service['is_active'] == None:
        if 'sku' not in body_service or body_service['sku'] == "" or body_service['sku'] == None:
            new_service = Service(name = body_service["name"], price = body_service["price"], description = body_service["description"], duration = body_service["duration"])
        else:
            new_service = Service(name = body_service["name"], price = body_service["price"], description = body_service["description"], duration = body_service["duration"], sku = body_service["sku"])
    else:
        if 'sku' not in body_service or body_service['sku'] == "" or body_service['sku'] == None:
            new_service = Service(name = body_service["name"], price = body_service["price"], description = body_service["description"], duration = body_service["duration"], is_active = body_service["is_active"])
        else:
            new_service = Service(name = body_service["name"], price = body_service["price"], description = body_service["description"], duration = body_service["duration"], is_active = body_service["is_active"], sku = body_service["sku"])

    db.session.add(new_service)
    db.session.commit()
    return jsonify(new_service.serialize()), 200

# MODIFY OR DELETE A SERVICE BY id
@api.route('/services/<int:service_id>', methods=['PUT', 'DELETE'])
@jwt_required() # Cuando se recive una peticion, se valida que exista ese token y que sea valido
def handle_single_service(service_id):
    """
    Single service
    """

    # Admin validation
    current_user_id = get_jwt_identity() # obtiene el id del usuario asociado al token (id == sub en jwt decode)
    user = User.query.get(current_user_id)
    if user.serialize()["is_admin"] == False:
        raise APIException('Error de identificación', status_code=401)

    service = Service.query.get(service_id)

    # Data validation
    if service is None:
        raise APIException('Service not found in data base', status_code=404)
        
    # Modify (PUT) a service
    if request.method == 'PUT':
        request_body = request.json

        # Check body's info
        if "name" in request_body:
            service.name = request_body["name"]
        if "price" in request_body:
            service.price = request_body["price"]
        if "description" in request_body:
            service.description = request_body["description"]
        if "duration" in request_body:
            service.duration = request_body["duration"]
        if "is_active" in request_body:
            service.is_active = request_body["is_active"]
        if "sku" in request_body:
            service.sku = request_body["sku"]

        db.session.commit()
        return jsonify(service.serialize()), 200
    
    # DELETE a service
    elif request.method == 'DELETE':
        db.session.delete(service)
        db.session.commit()
        return jsonify({"message": "The service has been deleted"}), 200

# GET A SERVICE
@api.route('/services/<int:service_id>', methods=['GET'])
def get_service(service_id):
    """
    Single service
    """
    service = Service.query.get(service_id)

    # Data validation
    if service is None:
        raise APIException('Service not found in data base', status_code=404)

    return jsonify(service.serialize()), 200


#CREATE NEW USER
@api.route('/user', methods=['POST'])
def create_new_user():

    # fetch for the user

    name_recieved = request.form.get("name", None)
    lastname_recieved = request.form.get("lastname", None)
    email_recieved = request.form.get("email", None)
    phone_recieved = request.form.get("phone", None)
    password_recieved = request.form.get("password", None)
    if "profile_image_url" in request.form:
        profile_image_recived = request.form.get("profile_image_url", None)

    new_user = User(email= email_recieved, password = password_recieved, name= name_recieved, lastname = lastname_recieved, phone = phone_recieved, profile_image_url = profile_image_recived)


    # validate that the front-end request was built correctly
    # if "profile_image" in request.files:
    #     # upload file to uploadcare
    #     cloudinary.config( 
    #     cloud_name = os.getenv('CLOUD_NAME'), 
    #     api_key = os.getenv('API_KEY'), 
    #     api_secret = os.getenv('API_SECRET') 
    #     )
  
    #     result = cloudinary.uploader.upload(request.files['profile_image'], public_id = email_recieved)
    #     # update the user with the given cloudinary image URL
    #     user.profile_image_url = result['secure_url']

    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize()), 200


# GET ALL USERS
@api.route('/users', methods=['GET'])
@jwt_required() # Cuando se recive una peticion, se valida que exista ese token y que sea valido
def get_all_users():
    """
    All Users
    """
    # Admin validation
    current_user_id = get_jwt_identity() # obtiene el id del usuario asociado al token (id == sub en jwt decode)
    user = User.query.get(current_user_id)
    if user.serialize()["is_admin"] == False:
        raise APIException('Error de identificación', status_code=401)
    
    all_users = sorted(User.query.all(), key = lambda user: user.serialize()["name"].lower())
    all_clients = [user.serialize() for user in all_users if not user.serialize()["is_admin"]]
    return jsonify(all_clients), 200


#GENERATE TOKEN
@api.route('/token', methods=['POST'])
def generate_token():

    # fetch for create token
    email_received = request.json.get("email", None)
    password_received = request.json.get("password", None)
       # Query your database for username and password
    user = User.query.filter_by(email=email_received, password=password_received).first()
    if user is None:
        # the user was not found on the database
        return jsonify({"message": "Usuario o contraseña incorrectos"}), 401
    
    # create a new token with the user id inside
    access_token = create_access_token(identity=user.id)
    return jsonify({"message": "Acceso correcto", "token": access_token, "id": user.id, "profile_image_url" : user.profile_image_url, "name": user.name, "lastname": user.lastname, "email": user.email, "phone": str(user.phone), "is_admin": user.is_admin })


# GET, MODIFY OR DELETE A USER
# Protect a route with jwt_required, which will kick out requests without a valid JWT present.
@api.route('/user', methods=['PUT', 'GET', 'DELETE'])
@jwt_required() # Cuando se recive una peticion, se valida que exista ese token y que sea valido
def handle_single_user():
    """
    Single user
    """
    current_user_id = get_jwt_identity() # obtiene el id del usuario asociado al token (id == sub en jwt decode)
    user = User.query.get(current_user_id)

    # Data validation
    if user is None:
        raise APIException('User not found in data base', status_code=404)

    # Modify (PUT) a user
    if request.method == 'PUT':
        # Query body
        request_body = request.form


        # Check body's info
        if "name" in request_body:
            user.name = request_body.get("name", None)
        elif len(request_body.get("name", None)) > 120:
            raise APIException('Nombre demasiado largo', status_code=400)
        if "lastname" in request_body:
            user.lastname = request_body.get("lastname", None)
        elif len(request_body.get("lastname", None)) > 120:
            raise APIException('Apellido demasiado largo', status_code=400)
        if "email" in request_body:
            user.email = request_body.get("email", None)
        elif len(request_body.get("email", None)) > 120:
            raise APIException('Introduce una dirección de correo electrónico válida', status_code=400)
        if "phone" in request_body:
            user.phone = request_body.get("phone", None)
        if "profile_image" in request_body:
            user.profile_image_recived = request.form.get("profile_image_url", None)
        # if "password" in request_body:
        #     user.password = request_body["password"]

        db.session.commit()
        return jsonify(user.serialize()), 200
        
    # GET a user
    elif request.method == 'GET':
        return jsonify(user.serialize()), 200
    
    # DELETE a user
    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "The user has been deleted"}), 200

    return jsonify({"message": "Invalid Method"}), 404


# GET AVAILABILITY OF A SERVICE
@api.route('/dispo/<service_name>', methods=['GET'])
def get_service_dispo(service_name):

    # buscamos el servicio en la tabla de servicios
    service_query = Service.query.filter_by(name = service_name).all()
    service= list(map(lambda x: x.serialize(), service_query))
    service_id = service[0]['id']

    #buscamos la disponibilidad del producto con id = product_id y available true
    product_dispo = Dispo.query.filter(and_(Dispo.service_id == service_id , Dispo.available == True)).all()
    all_days_dispo= list(map(lambda x: x.serialize(), product_dispo))
    return jsonify(all_days_dispo)
    # buscamos la disponibilidad del servicio con id = service_id y available true
    service_dispo = Dispo.query.filter(and_(Dispo.service_id == service_id , Dispo.available == True)).all()
    all_days_dispo= list(map(lambda x: x.serialize(), service_dispo))
    return jsonify(all_days_dispo)


# CREATE NEW BOOKING
@api.route('/book/<int:user_id>', methods=['POST'])
@jwt_required()
def create_booking(user_id):
    # change is_available to False in Dispo
    
    # dispo = Dispo.query.get(dispo_id)
    # dispo.available = False
    # db.session.commit()

    request_body = request.json

    # Create a new booking
    new_booking = Book(user_id = user_id , date = request_body["date"] , time = request_body["time"], service = request_body["service"])
    db.session.add(new_booking)
    db.session.commit()


    #buscamos el email del cliente
    customer = User.query.get(user_id)
    customer_email = customer.email
    # AHORA ENVIAMOS EL EMAIL DE CONFIRMACIÓN DE RESERVA
    msg = Message("Confirmación de reserva",sender="spa@jmanvel.com",
                recipients=[customer_email])
    msg.body = "testing body"
    msg.html = "<html lang='es'><head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head><body><h1>Confirmación de Reserva</h1><div><p>Estimado cliente:</p><p>Le confirmamos su reserva de nuestro servicio de " + str(dispo.service) + " para el día " + str(dispo.date.strftime("%-d/%-m/%Y"),) + " a las " + str(dispo.time.strftime("%-H:%M")) + "  </p><p>Muchas gracias por confiar en nosotros.</p></div></body></html>"
    mail.send(msg)

    return jsonify({"message": "Su reserva ha sido Confirmada"}), 200
   
# CREATE NEW BOOKING
# @api.route('/book/<int:dispo_id>/<int:user_id>', methods=['POST'])
# @jwt_required()
# def create_booking(dispo_id, user_id):
#     # change is_available to False in Dispo
    
#     # dispo = Dispo.query.get(dispo_id)
#     # dispo.available = False
#     # db.session.commit()


#     # Create a new booking
#     new_booking = Book(user_id = user_id , date = dispo.date , time = dispo.time, service = dispo.service)
#     db.session.add(new_booking)
#     db.session.commit()


#     #buscamos el email del cliente
#     customer = User.query.get(user_id)
#     customer_email = customer.email
#     # AHORA ENVIAMOS EL EMAIL DE CONFIRMACIÓN DE RESERVA
#     msg = Message("Confirmación de reserva",sender="spa@jmanvel.com",
#                 recipients=[customer_email])
#     msg.body = "testing body"
#     msg.html = "<html lang='es'><head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head><body><h1>Confirmación de Reserva</h1><div><p>Estimado cliente:</p><p>Le confirmamos su reserva de nuestro servicio de " + str(dispo.service) + " para el día " + str(dispo.date.strftime("%-d/%-m/%Y"),) + " a las " + str(dispo.time.strftime("%-H:%M")) + "  </p><p>Muchas gracias por confiar en nosotros.</p></div></body></html>"
#     mail.send(msg)

#     return jsonify({"message": "Su reserva ha sido Confirmada"}), 200

# GET BUSINESS INFO
@api.route('/business', methods=['GET'])
def get_business_info():
    """
    Business info
    """
    try:
        # Intenta obtener la tabla de negocio
        business = Business.query.all()[0]
        return jsonify(business.serialize()), 200

    except IndexError as error:
        # Si está vacía, devuelve error
        raise APIException("Business does not exists", status_code=404)


# MODIFY THE BUSINESS
@api.route('/business', methods=['PUT'])
@jwt_required() # Cuando se recive una peticion, se valida que exista ese token y que sea valido
def modify_business_info():
    """
    Business info
    """
    # Admin validation
    current_user_id = get_jwt_identity() # obtiene el id del usuario asociado al token (id == sub en jwt decode)
    user = User.query.get(current_user_id)
    if user.serialize()["is_admin"] == False:
        raise APIException('Error de identificación', status_code=401)

    try:
        # Intenta obtener la tabla de negocio
        business = Business.query.all()[0]

    except IndexError as error:
        # Si está vacía, crea un negocio primero
        new_business = Business()
        db.session.add(new_business)
        db.session.commit()

        # Ahora sí puedes obtener el negocio
        business = Business.query.all()[0]

    request_body = request.json

    # Check body's info
    if "address" in request_body:
        business.address = request_body["address"]
    if "phone" in request_body:
        business.phone = request_body["phone"]
    if "weekdays" in request_body:
        business.weekdays = request_body["weekdays"]
    if "schedule" in request_body:
        business.schedule = request_body["schedule"]
    if "fb_url" in request_body:
        business.fb_url = request_body["fb_url"]
    if "ig_url" in request_body:
        business.ig_url = request_body["ig_url"]
    if "twitter_url" in request_body:
        business.twitter_url = request_body["twitter_url"]

    db.session.commit()
    return jsonify(business.serialize()), 200

# GET DISPO HOURS OF SERVICE WITH sevice_id
@api.route('/services/<int:service_id>/hours', methods=['GET'])
def get_dispo_hours(service_id):
    """
    Service hours dispo
    """

    # Query:
    service = Service.query.get(service_id)

    # Data validation
    if service is None:
        raise APIException('Service not found in data base', status_code=404)

    # Get the schedule and open days (weekdays)
    try:
        # Intenta obtener el horario y la duración
        schedule = Business.query.all()[0].serialize()["schedule"].split(',')
        duration = service.duration

        return jsonify(getDispo(schedule, duration)), 200

    except IndexError as error:
        # Si está vacía, devuelve error
        raise APIException("Business does not exist", status_code=404)

