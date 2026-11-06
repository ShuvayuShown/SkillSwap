import User, { SKILL_CATEGORIES, SKILL_LEVELS } from '../models/User.js';

// @desc    Get skill metadata (categories and levels)
// @route   GET /api/skills
// @access  Public
export const getSkillsMeta = (req, res) => {
  res.status(200).json({
    success: true,
    categories: SKILL_CATEGORIES,
    levels: SKILL_LEVELS
  });
};

// @desc    Add a skill to teach
// @route   POST /api/skills/teach
// @access  Private
export const addTeachingSkill = async (req, res, next) => {
  try {
    const { name, category, level, description } = req.body;

    if (!name || !category || !level) {
      return res.status(400).json({
        success: false,
        message: 'Please provide skill name, category, and proficiency level.'
      });
    }

    if (!SKILL_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${SKILL_CATEGORIES.join(', ')}`
      });
    }

    if (!SKILL_LEVELS.includes(level)) {
      return res.status(400).json({
        success: false,
        message: `Invalid level. Must be one of: ${SKILL_LEVELS.join(', ')}`
      });
    }

    const user = await User.findById(req.user._id);

    // Prevent duplicate skill entries for the same user
    const duplicate = user.skillsToTeach.some(
      (s) => s.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: `You have already listed "${name}" in your teaching skills.`
      });
    }

    user.skillsToTeach.push({
      name: name.trim(),
      category,
      level,
      description: (description || '').trim()
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Teaching skill added successfully.',
      skillsToTeach: user.skillsToTeach
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a teaching skill
// @route   PUT /api/skills/teach/:id
// @access  Private
export const updateTeachingSkill = async (req, res, next) => {
  try {
    const { name, category, level, description } = req.body;
    const user = await User.findById(req.user._id);

    const skill = user.skillsToTeach.id(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Teaching skill not found.'
      });
    }

    // Check duplicate if name is changing
    if (name && name.toLowerCase().trim() !== skill.name.toLowerCase().trim()) {
      const duplicate = user.skillsToTeach.some(
        (s) =>
          s._id.toString() !== req.params.id &&
          s.name.toLowerCase().trim() === name.toLowerCase().trim()
      );
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `You already have another teaching skill named "${name}".`
        });
      }
      skill.name = name.trim();
    }

    if (category) {
      if (!SKILL_CATEGORIES.includes(category)) {
        return res.status(400).json({ success: false, message: 'Invalid category' });
      }
      skill.category = category;
    }

    if (level) {
      if (!SKILL_LEVELS.includes(level)) {
        return res.status(400).json({ success: false, message: 'Invalid level' });
      }
      skill.level = level;
    }

    if (description !== undefined) {
      skill.description = description.trim();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Teaching skill updated successfully.',
      skillsToTeach: user.skillsToTeach
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a teaching skill
// @route   DELETE /api/skills/teach/:id
// @access  Private
export const deleteTeachingSkill = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const skill = user.skillsToTeach.id(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Teaching skill not found.'
      });
    }

    user.skillsToTeach.pull(req.params.id);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Teaching skill removed successfully.',
      skillsToTeach: user.skillsToTeach
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a skill to learn
// @route   POST /api/skills/learn
// @access  Private
export const addLearningSkill = async (req, res, next) => {
  try {
    const { name, category, level, description } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide skill name and category.'
      });
    }

    if (!SKILL_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${SKILL_CATEGORIES.join(', ')}`
      });
    }

    const user = await User.findById(req.user._id);

    // Prevent duplicate learning skill entries for the same user
    const duplicate = user.skillsToLearn.some(
      (s) => s.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: `You have already listed "${name}" in your learning interests.`
      });
    }

    user.skillsToLearn.push({
      name: name.trim(),
      category,
      level: level || 'Beginner',
      description: (description || '').trim()
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Learning skill added successfully.',
      skillsToLearn: user.skillsToLearn
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a learning skill
// @route   PUT /api/skills/learn/:id
// @access  Private
export const updateLearningSkill = async (req, res, next) => {
  try {
    const { name, category, level, description } = req.body;
    const user = await User.findById(req.user._id);

    const skill = user.skillsToLearn.id(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Learning skill not found.'
      });
    }

    if (name && name.toLowerCase().trim() !== skill.name.toLowerCase().trim()) {
      const duplicate = user.skillsToLearn.some(
        (s) =>
          s._id.toString() !== req.params.id &&
          s.name.toLowerCase().trim() === name.toLowerCase().trim()
      );
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `You already have another learning interest named "${name}".`
        });
      }
      skill.name = name.trim();
    }

    if (category) {
      if (!SKILL_CATEGORIES.includes(category)) {
        return res.status(400).json({ success: false, message: 'Invalid category' });
      }
      skill.category = category;
    }

    if (level) {
      if (!SKILL_LEVELS.includes(level)) {
        return res.status(400).json({ success: false, message: 'Invalid level' });
      }
      skill.level = level;
    }

    if (description !== undefined) {
      skill.description = description.trim();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Learning skill updated successfully.',
      skillsToLearn: user.skillsToLearn
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a learning skill
// @route   DELETE /api/skills/learn/:id
// @access  Private
export const deleteLearningSkill = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const skill = user.skillsToLearn.id(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Learning skill not found.'
      });
    }

    user.skillsToLearn.pull(req.params.id);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Learning interest removed successfully.',
      skillsToLearn: user.skillsToLearn
    });
  } catch (error) {
    next(error);
  }
};
