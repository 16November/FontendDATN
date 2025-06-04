import React, { useState, useEffect, useRef, useCallback } from "react";
import Hls from "hls.js";

const API_BASE_URL = "https://localhost:7128/api";
const HLS_BASE_URL = "https://localhost:7128";

const MonitoringExam = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [hlsStreamUrl, setHlsStreamUrl] = useState(null);
  const [streamStatus, setStreamStatus] = useState("idle");
  const [streamError, setStreamError] = useState(null);
  const [currentStreamId, setCurrentStreamId] = useState(null);
  const [currentPlaybackUrl, setCurrentPlaybackUrl] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const retryCountRef = useRef(0);

  // Constants
  const MAX_POLL_COUNT = 45; 
  const MAX_RETRY_COUNT = 5;
  const POLL_INTERVAL = 2000;

  // Load student list
  const fetchStudentList = useCallback(async () => {
    const examId = "2d8d0680-1b6b-b3fb-e120-08dd88093733";
    try {
      const res = await fetch(`${API_BASE_URL}/UserExam/getListStudent?examId=${examId}`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      setStudentList(data);
      setStreamError(null);
    } catch (e) {
      console.error("Error fetching student list:", e);
      setStreamError("Lỗi lấy danh sách học sinh: " + e.message);
    }
  }, []);

  useEffect(() => {
    fetchStudentList();
  }, [fetchStudentList]);

  const cleanupHls = useCallback(() => {
    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
        console.log("Destroyed previous HLS instance");
      } catch (e) {
        console.warn("Error destroying HLS:", e);
      }
      hlsRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
      videoRef.current.load();
    }
  }, []);

  const setupHls = useCallback((url) => {
    if (!url || !videoRef.current) {
      cleanupHls();
      return;
    }

    cleanupHls();

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 60, // Tăng giới hạn bộ đệm (từ 30s lên 60s)
        maxMaxBufferLength: 90, // Tăng giới hạn tối đa bộ đệm (từ 60s lên 90s)
        lowLatencyMode: false, // Tắt chế độ độ trễ thấp để giảm tải cho bộ đệm
        maxBufferHole: 0.5,
        enableWorker: true,
        debug: false,
      });

      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest parsed, starting playback");
        videoRef.current.muted = true;
        videoRef.current
          .play()
          .then(() => {
            setStreamStatus("streaming");
            retryCountRef.current = 0;
          })
          .catch((err) => {
            console.warn("Play failed:", err);
          });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            if (retryCountRef.current < MAX_RETRY_COUNT) {
              retryCountRef.current++;
              console.log(
                `Retrying HLS network error (${retryCountRef.current}/${MAX_RETRY_COUNT})`
              );
              setTimeout(() => {
                if (hlsRef.current) hlsRef.current.startLoad();
              }, 1000 * retryCountRef.current);
            } else {
              setStreamError(`Lỗi mạng HLS: ${data.details}`);
              setStreamStatus("error");
            }
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            console.log("Trying to recover from media error");
            hls.recoverMediaError();
          } else {
            setStreamError(`Lỗi HLS nghiêm trọng: ${data.details}`);
            setStreamStatus("error");
          }
        }
      });

      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = url;
      videoRef.current.muted = true;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current
          .play()
          .then(() => setStreamStatus("streaming"))
          .catch((err) => console.warn("Play failed:", err));
      });
    } else {
      setStreamError("Trình duyệt không hỗ trợ HLS.");
      setStreamStatus("error");
    }
  }, [cleanupHls]);

  useEffect(() => {
    if (hlsStreamUrl) {
      setupHls(hlsStreamUrl);
    } else {
      cleanupHls();
    }
    return () => cleanupHls();
  }, [hlsStreamUrl, setupHls, cleanupHls]);

  const clearPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const pollStreamStatus = useCallback(() => {
    // Chỉ bắt đầu polling khi currentStreamId và currentPlaybackUrl đã có giá trị hợp lệ
    if (!currentStreamId || !currentPlaybackUrl || isPolling) {
      console.log("Polling không được bắt đầu do thiếu điều kiện:", { currentStreamId, currentPlaybackUrl, isPolling });
      return;
    }

    // Bắt đầu polling
    setIsPolling(true);
    let pollCount = 0;
    console.log(`Đang bắt đầu polling cho streamId: ${currentStreamId}, playbackUrl: ${currentPlaybackUrl}`);

    pollIntervalRef.current = setInterval(async () => {
      try {
        console.log(`Polling stream status (${pollCount + 1}/${MAX_POLL_COUNT}) cho stream ${currentStreamId}`);

        const res = await fetch(`${API_BASE_URL}/streaming/status/${currentStreamId}`);
        if (!res.ok) {
          if (res.status === 404) {
            console.log(`Stream ${currentStreamId} không tìm thấy, giả sử không hoạt động`);
            setStreamStatus("idle");
            setCurrentPlaybackUrl(null);
            setCurrentStreamId(null);
            setSelectedStudent(null);
            clearPolling();
            return;
          }
          throw new Error(`Lỗi kiểm tra trạng thái: ${res.status}`);
        }

        const data = await res.json();
        if (data.isReady) {
          setTimeout(() => {
            setHlsStreamUrl(`${HLS_BASE_URL}${currentPlaybackUrl}`);
            setStreamStatus("streaming");
            clearPolling();
          }, 1000);
        } else if (!data.isActive) {
          setStreamStatus("idle");
          setCurrentPlaybackUrl(null);
          setCurrentStreamId(null);
          setSelectedStudent(null);
          clearPolling();
        }

        pollCount++;
        if (pollCount >= MAX_POLL_COUNT) {
          setStreamError(`Quá thời gian chờ stream sẵn sàng (${MAX_POLL_COUNT * POLL_INTERVAL / 1000} giây).`);
          setStreamStatus("error");
          clearPolling();
        }
      } catch (error) {
        console.error("Lỗi khi polling trạng thái stream:", error);
        setStreamError("Lỗi kiểm tra trạng thái stream: " + error.message);
        setStreamStatus("error");
        clearPolling();
      }
    }, POLL_INTERVAL);
  }, [currentStreamId, currentPlaybackUrl, isPolling, clearPolling]);

  const requestStartStream = useCallback(async (userId) => {
  console.log("Requesting stream for user:", userId);
  setStreamStatus("loading");
  setStreamError(null);
  setHlsStreamUrl(null);
  setCurrentStreamId(null);
  setCurrentPlaybackUrl(null);
  setSelectedStudent(null);
  cleanupHls();
  clearPolling();
  retryCountRef.current = 0;

  try {
    const res = await fetch(`${API_BASE_URL}/teacher/request-share/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Server error (${res.status}): ${errorText}`);
    }

    const session = await res.json();
    console.log("Received session from request-share:", session);

    if (!session?.streamId || !session?.playbackUrl) {
      throw new Error("Dữ liệu session không hợp lệ");
    }

    // Cập nhật tất cả state cùng lúc
    setCurrentStreamId(session.streamId);
    setCurrentPlaybackUrl(session.playbackUrl);
    setSelectedStudent(studentList.find((s) => s.userId === userId) || null);
    setStreamStatus("waiting");

    console.log(`Session valid. StreamId: ${session.streamId}, PlaybackUrl: ${session.playbackUrl}`);
  } catch (error) {
    console.error("Error requesting stream:", error);
    setStreamError("Lỗi khởi tạo stream: " + error.message);
    setStreamStatus("error");
  }
}, [studentList, cleanupHls, clearPolling]);

// Cập nhật lại hook useEffect cho việc polling
useEffect(() => {
  if (currentStreamId && currentPlaybackUrl && streamStatus === "waiting" && !isPolling) {
    console.log("Waiting 15 seconds before starting polling...");
    
    // Thêm timeout 15 giây trước khi bắt đầu polling
    const timeoutId = setTimeout(() => {
      console.log("15 second delay completed, starting polling...");
      pollStreamStatus();
    }, 15000);

    // Cleanup timeout nếu component unmount hoặc dependencies thay đổi
    return () => {
      clearTimeout(timeoutId);
    };
  }
}, [currentStreamId, currentPlaybackUrl, streamStatus, isPolling, pollStreamStatus]);

  const requestStopStream = useCallback(async () => {
    if (!currentStreamId) return;
    clearPolling();

    try {
      const res = await fetch(`${API_BASE_URL}/teacher/stop-share/${currentStreamId}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error(`Dừng stream thất bại: ${res.status}`);

      console.log("Dừng stream thành công");
    } catch (error) {
      console.error("Lỗi dừng stream:", error);
      setStreamError("Lỗi dừng stream: " + error.message);
    } finally {
      setStreamStatus("idle");
      setHlsStreamUrl(null);
      setSelectedStudent(null);
      setCurrentStreamId(null);
      setCurrentPlaybackUrl(null);
      cleanupHls();
    }
  }, [currentStreamId, clearPolling, cleanupHls]);

  useEffect(() => {
    return () => {
      clearPolling();
      cleanupHls();
    };
  }, [clearPolling, cleanupHls]);

  const getStatusText = () => {
    switch (streamStatus) {
      case "loading":
        return "Đang khởi tạo stream...";
      case "waiting":
        return "Đang chờ stream sẵn sàng...";
      case "streaming":
        return "Đang phát stream";
      case "error":
        return `Lỗi: ${streamError}`;
      default:
        return "Chưa có stream được chọn";
    }
  };

  const isStreamActive =
    streamStatus === "streaming" ||
    streamStatus === "waiting" ||
    streamStatus === "loading";

  return (
    <div style={{ padding: 20 }}>
      <h2>Giám sát bài thi</h2>
      <div style={{ marginBottom: 20 }}>
        <h3>
          {selectedStudent
            ? `Màn hình của: ${selectedStudent.fullName}`
            : "Chọn học sinh để xem màn hình"}
        </h3>
        <div style={{ marginBottom: 10, fontSize: 14, color: "#666" }}>
          <p>
            <strong>Trạng thái:</strong> {getStatusText()}
          </p>
          <p>
            <strong>Stream ID:</strong> {currentStreamId || "Chưa có"}
          </p>
          <p>
            <strong>Stream URL:</strong> {hlsStreamUrl || "Chưa có"}
          </p>
          {isPolling && <p><strong>Đang kiểm tra trạng thái...</strong></p>}
        </div>
        <div
          style={{
            height: 400,
            backgroundColor: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        >
          {streamStatus === "streaming" ? (
            <video
              ref={videoRef}
              controls
              autoPlay
              muted
              playsInline
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <div style={{ color: "white", textAlign: "center", padding: 20 }}>
              {getStatusText()}
            </div>
          )}
        </div>
      </div>
      <div>
        <h3>
          Danh sách thí sinh{" "}
          <button onClick={fetchStudentList} style={{ marginLeft: 10 }}>
            Làm mới
          </button>
        </h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ccc",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>ID</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Họ tên</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Trạng thái</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {studentList.map((student) => (
              <tr
                key={student.userId}
                style={{
                  backgroundColor:
                    selectedStudent?.userId === student.userId ? "#e3f2fd" : "transparent",
                }}
              >
                <td style={{ border: "1px solid #ccc", padding: 8, fontSize: 12 }}>
                  {student.userId}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {student.fullName}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  <span
                    style={{
                      color: student.isStarted ? "green" : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {student.isStarted ? "Đang thi" : "Chưa vào thi"}
                  </span>
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  <button
                    onClick={() => requestStartStream(student.userId)}
                    disabled={isStreamActive && selectedStudent?.userId !== student.userId}
                    style={{
                      marginRight: 5,
                      padding: "5px 10px",
                      backgroundColor:
                        selectedStudent?.userId === student.userId ? "#4caf50" : "#2196f3",
                      color: "white",
                      border: "none",
                      borderRadius: 3,
                      cursor:
                        isStreamActive && selectedStudent?.userId !== student.userId
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        isStreamActive && selectedStudent?.userId !== student.userId ? 0.5 : 1,
                    }}
                  >
                    {selectedStudent?.userId === student.userId ? "Đang xem" : "Xem màn hình"}
                  </button>

                  <button
                    onClick={requestStopStream}
                    disabled={!isStreamActive || selectedStudent?.userId !== student.userId}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: 3,
                      cursor:
                        !isStreamActive || selectedStudent?.userId !== student.userId
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        !isStreamActive || selectedStudent?.userId !== student.userId ? 0.5 : 1,
                    }}
                  >
                    Dừng
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonitoringExam;
