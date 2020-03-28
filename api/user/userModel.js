var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt');

var UserSchema=new Schema({
username:{
    type:String,
    unique:true,
    required:true
},
assesmentCount:{ 
    type:Number,
    required:false,
    default:0
},
soldCount:{ 
    type:Number,
    required:false,
    default:0
},
email:
{   type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
clients:[{type: Schema.Types.ObjectId, ref: 'user'}],
consultantEmail:String,
codes:[String],
role:{
type:String, //client , consultant,creator
required:true
}

});

UserSchema.pre('save',function(next){



    if(!this.isModified('password')) return next();




this.password=this.encryptPassword(this.password);

next();

});

UserSchema.methods={
authenticate:function(plaintextPass)
{
    return bcrypt.compareSync(plaintextPass,this.password);

},
encryptPassword:function(plaintextPass)
{
    if(!plaintextPass) {
        return '';
    }
    else
    {
var salt=bcrypt.genSaltSync(10);
return bcrypt.hashSync(plaintextPass,salt);
    }


},
toJson:function()
{
var obj=this.toObject();
delete obj.password;
return obj;
}

};

module.exports=mongoose.model('user',UserSchema);