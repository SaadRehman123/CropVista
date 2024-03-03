import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { getWheather } from './actions/testaction'
import { useEffect } from 'react'

const App = () => {
  const wheather = useSelector(state => state.test.wheather)

  const dispatch = useDispatch()
  
  useEffect(() => {
    console.log("wheather", wheather);
  },[wheather])

  return (
    <div>
      <button onClick={() => dispatch(getWheather())}>Get Wheather</button>
      
      {wheather && wheather.map(item => {
        return (
          <p key={item.temperatureC}>{item.summary}</p>
        )
      })}
    </div>
  )
}

export default App