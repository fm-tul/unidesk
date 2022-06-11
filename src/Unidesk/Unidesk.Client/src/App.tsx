import { useEffect, useState } from 'react'
import { API_URL } from './core/config'
import axios from 'axios'
import { StagImport } from './components/StagImport'


function App() {
  const [count, setCount] = useState(0)

  const authUser = async () => {
    const response = await axios.post(`${API_URL}/api/Users/login`, {
      username: 'admin',
      password: 'admin'
    },
      { withCredentials: true })
      ;
    console.log(response.data);
  }

  const testUser = async () => {
    const response = await axios.get(`${API_URL}/api/HelloWorld/helloworld`, { withCredentials: true });
    console.log(response.data);
  }


  return (
    <div className="App">
      <StagImport />
    </div>
  )
}

export default App
