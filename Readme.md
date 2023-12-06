# HOW TO USE 
# 執行start.sh 以方便建置基礎

```
    ./start.sh
```


# NGINX 存取閘道
建立Image 

    docker build -t nginx .

執行

    docker run --name login_protocol --network fontend_net -p 8080:8080 -d nginx