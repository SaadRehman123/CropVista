import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Sales from '../components/Cards/Sales'
import Purchase from '../components/Cards/Purchase'
import Inventory from '../components/Cards/Inventory'
import Production from '../components/Cards/Production'
import GoodIssue from '../components/Sales/Issue/GoodIssue'
import SaleOrder from '../components/Sales/Order/SaleOrder'
import CropPlan from '../components/Production/Crops/CropPlan'
import Resource from '../components/Inventory/Resource/Resource'
import SalesInvoice from '../components/Sales/Invoice/SalesInvoice'
import Warehouse from '../components/Inventory/Warehouse/Warehouse'
import GoodReceipt from '../components/Purchase/Invoice/GoodReceipt'
import StockEntries from '../components/Inventory/Stock/StockEntries'
import ItemMaster from '../components/Inventory/ItemMaster/ItemMaster'
import CreateSaleOrder from '../components/Sales/Order/CreateSaleOrder'
import CreateGoodIssue from '../components/Sales/Issue/CreateGoodIssue'
import CreateCustomer from '../components/Sales/Customer/CreateCustomer'
import CustomerMaster from '../components/Sales/Customer/CustomerMaster'
import CreateBOM from '../components/Production/BillOfMaterial/CreateBOM'
import VendorMaster from '../components/Purchase/VendorMaster/VendorMaster'
import CreateVendor from '../components/Purchase/VendorMaster/CreateVendor'
import ProductionOrder from '../components/Production/Order/ProductionOrder'
import PurchaseInvoice from '../components/Purchase/Invoice/PurchaseInvoice'
import PurchaseOrder from '../components/Purchase/PurchaseOrder/PurchaseOrder'
import VendorQuotation from '../components/Purchase/Quotation/VendorQuotation'
import WeatherContainer from '../components/Overview/Weather/WeatherContainer'
import CreateSalesInvoice from '../components/Sales/Invoice/CreateSalesInvoice'
import CreateGoodReceipt from '../components/Purchase/Invoice/CreateGoodReceipt'
import BillOfMaterial from '../components/Production/BillOfMaterial/BillOfMaterial'
import DashboardContainer from '../components/Overview/Dashboard/DashboardContainer'
import PurchaseRequest from '../components/Purchase/PurchaseRequest/PurchaseRequest'
import RequestForQuotation from '../components/Purchase/Quotation/RequestForQuotation'
import InventoryStatus from '../components/Inventory/InventoryOverview/InventoryStatus'
import CreateProductionOrder from '../components/Production/Order/CreateProductionOrder'
import CreatePurchaseInvoice from '../components/Purchase/Invoice/CreatePurchaseInvoice'
import CreateVendorQuotation from '../components/Purchase/Quotation/CreateVendorQuotation'
import CreatePurchaseOrder from '../components/Purchase/PurchaseOrder/CreatePurchaseOrder'
import CreatePurchaseRequest from '../components/Purchase/PurchaseRequest/CreatePurchaseRequest'
import CreateRequestForQuotation from '../components/Purchase/Quotation/CreateRequestForQuotation'

const AppRoutes = () => {
    return (
        <div style={{ backgroundColor: '#F9FAFA', height: '100vh' }}>
            <Routes>
                <Route
                    path="production"
                    element={<Production />}>
                </Route>
                <Route
                    path="inventory"
                    element={<Inventory />}>
                </Route>
                <Route
                    path="purchase"
                    element={<Purchase />}>
                </Route>
                <Route
                    path="sales"
                    element={<Sales />}>
                </Route>
                <Route
                    index
                    path="weather"
                    element={<WeatherContainer />}>
                </Route>
                <Route
                    path="Dashboard"
                    element={<DashboardContainer />}>
                </Route>
                <Route
                    path="Crop-Plan"
                    element={<CropPlan />}>
                </Route>
                <Route
                    path="Warehouse"
                    element={<Warehouse />}>
                </Route>
                <Route
                    path="Resources"
                    element={<Resource />}>
                </Route>
                <Route
                    path="Bill_Of_Material"
                    element={<BillOfMaterial />}>
                </Route>
                <Route
                    path="Create_Bom"
                    element={<CreateBOM />}>
                </Route>
                <Route
                    path="Item_Master"
                    element={<ItemMaster />}>
                </Route>
                <Route
                    path="Production_Order"
                    element={<ProductionOrder />}>
                </Route>
                <Route
                    path="Create_Production_Order"
                    element={<CreateProductionOrder />}>
                </Route>
                <Route
                    path="Stock_Entries"
                    element={<StockEntries />}>
                </Route>
                <Route
                    path="Inventory_Status"
                    element={<InventoryStatus />}>
                </Route>
                <Route
                    path="Vendor_Master"
                    element={<VendorMaster />}>
                </Route>
                <Route
                    path="Create_Vendor"
                    element={<CreateVendor />}>
                </Route>
                <Route
                    path="Purchase_Request"
                    element={<PurchaseRequest />}>
                </Route>
                <Route
                    path="Create_Purchase_Request"
                    element={<CreatePurchaseRequest />}>
                </Route>
                <Route
                    path="Purchase_Order"
                    element={<PurchaseOrder />}>
                </Route>
                <Route
                    path="Create_Purchase_Order"
                    element={<CreatePurchaseOrder />}>
                </Route>
                <Route
                    path="Request_For_Quotation"
                    element={<RequestForQuotation />}>
                </Route>
                <Route
                    path="Create_Request_For_Quotation"
                    element={<CreateRequestForQuotation />}>
                </Route>
                <Route
                    path="Vendor_Quotation"
                    element={<VendorQuotation />}>
                </Route>
                <Route
                    path="Create_Vendor_Quotation"
                    element={<CreateVendorQuotation />}>
                </Route>
                <Route
                    path="Good_Receipt"
                    element={<GoodReceipt />}>
                </Route>
                <Route
                    path="Create_Good_Receipt"
                    element={<CreateGoodReceipt />}>
                </Route>
                <Route
                    path="Purchase_Invoice"
                    element={<PurchaseInvoice />}>
                </Route>
                <Route
                    path="Create_Purchase_Invoice"
                    element={<CreatePurchaseInvoice />}>
                </Route>
                <Route
                    path="Create_Customer"
                    element={<CreateCustomer />}>
                </Route>
                <Route
                    path="Customer_Master"
                    element={<CustomerMaster />}>
                </Route>
                <Route
                    path="Sale_Order"
                    element={<SaleOrder />}>
                </Route>
                <Route
                    path="Create_Sale_Order"
                    element={<CreateSaleOrder />}>
                </Route>
                <Route
                    path="Good_Issue"
                    element={<GoodIssue />}>
                </Route>
                <Route
                    path="Create_Good_Issue"
                    element={<CreateGoodIssue />}>
                </Route>
                <Route
                    path="Sale_Invoice"
                    element={<SalesInvoice />}>
                </Route>
                <Route
                    path="Create_Sale_Invoice"
                    element={<CreateSalesInvoice />}>
                </Route>
            </Routes>
        </div>
    )
}

export default AppRoutes