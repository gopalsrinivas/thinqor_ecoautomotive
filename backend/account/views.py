from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

# Generate Token Manually
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegistrationView(APIView):
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            token = get_tokens_for_user(user)
            response_data = {
                'token': token,
                'msg': 'Registration Success',
                'userID': user.id,
                'username': user.username,
                'email': user.email,
                'phonenumber': user.phonenumber,
                # Add any other user data you want to include here
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            # Handle validation errors and return a meaningful response
            error_response = {}

            if 'email' in e.detail and 'user with this Email already exists.' in e.detail['email'][0]:
                error_response['email'] = ['This Email already exists.']

            if 'phonenumber' in e.detail and 'user with this phonenumber already exists.' in e.detail['phonenumber'][0]:
                error_response['phonenumber'] = [
                    'This phone number already exists.']

            return Response({'error': error_response}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Handle unexpected errors gracefully and log them for debugging
            import logging
            logging.error(f"User registration error: {str(e)}")
            return Response({'error': 'An error occurred during registration.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserLoginView(APIView):
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')

            user = authenticate(
                request=request, username=email, password=password)

            if user is not None:
                refresh = RefreshToken.for_user(user)
                # Get the user's ID and include it in the response
                user_id = user.id
                return Response({'token': str(refresh.access_token), 'msg': 'Login Success', 'userID': user_id}, status=status.HTTP_200_OK)
            else:
                return Response({'errors': {'non_field_errors': ['Email or Password is not valid']}}, status=status.HTTP_404_NOT_FOUND)
        except serializers.ValidationError as e:
            return Response({'errors': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import logging
            logging.error(f"User login error: {str(e)}")
            return Response({'errors': 'An error occurred during login.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.auth = None
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try:
            serializer = UserProfileSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UserProfileEditView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
            user = User.objects.get(pk=pk)
            serializer = UserProfileSerializer(user)
            return Response(serializer.data)
        
    def put(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = UserProfileUpdateSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserChangePasswordView(APIView):
  permission_classes = [IsAuthenticated]
  def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user': request.user})
        if serializer.is_valid():
            return Response({'msg': 'Password Changed Successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SendPasswordResetEmailView(APIView):
    def post(self, request, format=None):
        try:
            serializer = SendPasswordResetEmailSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                return Response({'msg': 'Password Reset link sent. Please check your Email'}, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserPasswordResetView(APIView):
  def post(self, request, uid, token, format=None):
    serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)
