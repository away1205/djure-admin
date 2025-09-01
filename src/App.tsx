import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './features/Authentication/LoginPage';
import AdminDashboard from './features/Dashboard/AdminDashboard';
import ProtectedRoute from './features/Authentication/ProtectedRoute';
import TransactionForm from './features/Transaction/Form/TransactionForm';
import TransactionNav from './features/Transaction/TransactionNav';
import TransactionView from './features/Transaction/TransactionView';
import TransactionViewDetail from './features/Transaction/TransactionViewDetail';
import MemberNav from './features/Member/MemberNav';
import MemberForm from './features/Member/Form/MemberForm';
import MemberView from './features/Member/MemberView';
import MemberViewDetail from './features/Member/MemberViewDetail';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} index />

          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path='transaction' element={<TransactionNav />}>
              <Route path='create' element={<TransactionForm />} />
              <Route path='view' element={<TransactionView />} />
              <Route
                path=':transactionID'
                element={<TransactionViewDetail />}
              />
            </Route>

            <Route path='member' element={<MemberNav />}>
              <Route path='create' element={<MemberForm />} />
              <Route path='view' element={<MemberView />} />
              <Route path=':memberID' element={<MemberViewDetail />} />
            </Route>
          </Route>

          <Route path='public'>
            <Route path='dashboard' element={<AdminDashboard />}>
              <Route path='transaction' element={<TransactionNav />}>
                <Route path='create' element={<TransactionForm />} />
                <Route path='view' element={<TransactionView />} />
                <Route
                  path=':transactionID'
                  element={<TransactionViewDetail />}
                />
              </Route>
            </Route>

            <Route path='form'>
              <Route path='member' element={<MemberForm />} />
            </Route>
          </Route>
          <Route path='*' element={<p>Testing</p>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
