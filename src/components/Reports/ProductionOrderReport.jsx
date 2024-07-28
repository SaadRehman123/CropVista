import React, { useMemo } from 'react'
import moment from 'moment'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const ProductionOrderReport = (props) => {

    const renderProjectTitle = useMemo(() => {
        return (
            <View style={{ display: "flex", textAlign: "center", justifyContent: 'center', alignItems: 'center', fontSize: 15, color: "#4285f4", marginTop: 10, fontWeight: "bold" }}>
                <Text>Production Order Report</Text>
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
                    const totalPO = node.data.children.reduce((acc, order) => acc + order.pO_Total, 0);
                    rowElements.push(
                        <View wrap={false} key={node.key} style={{ display: "flex", flexDirection: "row", border: "1px solid #E0E0E0" }}>
                            <View style={{ width: 160, padding: 4 }}>
                                <Text>{node.data.productionOrderId}</Text>
                            </View>
                            <View style={{ width: 100, padding: 4 }}>
                                <Text>{node.data.productionNo}</Text>
                            </View>
                            <View style={{ width: 500, padding: 4 }}>
                                <Text>{node.data.productDescription}</Text>
                            </View>
                            <View style={{ width: 100, padding: 4 }}>
                                <Text>{node.data.quantity}</Text>
                            </View>
                            <View style={{ width: 140, padding: 4 }}>
                                <Text>{moment(node.data.startDate).format("DD/MM/YYYY")}</Text>
                            </View>
                            <View style={{ width: 140, padding: 4 }}>
                                <Text>{moment(node.data.endDate).format("DD/MM/YYYY")}</Text>
                            </View>
                            <View style={{ width: 140, padding: 4 }}>
                                <Text>{totalPO && totalPO.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Text>
                            </View>
                            <View style={{ width: 140, padding: 4 }}>
                                <Text>{node.data.status}</Text>
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
                            <Text>Production Order-ID</Text>
                        </View>
                        <View style={{ width: 100, padding: 4 }}>
                            <Text>Product ID</Text>
                        </View>
                        <View style={{ width: 500, padding: 4 }}>
                            <Text>Product Description</Text>
                        </View>
                        <View style={{ width: 100, padding: 4 }}>
                            <Text>Quantity</Text>
                        </View>
                        <View style={{ width: 140, padding: 4 }}>
                            <Text>Start Date</Text>
                        </View>
                        <View style={{ width: 140, padding: 4 }}>
                            <Text>End Date</Text>
                        </View>
                        <View style={{ width: 140, padding: 4 }}>
                            <Text>Total</Text>
                        </View>
                        <View style={{ width: 140, padding: 4 }}>
                            <Text>Status</Text>
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

export default ProductionOrderReport

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        padding: 10,
    }
})