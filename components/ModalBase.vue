<template>
  <!-- transitionタグを使用することで、囲った要素の表示・非表示に応じて、cssで指定したstyleを付与できる -->
  <transition appear>
    <div
      class="z-10 max-w-sm h-screen w-screen fixed top-0 flex flex-col items-center justify-center modal-wrap"
    >
      <!-- ここにModalの中身が入る -->
      <slot />

      <!-- Modalを閉じるボタン -->
      <button @click="$emit('closeModal')">
        <i class="material-icons text-white text-5xl">clear</i>
      </button>
    </div>
  </transition>
</template>

<style scoped>
/* transitionではv-から始まるクラスを使ってtransitionタグで囲われた要素の状態を設定することができる */

/* v-enter-activeは要素が追加されている間のstyle */
.v-leave-active,
.v-enter-active {
  transition: opacity 0.4s ease-out;
}

/* v-enterが要素が追加される前のstyle */
/* 閉じるときはv-leaveを使い、要素が削除されるときのstyleを定義 */
.v-enter,
.v-leave-to {
  opacity: 0;
}

/* v-enter-toは要素が追加された後のstyle */
.v-enter-to,
.vleave {
  opacity: 1;
}
</style>