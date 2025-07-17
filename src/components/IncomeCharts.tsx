import { Line } from 'react-chartjs-2';

interface IncomeChartsProps {
  totalChartData: any;
  lostChart: any;
  inChart: any;
}

function IncomeCharts({ totalChartData, lostChart, inChart }: IncomeChartsProps) {
  return (
    <>
      <h3 className="text-center mt-4">1. 到手情况</h3>
      <div className="w-full h-[420px] sm:h-80 mb-8">
        <Line data={totalChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: '到手/支出趋势' } } }} />
      </div>
      <h3 className="text-center mt-4">2. 硬性支出情况</h3>
      <div className="w-full h-[420px] sm:h-80 mb-8">
        <Line data={lostChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: '硬性支出分项' } } }} />
      </div>
      <h3 className="text-center mt-4">3. 收入情况</h3>
      <div className="w-full h-[420px] sm:h-80 mb-8">
        <Line data={inChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: '收入分项' } } }} />
      </div>
    </>
  );
}

export default IncomeCharts; 