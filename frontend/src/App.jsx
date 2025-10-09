import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SpecialRules from './pages/SpecialRules';
import ChallengeCardMultipliers from './pages/ChallengeCardMultipliers';
import Shop from './pages/Shop';
import Guides from './pages/Guides';
import Delays from './pages/Delays';
import Links from './pages/Links';
import ScrewYouCards from './pages/ScrewYouCards';
import TransactionHistory from './pages/TransactionHistory';
import { AuthProvider } from "./authentication/AuthContext";
import ProtectedRoute from "./authentication/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { GameProvider } from './contexts/GameContext';

function App() {

  return (
    <GameProvider>
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
                path="/specialrules"
                element={
                  <ProtectedRoute>
                    <SpecialRules />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/specialrules2"
                element={
                  <ProtectedRoute>
                    <ChallengeCardMultipliers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <TransactionHistory />
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
              <Route
                path="/guides"
                element={
                  <ProtectedRoute>
                    <Guides />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/delays"
                element={
                  <ProtectedRoute>
                    <Delays />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/links"
                element={
                  <ProtectedRoute>
                    <Links />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/screwyoucards"
                element={
                  <ProtectedRoute>
                    <ScrewYouCards />
                  </ProtectedRoute>
                }
              />

            </Routes>
          </div>
        </AuthProvider>
      </Router>
      </div>
    </GameProvider>
  )
}

export default App