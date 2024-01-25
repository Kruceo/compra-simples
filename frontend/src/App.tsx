import { Route, Routes } from 'react-router-dom'
import './App.css'
import ViewBotes from './components/pages/Botes/ViewBotes'
import CreateBote from './components/OverPageForm'
import { ReactNode, createContext, useState } from 'react'

const globalPopupsContext = createContext<{
  globalPopups: any,
  setGlobalPopups: any,
  setGlobalPupupsByKey: (id: number, content: ReactNode) => void
}>({
  globalPopups: 1,
  setGlobalPopups: 1,
  setGlobalPupupsByKey: () => null
});

function App() {
  const [globalPopups, setGlobalPopups]: [React.ReactNode[], React.Dispatch<React.SetStateAction<React.ReactNode[]>>] =
    useState<React.ReactNode[]>([]);

  const setGlobalPupupsByKey = (key: number, content: ReactNode) => {
    let mockup = [...globalPopups]
    mockup[key] = content
    setGlobalPopups(mockup)
  }

  return (
    <>
    {globalPopups}
      <globalPopupsContext.Provider value={{ globalPopups, setGlobalPupupsByKey, setGlobalPopups }}>
        <Routes>
          <Route path='/view/botes' Component={ViewBotes}></Route>
          <Route path='/create/botes' Component={CreateBote}></Route>
        </Routes>
      </globalPopupsContext.Provider>
    </>
  )
}
export { globalPopupsContext }
export default App
