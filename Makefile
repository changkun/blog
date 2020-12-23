# Copyright (c) 2020 Changkun Ou. All rights reserved.

all: clean
	hugo --minify

bin: clean # require Go 1.16
	hugo --minify
	go build

# base url https://blog.changkun.de/
dev: clean 
	hugo -D --minify --baseURL http://0.0.0.0:9129
	go build

clean:
	rm -rf blog resources public
