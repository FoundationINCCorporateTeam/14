const express = require('express');
const multer = require('multer');
const fs = require('fs');
const malwareScanner = require('./malwareScanner');

const app = express();

// Middleware to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint for file scanning
app.post('/api/scan', upload.single('file'), (req, res) => {
  const filePath = req.file.path;

  // Read the file content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Scan the file for malware
    const isMalicious = malwareScanner.scanFile(data);

    // Delete the uploaded file
    fs.unlink(filePath, err => {
      if (err) {
        console.error('Error deleting file:', err);
      }
    });

    // Send the scan result
    res.json({ isMalicious });
  });
});

module.exports = app;
