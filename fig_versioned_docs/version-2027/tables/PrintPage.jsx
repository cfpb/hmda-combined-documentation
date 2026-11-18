import React from "react";

const PrintPage = () => {
    const handlePrint = () => {
        window.print()
    }

    return (
        <a className="printBtn" onClick={handlePrint}>
            Print PDF
        </a>
    )
}

export default PrintPage