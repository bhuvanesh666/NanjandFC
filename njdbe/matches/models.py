from django.db import models
from django.conf import settings

class Match(models.Model):
    STATUS = (('upcoming','Upcoming'),('played','Played'))
    opponent    = models.CharField(max_length=100)
    date        = models.DateTimeField()
    venue       = models.CharField(max_length=150)
    competition = models.CharField(max_length=100, blank=True)
    status      = models.CharField(max_length=10, choices=STATUS, default='upcoming')
    def __str__(self): return f"vs {self.opponent}"

class MatchSummary(models.Model):
    match           = models.OneToOneField(Match, on_delete=models.CASCADE, related_name='summary')
    home_score      = models.PositiveIntegerField(default=0)
    away_score      = models.PositiveIntegerField(default=0)
    scorers         = models.JSONField(default=list, blank=True)
    assists         = models.JSONField(default=list, blank=True)
    yellow_cards    = models.JSONField(default=list, blank=True)
    red_cards       = models.JSONField(default=list, blank=True)
    substitutions   = models.JSONField(default=list, blank=True)
    possession      = models.PositiveIntegerField(default=50)
    shots_on_target = models.PositiveIntegerField(default=0)
    fouls           = models.PositiveIntegerField(default=0)
    man_of_the_match= models.CharField(max_length=100, blank=True)
    def __str__(self): return f"Summary - {self.match}"

class MatchPhoto(models.Model):
    match       = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='photos')
    image       = models.ImageField(upload_to='matches/photos/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
