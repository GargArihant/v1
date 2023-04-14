const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MemberSchema = new Schema({
    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role'
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const Member = mongoose.model('Member', MemberSchema);
module.exports = Member;