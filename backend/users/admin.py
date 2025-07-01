from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User  # Import your custom User model

# Define a custom UserAdmin class
class CustomUserAdmin(UserAdmin):
    # Specify which fields to display in the admin list
    list_display = ('email', 'username', 'name', 'is_active', 'is_staff', 'verified', 'points', 'energy', 'location')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'verified')
    search_fields = ('email', 'username', 'name')
    ordering = ('email',)

    # Define which fields can be used for searching and filtering
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name', 'username', 'phone', 'profile_picture', 'location')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'verified')}),
        ('Important Dates', {'fields': ('last_login', 'created_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'name', 'username', 'is_active', 'is_staff', 'is_superuser'),
        }),
    )

    # Use the property for average rating if needed
    def average_rating(self, obj):
        return obj.average_rating
    average_rating.short_description = 'Average Rating'  # Display name for the column

    # Add the average rating to the list display if necessary
    list_display = ('email', 'username', 'average_rating', 'is_active', 'is_staff', 'verified', 'points', 'energy')

# Register your custom user model with the custom UserAdmin
admin.site.register(User, CustomUserAdmin)
