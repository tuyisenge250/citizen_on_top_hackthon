import React, { useState } from "react";

interface FeedbackItem {
  id: number;
  dateTime: string;
  category: string;
  type: "positive" | "suggestion" | "general";
  title: string;
  description: string;
  department: string;
  public: boolean;
}

const NewFeedback: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Public Services");
  const [type, setType] = useState<"positive" | "suggestion" | "general">("general");
  const [isPublic, setIsPublic] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Available categories for feedback
  const categories = [
    "Public Services",
    "Community Events",
    "City Planning",
    "Public Transportation",
    "City Website/App",
    "Customer Service",
    "Environmental Initiatives",
    "Accessibility",
    "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally send this to your backend
    const newFeedback: FeedbackItem = {
      id: Math.floor(Math.random() * 1000) + 100, // Placeholder for demo
      dateTime: new Date().toLocaleString(),
      category: category,
      type: type,
      title: title,
      description: description,
      department: "To be assigned",
      public: isPublic
    };
    
    console.log("Submitted feedback:", newFeedback);
    
    // Reset form and show success message
    setTitle("");
    setDescription("");
    setCategory(categories[0]);
    setType("general");
    setIsPublic(false);
    setSubmitted(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Submit Feedback</h2>
      
      {submitted && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Your feedback has been submitted successfully! Thank you for helping us improve.</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700">
            Feedback Type
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="feedbackType"
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                checked={type === "positive"}
                onChange={() => setType("positive")}
              />
              <span className="ml-2 text-sm text-gray-700">Praise/Positive</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="feedbackType"
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                checked={type === "suggestion"}
                onChange={() => setType("suggestion")}
              />
              <span className="ml-2 text-sm text-gray-700">Suggestion</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="feedbackType"
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                checked={type === "general"}
                onChange={() => setType("general")}
              />
              <span className="ml-2 text-sm text-gray-700">General Feedback</span>
            </label>
          </div>
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Brief summary of your feedback"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Please provide detailed feedback"
          />
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="public"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="public" className="font-medium text-gray-700">
              Make feedback public
            </label>
            <p className="text-gray-500">
              Allow this feedback to be visible to other citizens (your name will remain private)
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewFeedback;