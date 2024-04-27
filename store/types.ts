export type User = {
	isLoggedIn: boolean;
	isOnboarded: boolean;

	// User data
	email: string | undefined;
	username: string | undefined;
	avatar: string | undefined;
}