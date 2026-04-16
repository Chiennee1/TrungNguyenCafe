import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function DataTable<T extends { id: string | number }>({ data, columns }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gold/20">
      <table className="w-full text-left text-sm font-sans">
        <thead className="bg-coffee-50 text-coffee-dark uppercase tracking-wider">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 font-medium border-b border-gold/20">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-paper divide-y divide-gold/10">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-text-muted">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-coffee-50/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-coffee-dark">
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
