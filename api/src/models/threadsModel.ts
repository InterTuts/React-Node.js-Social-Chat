// Installed Utils
import mongoose from 'mongoose';

// Threads Accounts Schema
const threadsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    label_id: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    }, 
    sender_name: {
        type: String,
        required: true,
    },
    network: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Networks',
        required: true,
    },
    new: {
        type: Boolean,
        required: true,
    }
}, {
  timestamps: true
});

// Export Threads Schema
export default mongoose.model('Threads', threadsSchema);
