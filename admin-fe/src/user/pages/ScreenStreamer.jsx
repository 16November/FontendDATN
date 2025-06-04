import React, { useRef, useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

const ScreenStreamer = ({ userId }) => {
  const [status, setStatus] = useState("Chờ kết nối...");
  const [error, setError] = useState(null);
  const [streamId, setStreamId] = useState(null);

  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const signalRRef = useRef(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7128/notificationHub?userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveRequestShare", async () => {
      try {
        setStatus("Nhận yêu cầu chia sẻ màn hình từ giáo viên.");
        const res = await fetch(`https://localhost:7128/api/student/accept-share/${userId}`, {
          method: "POST",
        });
        if (!res.ok) throw new Error(`Lỗi get share: ${res.status}`);

        const session = await res.json();
        if (session && session.streamId) {
          setStreamId(session.streamId);
          setStatus("Đã nhận streamId, chuẩn bị kết nối WebSocket...");
          startStreaming();
        } else {
          setError("Không tìm thấy session hoặc streamId không hợp lệ.");
          setStatus("Lỗi khi nhận yêu cầu chia sẻ");
        }
      } catch (err) {
        setError(err.message);
        setStatus("Lỗi khi nhận yêu cầu chia sẻ");
        console.error("Error on ReceiveRequestShare:", err);
      }
    });

    connection.on("StopShare", () => {
      setStatus("Nhận lệnh dừng chia sẻ màn hình.");
      stopStreaming();
    });

    connection
      .start()
      .then(() => {
        setStatus("SignalR connected. Chờ lệnh từ giáo viên...");
        signalRRef.current = connection;
      })
      .catch((e) => {
        setStatus("SignalR connection failed");
        setError(`Lỗi kết nối SignalR: ${e.message}`);
        console.error("SignalR connection error:", e);
      });

    return () => {
      if (signalRRef.current) {
        connection.stop();
      }
      stopStreaming();
    };
  }, [userId]);

  const acceptShare = async () => {
    setStatus("Kiểm tra session hiện có...");
    setError(null);

    try {
      const res = await fetch(`https://localhost:7128/api/student/accept-share/${userId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`Lỗi get share: ${res.status}`);

      const session = await res.json();
      if (!session?.streamId) throw new Error("Không tìm thấy session");

      setStreamId(session.streamId);
      setStatus("Đã nhận streamId, chuẩn bị kết nối WebSocket...");
      return session.streamId;
    } catch (e) {
      setError(e.message);
      setStatus("Lỗi khi lấy session");
      console.error("Error in acceptShare:", e);
      throw e;
    }
  };

  const connectWebSocket = (streamId) =>
    new Promise((resolve, reject) => {
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        wsRef.current.close(1000, "Reconnecting");
        wsRef.current = null;
      }
      const wsUrl = `wss://localhost:7128/api/student/${streamId}/ws`;
      setStatus(`Kết nối WebSocket đến ${wsUrl}...`);
      const ws = new WebSocket(wsUrl);
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      const connectTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          ws.close(1000, "WebSocket connection timeout");
          reject(new Error("Timeout kết nối WebSocket"));
        }
      }, 15000);

      ws.onopen = () => {
        clearTimeout(connectTimeout);
        setStatus("WebSocket đã kết nối");
        resolve(ws);
      };

      ws.onclose = (e) => {
        clearTimeout(connectTimeout);
        setStatus(`WebSocket đóng kết nối: Code ${e.code}, Reason: ${e.reason || "Không rõ"}`);
        if (e.code !== 1000) {
          setError(`WebSocket closed unexpectedly: Code ${e.code}`);
        }
      };

      ws.onerror = (e) => {
        setStatus("Lỗi WebSocket");
        setError("Lỗi WebSocket");
        console.error("WebSocket error:", e);
      };
    });

  const startStreamingInternal = async () => {
    try {
      if (mediaRecorderRef.current?.state === "recording") {
        setStatus("Đang quay màn hình...");
        return;
      }

      const currentStreamId = await acceptShare();
      await connectWebSocket(currentStreamId);

      setStatus("Yêu cầu quyền truy cập màn hình...");
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
        ? "video/webm;codecs=vp8,opus"
        : "video/webm";

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 1500000 });

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (!event.data || event.data.size === 0) return;
        const buffer = await event.data.arrayBuffer();

        const time = new Date().toLocaleTimeString();
        const sizeKB = (event.data.size / 1024).toFixed(2);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          try {
            wsRef.current.send(buffer);
            console.log(`${time} | Sent: ${sizeKB}KB`);
          } catch (error) {
            console.warn(`${time} | Failed to send: ${sizeKB}KB. Error: ${error.message}`);
          }
        } else {
          console.warn(`${time} | WebSocket not open. Not sending data.`);
        }
      };

      mediaRecorderRef.current.onerror = (e) => {
        setError(`Lỗi MediaRecorder: ${e.error?.message || "Không xác định"}`);
        console.error("MediaRecorder error:", e);
      };

      mediaRecorderRef.current.start(3000); // Tăng timeslice lên 3 giây để giảm độ trễ
      setStatus("Đang quay màn hình và gửi dữ liệu...");
    } catch (e) {
      setError(e.message);
      setStatus("Lỗi khi bắt đầu quay màn hình");
      console.error("Error in startStreamingInternal:", e);
      stopStreaming();
    }
  };


  const startStreaming = () => {
    startStreamingInternal();
  };

  const stopStreaming = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setStatus("Đang dừng MediaRecorder...");
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      console.log("Media stream tracks stopped.");
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close(1000, "User stopped streaming");
      console.log("WebSocket connection closed.");
    }
    wsRef.current = null;
    mediaRecorderRef.current = null;

    setStatus("Đã dừng streaming");
    setError(null);
    setStreamId(null);
  };

  return (
    <div>
      <h2>Screen Capture Streamer (Student)</h2>
      <p><b>Status:</b> {status}</p>
      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
      <p><b>StreamId:</b> {streamId || "Chưa có"}</p>
    </div>
  );
};

export default ScreenStreamer;
