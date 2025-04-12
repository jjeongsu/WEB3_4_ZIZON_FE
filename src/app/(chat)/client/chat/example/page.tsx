'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';

// API 베이스 URL을 환경변수나 설정 파일로 관리하는 것을 권장합니다.
const API_BASE = 'http://localhost:8080';

interface User {
  email: string;
  name?: string;
}

interface ChatRoom {
  roomId: string;
  otherUserName?: string;
  receiver?: string;
  otherUserProfile?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  projectId?: string;
}

interface ChatMessage {
  sender: string;
  receiver: string;
  content: string;
  fileUrl?: string;
  timestamp?: string;
  user_profile_image?: string;
  user_name?: string;
  read?: boolean;
  // 추가 필드가 있다면 여기에 추가하세요.
}

interface Notification {
  otherUserName: string;
  message: string;
  count: number;
}

const ChatPage: React.FC = () => {
  // 상태 변수 선언
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<Record<string, Notification>>({});
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [messageText, setMessageText] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string>('');
  const [stompClient, setStompClient] = useState<Client | null>(null);

  // 채팅 구독(실시간 메시지 수신)와 읽음 관련 구독 관리
  let chatSubscription: StompSubscription | null = null;
  let readSubscription: StompSubscription | null = null;

  // 사용자 정보 가져오기
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/me`, { credentials: 'include' });
      if (!res.ok) throw new Error('현재 사용자 정보를 가져오지 못했습니다.');
      const data = await res.json();
      // 소문자 처리 등 후처리
      data.email = data.email.trim().toLowerCase();
      setCurrentUser(data);
      // 사용자 정보 fetch 후 연결
      connectWebSocket(data.email);
      fetchChatRoomsDetail(data.email);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  // 웹소켓 연결
  const connectWebSocket = (userEmail: string) => {
    const socket = new SockJS(`${API_BASE}/ws-chat`);
    const client: Client = new Client();
    client.webSocketFactory = () => socket as any;
    client.onConnect = frame => {
      console.log('STOMP 연결 성공, frame:', frame);
      client.subscribe(`/topic/notice/${userEmail}`, (messageOutput: IMessage) => {
        const payload = JSON.parse(messageOutput.body);
        const roomId = payload.roomId;
        const otherUser = payload.otherUser || '알 수 없음';
        const alarmMsg = payload.message || '';
        setNotifications(prev => {
          const newNotifications = { ...prev };
          if (newNotifications[roomId]) {
            newNotifications[roomId].count++;
          } else {
            newNotifications[roomId] = { otherUserName: otherUser, message: alarmMsg, count: 1 };
          }
          updateNotificationBadge(newNotifications);
          // 채팅방 목록도 새로고침
          if (currentUser) fetchChatRoomsDetail(currentUser.email);
          return newNotifications;
        });
      });
    };

    client.onStompError = error => {
      console.error('STOMP 연결 실패:', error);
    };
    setStompClient(client);
  };

  // 채팅방 목록 가져오기
  const fetchChatRoomsDetail = async (userEmail: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/chatrooms/rooms?member=${encodeURIComponent(userEmail)}`,
        { credentials: 'include' },
      );
      if (!res.ok) throw new Error('채팅방 목록을 불러오지 못했습니다.');
      const rooms: ChatRoom[] = await res.json();
      setChatRooms(rooms);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  // 채팅방 선택
  const selectChatRoom = (roomId: string, otherUserName: string, projectId: string | null) => {
    // 채널 구독 해제: 기존 구독이 있다면 해제합니다.
    if (chatSubscription) {
      chatSubscription.unsubscribe();
      chatSubscription = null;
    }
    if (readSubscription) {
      readSubscription.unsubscribe();
      readSubscription = null;
    }
    // 이전 채팅방 읽음 처리
    if (currentRoomId && currentRoomId !== roomId) {
      markRoomAsRead(currentRoomId);
    }
    setCurrentRoomId(roomId);
    setCurrentProjectId(projectId);
    // 채팅창 초기화
    setChatMessages([]);
    markRoomAsRead(roomId).then(() => {
      if (currentUser) fetchChatRoomsDetail(currentUser.email);
    });
    clearNotification(roomId);
    fetchChatHistory(roomId, projectId);
    // 구독 설정
    if (stompClient) {
      chatSubscription = stompClient.subscribe(
        `/topic/chat/${roomId}`,
        (messageOutput: IMessage) => {
          const newMessage: ChatMessage = JSON.parse(messageOutput.body);
          setChatMessages(prev => [...prev, newMessage]);
        },
      );
      readSubscription = stompClient.subscribe(
        `/topic/read/${roomId}`,
        (messageOutput: IMessage) => {
          // 추후 읽음 상태 업데이트 로직 구현 가능
        },
      );
    }
  };

  // 채팅 기록 가져오기
  const fetchChatHistory = async (roomId: string, projectId: string | null) => {
    if (!currentUser) return;
    const sender = currentUser.email;
    // roomId: "projectId|sender:receiver" 형식 분리
    const parts = roomId.split('|');
    let chatIdPart = parts.length > 1 ? parts[1] : parts[0];
    const emails = chatIdPart.split(':');
    const receiver = emails[0] === sender ? emails[1] : emails[0];
    try {
      const res = await fetch(
        `${API_BASE}/chatrooms?sender=${encodeURIComponent(sender)}&receiver=${encodeURIComponent(
          receiver,
        )}&projectId=${projectId ? encodeURIComponent(projectId) : ''}`,
        { credentials: 'include' },
      );
      if (!res.ok) throw new Error('채팅 기록을 불러오지 못했습니다.');
      const messages: ChatMessage[] = await res.json();
      setChatMessages(messages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  // 읽음 처리 함수
  const markRoomAsRead = async (roomId: string) => {
    if (!roomId || !currentUser) return;
    try {
      const res = await fetch(
        `${API_BASE}/chatrooms/${roomId}/read?username=${encodeURIComponent(currentUser.email)}`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );
      const text = await res.text();
      console.log(`Room ${roomId} marked as read:`, text);
    } catch (error) {
      console.error('Error marking room as read:', error);
    }
  };

  // 알림 배지 업데이트
  const updateNotificationBadge = (notificationsData: Record<string, Notification>) => {
    const total = Object.values(notificationsData).reduce((acc, n) => acc + n.count, 0);
    setUnreadCount(total);
  };

  // 알림 패널에서 클릭 시 알림 초기화
  const clearNotification = (roomId: string) => {
    setNotifications(prev => {
      const newNotifications = { ...prev };
      delete newNotifications[roomId];
      updateNotificationBadge(newNotifications);
      return newNotifications;
    });
  };

  // 이미지 업로드 함수
  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    const contentType = file.type;
    const presignPayload = {
      folder: 'chating',
      fileName: file.name,
      contentType: contentType,
    };

    try {
      const presignRes = await fetch(`${API_BASE}/chat/presigned`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(presignPayload),
      });
      if (!presignRes.ok) throw new Error('Presigned URL 생성에 실패하였습니다.');
      const presignData = await presignRes.json();
      const { presignedUrl, accessUrl } = presignData;
      const uploadRes = await fetch(presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: file,
      });
      if (!uploadRes.ok)
        throw new Error('파일 업로드에 실패하였습니다. 상태 코드: ' + uploadRes.status);
      alert('이미지 업로드 성공!');
      setFileUrl(accessUrl);
    } catch (error: any) {
      alert('이미지 업로드에 실패하였습니다: ' + error.message);
    }
  };

  // 메시지 전송 함수
  const sendMessage = () => {
    if (!currentRoomId) {
      alert('채팅방을 선택하세요.');
      return;
    }
    if (!messageText.trim() && !fileUrl) {
      alert('메시지 내용 또는 이미지를 선택하세요.');
      return;
    }
    if (!currentUser) return;

    // roomId: "projectId|sender:receiver" 분리
    const parts = currentRoomId.split('|');
    let chatIdPart = parts.length > 1 ? parts[1] : parts[0];
    const emails = chatIdPart.split(':');
    const receiver = emails[0] === currentUser.email ? emails[1] : emails[0];

    const chatMessage: ChatMessage = {
      sender: currentUser.email,
      receiver: receiver,
      content: messageText,
      fileUrl: fileUrl,
    };
    console.log('[sendMessage] Sending chatMessage:', chatMessage);
    // stompClient를 이용해 메시지 전송
    if (stompClient) {
      stompClient.publish({ destination: '/app/chat.send', body: JSON.stringify(chatMessage) });
    }
    setMessageText('');
    setFileUrl('');
  };

  // 포맷 함수: 날짜를 YYYY-MM-DD HH:mm 형식으로 변환
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 프로젝트 정보 가져오기
  const fetchProjectDetails = async (projectId: string | null) => {
    if (!projectId) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}`);
      if (!res.ok) throw new Error('프로젝트 정보를 가져오지 못했습니다.');
      const project = await res.json();
      // 프로젝트 정보는 하단 렌더링 시 사용
      // 필요에 따라 상태 변수로 저장하거나 바로 렌더링할 수 있음
      return project;
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  // 컴포넌트 언마운트 전 읽음 처리를 위한 cleanup 효과 추가
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentRoomId) markRoomAsRead(currentRoomId);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentRoomId, currentUser]);

  useEffect(() => {
    // 초기 사용자 정보 로딩
    fetchCurrentUser();
  }, []);

  return (
    <div>
      {/* 네비게이션 바 */}
      <div
        className="navbar"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: '50px',
          backgroundColor: '#f2f2f2',
          padding: '0 20px',
          position: 'relative',
        }}
      >
        <div
          className="notification-icon"
          onClick={e => {
            e.stopPropagation();
            // 간단한 알림 패널 구현: notifications 객체를 확인하여 표시
            const panel = document.getElementById('notificationPanel');
            if (panel) {
              panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
            }
          }}
          style={{ position: 'relative', cursor: 'pointer', marginLeft: '20px' }}
        >
          <img
            alt="알림 아이콘"
            src="https://cdn-icons-png.flaticon.com/512/3602/3602145.png"
            width="24"
            height="24"
          />
          {unreadCount > 0 && (
            <span
              id="notificationBadge"
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: 'red',
                color: 'white',
                fontSize: '12px',
                padding: '2px 6px',
                borderRadius: '50%',
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        <div
          id="notificationPanel"
          style={{
            position: 'absolute',
            top: '55px',
            right: '20px',
            width: '250px',
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'none',
            zIndex: 100,
          }}
        >
          {Object.entries(notifications).map(([roomId, notif]) => (
            <div
              key={roomId}
              className="notification-item"
              style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }}
              onClick={() => {
                clearNotification(roomId);
                selectChatRoom(roomId, notif.otherUserName || '알 수 없음', null);
                const panel = document.getElementById('notificationPanel');
                if (panel) panel.style.display = 'none';
              }}
            >
              {`${notif.otherUserName} - ${notif.message} (${notif.count})`}
            </div>
          ))}
        </div>
      </div>

      <h1>채팅 UI</h1>
      <div id="currentUserInfo">
        {currentUser
          ? `현재 사용자: ${currentUser.name || currentUser.email} (${currentUser.email})`
          : '현재 사용자 정보를 불러오는 중...'}
      </div>

      <div
        className="chat-container"
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '80vh',
          border: '1px solid #ccc',
          margin: '20px',
        }}
      >
        {/* 채팅방 목록 */}
        <div
          className="chat-room-list"
          style={{
            width: '30%',
            borderRight: '1px solid #ccc',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <div
            className="chat-room-list-header"
            style={{ padding: '10px', borderBottom: '1px solid #ccc' }}
          >
            <h3>채팅방 목록</h3>
          </div>
          <div className="chat-room-list-content" id="chatRoomsList">
            {chatRooms.map(room => (
              <div
                key={room.roomId}
                id={`chat-room-${room.roomId}`}
                className="chat-room-item"
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onClick={() =>
                  selectChatRoom(
                    room.roomId,
                    room.otherUserName && room.otherUserName.trim() !== ''
                      ? room.otherUserName
                      : room.receiver || '',
                    room.projectId || null,
                  )
                }
              >
                <img
                  src={room.otherUserProfile || 'https://via.placeholder.com/40'}
                  alt="프로필"
                  width="40"
                  height="40"
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <span>
                    {room.otherUserName && room.otherUserName.trim() !== ''
                      ? room.otherUserName
                      : room.receiver}
                  </span>
                  <br />
                  <span>{room.lastMessage || '(메시지 없음)'}</span>
                  <br />
                  <small>{room.lastMessageTime ? formatDate(room.lastMessageTime) : ''}</small>
                </div>
                {room.unreadCount && room.unreadCount > 0 && (
                  <span
                    className="badge"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'red',
                      color: 'white',
                      padding: '2px 5px',
                      borderRadius: '50%',
                      fontSize: '12px',
                    }}
                  >
                    {room.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 채팅 메시지 영역 */}
        <div className="chat-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div
            className="chat-content-header"
            style={{ borderBottom: '1px solid #ccc', padding: '10px', fontWeight: 'bold' }}
          >
            <span>{currentRoomId ? `채팅방 ${currentRoomId}` : '채팅방을 선택하세요'}</span>
          </div>
          <div
            className="chat-messages"
            id="chatLog"
            style={{ flex: 1, overflowY: 'auto', padding: '10px', backgroundColor: '#f8f8f8' }}
          >
            {chatMessages.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888' }}>채팅 메시지가 없습니다.</p>
            ) : (
              chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`message-bubble ${
                    message.sender === currentUser?.email ? 'my-message' : 'other-message'
                  }`}
                  style={{
                    display: 'flex',
                    margin: '10px 0',
                    flexDirection: message.sender === currentUser?.email ? 'row-reverse' : 'row',
                    textAlign: message.sender === currentUser?.email ? 'right' : 'left',
                  }}
                >
                  {message.sender !== currentUser?.email && (
                    <img
                      className="profile-image"
                      src={message.user_profile_image || 'https://via.placeholder.com/40'}
                      alt="프로필"
                      width="40"
                      height="40"
                      style={{ borderRadius: '50%', objectFit: 'cover', margin: '0 8px' }}
                    />
                  )}
                  <div
                    className="message-info"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      padding: '8px',
                      maxWidth: '250px',
                      boxShadow: '0px 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div
                      className="sender-name"
                      style={{ fontWeight: 'bold', marginBottom: '4px' }}
                    >
                      {message.user_name || message.sender}
                    </div>
                    <div
                      className="message-text"
                      style={{ marginBottom: '4px', wordWrap: 'break-word' }}
                    >
                      {message.content}
                      {message.fileUrl && message.fileUrl.trim() !== '' && (
                        <>
                          <br />
                          <img
                            src={message.fileUrl}
                            alt="전송 이미지"
                            style={{ maxWidth: '200px', display: 'block', marginTop: '5px' }}
                          />
                        </>
                      )}
                    </div>
                    <div
                      className="message-footer"
                      style={{
                        fontSize: '12px',
                        color: '#888',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span className="message-time" style={{ marginRight: '5px' }}>
                        {message.timestamp ? formatDate(message.timestamp) : ''}
                      </span>
                      <span className="read-status" style={{ marginLeft: '5px' }}>
                        {message.read ? '읽음' : '미읽음'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div
            className="chat-input"
            style={{
              borderTop: '1px solid #ccc',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <input
              type="text"
              placeholder="메시지를 입력하세요"
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              style={{ flex: 1, padding: '8px' }}
            />
            <input type="file" accept="image/*" onChange={uploadImage} />
            <button onClick={sendMessage}>메시지 전송</button>
          </div>
        </div>

        {/* 프로젝트 정보 영역 */}
        <div
          className="project-info"
          style={{ width: '30%', borderLeft: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}
        >
          <h3>프로젝트 정보</h3>
          <div id="projectDetails">
            {/* 프로젝트 정보는 fetchProjectDetails 함수 결과나 별도 상태를 이용해 렌더링 */}
            <p>프로젝트 정보가 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
