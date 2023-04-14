const Community = require('../models/Community');
const Role = require('../models/Role');
const Member = require('../models/Member');
const Snowflake = require('@theinternetfolks/snowflake')
module.exports = async (req,res) => {
    if(req.session.userId) {
    const doc = new Community(req.body);
    doc.owner = req.session.userId;
    doc._id = Snowflake.Snowflake.generate().toString().slice(0,12);
    await doc.save().then(() => res.status(201).send(doc));
    const doc2 = new Role({name: "Community Admin"});
    doc2._id =  Snowflake.Snowflake.generate().toString().slice(0,12);
    await doc2.save();
    const doc3 = new Member();
    doc3._id = Snowflake.Snowflake.generate().toString().slice(0,12);
    doc3.community = doc._id;
    doc3.user = req.session.userId;
    doc3.role = doc2._id;
    await doc3.save();
    }
}