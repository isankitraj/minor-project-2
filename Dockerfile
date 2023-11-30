# Use the official NGINX base image
FROM nginx:latest

# Copy your application files to the NGINX web root
COPY . /usr/share/nginx/html

# Expose the port on which NGINX will listen
EXPOSE 80

# Start NGINX when the container runs
CMD ["nginx", "-g", "daemon off;"]
