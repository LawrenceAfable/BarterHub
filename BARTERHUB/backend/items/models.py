import uuid
from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Item(models.Model):
    STATUS_CHOICES = [
        # ('active', 'Active'),
        # ('traded', 'Traded'),
        ('active', 'Active'),
        ('matched', 'Matched'),
        ('traded', 'Traded'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    categories = models.ManyToManyField(Category, blank=True, related_name="items")
    tags = models.JSONField(default=list, blank=True)  # simple list of tags
    images = models.JSONField(default=list, blank=True)  # list of image URLs or paths
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.user.email})"

# new
class Skip(models.Model):
    # Tracks which items a user has skipped and when
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='skips')
    skipped_item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='skipped_by')
    skipped_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'skipped_item')  # prevent duplicate skip records

    def __str__(self):
        return f"{self.user} skipped {self.skipped_item} at {self.skipped_at}"