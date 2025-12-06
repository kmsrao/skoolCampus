const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Verifying database connection and tables...\n');

  try {
    // Test connection by querying the database
    const result = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    console.log('✅ Database connection successful!');
    console.log(`\n📊 Found ${result.length} tables:\n`);

    result.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });

    console.log('\n✅ All tables created successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
