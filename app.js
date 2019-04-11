const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const path = require('path')
const nodemailer = require('nodemailer')
// const session = require('express-session')
// const passport = require('passport')
// const passportfb = require('passport-facebook').Strategy
// const LocalStrategy = require('passport-local').Strategy
// const fs = require('fs')
// const db = require('./db.js')
// const io = require('socket.io')(server); 
const port = 3009
const app = express()
const server = require('http').Server(app)

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars')

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')))

// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.render('contact')
});

app.post('/send', (req, res) => {
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>  
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
            user: 'duongthanhuit@gmail.com',
            pass: 'thanhnlvtht19977'  
    },
        tls:{
            rejectUnauthorized:false
        }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <duongthanhuit@gmail.com>', 
        to: '15520800@gm.uit.edu.vn', 
        subject: 'Node Contact Request', 
        text: 'Hello world?', 
        html: output 
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.render('contact', {msg:'Email has been sent!'});
    });
});
  
server.listen(port, () => console.log(`Server is starting on port ${port}`));