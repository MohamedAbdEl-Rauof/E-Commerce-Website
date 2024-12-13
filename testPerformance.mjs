import puppeteer from 'puppeteer';
import {writeFile} from 'fs/promises';

const urls = [
    'http://localhost:3000',
    'http://localhost:3000/pages/ContactUs',
    'http://localhost:3000/Signup',
    'http://localhost:3000/Signin',
    'http://localhost:3000/pages/Home',
    'http://localhost:3000/pages/Shop',
    'http://localhost:3000/pages/Categories',
    'http://localhost:3000/pages/Product',
    'http://localhost:3000/pages/ProductDetails',

];

(async () => {
    const browser = await puppeteer.launch({headless: true});

    for (const url of urls) {
        const lighthouse = await import('lighthouse');
        const {lhr} = await lighthouse.default(url, {
            port: new URL(browser.wsEndpoint()).port,
            output: 'html',
            logLevel: 'info'
        });

        const reportPath = `./reports/${url.replace('http://localhost:3000', '') || 'home'}.html`;
        await writeFile(reportPath, lhr.report);
        console.log(`Report generated for ${url}: ${reportPath}`);
    }

    await browser.close();
})();
