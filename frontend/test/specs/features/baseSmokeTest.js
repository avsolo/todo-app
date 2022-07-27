import AppPage from "../../pageobjects/AppPage";
import Client from "../../pageobjects/Client";
import TaskListBlock from "../../pageobjects/TaskListBlock";
import {default as AR} from "@wdio/allure-reporter";
import AddNewBlock from "../../pageobjects/AddNewBlock";
import AuthBlock from "../../pageobjects/AuthBlock";


export default async function baseSmokeTest() {
    it('App page should load without errors', async () => {
        await browser.setTimeout({ 'script': 1200000 });

        // - Перейти на стартовую страницу приложения.
        await AppPage.open();
        await Client.waitForChildNum(TaskListBlock.list, 0);

        // Должен отобразиться список задач
        // В списке присутствуют поля: имя пользователя, email, текст задачи, статус.
        // [>]: Нет задач, нет полей.

        // Не должно быть опечаток. Зазоры должны быть ровные. Ничего не ползет.
        let stepName = 'Должна быть возможность создания новой задачи.'
        AR.startStep(`Должна быть возможность создания новой задачи.`)
        await expect(AddNewBlock.inputField).toBeDisplayed();
        AR.endStep();

        AR.startStep(`Должна быть кнопка для авторизации.`)
        await expect(AuthBlock.loginButton).toBeDisplayed();
        AR.endStep();
    });
}