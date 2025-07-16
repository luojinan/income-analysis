import React from 'react';

interface TableProps {
  incomeDataList: Record<string, any>[];
  excludeFields?: string[];
  fieldTranslations?: Record<string, string>;
}

const defaultExcludeFields = ['id', 'owner', 'created_at', 'updated_at'];

const Table: React.FC<TableProps> = ({ incomeDataList, excludeFields = [], fieldTranslations = {} }) => {
  if (!incomeDataList.length) return <div>暂无数据</div>;

  // 获取所有字段并过滤
  const allFields = Object.keys(incomeDataList[0]).filter(
    (field) => ![...defaultExcludeFields, ...excludeFields].includes(field)
  );

  // 表头翻译
  const headers = allFields.map(
    (field) => fieldTranslations[field] || field
  );

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

  // 行数据
  const rows = incomeDataList.map((item) => {
    return allFields.reduce((res, field) => {
      let value = item[field] ?? '-';
      // 如果字段名包含 time 或 date，且值为字符串，尝试格式化
      if (
        typeof value === 'string' &&
        /time|date/i.test(field) &&
        !isNaN(new Date(value).getTime())
      ) {
        value = formatDateTime(value);
      }
      res[field] = value;
      return res;
    }, {} as Record<string, any>);
  });

  return (
    <table className="table table-zebra w-full text-xs">
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {allFields.map((field, colIdx) => (
              <td key={colIdx} className="px-2 text-center">
                {typeof row[field] === 'number' ? row[field].toLocaleString() : row[field]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx}>{header}</th>
          ))}
        </tr>
      </tfoot>
    </table>
  );
};

export default Table; 