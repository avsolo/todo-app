

import BasePage from './BasePage';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class TaskListBlock extends BasePage {
    /**
     * define selectors using getter methods
     */
    get list() { return $('#task-list') }
    child(n) { return $(`.//div[@id="task-list"]/div[contains(@class, "task")][${Number.parseInt(n)}]`); }
}

export default new TaskListBlock();
