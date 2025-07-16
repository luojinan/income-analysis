import type { ChangeEvent } from 'react';

interface IncomeFormProps {
  form: any;
  setForm: (f: any) => void;
  addIncome: () => void;
}

function IncomeForm({ form, setForm, addIncome }: IncomeFormProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 items-end">
      <input
        value={form.owner}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f: any) => ({ ...f, owner: e.target.value }))}
        placeholder="owner"
        className="input input-bordered input-sm"
      />
      <input
        type="datetime-local"
        value={form.time}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f: any) => ({ ...f, time: e.target.value }))}
        placeholder="time"
        className="input input-bordered input-sm"
      />
      <input
        type="number"
        value={form.base_salary}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f: any) => ({ ...f, base_salary: Number(e.target.value) }))}
        placeholder="base_salary"
        className="input input-bordered input-sm"
      />
      <button className="btn btn-primary btn-sm" onClick={addIncome}>添加</button>
    </div>
  );
}

export default IncomeForm; 