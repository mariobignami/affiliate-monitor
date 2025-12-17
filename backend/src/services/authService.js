const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

/**
 * Generate JWT token for user
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Register a new user
 */
const register = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user.id);

    logger.info(`User registered: ${user.email}`);

    return {
      user: user.toJSON(),
      token,
    };
  } catch (error) {
    logger.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login user
 */
const login = async (email, password) => {
  try {
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.active) {
      throw new Error('User account is inactive');
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user.id);

    logger.info(`User logged in: ${user.email}`);

    return {
      user: user.toJSON(),
      token,
    };
  } catch (error) {
    logger.error('Login error:', error);
    throw error;
  }
};

/**
 * Get user profile
 */
const getProfile = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  } catch (error) {
    logger.error('Get profile error:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
const updateProfile = async (userId, updates) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update allowed fields
    const allowedFields = ['name', 'affiliateIds'];
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        user[key] = updates[key];
      }
    });

    await user.save();

    logger.info(`User profile updated: ${user.email}`);

    return user.toJSON();
  } catch (error) {
    logger.error('Update profile error:', error);
    throw error;
  }
};

module.exports = {
  generateToken,
  register,
  login,
  getProfile,
  updateProfile,
};
