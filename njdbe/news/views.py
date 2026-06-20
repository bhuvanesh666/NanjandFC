from rest_framework import viewsets
from .models import News
from .serializers import NewsSerializer
from accounts.permissions import IsAdminOrReadOnly

class NewsViewSet(viewsets.ModelViewSet):
    serializer_class   = NewsSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = News.objects.all().order_by('-date')
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(title__icontains=search)
        return queryset
