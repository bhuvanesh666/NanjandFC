from django.contrib import admin
from .models import GalleryAlbum, GalleryImage

class GalleryImageInline(admin.TabularInline):
    model = GalleryImage
    extra = 0

@admin.register(GalleryAlbum)
class GalleryAlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'year')
    inlines      = [GalleryImageInline]

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('album', 'caption', 'uploaded_at')
