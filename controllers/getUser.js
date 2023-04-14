const User = require('../models/User');
module.exports = (req,res) => {
    console.log(req.session.userId)
    if(req.session.userId) {
        User.findById(req.session.userId).then((user) => {
        const {name, email, created_at, _id} = user;
        res.status(200).send({name, email, created_at, _id})})
    }
    else {
        console.error('not working')
    }
}