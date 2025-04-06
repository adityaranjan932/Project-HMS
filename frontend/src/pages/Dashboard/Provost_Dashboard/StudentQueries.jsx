import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/service-requests/my"
        );
        setQueries(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch maintenance requests.");
        setLoading(false);
      }
    };

    fetchMaintenanceRequests();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Leave Applications</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-4 border text-left">Student Name</th>
              <th className="py-2 px-4 border text-left">Reason</th>
              <th className="py-2 px-4 border text-left">From</th>
              <th className="py-2 px-4 border text-left">To</th>
              <th className="py-2 px-4 border text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query) => (
              <tr key={query._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">
                  {query.studentId?.name || "N/A"}
                </td>
                <td className="py-2 px-4 border">{query.reason}</td>
                <td className="py-2 px-4 border">
                  {new Date(query.fromDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">
                  {new Date(query.toDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border capitalize">{query.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentQueries;
