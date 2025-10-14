// controllers/formController.ts
import { Request, Response } from "express";
import Form from "../models/Form";
import { geminiFormService } from "../services/geminiService";

export const generateForm = async (req: Request, res: Response) => {
  try {
    const { prompt, title } = req.body;
    const userId = (req as any).userId;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Generate actual schema using Gemini
    const schema = await geminiFormService.generateFormSchema(prompt, title);
    console.log(schema);
    const form = await Form.create({ 
      title: schema.title, 
      description: schema.description,
      owner: userId, 
      schema,
      submissions: []
    });

    res.json(form);
  } catch (error: any) {
    console.error("Form generation error:", error);
    
    if (error.message.includes("Failed to generate form schema")) {
      return res.status(500).json({ 
        message: "AI service unavailable. Please try again later." 
      });
    }
    
    res.status(500).json({ message: "Failed to generate form" });
  }
};

export const getForm = async (req: Request, res: Response) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  } catch (error) {
    console.error("Get form error:", error);
    res.status(500).json({ message: "Failed to fetch form" });
  }
};

export const getUserForms = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const forms = await Form.find({ owner: userId })
      .select("title schema submissions createdAt")
      .sort({ createdAt: -1 });
    
    res.json({ forms });
  } catch (error) {
    console.error("Get user forms error:", error);
    res.status(500).json({ message: "Failed to fetch forms" });
  }
};

export const submitForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const submissionData = req.body;

    const form = await Form.findByIdAndUpdate(
      id,
      {
        $push: {
          submissions: {
            data: submissionData,
            submittedAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json({ message: "Submission saved successfully" });
  } catch (error) {
    console.error("Form submission error:", error);
    res.status(500).json({ message: "Failed to save submission" });
  }
};