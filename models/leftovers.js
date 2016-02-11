/**
 * Created by abrooksnagel on 2/11/16.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LeftoverSchema = new Schema({
    foodItem: {type:String},
    entryDate: {type: Date, default: Date.now}
});

var Leftover = mongoose.model('Leftover', LeftoverSchema);

module.exports = Leftover;
