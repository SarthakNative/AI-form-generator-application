import express from "express";
import Submission from "../models/Submission";
import Form from "../models/Form";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { formId, data, uploadedFiles } = req.body;

    if (!formId || !data) {
      return res.status(400).json({ message: "Form ID and data are required" });
    }

    // 1. Create new submission
    const submission = await Submission.create({
      form: formId,
      data,
      uploadedFiles: uploadedFiles || [],
    });

    // 2. Push submission reference to the Form’s submissions array
    await Form.findByIdAndUpdate(formId, {
      $push: { submissions: { data, submittedAt: new Date() } },
    });

    res.status(201).json({
      message: "Submission saved successfully",
      submission,
    });
  } catch (err: any) {
    console.error("Error saving submission:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
