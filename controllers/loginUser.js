const bcrypt = require('bcryptjs')
const User = require('../models/User')
module.exports = (req, res) =>{
const { email, password } = req.body;
User.findOne({email:email}).then((user) =>
{
bcrypt.compare(password, user.password).then((same) =>{
if(same){ 
req.session.userId = user._id;
const {name, email, created_at, _id} = user;
res.status(200).send({name, email, created_at, _id})
} else{
 res.status(401).send('wrong password')
 }
})})
};