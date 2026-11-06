import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const SKILL_CATEGORIES = [
  'Programming',
  'Web Development',
  'App Development',
  'Data Science',
  'Artificial Intelligence',
  'UI/UX Design',
  'Graphic Design',
  'Video Editing',
  'Photography',
  'Communication',
  'Music',
  'Languages',
  'Business',
  'Other'
];

export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const skillItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [100, 'Skill name cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: {
        values: SKILL_CATEGORIES,
        message: '{VALUE} is not a valid category'
      }
    },
    level: {
      type: String,
      required: [true, 'Skill proficiency level is required'],
      enum: {
        values: SKILL_LEVELS,
        message: '{VALUE} is not a valid proficiency level'
      },
      default: 'Intermediate'
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
      default: ''
    }
  },
  { _id: true, timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    college: {
      type: String,
      required: [true, 'College / University name is required'],
      trim: true,
      maxlength: [120, 'College name cannot exceed 120 characters']
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: ''
    },
    profileImage: {
      type: String,
      default: ''
    },
    skillsToTeach: [skillItemSchema],
    skillsToLearn: [skillItemSchema]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare candidate password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Text index for search
userSchema.index({
  name: 'text',
  college: 'text',
  'skillsToTeach.name': 'text',
  'skillsToLearn.name': 'text'
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
