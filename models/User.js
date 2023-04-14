const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')
const UserSchema = new  Schema({
    name: {type: String, maxLength: 64, default: null},
    email : {type: String, maxLength: 128, unique: true},
    password: {type: String, required: true, maxLength: 64},
    created_at: {type: Date, default: new Date() }
});
UserSchema.pre('save', function(next){
    const user = this
    bcrypt.hash(user.password, 10, (error, hash)=> {
        user.password = hash
        next()
    })
})
const User = mongoose.model('User', UserSchema);
module.exports = User;