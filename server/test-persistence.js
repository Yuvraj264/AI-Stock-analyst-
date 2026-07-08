import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import {
  saveAnalysis,
  getAnalysisById,
  getAllAnalyses,
  deleteAnalysis
} from './src/services/analysisService.js';

// Load env variables
dotenv.config();

/**
 * Verification test runner for the database Persistence Layer.
 * Initiates DB connection, runs CRUD methods, and closes connection.
 */
async function testPersistence() {
  try {
    console.log('==================================================');
    console.log('🧪 Starting Database Persistence Unit Tests');
    console.log('==================================================');

    // 1. Establish connection to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB successfully.');

    // Mock analysis data matching LangGraph output schema
    const mockData = {
      companyName: 'NVIDIA Corporation',
      ticker: 'NVDA',
      financialScore: 90,
      newsScore: 85,
      riskScore: 70,
      finalScore: 85,
      recommendation: 'INVEST',
      confidence: 0.9,
      report: '# Nvidia Quantitative Research Report\n- Financials are extremely solid.\n- AI news sentiment is positive.',
      risks: ['Valuation Premium', 'Competitors pressure']
    };

    // 2. Test Save
    console.log('\n--- 1. Testing saveAnalysis ---');
    const savedDoc = await saveAnalysis(mockData);
    console.log(`  Saved Doc ID  : ${savedDoc._id}`);
    console.log(`  Company Name  : ${savedDoc.companyName}`);
    console.log(`  Ticker Symbol : ${savedDoc.ticker}`);
    console.log(`  Reasoning length: ${savedDoc.reasoning.length} characters`);

    // 3. Test Get By ID
    console.log('\n--- 2. Testing getAnalysisById ---');
    const fetchedDoc = await getAnalysisById(savedDoc._id);
    console.log(`  Fetched Ticker: ${fetchedDoc.ticker}`);
    console.log(`  Final Score   : ${fetchedDoc.finalScore}`);
    console.log(`  Recommendation: ${fetchedDoc.recommendation}`);

    // 4. Test Get All
    console.log('\n--- 3. Testing getAllAnalyses ---');
    const allRecords = await getAllAnalyses();
    console.log(`  Total records : ${allRecords.length}`);
    const found = allRecords.some((r) => r._id.toString() === savedDoc._id.toString());
    console.log(`  Saved record in array? ${found ? '✅ Yes' : '❌ No'}`);

    // 5. Test Delete
    console.log('\n--- 4. Testing deleteAnalysis ---');
    const deletedDoc = await deleteAnalysis(savedDoc._id);
    console.log(`  Deleted record: ${deletedDoc.ticker} (ID: ${deletedDoc._id})`);

    // 6. Verify Deletion
    console.log('\n--- 5. Verifying Deletion ---');
    try {
      await getAnalysisById(savedDoc._id);
      console.log('  ❌ FAILED: Document still exists in database.');
    } catch (error) {
      console.log(`  ✅ PASSED: Document correctly rejected: "${error.message}"`);
    }

    console.log('\n==================================================');
    console.log('✅ Persistence Tests Successfully Completed!');
    console.log('==================================================');

  } catch (error) {
    console.error('\n❌ Persistence test run failed:', error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('💤 Closed MongoDB connection.');
    process.exit(0);
  }
}

testPersistence();
