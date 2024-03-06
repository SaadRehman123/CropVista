import { useState } from 'react'
import { addEmployee, getAllEmployee } from './actions/testaction'
import { useDispatch, useSelector } from 'react-redux'

import './App.css'

const App = () => {
  const employee = useSelector(state => state.test.employee)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const dispatch = useDispatch()

  const onChangeFirst = (e) => setFirstName(e.target.value)    
  const onChangeLast = (e) => setLastName(e.target.value)
  
  const Name = { first_name: firstName, last_name: lastName }

  return (
    <div>

      <div style={{ display:"flex", flexDirection: "column", padding: 10, width: "30%" }}>
        First Name<input onChange={onChangeFirst} />
        Last Name<input onChange={onChangeLast} />
      </div>

      <div style={{ display:"flex", padding: 10 }}>
        <button onClick={() => dispatch(addEmployee(Name))}>Add Employee</button>
        <button onClick={() => dispatch(getAllEmployee())}>Get Employees</button>  
      </div>

      {employee && employee.map(item => {
        return (
          <p key={item.id}>{item.first_name} {item.last_name}</p>
        )
      })}
    </div>
  )
}

export default App