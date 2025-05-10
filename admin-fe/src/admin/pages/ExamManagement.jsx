import { useState, useEffect } from "react";
import ExamForm from "../components/subpage/ExamForm";
import { FaEye, FaEdit, FaTrash, FaUsers } from "react-icons/fa";

const PAGE_SIZE = 5;

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


  //Call API
  useEffect(() => {
    async function fetchExams() {
      setLoading(true);
      try {
        const res = await fetch("https://your-api-domain.com/api/exams");
        const data = await res.json();
        setExams(data);
      } catch (err) {
        alert("Lỗi khi lấy danh sách đề thi!");
      }
      setLoading(false);
    }
    fetchExams();
  }, []);

  // Lọc và phân trang
  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPage = Math.ceil(filteredExams.length / PAGE_SIZE);
  const pageExams = filteredExams.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Xử lý tạo mới
  const handleCreate = async (data) => {
    if (onCreateExam) {
      const newExam = await onCreateExam(data);
      setExams([...exams, newExam]);
    } else {
      setExams([
        ...exams,
        { ...data, id: exams.length + 1, createdAt: new Date().toISOString().split("T")[0] },
      ]);
    }
    setShowForm(false);
    setEditExam(null);
  };

  // Xử lý cập nhật
  const handleUpdate = async (data) => {
    if (onUpdateExam) {
      const updatedExam = await onUpdateExam(data);
      setExams(exams.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
    } else {
      setExams(exams.map((e) => (e.id === data.id ? { ...e, ...data } : e)));
    }
    setShowForm(false);
    setEditExam(null);
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    if (onDeleteExam) {
      await onDeleteExam(id);
    }
    setExams(exams.filter((e) => e.id !== id));
  };

  return (
    <div className="p-8 bg-[#F6F9FC] min-h-screen">
      {!showForm && !showCandidates ? (
        <>
          <div className="flex items-center gap-4 mb-4">
            <button
              className="bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={() => { setEditExam(null); setShowForm(true); }}
            >
              + New Exam
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={() => setShowCandidates(true)}
            >
              <FaUsers /> Danh sách thí sinh
            </button>
            <div className="flex items-center border rounded px-2 bg-white">
              <span className="text-gray-400 mr-2">🔍</span>
              <input
                type="text"
                placeholder="SearchText....."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none py-2"
              />
            </div>
            <div className="ml-auto bg-white rounded shadow px-6 py-2 text-center">
              <div className="text-sm text-gray-500">Tổng đề thi</div>
              <div className="text-xl font-bold">{exams.length}</div>
            </div>
          </div>
          <div>
            <div className="font-bold mb-2">Danh sách đề thi</div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr>
                    <th className="py-2 px-2 w-12">ID</th>
                    <th className="py-2 px-2 w-1/4">Tên</th>
                    <th className="py-2 px-2 w-1/5">Ngày tạo</th>
                    <th className="py-2 px-2 w-1/5">Thời gian thi</th>
                    <th className="py-2 px-2 w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pageExams.map((exam) => (
                    <tr key={exam.id}>
                      <td className="py-2 px-2 text-center">{exam.id}</td>
                      <td className="py-2 px-2">{exam.title}</td>
                      <td className="py-2 px-2">{exam.createdAt}</td>
                      <td className="py-2 px-2">{exam.duration}</td>
                      <td className="py-2 px-2 flex gap-2 justify-center">
                        <button className="text-blue-700"><FaEye /></button>
                        <button className="text-black" onClick={() => { setEditExam(exam); setShowForm(true); }}><FaEdit /></button>
                        <button className="text-red-600" onClick={() => handleDelete(exam.id)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                  {pageExams.length < PAGE_SIZE &&
                    Array.from({ length: PAGE_SIZE - pageExams.length }).map((_, i) => (
                      <tr key={`empty-${i}`}>
                        <td colSpan={5} className="py-2 px-2">&nbsp;</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-2 gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-2"
              >
                &lt;
              </button>
              {Array.from({ length: totalPage }).map((_, i) => (
                <button
                  key={i}
                  className={`px-2 ${page === i + 1 ? "font-bold underline" : ""}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === totalPage}
                onClick={() => setPage(page + 1)}
                className="px-2"
              >
                &gt;
              </button>
            </div>
          </div>
        </>
      ) : (
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