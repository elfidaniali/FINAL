
import React, { useState } from 'react';
import { RedirectLog } from '../types';

interface LogsViewerProps {
  logs: RedirectLog[];
}

const LogsViewer: React.FC<LogsViewerProps> = ({ logs }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Original Request', 'Redirected Domain', 'IP Address', 'User Agent'];
    const rows = logs.map(log => [
      log.id,
      log.timestamp,
      log.original_request,
      log.redirected_domain,
      log.ip,
      log.user_agent,
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-s-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'redirect_logs.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Redirect Logs</h3>
        <button
          onClick={handleExportCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Export to CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
            <tr>
              <th scope="col" className="px-4 py-3">Timestamp</th>
              <th scope="col" className="px-4 py-3">Request</th>
              <th scope="col" className="px-4 py-3">Redirected To</th>
              <th scope="col" className="px-4 py-3">IP Address</th>
              <th scope="col" className="px-4 py-3">User Agent</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map(log => (
              <tr key={log.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-3 font-mono">{log.original_request}</td>
                <td className="px-4 py-3 font-mono">{log.redirected_domain}</td>
                <td className="px-4 py-3">{log.ip}</td>
                <td className="px-4 py-3 truncate max-w-xs">{log.user_agent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <nav className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {page}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default LogsViewer;
