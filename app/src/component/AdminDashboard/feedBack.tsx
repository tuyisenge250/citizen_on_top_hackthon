import React, { useState } from "react";

interface FeedbackItem {
  id: number;
  dateTime: string;
  rating: number;
  feedbackType: string;
  comment: string;
  email: string;
  status: "Reviewed" | "Action Required" | "Resolved" | "In Progress";
}

interface Stats {
  avgRating: string;
  totalFeedbacks: number;
  actionRequired: number;
  distribution: Record<number, number>;
}

export default function FeedbackDashboard() {
  // Sample feedback data with proper typing
  const initialFeedbackData: FeedbackItem[] = [
    {
      id: 1,
      dateTime: "2025-05-15 10:30 AM",
      rating: 4,
      feedbackType: "Platform Experience",
      comment: "The new complaint tracking system is very user-friendly. I appreciate being able to see updates in real-time. Would be great if there were mobile notifications.",
      email: "maria.johnson@example.com",
      status: "Reviewed"
    },
    {
      id: 2,
      dateTime: "2025-05-14 15:45 PM",
      rating: 2,
      feedbackType: "Complaint Resolution",
      comment: "My complaint (#4) about the water outage was resolved, but it took much longer than it should have. Better communication would have been helpful.",
      email: "robert.smith@example.com",
      status: "Action Required"
    },
    {
      id: 3,
      dateTime: "2025-05-13 09:15 AM",
      rating: 5,
      feedbackType: "Customer Service",
      comment: "The representative who handled my pothole complaint was extremely helpful and kept me informed throughout the process. Great service!",
      email: "david.wilson@example.com",
      status: "Resolved"
    },
    {
      id: 4,
      dateTime: "2025-05-12 14:20 PM",
      rating: 3,
      feedbackType: "Website Usability",
      comment: "The website is generally good but sometimes slow to load. The form for submitting complaints could be simplified.",
      email: "",
      status: "In Progress"
    },
    {
      id: 5,
      dateTime: "2025-05-11 11:00 AM",
      rating: 1,
      feedbackType: "Complaint Resolution",
      comment: "Very disappointed with how my noise complaint was handled. No action was taken and I never received any updates.",
      email: "susan.miller@example.com",
      status: "Action Required"
    },
    {
      id: 6,
      dateTime: "2025-05-10 16:30 PM",
      rating: 4,
      feedbackType: "Mobile App Experience",
      comment: "The mobile app is quite intuitive but crashes occasionally when uploading photos to complaints.",
      email: "james.taylor@example.com",
      status: "In Progress"
    },
    {
      id: 7,
      dateTime: "2025-05-09 09:45 AM",
      rating: 5,
      feedbackType: "General",
      comment: "This system is a massive improvement over the previous method of submitting complaints by phone. Keep up the good work!",
      email: "",
      status: "Reviewed"
    }
  ];

  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>(initialFeedbackData);
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showingStats, setShowingStats] = useState<boolean>(true);

  // Calculate stats with proper return type
  const calculateStats = (): Stats => {
    if (feedbackData.length === 0) return { 
      avgRating: "0", 
      totalFeedbacks: 0, 
      actionRequired: 0, 
      distribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0} 
    };
    
    const totalRating = feedbackData.reduce((sum, item) => sum + item.rating, 0);
    const avgRating = (totalRating / feedbackData.length).toFixed(1);
    const actionRequired = feedbackData.filter(item => item.status === "Action Required").length;
    
    // Calculate rating distribution
    const distribution: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    feedbackData.forEach(item => {
      distribution[item.rating]++;
    });
    
    return {
      avgRating,
      totalFeedbacks: feedbackData.length,
      actionRequired,
      distribution
    };
  };
  
  const stats = calculateStats();

  // Filter feedback data
  const getFilteredData = (): FeedbackItem[] => {
    let filtered = [...feedbackData];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.comment.toLowerCase().includes(query) || 
        (item.email && item.email.toLowerCase().includes(query)) ||
        item.feedbackType.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter(item => item.status === filter);
    }
    
    // Apply sorting
    if (sort === "newest") {
      filtered.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    } else if (sort === "oldest") {
      filtered.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    } else if (sort === "highest") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === "lowest") {
      filtered.sort((a, b) => a.rating - b.rating);
    }
    
    return filtered;
  };
  
  const filteredData = getFilteredData();

  // Handle status update
  const updateStatus = (id: number, newStatus: FeedbackItem["status"]) => {
    const updatedData = feedbackData.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    setFeedbackData(updatedData);
  };

  // Star rating display component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${
              rating >= star ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Status badge component with appropriate colors
  const StatusBadge = ({ status }: { status: FeedbackItem["status"] }) => {
    const getStatusStyle = (status: FeedbackItem["status"]) => {
      switch (status) {
        case "Resolved":
          return "bg-green-100 text-green-800";
        case "In Progress":
          return "bg-blue-100 text-blue-800";
        case "Action Required":
          return "bg-red-100 text-red-800";
        case "Reviewed":
          return "bg-purple-100 text-purple-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(status)}`}>
        {status}
      </span>
    );
  };

  // Progress bar component for rating distribution
  const ProgressBar = ({ value, max, color }: { value: number, max: number, color: string }) => {
    const percentage = (value / max) * 100;
    return (
      <div className="h-2 w-full bg-gray-200 rounded-full">
        <div 
          className={`h-2 rounded-full ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

return (
    <div className="mx-auto max-w-full py-6 px-4">
      <header className="mb-8">
        <h1 className="mb-2 bg-gradient-to-b from-blue-700 to-blue-900 bg-clip-text text-4xl font-bold text-transparent">
          Citizen Feedback Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor, analyze, and respond to citizen feedback across all channels
        </p>
      </header>

      {showingStats && (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Average Rating Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-2 text-lg font-medium text-gray-500">Average Rating</div>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-800">{stats.avgRating}</span>
              <div className="flex">
              </div>
            </div>
          </div>

          {/* Total Feedbacks Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-2 text-lg font-medium text-gray-500">Total Feedback</div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalFeedbacks}</div>
          </div>

          {/* Action Required Card */}
          <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
            <div className="mb-2 text-lg font-medium text-red-500">Action Required</div>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-red-500">{stats.actionRequired}</span>
              <span className="ml-2 text-lg text-gray-500">items</span>
            </div>
          </div>

          {/* Rating Distribution Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-lg font-medium text-gray-500">Rating Distribution</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">5 ★</span>
                </div>
                <div className="ml-2 w-full max-w-xs">
                  <ProgressBar 
                    value={stats.distribution[5]} 
                    max={stats.totalFeedbacks} 
                    color="bg-green-500" 
                  />
                </div>
                <span className="ml-2 text-sm text-gray-600">{stats.distribution[5]}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">4 ★</span>
                </div>
                <div className="ml-2 w-full max-w-xs">
                  <ProgressBar 
                    value={stats.distribution[4]} 
                    max={stats.totalFeedbacks} 
                    color="bg-green-400" 
                  />
                </div>
                <span className="ml-2 text-sm text-gray-600">{stats.distribution[4]}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">3 ★</span>
                </div>
                <div className="ml-2 w-full max-w-xs">
                  <ProgressBar 
                    value={stats.distribution[3]} 
                    max={stats.totalFeedbacks} 
                    color="bg-yellow-400" 
                  />
                </div>
                <span className="ml-2 text-sm text-gray-600">{stats.distribution[3]}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">2 ★</span>
                </div>
                <div className="ml-2 w-full max-w-xs">
                  <ProgressBar 
                    value={stats.distribution[2]} 
                    max={stats.totalFeedbacks} 
                    color="bg-orange-400" 
                  />
                </div>
                <span className="ml-2 text-sm text-gray-600">{stats.distribution[2]}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">1 ★</span>
                </div>
                <div className="ml-2 w-full max-w-xs">
                  <ProgressBar 
                    value={stats.distribution[1]} 
                    max={stats.totalFeedbacks} 
                    color="bg-red-500" 
                  />
                </div>
                <span className="ml-2 text-sm text-gray-600">{stats.distribution[1]}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex space-x-2">
          <button
            className={`rounded-md ${
              showingStats ? "bg-blue-600 text-white" : "bg-white text-blue-600"
            } px-4 py-2 text-sm font-medium shadow-sm transition`}
            onClick={() => setShowingStats(!showingStats)}
          >
            {showingStats ? "Hide Statistics" : "Show Statistics"}
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="Resolved">Resolved</option>
            <option value="In Progress">In Progress</option>
            <option value="Action Required">Action Required</option>
            <option value="Reviewed">Reviewed</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
        <div className="flex-1 sm:ml-4">
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div 
              key={item.id}
              className="rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div 
                className="flex cursor-pointer flex-col justify-between p-4 sm:flex-row"
                onClick={() => setSelectedFeedback(selectedFeedback === item.id ? null : item.id)}
              >
                <div className="mb-2 sm:mb-0">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <span className="text-sm font-medium">#{item.id}</span>
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <StarRating rating={item.rating} />
                        <span className="ml-2 text-sm text-gray-600">• {item.feedbackType}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">{item.dateTime}</span>
                        {item.email && (
                          <span className="text-sm text-gray-600">• {item.email}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <StatusBadge status={item.status} />
                  <svg
                    className="ml-4 h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ 
                      transform: selectedFeedback === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              
              {selectedFeedback === item.id && (
                <div className="border-t border-gray-200 p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700">Feedback:</h4>
                    <p className="mt-1 text-gray-700">{item.comment}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700">Update Status:</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => updateStatus(item.id, "In Progress")}
                        className="rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200"
                      >
                        Set In Progress
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, "Action Required")}
                        className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-800 hover:bg-red-200"
                      >
                        Mark Action Required
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, "Reviewed")}
                        className="rounded-md bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 hover:bg-purple-200"
                      >
                        Mark Reviewed
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, "Resolved")}
                        className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-800 hover:bg-green-200"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                  
                  {item.email && (
                    <div className="mt-4 flex">
                      <button className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send Response
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">No feedback found matching your criteria.</p>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p>Looking for more insights? Generate detailed reports by clicking on "Export to CSV" or "Generate Report" in the Admin panel.</p>
          </div>
        </div>
      </div>
    </div>
  );
}