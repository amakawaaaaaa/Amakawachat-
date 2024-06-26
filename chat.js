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

  // メッセージの受信処理
  database.ref('messages').on('child_added', (snapshot) => {
    const messageData = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    const usernameElement = document.createElement('span');
    usernameElement.classList.add('username');
    usernameElement.textContent = messageData.username + ': ';

    const messageTextElement = document.createElement('span');
    messageTextElement.classList.add('message-text');
    messageTextElement.textContent = messageData.message;

    messageElement.appendChild(usernameElement);
    messageElement.appendChild(messageTextElement);
    chatMessages.appendChild(messageElement);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
} else {
  // ログインしていない場合は、ログイン画面へ遷移
  window.location.href = 'login.html';
}
