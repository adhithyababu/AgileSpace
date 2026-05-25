const mongoose = require('mongoose');

const WorkspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a workspace name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // ഈ വർക്ക്‌സ്‌പേസ് ഉണ്ടാക്കിയ ആളുടെ User ID (Linked to User Collection)
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // ഇതിൽ ജോയിൻ ചെയ്ത മറ്റ് ടീം മെമ്പേഴ്സിന്റെ ID-കൾ (Array)
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Workspace', WorkspaceSchema);