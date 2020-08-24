export default async function ({
  redirect,
  app
}) {
  // すでにアカウント作成済みの場合はTOPページにリダイレクト
  if (await app.$user()) {
    redirect('/')
  }
}
