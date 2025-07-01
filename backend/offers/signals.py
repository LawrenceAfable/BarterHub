# offers/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Offer
from notifications.models import Notification  # Assuming Notification model is in a separate app

@receiver(post_save, sender=Offer)
def create_offer_rejection_notification(sender, instance, created, **kwargs):
  
     # Check if the offer status is updated to 'accepted'
    if instance.status == 'accepted':
        # Offerer is the user who created the offer
        offerer = instance.offered_by
        wanted_item = instance.wanted_item
        offered_item = instance.offered_item
        
        # Content of the notification
        content = f"Your offer to trade '{offered_item.title}' for '{wanted_item.title}' has been accepted by {instance.wanted_item.user.email}."
        
        # Create the notification for the offerer
        Notification.objects.create(
            user=offerer,  # Notify the offerer
            type='offer_accepted',
            content=content,
            seen=False
        )
  
    # Check if the offer status is updated to 'rejected'
    if instance.status == 'rejected':
        # Offerer is the user who created the offer
        offerer = instance.offered_by
        receiver = instance.wanted_item.user  # The one being offered
        
        # Content of the notification for the offerer
        content_offerer = f"Your offer to trade '{instance.offered_item.title}' for '{instance.wanted_item.title}' has been rejected by {receiver.email}."
        
        # Create the notification for the offerer
        Notification.objects.create(
            user=offerer,  # Notify the offerer
            type='offer_rejected_by_receiver',
            content=content_offerer,
            seen=False
        )
        
        # Content of the notification for the receiver
        content_receiver = f"You have rejected the offer to trade '{instance.offered_item.title}' for '{instance.wanted_item.title}' from {offerer.email}."
        
        # Create the notification for the receiver
        Notification.objects.create(
            user=receiver,  # Notify the receiver
            type='offer_rejected_by_user',
            content=content_receiver,
            seen=False
        )
