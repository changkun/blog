# Copyright 2020 Changkun Ou. All rights reserved.

FROM alpine
COPY blog /app/blog
EXPOSE 80
CMD ["/app/blog"]