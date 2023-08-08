function columnsToRows(columns) {
    const r = [];
    columns.forEach((c, columnIndex) => {
        c.reverse().forEach((word, rowIndex) => {
            if (!r[rowIndex]) {
                r[rowIndex] = ['', '', '', '']
            }
            r[rowIndex][columnIndex] = word;
        })
    })

    return r;
}

export default columnsToRows;