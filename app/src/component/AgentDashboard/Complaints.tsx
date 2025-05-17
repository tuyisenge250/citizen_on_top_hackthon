import React, { useState } from "react";

interface Complaint {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
  assignedTo: string;
  response?: string;
}

const AgencyDashboard: React.FC = () => {
  const currentAgent = "Alex Johnson"; // Would come from auth in real app
  
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: 1,
      title: "Pothole on Main Street",
      description: "Large pothole causing traffic issues",
      priority: "High",
      status: "Open",
      assignedTo: "Alex Johnson"
    },
    {
      id: 2,
      title: "Street Light Outage",
      description: "Light not working at Elm Street intersection",
      priority: "Medium",
      status: "In Progress",
      assignedTo: "Alex Johnson",
      response: "Technician assigned - will be fixed within 2 days"
    },
    {
      id: 3,
      title: "Park Bench Damage",
      description: "Bench in Central Park is broken",
      priority: "Low",
      status: "Resolved",
      assignedTo: "Alex Johnson",
      response: "Repaired on June 15th"
    },
    {
      id: 4,
      title: "Garbage Not Collected",
      description: "Missed pickup on Tuesday",
      priority: "Medium",
      status: "Open",
      assignedTo: "Maria Rodriguez"
    }
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [responseText, setResponseText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"All" | "Low" | "Medium" | "High">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Open" | "In Progress" | "Resolved">("All");

  // Filter complaints based on priority and status
  const filteredComplaints = complaints.filter(complaint => {
    const priorityMatch = priorityFilter === "All" || complaint.priority === priorityFilter;
    const statusMatch = statusFilter === "All" || complaint.status === statusFilter;
    const assignedMatch = complaint.assignedTo === currentAgent;
    return priorityMatch && statusMatch && assignedMatch;
  });

  // Calculate performance metrics
  const assignedCount = complaints.filter(c => c.assignedTo === currentAgent).length;
  const resolvedCount = complaints.filter(c => c.assignedTo === currentAgent && c.status === "Resolved").length;
  const resolutionRate = assignedCount > 0 ? Math.round((resolvedCount / assignedCount) * 100) : 0;

  const handleUpdateResponse = () => {
    if (!selectedComplaint) return;

    const updatedComplaints = complaints.map(complaint => 
      complaint.id === selectedComplaint.id
        ? { ...complaint, response: responseText }
        : complaint
    );

    setComplaints(updatedComplaints);
    setSelectedComplaint({ ...selectedComplaint, response: responseText });
    setResponseText("");
  };

  const handleStatusChange = (id: number, newStatus: "Open" | "In Progress" | "Resolved") => {
    const updatedComplaints = complaints.map(complaint => 
      complaint.id === id
        ? { ...complaint, status: newStatus }
        : complaint
    );
    setComplaints(updatedComplaints);
    
    // Update selected complaint if it's the one being modified
    if (selectedComplaint?.id === id) {
      setSelectedComplaint({ ...selectedComplaint, status: newStatus });
    }
  };

  return (
    <div className="max-w-full mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters and Complaint List */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded p-4 shadow-sm mb-4">
            <h2 className="font-semibold mb-3">Filters</h2>
            
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="w-full border rounded p-2"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full border rounded p-2"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="bg-white border rounded p-4 shadow-sm">
            <h2 className="font-semibold mb-3">Your Complaints ({filteredComplaints.length})</h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map(complaint => (
                  <div 
                    key={complaint.id}
                    className={`p-3 border rounded cursor-pointer ${
                      selectedComplaint?.id === complaint.id 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setResponseText(complaint.response || "");
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{complaint.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        complaint.priority === "High" 
                          ? "bg-red-100 text-red-800" 
                          : complaint.priority === "Medium" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-green-100 text-green-800"
                      }`}>
                        {complaint.priority}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        complaint.status === "Open" 
                          ? "bg-red-100 text-red-800" 
                          : complaint.status === "In Progress" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-green-100 text-green-800"
                      }`}>
                        {complaint.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        #{complaint.id}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No complaints match your filters</p>
              )}
            </div>
          </div>
        </div>

        {/* Complaint Details and Response */}
        <div className="lg:col-span-3">
          {selectedComplaint ? (
            <div className="bg-white border rounded p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">{selectedComplaint.title}</h2>
                  <div className="flex space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${
                      selectedComplaint.priority === "High" 
                        ? "bg-red-100 text-red-800" 
                        : selectedComplaint.priority === "Medium" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-green-100 text-green-800"
                    }`}>
                      {selectedComplaint.priority} Priority
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      selectedComplaint.status === "Open" 
                        ? "bg-red-100 text-red-800" 
                        : selectedComplaint.status === "In Progress" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-green-100 text-green-800"
                    }`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                </div>
                
                <select
                  value={selectedComplaint.status}
                  onChange={(e) => handleStatusChange(
                    selectedComplaint.id, 
                    e.target.value as "Open" | "In Progress" | "Resolved"
                  )}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Description:</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedComplaint.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Current Response:</h3>
                {selectedComplaint.response ? (
                  <div className="bg-blue-50 p-4 rounded whitespace-pre-line">
                    <p>{selectedComplaint.response}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No response yet</p>
                )}
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Update Response:</h3>
                <textarea
                  className="w-full border rounded p-3 mb-3 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                ></textarea>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setResponseText("")}
                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleUpdateResponse}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {selectedComplaint.response ? "Update Response" : "Submit Response"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border rounded p-8 text-center shadow-sm">
              <p className="text-gray-500">Select a complaint to view details and respond</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;