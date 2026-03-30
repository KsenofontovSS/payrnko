interface TableColumn<T> {
  key: keyof T;
  header: string;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  stickyHeader?: boolean;
  striped?: boolean;
  className?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  stickyHeader = false,
  striped = false,
  className = '',
}: TableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse text-left">
        <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
          <tr className="bg-snow border-b-2 border-silver">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-sm font-semibold text-deep-blue"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b border-silver transition-colors duration-200 hover:bg-ice/50 ${
                striped && rowIndex % 2 === 1 ? 'bg-snow' : 'bg-white'
              }`}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-sm text-charcoal">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
