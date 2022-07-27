import {default as AR} from "@wdio/allure-reporter";
import TaskListBlock from "../../pageobjects/TaskListBlock";
import EditTaskBlock from "../../pageobjects/EditTaskBlock";
import AppPage from "../../pageobjects/AppPage";
import AuthBlock from "../../pageobjects/AuthBlock";
import Client from "../../pageobjects/Client";
import PopupBlock from "../../pageobjects/PopupBlock";


export default async function permissionOnSecondTabTest() {
    it('Login status should be synced among all the tabs', async () => {

        // [+] Open edit window before creating new tab

        AR.startStep(`Открыть параллельно приложение в новой вкладке. Разлогиниться в новой вкладке. В этой вкладке не должно быть возможности редактировать задачу.`)
        await TaskListBlock.child(1).$('.summary').doubleClick();
        await EditTaskBlock.container.isDisplayed();

        const tab1 = await browser.getWindowHandle();
        const _ = await browser.newWindow(AppPage.url);

        await AuthBlock.logout();

        await TaskListBlock.child(1).$('.summary').doubleClick();
        await Client.waitForNotExist(EditTaskBlock.container);
        AR.endStep();

        AR.startStep(`Вернуться в предыдущую вкладку. Отредактировать задачу и сохранить. Отредактированная задача не должна быть сохранена. Приложение должно запросить авторизацию.`)
        await driver.switchToWindow(tab1);

        const prevSummary = await EditTaskBlock.summaryField.getValue();
        await EditTaskBlock.setSummary('abc')
        await EditTaskBlock.submit();

        await expect(EditTaskBlock.note).toHaveText("Authorization is required");
        await expect(PopupBlock.closeBtnXpath).toBeClickable();  // close();
        await PopupBlock.closeBtnXpath.click();

        // [+] Check value was not changed
        await expect(TaskListBlock.child(1).$('.summary')).toHaveText(prevSummary);
        AR.endStep();
    });
}