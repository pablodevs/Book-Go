"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product , Dispo
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


# @api.route('/route', methods=['POST', 'GET', '...'])
# def function():

# GET ALL PRODUCTS or CREATE A PRODUCT
@api.route('/products', methods=['GET', 'POST'])
def handle_products():
    """
    All Products
    """
    # GET all products
    if request.method == 'GET':
        products = Product.query.all()
        all_products = list(map(lambda x: x.serialize(), products))
        return jsonify(all_products), 200

    # Create (POST) a new product
    if request.method == 'POST':
        body_product = request.json

        # Data validation
        if body_product is None:
            raise APIException("You need to specify the request body as a json object", status_code=400)
        if 'name' not in body_product or body_product['name'] == "":
            raise APIException('You need to specify the name', status_code=400)
        elif len(body_product['name']) > 120:
            return jsonify({"message": "El nombre no puede superar los 120 caracteres"}), 400
        if 'price' not in body_product or body_product['price'] == "":
            raise APIException('You need to specify the price', status_code=400)
        if 'description' not in body_product or body_product['description'] == "":
            raise APIException('You need to create a description', status_code=400)
        elif len(body_product['description']) > 1000:
            return jsonify({"message": "La descripción no puede superar los 1000 caracteres"}), 400

        new_product = Product(name = body_product["name"], price = body_product["price"], description = body_product["description"])
        db.session.add(new_product)
        db.session.commit()
        return jsonify(new_product.serialize()), 200

    return jsonify({"message": "Invalid Method"}), 404


# GET MODIFY OF DELETE A PRODUCT BY id
@api.route('/products/<int:product_id>', methods=['PUT', 'GET', 'DELETE'])
def handle_single_product(product_id):
    """
    Single product
    """
    product = Product.query.get(product_id)

    # Data validation
    if product is None:
        raise APIException('Product not found in data base', status_code=404)
        
    # Modify (PUT) a product
    if request.method == 'PUT':
        request_body = request.json

        # Check body's info
        if "name" in request_body:
            product.name = request_body["name"]
        if "price" in request_body:
            product.price = request_body["price"]
        if "description" in request_body:
            product.description = request_body["description"]

        db.session.commit()
        return jsonify(product.serialize()), 200

    # GET a product
    elif request.method == 'GET':
        return jsonify(product.serialize()), 200
    
    # DELETE a product
    elif request.method == 'DELETE':
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "The product has been deleted"}), 200

    return jsonify({"message": "Invalid Method"}), 404
        
#CREATE NEW USER or GET ALL USERS
@api.route('/user', methods=['GET', 'POST'])
def handle_users():
    """
    All Users
    """
    # GET all clients
    if request.method == 'GET':
        all_users = sorted(User.query.all(), key = lambda user: user.serialize()["name"].lower())
        all_clients = [user.serialize() for user in all_users if not user.serialize()["is_admin"]]
        return jsonify(all_clients), 200

    # Create (POST) a new user
    if request.method == 'POST':
        body_user = request.json

        # Data validation
        if body_user is None:
            raise APIException("You need to specify the request body as a json object", status_code=400)
        if 'name' not in body_user or body_user['name'] == "":
            raise APIException('You need to specify the name', status_code=400)
        if 'lastname' not in body_user or body_user['lastname'] == "":
            raise APIException('You need to specify the lastname', status_code=400)
        if 'email' not in body_user or body_user['email'] == "":
            raise APIException('You need to create a email', status_code=400)
        if 'phone' not in body_user or body_user['phone'] == "":
            raise APIException('You need to specify the phone', status_code=400)
        if 'password' not in body_user or body_user['password'] == "":
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

    return "Invalid Method", 404


# GET MODIFY OF DELETE A USER BY id
@api.route('/user/<int:user_id>', methods=['PUT', 'GET', 'DELETE'])
def handle_single_user(user_id):
    """
    Single user
    """
    user = User.query.get(user_id)

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




 # GET AVAILABILITY OF A PRODUCT
@api.route('/dispo/<product_name>', methods=['GET'])
def get_product_dispo(product_name):

    #buscamos el producto en la tabla de productos
    product_query = Product.query.filter_by(name = product_name).all()
    product= list(map(lambda x: x.serialize(), product_query))
    product_id = product[0]['id']

    #buscamos la disponibilidad del producto con id = product_id y available true
    product_dispo = Dispo.query.filter(and_(Dispo.product_id == product_id , Dispo.available == True)).all()
    all_days_dispo= list(map(lambda x: x.serialize(), product_dispo))
    return jsonify(all_days_dispo)