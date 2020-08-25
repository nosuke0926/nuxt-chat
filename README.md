# nuxt-chat

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

---

## Firestore Test

- Firestore のエミュレータを起動する

```
$ firebase emulators:start --only firestore
```

- テストを実行

```
$ npm run test
```

- セキュリティルールを反映

```
$ firebase deploy --only firestore
```

## Build

- Nuxt アプリケーションをビルドする

```
$ npm run build
```

- Firebase Hosting にアップロード

```
$ firebase deploy
```
