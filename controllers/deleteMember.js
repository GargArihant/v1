const Member = require('../models/Member');
const Community = require('../models/Community');
module.exports = async(req,res) => {
    const doc = Member.findById(req.params.id).exec();
    const doc2 = Community.findById(doc[0].community).exec();
    const doc3 = Member.find({community: doc[0].community, user: req.session.userid}).exec();
    if (doc3[0].role == "Community Admin" || doc3[0].role == "Community Moderator") {
           await  Member.deleteOne({_id: req.params.id}).then(() => res.status(200));
    } else {
        res.status(401);
    }
}