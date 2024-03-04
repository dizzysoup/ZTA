from django.urls import path 
from .views import ScoreViewSet,VerifyViewSet,PublickKeyViewSet

urlpatterns = [    
    path('score/',ScoreViewSet.as_view(),name='score'),
    path('verify/',VerifyViewSet.as_view(),name='verify'),
    path('publickey/',PublickKeyViewSet.as_view(),name='publickey')
]
