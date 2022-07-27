import React, {useContext, useEffect, useState} from "react";
import {TaskContext} from "../../context/TaskContext";
import {Action} from "../../context/constants";


const Pagination = () => {
    const { dispatch, tasks: { meta: { count, pagination } } } = useContext(TaskContext);
    const [lastPage, setLastPage] = useState(-1);
    const [currentPage, setCurrentPage] = useState(1);
    const [leftBlock, setLeftBlock] = useState(false);
    const [rightBlock, setRightBlock] = useState(false);

    useEffect(() => {
        if (count === -1) return;  // Skip until list is loaded
        setLeftBlock((pagination.offset >= pagination.limit));

        const lp = Math.trunc(count/pagination.limit + (count % pagination.limit ? 1 : 0));
        setLastPage(lp);

        setRightBlock(currentPage < lp);
    }, [count, pagination, currentPage]);

    const clickHandler = (cp) => {
        cp = (cp > 1) ? ( (cp < lastPage) ? cp : lastPage ) : 1;
        dispatch({
            type: Action.UPDATE_TASK_OPTS,
            meta: { pagination: { offset: (cp-1) * (pagination.limit) } }
        });
        setCurrentPage(cp);
    }

    return (<>
        <div id="pagination" className={leftBlock || rightBlock ? "" : " hidden"}>
            <span className={`pag-left${leftBlock ? "" : " disabled"}`}>
                <a disabled={!leftBlock} className="btn pag-first" onClick={_ => clickHandler(1)}>1</a>
                <a disabled={!leftBlock} className="btn pag-prev" onClick={_ => clickHandler(currentPage-1)}>&lt;</a>
            </span>
            <span className="current">&nbsp;{currentPage}&nbsp;</span>
            <span className={`pag-right${rightBlock ? "" : " disabled"}`}>
                <a disabled={!rightBlock} className="btn pag-next" onClick={_ => clickHandler(currentPage+1)}>&gt;</a>
                <a disabled={!rightBlock} className="btn pag-last" onClick={_ => clickHandler(lastPage)}>{lastPage}</a>
            </span>
        </div>
    </>)

}

export default Pagination;
