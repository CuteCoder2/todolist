from django.urls import path
from . views import TodoView

urlpatterns = [
path(route='todo' , view=TodoView.as_view())    
]
