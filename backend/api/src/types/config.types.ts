export type ApplicationConfig = {
    port: number;
	repository: RepositoryConfig;
};

export type RepositoryConfig = {
	type: string;
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
};


