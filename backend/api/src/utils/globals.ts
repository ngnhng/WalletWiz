export enum Tables {
  USERS = 'users',
  RECEIPTS = 'receipts',
  EXPENSES = 'expenses',
  CATEGORIES = 'categories',
  BUDGETS = 'budgets',
}

export enum UserRoles {
  WEB_ANON = 'web_anon',
  WEB_USER = 'web_user',
  SUPER_USER = 'super',
}

export type Roles = UserRoles;

export type RolesObj = Partial<Record<Roles, boolean>>;

export type RolesType = RolesObj | string[] | string;
