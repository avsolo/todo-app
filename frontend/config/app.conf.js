import localCfg from "./app.conf.local"

const defaultCfg = {
    APP_URL: 'http://localhost:9000',
    API_URL: '/api',
    API_TIMEOUT_MS: 5000,
    API_HEADERS: { "Content-Type": "application/json" },
    FLASH_TIMEOUT_MS: 3000,
    LOCALE: "en",

    TEST_DATA_DIR: "./test-data.tmp"
};

const cfg = Object.assign({}, defaultCfg, localCfg);

export default cfg;