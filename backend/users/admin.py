from django.contrib import admin
from .models import DataUser, DataProfile, AuthSecurity, Roles

admin.site.register(DataUser)
admin.site.register(AuthSecurity)
admin.site.register(Roles)