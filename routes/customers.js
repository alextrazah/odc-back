var express = require('express');
var router = express.Router();
var Customer = require('../models/customer');
var User = require('../models/User');
var {sendCustomerConfirmationEmail } = require('../mailer');
var bcrypt = require("bcrypt");


var multer = require("multer");
var path = require("path");
router.use(express.static(__dirname + "./public/"));
// router.use(express.static(__dirname+"./public/"));
if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}
var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
var upload = multer({
  storage: Storage,
}).single("img");


/*********************************************   CRUD RESTFUL APIs For React & PostMan  *********************************************/

/** Get All cutsomers

router.get('/', function(req, res, next) {
  Customer.find(function(err,data){
    if(err) throw err;
    res.json(data);
  }).populate("payments packages");
});
 **/



/** Search Customer By FirstName and LastName **/

router.get('/', function(req, res, next) {
  const firstName = req.query.firstName;
  const lastName = req.query.lastName;
  var condition =
      firstName ?
      { FirstName : { $regex: new RegExp(firstName), $options: "i" } }
      : lastName ?
          { LastName : { $regex: new RegExp(lastName), $options: "i" } }
          : {};
  Customer.find(condition,function(err,data){
    if(err) throw err;
    res.json(data);
  }).populate("payments deliveries");
});


/** Tri Customers by Username  **/

router.get('/triByUserName', function(req, res, next) {
  Customer.find(function(err,data){
    if(err) throw err;
    res.json(data);
  }).sort({UserName: -1}).populate("payments deliveries");
});


/** Get cutsomer By Id **/

 router.get('/:id', function(req, res, next) {
  Customer.findById(req.params.id,function(err,data){
    if(err) throw err;
    res.json(data);
  }).populate({ path: "payments deliveries" ,populate: {
    path: 'package',
    model: 'Package'
  } });
});







/** Add Customer (Post Man)**/

router.post('/', function(req,res,next){
  const customer = new Customer(req.body);
  try{
  customer.save();
  res.send("Ajout");
  }
  catch (error){
    res.send(error);
  }
});




/** Add Customer (REACT) **/

router.post('/addCustomer',upload, async function (req, res, next) {
  const obj = JSON.parse(JSON.stringify(req.body));
  console.log("Obj", obj);
  const hashedPassword = await bcrypt.hash(obj.password,10);
  const newCustomer = {
    Cin: obj.cin,
    FirstName: obj.firstname,
    LastName: obj.lastname,
    UserName: obj.username,
    Password: hashedPassword,
    Email: obj.email,
    PhoneNumber: obj.phoneNumber,
    Adress: {
      Street: obj.street,
      City: obj.city,
      State: obj.state,
      ZipCode: obj.zipCode
    },
    img: req.file.filename,
    payments: [],
    packages: [],
    reduction:false
  };
  const UserNameExist = await Customer.find({UserName: newCustomer.UserName});
  const CINExist =  await Customer.find({Cin: newCustomer.Cin});
  const EmailExist =  await Customer.find({Email: newCustomer.Email});
  const UserameUserExist = await User.find({Username:newCustomer.UserName});
  const EmaiUserExist = await User.find({Email:newCustomer.Email});

  if((UserNameExist.length != 0) || (UserameUserExist.length != 0) )
  {
    console.log("UserNameExist");
    res.send("UserNameExist");
  }
  else if (CINExist.length != 0 ){
    console.log("CIN Exist");
    res.send("CinExist");
  }
  else if ((EmailExist.length != 0) || (EmaiUserExist.length != 0) ){
    console.log("Email Exist");
    res.send("EmailExist");
  }
  else {
  Customer.create(newCustomer,function (err,customer) {
    if(err) throw err;
    sendCustomerConfirmationEmail(newCustomer.Email,newCustomer.UserName,customer._id);
    res.send(customer._id);
  });
  }

});


/** Activate Customer **/
router.get('/ActivateCustomer/:id',async function (req, res, next) {
  Customer.findById(req.params.id).then( c => {
      User.create({
        Id: c._id,
        Username: c.UserName,
        Password: c.Password,
        Email: c.Email,
        Role:"Customer",
        img:c.img
      }, function (err,user) {
        if(err) throw err;
        res.redirect(`${process.env.DOMAIN_REACT}/ActivatedAccount`);
        res.end();
      });
      }
  );
});


/** Update Customer(REACT) **/

router.put('/update/:id',upload,function(req,res,next){
  const obj = JSON.parse(JSON.stringify(req.body));
  const newCustomer = {
    FirstName: obj.firstname,
    LastName: obj.lastname,
    UserName: obj.username,
    Email: obj.email,
    PhoneNumber: obj.phoneNumber,
    Adress: {
      Street: obj.street,
      City: obj.city,
      State: obj.state,
      ZipCode: obj.zipCode
    },
    img: req.file.filename
  };
  Customer.findByIdAndUpdate(req.params.id,newCustomer,async function(err,data){
    if(err) throw err;
    await User.findOneAndUpdate({Id: req.params.id}, {
      Username: newCustomer.UserName,
      Email: newCustomer.Email,
    });
    console.log('UPDATED');
    res.send("UPDATED OK");
  });
});



/** Active reduction for Customer **/

router.put('/reduction/:id',upload,function(req,res,next){

  Customer.findByIdAndUpdate(req.params.id, {reduction:true},async function(err,data){
    if(err) throw err;
    console.log('UPDATED');
    res.send("UPDATED OK");
  });
});


/** Deactivated reduction for Customer **/

router.put('/reductionDes/:id',upload,function(req,res,next){

  Customer.findByIdAndUpdate(req.params.id, {reduction:false},async function(err,data){
    if(err) throw err;
    console.log('UPDATED');
    res.send("UPDATED OK");
  });
});


/** EditProfile Customer(REACT) **/

router.put('/EditProfile/:id',upload,function(req,res,next){
  const obj = JSON.parse(JSON.stringify(req.body));
  const newCustomer = {
    Cin: obj.cin,
    FirstName: obj.firstname,
    LastName: obj.lastname,
    UserName: obj.username,
    Email: obj.email,
    PhoneNumber: obj.phoneNumber,
    Adress: {
      Street: obj.street,
      City: obj.city,
      State: obj.state,
      ZipCode: obj.zipCode
    },
    img: req.file.filename
  };
  Customer.findByIdAndUpdate(req.params.id,newCustomer,async function(err,data){
    if(err) throw err;
    await User.findOneAndUpdate({Id: req.params.id}, {
      Username: newCustomer.UserName,
      Email: newCustomer.Email,
      img:newCustomer.img
    });
    console.log('UPDATED');
    res.send(newCustomer);
  });
});


router.put('/updatePassword/:id', async function(req,res,next){
  const {currentPassword,password} = req.body;
  const hashedPassword = await bcrypt.hash(password,10);
  try {
    const user = await User.find({Id: req.params.id});
    if (await bcrypt.compare(currentPassword,user[0].Password) === false) {
      return res.send("WrongPassword");
    }
      else {
          Customer.findByIdAndUpdate(req.params.id, {Password:hashedPassword},async function(err,data){
            if(err) throw err;
            await User.findOneAndUpdate({Id: req.params.id}, {
              Password:hashedPassword
            });
            console.log('UPDATED');
            return res.send("PasswordUpdated");
          });
        }
  }
  catch (error){
    res.send(error);
  }
});






router.put('/update/:id',function(req,res,next){
  Customer.findByIdAndUpdate(req.params.id,{
    "FirstName" : "SAIDIIIII"
  },function(err,data){
    if(err) throw err;
    console.log('UPDATED');
    res.send("UPDATED OK");
  });
});






/** Delete All Customers **/

router.delete('/remove', function(req,res,next){
  Customer.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Customers were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
              err.message || "Some error occurred while removing all tutorials."
        });
      });
});







/** Delete Customer By id **/

router.delete('/removeById/:id', function(req,res,next){
  Customer.findByIdAndRemove(req.params.id,req.body, function(err,data) {
    if(err) throw err;
    console.log('DELETED');
    res.send("DELETED OK");
  })

});



/** Disable Account Customer **/

router.put('/DisableAccount/:id', async function(req,res,next){
  const {passwordD} = req.body;
  try {
    const user = await User.find({Id: req.params.id});
    if (await bcrypt.compare(passwordD,user[0].Password) === false) {
      return res.send("WrongPassword");
    }
    else {
      Customer.findByIdAndRemove(req.params.id,async function(err,data){
        if(err) throw err;
        await User.remove({Id: req.params.id});
        console.log('UserDeleted');
        return res.send("Deleted");
      });
    }
  }
  catch (error){
    res.send(error);
  }
});








/*********************************************   CRUD WITH VIEWS TEST   *********************************************/



/** GET cutomers from  DB and fetch data to views  **/

router.get('/ShowCustomers', function (req, res, next) {
  Customer.find(function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render('showCustomer', { users: data });
    }
  }).populate("payments");
});





/** Redirection to addCustomer view **/
router.get('/addCustomer', function (req, res, next) {
  res.render('addCustomer');
});






/** Get Cutsomer by Id and fetch data (Details) **/
router.get('/Details/:id', function (req, res, next) {
  Customer.findById(req.params.id, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render('detailsCustomer', { user: data });
    }
  });
});





/** Add from view Form  **/
router.post('/add', function (req, res, next) {
  const obj = JSON.parse(JSON.stringify(req.body));
  console.log(obj);

  const newCustomer = {
    Cin: obj.cin,
    FirstName: obj.firstname,
    LastName: obj.lastname,
    UserName: obj.username,
    Password: obj.password,
    Email: obj.email,
    PhoneNumber: obj.phonenumber,
    Adress: {
      Street: obj.street,
      City: obj.city,
      State: obj.state,
      ZipCode: obj.zipCode
    },
    payments: [],
    packages: []
  };

  Customer.create(newCustomer, function (err) {
    if (err) {
      res.render('/addCustomer');
    } else {
      res.redirect('/customers/showCustomers');
    }
  });
});




/**  Fetch Data to Update Form **/
router.get('/edit/customer/:id', function (req, res, next) {
  Customer.findById(req.params.id, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render('editCustomer', { user: data });
    }
  });
});




/** Update from view Form  **/
router.post('/edit/:id', function (req, res, next) {
  const obj = JSON.parse(JSON.stringify(req.body));
  const newCustomer = {
    Cin: obj.cin,
    FirstName: obj.firstname,
    LastName: obj.lastname,
    UserName: obj.username,
    Password: obj.password,
    Email: obj.email,
    PhoneNumber: obj.phonenumber,
    Adress: {
      Street: obj.street,
      City: obj.city,
      State: obj.state,
      ZipCode: obj.zipCode
    },
    payments: [],
    packages: []
  };
  Customer.findByIdAndUpdate(req.params.id, newCustomer, function (err) {
    if (err) {
      res.render('/customer/edit/' + req.params.id);
    } else {
      res.redirect('/customers/showCustomers');
    }
  });
});



/** Delete customer Path and redirect to customers list **/
router.get('/delete/:id', function (req, res, next) {
  Customer.findByIdAndRemove(req.params.id, function (err, docs) {
    if (err) console.log(err);
    res.redirect('/customers/showCustomers');
  });
});




module.exports = router;
