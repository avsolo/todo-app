import * as EC from "wdio-wait-for";
import BasePage from "./BasePage";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class PopupBlock extends BasePage {
    /**
     * define selectors using getter methods
     */

    get closeBtn() { return $('.popup-window .close-icon') }
    get closeBtnXpath() { return $('.//div[@class="popup-window"]/span[@class="close-icon"]') }
    // get closeBtnXpath() { return $('..//div[@class="popup-window"]/div[@class="close-icon"]') }

    async close() { await (await this.closeBtn).click(); }
    async closeXpath() { await (await this.closeBtnXpath).click(); }
}

export default new PopupBlock();
