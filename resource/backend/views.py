from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import permissions
from rest_framework.response import Response
from keycloak.openid_connection import KeycloakOpenID
from rest_framework import viewsets
from .serializers import ScoreSerializer
from .models import Score
import jwt 
from jwt import PyJWKClient
from jose import jwk , jwe
import requests
import time
import json
import urllib
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.x509 import load_pem_x509_certificate
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.hashes import SHA256
from base64 import b64decode

# Create your views here.



#class Source1Response(APIView):
#    def get(self, request, *args, **kwargs):
#        return render(request,'sourcepage.html')

#        """
#        token = request.data.get('token')
#        print(token)
#        # get public key 
#        def get_jwks_url(issuer_url):
#            well_known_url = issuer_url + "/.well-known/openid-configuration"
#            with urllib.request.urlopen(well_known_url) as response:
#                well_known = json.load(response)
#            if not 'jwks_uri' in well_known:
#                raise Exception('jwks_uri not found in OpenID configuration')
#            return well_known['jwks_uri']    
        # token = access_token 
        # key = public key 
#        def decode_and_validate_token(token):
#            unvalidated = jwt.decode(token, options={"verify_signature": False})
#            jwks_url = get_jwks_url(unvalidated['iss'])
#            jwks_client = jwt.PyJWKClient(jwks_url)
#            header = jwt.get_unverified_header(token)
#            key = jwks_client.get_signing_key(header["kid"]).key
#            return jwt.decode(token, key, [header["alg"]],audience="account")   
#        try :
#            decoded_token = decode_and_validate_token(token)
#            current_time = int(time.time())
#            print(current_time)
#            print(decoded_token['exp'])
#            if decoded_token['exp'] < current_time:
#               print("token 時間超過")
#               return render(request,'errorpage.html') 
#        except jwt.ExpiredSignatureError:
#            print("token已過期")
#            return render(request,'errorpage.html')
#        except jwt.DecodeError :
#            print("token解碼失敗")
#            return render(request,'errorpage.html')       
#        print(decoded_token)
#        """


# RP 的公私鑰對
def gererate_key_pair():
    # 生成RSA 密鑰對
    private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
    )
    private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption()
    )
    # 獲取公鑰
    public_key = private_key.public_key()
    # 公鑰PEM格式
    public_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    return private_pem, public_pem

class PublickKeyViewSet(APIView):
    def get(self, request , *args , **kwargs):
        private_pem, public_pem = gererate_key_pair()
        print("Private Key: ", private_pem.decode("utf-8"))

        # 將私鑰寫入文件
        with open('private.pem', 'wb') as f:
            f.write(private_pem)
        # 將公鑰寫入文件
        with open('public.pem', 'wb') as f:
            f.write(public_pem)

        print("Public Key: ", public_pem.decode("utf-8"))
        return Response({"public_key": public_pem}, status=status.HTTP_201_CREATED)

# RP 私鑰解密 + 驗簽
class VerifyViewSet(APIView):
    def post(self, request, *args, **kwargs):
        access_token = request.data.get('access_token')
        sign = request.data.get('sign')

        # 用私鑰解密
        with open('private.pem', 'rb') as f:
            private_key = f.read()
        try :
            decode_data = jwe.decrypt(sign,key = private_key.decode("utf-8"))
            print(decode_data)
        except:
            return Response({"Error": "token解密失敗"}, status=status.HTTP_400_BAD_REQUEST)
       
            
            
           
          #  decrypted_data_json = json.loads(decrypted_data)
           # header = decrypted_data_json["header"]
           # payload = decrypted_data_json["payload"]            
           # signature = decrypted_data_json["signature"]
         #   jwtencode = jwt.encode({'header':header,'payload':payload}, key = private_key.decode("utf-8"), algorithm='RS256')
            #print(decrypted_data_json)
            #print(signature)

            
          #  jwks = requests.get('https://kong.ztaenv.duckdns.org/keycloak/realms/react-keycloak/protocol/openid-connect/certs').json()["keys"][1]
         # 驗簽
        
        try : 
            jwks_client = PyJWKClient('https://kong.ztaenv.duckdns.org/keycloak/realms/react-keycloak/protocol/openid-connect/certs')
            signing_key = jwks_client.get_signing_key_from_jwt(access_token)
            
            decoded_token = jwt.decode(access_token, signing_key.key, algorithms='RS256', audience="account")
            print("簽名")
            print(decoded_token)
            return Response(decoded_token, status=status.HTTP_201_CREATED)
        except jwt.ExpiredSignatureError:
            return Response({"Error": "token已過期"}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.InvalidTokenError :
            return Response({"Error": "token無效"}, status=status.HTTP_400_BAD_REQUEST)


class ScoreViewSet(APIView):
    def get(self, request, *args, **kwargs):
        queryset = Score.objects.all()
        serializer_class = ScoreSerializer(queryset, many=True)
        return Response({"Scores": serializer_class.data}, status=status.HTTP_201_CREATED)
    def post(self, request, *args, **kwargs):
        serializer = ScoreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"Score": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
