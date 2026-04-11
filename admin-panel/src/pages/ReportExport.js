import React, { useState } from 'react';
import API from '../utils/api';
import { FaFileDownload, FaFileExcel, FaFilePdf, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ReportExport = () => {
  const [reportType, setReportType] = useState('users'); // users, jobs, applications, companies
  const [dateRange, setDateRange] = useState('30days');
  const [exporting, setExporting] = useState(false);
  const [scheduledReports, setScheduledReports] = useState([
    {
      _id: '1',
      name: 'Weekly User Report',
      type: 'users',
      frequency: 'weekly',
      format: 'csv',
      recipients: ['admin@naukri.com'],
      nextRun: '2024-04-18',
      active: true
    },
    {
      _id: '2',
      name: 'Monthly Applications Report',
      type: 'applications',
      frequency: 'monthly',
      format: 'pdf',
      recipients: ['admin@naukri.com'],
      nextRun: '2024-05-01',
      active: true
    }
  ]);

  const reportFields = {
    users: [
      'Name', 'Email', 'Role', 'Phone', 'Joined Date', 'Last Active', 'Status', 'Suspended'
    ],
    jobs: [
      'Job Title', 'Company', 'Category', 'Location', 'Salary', 'Employment Type',
      'Posted Date', 'Applications', 'Status', 'Featured', 'Views'
    ],
    applications: [
      'Applicant Name', 'Job Title', 'Company', 'Application Date', 'Status',
      'Salary Expected', 'Experience', 'Email', 'Phone'
    ],
    companies: [
      'Company Name', 'Industry', 'Size', 'Location', 'Verified', 'Jobs Posted',
      'Applications Received', 'Owner', 'Founded Year'
    ]
  };

  const exportReport = async (format) => {
    setExporting(true);
    try {
      const params = new URLSearchParams({
        reportType,
        dateRange,
        format
      });

      // In real implementation, this would call backend API
      // const response = await API.get(`/admin/export/report?${params}`);
      // trigger download

      // Mock download
      const mockData = generateMockData(reportType);
      if (format === 'csv') {
        downloadCSV(mockData);
      } else if (format === 'pdf') {
        downloadPDF(mockData);
      }

      toast.success(`${format.toUpperCase()} report downloaded successfully!`);
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const generateMockData = (type) => {
    // Mock data generation
    return {
      report: `${type}_report`,
      timestamp: new Date().toISOString(),
      records: 150,
      fields: reportFields[type]
    };
  };

  const downloadCSV = (data) => {
    const csv = [
      data.fields.join(','),
      // Add mock rows
      ...Array(10).fill(0).map(() =>
        data.fields.map(() => `"Mock Data"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const downloadPDF = (data) => {
    // In real app, would use a library like jsPDF
    toast.info('PDF download feature requires additional library. Using CSV instead.');
    downloadCSV(data);
  };

  const toggleScheduledReport = async (reportId) => {
    try {
      setScheduledReports(
        scheduledReports.map(r =>
          r._id === reportId ? { ...r, active: !r.active } : r
        )
      );
      toast.success('Scheduled report updated');
    } catch (error) {
      toast.error('Failed to update scheduled report');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <FaFileDownload className="text-blue-600" />
            Report Export & Analytics
          </h1>
          <p className="text-gray-600">Generate, download, and schedule custom reports</p>
        </div>

        {/* Export Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Quick Export */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Quick Export</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="users">Users Report</option>
                  <option value="jobs">Jobs Report</option>
                  <option value="applications">Applications Report</option>
                  <option value="companies">Companies Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="1year">Last Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 mb-4">
                <p className="font-semibold mb-2">Fields included:</p>
                <div className="flex flex-wrap gap-2">
                  {reportFields[reportType]?.slice(0, 5).map((field, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {field}
                    </span>
                  ))}
                  {reportFields[reportType]?.length > 5 && (
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                      +{reportFields[reportType].length - 5} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => exportReport('csv')}
                  disabled={exporting}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <FaFileExcel /> CSV
                </button>
                <button
                  onClick={() => exportReport('pdf')}
                  disabled={exporting}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <FaFilePdf /> PDF
                </button>
              </div>
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">⏰ Scheduled Reports</h2>

            <div className="space-y-3">
              {scheduledReports.map((report) => (
                <div key={report._id} className="border border-gray-200 rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{report.name}</p>
                      <p className="text-sm text-gray-600">
                        {report.frequency.charAt(0).toUpperCase() + report.frequency.slice(1)} • {report.format.toUpperCase()}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleScheduledReport(report._id)}
                      className={`px-3 py-1 rounded text-sm font-semibold transition ${
                        report.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {report.active ? (
                        <>
                          <FaCheckCircle className="inline mr-1" /> Active
                        </>
                      ) : (
                        <>
                          <FaClock className="inline mr-1" /> Inactive
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Recipients: {report.recipients.join(', ')}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <FaCalendarAlt /> Next run: {report.nextRun}
                  </p>
                </div>
              ))}

              <button className="w-full border-2 border-dashed border-blue-300 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 font-semibold text-sm">
                + Schedule New Report
              </button>
            </div>
          </div>
        </div>

        {/* Predefined Reports */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Predefined Reports</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Daily Dashboard Summary', icon: '📊' },
              { name: 'Weekly Hiring Trends', icon: '📈' },
              { name: 'Monthly Revenue Report', icon: '💰' },
              { name: 'Platform Health Check', icon: '🏥' },
              { name: 'User Activity Analysis', icon: '👥' },
              { name: 'Company Performance', icon: '🏢' }
            ].map((report, idx) => (
              <button
                key={idx}
                className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition text-left"
              >
                <span className="text-2xl mb-2 block">{report.icon}</span>
                <p className="font-semibold text-gray-900 text-sm">{report.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportExport;
