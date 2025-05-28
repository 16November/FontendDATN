import React, { useState, useEffect, useRef } from "react";

const TABS = [
  { key: "manual", label: "Thêm thủ công" },
  { key: "excel", label: "Thêm từ Excel" },
  { key: "view", label: "Xem danh sách" },
];

const initialManual = {
  mssv: "",
  fullName: "",
};

const CandidateManager = () => {
  const [tab, setTab] = useState("manual");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manual, setManual] = useState(initialManual);
  const [excelError, setExcelError] = useState("");
  const excelInputRef = useRef();
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [loadingExams, setLoadingExams] = useState(true);

  // Fetch danh sách đề thi
  useEffect(() => {
    const fetchExams = async () => {
      try {
        // const userId = sessionStorage.getItem('userId');
        const userId = '005106a0-4e6b-b3fb-d759-08dd88065a39';
        const response = await fetch(`https://localhost:7128/api/Exam/getAll?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Không thể tải danh sách đề thi');
        }

        const data = await response.json();
        setExams(data);
        if (data.length > 0) {
          setSelectedExamId(data[0].examId);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingExams(false);
      }
    };

    fetchExams();
  }, []);

  // Fetch danh sách thí sinh khi chọn đề thi
  useEffect(() => {
    if (selectedExamId) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          const response = await fetch(`https://localhost:7128/api/UserExam/getList?examId=${selectedExamId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Không thể tải danh sách thí sinh');
          }

          const data = await response.json();
          setStudents(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchStudents();
    }
  }, [selectedExamId]);

  // Handle manual input change
  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManual((prev) => ({ ...prev, [name]: value }));
  };

  // Add manual student
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExamId) {
      alert("Vui lòng chọn đề thi!");
      return;
    }
    try {
      const response = await fetch(`https://localhost:7128/api/UserExam/add?examId=${selectedExamId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manual),
      });

      if (!response.ok) {
        throw new Error('Không thể thêm thí sinh');
      }

      alert("Thêm thí sinh thành công!");
      setManual(initialManual);
      // Refresh danh sách
      const updatedResponse = await fetch(`https://localhost:7128/api/UserExam/getList?examId=${selectedExamId}`);
      const updatedData = await updatedResponse.json();
      setStudents(updatedData);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Excel upload
  const handleExcelSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExamId) {
      alert("Vui lòng chọn đề thi!");
      return;
    }
    setExcelError("");
    const file = excelInputRef.current.files[0];
    if (!file) {
      setExcelError("Vui lòng chọn file Excel");
      return;
    }

    const reader = new FileReader();
   
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.trim().split("\n");
   
      if (lines.length < 2) {
        setExcelError("File CSV không có dữ liệu");
        return;
      }
   
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const mssvIndex = headers.findIndex(h => h === "mssv");
      const nameIndex = headers.findIndex(h => h === "họ và tên");
   
      if (mssvIndex === -1 || nameIndex === -1) {
        setExcelError("File CSV phải chứa cột 'MSSV' và 'Họ và tên'");
        return;
      }
   
      const students = lines.slice(1).map(line => {
        const cells = line.split(",").map(c => c.trim());
        return {
          mssv: cells[mssvIndex],
          fullName: cells[nameIndex],
        };
      });
      console.log(students);
      try {
        const response = await fetch(`https://localhost:7128/api/UserExam/addList?examId=${selectedExamId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(students),
        });

        if (!response.ok) {
          throw new Error('Không thể import danh sách thí sinh');
        }

        alert("Import danh sách thí sinh thành công!");
        excelInputRef.current.value = "";
        // Refresh danh sách
        const updatedResponse = await fetch(`https://localhost:7128/api/UserExam/getList?examId=${selectedExamId}`);
        const updatedData = await updatedResponse.json();
        setStudents(updatedData);
      } catch (err) {
        setExcelError(err.message);
      }
    };
   
    reader.readAsText(file, "UTF-8");
  };

  if (loadingExams) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Đang tải danh sách đề thi...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Đang tải danh sách thí sinh...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500 text-xl">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto py-8 px-2">
        <header className="bg-blue-900 text-white rounded-lg py-6 mb-8 text-center shadow">
          <h1 className="text-2xl font-bold">QUẢN LÝ DANH SÁCH THÍ SINH</h1>
        </header>

        <div className="bg-white rounded-lg shadow p-6">
          {/* Chọn đề thi */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Chọn đề thi:</label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              {exams.map((exam) => (
                <option key={exam.examId} value={exam.examId}>
                  {exam.title}
                </option>
              ))}
            </select>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap border-b mb-6">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`px-6 py-2 font-semibold rounded-t transition ${
                  tab === t.key
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                }`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "manual" && (
            <form onSubmit={handleManualSubmit} className="max-w-lg mx-auto">
              <h2 className="text-xl font-bold mb-4 text-blue-700">Thêm thí sinh thủ công</h2>
              <div className="mb-3">
                <label className="block mb-1 font-medium">MSSV</label>
                <input
                  type="text"
                  name="mssv"
                  value={manual.mssv}
                  onChange={handleManualChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={manual.fullName}
                  onChange={handleManualChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded font-semibold hover:bg-blue-600 transition"
              >
                Thêm thí sinh
              </button>
            </form>
          )}

          {tab === "excel" && (
            <form onSubmit={handleExcelSubmit} className="max-w-lg mx-auto">
              <h2 className="text-xl font-bold mb-4 text-blue-700">Thêm thí sinh từ file Excel</h2>
              <div className="mb-3">
                <label className="block mb-1 font-medium">Chọn file Excel</label>
                <input
                  type="file"
                  accept=".csv"
                  ref={excelInputRef}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded font-semibold hover:bg-blue-600 transition"
              >
                Tải lên và thêm
              </button>
              {excelError && <div className="text-red-500 mt-2">{excelError}</div>}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6 rounded">
                <h3 className="font-semibold mb-2">Định dạng file CSV</h3>
                <p>File CSV cần có các cột theo thứ tự sau:</p>
                <p className="font-mono text-sm">MSSV, Họ và tên</p>
                <p className="mt-2">Ví dụ:</p>
                <pre className="bg-gray-100 p-2 rounded text-sm">
MSSV,Họ và tên
20100001,Nguyễn Văn A
20100002,Trần Thị B
                </pre>
              </div>
            </form>
          )}

          {tab === "view" && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-blue-700">Danh sách thí sinh</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-blue-500 text-white">
                      <th className="py-2 px-3">MSSV</th>
                      <th className="py-2 px-3">Họ và tên</th>
                      <th className="py-2 px-3">Điểm số</th>
                      <th className="py-2 px-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          Không có thí sinh nào
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.mssv} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3">{student.mssv}</td>
                          <td className="py-2 px-3">{student.fullName}</td>
                          <td className="py-2 px-3">{student.score?.toFixed(2) || 'Chưa có điểm'}</td>
                          <td className="py-2 px-3">
                            {student.isSubmitted ? 'Đã nộp bài' : 'Chưa nộp bài'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-8 text-center text-gray-500">
          Hệ thống quản lý thí sinh &copy; 2024
        </footer>
      </div>
    </div>
  );
};

export default CandidateManager;