var admin = require("firebase-admin")
const express = require("express")
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

var serviceAccount = require("./serviceAccountKeys.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()
let pathRef = db.collection('users');
let id = ""
let user_email = "";
let user_name = "";
let user_telefone = "";

app.listen(5000, () => {
    console.log('Running on port 5000')
})

app.post('/user', async (req, res) => {
  const email = req.body.email;

  const usersRef = db.collection('users')
  const foundUser = await usersRef.where('email', '==', email).get()

  if(foundUser.empty) {
    console.log('User not found.')
    res.send('User not found')
    return
  }

  foundUser.forEach(doc => {
    id = doc.id
    user_name = doc.data().name
    user_email = doc.data().email
    user_telefone = doc.data().telefone
  })
})

app.get('/user', (req, res) => {
  res.send({user_name, user_email, user_telefone})
})

app.post('/register', (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const telefone = req.body.telefone;
  const password = req.body.password;
  const repeatPassword = req.body.repeatPassword;

  if(password !== repeatPassword) {
    res.send('As senhas precisam ser iguais')
  } else {
    pathRef.add({email, name, telefone, password, repeatPassword})
  }
})