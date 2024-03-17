FROM node:18.19.0

# env variables
ENV HTTP_PORT 6612
ENV P2P_PORT 9011


#   create configuration directory
RUN mkdir /etc/denetwork/

#   create a working directory inside the container
WORKDIR /usr/src/app

#   copy the local package.json to the container
COPY package.json ./

#   install project dependencies
RUN npm install

#   copies all files in the current directory into the container (except those specified in .dockerignore)
COPY . .

#   expose the ports used by the application
EXPOSE ${HTTP_PORT}
EXPOSE ${P2P_PORT}

#   run application inside container
CMD [ "node", "src/main.js" ]
