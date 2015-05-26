var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Show = mongoose.model('Show');

router.get('/', function(req, res, next) {
  Show.find({}, function(err, shows) {
    if (err) return console.log(err);
    res.render('shows/index', {shows: shows});
  });
});

module.exports = router;
