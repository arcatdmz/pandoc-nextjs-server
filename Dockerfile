FROM pandoc/latex:latest
RUN apk add --no-cache bash curl nodejs
RUN touch ~/.bashrc \
      && curl -o- -L https://yarnpkg.com/install.sh | bash \
      && ln -s "$HOME/.yarn/bin/yarn" /usr/local/bin/yarn
RUN echo node v`node -v`
RUN echo yarn v`yarn -v`
RUN mkdir -p /work
COPY . /work
RUN cd /work && yarn
