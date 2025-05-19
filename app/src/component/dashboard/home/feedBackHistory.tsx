"use client"
import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import NewFeedback from "./NewComplaint";
interface Response {
  id: string;
  message: string;
  createdAt: string;
}

interface ComplaintItem {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  location: string | null;
  attachmentUrl: string | null;
  createdAt: string;
  updatedAt: string;
  category: { name: string; id: string };
  agency: { name: string };
  responses: Response[];
}

interface DisplayComplaintItem {
  id: string;
  dateTime: string;
  category: string;
  categoryId: string;
  status: string;
  title: string;
  description: string;
  agency: string;
  response?: string;
}

interface AccordionProps {
  i: number;
  expanded: number | null;
  setExpanded: React.Dispatch<React.SetStateAction<number | null>>;
  item: DisplayComplaintItem;
}

interface Category {
  id: string;
  name: string;
}
const url = process.env.NEXT_PUBLIC_BACKEND_URL!;


const FeedbackHistories: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<ComplaintItem[]>([]);
  const [activeTab, setActiveTab] = useState<"complaints" | "submission">("complaints");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const userId = localStorage.getItem("citizenId");
  if (userId === null) {
    return <div>Loading user data...</div>;
  }

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch(`${url}/api/complaint/complaint_response`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch complaints');
        }
        
        const data = await res.json();
        setComplaints(data.submissions || []);
        setFilteredComplaints(data.submissions || []);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Map(
            (data.submissions || []).map((item: ComplaintItem) => 
              [item.category.id, { id: item.category.id, name: item.category.name }]
            )
          ).values()
        );
        setCategories(uniqueCategories);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [userId]);

  useEffect(() => {
    let results = complaints;
    
    // Filter by category
    if (selectedCategory) {
      results = results.filter(
        complaint => complaint.category.id === selectedCategory
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(
        complaint =>
          complaint.title.toLowerCase().includes(searchLower) ||
          complaint.description.toLowerCase().includes(searchLower) ||
          complaint.status.toLowerCase().includes(searchLower) ||
          complaint.category.name.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredComplaints(results);
  }, [selectedCategory, searchTerm, complaints]);

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

  const getLatestResponse = (responses: Response[]) => {
    if (responses.length === 0) return null;
    return responses.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0].message;
  };

  const transformComplaintData = (complaint: ComplaintItem): DisplayComplaintItem => {
    return {
      id: complaint.id,
      dateTime: formatDate(complaint.createdAt),
      category: complaint.category.name,
      categoryId: complaint.category.id,
      status: complaint.status,
      title: complaint.title,
      description: complaint.description,
      agency: complaint.agency.name,
      response: getLatestResponse(complaint.responses)
    };
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchTerm("");
  };

  return (
    <div className="mx-auto max-w-full py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between">
        <header className="mb-8">
          <h1 className="mb-2 bg-gradient-to-b from-blue-700 to-blue-900 bg-clip-text text-4xl font-bold text-transparent">
            Citizen on Top
          </h1>
          <p className="text-gray-600">
            Submit, track, and receive updates on your public service requests
          </p>
        </header>

        <div className="mb-6 flex justify-center space-x-4">
          <button
            className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
              activeTab === "complaints"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("complaints")}
          >
            My Feedback
          </button>
          <button
            className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
              activeTab === "submission"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("submission")}
          >
            Submit New Feedback
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {activeTab === "complaints" ? (
        <>
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Feedback
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search by title, description or status"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              
              <div className="md:w-64">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="" key={1}>All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {(selectedCategory || searchTerm) && (
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredComplaints.length > 0 ? (
              <>
                <div className="text-sm text-gray-600 mb-2">
                  Showing {filteredComplaints.length} of {complaints.length} feedback items
                </div>
                {filteredComplaints.map((complaint, i) => (
                  <Complaint
                    key={complaint.id}
                    i={i}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    item={transformComplaintData(complaint)}
                  />
                ))}
              </>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                <p className="text-gray-500">
                  {complaints.length > 0 
                    ? "No feedback matches your current filters." 
                    : "You haven't submitted any feedback yet."}
                </p>
                {complaints.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <NewFeedback />
      )}

      <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p>Need assistance with your feedback? Contact our helpline at <span className="font-medium">1-800-CIT-HELP</span> or email us at <span className="font-medium">support@citizenengagement.gov</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Complaint: React.FC<AccordionProps> = ({
  i,
  expanded,
  setExpanded,
  item,
}) => {
  const isOpen = i === expanded;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
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
                <span className="text-sm text-gray-600">{item.dateTime}</span>
                <span className="text-sm text-gray-600">• {item.category}</span>
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
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700">Assigned To:</h4>
              <p className="mt-1 text-gray-700">{item.agency}</p>
            </div>
            
            {item.response ? (
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.99.99 0 00-.01 1.99h.01c.56.04 1.05-.34 1.11-.9.06-.63-.4-1.09-.99-1.09z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Official Response:</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>{item.response}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Awaiting Response</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Your feedback has been received and is being processed. We'll notify you when there's an update.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FeedbackHistories;