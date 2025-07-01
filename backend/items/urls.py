
# items/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    ItemViewSet,
    CategoryViewSet,
    MyItemsViewSet,
    suggested_items,  
    skip_item_view,      # === Add these imports
    unskip_item_view,    # === Add these imports
    available_items_view # === Add these imports
)

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'my-items', MyItemsViewSet, basename='my-item')

urlpatterns = router.urls + [
    path('suggested-items/', suggested_items),         # ML Suggestiong endpoint
    path('<uuid:item_id>/skip/', skip_item_view),       # New skip endpoint
    path('<uuid:item_id>/unskip/', unskip_item_view),   # New unskip endpoint
    path('available/', available_items_view),            # New available items endpoint
]




