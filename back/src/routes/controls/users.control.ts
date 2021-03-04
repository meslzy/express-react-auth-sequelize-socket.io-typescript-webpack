import * as express from "express";
import db from "../../sequelize";
import jsonwebtoken from "jsonwebtoken";

export const user = async (request: express.Request, response: express.Response) => {
	const {uuid} = response.locals;

	try {
		const user = await db.models.Users.findOne({where: {uuid}});
		response.json(user);
	} catch (err) {
		response.status(400).json({server: err});
	}
};

export const sign_in = async (request: express.Request, response: express.Response) => {
	const {username} = request.body;

	try {
		const user = await db.models.Users.findOne({where: {username: username.toLowerCase()}});
		response.json(user);
	} catch (err) {
		response.status(400).json({server: err});
	}
};
export const sign_up = async (request: express.Request, response: express.Response) => {
	const {username, email, password} = request.body;

	try {
		const user = await db.models.Users.create({username, email, password});
		response.json(user);
	} catch (err) {
		response.status(400).json({server: err});
	}
};

export const token_create = async (request: express.Request, response: express.Response) => {
	const {uuid} = request.body;

	try {
		const secret = process.env.APP_ACCESS_SECRET;
		const refreshSecret = process.env.APP_REFRESH_SECRET;

		const token = jsonwebtoken.sign({uuid}, secret, {expiresIn: "15m"});
		const refreshToken = jsonwebtoken.sign({uuid}, refreshSecret);

		response.json({token, refreshToken});
	} catch (err) {
		response.status(400).json({uuid: "invalid"});
	}
};
export const token_refresh = async (request: express.Request, response: express.Response) => {
	const {refreshToken} = request.body;

	try {
		const secret = process.env.APP_ACCESS_SECRET;
		const refreshSecret = process.env.APP_REFRESH_SECRET;

		jsonwebtoken.verify(refreshToken, refreshSecret, (err, data) => {
			if (err) response.status(400).json({refreshToken: "invalid"});

			const token = jsonwebtoken.sign({uuid: data.uuid}, secret, {expiresIn: "15m"});

			response.json({token});
		});
	} catch (err) {
		console.log(err);
		response.status(400).json({refreshToken: "required"});
	}
};
