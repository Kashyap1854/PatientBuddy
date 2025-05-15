import { FileText, Trash2, FilePdf } from "lucide-react";
import { useFileContext } from "../contexts/FileContext";

const CATEGORY_COLORS: Record<string, string> = {
  Diagnosis: "bg-red-100 text-red-700",
  Prescription: "bg-green-100 text-green-700",
  Lab: "bg-blue-100 text-blue-700",
  Imaging: "bg-purple-100 text-purple-700",
  Uncategorized: "bg-gray-100 text-gray-700",
};

export default function Files() {
  const { files, setFiles } = useFileContext();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setFiles(files.filter((file) => file.id !== id));
    }
  };

  const openPDF = (fileName: string) => {
    // Assuming file URLs are accessible via some path or API — adjust if needed
    const url = `/uploads/${fileName}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6">All Medical Records</h1>

      {files.length === 0 ? (
        <p className="text-gray-500">No files uploaded yet.</p>
      ) : (
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
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {files.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 whitespace-nowrap flex items-center gap-2">
                    <FileText size={18} className="text-gray-500" />
                    <span className="text-sm text-gray-900">{file.name}</span>
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
                  <td className="py-3 px-4 whitespace-nowrap text-right space-x-2">
                    <button
                      onClick={() => openPDF(file.name)}
                      title="Open PDF"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FilePdf size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      title="Delete"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
