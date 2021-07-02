var express = require('express');
var router = express.Router();
var Package = require('../models/Package');
var Customer = require('../models/customer');
var Entreprise = require('../models/entreprise');

                                                /* ********** RESTFUL API ********** */


/** get all packages or get by name*/
router.get('/', function(req, res, next) {
  const Name = req.query.Name;
  var condition = Name ? { Name : { $regex: new RegExp(Name), $options: "i" } } : {};
  Package.find(condition,function(err,data){
    if(err) throw err;
    res.json(data);
  })
});

/*EDITTTTTTTTTTTTTTTTTT*/
router.put('/edit', function (req, res, next) {
  Package.findByIdAndUpdate(req.body.id, req.body, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send("updated");
    }
  });
});
router.delete("/deletePackages",function(req,res){
  Package.deleteMany({}).then(function (doc, err) {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
})

/* Delete Package*/
router.delete('/delete/:id', function (req, res, next) {
  Package.findByIdAndRemove(req.params.id, function (err, docs) {
    if (err) console.log(err);
    else res.send("deleted");
  });
});

router.get("/:id",function (req,res) {
  Package.findById(req.params.id, function (err, doc){
    if(err)
    {
      res.send(err);
    }
    else
    {
      res.send(doc);
    }
  })
})

module.exports = router;
