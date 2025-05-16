import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit, X } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function Profile() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);

  const initialForm = {
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "(555) 123-4567",
    address: "123 Medical St, Healthcare City, HC 12345",
    dob: "1985-06-15",
    gender: "Male",
    age: "39", // you could calculate from DOB, but here it's a field
    allergies: "Penicillin, Peanuts",
  };

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      setFormData(initialForm); // discard edits
    }
    setIsEditMode(!isEditMode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // call API, etc.
    showToast("Profile updated successfully", "success");
    setIsEditMode(false);
  };

  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <Button
          variant={isEditMode ? "outline" : "primary"}
          leftIcon={isEditMode ? <X size={18} /> : <Edit size={18} />}
          onClick={toggleEditMode}
        >
          {isEditMode ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-primary-500 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            Personal & Medical Info
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal */}
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditMode}
              leftIcon={<User size={18} />}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditMode}
              leftIcon={<Mail size={18} />}
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditMode}
              leftIcon={<Phone size={18} />}
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditMode}
              leftIcon={<MapPin size={18} />}
            />

            {/* Medical */}
            <Input
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              disabled={!isEditMode}
              leftIcon={<Calendar size={18} />}
            />
            <Input
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              disabled={!isEditMode}
            />
            <Input
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditMode}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allergies
              </label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                disabled={!isEditMode}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {isEditMode && (
            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
