const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const CommunitySchema = new Schema({
    name: {type: String, maxLength: 128, unique: true},
    slug: {type: String, maxLength: 255, slug: 'name' },
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    created_at: {type: Date, default: new Date(), immutable: true},
    updated_at: {type: Date, default: new Date()}
});

const Community = mongoose.model('Community', CommunitySchema);
module.exports = Community;