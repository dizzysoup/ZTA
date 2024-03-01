from django.db import models
from django.conf import settings



class Score(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} Score : {self.points} points"
    class Meta :
        db_table = "score_t"