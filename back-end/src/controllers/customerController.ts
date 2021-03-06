import { Request, Response } from 'express'
import { getConnection, Index, getRepository, Timestamp } from 'typeorm'
import { Customer } from '../entity/Customer'

export default {
	async create(req: Request, res: Response) {
		const { first_name, last_name, email, password, cpf } = req.body

		const repository = getRepository(Customer)

		const customerExists = await repository.findOne({ where: { email } })

		if (customerExists)
			return res.send({
				errors: {
					email: 'Email já está sendo utilizado por outro usuário',
				},
			})

		const customer = repository.create({
			firstName: first_name,
			lastName: last_name,
			email: email,
			cpf: cpf,
			password: password,
		})

		await repository.save(customer)

		delete customer.password

		return res.json(customer)
	},
	async read(req: Request, res: Response) {
		if (req.userRole !== 'admin') return res.send(401)

		const customers = await getConnection('default').manager.find(Customer)

		return res.send(customers)
	},
	async update(req: Request, res: Response) {
		const repository = getRepository(Customer)

		if (req.userRole === 'user') {
			await repository
				.createQueryBuilder()
				.update()
				.where('id = :id', { id: req.userId })
				.set({
					...req.body,
				})
				.execute()
				.then((result) => {
					res.sendStatus(200)
				})
				.catch((error) => {
					res.status(400).send(error.detail)
				})
		} else {
			const { id, ...data } = req.body

			await repository
				.createQueryBuilder()
				.update()
				.where('id = :id', { id: id })
				.set({
					...data,
				})
				.execute()
				.then((result) => {
					res.sendStatus(200)
				})
				.catch((error) => {
					res.status(400).send(error.detail)
				})
		}
	},
	async delete(req: Request, res: Response) {
		const repository = getRepository(Customer)

		const customer = await repository
			.createQueryBuilder()
			.delete()
			.where('id = :id', { id: req.params.id })
			.execute()

		return res.send(customer)
	},
}
