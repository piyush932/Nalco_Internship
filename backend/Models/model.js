const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const projectSchema = new mongoose.Schema({
  customId: {
    type: Number,
  },
  projectName: {
    type: String,
    required: true,
    unique:true,
  },
  date:{
    type:Date,
  },
  actionTaken: {
    type: String,
    required: true,
  },
  todo: {
    type: String,
    required: true,
  },
  openIssues:{
    type:String
  },
  file: {
    data: Buffer, 
    contentType: String, 
    fileName: String, 
  },
});

projectSchema.plugin(AutoIncrement, { inc_field: 'customId' });


const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
