
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = mongoose.model('USER')
const jwt = require('jsonwebtoken');


const authenticate = require('../middleware/authenticate');

require('../db/conn');


//const User = require('../model/userschema');


// USING PROMISES
// router.post('/register' , (req,res) => {

//     const {name ,email,phone, password, confirmpassword} =req.body;

//     if(!name || !email || !phone ||  !password || !confirmpassword){
//             return res.status(422).json({error:"pleas fill the proper details "})
//     }

//     User.findOne({email : email})  //database : filled by user
//     .then((userExist) =>{
//         if(userExist){
//             return res.status(422).json({error :"email already registered"});
//         }

//         const user= new User({name ,email,phone, password, confirmpassword});

//         user.save().then(()=>{
//             res.status(201).json({message: "user registered sucessfuly"});
//         }).catch((err) => {
//             res.status(500).json({error: "failed register"});
//         })

//     }).catch(err => {console.log({err});});

//     // res.send('mera register page')

// });


//USING ASYNC AWAIT    // wrong function

router.post('/register', async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;
  console.log(name + " " + email + " " + phone + " " + password + " " + confirmPassword);

  if (!name || !email || !phone || !password || !confirmPassword) {
    return res.status(422).json({ error: "Please fill in all the required details." });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      console.log(userExist);
      return res.status(400).json({ error: "Email already registered." });
    } else if (password !== confirmPassword) {
      return res.status(422).json({ error: "Passwords do not match." });
    } else {
      const salt = await bcrypt.genSalt(10);

      const encryptedPassword = await bcrypt.hash(password, salt);
      const user = new User({ name, email, phone, password: encryptedPassword });
      await user.save();
      res.status(201).json({ message: "User registered successfully." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// contact us page


router.post('/contact', authenticate, async (req, res) => {
  const { name, email, phone, sub, mes } = req.body;
  console.log(name + " " + email + " " + phone + " " + sub + " " + mes);

  if (!name || !email || !phone || !sub || !mes) {
    return res.status(422).json({ error: "Please fill in all the required details." });
  }

  try {
    const userContact = await User.findOne({ _id: req.userID });
    console.log("hihihi");
    if (userContact) {
      const userMessage = await userContact.addMessage(name, email, phone, sub, mes);
      await userContact.save();
      res.status(201).json({ message: 'User contact successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.log("err: " + err);
    res.status(500).json({ error: 'Server error' });
  }
});




//login route


router.post('/signin', async (req, res) => {
  console.log("siginin");
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in both email and password" });
    }
    const userLogin = await User.findOne({ email: email });
    console.log(userLogin.email);
    
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      // console.log(is);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = await userLogin.generateAuthToken();
      
      // Set the token as a cookie with HttpOnly and an expiration date
      res.cookie('jwttoken', token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
        secure: true, // Add this for HTTPS environments
        sameSite: 'none', // Add this for cross-site cookies in HTTPS environments
      });

      res.json({ message: "User logged in successfully", token: token, user: userLogin });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// router.post('/signin', async (req, res) => {
//   console.log("hello");
//   const { email, password } = req.body;
//   console.log("email " + email + " " + password);
//   try {
//     console.log("here");
//   } catch (err) {
//     console.log(err);
//   }
// });

//About ka page
// router.get('/about', authenticate,(req, res) => {
//   console.log('Hello about');
//   res.send(`Hello to the about page`);
// });
router.get('/about', (req, res) => {
  try {
    console.log('Hello about');
    res.status(200).json({ message: 'Hello to the about page' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Logout page 

router.get('/logout' ,(req,res) =>{
  res.clearCookie('jwtoken', {path:'/'});
  res.status(200).send('User logout');
})




module.exports = router;