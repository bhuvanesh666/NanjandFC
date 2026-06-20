from rest_framework.routers import DefaultRouter
from .views import GalleryAlbumViewSet, GalleryImageViewSet

router = DefaultRouter()
router.register('albums', GalleryAlbumViewSet, basename='gallery-album')
router.register('images', GalleryImageViewSet, basename='gallery-image')
urlpatterns = router.urls
