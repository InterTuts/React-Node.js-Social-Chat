'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// Installed Utils
const axios_1 = __importDefault(require('axios'));
// Create axios instance
const instance = axios_1.default.create({
  baseURL: 'http://localhost:5000/',
});
// Export Axios instance
exports.default = instance;
