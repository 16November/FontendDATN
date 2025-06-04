import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaClock,
  FaList,
  FaQuestionCircle,
} from "react-icons/fa";
// import html2canvas from 'html2canvas';
import ScreenStreamer from "./ScreenStreamer";


// Mock data cho bài thi


const DoExam = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const examId = '2d8d0680-1b6b-b3fb-e120-08dd88093733';
  const [exam, setExam] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const timerRef = useRef();
  const screenshotTimerRef = useRef();
  const mainContentRef = useRef(null);

  const userId = "837a04f0-576b-b3fb-f49f-08dd91885d21"; // Mock user ID
  // Hàm chụp màn hình và gửi lên server
  // const takeScreenshot = async () => {
  //   if (!mainContentRef.current || isSubmitted) return;

  //   try {
  //     const canvas = await html2canvas(mainContentRef.current);
  //     const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
  //     // Gửi ảnh lên server
  //     const userId = "6be704c8-606b-b3fb-81f0-08dd9957528b";
  //     const response = await fetch(
  //       `https://localhost:7128/api/Screenshot/add?userId=${userId}&examId=${examId}`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           imageData: imageData,
  //           timestamp: new Date().toISOString()
  //         })
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error('Failed to upload screenshot');
  //     }
  //   } catch (error) {
  //     console.error('Error taking screenshot:', error);
  //   }
  // };

  // // Bắt đầu chụp màn hình tự động
  // useEffect(() => {
  //   if (!loading && !isSubmitted) {
  //     // Chụp màn hình mỗi 10 giây
  //     screenshotTimerRef.current = setInterval(takeScreenshot, 10000);
  //   }
  //   return () => {
  //     if (screenshotTimerRef.current) {
  //       clearInterval(screenshotTimerRef.current);
  //     }
  //   };
  // }, [loading, isSubmitted]);

  // Lấy dữ liệu bài thi từ server
  useEffect(() => {
    if (!examId) {
      setError("Không tìm thấy mã đề thi!");
      setLoading(false);
      return;
    }

    // const token = sessionStorage.getItem("token");
    // if (!token) {
    //   navigate("/login");
    //   return;
    // }
    // const userId = sessionStorage.getItem("userId");
    const userId = "837a04f0-576b-b3fb-f49f-08dd91885d21";
    async function fetchData() {
      try {
        const [examRes, questionRes] = await Promise.all([
          fetch(
            `https://localhost:7128/api/Exam/getDetail?examId=${examId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${token}`,
              },
            }
          ),
          fetch(
            `https://localhost:7128/api/Question/getExamUser?examId=${examId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${token}`,
              },
            }
          ),
          
        ]);
        
        // Check if responses are ok
        if(examRes.ok && questionRes.ok){
          const res = await fetch(`https://localhost:7128/api/UserExam/updateStatus?userId=${userId}&examId=${examId}&isStarted=true`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok){
            throw new Error("Failed to update exam status");
          }
        }
        if (!examRes.ok || !questionRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const examData = await examRes.json();
        const questionData = await questionRes.json();
        console.log(questionData);
        setExam(examData);
        setQuestions(questionData);
        setTimeLeft(examData.durationInMinutes * 60);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [examId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (!loading && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [loading, isSubmitted]);

  // Format timer
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Chọn đáp án
  const handleOptionChange = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  // Chuyển câu hỏi
  const goToQuestion = (idx) => {
    if (idx >= 0 && idx < questions.length) {
      setCurrent(idx);
    }
  };

  // Nộp bài
  const handleSubmit = async () => {
    if (isSubmitted) return;

    clearInterval(timerRef.current);
    setIsSubmitted(true);
    setIsReviewing(true);

    try {
      const token = sessionStorage.getItem("token");
      // const userId = sessionStorage.getItem("userId");
      const userId = "837a04f0-576b-b3fb-f49f-08dd91885d21";
      
      const userAnswers = 
      Object.entries(answers).map(([questionId, answerId]) => ({
        questionId,
        answerId,
      }));
      
      console.log("userAnswer",userAnswers);
      const response = await fetch(
        `https://localhost:7128/api/UserAnswer/add?userId=${userId}&examId=${exam.examId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          
          body: JSON.stringify(
            userAnswers)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit exam");
      }
      const result = await response.json();
      setScore(result);
      console.log("result", result);
      alert(`Bài làm đã được nộp!`);
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại!");
    }
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Đang tải đề thi...</div>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-4 py-2 bg-purple-600 text-white rounded"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Câu hỏi hiện tại
  const currentQuestion = questions[current];

  return (
    <>
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="font-semibold text-lg text-purple-600 flex items-center gap-2">
          <FaQuestionCircle />
          {exam.title} - Câu hỏi {current + 1}/{questions.length}
        </div>
        {!isSubmitted && (
          <div className="bg-red-500 text-white px-5 py-2 rounded-full font-semibold flex items-center gap-2">
            <FaClock />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Main */}
      <div ref={mainContentRef} className="flex flex-col md:flex-row max-w-6xl mx-auto mt-8 gap-8 px-4">
        {/* Question Section */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <div className="text-purple-600 font-semibold mb-2">
            Câu hỏi {current + 1}
          </div>
          <div className="text-lg mb-6">
            {currentQuestion?.content}
            {currentQuestion?.imageUrl && (
              <img
                src={currentQuestion.imageUrl}
                alt="Question"
                className="mt-4 max-w-full h-auto rounded"
              />
            )}
          </div>
          <ul className="space-y-4">
            {currentQuestion?.answersUserDto?.map((answer) => (
              <li key={answer.answerId}>
                <label
                  className={`
                  flex items-center p-4 border rounded cursor-pointer transition
                    ${
                      answers[currentQuestion.questionId] === answer.answerId
                        ? "bg-purple-50 border-purple-500"
                        : "hover:bg-gray-50"
                    } 
                    ${isSubmitted ? "cursor-not-allowed" : ""}
                    `}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.questionId}`}
                    value={answer.answerId}
                    className="mr-3 accent-purple-600"
                    checked={
                      answers[currentQuestion.questionId] === answer.answerId
                    }
                    onChange={() =>
                      handleOptionChange(
                        currentQuestion.questionId,
                        answer.answerId
                      )
                    }
                    disabled={isSubmitted}
                  />
                  <span>{answer.content}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation Section */}
        <div className="w-full md:w-72 bg-white rounded-lg shadow p-6 h-fit sticky top-24">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FaList />
            Danh sách câu hỏi
          </h3>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {questions.map((_, idx) => (
              <button
                key={idx}
                className={`w-10 h-10 flex items-center justify-center rounded font-semibold transition
                  ${
                    current === idx
                      ? "bg-purple-600 text-white"
                      : answers[questions[idx]?.questionId] !== undefined
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                onClick={() => goToQuestion(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {!isSubmitted ? (
              <>
                <div className="flex gap-2">
                  <button
                    className="btn btn-primary bg-purple-600 text-white py-2 rounded hover:bg-purple-700 flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => goToQuestion(current - 1)}
                    disabled={current === 0}
                    type="button"
                  >
                    <FaArrowLeft />
                    Trước
                  </button>
                  <button
                    className="btn btn-primary bg-purple-600 text-white py-2 rounded hover:bg-purple-700 flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => goToQuestion(current + 1)}
                    disabled={current === questions.length - 1}
                    type="button"
                  >
                    Sau
                    <FaArrowRight />
                  </button>
                </div>
                <button
                  className="btn btn-danger bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  type="button"
                >
                  Nộp bài
                </button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-green-600 font-medium mb-2">
                  Bài thi đã được nộp
                </p>
                <p className="text-xl font-bold text-purple-600 mb-4">
                  Điểm số của bạn: {score }
                </p>
                <button
                  onClick={() => navigate("/student/dashboard")}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Quay lại Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      {/* Stream Component */}
      <ScreenStreamer userId={userId} />
    </>
    
  );
};

export default DoExam;
