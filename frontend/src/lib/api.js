import cfg from "../../config/app.conf";


class APIError extends Error {
    constructor(message, code, detail) {
        super(message);
        this.name = "APIError";
        this.code = code || 500;
        this.detail = detail;
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
        .then(r => r.json().then(j => {
            j._response = r;
            return j;
        }))
        .catch(e => {
            console.error("Not a JSON", e);
            throw new APIError("Unable to process server response");
        })
        .then(json => {
            if (! (json._response.ok) || json?.detail)
                throw new APIError(json._response.statusText, json._response.status, json?.detail);
            return json;
        })
        .finally(() => clearTimeout(timeout));
}


api.create = data => api.fetch(`/tasks/create`, 'POST', data);
api.update = (id, data) => api.fetch(`/tasks/update/${id}`, 'PUT', data);
api.filter = params => {
    console.debug("api.filter", params);
    return api.fetch(`/tasks/filter${makeQueryString(params)}`);
}
api.getUser = () => api.fetch(`/user/get`);
api.setUser = data => api.fetch(`/user/set`, 'POST', data);
api.login = data => api.fetch(`/user/login`, 'POST', data);
api.logout = () => api.fetch(`/user/logout`, 'POST');


export default api;