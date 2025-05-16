import React, { useState } from "react";
import { useFileContext } from "../../contexts/FileContext";
import { useToast } from "../../contexts/ToastContext";
import Modal from "./Modal"; // Modal component
import Button from "./Button"; // Button component

const FileUpload = () => {
  const { setFiles } = useFileContext();
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>(""); // Selected category
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Handles the file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setIsModalOpen(true); // Open the category selection modal
    }
  };

  // Handles category selection
  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };

  // Handles file upload with selected category
  const handleUploadFile = () => {
    if (file && category) {
      const newFile = {
        id: new Date().toISOString(),
        name: file.name,
        category,
        size: `${(file.size / 1024).toFixed(2)} KB`, // Convert bytes to KB
        date: new Date().toISOString(),
        tags: [],
      };
      setFiles(
        (
          prevFiles: Array<{
            id: string;
            name: string;
            category: string;
            size: string;
            date: string;
            tags: string[];
          }>
        ) => [...prevFiles, newFile]
      ); // Update context with new file
      showToast("File uploaded successfully!", "success");
      setIsModalOpen(false); // Close modal after upload
    } else {
      showToast("Please select a category for the file.", "error");
    }
  };

  return (
    <div>
      {/* File Upload Input */}
      <input type="file" onChange={handleFileChange} />
      <Button onClick={handleUploadFile} disabled={!file || !category}>
        Upload File
      </Button>

      {/* Modal for Category Selection */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div>
            <h3>Select a Category</h3>
            <div>
              <button onClick={() => handleCategorySelect("Prescription")}>
                Prescription
              </button>
              <button onClick={() => handleCategorySelect("Report")}>
                Report
              </button>
              <button onClick={() => handleCategorySelect("Other")}>
                Other
              </button>
            </div>
            <div>
              <button onClick={handleUploadFile}>Upload</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FileUpload;
