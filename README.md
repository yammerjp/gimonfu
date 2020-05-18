English / [Japanese](README_ja.md)

# Gimonfu

Gimonfu is CLI tool to manage entries of Hatena-blog.

Gimonfu upload/download markdown files to/from Hatena-blog.

## Usage

### `$ gimonfu pull`

Download new entries to `entry/` directory.

### `$ gimonfu push`

Upload new/updated entries in `entry/` directory, with setting custom URL to relative path from `entry/` directory.

### `$ gimonfu `

(developping)

Register authentication informations to `.gimonfu.json`.

Need to execute this command before executing `$ gimonfu pull` or `$ gimonfu push`.

### example

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

### Installation

```sh
$ yarn global add basd4g/gimonfu
# or $ npm install --global basd4g/gimonfu

$ mkdir blog
$ cd blog
$ gimonfu init
```

### License

MIT

## Author

[basd4g](https://github.com/basd4g)

