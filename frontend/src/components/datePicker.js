import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const DatePicker1 = () => {
    const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker dateFormat="dd/MM/yyyy" selected={startDate} onChange={(date) => setStartDate(date)} />
  )
}

export default DatePicker1