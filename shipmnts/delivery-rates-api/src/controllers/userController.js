// A "controller" holds the actual LOGIC for an endpoint.
// The route file just says "when this URL is hit, call this function."

const User = require('../models/User');

async function createUser(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'name and email are required'
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        error: 'EMAIL_ALREADY_EXISTS',
        message: 'A user with this email already exists'
      });
    }

    const user = await User.create({ name, email });

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Something went wrong, please try again'
    });
  }
}

module.exports = { createUser };
