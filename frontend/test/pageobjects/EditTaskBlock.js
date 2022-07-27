

import BasePage from './BasePage';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class AddNewBlock extends BasePage {
    /**
     * define selectors using getter methods
     */
    get container() { return $('form#task-edit') }
    get summaryField() { return this.container.$('input[name="summary"]') }
    get nameField() { return this.container.$('input[name="name"]') }
    get emailField() { return this.container.$('input[name="email"]') }
    get note() { return this.container.$('.note') }
    get idField() { return this.container.$('input[name="id"]') }
    get submitBtn() { return this.container.$('input[type="submit"]') }

    async __typeKeys(_keys) {
        for (let _key of _keys) {
            await browser.keys(_key);
            await browser.pause(100);
        }
        await browser.pause(100);
    }

    /**
     * React-controlled component workaround
     */
    async __setField(field, string) {
        await field.click();
        await this.__typeKeys([['Control', 'a'], ['Backspace']]);
        await expect(field).toHaveValue("");
        await this.__typeKeys(string.split(''));
        await expect(field).toHaveValue(string);
    }

    async setSummary(string) { await this.__setField(await this.summaryField, string) }
    async setName(string) { await this.__setField(this.nameField, string) }
    async setEmail(string) { await this.__setField(this.emailField, string) }
    async submit() { await this.submitBtn.click() }

}

export default new AddNewBlock();
