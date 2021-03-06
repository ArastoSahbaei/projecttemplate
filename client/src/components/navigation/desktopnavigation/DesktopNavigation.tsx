import React, { useContext } from 'react'
import RoutingPath from '../../../routes/RoutingPath'
import { useHistory } from 'react-router-dom'
import Logotype from '../../../shared/images/logotypeTemplate.svg'
import { UserContext } from '../../../shared/provider/UserProvider'
import { Profile } from '../../profile/Profile'
import './DesktopNavigation.css'
import { SearchRecipe } from '../../searchrecipe/SearchRecipe'
import CateringIMG from '../../../shared/images/catering.svg'

export const DesktopNavigation: React.FC = (): JSX.Element => {
	const [authenticatedUser,] = useContext(UserContext)
	const history = useHistory()

	const displaySignInButtonOrUsernameDependingOnAuthentication = () => {
		return authenticatedUser.authenticated
			? <div className='navigationProfile'> <Profile /> </div>
			: <span className='signInButton' onClick={() => history.push(RoutingPath.signInView)}> Sign in </span>
	}

	const displayCreateRecipeIconIfUserIsAuthenticated = () => {
		if (authenticatedUser.authenticated) {
			return <img
				src={CateringIMG}
				alt={''}
				className='createRecipeNav'
				onClick={() => history.push(RoutingPath.createRecipeView)} />
		}
	}

	return (
		<div className='desktopNavigationWrapper'>
			<img className='navigationLogotype'
				onClick={() => history.push(RoutingPath.homeView)}
				src={Logotype}
				alt=''
				style={{ width: 100 }} />
			{displaySignInButtonOrUsernameDependingOnAuthentication()}
			{displayCreateRecipeIconIfUserIsAuthenticated()}
			<div className='searchForRecipe'>
				<SearchRecipe />
			</div>
		</div>
	)
}
