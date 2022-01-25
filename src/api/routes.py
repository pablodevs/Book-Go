"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Service, Dispo, Book, Business
from api.utils import generate_sitemap, APIException
import cloudinary
import cloudinary.uploader
import os
from datetime import datetime, time, timedelta
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

def resetStringHour(stringHour):
    '''
    Function to convert string hours ("10:00") in minutes integer
        example input: 
            - hours (integer): 10:30
        output (integer, in minutes) >>> 630
    '''
    return int(stringHour.split(':')[0]) * 60 + int(stringHour.split(':')[1])

def getDispo(schedule, duration, service_id, date):
    '''
        Example input:
            - schedule (array of [open, close]): ["10:00", "20:00"]
            - duration (integer, in minutes): 45

        output (array of strings) >>> ['10:00', '10:45', '11:30', '12:15', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30', '18:15', '19:00']
    '''

    timeFrom = resetStringHour(schedule[0])
    timeTo = resetStringHour(schedule[1])
    timeInterval = (timeTo - timeFrom)

    # Formatea el style de la fecha
    date = datetime.strptime(date, "%d/%m/%Y").strftime("%d/%m/%Y")
    today = datetime.now() + timedelta(hours = 1)
    
    # Revisa las reservas para esa fecha
    hoursNotDispo = []
    all_bookings = Book.query.filter_by(service_id = service_id).all()
    all_bookings = [book.serialize() for book in all_bookings]
    for book in all_bookings:
        if datetime.strptime(book["date"], "%d/%m/%Y").strftime("%d/%m/%Y") == date and book["status"] == "Confirmed":
            hoursNotDispo.append(book["time"])
    
    output = []

    for i in range(timeFrom, timeTo, duration):
        if (i + duration < timeTo):
            resetedHour = resetTimeFormat(math.floor(i / 60), i % 60)

            if today.strftime("%d/%m/%Y") == date and resetStringHour(resetedHour) < resetStringHour(today.strftime("%H:%M")):
                continue

            if resetedHour not in hoursNotDispo:
                output.append(resetedHour)

    return output


### ENDPOINTS ###

cloudinary.config( 
    cloud_name = os.getenv('CLOUD_NAME'), 
    api_key = os.getenv('API_KEY'), 
    api_secret = os.getenv('API_SECRET') 
)

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
        raise APIException('Error de identificación.', status_code=401)
    
    body_service = request.json

    # Data validation
    if body_service is None:
        raise APIException("You need to specify the request body as a json object.", status_code=400)

    if 'name' not in body_service or body_service['name'] == "" or body_service['name'] == None:
        raise APIException('You need to specify the name.', status_code=400)
    elif len(body_service['name']) > 120:
        return jsonify({"message": "El nombre no puede superar los 120 caracteres."}), 400

    if 'price' not in body_service or body_service['price'] == "" or body_service['price'] == None:
        raise APIException('You need to specify the price.', status_code=400)

    if 'description' not in body_service or body_service['description'] == "" or body_service['description'] == None:
        raise APIException('You need to create a description.', status_code=400)
    elif len(body_service['description']) > 1000:
        return jsonify({"message": "La descripción no puede superar los 1000 caracteres"}), 400

    if 'duration' not in body_service or body_service['duration'] == "" or body_service['duration'] == None:
        raise APIException('You need to specify the duration.', status_code=400)
    
    body_image_url = ""
    body_public_id = None
    if 'service_img_url' in body_service and 'public_id' in body_service and (body_service['service_img_url'] != "" and body_service['service_img_url'] != None) and (body_service['public_id'] != "" and body_service['public_id'] != None):
        body_image_url = body_service['service_img_url']
        body_public_id = body_service['public_id']
            
    
    if 'is_active' not in body_service or body_service['is_active'] == "" or body_service['is_active'] == None:
        if 'sku' not in body_service or body_service['sku'] == "" or body_service['sku'] == None:
            new_service = Service(name = body_service["name"], price = body_service["price"], description = body_service["description"], duration = body_service["duration"], service_img_url = body_image_url, public_id = body_public_id)
        else:
            new_service = Service(name = body_service["name"], price = body_service["price"], description = body_service["description"], duration = body_service["duration"], service_img_url = body_image_url, public_id = body_public_id, sku = body_service["sku"])
    else:
        if 'sku' not in body_service or body_service['sku'] == "" or body_service['sku'] == None:
            new_service = Service(name = body_service["name"], price = body_service["price"], description = body_service["description"], duration = body_service["duration"], service_img_url = body_image_url, public_id = body_public_id, is_active = body_service["is_active"])
        else:
            new_service = Service(name = body_service["name"], price = body_service["price"], description = body_service["description"], duration = body_service["duration"], service_img_url = body_image_url, public_id = body_public_id, is_active = body_service["is_active"], sku = body_service["sku"])

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
        raise APIException('Error de identificación.', status_code=401)

    service = Service.query.get(service_id)

    # Data validation
    if service is None:
        raise APIException('Service not found in data base.', status_code=404)
        
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

        if "method" in request_body:
            if request_body["method"] == "delete" or request_body["method"] == "modify":
                # Delete current image in cloudinary
                cloudinaryResponse = cloudinary.uploader.destroy(service.serialize()["public_id"])
                if cloudinaryResponse["result"] != "ok":
                    raise APIException('La imagen no existe o el public id es erróneo.', status_code=404)

                if request_body["method"] == "delete":
                    service.public_id = None
                    service.service_img_url = ""
                elif request_body["method"] == "modify":
                    service.service_img_url = request_body["service_img_url"]
                    service.public_id = request_body["public_id"]

            elif request_body["method"] == "add":
                    service.service_img_url = request_body["service_img_url"]
                    service.public_id = request_body["public_id"]

        db.session.commit()
        return jsonify(service.serialize()), 200
    
    # DELETE a service
    elif request.method == 'DELETE':
        if service.serialize()["public_id"]:
            # Delete current image in cloudinary
            cloudinaryResponse = cloudinary.uploader.destroy(service.serialize()["public_id"])
            if cloudinaryResponse["result"] != "ok":
                raise APIException('La imagen no existe o el public id es erróneo.', status_code=404)

        # Delete all bookings of service
        all_bookings = Book.query.filter_by(service_id = service.id).all()
        for book in all_bookings:
            db.session.delete(book)

        db.session.delete(service)
        db.session.commit()
        return jsonify({"message": "El servicio se ha eliminado correctamente."}), 200

# CANCEL (DELETE) CLOUDINARY IMAGE UPLOAD
@api.route('/cancel', methods=['PUT'])
def cancel_cloudinary_upload():
    """
    Cancel upload to Cloudinary
    """
    request_body = request.json

    cloudinaryResponse = cloudinary.uploader.destroy(request_body["public_id"])
    if cloudinaryResponse["result"] != "ok":
        raise APIException('La imagen no existe o el public id es erróneo.', status_code=404)

    return jsonify({ "message": cloudinaryResponse["result"] }), 200

# GET A SERVICE
@api.route('/services/<int:service_id>', methods=['GET'])
def get_service(service_id):
    """
    Single service
    """
    service = Service.query.get(service_id)

    # Data validation
    if service is None:
        raise APIException('Service not found in data base.', status_code=404)

    return jsonify(service.serialize()), 200


# CREATE NEW USER
@api.route('/user', methods=['POST'])
def create_new_user():

    # fetch for the user

    email_received = request.form.get("email", None)

    # Verifica que el email no exista en otro usuario
    findUser = User.query.filter_by(email = email_received).first()
    if findUser:
        raise APIException('Ya existe una cuenta asociada a ese correo.', status_code=404)
    else:
        name_received = request.form.get("name", None)
        lastname_received = request.form.get("lastname", None)
        phone_received = request.form.get("phone", None)
        password_received = request.form.get("password", None)

        body_image_url = ""
        body_public_id = None
        if 'profile_image_url' in request.form and 'public_id' in request.form and (request.form.get('profile_image_url', None) != "" and request.form.get('profile_image_url', None) != None) and (request.form.get('public_id', None) != "" and request.form.get('public_id', None) != None):
            body_image_url = request.form.get('profile_image_url', None)
            body_public_id = request.form.get('public_id', None)

        new_user = User(email = email_received, password = password_received, name = name_received, lastname = lastname_received, phone = phone_received, profile_image_url = body_image_url, public_id = body_public_id)

    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize()), 200

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
        raise APIException('User not found in data base.', status_code=404)

    # Modify (PUT) a user
    if request.method == 'PUT':
        # Query body
        request_body = request.form

        # Check body's info
        if "name" in request_body:
            if len(request_body.get("name", None)) > 120:
                raise APIException('Nombre demasiado largo.', status_code=400)
            user.name = request_body.get("name", None)
        if "lastname" in request_body:
            if len(request_body.get("lastname", None)) > 120:
                raise APIException('Apellido demasiado largo.', status_code=400)
            user.lastname = request_body.get("lastname", None)

        # Verifica que el email no exista en otro usuario
        if "email" in request_body:
            if len(request_body.get("email", None)) > 120:
                raise APIException('Introduce una dirección de correo electrónico válida.', status_code=400)
            email_received = request_body.get("email", None)
            findUser = User.query.filter_by(email = email_received).first()
            if findUser and findUser != user:
                raise APIException('Ya existe una cuenta asociada a ese correo.', status_code=404)
            else:
                user.email = email_received

        if "phone" in request_body:
            user.phone = request_body.get("phone", None)

        if "method" in request_body:
            if request_body.get("method", None) == "delete" or request_body.get("method", None) == "modify":
                # Delete current image in cloudinary
                cloudinaryResponse = cloudinary.uploader.destroy(user.serialize()["public_id"])
                if cloudinaryResponse["result"] != "ok":
                    raise APIException('No se puede modificar la imagen', status_code=404)

                if request_body.get("method", None) == "delete":
                    user.public_id = None
                    user.profile_image_url = ""
                elif request_body.get("method", None) == "modify":
                    user.profile_image_url = request_body.get("profile_image_url", None)
                    user.public_id = request_body.get("public_id", None)

            elif request_body.get("method", None) == "add":
                    user.profile_image_url = request_body.get("profile_image_url", None)
                    user.public_id = request_body.get("public_id", None)

        db.session.commit()
        return jsonify(user.serialize()), 200
        
    # GET a user
    elif request.method == 'GET':
        return jsonify(user.serialize()), 200
    
    # DELETE a user
    elif request.method == 'DELETE':
        if user.serialize()["public_id"]:
            # Delete current image in cloudinary
            cloudinaryResponse = cloudinary.uploader.destroy(user.serialize()["public_id"])
            if cloudinaryResponse["result"] != "ok":
                raise APIException('La imagen no existe o el public id es erróneo.', status_code=404)

        deleted_id = user.serialize()["id"]
        deleted_email = user.serialize()["email"]

        # Delete all bookings of user
        all_bookings = Book.query.filter_by(user_id = current_user_id).all()
        for book in all_bookings:
            db.session.delete(book)

        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": f"The user with id {deleted_id} and email {deleted_email} has been deleted."}), 200

    return jsonify({"message": "Invalid Method."}), 404

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
        raise APIException('Error de identificación.', status_code=401)
    
    all_users = sorted(User.query.all(), key = lambda user: user.serialize()["name"].lower())
    all_clients = [user.serialize() for user in all_users if not user.serialize()["is_admin"]]
    return jsonify(all_clients), 200


# GENERATE TOKEN
@api.route('/token', methods=['POST'])
def generate_token():

    # fetch for create token
    email_received = request.json.get("email", None)
    password_received = request.json.get("password", None)
       # Query your database for username and password
    user = User.query.filter_by(email=email_received, password=password_received).first()
    if user is None:
        # the user was not found on the database
        return jsonify({"message": "Usuario o contraseña incorrectos."}), 401
    
    # create a new token with the user id inside
    access_token = create_access_token(identity=user.id)
    return jsonify({"message": "Acceso correcto.", "status": "success", "token": access_token, "id": user.id, "profile_image_url" : user.profile_image_url, "name": user.name, "lastname": user.lastname, "email": user.email, "phone": str(user.phone), "is_admin": user.is_admin })




# # GET AVAILABILITY OF A SERVICE
# @api.route('/dispo/<service_name>', methods=['GET'])
# def get_service_dispo(service_name):

#     # buscamos el servicio en la tabla de servicios
#     service_query = Service.query.filter_by(name = service_name).all()
#     service= list(map(lambda x: x.serialize(), service_query))
#     service_id = service[0]['id']

#     #buscamos la disponibilidad del producto con id = product_id y available true
#     product_dispo = Dispo.query.filter(and_(Dispo.service_id == service_id , Dispo.available == True)).all()
#     all_days_dispo= list(map(lambda x: x.serialize(), product_dispo))
#     return jsonify(all_days_dispo)
#     # buscamos la disponibilidad del servicio con id = service_id y available true
#     service_dispo = Dispo.query.filter(and_(Dispo.service_id == service_id , Dispo.available == True)).all()
#     all_days_dispo= list(map(lambda x: x.serialize(), service_dispo))
#     return jsonify(all_days_dispo)


# CREATE NEW BOOKING
@api.route('/book/<int:user_id>', methods=['POST'])
@jwt_required()
def create_booking(user_id):
    """
    Create booking after payment
    """
    # Primero buscamos cliente
    customer = User.query.get(user_id)
    # Check if customer exists
    if customer is None:
        return jsonify({"message": "Usuario o contraseña incorrectos."}), 401
    
    customer_email = customer.email

    request_body = request.json

    # Transforma request_body["date"] en el tipo <datetime.date> y request_body["time"] en <datetime.time>
    bookDate = datetime.strptime(request_body["date"], "%d/%m/%Y")
    bookTime = time.fromisoformat(request_body["time"])

    # Create a new booking
    new_booking = Book(user_id = user_id , date = bookDate , time = bookTime, service_id = request_body["service_id"], created = datetime.now() + timedelta(hours = 1), status = "Confirmed")
    db.session.add(new_booking)
    db.session.commit()

    service = Service.query.get(request_body["service_id"])

    # AHORA ENVIAMOS EL EMAIL DE CONFIRMACIÓN DE RESERVA
    # msg = Message("Confirmación de reserva",sender="spa@jmanvel.com", recipients=[customer_email])
    # msg.body = "testing body"
    # msg.html = "<html lang='es'><head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head><body><h1>Confirmación de Reserva</h1><div><p>Estimado cliente:</p><p>Le confirmamos su reserva de nuestro servicio de " + str(service.serialize()["name"]) + " para el día " + str(request_body["date"]) + " a las " + str(request_body["time"]) + "  </p><p>Muchas gracias por confiar en nosotros.</p></div></body></html>"
    # mail.send(msg)

    return jsonify({"message": "Su reserva ha sido Confirmada."}), 200

# GET BOOKINGS OF USER
@api.route('/user/bookings', methods=['GET'])
@jwt_required()
def get_bookings():
    """
    Create booking after payment
    """
    current_user_id = get_jwt_identity() # obtiene el id del usuario asociado al token (id == sub en jwt decode)
    user = User.query.get(current_user_id)
    # Admin validation
    # if user.serialize()["is_admin"] == False:
    #     raise APIException('Error de identificación.', status_code=401)

    all_bookings = Book.query.filter_by(user_id = current_user_id).all()
    all_bookings = [book.serialize() for book in all_bookings]

    return jsonify(all_bookings), 200

# Cancel (DELETE) a booking
@api.route('/book/<int:book_id>', methods=['PUT'])
@jwt_required()
def cancel_booking(book_id):
    """
    Cancel a booking
    """
    book_to_cancel = Book.query.get(book_id)

    if book_to_cancel is None:
        raise APIException('La cita que estás buscando no existe', status_code=404)

    # Admin or user validation
    current_user_id = get_jwt_identity() # obtiene el id del usuario asociado al token (id == sub en jwt decode)
    user = User.query.get(current_user_id)
    if not user.serialize()["is_admin"] and book_to_cancel.serialize()["user_id"] != current_user_id:
        raise APIException('No tienes permisos suficientes.', status_code=401)

    book_to_cancel.status = "Canceled"
    db.session.commit()
    return jsonify({"message": "Cita cancelada"}), 200

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
        raise APIException("Business does not exists.", status_code=404)


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
        raise APIException('Error de identificación.', status_code=401)

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
@api.route('/services/<int:service_id>/hours', methods=['POST'])
def get_dispo_hours(service_id):
    """
    Service hours dispo
    """

    # Query:
    service = Service.query.get(service_id)

    # Data validation
    if service is None:
        raise APIException('Service not found in data base.', status_code=404)

    # Get the schedule and open days (weekdays)
    try:
        # Intenta obtener el horario y la duración
        schedule = Business.query.all()[0].serialize()["schedule"].split(',')
        duration = service.duration

        request_body = request.json

        # Duración por defecto de 60mins (1h)
        if duration == 0:
            duration = 60

        return jsonify(getDispo(schedule, duration, service.id, request_body["date"])), 200

    except IndexError as error:
        # Si está vacía, devuelve error
        raise APIException("Business does not exist.", status_code=404)

