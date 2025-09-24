const pdf = require('pdf-poppler');
const path = require('path');
const fs = require('fs');

async function testPoppler() {
  try {
    // Test if a PDF file exists in uploads
    const testPdfPath = path.join(__dirname, 'uploads', '1757928452186-Sample-filled-in-MR.pdf');
    
    if (!fs.existsSync(testPdfPath)) {
      console.log('❌ No test PDF found. Upload a PDF first via the form.');
      return;
    }

    console.log('✅ Test PDF found:', testPdfPath);
    
    // Try to convert the first page
    const outputDir = path.join(__dirname, 'uploads', 'test-output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const opts = {
      format: 'jpeg',
      out_dir: outputDir,
      out_prefix: 'test',
      page: 1 // Convert only first page
    };

    await pdf.convert(testPdfPath, opts);
    console.log('✅ Poppler is working! PDF converted to image successfully.');
    console.log('📁 Check the test-output folder for the generated image.');
    
  } catch (error) {
    console.log('❌ Poppler test failed:', error.message);
    console.log('💡 Make sure Poppler is installed and added to your system PATH.');
  }
}

testPoppler();