"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product
from api.utils import generate_sitemap, APIException
import cloudinary
import cloudinary.uploader
import os


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

    email_recieved = request.form.get("email", None)
    password_recieved = request.form.get("password", None)
    user = User(email= email_recieved, password = password_recieved, name= "Manolo" , lastname = "lópez")
 
    

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
    else:
        raise APIException('Missing profile_image on the FormData or something fail')

