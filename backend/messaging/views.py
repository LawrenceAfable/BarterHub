from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer
from matches.models import Match
from django.db.models import Q

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            match__in=Match.objects.filter(
                Q(user1=user) | Q(user2=user),
                status='active'
            )
        )


    def perform_create(self, serializer):
        match_id = serializer.validated_data['match'].id
        match = Match.objects.get(id=match_id)

        # Ensure the sender is part of this match
        if self.request.user not in [match.user1, match.user2] or match.status != 'active':
            raise PermissionDenied('Invalid match access or inactive match.')

        serializer.save(sender=self.request.user)
        
        
