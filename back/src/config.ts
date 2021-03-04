export default (dev: boolean) => new Promise<void>(resolve => {
	const common = {
		APP_ACCESS_SECRET: "2b068431-df77-4033-ac7c-15a46cd312d2",
		APP_REFRESH_SECRET: "Ng2n-aIk70-x4TuXP4e15Q",
	};

	const development = {
		APP_DATABASE: "postgres",
		APP_DATABASE_USERNAME: "postgres",
		APP_DATABASE_PASSWORD: "0103",
	};

	const production = {};

	for (const [key, value] of Object.entries(Object.assign({}, common, dev ? development : production))) {
		process.env[key] = value;
	}

	resolve();
});
