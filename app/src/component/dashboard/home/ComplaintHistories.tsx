"use client"
import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import NewComplaint from './NewComplaint';

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
  category: { name: string };
  agency: { name: string };
  responses: Response[];
}

interface DisplayComplaintItem {
  id: string;
  dateTime: string;
  category: string;
  status: string;
  title: string;
  description: string;
  agency: string;
  response: string | null;         // <- allow null here
}

interface AccordionProps {
  i: number;
  expanded: number | null;
  setExpanded: React.Dispatch<React.SetStateAction<number | null>>;
  item: DisplayComplaintItem;
}

export default function Histories() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [activeTab, setActiveTab] = useState<"complaints" | "submission">("complaints");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch complaints when userId is set
  useEffect(() => {
    if (!userId) return;
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${url}/api/complaint/complaint_response`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        if (!res.ok) throw new Error("Failed to fetch complaints");
        const data = await res.json();
        setComplaints(data.submissions || []);
        setError("");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [userId]);

  // grab citizenId from localStorage once
  useEffect(() => {
    setUserId(localStorage.getItem("citizenId"));
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // return latest message or null
  const getLatestResponse = (responses: Response[]): string | null => {
    if (responses.length === 0) return null;
    return responses
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      .message;
  };

  const transformComplaintData = (c: ComplaintItem): DisplayComplaintItem => ({
    id: c.id,
    dateTime: formatDate(c.createdAt),
    category: c.category.name,
    status: c.status,
    title: c.title,
    description: c.description,
    agency: c.agency.name,
    response: getLatestResponse(c.responses),
  });

  return (
    <div className="mx-auto max-w-full py-6 px-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between mb-6">
        <div>
          <h1 className="mb-2 bg-gradient-to-b from-blue-700 to-blue-900 bg-clip-text text-4xl font-bold text-transparent">
            Citizen on Top
          </h1>
          <p className="text-gray-600">
            Submit, track, and receive updates on your public service requests
          </p>
        </div>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <button
            className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
              activeTab === "complaints"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("complaints")}
          >
            My Complaints
          </button>
          <button
            className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
              activeTab === "submission"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("submission")}
          >
            Submit New Complaint
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {activeTab === "complaints" ? (
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : complaints.length > 0 ? (
            complaints.map((c, i) => (
              <Complaint
                key={c.id}
                i={i}
                expanded={expanded}
                setExpanded={setExpanded}
                item={transformComplaintData(c)}
              />
            ))
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">You haven't submitted any complaints yet.</p>
            </div>
          )}
        </div>
      ) : (
        <NewComplaint />
      )}

      {/* Help box */}
      <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.99.99 0 00-.01 1.99h.01c.56.04 1.05-.34 1.11-.9.06-.63-.4-1.09-.99-1.09z"
              clipRule="evenodd"
            />
          </svg>
          <p className="ml-3">
            Need urgent assistance? Contact our helpline at <span className="font-medium">1-800-CIT-HELP</span> or
            email <span className="font-medium">support@citizenengagement.gov</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const Complaint: React.FC<AccordionProps> = ({ i, expanded, setExpanded, item }) => {
  const isOpen = i === expanded;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const getStatusColors = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return { badge: "bg-green-100 text-green-800", border: "border-green-200", bg: isOpen ? "bg-green-50" : "bg-white", icon: "text-green-500" };
      case "in progress":
        return { badge: "bg-blue-100 text-blue-800", border: "border-blue-200", bg: isOpen ? "bg-blue-50" : "bg-white", icon: "text-blue-500" };
      case "under review":
        return { badge: "bg-yellow-100 text-yellow-800", border: "border-yellow-200", bg: isOpen ? "bg-yellow-50" : "bg-white", icon: "text-yellow-500" };
      case "assigned":
        return { badge: "bg-purple-100 text-purple-800", border: "border-purple-200", bg: isOpen ? "bg-purple-50" : "bg-white", icon: "text-purple-500" };
      default:
        return { badge: "bg-gray-100 text-gray-800", border: "border-gray-200", bg: isOpen ? "bg-gray-50" : "bg-white", icon: "text-gray-500" };
    }
  };

  const colors = getStatusColors(item.status);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: i * 0.1, duration: 0.5 }}
      className={`overflow-hidden rounded-lg border ${colors.border} shadow-sm w-full`}
    >
      <motion.header
        onClick={() => setExpanded(isOpen ? null : i)}
        className={`flex cursor-pointer items-center justify-between p-4 ${colors.bg}`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <span className="text-sm font-medium">#{item.id.slice(0, 4)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{item.title}</h3>
            <div className="flex space-x-2 text-sm text-gray-600">
              <span>{item.dateTime}</span>
              <span>• {item.category}</span>
            </div>
          </div>
        </div>
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${colors.badge}`}>
          {item.status}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`h-5 w-5 ${colors.icon}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
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
                <h4 className="text-sm font-medium text-blue-800">Official Response:</h4>
                <p className="mt-2 text-sm text-blue-700">{item.response}</p>
              </div>
            ) : (
              <div className="rounded-md bg-yellow-50 p-4">
                <h4 className="text-sm font-medium text-yellow-800">Awaiting Response</h4>
                <p className="mt-2 text-sm text-yellow-700">
                  Your complaint has been received and is being processed. We'll notify you when there's an update.
                </p>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
