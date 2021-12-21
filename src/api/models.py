from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


#TABLA DE USUARIOS
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    lastname = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(9), unique=True, nullable=False) # Cambiar a Nulable False
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_admin= db.Column(db.Boolean(), nullable=False, default=False)
    profile_image_url = db.Column(db.String(255), unique=False, nullable=True)

    reserva = db.relationship('Book', backref='user', lazy=True)

    def __repr__(self):
        return '<User %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "name" :self.name,
            "lastname" : self.lastname,
            "phone" : self.phone,
            "email": self.email,
            "is_admin" : self.is_admin,
            "profile_image_url": self.profile_image_url,
            # do not serialize the password, its a security breach
        }





#TABLA DE PRODUCTOS
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Integer,nullable=False)
    description = db.Column(db.String(150),nullable=False)
    
    disponibilidad = db.relationship('Dispo', backref='product', lazy=True)
    reserva = db.relationship('Book', backref='product', lazy=True)

    def __repr__(self):
        return '<Product %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price" : self.price,
            "description" : self.description
        }





#TABLA DE RESERVAS
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
   
    date = db.Column(db.DateTime, nullable=False)
    time = db.Column(db.Time,nullable=False)
    created = db.Column(db.DateTime,onupdate=datetime.now)

    product_id = db.Column(db.Integer,db.ForeignKey('product.id') ,nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)


    def __repr__(self):
        return '<Book %r>' % self.product

    def serialize(self):
        return {
            "id": self.id,
            "product": self.product,
            "date" : self.date,
            "time" : self.time
        

        }


#TABLA DE DISPONIBILIDAD
class Dispo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    time = db.Column(db.Time,nullable=False)
    available= db.Column(db.Boolean(), unique=False, nullable=False)

    product_id = db.Column(db.Integer, db.ForeignKey('product.id'),
        nullable=False)

    def __repr__(self):
        return '<Dispo %r>' % self.product

    def serialize(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            #esto te devuelve la fecha en el formato español
            "date" : self.date.strftime("%-d/%-m/%Y"),
            #este otro en milisegundos
            #"date" : self.date.strptime(self.date.strftime("%d/%m/%Y"),"%d/%m/%Y").timestamp()*1000,
            "time" : str(self.time),
            "available" : self.available
        }