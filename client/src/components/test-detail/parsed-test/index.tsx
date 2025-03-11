import React from 'react'
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'

const ParsedTest: React.FC<{ parsedData: any[] }> = ({ parsedData }) => {
  return (
    <div className="my-8 max-h-[50vh]">
      <Typography variant="h6" className="pt-4">
        Výsledky testu:
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(parsedData[0]).map(key => (
                <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {parsedData.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value, cellIndex) => (
                  <TableCell key={cellIndex}>{String(value)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default ParsedTest
