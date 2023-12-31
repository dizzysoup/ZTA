import React,{useContext, useState} from "react";
import { Text,Stack,Button, Flex ,Input , Box , HStack ,Toast , Image } from '@chakra-ui/react';
import { useToast } from "@chakra-ui/react";
import  {keycloak} from './keycloak' ;
import AuthContext from "./AuthContext";
import {useNavigate }from "react-router-dom";
import { client } from '@passwordless-id/webauthn';
import forge from 'node-forge'; 




function LoginPage(){  
    const toast = useToast();
    const positions = ['top-right']
    const nav = useNavigate();
    
    const {account , Setaccount} = useContext(AuthContext);
    const {password , Setpassword} = useContext(AuthContext);

      
    const BtnClickEvent = () => {
       
        Setaccount(document.getElementById("account").value)
        Setpassword(document.getElementById("password").value)

        const secret = 'baNOdwa9wGfw7AVRjxkFuucwcSdMnGXj';
        console.log(secret);
        // 登入需求
        const url = "https://kong.ztasecurity.duckdns.org/realms/react-keycloak/protocol/openid-connect/token"
        //const url = "https://keycloak.ztasecurity.duckdns.org/realms/react-keycloak/protocol/openid-connect/token"
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

    /*
        <Stack  spacing={4} >
                <   Text fontSize={50}> 帳號密碼登入</Text>
                    <Text fontSize={20}>帳號：</Text><Input type="text"  id="account" />
                    <Text fontSize={20}>密碼：</Text><Input type="password" id="password" />             
                    <Button onClick={BtnClickEvent}> 登入 </Button>     
        </Stack>   
    */

    const FIDORegister = async() => {
            // 檢查使用者是否存在資料庫中
            const username = document.getElementById("username").value ;             
            const challengeurl = "https://fidoserver.ztasecurity.duckdns.org/webauth/challenge"

            const challenge = await (await fetch(challengeurl)).text();

            const registration = await client.register(username , challenge , {
                authenticatorType: "both",
                userVerification: "required",
                timeout: 60000,
                attestation: false,
                userHandle: "recommended to set it to a random 64 bytes value",
                debug: false
            }).catch(e => console.log(e))
           
            if(registration !== undefined){
                const registerurl = "https://fidoserver.ztasecurity.duckdns.org/webauth/register"
                fetch(registerurl , 
                    {
                        method : 'POST' ,                         
                        headers: {
                            'Content-Type': 'application/json'  // Specify the content type as JSON
                          },
                        body : JSON.stringify(registration)
                    }).then(res => res.text()).then(data => {
                        if(data == "帳號已註冊"){
                            toast({title:"帳號已註冊",position: positions, isClosable : true,status:'error'})
                        }else {
                            const Ids = JSON.parse(data)["credential"]["id"];
                            console.log(Ids);
                            /*
                            const storedData = localStorage.getItem('certificate');
                            const newArray = Array.isArray(storedData) ? JSON.parse(storedData) : [];
                            newArray.push(data);
                            console.log(newArray);*/
                            localStorage.setItem('certificate', JSON.stringify(Ids));
                            toast({title:"註冊成功",position: positions, isClosable : true,status:'success'})
                        }
                            
                    }).catch(e => console.log(e))
            } 
    }
    // 登入
    const FIDOLogin = async() => {
        const username = document.getElementById("username").value ; 
        const IdData = {
            "username" : username
        }
        // 取得Id 
        const IDurl = "https://fidoserver.ztasecurity.duckdns.org/webauth/Id" ;
        const options = {
            method : 'POST' ,                         
                headers: {
                    'Content-Type': 'application/json'  // Specify the content type as JSON
                },
                body : JSON.stringify(IdData)
        }
        let Id = [] ;
        try {
            Id = (await (await fetch(IDurl,options)).json())[0]["id"];
        } catch(e) {
            toast({title:"帳號不存在",position: positions, isClosable : true,status:'error'});
            return ; 
        }
         
        // 取得challenge  / 每次都會生成
        const challengeurl = "https://fidoserver.ztasecurity.duckdns.org/webauth/challenge"
        const challenge = await (await fetch(challengeurl)).text();
        
        // 產生驗證憑證
        const authentication  = await client.authenticate([Id],challenge,{
            "authenticatorType" : "auto",
            "userVerification" : "required",
            "timeout" : 60000
        }).catch(e => console.log(e))
        console.log(authentication)

        if(authentication !== undefined){
            const loginurl = "https://fidoserver.ztasecurity.duckdns.org/webauth/login"
            fetch(loginurl , {
            method : 'POST' ,                         
                headers: {
                    'Content-Type': 'application/json'  // Specify the content type as JSON
                },
                body : JSON.stringify(authentication)
            }).then(res => res.json()).then(data =>{            
            toast({title:"登入成功",position: positions, isClosable : true,status:'success'});           
            nav('/Home',{state:{token:data["jsonWebToken"]}})                                  
        }).catch(e => toast({title:"登入失敗",position: positions, isClosable : true,status:'error'}))
        }
    }
    return (
        <Box  backgroundColor={"blue.300"}  align={"center"} width = "100vw" h="100vh"  pt = "9%">
            <Text fontSize={60}> Cybersecurity R&D Lab </Text>
           <Box boxSize={"400px"}  >            
                <Box  backgroundColor={"white"} align = "center" p = "10px" borderWidth={"3px"} borderColor={"black"}>
                    <Text fontSize={100}> LOGIN </Text>
                    <Stack  spacing={4}  border="black 10px" > 
                        <Text fontSize={30}  align={"start"}> FIDO 登入</Text>
                        <Text fontSize={20}>使用者名稱</Text>
                        <Input width="100%" id="username" />
                        <Button onClick={FIDORegister}> 註冊 </Button>
                        <Button onClick={FIDOLogin}> 登入 </Button>
                    </Stack>
                </Box>
            </Box>
        </Box>
        
    );
}

export default LoginPage