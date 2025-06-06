import { Routes, Route } from 'react-router-dom'
import Layout from '@components/Layout'
import HomePage from '@pages/Home'
import ConsultationPage from '@pages/Consultation'
import DashboardPage from '@pages/Dashboard'
import NotFoundPage from '@pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App