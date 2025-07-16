import { useEffect, useState } from "react";
import "./App.css";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types/supabase";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Table from './components/Table';
import IncomeStats from './components/IncomeStats';
import IncomeCharts from './components/IncomeCharts';
import OtherIncomeList from './components/OtherIncomeList';
import {
  getTotalInfo,
  getTotalChartData,
  getLostChartData,
  getInChartData,
} from './utils/income';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

type Income = Database["public"]["Tables"]["income"]["Row"];

const keyTranslations: Record<string, string> = {
  totalIncomeBeforeTax: '至今税前总收入',
  totalExpenses: '至今税金房租总支出',
  totalIncomeAfterTax: '至今到手总收入',
  averageMonthlyIncome: '至今平均到手月入',
  yearEndBonus: '年终',
  yearEndBonusMonthly: '年终换算为月均',
  totalIncomeAfterYearEnd: '年终后到手总收入',
  averageMonthlyIncomeAfterYearEnd: '年终后平均到手月入',
  estimatedAnnualIncomeBeforeTax: '预计税前年入',
  estimatedAnnualIncomeAfterTax: '预计到手年入',
  estimatedAnnualIncomeAfterYearEnd: '年终后预计到手年入',
};

const fieldTranslations: Record<string, string> = {
  time: '时间-年月',
  base_salary: '基本工资',
  overtime_meal: '加班餐补',
  housing_fund: '公积金',
  leave_deduction: '请假扣款',
  housing_fund_deduction: '公积金扣款',
  medical_insurance: '医疗保险',
  pension_insurance: '养老保险',
  unemployment_insurance: '失业保险',
  tax: '个人所得税',
  rent: '房租',
};

// 其他收入（年终奖/退税）
const otherIncomeList = [
  { time: '2024-1', yearEndBonus: '100', yearEndBonusMonthly: 4364.5 },
  { time: '2024-3', taxRefund: 875.16 },
];

function App() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalInfo, setTotalInfo] = useState<Record<string, number | undefined>>({});

  // 查询所有收入记录
  const fetchIncomes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("income")
      .select("*")
      .order("time", { ascending: false });
    setIncomes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchIncomes();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (incomes.length) {
      setTotalInfo(getTotalInfo(incomes));
    }
  }, [incomes]);

  // 图表数据
  const { realIncomeList, lostList } = getTotalChartData(incomes);
  const lostChartData = getLostChartData(incomes, fieldTranslations);
  const inChartData = getInChartData(incomes, fieldTranslations);

  // Chart.js 数据格式
  const totalChartData = {
    labels: realIncomeList.map(i => i.time),
    datasets: [
      {
        label: '实际收入',
        data: realIncomeList.map(i => i.value),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
      },
      {
        label: '硬性支出',
        data: lostList.map(i => i.value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const lostChartGroup = lostChartData.reduce((acc, cur) => {
    if (!acc[cur.type]) acc[cur.type] = [];
    acc[cur.type].push({ time: cur.time, value: cur.value });
    return acc;
  }, {} as Record<string, { time: string; value: number }[]>);
  const lostChartLabels = Array.from(new Set(lostChartData.map(i => i.time)));
  const lostChartDatasets = Object.entries(lostChartGroup).map(([type, arr], idx) => ({
    label: type,
    data: lostChartLabels.map(lab => arr.find(a => a.time === lab)?.value || 0),
    borderColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
    backgroundColor: `hsl(${(idx * 60) % 360}, 70%, 80%)`,
    tension: 0.3,
  }));
  const lostChart = {
    labels: lostChartLabels,
    datasets: lostChartDatasets,
  };

  const inChartGroup = inChartData.reduce((acc, cur) => {
    if (!acc[cur.type]) acc[cur.type] = [];
    acc[cur.type].push({ time: cur.time, value: cur.value });
    return acc;
  }, {} as Record<string, { time: string; value: number }[]>);
  const inChartLabels = Array.from(new Set(inChartData.map(i => i.time)));
  const inChartDatasets = Object.entries(inChartGroup).map(([type, arr], idx) => ({
    label: type,
    data: inChartLabels.map(lab => arr.find(a => a.time === lab)?.value || 0),
    borderColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
    backgroundColor: `hsl(${(idx * 60) % 360}, 70%, 80%)`,
    tension: 0.3,
  }));
  const inChart = {
    labels: inChartLabels,
    datasets: inChartDatasets,
  };


  // 时间格式化函数（只显示“YYYY年MM月”）
  const formatDateTime = (value: any) => {
    if (typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${year}年${month}月`;
      }
    }
    return value;
  };

  // 计算时间区间
  let timeRange = '';
  if (incomes.length > 0) {
    const times = incomes.map(i => i.time).filter(Boolean).sort();
    const start = formatDateTime(times[0]);
    const end = formatDateTime(times[times.length - 1]);
    if (start && end) {
      timeRange = `${start}-${end}(${times.length})`;
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 border border-gray-200 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-center">{timeRange ? `${timeRange}` : ''}</h2>
      {loading ? (
        <div className="text-center">加载中...</div>
      ) : (
        <>
          {/* 统计信息 */}
          {incomes.length > 0 && (
            <>
              <IncomeStats totalInfo={totalInfo} keyTranslations={keyTranslations} />
              <IncomeCharts
                totalChartData={totalChartData}
                lostChart={lostChart}
                inChart={inChart}
              />
              <OtherIncomeList otherIncomeList={otherIncomeList} />
              <h3 className="text-center mt-4">4. 表格数据</h3>
            </>
          )}
          {/* 原有表格展示 */}
          <div className="overflow-x-auto">
            <Table incomeDataList={incomes} excludeFields={[]} fieldTranslations={fieldTranslations} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
