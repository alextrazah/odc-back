var express = require("express");
var router = express.Router();
var User = require("../models/User");

var { SendResetPasswordEmail } = require("../mailer");
var { ContactUsEmail } = require("../mailer");
var XLSX = require('xlsx');
var bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const axios = require('axios');
var multer = require("multer");
var path = require("path");
var bcrypt = require("bcrypt");
router.use(express.static(__dirname + "./public/"));
var cors = require("cors");
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
}).single("file");

const client = new OAuth2Client(
  "991500253592-o6bt8lpeuisqg2fseal9uqhfqvft68k5.apps.googleusercontent.com"
);

/** LOGIN **/

router.get("/", function (req, res, next) {
  const username = req.query.username;
  const password = req.query.password;

  User.find(
    { $or: [{ Username: username }, { Email: username }] },
    async function (err, data) {
      if (err) throw err;
      if (data.length === 0) {
        return res.send("UserNotFound");
      } else if ((await bcrypt.compare(password, data[0].Password)) === false) {
        console.log("WrongPassword");
        return res.send("WrongPassword");
      } else {
        res.json(data);
      }
    }
  );
});

router.get("/test", function (req, res, next) {
  const username = req.query.username;
  const password = req.query.password;

  User.find(
    { $or: [{ Firstname: username }, { Email: username }] },
    async function (err, data) {
      if (err) throw err;
      if (data.length === 0) {
        console.log(data);
        console.log(username);
        return res.send("UserNotFound");
      } else if ((await bcrypt.compare(password, data[0].Password)) === false) {
        console.log("WrongPassword");
        return res.send("WrongPassword");
      } else {
        res.json(data);
      }
    }
  );
});


/** Add User (Post Man)**/

router.post("/", async function (req, res, next) {
  const password = req.body.Password;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    Username: req.body.Username,
    Password: hashedPassword,
    Email: req.body.Email,
    Role: req.body.Role,
    img: req.body.img,
  });
  try {
    user.save();
    res.send("Ajout");
  } catch (error) {
    res.send(error);
  }
});

router.post("/adduser", async function (req, res, next) {
  const password = req.body.Password;
  var roles = "DRE";
  if(req.body.Role==""){
    roles="DRE";
  }
  else roles=req.body.Role
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    Firstname: req.body.Firstname,
    Lastname: req.body.Lastname,
    Password: hashedPassword,
    Email: req.body.Email,
    Role: roles,
    Active: 1,
  });
  try {
    user.save();
    res.send("Ajout");
  } catch (error) {
    res.send(error);
  }
});
/** Reset User Password **/
router.post("/resetPassword", async function (req, res, next) {
  const { Email } = req.body;
  const user = await User.find({ Email: Email });
  try {
    if (user.length === 0) {
      return res.send("UserNotExist");
    }
    const resetCode = await ResetCode.find({ Id: user[0].Id });
    if (resetCode.length != 0) {
      res.send("EmailAlreadySent");
    } else {
      const code = user[0]._id.toString().substr(20, 24);
      const newResetCode = new ResetCode({ Id: user[0].Id, Code: code });
      await newResetCode.save();
      SendResetPasswordEmail(user[0].Email, user[0].Username, user[0].Id, code);

      res.send("EmailSended");
    }
  } catch (error) {
    res.send(error);
  }
});


/** Delete All Users **/
router.delete("/remove", function (req, res, next) {
  User.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Users were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
});

/** Get All Users **/

router.get("/usersAll", function (req, res, next) {
  User.find(function (err, data) {
    if (err) throw err;
    res.json(data);
  });
});
router.get("/getall", function (req, res, next) {
  User.find(function (err, data) {
    if (err) throw err;
    res.json(data);
  });
});
router.put("/dell/:id", async function (req, res) {
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: { Active: 0 },
    },
    { new: true, useFindAndModify: false },
    function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send("Desactivated");
      }
    }
  );
});
router.put("/putuser/:id", async function (req, res) {
  const password = req.body.Password;
  var roles = "DRE";
  if(req.body.Role==""){
    roles="DRE";
  }
  else roles=req.body.Role
  const hashedPassword = await bcrypt.hash(password, 10);
  const obj = JSON.parse(JSON.stringify(req.body));
  const newuser = {
    Firstname: obj.Firstname,
    Lastname: obj.Lastname,
    Password:hashedPassword,
    Email: obj.Email,
    Role: roles,
    Active: 1
  };
  console.log(obj);
  User.findByIdAndUpdate(req.params.id, newuser, function (err) {
    if (err) throw err;
    res.send("done");
  });
});





router.post("/addxl/:email/:nom/:prenom/:pass", upload, async function (req, res, next) {
  const hashedPassword = await bcrypt.hash(req.params.pass, 10);

 if(req.params.email !="undefined"){
  const params = {
    access_key: 'c997b63a4dd56e42fd1a4c581d378f6d',
    email: req.params.email,
    smpt:1,
    format:1
  }
  axios.get('http://apilayer.net/api/check', {params})
  .then(response => {
    console.log(response.data.smtp_check);
    if(response.data.smtp_check==true){
  const user = new User({
    Firstname:req.params.nom,
    Lastname: req.params.prenom,
    Password: hashedPassword,
    Email: req.params.email,
    Role: "DSI",
    Active: 1,
  });
  try {
    user.save();
    res.send("Ajout");
  } catch (error) {
    res.send(error);
  }

    }
  }).catch(error => {
    console.log(error);
  });
  console.log("le mail"+ req.params.email);
}
else (console.log("undef"))
  res.send("Done");
});



module.exports = router;
