import User from '../models/User.js';
import ExchangeRequest from '../models/ExchangeRequest.js';
import Review from '../models/Review.js';
import { calculateSkillMatches } from '../utils/matchingEngine.js';

// @desc    Get dashboard statistics and recent activity
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Counts
    const teachingCount = (user.skillsToTeach || []).length;
    const learningCount = (user.skillsToLearn || []).length;

    const [
      incomingPending,
      outgoingPending,
      acceptedCount,
      completedCount,
      reviewsReceived
    ] = await Promise.all([
      ExchangeRequest.countDocuments({ receiver: userId, status: 'pending' }),
      ExchangeRequest.countDocuments({ sender: userId, status: 'pending' }),
      ExchangeRequest.countDocuments({
        $or: [{ sender: userId }, { receiver: userId }],
        status: 'accepted'
      }),
      ExchangeRequest.countDocuments({
        $or: [{ sender: userId }, { receiver: userId }],
        status: 'completed'
      }),
      Review.find({ reviewee: userId })
    ]);

    const averageRating =
      reviewsReceived.length > 0
        ? parseFloat((reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / reviewsReceived.length).toFixed(1))
        : 5.0;

    // Recent activity (latest 6 requests involving user)
    const recentActivity = await ExchangeRequest.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .populate('sender', 'name profileImage college')
      .populate('receiver', 'name profileImage college')
      .sort({ updatedAt: -1 })
      .limit(6);

    // Candidates for recommendations
    const otherUsers = await User.find({ _id: { $ne: userId } })
      .select('-password')
      .limit(50);

    const matches = calculateSkillMatches(user, otherUsers);
    const topRecommendations = matches.slice(0, 4);

    res.status(200).json({
      success: true,
      stats: {
        teachingCount,
        learningCount,
        incomingPending,
        outgoingPending,
        acceptedCount,
        completedCount,
        totalReviews: reviewsReceived.length,
        averageRating
      },
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        bio: user.bio,
        profileImage: user.profileImage,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn
      },
      recentActivity,
      recommendations: topRecommendations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skill exchange recommendations with reasons
// @route   GET /api/dashboard/recommendations
// @access  Private
export const getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otherUsers = await User.find({ _id: { $ne: req.user._id } })
      .select('-password')
      .limit(80);

    const recommendations = calculateSkillMatches(user, otherUsers);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    next(error);
  }
};
