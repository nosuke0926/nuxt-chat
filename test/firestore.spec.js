import * as fs from "fs";
import * as firebase from "@firebase/testing";

const testName = "firestore-test";

describe(testName, () => {
  // 一度だけ実行（初期化）
  beforeAll(async () => {
    // 定義したFirestoreルールを読み込む
    await firebase.loadFirestoreRules({
      projectId: testName,
      rules: fs.readFileSync("firestore.rules", "utf8")
    });
  });

  // テスト終了後にデータリセット（ブロックが終わるたび実行）
  afterEach(async () => {
    await firebase.clearFirestoreData({
      projectId: testName
    });
  });

  // 最後にアプリを削除（終わった後に一度だけ実行）
  afterAll(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()));
  });

  // 認証済みのDFirestore
  function authDB(auth) {
    return firebase
      .initializeTestApp({
        projectId: testName,
        auth: auth
      })
      .firestore();
  }

  // 未認証のFirestore
  function noAuthDB() {
    return firebase
      .initializeTestApp({
        projectId: testName,
        auth: null
      })
      .firestore();
  }

  describe("user collectionのテスト", () => {
    describe("read", () => {
      test("未ログインの場合、ユーザーデータ取得に失敗するかどうか", async () => {
        const db = noAuthDB();
        await firebase.assertFails(
          db
          .collection("users")
          .doc("tech-user")
          .get()
        );
      });
      test("ログイン済の場合、ユーザーデータを取得できるかどうか", async () => {
        const db = authDB({
          uid: "tech-user"
        });
        await firebase.assertSucceeds(
          db
          .collection("users")
          .doc("tech-user")
          .get()
        );
      });
    });

    describe("create", () => {
      test("自分のアカウントのデータを作成できるかどうか", async () => {
        const db = authDB({
          uid: "tech-user"
        });
        await firebase.assertSucceeds(
          db
          .collection("users")
          .doc("tech-user")
          .set({
            name: "testUser",
            iconImageUrl: "https://example.com"
          })
        );
      });
      test("ユーザー名が未入力の場合、作成に失敗するかどうか", async () => {
        const db = authDB({
          uid: "tech-user"
        });
        await firebase.assertFails(
          db
          .collection("users")
          .doc("tech-user")
          .set({
            name: "",
            iconImageUrl: "https://example.com"
          })
        );
      });
      test("アイコン画像が未入力の場合、作成に失敗するかどうか", async () => {
        const db = authDB({
          uid: "tech-user"
        });
        await firebase.assertFails(
          db
          .collection("users")
          .doc("tech-user")
          .set({
            name: "testUser",
            iconImageUrl: ""
          })
        );
      });
      test("他人のアカウントのデータは作成に失敗するかどうか", () => {
        const db = authDB({
          uid: "tech-user"
        });
        firebase.assertFails(
          db
          .collection("users")
          .doc("tech-user2")
          .set({
            name: "testUser",
            iconImageUrl: "https://exampla.com"
          })
        );
      });
    });
  });



  describe('rooms collectionのテスト', () => {
    describe('read', () => {
      test('未ログインの場合、Roomデータ取得に失敗するかどうか', async () => {
        const db = noAuthDB();
        await firebase.assertFails(db.collection('rooms').doc('tech-room').get());
      });
      test('ログイン済みの場合、Roomデータを取得できるか', async () => {
        const db = authDB({
          uid: 'tech-user'
        });
        await firebase.assertSucceeds(
          db.collection('rooms').doc('tech-room').get()
        );
      });
    });

    describe('create', () => {
      test('Roomのデータを作成できるかどうか', async () => {
        const db = authDB({
          uid: 'tech-user'
        });

        await firebase.assertSucceeds(
          db.collection('rooms').doc('tech-room').set({
            name: '〇〇について話す部屋です',
            topImageUrl: 'https://example.com',
            createdAt: new Date(),
          })
        );
      });
      test('部屋名が未入力の場合、作成に失敗するかどうか', async () => {
        const db = authDB({
          uid: 'tech-user'
        });
        await firebase.assertFails(
          db.collection('rooms').doc('tech-room').set({
            name: '',
            topImageUrl: 'https://example.com',
            createdAt: new Date(),
          })
        );
      });
      test('Top画像が未入力の場合、作成に失敗するかどうか', async () => {
        const db = authDB({
          uid: 'tech-user'
        });
        await firebase.assertFails(
          db.collection('rooms').doc('tech-room').set({
            name: 'tech-room',
            topImageUrl: '',
            createdAt: new Date(),
          })
        );
      });
      test('作成日が未入力の場合、作成に失敗するかどうか', async () => {
        const db = authDB({
          uid: 'tech-user'
        });
        await firebase.assertFails(
          db.collection('rooms').doc('tech-room').set({
            name: 'tech-room',
            topImageUrl: 'https://example.com',
            createdAt: '',
          })
        );
      });
    });
  });

  describe('chats collectionのテスト', () => {
    // テストを実行する前に毎回roomを作成(chatはroom配下にあるため、roomのデータが先に登録されている必要がある)
    beforeEach(async () => {
      const db = authDB({
        uid: 'tech-user'
      })
      await firebase.assertSucceeds(
        db.collection('rooms').doc('tech-room').set({
          name: '〇〇について話す部屋です',
          topImageUrl: 'https://example.com',
          createdAt: new Date()
        })
      )
    })

    describe('read', async () => {
      test('未ログインの場合、chatデータ取得に失敗するか', async () => {
        const db = noAuthDB()
        await firebase.assertFails(
          db.collection('rooms').doc('tech-room').collection('chats').get()
        )
      })
      test('ログイン済みの場合、chatデータ取得できるか', async () => {
        const db = authDB({
          uid: 'tech-user'
        })
        await firebase.assertSucceeds(
          db.collection('rooms').doc('tech-room').collection('chats').get()
        )
      })
    })

    describe('create', () => {
      test('chatのデータを作成できるか', async () => {
        const db = authDB({
          uid: 'tech-user'
        })
        await firebase.assertSucceeds(
          db.collection('rooms').doc('tech-room').collection('chats').add({
            userId: 'tech-user',
            name: 'testUser',
            iconImageUrl: 'https://example.com',
            body: 'こんにちは',
            createdAt: new Date(),
          })
        )
      })
      test('userIdが自分以外の場合、作成に失敗するか', async () => {
        const db = authDB({
          uid: 'tech-user'
        })
        await firebase.assertFails(
          db.collection('rooms').doc('tech-room').collection('chats').add({
            userId: 'tech-user2',
            name: 'testUser',
            iconImageUrl: 'https://example.com',
            body: 'こんにちは',
            createdAt: new Date(),
          })
        )
      })
      test('nameが未入力の場合、作成に失敗するか', async () => {
        const db = authDB({
          uid: 'tech-user'
        })
        await firebase.assertFails(
          db.collection('rooms').doc('tech-room').collection('chats').add({
            userId: 'tech-user',
            name: '',
            iconImageUrl: 'https://example.com',
            body: 'こんにちは',
            createdAt: new Date(),
          })
        )
      })
      test('iconImageUrlが未入力の場合、作成に失敗するか', async () => {
        const db = authDB({
          uid: 'tech-user'
        })
        await firebase.assertFails(
          db.collection('rooms').doc('tech-room').collection('chats').add({
            userId: 'tech-user',
            name: 'testUser',
            iconImageUrl: '',
            body: 'こんにちは',
            createdAt: new Date(),
          })
        )
      })
      test('bodyが未入力の場合、作成に失敗するか', async () => {
        const db = authDB({
          uid: 'tech-user'
        })
        await firebase.assertFails(
          db.collection('rooms').doc('tech-room').collection('chats').add({
            userId: 'tech-user',
            name: 'testUser',
            iconImageUrl: 'https://example.com',
            body: '',
            createdAt: new Date(),
          })
        )
      })
      test('createdAtが未入力の場合、作成に失敗するか', async () => {
        const db = authDB({
          uid: 'tech-user'
        })
        await firebase.assertFails(
          db.collection('rooms').doc('tech-room').collection('chats').add({
            userId: 'tech-user',
            name: 'testUser',
            iconImageUrl: 'https://example.com',
            body: 'こんにちは',
            createdAt: '',
          })
        )
      })
    })
  })

});
