import { Route, Routes } from 'react-router'
import './App.css'
import AuthRoutes from './routes/AuthRoutes'

const App = () => {
	const _render = () => {
		return(
		<>
			<Route
				path='/auth/*'
				element={<AuthRoutes />}>
			</Route>
		</>
		)
	}

	return (
		<>
			<Routes>
				{_render()}
			</Routes>
		</>
	)
}

export default App