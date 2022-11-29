FROM nginx:1.15.9-alpine

#RUN openssl req -new -newkey rsa:1024 -x509 -sha512 -days 365 -nodes -out nginx.crt -keyout nginx.key
#RUN openssl dhparam -out dhparam.pem 1024
#RUN apk upgrade --update-cache --available && \
#    apk add openssl && \
#    rm -rf /var/cache/apk/*
#RUN openssl req -new -newkey rsa:1024 -x509 -sha512 -days 365 -nodes -out nginx.crt -keyout nginx.key
#RUN openssl dhparam -out dhparam.pem 1024
WORKDIR /etc/nginx/conf.d
RUN rm default.conf
COPY . .
