import React, { useEffect, useRef, useState } from 'react';

const ScreenStreamer = ({ userId }) => {
  const [status, setStatus] = useState('Chờ kết nối...');
  const [error, setError] = useState(null);

  const streamWsRef = useRef(null);    // WebSocket gửi video chunks
  const controlWsRef = useRef(null);   // WebSocket nhận lệnh control
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  // --- Kết nối WebSocket streaming ---
  const connectStreamWebSocket = () => {
    if (streamWsRef.current) {
      streamWsRef.current.close();
      streamWsRef.current = null;
    }

    setStatus('Đang kết nối WebSocket stream...');
    const ws = new WebSocket(`wss://localhost:7128/api/Streaming/ws-stream?userId=${userId}`);
    ws.binaryType = 'arraybuffer';
    streamWsRef.current = ws;

    ws.onopen = () => {
      setStatus('WebSocket stream đã kết nối');
      reconnectAttemptsRef.current = 0;
      console.log('[StreamWS] Connected');
    };

    ws.onclose = e => {
      console.log('[StreamWS] Closed', e.code, e.reason);
      setStatus(`WebSocket stream đóng kết nối: ${e.code} - ${e.reason}`);

      if (reconnectAttemptsRef.current < 5) {
        const delay = Math.pow(2, reconnectAttemptsRef.current) * 1000;
        reconnectAttemptsRef.current++;
        setStatus(`Thử kết nối lại WebSocket stream sau ${delay / 1000}s...`);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectStreamWebSocket();
        }, delay);
      } else {
        setStatus('Không thể kết nối lại WebSocket stream');
      }
    };

    ws.onerror = e => {
      console.error('[StreamWS] Error', e);
      setStatus('Lỗi WebSocket stream');
    };

    ws.onmessage = e => {
      // Có thể xử lý message server gửi về (nếu cần)
      // console.log('[StreamWS] Message:', e.data);
    };
  };

  // --- Kết nối WebSocket control để nhận lệnh từ teacher ---
  const connectControlWebSocket = () => {
    if (controlWsRef.current) {
      controlWsRef.current.close();
      controlWsRef.current = null;
    }

    const ws = new WebSocket(`wss://localhost:7128/api/Teacher/ws-control?userId=${userId}`);
    controlWsRef.current = ws;

    ws.onopen = () => {
      console.log('[ControlWS] Connected');
      setStatus('WebSocket control đã kết nối, chờ lệnh từ teacher');
    };

    ws.onmessage = (event) => {
      const msg = event.data;
      console.log('[ControlWS] Received:', msg);

      if (msg === 'start_stream') {
        startStreaming();
      } else if (msg === 'stop_stream') {
        stopStreaming();
      }
    };

    ws.onclose = () => {
      console.log('[ControlWS] Disconnected');
      setStatus('WebSocket control bị đóng');
      // Có thể thêm logic reconnect nếu cần
    };

    ws.onerror = (e) => {
      console.error('[ControlWS] Error', e);
      setStatus('Lỗi WebSocket control');
    };
  };

  // --- Bắt đầu quay màn hình và stream ---
  const startStreaming = async () => {
    setError(null);

    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        console.log('[startStreaming] Đang ghi rồi, bỏ qua');
        setStatus('Đang quay màn hình và gửi dữ liệu...');
        return;
      }

      // Lấy stream màn hình
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      streamRef.current = stream;

      // Kiểm tra định dạng mimeType
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            throw new Error('Không có định dạng MediaRecorder phù hợp');
          }
        }
      }

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          if (streamWsRef.current && streamWsRef.current.readyState === WebSocket.OPEN) {
            streamWsRef.current.send(event.data);
            console.log(`[MediaRecorder] Gửi chunk ${event.data.size} bytes`);
          } else {
            console.warn('[MediaRecorder] WebSocket stream chưa sẵn sàng để gửi');
          }
        }
      };

      mediaRecorderRef.current.onerror = e => {
        console.error('[MediaRecorder] Error:', e.error);
        setError('Lỗi MediaRecorder: ' + e.error.message);
      };

      mediaRecorderRef.current.onstart = () => {
        setStatus('Đang quay màn hình và gửi dữ liệu...');
        console.log('[MediaRecorder] Bắt đầu ghi');
      };

      mediaRecorderRef.current.onstop = () => {
        setStatus('Đã dừng ghi');
        console.log('[MediaRecorder] Dừng ghi');
      };

      // Kết nối WebSocket streaming nếu chưa kết nối
      if (!streamWsRef.current || streamWsRef.current.readyState !== WebSocket.OPEN) {
        connectStreamWebSocket();
        // Chờ 500ms để WS kết nối ổn định trước khi start
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      mediaRecorderRef.current.start(1000); // Ghi video chunk mỗi 1 giây

    } catch (err) {
      console.error('Lỗi khi lấy màn hình:', err);
      setError('Lỗi khi lấy màn hình: ' + err.message);
      setStatus('Lỗi khi bắt đầu quay màn hình');
    }
  };

  // --- Dừng quay và đóng stream + WS ---
  const stopStreaming = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (streamWsRef.current) {
      streamWsRef.current.close();
      streamWsRef.current = null;
    }

    setStatus('Đã dừng streaming');
  };

  // --- Cleanup khi component unmount ---
  useEffect(() => {
    connectControlWebSocket();

    return () => {
      stopStreaming();
      if (controlWsRef.current) {
        controlWsRef.current.close();
        controlWsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Screen Capture Streamer</h2>
      <p><strong>Status:</strong> {status}</p>
      {error && <p style={{color:'red'}}>{error}</p>}

      {/* Nút test thủ công (không bắt buộc) */}
      <button
        onClick={startStreaming}
        style={{ marginRight: 10, padding: '8px 16px' }}
      >
        Bắt đầu quay màn hình & stream
      </button>
      <button
        onClick={stopStreaming}
        style={{ padding: '8px 16px' }}
      >
        Dừng stream
      </button>
    </div>
  );
};

export default ScreenStreamer;
