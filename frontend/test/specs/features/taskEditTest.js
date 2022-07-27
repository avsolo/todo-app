import SortBlock from "../../pageobjects/SortBlock";
import TaskBlock from "../../pageobjects/TaskBlock";
import {default as AR} from "@wdio/allure-reporter";
import TaskListBlock from "../../pageobjects/TaskListBlock";
import Client from "../../pageobjects/Client";
import EditTaskBlock from "../../pageobjects/EditTaskBlock";


export default async function taskEditTest() {
    it('Admin should be able to update tasks', async () => {

        // [>] Return to ID:DESC sort for the rest of the the tests
        await SortBlock.sortBy('id');
        await SortBlock.sortBy('id');
        await browser.pause(500);  // To call API
        const chCss = TaskBlock.checkboxCss;

        AR.startStep(`- Для созданной задачи проставить отметку “выполнено”. Перезагрузить страницу.`)
        let task = await TaskListBlock.child(1);
        await task.$(chCss).click();
        await expect(task.$(chCss)).toBeChecked();
        await browser.pause(500);  // To call API

        await browser.refresh();
        task = await TaskListBlock.child(1);
        await Client.waitForProp(task.$(chCss), "checked", true);
        AR.endStep()

        AR.startStep(`Отредактировать текст задачи. Сохранить и перезагрузить страницу. Текст задачи должен быть тот, который ввели при редактировании.`);
        await task.$('.summary').doubleClick();
        let summary = await EditTaskBlock.summaryField.getValue();
        summary = `${summary} - updated`;
        await EditTaskBlock.setSummary(summary);

        await EditTaskBlock.submit();
        await browser.refresh();
        task = await TaskListBlock.child(1);

        await expect(task.$('.summary')).toHaveText(summary);
        AR.endStep();

        AR.startStep(`В общем списке задача должна отображаться уже с двумя отметками: "выполнено" и “отредактировано администратором”.`)
        await expect(task.$(chCss)).toBeChecked();
        await expect(task.$('.updated-by')).toHaveText('Updated by: admin');
        AR.endStep();

        AR.startStep(`Отметка “отредактировано администратором” должна появляться только в случае изменения текста в теле задачи.`)
        task = await TaskListBlock.child(2);
        await task.$('.summary').doubleClick();
        let [name, email] = ['Some new name', 'some@new.email'];
        await EditTaskBlock.setName(name);
        await EditTaskBlock.setEmail(email);
        await EditTaskBlock.submit();
        await task.$('.updated-by').waitForExist({reverse: true});
        AR.endStep();

        AR.startStep(`- В общем списке задача должна отображаться со статусом задачи “выполнено”.`)
        await task.$(chCss).click();
        await expect(task.$(chCss)).toBeChecked();
        AR.endStep()
    });
}