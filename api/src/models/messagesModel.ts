// Installed Utils
import mongoose from 'mongoose';

// Messages Accounts Schema
const messagesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Threads',
        required: true
    },
    net_id: {
        type: String,
        required: true,
    },
    body: {
        type: Buffer,
        required: true
    },
    page_owner: {
        type: Boolean,
        required: true
    }
}, {
  timestamps: true
});

// Export Messages Schema
export default mongoose.model('Messages', messagesSchema);
