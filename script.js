 // 🔥 Firebase Config (YOURS)
const firebaseConfig = {
  apiKey: "AIzaSyDjQr6aFVRdaLM87GpLrqezraEUaeGzW_M",
  authDomain: "private-chat-1cc2f.firebaseapp.com",
  databaseURL: "https://private-chat-1cc2f-default-rtdb.firebaseio.com",
  projectId: "private-chat-1cc2f",
  storageBucket: "private-chat-1cc2f.appspot.com",
  messagingSenderId: "516402232030",
  appId: "1:516402232030:web:e56df7e27d7a9f3f0de04f"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

const chatBox = document.getElementById("chatBox");
const otherIdInput = document.getElementById("otherId");
const messageInput = document.getElementById("message");
const myIdDisplay = document.getElementById("myIdDisplay");

let myId = null;

// 🔐 Anonymous Login
auth.signInAnonymously().then(() => {
  myId = auth.currentUser.uid;
  myIdDisplay.textContent = myId;
}).catch(err => alert(err.message));

// Chat key (same for both users)
function chatKey() {
  if (!myId || !otherIdInput.value) return null;
  return [myId, otherIdInput.value.trim()].sort().join("_");
}

// Send message
function sendMessage() {
  const key = chatKey();
  if (!key || !messageInput.value.trim()) return;

  db.ref("chats/" + key).push({
    sender: myId,
    text: messageInput.value,
    time: Date.now()
  });

  messageInput.value = "";
}

// Load messages
function loadMessages() {
  const key = chatKey();
  if (!key) return;

  db.ref("chats/" + key).on("value", snap => {
    chatBox.innerHTML = "";
    snap.forEach(msg => {
      const data = msg.val();
      const div = document.createElement("div");
      div.className = "msg " + (data.sender === myId ? "sent" : "received");
      div.textContent = data.text;
      chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

// Reload when friend ID changes
otherIdInput.addEventListener("input", loadMessages);



