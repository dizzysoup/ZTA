from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import permissions
from rest_framework.response import Response
from keycloak.openid_connection import KeycloakOpenID
import jwt 
import requests
import time
import json
import urllib

# Create your views here.

# 取得公鑰
def get_public_key():
    public_key_url = 'http://host.docker.internal:8180/realms/react-keycloak/protocol/openid-connect/certs'
    response = requests.get(public_key_url)
    public_key =  response.json()["keys"][1]
    public_key = json.dumps(public_key).replace("'", "\"")
    return public_key

class Source1Response(APIView):
    def post(self, request, *args, **kwargs):
        """
        token = request.data.get('token')
        print(token)
        # get public key 
        def get_jwks_url(issuer_url):
            well_known_url = issuer_url + "/.well-known/openid-configuration"
            with urllib.request.urlopen(well_known_url) as response:
                well_known = json.load(response)
            if not 'jwks_uri' in well_known:
                raise Exception('jwks_uri not found in OpenID configuration')
            return well_known['jwks_uri']    
        # token = access_token 
        # key = public key 
        def decode_and_validate_token(token):
            unvalidated = jwt.decode(token, options={"verify_signature": False})
            jwks_url = get_jwks_url(unvalidated['iss'])
            jwks_client = jwt.PyJWKClient(jwks_url)
            header = jwt.get_unverified_header(token)
            key = jwks_client.get_signing_key(header["kid"]).key
            return jwt.decode(token, key, [header["alg"]],audience="account")   
        try :
            decoded_token = decode_and_validate_token(token)
            current_time = int(time.time())
            print(current_time)
            print(decoded_token['exp'])
            if decoded_token['exp'] < current_time:
               print("token 時間超過")
               return render(request,'errorpage.html') 
        except jwt.ExpiredSignatureError:
            print("token已過期")
            return render(request,'errorpage.html')
        except jwt.DecodeError :
            print("token解碼失敗")
            return render(request,'errorpage.html')       
        print(decoded_token)
        """
        return render(request,'sourcepage.html')
    
