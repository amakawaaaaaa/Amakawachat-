// Firebaseの設定
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// Firebase AuthとDatabaseのインスタンスを取得
const auth = firebase.auth();
const database = firebase.database();

// ログイン処理
const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log('ログイン成功:', user);
      showChat();
    })
    .catch((error) => {
      console.error('ログイン失敗:', error);
      alert('ログインに失敗しました。');
    });
});

// 新規登録処理
const registerLink = document.getElementById('register-link');
registerLink.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((user) => {
      console.log('新規登録成功:', user);
      showChat();
    })
    .catch((error) => {
      console.error('新規登録失敗:', error);
      alert('新規登録に失敗しました。');
    });
});

// ログアウト処理
const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', () => {
  auth.signOut()
    .then(() => {
      console.log('ログアウト成功');
      showLogin();
    })
    .catch((error) => {
      console.error('ログアウト失敗:', error);
      alert('ログアウトに失敗しました。');
    });
});

// チャット画面の表示・非表示
const login = document.getElementById('login');
const chat = document.getElementById('chat');

function showLogin() {
  login.style.display = 'block';
  chat.style.display = 'none';
}

function showChat() {
  login.style.display = 'none';
  chat.style.display = 'block';

  // ログイン中のユーザー情報を取得
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    const username = user.displayName || user.email;

    // ログイン中のユーザー名を表示
    const userNameElement = document.getElementById('username');
    userNameElement.textContent = username;

    // メッセージの送受信処理
    const chatMessageInput = document.getElementById('chat-message-input');
    const chatSendButton = document.getElementById('chat-send-button');
    const chatMessages = document.getElementById('chat-messages');

    chatSendButton.addEventListener('click', () => {
      const message = chatMessageInput.value;
      if (message) {
        const timestamp = Date.now();
        database.ref('messages').push({
          userId,
          username,
          message,
          timestamp
        });
        chatMessageInput.value = '';
      }
    });

    database.ref('messages').on('child_added', (snapshot) => {
      const messageData = snapshot.val();
      const messageElement = document.createElement('div');
      messageElement.classList.add('chat-message');

      if (messageData.userId === userId) {
        messageElement.classList.add('my-message');
      }

      messageElement.innerHTML = `
        <span class="username">${messageData.username}:</span>
        <span class="message">${messageData.message}</span>
      `;

      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }
}

// ログイン状態に応じて画面を表示
firebase.auth.onAuthStateChanged((user) => {
  if (user) {
    showChat();
  } else {
    showLogin();
  }
});
