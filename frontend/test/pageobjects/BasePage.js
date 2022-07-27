// import cfg from "../app.conf.test";


/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class BasePage {
    /**
    * Opens a sub page of the page
    * @param url absolute url (e.g. /path/to/page.html)
    */

    async open (url) {
        await browser.url(url)
        // await browser.url(`${cfg.APP_URL}${path ? '/' + path : ''}`)
    }
}
