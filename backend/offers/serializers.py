from rest_framework import serializers
from .models import Offer
from items.models import Item
from items.serializers import ItemSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'username', 'email', 'profile_picture', 'location']

class OfferSerializer(serializers.ModelSerializer):
    offered_by = UserPublicSerializer(read_only=True)
    wanted_item = ItemSerializer(read_only=True)
    offered_item = ItemSerializer(read_only=True)

    wanted_item_id = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.filter(status='active'),
        source='wanted_item',
        write_only=True
    )
    offered_item_id = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.filter(status='active'),
        source='offered_item',
        write_only=True
    )
    
    class Meta:
        model = Offer
        fields = [
            'id',
            'offered_by',
            'wanted_item',
            'offered_item',
            'wanted_item_id',
            'offered_item_id',
            'status',
            'created_at',
            'updated_at',
        ]

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['offered_by'] = user
        return super().create(validated_data)


