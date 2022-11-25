/* eslint-disable no-undef */
import React from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

const CustomTable = ({
  data,
  title,
  isPagination,
  // {
  //     dataKey= '',
  //     displayName= null,
  //     custom= () => {},
  //     fixedWidth= 100,
  //     style= {},
  // }
}) => {
  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr
            style={{
              textAlign: "center",
            }}
          >
            {title.map((item, index) => {
              return (
                <td key={index}>
                  <b>{item.displayName || item.dataKey}</b>
                </td>
              );
            })}
          </tr>
        </thead>
        <tbody className="centerize-table">
          {
            //row
            data &&
              title &&
              data.map((med, index) => {
                return (
                  <tr
                    key={index}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {
                      //collumn
                      title.map((col, colIndex) => {
                        //display data has in title arr
                        //then display custom if exist
                        return (
                          med[col.dataKey] !== null &&
                          (col.custom ? (
                            <td key={colIndex}>
                              {col.custom(med[col.dataKey], med)}
                            </td>
                          ) : (
                            <td
                              key={colIndex}
                              style={
                                //custom style
                                (col.style || col.fixedWidth) && {
                                  ...col?.style,
                                  width:
                                    col.fixedWidth && `${col.fixedWidth}px`,
                                }
                              }
                            >
                              {med[col.dataKey]}
                            </td>
                          ))
                        );
                      })
                    }
                  </tr>
                );
              })
          }
        </tbody>
      </Table>
      {isPagination && <>{/*pagination*/}</>}
    </>
  );
};

export default CustomTable;
