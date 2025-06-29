# notifications/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(APIView):
    def get(self, request):
        # Get all notifications for the user, ordered by created_at
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        # Delete all notifications for this user
        user = request.user
        Notification.objects.filter(user=user).delete()
        return Response({"detail": "All notifications deleted."}, status=status.HTTP_204_NO_CONTENT)

class MarkNotificationAsSeenView(APIView):
    def patch(self, request, pk):
        try:
            notification = Notification.objects.get(id=pk, user=request.user)
            notification.seen = True
            notification.save()
            return Response({"status": "read"}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
