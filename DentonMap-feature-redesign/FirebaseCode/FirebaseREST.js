const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path  = require('path');

const serviceAccountPath = path.join(__dirname, '..', '..', '..', '..', '..', 'Downloads', 'denton-1cade-firebase-adminsdk-qtj53-67527005f2.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://denton-1cade-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
const app = express();

const server = http.createServer(app);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", '*');
  // ^allow access no matter the server ur requesting from
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

// app.get('/', (req, res) => {
//   // Send the 'index.html' file from the 'login' directory
//   res.sendFile(path.join(__dirname, '..', 'src', 'login.html'));
// });

app.post('/register', async (req, res) => {
  console.log(req.body);

  const user = {
    email: req.body.email,
    password: req.body.password
  }

  const userResponse = await admin.auth().createUser({
    email: user.email,
    password: user.password,
    emailVerified: false,
    disabled: false
  });

  res.json(userResponse);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})