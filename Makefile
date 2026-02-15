# Copyright (c) 2020 Changkun Ou. All rights reserved.

all: clean
	hugo --minify
s: clean
	hugo server --debug -D -p 9219
clean:
	rm -rf blog resources public
