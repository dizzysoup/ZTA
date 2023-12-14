docker-compose build kong
docker-compose up -d kong-db
docker-compose run --rm kong kong migrations bootstrap
docker-compose run --rm kong kong migrations up
docker-compose up -d kong
sleep 30 
docker-compose ps
curl -s http://localhost:8001 | jq .plugins.available_on_server.oidc
docker-compose up -d konga
sleep 30
docker-compose up -d keycloak-db
docker-compose up -d keycloak
docker-compose up -d nginxproxyserver
docker-compose up -d frontend
docker-compose ps
