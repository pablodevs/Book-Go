  
import os
from flask_admin import Admin
from .models import db, User, Book, Product, Dispo
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='Admin Panel Control', template_mode='bootstrap4')

    class Chavi_model (ModelView):
        column_display_pk = True 

        # bloquear el acceso a admin
        # def is_accessible(self):
        #     if False:
        #         return login.current_user.is_authenticated()

    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(Chavi_model(User, db.session))
    admin.add_view(Chavi_model(Book, db.session))
    admin.add_view(Chavi_model(Product, db.session))
    admin.add_view(Chavi_model(Dispo, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))