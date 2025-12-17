const authService = require('../../services/authService');

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    if (error.message.includes('Invalid credentials') || error.message.includes('inactive')) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await authService.getProfile(req.user.id);
    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const profile = await authService.updateProfile(req.user.id, req.body);
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
