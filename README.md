# ETL-Analytics
search console ETL &amp; analytics

# 🚀 Node.js ETL Pipeline

A modular ETL pipeline built with Node.js that extracts data from Google APIs via OAuth 2.0, transforms it, and loads it using RabbitMQ (with optional ClickHouse support for analytics).

---

## 1️⃣ Google OAuth Setup and `.env` Configuration

### 🔐 Create OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project → Navigate to **APIs & Services > Credentials**.
3. Click **“Create Credentials” → “OAuth client ID”**.
4. Choose **Desktop App** or **Web Application**.
5. Download `credentials.json`.

📁 Place `credentials.json` inside a `config/` folder in your project root.

### ⚙️ Create `.env` File:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Optional: ClickHouse
CLICKHOUSE_HOST=localhost
CLICKHOUSE_PORT=9000
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=


Start RabbitMQ:
bash
Copy
Edit
docker run -d --hostname rabbit-host --name rabbitmq \
-p 5672:5672 -p 15672:15672 \
-e RABBITMQ_DEFAULT_USER=guest \
-e RABBITMQ_DEFAULT_PASS=guest \
rabbitmq:3-management

Run ETL Phases
📥 Extract Phase
bash
Copy
Edit
node extract/extract.js
Fetches data using Google OAuth 2.0

🧪 Transform Phase
bash
Copy
Edit
node transform/transform.js
Cleans and transforms extracted data

📤 Load Phase
bash
Copy
Edit
node load/load.js
Sends data to the destination (e.g., DB or ClickHouse)

🧵 Optional: Run RabbitMQ Worker
bash
Copy
Edit
node queue/worker.js
Listens to queue events and triggers ETL automatically

✅ Install Dependencies
bash
Copy
Edit
npm install
📦 Tech Stack: Node.js, RabbitMQ, Google OAuth 2.0, dotenv, axios/fetch, optional ClickHouse
🧱 Project Structure: Organized into extract/, transform/, load/, queue/, and config/

Your ETL pipeline is now ready to run and impress 🚀

