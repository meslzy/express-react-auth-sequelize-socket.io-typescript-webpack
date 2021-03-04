import {ModelCtor, Sequelize} from "sequelize";

import userModel, {UsersInterface} from "./models/user.model";

const db: {
	sequelize: Sequelize,
	models: {
		Users: ModelCtor<UsersInterface> & UsersInterface
	},
	authenticate: () => Promise<void>;
} = {
	sequelize: null,
	models: {
		Users: null,
	},
	authenticate: null
};

db.authenticate = () => new Promise<void>((resolve, reject) => {
	db.sequelize = new Sequelize(process.env.APP_DATABASE, process.env.APP_DATABASE_USERNAME, process.env.APP_DATABASE_PASSWORD, {
		dialect: "postgres",
		logging: process.env.NODE_ENV === "development" ? console.log : false,
	});

	db.sequelize.authenticate().then(() => {
		db.models.Users = userModel(db.sequelize);
		db.sequelize.sync().then(() => resolve()).catch(reject);
	}).catch(reject);
});

export default db;
