import React from "react";

function Login2(){
    return (
        <h1>
            <a href="http://host.docker.internal:8000/realms/react-keycloak/protocol/openid-connect/auth?client_id=reactClient&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&state=87383935-d1c1-4bc6-8776-2123608b730c&response_mode=fragment&response_type=code&scope=openid&nonce=25fe04e0-b009-4e76-849b-31e68958e2a0"> 登入</a>
        </h1>
    );
}


export default Login2