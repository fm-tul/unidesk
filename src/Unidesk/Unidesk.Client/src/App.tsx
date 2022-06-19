import { useEffect, useState } from 'react'
import { API_URL } from './core/config'
import axios from 'axios'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { links } from './config/links'


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
    <div>
      <div className='flex flex-col'>
        {links.map(link => <Link key={link.path} to={link.path}>{link.title}</Link>)}
      </div>

      <Routes>
        {links.map(i => <Route key={i.path} {...i} />)}
      </Routes>
    </div>
  )
}

export default App
