const mongoose = require('mongoose');

const ReglementSchema = new mongoose.Schema({
  serverId: {
    type: String,
    required: true,
    unique: true
  },
  channelId: {
    type: String,
    required: true
  },
  roleId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fieldLabel: {
    type: String,
    required: true
  },
  fieldValue: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Reglement', ReglementSchema);