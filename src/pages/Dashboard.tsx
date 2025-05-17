import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useFileContext } from "../contexts/FileContext";
import axios from "axios";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const firstName = currentUser?.name.split(" ")[0] || "User";
  const { files, setFiles } = useFileContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<string>("");
  const [recentFiles, setRecentFiles] = useState<any[]>([]);

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

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/files")
      .then((res) => setRecentFiles((res.data as any[]).slice(0, 5))); // Show 5 most recent
  }, []);

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

        {recentFiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recentFiles.map((f) => (
              <div
                key={f._id}
                className="bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center"
              >
                <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded shadow mb-3">
                  {/* Plain rectangle, no image */}
                </div>
                {/* File Name */}
                <div className="font-medium text-center text-gray-800 text-sm truncate w-full">
                  {f.filename}
                </div>
                {/* Date */}
                <div className="text-xs text-gray-400 mb-2">
                  {new Date(f.uploadedAt).toLocaleDateString()}
                </div>
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 hover:underline text-xs"
                    onClick={() =>
                      window.open(
                        `http://localhost:5000/uploads/${encodeURIComponent(
                          f.filename
                        )}`,
                        "_blank"
                      )
                    }
                  >
                    Preview
                  </button>
                  {/* Add more actions here if needed */}
                </div>
              </div>
            ))}
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
