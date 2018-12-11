import React, { SyntheticEvent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table, { TableProps } from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { SortDirection, TableCellProps } from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar, { ToolbarProps } from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import styled from 'styled-components';
import { any } from 'async';
import { Tab } from 'material-ui';

const rows = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
  { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
  { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
  { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
  { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' }
];

const desc = (a: any, b: any, orderBy: string) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const stableSort = (array: any[], cmp: Function) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
};

const getSorting = (order: string, orderBy: string) => {
  return order === 'desc'
    ? (a: any, b: any) => desc(a, b, orderBy)
    : (a: any, b: any) => -desc(a, b, orderBy);
};

export interface IGeneralHeaderTableCell {
  id: string;
  numeric: boolean;
  label: string;
  disablePadding: boolean;
}

export interface IGeneralTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount: number;
  rowData: IGeneralHeaderTableCell[];
  onRequestSort: Function;
}

class GeneralTableHead extends React.Component<IGeneralTableHeadProps, {}> {
  createSortHandler = (property: string) => (event: SyntheticEvent) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, rowCount, rowData } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rowData.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

const StyledToolbar = styled(Toolbar)`
  padding-right: 8;
` as React.ComponentType<ToolbarProps>;

const TitleContainer = styled.div`
  flex: 0 0 auto;
`;

const Spacer = styled.div`
  flex: 1 1 100%;
`;

const ActionsContainer = styled.div`
  color: rgba(0, 0, 0, 0.54);
`;

const EnhancedTableToolbar = (props: { tableTitle: string }) => {
  const { tableTitle } = props;

  return (
    <StyledToolbar>
      <TitleContainer>
        <Typography variant="h6" id="tableTitle">
          {tableTitle}
        </Typography>
      </TitleContainer>
      <Spacer />
      <ActionsContainer>
        <Tooltip title="Filter list">
          <IconButton aria-label="Filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </ActionsContainer>
    </StyledToolbar>
  );
};

export interface IGeneralTableProps {
  data: { id: string }[];
  headerRow: IGeneralHeaderTableCell[];
  tableTitle: string;
}

export interface IGeneralTableState {
  order: string;
  orderBy: string;
  page: number;
  rowsPerPage: number;
}

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledPaper = styled(Paper)`
  width: 100%;
  margin-top: 24;
` as React.ComponentType<PaperProps>;

const StyledTable = styled(Table)`
  min-width: 1020;
` as React.ComponentType<TableProps>;

const StyledTableCell = styled<any>(TableCell)`
  background-color: ${props => (props.booleanValue ? '#006b00bf' : '#ff00007d')};
` as any;

class GeneralTable extends React.Component<IGeneralTableProps, IGeneralTableState> {
  state = {
    order: 'asc',
    orderBy: 'title',
    page: 0,
    rowsPerPage: 5
  };

  handleRequestSort = (event: SyntheticEvent, property: string) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleRowClick = (event: SyntheticEvent, id: string) => {
    console.log(`you clicked id: ${id}`);
  };

  handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event: any) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { data, headerRow, tableTitle } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const { id, ...dataWithProperKeys } = data[0];
    const cellKeys = Object.keys(dataWithProperKeys);

    return (
      <StyledPaper>
        <EnhancedTableToolbar tableTitle={tableTitle} />
        <TableWrapper>
          <StyledTable aria-labelledby="tableTitle">
            <GeneralTableHead
              order={order as 'asc' | 'desc'}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              rowData={headerRow}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(rowData => {
                  console.log('rowDataToDisplay:', rowData);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleRowClick(event, rowData.id)}
                      tabIndex={-1}
                      key={rowData.id}
                    >
                      {cellKeys.map((key, cellIndex) => {
                        const cellValue = rowData[key];
                        if (typeof cellValue === 'boolean') {
                          return (
                            <StyledTableCell
                              booleanValue={cellValue}
                              key={`${rowData.id}-${cellIndex}`}
                            >
                              {cellValue.toString()}
                            </StyledTableCell>
                          );
                        }
                        return (
                          <TableCell key={`${rowData.id}-${cellIndex}`}>
                            {cellValue.toString()}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </StyledTable>
        </TableWrapper>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page'
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </StyledPaper>
    );
  }
}

export default GeneralTable;
