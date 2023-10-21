from django.db import models
from django.utils.translation import gettext_lazy as _
# Create your models here.
class Todo(models.Model):
    STATUS = (
        ('pen',_('pending')),
        ('wat',_('watched')),
    )
    status = models.CharField(max_length=5,choices=STATUS , default=STATUS[0])
    name = models.CharField(max_length=100)