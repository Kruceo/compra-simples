import { Route, Routes } from 'react-router-dom'
import ViewBotes from './components/pages/Botes/ViewBoat'
import ViewProducts from './components/pages/Produtos/ViewProducts'
import ViewVendors from './components/pages/Fornecedores/ViewVendors'
import CreateEntry from './components/pages/Transacao/CreateEntry'
import PrintEntry from './components/pages/Transacao/PrintEntry'
import ViewEntry from './components/pages/Transacao/ViewEntry'
import ViewReports from './components/pages/Relatorios/ViewPriceComparationReport'
import DetailsEntry from './components/pages/Transacao/DetailsEntry'
import LoginScreen from './components/pages/Login/LoginScreen'
import ViewDashboard from './components/pages/Dashboard/ViewDashboard'
import { Proteged } from './components/Layout/ProtegedRoute'
import PopupContext from './components/GlobalContexts/PopupContext'
import ErrorHandler from './components/GlobalContexts/ErrorHandlerContext'
import TableEngine from './components/GlobalContexts/TableEngineContext'
import View404 from './components/pages/404/View404'
import Teste from './components/pages/Teste'
import ViewBoatEntryComparationReport from './components/pages/Relatorios/ViewBoatEntryComparationReport'
import ViewTransComparationReport from './components/pages/Relatorios/ViewTransComparationReport'
import ViewReceipt from './components/pages/Recibos/ViewOnceReceipt'
import ViewPerTransReceipt from './components/pages/Recibos/ViewPerTransReceipt'
import ViewEntryItemReport from './components/pages/Relatorios/ViewEntryItemReport'
import ViewTotalsByVendors from './components/pages/Relatorios/ViewTotalsByVendors'
import ViewPerVendorReceipt from './components/pages/Recibos/ViewPerVendor'

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
              <Route path='/create/entrada' element={<Proteged>{<CreateEntry type={0} />}</Proteged>} />
              <Route path='/create/saida' element={<Proteged>{<CreateEntry type={1} />}</Proteged>} />
              <Route path='/view/transacao/' element={<Proteged>{<ViewEntry />}</Proteged>} />
              <Route path='/details/transacao/' element={<Proteged>{<DetailsEntry />}</Proteged>} />
              <Route path='/print/transacao/' element={<Proteged>{<PrintEntry />}</Proteged>} />
              <Route path='/report/1' element={<Proteged>{<ViewReports />}</Proteged>} />
              <Route path='/report/2' element={<Proteged>{<ViewBoatEntryComparationReport />}</Proteged>} />
              <Route path='/report/3' element={<Proteged>{<ViewTransComparationReport />}</Proteged>} />
              <Route path='/report/4' element={<Proteged>{<ViewEntryItemReport />}</Proteged>} />
              <Route path='/report/5' element={<Proteged>{<ViewTotalsByVendors />}</Proteged>} />

              <Route path='/login' element={<LoginScreen />} />

              <Route path='/receipt/once' element={<ViewReceipt />} />
              <Route path='/receipt/transaction' element={<ViewPerTransReceipt />} />
              <Route path='/receipt/vendor' element={<ViewPerVendorReceipt />} />

              <Route path='/teste' element={<Teste />} />

              <Route path='/*' element={<View404 />} />
            </Routes>

          </TableEngine>
        </ErrorHandler>
      </PopupContext>



    </>
  )
}

export default App
