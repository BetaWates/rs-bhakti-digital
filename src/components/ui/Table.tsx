import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/shared/Icon";

export interface Column<T = any> {
  key: string;
  label: string;
  render?: (value: any, item: T, index: number) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
}

export interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T, index: number) => void;
  emptyMessage?: string;
  emptyIcon?: IconName | ReactNode;
  className?: string;
  loading?: boolean;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  emptyMessage = "Tidak ada data yang ditemukan.",
  emptyIcon = "search",
  className = "",
  loading = false,
}: TableProps<T>) {
  const getAlignClass = (align?: "left" | "center" | "right") => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  return (
    <div className={`w-full overflow-hidden border border-[#e4e9ef] rounded-lg bg-white shadow-xs ${className}`.trim()}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs text-left">
          <thead>
            <tr className="border-b border-[#e4e9ef] bg-[#f8fafb]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`py-3 px-4 font-semibold text-[#5e6d81] tracking-tight ${getAlignClass(
                    col.align
                  )} ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0f4]">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-[#64748b]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Icon name="refreshCw" size={24} className="animate-spin text-[#0d9488]" />
                    <span className="font-medium text-xs">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-[#64748b]">
                  <div className="flex flex-col items-center justify-center gap-2 max-w-xs mx-auto">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      {typeof emptyIcon === "string" ? (
                        <Icon name={emptyIcon as IconName} size={20} />
                      ) : (
                        emptyIcon
                      )}
                    </div>
                    <p className="font-medium text-xs text-[#27354b]">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const isClickable = !!onRowClick;
                return (
                  <tr
                    key={item.id || index}
                    onClick={() => onRowClick && onRowClick(item, index)}
                    className={`transition-colors ${
                      isClickable
                        ? "cursor-pointer hover:bg-[#f6f9fb] active:bg-[#edf2f7]"
                        : "hover:bg-[#fafbfc]"
                    }`}
                  >
                    {columns.map((col) => {
                      const cellValue = item[col.key];
                      return (
                        <td
                          key={col.key}
                          className={`py-3.5 px-4 text-[#27354b] align-middle ${getAlignClass(
                            col.align
                          )} ${col.className || ""}`}
                        >
                          {col.render ? col.render(cellValue, item, index) : cellValue ?? "-"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
