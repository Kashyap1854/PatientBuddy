import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  date: string;
  category: string;
  tags: string[];
  content?: string;
  aiAnalysis?: {
    summary: string;
    keyPoints: string[];
    recommendations: string[];
  };
}

interface FileContextType {
  files: FileData[];
  uploadFile: (file: File) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  getFile: (fileId: string) => FileData | undefined;
  processFileWithAI: (fileId: string) => Promise<void>;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function useFiles() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
}

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FileData[]>([]);
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  // Load files from localStorage on mount
  useEffect(() => {
    if (currentUser) {
      const storedFiles = localStorage.getItem(`files_${currentUser.id}`);
      if (storedFiles) {
        setFiles(JSON.parse(storedFiles));
      }
    }
  }, [currentUser]);

  // Save files to localStorage whenever they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`files_${currentUser.id}`, JSON.stringify(files));
    }
  }, [files, currentUser]);

  const uploadFile = async (file: File) => {
    try {
      // Read file content
      const content = await readFileContent(file);
      
      // Create new file data
      const newFile: FileData = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        date: new Date().toISOString(),
        category: determineCategory(file.name),
        tags: [],
        content,
      };

      // Add file to state
      setFiles(prev => [...prev, newFile]);
      
      // Process file with AI
      await processFileWithAI(newFile.id);
      
      showToast('File uploaded successfully', 'success');
    } catch (error) {
      showToast('Failed to upload file', 'error');
      console.error('Upload error:', error);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      setFiles(prev => prev.filter(file => file.id !== fileId));
      showToast('File deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete file', 'error');
    }
  };

  const getFile = (fileId: string) => {
    return files.find(file => file.id === fileId);
  };

  const processFileWithAI = async (fileId: string) => {
    try {
      const file = getFile(fileId);
      if (!file || !file.content) return;

      // Here we would normally call an AI service API
      // For demo purposes, we'll simulate AI processing
      const aiAnalysis = await simulateAIProcessing(file.content);

      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, aiAnalysis }
          : f
      ));

      showToast('File processed successfully', 'success');
    } catch (error) {
      showToast('Failed to process file', 'error');
    }
  };

  // Helper functions
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const determineCategory = (fileName: string): string => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('prescription') || lowerName.includes('med')) {
      return 'Prescriptions';
    } else if (lowerName.includes('lab') || lowerName.includes('test')) {
      return 'Lab Results';
    } else if (lowerName.includes('scan') || lowerName.includes('xray')) {
      return 'Imaging';
    } else {
      return 'Other';
    }
  };

  const simulateAIProcessing = async (content: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate AI analysis
    return {
      summary: `Summary of the document: ${content.substring(0, 100)}...`,
      keyPoints: [
        'Key point 1 from the document',
        'Key point 2 from the document',
        'Key point 3 from the document'
      ],
      recommendations: [
        'Recommendation 1 based on the document',
        'Recommendation 2 based on the document'
      ]
    };
  };

  return (
    <FileContext.Provider value={{
      files,
      uploadFile,
      deleteFile,
      getFile,
      processFileWithAI
    }}>
      {children}
    </FileContext.Provider>
  );
} 