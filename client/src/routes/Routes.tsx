import React, { Suspense, useEffect, useContext } from 'react'
import APIService from '../shared/api/service/APIService'
import RoutingPath from './RoutingPath'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { UserContext } from '../shared/provider/UserProvider'
import { BackDrop } from '../components/backdrop/BackDrop'
import { HomeView } from '../view/HomeView'
import { SignInView } from '../view/SignInView'
import { UserSettingsView } from '../view/UserSettingsView'
import { UserProfileView } from '../view/UserProfileView'
import { CreateRecipeView } from '../view/CreateRecipeView'
import { RecipeView } from '../view/RecipeView'
import { ResetPasswordView } from '../view/ResetPasswordView'

export const Routes = (props: { children?: React.ReactChild }) => {
	const { children } = props
	const [authenticatedUser, setAuthenticatedUser] = useContext(UserContext)

	const authenticationRequired = (navigateToViewifAuthenticated: any) => {
		return authenticatedUser.authenticated ? navigateToViewifAuthenticated : SignInView
	}

	const blockRouteIfAuthenticated = (navigateToViewIfAuthenticated: any) => {
		return authenticatedUser.authenticated ? HomeView : navigateToViewIfAuthenticated
	}

	const isTokenValid = (tokenExp: number) => {
		const currentTime = Math.floor(Date.now() / 1000)
		return (tokenExp >= currentTime)
	}

	const parseJWT = async () => {
		const token = localStorage.getItem('token')
		if (!token) { return }
		const base64Url = token.split('.')[1]
		const base64 = base64Url.replace('-', '+').replace('_', '/')
		const JWT = JSON.parse(window.atob(base64))

		if (isTokenValid(JWT.exp)) {
			// TODO: There has to be a better way to recieve the username? You cannot just do a getUserWithID like this?
			const response = await APIService.getUserWithID(JWT.id)
			setAuthenticatedUser({ authenticated: true, id: JWT.id, username: response.data.username })
		} else {
			setAuthenticatedUser({ authenticated: false, id: undefined, username: undefined })
			localStorage.removeItem('token')
		}
	}

	useEffect(() => {
		parseJWT()
	}, [])

	return (
		<BrowserRouter>
			<Suspense fallback={<BackDrop />} />
			{children}
			<Switch>
				<Route exact path={RoutingPath.signInView} component={blockRouteIfAuthenticated(SignInView)} />
				<Route exact path={RoutingPath.userSettingsView} component={authenticationRequired(UserSettingsView)} />
				<Route exact path={RoutingPath.userProfileView} component={authenticationRequired(UserProfileView)} />
				<Route exact path={RoutingPath.createRecipeView} component={authenticationRequired(CreateRecipeView)} />
				<Route exact path={RoutingPath.recipeView} component={RecipeView} />
				<Route exact path={RoutingPath.forgotPasswordView} component={ResetPasswordView} />
				<Route component={HomeView} />
			</Switch>
		</BrowserRouter>
	)
}
