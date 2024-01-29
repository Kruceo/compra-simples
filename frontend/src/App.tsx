import { Route, Routes } from 'react-router-dom'
import './App.css'
import ViewBotes from './components/pages/Botes/ViewBotes'
import CreateBote from './components/OverPageForm/OverPageForm'
import { ReactNode, createContext, useState } from 'react'
import ViewProdutos from './components/pages/Produtos/ViewProdutos'
import ViewFornecedores from './components/pages/Fornecedores/ViewFornecedores'


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
      <globalPopupsContext.Provider value={{ globalPopups, setGlobalPupupsByKey, setGlobalPopups }}>
        {globalPopups}
        <Routes>
          <Route path='/view/botes' Component={ViewBotes}/>
          <Route path='/view/produtos' Component={ViewProdutos}/>
          <Route path='/view/fornecedores' Component={ViewFornecedores}/>
        </Routes>
      </globalPopupsContext.Provider>
    </>
  )
}
export { globalPopupsContext }
export default App
