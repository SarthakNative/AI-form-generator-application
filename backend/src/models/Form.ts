const FormSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  schema: { type: Object, required: true },   // JSON schema produced by Gemini
  public: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default model('Form', FormSchema);
