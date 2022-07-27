import cfg from '../../config/app.conf';
import BasePage from './BasePage';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class AppPage extends BasePage {
    /**
     * define selectors using getter methods
     */
    get url() { return cfg.APP_URL }
    async open() { return super.open(this.url) }
}

export default new AppPage();
