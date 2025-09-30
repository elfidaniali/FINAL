
import React, { useMemo } from 'react';
import { Domain, RedirectLog, DomainStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StatsOverviewProps {
  domains: Domain[];
  logs: RedirectLog[];
}

const COLORS = {
  [DomainStatus.Healthy]: '#22c55e', // green-500
  [DomainStatus.Down]: '#ef4444', // red-500
  [DomainStatus.Flagged]: '#f97316', // orange-500
  [DomainStatus.Checking]: '#3b82f6' // blue-500
};

const StatsOverview: React.FC<StatsOverviewProps> = ({ domains, logs }) => {
  const stats = useMemo(() => {
    const healthyDomains = domains.filter(d => d.status === DomainStatus.Healthy).length;
    const downDomains = domains.filter(d => d.status === DomainStatus.Down).length;
    const flaggedDomains = domains.filter(d => d.status === DomainStatus.Flagged).length;
    const totalDomains = domains.length;
    const uptimePercentage = totalDomains > 0 ? (healthyDomains / totalDomains) * 100 : 0;

    const trafficByDomain = domains.map(domain => ({
      name: domain.url.replace(/https?:\/\//, ''),
      redirects: logs.filter(log => log.redirected_domain === domain.url).length
    }));
    
    return {
      uptimePercentage: uptimePercentage.toFixed(1),
      totalRedirects: logs.length,
      healthyDomains,
      downDomains,
      flaggedDomains,
      totalDomains,
      trafficByDomain,
      statusDistribution: [
        { name: 'Healthy', value: healthyDomains },
        { name: 'Down', value: downDomains },
        { name: 'Flagged', value: flaggedDomains },
      ]
    };
  }, [domains, logs]);
  
  const pieColors = [COLORS[DomainStatus.Healthy], COLORS[DomainStatus.Down], COLORS[DomainStatus.Flagged]];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stat Cards */}
      <StatCard title="Uptime" value={`${stats.uptimePercentage}%`} description={`${stats.healthyDomains} of ${stats.totalDomains} domains healthy`} />
      <StatCard title="Total Redirects" value={stats.totalRedirects.toLocaleString()} description="Across all domains" />
      <StatCard title="Domains Down" value={stats.downDomains} description="Currently unreachable" />
      <StatCard title="Domains Flagged" value={stats.flaggedDomains} description="Marked as unsafe" />

      {/* Charts */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Traffic by Domain</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.trafficByDomain} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }} />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }} />
            <Legend />
            <Bar dataKey="redirects" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Domain Status Distribution</h3>
         <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats.statusDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {stats.statusDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => (
    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg shadow-md">
        <h4 className="text-sm font-medium text-gray-400">{title}</h4>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
        <p className="text-xs text-gray-500 mt-2">{description}</p>
    </div>
);

export default StatsOverview;
