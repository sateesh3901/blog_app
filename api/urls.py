from django.urls import path
from . import views 


urlpatterns = [
    # auth apis
    path('api/auth/register/', views.register),
    path('api/auth/login/', views.login),

    #admin apis
    path('api/admin/users/', views.admin_users),
    path('api/admin/users/<int:id>/role/', views.update_user_role),
    path('api/admin/posts/pending/', views.pending_posts),           
    path('api/admin/posts/<int:id>/status/', views.update_post_status),  
    path('api/admin/posts/<int:id>/', views.delete_post),          
    
    # author apis
    path('api/posts/', views.PostView.as_view()),
    path('api/posts/<int:id>/', views.PostView.as_view()), 
    path('api/posts/my-posts/', views.MyPostsView.as_view()),

    # public apis
    path('api/public/posts/', views.PublicPostView.as_view()),
    path('api/public/posts/<int:id>/', views.PublicPostView.as_view()),
]