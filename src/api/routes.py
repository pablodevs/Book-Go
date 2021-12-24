"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product , Dispo
from api.utils import generate_sitemap, APIException
import cloudinary
import cloudinary.uploader
import os

#para la autenticación y generar el token
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required




api = Blueprint('api', __name__)


# @api.route('/route', methods=['POST', 'GET', '...'])
# def function():

# GET ALL PRODUCTS or CREATE A PRODUCT
@api.route('/products', methods=['GET'])
def get_all_products():

    product_query = Product.query.all()
    all_products = list(map(lambda x: x.serialize(), product_query))
    return jsonify(all_products)

# GET ONE PRODUCT
@api.route('/products/<int:id>', methods=['GET'])
def get_one_product(id):

    product_query = Product.query.get(id)
    return jsonify(product_query.serialize()),200

# CHANGE PRODUCT INFO
@api.route('/product/<int:product_id>', methods=['PUT'])
def handle_single_product(product_id):
    """
    Single product
    """
    product = Product.query.get(product_id)

    # Data validation
    if product is None:
        raise APIException('Product not found in data base', status_code=404)
    
    # Query body
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




#CREATE NEW USER
@api.route('/user', methods=['POST'])
def create_new_user():

    # fetch for the user
    name_received = request.form.get("name", None)
    lastname_received = request.form.get("lastname", None)
    email_received = request.form.get("email", None)
    phone_received = request.form.get("phone", None)
    password_received = request.form.get("password", None)
    user = User(
        email = email_received,
        phone = phone_received,
        password = password_received,
        name = name_received,
        lastname = lastname_received
        )
 
    

    # validate that the front-end request was built correctly
    if 'profile_image' in request.files:
        # upload file to uploadcare
        cloudinary.config( 
        cloud_name = os.getenv('CLOUD_NAME'), 
        api_key = os.getenv('API_KEY'), 
        api_secret = os.getenv('API_SECRET') 
        )
  
        result = cloudinary.uploader.upload(request.files['profile_image'])
        # update the user with the given cloudinary image URL
        user.profile_image_url = result['secure_url']

        
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize()), 200
    

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
    print('###############################################')
    print (product_name)
    product_query = Dispo.query.filter_by(product = product_name).all()
    all_dispo = list(map(lambda x: x.serialize(), product_query))
    return jsonify(all_dispo)
    


# CHANGE USER INFO
@api.route('/user/<int:user_id>', methods=['PUT'])
def handle_single_user(user_id):
    """
    Single user
    """
    user = User.query.get(user_id)

    # Data validation
    if user is None:
        raise APIException('User not found in data base', status_code=404)
    
    # Query body
    request_body = request.json

    # Check body's info
    if "name" in request_body:
        user.name = request_body["name"]
    if "lastname" in request_body:
        user.lastname = request_body["lastname"]
    if "email" in request_body:
        user.email = request_body["email"]
    if "phone" in request_body:
        user.phone = request_body["phone"]
    # if "password" in request_body:
    #     user.password = request_body["password"]

    db.session.commit()

    return jsonify(user.serialize()), 200

