from django.apps import AppConfig


class MessagesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'messaging'
    
    # ADDED
    # SIGNALS
    def ready(self):
        import messaging.signals  # Import signals
