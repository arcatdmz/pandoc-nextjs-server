FROM k1low/alpine-pandoc-ja
RUN apk add --no-cache bash curl nodejs
RUN touch ~/.bashrc \
  && curl -o- -L https://yarnpkg.com/install.sh | bash \
  && ln -s "$HOME/.yarn/bin/yarn" /usr/local/bin/yarn
RUN echo node `node -v`
RUN echo yarn v`yarn -v`
RUN mkdir -p /work/uploads
COPY . /work
RUN chmod 755 /work/uploads
RUN cd /work && yarn
RUN cd /work && yarn build
CMD cd /work && yarn start
EXPOSE 3000
