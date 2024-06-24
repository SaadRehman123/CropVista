import React, { useState } from 'react'
import "./styles.css"

const YearPicker = ({ selectedYear, onChange, startYear, endYear }) => {

    const [showPicker, setShowPicker] = useState(false)
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i)

    const handleYearChange = (year) => {
        onChange(year)
        setShowPicker(false)
    }

    return (
        <div className="year-picker">
            <input
                type="text"
                value={selectedYear}
                readOnly
                onClick={() => setShowPicker(!showPicker)}
            />
            {showPicker && (
                <div className="year-picker-dropdown">
                    <div className="year-picker-options">
                        {years.map((year) => (
                        <div key={year} onClick={() => handleYearChange(year)}>
                            {year}
                        </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default YearPicker
