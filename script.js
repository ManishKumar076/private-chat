const chatBox = document.getElementById("chatBox");
const myId = document.getElementById("myId");
const otherId = document.getElementById("otherId");
const messageInput = document.getElementById("message");
const fileInput = document.getElementById("fileInput");

/* Create common chat key for both users */
function chatKey() {
  if (!myId.value || !otherId.value) return null;
  return [myId.value.trim(), otherId.value.trim()].sort().join("_");
}

/* Load all messages (no blinking, clean render) */
function loadMessages() {
  const key = chatKey();
  if (!key) return;

  const messages = JSON.parse(localStorage.getItem(key)) || [];
  chatBox.innerHTML = "";

  messages.forEach((msg, index) => {
    const isMine = msg.sender === myId.value;

    const div = document.createElement("div");
    div.className = `msg ${isMine ? "sent" : "received"}`;

    /* TEXT MESSAGE */
    if (msg.type === "text") {
      div.textContent = msg.text;
    }

    /* FILE MESSAGE */
    if (msg.type === "file") {
      const card = document.createElement("div");
      card.className = "file-card";

      const name = document.createElement("div");
      name.textContent = msg.fileName;
      card.appendChild(name);

      if (msg.fileType.startsWith("image")) {
        const img = document.createElement("img");
        img.src = msg.data;
        img.className = "preview";
        card.appendChild(img);
      }

      const link = document.createElement("a");
      link.href = msg.data;
      link.download = msg.fileName;
      link.textContent = "⬇ Download";
      card.appendChild(link);

      div.appendChild(card);
    }

    /* DELETE BUTTON (ONLY FOR SENDER) */
    if (isMine) {
      const del = document.createElement("span");
      del.className = "delete-msg";
      del.textContent = "Delete";

      del.onclick = (e) => {
        e.stopPropagation();
        deleteSingleMessage(index);
      };

      div.appendChild(del);
    }

    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

/* Send text or file */
function sendMessage() {
  const key = chatKey();
  if (!key) return;

  const messages = JSON.parse(localStorage.getItem(key)) || [];

  if (messageInput.value.trim()) {
    messages.push({
      sender: myId.value,
      type: "text",
      text: messageInput.value.trim()
    });
    messageInput.value = "";
  }

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      messages.push({
        sender: myId.value,
        type: "file",
        fileName: file.name,
        fileType: file.type,
        data: reader.result
      });

      localStorage.setItem(key, JSON.stringify(messages));
      fileInput.value = "";
      loadMessages();
    };

    reader.readAsDataURL(file);
    return;
  }

  localStorage.setItem(key, JSON.stringify(messages));
  loadMessages();
}

/* Delete single message for both users */
function deleteSingleMessage(index) {
  const key = chatKey();
  if (!key) return;

  const messages = JSON.parse(localStorage.getItem(key)) || [];
  messages.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(messages));
  loadMessages();
}

/* Auto refresh */
setInterval(loadMessages, 500);


