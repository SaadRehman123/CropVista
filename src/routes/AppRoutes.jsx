import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Purchase from '../components/Cards/Purchase'
import Inventory from '../components/Cards/Inventory'
import Production from '../components/Cards/Production'
import CropPlan from '../components/Production/Crops/CropPlan'
import Resource from '../components/Inventory/Resource/Resource'
import Warehouse from '../components/Inventory/Warehouse/Warehouse'
import GoodReceipt from '../components/Purchase/Invoice/GoodReceipt'
import StockEntries from '../components/Inventory/Stock/StockEntries'
import ItemMaster from '../components/Inventory/ItemMaster/ItemMaster'
import CreateBOM from '../components/Production/BillOfMaterial/CreateBOM'
import VendorMaster from '../components/Purchase/VendorMaster/VendorMaster'
import CreateVendor from '../components/Purchase/VendorMaster/CreateVendor'
import ProductionOrder from '../components/Production/Order/ProductionOrder'
import PurchaseInvoice from '../components/Purchase/Invoice/PurchaseInvoice'
import PurchaseOrder from '../components/Purchase/PurchaseOrder/PurchaseOrder'
import VendorQuotation from '../components/Purchase/Quotation/VendorQuotation'
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
                    index
                    path="dashboard"
                    element={<DashboardContainer />}>
                </Route>
                <Route
                    path="crop-plan"
                    element={<CropPlan />}>
                </Route>
                <Route
                    path="warehouse"
                    element={<Warehouse />}>
                </Route>
                <Route
                    path="resource"
                    element={<Resource />}>
                </Route>
                <Route
                    path="Bill_Of_Material"
                    element={<BillOfMaterial />}>
                </Route>
                <Route
                    path="create_bom"
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
            </Routes>
        </div>
    )
}

export default AppRoutes