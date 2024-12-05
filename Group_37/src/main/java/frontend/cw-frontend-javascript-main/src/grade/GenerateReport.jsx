import React, { useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../config";

const GenerateReport = ({ studentId }) => {
    const [isLoading, setIsLoading] = useState(false);

    const downloadReport = () => {
        if (!studentId) {
            alert("Invalid student ID. Unable to download report.");
            return;
        }

        setIsLoading(true);
        axios
            .get(`${API_ENDPOINT}/reports/student/${studentId}`, {
                responseType: "blob",
                headers: { Accept: "application/pdf" },
                timeout: 10000,
            })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `student_report_${studentId}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error("Error downloading report:", error);
                alert("Failed to download the report. Please try again later.");
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <button
            onClick={downloadReport}
            disabled={isLoading}
            aria-label={`Download report for student ID ${studentId}`}
        >
            {isLoading ? "Downloading..." : "Download Report"}
        </button>
    );
};

export default GenerateReport;
