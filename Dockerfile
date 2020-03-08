FROM node:12.16.0
# Set /app as workdir
WORKDIR /app
COPY ./backend .
RUN npm i -q --no-optional
ENV NODE_ENV=production
RUN npm run build
CMD ["npm","start"]
