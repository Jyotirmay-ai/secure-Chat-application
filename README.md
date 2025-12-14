# Onion-Chat-Project

# 👻 Ghost Protocol Chat
**An Ephemeral, Onion-Routed, End-to-End Encrypted Chat System.**

> "You were never here."

Ghost Protocol is a hybrid secure messaging application. It combines the anonymity of the **Tor Network** with the accessibility of the clear web. Messages are encrypted in the browser, routed through a blind relay, and exist only in RAM. Once the session ends, the data vanishes.

---

## 🏗 Architecture

This project uses a unique **"Gateway" Architecture** to make Tor Hidden Services accessible to normal users (Chrome/Safari) without requiring the Tor Browser.



1.  **The Vault (Backend):** A Python/Flask server running locally on your machine. It spins up an ephemeral **Tor Hidden Service**.
2.  **The Bridge (Tunnel):** **Ngrok** tunnels traffic from the public internet securely to your local vault.
3.  **The Interface (Frontend):** A static HTML/JS site hosted on **Netlify**.
4.  **The Lock (Security):** **Client-Side AES Encryption**. The server *never* sees the message text, only encrypted gibberish.

---

## 🌟 Features

* **🧅 Onion Routing:** The backend logic is hidden behind the Tor network.
* **🔐 End-to-End Encryption:** Messages are encrypted with AES-256 in the browser before they ever touch the network.
* **👻 Ephemeral by Design:** No database. No logs. All data lives in RAM and is wiped when the server stops.
* **⚡ Real-Time:** Uses WebSockets (Socket.IO) for instant communication.
* **🔓 Zero-Trust Server:** The server acts as a blind courier; it cannot read the messages it relays.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your "Server" machine (your laptop/PC):

* **Python 3.x**
* **Tor** (The service/browser must be installed and added to your System PATH)
* **Ngrok** (For tunneling)
* **Git**

---

## 🚀 Setup Guide (Once Access is Granted)

1.  **Open the Link:** Navigate to the URL provided in the DM.
2.  **Set a Key:** You and your chat partner must agree on a **Secret Password**.
3.  **Enter the Key:** Type the password into the "Encryption Key" box.
4.  **Chat:** Type your message.
    * *If the keys match:* You see green `[SECURE]` text.
    * *If the keys don't match:* You see red `[LOCKED]` `[BAD KEY]` gibberish.

---

## ⚠️ Legal & Liability Disclaimer

This project was created for **educational and portfolio purposes only**. The creator does not condone the use of this software for any illegal activities. The backend code is withheld to prevent abuse. Use the live demo responsibly.

---

## 🔒 Why is the Backend Code Hidden?

You might notice that the core backend logic (the `app.py` and Tor configuration) is not fully exposed in this repository. **This is an intentional security decision.**

Due to the powerful nature of Onion Routing and ephemeral encryption, there is a significant risk if this technology falls into the wrong hands or is used for malicious purposes. To prevent misuse, I have kept the "Ghost Engine" closed-source for now.

### 🧪 Want to Try It?
I am looking for responsible testers and developers who want to see the Ghost Protocol in action.

* **Step 1:** Follow me on Instagram.
* **Step 2:** Send me a DM with the word **"GHOST"**.
* **Step 3:** I will share the access link and credentials so you can test the live version securely.

👉 **Instagram:** [@Jyotirmay_Biswas](https://www.instagram.com/its_jyotirmay_biswas/)

---
