from django.urls import path
from .tokens import EmailTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView
from .views import *

urlpatterns = [
    path('login/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT login
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh JWT token
    path('register/', RegisterView.as_view(), name='register'),  # User registration
    path('profile/', ProfileView.as_view(), name='profile'), # view page
    path('send-otp/', SendOTPView.as_view(), name='send_otp'),  # Send OTP to email
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),  # Verify OTP
    # FORGOT PASSWORD
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
]
