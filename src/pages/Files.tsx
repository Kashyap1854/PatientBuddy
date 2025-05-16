import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  PlusCircle,
  Search,
  Grid,
  List,
  Trash2,
  Eye,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

const API_URL = "http://localhost:5000/api/files";

const getFileUrl = (filename: string) =>
  `http://localhost:5000/uploads/${encodeURIComponent(filename)}`;

type ViewMode = "grid" | "list";

interface FileType {
  _id: string;
  filename: string;
  content: string;
  uploadedAt: string;
}

export default function Files() {
  const { showToast } = useToast();

  const [files, setFiles] = useState<FileType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<FileType | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch files from backend
  const fetchFiles = async () => {
    try {
      const res = await axios.get(API_URL);
      setFiles(res.data as FileType[]);
    } catch (error) {
      showToast("Failed to fetch files", "error");
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, []);

  // Upload handler
  const handleUpload = async () => {
    if (!fileToUpload) return;
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("File uploaded successfully", "success");
      const uploadedFile = (res.data as { data: FileType }).data;
      setFiles((prev) => [uploadedFile, ...prev]);
    } catch (error) {
      showToast("Failed to upload file", "error");
    }

    setIsModalOpen(false);
    setFileToUpload(null);
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      showToast("File deleted", "success");
      setFiles((prev) => prev.filter((file) => file._id !== id));
    } catch (error) {
      showToast("Failed to delete file", "error");
    }
  };

  // File input change
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setFileToUpload(file);
      setIsModalOpen(true);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Filtered files by search term only
  const filteredFiles = files.filter((f) =>
    f.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            onClick={() => fileInputRef.current?.click()}
          >
            Upload File
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Upload File</h2>
            <div className="mb-4">
              <input
                type="file"
                onChange={onFileChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setFileToUpload(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!fileToUpload}>
                Upload
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <Modal onClose={() => setPreviewFile(null)}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{previewFile.filename}</h2>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-96">
              {previewFile.content}
            </pre>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setPreviewFile(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      <div className="bg-white rounded-lg shadow-sm p-4">
        <Input
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} className="text-gray-400" />}
        />

        <div className="flex justify-between items-center mb-4 mt-4">
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
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Preview</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Delete</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFiles.map((f) => (
                  <tr key={f._id}>
                    <td className="px-4 py-3">{f.filename}</td>
                    <td className="px-4 py-3">
                      {new Date(f.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => window.open(getFileUrl(f.filename), "_blank")}
                        className="text-blue-500 hover:text-blue-700"
                        title="Preview"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(f._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((f) => (
                <div key={f._id} className="file-card">
                  <div className="flex justify-between items-center">
                    <FileText size={20} />
                    <div>
                      <button
                        onClick={() => window.open(getFileUrl(f.filename), "_blank")}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                        title="Preview"
                      >
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleDelete(f._id)}>Delete</button>
                    </div>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold">{f.filename}</h4>
                  <p className="text-xs text-gray-400">
                    {new Date(f.uploadedAt).toLocaleDateString()}
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
  );
}
