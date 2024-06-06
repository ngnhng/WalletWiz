export enum ONBOARD_TYPE {
    WAITING = 0,
    SKIPPED = 1,
    BLANK = 2
}

export enum ACTIONS {
    SET_THEME = -1,
    ADD_SPENDING = 0,
    EDIT_SPENDING = 1
}

export type Spending = {
    name: string,
    price: number,
    date: Date
}

export type State = {
    pending: Spending[]
}