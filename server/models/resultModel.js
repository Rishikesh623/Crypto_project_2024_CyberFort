const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    quiz_id: { 
        type: String, 
        ref: 'Quiz', 
        required: true 
    },
    user_id: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    selected_options: {
        type: Map,
        of: String, 
        required: true
    },
    total_correct: { 
        type: Number, 
        required: true 
    },
    total_questions: { 
        type: Number, 
        required: true 
    },
    submitted_at: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

resultModel = mongoose.model('Result', resultSchema);

module.exports = resultModel;
