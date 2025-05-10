import React, { useState } from 'react';
import { FaUser, FaExpand, FaPause, FaCamera, FaMicrophone, FaEye, FaComment, FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';
import { FaCalendarAlt, FaUserGraduate, FaMapMarkerAlt } from 'react-icons/fa';

const MonitoringExam = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="p-6">
      

      {/* Exam Info Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Kỳ thi tốt nghiệp THPT 2023 - Môn Toán</h2>
        <div className="flex flex-wrap gap-8 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <FaCalendarAlt />
            <span>10/06/2023 - 08:00 - 10:00</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaUserGraduate />
            <span>125 thí sinh</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt />
            <span>Hội đồng thi THPT Nguyễn Du</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span>Tiến độ thi: 65%</span>
            <span>Thời gian còn lại: 35 phút</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="w-[65%] h-full bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
          <div className="text-gray-600">Thí sinh đang thi</div>
          <div className="text-3xl font-bold text-gray-800 my-2">98</div>
          <div className="text-gray-600">/ 125</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
          <div className="text-gray-600">Cảnh báo gian lận</div>
          <div className="text-3xl font-bold text-yellow-500 my-2">5</div>
          <div className="text-gray-600">cần kiểm tra</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
          <div className="text-gray-600">Kết nối lỗi</div>
          <div className="text-3xl font-bold text-red-500 my-2">3</div>
          <div className="text-gray-600">thí sinh</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
          <div className="text-gray-600">Đã nộp bài</div>
          <div className="text-3xl font-bold text-green-500 my-2">24</div>
          <div className="text-gray-600">thí sinh</div>
        </div>
      </div>

      {/* Live Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-gray-900 rounded-lg p-4 h-[300px] relative">
          <div className="h-full flex items-center justify-center text-gray-400">
            {selectedStudent ? (
              <div className="text-center">
                <FaUser className="text-5xl mx-auto mb-4" />
                <div>Đang giám sát: {selectedStudent.name}</div>
                <div className="text-sm mt-2">Khung hình sẽ hiển thị tại đây</div>
              </div>
            ) : (
              <div className="text-center">
                <FaUser className="text-5xl mx-auto mb-4" />
                <div>Màn hình giám sát thí sinh</div>
                <div className="text-sm mt-2">Chọn thí sinh để xem</div>
              </div>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3">
            <button className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center">
              <FaExpand />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center">
              <FaPause />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center">
              <FaCamera />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center">
              <FaMicrophone />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 h-[300px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Nhật ký hoạt động</h3>
          <div className="space-y-4">
            <div className="pb-3 border-b">
              <span className="text-sm text-gray-500">10:05:23</span>
              <p>Thí sinh Nguyễn Văn A đã nộp bài</p>
            </div>
            <div className="pb-3 border-b">
              <span className="text-sm text-gray-500">10:03:45</span>
              <p>Cảnh báo: Thí sinh Trần Thị B có hành vi bất thường</p>
            </div>
            <div className="pb-3 border-b">
              <span className="text-sm text-gray-500">10:01:12</span>
              <p>Thí sinh Lê Văn C mất kết nối</p>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold">Danh sách thí sinh</h3>
          <div className="flex flex-wrap gap-3">
            <select className="px-4 py-2 border rounded-lg">
              <option>Tất cả trạng thái</option>
              <option>Đang thi</option>
              <option>Đã nộp bài</option>
              <option>Có cảnh báo</option>
              <option>Mất kết nối</option>
            </select>
            <select className="px-4 py-2 border rounded-lg">
              <option>Tất cả phòng thi</option>
              <option>Phòng 101</option>
              <option>Phòng 102</option>
              <option>Phòng 103</option>
            </select>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-gray-600">STT</th>
                <th className="px-4 py-3 text-left text-gray-600">Thí sinh</th>
                <th className="px-4 py-3 text-left text-gray-600">Mã thí sinh</th>
                <th className="px-4 py-3 text-left text-gray-600">Phòng thi</th>
                <th className="px-4 py-3 text-left text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 text-left text-gray-600">Tiến độ</th>
                <th className="px-4 py-3 text-left text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: 1,
                  name: 'Nguyễn Văn A',
                  code: 'TS2023001',
                  room: '101',
                  status: 'active',
                  progress: 75
                },
                {
                  id: 2,
                  name: 'Trần Thị B',
                  code: 'TS2023002',
                  room: '101',
                  status: 'warning',
                  progress: 60
                },
                {
                  id: 3,
                  name: 'Lê Văn C',
                  code: 'TS2023003',
                  room: '102',
                  status: 'inactive',
                  progress: 30
                }
              ].map((student) => (
                <tr
                  key={student.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleStudentSelect(student)}
                >
                  <td className="px-4 py-3">{student.id}</td>
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3">{student.code}</td>
                  <td className="px-4 py-3">{student.room}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      student.status === 'active' ? 'bg-green-100 text-green-800' :
                      student.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.status === 'active' ? 'Đang thi' :
                       student.status === 'warning' ? 'Cảnh báo' :
                       'Mất kết nối'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-full rounded-full ${
                          student.status === 'active' ? 'bg-blue-500' :
                          student.status === 'warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <FaEye />
                      </button>
                      <button className="text-blue-500 hover:text-blue-700">
                        <FaComment />
                      </button>
                      {student.status === 'warning' && (
                        <button className="text-red-500 hover:text-red-700">
                          <FaExclamationTriangle />
                        </button>
                      )}
                      {student.status === 'inactive' && (
                        <button className="text-blue-500 hover:text-blue-700">
                          <FaSyncAlt />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonitoringExam; 