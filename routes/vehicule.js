var express = require("express");
var router = express.Router();
var vehicule = require("../models/vehicule");

/* GET contact DB. */
router.get("/", function (req, res, next) {
  vehicule
    .find(function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    })
    .populate("driver");
});

/*Get*/
router.get("/:id", function (req, res, next) {
  vehicule.findById(req.params.id, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render("detail", { vehicule: data });
    }
  });
});
/* POST 2*/
router.post("/add", function (req, res, next) {
  const obj = JSON.parse(JSON.stringify(req.body));
  console.log(obj);
  const newVehicule = {
    registrationNumber: obj.registrationNumber,
    model: obj.model,
    weightCapacity: obj.weightCapacity,
    trunkVolume: obj.trunkVolume,
    volumeLeft: obj.trunkVolume,
    weightLeft: obj.weightCapacity,
    driver: obj.driver,
  };
  vehicule.create(newVehicule, function (err) {
    if (err) {
      res.render("/vehicle");
    } else {
      res.redirect("/vehicle");
    }
  });
});
/*EDIT*/
router.post("/edit/:id", function (req, res, next) {
  const obj = JSON.parse(JSON.stringify(req.body));
  console.log(obj);
  const newVehicle = {
    registrationNumber: obj.registrationNumber,
    model: obj.model,
    weightCapacity: obj.weightCapacity,
    trunkVolume: obj.trunkVolume,
  };
  vehicule.findByIdAndUpdate(req.params.id, newVehicle, function (err) {
    if (err) {
      res.render("/vehicle/edit/" + req.params.id);
    } else {
      res.redirect("/vehicle");
    }
  });
});

/* Delete contact*/
router.delete("/delete/:id", function (req, res, next) {
  vehicule.findByIdAndRemove(req.params.id, function (err, docs) {
    if (err) console.log(err);
    res.redirect("/vehicle");
  });
});
router.get("/edit/vehicule/:id", function (req, res, next) {
  vehicule.findById(req.params.id, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render("editvehicule", { vehicule: data });
    }
  });
});

module.exports = router;
