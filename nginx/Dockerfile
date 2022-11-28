FROM nginx:1.15.9-alpine

RUN openssl req -new -newkey rsa:1024 -x509 -sha512 -days 365 -nodes -out nginx.crt -keyout nginx.key
RUN openssl dhparam -out dhparam.pem 1024

RUN rm /etc/nginx/conf.d/default.conf
COPY . /etc/nginx/conf.d
