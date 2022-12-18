import React from "react";
import Button from "react-bootstrap/Button";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const ExportCSV = ({ csvData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData, fileName) => {
    let ws = XLSX.utils.json_to_sheet(csvData);
    var wscols = [{ wch: 20 }, { wch: 20 }, { wch: 20 }];
    for (let index = 0; index < Object.keys(csvData[0]).length; index++) {
      console.log(1);
      wscols.push({ wch: 20 });
    }

    ws["!cols"] = wscols;

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button variant="warning" onClick={(e) => exportToCSV(csvData, fileName)}>
      Xuất file
    </Button>
  );
};

export default ExportCSV;
