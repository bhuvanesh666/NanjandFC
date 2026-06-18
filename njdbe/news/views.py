from rest_framework import viewsets
from .models import News
from .serializers import NewsSerializer
from accounts.permissions import IsAdminOrReadOnly


class NewsViewSet(viewsets.ModelViewSet):
    """Public read, admin write."""
    queryset = News.objects.all().order_by('-date')
    serializer_class = NewsSerializer
    permission_classes = [IsAdminOrReadOnly]
