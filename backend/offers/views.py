from rest_framework import viewsets, permissions, serializers
from .models import Offer
from .serializers import OfferSerializer
from django.db import models, transaction

from matches.models import Match
from matches.utils import get_or_create_match 

class OfferViewSet(viewsets.ModelViewSet):
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Offer.objects.filter(
            models.Q(offered_by=user) | models.Q(wanted_item__user=user)
        )

    def perform_create(self, serializer):
        serializer.save(offered_by=self.request.user)

    def update(self, request, *args, **kwargs):
        offer = self.get_object()
        old_status = offer.status

        response = super().update(request, *args, **kwargs)

        # Refresh offer instance to get the updated status
        offer.refresh_from_db()
        new_status = offer.status

        with transaction.atomic():
            if old_status != 'accepted' and new_status == 'accepted':
                # Update item statuses
                offer.wanted_item.status = 'matched'
                offer.wanted_item.save()
                offer.offered_item.status = 'matched'
                offer.offered_item.save()
                
                # Reuse or create match
                get_or_create_match(
                    user1=offer.offered_by,
                    user2=offer.wanted_item.user,
                    item1=offer.offered_item,
                    item2=offer.wanted_item,
                    offer=offer
                )

                # Create match only if it doesn't exist
                # if not Match.objects.filter(offer=offer).exists():
                #     Match.objects.create(
                #         user1=offer.offered_by,
                #         user2=offer.wanted_item.user,
                #         item1=offer.offered_item,
                #         item2=offer.wanted_item,
                #         offer=offer,
                #         status='active'
                #     )

            elif old_status == 'accepted' and new_status in ['cancelled', 'rejected']:
                # Revert item status to 'active'
                offer.wanted_item.status = 'active'
                offer.wanted_item.save()
                offer.offered_item.status = 'active'
                offer.offered_item.save()

                # Mark related match as inactive
                match = Match.objects.filter(offer=offer).first()
                if match:
                    match.status = 'inactive'
                    match.save()

        return response

    def validate(self, data):
        offered = data.get("offered_item")
        wanted = data.get("wanted_item")

        if offered.status != "active":
            raise serializers.ValidationError(
                {"offered_item_id": "This item is not available for offers."}
            )
        if wanted.status != "active":
            raise serializers.ValidationError(
                {"wanted_item_id": "Target item is not available for offers."}
            )

        return data
