# matches/utils.py
from django.db.models import Q
from .models import Match

def get_or_create_match(user1, user2, item1, item2, offer):
    # Look for an existing inactive match between the two users
    match = Match.objects.filter(
        Q(user1=user1, user2=user2) | Q(user1=user2, user2=user1),
        status='inactive'
    ).first()

    if match:
        # Reactivate and update it
        match.item1 = item1
        match.item2 = item2
        match.offer = offer
        match.status = 'active'
        match.save()
        return match, False  # Not newly created
    else:
        # Create a new match
        return Match.objects.create(
            user1=user1,
            user2=user2,
            item1=item1,
            item2=item2,
            offer=offer,
            status='active'
        ), True
