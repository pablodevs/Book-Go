"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product
from api.utils import generate_sitemap, APIException

api = Blueprint('api', __name__)


# @api.route('/route', methods=['POST', 'GET', '...'])
# def function():

# GET ALL PRODUCTS
@api.route('/products', methods=['GET'])

def get_all_products():

    product_query = Product.query.all()
    all_products = list(map(lambda x: x.serialize(), product_query))
    return jsonify(all_products)
