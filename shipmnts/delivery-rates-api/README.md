# Delivery Rates API

## Folder structure

```
delivery-rates-api/
├── src/
│   ├── config/
│   │   └── db.js              → connects to MongoDB
│   ├── models/                → shape of each MongoDB collection
│   │   ├── User.js
│   │   ├── Connection.js
│   │   └── Rate.js
│   ├── controllers/           → the actual logic for each endpoint
│   │   ├── userController.js
│   │   ├── connectController.js
│   │   └── rateController.js
│   ├── routes/                → maps URLs to controller functions
│   │   ├── userRoutes.js
│   │   ├── connectRoutes.js
│   │   └── rateRoutes.js
│   ├── middleware/
│   │   └── currentUser.js     → reads the current_user_id header
│   ├── app.js                 → builds the Express app, wires up routes
│   └── server.js              → starts the server (entry point)
├── .env.example
├── package.json
└── README.md
```

**Why split it this way?** Each folder has one job:
- `models` = what the data looks like
- `controllers` = what happens when a request comes in
- `routes` = which URL triggers which controller
- `config` = setup/connection code (things you'd rarely touch once working)

## How to run it

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and set your MongoDB connection string:
   ```
   cp .env.example .env
   ```
   - If you have MongoDB installed locally, the default value works out of the box.
   - Otherwise, create a free cluster at mongodb.com/atlas and paste its connection string in.

3. Start the server:
   ```
   npm start
   ```
   You should see:
   ```
   MongoDB connected successfully
   Server running on http://localhost:3000
   ```

4. Test it's alive:
   ```
   curl http://localhost:3000/health
   ```

## Trying the endpoints (example with curl)

**Create a user:**
```
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahul Sharma","email":"rahul@example.com"}'
```

**Create a second user, then send a connection request** (replace `<u1>` / `<u2>` with the real IDs returned above):
```
curl -X POST http://localhost:3000/connect \
  -H "Content-Type: application/json" \
  -H "current_user_id: <u1>" \
  -d '{"toUserId":"<u2>"}'
```

**Accept the request** (as u2, using the connection id returned above):
```
curl -X PATCH http://localhost:3000/connect/respond \
  -H "Content-Type: application/json" \
  -H "current_user_id: <u2>" \
  -d '{"connectionId":"<connectionId>","action":"ACCEPT"}'
```

**Create a rate** (as u2, selling Nadiad → Ahmedabad):
```
curl -X POST http://localhost:3000/rates \
  -H "Content-Type: application/json" \
  -H "current_user_id: <u2>" \
  -d '{"type":"SELL","fromLocation":"Nadiad","toLocation":"Ahmedabad","validFrom":"2026-07-01","validTo":"2026-09-30","price":1450,"currency":"USD","transitDays":2}'
```

**Search as u1** (should now see u2's sell rate as a buy option, since they're connected):
```
curl -X POST http://localhost:3000/rates/search \
  -H "Content-Type: application/json" \
  -H "current_user_id: <u1>" \
  -d '{"fromLocation":"Nadiad","toLocation":"Ahmedabad","date":"2026-08-15"}'
```
