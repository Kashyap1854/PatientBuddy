import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, ChevronRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useFileContext } from "../contexts/FileContext";

const CATEGORY_COLORS: Record<string, string> = {
  Diagnosis: "bg-red-100 text-red-700",
  Prescription: "bg-green-100 text-green-700",
  Lab: "bg-blue-100 text-blue-700",
  Imaging: "bg-purple-100 text-purple-700",
  Uncategorized: "bg-gray-100 text-gray-700",
};

const FREQUENT_CATEGORIES = [
  "Diagnosis",
  "Prescription",
  "Lab",
  "Imaging",
  "Uncategorized",
];

type UploadFile = {
  file: File;
  id: string;
  category: string;
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const firstName = currentUser?.name.split(" ")[0] || "User";
  const { files, setFiles } = useFileContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadQueue, setUploadQueue] = useState<UploadFile[]>([]);
  const [recentCategories, setRecentCategories] = useState<string[]>([]);

  // Load recent categories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentCategories");
    if (saved) setRecentCategories(JSON.parse(saved));
  }, []);

  // Save recent categories to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("recentCategories", JSON.stringify(recentCategories));
  }, [recentCategories]);

  // When user selects files, add to upload queue with empty category
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newQueueFiles = selectedFiles.map((file) => ({
      file,
      id: crypto.randomUUID(),
      category: "",
    }));
    setUploadQueue((prev) => [...prev, ...newQueueFiles]);
    e.target.value = ""; // reset input
  };

  // Update category for a file in upload queue
  const updateCategory = (id: string, category: string) => {
    setUploadQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, category } : item))
    );
  };

  // Upload all files with validation: category required
  const handleUpload = () => {
    // Check if all categories are filled
    if (uploadQueue.some((f) => !f.category.trim())) {
      alert("Please select a category for all files before uploading.");
      return;
    }

    // Add uploaded files to global files context
    const uploaded = uploadQueue.map(({ file, category }) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type.split("/")[1]?.toUpperCase() || "FILE",
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      date: new Date().toISOString(),
      category,
      tags: [],
    }));

    setFiles([...files, ...uploaded]);
    setUploadQueue([]);

    // Update recent categories list, keep unique and max 10
    const newCategories = [
      ...recentCategories,
      ...uploadQueue.map((f) => f.category),
    ]
      .filter((c, i, arr) => c && arr.indexOf(c) === i)
      .slice(-10);
    setRecentCategories(newCategories);
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

        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={handleFilesSelected}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
          >
            Select Files
          </button>
        </div>
      </div>

      {/* Upload Queue with category selector */}
      {uploadQueue.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Files to Upload</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {uploadQueue.map(({ id, file, category }) => (
              <div
                key={id}
                className="flex items-center justify-between border border-gray-200 rounded p-2"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-gray-600" size={18} />
                  <span className="font-medium">{file.name}</span>
                </div>

                <select
                  value={category}
                  onChange={(e) => updateCategory(id, e.target.value)}
                  className="rounded border border-gray-300 px-2 py-1"
                >
                  <option value="">Select Category</option>
                  {FREQUENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  {recentCategories
                    .filter((c) => !FREQUENT_CATEGORIES.includes(c))
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            className="mt-4 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition"
          >
            Upload All
          </button>
        </div>
      )}

      {/* Summary cards with category counts */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {[...new Set(files.map((f) => f.category || "Uncategorized"))].map(
          (category) => {
            const count = files.filter((f) => f.category === category).length;
            const colorClass =
              CATEGORY_COLORS[category] || CATEGORY_COLORS["Uncategorized"];
            return (
              <div
                key={category}
                className={`p-4 rounded shadow-sm flex flex-col items-center justify-center ${colorClass}`}
              >
                <div className="text-lg font-bold">{count}</div>
                <div className="text-sm mt-1">{category}</div>
              </div>
            );
          }
        )}
      </div>

      {/* Recent uploads table */}
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
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          CATEGORY_COLORS[file.category] ||
                          CATEGORY_COLORS["Uncategorized"]
                        }`}
                      >
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
    </div>
  );
}
