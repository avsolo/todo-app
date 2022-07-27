import {default as AR} from "@wdio/allure-reporter";
import AuthBlock from "../../pageobjects/AuthBlock";
import PopupBlock from "../../pageobjects/PopupBlock";
import TaskListBlock from "../../pageobjects/TaskListBlock";


export default async function loginTest() {
    it('Login should work only for registered users', async () => {

        const checkBoxCss = '[type="checkbox"]';

        AR.startStep(`- Попробовать залогиниться с пустыми полями. Должна вывестись ошибка, что поля обязательны для заполнения или, что введенные данные не верные.`);
        await AuthBlock.login("", "");
        await AuthBlock.submit();
        await expect(AuthBlock.labelFor("name")).toHaveText("Name can't be empty");
        await expect(AuthBlock.labelFor("password")).toHaveText("Password can't be empty");
        AR.endStep();

        AR.startStep(`Ввести в поле для имени пользователя “admin1”, в поле для пароля “321”. Должна вывестись ошибка о неправильных реквизитах доступа. Админский доступ не должен быть предоставлен.`);
        await AuthBlock.login("admin1", "321");
        await AuthBlock.submit();
        await expect(AuthBlock.note).toHaveText("Logging in failed");
        await PopupBlock.close();
        await expect(TaskListBlock.child(1).$(checkBoxCss)).toHaveAttr("disabled");
        AR.endStep();

        AR.startStep(`
            Ввести данные “admin” в поле для имени и “123” в поле для пароля.
            Авторизация должна пройти успешно.
            Должна отобразиться кнопка для выхода из профиля админа.
        `);
        await AuthBlock.login("admin", "123");
        await AuthBlock.submit();

        await expect(AuthBlock.loginButton).toHaveText("admin");
        await expect(TaskListBlock.child(1).$(checkBoxCss)).not.toHaveAttr("disabled");

        await AuthBlock.loginButton.click();
        await expect(AuthBlock.logoutBlock.$('input[type="submit"]')).toHaveValue("Log out");
        await PopupBlock.close();
        AR.endStep();
    });
}