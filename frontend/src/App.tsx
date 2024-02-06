import { Route, Routes } from 'react-router-dom'

import ViewBotes from './components/pages/Botes/ViewBoat'
import { createContext, useContext, useState } from 'react'
import ViewProducts from './components/pages/Produtos/ViewProducts'
import ViewVendors from './components/pages/Fornecedores/ViewVendors'
import CreateEntry from './components/pages/Entrada/CreateEntry'
import OverPageInfo from './components/Layout/OverPageInfo'
import PrintEntry from './components/pages/Entrada/PrintEntry'
import ViewEntry from './components/pages/Entrada/ViewEntry'
import ViewReports from './components/pages/Relatorios/ViewReports'
import DetailsEntry from './components/pages/Entrada/DetailsEntry'


const globalPopupsContext = createContext<{
  globalPopups: { [key: string]: React.ReactElement | null; },
  setGlobalPopups: any,
  setGlobalPupupsByKey: (id: string, content: React.ReactElement | null) => void
  simpleSpawnInfo: (message: string, onAccept?: Function, onRecuse?: Function) => any
}>({
  globalPopups: {},
  setGlobalPopups: 1,
  setGlobalPupupsByKey: () => null,
  simpleSpawnInfo: () => null
});

function App() {
  const [globalPopups, setGlobalPopups] = useState<{ [key: string]: React.ReactElement | null }>({});

  function setGlobalPupupsByKey(key: string, content: React.ReactElement | null) {
    setGlobalPopups(prevGlobalPopups => {
      const mockup = { ...prevGlobalPopups };
      mockup[key] = content;
      return mockup;
    });
  }
  function simpleSpawnInfo(content: string, onAccept?: Function, onRecuse?: Function) {
    const key = "spawnInfo"
    setGlobalPupupsByKey(
      key,
      <OverPageInfo key={key}
        //onAccept existe de qualquer forma, com adendo do argumento, se houver
        onAccept={() => { onAccept ? onAccept() : null; setGlobalPupupsByKey(key, null) }}
        //onRecuse só existe se houver o argumento onRecuse 
        onRecuse={onRecuse ? () => { onRecuse(); setGlobalPupupsByKey(key, null) } : undefined}

      >
        {content}
      </OverPageInfo>
    )
  }

  return (
    <>
      <globalPopupsContext.Provider value={{ globalPopups, setGlobalPupupsByKey, setGlobalPopups, simpleSpawnInfo }}>
        {
          Object.entries(globalPopups)
            .map((each: [string, React.ReactElement | null]) => <div key={each[0]}>
              {each[1]}
            </div>)
        }
        <Routes>
          <Route path='/view/bote' Component={ViewBotes} />
          <Route path='/view/produto' Component={ViewProducts} />
          <Route path='/view/fornecedor' Component={ViewVendors} />

          <Route path='/create/entrada' Component={CreateEntry} />
          <Route path='/view/entrada/' Component={ViewEntry} />
          <Route path='/details/entrada/' Component={DetailsEntry} />
          <Route path='/print/entrada/:id' Component={PrintEntry} />

          <Route path='/relatorio' Component={ViewReports} />
        </Routes>
      </globalPopupsContext.Provider>
    </>
  )
}
export { globalPopupsContext }
export default App
