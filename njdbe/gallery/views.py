from rest_framework import viewsets
from .models import GalleryAlbum, GalleryImage
from .serializers import GalleryAlbumSerializer, GalleryImageSerializer
from accounts.permissions import IsAdminOrReadOnly


class GalleryAlbumViewSet(viewsets.ModelViewSet):
    """Public read, admin write. ?year=2024 to filter albums."""
    queryset = GalleryAlbum.objects.all().order_by('-year')
    serializer_class = GalleryAlbumSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        year = self.request.query_params.get('year')
        if year:
            qs = qs.filter(year=year)
        return qs


class GalleryImageViewSet(viewsets.ModelViewSet):
    """Upload/delete images. ?album=<id> to filter."""
    queryset = GalleryImage.objects.all().order_by('-uploaded_at')
    serializer_class = GalleryImageSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        album_id = self.request.query_params.get('album')
        if album_id:
            qs = qs.filter(album_id=album_id)
        return qs
