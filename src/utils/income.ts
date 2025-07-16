// 收入相关工具函数
import type { Tables } from '../types/supabase';
type Income = Tables<'income'>;

export function formatTime(isoTime: string): string {
  const date = new Date(isoTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function sumObj(obj: any) {
  let sum = 0;
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      if (typeof obj[key] === 'number') sum += obj[key];
    }
  }
  return sum;
}

export function sumNumArr(list: number[]): number {
  return list.reduce((pre, next) => pre + next, 0);
}

export function getTotalInfo(incomes: Income[]): any {
  const sorted = [...incomes].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  const realIncomeList = sorted.map(item => ({
    time: formatTime(item.time),
    value: sumObj(item),
    type: '实际收入',
  }));
  const lostList = sorted.map(item => {
    const list = Object.entries(item).filter(([_, val]) => typeof val === 'number' && val < 0);
    const lostRes = list.reduce((pre, [, nextVal]) => pre + (nextVal as number), 0);
    return {
      time: formatTime(item.time),
      value: -lostRes,
      type: '硬性支出',
    };
  });
  const totalIncomeAfterTax = sumNumArr(realIncomeList.map(i => i.value));
  const totalIncomeBeforeTax = totalIncomeAfterTax + sumNumArr(lostList.map(i => i.value));
  const totalExpenses = totalIncomeBeforeTax - totalIncomeAfterTax;
  const averageMonthlyIncome = totalIncomeAfterTax / incomes.length;
  const estimatedAnnualIncomeAfterTax = averageMonthlyIncome * 12;
  const estimatedAnnualIncomeBeforeTax = (totalIncomeBeforeTax / incomes.length) * 12;
  return {
    totalIncomeAfterTax,
    totalIncomeBeforeTax,
    totalExpenses,
    averageMonthlyIncome,
    estimatedAnnualIncomeAfterTax,
    estimatedAnnualIncomeBeforeTax,
  };
}

export function getTotalChartData(incomes: Income[]) {
  const sorted = [...incomes].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  const realIncomeList = sorted.map(item => ({
    time: formatTime(item.time),
    value: sumObj(item),
    type: '实际收入',
  }));
  const lostList = sorted.map(item => {
    const list = Object.entries(item).filter(([_, val]) => typeof val === 'number' && val < 0);
    const lostRes = list.reduce((pre, [, nextVal]) => pre + (nextVal as number), 0);
    return {
      time: formatTime(item.time),
      value: -lostRes,
      type: '硬性支出',
    };
  });
  return { realIncomeList, lostList };
}

export function getLostChartData(incomes: Income[], fieldTranslations: Record<string, string>) {
  const sorted = [...incomes].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  const list: { time: string; value: number; type: string }[] = [];
  sorted.forEach(element => {
    Object.entries(element)
      .filter(([key]) => !['id', 'owner', 'time', 'created_at', 'updated_at'].includes(key))
      .sort(([, val1], [, val2]) => (val2 as number) - (val1 as number))
      .forEach(([key, val]) => {
        if (typeof val === 'number' && val < 0) {
          list.push({
            time: formatTime(element.time),
            value: -val,
            type: fieldTranslations[key] || key,
          });
        }
      });
  });
  if (list.length > 1) {
    const first = list[0];
    list[0] = list[1];
    list[1] = first;
  }
  return list;
}

export function getInChartData(incomes: Income[], fieldTranslations: Record<string, string>) {
  const sorted = [...incomes].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  const list: { time: string; value: number; type: string }[] = [];
  sorted.forEach(element => {
    Object.entries(element)
      .filter(([key]) => !['id', 'owner', 'time', 'created_at', 'updated_at', 'leave_deduction'].includes(key))
      .sort(([, val1], [, val2]) => (val1 as number) - (val2 as number))
      .forEach(([key, val]) => {
        if (typeof val === 'number' && val >= 0) {
          list.push({
            time: formatTime(element.time),
            value: val,
            type: fieldTranslations[key] || key,
          });
        }
      });
  });
  if (list.length > 1) {
    const first = list[0];
    list[0] = list[1];
    list[1] = first;
  }
  return list;
} 