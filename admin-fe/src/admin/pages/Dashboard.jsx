import CardInfo from "../components/common/CardInfo";
import { useState, useEffect } from "react";
import Loader from "../components/common/Loader"; // Giả sử có component Loader
import { useNavigate } from "react-router-dom";

// Mock data fallback
const MOCK_DATA = {
  stats: {
    students: 120,
    exams: 24,
    ongoing: 5,
  },
  recentTests: [
    {
      id: 1,
      name: "Kiểm tra giữa kỳ Toán",
      createdAt: "2023-10-15",
      status: "Đang diễn ra",
      startDate: "2023-10-20"
    },
    {
      id: 2,
      name: "Bài kiểm tra Vật lý",
      createdAt: "2023-10-10",
      status: "Đã kết thúc",
      startDate: "2023-10-15"
    },
    {
      id: 3,
      name: "Thi thử Hóa học",
      createdAt: "2023-10-05",
      status: "Chưa bắt đầu",
      startDate: "2023-10-25"
    }
  ]
};

const API_ENDPOINTS = {
  STATS: "https://your-api-domain.com/api/dashboard-stats",
  TESTS: "https://your-api-domain.com/api/tests?limit=3"
};

const StatusBadge = ({startDay,durationInMinutes}) => {
  const startDate = new Date(startDay);
  const endDay = new Date(startDate.getTime() + durationInMinutes * 60000);
  const currentDate = new Date();
  let status = '';
  if(currentDate < startDate){
    status = 'Chưa bắt đầu';
  }
  else if(currentDate > endDay){
    status = 'Đã kết thúc';
  }
  else if(currentDate >= startDate && currentDate <= endDay){
    status = 'Đang diễn ra';
  }
  const statusClasses = {
    'Đang diễn ra': 'bg-green-100 text-green-800',
    'Đã kết thúc': 'bg-red-100 text-red-800',
    'Chưa bắt đầu': 'bg-yellow-100 text-yellow-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const RecentTestsTable = ({ tests, onTestSelect }) => {
  if (tests.length === 0) {
    return (
      <div className="w-full bg-white rounded shadow p-8 text-center text-gray-400">
        Không có dữ liệu
      </div>
    );
  }

  return (
    <table className="w-full bg-white rounded shadow">
      <thead>
        <tr className="bg-gray-50">
          <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-500 uppercase">Tên</th>
          <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-500 uppercase">Ngày tạo</th>
          <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-500 uppercase">Trạng thái</th>
          <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-500 uppercase">Ngày bắt đầu</th>
        </tr>
      </thead>
      <tbody>
        {tests.map((test) => (
          <tr 
            key={test.examId.toString()} 
            className="hover:bg-gray-50 cursor-pointer"
            onClick={() => onTestSelect(test)}
          >
            <td className="py-3 px-4 border-b text-sm text-gray-900">{test.title}</td>
            <td className="py-3 px-4 border-b text-sm text-gray-500">{new Date(test.createdAt.endsWith('Z') ? test.createdAt : test.createdAt + ('Z') ).toLocaleString("vi-VN")}</td>
            <td className="py-3 px-4 border-b">
              <StatusBadge startDay={test.startDay} durationInMinutes={test.durationInMinutes} />
            </td>
            <td className="py-3 px-4 border-b text-sm text-gray-500">{new Date(test.startDay.endsWith('Z') ? test.startDay : test.startDay + ('Z')).toLocaleString("vi-VN")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(MOCK_DATA.stats);
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(
    function (){
      async function getRecentTest(){
        // const token = sessionStorage.getItem("token");
        // const userId = sessionStorage.getItem("userId");
        const userId = "005106a0-4e6b-b3fb-d759-08dd88065a39";
        // console.log("userId", userId);
        // console.log("token", token);
        // if (!userId) {
        //   setError("Vui lòng đăng nhập để xem dữ liệu.");
        //   return;
        // }
        // if (!token) {
        //   setError("Vui lòng đăng nhập để xem dữ liệu.");
        //   return;
        // }
        setLoading(true);
        const res = await fetch(`https://localhost:7128/api/Exam/getAllPagnigation?userId=${userId}&page=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${token}`,
            },
          }
        )
        if (!res.ok) {
          setError("Không thể tải dữ liệu. Đang hiển thị dữ liệu mẫu.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        console.log("data", data);
        if (data) {
          setRecentTests(data);
          
        } else {
          setError("Không có dữ liệu");
        }
        setLoading(false);
      }
      getRecentTest();
    },[setRecentTests]);


  // useEffect(() => {
  //   const fetchDashboard = async () => {
  //     setLoading(true);
  //     setError(null);
      
  //     try {
  //       // Fetch stats and recent tests in parallel
  //       const [statsRes, testsRes] = await Promise.all([
  //         fetch(API_ENDPOINTS.STATS),
  //         fetch(API_ENDPOINTS.TESTS)
  //       ]);

  //       if (!statsRes.ok || !testsRes.ok) {
  //         throw new Error('Failed to fetch dashboard data');
  //       }

  //       const [statsData, testsData] = await Promise.all([
  //         statsRes.json(),
  //         testsRes.json()
  //       ]);

  //       setStats(statsData);
  //       setRecentTests(testsData);
  //     } catch (err) {
  //       console.error('Dashboard fetch error:', err);
  //       setError('Không thể tải dữ liệu. Đang hiển thị dữ liệu mẫu.');
  //       // Keep the mock data as fallback
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDashboard();
  // }, []);

  const handleTestSelect = (test) => {
    // Lưu thông tin bài thi vào localStorage để sử dụng ở trang MonitoringExam
    localStorage.setItem('selectedExam', JSON.stringify(test));
    // Chuyển hướng đến trang MonitoringExam
    navigate('/teacher/monitor');
  };

  if (loading) {
    return (
      <div className="p-8 bg-[#F6F9FC] min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F6F9FC] min-h-screen">
      {error && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
          {error}
        </div>
      )}
      
      <div className="flex gap-8 mb-8 flex-wrap">
        <CardInfo title="Tổng số học sinh" value={stats.students} />
        <CardInfo title="Tổng đề thi" value={stats.exams} />
        <CardInfo title="Đang diễn ra" value={stats.ongoing} />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Bài kiểm tra gần đây</h2>
        <RecentTestsTable tests={recentTests} onTestSelect={handleTestSelect} />
      </div>
    </div>
  );
}