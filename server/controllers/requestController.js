import ExchangeRequest from '../models/ExchangeRequest.js';
import User from '../models/User.js';

// @desc    Create a new skill exchange request
// @route   POST /api/requests
// @access  Private
export const createRequest = async (req, res, next) => {
  try {
    const { receiverId, learningSkill, offeredSkill, message } = req.body;

    if (!receiverId || !learningSkill || !offeredSkill) {
      return res.status(400).json({
        success: false,
        message: 'Please provide receiver, desired learning skill, and offered skill.'
      });
    }

    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send an exchange request to yourself.'
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Target student not found.'
      });
    }

    // Check for existing pending request between these two users for same skill pair
    const existing = await ExchangeRequest.findOne({
      sender: req.user._id,
      receiver: receiverId,
      status: 'pending',
      learningSkill: learningSkill.trim(),
      offeredSkill: offeredSkill.trim()
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active pending exchange request with this student for these skills.'
      });
    }

    const request = await ExchangeRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      learningSkill: learningSkill.trim(),
      offeredSkill: offeredSkill.trim(),
      message: (message || '').trim(),
      status: 'pending'
    });

    await request.populate([
      { path: 'sender', select: 'name email college profileImage' },
      { path: 'receiver', select: 'name email college profileImage' }
    ]);

    res.status(201).json({
      success: true,
      message: `Exchange request sent to ${receiver.name}!`,
      request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get received exchange requests
// @route   GET /api/requests/received
// @access  Private
export const getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await ExchangeRequest.find({ receiver: req.user._id })
      .populate('sender', 'name email college profileImage skillsToTeach skillsToLearn')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sent exchange requests
// @route   GET /api/requests/sent
// @access  Private
export const getSentRequests = async (req, res, next) => {
  try {
    const requests = await ExchangeRequest.find({ sender: req.user._id })
      .populate('receiver', 'name email college profileImage skillsToTeach skillsToLearn')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get completed exchanges
// @route   GET /api/requests/completed
// @access  Private
export const getCompletedExchanges = async (req, res, next) => {
  try {
    const exchanges = await ExchangeRequest.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      status: 'completed'
    })
      .populate('sender', 'name email college profileImage')
      .populate('receiver', 'name email college profileImage')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: exchanges.length,
      exchanges
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept exchange request
// @route   PATCH /api/requests/:id/accept
// @access  Private (Receiver only)
export const acceptRequest = async (req, res, next) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id)
      .populate('sender', 'name email college')
      .populate('receiver', 'name email college');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.receiver._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the recipient can accept this exchange request.'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept a request with status "${request.status}".`
      });
    }

    request.status = 'accepted';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Exchange request accepted! You can now start collaborating.',
      request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject exchange request
// @route   PATCH /api/requests/:id/reject
// @access  Private (Receiver only)
export const rejectRequest = async (req, res, next) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the recipient can decline this request.'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject a request with status "${request.status}".`
      });
    }

    request.status = 'rejected';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Exchange request declined.',
      request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel exchange request
// @route   PATCH /api/requests/:id/cancel
// @access  Private (Sender only)
export const cancelRequest = async (req, res, next) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the sender can cancel this request.'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a request with status "${request.status}".`
      });
    }

    request.status = 'cancelled';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Exchange request cancelled successfully.',
      request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark exchange as completed
// @route   PATCH /api/requests/:id/complete
// @access  Private (Participants only)
export const completeRequest = async (req, res, next) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id)
      .populate('sender', 'name email college')
      .populate('receiver', 'name email college');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const isParticipant =
      request.sender._id.toString() === req.user._id.toString() ||
      request.receiver._id.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only participating students can complete this exchange.'
      });
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: `Only accepted exchanges can be marked as completed. Current status: "${request.status}".`
      });
    }

    request.status = 'completed';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Exchange completed! You can now leave a review for your peer.',
      request
    });
  } catch (error) {
    next(error);
  }
};
