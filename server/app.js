const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
// write your logging code here

    const agent = req.headers['user-agent'].replace(',',' '); //(some user-agent strings may contain commas)
    const time = new Date().toISOString(); // use the ISO date standard
    const method = req.method;
    const resource = req.originalUrl;
    const version = "HTTP/" + req.httpVersion;
    const status = res.statusCode;
    const log = `${agent},${time},${method},${resource},${version},${status}\n`;
    console.log(log);
    fs.appendFile( 'log.csv', log, err => {if (err) throw err;} );
    next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here

    res.status(200).send('ok');
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here

    fs.readFile( 
        './log.csv', 
        'utf8', 
        (err, csv) => {
            if (err) throw err;
            res.json( csvToJson( csv ) );
        }
    );
});

const header = ['Agent','Time','Method','Resource','Version','Status']
function csvToJson(csv) {
    const rows = csv.split('\n');
    let json = [];
    rows.forEach( (rowVal,i) => {
        let line = {};
        const col = rowVal.split(',');
        header.forEach( (hval,k) => {
            line[hval] = col[k];
        });
        json.push(line);
    });
    return json;
}

module.exports = app;
