# messaging/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Message
from notifications.models import Notification  

@receiver(post_save, sender=Message)
def create_new_message_notification(sender, instance, created, **kwargs):
    if created:  # Only create notification for new messages
        receiver = instance.match.user1 if instance.sender != instance.match.user1 else instance.match.user2
        sender = instance.sender
        
        # Content of the notification
        content = f"You’ve received a new message from {sender.email}"
        
        # Create the notification for the receiver
        Notification.objects.create(
            user=receiver,  # Notify the receiver
            type='new_message',
            content=content,
            seen=False
        )
