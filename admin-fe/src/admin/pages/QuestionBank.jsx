import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import QuestionForm from "../components/subpage/QuestionForm";

const urlExam = "https://localhost:7128/api/Exam";
const urlQuestion = "https://localhost:7128/api/Question";

const QuestionBank = () => {
  const [selectedExam, setSelectedExam] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const questionsPerPage = 5; // Số câu hỏi hiển thị trên mỗi trang
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);

  //Fetch getExam From Giang Vien
  useEffect(() => {
    async function fetchExams() {
      // const userId = localStorage.getItem('userId');
      // if(!userId){
      //   console.log("User ID not found in local storage");
      //   return;
      // }
      const userId = "005106a0-4e6b-b3fb-d759-08dd88065a39";
      try {
        const res = await fetch(`${urlExam}/getAll?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        if (!res.ok) {
          console.log("Error fetching exams");
          return;
        }
        const data = await res.json();
        if (data && data.length > 0) {
          //Chuyen đổi dữ liệu về định dạng mong muốn
          const formatExams = data.map((exam) => ({
            examId: exam.examId,
            title: exam.title,
            descriptiom: exam.description,
            totalQuestions: exam.totalQuestions,
          }));
          setExams(formatExams);
        }
      } catch (err) {
        console.log("Error fetching exams:", err);
      }
    }
    fetchExams();
  }, []);

  async function fetchQuestions(examId) {
    try {
      const res = await fetch(`${urlQuestion}/getByExamId?examId=${examId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        console.log("Error fetching questions");
        return;
      }
      const data = await res.json();
      if (data && data.length > 0) {
        setQuestions(data);
        console.log("Questions data:", data);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      console.log("Error fetching questions:", err);
      setQuestions([]);
    }
  }

  //Handle exam selection change
  function handleSelectedExam(examId) {
    setSelectedExam(examId);
    setCurrentPage(1); // Reset về trang 1 khi chọn đề thi mới
    if (examId !== "Tất cả") {
      fetchQuestions(examId);
    } else {
      setQuestions([]);
    }
  }

  // Danh sách đề thi của giảng viên
  const examDtos = [
    {
      id: "E001",
      name: "Đề thi giữa kỳ Lập trình Web 2024",
      subject: "Lập trình Web",
      type: "Đề thi giữa kỳ",
      semester: "Học kỳ 1 - 2024",
      totalQuestions: 10,
    },
    {
      id: "E002",
      name: "Đề thi cuối kỳ Lập trình Web 2024",
      subject: "Lập trình Web",
      type: "Đề thi cuối kỳ",
      semester: "Học kỳ 1 - 2024",
      totalQuestions: 20,
    },
    {
      id: "E003",
      name: "Kiểm tra 15 phút Lập trình Web - Tuần 5",
      subject: "Lập trình Web",
      type: "Đề kiểm tra 15 phút",
      semester: "Học kỳ 1 - 2024",
      totalQuestions: 5,
    },
  ];

  // Tính toán phân trang
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Hàm xử lý xóa câu hỏi
  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      try {
        const response = await fetch(
          `${urlQuestion}/delete?questionId=${questionId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Cập nhật lại danh sách câu hỏi sau khi xóa
          if (selectedExam !== "Tất cả") {
            fetchQuestions(selectedExam);
          }
          alert("Xóa câu hỏi thành công!");
        } else {
          alert("Có lỗi xảy ra khi xóa câu hỏi!");
        }
      } catch (error) {
        console.error("Error deleting question:", error);
        alert("Có lỗi xảy ra khi xóa câu hỏi!");
      }
    }
  };

  // Hàm xử lý chỉnh sửa câu hỏi
  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setIsQuestionFormOpen(true);
  };
  //Xu ly add cau hoi
  async function handleSubmitQuestion(formData) {
    try {
      let response;
      if (editingQuestion) {
        //Cập nhật câu hỏi
        console.log("Editing question:", editingQuestion);
        console.log("Form data:", formData);
        response = await fetch(
          `${urlQuestion}/update?questionId=${editingQuestion.questionId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              // 'Authorization': `${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(formData),
          }
        );
      } else{
        response = await fetch(`${urlQuestion}/add`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `${sessionStorage.getItem('token')}`
          },
          body: JSON.stringify(formData),
        });
      }
      if (response.ok){
        setIsQuestionFormOpen(false);
        setEditingQuestion(null);
        if (selectedExam !== "Tất cả") {
          fetchQuestions(selectedExam);
        }
        alert(
          editingQuestion
            ? "Cập nhật câu hỏi thành công!"
            : "Thêm câu hỏi mới thành công!"
        );
      }else {
        alert("Có lỗi xảy ra khi lưu câu hỏi!");
      }
    } catch (err) {
      console.log("Error submitting question:", err);
    }
  }
  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-blue-600">
              QuestionBank
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Quản lý ngân hàng câu hỏi
            </p>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            onClick={() => {
              setEditingQuestion(null);
              setIsQuestionFormOpen(true);
            }}
          >
            <FiPlus />
            <span>Tạo câu hỏi mới</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <div className="w-80 bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Chọn đề thi</h4>
            <select
              value={selectedExam}
              onChange={(e) => handleSelectedExam(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tất cả">Tất cả đề thi</option>
              {exams.map((exam) => (
                <option key={exam.examId} value={exam.examId}>
                  {exam.title} - {exam.countOfQuestions} câu hỏi
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Question List or Form */}
        <div className="flex-1">
          {isQuestionFormOpen ? (
            <QuestionForm
              onClose={() => {
                setIsQuestionFormOpen(false);
                setEditingQuestion(null);
              }}
              exams={exams}
              editingQuestion={editingQuestion}
              onSubmit={handleSubmitQuestion}
            />
          ) : (
            <>
              {questions.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                  Không có câu hỏi nào cho đề thi này
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nội dung câu hỏi
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Độ khó
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số câu trả lời
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentQuestions.map((question) => (
                          <tr key={question.questionId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              #{question.questionId}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-md truncate">
                                {question.content}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                {question.difficulty || "Chưa phân loại"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {question.answersDto?.length || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEditQuestion(question)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Chỉnh sửa"
                                >
                                  <FiEdit2 className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteQuestion(question.questionId)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Xóa"
                                >
                                  <FiTrash2 className="w-5 h-5" />
                                </button>
                                <button
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Xem chi tiết"
                                >
                                  <FiEye className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          Hiển thị {indexOfFirstQuestion + 1}-
                          {Math.min(indexOfLastQuestion, questions.length)} trên tổng số {questions.length} câu hỏi
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg ${
                              currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <FiChevronLeft size={20} />
                          </button>

                          {[...Array(totalPages)].map((_, index) => (
                            <button
                              key={index + 1}
                              onClick={() => handlePageChange(index + 1)}
                              className={`px-4 py-2 rounded-lg ${
                                currentPage === index + 1
                                  ? "bg-blue-600 text-white"
                                  : "bg-white text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              {index + 1}
                            </button>
                          ))}

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg ${
                              currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <FiChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
