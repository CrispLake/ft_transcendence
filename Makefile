NAME = transcendence

COMPOSE = ./compose.yaml

all: $(NAME)

$(NAME):
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
