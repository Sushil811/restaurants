import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lumiere';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');

    const adminEmail = 'admin@lumiere.com';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      existingAdmin.password = 'AdminPassword123!';
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log(`Admin user already exists. Password reset successfully for email: ${adminEmail}`);
      console.log(`Password: AdminPassword123!`);
      process.exit(0);
    }

    // Create admin
    const adminUser = new User({
      name: 'Admin User',
      email: adminEmail,
      password: 'AdminPassword123!',
      role: 'admin',
      isEmailVerified: true,
      phone: '9876543210',
    });

    await adminUser.save();
    console.log('Admin user seeded successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: AdminPassword123!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
