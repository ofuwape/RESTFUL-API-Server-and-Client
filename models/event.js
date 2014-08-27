var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EventSchema   = new Schema({title: String,from: Date, to: Date, location: String, description: String, participants: [String], owner: String});

module.exports = mongoose.model('Event', EventSchema);