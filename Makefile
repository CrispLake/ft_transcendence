NAME = transcendence

COMPOSE = ./compose.yaml

DATA_DIR = ./postgresql/db

all: $(NAME)

$(DATA_DIR):
	mkdir -p $@

$(NAME): $(DATA_DIR)
	docker compose -f $(COMPOSE) up -d

clean:
	docker compose -f $(COMPOSE) down --rmi all -v

fclean: clean

re: fclean all

restart:
	docker compose -f $(COMPOSE) restart

prune:
	docker system prune -f