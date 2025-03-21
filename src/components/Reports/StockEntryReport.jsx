import React, { useMemo } from 'react'
import moment from 'moment'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const StockEntryReport = (props) => {

    const renderProjectTitle = useMemo(() => {
        return (
            <View style={{ display: "flex", textAlign: "center", justifyContent: 'center', alignItems: 'center', fontSize: 15, color: "#4285f4", marginTop: 10, fontWeight: "bold" }}>
                <Text>Stock Entry Report</Text>
            </View>
        )
    })

    const renderGeneratedDetails = useMemo(() => {
        return (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", fontSize: 9, color: "#0A1A1E" }}>
                <Text>{moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                <Text>{props.user ? "Generated By " + props.user.name : ""}</Text>
            </View>
        )
    })

    const renderTreeTable = useMemo(() => {
        if (props.reportGridRef.current) {

            let count = 0
            const rowElements = []
            const instance = props.reportGridRef.current.instance

            instance.forEachNode((node) => {
                if (node.visible === true) {
                    rowElements.push(
                        <View wrap={false} key={node.key} style={{ display: "flex", flexDirection: "row", border: "1px solid #E0E0E0" }}>
                            <View style={{ width: 160, padding: 4 }}>
                                <Text>{node.data.stockEntryId}</Text>
                            </View>
                            <View style={{ width: 450, padding: 4 }}>
                                <Text>{node.data.stockEntryName}</Text>
                            </View>
                            <View style={{ width: 180, padding: 4 }}>
                                <Text>{node.data.productionOrderId === "" ? node.data.stockEntryWarehouse : `Production - ${node.data.productionOrderId}`}</Text>
                            </View>
                            <View style={{ width: 100, padding: 4 }}>
                                <Text>{node.data.stockEntryQuantity}</Text>
                            </View>
                            <View style={{ width: 140, padding: 4 }}>
                                <Text>{node.data.productionOrderId === "" ? node.data.stockEntryTo : `Inventory - ${node.data.stockEntryWarehouse}`}</Text>
                            </View>
                            <View style={{ width: 140, padding: 4 }}>
                                <Text>{moment(node.data.stockEntryDate).format("DD/MM/YYYY")}</Text>
                            </View>
                        </View>
                    )
                    count++
                }
            })

            return (
                <View style={{ display: "flex", marginTop: 10, width: "auto", fontSize: 10, paddingLeft: 6 }}>
                    <View key={"0"} style={{ display: "flex", flexDirection: "row", border: "1px solid #E0E0E0", fontSize: 11, fontFamily: "Helvetica-Bold" }}>
                        <View style={{ width: 160, padding: 4 }}>
                            <Text>Entry-ID</Text>
                        </View>
                        <View style={{ width: 450, padding: 4 }}>
                            <Text>Item Name</Text>
                        </View>
                        <View style={{ width: 180, padding: 4 }}>
                            <Text>Entry From</Text>
                        </View>
                        <View style={{ width: 100, padding: 4 }}>
                            <Text>Quantity</Text>
                        </View>
                        <View style={{ width: 140, padding: 4 }}>
                            <Text>Entry To</Text>
                        </View>
                        <View style={{ width: 140, padding: 4 }}>
                            <Text>Entry Date</Text>
                        </View>
                    </View>
                    {rowElements}
                </View>
            )
        }
    })

    const renderSeparator = useMemo(() => <View style={{ marginTop: "5px", borderBottom: "1px solid #EEEEEE" }}> </View>)

    return (
        <Document>
            <Page style={styles.page} size={'SRA4'} orientation={'landscape'}>
                {renderGeneratedDetails}
                {renderSeparator}
                {renderProjectTitle}
                {renderTreeTable}
            </Page>
        </Document>
    )
}

export default StockEntryReport

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        padding: 10,
    }
})