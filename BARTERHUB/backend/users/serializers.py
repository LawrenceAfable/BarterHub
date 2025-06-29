from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    # profile_picture = serializers.SerializerMethodField()
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    # Added
    # average_rating = serializers.FloatField(source='average_rating', read_only=True)
    average_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'name', 'password', 'location', 'profile_picture', 'average_rating')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
    def get_profile_picture(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)
        instance.save()
        return instance
