from rest_framework import serializers
from .models import Match
# In matches/serializers.py
from users.serializers import UserSerializer
from items.serializers import ItemSerializer

class MatchSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)
    item1 = ItemSerializer(read_only=True)
    item2 = ItemSerializer(read_only=True)
    offer_id = serializers.UUIDField(source='offer.id', read_only=True)
    
    # ADDED
    user1_confirmed = serializers.BooleanField(read_only=True)
    user2_confirmed = serializers.BooleanField(read_only=True)
    is_traded = serializers.BooleanField(read_only=True)

    # ADDED
    class Meta:
        model = Match
        fields = [
            'id', 'user1', 'user2',
            'item1', 'item2', 'offer_id',
            'user1_confirmed', 'user2_confirmed', 'is_traded', 
            'created_at'
        ]

# ADDED

from rest_framework import serializers
from .models import UserRating
from django.db import transaction

class UserRatingSerializer(serializers.ModelSerializer):
    rater = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = UserRating
        fields = ['rater', 'rated_user', 'match', 'rating']

    def validate(self, data):
        rater = self.context['request'].user
        rated_user = data.get('rated_user')
        if rater == rated_user:
            raise serializers.ValidationError("You cannot rate yourself.")
        return data

    @transaction.atomic
    def create(self, validated_data):
        # Check if rating already exists for this rater, rated_user, and match
        rater = validated_data['rater']
        rated_user = validated_data['rated_user']
        match = validated_data['match']

        existing = UserRating.objects.filter(rater=rater, rated_user=rated_user, match=match).first()
        if existing:
            # Update the existing rating instead of creating a new one
            existing.rating = validated_data['rating']
            existing.save()
            self._update_user_aggregate(rated_user)
            return existing
        else:
            # Create new rating
            rating = super().create(validated_data)
            self._update_user_aggregate(rated_user)
            return rating

    @transaction.atomic
    def update(self, instance, validated_data):
        instance.rating = validated_data.get('rating', instance.rating)
        instance.save()
        self._update_user_aggregate(instance.rated_user)
        return instance

    def _update_user_aggregate(self, user):
        # Recalculate total_rating and rating_count
        ratings = UserRating.objects.filter(rated_user=user)
        total = sum(r.rating for r in ratings)
        count = ratings.count()

        user.total_rating = total
        user.rating_count = count
        user.save(update_fields=['total_rating', 'rating_count'])
