import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * Renders a semantic table on tablet/desktop and a stack of cards on phones,
 * so wide data never forces horizontal page scrolling.
 *
 * columns: [{ key, label, render?: (row) => node, align?, primary?: boolean }]
 */
export default function ResponsiveTable({
  columns,
  rows,
  getRowKey = (r) => r.id,
  caption,
  empty,
}) {
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
  const cell = (col, row) => (col.render ? col.render(row) : row[col.key]);

  if (rows.length === 0) return empty ?? null;

  if (isPhone) {
    const primary = columns.find((c) => c.primary) ?? columns[0];
    return (
      <Stack
        spacing={1.5}
        component="ul"
        sx={{ listStyle: 'none', p: 0, m: 0 }}
        aria-label={caption}
      >
        {rows.map((row) => (
          <Card key={getRowKey(row)} component="li">
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }} component="div">
                {cell(primary, row)}
              </Typography>
              <Box
                component="dl"
                sx={{
                  m: 0,
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  columnGap: 2,
                  rowGap: 1,
                }}
              >
                {columns
                  .filter((c) => c !== primary)
                  .map((col) => (
                    <React.Fragment key={col.key}>
                      <Typography component="dt" variant="body2" color="text.secondary">
                        {col.label}
                      </Typography>
                      <Box component="dd" sx={{ m: 0, minWidth: 0, typography: 'body2' }}>
                        {cell(col, row)}
                      </Box>
                    </React.Fragment>
                  ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <TableContainer>
      <Table size="small" sx={{ '& td, & th': { py: 1.25 } }}>
        {caption && (
          <caption
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              overflow: 'hidden',
              clip: 'rect(0 0 0 0)',
            }}
          >
            {caption}
          </caption>
        )}
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} align={col.align}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowKey(row)} hover>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align}>
                  {cell(col, row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
