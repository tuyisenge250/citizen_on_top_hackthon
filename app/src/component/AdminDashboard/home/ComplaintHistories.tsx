import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

// Type definitions
interface ComplaintItem {
  id: number;
  dateTime: string;
  category: string;
  status: string;
  title: string;
  description: string;
  agency: string;
  priority: "low" | "medium" | "high";
  response?: string;
  agentNotes?: string;
  assignedAgent?: string;
  lastUpdated?: string;
  attachments?: string[];
  citizenContact?: string;
}

interface AgentUser {
  id: number;
  name: string;
  department: string;
  role: "agent" | "supervisor" | "admin";
}

interface AccordionProps {
  i: number;
  expanded: number | null;
  setExpanded: React.Dispatch<React.SetStateAction<number | null>>;
  item: ComplaintItem;
  onStatusChange: (id: number, status: string) => void;
  onResponseUpdate: (id: number, response: string) => void;
  onAgentNotesUpdate: (id: number, notes: string) => void;
  onPriorityChange: (id: number, priority: "low" | "medium" | "high") => void;
  onAssignAgent: (id: number, agent: string) => void;
  onDeleteComplaint: (id: number) => void;
  isAgentView: boolean;
  currentAgent: AgentUser;
}

// Sample agents data
const agents: AgentUser[] = [
  { id: 1, name: "Alex Johnson", department: "Public Works", role: "agent" },
  { id: 2, name: "Maria Rodriguez", department: "Sanitation", role: "supervisor" },
  { id: 3, name: "David Chen", department: "Public Safety", role: "agent" },
  { id: 4, name: "Sarah Kim", department: "Water Department", role: "agent" },
  { id: 5, name: "Jamal Williams", department: "Parks Department", role: "supervisor" },
  { id: 6, name: "System Administrator", department: "IT", role: "admin" }
];

// Sample complaint data (expanded with more fields)
const complaintItems: ComplaintItem[] = [
  {
    id: 1,
    dateTime: "2025-05-10 09:30 AM",
    category: "Roads & Infrastructure",
    status: "Resolved",
    title: "Pothole on Main Street",
    description: "Large pothole near the intersection of Main Street and Oak Avenue causing damage to vehicles and creating hazardous driving conditions.",
    agency: "Public Works Department",
    priority: "high",
    response: "Thank you for your report. Our maintenance team filled the pothole on May 14th. Please let us know if you notice any issues with the repair.",
    agentNotes: "Repair completed by crew #103. Used quick-set concrete due to high traffic area.",
    assignedAgent: "Alex Johnson",
    lastUpdated: "2025-05-14 04:30 PM",
    citizenContact: "john.doe@example.com"
  },
  {
    id: 2,
    dateTime: "2025-05-08 14:15 PM",
    category: "Waste Management",
    status: "In Progress",
    title: "Missed garbage collection",
    description: "Our street (Cedar Lane, blocks 400-500) has been missed for garbage collection two weeks in a row. Several neighbors have reported this issue as well.",
    agency: "Sanitation Department",
    priority: "medium",
    response: "We apologize for the inconvenience. We've identified a scheduling error that affected your area. A special collection has been scheduled for tomorrow, May 17th. We've also corrected our routes to prevent this from happening again.",
    agentNotes: "Route 7B was incorrectly removed from the schedule during software update. Added back and notified supervisor about issue.",
    assignedAgent: "Maria Rodriguez",
    lastUpdated: "2025-05-15 10:22 AM",
    citizenContact: "cedar.resident@example.com"
  },
  {
    id: 3,
    dateTime: "2025-05-05 11:20 AM",
    category: "Public Safety",
    status: "Under Review",
    title: "Broken streetlight",
    description: "The streetlight at the corner of Pine Street and 7th Avenue has been flickering for weeks and is now completely out, creating safety concerns for pedestrians at night.",
    agency: "Department of Transportation",
    priority: "medium",
    agentNotes: "Inspection scheduled for May 17. May require full replacement of wiring due to age.",
    assignedAgent: "David Chen",
    lastUpdated: "2025-05-16 09:15 AM",
    citizenContact: "neighborhood.watch@example.com"
  },
  {
    id: 4,
    dateTime: "2025-04-28 16:45 PM",
    category: "Public Utilities",
    status: "Resolved",
    title: "Water outage without prior notice",
    description: "There was a water outage in the Riverside neighborhood on April 27th with no prior notification to residents. Many families were unprepared and this caused significant inconvenience.",
    agency: "Water Department",
    priority: "high",
    response: "We sincerely apologize for the unannounced outage. This was an emergency repair due to a major pipe burst. We've updated our notification system to ensure that even emergency repairs will trigger automatic alerts via text message to affected areas. You can sign up for these alerts on our website.",
    agentNotes: "Emergency repair of 24-inch main line. Updated procedure doc #WD-112 to include emergency notification protocol.",
    assignedAgent: "Sarah Kim",
    lastUpdated: "2025-05-01 14:30 PM",
    attachments: ["incident_report.pdf", "repair_photos.zip"],
    citizenContact: "riverside.resident@example.com"
  },
  {
    id: 5,
    dateTime: "2025-04-20 10:05 AM",
    category: "Parks & Recreation",
    status: "Assigned",
    title: "Playground equipment damage",
    description: "The slide at Oakwood Park children's playground is damaged with a large crack that could be dangerous for children. This needs immediate attention.",
    agency: "Parks Department",
    priority: "high",
    agentNotes: "Initial inspection shows crack in plastic slide section. Whole unit may need replacement rather than repair. Getting quotes from vendors.",
    assignedAgent: "Jamal Williams",
    lastUpdated: "2025-04-22 13:45 PM",
    attachments: ["damage_photos.jpg"],
    citizenContact: "concerned.parent@example.com"
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

// Available statuses
const statuses = [
  "Submitted",
  "Under Review",
  "Assigned", 
  "In Progress",
  "Resolved",
  "Closed",
  "Requires More Info"
];

const Complaint: React.FC<AccordionProps> = ({
  i,
  expanded,
  setExpanded,
  item,
  onStatusChange,
  onResponseUpdate,
  onAgentNotesUpdate,
  onPriorityChange,
  onAssignAgent,
  onDeleteComplaint,
  isAgentView,
  currentAgent
}) => {
  const isOpen = i === expanded;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // State for edit mode
  const [isEditingResponse, setIsEditingResponse] = useState(false);
  const [editedResponse, setEditedResponse] = useState(item.response || "");
  
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(item.agentNotes || "");
  
  // Get status styling
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
      case "requires more info":
        return {
          badge: "bg-orange-100 text-orange-800",
          border: "border-orange-200",
          bg: isOpen ? "bg-orange-50" : "bg-white",
          icon: "text-orange-500"
        };
      case "closed":
        return {
          badge: "bg-gray-100 text-gray-800",
          border: "border-gray-200",
          bg: isOpen ? "bg-gray-50" : "bg-white",
          icon: "text-gray-500"
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
  
  // Get priority styling
  const getPriorityColors = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const colors = getStatusColors(item.status);
  
  const saveResponse = () => {
    onResponseUpdate(item.id, editedResponse);
    setIsEditingResponse(false);
  };
  
  const saveNotes = () => {
    onAgentNotesUpdate(item.id, editedNotes);
    setIsEditingNotes(false);
  };
  
  // Agent table row view (compact view for table)
  if (isAgentView && !isOpen) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`grid grid-cols-12 gap-2 items-center p-3 rounded-lg border ${colors.border} shadow-sm w-full cursor-pointer ${colors.bg}`}
        onClick={() => setExpanded(isOpen ? null : i)}
      >
        <div className="col-span-1">
          <input 
            type="checkbox" 
            className="rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="col-span-1">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700`}>
            <span className="text-xs font-medium">#{item.id}</span>
          </div>
        </div>
        <div className="col-span-3 truncate font-medium text-gray-800">
          {item.title}
        </div>
        <div className="col-span-2 text-sm text-gray-600 truncate">
          {item.category}
        </div>
        <div className="col-span-2">
          <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${colors.badge}`}>
            {item.status}
          </span>
        </div>
        <div className="col-span-1">
          <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getPriorityColors(item.priority)}`}>
            {item.priority}
          </span>
        </div>
        <div className="col-span-2 text-sm text-gray-600">
          {new Date(item.dateTime).toLocaleDateString()}
        </div>
      </motion.div>
    );
  }

  // Regular expanded view for both agent and citizen
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`overflow-hidden rounded-lg border ${colors.border} shadow-sm w-full`}
    >
      <motion.header
        initial={false}
        onClick={() => setExpanded(isOpen ? null : i)}
        className={`flex cursor-pointer items-center justify-between p-4 ${colors.bg}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center">
            {isAgentView && (
              <div className="mr-2" onClick={(e) => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  className="rounded"
                />
              </div>
            )}
            <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700`}>
              <span className="text-sm font-medium">#{item.id}</span>
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-sm text-gray-600">{item.dateTime}</span>
                <span className="text-sm text-gray-600">• {item.category}</span>
                {item.lastUpdated && item.lastUpdated !== item.dateTime && (
                  <span className="text-sm text-gray-600">• Updated: {item.lastUpdated}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <span className={`ml-0 sm:ml-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${colors.badge}`}>
              {item.status}
            </span>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getPriorityColors(item.priority)}`}>
              {item.priority}
            </span>
          </div>
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
              <p className="mt-1 text-gray-700">{item.assignedAgent || "Pending Assignment"}</p>
            </div>
            
            {item.citizenContact && isAgentView && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700">Citizen Contact:</h4>
                <p className="mt-1 text-gray-700">{item.citizenContact}</p>
              </div>
            )}
            
            {item.attachments && item.attachments.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700">Attachments:</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {item.attachments.map((attachment, idx) => (
                    <span key={idx} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                      </svg>
                      {attachment}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Agent notes section - only visible to agents */}
            {isAgentView && (
              <div className="mb-4 p-3 border-l-4 border-blue-300 bg-blue-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold text-blue-800">Agent Notes:</h4>
                  <button 
                    className="text-blue-700 hover:text-blue-900 text-xs font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditingNotes(!isEditingNotes);
                      setEditedNotes(item.agentNotes || "");
                    }}
                  >
                    {isEditingNotes ? "Cancel" : "Edit"}
                  </button>
                </div>
                
                {isEditingNotes ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <textarea
                      className="w-full p-2 border border-blue-300 rounded"
                      rows={3}
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveNotes();
                        }}
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-blue-700">{item.agentNotes || "No agent notes added yet."}</p>
                )}
              </div>
            )}
            
            {/* Response section with edit capability for agents */}
            {item.response || isAgentView ? (
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-blue-800">Official Response:</h3>
                  {isAgentView && (
                    <button 
                      className="text-blue-700 hover:text-blue-900 text-xs font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingResponse(!isEditingResponse);
                        setEditedResponse(item.response || "");
                      }}
                    >
                      {isEditingResponse ? "Cancel" : (item.response ? "Edit" : "Add Response")}
                    </button>
                  )}
                </div>
                
                {isAgentView && isEditingResponse ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <textarea
                      className="w-full p-2 border border-blue-300 rounded"
                      rows={4}
                      value={editedResponse}
                      onChange={(e) => setEditedResponse(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveResponse();
                        }}
                      >
                        Save Response
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-blue-700">
                    {item.response ? (
                      <p>{item.response}</p>
                    ) : (
                      <p className="italic text-blue-400">No response has been added yet.</p>
                    )}
                  </div>
                )}
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
                      <p>Your complaint has been received and is being processed. We'll notify you when there's an update.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Agent Action Panel */}
            {isAgentView && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Agent Actions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Update Status</label>
                    <select
                      className="w-full rounded border border-gray-300 p-2"
                      value={item.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        onStatusChange(item.id, e.target.value);
                      }}
                    >
                      {statuses.map((status, idx) => (
                        <option key={idx} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Update Priority</label>
                    <select
                      className="w-full rounded border border-gray-300 p-2"
                      value={item.priority}
                      onChange={(e) => {
                        e.stopPropagation();
                        onPriorityChange(item.id, e.target.value as "low" | "medium" | "high");
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Assign To</label>
                    <select
                      className="w-full rounded border border-gray-300 p-2"
                      value={item.assignedAgent || ""}
                      onChange={(e) => {
                        e.stopPropagation();
                        onAssignAgent(item.id, e.target.value);
                      }}
                    >
                      <option value="">Unassigned</option>
                      {agents.map((agent, idx) => (
                        <option key={idx} value={agent.name}>{agent.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteComplaint(item.id);
                    }}
                  >
                    Delete Complaint
                  </button>
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// New Complaint Form Component
const NewComplaintForm: React.FC<{
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  categories: string[];
  citizenContact: string;
  setCitizenContact: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => void;
}> = ({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  categories,
  citizenContact,
  setCitizenContact,
  handleSubmit
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Submit a New Complaint</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Brief title of your complaint"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            rows={4}
            placeholder="Detailed description of your complaint"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Information <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contact"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Email or phone number for updates"
            value={citizenContact}
            onChange={(e) => setCitizenContact(e.target.value)}
            required
          />
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Complaint
          </button>
        </div>
      </form>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [complaints, setComplaints] = useState<ComplaintItem[]>(complaintItems);
  const [activeTab, setActiveTab] = useState<"all" | "assigned" | "unassigned" | "highPriority" | "analytics">("all");
  const [isAgentView, setIsAgentView] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [currentSort, setCurrentSort] = useState<{field: string, direction: 'asc' | 'desc'}>({field: "dateTime", direction: "desc"});
  
  // Current logged-in agent (would come from auth in a real app)
  const [currentAgent, setCurrentAgent] = useState<AgentUser>(agents[0]);

  // Form states for new complaint
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [citizenContact, setCitizenContact] = useState("");
  const [bulkActionSelectedIds, setBulkActionSelectedIds] = useState<number[]>([]);
  
  // Filter and sort complaints
  const filteredComplaints = complaints
    .filter(complaint => {
      // Search term filter
      const searchMatch = searchTerm === "" || 
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.id.toString().includes(searchTerm);
      
      // Category filter  
      const categoryMatch = filterCategory === "" || complaint.category === filterCategory;
      
      // Status filter
      const statusMatch = filterStatus === "" || complaint.status === filterStatus;
      
      // Tab filters
      let tabMatch = true;
      if (activeTab === "assigned") {
        tabMatch = complaint.assignedAgent === currentAgent.name;
      } else if (activeTab === "unassigned") {
        tabMatch = !complaint.assignedAgent;
      } else if (activeTab === "highPriority") {
        tabMatch = complaint.priority === "high";
      }
      
      return searchMatch && categoryMatch && statusMatch && tabMatch;
    })
    .sort((a, b) => {
      // Handle sorting
      const field = currentSort.field;
      
      if (field === "id" || field === "dateTime" || field === "lastUpdated") {
        // For date and numeric fields
        const valA = field === "id" ? a.id : field === "dateTime" ? new Date(a.dateTime).getTime() : 
          a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
        const valB = field === "id" ? b.id : field === "dateTime" ? new Date(b.dateTime).getTime() : 
          b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
        
        return currentSort.direction === "asc" ? valA - valB : valB - valA;
      } else {
        // For string fields
        const valA = a[field as keyof ComplaintItem] as string || "";
        const valB = b[field as keyof ComplaintItem] as string || "";
        
        return currentSort.direction === "asc" 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
    });
  
  // Handle submission of new complaint
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newComplaint: ComplaintItem = {
      id: complaints.length + 1,
      dateTime: new Date().toLocaleString(),
      category: category,
      status: "Submitted",
      title: title,
      description: description,
      agency: "Pending Assignment",
      priority: "medium",
      citizenContact: citizenContact,
      lastUpdated: new Date().toLocaleString()
    };
    
    setComplaints([newComplaint, ...complaints]);
    setTitle("");
    setDescription("");
    setCategory(categories[0]);
    setCitizenContact("");
    setActiveTab("all");
  };
  
  // CRUD operations for complaints
  const handleStatusChange = (id: number, status: string) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id 
        ? { 
            ...complaint, 
            status, 
            lastUpdated: new Date().toLocaleString() 
          } 
        : complaint
    ));
  };
  
  const handleResponseUpdate = (id: number, response: string) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id 
        ? { 
            ...complaint, 
            response, 
            lastUpdated: new Date().toLocaleString() 
          } 
        : complaint
    ));
  };
  
  const handleAgentNotesUpdate = (id: number, agentNotes: string) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id 
        ? { 
            ...complaint, 
            agentNotes, 
            lastUpdated: new Date().toLocaleString() 
          } 
        : complaint
    ));
  };
  
  const handlePriorityChange = (id: number, priority: "low" | "medium" | "high") => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id 
        ? { 
            ...complaint, 
            priority, 
            lastUpdated: new Date().toLocaleString() 
          } 
        : complaint
    ));
  };
  
  const handleAssignAgent = (id: number, agent: string) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id 
        ? { 
            ...complaint, 
            assignedAgent: agent, 
            status: complaint.status === "Submitted" ? "Assigned" : complaint.status,
            lastUpdated: new Date().toLocaleString() 
          } 
        : complaint
    ));
  };
  
  const handleDeleteComplaint = (id: number) => {
    if (window.confirm("Are you sure you want to delete this complaint? This action cannot be undone.")) {
      setComplaints(complaints.filter(complaint => complaint.id !== id));
      setExpanded(null);
    }
  };
  
  const toggleBulkSelection = (id: number) => {
    if (bulkActionSelectedIds.includes(id)) {
      setBulkActionSelectedIds(bulkActionSelectedIds.filter(itemId => itemId !== id));
    } else {
      setBulkActionSelectedIds([...bulkActionSelectedIds, id]);
    }
  };
  
  const selectAllVisible = () => {
    setBulkActionSelectedIds(filteredComplaints.map(c => c.id));
  };
  
  const clearSelection = () => {
    setBulkActionSelectedIds([]);
  };
  
  const applyBulkStatusChange = (status: string) => {
    setComplaints(complaints.map(complaint => 
      bulkActionSelectedIds.includes(complaint.id)
        ? { 
            ...complaint, 
            status, 
            lastUpdated: new Date().toLocaleString() 
          } 
        : complaint
    ));
    clearSelection();
  };
  
  const applyBulkPriorityChange = (priority: "low" | "medium" | "high") => {
    setComplaints(complaints.map(complaint => 
      bulkActionSelectedIds.includes(complaint.id)
        ? { 
            ...complaint, 
            priority, 
            lastUpdated: new Date().toLocaleString() 
          } 
        : complaint
    ));
    clearSelection();
  };
  
  const applyBulkAssign = (agent: string) => {
    setComplaints(complaints.map(complaint => 
      bulkActionSelectedIds.includes(complaint.id)
        ? { 
            ...complaint, 
            assignedAgent: agent, 
            status: complaint.status === "Submitted" ? "Assigned" : complaint.status,
            lastUpdated: new Date().toLocaleString() 
          } 
        : complaint
    ));
    clearSelection();
  };
  
  const bulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${bulkActionSelectedIds.length} complaints? This action cannot be undone.`)) {
      setComplaints(complaints.filter(complaint => !bulkActionSelectedIds.includes(complaint.id)));
      clearSelection();
      setExpanded(null);
    }
  };
  
  // Toggle sort
  const handleSort = (field: string) => {
    setCurrentSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  return (
    <div className="mx-auto max-w-full py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between">
        <header className="mb-8">
          <h1 className="mb-2 bg-gradient-to-b from-blue-700 to-blue-900 bg-clip-text text-4xl font-bold text-transparent flex items-center">
            Citizen on Top
            {isAgentView && <span className="ml-3 bg-blue-700 text-white text-xs rounded px-2 py-1">AGENT VIEW</span>}
          </h1>
          <p className="text-gray-600">
            {isAgentView 
              ? `Manage and respond to citizen complaints - Logged in as ${currentAgent.name} (${currentAgent.department})`
              : "Submit, track, and receive updates on your public service requests"}
          </p>
        </header>

        <div className="mb-6 flex justify-end items-start">
          <button
            className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
            onClick={() => setIsAgentView(!isAgentView)}
          >
            Switch to {isAgentView ? "Citizen" : "Agent"} View
          </button>
        </div>
      </div>

      {isAgentView ? (
        <>
          {/* Agent Dashboard */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <div className="text-4xl font-bold text-blue-600">{complaints.length}</div>
              <div className="text-gray-600">Total Complaints</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <div className="text-4xl font-bold text-yellow-600">
                {complaints.filter(c => c.status === "In Progress").length}
              </div>
              <div className="text-gray-600">In Progress</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <div className="text-4xl font-bold text-green-600">
                {complaints.filter(c => c.status === "Resolved").length}
              </div>
              <div className="text-gray-600">Resolved</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <div className="text-4xl font-bold text-red-600">
                {complaints.filter(c => c.priority === "high").length}
              </div>
              <div className="text-gray-600">High Priority</div>
            </div>
          </div>
          
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Complaints
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "assigned"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("assigned")}
            >
              Assigned to Me
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "unassigned"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("unassigned")}
            >
              Unassigned
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "highPriority"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("highPriority")}
            >
              High Priority
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "analytics"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              Analytics
            </button>
          </div>
          
          {/* Search and filter controls */}
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  id="search"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Search by title, description, or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                <select
                  id="category-filter"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                <select
                  id="status-filter"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {statuses.map((status, idx) => (
                    <option key={idx} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Bulk actions */}
          {bulkActionSelectedIds.length > 0 && (
            <div className="mb-6 bg-blue-50 rounded-lg p-4 flex flex-wrap gap-2 items-center">
              <span className="text-blue-700 font-medium">{bulkActionSelectedIds.length} selected</span>
              <div className="grow"></div>
              <select
                className="rounded border border-blue-300 px-3 py-1"
                onChange={(e) => {
                  if (e.target.value) applyBulkStatusChange(e.target.value);
                  e.target.value = "";
                }}
              >
                <option value="">Change Status</option>
                {statuses.map((status, idx) => (
                  <option key={idx} value={status}>{status}</option>
                ))}
              </select>
              <select
                className="rounded border border-blue-300 px-3 py-1"
                onChange={(e) => {
                  if (e.target.value) applyBulkPriorityChange(e.target.value as "low" | "medium" | "high");
                  e.target.value = "";
                }}
              >
                <option value="">Change Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                className="rounded border border-blue-300 px-3 py-1"
                onChange={(e) => {
                  if (e.target.value) applyBulkAssign(e.target.value);
                  e.target.value = "";
                }}
              >
                <option value="">Assign To</option>
                {agents.map((agent, idx) => (
                  <option key={idx} value={agent.name}>{agent.name}</option>
                ))}
              </select>
              <button 
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={bulkDelete}
              >
                Delete
              </button>
              <button 
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                onClick={clearSelection}
              >
                Cancel
              </button>
            </div>
          )}
          
          {activeTab !== "analytics" ? (
            <>
              {/* Complaints table header */}
              <div className="bg-gray-100 rounded-t-lg p-3 grid grid-cols-12 gap-2 font-medium text-gray-700 border-b">
                <div className="col-span-1">
                  <input 
                    type="checkbox" 
                    checked={filteredComplaints.length > 0 && bulkActionSelectedIds.length === filteredComplaints.length}
                    onChange={() => {
                      if (bulkActionSelectedIds.length === filteredComplaints.length) {
                        clearSelection();
                      } else {
                        selectAllVisible();
                      }
                    }}
                    className="rounded"
                  />
                </div>
                <div 
                  className="col-span-1 cursor-pointer flex items-center gap-1"
                  onClick={() => handleSort("id")}
                >
                  <span>ID</span>
                  {currentSort.field === "id" && (
                    <span>{currentSort.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
                <div 
                  className="col-span-3 cursor-pointer flex items-center gap-1"
                  onClick={() => handleSort("title")}
                >
                  <span>Title</span>
                  {currentSort.field === "title" && (
                    <span>{currentSort.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
                <div 
                  className="col-span-2 cursor-pointer flex items-center gap-1"
                  onClick={() => handleSort("category")}
                >
                  <span>Category</span>
                  {currentSort.field === "category" && (
                    <span>{currentSort.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
                <div 
                  className="col-span-2 cursor-pointer flex items-center gap-1"
                  onClick={() => handleSort("status")}
                >
                  <span>Status</span>
                  {currentSort.field === "status" && (
                    <span>{currentSort.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
                <div 
                  className="col-span-1 cursor-pointer flex items-center gap-1"
                  onClick={() => handleSort("priority")}
                >
                  <span>Priority</span>
                  {currentSort.field === "priority" && (
                    <span>{currentSort.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
                <div 
                  className="col-span-2 cursor-pointer flex items-center gap-1"
                  onClick={() => handleSort("dateTime")}
                >
                  <span>Date</span>
                  {currentSort.field === "dateTime" && (
                    <span>{currentSort.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </div>
              
              {/* Complaint list */}
              <div className="space-y-2">
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((item, i) => (
                    <Complaint
                      key={i}
                      i={i}
                      expanded={expanded}
                      setExpanded={setExpanded}
                      item={item}
                      onStatusChange={handleStatusChange}
                      onResponseUpdate={handleResponseUpdate}
                      onAgentNotesUpdate={handleAgentNotesUpdate}
                      onPriorityChange={handlePriorityChange}
                      onAssignAgent={handleAssignAgent}
                      onDeleteComplaint={handleDeleteComplaint}
                      isAgentView={isAgentView}
                      currentAgent={currentAgent}
                    />
                  ))
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-gray-500">No complaints match your current filters.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Complaint Analytics</h2>
              
              {/* Sample analytics dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Complaints by Category</h3>
                  <div className="h-64 flex items-end">
                    {categories.map((cat, idx) => {
                      const count = complaints.filter(c => c.category === cat).length;
                      const percentage = (count / complaints.length) * 100;
                      return (
                        <div key={idx} className="flex flex-col items-center mx-1 flex-grow">
                          <div 
                            className="w-full bg-blue-600 rounded-t-sm" 
                            style={{ height: `${Math.max(percentage, 5)}%` }}
                          ></div>
                          <div className="text-xs mt-1 text-gray-600 truncate w-full text-center">{cat}</div>
                          <div className="text-sm font-semibold">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Complaints by Status</h3>
                  <div className="h-64 flex items-end">
                    {statuses.map((status, idx) => {
                      const count = complaints.filter(c => c.status === status).length;
                      const percentage = (count / complaints.length) * 100;
                      return (
                        <div key={idx} className="flex flex-col items-center mx-1 flex-grow">
                          <div 
                            className="w-full bg-green-600 rounded-t-sm" 
                            style={{ height: `${Math.max(percentage, 5)}%` }}
                          ></div>
                          <div className="text-xs mt-1 text-gray-600 truncate w-full text-center">{status}</div>
                          <div className="text-sm font-semibold">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Resolution Time (Avg. Days)</h3>
                  <div className="flex items-center justify-center h-40">
                    <div className="text-5xl font-bold text-blue-700">4.2</div>
                  </div>
                  <div className="text-center text-sm text-gray-600">Average days to resolve complaints</div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Agent Performance</h3>
                  <div className="space-y-3">
                    {agents.filter(a => a.role !== "admin").map((agent, idx) => {
                      const assignedCount = complaints.filter(c => c.assignedAgent === agent.name).length;
                      const resolvedCount = complaints.filter(c => c.assignedAgent === agent.name && c.status === "Resolved").length;
                      const efficiency = assignedCount > 0 ? Math.round((resolvedCount / assignedCount) * 100) : 0;
                      
                      return (
                        <div key={idx} className="flex items-center">
                          <div className="w-32 truncate">{agent.name}</div>
                          <div className="ml-2 flex-grow">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${efficiency}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="ml-2 text-sm font-medium">{efficiency}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Citizen View */}
          <div className="mb-6 flex justify-center space-x-4">
            <button
              className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
                activeTab === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("all")}
            >
              My Complaints
            </button>
            <button
              className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
                activeTab === "assigned"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("assigned")}
            >
              Submit New Complaint
            </button>
          </div>

          {activeTab === "all" ? (
            <div className="space-y-4">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((item, i) => (
                  <Complaint
                    key={i}
                    i={i}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    item={item}
                    onStatusChange={handleStatusChange}
                    onResponseUpdate={handleResponseUpdate}
                    onAgentNotesUpdate={handleAgentNotesUpdate}
                    onPriorityChange={handlePriorityChange}
                    onAssignAgent={handleAssignAgent}
                    onDeleteComplaint={handleDeleteComplaint}
                    isAgentView={isAgentView}
                    currentAgent={currentAgent}
                  />
                ))
              ) : (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <p className="text-gray-500">You haven't submitted any complaints yet.</p>
                </div>
              )}
            </div>
          ) : (
            <NewComplaintForm 
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              category={category}
              setCategory={setCategory}
              categories={categories}
              citizenContact={citizenContact}
              setCitizenContact={setCitizenContact}
              handleSubmit={handleSubmit}
            />
          )}
        </>
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

export default AdminDashboard;