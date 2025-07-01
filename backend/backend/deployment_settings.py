import os
import dj_database_url
from .settings import *
from .settings import BASE_DIR

# Dynamically set ALLOWED_HOSTS based on Render's environment variable
ALLOWED_HOSTS = [os.environ.get('RENDER_EXTERNAL_HOSTNAME', 'your-default-domain.com')]

# CSRF trusted origins for your domain
CSRF_TRUSTED_ORIGINS = ['https://' + os.environ.get('RENDER_EXTERNAL_HOSTNAME', 'your-default-domain.com')]

# Set DEBUG to False for production
DEBUG = False

# Ensure your SECRET_KEY is set securely for production
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-default-secret-key')

# Add proper middleware for static files and security
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Middleware for serving static files
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',  # This is repeated, remove if unnecessary
]

# Static files configuration for Whitenoise (production setup)
STATIC_URL = '/static/'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# This helps collect static files into a specific directory
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

# Database settings (DATABASE_URL is set in Render environment)
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600
    )
}

# Ensure you're using the correct ASGI/WGI setup for deployment:
# Set up your app for both WSGI and ASGI. The application can be exposed either via WSGI or ASGI depending on the deployment method (ASGI for modern async deployments like Gunicorn with Uvicorn workers).

# If you are deploying with ASGI (for async support, with Gunicorn + Uvicorn):
# Make sure your ASGI config is correctly pointed to `backend.asgi:application`
# For example, in your `asgi.py` file:
# application = get_asgi_application()

