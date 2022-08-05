import {default as AR} from "@wdio/allure-reporter";
import AddNewBlock from "../../pageobjects/AddNewBlock";
import AuthBlock from "../../pageobjects/AuthBlock";
import PopupBlock from "../../pageobjects/PopupBlock";
import Client from "../../pageobjects/Client";
import TaskBlock from "../../pageobjects/TaskBlock";
import TaskListBlock from "../../pageobjects/TaskListBlock";
import * as EC from "wdio-wait-for";
import TD from "./testData";


export default async function taskCreationTest() {
    it('Validation should work on task creation', async () => {

        AR.startStep('- Не заполнять поля для новой задачи. Сохранить задачу. Должны вывестись ошибки валидации.')
        await AddNewBlock.submit();
        await expect(AddNewBlock.note).toHaveText("Summary can't be empty");
        AR.endStep();

        AR.startStep(`Ввести в поле email “test”. Должна вывестись ошибка, что email не валиден.`);
        await AuthBlock.setUser(null, "test");
        await AuthBlock.submit();
        await expect(AuthBlock.labelFor("email")).toHaveText( "E-Mail string does not match regex \"^[a-z0-9_.-]+[@][a-z0-9_.-]+\\.[a-z]{2,8}$\"");
        await PopupBlock.close();
        AR.endStep();

        AR.startStep(`- Создать задачку с корректными данными (имя “test”, email “test@test.com”, текст “test job”).`)
        await Client.addTaskUnderUser(TD.task[1]);
        AR.endStep();

        AR.startStep(`Задача должна отобразиться в списке задач. Данные должны быть ровно те, что были введены в поле формы.`);
        await TaskBlock.assertDataEquals(TD.task[1], TaskListBlock.child(1));
        AR.endStep();

        AR.startStep(`После создания задачи должно вывестись оповещение об успехе добавления (обратная связь).`);
        await AddNewBlock.assertSuccessMessage("Created ...");
        AR.endStep();

        AR.startStep(`- Для проверки XSS уязвимости нужно создать задачу с тегами <script... в описании задачи. Задача должна отобразиться в списке задач, при этом не должен всплыть alert c текстом ‘test’.`)
        // (добавить в поле описания задачи текст , заполнить остальные поля).
        await Client.addTaskUnderUser(TD.task[2]);
        await TaskBlock.assertDataEquals(TD.task[2], TaskListBlock.child(1));
        const emsg = "No alert found";
        try {
            await browser.waitUntil(EC.alertIsPresent(), {timeout: 2000, timeoutMsg: emsg});
            expect(emsg).toBe("Unexpected alert");
        } catch (e) {
            expect(e.message).toBe(emsg);
        }
        AR.endStep();
    });
}
