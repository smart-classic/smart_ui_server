"""
SMART Connect token store
"""
from django.db import models
from django.conf import settings
import urllib
import datetime


class SmartConnectToken(models.Model):
    """
    SMART Connect Token + Secret, scoped to a django session
    """

    session_key = models.CharField(max_length=40)
    smart_connect_token = models.CharField(max_length=40, primary_key=True)
    smart_connect_secret = models.CharField(max_length=40)

