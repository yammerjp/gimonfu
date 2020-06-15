English / [Japanese](README_ja.md)

# gimonfu

![logo](logo.png)

gimonfu is a CLI tool to manage articles of Hatena-blog.

gimonfu upload(download) markdown files to(from) Hatena-blog.

## Setup

```sh
# Set the edit mode to Markdown. (Hatena-Blog > Settings > Basic Settings)

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

Credentials are registered by creating a `.gimonfu.json` file in the current directory.
You can also create `.gimonfu.json` manually without executing this command.

### Download Articles

To download new or updated articles to `entry/` directory, you can run like this:

```sh
$ gimonfu pull
```

### Upload Articles

To upload new or updated articles in `entry/` directory, you can run like this:

```sh
$ gimonfu push
```

The relative path from the  `entry/` directory is set as a custom URL with uploading.

#### Judging posts/updates

Post a new file that corresponds to the following.

- YAML-Frontmatter doesn't have an article ID.

Update the following files from an already published article.

- YAML-Frontmatter has the article ID.
- There are any changes.
- The last update date is newer than the one already published.

#### Overwriting a file

When a new post/update is made, the contents of the file will also be overwritten to match the content of the post.

For example, an ID is written into the YAML-Frontmatter when new posts are made, or they are deleted, if there are unnecessary fields in the YAML-Frontmatter before new posts/updates are made.

### Directory Structure

```
.
├── .gimonfu.json
└── entry
     ├── hello.md
     ├── 2020
     │   └── 05
     │        └── 09
     │             └── 10101010.md
     └── ...
```

#### `.gimonfu.json`

The format is like this:

```.gimonfu.json
{
  "user_id" :  "basd4g",
  "api_key" : "h0o1g2e3f4u5ga",
  "blog_id" : "basd4g.hatenablog.com"
}
```

This API key is fake.

Please register your user id, API key, and blog id.

#### `entry/`

All articles are stored in the directory.

The structure in the directory is the same as the end of the published article URL (expect for `.md` at the end of the file).

This is accomplished by setting a custom URL for every post when it is posted/updated.

#### Article File

Each article is saved in markdown format under `entry/`.

The format is like this:

```md
---
title: Hello!
date: 2019-09-16T16:37:00.000Z
categories:
  - essay
  - happy day
id: "26006613568876375"
draft: true
---
The body of the article continues below...
```

The ID of the article is not needed for a new post.
It is automatically appended when you post.
And please do not make any changes.

The line of `draft: true` is option.
If it is not exist, it is expected public.

## Caution

__USE GIT__

A pull or push may create/overwrite/delete local files and published articles.
It is highly recommended that you manage your article files in a version control system such as git in case of inadvertent deletion of the article.

If you use git, you must not include `.gimonfu.json` in the repository, which contains credentials.

## GitHub Actions

You can sync Hatena-blog and GitHub to use gimonfu on GitHub Actions.

My blog is an example. ([Hatena-blog](https://basd4g.hatenablog.com) / [GitHub Repository](https://github.com/basd4g/basd4g.hatenablog.com))

## License

MIT

## Author

[basd4g](https://github.com/basd4g)

