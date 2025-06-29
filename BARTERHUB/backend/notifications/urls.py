# notifications/urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification_list'),
    path('notifications/<uuid:pk>/mark_as_seen/', MarkNotificationAsSeenView.as_view(), name='mark_notification_as_seen'),
    path('notifications/clear/', NotificationListView.as_view(), name='clear_notifications'),
    
]
