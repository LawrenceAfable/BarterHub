from rest_framework import viewsets, permissions
from .models import Match
from .serializers import MatchSerializer
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.response import Response

# class MatchViewSet(viewsets.ReadOnlyModelViewSet):
class MatchViewSet(viewsets.ModelViewSet):
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Match.objects.filter(
            Q(user1=user) | Q(user2=user),
            status='active'
        )
        
    #  ADDED
    @action(detail=True, methods=['patch'], url_path='confirm-trade')
    def confirm_trade(self, request, pk=None):
        match = self.get_object()
        user = request.user

        if match.user1 == user:
            match.user1_confirmed = True
        elif match.user2 == user:
            match.user2_confirmed = True
        else:
            return Response({'detail': 'You are not part of this match.'}, status=status.HTTP_403_FORBIDDEN)

        if match.user1_confirmed and match.user2_confirmed:
            match.is_traded = True
            
        # ADDED
         # Update the status of the two items involved in the match
        match.item1.status = 'traded'
        match.item1.save()

        match.item2.status = 'traded'
        match.item2.save()

        match.save()
        return Response(MatchSerializer(match).data)

# ADDED
from .models import UserRating
from .serializers import UserRatingSerializer

class UserRatingViewSet(viewsets.ModelViewSet):
    queryset = UserRating.objects.all()
    serializer_class = UserRatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(rater=self.request.user)

      
