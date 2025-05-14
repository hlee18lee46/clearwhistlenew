"use client";


import { useEffect, useState } from "react";
import axios from "axios";

interface WhistleReport {
  id: string;
  ipfsHash: string;
  title: string;
  timestamp: string;
  organization: string;
}

export default function WhistlePage() {
  const [reports, setReports] = useState<WhistleReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const orgId = localStorage.getItem("orgId"); // Assume it's stored post-login
        const response = await axios.get(`/api/reports?org=${orgId}`);
        setReports(response.data);
      } catch (err: any) {
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div className="p-4 text-gray-600">Loading reports...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Whistleblower Reports</h1>
      {reports.length === 0 ? (
        <p className="text-gray-500">No reports found for your organization.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Title</th>
                <th className="p-2">Timestamp</th>
                <th className="p-2">IPFS Link</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{report.title}</td>
                  <td className="p-2">{new Date(report.timestamp).toLocaleString()}</td>
                  <td className="p-2 text-blue-600">
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${report.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
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
