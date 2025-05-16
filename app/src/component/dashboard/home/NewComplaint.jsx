import React, { useState } from "react";

export default function NewComplaint() {
  // State definitions
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Categories array
  const categories = [
    "General",
    "Maintenance",
    "Noise",
    "Safety",
    "Sanitation",
    "Parking",
    "Staff Behavior",
    "Other"
  ];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, category, description });
    // Here you would typically send the data to an API
    setSubmitted(true);
    // Reset form after submission
    setTimeout(() => {
      setTitle("");
      setCategory("General");
      setDescription("");
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="max-w-full mx-auto">
      {submitted ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-green-800">Complaint Submitted</h2>
          <p className="mt-2 text-green-700">Thank you for your feedback. We will review your complaint shortly.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Submit New Complaint</h2>
          
          <div>
            <div className="mb-4">
              <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Brief description of the issue"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={5}
                placeholder="Please provide details about the issue, including location, when it occurred, and any other relevant information"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setCategory("General");
                  setDescription("");
                }}
                className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Complaint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}