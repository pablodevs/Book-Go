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
    is_admin= db.Column(db.Boolean(), nullable=False, default=False) # Una duda, no habría que hacer que is_admin sea Unique=True ??? de otra forma podría haberr 2 o más admins
    profile_image_url = db.Column(db.String(255), unique=False, nullable=True)

    def __repr__(self):
        return '<User %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "lastname": self.lastname,
            "email": self.email,
            "phone": str(self.phone),
            "is_admin" : self.is_admin,
            "profile_image_url": self.profile_image_url,
            # do not serialize the password, its a security breach
        }





#TABLA DE PRODUCTOS
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False) # ⚠️ Unique True porque si no da problemas en AdminiProducts que ahora no se solucionar
    price = db.Column(db.Integer,nullable=False)
    description = db.Column(db.String(1000),nullable=True)
    # Habrá que meter sí o sí las imágenes en una url (product_img_url) unidas al id del producto

    def __repr__(self):
        return '<Product %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price" : self.price,
            "description" : self.description
            # "product_img_url": self.product_img_url
        }


#TABLA DE RESERVAS
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product = db.Column(db.String(120), nullable=False)
    # ⚠️⚠️ Digo yo que habría que tener el user_id en lugar de el mail ⚠️⚠️
    email = db.Column(db.String(120), unique=True, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    time = db.Column(db.Time,nullable=False)
    created = db.Column(db.DateTime,onupdate=datetime.now)

    def __repr__(self):
        return '<Book %r>' % self.product

    def serialize(self):
        return {
            "id": self.id,
            "product": self.product,
            "email": self.email,
            "date" : self.date,
            "time" : self.time
        }


#TABLA DE DISPONIBILIDAD
class Dispo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product = db.Column(db.String(120), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    time = db.Column(db.Time,nullable=False)
    available= db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return '<Dispo %r>' % self.product

    def serialize(self):
        return {
            "id": self.id,
            "product": self.product,
            #esto te devuelve la fecha en el formato español
            "date" : self.date.strftime("%-d/%-m/%Y"),
            #este otro en milisegundos
            #"date" : self.date.strptime(self.date.strftime("%d/%m/%Y"),"%d/%m/%Y").timestamp()*1000,
            "time" : str(self.time),
            "available" : self.available
        }