docker volume create portainer_data
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest
sleep 2m 
docker-compose build kong
docker-compose up -d kong-db
docker-compose run --rm kong kong migrations bootstrap
docker-compose run --rm kong kong migrations up
docker-compose up -d kong
docker-compose ps
curl -s http://localhost:8001 | jq .plugins.available_on_server.oidc
docker-compose up -d konga
sleep 2m
docker-compose up -d keycloak-db
docker-compose up -d keycloak
docker-compose ps
