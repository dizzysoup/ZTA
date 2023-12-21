import React,{useContext} from "react";
import { Text,Stack,Button, Flex ,Input , Box , HStack ,Toast } from '@chakra-ui/react';
import { useToast } from "@chakra-ui/react";
import  {keycloak} from './keycloak' ;
import AuthContext from "./AuthContext";
import {useNavigate }from "react-router-dom";
import { client } from '@passwordless-id/webauthn';
import { server } from "@passwordless-id/webauthn";



function LoginPage(){  
    const toast = useToast();
    const positions = ['top-right']
    const nav = useNavigate();
    const {account , Setaccount} = useContext(AuthContext);
    const {password , Setpassword} = useContext(AuthContext);
    
    const BtnClickEvent = () => {
       
        Setaccount(document.getElementById("account").value)
        Setpassword(document.getElementById("password").value)

        const secret = '8tKmMGliHE4flUSC5x0ICUMxfbypiRGp';
        console.log(secret);
        // 登入需求
        //const url = "https://kong.ztasecurity.duckdns.org/realms/react-keycloak/protocol/openid-connect/token"
        const url = "https://keycloak.ztasecurity.duckdns.org/realms/react-keycloak/protocol/openid-connect/token"
        console.log(url);
        const formData = new URLSearchParams();
        formData.append("grant_type","password");
        formData.append("client_id","reactClient");
        formData.append("username",account);
        formData.append("password",password);
        formData.append("client_secret",secret);
        console.log(formData.toString());
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

    const FIDORegister = async() => {
        // 檢查使用者是否存在資料庫中
        const body = {
            "username" : document.getElementById("username").value,
        }

        fetch('https://fidoserver.ztasecurity.duckdns.org/webauth/register',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(res => res.text())
        .then(data => {
            if(data == "已經有資料"){
                toast({title:"此帳戶已被註冊",position: positions, isClosable : true,status:'error'}) 
            }else {
                console.log(client.isAvailable());
                const challenge = "a7c61ef9-dc23-4806-b486-2428938a547e";
                client.register("Arnaud", challenge, {
                    authenticatorType: "auto",
                    userVerification: "required",
                    timeout: 60000,
                    attestation: false,
                    userHandle: "recommended to set it to a random 64 bytes value",
                    debug: false
                }).then(
                    res => {
                        toast({title:"註冊成功",position: positions, isClosable : true,status:'success'}) 
                    }
                    ).catch(err => {
                        toast({title:"註冊失敗",position: positions, isClosable : true,status:'error'})
                        console.log(err)})    
                    }
        })
        .catch(err => console.log(err)); 

    }

    const FIDOLogin = async() => {
        const body = {
            "username" : document.getElementById("username").value,
        }

        fetch('https://fidoserver.ztasecurity.duckdns.org/webauth/login',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(res=>res.text())
        .then(res => {
            if(res == "success"){
                const challenge = "a7c61ef9-dc23-4806-b486-2428938a547e";
                client.register("Arnaud", challenge, {
                    authenticatorType: "auto",
                    userVerification: "required",
                    timeout: 60000,
                    attestation: false,
                    userHandle: "recommended to set it to a random 64 bytes value",
                    debug: false
                }).then(
                    res => {
                        toast({title:"登入成功",position: positions, isClosable : true,status:'success'}) 
                        nav('/Home',{state:{token:res}})
                    }
                    ).catch(err => {
                        toast({title:"登入失敗",position: positions, isClosable : true,status:'error'})
                        console.log(err)})    
                    
            }else {
                console.log(res)
                toast({title:"帳號不存在",position: positions, isClosable : true,status:'error'}) 
            }
        })

    }
    return (
        <>
           <Stack width="100%" h="100%" align="center" spacing={4}>
           <Text fontSize={100}> LOGIN </Text>
           <HStack width={600} spacing={10} align="center">
                <Stack  spacing={4} align="center" border="black 10px" >
                    <Text fontSize={50}> FIDO 登入</Text>
                    <Text fontSize={20}>使用者名稱</Text>
                    <Input width="100%" id="username" />
                    <Button onClick={FIDORegister}> 註冊 </Button>
                    <Button onClick={FIDOLogin}> 登入 </Button>
                </Stack>
                <Stack  spacing={4} >
                <   Text fontSize={50}> 帳號密碼登入</Text>
                    <Text fontSize={20}>帳號：</Text><Input type="text"  id="account" />
                    <Text fontSize={20}>密碼：</Text><Input type="password" id="password" />             
                    <Button onClick={BtnClickEvent}> 登入 </Button>     
                </Stack>              
            </HStack>
            </Stack>
        </>
        
    );
}

export default LoginPage