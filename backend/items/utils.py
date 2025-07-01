# utils.py (or views.py)

from datetime import timedelta
from django.utils.timezone import now
from .models import Skip, Item
from django.conf import settings

def get_available_items_for_user(user):
    """
    Returns items that are active and not skipped by the user
    within the cooldown period.
    """
    cooldown_threshold = now() - timedelta(days=settings.SKIP_COOLDOWN_DAYS)
    skipped_recently = Skip.objects.filter(
        user=user,
        skipped_at__gte=cooldown_threshold
    ).values_list('skipped_item_id', flat=True)

    # Exclude recently skipped items
    items = Item.objects.filter(status='active').exclude(id__in=skipped_recently)
    return items


def skip_item(user, item):
    """
    Mark an item as skipped by a user.
    If already skipped, update the timestamp to reset cooldown.
    """
    skip, created = Skip.objects.get_or_create(user=user, skipped_item=item)
    if not created:
        skip.skipped_at = now()
        skip.save()


def unskip_item(user, item):
    """
    Remove skip record so item can show immediately again.
    """
    Skip.objects.filter(user=user, skipped_item=item).delete()
