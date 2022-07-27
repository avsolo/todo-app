import cfg from "../../config/app.conf";
import { SortBy } from "./constants";


const _i18n = {
    [SortBy.SUMMARY]: { en: "Summary"},
    [SortBy.NAME]: { en: "Name"},
    [SortBy.EMAIL]: { en: "E-Mail"},
    [SortBy.IS_CHECKED]: { en: "Completed"},
    [SortBy.ID]: { en: "ID"},
    password: {en: "Password"}
}

export const i18n = (s) => _i18n?.[s]?.[cfg.LOCALE] || s;
