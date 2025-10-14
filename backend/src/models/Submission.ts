const SubmissionSchema = new Schema({
  form: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
  data: { type: Object, required: true },     // answers mapped to schema keys
  uploadedFiles: [{ url: String, fieldName: String }],
  createdAt: { type: Date, default: Date.now },
});

export default model('Submission', SubmissionSchema);
