const Snowflake = require('@theinternetfolks/snowflake')
const Role = require('../models/Role');
module.exports = async (req,res) => {
    const doc = new Role(req.body);
    doc._id = Snowflake.Snowflake.generate().toString().slice(0,12);
    await doc.save().then(() => res.status(201).send(doc));
};

