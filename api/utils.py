import bcrypt,jwt,datetime
from django.conf import settings
from datetime import timedelta,datetime
from django.http import JsonResponse

def hash_password(input_password):
    if input_password:
        input_password = input_password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(input_password,salt).decode('utf-8')
        return hashed_password


def check_password(input_password,db_password):
    if bcrypt.checkpw(input_password.encode('utf-8'),db_password.encode('utf-8')):
        return True
    return False


def generate_jwt(user):
    payload = {
        "email": user.email,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(minutes=60),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


class TokenError(Exception):
    pass


def get_role_from_token(token):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=['HS256']
        )
    except jwt.ExpiredSignatureError:
        raise TokenError("TOKEN_EXPIRED")
    except jwt.InvalidTokenError:
        raise TokenError("INVALID_TOKEN")

    role = payload.get("role")
    if not role:
        raise TokenError("ROLE_MISSING")
    print(role)
    return role


def admin_required(request):
    if request.role != "ADMIN":
        return JsonResponse(
            {"error": "ADMIN_ONLY"},
            status=403
        )
    return None







