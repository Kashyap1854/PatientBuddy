import React, { useState, useRef } from "react";
import {
  FolderOpen,
  FileText,
  PlusCircle,
  Search,
  Grid,
  List,
  Trash2,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { useToast } from "../contexts/ToastContext";
import { useFileContext } from "../contexts/FileContext";

type ViewMode = "grid" | "list";

export default function Files() {
  const { files, setFiles } = useFileContext();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // For upload + category modal
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [newCategory, setNewCategory] = useState("");

  // Filtered view
  const filteredFiles = files.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ["all", ...new Set(files.map((f) => f.category))];

  const handleDelete = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
    showToast("File deleted", "success");
  };

  // Trigger file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // When user selects a file
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setFileToUpload(file);
      setIsModalOpen(true);
    }
    // reset input so selecting same file twice works
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Confirm category + add to context
  const handleCategorySelection = () => {
    if (!fileToUpload) return;
    if (!newCategory.trim()) {
      showToast("Please select or enter a category", "error");
      return;
    }

    const newFile = {
      id: crypto.randomUUID(),
      name: fileToUpload.name,
      category: newCategory.trim(),
      size: `${(fileToUpload.size / 1024).toFixed(2)} KB`,
      date: new Date().toISOString(),
      tags: [] as string[],
    };

    setFiles((prev) => [...prev, newFile]);
    showToast("File uploaded successfully", "success");
    // cleanup
    setIsModalOpen(false);
    setFileToUpload(null);
    setNewCategory("");
  };

  return (
    <div className="animate-fade-in">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={onFileChange}
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            My Medical Records
          </h1>
          <p className="text-gray-600">
            Manage all your prescriptions and medical documents
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button
            variant="outline"
            leftIcon={<PlusCircle size={18} />}
            onClick={openFileDialog}
          >
            Upload File
          </Button>
        </div>
      </div>

      {/* Category-selection Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Select Category</h2>
            <select
              className="w-full border rounded p-2 mb-4"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              <option value="">— Choose Existing —</option>
              {uniqueCategories
                .filter((c) => c !== "all")
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
            <p className="text-sm text-gray-500 mb-2">Or enter new:</p>
            <input
              type="text"
              className="w-full border rounded p-2 mb-4"
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setNewCategory("");
                  setFileToUpload(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCategorySelection}>Upload</Button>
            </div>
          </div>
        </Modal>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={18} className="text-gray-400" />}
            />

            <h3 className="font-medium text-gray-800 mt-6 mb-2">Categories</h3>
            <ul className="space-y-1">
              {uniqueCategories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`w-full flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 ${
                      selectedCategory === cat
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <FolderOpen
                      size={18}
                      className={`mr-2 ${
                        selectedCategory === cat
                          ? "text-primary-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span>{cat === "all" ? "All Records" : cat}</span>
                    <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {cat === "all"
                        ? files.length
                        : files.filter((f) => f.category === cat).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Files List/Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-4">
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

            {filteredFiles.length > 0 ? (
              viewMode === "list" ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      {["Name", "Category", "Date", "Size", ""].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFiles.map((f) => (
                      <tr key={f.id}>
                        <td className="px-4 py-3">{f.name}</td>
                        <td className="px-4 py-3">{f.category}</td>
                        <td className="px-4 py-3">
                          {new Date(f.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">{f.size}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDelete(f.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFiles.map((f) => (
                    <div key={f.id} className="file-card">
                      <div className="flex justify-between items-center">
                        <FileText size={20} />
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <h4 className="mt-2 text-sm font-semibold">{f.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{f.category}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(f.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12 text-gray-500">
                No files found. Upload from above to view here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
