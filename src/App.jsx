import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import FloatingActions from './components/common/FloatingActions';
import ScrollToTop from './components/common/ScrollToTop';
import { AuthProvider } from './context/AuthContext';

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const TeachersPage = lazy(() => import('./pages/TeachersPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CourseDetailsPage = lazy(() => import('./pages/CourseDetailsPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const MethodPage = lazy(() => import('./pages/MethodPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsDetailsPage = lazy(() => import('./pages/NewsDetailsPage'));
const PaymentPolicyPage = lazy(() => import('./pages/PaymentPolicyPage'));
const CommitmentPolicyPage = lazy(() => import('./pages/CommitmentPolicyPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// Lazy load admin components (only loaded when accessed)
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminMedia = lazy(() => import('./admin/pages/AdminMedia'));
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminLeads = lazy(() => import('./admin/pages/AdminLeads'));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'));
const AdminPrograms = lazy(() => import('./admin/pages/AdminPrograms'));
const AdminMentors = lazy(() => import('./admin/pages/AdminMentors'));
const AdminBlogPosts = lazy(() => import('./admin/pages/AdminBlogPosts'));
const AdminStudentResults = lazy(() => import('./admin/pages/AdminStudentResults'));
const AdminSchedules = lazy(() => import('./admin/pages/AdminSchedules'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {!isAdminRoute && <Header />}
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course-details/:courseId" element={<CourseDetailsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/payment-policy" element={<PaymentPolicyPage />} />
            <Route path="/commitment-policy" element={<CommitmentPolicyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/method" element={<MethodPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="programs" element={<AdminPrograms />} />
                <Route path="mentors" element={<AdminMentors />} />
                <Route path="blog-posts" element={<AdminBlogPosts />} />
                <Route path="student-results" element={<AdminStudentResults />} />
                <Route path="media" element={<AdminMedia />} />
                <Route path="leads" element={<AdminLeads />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="schedules" element={<AdminSchedules />} />
              </Route>
            </Route>

            {/* Catch-all dynamic slug route (Must be after specific routes) */}
            <Route path="/:slug" element={<NewsDetailsPage />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute && <FloatingActions />}
      {!isAdminRoute && <ScrollToTop />}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

import { HelmetProvider } from 'react-helmet-async';
import { SettingsProvider } from './context/SettingsContext';
import SEOHelper from './components/common/SEOHelper';

function App() {
  return (
    <HelmetProvider>
      <SettingsProvider>
        <AuthProvider>
          <Router>
            <SEOHelper />
            <AppContent />
          </Router>
        </AuthProvider>
      </SettingsProvider>
    </HelmetProvider>
  );
}

export default App;
