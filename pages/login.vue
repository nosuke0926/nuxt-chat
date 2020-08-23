<template>
  <div class="flex justify-center">
    <div
      class="flex items-center flex-col h-48 mt-20 w-4/5 p-4 bg-white shadow rounded"
    >
      <div class="w-full border-b pb-2 mb-10">
        <p class="text-center">ログイン</p>
      </div>

      <form class="w-full" @submit.prevent="onGoogleSubmit">
        <button
          type="submit"
          class="w-full bg-google py-3 px-10 text-white rounded hover:outline-none hover:shadow-outline border"
        >
          Googleでログイン
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onGoogleSubmit() {
      // FirebaseのGoogleログイン用プロバイダーを作成
      const provider = new this.$firebase.auth.GoogleAuthProvider();

      // 引数で受け取ったプロバイダーのログイン画面にリダイレクトする
      this.$fireAuth.signInWithRedirect(provider);
    }
  }
};
</script>
