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
import DetailsEntry from './components/pages/Entrada/DetailsEntry'
import LoginScreen from './components/pages/Login/LoginScreen'
import ViewDashboard from './components/pages/Dashboard/ViewDashboard'
import {Proteged} from './components/Layout/ProtegedRoute'

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

          <Route path='/'                  element={<Proteged>{<ViewDashboard/>}</Proteged>  } />
          <Route path='/view/bote'         element={<Proteged>{<ViewBotes    />}</Proteged>  } />
          <Route path='/view/produto'      element={<Proteged>{<ViewProducts />}</Proteged>  } />
          <Route path='/view/fornecedor'   element={<Proteged>{<ViewVendors  />}</Proteged>  } />
          <Route path='/create/entrada'    element={<Proteged>{<CreateEntry  />}</Proteged>  } />
          <Route path='/view/entrada/'     element={<Proteged>{<ViewEntry    />}</Proteged>  } />
          <Route path='/details/entrada/'  element={<Proteged>{<DetailsEntry />}</Proteged>  } />
          <Route path='/print/entrada/:id' element={<Proteged>{<PrintEntry   />}</Proteged>  } />
          <Route path='/relatorio'         element={<Proteged>{<ViewReports  />}</Proteged>  } />

          <Route path='/login'             element={<LoginScreen/>} />
        </Routes>
      </globalPopupsContext.Provider>
    </>
  )
}
export { globalPopupsContext }
export default App
