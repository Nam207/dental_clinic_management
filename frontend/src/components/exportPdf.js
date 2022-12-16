import React, { useState, useEffect, Component } from "react";
import axios from "../apis/api";

const Pdf = () => {

    const { pdfFile, setPdfFile } = useState("");
    const getClinic = async () => {
        const response = await axios
            .get(
                `/api/invoice`, {
                responseType: 'arraybuffer',
                headers: {
                    Accept: 'application/pdf',
                },
            }
            )
            .then(async (response) => {
                const pdfBlod = new Blob([response], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(pdfBlod);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute('download', 'invoice.pdf'); //or any other extension
                document.body.appendChild(link);
                link.click();
                const pdfWindow = window.open();
                pdfWindow.location.href = url; 
            });
    };

    useEffect(() => {
        getClinic()
    }, []);

    return (
        <>{pdfFile}</>
    )
}

export default Pdf;