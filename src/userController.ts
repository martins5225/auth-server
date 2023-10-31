import { Response } from 'express';
import { db } from './config/firebase';

type UserType = {
	phoneNumber: string;
	name?: string;
	email?: string;
};

type Request = {
	body: UserType;
	params: { userId: string };
};

const addUser = async (req: Request, res: Response) => {
	const { phoneNumber, name, email } = req.body;
	try {
		const user = db.collection('users').doc();
		const userObject = {
			id: user.id,
			phoneNumber: phoneNumber || '',
			name: name || '',
			email: email || '',
		};

		user.set(userObject);

		return res.status(201).send({
			status: 'success',
			message: 'user added successfully',
			data: userObject,
		});
	} catch (error: any) {
		return res.status(500).json(error.message);
	}
};

const getAllUsers = async (req: Request, res: Response) => {
	try {
		const allUsers: UserType[] = [];
		const querySnapshot = await db.collection('users').get();
		querySnapshot.forEach((doc: any) => {
			allUsers.push(doc.data());
		});
		return res.status(200).json(allUsers);
	} catch (error: any) {
		return res.status(500).json(error.message);
	}
};

const getUser = async (req: Request, res: Response) => {
	const { userId } = req.params;

	try {
		const user = db.collection('users').doc(userId);
		const userDoc = await db.collection('users').doc(userId).get();

		const currentData = (await user.get()).data();

		const userObject = {
			name: currentData?.name,
			email: currentData?.email,
		};

		if (!userDoc.exists) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res.status(200).json(userObject);
	} catch (error: any) {
		return res.status(500).json(error.message);
	}
};

const updateUser = async (req: Request, res: Response) => {
	const {
		body: { name, email, phoneNumber },
		params: { userId },
	} = req;
	try {
		const user = db.collection('users').doc(userId);
		const currentData = (await user.get()).data() || {};

		const userObject = {
			id: userId,
			phoneNumber: phoneNumber,
			name: name || currentData.name,
			email: email || currentData.email,
		};
		user.update(userObject);
		return res.status(200).json({
			status: 'success',
			message: 'user updated successfully',
			data: userObject,
		});
	} catch (error: any) {
		return res.status(500).json(error.message);
	}
};

export { addUser, getAllUsers, getUser, updateUser };
