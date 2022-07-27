import baseSmokeTest from "./features/baseSmokeTest";
import taskCreationTest from "./features/taskCreationTest";
import paginationTest from "./features/paginationTest";
import sortingTest from "./features/sortingTest";
import loginTest from "./features/loginTest";
import taskEditTest from "./features/taskEditTest";
import permissionOnSecondTabTest from "./features/permissionOnSecondTabTest";


describe('Smoke', () => {
    baseSmokeTest();
    taskCreationTest();
    paginationTest();
    sortingTest();
    loginTest();
    taskEditTest();
    permissionOnSecondTabTest();
});
