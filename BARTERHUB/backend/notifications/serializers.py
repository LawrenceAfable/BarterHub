from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'type', 'content', 'created_at', 'seen', 'profile_picture']

    def get_profile_picture(self, obj):
        # Customize this based on how your User model handles profile pictures
        user = obj.user
        if hasattr(user, 'profile') and user.profile.image:
            return user.profile.image.url
        elif hasattr(user, 'image'):
            return user.image.url
        return None
