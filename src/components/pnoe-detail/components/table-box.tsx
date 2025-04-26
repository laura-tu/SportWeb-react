import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'

interface TableBoxProps {
  title: string
  data: { label: string; value: string | number | null }[]
}

const TableBox: React.FC<TableBoxProps> = ({ title, data }) => {
  return (
    <div className="pl-6">
      <TableContainer component={Paper} className="flex max-w-96 flex-1">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>{title}</strong>
              </TableCell>
              <TableCell>
                <strong>Hodnota</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(({ label, value }, index) => (
              <TableRow key={index}>
                <TableCell>{label}</TableCell>
                <TableCell>{value ?? 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default TableBox
