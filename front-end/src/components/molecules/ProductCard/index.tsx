import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

import {
	IoArrowForward,
	IoBagAddOutline,
	IoBagRemoveOutline,
	IoBanOutline,
	IoCameraOutline,
	IoHeartOutline,
} from 'react-icons/io5'

import { Product } from '../../../@types/interfaces'
import ShopBagContext from '../../../contexts/ShopBagContext'
import CircleButton from '../../atoms/CircleButton'

interface ProductCardProps {
	product?: Product
	loading?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
	product,
	loading,
	...props
}) => {
	const [loadingBag, setLoadingBag] = useState(false)
	const shopBagCtx = useContext(ShopBagContext)

	const scrollTop = () => {
		window.scrollTo({ top: 0, behavior: 'auto' })
	}

	const pushItem = async () => {
		setLoadingBag(true)
		shopBagCtx.pushItem(product).then(() => setLoadingBag(false))
	}

	const popItem = async () => {
		setLoadingBag(true)
		shopBagCtx.popItem(product).then(() => setLoadingBag(false))
	}

	const ProductImage = () => {
		if (loading) {
			return <div className='h-56  bg-gray-200'></div>
		} else if (product?.pictures?.length) {
			return (
				<div
					className='h-56 bg-cover'
					style={{
						backgroundImage: `url(${
							process.env.PUBLIC_URL + product.pictures[0].path
						})`,
					}}
				></div>
			)
		} else {
			return (
				<div className='h-56 flex justify-center items-center bg-gray-200 bg-cover text-gray-300'>
					<IoBanOutline className='absolute' size={160} />
					<IoCameraOutline className='text-gray-400' size={110} />
				</div>
			)
		}
	}

	return (
		<div
			{...props}
			className={`
				h-full 
				flex
				flex-col 
				justify-between
				border 
				rounded-md
				shadow
				overflow-hidden
				${loading && 'animate-pulse'}
			 `}
		>
			<ReactTooltip place='bottom' effect='solid' />
			<ProductImage />
			{loading ? (
				<div className='w-52 h-5 mt-4 mx-2 bg-gray-300' />
			) : (
				<div className='mt-2 mx-2 text-lg text-gray-800 font-bold'>
					{product?.name}
				</div>
			)}
			{loading ? (
				<div className='p-2'>
					<div className='w-full mt-2 h-4 bg-gray-300' />
					<div className='w-64 mt-2 h-4 bg-gray-300' />
				</div>
			) : (
				<div
					className='p-2  text-gray-600'
					style={{
						lineHeight: '1.3rem',
						maxHeight: '3rem',
						overflow: 'hidden',
					}}
				>
					{product?.description}
				</div>
			)}
			<div className='grid grid-cols-8  px-2  text-gray-800 mb-3'>
				{loading ? (
					<span className='col-span-4 flex items-center text-2xl '>
						{Number(0).toLocaleString('pt-BR', {
							style: 'currency',
							currency: 'BRL',
						})}
					</span>
				) : (
					<span className='col-span-4 flex items-center text-2xl '>
						{Number(product?.unitPrice).toLocaleString('pt-BR', {
							style: 'currency',
							currency: 'BRL',
						})}
					</span>
				)}
				<div className='col-span-4 flex justify-between '>
					<button
						className='rounded-full border border-gray-300 p-2 hover:border-green-500 hover:text-green-500 focus:border-green-500 focus:text-green-500'
						data-tip='Adicionar à lista de desejos'
					>
						<IoHeartOutline className='h-6 w-6' />
					</button>
					{shopBagCtx.contains(product) ? (
						<CircleButton
							className='hover:border-red-500 hover:text-red-500 focus:border-red-500 focus:text-red-500'
							loading={loadingBag}
							outlined
							icon={<IoBagRemoveOutline className='h-6 w-6' />}
							data-tip='Remover da cesta'
							onClick={loadingBag ? () => {} : popItem}
						/>
					) : (
						<CircleButton
							className='hover:border-green-500 hover:text-green-500 focus:border-green-500 focus:text-green-500'
							loading={loadingBag}
							outlined
							icon={<IoBagAddOutline className='h-6 w-6' />}
							data-tip='Adicionar à cesta'
							onClick={loadingBag ? () => {} : pushItem}
						/>
					)}

					<Link to={`/store/product/${product?.slug}`} onClick={scrollTop}>
						<CircleButton
							className='hover:border-green-500 hover:text-green-500 focus:border-green-500 focus:text-green-500'
							outlined
							icon={<IoArrowForward className='h-6 w-6' />}
							data-tip='Visualizar'
						/>
					</Link>
				</div>
			</div>
		</div>
	)
}
export default ProductCard
