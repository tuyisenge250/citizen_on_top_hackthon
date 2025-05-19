import { useState, useEffect, useCallback } from "react";
import { ChangeEvent } from 'react';
import { Plus, Edit, Trash, X, Save, CheckCircle } from "lucide-react";

  interface Category {
  id: string | number;
  name: string;
}

interface Agency {
  id: string ;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  categories?: Category[];
}
const url = process.env.NEXT_PUBLIC_BACKEND_URL!;


export default function AgencyManagement() {
const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
  });
  
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    agencyId: "",
  });

  const fetchAgencies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/api/admin/agency/agencycategories`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch agencies");
      }
      
      const data = await response.json();
      if (Array.isArray(data.agencies)) {
        setAgencies(data.agencies);
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (error: any) {
      showNotification(`Error: ${error.message}`, "error");
      setAgencies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgencies();
  }, [fetchAgencies]);

  const showNotification = (message: any, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      email: "",
      phone: "",
      address: "",
    });
  };




const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

  const handleCategoryFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setCategoryFormData(prev => ({ ...prev, [name]: value }));
};
  const validateForm = () => {
    if (!formData.name.trim()) {
      showNotification("Agency name is required", "error");
      return false;
    }
    return true;
  };

  const validateCategoryForm = () => {
    if (!categoryFormData.name.trim()) {
      showNotification("Category name is required", "error");
      return false;
    }
    if (!categoryFormData.agencyId) {
      showNotification("Agency ID is missing", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const url = isEditing && selectedAgency 
        ? `${url}/api/admin/agency/update`
        : `${url}/api/admin/agency/create`;
      
      const method = isEditing && selectedAgency ? "PUT" : "POST";
      
      const body = isEditing && selectedAgency
        ? JSON.stringify({
            id: selectedAgency.id,
            ...formData
          })
        : JSON.stringify(formData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to process agency");
      }
      
      showNotification(`Agency ${isEditing ? "updated" : "created"} successfully`);
      resetForm();
      setIsEditing(false);
      setSelectedAgency(null);
      await fetchAgencies();
    } catch (error: any) {
      showNotification(`Error: ${error.message}`, "error");
    }
  };

  const handleAddCategory = async () => {
    if (!validateCategoryForm()) return;

    try {
      const response = await fetch(`${url}/api/admin/categories/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryFormData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add category");
      }
      
      setCategoryFormData({ name: "", agencyId: "" });
      setShowAddCategoryModal(false);
      showNotification("Category added successfully");
      await fetchAgencies();
    } catch (error: any) {
      showNotification(`Error: ${error.message}`, "error");
    }
  };

  const handleEdit = (agency: any) => {
    if (!agency || !agency.id) return;
    
    setSelectedAgency(agency);
    setFormData({
      name: agency.name || "",
      description: agency.description || "",
      email: agency.email || "",
      phone: agency.phone || "",
      address: agency.address || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
    setSelectedAgency(null);
  };

  const prepareAddCategory = (agencyId: any) => {
    if (!agencyId) return;
    setCategoryFormData(prev => ({ ...prev, agencyId }));
    setShowAddCategoryModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Agency Management</h1>
      
      {notification.show && (
        <div className={`mb-4 p-3 rounded ${notification.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"} flex items-center`}>
          {notification.type === "error" ? 
            <X className="w-5 h-5 mr-2" /> : 
            <CheckCircle className="w-5 h-5 mr-2" />
          }
          {notification.message}
        </div>
      )}
      
      {/* Agency Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Agency" : "Add New Agency"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agency Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end gap-2">
          {isEditing && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
          
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            disabled={!formData.name.trim()}
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Update Agency" : "Save Agency"}
          </button>
        </div>
      </div>
      
      {/* Agencies List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Agencies</h2>
        
        {loading ? (
          <div className="text-center py-8">Loading agencies...</div>
        ) : !agencies || agencies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No agencies found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categories
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agencies.map((agency) => (
                  <tr key={agency.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{agency.name}</div>
                      <div className="text-sm text-gray-500">{agency.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {agency.email && (
                          <div>
                            <span className="font-medium">Email:</span> {agency.email}
                          </div>
                        )}
                        {agency.phone && (
                          <div>
                            <span className="font-medium">Phone:</span> {agency.phone}
                          </div>
                        )}
                        {agency.address && (
                          <div>
                            <span className="font-medium">Address:</span> {agency.address}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {agency.categories && agency.categories.length > 0 ? (
                          agency.categories.map((category) => (
                            <span
                              key={category.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {category.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No categories</span>
                        )}
                      </div>
                      <button
                        onClick={() => prepareAddCategory(agency.id)}
                        className="mt-2 flex items-center text-xs text-blue-600 hover:text-blue-800"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Category
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(agency)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Category</h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={categoryFormData.name}
                  onChange={handleCategoryFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={!categoryFormData.name.trim()}
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}