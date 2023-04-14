const Snowflake = require('@theinternetfolks/snowflake')
const User = require('../models/User.js')
module.exports = async (req,res) => {
    const doc = new User(req.body);

    doc._id = Snowflake.Snowflake.generate().toString().slice(0,12);
    const {name, email, created_at, _id} = doc;
    await doc.save().then(() => res.status(201).send({name, email, created_at, _id})
    );

};