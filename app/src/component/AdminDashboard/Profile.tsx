import { useState, useEffect } from 'react';
import { Save, User, Phone, MapPin, Mail, Building, AlertCircle } from 'lucide-react';

export default function ProfileComponent() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    preferredAgencies: [],
    notifications: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Available government agencies for selection
  const agencies = [
    "Municipal Services",
    "Water Department",
    "Electricity Board",
    "Roads & Transport",
    "Waste Management",
    "Public Health",
    "Education Department"
  ];
  
  // Load existing profile data if available
  useEffect(() => {
    const savedProfile = localStorage.getItem('citizenProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'notifications') {
        setProfile(prev => ({ ...prev, [name]: checked }));
      } else {
        // Handle multi-select checkboxes for agencies
        const updatedAgencies = [...profile.preferredAgencies];
        if (checked) {
          updatedAgencies.push(value);
        } else {
          const index = updatedAgencies.indexOf(value);
          if (index > -1) {
            updatedAgencies.splice(index, 1);
          }
        }
        setProfile(prev => ({ ...prev, preferredAgencies: updatedAgencies }));
      }
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field if any
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!profile.firstName.trim()) newErrors.firstName = "First name is required";
    if (!profile.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!profile.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!profile.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(profile.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (!profile.address.trim()) newErrors.address = "Address is required";
    if (!profile.city.trim()) newErrors.city = "City is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSaving(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        // Save to localStorage for demo purposes
        localStorage.setItem('citizenProfile', JSON.stringify(profile));
        
        setIsSaving(false);
        setSaveSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }, 800);
    }
  };
  
  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <User className="text-blue-600" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
          <p className="text-gray-600">Manage your citizen account information</p>
        </div>
      </div>
      
      {saveSuccess && (
        <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
          <div className="mr-2">✓</div>
          <div>Profile saved successfully!</div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="firstName">
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="lastName">
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                <div className="flex items-center">
                  <Mail size={16} className="mr-1" />
                  Email Address*
                </div>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="phone">
                <div className="flex items-center">
                  <Phone size={16} className="mr-1" />
                  Phone Number*
                </div>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="e.g., 9876543210"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            <div className="flex items-center">
              <MapPin size={18} className="mr-2" />
              Address Information
            </div>
          </h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="address">
              Street Address*
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="city">
                City*
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={profile.city}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="district">
                District/State
              </label>
              <input
                type="text"
                id="district"
                name="district"
                value={profile.district}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            <div className="flex items-center">
              <Building size={18} className="mr-2" />
              Preferences
            </div>
          </h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Agencies of Interest (Select all that apply)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {agencies.map(agency => (
                <div key={agency} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`agency-${agency}`}
                    name="preferredAgencies"
                    value={agency}
                    checked={profile.preferredAgencies.includes(agency)}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={`agency-${agency}`} className="text-sm text-gray-700">
                    {agency}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifications"
              name="notifications"
              checked={profile.notifications}
              onChange={handleChange}
              className="mr-2 h-4 w-4 text-blue-600"
            />
            <label htmlFor="notifications" className="text-sm text-gray-700">
              Receive email notifications about complaint updates
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 flex items-center">
            <AlertCircle size={16} className="mr-1" />
            Fields marked with * are mandatory
          </div>
          
          <button
            type="submit"
            disabled={isSaving}
            className={`px-4 py-2 rounded-md text-white flex items-center ${
              isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Save size={18} className="mr-1" />
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}