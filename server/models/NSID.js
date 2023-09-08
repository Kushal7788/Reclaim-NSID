const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const NSIDSchema = new mongoose.Schema({
  nsId: { 
    type: String, 
  },
  data: { 
    type: Object,
    default: () => ({}) // Initialize as an empty object
  }
});

module.exports.NSID = mongoose.model('NSID', NSIDSchema);
