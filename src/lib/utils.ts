function isClient (): boolean {
	return typeof window !== "undefined";
}

function isServer (): boolean {
	return !isClient();
}

export default { isClient, isServer }