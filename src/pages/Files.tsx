import { useFileContext } from "../contexts/FileContext";
import { Trash2, FileText, ExternalLink } from "lucide-react";

export default function Files() {
  const { files, setFiles } = useFileContext();

  const handleDelete = (id: string) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const openPdf = (file: any) => {
    const blob = new Blob([file.fileObject], { type: file.fileObject.type });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        All Uploaded Files
      </h2>
      {files.length > 0 ? (
        <ul className="space-y-3">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex justify-between items-center bg-white p-4 rounded-md shadow hover:shadow-md transition"
            >
              <div className="flex items-center space-x-3">
                <FileText className="text-gray-500" />
                <div>
                  <p className="text-gray-800 font-medium">{file.name}</p>
                  <p className="text-gray-500 text-sm">
                    {file.category} | {file.size}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openPdf(file)}
                  className="text-blue-600 hover:text-blue-800"
                  title="View PDF"
                >
                  <ExternalLink />
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <Trash2 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No files uploaded yet.</p>
      )}
    </div>
  );
}
