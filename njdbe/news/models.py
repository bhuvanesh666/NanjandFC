from django.db import models

class News(models.Model):
    title   = models.CharField(max_length=200)
    content = models.TextField()
    image   = models.ImageField(upload_to='news/', blank=True, null=True)
    date    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
