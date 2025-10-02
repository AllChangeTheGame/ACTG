import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RulesPage from './pages/RulesPage';
import Shop from './pages/Shop';
import { AuthProvider } from "./authentication/AuthContext";
import ProtectedRoute from "./authentication/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {

  return (
    <div>
    <Router>
      <AuthProvider>
        <div className="appContainer">
          <Routes>

            <Route path="/login" element={<Login />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rules"
              element={
                <ProtectedRoute>
                  <RulesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop"
              element={
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>
      </AuthProvider>
    </Router>
    </div>
  )
}

export default App