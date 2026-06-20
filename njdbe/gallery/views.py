from rest_framework import viewsets
from .models import GalleryAlbum, GalleryImage
from .serializers import GalleryAlbumSerializer, GalleryImageSerializer
from accounts.permissions import IsAdminOrReadOnly

class GalleryAlbumViewSet(viewsets.ModelViewSet):
    serializer_class   = GalleryAlbumSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs   = GalleryAlbum.objects.all().prefetch_related('images').order_by('-year', '-id')
        year = self.request.query_params.get('year')
        search = self.request.query_params.get('search')
        if year:
            qs = qs.filter(year=year)
        if search:
            qs = qs.filter(title__icontains=search)
        return qs

class GalleryImageViewSet(viewsets.ModelViewSet):
    serializer_class   = GalleryImageSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs       = GalleryImage.objects.select_related('album').all().order_by('-uploaded_at')
        album_id = self.request.query_params.get('album')
        if album_id:
            qs = qs.filter(album_id=album_id)
        return qs
    
    