import { useState,useEffect } from 'react';
import { FaQuestionCircle, FaUser, FaCog, FaSignOutAlt, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

// Components
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
    <h3 className="text-lg font-semibold text-purple-600 mb-2">{title}</h3>
    <div className="text-3xl font-bold text-purple-600">{value}</div>
  </div>
);

const QuizTab = ({ active, label, onClick }) => (
  <button
    className={`px-6 py-3 text-sm font-medium ${
      active
        ? 'border-b-2 border-purple-600 text-purple-600'
        : 'text-gray-500 hover:text-gray-700'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const QuizStatus = ({ exam }) => {
  const now = new Date();
  const startDate = new Date(exam.startDay);
  // const isAvailable = exam.isPublished && now >= startDate;

  if (!exam.isPublished) {
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-gray-500 text-white">
        Chưa được phát hành
      </span>
    );
  }

  if (now < startDate) {
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-yellow-500 text-white">
        Chưa đến thời gian
      </span>
    );
  }

  return (
    <span className="px-2 py-1 text-xs rounded-full bg-green-500 text-white">
      Có thể làm bài
    </span>
  );
};

const QuizAction = ({ exam }) => {
  const now = new Date();
  const startDate = new Date(exam.startDay);
  const endDate = new Date(startDate.getTime() + exam.durationInMinutes * 60000 + 15 * 60000);
  const isAvailable = exam.isPublished && now >= startDate;
  const isAvailable2 = now >= endDate;
  const navigate = useNavigate();

  if (!isAvailable) {
    return (
      <button
        disabled
        className="inline-block px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed"
      >
        Không thể làm
      </button>
    );
  }

  if(isAvailable2){
    return (
      (
        <button
          disabled
          className="inline-block px-4 py-2 bg-red-300 text-red-700 rounded cursor-not-allowed"
        >
          Không thể làm
        </button>
      )
      
    );
  }

  return (
    <button 
      onClick={()=> navigate(`/student/doexam?examId=${exam.examId}`)}
      className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
    >
      Bắt đầu
    </button>
  );
};

const Pagination = ({ currentPage, onPageChange }) => (
  <div className="flex justify-center mt-8 space-x-2">
    <button
      className="px-3 py-1 border rounded hover:bg-gray-100"
      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
    >
      <FaAngleLeft />
    </button>
    {[1, 2, 3].map((page) => (
      <button
        key={page}
        className={`px-3 py-1 border rounded ${
          currentPage === page
            ? 'bg-purple-600 text-white border-purple-600'
            : 'hover:bg-gray-100'
        }`}
        onClick={() => onPageChange(page)}
      >
        {page}
      </button>
    ))}
    <button
      className="px-3 py-1 border rounded hover:bg-gray-100"
      onClick={() => onPageChange(Math.min(3, currentPage + 1))}
    >
      <FaAngleRight />
    </button>
  </div>
);

// Mock data
const mockExams = [
  {
    examId: "1",
    title: "Bài kiểm tra giữa kỳ môn Toán",
    startDay: "2024-03-20T08:00:00Z",
    durationInMinutes: 60,
    isPublished: true,
    countOfQuestions: 20
  },
  {
    examId: "2",
    title: "Bài kiểm tra tiếng Anh",
    startDay: "2024-03-25T09:00:00Z",
    durationInMinutes: 45,
    isPublished: true,
    countOfQuestions: 30
  },
  {
    examId: "3",
    title: "Bài kiểm tra Vật lý",
    startDay: "2024-03-22T14:00:00Z",
    durationInMinutes: 90,
    isPublished: false,
    countOfQuestions: 25
  }
];

const mockStats = {
  totalQuizzes: 12,
  averageScore: 8.2,
  completionRate: 83,
  ranking: "Top 15%"
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [exams,setExams] = useState(mockExams);
  const [stats] = useState(mockStats);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(
    function(){
      async function getExams(){
        // const userId = sessionStorage.getItem('userId');
        // const token = sessionStorage.getItem('token');
        // if (!token) {
        //   window.location.href = '/login';
        // }
        // if (!userId){
        //   window.location.href = '/login';
        // }
        const userId = '837a04f0-576b-b3fb-f49f-08dd91885d21'
        const res = await fetch(`https://localhost:7128/api/Exam/getAllUser?userId=${userId}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`,
          },

        });
        if (!res.ok) {
          console.error('Failed to fetch exams');
          return;
        }
        const data = await res.json();
        if (data) {
          setExams(data);
        } else {
          console.error('No data found');
        }

      }
      getExams();
    },[]
  );
  const tabs = [
    { id: 'all', label: 'Tất cả bài thi' },
    { id: 'not-started', label: 'Chưa hoàn thành' },
    { id: 'completed', label: 'Đã hoàn thành' },
    { id: 'expired', label: 'Đã hết hạn' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}  
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaQuestionCircle className="text-3xl text-purple-600" />
              <h1 className="ml-2 text-2xl font-bold text-purple-600">QuizCast</h1>
            </div>
            <div className="relative">
              <img
                src="https://via.placeholder.com/40"
                alt="User Avatar"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link 
                    to="/student/info" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser className="inline mr-2" /> Hồ sơ
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaCog className="inline mr-2" /> Cài đặt
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="inline mr-2" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-purple-600">Chào mừng trở lại!</h2>
              <p className="text-gray-600 mt-1">Bạn có {exams.filter(exam => exam.isPublished).length} bài thi có thể làm</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Tổng số bài thi" value={stats.totalQuizzes} />
          <StatCard title="Điểm trung bình" value={stats.averageScore} />
          <StatCard title="Hoàn thành" value={`${stats.completionRate}%`} />
          <StatCard title="Xếp hạng" value={stats.ranking} />
        </div>

        {/* Quiz List Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên bài thi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian bắt đầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian làm bài
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exams.map((exam) => (
                  <tr key={exam.examId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(exam.startDay).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exam.durationInMinutes} phút
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <QuizStatus exam={exam} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <QuizAction exam={exam} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
      </main>
    </div>
  );
};

export default Dashboard;