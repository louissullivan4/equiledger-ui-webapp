import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; 
import AuthService from '../../services/AuthService';

const DownloadExpenses = () => {
  const [ userIdParam, setUserIdParam ] = useState('');
  const location = useLocation();
  const pathname = location.pathname; 
  const currentUser = AuthService.getCurrentUser();
  const token = currentUser?.token;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const setUserIdHandler = async () => {
      const segments = (pathname.endsWith('/') ? pathname.slice(0, -1) : pathname).split('/');
      const lastSegment = segments[segments.length - 1] ||  null;
      const userId = lastSegment;
      if (userId) {
        setUserIdParam(userId);
      }
    }
    setUserIdHandler();
  }, []);
  

  // Function to open the modal
  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedYear('');
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedYear) {
      alert('Please select a year.');
      return;
    }

    setIsLoading(true);

    try {
      // Update the endpoint URL to match the new backend route
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/expenses/downloads/${userIdParam}/${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // Important for handling binary data
        }
      );

      // Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from the response headers or set a default
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `expenses_${userIdParam}_${selectedYear}.zip`; // Default filename for ZIP

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Optionally, notify the user of a successful download
      alert('Expenses downloaded successfully.');

      // Close the modal after download
      setIsModalOpen(false);
      setSelectedYear('');
    } catch (error) {
      console.error('Error downloading expenses:', error);
      alert('Failed to download expenses. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Generate a list of years (e.g., last 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(10), (val, index) => currentYear - index);

  return (
    <section className="download-section">
      <button className="custom-file-upload" onClick={handleButtonClick}>
        Download Expenses
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Select Year</h2>
            <form onSubmit={handleSubmit}>
              <select
                id="year"
                value={selectedYear}
                onChange={handleYearChange}
                required
              >
                <option value="" disabled>
                  --Select Year--
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="modal-actions">
                <button type="submit" disabled={isLoading} className="custom-file-upload">
                  {isLoading ? '...' : 'Submit'}
                </button>
                <button type="button" onClick={handleCloseModal} className="custom-file-upload">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default DownloadExpenses;
