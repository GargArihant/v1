const Member = require('../models/Member');
const Snowflake = require('@theinternetfolks/snowflake')
const Community = require('../models/Community');
const Role = require('../models/Role');
module.exports = async (req,res) => {
    const doc = await Community.findById(req.body.community).limit(1).exec();
    if(req.session.userId == doc[0].owner) {
        const doc2 = new Member();
        doc2.user = req.body.user;
        doc2.role = req.body.role;
        doc2.community = req.body.community;
        doc2._id = Snowflake.Snowflake.generate().toString().slice(0,12);
        await doc2.save();
        res.send(doc2);
    } else {
        res.status(401);
    }
}