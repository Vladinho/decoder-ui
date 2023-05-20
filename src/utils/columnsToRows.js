function columnsToRows(columns) {
    const r = [];
    columns.forEach((c, columnIndex) => {
        c.forEach((word, rowIndex) => {
            if (!r[rowIndex]) {
                r[rowIndex] = ['', '', '', '']
            }
            r[rowIndex][columnIndex] = word;
        })
    })

    return r;
}

export default columnsToRows;