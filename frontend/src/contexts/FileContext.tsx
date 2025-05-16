import React, { createContext, useContext, useState } from "react";

// Define the structure of a file item
interface FileItem {
  id: string;
  name: string;
  category: string;
  size: string;
  date: string;
  tags: string[];
}

// File context type
interface FileContextType {
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
}

// Create the context
const FileContext = createContext<FileContextType | undefined>(undefined);

// Custom hook to access the file context
export const useFileContext = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
};

// FileProvider to wrap the application
export const FileProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);

  return (
    <FileContext.Provider value={{ files, setFiles }}>
      {children}
    </FileContext.Provider>
  );
};
