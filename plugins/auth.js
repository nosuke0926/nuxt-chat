export default ({
  app
}, inject) => {
  inject('auth', () => {
    // onAuthStateChangedはcallBack関数。
    // 今回はasync/awaitで呼び出したいのでPromiseでラップする
    return new Promise((resolve) => {
      // ログインチェック
      // Vueアプリがインスタンス化される前に実行されるのでthis.$fireAuthではなく、app.$fireAuth
      app.$fireAuth.onAuthStateChanged((auth) => {
        resolve(auth || null)
      })
    })
  })
}
