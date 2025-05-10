import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import ExamManagement from '../pages/ExamManagement';
import QuestionBank from '../pages/QuestionBank';
import MonitoringExam from '../pages/MonitoringExam';

const PlaceholderPage = ({ title }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p>Trang này đang được phát triển...</p>
  </div>
);

export const adminRoutes = {
  path: '/admin',
  element: <Layout />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: 'exams', element: <ExamManagement /> },
    { path: 'questions', element: <QuestionBank /> },
    { path: 'monitor', element: <MonitoringExam /> },
    { path: 'statistics', element: <PlaceholderPage title="Thống kê" /> },
    { path: 'settings', element: <PlaceholderPage title="Cài đặt" /> },
  ],
};
