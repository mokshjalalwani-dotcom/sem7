// Every API (except Create User) needs to know "who is calling this?"
// That comes from a header called current_user_id — NOT the request body.
// This middleware reads it once and attaches it to req.currentUserId,
// so every controller can just use req.currentUserId directly.

function currentUser(req, res, next) {
  const currentUserId = req.headers['current_user_id'];

  if (!currentUserId) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'current_user_id header is required'
    });
  }

  req.currentUserId = currentUserId;
  next();
}

module.exports = currentUser;
