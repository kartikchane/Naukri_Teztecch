import React, { useState } from 'react';
import { FaExclamationTriangle, FaWifi, FaDatabase, FaMicrochip, FaServer } from 'react-icons/fa';

const PerformanceMonitoring = () => {
  const [metrics] = useState({
    uptime: 99.96,
    avgResponseTime: 145,
    cpuUsage: 35,
    memoryUsage: 52,
    databaseLatency: 18,
    activeUsers: 2450,
    dailyRequests: 850000,
    errors: 12
  });

  const MetricCard = ({ label, value, unit, color, icon: Icon }) => (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-gray-900">{label}</span>
        <Icon className={`text-2xl text-${color}-600`} />
      </div>
      <p className={`text-3xl font-bold text-${color}-600`}>{value}{unit}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">📊 System Performance</h1>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Uptime" value={metrics.uptime} unit="%" color="green" icon={FaServer} />
          <MetricCard label="Avg Response" value={metrics.avgResponseTime} unit="ms" color="blue" icon={FaWifi} />
          <MetricCard label="CPU Usage" value={metrics.cpuUsage} unit="%" color="purple" icon={FaMicrochip} />
          <MetricCard label="Memory" value={metrics.memoryUsage} unit="%" color="orange" icon={FaDatabase} />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">Database Health</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">{metrics.databaseLatency}ms</p>
            <p className="text-sm text-gray-600">Query latency</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">Active Users</h3>
            <p className="text-2xl font-bold text-green-600 mb-2">{metrics.activeUsers.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Currently online</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">Errors</h3>
            <p className="text-2xl font-bold text-red-600 mb-2">{metrics.errors}</p>
            <p className="text-sm text-gray-600">Last 24 hours</p>
          </div>
        </div>

        {metrics.errors > 10 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <FaExclamationTriangle className="text-red-600 text-xl flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-red-900">High Error Rate Detected</p>
              <p className="text-sm text-red-800">{metrics.errors} errors in the last 24 hours. Monitor logs for issues.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMonitoring;
