import React,{useContext, useState} from "react";
import { Text,Stack,Button, Flex ,Input , Box , HStack ,Toast , Image , InputGroup , InputRightElement } from '@chakra-ui/react';
import { useToast } from "@chakra-ui/react";
import  {keycloak} from './keycloak' ;
import AuthContext from "./AuthContext";
import {useNavigate }from "react-router-dom";
import { client } from '@passwordless-id/webauthn';

function InputComponent(){
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    return (
        <InputGroup size='md'>
        <Input
          pr='4.5rem'
          type={show ? 'text' : 'password'}
          placeholder='Enter password'
          id = "password"
          
        />
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
    );
}

function LoginPage(){  
    const toast = useToast();
    const positions = ['top-right']
    const nav = useNavigate();

    const FIDORegister = async() => {
            // 檢查使用者是否存在資料庫中
            const username = document.getElementById("username").value ;             
            const challengeurl = "https://kong.ztaenv.duckdns.org/fido/webauth/challenge"

            const challenge = await (await fetch(challengeurl)).text();
            console.log(challenge)
            const registration = await client.register(username , challenge , {
                authenticatorType: "roaming",
                userVerification: "required",
                timeout: 60000,
                attestation: false,
                userHandle: "recommended to set it to a random 64 bytes value",
                debug: false
            }).catch(e => console.log(e))
           
           console.log(registration)
           if(registration !== undefined){
            const registerurl = "https://kong.ztaenv.duckdns.org/fido/webauth/register"
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
            const IDurl = "https://kong.ztaenv.duckdns.org/fido/webauth/Id" ;
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
            const challengeurl = "https://kong.ztaenv.duckdns.org/fido/webauth/challenge"
    
            const challenge = await (await fetch(challengeurl)).text();
            
            // 產生驗證憑證
            const authentication  = await client.authenticate([Id],challenge,{
                "authenticatorType" : "roaming", 
                "userVerification" : "required",
                "timeout" : 60000
            }).catch(e => console.log(e))
            console.log(authentication)
    
            
            if(authentication !== undefined){
                //const loginurl = "https://fidoserver.ztasecurity.duckdns.org/webauth/login"
                const loginurl = "https://kong.ztaenv.duckdns.org/fido/webauth/login"
                fetch(loginurl , {
                method : 'POST' ,                         
                    headers: {
                        'Content-Type': 'application/json'  // Specify the content type as JSON
                    },
                    body : JSON.stringify(authentication)
                }).then(res => res.json()).then(data =>{                        
                    toast({title:"登入成功",position: positions, isClosable : true,status:'success'});           
                    nav('/Home',{state:{token:data}})                                  
            }).catch(e => toast({title:"登入失敗",position: positions, isClosable : true,status:'error'}))
            }
            
    }

    const LDAPAuthentication = async() => {
       const password = document.getElementById("password").value ;
       const account = document.getElementById("username").value ;
       const LDAPCheckUrl = "https://kong.ztaenv.duckdns.org/fido/ldap/login" ;
       return await fetch(LDAPCheckUrl , { method : 'POST' , 
            headers: {
            'Content-Type': 'application/json'  // Specify the content type as JSON
            },
            body : JSON.stringify({"username":account,"password":password})})
    }

    const Register = async() => {
        const result = await (await ( await LDAPAuthentication())).json();
        if(result["message"] === "Authentication successful"){
            toast({title:"AD 驗證成功",position: positions, isClosable : true,status:'success'})
            FIDORegister();
        }else if (result["message"] === "Authentication failed"){
            toast({title:"AD 驗證失敗",position: positions, isClosable : true,status:'error'})
        }
        
    }

    const Login = async() => {
        const result = await (await ( await LDAPAuthentication())).json();
        if(result["message"] === "Authentication successful"){
            toast({title:"AD 驗證成功",position: positions, isClosable : true,status:'success'})
            FIDOLogin();
        }else if (result["message"] === "Authentication failed"){
            toast({title:"AD 驗證失敗",position: positions, isClosable : true,status:'error'})
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
                        <Input width="100%" id="username" placeholder="username"/>                        
                        < InputComponent />
                        <Button onClick={Register}> 註冊 </Button>
                        <Button onClick={Login}> 登入 </Button>
                    </Stack>
                </Box>
            </Box>
        </Box>
        
    );
}

export default LoginPage