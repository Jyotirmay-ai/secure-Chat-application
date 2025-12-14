
document.addEventListener('DOMContentLoaded', () => {
    // CONFIGURATION: Set this if hosting on Netlify/Vercel (e.g., 'https://my-gateway-server.com')
    // If null, it connects to the same domain (localhost).
    // PASTE YOUR NGROK URL HERE (No trailing slash)
    // const GATEWAY_URL = 'https://YOUR-ID-HERE.ngrok-free.app';
    const GATEWAY_URL = 'https://serried-gauziest-tamar.ngrok-free.dev';


    const socket = io(GATEWAY_URL);

    // UI Elements
    const myOnionIdDisplay = document.getElementById('my-onion-id');
    const statusDisplay = document.getElementById('connection-status');
    const chatWindow = document.getElementById('chat-window');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const keyInput = document.getElementById('enc-key');

    let myIdentity = 'Anonymous';

    socket.on('connect', () => {
        statusDisplay.textContent = 'Connected to Blind Relay';
        statusDisplay.classList.add('online');
    });

    socket.on('onion_address', (data) => {
        myOnionIdDisplay.textContent = data.address;
        myIdentity = data.address; // Or use a generated ID
    });

    socket.on('message', (data) => {
        displayMessage(data);
    });

    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const rawMessage = messageInput.value;
        const key = keyInput.value;

        if (!rawMessage) return;
        if (!key) {
            alert('⚠️ You must set an Encryption Key first!');
            return;
        }

        // 🔒 Client-Side Encryption
        try {
            const encrypted = CryptoJS.AES.encrypt(rawMessage, key).toString();

            socket.emit('message', {
                message: encrypted,
                sender: 'GhostUser' // In a real app, this might be a session ID
            });

            messageInput.value = '';
        } catch (e) {
            console.error("Encryption failed:", e);
            alert("Encryption failed. Check console.");
        }
    }

    function displayMessage(data) {
        const encryptedContent = data.message;
        const key = keyInput.value;

        const msgDiv = document.createElement('div');
        msgDiv.style.marginBottom = '10px';
        msgDiv.style.padding = '5px';
        msgDiv.style.borderBottom = '1px solid #333';

        if (!key) {
            // No key -> Show Gibberish
            msgDiv.innerHTML = `<span style="color:red">[LOCKED]</span> <span style="font-family:monospace; color:#555;">${encryptedContent.substring(0, 20)}...</span>`;
        } else {
            try {
                // 🔓 Attempt Decryption
                const bytes = CryptoJS.AES.decrypt(encryptedContent, key);
                const originalText = bytes.toString(CryptoJS.enc.Utf8);

                if (originalText) {
                    msgDiv.innerHTML = `<span style="color:#0f0">[SECURE]</span> ${originalText}`;
                } else {
                    // Decryption produced nothing valid (wrong key probably)
                    msgDiv.innerHTML = `<span style="color:orange">[BAD KEY]</span> <span style="font-family:monospace; color:#555;">${encryptedContent.substring(0, 20)}...</span>`;
                }
            } catch (e) {
                // Decryption error
                msgDiv.innerHTML = `<span style="color:red">[ERROR]</span> <span style="font-family:monospace; color:#555;">${encryptedContent.substring(0, 20)}...</span>`;
            }
        }

        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});
