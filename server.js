import express from "express";
import bcrypt from "bcrypt";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc, updateDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDEE-ZTRzCvCyH3IdpkYd9I3TBInFjT2Ok",
    authDomain: "ecom-website-2e05a.firebaseapp.com",
    projectId: "ecom-website-2e05a",
    storageBucket: "ecom-website-2e05a.appspot.com",
    messagingSenderId: "116869714165",
    appId: "1:116869714165:web:015f9f3a8c0c54b365b5bc"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();

//  init server
const app = express();

// middlewares
app.use(express.static("public"));
app.use(express.json()) // enables form sharing

// routes
// home route
app.get('/', (req, res) => {
    res.sendFile("index.html", { root: "public" })
})

// signup page
app.get('/signup', (req, res) => {
    res.sendFile("signup.html", { root: "public" })
})

app.post('/signup', (req, res) => {
    const { name, email, password, number, tac } = req.body;
    // form validations
    if (name.length < 3) {
        res.json({ 'alert': ' name must be 3 letters long' });
    } else if (!email.length) {
        res.json({ 'alert': ' enter your email' });
    } else if (password.length < 8) {
        res.json({ 'alert': ' password must be 8 letters long' });
    } else if (!Number(number) || number.length < 10) {
        res.json({ 'alert': ' invalid number, please enter valid one' });
    } else if (!tac) {
        res.json({ 'alert': 'you must agree to our terms and condition' });
    } else {
        // store the data in db
        const users = collection(db, "users"); 

        getDoc(doc(users, email)).then(user => {
            if (user.exists()) {
                return res.json({ 'alert': 'email already exists' })
            } else {
                // encryt the password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash;
                        req.body.seller = false;

                        // set the doc
                        setDoc(doc(users, email), req.body).then(data => {
                            res.json({
                                name: req.body.name,
                                email: req.body.email,
                                seller: req.body.seller,
                            })
                        })
                    })
                })
            }
        })
    }
})

// 404 route
app.get('/404', (req, res) => {
    res.sendFile("404.html", { root: "public" })
})

app.use((req, res) => {
    res.redirect('/404')
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})