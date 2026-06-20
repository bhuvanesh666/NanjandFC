from django.db import models
from django.conf import settings

class PlayerProfile(models.Model):
    POSITIONS = (('GK','Goalkeeper'),('DEF','Defender'),('MID','Midfielder'),('FWD','Forward'))
    user          = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    photo         = models.ImageField(upload_to='players/photos/', blank=True, null=True)
    position      = models.CharField(max_length=3, choices=POSITIONS, default='MID')
    jersey_number = models.PositiveIntegerField(default=0)
    dob           = models.DateField(null=True, blank=True)
    bio           = models.TextField(blank=True)
    goals         = models.PositiveIntegerField(default=0)
    assists       = models.PositiveIntegerField(default=0)
    matches_played= models.PositiveIntegerField(default=0)
    yellow_cards  = models.PositiveIntegerField(default=0)
    red_cards     = models.PositiveIntegerField(default=0)
    def __str__(self): return f"{self.user.username} (#{self.jersey_number})"

class PlayerDocument(models.Model):
    DOC_TYPES = (('aadhar','Aadhar Card'),('pan','PAN Card'),('license','Driving License'))
    STATUS    = (('pending','Pending'),('verified','Verified'),('rejected','Rejected'))
    player     = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE, related_name='documents')
    doc_type   = models.CharField(max_length=10, choices=DOC_TYPES)
    file       = models.FileField(upload_to='players/documents/')
    status     = models.CharField(max_length=10, choices=STATUS, default='pending')
    uploaded_at= models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"{self.player.user.username} - {self.doc_type}"
