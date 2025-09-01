import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
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
import CompetitionNav from './features/Competition/CompetitionNav';
import CompetitionView from './features/Competition/CompetitionView';
import CompetitionForm from './features/Competition/Form/CompetitionForm';
import CompetitionViewDetail from './features/Competition/CompetitionViewDetail';
import QuestionForm from './features/Competition/Questions/QuestionForm';
import QuestionViewDetail from './features/Competition/Questions/QuestionViewDetail';
import ParticipantForm from './features/Competition/Participants/ParticipantForm';
import ParticipantViewDetail from './features/Competition/Participants/ParticipantViewDetail';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path='/login' element={<LoginPage />} />

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

            <Route path='competition' element={<CompetitionNav />}>
              <Route index element={<Navigate to="view" replace />} />
              <Route path='view' element={<CompetitionView />} />
              <Route path='create' element={<CompetitionForm />} />
              <Route path=':competitionID' element={<CompetitionViewDetail />} />
              <Route path=':competitionID/edit' element={<CompetitionForm />} />
              <Route path=':competitionID/questions/create' element={<QuestionForm />} />
              <Route path=':competitionID/questions/:questionID' element={<QuestionViewDetail />} />
              <Route path=':competitionID/questions/:questionID/edit' element={<QuestionForm />} />
              <Route path=':competitionID/participants/add' element={<ParticipantForm />} />
              <Route path=':competitionID/participants/:participantID' element={<ParticipantViewDetail />} />
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
