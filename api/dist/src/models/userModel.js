'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// Installed Utils
const mongoose_1 = __importDefault(require('mongoose'));
const bcryptjs_1 = __importDefault(require('bcryptjs'));
// App Utils
const i18n_config_1 = __importDefault(require('../i18n.config'));
// User Schema
const userSchema = new mongoose_1.default.Schema(
  {
    email: {
      type: String,
      required: [true, i18n_config_1.default.__('email_is_required')],
      unique: true,
    },
    password: {
      type: String,
      required: [true, i18n_config_1.default.__('password_is_required')],
    },
    social_id: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);
// Pre-save middleware to hash the password before saving the user
userSchema.pre('save', async function (next) {
  try {
    // Check if the password is modified
    if (!this.isModified('password')) {
      return next();
    }
    // Generate a salt
    const salt = await bcryptjs_1.default.genSalt(10);
    // Hash the password using the generated salt
    const hashedPassword = await bcryptjs_1.default.hash(this.password, salt);
    // Set the hashed password on the user document
    this.password = hashedPassword;
    next();
  } catch (err) {
    console.log(err);
    next();
  }
});
// Pre-save middleware to hash the password before updating the user
userSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate();
    // Ensure the update object is of type UpdateQuery
    if (update && typeof update === 'object' && !Array.isArray(update)) {
      if (update.$set && update.$set.password) {
        // Generate a salt
        const salt = await bcryptjs_1.default.genSalt(10);
        // Hash the new password using the generated salt
        const hashedPassword = await bcryptjs_1.default.hash(
          update.$set.password,
          salt,
        );
        // Set the hashed password on the update object
        update.$set.password = hashedPassword;
      }
      // Automatically update the updatedAt field
      if (!update.$set) {
        update.$set = {};
      }
      update.$set.updatedAt = new Date();
    }
    next();
  } catch (err) {
    console.log(err);
    // Pass the error to the next middleware
    next();
  }
});
// Export User Schema
exports.default = mongoose_1.default.model('User', userSchema);
