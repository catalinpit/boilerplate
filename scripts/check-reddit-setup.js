#!/usr/bin/env node

// Simple script to check Reddit API setup
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

console.log('🔍 Checking Reddit API Setup...\n');

const requiredVars = [
  'REDDIT_CLIENT_ID',
  'REDDIT_CLIENT_SECRET',
  'REDDIT_USER_AGENT'
];

const optionalVars = [
  'REDDIT_REFRESH_TOKEN'
];

let hasErrors = false;

console.log('📋 Required Environment Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const display = value ? (varName === 'REDDIT_CLIENT_SECRET' ? '[HIDDEN]' : value) : 'MISSING';
  
  console.log(`  ${status} ${varName}: ${display}`);
  
  if (!value) {
    hasErrors = true;
  }
});

console.log('\n📋 Optional Environment Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '⚠️';
  const display = value ? '[SET]' : 'NOT SET';
  
  console.log(`  ${status} ${varName}: ${display}`);
});

console.log('\n🔧 Database Configuration:');
const dbUrl = process.env.DATABASE_URL;
const dbStatus = dbUrl ? '✅' : '❌';
console.log(`  ${dbStatus} DATABASE_URL: ${dbUrl ? '[SET]' : 'MISSING'}`);

if (!dbUrl) {
  hasErrors = true;
}

console.log('\n📊 Summary:');
if (hasErrors) {
  console.log('❌ Setup has issues. Please check the missing environment variables.');
  console.log('\n🛠️  To fix:');
  console.log('   1. Copy .env.local.example to .env.local');
  console.log('   2. Add your Reddit API credentials');
  console.log('   3. Configure your database URL');
  console.log('   4. Visit /reddit-monitor/setup for detailed instructions');
  process.exit(1);
} else {
  console.log('✅ Reddit API setup looks good!');
  console.log('\n🚀 Next steps:');
  console.log('   1. Run: npm run db:push');
  console.log('   2. Run: npm run dev');
  console.log('   3. Visit: http://localhost:3000/reddit-monitor');
  process.exit(0);
}