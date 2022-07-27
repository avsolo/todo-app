import AuthBlock from "./AuthBlock";
import AddNewBlock from "./AddNewBlock";

class Client {

    async addTaskUnderUser(data) {
        await AuthBlock.setUser(data.user.name, data.user.email);
        await AuthBlock.submit();
        await AddNewBlock.addTask(data.summary);
    }

    async waitForChildNum(element, n) {
        await browser.waitUntil(async () => {
            return await (element.getProperty('childElementCount')) === n;
        }, {timeoutMsg: 'Children number incorrect'});
    }

    async waitForProp(element, property, expected) {
        await browser.waitUntil( async () => await (element.getProperty(property)) === expected);
    }

    async waitForNotExist(el) {
        const emsg = "Unexpected element";
        try {
            await expect(el).toExist();
            throw new Error(emsg);
        } catch (e) {
            if (e.message !== emsg)
                throw e;
        }
    }
}

export default new Client();