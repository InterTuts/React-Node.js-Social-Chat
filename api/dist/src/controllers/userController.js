'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.userInfo = void 0;
/**
 * Get the user info
 *
 * @param Request req
 * @param Response res
 */
const userInfo = async (req, res) => {
  // Get the user data
  const { user } = req;
  // Verify if user's data exists
  if (!user?._id) {
    // Return error message
    return res.status(200).json({
      success: false,
      message: i18n.__('user_was_not_found'),
    });
  }
  // Return success message
  res.status(200).json({
    success: true,
    content: {
      id: user?._id,
      email: user?.email,
    },
  });
};
exports.userInfo = userInfo;
