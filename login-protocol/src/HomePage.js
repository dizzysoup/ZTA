import React,{useState,useEffect} from "react";
import { Text,Stack,Button, useToast } from '@chakra-ui/react';
import { Base64 } from "js-base64";
import { useLocation,useNavigate } from "react-router-dom";




function HomePage(){
    const toast = useToast();
    const location = useLocation();
    const positions = ['top-right']
    const [id_token ,setIdtoken]  = useState("");
    const nav = useNavigate();
    let myInterval = [];

    const access_token =  location.state == null ? null :  location.state.token.access_token;
    const refresh_token = location.state == null ? null : location.state.token.refresh_token;

    const secret = "rqETQIbEcniULykTP0BFF3OBQn92QuDl"
    
    useEffect(()=> {
        if(location.state == null ){
            toast({title:"請好好用系統",position: positions, isClosable : true,status:'error'});
            nav('/');
            return () => {
                clearInterval(myInterval);
            }
        }
        myInterval = setInterval(()=>{
            introspect_Id();
        },1000)
        return () => {
            clearInterval(myInterval);
        }
    },[])
   
    const introspect_Id = () => {
        const url = "http://www.envzta.com:1338/realms/react-keycloak/protocol/openid-connect/token/introspect"
        const formData = new URLSearchParams();
        formData.append("token",access_token);
        formData.append("client_id","reactClient");
        formData.append("client_secret",secret);
        fetch(url,{
            method:"POST",
            headers : { 'Content-Type' : 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
            body : formData.toString()
        }).then(res => res.json())
        .then(res => {
            setIdtoken(res);
            if(res["active"] === false){
               toast({title:"憑證失效",position: positions, isClosable : true,status:'error'});
               nav("/");
            }
        })
        .catch(e =>{
            console.log(e)
           toast({title:"憑證失效",position: positions, isClosable : true,status:'error'});
            nav("/");
        }) 
    }

    const OnHandleBtnClick = () => {
        introspect_Id()
       
        const requestOptions = {
            method: 'POST',
            headers : {'Content-Type':'application/json'},
            body: JSON.stringify({token:access_token})
        }
        // backend 
        fetch('http://www.envzta.com:8002/source/',requestOptions)
            .then(res => res.text())
            .then(res => document.body.innerHTML = res)
            .catch(e => console.error(e))    
    }

    const OnHandleBtnClick_out = () => {
        const url = "http://www.envzta.com:1338/realms/react-keycloak/protocol/openid-connect/logout"
        const formData = new URLSearchParams();
        formData.append("refresh_token",refresh_token);
        formData.append("client_id","reactClient");
        formData.append("client_secret",secret);
        console.log( formData.toString());
        fetch(url,{
            method:"POST",
            headers : { 'Content-Type' : 'application/x-www-form-urlencoded'},
            body : formData.toString()
        })
        .then(res => {
            console.log(res)
            toast({title:"登出成功",position: positions, isClosable : true,status:'success'});
            clearInterval(myInterval);
            nav('/');
        })
        .catch(e =>{
            console.log(e)
            toast({title:"登出失敗",position: positions, isClosable : true,status:'error'});
           
        }) 

    }
    return (
        <>
            <Stack width="100%" h="100%" align="center" spacing={4}>
                <Text fontSize={100}> WELCOME! </Text>
                <Button onClick={OnHandleBtnClick}>獲取資源</Button>  
                <Button onClick={OnHandleBtnClick_out}>登出</Button>                  
            </Stack>
        </>
    );
}

export default HomePage