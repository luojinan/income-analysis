interface OtherIncomeListProps {
  otherIncomeList: any[];
}

function OtherIncomeList({ otherIncomeList }: OtherIncomeListProps) {
  return (
    <ul>
      {otherIncomeList.map((item, i) => (
        <li key={i}>
          {item.time}
          {item.yearEndBonus && (
            <> 年终奖 {item.yearEndBonus} 换算为月均 {item.yearEndBonusMonthly} </>
          )}
          {item.taxRefund && <> 退税 {item.taxRefund} </>}
        </li>
      ))}
    </ul>
  );
}

export default OtherIncomeList; 