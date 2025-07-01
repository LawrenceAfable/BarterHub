from django.apps import AppConfig


class OffersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'offers'
    
    # ADDED FOR NOTIF
    # ALSO THE SIGNALS
    def ready(self):
        import offers.signals  # Import signal
