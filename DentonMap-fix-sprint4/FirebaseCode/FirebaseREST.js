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


const db = admin.database();
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
  const email = req.body.email;
  const encode = btoa(encodeURIComponent(email.toLowerCase()));

  await admin.auth().generateEmailVerificationLink(email); // TODO: generated but not sent yet

  const user = {
    email: email,
    password: req.body.password
  }

  const userResponse = await admin.auth().createUser({
    email: email,
    password: user.password,
    emailVerified: false,
    disabled: false
  });

  const dbRef = db.ref('users/' + encode);

  dbRef.set({
    firstname: req.body.fname,
    lastname: req.body.lname,
    email: email
  });

  res.json(userResponse);
});

app.post('/login', async (req, res) => {
  console.log(req.body);

  admin.auth().verifyIdToken(req.body.idToken)
  .then((decodedToken) => {
    const uid = decodedToken.uid;
    res.json(uid);
  })
  .catch((error) => {
    console.error('Error: ', error);
  });
});


app.post('/update', async (req, res) => {
  console.log(req.body);

  const email = req.body.email.toLowerCase();
  const encode = btoa(encodeURIComponent(email));
  const dbRef = db.ref('users/' + encode);

  if (req.body.name)
  {
    const firstOrLast = req.body.type === "first";
    
    if (firstOrLast)
    {
      dbRef.update({ firstname: req.body.name }, (error) => {
        if (error) {
          res.json({ success: false, error: error });
        }
        else {
          res.json({ success: true });
        }
      });
    }
    else
    {
      dbRef.update({ lastname: req.body.name }, (error) => {
        if (error) {
          res.json({ success: false, error: error });
        }
        else {
          res.json({ success: true });
        }
      });
    }
  }
  else
  {
    dbRef.once('value', (snapshot) => {
      res.json(snapshot.val());
    }, (error) => {
      res.json({ success: false, error: error });
    });
  }
});

app.post('/change', async (req, res) => {
  console.log(req.body);

  admin.auth().updateUser(req.body.id, {
    password: req.body.newPW
  })
  .then(() => {
    res.json({ success: true });
  })
  .catch(err => {
    res.json(err);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})