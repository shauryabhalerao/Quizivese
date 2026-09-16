import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import QuizzesPage from './pages/QuizzesPage';
import QuizActivePage from './pages/QuizActivePage';
import QuizResultPage from './pages/QuizResultPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AchievementsPage from './pages/AchievementsPage';
import AiQuizGenPage from './pages/AiQuizGenPage';
import CreateQuizPage from './pages/CreateQuizPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QuizProvider>
          <div className="app-layout">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Discovery Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/quizzes" element={<QuizzesPage />} />
                <Route path="/create-quiz" element={<CreateQuizPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/ai-quiz" element={<AiQuizGenPage />} />

              {/* Protected Student Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quiz/:quizId" 
                element={
                  <ProtectedRoute>
                    <QuizActivePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/results/:attemptId" 
                element={
                  <ProtectedRoute>
                    <QuizResultPage />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        </QuizProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
