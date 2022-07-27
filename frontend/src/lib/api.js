import cfg from "../../config/app.conf";


class APIError extends Error {
    constructor(response) {
        super(response.message);
        this.name = "APIError";
        this.code = response?.code || 500;
        this.details = response?.details;
    }
}


const makeParams = (method, body, signal) => {
    let res = { method : method, headers: cfg.API_HEADERS, credentials: "include" };
    if (body)
        res.body = JSON.stringify(body);
    if (signal)
        res.signal = signal;
    return res;
}


const makeQueryString = (params) => {
    return (params && Object.keys(params).length > 0)
        ? `?${new URLSearchParams(params).toString()}`
        : "";
}

const api = {};

api.fetch = (path, method, data) => {
    method = (method) ? method : 'GET';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), cfg.API_TIMEOUT_MS);

    return fetch(`${cfg.API_URL}${path}`, makeParams(method, data, controller.signal))
        .then(r => r.json())
        .catch(e => {
            console.error("Not a JSON", e);
            throw new APIError({"message": "Unable to process server response"});
        })
        .then(j => {
            if (j?.error)
                throw new APIError(j.error);
            return j;
        })
        .finally(() => clearTimeout(timeout));
}


api.create = data => api.fetch(`/tasks/create`, 'POST', data);
api.update = (id, data) => api.fetch(`/tasks/update/${id}`, 'PUT', data);
api.delete = id => api.fetch(`/tasks/delete/${id}`, 'DELETE');
api.filter = params => api.fetch(`/tasks/filter${makeQueryString(params)}`);
api.filterFromMeta = _meta => {
    const params = {
        sort: _meta?.sort?.by || 'id',
        asc: _meta?.sort?.asc || true,
        offset: _meta?.pagination?.offset || 0,
        limit: _meta?.pagination?.limit || 3
    };
    return api.fetch(`/tasks/filter${makeQueryString(params)}`);
}
api.count = () => api.fetch(`/tasks/count`);

api.getUser = () => api.fetch(`/user/get`);
api.setUser = data => api.fetch(`/user/set`, 'POST', data);
api.login = data => api.fetch(`/user/login`, 'POST', data);
api.logout = () => api.fetch(`/user/logout`, 'POST');


export default api;