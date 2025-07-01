import os
import dj_database_url
from .settings import *
from .settings import BASE_DIR

# Dynamically set ALLOWED_HOSTS
ALLOWED_HOSTS = [os.environ.get('RENDER_EXTERNAL_HOSTNAME', 'your-default-domain.com')]
CSRF_TRUSTED_ORIGINS = ['https://' + os.environ.get('RENDER_EXTERNAL_HOSTNAME', 'your-default-domain.com')]

# Django's debug mode should be turned off in production
DEBUG = False

# Ensure that your SECRET_KEY is properly set in Render
SECRET_KEY = os.environ.get('SECRET_KEY')

# Add the missing comma in the middleware list
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # <-- Fix: add missing comma here
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

# Static files settings for Whitenoise
STATIC_URL = '/static/'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Database settings (assuming DATABASE_URL is set in Render environment)
DATABASES = {
  'default': dj_database_url.config(
    default=os.environ.get('DATABASE_URL'),
    conn_max_age=600
  )
}
