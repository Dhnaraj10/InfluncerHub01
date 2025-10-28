//backend/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import InfluencerProfile from './models/InfluencerProfile.js';
import Sponsorship from './models/Sponsorship.js';
import Category from './models/Category.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/influencerhub';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await InfluencerProfile.deleteMany({});
  await Sponsorship.deleteMany({});
  await Category.deleteMany({});

  // Create categories
  const fitnessCategory = await Category.create({ name: 'Fitness' });
  const lifestyleCategory = await Category.create({ name: 'Lifestyle' });

  // Create demo sponsor
  const sponsor = await User.create({
    name: 'Demo Sponsor',
    email: 'sponsor@example.com',
    password: 'password',
    role: 'brand',
  });

  // Create demo influencer
  const influencerUser = await User.create({
    name: 'Demo Influencer',
    email: 'influencer@example.com',
    password: 'password',
    role: 'influencer',
  });

  // Create influencer profile
  const influencerProfile = await InfluencerProfile.create({
    user: influencerUser._id,
    handle: 'demoinfluencer',
    bio: 'Fitness and lifestyle influencer',
    categories: [fitnessCategory._id, lifestyleCategory._id],
    followerCount: 10000,
    socialLinks: { instagram: 'https://instagram.com/demo' },
  });

  // Create sponsorship
  await Sponsorship.create({
    title: 'Demo Sponsorship',
    brand: sponsor._id,
    influencer: influencerProfile._id,
    status: 'pending',
    description: 'Demo campaign for fitness product',
  });

  console.log('Demo data seeded!');
  process.exit();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
