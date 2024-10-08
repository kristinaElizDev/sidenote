FROM node:18-alpine 

WORKDIR /sidenote-app

COPY client/public /sidenote-app/public
COPY client/src/ /sidenote-app/src/
COPY client/package.json /sidenote-app/
COPY client/index.html  /sidenote-app/
COPY client/vite.config.ts /sidenote-app/

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]