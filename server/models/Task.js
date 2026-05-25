const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a task title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    status: {
        type: String,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'], // ഈ 3 സ്റ്റാറ്റസുകൾ മാത്രമേ സ്വീകരിക്കൂ
        default: 'TODO'
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM'
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace', // ഏത് വർക്ക്‌സ്‌പേസിലെ ടാസ്ക് ആണെന്ന് അറിയാൻ (Linked)
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // ഈ ടാസ്ക് ആർക്കാണ് അസൈൻ ചെയ്തിരിക്കുന്നത് എന്ന് രേഖപ്പെടുത്താൻ
    },
    dueDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', TaskSchema);