interface IncomeStatsProps {
  totalInfo: Record<string, number | undefined>;
  keyTranslations: Record<string, string>;
}

function IncomeStats({ totalInfo, keyTranslations }: IncomeStatsProps) {
  return (
    <>
      <h3 className="mt-4 text-center">统计信息</h3>
      <ul>
        {Object.entries(totalInfo).map(([key, val]) => (
          <li key={key}>
            {keyTranslations[key] || key}：<span className="text-primary font-bold">{val?.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default IncomeStats; 