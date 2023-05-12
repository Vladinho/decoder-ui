const ResultsTable = ({ answers, words }) => {
    const wordsColumns = [[], [], [], []];
    answers.forEach((i) => {
        const code = i.code.split('');
        code.forEach((c, index) => {
            wordsColumns[+c - 1].push(i.answer[index])
        });
    })
    const wordsRows = [];
    for(let i = 0; i < wordsColumns.length; i++) {
        for(let j= 0; j < wordsColumns.length; j++) {
            wordsRows[j] = wordsRows[j] || [];
            wordsRows[j][i] = wordsColumns[i][j];
        }
    }
    const rows = wordsRows.filter((r) => r.some(i => i));
    return <table className="table">
        <thead>
        <tr>
            <th scope="col">#</th>
            { words.map(i => <th key={i} scope="col">{i}</th>) }
        </tr>
        </thead>
        <tbody>
        {
            rows.map((i, index) => <tr key={i.join('')}>
                <th scope="row">{index + 1}</th>
                {i.map(j => <td key={j}>{j}</td>)}
            </tr>)
        }

        </tbody>
    </table>
}

export default ResultsTable;