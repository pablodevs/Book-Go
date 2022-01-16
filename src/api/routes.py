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

#para la autenticación y generar el token
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required


api = Blueprint('api', __name__)

# GET ALL SERVICES
@api.route('/services', methods=['GET'])
def get_services():

    """
    All services
    """
    services = Service.query.all()
    all_services = list(map(lambda x: x.serialize(), services))

    return jsonify(all_services), 200

# CREATE A SERVICES
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
            # Get the schedule and open days
            business = Business.query.all()[0].serialize()
            schedule = business["schedule"]
            weekdays = business["weekdays"]

            timeFrom = schedule.split(',')[0]
            timeTo = schedule.split(',')[1]
            weekdaysList = weekdays.split(',')
            print(f"from {timeFrom} to {timeTo}, the days: {weekdaysList}")

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
@api.route('/users', methods=['POST'])
def create_user():

    body_user = request.json

    # Data validation
    if body_user is None:
        raise APIException("You need to specify the request body as a json object", status_code=400)
    if 'name' not in body_user or body_user['name'] == "" or body_user['name'] == None:
        raise APIException('You need to specify the name', status_code=400)
    if 'lastname' not in body_user or body_user['lastname'] == "" or body_user['lastname'] == None:
        raise APIException('You need to specify the lastname', status_code=400)
    if 'email' not in body_user or body_user['email'] == "" or body_user['email'] == None:
        raise APIException('You need to create a email', status_code=400)
    if 'phone' not in body_user or body_user['phone'] == "" or body_user['phone'] == None:
        raise APIException('You need to specify the phone', status_code=400)
    if 'password' not in body_user or body_user['password'] == "" or body_user['password'] == None:
        raise APIException('You need to specify the password', status_code=400)
        # validate that the front-end request was built correctly
    # if 'profile_image' in request.files:
    #     # upload file to uploadcare
    #     cloudinary.config( 
    #     cloud_name = os.getenv('CLOUD_NAME'), 
    #     api_key = os.getenv('API_KEY'), 
    #     api_secret = os.getenv('API_SECRET') 
    #     )
    # cloudinary_result = cloudinary.uploader.upload(request.files['profile_image'])

    new_user = User(name = body_user["name"], lastname = body_user["lastname"], email = body_user["email"], phone = body_user["phone"], password = body_user["password"])
    # update the user with the given cloudinary image URL
    # user.profile_image_url = cloudinary_result['secure_url']

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


# GET, MODIFY OF DELETE A USER
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
        request_body = request.json

        # Check body's info
        if "name" in request_body:
            user.name = request_body["name"]
        elif len(request_body['name']) > 120:
            raise APIException('Nombre demasiado largo', status_code=400)
        if "lastname" in request_body:
            user.lastname = request_body["lastname"]
        elif len(request_body['lastname']) > 120:
            raise APIException('Apellido demasiado largo', status_code=400)
        if "email" in request_body:
            user.email = request_body["email"]
        elif len(request_body['email']) > 120:
            raise APIException('Introduce una dirección de email válida', status_code=400)
        if "phone" in request_body:
            user.phone = request_body["phone"]
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

    # buscamos la disponibilidad del servicio con id = service_id y available true
    service_dispo = Dispo.query.filter(and_(Dispo.service_id == service_id , Dispo.available == True)).all()
    all_days_dispo= list(map(lambda x: x.serialize(), service_dispo))
    return jsonify(all_days_dispo)
    


# CREATE NEW BOOKING
@api.route('/book/<int:dispo_id>/<int:user_id>', methods=['POST'])
@jwt_required() 
 # ⚠️ si ponemos @jwt_required()  no nos funciona y debe ser porque al pasar por stripe no coge el token
def create_booking(dispo_id, user_id):
    # change is_available to False in Dispo
    dispo = Dispo.query.get(dispo_id)
    dispo.available = False
    db.session.commit()
  

    # Create a new booking
    new_booking = Book(user_id = user_id , date = dispo.date , time = dispo.time, service = dispo.service)
    db.session.add(new_booking)
    db.session.commit()
    return jsonify({"message": "Su reserva ha sido Confirmada"}), 200
   

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
        raise APIException("Business doesn't exists", status_code=404).query.all()[0]


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