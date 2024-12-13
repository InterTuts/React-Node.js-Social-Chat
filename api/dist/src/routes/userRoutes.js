'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// Installed Utils
const express_1 = __importDefault(require('express'));
// App Utils
const AuthenticatedRequest_1 = require('../middlewares/AuthenticatedRequest');
const userController_1 = require('../controllers/userController');
// Init the route manager
const userRoute = express_1.default.Router();
// Supported routes
userRoute.get(
  '/info',
  AuthenticatedRequest_1.userMiddleware,
  userController_1.userInfo,
);
exports.default = userRoute;
