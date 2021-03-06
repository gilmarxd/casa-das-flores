import React from 'react'
import Routes from './Routes'

import { SignProvider } from './contexts/SignContext'
import Footer from './components/molecules/Footer'
import { ShopBagProvider } from './contexts/ShopBagContext'

function App() {
	return (
		<div>
			<SignProvider>
				<ShopBagProvider>
					<Routes />
				</ShopBagProvider>
			</SignProvider>
			<Footer />
		</div>
	)
}

export default App
