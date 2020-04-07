## pandoc-nextjs-server

### A simple web UI for [Pandoc](https://pandoc.org/)

Upload, convert, and download the file with ease.

#### How to use

1. Build a docker image

```sh
git clone https://github.com/arcatdmz/pandoc-nextjs-server.git
cd pandoc-nextjs-server
docker build -t pandoc-nextjs-server .
docker run -p 3000:3000 -it --rm --name pns pandoc-nextjs-server
```

2. Go to http://localhost:3000
3. Have fun!

---

(c) Jun Kato 2020
