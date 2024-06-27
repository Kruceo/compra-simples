import { Route, Routes } from 'react-router-dom'
import ViewBotes from './components/pages/Boats/ViewBoat'
import ViewProducts from './components/pages/Products/ViewProducts'
import ViewVendors from './components/pages/Vendors/ViewVendors'
import CreateEntry from './components/pages/Transactions/CreateEntry'
import PrintEntry from './components/pages/Transactions/PrintEntry'
import ViewEntry from './components/pages/Transactions/ViewEntry'
import ViewReports from './components/pages/Reports/ViewPriceComparationReport'
import DetailsEntry from './components/pages/Transactions/DetailsEntry'
import LoginScreen from './components/pages/Login/LoginScreen'
import ViewDashboard from './components/pages/Dashboard/ViewDashboard'
import { Proteged } from './components/Layout/ProtegedRoute'
import PopupContext from './components/GlobalContexts/PopupContext'
import ErrorHandler from './components/GlobalContexts/ErrorHandlerContext'
import TableEngine from './components/GlobalContexts/TableEngineContext'
import View404 from './components/pages/404/View404'
import Teste from './components/pages/Teste'
import ViewBoatEntryComparationReport from './components/pages/Reports/ViewBoatEntryComparationReport'
import ViewTransComparationReport from './components/pages/Reports/ViewTransComparationReport'
import ViewReceipt from './components/pages/Receipt/ViewOnceReceipt'
import ViewPerTransReceipt from './components/pages/Receipt/ViewPerTransReceipt'
import ViewEntryItemReport from './components/pages/Reports/ViewEntryItemReport'
import ViewTotalsByVendors from './components/pages/Reports/ViewTotalsByVendors'
import ViewPerVendorReceipt from './components/pages/Receipt/ViewPerVendor'
import EditEntry from './components/pages/Transactions/EditEntry'
import { useEffect } from 'react'
import icon from './assets/icon.svg'


function App() {
  useEffect(() => {
    document.head.innerHTML += `<link rel="icon" type="image/svg+xml" href="${icon}" />`
  }, [])
  return (
    <>
      <PopupContext>
        <ErrorHandler>
          <TableEngine>

            <Routes>
              <Route path='/' element={<Proteged key={"page" + 0}>{<ViewDashboard />}</Proteged>} />
              <Route path='/view/bote' element={<Proteged key={"page" + 1}>{<ViewBotes />}</Proteged>} />
              <Route path='/view/produto' element={<Proteged key={"page" + 2}>{<ViewProducts />}</Proteged>} />
              <Route path='/view/fornecedor' element={<Proteged key={"page" + 3}>{<ViewVendors />}</Proteged>} />
              <Route path='/create/entrada' element={<Proteged key={"page" + 4}>{<CreateEntry type={0} />}</Proteged>} />
              <Route path='/create/saida' element={<Proteged key={"page" + 5}>{<CreateEntry type={1} />}</Proteged>} />
              <Route path='/view/transacao/' element={<Proteged key={"page" + 6}>{<ViewEntry />}</Proteged>} />
              <Route path='/edit/transacao/' element={<Proteged key={"page" + 7}>{<EditEntry />}</Proteged>} />
              <Route path='/details/transacao/' element={<Proteged key={"page" + 8}>{<DetailsEntry />}</Proteged>} />
              <Route path='/print/transacao/' element={<Proteged key={"page" + 9}>{<PrintEntry />}</Proteged>} />
              <Route path='/report/1' element={<Proteged key={"page" + 10}>{<ViewReports />}</Proteged>} />
              <Route path='/report/2' element={<Proteged key={"page" + 11}>{<ViewBoatEntryComparationReport />}</Proteged>} />
              <Route path='/report/3' element={<Proteged key={"page" + 12}>{<ViewTransComparationReport />}</Proteged>} />
              <Route path='/report/4' element={<Proteged key={"page" + 13}>{<ViewEntryItemReport />}</Proteged>} />
              <Route path='/report/5' element={<Proteged key={"page" + 14}>{<ViewTotalsByVendors />}</Proteged>} />
              <Route path='/login' element={<LoginScreen />} />
              <Route path='/receipt/once' element={<ViewReceipt />} />
              <Route path='/receipt/transaction' element={<ViewPerTransReceipt />} />
              <Route path='/receipt/vendor' element={<ViewPerVendorReceipt />} />

              <Route path='/teste' element={<Proteged key={"page-testes"}><Teste /></Proteged>} />

              <Route path='/*' element={<View404 />} />
            </Routes>
          </TableEngine>
        </ErrorHandler>
      </PopupContext>
    </>
  )
}

export default App
