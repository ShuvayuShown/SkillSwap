import User from '../models/User.js';
import Review from '../models/Review.js';

// Helper to attach ratings to a user or list of users
const attachRatingsToUsers = async (users) => {
  const userIds = users.map((u) => u._id);
  const reviews = await Review.find({ reviewee: { $in: userIds } });

  const ratingsMap = {};
  reviews.forEach((rev) => {
    const key = rev.reviewee.toString();
    if (!ratingsMap[key]) {
      ratingsMap[key] = { sum: 0, count: 0 };
    }
    ratingsMap[key].sum += rev.rating;
    ratingsMap[key].count += 1;
  });

  return users.map((u) => {
    const userObj = u.toObject ? u.toObject() : { ...u };
    const stats = ratingsMap[userObj._id.toString()];
    userObj.totalReviews = stats ? stats.count : 0;
    userObj.averageRating = stats ? parseFloat((stats.sum / stats.count).toFixed(1)) : 5.0;
    return userObj;
  });
};

// @desc    Get all students with filtering and search
// @route   GET /api/users
// @access  Public
export const getUsers = async (req, res, next) => {
  try {
    const { search, category, level, page = 1, limit = 12 } = req.query;

    const query = {};

    // Exclude currently authenticated user if present
    if (req.user) {
      query._id = { $ne: req.user._id };
    }

    // Filter by category in teaching skills or learning skills
    if (category && category !== 'All') {
      query['skillsToTeach.category'] = category;
    }

    // Filter by proficiency level
    if (level && level !== 'All') {
      query['skillsToTeach.level'] = level;
    }

    // Search by student name, college, or skill name
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { college: searchRegex },
        { 'skillsToTeach.name': searchRegex },
        { 'skillsToLearn.name': searchRegex }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalUsers = await User.countDocuments(query);
    const rawUsers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const usersWithRatings = await attachRatingsToUsers(rawUsers);

    res.status(200).json({
      success: true,
      count: usersWithRatings.length,
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / limitNum) || 1,
      currentPage: pageNum,
      users: usersWithRatings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search students by query
// @route   GET /api/users/search
// @access  Public
export const searchUsers = async (req, res, next) => {
  try {
    const { q, category } = req.query;

    const query = {};
    if (req.user) {
      query._id = { $ne: req.user._id };
    }

    if (category && category !== 'All') {
      query['skillsToTeach.category'] = category;
    }

    if (q && q.trim() !== '') {
      const regex = new RegExp(q.trim(), 'i');
      query.$or = [
        { name: regex },
        { college: regex },
        { 'skillsToTeach.name': regex },
        { 'skillsToLearn.name': regex }
      ];
    }

    const users = await User.find(query).select('-password').limit(20);
    const enriched = await attachRatingsToUsers(users);

    res.status(200).json({
      success: true,
      count: enriched.length,
      users: enriched
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student profile by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.'
      });
    }

    // Fetch reviews received by this student
    const reviews = await Review.find({ reviewee: user._id })
      .populate('reviewer', 'name profileImage college')
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
        : 5.0;

    const userObj = user.toObject();
    userObj.reviews = reviews;
    userObj.totalReviews = totalReviews;
    userObj.averageRating = averageRating;

    res.status(200).json({
      success: true,
      user: userObj
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current logged-in student profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, college, bio, profileImage } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (name) user.name = name.trim();
    if (college) user.college = college.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (profileImage !== undefined) user.profileImage = profileImage.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        bio: user.bio,
        profileImage: user.profileImage,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn
      }
    });
  } catch (error) {
    next(error);
  }
};
