from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Item, Category

User = get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'username', 'email', 'profile_picture', 'location']

class ItemSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)  
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True,                       # Important for ManyToMany
        queryset=Category.objects.all(),
        write_only=True,
        source='categories',             # map to model's categories field
        required=False,
        allow_null=True
    )

    class Meta:
        model = Item
        fields = [
            'id',
            'user',
            'title',
            'description',
            'categories',  
            'category_ids',
            'tags',
            'images',
            'status',
            'created_at',
        ]