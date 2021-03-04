import {DataTypes, Sequelize, Model, ModelCtor} from "sequelize";

import * as bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

interface UserAttributes {
	uuid: string,
	username: string,
	email: string,
	password: string,
}

export interface UsersInterface extends Model<UserAttributes, any>, UserAttributes {
	prototype: {
		isExists: (query: string) => Promise<boolean>;
	}
}

const usersModel = (sequelize: Sequelize) => {
	const Users = sequelize.define("users", {
		uuid: {
			primaryKey: true,
			type: DataTypes.UUID,
			unique: true
		},
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}) as ModelCtor<UsersInterface> & UsersInterface;

	Users.beforeCreate((user) => {
		user.username = user.username.toLowerCase();
		user.email = user.email.toLowerCase();
		user.password = bcrypt.hashSync(user.password, 10);
		user.uuid = uuid();
	});

	Users.prototype.isExists = (query) => new Promise<boolean>((resolve) => {
		Users.findOne({where: query}).then((user) => {
			if (user) {
				resolve(true);
			} else {
				resolve(false);
			}
		}).catch(() => resolve(false));
	});

	return Users;
};

export default usersModel;
