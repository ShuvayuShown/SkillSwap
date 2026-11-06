import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import ExchangeRequest from '../models/ExchangeRequest.js';
import Review from '../models/Review.js';
import connectDB from '../config/db.js';

dotenv.config();

const sampleUsers = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    password: 'Password@123',
    college: 'IIT Bombay',
    bio: 'Computer Science sophomore passionate about backend architecture, algorithms, and distributed systems. Looking to level up my design sense for personal projects.',
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    skillsToTeach: [
      {
        name: 'Java',
        category: 'Programming',
        level: 'Advanced',
        description: 'Core Java, OOP principles, Collections framework, Multi-threading and concurrency.'
      },
      {
        name: 'Spring Boot',
        category: 'Web Development',
        level: 'Intermediate',
        description: 'RESTful API design, Hibernate ORM, and Spring Security fundamentals.'
      },
      {
        name: 'MySQL',
        category: 'Programming',
        level: 'Advanced',
        description: 'Complex querying, indexing, schema normalization, and query optimization.'
      }
    ],
    skillsToLearn: [
      {
        name: 'Photoshop',
        category: 'Graphic Design',
        level: 'Beginner',
        description: 'Photo manipulation, digital assets preparation, and brand design.'
      },
      {
        name: 'UI/UX Design',
        category: 'UI/UX Design',
        level: 'Beginner',
        description: 'Wireframing, typography, design systems, and Figma prototypes.'
      }
    ]
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    password: 'Password@123',
    college: 'NID Ahmedabad',
    bio: 'Communication Design major obsessed with typography, micro-interactions, and visual storytelling. Want to understand programming so I can communicate better with developers.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    skillsToTeach: [
      {
        name: 'Photoshop',
        category: 'Graphic Design',
        level: 'Expert',
        description: 'Advanced retouching, layer masking, raster effects, and creative composites.'
      },
      {
        name: 'UI/UX Design',
        category: 'UI/UX Design',
        level: 'Advanced',
        description: 'User journey mapping, design systems, wireframes, and design thinking.'
      },
      {
        name: 'Figma',
        category: 'UI/UX Design',
        level: 'Expert',
        description: 'Components, auto-layout 5.0, interactive prototypes, and token systems.'
      }
    ],
    skillsToLearn: [
      {
        name: 'Java',
        category: 'Programming',
        level: 'Beginner',
        description: 'Basics of object-oriented programming to build simple student tools.'
      },
      {
        name: 'Web Development',
        category: 'Web Development',
        level: 'Beginner',
        description: 'HTML5 semantic tags, CSS Flexbox & Grid, basic JavaScript.'
      }
    ]
  },
  {
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    password: 'Password@123',
    college: 'BITS Pilani',
    bio: 'Full-stack developer building modern web apps. Proficient in React and Node.js. Excited to dive into AI and data science fundamentals.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    skillsToTeach: [
      {
        name: 'ReactJS',
        category: 'Web Development',
        level: 'Advanced',
        description: 'Hooks, state management, custom hooks, performance tuning, and Vite.'
      },
      {
        name: 'Node.js',
        category: 'Web Development',
        level: 'Intermediate',
        description: 'Express servers, middleware architecture, JWT authentication, and MongoDB.'
      }
    ],
    skillsToLearn: [
      {
        name: 'Python',
        category: 'Programming',
        level: 'Intermediate',
        description: 'NumPy, Pandas, scripting, and web scraping.'
      },
      {
        name: 'Machine Learning',
        category: 'Artificial Intelligence',
        level: 'Beginner',
        description: 'Supervised learning models, scikit-learn, regression, and classification.'
      }
    ]
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    password: 'Password@123',
    college: 'IISc Bangalore',
    bio: 'Data Science researcher working with ML pipelines and statistical modeling. Want to learn frontend development to deploy interactive dashboards.',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    skillsToTeach: [
      {
        name: 'Python',
        category: 'Programming',
        level: 'Expert',
        description: 'Advanced Python idioms, decorators, generators, data pipelines.'
      },
      {
        name: 'Machine Learning',
        category: 'Artificial Intelligence',
        level: 'Advanced',
        description: 'Model evaluation, cross-validation, feature engineering, and neural nets.'
      },
      {
        name: 'Data Science',
        category: 'Data Science',
        level: 'Expert',
        description: 'Exploratory data analysis, statistical tests, Matplotlib & Seaborn.'
      }
    ],
    skillsToLearn: [
      {
        name: 'ReactJS',
        category: 'Web Development',
        level: 'Beginner',
        description: 'Interactive dashboard components and chart integration in React.'
      }
    ]
  },
  {
    name: 'Rohan Verma',
    email: 'rohan.verma@example.com',
    password: 'Password@123',
    college: 'Delhi Technological University',
    bio: 'Videographer and motion designer on campus. Created YouTube shorts with 1M+ views. Looking to learn photography lighting and portrait composition.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    skillsToTeach: [
      {
        name: 'Video Editing',
        category: 'Video Editing',
        level: 'Expert',
        description: 'Premiere Pro workflows, pacing, color grading, sound design.'
      },
      {
        name: 'After Effects',
        category: 'Video Editing',
        level: 'Intermediate',
        description: 'Keyframe animations, kinetic typography, lower thirds.'
      }
    ],
    skillsToLearn: [
      {
        name: 'Photography',
        category: 'Photography',
        level: 'Intermediate',
        description: 'Manual camera settings, natural lighting, shutter speed techniques.'
      }
    ]
  },
  {
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@example.com',
    password: 'Password@123',
    college: 'Symbiosis Pune',
    bio: 'Campus photographer and digital marketer. Captured hundreds of college events and product shoots. Eager to master fast-paced short-form video editing.',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    skillsToTeach: [
      {
        name: 'Photography',
        category: 'Photography',
        level: 'Expert',
        description: 'Portrait lighting, focal length selection, RAW processing in Lightroom.'
      },
      {
        name: 'Public Speaking',
        category: 'Communication',
        level: 'Advanced',
        description: 'Debate preparation, slide deck pitch, voice modulation.'
      }
    ],
    skillsToLearn: [
      {
        name: 'Video Editing',
        category: 'Video Editing',
        level: 'Beginner',
        description: 'Reels and TikTok editing pacing and sound synchronization.'
      }
    ]
  }
];

export const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      ExchangeRequest.deleteMany({}),
      Review.deleteMany({})
    ]);

    console.log('[Seed] Creating sample student users...');
    const createdUsers = [];
    for (const u of sampleUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`[Seed] Created ${createdUsers.length} students.`);

    const [rahul, priya, aarav, ananya, rohan, sneha] = createdUsers;

    console.log('[Seed] Creating sample exchange requests...');
    // Completed exchange between Rahul and Priya
    const exchange1 = await ExchangeRequest.create({
      sender: rahul._id,
      receiver: priya._id,
      learningSkill: 'Photoshop',
      offeredSkill: 'Java',
      message: 'Hey Priya! I saw you are a pro at Photoshop. I can help you with Java fundamentals in exchange for Photoshop lessons!',
      status: 'completed'
    });

    // Another accepted exchange between Aarav and Ananya
    await ExchangeRequest.create({
      sender: aarav._id,
      receiver: ananya._id,
      learningSkill: 'Machine Learning',
      offeredSkill: 'ReactJS',
      message: 'Hi Ananya! Would love to trade React component architecture for ML basics.',
      status: 'accepted'
    });

    // Pending incoming request for Rahul from Sneha
    await ExchangeRequest.create({
      sender: sneha._id,
      receiver: rahul._id,
      learningSkill: 'Java',
      offeredSkill: 'Photography',
      message: 'Hello Rahul! I need help with college Java lab assignments. I can teach you photography in return!',
      status: 'pending'
    });

    // Pending incoming request for Priya from Rohan
    await ExchangeRequest.create({
      sender: rohan._id,
      receiver: priya._id,
      learningSkill: 'UI/UX Design',
      offeredSkill: 'Video Editing',
      message: 'Hi Priya! I want to design an app for video creators and would love some UI feedback from you.',
      status: 'pending'
    });

    console.log('[Seed] Creating sample reviews for completed exchange...');
    // Rahul reviews Priya
    await Review.create({
      exchangeRequest: exchange1._id,
      reviewer: rahul._id,
      reviewee: priya._id,
      rating: 5,
      comment: 'Priya was fantastic! She explained Photoshop layer masks and blending modes so simply. Within two sessions I designed my first banner!'
    });

    // Priya reviews Rahul
    await Review.create({
      exchangeRequest: exchange1._id,
      reviewer: priya._id,
      reviewee: rahul._id,
      rating: 5,
      comment: 'Rahul is an exceptionally patient teacher. Java object-oriented principles finally clicked for me. Highly recommend exchanging skills with him!'
    });

    console.log('✅ [Seed] Database seeded successfully with vibrant student community data!');
    return true;
  } catch (error) {
    console.error('❌ [Seed] Error seeding database:', error);
    throw error;
  }
};

// If run directly via node utils/seedData.js
if (process.argv[1].endsWith('seedData.js')) {
  seedDatabase()
    .then(() => {
      console.log('Done seeding.');
      process.exit(0);
    })
    .catch(() => process.exit(1));
}
