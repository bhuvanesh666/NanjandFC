from django.db import models

class GalleryAlbum(models.Model):
    title       = models.CharField(max_length=150)
    year        = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    def __str__(self): return self.title

class GalleryImage(models.Model):
    album      = models.ForeignKey(GalleryAlbum, on_delete=models.CASCADE, related_name='images')
    image      = models.ImageField(upload_to='gallery/')
    caption    = models.CharField(max_length=200, blank=True)
    uploaded_at= models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"{self.album.title} - {self.id}"
