"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product
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

# GET ALL PRODUCTS
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


#CREATE NEW USER
@api.route('/user', methods=['POST'])
def create_new_user():

    # fetch for the user
    name_recieved = request.form.get("name", None)
    lastname_recieved = request.form.get("lastname", None)
    email_recieved = request.form.get("email", None)
    password_recieved = request.form.get("password", None)
    user = User(email= email_recieved, password = password_recieved, name= name_recieved , lastname = lastname_recieved)
 
    

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
    email_recieved = request.json.get("email", None)
    password_recieved = request.json.get("password", None)
       # Query your database for username and password
    user = User.query.filter_by(email=email_recieved, password=password_recieved).first()
    if user is None:
        # the user was not found on the database
        return jsonify({"message": "Usuario o contraseña incorrectos"}), 401
    
    # create a new token with the user id inside
    access_token = create_access_token(identity=user.id)
    return jsonify({"message": "Acceso correcto", "token": access_token, "user_id": user.id, "profile_image_url" : user.profile_image_url, "name": user.name, "lastname": user.lastname })

 
    