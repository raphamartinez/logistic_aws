const puppeteer = require('puppeteer')


class WebScraping {


    async init() {
        try {
            const browser = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox'],
            });
            
            const page = await browser.newPage();
            await page.goto('http://dvrveicular.i9techx.com.br/');
            await page.type('#user', "diana.saraiva");
            await page.type('#passw', "ola001");
            await page.click('#submit');
            await page.waitForNavigation();

            const sessionStorage = await page.evaluate(() => Object.assign({}, window.sessionStorage));
            const session = sessionStorage["wialon_sid"];
            
            await page.close();
            await browser.close();

            return session;
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = new WebScraping