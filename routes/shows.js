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

router.get('/new', function(req, res, next) {
  res.render('shows/new');
});

router.post('/', function(req, res, next) {
  show = new Show({
    title: req.body['show[title]'],
    seasons: req.body['show[seasons]'],
    watched: req.body['show[watched]']
  });
  show.save(function (err, show) {
    if (err) return console.error(err);
    res.redirect('shows/' + show.id);
  });
});

router.get('/:id', function(req, res, next) {
  Show.findOne({_id: req.params.id}, function(err, show) {
    if (err) return console.log(err);
    res.render('shows/show', {show: show});
  });
});

router.get('/:id/edit', function(req, res, next) {
  Show.findOne({_id: req.params.id}, function(err, show) {
    if (err) return console.log(err);
    res.render('shows/edit', {show: show});
  });
});

router.post('/:id', function(req, res, next) {
  Show.findOne({_id: req.params.id}, function(err, show) {
    if (err) return console.log(err);
    show.title = req.body['show[title]'];
    show.seasons = req.body['show[seasons]'];
    show.watched = req.body['show[watched]'];
    show.save(function (err, show) {
      if (err) return console.error(err);
      res.redirect('/shows/' + show.id);
    })
  });
});

router.get('/:id/delete', function(req, res, next) {
  Show.findOne({_id: req.params.id}, function(err, show) {
    if (err) return console.log(err);
    show.remove();
    res.redirect('/shows');
  });
});

module.exports = router;
