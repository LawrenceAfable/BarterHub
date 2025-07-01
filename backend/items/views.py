from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes  # === Added ML
from rest_framework.response import Response                      # === Added ML
from rest_framework.permissions import IsAuthenticated            # === Added ML
from sklearn.feature_extraction.text import TfidfVectorizer       # === Added ML
from sklearn.metrics.pairwise import cosine_similarity            # === Added ML

from .models import *
from .serializers import *
from .utils import get_available_items_for_user, skip_item, unskip_item  # === Added

class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # return Item.objects.filter(user=self.request.user)
        return Item.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class MyItemsViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(user=self.request.user)
 
class CategoryViewSet(viewsets.ModelViewSet):  
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # return Category.objects.filter(items__user=self.request.user).distinct()
        return Category.objects.all() 


# === New API Endpoints for Skip Mechanism ===
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def skip_item_view(request, item_id):
    """
    Endpoint to mark an item as skipped by current user.
    """
    try:
        item = Item.objects.get(id=item_id, status='active')
    except Item.DoesNotExist:
        return Response({"detail": "Item not found."}, status=404)
    
    skip_item(request.user, item)  # Call utils.py function to record skip
    return Response({"detail": "Item skipped successfully."})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unskip_item_view(request, item_id):
    """
    Endpoint to remove an item from skip list, so it can appear immediately.
    """
    try:
        item = Item.objects.get(id=item_id, status='active')
    except Item.DoesNotExist:
        return Response({"detail": "Item not found."}, status=404)
    
    unskip_item(request.user, item)  # Call utils.py function to remove skip
    return Response({"detail": "Item unskipped successfully."})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def available_items_view(request):
    """
    Returns active items excluding those skipped recently by the user.
    """
    items = get_available_items_for_user(request.user)  # Call utils.py filter
    serializer = ItemSerializer(items, many=True, context={'request': request})
    return Response(serializer.data)


# ML SUGGESTED ITEM views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def suggested_items(request):
    """
    Returns top 5 suggested items based on text similarity between
    current user's latest item and other users' active items.
    Uses TF-IDF + Cosine Similarity on title, tags, and categories.
    """
    user = request.user
    my_items = Item.objects.filter(user=user, status='active')

    if not my_items.exists():
        return Response([])

    my_item = my_items.last()  # Use latest active item

    # === ML ITEMS
    # other_items = Item.objects.exclude(user=user).filter(status='active')
    
    # === SKIPPED ITEMS
    other_items = get_available_items_for_user(user).exclude(user=user)
    
    # HEKLP TO KNOW IF AN ITEM EXIST (not skipped yet)
    if not other_items.exists():
        return Response([])

    # Helper: convert item to a simple string for vectorization
    def item_to_text(item):
        tags = ' '.join(item.tags or [])
        categories = ' '.join(cat.name for cat in item.categories.all())
        return f"{item.title} {tags} {categories}"

    my_text = item_to_text(my_item)
    others_text = [item_to_text(item) for item in other_items]

    # Run TF-IDF + cosine similarity
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([my_text] + others_text)
    similarities = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    # Pair items with similarity scores
    scored = list(zip(other_items, similarities))
    scored.sort(key=lambda x: x[1], reverse=True)

    top_items = [item for item, score in scored[:5]]  # Take top 5
    serialized = ItemSerializer(top_items, many=True, context={'request': request})

    return Response(serialized.data)



