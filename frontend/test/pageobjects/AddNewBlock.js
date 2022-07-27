

import BasePage from './BasePage';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class AddNewBlock extends BasePage {
    /**
     * define selectors using getter methods
     */
    get inputForm() { return $('#top-input') }
    get note() { return $('#top-input div.note') }
    get inputField() { return $('#top-input input[name="current"]') }

    async addTask(string) {
        await expect(this.inputField).toBeClickable();
        await (await this.inputField).click();
        await browser.keys(string);
        await browser.keys('Enter');
    }

    async submit() {
        await (await this.inputField).click();
        await browser.keys('Enter');
    }

    async assertSuccessMessage(msg) {
        await expect(this.inputForm).toHaveElementClassContaining("success");
        await expect(this.inputField).toHaveAttribute("placeholder", msg);
    }
}

export default new AddNewBlock();
