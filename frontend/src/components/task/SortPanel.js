import React, { useContext } from "react";
import { Action, SortBy } from "../../context/constants";
import { TaskContext } from "../../context/TaskContext";
import { i18n } from "../../context/i18n";


const SortPanel = () => {

    const { tasks: { meta }, dispatch } = useContext(TaskContext);

    const onClick = (_by) => dispatch({type: Action.SORT_TASKS, by: _by, reload: true});

    return (
        <div id="sort-block">
            Sorting:&nbsp;
            {Object.values(SortBy).map(v => {
                return (
                    <span className={`item item${v === meta.sort.by ? "-active" : ""}`}
                          data-by={v} key={`#${v}`}
                          onClick={ev => onClick(ev.target.dataset["by"])}
                    >
                        <span className={`order${meta.sort.asc ? '' : ' desc'}`}>
                            <svg width="24px" height="24px"
                                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                            >
                                <g>
                                    <path fill="none" d="M0 0h24v24H0z"/>
                                    <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"/>
                                </g>
                            </svg>
                        </span>
                        {i18n(v)}
                    </span>
                )})
            }
        </div>
    );
}

export default SortPanel;
