FROM k1low/alpine-pandoc-ja
RUN apk add --no-cache bash curl nodejs
RUN echo node `node -v`
RUN echo npm v`npm -v`
RUN mkdir -p /work/uploads
COPY . /work
RUN chmod 755 /work/uploads
RUN cd /work && npm ci
RUN cd /work && npm run build
CMD cd /work && npm run start
EXPOSE 3000
