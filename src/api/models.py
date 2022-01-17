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


#TABLA DEL NEGOCIO
class Business(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(255), nullable=True, default="")
    phone = db.Column(db.String(9), unique=True, nullable=True, default="")
    schedule = db.Column(db.String(50), nullable=True, default="") # ej: "10:00,20:00"
    weekdays = db.Column(db.String(50), nullable=True, default="") # ej: "L, M, X, J, V"

    # Social media
    fb_url = db.Column(db.String(255), unique=False, nullable=True, default="")
    ig_url = db.Column(db.String(255), unique=False, nullable=True, default="")
    twitter_url = db.Column(db.String(255), unique=False, nullable=True, default="")
    

    def __repr__(self):
        return '<Business %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "address" : self.address,
            "phone" : self.phone,
            "schedule" : self.schedule,
            "weekdays" : self.weekdays,
            "fb_url" : self.fb_url,
            "ig_url" : self.ig_url,
            "twitter_url" : self.twitter_url
        }


#TABLA DE SERVICIOS
class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False) # ⚠️ Unique True porque si no da problemas con las imágenes por como lo ha hecho Chavi, en AdminiServices
    is_active = db.Column(db.Boolean(), nullable=False, default=False) # Si el servicio no está activo, puedes modificarlo pero no se podrán realizar reservas hasta que lo actives
    price = db.Column(db.Integer, nullable=False)  
    duration = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    sku = db.Column(db.String(150), nullable=True)
    
    # Habrá que meter sí o sí las imágenes en una url (service_img_url) unidas al id del servicio
    
    disponibilidad = db.relationship('Dispo', backref ='service', lazy=True)
    reserva = db.relationship('Book', backref ='service', lazy=True)

    def __repr__(self):
        return '<Service %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "is_active": self.is_active,
            "price" : self.price,
            "duration" : self.duration,
            "description" : self.description,
            "sku" : self.sku

            # "service_img_url": self.service_img_url
        }


#TABLA DE RESERVAS
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
   
    date = db.Column(db.DateTime, nullable=False)
    time = db.Column(db.Time,nullable=False)
    created = db.Column(db.DateTime,onupdate=datetime.now)

    service_id = db.Column(db.Integer,db.ForeignKey('service.id') ,nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)


    def __repr__(self):
        return '<Book %r>' % self.service

    def serialize(self):
        return {
            "id": self.id,
            "service_id": self.service_id,
            "date" : self.date.strftime("%d/%m/%Y"),
            "time" : self.time.strftime("%H:%M")
        }


#TABLA DE DISPONIBILIDAD
class Dispo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    time = db.Column(db.Time,nullable=False)
    available= db.Column(db.Boolean(), unique=False, nullable=False)

    service_id = db.Column(db.Integer, db.ForeignKey('service.id'),
        nullable=False)

    def __repr__(self):
        return '<Dispo %r>' % self.service

    def serialize(self):
        return {
            "id": self.id,
            "service_id": self.service_id,
            #esto te devuelve la fecha en el formato español
            "date" : self.date.strftime("%d/%m/%Y"),
            #este otro en milisegundos
            #"date" : self.date.strptime(self.date.strftime("%d/%m/%Y"),"%d/%m/%Y").timestamp()*1000,
            "time" : self.time.strftime("%H:%M"),
            "available" : self.available
        }