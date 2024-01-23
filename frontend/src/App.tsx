import { Route, Routes } from 'react-router-dom'
import './App.css'
import Bar from './components/Bar'
import SideBar from './components/SideBar'
import Content from './components/Content'
import ViewBotes from './components/pages/ViewBotes'

function App() {

  return (
    <>
     <Routes>
      <Route path='/view/botes' Component={ViewBotes}></Route>
     </Routes>
    </>
  )
}

export default App
