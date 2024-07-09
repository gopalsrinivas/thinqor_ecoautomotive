from django.urls import path
from account.views import *

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user_register'),
    path('login/',UserLoginView.as_view(),name="user_login"),
    path('logout/', LogoutView.as_view(), name='user_logout'),
    path('profile/',UserProfileView.as_view(),name="user_profile"),
    path('profile/<int:pk>/', UserProfileEditView.as_view(), name='user_profile_edit_detail'),
    path('changepassword/', UserChangePasswordView.as_view(), name="changepassword"),
    path('send-reset-password-email/',SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
]
