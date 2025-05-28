// MonitoringExam.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaExpand,
  FaPause,
  FaCamera,
  FaMicrophone,
  FaEye,
  FaComment,
  FaExclamationTriangle,
  FaSyncAlt,
  FaClock, // Thêm import FaClock
} from "react-icons/fa";
import { FaCalendarAlt, FaUserGraduate, FaMapMarkerAlt } from "react-icons/fa";
import Hls from 'hls.js'; // Import Hls.js

const MonitoringExam = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [examData, setExamData] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [hlsStreamUrl, setHlsStreamUrl] = useState(null); // State để lưu trữ URL HLS
  const [streamStatus, setStreamStatus] = useState("idle"); // idle, loading, streaming, error
  const [streamError, setStreamError] = useState(null);

  const videoRef = useRef(null); // Ref cho thẻ video HTML

  const API_BASE_URL = "https://localhost:7128/api"; // Đảm bảo đúng base URL API của bạn

  useEffect(() => {
    // Lấy dữ liệu bài thi từ localStorage
    const savedExam = localStorage.getItem("selectedExam");
    if (savedExam) {
      setExamData(JSON.parse(savedExam));
    }
    fetchData(); // Gọi hàm fetch dữ liệu học sinh khi component mount
  }, []); // [] đảm bảo useEffect chỉ chạy một lần sau render đầu tiên

  useEffect(() => {
    // Logic khởi tạo và xử lý HLS.js
    if (hlsStreamUrl && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsStreamUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          console.log("HLS manifest parsed, attempting to play video.");
          videoRef.current.play().catch(e => console.error("Error playing video:", e));
        });
        hls.on(Hls.Events.ERROR, function (event, data) {
          console.error('HLS.js error:', data);
          setStreamError(`HLS Playback Error: ${data.details} - ${data.fatal ? 'Fatal error, attempting to recover...' : ''}`);
          if (data.fatal) {
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                // Try to recover network errors
                console.warn("Fatal network error, attempting to recover...");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.warn("Fatal media error, attempting to recover...");
                hls.recoverMediaError();
                break;
              default:
                // Cannot recover
                hls.destroy();
                setStreamStatus('error');
                break;
            }
          }
        });

        // Cleanup function cho HLS.js
        return () => {
          if (hls) {
            hls.destroy();
            console.log("HLS.js instance destroyed.");
          }
        };
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Hỗ trợ HLS gốc trên trình duyệt (Safari)
        videoRef.current.src = hlsStreamUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current.play().catch(e => console.error("Error playing video (native):", e));
        });
        // Cleanup cho native HLS
        return () => {
          if (videoRef.current) {
            videoRef.current.removeEventListener('loadedmetadata', () => {
              videoRef.current.play();
            });
            videoRef.current.src = "";
            videoRef.current.load();
          }
        };
      } else {
        setStreamError("Trình duyệt của bạn không hỗ trợ phát HLS.");
        setStreamStatus('error');
      }
    } else {
      // Nếu hlsStreamUrl không có hoặc videoRef không tồn tại, đảm bảo không có gì đang phát
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
        videoRef.current.load();
      }
    }
  }, [hlsStreamUrl]); // Dependency array: chạy lại khi hlsStreamUrl thay đổi

  const fetchData = async () => {
    try {
      // Mock examId, thay thế bằng examId thực tế nếu cần
      const examId = "2d8d0680-1b6b-b3fb-e120-08dd88093733"; 
      const response = await fetch(`${API_BASE_URL}/UserExam/getListStudent?examId=${examId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudentList(data);
    } catch (error) {
      console.error("Error fetching student list:", error);
      // Xử lý lỗi khi lấy danh sách học sinh
    }
  };

  const requestStartStream = async (userId) => {
    setStreamStatus('loading');
    setStreamError(null);
    setHlsStreamUrl(null);

    try {
      // Bước 1: Gửi lệnh start_stream
      const startResponse = await fetch(`${API_BASE_URL}/Teacher/start-student-stream?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!startResponse.ok) {
        throw new Error(`Failed to send start stream command: ${startResponse.statusText}`);
      }

      console.log(`Đã gửi lệnh 'start_stream' đến học sinh ${userId}`);

      // Thêm delay để đợi student khởi tạo stream
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Bước 2: Thử lấy URL stream với retry
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          const streamUrlResponse = await fetch(`${API_BASE_URL}/Streaming/url/${userId}`);
          
          if (streamUrlResponse.ok) {
            const data = await streamUrlResponse.json();
            if (data && data.streamUrl) {
              const fullStreamUrl = `https://localhost:7128${data.streamUrl}`;
              console.log(`Đã nhận URL HLS (attempt ${retryCount + 1}):`, fullStreamUrl);
              
              setHlsStreamUrl(fullStreamUrl);
              setStreamStatus('streaming');
              setSelectedStudent(studentList.find(s => s.userId === userId));
              return; // Thoát khi thành công
            }
          }
          
          // Nếu không thành công, đợi 1s trước khi thử lại
          await new Promise(resolve => setTimeout(resolve, 1000));
          retryCount++;
          
        } catch (error) {
          console.warn(`Attempt ${retryCount + 1} failed:`, error);
          if (retryCount === maxRetries - 1) throw error;
        }
      }

      throw new Error('Failed to get stream URL after multiple attempts');

    } catch (error) {
      console.error("Lỗi khi bắt đầu hoặc lấy stream:", error);
      setStreamError(error.message);
      setStreamStatus('error');
    }
  };

  const requestStopStream = async (userId) => {
    try {
      // Gửi lệnh stop_stream đến học sinh qua kênh điều khiển
      const stopResponse = await fetch(`${API_BASE_URL}/Teacher/stop-student-stream?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Thêm token nếu có authentication
        },
      });

      if (!stopResponse.ok) {
        const errorData = await stopResponse.json();
        throw new Error(errorData.error || `Failed to send stop stream command: ${stopResponse.statusText}`);
      }

      console.log(`Đã gửi lệnh 'stop_stream' đến học sinh ${userId}`);
      setStreamStatus('idle'); // Chuyển trạng thái về idle
      setHlsStreamUrl(null); // Xóa URL để dừng phát video
      setSelectedStudent(null); // Bỏ chọn học sinh
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = ""; // Xóa src của video player
        videoRef.current.load(); // Tải lại để xóa bộ đệm
      }

    } catch (error) {
      console.error("Lỗi khi dừng stream:", error);
      setStreamError(error.message);
    }
  };

  // Logic hiển thị video player ở đây
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Giám sát bài thi</h2>

      {examData && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-semibold text-purple-700 mb-4">Thông tin bài thi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="flex items-center text-gray-700">
              <FaCalendarAlt className="mr-2 text-purple-500" />
              <span className="font-medium">Tên bài thi:</span> {examData.examName}
            </p>
            <p className="flex items-center text-gray-700">
              <FaCalendarAlt className="mr-2 text-purple-500" />
              <span className="font-medium">Ngày thi:</span>{" "}
              {new Date(examData.examDate).toLocaleDateString()}
            </p>
            <p className="flex items-center text-gray-700">
              <FaClock className="mr-2 text-purple-500" />
              <span className="font-medium">Thời gian:</span> {examData.durationMinutes} phút
            </p>
            <p className="flex items-center text-gray-700">
              <FaUserGraduate className="mr-2 text-purple-500" />
              <span className="font-medium">Số lượng thí sinh:</span>{" "}
              {studentList.length}
            </p>
            <p className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="mr-2 text-purple-500" />
              <span className="font-medium">Mã môn học:</span>{" "}
              {examData.subjectCode}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phần hiển thị Video Stream */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-purple-700 mb-4">
            {selectedStudent ? `Màn hình của: ${selectedStudent.fullName}` : "Chọn học sinh để xem màn hình"}
          </h3>
          <div className="w-full bg-gray-200 rounded-md flex items-center justify-center relative overflow-hidden" style={{ height: '400px' }}>
            {streamStatus === 'loading' && (
              <p className="text-gray-600 text-lg">Đang tải stream...</p>
            )}
            {streamStatus === 'error' && (
              <p className="text-red-500 text-lg">Lỗi stream: {streamError}</p>
            )}
            {hlsStreamUrl && streamStatus === 'streaming' && (
              <video ref={videoRef} controls autoPlay muted className="w-full h-full object-contain"></video>
            )}
            {streamStatus === 'idle' && !selectedStudent && (
                 <p className="text-gray-600 text-lg">Chưa có màn hình nào được chọn.</p>
            )}
            {streamStatus === 'idle' && selectedStudent && (
                 <p className="text-gray-600 text-lg">Đã dừng stream màn hình của {selectedStudent.fullName}.</p>
            )}
          </div>
        </div>

        {/* Danh sách học sinh */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center justify-between">
            Danh sách thí sinh
            <button
              onClick={fetchData} // Tải lại danh sách
              className="text-gray-500 hover:text-gray-700"
              title="Làm mới danh sách"
            >
              <FaSyncAlt />
            </button>
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MSSV
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Họ tên
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentList.map((student) => (
                  <tr
                    key={student.userId}
                    className={selectedStudent && selectedStudent.userId === student.userId ? "bg-blue-50" : "hover:bg-gray-50"}
                  >
                    <td className="px-4 py-3">{student.userId}</td>
                    <td className="px-4 py-3">{student.mssv}</td>
                    <td className="px-4 py-3">{student.fullName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          student.isStarted
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {student.isStarted ? "Đang thi" : "Chưa vào thi"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); requestStartStream(student.userId); }}
                          className="text-blue-500 hover:text-blue-700"
                          title="Xem màn hình"
                          disabled={streamStatus === 'loading' || streamStatus === 'streaming' && selectedStudent?.userId === student.userId}
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); requestStopStream(student.userId); }}
                          className="text-red-500 hover:text-red-700"
                          title="Dừng màn hình"
                          disabled={streamStatus !== 'streaming' || selectedStudent?.userId !== student.userId}
                        >
                          <FaPause /> {/* Dùng biểu tượng pause để dừng */}
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          title="Gửi thông báo"
                        >
                          <FaComment />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringExam;