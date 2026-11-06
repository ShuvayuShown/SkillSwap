import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Review from '../models/Review.js';

// Helper to generate JWT token and cookie options
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'skillswap_dev_secret_key_2026',
    { expiresIn: '7d' }
  );

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  };

  res.cookie('token', token, cookieOptions);

  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    college: user.college,
    bio: user.bio,
    profileImage: user.profileImage,
    skillsToTeach: user.skillsToTeach,
    skillsToLearn: user.skillsToLearn,
    createdAt: user.createdAt
  };

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: sanitizedUser
  });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, college } = req.body;

    if (!name || !email || !password || !college) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, and college.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this email already exists.'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      college: college.trim(),
      bio: '',
      skillsToTeach: [],
      skillsToLearn: []
    });

    sendTokenResponse(user, 201, res, 'Registration successful! Welcome to SkillSwap.');
  } catch (error) {
    next(error);
  }
};

// @desc    Login student
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    sendTokenResponse(user, 200, res, 'Login successful.');
  } catch (error) {
    next(error);
  }
};

// @desc    Logout student / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully.'
  });
};

// @desc    Get current logged in student profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Calculate user's average rating
    const reviews = await Review.find({ reviewee: user._id });
    const averageRating =
      reviews.length > 0
        ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
        : 5.0;

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        bio: user.bio,
        profileImage: user.profileImage,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn,
        createdAt: user.createdAt,
        averageRating,
        totalReviews: reviews.length
      }
    });
  } catch (error) {
    next(error);
  }
};
