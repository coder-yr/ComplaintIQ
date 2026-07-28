import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Complaint } from '../../features/complaints/complaintsSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardChartsProps {
  complaints: Complaint[];
}

const SEVERITY_COLORS = {
  LOW: '#22c55e', // green-500
  MEDIUM: '#eab308', // yellow-500
  HIGH: '#f97316', // orange-500
  SEVERE: '#ef4444', // red-500
  CRITICAL: '#ef4444',
};

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ complaints }) => {
  // Aggregate data by month for the bar chart
  const monthlyData = useMemo(() => {
    const counts: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize current year's months
    months.forEach(m => counts[m] = 0);
    
    complaints.forEach(c => {
      const dateStr = c.complaint_date || (c as any).created_at || c.incident_date;
      if (dateStr) {
        const date = new Date(dateStr);
        const monthName = months[date.getMonth()];
        counts[monthName] = (counts[monthName] || 0) + 1;
      }
    });
    
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [complaints]);

  // Aggregate data by severity for pie chart
  const severityData = useMemo(() => {
    const counts: Record<string, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0
    };
    
    complaints.forEach(c => {
      const sev = c.severity?.toUpperCase() || 'LOW';
      if (sev === 'SEVERE') counts['CRITICAL']++;
      else if (counts[sev] !== undefined) counts[sev]++;
      else counts['LOW']++;
    });
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0); // Only show segments with data
  }, [complaints]);

  if (complaints.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 rounded-xl border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-800">Complaints Trend (YTD)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-800">Severity Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full mt-4 flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name as keyof typeof SEVERITY_COLORS] || SEVERITY_COLORS.LOW} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`${value} complaints`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-800">{complaints.length}</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {severityData.map(entry => (
               <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[entry.name as keyof typeof SEVERITY_COLORS] }}></div>
                  {entry.name}
               </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
