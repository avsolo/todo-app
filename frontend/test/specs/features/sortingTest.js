import TaskListBlock from "../../pageobjects/TaskListBlock";
import {default as AR} from "@wdio/allure-reporter";
import SortBlock from "../../pageobjects/SortBlock";
import PaginationBlock from "../../pageobjects/PaginationBlock";
import Client from "../../pageobjects/Client";
import TD from "./testData";


export default async function sortingTest() {
    it('Sorting should work', async () => {
        // [?] Сортировка по умолчанию = ID DESC
        for (let [i, j] of Object.entries({1: 4, 2: 3, 3: 2}))
            await expect(TaskListBlock.child(i).$('.summary')).toHaveText(TD.task[j].summary);

        AR.startStep(`Sorting by "name" should work`);
        await assertSort('name', {1: 1, 2: 2, 3: 3}, 4, 4);
        AR.endStep();

        // Проделать этот тест для полей “email” и “статус”.
        AR.startStep(`Sorting by "email" should work`);
        await assertSort('email', {1: 4, 2: 1, 3: 2}, 3, 3);
        AR.endStep();

        AR.startStep(`Sorting by "isChecked" should work`);
        await assertSort('isChecked', {1: 1, 2: 2, 3: 3}, 4, 1);
        AR.endStep();
    });
}


async function assertSort(byName, asc, last, first) {
    const [testSelector, testField] = ['.summary', 'summary'];

    AR.startStep(`Отсортировать список по полю “${byName}” по возрастанию. Список должен пересортироваться`);
    await SortBlock.sortBy(byName);
    for (let [i, j] of Object.entries(asc))
        await expect(TaskListBlock.child(i).$(testSelector)).toHaveText(TD.task[j][testField]);
    AR.endStep();

    AR.startStep(`Перейти на последнюю страницу в пагинации. Сортировка не должна сбиться, задачи с последней страницы должны быть отображены.`)
    await PaginationBlock.lastBtn.click();
    await expect(TaskListBlock.list).toHaveChildren(1);
    await expect(TaskListBlock.child(1).$(testSelector)).toHaveText(TD.task[last][testField]);
    AR.endStep();

    AR.startStep(`Далее отсортировать по тому же полю, но по убыванию. Перейти на первую страницу. Имя пользователя, которое было последним в списке, должно стать первым.`);
    await SortBlock.sortBy(byName);
    await PaginationBlock.firstBtn.click();
    await Client.waitForChildNum(TaskListBlock.list, 3);
    await expect(TaskListBlock.child(1).$(testSelector)).toHaveText(TD.task[first][testField]);
    AR.endStep();
}