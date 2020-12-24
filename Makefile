# Copyright (c) 2020 Changkun Ou. All rights reserved.

all: clean
	hugo --minify

bin: clean
	hugo --minify
	go build

dev: clean 
	hugo --debug -D --log --minify --baseURL http://0.0.0.0:9129
	go build

s: clean
	hugo server --debug -D -p 9219

clean:
	rm -rf blog resources public
