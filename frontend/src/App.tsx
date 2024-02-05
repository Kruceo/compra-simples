import { Route, Routes } from 'react-router-dom'

import ViewBotes from './components/pages/Botes/ViewBoat'
import { createContext, useState } from 'react'
import ViewProducts from './components/pages/Produtos/ViewProducts'
import ViewVendors from './components/pages/Fornecedores/ViewVendors'
import CreateEntry from './components/pages/Entrada/CreateEntry'
import OverPageInfo from './components/Layout/OverPageInfo'
import PrintEntry from './components/pages/Entrada/PrintEntry'
import ViewEntry from './components/pages/Entrada/ViewEntry'
import ViewReports from './components/pages/Relatorios/ViewReports'


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
  window.document.title = 'Compra Simples'

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
          <Route path='/view/produto' Component={ViewProducts} />
          <Route path='/view/fornecedor' Component={ViewVendors} />

          <Route path='/create/entrada' Component={CreateEntry} />
          <Route path='/view/entrada/' Component={ViewEntry} />
          <Route path='/print/entrada/:id' Component={PrintEntry} />

          <Route path='/relatorio' Component={ViewReports} />
        </Routes>
      </globalPopupsContext.Provider>
    </>
  )
}
export { globalPopupsContext }
export default App
