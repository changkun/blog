# Copyright (c) 2020 Changkun Ou. All rights reserved.

NAME=blog
VERSION = $(shell git describe --always --tags)

all: clean
	hugo --minify
bin: clean
	hugo --minify
	go build
build:
	hugo --minify
	CGO_ENABLED=0 GOOS=linux go build
	docker build -t $(NAME):$(VERSION) -t $(NAME):latest .
up:
	docker-compose up -d
down:
	docker-compose down
s: clean
	hugo server --debug -D -p 9219

clean:
	rm -rf blog resources public
