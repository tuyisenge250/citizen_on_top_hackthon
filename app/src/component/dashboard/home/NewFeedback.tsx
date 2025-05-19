"use client"
import React, { useState, useEffect } from "react";

export default function NewFeedback() {
  const [title, setTitle] = useState("");
  const [agencies, setAgencies] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [agency, setAgency] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem("citizenId"));
    AgencyWithCategories();
  }, []);

  async function AgencyWithCategories() {
    try {
      const res = await fetch("http://localhost:3000/api/admin/agency/agencycategories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setAgencies(data.agencies);
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = {
      title,
      userId,
      categoryId: category,
      agencyId: agency,
      description,
      type: "FEEDBACK",
      feedbackType,
      isPublic
    };
    
    const dataJson = JSON.stringify(formData);
    console.log(dataJson)
    
    try {
      const res = await fetch("http://localhost:3000/api/complaint/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: dataJson,
      });
      
      const response = await res.json();
      console.log(response);

      if (!res.ok) {
        setError(response.error || "Something went wrong try again");
        return;
      }
      setSubmitted(true);
      setTitle("");
      setCategory("");
      setDescription("");
      setAgency("");
      setIsPublic(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Update categories when agency changes
  useEffect(() => {
    if (agency) {
      const selectedAgency = agencies.find(ag => ag.id === agency);
      if (selectedAgency) {
        setCategories(selectedAgency.categories);
        setCategory("");
      }
    }
  }, [agency, agencies]);

  return (
    <div className="max-w-full mx-auto">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {submitted ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-green-800">Feedback Submitted</h2>
          <p className="mt-2 text-green-700">Thank you for your feedback. We appreciate your input!</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Submit Feedback</h2>
          
          <form onSubmit={handleSubmit}>
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
                placeholder="Feedback summary"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="agency" className="mb-1 block text-sm font-medium text-gray-700">
                Agency (Optional)
              </label>
              <select
                id="agency"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select an agency (optional)</option>
                {agencies.map((agency) => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name}
                  </option>
                ))}
              </select>
            </div>
            
            {agency && (
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
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
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
                placeholder="Please provide detailed feedback"
                required
              />
            </div>
            
            <div className="mb-6 flex items-start">
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
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setCategory("");
                  setDescription("");
                  setAgency("");
                  setFeedbackType("general");
                  setIsPublic(false);
                  setError("");
                }}
                className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Clear
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}