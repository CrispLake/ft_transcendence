NAME = transcendence

COMPOSE = ./compose.yaml

.PHONY: all clean fclean re certificates restart prune sh down

all: $(NAME)

certificates:
	mkdir -p frontend/app/certs
	mkdir -p nginx/certs
	mkdir -p transcendence_src/src/certs
	cp certs/* frontend/app/certs
	cp certs/* nginx/certs
	cp certs/* transcendence_src/src/certs

$(NAME): certificates
	docker compose -f $(COMPOSE) up -d

clean:
	docker compose -f $(COMPOSE) down --rmi all -v

fclean: clean

re: fclean all

restart:
	docker compose -f $(COMPOSE) restart

prune:
	docker system prune -f

sh:
	docker compose exec transcendence bash

down:
	docker compose -f $(COMPOSE) down
