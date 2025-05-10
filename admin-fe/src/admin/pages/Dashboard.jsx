import CardInfo from "../components/common/CardInfo";
import { useState, useEffect } from "react";
const mockData = {
  students: 120,
  exams: 24,
  ongoing: 5,
};

// Mock data for Recent Tests
// const recentTests = [
//   {
//     id: 1,
//     name: "Kiểm tra giữa kỳ Toán",
//     createdAt: "2023-10-15",
//     status: "Đang diễn ra",
//     startDate: "2023-10-20"
//   },
//   {
//     id: 2,
//     name: "Bài kiểm tra Vật lý",
//     createdAt: "2023-10-10",
//     status: "Đã kết thúc",
//     startDate: "2023-10-15"
//   },
//   {
//     id: 3,
//     name: "Thi thử Hóa học",
//     createdAt: "2023-10-05",
//     status: "Chưa bắt đầu",
//     startDate: "2023-10-25"
//   }
// ];

export default function Dashboard() {

  const [stats, setStats] = useState({ students: 0, exams: 0, ongoing: 0 });
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        // Lấy tổng số học sinh, đề thi, đang diễn ra
        const resStats = await fetch("https://your-api-domain.com/api/dashboard-stats");
        const statsData = await resStats.json();
        setStats(statsData);

        // Lấy danh sách bài test gần đây
        const resTests = await fetch("https://your-api-domain.com/api/tests?limit=3");
        const testsData = await resTests.json();
        setRecentTests(testsData);
      } catch (err) {
        alert("Lỗi khi lấy dữ liệu dashboard!");
      }
      setLoading(false);
    }
    fetchDashboard();
  }, []);
  return (
    <div className="p-8 bg-[#F6F9FC] min-h-screen">
      <div className="flex gap-8 mb-8">
        <CardInfo title="Tổng số học sinh" value={mockData.students} />
        <CardInfo title="Tổng đề thi" value={mockData.exams} />
        <CardInfo title="Đang diễn ra" value={mockData.ongoing} />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Tests</h2>
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
            {recentTests.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              recentTests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b text-sm text-gray-900">{test.name}</td>
                  <td className="py-3 px-4 border-b text-sm text-gray-500">{test.createdAt}</td>
                  <td className="py-3 px-4 border-b">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${
                        test.status === 'Đang diễn ra' ? 'bg-green-100 text-green-800' :
                        test.status === 'Đã kết thúc' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {test.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-500">{test.startDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}