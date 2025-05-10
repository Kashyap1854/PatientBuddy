import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  UploadCloud,
  Calendar,
  Clock,
  PlusCircle,
  Search,
  ChevronRight,
  MessageSquare,
  X,
} from "lucide-react";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import { useFiles } from "../contexts/FileContext";
import { useToast } from "../contexts/ToastContext";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { files, uploadFile } = useFiles();
  const { showToast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const firstName = currentUser?.name.split(" ")[0] || "User";

  // Demo data for recent uploads and appointments
  const recentUploads = [
    {
      id: 1,
      name: "Blood Test Results.pdf",
      date: "2025-03-15",
      type: "Lab Result",
    },
    {
      id: 2,
      name: "Prescription - Antibiotics.pdf",
      date: "2025-03-10",
      type: "Prescription",
    },
    { id: 3, name: "MRI Scan Report.pdf", date: "2025-03-01", type: "Imaging" },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2025-04-10",
      time: "10:00 AM",
      location: "Heart Care Center",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "2025-04-15",
      time: "2:30 PM",
      location: "City Skin Clinic",
    },
  ];

  // Health stats demo data
  const healthStats = [
    { label: "Blood Pressure", value: "120/80", date: "2025-03-15" },
    { label: "Heart Rate", value: "72 bpm", date: "2025-03-15" },
    { label: "Blood Glucose", value: "95 mg/dL", date: "2025-03-10" },
    { label: "Weight", value: "68 kg", date: "2025-03-05" },
  ];

  const handleFileUpload = async (file: File) => {
    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      showToast("File size exceeds 20MB limit", "error");
      return;
    }

    try {
      await uploadFile(file);
      setIsUploadModalOpen(false);
    } catch (error) {
      showToast("Failed to upload file", "error");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleFileUpload(file);
    }
  };

  // Get recent uploads from files context
  const recentUploadsFromContext = files
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="animate-fade-in pb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome back, {firstName}
          </h1>
          <p className="text-gray-600">
            Here's an overview of your health records
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <Button 
            variant="primary" 
            leftIcon={<UploadCloud size={18} />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Records
          </Button>
          <Button variant="outline" leftIcon={<Search size={18} />}>
            Search Records
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Upload Medical Record
                </h2>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <UploadCloud
                  size={40}
                  className={`mx-auto mb-4 ${
                    dragActive ? "text-primary-500" : "text-gray-400"
                  }`}
                />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {dragActive
                    ? "Drop your file here"
                    : "Drag and drop your file here"}
                </h3>
                <p className="text-gray-500 mb-4">
                  or click to browse your files
                </p>

                <input
                  type="file"
                  id="fileUpload"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <label
                  htmlFor="fileUpload"
                  className="inline-block border px-4 py-2 rounded cursor-pointer bg-white hover:bg-gray-100"
                >
                  Browse Files
                </label>

                <p className="mt-2 text-xs text-gray-500">
                  Supports PDF, JPEG, PNG (max. 20MB)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary-500">
              <div className="flex items-center">
                <div className="bg-primary-100 p-2 rounded">
                  <FileText className="text-primary-500" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Total Records</p>
                  <p className="text-xl font-semibold">24</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-secondary-500">
              <div className="flex items-center">
                <div className="bg-secondary-100 p-2 rounded">
                  <Calendar className="text-secondary-500" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Appointments</p>
                  <p className="text-xl font-semibold">2</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-accent-500">
              <div className="flex items-center">
                <div className="bg-accent-100 p-2 rounded">
                  <Clock className="text-accent-500" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Last Upload</p>
                  <p className="text-xl font-semibold">2 days ago</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-warning-500">
              <div className="flex items-center">
                <div className="bg-warning-100 p-2 rounded">
                  <Calendar className="text-warning-500" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Reminders</p>
                  <p className="text-xl font-semibold">3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Medical Records
              </h2>
              <Link
                to="/files"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
              >
                View All
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Added
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentUploadsFromContext.map((file) => (
                      <tr
                        key={file.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText
                              size={18}
                              className="text-gray-500 mr-2"
                            />
                            <span className="text-sm text-gray-900">
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {file.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(file.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Health Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Health Statistics
              </h2>
              <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                Update Stats
                <PlusCircle size={16} className="ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {healthStats.map((stat, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {new Date(stat.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Upcoming Appointments
              </h2>
              <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                Add New
                <PlusCircle size={16} className="ml-1" />
              </button>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="border border-gray-200 rounded-md p-4 hover:border-primary-200 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {appt.doctor}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {appt.specialty}
                        </p>
                      </div>
                      <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full font-medium">
                        Upcoming
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <div className="flex items-center mt-1">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <span>{new Date(appt.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock size={16} className="text-gray-400 mr-2" />
                        <span>{appt.time}</span>
                      </div>
                      <div className="mt-2 text-right">
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No upcoming appointments</p>
                <Button size="sm" variant="primary" className="mt-2">
                  Schedule Appointment
                </Button>
              </div>
            )}
          </div>

          {/* AI Assistant */}
          <div className="bg-white rounded-lg shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100 rounded-bl-full -mt-6 -mr-6 opacity-50"></div>

            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              AI Health Assistant
            </h2>
            <p className="text-gray-600 mb-4">
              Got questions about your health records or medical terminology?
              Ask our AI assistant.
            </p>

            <Link to="/chatbot">
              <Button
                variant="primary"
                fullWidth
                leftIcon={<MessageSquare size={18} />}
              >
                Chat with AI Assistant
              </Button>
            </Link>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-sm p-6 text-white">
            <h2 className="text-lg font-semibold mb-3">
              Health Tip of the Day
            </h2>
            <p className="text-primary-50">
              Regular exercise can help reduce the risk of chronic conditions
              such as heart disease, type 2 diabetes, and depression. Aim for at
              least 30 minutes of moderate activity most days.
            </p>
            <button className="mt-4 text-sm font-medium flex items-center hover:underline">
              Read more tips
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
