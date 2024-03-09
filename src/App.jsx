import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router'
import { useNavigate } from 'react-router-dom'

import AppRoutes from './routes/AppRoutes'
import AuthRoutes from './routes/AuthRoutes'
import RequireAuth from '@auth-kit/react-router/RequireAuth'
import Loading from './components/SupportComponents/Loading'
import PopupContainer from './components/Popups/PopupContainer'

import { getCookie } from './utilities/CommonUtilities'
import { renderLoadingView } from './actions/ViewActions'
import { getAllUsers, getLoggedInUser } from './actions/UserActions'

import './App.css'

const App = () => {

    const loading = useSelector(state => state.view.loading)
    const login = useSelector(state => state.view.login)

    const [appReady, setAppReady] = useState(false)

	const dispatch = useDispatch()
    const navigate = useNavigate()

	useEffect(() => {
		dispatch(getAllUsers()).catch((error) => console.error(error))
        setUpApplication()
    }, [login])

	const setUpApplication = () => {
		const cookie = getCookie("_auth_state")
		const decodedData = decodeURIComponent(cookie)     
		const user = JSON.parse(decodedData)
	
		if(user){
			dispatch(renderLoadingView(true))
			setTimeout(() => { // remove this later 
				dispatch(getLoggedInUser(user.userId)).then((response) => {
					if(response.payload.data.success && response.payload.data.result !== null){
						setAppReady(true)
						dispatch(renderLoadingView(false))
						navigate("/app/dashboard")
					}
				}).catch((error) => {
					console.error(error)
				})
			}, 1000)
		}
		else {
			setAppReady(true)
			navigate("/auth/login")
		}
	}

	const render = () => {
		if(!loading && appReady){
			return(
				<>
					<Route
						path='/auth/*'
						element={<AuthRoutes />}>
					</Route>
	
					<Route              
						index
						path="/app/*"
						element={<RequireAuth fallbackPath='/auth/login'><AppRoutes /></RequireAuth>}>
					</Route>
				</>
			)
		}
	}

	return (
		<>
			<Routes>
				{render()}
			</Routes>
			<Loading />
			<PopupContainer />
		</>
	)
}

export default App