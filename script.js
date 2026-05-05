const chat = document.getElementById("chat");
const input = document.getElementById("msg");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");

let messages = JSON.parse(localStorage.getItem("chat") || "[]");

// عرض المحفوظ
messages.forEach(addMsg);

function addMsg(m) {
  const div = document.createElement("div");
  div.className = `msg ${m.role === "user" ? "user" : "bot"}`;
  div.textContent = m.content;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function save() {
  localStorage.setItem("chat", JSON.stringify(messages.slice(-20)));
}

function typingIndicator() {
  const div = document.createElement("div");
  div.className = "msg bot typing";
  div.id = "typing";
  div.textContent = "… يكتب";
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById("typing");
  if (t) t.remove();
}

async function send() {
  const text = input.value.trim();
  if (!text) return;

  const userMsg = { role: "user", content: text };
  messages.push(userMsg);
  addMsg(userMsg);
  save();
  input.value = "";

  typingIndicator();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text, history: messages })
    });

    const data = await res.json();
    removeTyping();

    const botMsg = {
      role: "assistant",
      content: data.reply || data.error || "خطأ"
    };

    messages.push(botMsg);
    addMsg(botMsg);
    save();

  } catch (e) {
    removeTyping();
    addMsg({ role: "assistant", content: "❌ خطأ في الاتصال" });
  }
}

sendBtn.onclick = send;

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") send();
});

clearBtn.onclick = () => {
  localStorage.removeItem("chat");
  location.reload();
};
