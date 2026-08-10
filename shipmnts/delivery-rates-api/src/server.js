require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3003;

async function start() {
  await connectDB();       // 1. connect to MongoDB first
  app.listen(PORT, () => { // 2. only start the server once DB is ready
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
