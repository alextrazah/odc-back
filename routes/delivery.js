var express = require("express");
var router = express.Router();
var delivery = require("../models/delivery");
var Customer = require("../models/customer");
var Entreprise = require("../models/entreprise");
var mongoose = require("mongoose");
const Package = require("../models/Package");
var Vehicule = require("../models/vehicule");
/* ********** RESTFUL API ********** */

/** get all deliverys or get by name*/
router.get("/", function (req, res, next) {
  const Name = req.query.Name;
  var condition = Name
    ? { Name: { $regex: new RegExp(Name), $options: "i" } }
    : {};
  delivery
    .find(condition, function (err, data) {
      if (err) throw err;
      res.json(data);
    })
    .populate("customer package driver");
});
router.get("/getLastDeliveryByCustomer/:id", function (req, res) {
  delivery.find({ customer: req.params.id }, function (err, doc) {
    if (err) {
      res.send(err);
    } else {
      if (doc) {
        res.send(doc.pop());
      } else res.send("ok");
    }
  });
});
router.get("/getDeliveryByCustomer/:id", function (req, res) {
  delivery
    .find({ customer: req.params.id }, function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send(doc);
      }
    })
    .populate("package");
});

/* start delivery */
router.post("/startDelivery", function (req, res) {
  const package = new Package({
    note: req.body.package[0].note,
    dimension: {
      Length: Number(req.body.package[0].dimension.Length),
      Height: Number(req.body.package[0].dimension.Height),
      Width: Number(req.body.package[0].dimension.Width),
    },
    type: req.body.package[0].type,
    weight: Number(req.body.package[0].weight),
  });
  //console.log(package);
  if (req.body.driver === "") {
    Vehicule.find(function (err, data) {
      if (err) {
        console.log("vehicle problem");
        console.log(err);
      } else {
        let myVehicles = data.filter((vehicle) => {
          console.log("package weight:", Number(req.body.package[0].weight));
          return vehicle.weightLeft >= Number(req.body.package[0].weight);
        });
        req.body.driver = myVehicles[0].driver;
        console.log("driver id : ", myVehicles[0].driver);
        console.log("vehicle id : ", myVehicles[0]._id);
        Vehicule.findByIdAndUpdate(
          myVehicles[0]._id,
          {
            $inc: { weightLeft: -req.body.package[0].weight },
          },
          { new: true, useFindAndModify: false },
          function (err, doc) {
            if (err) {
              res.send(err);
            } else {
              console.log("weight removed");
            }
          }
        );
      }
    });
  }

  try {
    Package.create(package).then((p) => {
      var newDeliery = req.body;
      newDeliery.package = p._id;
      delivery.create(newDeliery).then((d) => {
        if (req.body.CustomerModel.toLowerCase() == "customer") {
          Customer.findByIdAndUpdate(
            req.body.customer,
            {
              $push: { deliveries: d._id },
            },
            { new: true, useFindAndModify: false },
            function (err) {
              if (err) {
                res.send(err);
              } else {
                res.json(d);
              }
            }
          );
        } else {
          Entreprise.findByIdAndUpdate(
            req.body.customer,
            {
              $push: { deliveries: d._id },
            },
            { new: true, useFindAndModify: false },
            function (err) {
              if (err) {
                res.send(err);
              } else {
                res.json(d);
              }
            }
          );
        }
      });
    });
  } catch (error) {
    res.send(error);
  }
});
router.get("/:id", function (req, res) {
  delivery
    .findById(req.params.id, function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send(doc);
      }
    })
    .populate("package customer driver");
});
router.delete("/deleteDelivery/:id", function (req, res) {
  delivery.findByIdAndRemove(req.params.id, function (err, del) {
    if (err) {
      res.send(err);
    } else {
      res.send(del);
    }
  });
});
router.put("/updateDelivery", function (req, res) {
  delivery.findByIdAndUpdate(req.body.id, req.body, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send("updated");
    }
  });
});
router.put("/cancelDelivery/:id", function (req, res) {
  delivery.findByIdAndUpdate(
    req.params.id,
    {
      $set: { state: -1 },
    },
    { new: true, useFindAndModify: false },
    function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send("Delivery canceled");
      }
    }
  );
});
router.put("/confirmDeliveryCustomer/:id", function (req, res) {
  delivery.findByIdAndUpdate(
    req.params.id,
    {
      $set: { state: 2 },
    },
    { new: true, useFindAndModify: false },
    function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send("Delivery confirmed by customer");
      }
    }
  );
});
/* ---------------------- driver part delivery ----------------------- */
router.put("/confirmDeliveryDriver/:id", function (req, res) {
  delivery.findByIdAndUpdate(
    req.params.id,
    {
      $set: { state: 2 },
    },
    { new: true, useFindAndModify: false },
    function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send("Delivery confirmed by driver");
      }
    }
  );
});

router.put("/confirmsigndrop/:id", function (req, res) {
  delivery.findByIdAndUpdate(
    req.params.id,
    {
      $set: { state: 4 },
    },
    { new: true, useFindAndModify: false },
    function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send("Delivery confirmed by driver");
      }
    }
  );
});

router.put("/acceptdelivery/:id", function (req, res) {
  delivery.findByIdAndUpdate(
    req.params.id,
    {
      $set: { state: 1 },
    },
    { new: true, useFindAndModify: false },
    function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send("Delivery accepted");
      }
    }
  );
});

router.put("/confirmdrop/:id", function (req, res) {
  delivery.findByIdAndUpdate(
    req.params.id,
    {
      $set: { state: 3 },
    },
    { new: true, useFindAndModify: false },
    function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send("Delivery confirmed");
      }
    }
  );
});

router.get("/delivsfordv/:id", function (req, res) {
  delivery
    .find(
      {
        state: 0,
        driver: req.params.id,
      },
      function (err, doc) {
        if (err) {
          res.send(err);
        } else {
          res.send(doc);
        }
      }
    )
    .populate("package");
});

router.get("/delivsongo/:id", function (req, res) {
  delivery
    .find({ state: 1, driver: req.params.id }, function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send(doc);
      }
    })
    .populate("package");
});

router.get("/delivstatesecond/:id", function (req, res) {
  delivery
    .find({ state: 2, driver: req.params.id }, function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send(doc);
      }
    })
    .populate("package");
});
router.get("/delivstatethird/:id", function (req, res) {
  delivery
    .find({ state: 3, driver: req.params.id }, function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send(doc);
      }
    })
    .populate("package");
});

router.delete("/deleteAllDeliveries", function (req, res) {
  delivery.deleteMany({}).then(function (doc, err) {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

router.put("/setfourth/:id", function (req, res) {
  delivery.findByIdAndUpdate(
    req.params.id,
    {
      $set: { state: 3 },
    },
    { new: true, useFindAndModify: false },
    function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send("Delivery confirmed");
      }
    }
  );
});

router.put("/setfifth/:id", function (req, res) {
  delivery.findByIdAndUpdate(
    req.params.id,
    {
      $set: { state: 5 },
    },
    { new: true, useFindAndModify: false },
    function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send("Delivery confirmed");
      }
    }
  );
});

module.exports = router;
