const mongoose = require('mongoose');
const app = require('./app'); // this is correct — importing from app.js

mongoose.connect('mongodb://localhost:27017/urlShortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  app.listen(8000, () => {
    console.log('Server started on http://localhost:8000');
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
