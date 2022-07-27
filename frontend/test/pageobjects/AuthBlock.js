

import BasePage from './BasePage';
import PopupBlock from './PopupBlock';


/**
 * sub page containing specific selectors and methods for a specific page
 */
class AuthBlock extends BasePage {
    /**
     * define selectors using getter methods
     */
    get loginButton() { return $('#top-login')}
    get popupWindow() { return $('.popup-window.login-popup')}

    get loginBlock() { return $('#login-block')}
    get loginTab() { return $('#tab-login')}
    get setUserTab() { return $('#tab-set-user')}
    get userNameField () { return $('#login-form input[name="name"]')}
    get emailField () { return $('#login-form input[name="email"]')}
    get passwordField () { return $('#login-form input[name="password"]')}
    get submitBtn () { return $('#login-form input[type="submit"]') }
    get unsetBtn () { return $('#login-form input[name="unset"]') }

    get logoutBlock() { return $('#logout-block')}
    get logoutBtn() { return this.logoutBlock.$('[type="submit"]') }

    get note() { return $('#login-form .note')}

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */

    labelFor(name) { return $(`#login-form label[for="${name}"]`)}

    async openPopup() {
        const popup = await this.popupWindow.isDisplayed();
        if (!popup)
            await this.loginButton.click();
        expect(this.popupWindow).toBeDisplayed();
    }

    async openLoginTab() {
        await this.openPopup();
        let cls = await this.loginTab.getAttribute('class');
        cls = (cls.indexOf(' ') !== -1) ? cls.split(/\s+/).map(el => el.trim()) : [cls];
        if ("active" in cls)
            return;
        await this.loginTab.click();
        expect(this.loginTab).toHaveElementClassContaining('active');
    }

    async openSetUserTab() {
        await this.openPopup();
        let cls = await this.setUserTab.getAttribute('class');
        cls = (cls.indexOf(' ') !== -1) ? cls.split(/\s+/).map(el => el.trim()) : [cls];
        if ("active" in cls)
            return;
        await this.setUserTab.click();
        expect(this.setUserTab).toHaveElementClassContaining('active');
    }

    async setUser(name, email) {
        await this.openSetUserTab();
        if (name !== null)
            await this.userNameField.setValue(name);
        if (email !== null)
            await this.emailField.setValue(email);
    }

    async login (name, password) {
        await this.openLoginTab();
        if (name !== null)
            await this.userNameField.setValue(name);
        if (password !== null)
            await this.passwordField.setValue(password);
    }

    async logout () {
        await this.openPopup();
        await this.logoutBtn.click();
    }

    async submit() {
        await this.submitBtn.click();
    }
}

export default new AuthBlock();
