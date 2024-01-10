from django.db import models

# Create your models here.
class Mechine(models.Model):
    name = models.TextField()
    member = models.TextField()
    last_modify_date = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "Mechine"