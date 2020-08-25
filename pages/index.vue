<template>
  <div>
    <div>
      <div
        v-for="room in rooms"
        :key="room.id"
        @click="moveToRoomPage(room.id)"
        class="bg-white max-w-sm rounded-lg overflow-hidden shadow m-4 mb-5 p-4 h-32"
      >
        <div>
          <img :src="room.topImageUrl" class="float-left object-cover rounded-lg w-24 h-24 mr-4" />
          <p class="font-mono text-darkGray">{{room.name}}</p>
        </div>
      </div>
    </div>

    <!-- ルーム作成ボタン -->
    <div class="fixed flex justify-end bottom-0 w-full max-w-sm">
      <button @click="openModal">
        <i class="material-icons text-primary text-7xl create-btn gradation">add_circle</i>
      </button>
    </div>

    <!-- ルーム作成Modal -->
    <!-- ModalBaseで囲っている中身が<slot />と指定した箇所に展開される -->
    <!-- slot・・・振る舞いや基本的なデザインは同じだけど一部デザインが異なる物を共通化するときに使う -->
    <ModalBase v-if="isCreateMode" @closeModal="closeModal">
      <CreateRoomModal @closeModal="closeModal" />
    </ModalBase>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ModalBase from "~/components/ModalBase";
import CreateRoomModal from "~/components/CreateRoomModal";

export default {
  middleware: ["checkAuth"],
  components: {
    ModalBase,
    CreateRoomModal,
  },
  data() {
    return {
      isCreateMode: false,
      unsubscribe: null,
    };
  },
  computed: {
    ...mapGetters("rooms", ["rooms"]),
  },
  // 最初にページを表示したときにFirestoreのチャット部屋一覧を取得する（Vuexに定義したActionを呼び出す）
  async asyncData({ store }) {
    const unsubscribe = await store.dispatch("rooms/subscribe");
    return {
      unsubscribe,
    };
  },
  // 別ページに遷移した際に、リアルタイプアップデートを停止したいので、コンポーネントが破棄される段階でStateを空にして、リアルタイプアップデートを停止する
  // destroyedはVuewインスタンスが破棄された後に呼ばれる
  destroyed() {
    this.$store.dispatch("rooms/clear");
    if (this.unsubscribe) this.unsubscribe();
  },
  methods: {
    moveToRoomPage(roomId) {
      this.$router.push(`/rooms/${roomId}`);
    },
    openModal() {
      this.isCreateMode = true;
    },
    closeModal() {
      this.isCreateMode = false;
    },
  },
};
</script>

<style scoped>
.create-btn {
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>