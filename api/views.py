from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.permissions import IsAuthenticated,AllowAny
from .permissions import IsAdmin
from rest_framework.decorators import api_view,permission_classes
from .models import User,Post
from .serializers import UserSerializer,PostSerializer
from django.http import JsonResponse
from .utils import hash_password,check_password,generate_jwt
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

# Create your views here.
@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def register(request):
    data = json.loads(request.body)
    if 'password' not in data:
        return JsonResponse({"error": "Password is required"}, status=400)

    data['password'] = hash_password(data['password'])

    sr = UserSerializer(data=data)
    if sr.is_valid():
        user = sr.save()
        return JsonResponse(
            {"message": "User registered successfully",
             "user": {
                 "id": user.id,
                 "name": user.name,
                 "email": user.email,
                 "role": user.role
             }},
            status=201
        )

    return JsonResponse(sr.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def login(request):
    data = json.loads(request.body)

    try:
        user = User.objects.get(email=data['email'])
    except User.DoesNotExist:
        return JsonResponse(
            {"error": "Invalid email or password"},
            status=401
        )

    if not check_password(data['password'], user.password):
        return JsonResponse(
            {"error": "Invalid email or password"},
            status=401
        )

    token = generate_jwt(user)
    
    return JsonResponse({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_users(request):
    users = User.objects.all()
    sr = UserSerializer(users, many = True)
    return JsonResponse(sr.data, safe=False)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdmin])
def update_user_role(request, id):
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return JsonResponse(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    role = request.data.get('role')

    if role not in ['ADMIN', 'AUTHOR']:
        return JsonResponse(
            {"error": "Invalid role"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.role = role
    user.save()

    return JsonResponse(
        {
            "message": "Role updated successfully",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def pending_posts(request):
    posts = Post.objects.filter(status=Post.Status.PENDING).order_by('-created_at')

    paginator = PageNumberPagination()
    paginator.page_size = 5
    result_page = paginator.paginate_queryset(posts, request)

    serializer = PostSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)



@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdmin])
def update_post_status(request, id):
    try:
        post = Post.objects.get(id=id)
    except Post.DoesNotExist:
        return JsonResponse(
            {"error": "Post not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    new_status = request.data.get('status')

    if new_status not in [
        Post.Status.APPROVED,
        Post.Status.REJECTED
    ]:
        return JsonResponse(
            {"error": "Invalid status"},
            status=status.HTTP_400_BAD_REQUEST
        )

    post.status = new_status
    post.save()

    return JsonResponse(
        {
            "message": "Post status updated successfully",
            "post": {
                "id": post.id,
                "title": post.title,
                "status": post.status
            }
        },
        status=status.HTTP_200_OK
    )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdmin])
def delete_post(request, id):
    try:
        post = Post.objects.get(id=id)
    except Post.DoesNotExist:
        return JsonResponse(
            {"error": "Post not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    post.delete()

    return JsonResponse(
        {"message": "Post deleted successfully"},
        status=status.HTTP_200_OK
    )



class PostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['status'] = Post.Status.PENDING

        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            post = serializer.save(author=request.user) 

            return JsonResponse(
                {
                    "message": "Post created and pending approval",
                    "post": {
                        "id": post.id,
                        "name": post.author.name,
                        "title": post.title,
                        "status": post.status
                    }
                },
                status=status.HTTP_201_CREATED
            )

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request, id):
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse(
                {"error": "Post not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if post.author != request.user and request.user.role != 'ADMIN':
            return JsonResponse(
                {"error": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = PostSerializer(post)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse(
                {"error": "Post not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if post.author != request.user:
            return JsonResponse(
                {"error": "You can edit only your own post"},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()
        data.pop('author', None)

        serializer = PostSerializer(post, data=data, partial=True)
        if serializer.is_valid():
            post = serializer.save(status=Post.Status.PENDING)

            return JsonResponse(
                {
                    "message": "Post updated and sent for re-approval",
                    "post": {
                        "id": post.id,
                        "title": post.title,
                        "status": post.status
                    }
                },
                status=status.HTTP_200_OK
            )

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, id):
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse(
                {"error": "Post not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if post.author != request.user:
            return JsonResponse(
                {"error": "You can delete only your own post"},
                status=status.HTTP_403_FORBIDDEN
            )

        post.delete()
        return JsonResponse(
            {"message": "Post deleted successfully"},
            status=status.HTTP_200_OK
        )
    


class MyPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.filter(author=request.user).order_by('-created_at')

        paginator = PageNumberPagination()
        paginator.page_size = 5
        result_page = paginator.paginate_queryset(posts, request)

        serializer = PostSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)



class PublicPostView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id=None):
        if id:
            try:
                post = Post.objects.get(
                    id=id,
                    status=Post.Status.APPROVED
                )
            except Post.DoesNotExist:
                return JsonResponse(
                    {"error": "Post not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = PostSerializer(post)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)

        posts = Post.objects.filter(status=Post.Status.APPROVED)
        serializer = PostSerializer(posts, many=True)

        return JsonResponse(
            serializer.data,
            safe=False,
            status=status.HTTP_200_OK
        )



