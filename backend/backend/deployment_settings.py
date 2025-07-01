import os
import dj_database_url
from .settings import BASE_DIR  # Import base directory from your settings for static files, etc.

# -- Production-Specific Settings --
# Dynamically set ALLOWED_HOSTS based on Render's environment variable
ALLOWED_HOSTS = [os.environ.get('RENDER_EXTERNAL_HOSTNAME', 'your-default-domain.com')]

# CSRF trusted origins for your domain (important for production security)
CSRF_TRUSTED_ORIGINS = ['https://' + os.environ.get('RENDER_EXTERNAL_HOSTNAME', 'your-default-domain.com')]

# Set DEBUG to False for production
DEBUG = False

# Ensure SECRET_KEY is securely set in the environment variables for production
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-default-secret-key')  # Set this in your deployment environment

# Static files settings for production (using Whitenoise for static file management)
STATIC_URL = '/static/'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Path where static files are collected
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]  # Additional directories to look for static files

# Database configuration (using DATABASE_URL for dynamic database setup in production)
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),  # This is typically set in your environment (e.g., Render)
        conn_max_age=600  # Set the connection lifetime to 10 minutes for DB connections
    )
}

# Middleware settings (for production)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Middleware to serve static files in production
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Handle cross-origin requests (optional, depending on your use case)
]

# Set up proper security settings (ensure you're securing your app in production)
SECURE_SSL_REDIRECT = True  # Redirect HTTP to HTTPS
SECURE_HSTS_SECONDS = 3600  # HTTP Strict Transport Security (HSTS) for 1 hour (recommended for production)
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
CSRF_COOKIE_SECURE = True  # Ensure CSRF cookie is only sent over HTTPS
SESSION_COOKIE_SECURE = True  # Ensure session cookie is only sent over HTTPS

# Optionally, set up your logging configurations (to track errors in production)
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'ERROR',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}

# -- Optional Production Settings --
# Enable caching (optional, if using a cache system like Redis, Memcached, etc.)
# CACHES = {
#     'default': {
#         'BACKEND': 'django_redis.cache.RedisCache',
#         'LOCATION': 'redis://127.0.0.1:6379/1',  # Example Redis config
#         'OPTIONS': {
#             'CLIENT_CLASS': 'django_redis.client.DefaultClient',
#         }
#     }
# }
