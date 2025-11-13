import React, { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please upload an image first.");

    // Convert image to base64
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      const base64String = reader.result.split(",")[1];

      const response = await fetch("https://your-api-endpoint/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: base64String }),
      });

      const data = await response.json();
      setTableData(data);
    };
  };

  // 👇 Define columns dynamically based on your data
  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="App">
      <h1>AI Table Generator</h1>

      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleSubmit}>Upload and Process</button>

      {tableData.length > 0 && (
        <table border="1" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col}>{row[col]}</td>
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
