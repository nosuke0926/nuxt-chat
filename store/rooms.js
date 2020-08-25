export const state = () => ({
  rooms: []
})

export const getters = {
  rooms: (state) => state.rooms
}

export const mutations = {
  add(state, {
    room
  }) {
    const isNotAdded = !state.rooms.find((r) => r.id === room.id)
    // 同じIDのデータが存在しなければ、配列の先頭に追加
    if (isNotAdded) {
      state.rooms.unshift(room)
    }
  },
  update(state, {
    room
  }) {
    state.rooms = state.rooms.map((r) => {
      if (r.id === room.id) {
        r = room
      }
      return r
    })
  },
  remove(state, {
    room
  }) {
    state.rooms = state.rooms.filter((r) => r.id !== room.id)
  },
  clear(state) {
    state.rooms = []
  }
}

// Actionは非同期な外部のAPIの呼び出しを行う場所
// APIから受け取ったデータはMutationを通してStateに反映される
export const actions = {
  subscribe({
    commit
  }) {
    // データの追加・更新・削除を検知して検知
    return this.$firestore.collection('rooms').orderBy('createdAt', 'asc').onSnapshot((roomsSnapShot) => {
      roomsSnapShot.docChanges().forEach((snapshot) => {
        const room = {
          id: snapshot.doc.id,
          ...snapshot.doc.data()
        }

        console.log('タイプ: ' + snapshot.type)

        // ドキュメントに発生したイベントの種類に応じて処理を分岐
        switch (snapshot.type) {
          case 'added':
            commit('add', {
              room
            })
            break
          case 'modified':
            commit('update', {
              room
            })
            break
          case 'removed':
            commit('remove', {
              room
            })
            break
        }
      })
    })
  },

  clear({
    commit
  }) {
    commit('clear')
  }
}
