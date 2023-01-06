const express = require('express');
const puppeteer = require('puppeteer');
const hbs = require('handlebars')
const fs = require('fs-extra')
const path = require('path')
const data = require('./data.json')

const app = express();
const PORT = 3000;

const compile = async function (templateName, data) {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`)

    const html = await fs.readFile(filePath, 'utf8')
    return hbs.compile(html)(data)
};

app.get('/', (req, res)=>{
    (async function () {
        try {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            const content = await compile('index', data)
            await page.setContent(content)
            await page.pdf({
                path: 'output.pdf',
                format: 'A4',
                printBackground: true
            })
            console.log("done creating pdf")
            await browser.close()
            process.exit()
        } catch (e) {
            console.log(e)
        }
    })();
	res.status(200);
	res.send("PDf generated successfully!");
});

app.listen(PORT, (error) =>{
	if(!error)
		console.log("Server is Successfully Running, and App is listening on port "+ PORT)
	else
		console.log("Error occurred, server can't start", error);
	}
);
