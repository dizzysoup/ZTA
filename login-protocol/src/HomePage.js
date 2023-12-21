import React,{useState,useEffect,useContext} from "react";
import { Text,Stack,Button, useToast  } from '@chakra-ui/react';
import {jwtDecode} from 'jwt-decode';
import { useLocation,useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";



function HomePage(){
    const toast = useToast();
    const location = useLocation();
    const positions = ['top-right']
    const [id_token ,setIdtoken]  = useState("");
    const nav = useNavigate();
    let myInterval = [];

    const access_token =  location.state == null ? null :  location.state.token.access_token;
    const refresh_token = location.state == null ? null : location.state.token.refresh_token;
    const {account , Setaccount} = useContext(AuthContext);
    const {password , Setpassword} = useContext(AuthContext);

    const secret = '8tKmMGliHE4flUSC5x0ICUMxfbypiRGp';
    
    
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
   
    //憑證驗證
    const introspect_Id = () => {
       // const url = "https://kong.ztasecurity.duckdns.org/realms/react-keycloak/protocol/openid-connect/token/introspect"
        const url = "https://keycloak.ztasecurity.duckdns.org/realms/react-keycloak/protocol/openid-connect/token/introspect"
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

    // 資源token 
    const OnHandleBtnClick = (param) => {
        introspect_Id()
       
        const url = `https://kong.ztasecurity.duckdns.org/${param}/realms/param/protocol/openid-connect/token`
        console.log(url);        
        const formData = new URLSearchParams();
        formData.append("grant_type","password");
        formData.append("client_id",param);
        formData.append("username",account);
        formData.append("password",password);
        formData.append("client_secret",secret);

        

        fetch(url,{
            method:"POST",
            headers : { 'Content-Type' : 'application/x-www-form-urlencoded'},
            body : formData.toString()
        }).then(res => res.json())
        .then(res => {
            if(res["error"] === "invalid_grant"){
                toast({title:"獲取失敗",position: positions, isClosable : true,status:'error'})
            }else { 
                toast({title:"獲取成功",position: positions, isClosable : true,status:'success'})
            }
        })
        .catch(e => 
            toast({title:"獲取失敗",position: positions, isClosable : true,status:'error'})
        )
        
        
        /*
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
        */
    }
    // 登出
    const OnHandleBtnClick_out = () => {
        //const url = "https://kong.ztasecurity.duckdns.org/realms/react-keycloak/protocol/openid-connect/logout"
        const url = "https://keycloak.ztasecurity.duckdns.org/realms/react-keycloak/protocol/openid-connect/logout"
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
                <Text fontSize={50}> {account} </Text>
                <Text fontSize={100}> WELCOME! </Text>                
                <Stack direction={['column','row']} spacing='10px' >
                    <Button onClick={() => OnHandleBtnClick("resource1")}>獲取資源1</Button>
                    <Button  onClick={() => OnHandleBtnClick("resource2")}>獲取資源2</Button>  
                </Stack>                
                <Button onClick={OnHandleBtnClick_out}>登出</Button>                  
            </Stack>
        </>
    );
}

export default HomePage