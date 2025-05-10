import { useState, useEffect } from 'react';
import { FaQuestionCircle, FaUser, FaCog, FaSignOutAlt, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { quizService, statsService, authService } from '../../services/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    completionRate: 0,
    ranking: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [quizzesData, statsData] = await Promise.all([
          quizService.getQuizzes(activeTab, currentPage),
          statsService.getStats()
        ]);
        setQuizzes(quizzesData.quizzes);
        setStats(statsData);
        setError(null);
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, currentPage]);

  const handleLogout = () => {
    authService.logout();
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'not-started': 'bg-gray-200 text-gray-700',
      'in-progress': 'bg-yellow-500 text-white',
      'completed': 'bg-green-500 text-white',
      'expired': 'bg-gray-500 text-white'
    };
    return statusClasses[status] || 'bg-gray-200 text-gray-700';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'not-started': 'Chưa bắt đầu',
      'in-progress': 'Đang làm dở',
      'completed': 'Đã hoàn thành',
      'expired': 'Đã hết hạn'
    };
    return statusTexts[status] || 'Chưa bắt đầu';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <FaQuestionCircle className="text-3xl text-purple-600" />
            <h1 className="ml-2 text-2xl font-semibold text-purple-600">QuizCast</h1>
          </div>
          <div className="relative group">
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FaUser className="inline mr-2" /> Hồ sơ
              </a>
              <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FaCog className="inline mr-2" /> Cài đặt
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaSignOutAlt className="inline mr-2" /> Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-purple-600">Chào mừng trở lại, Nguyễn Văn A!</h2>
            <p className="text-gray-600 mt-1">Bạn có 2 bài thi chưa hoàn thành và 5 bài thi đã hoàn thành</p>
          </div>
          <a
            href="/profile"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Cập nhật hồ sơ
          </a>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Tổng số bài thi</h3>
            <div className="text-3xl font-bold text-purple-600">{stats.totalQuizzes}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Điểm trung bình</h3>
            <div className="text-3xl font-bold text-purple-600">{stats.averageScore}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Hoàn thành</h3>
            <div className="text-3xl font-bold text-purple-600">{stats.completionRate}%</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Xếp hạng</h3>
            <div className="text-3xl font-bold text-purple-600">{stats.ranking}</div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {['all', 'not-started', 'completed', 'expired'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' && 'Tất cả bài thi'}
                {tab === 'not-started' && 'Chưa hoàn thành'}
                {tab === 'completed' && 'Đã hoàn thành'}
                {tab === 'expired' && 'Đã hết hạn'}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                  Tên bài thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                  Môn học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                  Ngày thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quiz.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quiz.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quiz.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quiz.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(quiz.status)}`}>
                      {getStatusText(quiz.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {quiz.status === 'expired' ? (
                      <button
                        disabled
                        className="bg-gray-200 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
                      >
                        Không thể làm
                      </button>
                    ) : (
                      <a
                        href={`/quiz/${quiz.id}`}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                      >
                        {quiz.status === 'completed' ? 'Xem kết quả' : 'Bắt đầu'}
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={currentPage === 1}
          >
            <FaAngleLeft />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 border rounded-md ${
                currentPage === page
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={currentPage === 3}
          >
            <FaAngleRight />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 