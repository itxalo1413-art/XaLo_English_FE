import React from 'react';
import { X } from 'lucide-react';

export const AdminPageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm font-medium text-slate-600">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
};

export const AdminCard = ({ children, className = '' }) => {
  return (
    <div className={['bg-white border border-slate-200 rounded-2xl shadow-sm', className].join(' ')}>
      {children}
    </div>
  );
};

export const AdminCardBody = ({ children, className = '' }) => {
  return <div className={['p-5 sm:p-6', className].join(' ')}>{children}</div>;
};

export const AdminTable = ({ columns, rows, emptyText = 'No data.' }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={['px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-500', c.className || ''].join(' ')}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length ? (
              rows.map((row, idx) => (
                <tr key={row.key ?? idx} className="hover:bg-slate-50/60 transition-colors">
                  {columns.map((c) => (
                    <td key={c.key} className={['px-5 py-3 text-sm text-slate-700', c.tdClassName || ''].join(' ')}>
                      {typeof c.render === 'function' ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-sm font-medium text-slate-500">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminButton = ({ variant = 'primary', className = '', ...props }) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition focus:outline-none focus:ring-2 focus:ring-offset-2';

  const styles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
  };

  return <button className={[base, styles[variant] ?? styles.primary, className].join(' ')} {...props} />;
};

export const AdminModal = ({ title, description, children, onClose, footer }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm font-medium text-slate-600">{description}</p>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            aria-label="Close"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer ? (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">{footer}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const AdminField = ({ label, hint, children }) => {
  return (
    <div>
      {label ? <label className="block text-sm font-extrabold text-slate-700 mb-2">{label}</label> : null}
      {children}
      {hint ? <div className="mt-1 text-xs font-semibold text-slate-500">{hint}</div> : null}
    </div>
  );
};

export const AdminInput = ({ className = '', ...props }) => {
  return (
    <input
      className={[
        'w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-900',
        className,
      ].join(' ')}
      {...props}
    />
  );
};

export const AdminTextarea = ({ className = '', ...props }) => {
  return (
    <textarea
      className={[
        'w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-900',
        className,
      ].join(' ')}
      {...props}
    />
  );
};

