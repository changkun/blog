# Copyright (c) 2020 Changkun Ou. All rights reserved.

NAME=blog
all: clean
	hugo --minify
s: clean
	hugo server --debug -D -p 9219
clean:
	rm -rf blog resources public
