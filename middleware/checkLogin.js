// 引数のapp,redirectはNuxtのcontextに含まれている
export default async function ({
  redirect,
  app
}) {
  // ログイン中の場合Topページに遷移する
  if (await app.$auth()) {
    redirect('/')
  }
}
