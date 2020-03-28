var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var HistorySchema=new Schema({
code:String,
action:String, //sold , assesment,signup
from:{type: Schema.Types.ObjectId, ref: 'user'}, 
to: {type: Schema.Types.ObjectId, ref: 'user'},
codeCount:Number,
assesment:{type: Schema.Types.ObjectId, ref: 'assesment'},
read:Boolean,
actionDate:Date

});

module.exports=mongoose.model('history',HistorySchema);