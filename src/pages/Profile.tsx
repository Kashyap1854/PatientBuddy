import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  AlertCircle,
  Heart,
  Activity,
  Edit,
  X,
  PlusCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function Profile() {
  const { currentUser, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '(555) 123-4567',
    address: '123 Medical St, Healthcare City, HC 12345',
    dob: '1985-06-15',
    gender: 'Male',
    bloodType: 'O+',
    height: '175',
    weight: '70',
    allergies: 'Penicillin, Peanuts',
    medications: 'Lisinopril 10mg, Atorvastatin 20mg',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '(555) 987-6543',
    insurance: 'HealthCare Plus',
    insuranceId: 'HC1234567890',
  });
  
  // Medical history data
  const medicalHistory = [
    { id: 1, condition: 'Hypertension', diagnosedDate: '2020-03-15', status: 'Active' },
    { id: 2, condition: 'Type 2 Diabetes', diagnosedDate: '2019-07-22', status: 'Active' },
    { id: 3, condition: 'Appendectomy', diagnosedDate: '2015-11-10', status: 'Resolved' },
  ];
  
  // Immunization data
  const immunizations = [
    { id: 1, vaccine: 'Influenza', date: '2024-10-05', dueDate: '2025-10-05' },
    { id: 2, vaccine: 'Tetanus', date: '2020-05-18', dueDate: '2030-05-18' },
    { id: 3, vaccine: 'COVID-19', date: '2023-08-30', dueDate: '2024-08-30' },
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update the user data in AuthContext
    updateUser({
      name: formData.name,
      email: formData.email,
    });
    showToast('Profile updated successfully', 'success');
    setIsEditMode(false);
  };
  
  const toggleEditMode = () => {
    if (isEditMode) {
      // Discard changes
      setFormData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: '(555) 123-4567',
        address: '123 Medical St, Healthcare City, HC 12345',
        dob: '1985-06-15',
        gender: 'Male',
        bloodType: 'O+',
        height: '175',
        weight: '70',
        allergies: 'Penicillin, Peanuts',
        medications: 'Lisinopril 10mg, Atorvastatin 20mg',
        emergencyContact: 'Jane Doe',
        emergencyPhone: '(555) 987-6543',
        insurance: 'HealthCare Plus',
        insuranceId: 'HC1234567890',
      });
    }
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="animate-fade-in pb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <Button 
          variant={isEditMode ? 'outline' : 'primary'}
          leftIcon={isEditMode ? <X size={18} /> : <Edit size={18} />}
          onClick={toggleEditMode}
        >
          {isEditMode ? 'Cancel Editing' : 'Edit Profile'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-primary-500 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Personal Information</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center mb-6">
                <div className="sm:mr-6 mb-4 sm:mb-0">
                  <img
                    src={currentUser?.profilePicture || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{currentUser?.name}</h3>
                  <p className="text-gray-500">{currentUser?.email}</p>
                  <p className="text-gray-500 mt-1">Member since {new Date().getFullYear()}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  leftIcon={<User size={18} className="text-gray-500" />}
                />
                
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  leftIcon={<Mail size={18} className="text-gray-500" />}
                />
                
                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  leftIcon={<Phone size={18} className="text-gray-500" />}
                />
                
                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  leftIcon={<Calendar size={18} className="text-gray-500" />}
                />
                
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  leftIcon={<MapPin size={18} className="text-gray-500" />}
                />
                
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <Input
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={!isEditMode}
                    />
                  </div>
                  <div className="w-1/2">
                    <Input
                      label="Blood Type"
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      disabled={!isEditMode}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <Input
                      label="Height (cm)"
                      name="height"
                      type="number"
                      value={formData.height}
                      onChange={handleChange}
                      disabled={!isEditMode}
                    />
                  </div>
                  <div className="w-1/2">
                    <Input
                      label="Weight (kg)"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleChange}
                      disabled={!isEditMode}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Medical Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergies
                    </label>
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                      disabled={!isEditMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Medications
                    </label>
                    <textarea
                      name="medications"
                      value={formData.medications}
                      onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                      disabled={!isEditMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Emergency Contact</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Contact Name"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    disabled={!isEditMode}
                    leftIcon={<User size={18} className="text-gray-500" />}
                  />
                  
                  <Input
                    label="Contact Phone"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    disabled={!isEditMode}
                    leftIcon={<Phone size={18} className="text-gray-500" />}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Insurance Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Insurance Provider"
                    name="insurance"
                    value={formData.insurance}
                    onChange={handleChange}
                    disabled={!isEditMode}
                    leftIcon={<FileText size={18} className="text-gray-500" />}
                  />
                  
                  <Input
                    label="Insurance ID"
                    name="insuranceId"
                    value={formData.insuranceId}
                    onChange={handleChange}
                    disabled={!isEditMode}
                    leftIcon={<FileText size={18} className="text-gray-500" />}
                  />
                </div>
              </div>
              
              {isEditMode && (
                <div className="mt-6 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
        
        {/* Right column - Medical History */}
        <div className="space-y-6">
          {/* Quick Health Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary-500">
              <div className="flex items-center">
                <Heart className="text-primary-500 mr-2" size={24} />
                <div>
                  <p className="text-xs text-gray-500">Blood Pressure</p>
                  <p className="text-xl font-semibold">120/80</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-accent-500">
              <div className="flex items-center">
                <Activity className="text-accent-500 mr-2" size={24} />
                <div>
                  <p className="text-xs text-gray-500">Heart Rate</p>
                  <p className="text-xl font-semibold">72 bpm</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Medical History */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-secondary-500 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Medical History</h2>
            </div>
            
            <div className="p-4">
              {medicalHistory.length > 0 ? (
                <div className="space-y-3">
                  {medicalHistory.map((item) => (
                    <div key={item.id} className="p-3 border-b last:border-b-0">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.condition}</h4>
                          <p className="text-sm text-gray-500">
                            Diagnosed: {new Date(item.diagnosedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'Active' 
                            ? 'bg-warning-100 text-warning-800' 
                            : 'bg-success-100 text-success-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No medical history recorded</p>
                </div>
              )}
              
              <button className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                <PlusCircle size={16} className="mr-1" />
                Add Medical Condition
              </button>
            </div>
          </div>
          
          {/* Immunizations */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-accent-500 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Immunization Records</h2>
            </div>
            
            <div className="p-4">
              {immunizations.length > 0 ? (
                <div className="space-y-3">
                  {immunizations.map((item) => (
                    <div key={item.id} className="p-3 border-b last:border-b-0">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.vaccine}</h4>
                          <p className="text-sm text-gray-500">
                            Administered: {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Next dose</p>
                          <p className="text-sm font-medium">{new Date(item.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No immunization records</p>
                </div>
              )}
              
              <button className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                <PlusCircle size={16} className="mr-1" />
                Add Immunization Record
              </button>
            </div>
          </div>
          
          {/* Data Privacy Notice */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start">
              <AlertCircle className="text-secondary-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Your Data Privacy</h3>
                <p className="text-sm text-gray-600">
                  Your health information is protected by our privacy policy and applicable health information laws. We never share your data without consent.
                </p>
                <button className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View Privacy Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}