all: clean
	hugo -D --minify

s: all
	hugo server -D -p 9219

clean:
	rm -rf resources public
