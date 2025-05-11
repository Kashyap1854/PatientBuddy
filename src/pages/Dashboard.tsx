import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ChevronRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useFileContext } from "../contexts/FileContext";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const firstName = currentUser?.name.split(" ")[0] || "User";
  const { files, setFiles } = useFileContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<string>("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = Array.from(e.target.files || []).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type.split("/")[1]?.toUpperCase() || "FILE",
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      date: new Date().toISOString(),
      category: category || "Uncategorized", // Use the provided category or default to 'Uncategorized'
      tags: [],
    }));
    setFiles([...files, ...uploaded]);
    setCategory(""); // Clear category after upload
  };

  const recentUploads = [...files].reverse().slice(0, 5);

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
          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Category input before uploading 
      <div className="mb-6">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <input
          id="category"
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter Category (e.g., Diagnosis)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div> */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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

        {recentUploads.length > 0 ? (
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
                {recentUploads.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText size={18} className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-900">
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {file.category}
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
        ) : (
          <p className="text-gray-500">
            No uploads yet. Start by uploading a file.
          </p>
        )}
      </div>

      {/* You can keep the rest of appointments, health tips, and assistant UI unchanged */}
    </div>
  );
}
