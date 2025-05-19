"use client"
import { Role } from '@/app/generated/prisma';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  district?: string;
  role: Role;
  agencyId?: string | null;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  role: Role;
  agencyId?: string | null;
}

interface Agency {
  id: string;
  name: string;
}

export default function UserUpdateForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    role: Role.CITIZEN,
    agencyId: null,
  });

  // Fetch users and agencies on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users
        const usersResponse = await fetch('http://localhost:3000/api/admin/view_user');
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
        setFilteredUsers(usersData.users || []);
        
        // Fetch agencies
        const agenciesResponse = await fetch("http://localhost:3000/api/admin/agency/agencycategories");
        if (!agenciesResponse.ok) {
          throw new Error('Failed to fetch agencies');
        }
        const agenciesData = await agenciesResponse.json();
        setAgencies(agenciesData.agencies || []);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Handle selecting a user to edit
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setProfile({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      district: user.district || '',
      role: user.role || Role.CITIZEN,
      agencyId: user.agencyId || null
    });
    setSuccess(false);
    setError(null);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Reset agencyId when role changes from AGENCY_STAFF to something else
    if (name === 'role' && value !== Role.AGENCY_STAFF && profile.agencyId) {
      setProfile(prevProfile => ({
        ...prevProfile,
        [name]: value,
        agencyId: null
      }));
      return;
    }
    
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  // Handle agency selection change
  const handleAgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      agencyId: value || null
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    // Validate agency selection for AGENCY_STAFF role
    if (profile.role === Role.AGENCY_STAFF && !profile.agencyId) {
      setError('Please select an agency for agency staff');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/citizen/account/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedUser.id,
          ...profile,
          // Only include agencyId if role is AGENCY_STAFF
          agencyId: profile.role === Role.AGENCY_STAFF ? profile.agencyId : null
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      
      // Update the local user list with the updated user
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...user, ...profile } : user
      );
      setUsers(updatedUsers);
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User List */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow">
          <div className="mb-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
            </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div 
                  key={user.id}
                  className={`p-3 mb-2 rounded cursor-pointer transition ${
                    selectedUser?.id === user.id 
                      ? 'bg-blue-100 border-l-4 border-blue-500' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="text-xs text-gray-500">Role: {user.role}</div>
                  {user.role === Role.AGENCY_STAFF && user.agencyId && (
                    <div className="text-xs text-gray-500">
                      Agency: {agencies.find(a => a.id === user.agencyId)?.name || 'Unknown'}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No users found matching your search
              </div>
            )}
          </div>
        </div>
        
        {/* Edit Form */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {selectedUser ? `Edit User: ${selectedUser.firstName} ${selectedUser.lastName}` : 'Select a user to edit'}
          </h2>
          
          {selectedUser ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role*</label>
                  <select
                    name="role"
                    value={profile.role}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {Object.values(Role).map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                {profile.role === Role.AGENCY_STAFF && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agency*</label>
                    <select
                      name="agencyId"
                      value={profile.agencyId || ''}
                      onChange={handleAgencyChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={profile.role === Role.AGENCY_STAFF}
                    >
                      <option value="">Select an agency</option>
                      {agencies.map((agency) => (
                        <option key={agency.id} value={agency.id}>{agency.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <input
                    type="text"
                    name="district"
                    value={profile.district}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded">
                  Error: {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 bg-green-50 text-green-700 rounded">
                  User information updated successfully!
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {loading ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-gray-500 text-center py-12">
              Please select a user from the list to edit their information
            </div>
          )}
        </div>
      </div>
    </div>
  );
}