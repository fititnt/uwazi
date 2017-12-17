import mongoose from 'mongoose';
import instanceModel from 'api/odm';

const evidenceSchema = new mongoose.Schema({
  property: {type: mongoose.Schema.Types.ObjectId},
  value: {type: mongoose.Schema.Types.ObjectId},
  entity: {type: mongoose.Schema.Types.ObjectId, ref: 'entities'},
  evidence: {
    text: String
  }
});

let Model = mongoose.model('evidences', evidenceSchema);
export default instanceModel(Model);
