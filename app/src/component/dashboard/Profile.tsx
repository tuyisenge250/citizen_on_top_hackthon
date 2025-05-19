"use client"
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Save, User, Phone, MapPin, Mail, Building, AlertCircle } from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  preferredAgencies: string[];
  notifications: boolean;
}

interface ProfileErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  form?: string;
}

export default function ProfileComponent() {
  const [profile, setProfile] = useState<ProfileData>({
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
  
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  const agencies = [
    "Municipal Services",
    "Water Department",
    "Electricity Board",
    "Roads & Transport",
    "Waste Management",
    "Public Health",
    "Education Department"
  ];
  
  useEffect(() => {
    const fetchProfileData = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/citizen/account/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id})
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      
      const data = await response.json();
      if (data.success && data.user) {
        const userData = data.user;
        setProfile({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          district: userData.district || '',
          preferredAgencies: userData.preferredAgencies || [],
          notifications: userData.notifications !== undefined ? userData.notifications : true
        });
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrors({ form: error instanceof Error ? error.message : 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };
    const id = localStorage.getItem('citizenId');
  
    setUserId(id);
  
    if (id) {
      fetchProfileData(id);
    } else {
      setLoading(false);
      setErrors({ form: "User ID not found. Please log in again." });
    }
  }, []);

  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'notifications') {
        setProfile(prev => ({ ...prev, [name]: checked }));
      } else {
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
    
    // Clear error for this field if it exists
    if (errors[name as keyof ProfileErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ProfileErrors];
        return newErrors;
      });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: ProfileErrors = {};
    
    if (!profile.firstName.trim()) newErrors.firstName = "First name is required";
    if (!profile.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!profile.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
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
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setErrors({ form: "User not authenticated. Please log in again." });
      return;
    }
    
    if (!validate()) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const response = await fetch('http://localhost:3000/api/citizen/account/update', {
        method: 'PUt',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          district: profile.district
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-md flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
      
      {errors.form && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <AlertCircle size={16} className="mr-2" />
          <div>{errors.form}</div>
        </div>
      )}
      
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
              Receive email notifications about feedback updates
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