if ! docker volumn inspect portainer_data &> /dev/null; then
    docker volume create portainer_data
fi

if !docker inspect portainer &> /dev/null; then 
    docker run -d -p 9443:9443 -p 9000:9000 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest
    sleep 30
fi

docker-compose build kong
docker-compose up -d kong-db
docker-compose run --rm kong kong migrations bootstrap
docker-compose run --rm kong kong migrations up
docker-compose up -d kong
docker-compose ps
curl -s http://localhost:8001 | jq .plugins.available_on_server.oidc
docker-compose up -d konga
sleep 30
docker-compose up -d keycloak-db
docker-compose up -d keycloak
docker-compose up -d nginxproxyserver
docker-compose ps
