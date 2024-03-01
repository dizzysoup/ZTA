from django.urls import path 
from .views import ScoreViewSet

urlpatterns = [    
    path('score/',ScoreViewSet.as_view(),name='score')
]
