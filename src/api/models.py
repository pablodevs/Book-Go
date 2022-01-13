from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


#TABLA DE USUARIOS
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    lastname = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(9), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_admin= db.Column(db.Boolean(), nullable=False, default=False) # Una duda, no habría que hacer que is_admin sea Unique=True ??? de otra forma podría haber 2 o más admins
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
            "phone": str(self.phone),
            "is_admin" : self.is_admin,
            "profile_image_url": self.profile_image_url,
            # do not serialize the password, its a security breach
        }


#TABLA DE PRODUCTOS
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False) # ⚠️ Unique True porque si no da problemas con las imágenes por como lo ha hecho Chavi, en AdminiProducts
    price = db.Column(db.Integer, nullable=False)  
    description = db.Column(db.String(1000), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    sku = db.Column(db.String(50),nullable=True)
     # Habrá que meter sí o sí las imágenes en una url (product_img_url) unidas al id del producto
    
    disponibilidad = db.relationship('Dispo', backref='product', lazy=True)
    reserva = db.relationship('Book', backref='product', lazy=True)

    def __repr__(self):
        return '<Product %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price" : self.price,
            "description" : self.description,
            "duration" : self.duration,
            "sku" : self.sku
            # "product_img_url": self.product_img_url
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
            "product_id": self.product_id,
            "date" : self.date.strftime("%-d/%-m/%Y"),
            "time" : self.time.strftime("%-H:%M")
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
            "time" : self.time.strftime("%-H:%M"),
            "available" : self.available
        }