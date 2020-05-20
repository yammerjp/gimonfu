English / [Japanese](README_ja.md)

# gimonfu

![logo](logo.png)

gimonfu is a CLI tool to manage articles of Hatena-blog.

gimonfu upload(download) markdown files to(from) Hatena-blog.

## Installation

```sh
$ yarn global add gimonfu
# or $ npm install --global gimonfu

$ mkdir blog
$ cd blog
$ gimonfu init
```

## Usage

### Register Credentials

To register credentials to `.gimonfu.json`, you can run like this:

```sh
$ gimonfu init
```

Please execute this command before executing `$ gimonfu pull` or `$ gimonfu push`.

### Download Articles

Ro download new articles to `entry/` directory you can run like this:

```sh
$ gimonfu pull
```


### Upload Articles

To upload new or updated articles in `entry/` directory, you can like this:

```sh
$ gimonfu push
```

Relative path from `entry/` directory is set as custom URL with uploading.

## example

This repository's `example/` directory is an example to use this application.

The format of `.gimonfu.json` is like this:

```.gimonfu.json
{
  "user_id" :  "basd4g",
  "api_key" : "h0o1g2e3f4u5ga",
  "blog_id" : "basd4g.hatenablog.com"
}
```

This API key is fake.

Please register your user id, API key, and blog id.

## License

MIT

## Author

[basd4g](https://github.com/basd4g)

