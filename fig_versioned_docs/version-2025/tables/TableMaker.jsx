import React from 'react'
import { useTable } from 'react-table'
import CsvDownloadButton from 'react-json-to-csv'



export const TableMaker = ({ jsonData, tableNumber, tableName }) => {
    // Define columns based on the keys of the first object in the JSON data
    const columns = React.useMemo(
      () => Object.keys(jsonData[0]).map((key) => ({ Header: key, accessor: key })),
      []
    );
  
    // Create a table instance
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
      columns,
      data: jsonData,
    });

    const Cell = ({ cell, column }) => {
        const cellValue = cell.value.toString()
        const columnKey = cell.column.id
        let modifiedValue = cellValue
        if (columnKey == 'Valid Values') {
          modifiedValue = cellValue
            .replace(/(\d+) /g, '$1<br>') // Add <br> after digit-space
        } 
        else if (columnKey == 'Descriptions and Examples' || columnKey == 'Affected Data Fields') {
          modifiedValue = cellValue
            .replace(/ (\d+)\. /g, '<br>$1. ') // Add <br> before space-digit-period-space
            .replace(/: (\d+);/g, ': $1;<br>') // Add <br> after colon-space-digit-semicolon
        } 
        else if (columnKey == 'Edit Description') {
          modifiedValue = cellValue
            .replace(/ (\d+)\)/g, '<br>$1) ') // Add <br> before space-digit-period-space
        }
        else if (columnKey == 'Data Field Number') {
          modifiedValue = '<span class="anchor anchorWithStickyNavbar_LWe7" id="table' + tableNumber + '-' + cellValue + '">' + cellValue + '</span>' + '<a class="hash-link" href="#table' + tableNumber + '-' + cellValue + '"></a>'
        }
        else if (columnKey == "Edit ID") {
          modifiedValue = '<span class="anchor anchorWithStickyNavbar_LWe7" id="edit-' + cellValue + '">' + cellValue + '</span>' + '<a class="hash-link" href="#edit-' + cellValue + '"></a>'
        }
        
        return <div dangerouslySetInnerHTML={{ __html: modifiedValue }} />;
    };
  
    return (
      <div className='react-table'>
        <div className='export-csv'>
          <CsvDownloadButton
            className="btn-csv"
            data={jsonData}
            filename={'table' + tableNumber + ".csv"}
            delimiter=","
          >
            Export CSV
          </CsvDownloadButton>
        </div>
        <table {...getTableProps()} className={'table' + tableNumber}>
          <thead>
            <tr className="table-name">
              <th colSpan={columns.length}>{tableName}</th>
            </tr>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                  prepareRow(row);
                  return (
                  <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>
                          <Cell cell={cell} />
                      </td>
                      ))}
                  </tr>
                  );
              })}
          </tbody>
        </table>
      </div>
      
    );
  };
