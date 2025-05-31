import React from 'react';
import './styles.css';

export interface ITableColumn {
  name: string;
  label: string;
}

export interface ITableRows {
  [key: string]: string | number | React.ReactNode | undefined;
}

export interface TableProps {
  columns?: ITableColumn[];
  rows?: ITableRows[];
  caption?: string;
}

export function Table({ columns = [], rows = [] }: TableProps) {
  return (
    <div className="table" role="region" aria-label="Tabela">
      <table className="table__container" role="table">
        <thead className="table__head">
          <tr className="table__row">
            {columns.map((column, index) => (
              <th key={index} className="table__header" scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table__body">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="table__row">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="table__cell">
                  {row[column.name]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
