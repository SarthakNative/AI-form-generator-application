"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function FormPage() {
  const { id } = useParams(); // ✅ Works in client components
  const [form, setForm] = useState<any>(null);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (!id) return; // ✅ Wait until id is ready
    axios
      .get(`http://localhost:4000/api/forms/${id}`)
      .then((res) => setForm(res.data))
      .catch((err) => console.error("Error fetching form:", err));
  }, [id]);

  if (!form) return <div>Loading...</div>;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:4000/api/submissions", {
      formId: id,   // The current form’s ID (e.g., from route params)
      data,             // Your form’s user-entered data
    //  uploadedFiles,    // Optional: if you support file uploads
    });

    alert("✅ Submission saved successfully!");
    console.log("Saved submission:", res.data);
  } catch (error) {
    console.error("❌ Error saving submission:", error);
    alert("Error submitting form. Check console for details.");
  }
};

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        {form.schema.fields.map((f: any) => (
          <div key={f.name}>
            <label className="block text-sm font-semibold">{f.label}</label>
            <input
              type={f.type}
              required={f.required}
              className="border p-2 w-full"
              onChange={(e) => setData({ ...data, [f.name]: e.target.value })}
            />
          </div>
        ))}
        <button type="submit" className="bg-green-600 text-white py-2">
          Submit
        </button>
      </form>
    </div>
  );
}
