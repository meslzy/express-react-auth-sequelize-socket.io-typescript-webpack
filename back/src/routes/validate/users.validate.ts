import * as express from "express";

import db from "../../sequelize";
import * as bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

export const token = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
	const token = request.headers.authorization;

	const vToken = async () => {
		if (token) {
			const secret = process.env.APP_ACCESS_SECRET;

			return jsonwebtoken.verify(token.split(" ")[1], secret, (err, data: any | undefined) => {
				if (err) return {token: "invalid"};

				response.locals.uuid = data.uuid;
				return null;
			});
		}

		return {token: "required"};
	};
	const vUuid = async () => {
		if (response.locals.uuid) {
			const exists = await db.models.Users.prototype.isExists({uuid: response.locals.uuid});

			return exists ? null : {uuid: "invalid"};
		}

		return null;
	};

	const errors = Object.assign({}, await vToken(), await vUuid());

	Object.keys(errors).length === 0 ? next() : response.status(400).json(errors);
};

export const sign_in = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
	const {username, password} = request.body;

	const vUsername = async () => {
		if (username) {
			response.locals.user = await db.models.Users.findOne({where: {username}}) ?? await db.models.Users.findOne({where: {email: username}});
			return response.locals.user ? null : {username: "invalid"};
		}

		return {username: "required"};
	};
	const vPassword = async () => {
		if (password) {
			if (response.locals.user) {
				return bcrypt.compareSync(password, response.locals.user.password) ? null : {password: "invalid"};
			}

			return null;
		}

		return {password: "required"};
	};

	const errors = Object.assign({}, await vUsername(), await vPassword());

	Object.keys(errors).length === 0 ? next() : response.status(400).json(errors);
};
export const sign_up = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
	const {username, email, password} = request.body;

	const vUsername = async () => {
		if (username) {
			const regex = (/^[a-zA-Z]+([_.]?[a-zA-Z0-9])*$/g);

			if (regex.test(username)) {
				const exists = await db.models.Users.prototype.isExists({username});

				return exists ? {username: "exists"} : null;
			}

			return {username: "invalid"};
		}

		return {username: "required"};
	};
	const vEmail = async () => {
		if (email) {
			const regex = (/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);

			if (regex.test(email)) {
				const exists = await db.models.Users.prototype.isExists({email});

				return exists ? {email: "exists"} : null;
			}

			return {email: "invalid"};
		}

		return {email: "required"};
	};
	const vPassword = async () => {
		if (password) {
			const regex = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g);

			return regex.test(password) ? null : {password: "invalid"};
		}

		return {password: "required"};
	};

	const errors = Object.assign({}, await vUsername(), await vEmail(), await vPassword());

	Object.keys(errors).length === 0 ? next() : response.status(400).json(errors);
};
