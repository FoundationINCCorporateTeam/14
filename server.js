const express = require('express');
const multer = require('multer');
const fs = require('fs');
const malwareScanner = require('./malwareScanner');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint for file scanning
app.post('/scan', upload.single('file'), (req, res) => {
  const filePath = req.file.path;

  // Read the file content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if the file contains the word "malware"
    const isMalicious = data.includes('malware');

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

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
