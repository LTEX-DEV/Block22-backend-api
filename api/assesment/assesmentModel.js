var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var AssesmentSchema=new Schema({
code:String,
answers:Array,
user:{type: Schema.Types.ObjectId, ref: 'user'},
createdDate:Date

});

module.exports=mongoose.model('assesment',AssesmentSchema);