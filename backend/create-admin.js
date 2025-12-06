const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating default admin user...\n');

  try {
    // Hash the password "admin"
    const password = 'admin';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Password hashed successfully');

    // Check if admin already exists
    const existingAdmin = await prisma.loginCredential.findUnique({
      where: { username: 'admin@skoolcampus.com' }
    });

    if (existingAdmin) {
      console.log('\n⚠️  Admin user already exists!');
      console.log('Updating password...\n');

      await prisma.loginCredential.update({
        where: { username: 'admin@skoolcampus.com' },
        data: {
          password: hashedPassword,
          active: 1
        }
      });

      console.log('✅ Admin password updated successfully!');
    } else {
      // Create default branch if it doesn't exist
      let branch = await prisma.branch.findFirst();

      if (!branch) {
        console.log('Creating default branch...');
        branch = await prisma.branch.create({
          data: {
            schoolName: 'Default Campus',
            status: 1,
            studentLogin: 1,
            parentLogin: 1
          }
        });
        console.log('✅ Default branch created');
      }

      // Create staff record for admin
      console.log('Creating staff record...');
      const staff = await prisma.staff.create({
        data: {
          name: 'System Administrator',
          gender: 'Male',
          designation: 'Administrator',
          branchId: branch.id
        }
      });
      console.log('✅ Staff record created');

      // Create admin login credential
      console.log('Creating admin login credential...');
      const adminUser = await prisma.loginCredential.create({
        data: {
          username: 'admin@skoolcampus.com',
          password: hashedPassword,
          role: 2, // 2 = Admin role
          userId: staff.id,
          active: 1
        }
      });

      console.log('\n✅ Admin user created successfully!\n');
      console.log('=====================================');
      console.log('Login Credentials:');
      console.log('=====================================');
      console.log('Email: admin@skoolcampus.com');
      console.log('Password: admin');
      console.log('Role: Admin (2)');
      console.log('User ID:', staff.id);
      console.log('Branch ID:', branch.id);
      console.log('=====================================\n');
    }

    // Verify the admin can be found
    const admin = await prisma.loginCredential.findUnique({
      where: { username: 'admin@skoolcampus.com' }
    });

    if (admin) {
      console.log('✅ Verification successful!');
      console.log('Admin user exists in database');
      console.log('Username:', admin.username);
      console.log('Role:', admin.role);
      console.log('Active:', admin.active);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
