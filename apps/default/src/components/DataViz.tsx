import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react';

interface DataVizProps {
  categoryColor: string;
}

export const DataViz: React.FC<DataVizProps> = ({ categoryColor }) => {
  // Student Impact Growth - showing how many students benefit over time
  const impactData = [
    { week: 'Week 1', students: 150 },
    { week: 'Week 2', students: 420 },
    { week: 'Week 3', students: 890 },
    { week: 'Week 4', students: 1500 },
  ];

  // Revenue Growth Distribution - where money comes from
  const revenueData = [
    { name: 'Subscriptions', value: 45, color: '#C6FF00' },
    { name: 'Partnerships', value: 35, color: categoryColor },
    { name: 'Premium', value: 20, color: '#2DF9FF' },
  ];

  // Quick Wins Timeline - realistic 3-4 weeks
  const timelineData = [
    { milestone: 'Setup', weeks: 0.5, emoji: '🚀' },
    { milestone: 'Testing', weeks: 1, emoji: '🧪' },
    { milestone: 'Launch', weeks: 1, emoji: '✨' },
    { milestone: 'Scale', weeks: 1.5, emoji: '📈' },
  ];

  return (
    <div className="space-y-4">
      {/* Student Impact Growth */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" style={{ color: categoryColor }} />
          <h3 className="text-[#A0A0A0] text-xs font-bold uppercase tracking-wider">
            📈 Student Reach (First Month)
          </h3>
        </div>
        <div className="h-32 sm:h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={impactData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis 
                dataKey="week" 
                tick={{ fill: '#A0A0A0', fontSize: 10 }} 
                stroke="#ffffff20"
              />
              <YAxis 
                tick={{ fill: '#A0A0A0', fontSize: 10 }} 
                stroke="#ffffff20"
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#000000', 
                  border: `1px solid ${categoryColor}40`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#EDEDED'
                }}
                formatter={(value: number) => [`${value.toLocaleString()} students`, 'Reached']}
              />
              <Bar dataKey="students" fill={categoryColor} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-white/50 text-xs text-center">
          Helping 1,500+ students find opportunities in the first month! 🎓
        </p>
      </div>

      {/* Quick Launch Timeline */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" style={{ color: categoryColor }} />
          <h3 className="text-[#A0A0A0] text-xs font-bold uppercase tracking-wider">
            ⚡ Launch Timeline (3-4 Weeks)
          </h3>
        </div>
        <div className="space-y-1.5">
          {timelineData.map((phase, index) => {
            const percentage = (phase.weeks / 4) * 100;
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#EDEDED] font-medium flex items-center gap-2">
                    <span>{phase.emoji}</span>
                    <span>{phase.milestone}</span>
                  </span>
                  <span className="text-[#A0A0A0]">{phase.weeks}wk</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: categoryColor,
                      boxShadow: `0 0 10px ${categoryColor}60`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-white/50 text-xs text-center">
          From zero to hero in less than a month! 🚀
        </p>
      </div>

      {/* Revenue Distribution */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" style={{ color: categoryColor }} />
          <h3 className="text-[#A0A0A0] text-xs font-bold uppercase tracking-wider">
            💰 Revenue Mix
          </h3>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex-shrink-0" style={{ width: '120px', height: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000000', 
                    border: `1px solid ${categoryColor}40`,
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#EDEDED'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5">
            {revenueData.map((stream, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: stream.color }}
                  />
                  <span className="text-[#EDEDED] font-medium">{stream.name}</span>
                </div>
                <span className="text-[#A0A0A0]">{stream.value}%</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/50 text-xs text-center">
          Multiple revenue streams = sustainable growth! 💸
        </p>
      </div>
    </div>
  );
};
