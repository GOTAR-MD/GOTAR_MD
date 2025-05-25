Here’s your complete `README.md` content in English, ready to copy and paste:

---

```markdown
🤖 GOTAR-XMD

*GOTAR-XMD* is a WhatsApp bot developed by *GOTAR-TECH*, built with Node.js and `baileys-md`. It offers a flexible and modular experience for automating WhatsApp management.

🚀 Features

- ✅ Auto reply  
- 🛡️ Auto block  
- 🖼️ Status view response  
- 📞 Call reject  
- 🔁 Public or private mode  
- 🧠 Multi-language support  

📦 Installation

1. *Clone the repository:*

   ```bash
   git clone https://github.com/GOTAR-XMD/GOTAR-XMD.git
   cd GOTAR-XMD
   ```

2. *Install dependencies:*

   ```bash
   npm install
   ```

3. *Create a `.env` file and paste the following:*

   ```env
   SESSION_ID="GOTAR~XMD"
   AUTO_READ_STATUS=true
   STATUS_READ_MSG="*Status Seen By GOTAR-XMD*"
   AUTO_STATUS_REPLY=false
   AUTO_REJECT_CALLS=false
   MODE="public"
   WELCOME=false
   AUTO_READ_MESSAGES=false
   AUTO_TYPING=false
   OWNER_NAME="GOTAR-TECH"
   OWNER_NUMBER="18494967948"
   AUTO_RECORDING=false
   ALWAYS_ONLINE=false
   AUTO_BLOCK=true
   AUTO_REACT=false
   PREFIX="."
   ```

4. *Start the bot:*

   ```bash
   node index.js
   ```

🧪 Basic Commands

- `.menu` – Show bot command menu  
- `.ping` – Check latency  
- `.owner` – Show owner info  

📁 Project Structure

```
