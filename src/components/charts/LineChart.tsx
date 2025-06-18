
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
  x: string | number;
  y: number;
}

interface LineChartProps {
  data: {
    id: string;
    color?: string;
    data: DataPoint[];
  }[];
  height?: number;
}

const LineChart = ({ data, height = 300 }: LineChartProps) => {
  // Transform nivo data format to recharts format
  const transformedData = data[0]?.data.map(point => ({
    name: point.x,
    ...data.reduce((acc, series) => {
      const dataPoint = series.data.find(d => d.x === point.x);
      if (dataPoint) {
        acc[series.id] = dataPoint.y;
      }
      return acc;
    }, {} as Record<string, number>)
  })) || [];

  const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'];

  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer>
        <RechartsLineChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.map((series, index) => (
            <Line
              key={series.id}
              type="monotone"
              dataKey={series.id}
              stroke={series.color || colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
