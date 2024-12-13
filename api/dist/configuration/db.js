'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// Installed Utils
const mongoose_1 = __importDefault(require('mongoose'));
const mongoDB = async () => {
  try {
    await mongoose_1.default.connect(process.env.MONGO_DB ?? '');
    console.log('Database connected successfully.');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
exports.default = mongoDB;
