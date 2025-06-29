import uuid
from django.db import models
from django.conf import settings
from items.models import Item
from offers.models import Offer

class Match(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # The two users involved
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='matches_as_user1')
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='matches_as_user2')

    # The items that were matched (you can also track the offer if needed)
    item1 = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='matches_as_item1')
    item2 = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='matches_as_item2')

    offer = models.OneToOneField(Offer, on_delete=models.CASCADE, related_name='match')
    
    status = models.CharField(
        max_length=10,
        choices=[('active', 'Active'), ('inactive', 'Inactive')],
        default='active'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    
    # === ADDED ===
    user1_confirmed = models.BooleanField(default=False)
    user2_confirmed = models.BooleanField(default=False)
    is_traded = models.BooleanField(default=False)
    # 

    class Meta:
        unique_together = (('user1', 'user2', 'item1', 'item2'),)

    def __str__(self):
        return f"Match between {self.user1.email} and {self.user2.email}"
    
    # ADDED
    def check_and_finalize_trade(self):
        if self.user1_confirmed and self.user2_confirmed and not self.is_traded:
            self.item1.status = 'traded'
            self.item2.status = 'traded'
            self.item1.save()
            self.item2.save()
            self.is_traded = True
            self.save()
    # 

# ADDED
class UserRating(models.Model):
    rater = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='given_ratings')
    rated_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_ratings')
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='ratings')
    rating = models.PositiveIntegerField()  # between 1-5
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('rater', 'rated_user', 'match')