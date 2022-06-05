import { useEffect, useState } from 'react'
import { API_URL } from './core/config'
import axios from 'axios'


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
      <header className="App-header">
        <p></p>
        <h1 className="text-3xl font-bold underline bg-lime-300">
          Hello Vite + React + Tailwindcss!
        </h1>
        <p className="flex flex-col">
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
          <button type="button" onClick={authUser}>
            authUser
          </button>
          <button type="button" onClick={testUser}>
            testUser
          </button>
        </p>
      </header>
    </div>
  )
}

export default App
