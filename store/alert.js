// 実際の状態が保存される場所
export const state = () => ({
  message: null
})

// コンポーネントからstoreのデータを参照するときに使用
export const getters = {
  message: (state) => state.message
}

// stateを変更するときに呼ばれる
// stateは直接変更することはできず、mutationを介して値を変更する
export const mutations = {
  setMessage(state, {
    message
  }) {
    state.message = message
  },
  deleteMessage(state) {
    state.message = null
  }
}
