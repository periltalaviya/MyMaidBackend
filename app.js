const nodemailer = require("nodemailer"); //use for mail
const xoauth2 = require("xoauth2"); //use for mail
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./queries');
const { request, response } = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const DIR = './uploads';

var port = process.env.PORT || 3500;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.filename + '-' + Date.now() + path.extname(file.originalname));
  }
});
let upload = multer({ storage: storage });

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

NODE_TLS_REJECT_UNAUTHORIZED='0';
NODE_EXTRA_CA_CERTS="./cert.pem";

//mail
var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  secure: 'true',
  port: '465',
  auth: {
    user: 'periltalaviya123@gmail.com', // must be Gmail from this link =>  https://myaccount.google.com/apppasswords
    pass: 'wiab duox qeki zzil'    //(1) go to google setting in security option and enable 2step verification then 					//select custom and gen password from there 
  }
});

app.post('/sendAdminForgotPassword', (req, res) => {
  console.log(req.body, 'data of form');

  var mailOptions = {
    from: 'periltalaviya123@gmail.com',
    to: 'req.body.email', // must be Gmail
    cc: `<${req.body.email}>`,
    subject: 'Sending Email for forgot password using Node.js',
    html: `
              <table style="width: 100%; border: none">
                <thead>
                  <tr style="background-color: #000; color: #fff;">
                    <th style="padding: 10px 0">Name</th>
                    <th style="padding: 10px 0">E-mail</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                   
                    <td style="text-align: center"> <a href="http://localhost:4200/forgotpassword/${req.body.email}">Click here</a> </td>
                  </tr>
                </tbody>
              </table>
            `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({
        message: 'successfuly sent!'
      })
    }
  });

});

app.post('/sendMaidForgotPassword', (req, res) => {
  console.log(req.body, 'data of form');

  var mailOptions = {
    from: 'periltalaviya123@gmail.com',
    to: 'req.body.email', // must be Gmail
    cc: `<${req.body.email}>`,
    subject: 'Sending Email for forgot password using Node.js',
    html: `
            <table style="width: 100%; border: none">
              <thead>
                <tr style="background-color: #000; color: #fff;">
                  <th style="padding: 10px 0">Name</th>
                  <th style="padding: 10px 0">E-mail</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                 
                  <td style="text-align: center"> <a href="http://localhost:4200/maid-forgotpassword/${req.body.email}">Click here</a> </td>
                </tr>
              </tbody>
            </table>
          `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({
        message: 'successfuly sent!'
      })
    }
  });

});

app.post('/sendClientForgotPassword', (req, res) => {
  console.log(req.body, 'data of form');

  var mailOptions = {
    from: 'periltalaviya123@gmail.com',
    to: 'req.body.email', // must be Gmail
    cc: `<${req.body.email}>`,
    subject: 'Sending Email for forgot password using Node.js',
    html: `
            <table style="width: 100%; border: none">
              <thead>
                <tr style="background-color: #000; color: #fff;">
                  <th style="padding: 10px 0">Name</th>
                  <th style="padding: 10px 0">E-mail</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                 
                  <td style="text-align: center"> <a href="http://localhost:4200/client-forgotpassword/${req.body.email}">Click here</a> </td>
                </tr>
              </tbody>
            </table>
          `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({
        message: 'successfuly sent!'
      })
    }
  });

});

app.post('/sendFormData', (req, res) => {
  console.log(req.body, 'data of form');

  var mailOptions = {
    from: 'periltalaviya12@gmail.com',
    to: 'req.body.email', // must be Gmail
    cc: `${req.body.fname} <${req.body.email}>`,
    subject: 'Sending Email from Peril using Node.js',
    html: `
              <table style="width: 100%; border: none">
                <thead>
                  <tr style="background-color: #000; color: #fff;">
                    <th style="padding: 10px 0">Name</th>
                    <th style="padding: 10px 0">E-mail</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th style="text-align: center">${req.body.fname}</th>
                    <td style="text-align: center">${req.body.email}</td>
                  </tr>
                </tbody>
              </table>
            `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({
        message: 'successfuly sent!'
      })
    }
  });

});

app.get('/', (request, response) => {
  response.json({
    info: 'Node.js, Express and Postgres API'
  })
})

//image
app.post('/upload',upload.single('image'),db.upload)

app.get('/uploads/:imagename',function(req,res) {
  res.sendFile(__dirname + '/uploads/' + req.params.imagename);
 })
 
// Admin
app.post('/addAdmin', db.addAdmin);
app.get('/getAdmin', db.getAdmin);
app.get('/getAdminById/:admin_id', db.getAdminById);
app.put('/updateAdmin', db.updateAdmin);
app.delete('/deleteAdmin/:admin_id', db.deleteAdmin);
app.post('/getAdminLogin', db.getAdminLogin);
app.put('/changeAdminPassword', db.changeAdminPassword);
app.put('/forgotAdminPassword', db.forgotAdminPassword);

// Maid
app.post('/addMaid', db.addMaid);
app.get('/getMaid', db.getMaid);
app.get('/getMaidById/:maid_id', db.getMaidById);
app.get('/getAllMaidDetail',db.getAllMaidDetail)
app.get('/getMaidDetail/:maid_id',db.getMaidDetail)
app.put('/updateMaid', db.updateMaid);
app.delete('/deleteMaid/:maid_id', db.deleteMaid);
app.post('/getMaidLogin', db.getMaidLogin);
app.put('/changeMaidPassword', db.changeMaidPassword);
app.put('/forgotMaidPassword', db.forgotMaidPassword)


// Maid Phoneno
app.post('/addMaidPhone', db.addMaidPhone);
app.get('/getMaidPhone', db.getMaidPhone);
app.put('/updateMaidPhone', db.updateMaidPhone);
app.delete('/deleteMaidPhone/:maid_id', db.deleteMaidPhone);

// Location
app.post('/addLocation', db.addLocation);
app.get('/getLocation', db.getLocation);
app.get('/getLocationById/:pincode', db.getLocationById);
app.get('/getLocationByCity/:city', db.getLocationByCity);
app.put('/updateLocation', db.updateLocation);
app.delete('/deleteLocation/:pincode', db.deleteLocation);

// Client
app.post('/addClient', db.addClient);
app.get('/getClient', db.getClient);
app.get('/getClientById/:client_id', db.getClientById)
app.put('/updateClient', db.updateClient);
app.delete('/deleteClient/:client_id', db.deleteClient);
app.post('/getClientLogin', db.getClientLogin);
app.put('/changeClientPassword', db.changeClientPassword);
app.put('/forgotClientPassword', db.forgotClientPassword);

// Client Phoneno
app.post('/addClientPhone', db.addClientPhone);
app.get('/getClientPhone', db.getClientPhone);
app.put('/updateClientPhone', db.updateClientPhone);
app.delete('/deleteClientPhone/:client_id', db.deleteClientPhone);

//Address
app.post('/addAddress', db.addAddress);
app.get('/getAddress', db.getAddress);
app.get('/getAddressById/:client_id', db.getAddressById);
app.get('/getAddressByAddressId/:address_id', db.getAddressByAddressId);
app.put('/updateAddress', db.updateAddress);
app.delete('/deleteAddress/:address_id', db.deleteAddress);

//Booking
app.post('/addBooking', db.addBooking);
app.get('/getBooking', db.getBooking);
app.get('/getBookingByClientid/:client_id', db.getBookingByClientid)
app.get('/getBookingByMaidId/:maid_id', db.getBookingByMaidId)
app.put('/updateBooking', db.updateBooking);
app.put('/updateBookingStatus', db.updateBookingStatus)
app.delete('/deleteBooking/:booking_id', db.deleteBooking);

app.post('/addCategory', db.addCategory);
app.get('/getCategory', db.getCategory);
app.get('/getCategoryById/:category_id', db.getCategoryById);
app.put('/updateCategory', db.updateCategory);
app.delete('/deleteCategory/:category_id', db.deleteCategory);

app.post('/addMaidCategory', db.addMaidCategory);
app.get('/getMaidCategory/:maid_id', db.getMaidCategory);
app.get('/getMaidCategoryById/:maid_id/:category_id', db.getMaidCategoryById);
app.get('/getMaidCategoryByMaidId/:maid_id', db.getMaidCategoryByMaidId);
app.put('/updateMaidCategory', db.updateMaidCategory);
app.delete('/deleteMaidCategory/:maid_id/:category_id', db.deleteMaidCategory);

app.post('/addFeedback', db.addFeedback);
app.get('/getFeedback', db.getFeedback);
app.get('/getFeedbackByMaidId/:maid_id',db.getFeedbackByMaidId)
app.put('/updateFeedback', db.updateFeedback);
app.delete('/deleteFeedback/:feedback_id', db.deleteFeedback);

app.get('/getStatus', db.getStatus);

app.set('port', port);
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});