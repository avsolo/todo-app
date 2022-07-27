

import BasePage from './BasePage';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class SortBlock extends BasePage {
    /**
     * define selectors using getter methods
     */
    get sortBlock () { return $('#sort-block') }

    async sortBy(dataBy) {
        await this.sortBlock.$(`[data-by="${dataBy}"]`).click();
    }
}

export default new SortBlock();
