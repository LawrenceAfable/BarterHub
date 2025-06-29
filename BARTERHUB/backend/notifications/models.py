# notifications/models.py
from django.db import models
from django.conf import settings

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="sent_notifications")
    type = models.CharField(max_length=255)  # Type of notification (e.g., 'offer_accepted', 'new_message', 'offer_rejected')
    content = models.TextField()  # Content of the notification
    seen = models.BooleanField(default=False)  # Whether the notification has been seen
    created_at = models.DateTimeField(auto_now_add=True)  # When the notification was created

    def __str__(self):
        return f"Notification for {self.user.username} - {self.type}"
