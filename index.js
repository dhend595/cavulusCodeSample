const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Set up storage configuration for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  }
});

// Create multer middleware instance with storage configuration
const upload = multer({ storage });

// Set up routes
app.get('/', (req, res) => {
  res.send('Welcome to the file upload and download service!');
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.send('File uploaded successfully!');
  } else {
    res.status(400).send('No file uploaded!');
  }
});

// Handle file download
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads/', req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      res.status(404).send('File not found!');
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
