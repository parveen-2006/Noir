import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function DataTable({
  columns = [],
  rows = [],
  getRowKey = (_, index) => index,
  emptyState = 'No data found.',
  containerSx = {},
  tableProps = {},
  rowSx = {},
}) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
        borderRadius: 2,
        ...containerSx,
      }}
    >
      <Table aria-label="Data table" {...tableProps}>
        <TableHead sx={{ backgroundColor: '#f8fafc' }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.key || column.label}
                align={column.align || 'left'}
                sx={{
                  color: '#475569',
                  fontWeight: 700,
                  ...column.headerSx,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length ? (
            rows.map((row, index) => {
              const rowKey = getRowKey(row, index);

              return (
                <TableRow key={rowKey} hover sx={rowSx}>
                  {columns.map((column) => (
                    <TableCell
                      key={`${rowKey}-${column.key || column.label}`}
                      align={column.align || 'left'}
                      sx={{
                        color: '#0f172a',
                        ...column.cellSx,
                      }}
                    >
                      {column.render ? column.render(row, index) : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ color: '#64748b', py: 4 }}>
                {emptyState}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
