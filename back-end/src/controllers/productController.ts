import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import slugify from '../utils/slugify'

import { Product } from '../entity/Product'
import { Picture } from '../entity/Picture'

export default {
	async create(req: Request, res: Response) {
		if (req.userRole !== 'admin') return res.sendStatus(401)

		const {
			name,
			description,
			unitPrice,
			width,
			height,
			lenght,
			category,
			pictures,
		} = req.body

		const slug = slugify(name, true)

		const productRepository = getRepository(Product)
		const pictureRepository = getRepository(Picture)

		/*if (productExists) {
			return res.send({
				errors: { email: 'Nome já está sendo utilizado por outro produto' },
			})
		}*/

		const product = productRepository.create({
			name: name,
			slug: slug,
			description: description,
			unitPrice: unitPrice,
			width: width,
			height: height,
			lenght: lenght,
			category: category,
		})

		await productRepository.save(product).catch((error) => {
			return res.send(error)
		})

		pictures.map(async (path) => {
			const picture = pictureRepository.create({ path: path, product: product })
			await pictureRepository.save(picture)
			pictures.push(picture)
		})

		return res.send(product)
	},

	async read(req: Request, res: Response) {
		const { page } = req.params
		const productsPerPage = 8

		const repository = getRepository(Product)
		const products = await repository
			.findAndCount({
				skip: (+page - 1) * productsPerPage,
				take: productsPerPage,
				relations: ['pictures', 'category'],
			})
			.catch((error) => {
				res.send(error)
			})

		return res.send({
			pages: Math.ceil(products[1] / productsPerPage),
			products: products[0],
		})
	},
	async view(req: Request, res: Response) {
		const { slug } = req.params

		const repository = getRepository(Product)

		const product = await repository
			.findOne({ where: { slug: slug }, relations: ['pictures', 'category'] })
			.catch((error) => {
				res.send(error)
			})

		if (!product) return res.sendStatus(404)

		return res.send(product)
	},
	async update(req: Request, res: Response) {},
	async delete(req: Request, res: Response) {},
}
