// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyCS2wtY9t-0RCzdQ1aRgeLY5gIw9cXIQeQ",
  authDomain: "amakawachat.firebaseapp.com",
  projectId: "amakawachat",
  storageBucket: "amakawachat.appspot.com",
  messagingSenderId: "312751800216",
  appId: "1:312751800216:web:5b7541d3aeb08374aab5ed",
  measurementId: "G-C5P80QDS1E"
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
      window.location.href = 'chat-send.html';
    })
    .catch((error) => {
      console.error('ログイン失敗:', error);
      alert('ログインに失敗しました。');
    });
});

// 新規登録処理
const registerButton = document.getElementById('register-button');
registerButton.addEventListener('click', () => {
  const email = document.getElementById('register-email').value;
  const
