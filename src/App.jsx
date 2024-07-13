import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router'
import { useNavigate } from 'react-router-dom'

import AuthRoutes from './routes/AuthRoutes'
import AppContainer from './components/Main/AppContainer'
import RequireAuth from '@auth-kit/react-router/RequireAuth'
import Loading from './components/SupportComponents/Loading'

import { getBom } from './actions/BomActions'
import { getSeasons } from './actions/SeasonsAction'
import { getItemMaster } from './actions/ItemActions'
import { getResource } from './actions/ResourceAction'
import { getCookie } from './utilities/CommonUtilities'
import { getWarehouse } from './actions/WarehouseAction'
import { getPlannedCrops } from './actions/CropsActions'
import { getInventory } from './actions/InventoryAction'
import { renderLoadingView } from './actions/ViewActions'
import { getVendorMaster } from './actions/VendorActions'
import { getCustomerMaster } from './actions/CustomerActions'
import { getStockEntries } from './actions/StockEntriesAction'
import { getProductionOrder } from './actions/ProductionOrderAction'
import { getAllUsers, getLoggedInUser } from './actions/UserActions'
import { getGoodIssue, getSaleInvoice, getSaleOrder } from './actions/SalesActions'
import { getGoodReceipt, getPurchaseInvoice, getPurchaseOrder, getPurchaseRequest, getRequestForQuotation, getVendorQuotation } from './actions/PurchaseAction'

import './App.css'

const App = () => {

    const login = useSelector(state => state.view.login)
    const loading = useSelector(state => state.view.loading)

    const [appReady, setAppReady] = useState(false)

	const dispatch = useDispatch()
    const navigate = useNavigate()

	useEffect(() => {
		dispatch(getBom(0)).catch((error) => console.error(error))
		dispatch(getSeasons()).catch((error) => console.error(error))
		dispatch(getAllUsers()).catch((error) => console.error(error))
		dispatch(getResource()).catch((error) => console.error(error))
		dispatch(getWarehouse()).catch((error) => console.error(error))
		dispatch(getInventory()).catch((error) => console.error(error))
		dispatch(getItemMaster()).catch((error) => console.error(error))
		dispatch(getSaleOrder(0)).catch((error) => console.error(error))
		dispatch(getGoodIssue(0)).catch((error) => console.error(error))
		dispatch(getPlannedCrops()).catch((error) => console.error(error))
		dispatch(getStockEntries()).catch((error) => console.error(error))
		dispatch(getVendorMaster()).catch((error) => console.error(error))
		dispatch(getSaleInvoice(0)).catch((error) => console.error(error))
		dispatch(getGoodReceipt(0)).catch((error) => console.error(error))
		dispatch(getCustomerMaster()).catch((error) => console.error(error))
		dispatch(getPurchaseOrder(0)).catch((error) => console.error(error))
		dispatch(getProductionOrder(0)).catch((error) => console.error(error))
		dispatch(getPurchaseRequest(0)).catch((error) => console.error(error))
		dispatch(getVendorQuotation(0)).catch((error) => console.error(error))
		dispatch(getPurchaseInvoice(0)).catch((error) => console.error(error))
		dispatch(getRequestForQuotation(0)).catch((error) => console.error(error))
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
						navigate("/app/weather")
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