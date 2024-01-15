const mongoose = require('mongoose');

const openIssueSchema = new mongoose.Schema({
  issueDescription: {
    type: String,
  },
});

const OpenIssue = mongoose.model('OpenIssue', openIssueSchema);

module.exports = OpenIssue;

