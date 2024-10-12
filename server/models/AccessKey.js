const mongoose = require('mongoose');

const accessKeySchema = new mongoose.Schema({
    currentKey: {
        type: String,
        required: true,
        default: "frui44f", 
    },
});

const AccessKey = mongoose.model('AccessKey', accessKeySchema);

module.exports = AccessKey;
