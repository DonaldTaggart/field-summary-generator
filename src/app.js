import React, { useState } from "react";

function App() {
  const [imageFile, setImageFile] = useState(null);      // Selected file
  const [previewUrl, setPreviewUrl] = useState(null);    // For image preview
  const [tableData, setTableData] = useState([]);        // Table from backend
  const [loading, setLoading] = useState(false);         // Loading state
  const [error, setError] = useState(null);              // Error messages

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setTableData([]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!imageFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await fetch(
        "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.table) {
        setTableData(data.table);
      } else {
        setError("No table data returned from the backend.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to process image. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h1>Field Summary Generator</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <div style={{ marginTop: "1rem" }}>
          <img
            src={previewUrl}
            alt="preview"
            style={{ maxWidth: "100%", maxHeight: "300px" }}
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload & Generate Table"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {tableData.length > 0 && (
        <table style={{ marginTop: "2rem", borderCollapse: "collapse", width: "100%" }}>
            <thead>
                <tr>
                    {columns.map((col, idx) => (
                        <th key={idx} style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                            {col}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td
                            key={cellIndex}
                            style={{ border: "1px solid #ccc", padding: "0.5rem", textAlign: "center" }}
                            >
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
)}
    </div>
  );
}

export default App;
