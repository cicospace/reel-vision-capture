
import React from 'react';

interface Column<T> { 
  header: string; 
  accessor: keyof T; 
}

export function Table<T>({ columns, data }: { columns: Column<T>[]; data: T[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map(col => (
            <th 
              key={String(col.accessor)} 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, i) => (
          <tr key={i} className="hover:bg-gray-50">
            {columns.map(col => (
              <td 
                key={String(col.accessor)} 
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
              >
                {String(row[col.accessor] || '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
