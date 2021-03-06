import React from 'react'
import {
	BrowserRouter,
	Switch,
	Route,
	RouteProps,
	Redirect,
} from 'react-router-dom'

import { IsAuthenticated } from './middlewares/auth'

import NavBar from './components/ecosystems/NavBar'
import Home from './components/enviroments/Home'
import Profile from './components/enviroments/Profile'
import ProductOverview from './components/enviroments/ProductOverview'
import NotFound from './components/enviroments/NotFound'

import Dashboard from './components/ecosystems/Dashboard'
import Overview from './components/enviroments/admin/Overview'
import Customers from './components/enviroments/admin/Customers'
import Sales from './components/enviroments/admin/Sales'
import Orders from './components/enviroments/admin/Orders'
import Announcements from './components/enviroments/admin/Announcements'
import Products from './components/enviroments/admin/Products'
import ShopBag from './components/enviroments/ShopBag'

const ProtectedRoute: React.FC<RouteProps> = ({ component, ...rest }) => {
	const routeComponent = (props: any) =>
		!IsAuthenticated() ? (
			<Redirect to={{ pathname: '/', state: { from: props.location } }} />
		) : (
			React.createElement(component as React.FunctionComponent, props)
		)

	return <Route {...rest} render={routeComponent} />
}

export default function Routes() {
	return (
		<BrowserRouter>
			<Switch>
				<Route
					path='/'
					exact
					component={(props: any) => (
						<Redirect
							to={{ pathname: '/store', state: { from: props.location } }}
						/>
					)}
				/>
				<Route
					path='/dashboard'
					component={({ match }: { match: any }) => (
						<Dashboard>
							<ProtectedRoute path={match.path} exact component={Overview} />
							<ProtectedRoute
								path={match.path + '/customers'}
								component={Customers}
							/>
							<ProtectedRoute path={`${match.path}/sales`} component={Sales} />
							<ProtectedRoute
								path={`${match.path}/orders`}
								component={Orders}
							/>
							<ProtectedRoute
								path={`${match.path}/products`}
								component={Products}
							/>
							<ProtectedRoute
								path={`${match.path}/announcements`}
								component={Announcements}
							/>
						</Dashboard>
					)}
				/>
				<Route
					path='/store'
					component={({ match }: { match: any }) => (
						<NavBar>
							<Switch>
								<Route
									path={`${match.path}/product/:slug`}
									component={ProductOverview}
								/>
								<Route path={match.path} exact component={Home} />
								<Route
									path={`${match.path}/shopbag`}
									exact
									component={ShopBag}
								/>

								<ProtectedRoute
									path={`${match.path}/profile`}
									component={Profile}
								/>
								<Route component={NotFound} />
							</Switch>
						</NavBar>
					)}
				/>
			</Switch>
		</BrowserRouter>
	)
}
