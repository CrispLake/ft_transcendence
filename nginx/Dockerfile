FROM nginx:alpine

# Copy the NGINX config file to the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates
COPY ./certs/cert.pem /etc/nginx/certs/fullchain.pem
COPY certs/key.pem /etc/nginx/certs/privkey.pem

EXPOSE 80
EXPOSE 443

