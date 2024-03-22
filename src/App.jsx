import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router'
import { useNavigate } from 'react-router-dom'

import AuthRoutes from './routes/AuthRoutes'
import AppContainer from './components/Main/AppContainer'
import RequireAuth from '@auth-kit/react-router/RequireAuth'
import Loading from './components/SupportComponents/Loading'

import { getSeasons } from './actions/SeasonsAction'
import { getCookie } from './utilities/CommonUtilities'
import { getPlannedCrops } from './actions/CropsActions'
import { renderLoadingView } from './actions/ViewActions'
import { getAllUsers, getLoggedInUser } from './actions/UserActions'

import './App.css'

const App = () => {

    const login = useSelector(state => state.view.login)
    const loading = useSelector(state => state.view.loading)

    const [appReady, setAppReady] = useState(false)

	const dispatch = useDispatch()
    const navigate = useNavigate()

	useEffect(() => {
		dispatch(getSeasons()).catch((error) => console.error(error))
		dispatch(getAllUsers()).catch((error) => console.error(error))
		dispatch(getPlannedCrops()).catch((error) => console.error(error))
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
						element={<RequireAuth fallbackPath='/auth/login'><AppContainer /></RequireAuth>}>
					</Route>
				</>
			)
		}
	}

	return (
		<div style={{ userSelect : "none" }}>
			<Routes>
				{render()}
			</Routes>
			<Loading />
		</div>
	)
}

export default App