

import BasePage from './BasePage';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class PaginationBlock extends BasePage {
    /**
     * define selectors using getter methods
     */
    get container () { return $('#pagination') }
    get nextBtn () { return $('#pagination .pag-next') }
    get lastBtn () { return $('#pagination .pag-last') }
    get current () { return $('#pagination .current') }
    get prevBtn () { return $('#pagination .pag-prev') }
    get firstBtn () { return $('#pagination .pag-first') }
}

export default new PaginationBlock();
