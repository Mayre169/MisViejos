from django.urls import path
from .views import DataUserListView, AuthSecurityCreateView, DataUserCreate, LoginView, HomeDataProfileView, DashboardDataProfile, AddressBookView, ImgProfileView, ChangePasswordUserView

urlpatterns = [
path('users/', DataUserListView.as_view(), name='datauser-list'),
path('register/auth', AuthSecurityCreateView.as_view(), name='auth-user'),
path('register/', DataUserCreate.as_view(), name='create-new-user'),
path('login/auth', LoginView.as_view(), name='login-user'),
path('profile/data-basic', HomeDataProfileView.as_view(), name='user-data-basic'),
path('profile/data', DashboardDataProfile.as_view(), name='data-profile'),
path('profile/address', AddressBookView.as_view(), name='data-address'),
path('profile/img', ImgProfileView.as_view(), name='img-profile'),
path('profile/change-password', ChangePasswordUserView.as_view(), name='change-password'),
]