import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "../App.css";

const Dashboard = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [fileMeta, setFileMeta] = useState(null);
  const [loggedInUser, setloggedInUser] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!isLoggedIn || !user) {
      navigate("/login");
      return;
    }

    setloggedInUser(user);

    const storedMeta = JSON.parse(
      localStorage.getItem(`fileMeta_${user.email}`)
    );

    if (storedMeta) {
      setFileMeta(storedMeta);
    }
  }, [navigate]);



  const handleFileUpload = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  localStorage.setItem(`excelFileName_${user.email}`, file.name);

  if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
    alert("Only Excel files are allowed");
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      alert("Excel sheet is empty");
      return;
    }

    const userEmail = user.email;

    localStorage.setItem(
      `excelData_${userEmail}`,
      JSON.stringify(jsonData)
    );

    const metadata = {
      fileName: file.name,
      uploadDate: new Date().toLocaleString(),
    };

    localStorage.setItem(
      `fileMeta_${userEmail}`,
      JSON.stringify(metadata)
    );

    setFileMeta(metadata);
    alert("File uploaded successfully!");
  };

  reader.readAsArrayBuffer(file);
};

  //  to remove file
  const handleRemove = () => {
    const userEmail = loggedInUser?.email;

    localStorage.removeItem(`excelData_${userEmail}`);
    localStorage.removeItem(`fileMeta_${userEmail}`);

    setFileMeta(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div className="dashboard-bg">
    

      <header className="glass-header">
  <div className="header-container">
    <h4 className="logo text-black ">EXCELVIEW</h4>

    <button
      className=" btn common-btn "
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
</header>


      <div className="dashboard-content container text-center">
        <div className="mb-4 mt-4">
          <h4 className=" text-capitalize fs-3 mt-5 text-primary fade-up delay-1" >Welcome, {loggedInUser?.name}</h4>
              <h1 className="xls-heading mt-3 fade-up delay-2 " >Excel Viewer Dashboard</h1>
              <p className=" text-secondary fs-3 fw-medium fade-up delay-3" >Share and view your spreadsheets instantly</p>

        </div>


       <div className="file-container text-center fade-up delay-4">

  {!fileMeta && (
    <div className="upload-box">

      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      <div className="upload-inner">
        <div className="upload-icon"><i class="bi bi-file-earmark-arrow-up-fill"></i></div>

        <button
          className="btn common-btn choose-btn mt-2"
          onClick={() => fileInputRef.current.click()}
        >
          Choose File
        </button>

        <p className="text-muted mt-3">
          Only .xls or .xlsx files are supported
        </p>

       
      </div>

    </div>
  )}

  {fileMeta && (
    <div className="uploaded-info file-container mt-5 fs-5">

      <p>Uploaded File Details</p>

      <p><strong>File Name:</strong> {fileMeta.fileName}</p>
      <p><strong>Uploaded At:</strong> {fileMeta.uploadDate}</p>

      <div className="d-flex justify-content-center gap-3 mt-3">
        <button
          className="btn common-btn"
          onClick={() => navigate("/viewer")}
        >
          View Your File
        </button>

        <button
          className="btn common-btn"
          onClick={handleRemove}
        >
          Remove/Replace
        </button>
      </div>
    </div>
  )}

</div>

      </div>
    </div>
  );
};

export default Dashboard;
