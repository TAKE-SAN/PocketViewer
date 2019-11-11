# PocketViewer
AWS S3のファイルビューアーです。

↓の情報だけあれば、よしなにビューアーを作成してくれます。(`dotenv`で情報は管理しています)
```
AccessKeyId
SecretAccessKey
EndPoint
Bucket
region
```

## 機能要件
- ディレクトリ/ファイル参照
- ディレクトリ/ファイルのS3アップロード
- パンくずリスト機能(クリックで遡れます)

## 使用技術
- Nuxt.js(Vue.js)
- Vuetify

## Build Setup
``` bash
# create env file
# Please change the .env_dev file
$ cp .env.template .env_dev

# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev
```

## 画面
<img width="1093" alt="スクリーンショット 2019-11-11 23 18 16" src="https://user-images.githubusercontent.com/14174467/68594226-745f3680-04da-11ea-9540-a176a5a93648.png">
