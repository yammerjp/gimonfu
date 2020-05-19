[English](README.md) / Japanese

# gimonfu

![logo](logo.png)

gimonfuは、はてなブログの記事管理 CLIアプリケーションです。

投稿記事を一括でMarkdownファイルとしてダウンロードしたり、編集/追加した記事を一括で公開したりできます。

## 準備

```sh
# 事前に編集モードをMarkdownモードに設定する。(はてなブログ > 設定 > 基本設定)
# https://help.hatenablog.com/entry/editing-mode

$ yarn global add gimonfu
#   or $ npm install --global gimonfu

$ mkdir blog
$ cd blog

# はじめに`$ gimonfu init`を実行し、`.gimonfu.json`に認証情報を書き込む。
$ gimonfu init
```

## 使い方

### `$ gimonfu init`

認証情報を登録します。

`$ gimonfu  pull`や`$ gimonfu push`を実行する前に行ってください。

認証情報の登録は、カレントディレクトリに`.gimonfu.json`ファイルを生成することで行われます。
このコマンドを実行せずに、手動で`.gimonfu.json`を作成しても構いません。

### `$ gimonfu pull`

記事を`entry/`以下にダウンロードします。

ダウンロードする先に既にファイルが存在するときは、公開された記事のほうが新しいときのみファイルを上書きします。

### `$ gimonfu push`

`entry/`以下のファイルの中で新しいものを、新規投稿/更新します。

このとき、entryディレクトリからの相対パスが、カスタムURLとして設定されます。

#### 投稿/更新される記事の判断

次に該当するファイルを新規投稿します。

- YAML Frontmatterに記事idがない

次に該当するファイルを既に公開された記事から更新します

- YAML Frontmatterに記事idがある
- 既に公開された記事と比べて、変更がある
- 既に公開された記事と比べて、最終更新日時が新しい

#### ファイルの上書き

新規投稿/更新が行われると、投稿された内容に一致するようファイルの内容も上書きされます。

例えば、新規投稿時にはyaml-front-matterにidが書き込まれたり、新規投稿/更新前にyaml-front-matterに不要なフィールドがあると削除されたりします。

### ディレクトリ構成

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

`$ gimonfu init`により作成され、 ブログIDや認証情報を記録したファイルです。
APIキーを含むので流出しないように管理してください。

`.gimonfu.json`のあるディレクトリを基準に記事をダウンロード/アップロードします。
p`.gimonfu.json`
基本ディレクトリとそれより下位のディレクトリにいるとき、`$ gimonfu pull`と`$ gimonfu push`を実行できます。

次のキーとそれに対応する値を含む必要が有ります。

- "user_id" ...  はてなのユーザID
- "api_key" ...  AtomPub APIキー (はてなブログ>設定>詳細設定 から入手できます)
- "blod_id" ...  ブログID (ブログのドメイン名。独自ドメインを利用している場合は、以前のドメインがブログID)

ファイルの例を示します。必ず自分の認証情報に変えて利用してください。

```.gimonfu.json
{
  "user_id" :  "basd4g",
  "api_key" : "h0o1g2e3f4u5ga",
  "blog_id" : "basd4g.hatenablog.com"
}
```

#### `entry/`

記事を保存するディレクトリです。
初めて`$ gimonfu pull`を実行したとき、`.gimonfu.json`のあるディレクトリに作られます。

公開されるブログのURLの末尾と、entryディレクトリ内部の構造は一致します(ファイル末尾の拡張子`.md`を除く)。
これは、Gimonfuによって公開された記事はすべてカスタムURLが設定されることで実現しています。

#### 記事ファイル

`entry/`以下に保存されるmarkdownファイルはそれぞれ記事ファイルです。

ファイルは次のようなフォーマットです。YAML Frontmatter形式で始まります。

```md
---
title: 記事タイトル
date: 2019-09-16T16:37:00.000Z
categories:
  - 1つ目のカテゴリ
  - 2つ目のカテゴリ
id: "26006613568876375"
---
記事の本文が以下続きます。...
```

YAML Frontmatterの項目は次の通り

- title ... 記事タイトル
- date ... 投稿日時
- categories ... カテゴリの配列
- id ... 記事のID (変更を加えないでください)(新規投稿時はこの項目(行)は不要です。投稿時に自動で付加されます。)

## 注意

### バージョン管理システムの利用

pull や push を実行すると、ローカルのファイル群と公開されている記事群をそれぞれ、新規作成/上書き/削除します。

記事の不用意な削除に備えて、gitなどの__バージョン管理システムで記事ファイルを管理することを強く推奨します。__

なおgitを使用する際、認証情報の含まれる`.gimonfu.json`はリポジトリに含めるべきではありません。
例えば次のように`.gitignore`にて除外する設定をすると、リポジトリに含めないようにできます。

```.gitignore
.gimonfu.json
```

## License

MIT

## Author

[basd4g](https://github.com/basd4g)
