from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MatchViewSet, UserRatingViewSet

router = DefaultRouter()
router.register(r'matches', MatchViewSet, basename='match')
router.register('ratings', UserRatingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
