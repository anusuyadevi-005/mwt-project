import * as React from 'react'

export const Table = ({ children, className }) => <table className={className}>{children}</table>
export const TableHeader = ({ children }) => <thead>{children}</thead>
export const TableBody = ({ children }) => <tbody>{children}</tbody>
export const TableRow = ({ children }) => <tr>{children}</tr>
export const TableHead = ({ children, className }) => <th className={className}>{children}</th>
export const TableCell = ({ children, className }) => <td className={className}>{children}</td>
export const TableFooter = ({ children }) => <tfoot>{children}</tfoot>

export default Table
