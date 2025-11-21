import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  CircularProgress,
  Typography,
  TableFooter,
  useTheme,
} from "@mui/material";

const DataTable = ({
  columns = [],
  rows = [], // Changed from 'data' to 'rows' to match parent component
  loading = false,
  emptyMessage = "No data available",
  page = 0,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
}) => {
  const theme = useTheme();

  const renderCellContent = (row, column) => {
    if (!row) return "-";
    if (typeof column.render === "function") return column.render(row);
    if (!column.field) return "-";
    // Handle nested fields with dot notation (e.g., 'user.name')
    const value = column.field
      .split(".")
      .reduce(
        (obj, key) => (obj && obj[key] !== undefined ? obj[key] : null),
        row
      );
    return value !== null && value !== undefined ? value : "-";
  };

  const StyledTableRow = ({ children, ...props }) => (
    <TableRow
      hover
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: theme.palette.grey[50],
        },
        "&:last-child td, &:last-child th": {
          border: 0,
        },
      }}
      {...props}
    >
      {children}
    </TableRow>
  );

  const StyledTableCell = ({ children, ...props }) => (
    <TableCell
      sx={{
        padding: "12px 16px",
      }}
      {...props}
    >
      {children}
    </TableCell>
  );

  const StyledHeaderCell = ({ children, ...props }) => (
    <TableCell
      sx={{
        padding: "12px 16px",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontWeight: 600,
      }}
      {...props}
    >
      {children}
    </TableCell>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
      }}
    >
      <TableContainer>
        <Table stickyHeader aria-label="data table" size="medium">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledHeaderCell
                  key={column.field}
                  align={column.align || "left"}
                >
                  {column.headerName}
                </StyledHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && rows?.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 3 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              rows.map((row, rowIndex) => (
                <StyledTableRow key={row._id || `row-${rowIndex}`}>
                  {columns.map((column, colIndex) => (
                    <StyledTableCell
                      key={`cell-${rowIndex}-${colIndex}-${column.field}`}
                      align={column.align || "left"}
                      sx={column.sx}
                    >
                      {renderCellContent(row, column)}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 50, 100, 150, 200]}
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={(e) =>
                  onRowsPerPageChange(parseInt(e.target.value, 10))
                }
                sx={{
                  "& .MuiTablePagination-toolbar": {
                    padding: "16px",
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      marginBottom: 0,
                    },
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DataTable;
