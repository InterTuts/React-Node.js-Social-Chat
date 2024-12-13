'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// System Utils
const path_1 = __importDefault(require('path'));
// Installed Utils
const i18n_1 = require('i18n');
// Configure I18n
const i18n = new i18n_1.I18n({
  locales: ['en'],
  defaultLocale: 'en',
  directory: path_1.default.join('./src/', 'messages'),
  objectNotation: true,
});
// Export I18n
exports.default = i18n;
