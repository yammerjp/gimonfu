English / [Japanese](README_ja.md)

# Gimonfu

Gimonfu is CLI tool to manage articles of Hatena-blog.

Gimonfu upload(download) markdown files to(from) Hatena-blog.

### Installation

```sh
$ yarn global add basd4g/gimonfu
# or $ npm install --global basd4g/gimonfu

$ mkdir blog
$ cd blog
$ gimonfu init
```

## Usage

### `$ gimonfu init`

(developping)

Register authentication informations to `.gimonfu.json`.

Need to execute this command before executing `$ gimonfu pull` or `$ gimonfu push`.

### `$ gimonfu pull`

Download new articles to `entry/` directory.

### `$ gimonfu push`

Upload new or updated articles in `entry/` directory, with setting custom URL to relative path from `entry/` directory.

## example

This repository's `example/` directory is a example of this command.

The format of `.gimonfu.json` is here

```.gimonfu.json
{
  "user_id" :  "basd4g",
  "api_key" : "h0o1g2e3f4u5ga",
  "blog_id" : "basd4g.hatenablog.com"
}
```

This API key is fake.

Please register your user id, API key and blog id.

### License

MIT

## Author

[basd4g](https://github.com/basd4g)

