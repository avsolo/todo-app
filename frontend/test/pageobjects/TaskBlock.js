

import BasePage from './BasePage';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class TaskBlock extends BasePage {
    /**
     * define selectors using getter methods
     */

    get checkboxCss() { return '[type="checkbox"]' }
    checkboxFor(task) { return task.$(this.checkboxCss); }

    async assertDataEquals(data, task) {
        await expect(task.$('.summary')).toHaveText(data.summary);
        const username = `${data.user.name} <${data.user.email}>`;
        await expect(task.$('.meta .user-name')).toHaveText(username);
    }
}

export default new TaskBlock();
