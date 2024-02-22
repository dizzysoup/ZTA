import React,{useContext} from "react";
import { Text,Stack,Button, Flex ,Input } from '@chakra-ui/react';
import { useToast } from "@chakra-ui/react";
import  {keycloak} from './keycloak' ;
import AuthContext from "./AuthContext";
import {useNavigate }from "react-router-dom";



function LoginPage(){  
    const toast = useToast();
    const positions = ['top-right']
    const nav = useNavigate();
    const {account , Setaccount} = useContext(AuthContext);
    const {password , Setpassword} = useContext(AuthContext);

    const BtnClickEvent = () => {
       
        Setaccount(document.getElementById("account").value)
        Setpassword(document.getElementById("password").value)

        const secret = process.env.REACT_APP_KEYCLOAK_TOKE;
        console.log(secret);
        // 登入需求
        const url = "https://kong.ztasecurity.duckdns.org/realms/react-keycloak/protocol/openid-connect/token"
        console.log(url);
        const formData = new URLSearchParams();
        formData.append("grant_type","password");
        formData.append("client_id","reactClient");
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
                toast({title:"登入失敗",position: positions, isClosable : true,status:'error'})
            }else { 
                toast({title:"登入成功",position: positions, isClosable : true,status:'success'})
                nav('/Home',{state:{token:res}})
            }
        })
        .catch(e => 
            toast({title:"登入失敗",position: positions, isClosable : true,status:'error'})
            ) 
        /*
        const url2 = "http://www.envzta.com:8180/realms/react-keycloak/protocol/openid-connect/certs"
        
        fetch(url2,{
            method:"GET",
            headers : { 'Content-Type' : 'application/json',"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"*"}
        }).then(res => res.json())
        .then(res => console.log(res))
        .catch(e => console.error(e))
        */
    }

    return (
        <>
           <Stack width="100%" h="100%" align="center" spacing={4}>
                <Text fontSize={100}> LOGIN </Text>
                <Flex align="center"><Text fontSize={20}>帳號：</Text><Input type="text" w={300} id="account" /></Flex>
                <Flex align="center"><Text fontSize={20}>密碼：</Text><Input type="password" w={300} id="password" /></Flex>                
                <Button onClick={BtnClickEvent}>帳號密碼(check sso)</Button>         
                <Text> 145 </Text>       
                <h1>{ keycloak.token}</h1>
            </Stack>
        </>
        
    );
}

export default LoginPage