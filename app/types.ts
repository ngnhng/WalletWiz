export enum ONBOARD_TYPE {
    WAITING = 0,
    SKIPPED = 1,
    BLANK = 2
}

export enum TOKEN_STATE {
    LOADING = 0,
    NULL = 1,
    AUTHORIZED = 2
}

export enum ACTIONS {
    SET_THEME = -1,
    ADD_SPENDING = 0,
    ADD_MULTIPLE_SPENDINGS = 4,
    EDIT_SPENDING = 1,
    REMOVE_SPENDING = 5,
    CLEAR_SPENDING = 2,
    SET_USER_INFO = 3,
    SET_TOKEN = 999999999
}

export type Spending = {
    name: string,
    price: number,
    date: Date
}

export type Expense = {
    id: string,
    iid: string,
    user_id: string,
    name: string,
    category_id: string,
    amount: number,
    upload_date: string,
    created_at: string,
    updated_at: string
}

export type State = {
    userInfo: {
        id: string,
        firstname: string,
        lastname: string,
        email: string,
        token_version: string,
        budget_reset_day: number,
        budget_limit: number,
        currency: string
    }
    pending: Spending[],
    token: string
}