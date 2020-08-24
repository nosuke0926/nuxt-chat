<template>
  <div class="m-4 p-4 bg-white shadow rounded">
    <h2 class="text-2xl text-center text-darkGray">アカウント登録</h2>
    <form @submit.prevent="onSubmit">
      <div class="flex items-center justify-center flex-col w-full h-full mt-8">
        <div
          :class="{ 'border-red-500': form.imageUrl.errorMessage }"
          class="flex items-center justify-center w-32 h-32 bg-gray-200 rounded-full border border-gray-400"
        >
          <!-- 画像の設定有無で表示を出しわけ -->
          <template v-if="form.imageUrl.val">
            <img
              :src="form.imageUrl.val"
              class="w-32 h-32 object-cover border rounded-full"
              @click="selectImage"
            />
          </template>
          <template v-else>
            <i class="material-icons text-7xl text-gray" @click="selectImage">person</i>
          </template>
          <input
            type="file"
            ref="image"
            style="display:none"
            accept="image/*"
            @change="onSelectFile"
          />
        </div>
        <span v-show="form.imageUrl.errorMessage" class="text-red text-sm">
          {{
          form.imageUrl.errorMessage
          }}
        </span>
      </div>
      <label class="block mt-8 mb-2 ml-2 uppercase tracking-wide text-darkGray text-sm">名前</label>
      <div class="h-20 mb-6">
        <input
          v-model="form.name.val"
          type="text"
          :class="{ 'border-red-500': form.name.errorMessage }"
          class="block w-full py-3 px-4 appearance-none bg-gray-200 text-darkGray border rounded leading-tight focus:outline-none focus:bg-white"
          @blur="validateName"
        />
        <span v-show="form.name.errorMessage" class="text-red text-sm">
          {{
          form.name.errorMessage
          }}
        </span>
      </div>
      <div class="flex">
        <button
          class="w-full p-3 gradation rounded-full text-white focus:outline-none focus:shadow-outline"
        >登録</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  middleware: ["checkRegister"],
  // dataプロパティ←画面の状態を保存しておく場所。dataの中身の状態に変更が発生すると、画面の表示もdataの変更に合わせて変わる
  data() {
    return {
      form: {
        name: {
          label: "名前",
          val: null,
          errorMessage: null,
        },
        imageUrl: {
          label: "アイコン画像",
          val: null,
          errorMessage: null,
        },
      },
    };
  },
  computed: {
    isValidateError() {
      return this.form.name.errorMessage || this.form.imageUrl.errorMessage;
    },
  },
  methods: {
    ...mapMutations("alert", ["setMessage"]),
    // inputにref="image"を指定することで、this.$refs.属性名 で指定したDOM要素にアクセスが可能。
    // 今回はinputタグに対してclickイベントを発火させている
    selectImage() {
      this.$refs.image.click();
    },
    onSelectFile(e) {
      const files = e.target.files;
      if (files.length === 0) return;

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.addEventListener("load", () => {
        this.upload({
          localImageFile: files[0],
        });
      });
    },
    // @todo 画像再アップロード時に以前のファイルを削除する
    async upload({ localImageFile }) {
      const user = await this.$auth();
      // 未ログインの場合
      if (!user) this.$router.push("/login");

      // ストレージオブジェクト作成
      const storageRef = this.$fireStorage.ref();

      // ファイルのパスを設定
      const imageRef = storageRef.child(
        `images/${user.uid}/${localImageFile.name}`
      );

      // ファイルを適用してファイルアップロード開始
      const snapShot = await imageRef.put(localImageFile);
      this.form.imageUrl.val = await snapShot.ref.getDownloadURL();

      this.validateImageUrl();
    },
    // バリデーション
    validateName() {
      const { name } = this.form;
      const maxLength = 8;

      if (!name.val) {
        name.errorMessage = `${name.label}は必須です`;
        return;
      }
      if (name.val.length > maxLength) {
        name.errorMessage = `${name.label}は${maxLength}文字以内です`;
        return;
      }
      name.errorMessage = null;
    },
    validateImageUrl() {
      const { imageUrl } = this.form;

      if (!imageUrl.val) {
        imageUrl.errorMessage = `${imageUrl.label}は必須です`;
        return;
      }
      imageUrl.errorMessage = null;
    },
    async onSubmit() {
      const user = await this.$auth();
      // 未ログインの場合
      if (!user) this.$router.push("/login");

      this.validateName();
      this.validateImageUrl();

      if (this.isValidateError) return;

      try {
        await this.$firestore.collection("users").doc(user.uid).set({
          name: this.form.name.val,
          iconImageUrl: this.form.imageUrl.val,
        });
        this.$router.push("/");
      } catch (e) {
        console.log(e);
        this.setMessage({ message: "登録に失敗しました" });
      }
    },
  },
};
</script>
