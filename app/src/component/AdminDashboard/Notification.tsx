import { useState, useEffect } from 'react';
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  Filter,
  Search,
  RefreshCw,
} from 'lucide-react';

type NotificationType =
  | 'status_update'
  | 'response'
  | 'resolved'
  | 'information'
  | 'escalation';

type Priority = 'low' | 'normal' | 'high' | 'urgent';

interface Action {
  label: string;
  action: string;
  id: string;
}

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  complaintId?: string;
  date: string;
  read: boolean;
  priority: Priority;
  agency?: string;
  actions: Action[];
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'updates' | 'urgent'>('all');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fetch notifications (simulated)
  // useEffect(() => {
  //   setTimeout(() => {
  //     const mockNotifications: Notification[] = [
  //       {
  //         id: 'not-1',
  //         type: 'status_update',
  //         title: 'Complaint Status Updated',
  //         message:
  //           'Your complaint regarding "Road pothole at Junction Mall" has been assigned to Roads & Transport Department. An inspector will visit the location within 48 hours.',
  //         complaintId: 'COMP-2023-0578',
  //         date: '2025-05-15T09:24:00',
  //         read: false,
  //         priority: 'normal',
  //         agency: 'Roads & Transport',
  //         actions: [{ label: 'View Complaint', action: 'view_complaint', id: 'COMP-2023-0578' }],
  //       },State([]);
  // const [searchQuery, setSearchQuery] = useState('');
  // const [refreshing, setRefreshing] = useState(false);
  
  // Fetch notifications (simulated)
  useEffect(() => {
    // In a real implementation, this would be an API call
    setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: 'not-1',
          type: 'status_update',
          title: 'Complaint Status Updated',
          message: 'Your complaint regarding "Road pothole at Junction Mall" has been assigned to Roads & Transport Department. An inspector will visit the location within 48 hours.',
          complaintId: 'COMP-2023-0578',
          date: '2025-05-15T09:24:00',
          read: false,
          priority: 'normal',
          agency: 'Roads & Transport',
          actions: [
            { label: 'View Complaint', action: 'view_complaint', id: 'COMP-2023-0578' }
          ]
        },
        {
          id: 'not-2',
          type: 'response',
          title: 'New Response from Water Department',
          message: 'The Water Department has responded to your complaint about "Water supply interruption". They have provided additional information and are requesting more details about the issue.',
          complaintId: 'COMP-2023-0432',
          date: '2025-05-14T16:45:00',
          read: true,
          priority: 'high',
          agency: 'Water Department',
          actions: [
            { label: 'View Response', action: 'view_response', id: 'COMP-2023-0432' },
            { label: 'Provide Details', action: 'provide_details', id: 'COMP-2023-0432' }
          ]
        },
        {
          id: 'not-3',
          type: 'resolved',
          title: 'Complaint Resolved',
          message: 'Your complaint regarding "Street light not working" has been resolved. The Municipal Services team has fixed the street light at Garden Avenue. Please confirm if the issue has been resolved to your satisfaction.',
          complaintId: 'COMP-2023-0389',
          date: '2025-05-10T11:20:00',
          read: true,
          priority: 'normal',
          agency: 'Municipal Services',
          actions: [
            { label: 'Confirm Resolution', action: 'confirm_resolution', id: 'COMP-2023-0389' },
            { label: 'Report Still Not Fixed', action: 'report_not_fixed', id: 'COMP-2023-0389' }
          ]
        },
        {
          id: 'not-4',
          type: 'information',
          title: 'Scheduled Maintenance',
          message: 'The Electricity Board has scheduled maintenance in your area on May 20, 2025, from 10:00 AM to 2:00 PM. This may affect power supply during this period. This is a system-wide notification to all residents in your district.',
          date: '2025-05-13T08:30:00',
          read: false,
          priority: 'low',
          agency: 'Electricity Board',
          actions: []
        },
        {
          id: 'not-5',
          type: 'escalation',
          title: 'Complaint Escalated',
          message: 'Your complaint regarding "Garbage not collected for 3 days" has been escalated to the Senior Supervisor of Waste Management Department as it has been pending for more than the standard resolution time. You should expect a resolution within 24 hours.',
          complaintId: 'COMP-2023-0612',
          date: '2025-05-12T14:15:00',
          read: false,
          priority: 'urgent',
          agency: 'Waste Management',
          actions: [
            { label: 'View Complaint Status', action: 'view_complaint', id: 'COMP-2023-0612' }
          ]
        }
      ];
      
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Simulate refresh action
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  // Toggle notification expansion
  const toggleExpand = (id: any) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  
  // Mark notification as read
  const markAsRead = (id: any) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Handle notification action
  const handleAction = (action: any, id: any) => {
    // In real implementation, this would navigate or perform the action
    console.log(`Performing action ${action} for ${id}`);
    // Example implementation would be:
    // if (action === 'view_complaint') {
    //   navigate(`/complaints/${id}`);
    // }
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: any, priority: any) => {
    switch (type) {
      case 'status_update':
        return <Info size={20} className="text-blue-500" />;
      case 'response':
        return <MessageCircle size={20} className="text-purple-500" />;
      case 'resolved':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'escalation':
        return <AlertTriangle size={20} className={`${priority === 'urgent' ? 'text-red-500' : 'text-orange-500'}`} />;
      case 'information':
        return <Info size={20} className="text-gray-500" />;
      default:
        return <Bell size={20} className="text-blue-500" />;
    }
  };
  
  // Format date for display
 const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today - show time
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Apply search filter
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notification.complaintId && notification.complaintId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply category filter
    if (filter === 'all') return matchesSearch;
    if (filter === 'unread') return !notification.read && matchesSearch;
    if (filter === 'urgent') return notification.priority === 'urgent' && matchesSearch;
    if (filter === 'updates') return (notification.type === 'status_update' || notification.type === 'response') && matchesSearch;
    
    return matchesSearch;
  });
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // MessageCircle component is not in lucide-react import, so creating a custom one
interface MessageCircleProps {
  size: number | string;       // size can be a number (pixels) or string (e.g. '24px', '2em')
  className?: string;          // optional className
}

const MessageCircle: React.FC<MessageCircleProps> = ({ size, className }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  </div>
);
  
  return (
    <div className="max-w-full mx-auto p-4 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Bell className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            <p className="text-gray-600">Stay updated on your complaint status and responses</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={handleRefresh} 
            className="p-2 rounded-full hover:bg-gray-100 mr-2"
            aria-label="Refresh notifications"
          >
            <RefreshCw size={20} className={`text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Notification settings"
          >
            <Settings size={20} className="text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="flex items-center text-sm text-gray-500 mr-2">
            <Filter size={16} className="mr-1" />
            <span>Filter:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('unread')} 
              className={`px-3 py-1 text-sm rounded-full flex items-center ${filter === 'unread' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setFilter('updates')} 
              className={`px-3 py-1 text-sm rounded-full ${filter === 'updates' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              Updates
            </button>
            <button 
              onClick={() => setFilter('urgent')} 
              className={`px-3 py-1 text-sm rounded-full ${filter === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
            >
              Urgent
            </button>
          </div>
        </div>
      </div>
      
      {/* Notifications list */}
      <div className="space-y-3">
        {isLoading ? (
          // Loading state
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          // Empty state
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Bell size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No notifications found</h3>
            <p className="text-gray-500 mt-1">
              {searchQuery ? 'Try a different search term' : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          // Notifications
          filteredNotifications.map(notification => (
            <div 
              key={notification.id}
              className={`border rounded-lg ${notification.read ? 'bg-white' : 'bg-blue-50'} ${notification.priority === 'urgent' ? 'border-l-4 border-l-red-500' : ''}`}
              onClick={() => {
                if (!notification.read) markAsRead(notification.id);
                toggleExpand(notification.id);
              }}
            >
              <div className="p-4 cursor-pointer flex items-start">
                <div className="mr-3 mt-1">
                  {getNotificationIcon(notification.type, notification.priority)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center ml-2 text-xs text-gray-500">
                      <Clock size={14} className="mr-1" />
                      {formatDate(notification.date)}
                    </div>
                  </div>
                  
                  <div className="mt-1">
                    {notification.complaintId && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mr-2">
                        {notification.complaintId}
                      </span>
                    )}
                    {notification.agency && (
                      <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                        {notification.agency}
                      </span>
                    )}
                    {notification.priority === 'urgent' && (
                      <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded ml-2">
                        Urgent
                      </span>
                    )}
                  </div>
                  
                  <p className={`mt-2 text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                    {expandedIds.includes(notification.id) 
                      ? notification.message 
                      : `${notification.message.substring(0, 100)}${notification.message.length > 100 ? '...' : ''}`}
                  </p>
                  
                  <div className="mt-1 flex justify-between items-center">
                    <div className="flex space-x-2 mt-2">
                      {expandedIds.includes(notification.id) && notification.actions.map(action => (
                        <button
                          key={action.label}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(action.action, action.id);
                          }}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(notification.id);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {expandedIds.includes(notification.id) ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Additional information */}
      {!isLoading && filteredNotifications.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Showing {filteredNotifications.length} of {notifications.length} notifications</p>
        </div>
      )}
    </div>
  );
}