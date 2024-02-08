import { Route, Routes } from 'react-router-dom'
import ViewBotes from './components/pages/Botes/ViewBoat'
import ViewProducts from './components/pages/Produtos/ViewProducts'
import ViewVendors from './components/pages/Fornecedores/ViewVendors'
import CreateEntry from './components/pages/Entrada/CreateEntry'
import PrintEntry from './components/pages/Entrada/PrintEntry'
import ViewEntry from './components/pages/Entrada/ViewEntry'
import ViewReports from './components/pages/Relatorios/ViewReports'
import DetailsEntry from './components/pages/Entrada/DetailsEntry'
import LoginScreen from './components/pages/Login/LoginScreen'
import ViewDashboard from './components/pages/Dashboard/ViewDashboard'
import { Proteged } from './components/Layout/ProtegedRoute'
import PopupContext from './components/Contexts/PopupContext'
import ErrorHandler from './components/Contexts/ErrorHandlerContext'
import TableEngine from './components/Contexts/TableEngineContext'
import View404 from './components/pages/404/View404'



function App() {

  return (
    <>
      <PopupContext>
        <ErrorHandler>
          <TableEngine>
            <Routes>
              <Route path='/' element={<Proteged>{<ViewDashboard />}</Proteged>} />
              <Route path='/view/bote' element={<Proteged>{<ViewBotes />}</Proteged>} />
              <Route path='/view/produto' element={<Proteged>{<ViewProducts />}</Proteged>} />
              <Route path='/view/fornecedor' element={<Proteged>{<ViewVendors />}</Proteged>} />
              <Route path='/create/entrada' element={<Proteged>{<CreateEntry />}</Proteged>} />
              <Route path='/view/entrada/' element={<Proteged>{<ViewEntry />}</Proteged>} />
              <Route path='/details/entrada/' element={<Proteged>{<DetailsEntry />}</Proteged>} />
              <Route path='/print/entrada/:id' element={<Proteged>{<PrintEntry />}</Proteged>} />
              <Route path='/relatorio' element={<Proteged>{<ViewReports />}</Proteged>} />

              <Route path='/login' element={<LoginScreen />} />
              
              <Route path='/*' element={<View404 />} />
            </Routes>
          </TableEngine>
        </ErrorHandler>
      </PopupContext>
    </>
  )
}

export default App
