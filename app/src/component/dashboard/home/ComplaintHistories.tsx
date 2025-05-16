import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import NewComplaint from './NewComplaint'

interface ComplaintItem {
  id: number;
  dateTime: string;
  category: string;
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
  item: ComplaintItem;
}

// Sample complaint data
const complaintItems: ComplaintItem[] = [
  {
    id: 1,
    dateTime: "2025-05-10 09:30 AM",
    category: "Roads & Infrastructure",
    status: "Resolved",
    title: "Pothole on Main Street",
    description: "Large pothole near the intersection of Main Street and Oak Avenue causing damage to vehicles and creating hazardous driving conditions.",
    agency: "Public Works Department",
    response: "Thank you for your report. Our maintenance team filled the pothole on May 14th. Please let us know if you notice any issues with the repair."
  },
  {
    id: 2,
    dateTime: "2025-05-08 14:15 PM",
    category: "Waste Management",
    status: "In Progress",
    title: "Missed garbage collection",
    description: "Our street (Cedar Lane, blocks 400-500) has been missed for garbage collection two weeks in a row. Several neighbors have reported this issue as well.",
    agency: "Sanitation Department",
    response: "We apologize for the inconvenience. We've identified a scheduling error that affected your area. A special collection has been scheduled for tomorrow, May 17th. We've also corrected our routes to prevent this from happening again."
  },
  {
    id: 3,
    dateTime: "2025-05-05 11:20 AM",
    category: "Public Safety",
    status: "Under Review",
    title: "Broken streetlight",
    description: "The streetlight at the corner of Pine Street and 7th Avenue has been flickering for weeks and is now completely out, creating safety concerns for pedestrians at night.",
    agency: "Department of Transportation",
  },
  {
    id: 4,
    dateTime: "2025-04-28 16:45 PM",
    category: "Public Utilities",
    status: "Resolved",
    title: "Water outage without prior notice",
    description: "There was a water outage in the Riverside neighborhood on April 27th with no prior notification to residents. Many families were unprepared and this caused significant inconvenience.",
    agency: "Water Department",
    response: "We sincerely apologize for the unannounced outage. This was an emergency repair due to a major pipe burst. We've updated our notification system to ensure that even emergency repairs will trigger automatic alerts via text message to affected areas. You can sign up for these alerts on our website."
  },
  {
    id: 5,
    dateTime: "2025-04-20 10:05 AM",
    category: "Parks & Recreation",
    status: "Assigned",
    title: "Playground equipment damage",
    description: "The slide at Oakwood Park children's playground is damaged with a large crack that could be dangerous for children. This needs immediate attention.",
    agency: "Parks Department",
  },
];

// Available categories for new submissions
const categories = [
  "Roads & Infrastructure",
  "Waste Management",
  "Public Safety",
  "Public Utilities",
  "Parks & Recreation",
  "Public Transportation",
  "City Administration",
  "Noise Complaints",
  "Other"
];

const Histories: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [complaints, setComplaints] = useState<ComplaintItem[]>(complaintItems);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"complaints" | "submission">("complaints");
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newComplaint: ComplaintItem = {
      id: complaints.length + 1,
      dateTime: new Date().toLocaleString(),
      category: category,
      status: "Submitted",
      title: title,
      description: description,
      agency: "Pending Assignment"
    };
    
    setComplaints([newComplaint, ...complaints]);
    setTitle("");
    setDescription("");
    setCategory(categories[0]);
    setActiveTab("complaints");
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

      {activeTab === "complaints" ? (
        <div className="space-y-4">
          {complaints.length > 0 ? (
            complaints.map((item, i) => (
              <Complaint
                key={i}
                i={i}
                expanded={expanded}
                setExpanded={setExpanded}
                item={item}
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

      <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p>Need urgent assistance? Contact our helpline at <span className="font-medium">1-800-CIT-HELP</span> or email us at <span className="font-medium">support@citizenengagement.gov</span></p>
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
              <span className="text-sm font-medium">#{item.id}</span>
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
            
            {item.response && (
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
            )}
            
            {!item.response && (
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
                      <p>Your complaint has been received and is being processed. We'll notify you when there's an update.</p>
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

export default Histories;