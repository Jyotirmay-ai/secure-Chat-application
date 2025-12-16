document.addEventListener('DOMContentLoaded', () => {
    // 1. Your specific Ngrok URL (I added the one you gave me)
    const GATEWAY_URL = 'https://serried-gauziest-tamar.ngrok-free.dev'; 

    // 2. Connect with the special "Skip Warning" header (Fixes the connection error)
    const socket = io(GATEWAY_URL, {
        transportOptions: {
            polling: {
                extraHeaders: {
                    "ngrok-skip-browser-warning": "69420" 
                }
            }
        }
    });

    // --- UI Elements ---
    const myOnionIdDisplay = document.getElementById('my-onion-id');
    const statusDisplay = document.getElementById('connection-status');
    const chatWindow = document.getElementById('chat-window');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const keyInput = document.getElementById('enc-key');

    let myIdentity = 'Anonymous';

    // --- Connection Logic ---
    socket.on('connect', () => {
        console.log("✅ Connected to Server!");
        statusDisplay.textContent = 'Connected (Ghost Mode)';
        statusDisplay.classList.remove('offline');
        statusDisplay.classList.add('online');
    });

    socket.on('connect_error', (err) => {
        console.error("❌ Connection Error:", err);
        statusDisplay.textContent = 'Connection Failed';
        statusDisplay.classList.add('offline');
    });

    socket.on('onion_address', (data) => {
        myOnionIdDisplay.textContent = data.address;
        myIdentity = data.address; 
    });

    socket.on('message', (data) => {
        displayMessage(data);
    });

    // --- Sending Logic ---
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
                sender: 'GhostUser' 
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



