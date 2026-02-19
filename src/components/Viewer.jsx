import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Viewer = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [fileName, setFileName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [sortConfig, setSortConfig] = useState(null);
  const rowsPerPage = 10;

  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!isLoggedIn || !user) {
      navigate("/login");
      return;
    }

    setLoggedInUser(user);

    const storedData = JSON.parse(
      localStorage.getItem(`excelData_${user.email}`)
    );
    const storedFileName = localStorage.getItem(
  `excelFileName_${user.email}`
);


    if (!storedData || storedData.length === 0) {
      navigate("/dashboard");
    } else {
      setData(storedData);

      if(storedFileName){
      setFileName(storedFileName);

      }
    }
  }, [navigate]);

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue)
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue)
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = sortedData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <div className="viewer-wrapper">
      <div className="fade-up-viewer">

        {/* Top header card */}
        <div className="viewer-top-card">
          <div className="d-flex justify-content-between align-items-center">
            <div>
<h4 className="mb-1">
  {fileName ? fileName : " "}
</h4>              <small >
                {data.length} Rows, {data[0] ? Object.keys(data[0]).length : 0} Columns
              </small>
            </div>

            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate("/dashboard")}
            >
              Back
            </button>
          </div>
        </div>

        <div className="viewer-content container-fluid mt-4">

          {/* search bar */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search all columns..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div>
              <span className="badge bg-secondary">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          {/* table */}
          <div className="table-container">
            <table className="table custom-table">
              <thead>
                <tr>
                  {data.length > 0 &&
                    Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        onClick={() => requestSort(key)}
                      >
                        {key}
                        {sortConfig?.key === key &&
                          (sortConfig.direction === "ascending"
                            ? " ▲"
                            : " ▼")}
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody>
                {currentRows.length > 0 ? (
                  currentRows.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i}>{value}</td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="100%" className="text-center py-4">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          <nav className="mt-4 pagination-sticky">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </div>
  );
};

export default Viewer;
