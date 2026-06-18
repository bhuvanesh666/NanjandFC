from django.db import models
from django.conf import settings


class PlayerProfile(models.Model):
    POSITION_CHOICES = (
        ('GK', 'Goalkeeper'),
        ('DEF', 'Defender'),
        ('MID', 'Midfielder'),
        ('FWD', 'Forward'),
    )
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='player_profile')
    photo = models.ImageField(upload_to='players/photos/', blank=True, null=True)
    position = models.CharField(max_length=3, choices=POSITION_CHOICES, default='MID')
    jersey_number = models.PositiveIntegerField(default=0)
    dob = models.DateField(blank=True, null=True)
    bio = models.TextField(blank=True)

    # Stats
    goals = models.PositiveIntegerField(default=0)
    assists = models.PositiveIntegerField(default=0)
    matches_played = models.PositiveIntegerField(default=0)
    yellow_cards = models.PositiveIntegerField(default=0)
    red_cards = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} (#{self.jersey_number})"


class PlayerDocument(models.Model):
    DOC_CHOICES = (
        ('aadhar', 'Aadhar Card'),
        ('pan', 'PAN Card'),
        ('license', 'Driving License'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    )
    player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE, related_name='documents')
    doc_type = models.CharField(max_length=10, choices=DOC_CHOICES)
    file = models.FileField(upload_to='players/documents/')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player.user.username} - {self.get_doc_type_display()}"
