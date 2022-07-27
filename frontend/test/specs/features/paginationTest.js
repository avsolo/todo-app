import {default as AR} from "@wdio/allure-reporter";
import Client from "../../pageobjects/Client";
import PaginationBlock from "../../pageobjects/PaginationBlock";
import TD from "./testData";

export default async function paginationTest() {
    it('Pagination should work', async () => {
        AR.startStep(`Создать еще 2 задачи. Должна появиться новая страница в пагинации.`);
        for (let i of [3, 4])
            await Client.addTaskUnderUser(TD.task[i]);

        await expect(PaginationBlock.container).toBeDisplayed();
        await expect(PaginationBlock.nextBtn).toBeClickable();
        await expect(PaginationBlock.lastBtn).toBeClickable();
        await expect(PaginationBlock.lastBtn).toHaveText("2");
        AR.endStep();
    });
}
