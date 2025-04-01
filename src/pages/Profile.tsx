
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, MapPin, ClipboardList, Settings, Loader2 } from 'lucide-react';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  phoneNumber: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'processing' | 'delivered' | 'cancelled';
  total: number;
}

// Mock data
const addresses: Address[] = [
  {
    id: '1',
    name: 'Home',
    street: '123 Main Street',
    city: 'Lagos',
    state: 'Lagos State',
    phoneNumber: '+234 123 4567 890',
    isDefault: true
  },
  {
    id: '2',
    name: 'Office',
    street: '456 Business Avenue',
    city: 'Lagos',
    state: 'Lagos State',
    phoneNumber: '+234 987 6543 210',
    isDefault: false
  }
];

const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'MCK123456',
    date: '2023-06-10',
    status: 'delivered',
    total: 25000
  },
  {
    id: '2',
    orderNumber: 'MCK789012',
    date: '2023-06-15',
    status: 'processing',
    total: 18500
  },
  {
    id: '3',
    orderNumber: 'MCK345678',
    date: '2023-06-20',
    status: 'cancelled',
    total: 9000
  }
];

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout, profile } = useAuth();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');
  const [updating, setUpdating] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '+234 123 4567 890'
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setUpdating(false);
      // In a real app, this would update the user context
    }, 1000);
  };

  // Render different tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            
            <form onSubmit={handleUpdateProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mondoBlue"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mondoBlue bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mondoBlue"
                  placeholder="e.g., +234 123 4567 890"
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-mondoBlue hover:bg-blue-700"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Account Security</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center justify-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                  onClick={logout}
                >
                  Log out
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'addresses':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Addresses</h2>
              <Button className="bg-mondoBlue hover:bg-blue-700">
                <MapPin className="mr-2 h-4 w-4" />
                Add New Address
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(address => (
                <div 
                  key={address.id} 
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{address.name}</h3>
                        {address.isDefault && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-600 py-0.5 px-2 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mt-1">{address.street}</p>
                      <p className="text-gray-700">{address.city}, {address.state}</p>
                      <p className="text-gray-700 mt-1">{address.phoneNumber}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button className="text-sm text-mondoBlue hover:underline">Edit</button>
                      <button className="text-sm text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                  
                  {!address.isDefault && (
                    <button className="mt-4 text-sm text-mondoBlue hover:underline">
                      Set as Default
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'orders':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'delivered' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₦{order.total.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <a href="#" className="text-mondoBlue hover:underline">View Details</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 bg-gray-50 p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-mondoBlue flex items-center justify-center text-white">
                <User className="h-6 w-6" />
              </div>
              <div className="ml-3">
                <p className="font-medium">{profile?.full_name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-mondoBlue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="mr-3 h-5 w-5" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'addresses'
                    ? 'bg-mondoBlue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MapPin className="mr-3 h-5 w-5" />
                Addresses
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'orders'
                    ? 'bg-mondoBlue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ClipboardList className="mr-3 h-5 w-5" />
                Orders
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
