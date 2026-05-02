# node.js is an environment to run javascript outside browser and it also provides api to empower js so
# it could work with OS filesystem and network and it also translates typescript to javascript and
# compiles javascript to binary for cpu.

# npm manager is package manager, like apt in the linux mint. it's a terminal tool which is used to
# quickly download all dependencies you need for a frontend, for example - react. Since npm is the software written with
# javascript and we want to run it outside the browser it needs a node.js to be installed in the system.


# download to docker container node.js and npm manager from official docker image
# set alias(name) for this image - build
FROM node:22-alpine AS build
# creating the working directory in the root of the linux in the container
WORKDIR /app
# copying the 2 files with list of frontend dependencies to the /app directory
COPY package.json package-lock.json ./
# run clean install, basically means fetch al lthe data in the package-lock.json and install dependencies listed there
RUN npm ci
# copies the rest data(/src. vite.config etc) from matchme/frontend to /app directory inside container
COPY . .
# run the script from package.json which compiles typescript files to javascript and run vite, which:
#   1. removes comments from source code and and shortens the variable names
#   2. takes only code which is really used from libraries and removes the rest, shortens the project weight.
#   3. pack all frontend files to 2-3 bundles so browser only does few requests to get all the frontend data it needs
#      instead of 500+ requests which slows down the application
RUN npm run build
# create new container and download nginx web server there
FROM nginx:stable-alpine
# copies all from /app/dist to new container to /usr/share/nginx/html
# nginx is looking for index.html file (the one browser needs) exactly in the /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html
# copies all the conf file to current container -> /etc/nginx/conf.d/default.conf so nginx knows where to look for a conf file
COPY nginx.conf /etc/nginx/conf.d/default.conf
# open port 80, browser always sends data to port 80 and nginx listens to this port
EXPOSE 80
# this command runs the nginx and mit starts listening to port 80
CMD ["nginx", "-g", "daemon off;"]






