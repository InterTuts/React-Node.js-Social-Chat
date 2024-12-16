// Installed Utils
import mongoose from 'mongoose';

// Networks Accounts Schema
const networksSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  network_name: {
      type: String,
      required: true,
      maxlength: 50
  },
  net_id: {
      type: String,
      required: true,
      maxlength: 100
  },
  name: {
      type: String,
      required: true,
      maxlength: 100
  },
  token: {
      type: String,
      required: true
  },
  secret: {
      type: String
  }
}, {
  timestamps: true
});

// Export Networks Schema
export default mongoose.model('Networks', networksSchema);
