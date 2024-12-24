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

// Middleware to handle cascading deletes
networksSchema.pre('deleteOne', async function (next) {

    try {

        // Get the query that was executed
        const networkId = this.getQuery()._id;

        // Delete Messages associated with Threads from this Network
        const threads = await mongoose.model('Threads').find({ network: networkId }).select('_id');

        // Get all threads
        const threadIds = threads.map(thread => thread._id);

        // Delete Threads associated with this Network
        await mongoose.model('Threads').deleteMany({ network: networkId });
    
        // Delete messages
        await mongoose.model('Messages').deleteMany({ thread: { $in: threadIds } });
    
        next();

    } catch (err) {
        console.log(err);
        // Pass the error to the next middleware
        next();
    }

});

// Export Networks Schema
export default mongoose.model('Networks', networksSchema);
