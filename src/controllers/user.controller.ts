import { Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { TITLE_ERROR } from '../constants/messages.constants';

export async function getMe(req: any, res: Response, next: NextFunction) {
	try {
		return res.status(200).send({
			error: false,
			message: null,
			response: {
				user: req?.user,
			},
		});
	} catch (error: any) {
		return res.status(500).send({
			error: true,
			message: {
				title: TITLE_ERROR,
				message: error,
			},
			response: null,
		});
	}
}

export async function updateMe(req: any, res: Response, next: NextFunction) {
	try {
		const { email, password, ...rest } = req.body;
		const user = await User.findByIdAndUpdate(req.user.id, rest, { upsert: true });
		if (user) {
			const userTransformed = user.transform();
			const newUser = {
				...userTransformed,
				...rest,
			};
			return res.status(200).send({
				error: false,
				message: null,
				response: {
					user: newUser,
				},
			});
		}
	} catch (error: any) {
		return res.status(500).send({
			error: true,
			message: {
				title: TITLE_ERROR,
				message: error.message,
			},
			response: null,
		});
	}
}

export async function get(req: any, res: Response, next: NextFunction) {
	try {
		const user = await User.findById(req.params.id);
		return res.status(200).send({
			error: false,
			message: null,
			response: {
				user,
			},
		});
	} catch (error: any) {
		return res.status(400).send({
			error: true,
			message: {
				title: TITLE_ERROR,
				message: error.message,
			},
			response: null,
		});
	}
}

export async function editSummary(req: any, res: Response, next: NextFunction) {
	try {
		const { signedMessage } = req.body;

		return res.status(200).send({
			error: false,
			message: null,
			response: {
				user: '',
			},
		});
	} catch (error: any) {
		return res.status(400).send({
			error: true,
			message: {
				title: TITLE_ERROR,
				message: error.message,
			},
			response: null,
		});
	}
}
