import './App.css'

import {Header} from './components/Header/Header'
import SiteBuilder from './components/SiteBuilder/SiteBuilder'

function App() {

  return (
    <>
      <div className='parentLayout'>
        <Header />
        <SiteBuilder />
      </div>
    </>
  )
}

export default App
