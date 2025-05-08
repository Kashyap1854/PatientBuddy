import React, { useState } from "react";
import {
  FolderOpen,
  FileText,
  Filter,
  UploadCloud,
  PlusCircle,
  Search,
  Calendar,
  Grid,
  List,
  MoreHorizontal,
  Download,
  Trash2,
  Share,
  FileEdit,
  X,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useToast } from "../contexts/ToastContext";

// Mock data
const mockFolders = [
  { id: "1", name: "Prescriptions", count: 6 },
  { id: "2", name: "Lab Results", count: 8 },
  { id: "3", name: "Imaging", count: 4 },
  { id: "4", name: "Hospital Records", count: 3 },
];

const mockFiles = [
  {
    id: "1",
    name: "Blood Test Results.pdf",
    type: "PDF",
    size: "2.4 MB",
    date: "2025-04-01",
    category: "Lab Results",
    tags: ["blood work", "important"],
  },
  {
    id: "2",
    name: "Antibiotic Prescription.pdf",
    type: "PDF",
    size: "1.2 MB",
    date: "2025-03-28",
    category: "Prescriptions",
    tags: ["medication"],
  },
  {
    id: "3",
    name: "MRI Scan Report.pdf",
    type: "PDF",
    size: "5.8 MB",
    date: "2025-03-15",
    category: "Imaging",
    tags: ["scan", "important"],
  },
  {
    id: "4",
    name: "Dental X-Ray.jpg",
    type: "JPG",
    size: "3.1 MB",
    date: "2025-03-10",
    category: "Imaging",
    tags: ["dental", "x-ray"],
  },
  {
    id: "5",
    name: "Cholesterol Report.pdf",
    type: "PDF",
    size: "0.8 MB",
    date: "2025-03-05",
    category: "Lab Results",
    tags: ["cholesterol"],
  },
  {
    id: "6",
    name: "Vaccination Record.pdf",
    type: "PDF",
    size: "1.5 MB",
    date: "2025-02-20",
    category: "Hospital Records",
    tags: ["vaccination"],
  },
];

interface DropdownProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose}></div>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
        {children}
      </div>
    </>
  );
};

type ViewMode = "grid" | "list";

export default function Files() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { showToast } = useToast();

  const filteredFiles = mockFiles.filter((file) => {
    // Filter by search term
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Filter by selected folder
    const matchesFolder =
      selectedFolder === "all" ||
      file.category === mockFolders.find((f) => f.id === selectedFolder)?.name;

    return matchesSearch && matchesFolder;
  });

  const handleFileDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleUpload = () => {
    setIsUploadModalOpen(true);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Handle files here
      showToast(`Uploaded ${e.dataTransfer.files.length} files`, "success");
      setIsUploadModalOpen(false);
    }
  };

  const handleFileAction = (action: string, fileId: string) => {
    const file = mockFiles.find((f) => f.id === fileId);

    switch (action) {
      case "download":
        showToast(`Downloading ${file?.name}`, "info");
        break;
      case "delete":
        showToast(`Deleted ${file?.name}`, "success");
        break;
      case "share":
        showToast(`Sharing options for ${file?.name}`, "info");
        break;
      case "rename":
        showToast(`Rename ${file?.name}`, "info");
        break;
    }

    setActiveDropdown(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            My Medical Records
          </h1>
          <p className="text-gray-600">
            Manage all your prescriptions and medical documents
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex gap-3">
          <Button
            variant="primary"
            leftIcon={<UploadCloud size={18} />}
            onClick={handleUpload}
          >
            Upload
          </Button>
          <Button variant="outline" leftIcon={<PlusCircle size={18} />}>
            New Folder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="mb-4">
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={18} className="text-gray-400" />}
              />
            </div>

            <h3 className="font-medium text-gray-800 mb-2">Categories</h3>
            <ul className="space-y-1">
              <li>
                <button
                  className={`w-full flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 ${
                    selectedFolder === "all"
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700"
                  }`}
                  onClick={() => setSelectedFolder("all")}
                >
                  <FolderOpen
                    size={18}
                    className={`mr-2 ${
                      selectedFolder === "all"
                        ? "text-primary-500"
                        : "text-gray-400"
                    }`}
                  />
                  <span>All Records</span>
                  <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {mockFiles.length}
                  </span>
                </button>
              </li>

              {mockFolders.map((folder) => (
                <li key={folder.id}>
                  <button
                    className={`w-full flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 ${
                      selectedFolder === folder.id
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700"
                    }`}
                    onClick={() => setSelectedFolder(folder.id)}
                  >
                    <FolderOpen
                      size={18}
                      className={`mr-2 ${
                        selectedFolder === folder.id
                          ? "text-primary-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span>{folder.name}</span>
                    <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {folder.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h3 className="font-medium text-gray-800 mb-2">Filters</h3>
              <div className="space-y-2">
                <button className="flex items-center w-full rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Calendar size={18} className="mr-2 text-gray-400" />
                  <span>Last 30 days</span>
                </button>
                <button className="flex items-center w-full rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Filter size={18} className="mr-2 text-gray-400" />
                  <span>Important</span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-1">Storage</h3>
                <p className="text-xs text-gray-500 mb-2">
                  5.4 GB of 15 GB used
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: "36%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-4">
            {/* View controls */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                {filteredFiles.length} items
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className={`p-2 rounded-md ${
                    viewMode === "grid"
                      ? "bg-gray-100 text-gray-800"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`p-2 rounded-md ${
                    viewMode === "list"
                      ? "bg-gray-100 text-gray-800"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Files list */}
            {viewMode === "list" ? (
              // List view
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFiles.map((file) => (
                      <tr
                        key={file.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText
                              size={18}
                              className="text-gray-400 mr-2"
                            />
                            <span className="text-sm text-gray-900">
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {file.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(file.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {file.size}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium relative">
                          <button
                            onClick={() => handleFileDropdown(file.id)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          <Dropdown
                            isOpen={activeDropdown === file.id}
                            onClose={() => setActiveDropdown(null)}
                          >
                            <button
                              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() =>
                                handleFileAction("download", file.id)
                              }
                            >
                              <Download size={16} className="mr-2" />
                              Download
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() => handleFileAction("share", file.id)}
                            >
                              <Share size={16} className="mr-2" />
                              Share
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() =>
                                handleFileAction("rename", file.id)
                              }
                            >
                              <FileEdit size={16} className="mr-2" />
                              Rename
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-left text-error-600 hover:bg-gray-100 flex items-center"
                              onClick={() =>
                                handleFileAction("delete", file.id)
                              }
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </button>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Grid view
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="bg-gray-50 p-4 flex items-center justify-center">
                      <FileText size={40} className="text-gray-400" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3
                          className="text-sm font-medium text-gray-900 truncate"
                          title={file.name}
                        >
                          {file.name}
                        </h3>
                        <div className="relative">
                          <button
                            onClick={() => handleFileDropdown(file.id)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          <Dropdown
                            isOpen={activeDropdown === file.id}
                            onClose={() => setActiveDropdown(null)}
                          >
                            <button
                              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() =>
                                handleFileAction("download", file.id)
                              }
                            >
                              <Download size={16} className="mr-2" />
                              Download
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() => handleFileAction("share", file.id)}
                            >
                              <Share size={16} className="mr-2" />
                              Share
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() =>
                                handleFileAction("rename", file.id)
                              }
                            >
                              <FileEdit size={16} className="mr-2" />
                              Rename
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-left text-error-600 hover:bg-gray-100 flex items-center"
                              onClick={() =>
                                handleFileAction("delete", file.id)
                              }
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </button>
                          </Dropdown>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span className="truncate">{file.category}</span>
                        <span className="mx-1">•</span>
                        <span>{file.size}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {file.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredFiles.length === 0 && (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No files found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Try a different search term or filter"
                    : "Upload your first medical record"}
                </p>
                <Button
                  variant="primary"
                  leftIcon={<UploadCloud size={18} />}
                  onClick={handleUpload}
                >
                  Upload Files
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Upload Files
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
                    ? "Drop your files here"
                    : "Drag and drop your files here"}
                </h3>
                <p className="text-gray-500 mb-4">
                  or click to browse your files
                </p>

                <input
                  type="file"
                  id="fileUpload"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      showToast(
                        `Selected ${e.target.files.length} files`,
                        "success"
                      );
                    }
                  }}
                />
                <label htmlFor="fileUpload">
                  <Button
                    variant="outline"
                    leftIcon={<UploadCloud size={18} />}
                    type="button"
                  >
                    Browse Files
                  </Button>
                </label>

                <p className="mt-2 text-xs text-gray-500">
                  Supports PDF, JPEG, PNG (max. 20MB)
                </p>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    showToast("Upload completed successfully", "success");
                    setIsUploadModalOpen(false);
                  }}
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
