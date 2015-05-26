var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ShowSchema = new Schema({
  title: {type: String, default: ''},
  seasons: {type: Number, default: 0},
  watched: {type: Boolean, default: false}
});

mongoose.model('Show', ShowSchema);
