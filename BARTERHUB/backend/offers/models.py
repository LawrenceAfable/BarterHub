import uuid
from django.db import models
from django.conf import settings
from items.models import Item

class Offer(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    offered_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='offers_made')
    wanted_item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='offers_received')
    offered_item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='offers_given')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Offer {self.id} by {self.offered_by.email} for {self.wanted_item.title}"
