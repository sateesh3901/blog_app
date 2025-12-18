from django.db import models

# Create your models here.
class User(models.Model):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        AUTHOR = 'AUTHOR', 'Author'
        VIEWER = 'Viewer', 'Viewer'
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(choices=Role.choices,default=Role.AUTHOR,max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_authenticated(self):
        return True


class Post(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        APPROVED = 'APPROVED', 'approved'
        REJECTED = 'REJECTED', 'rejected'
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(User,on_delete=models.CASCADE)
    status = models.CharField(max_length=10,choices=Status.choices,default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)