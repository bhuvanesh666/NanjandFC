from rest_framework import serializers
from .models import GalleryAlbum, GalleryImage

class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = GalleryImage
        fields = ['id', 'album', 'image', 'caption', 'uploaded_at']
        read_only_fields = ['uploaded_at']

class GalleryAlbumSerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(many=True, read_only=True)
    class Meta:
        model  = GalleryAlbum
        fields = ['id', 'title', 'year', 'description', 'images']
