import { useState, useEffect, useMemo, useCallback } from "react";
import ExamForm from "../components/subpage/ExamForm";
import StudentList from "../components/subpage/StudentList";
import { FaEye, FaEdit, FaTrash, FaUsers, FaSearch, FaPlus, FaArrowLeft } from "react-icons/fa";
import Loader from "../components/common/Loader";

const PAGE_SIZE = 5;
const API_ENDPOINT = "https://localhost:7128/api/Exam";

const StatusBadge = ({isPublished}) => {
  const status = isPublished ? 'Công khai' : 'Chưa công khai';
  const statusClasses = {
    'Công khai': 'bg-green-100 text-green-800',
    'Chưa công khai': 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const ExamTable = ({ exams, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow min-h-[300px] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow min-h-[300px] flex items-center justify-center">
        <p className="text-gray-500">Không có đề thi nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase">Tên</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase">Ngày Thi</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase">Thời gian thi</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase">Trạng thái </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase w-24">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {exams.map((exam) => (
            <tr key={exam.examId.toString()} className="hover:bg-gray-50">
              <td className="py-3 px-4 text-sm text-gray-900 truncate" title={exam.title}>{exam.title}</td>
              <td className="py-3 px-4 text-sm text-gray-500">
              {new Date(exam.startDay.endsWith('Z') ? exam.startDay : exam.startDay + 'Z').toLocaleString()}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">{exam.durationInMinutes} phút</td>
              <td className="py-3 px-4 border-b">
              <StatusBadge isPublished={exam.isPublished} />
            </td>
              <td className="py-3 px-4 text-sm text-gray-500 flex gap-2 justify-center">
                <button 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Xem chi tiết"
                >
                  <FaEye />
                </button>
                <button 
                  className="text-gray-600 hover:text-black transition-colors" 
                  onClick={() => onEdit(exam)}
                  title="Chỉnh sửa"
                >
                  <FaEdit />
                </button>
                <button 
                  className="text-red-600 hover:text-red-800 transition-colors" 
                  onClick={() => onDelete(exam.examId)}
                  title="Xóa"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Pagination = ({ currentPage, totalPage, onPageChange }) => {
  if (totalPage <= 1) return null;

  return (
    <div className="flex justify-center mt-4 gap-1">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        &lt;
      </button>
      {Array.from({ length: totalPage }).map((_, i) => (
        <button
          key={i}
          className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        disabled={currentPage === totalPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        &gt;
      </button>
    </div>
  );
};

export default function ExamManagement({
  examsData = [],
  onCreateExam,
  onUpdateExam,
  onDeleteExam,
}) {
  const [exams, setExams] = useState(examsData);
  const [showForm, setShowForm] = useState(false);
  const [showCandidates, setShowCandidates] = useState(false);
  const [editExam, setEditExam] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //Fecth data from API
  useEffect(
    function(){
      async function getTest() {
        setLoading(true);
        setError(null);
        // const token = sessionStorage.getItem("token");
        // const userId = sessionStorage.getItem("userId");
        // if (!userId) {
        //   setError("Vui lòng đăng nhập để xem dữ liệu.");
        //   return;
        // }
        // if (!token) {
        //   setError("Vui lòng đăng nhập để xem dữ liệu.");
        //   return;
        // }
        const userId = "005106a0-4e6b-b3fb-d759-08dd88065a39";
        console.log("page", page);
        const res = await fetch(`${API_ENDPOINT}/getAll?userId=${userId}&page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          setError("Không thể tải dữ liệu. Đang hiển thị dữ liệu mẫu.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data) {
          setExams(data);
        } else {
          setError("Không có dữ liệu");
        }
        setLoading(false);
    };
    getTest();
  },[page]
  );

  // Filter and pagination logic
  const { filteredExams, totalPage, pageExams } = useMemo(() => {
    const filtered = exams.filter(exam =>
      exam.title.toLowerCase().includes(search.toLowerCase())
    );
    const total = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );
    return { filteredExams: filtered, totalPage: total, pageExams: paginated };
  }, [exams, search, page]);

  // Handlers
  const handleCreate = useCallback(async (data) => {
    try {
      let requestExam;
      if (onCreateExam) {
        requestExam = await onCreateExam(data);
      } else {
        requestExam = { 
          ...data 
        };
      }
      console.log(requestExam);
      //Fetch API ở đây để thêm 
      const res = await fetch(`${API_ENDPOINT}/add`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestExam),
      }
      );
      if (!res.ok) {
        throw new Error('Failed to create exam');
      }
      const createdExam = await res.json();
      console.log("createExam",createdExam);
      //
      setExams(prev => [...prev, createdExam]);
      setShowForm(false);
      return true;
    } catch (err) {
      console.error('Create exam error:', err);
      return false;
    }
  }, [exams, onCreateExam]);

  const handleUpdate = useCallback(
    async (data) => {
      try {
        let requestExam;
        if (onUpdateExam) {
          requestExam = await onUpdateExam(data);
        } else {
          requestExam = { 
            ...data 
          };
        }
        console.log("requestExam", requestExam);
        //Fetch API ở đây để cập nhật
        console.log(requestExam.examId);
        const res = await fetch(
          `${API_ENDPOINT}/update?examId=${requestExam.examId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              // "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify(requestExam),
          }
        );
        if (!res.ok) {
          throw new Error("Failed to update exam");
        } else {
          setExams((prev) =>
            prev.map((e) => (e.examId === requestExam.examId ? requestExam : e))
          );
        }
        setShowForm(false);
        return true;
      } catch (err) {
        console.error("Update exam error:", err);
        return false;
      }
    },
    [onUpdateExam]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Bạn có chắc chắn muốn xóa đề thi này?")) return;
      console.log("id", id);
      try {
        let examId;
        if (onDeleteExam) {
          examId = await onDeleteExam(id);
        } else {
          examId = id;
        }
        //Fetch API ở đây để xóa
        const res = await fetch(`${API_ENDPOINT}/delete?examId=${examId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to delete exam");
        } else {
          setExams((prev) => prev.filter((e) => e.examId !== examId));
          // Reset page if current page becomes empty
          setPage((prev) =>
            pageExams.length === 1 && prev > 1 ? prev - 1 : prev
          );
        }

        return true;
      } catch (err) {
        console.error("Delete exam error:", err);
        return false;
      }
    },
    [onDeleteExam, pageExams.length]
  );

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return (
    <div className="p-6 bg-[#F6F9FC] min-h-screen">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {!showForm && !showCandidates ? (
        <>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
              onClick={() => { setEditExam(null); setShowForm(true); }}
            >
              <FaPlus /> Tạo đề thi mới
            </button>
            
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
              onClick={() => setShowCandidates(true)}
            >
              <FaUsers /> Danh sách thí sinh
            </button>
            
            <div className="relative flex-1 min-w-[250px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm đề thi..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetPage();
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="ml-auto bg-white rounded shadow px-6 py-3 text-center min-w-[120px]">
              <div className="text-sm text-gray-500">Tổng đề thi</div>
              <div className="text-xl font-bold text-blue-600">{exams.length}</div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Danh sách đề thi</h2>
            <p className="text-sm text-gray-500">
              Hiển thị {pageExams.length} trên tổng số {filteredExams.length} đề thi
            </p>
          </div>

          <ExamTable 
            exams={pageExams} 
            onEdit={(exam) => { setEditExam(exam); setShowForm(true); }} 
            onDelete={handleDelete}
            isLoading={loading}
          />

          <Pagination 
            currentPage={page} 
            totalPage={totalPage} 
            onPageChange={setPage} 
          />
        </>
      )
      //Xét điều kiện để mở StudenList 
      : showCandidates ? 
      (
        <div>
          <button
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => setShowCandidates(false)}
          >
            <FaArrowLeft /> Quay lại
          </button>
          <StudentList />
        </div>
      ) 
      //Xét điều kiện mở ExamForm
      : (
        <ExamForm
          onClose={() => { setShowForm(false); setEditExam(null); }}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          initialData={editExam}
        />
      )}
    </div>
  );
}