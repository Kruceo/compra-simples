import { Route, Routes } from 'react-router-dom'
import './App.css'
import ViewBotes from './components/pages/Botes/ViewBotes'
import { createContext, useState } from 'react'
import ViewProdutos from './components/pages/Produtos/ViewProdutos'
import ViewFornecedores from './components/pages/Fornecedores/ViewFornecedores'
import CreateEntrada from './components/pages/Entrada/CreateEntrada'
import OverPageInfo from './components/Layout/OverPageInfo'
import PrintEntrada from './components/pages/Entrada/PrintEntrada'
import ViewEntrada from './components/pages/Entrada/ViewEntrada'


const globalPopupsContext = createContext<{
  globalPopups: any[],
  setGlobalPopups: any,
  setGlobalPupupsByKey: (id: number, content: React.ReactElement | null) => void
  simpleSpawnInfo: (message: string, onAccept?: Function, onRecuse?: Function) => any
}>({
  globalPopups: [],
  setGlobalPopups: 1,
  setGlobalPupupsByKey: () => null,
  simpleSpawnInfo: () => null
});

function App() {
  const [globalPopups, setGlobalPopups] = useState<(React.ReactElement | null)[]>([]);

  function setGlobalPupupsByKey(key: number, content: React.ReactElement | null) {
    let mockup = [...globalPopups]
    mockup[key] = content
    setGlobalPopups(mockup)
  }
  function simpleSpawnInfo(content: string, onAccept?: Function, onRecuse?: Function) {
    const key = Math.round(10 + Math.random() * 10)
    setGlobalPupupsByKey(
      key, <OverPageInfo key={key}
        //onAccept existe de qualquer forma, com adendo do argumento, se houver
        onAccept={() => { onAccept ? onAccept() : null; setGlobalPupupsByKey(key, null) }}
        //onRecuse só existe se houver o argumento onRecuse 
        onRecuse={onRecuse ? () => { onRecuse(); setGlobalPupupsByKey(key, null) } : undefined}

      >{content}</OverPageInfo>
    )
  }

  return (
    <>
      <globalPopupsContext.Provider value={{ globalPopups, setGlobalPupupsByKey, setGlobalPopups, simpleSpawnInfo }}>
        {
          globalPopups.map((each) => each)
        }
        <Routes>
          <Route path='/view/bote' Component={ViewBotes} />
          <Route path='/view/produto' Component={ViewProdutos} />
          <Route path='/view/fornecedor' Component={ViewFornecedores} />

          <Route path='/create/entrada' Component={CreateEntrada} />
          <Route path='/view/entrada/' Component={ViewEntrada} />
          <Route path='/print/entrada/:id' Component={PrintEntrada} />
        </Routes>
      </globalPopupsContext.Provider>
    </>
  )
}
export { globalPopupsContext }
export default App
