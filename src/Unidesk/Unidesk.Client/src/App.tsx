import { useEffect, useState } from 'react'
import { API_URL } from './core/config'



function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch(`${API_URL}/HelloWorld/api/helloworld`)
      .then(data => data.text())
      .then(text => setCount(text.length))
  });

  return (
    <div className="App">
      <header className="App-header">
        <p></p>
        <h1 className="text-3xl font-bold underline bg-lime-300">
          Hello Vite + React + Tailwindcss!
        </h1>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
      </header>
    </div>
  )
}

export default App
