import React from "react";
import TaskContextProvider from "../context/TaskContext";
import AddForm from "./task/AddForm";
import SortPanel from "./task/SortPanel";
import AuthButton from "./auth/AuthButton";
import TaskList from "./task/TaskList";
import Pagination from "./task/Pagination";
import EditForm from "./task/EditForm";


const App = () => {
    return (<>
        <TaskContextProvider>
            <header>
                <div className="center-col">
                    <AddForm />
                    <SortPanel/>
                </div>
                <AuthButton/>
            </header>
            <main className="center-col">
                <TaskList/>
                <Pagination/>
                <EditForm/>
            </main>
        </TaskContextProvider>
    </>);
};

export default App;