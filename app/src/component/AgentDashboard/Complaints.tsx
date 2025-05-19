"use client"
import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

interface Response {
  id: string;
  message: string;
  createdAt: string;
  responder: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface ComplaintItem {
  id: string;
  userId: string;
  categoryId: string;
  agencyId: string;
  title: string;
  description: string;
  type: string;
  status: string;
  location: string;
  attachmentUrl: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  category: {
    name: string;
  };
  agency: {
    name: string;
  };
  responses: Response[];
}

interface AccordionProps {
  i: number;
  expanded: number | null;
  setExpanded: React.Dispatch<React.SetStateAction<number | null>>;
  item: ComplaintItem;
  onStatusChange: (id: string, status: string) => void;
  onResponseSubmit: (submissionId: string, message: string) => void;
  isAgentView: boolean;
}

const Complaint: React.FC<AccordionProps> = ({
  i,
  expanded,
  setExpanded,
  item,
  onStatusChange,
  onResponseSubmit,
  isAgentView,
}) => {
  const isOpen = i === expanded;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const [newResponse, setNewResponse] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  
  const getStatusColors = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return {
          badge: "bg-green-100 text-green-800",
          border: "border-green-200",
          bg: isOpen ? "bg-green-50" : "bg-white",
          icon: "text-green-500"
        };
      case "in progress":
        return {
          badge: "bg-blue-100 text-blue-800",
          border: "border-blue-200",
          bg: isOpen ? "bg-blue-50" : "bg-white",
          icon: "text-blue-500"
        };
      case "under review":
        return {
          badge: "bg-yellow-100 text-yellow-800",
          border: "border-yellow-200",
          bg: isOpen ? "bg-yellow-50" : "bg-white",
          icon: "text-yellow-500"
        };
      case "assigned":
        return {
          badge: "bg-purple-100 text-purple-800",
          border: "border-purple-200",
          bg: isOpen ? "bg-purple-50" : "bg-white",
          icon: "text-purple-500"
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-800",
          border: "border-gray-200",
          bg: isOpen ? "bg-gray-50" : "bg-white",
          icon: "text-gray-500"
        };
    }
  };
  
  const colors = getStatusColors(item.status);

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResponse.trim()) return;
    
    setIsSubmittingResponse(true);
    try {
      await onResponseSubmit(item.id, newResponse);
      setNewResponse("");
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        delay: 0.1 * i,
        duration: 0.5,
      }}
      className={`overflow-hidden rounded-lg border ${colors.border} shadow-sm w-full`}
    >
      <motion.header
        initial={false}
        onClick={() => setExpanded(isOpen ? null : i)}
        className={`flex cursor-pointer items-center justify-between p-4 ${colors.bg}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700`}>
              <span className="text-sm font-medium">#{item.id.substring(0, 4)}</span>
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-sm text-gray-600">{formatDate(item.createdAt)}</span>
                <span className="text-sm text-gray-600">• {item.category.name}</span>
              </div>
            </div>
          </div>
          <span className={`ml-0 sm:ml-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${colors.badge}`}>
            {item.status}
          </span>
        </div>
        <div>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={`size-5 ${colors.icon}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </div>
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className={`border-t ${colors.border} bg-white p-4`}
          >
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700">Description:</h4>
              <p className="mt-1 text-gray-700">{item.description}</p>
            </div>
            
            {item.location && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700">Location:</h4>
                <p className="mt-1 text-gray-700">{item.location}</p>
              </div>
            )}
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700">Assigned Agency:</h4>
              <p className="mt-1 text-gray-700">{item.agency.name}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700">Submitted By:</h4>
              <p className="mt-1 text-gray-700">{item.user.firstName} {item.user.lastName} ({item.user.email})</p>
            </div>
            
            {item.responses.length > 0 ? (
              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-semibold text-gray-700">Responses:</h4>
                {item.responses.map((response) => (
                  <div key={response.id} className="rounded-md bg-blue-50 p-4">
                    <div className="flex justify-between items-center mb-1">
                      <h5 className="text-sm font-medium text-blue-800">
                        {response.responder.firstName} {response.responder.lastName} • {formatDate(response.createdAt)}
                      </h5>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">{response.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md bg-yellow-50 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Awaiting Response</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>This complaint hasn't received a response yet.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {isAgentView && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Agent Actions:</h4>
                
                <form onSubmit={handleSubmitResponse} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Add Response</label>
                    <textarea
                      className="w-full rounded border border-gray-300 p-2"
                      rows={3}
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      placeholder="Type your response here..."
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingResponse}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      {isSubmittingResponse ? 'Submitting...' : 'Submit Response'}
                    </button>
                  </div>
                </form>
                
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Update Status</label>
                  <select
                    className="w-full rounded border border-gray-300 p-2"
                    value={item.status}
                    onChange={(e) => onStatusChange(item.id, e.target.value)}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AgencyDashboard: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        let id = localStorage.getItem('citizenId');
        id = "ce8a2c0a-a2e0-4b8b-ac90-92a3099d991f"
        if (!id) {
          throw new Error('User ID not found');
        }
        
        setUserId(id);
        const response = await fetch("http://localhost:3000/api/complaint/agency_complaint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: id })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }
        
        const data = await response.json();
        setComplaints(data.submissions || []);
        setError("");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

const handleStatusChange = async (id: string, status: string) => {
  try {
    // 1) Update the status in the backend
    const response = await fetch(
      `http://localhost:3000/api/complaint/update_status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaintId: id,
          status,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    // (optional) read back any data
    // const data = await response.json();

    // 2) Update the local state
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === id ? { ...complaint, status } : complaint
      )
    );
  } catch (err: any) {
    setError(err.message || "An unexpected error occurred");
  }
};


  const handleResponseSubmit = async (submissionId: string, message: string) => {
    try {
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await fetch("http://localhost:3000/api/response/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId,
          responderId: userId,
          message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit response');
      }

      const newResponse = await response.json();
      
      // Update the local state with the new response
      setComplaints(complaints.map(complaint => 
        complaint.id === submissionId 
          ? { 
              ...complaint, 
              responses: [
                ...complaint.responses, 
                {
                  id: newResponse.id,
                  message: newResponse.message,
                  createdAt: newResponse.createdAt,
                  responder: {
                    firstName: "You", // This would come from your auth system
                    lastName: "",
                    email: ""
                  }
                }
              ] 
            } 
          : complaint
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        <p>Error loading complaints: {error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-full py-6 px-4">
      <header className="mb-8">
        <h1 className="mb-2 bg-gradient-to-b from-blue-700 to-blue-900 bg-clip-text text-4xl font-bold text-transparent">
          Agency Complaints
        </h1>
        <p className="text-gray-600">
          View and manage complaints assigned to your agency
        </p>
      </header>

      <div className="space-y-4">
        {complaints.length > 0 ? (
          complaints.map((item, i) => (
            <Complaint
              key={i}
              i={i}
              expanded={expanded}
              setExpanded={setExpanded}
              item={item}
              onStatusChange={handleStatusChange}
              onResponseSubmit={handleResponseSubmit}
              isAgentView={true}
            />
          ))
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">No complaints assigned to your agency.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyDashboard;