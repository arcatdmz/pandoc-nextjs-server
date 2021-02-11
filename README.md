## pandoc-nextjs-server

[![Build and deploy Docker app to Azure](https://github.com/arcatdmz/pandoc-nextjs-server/workflows/Build%20and%20deploy%20Docker%20app%20to%20Azure/badge.svg)](https://github.com/arcatdmz/pandoc-nextjs-server/actions?query=workflow%3Adeploy)

### A simple web UI for [Pandoc](https://pandoc.org/)

Upload, convert, and download the file with ease.

- Demo site: https://pandoc.digitalmuseum.jp
- Docker image: http://hub.docker.com/repository/docker/arcatdmz/pandoc-nextjs-server (built with [GitHub Actions]())

![Screenshot](https://i.gyazo.com/9ad5ea13216154750470b0659157facb.png)

#### How to use

1. `git clone`

```sh
git clone https://github.com/arcatdmz/pandoc-nextjs-server.git
cd pandoc-nextjs-server
```

2. Build a docker image

```sh
docker build -t pandoc-nextjs-server .
docker run -p 3000:3000 -it --rm --name pns pandoc-nextjs-server
```

3. Go to http://localhost:3000
4. Have fun!

---

(c) Jun Kato 2020-2021
