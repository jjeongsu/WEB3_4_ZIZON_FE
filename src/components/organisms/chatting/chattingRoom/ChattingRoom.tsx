'use client';

import { useUserData } from '@/hooks/useUserData';
import { Suspense, useEffect, useRef, useState } from 'react';
import MessageTemplate from '@/components/molecules/messageTemplate/MessageTemplate';
import TextInput from '@/components/atoms/inputs/textInput/TextInput';
import StandardButton from '@/components/atoms/buttons/standardButton/StandardButton';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import ChattingList from '../chattingLIst/ChattingList';
import { GetRoomsResponse } from '@/apis/chat/getRooms';
import getChatHistory from '@/apis/chat/getChatHistory';
import FileInput from '@/components/atoms/inputs/fileInput/FileInput';
import { useUserStore } from '@/store/userStore';
import FilePreview from '@/components/atoms/filePreview/FilePreview';
import { putFileUpload } from '@/apis/imageUpload/putFileUpload';
import { getMimeType } from '@/utils/getMimeType';
import { postImageUpload } from '@/apis/imageUpload/modules/postImageUpload';
import { useQueryClient } from '@tanstack/react-query';
interface ChattingRoomProps {
  roomId: string | null;
  setRoom: (roomId: string | null) => void;
  setProjectId: (projectId: number | null) => void;
  setExpertId?: (expertId: number | null) => void;
  chatRoomList: GetRoomsResponse;
  handleFilterChange?: (filter: string) => void; // 필터 변경 핸들러
}

export default function ChattingRoom({
  roomId,
  setRoom,
  setProjectId,
  setExpertId,
  chatRoomList,
  handleFilterChange,
}: ChattingRoomProps) {
  //현재 대화방 사용자 정보
  const member = useUserStore(state => state.member);
  const currentUserEmail = member?.email || ''; // 현재 사용자의 이메일
  const [projectId, senderReceiverPart] = roomId?.split('|') || []; // sender, receiver
  const [sender, receiver] = senderReceiverPart?.split(':') || []; // sender와 receiver 분리
  const senderEmail = currentUserEmail; // 현재 사용자의 이메일
  const receiverEmail = sender === currentUserEmail ? receiver : sender; // 상대방 이메일
  // 채팅방 관련 변수
  const [messages, setMessages] = useState<any[]>([]); // 메시지 상태 관리
  const [input, setInput] = useState<string>(''); // 입력 상태 관리
  const [file, setFile] = useState<File | null>(null); // 파일 이름 상태 관리
  const [fileUrl, setFileUrl] = useState<string>(''); // 파일 URL 상태 관리
  const messagesEndRef = useRef<HTMLDivElement>(null); // 스크롤을 위한 ref

  const queryClient = useQueryClient();
  // WebSocket 관련 참조
  const stompClientRef = useRef<any>(null);
  const chatSubscriptionRef = useRef<any>(null);
  const readSubscriptionRef = useRef<any>(null);

  // 1. 채팅방 메세지 내역 로딩 (리팩토링)
  const fetchChatHistory = async (roomId: string) => {
    if (!roomId) return;
    try {
      const response = await getChatHistory(roomId);

      setMessages(response);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  // WebSocket 연결 함수
  const connectWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/ws-chat');
    const stompClient = Stomp.over(socket);
    stompClient.debug = (str: string) => {
      console.log('🐛 STOMP Debug:', str);
    };
    stompClient.connect(
      {},
      (frame: any) => {
        console.log('STOMP 연결 성공', frame);
        stompClient.subscribe(`/topic/notice/${senderEmail}`, (messageOutput: any) => {
          const payload = JSON.parse(messageOutput.body);
          //console.log('Received message:', messageOutput);
          const roomId = payload.roomId;
          const otherUser = payload.otherUser || 'otheruser undefined';
          const alarmMessage = payload.message || 'message undefined';
          // alarm 기능 추가가능
        });
      },
      (error: any) => {
        console.error('STOMP 연결 실패', error);
      },
    );
    stompClientRef.current = stompClient;
  };

  // 채팅 메시지 추가 (실시간 수신 메시지)
  const addMessage = (message: any) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };
  // 메세지가 추가될 때 스크롤을 항상 아래로 이동
  const scrollToBottom = () => {
    // if (messagesEndRef.current) {
    //   messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    // }
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  // 이미지 업로드 처리
  const handlefileChange = async (file: File) => {
    if (!file) {
      alert('파일을 선택하세요.');
      return;
    }
    let fileUrl;
    if (file) {
      const extension = file.name.split('.').pop();
      const contentType = getMimeType(extension); // image/png
      const postImageUploadResponse = await postImageUpload({
        folder: 'chating',
        fileName: file.name,
        contentType: contentType,
      });

      const { presignedUrl, accessUrl } = postImageUploadResponse;

      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': contentType,
        },
      });

      if (!uploadResponse.ok) {
        alert('파일 업로드에 실패했습니다.');
        return;
      }
      setFileUrl(accessUrl);
    }
    console.log('파일이 제출되었습니다.', file.size);
    setFile(file);
  };

  // 채팅방 변경 시 처리
  const handleRoomChange = (
    room: string,
    projectId: number,
    expertId: number,
    receiver: string,
  ) => {
    // 이전 구독 해제
    if (chatSubscriptionRef.current) {
      chatSubscriptionRef.current.unsubscribe();
      chatSubscriptionRef.current = null;
    }
    if (readSubscriptionRef.current) {
      readSubscriptionRef.current.unsubscribe();
      readSubscriptionRef.current = null;
    }
    setRoom(room);
    setProjectId(projectId);
    setExpertId && setExpertId(expertId);
    fetchChatHistory(room); // 채팅 내역 로딩

    // 채팅방 메세지 구독
    if (stompClientRef.current) {
      chatSubscriptionRef.current = stompClientRef.current.subscribe(
        `/topic/chat/${room}`,
        (messageOutput: any) => {
          const msg = JSON.parse(messageOutput.body);
          addMessage(msg);
        },
      );
    }
  };

  const markRoomRead = async (roomId: string) => {
    if (!roomId) return;
    try {
      const response = await fetch(
        `http://localhost:8080/chatrooms/${roomId}/read?username=${encodeURIComponent(
          currentUserEmail,
        )}`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );
      const text = await response.text();
    } catch (error) {
      console.error('Error marking room as read:', error);
    }
  };

  // 메시지 전송 함수
  const sendMessage = async () => {
    if (!roomId) {
      alert('채팅방을 선택하세요.');
      return;
    }
    const text = input.trim();

    if (!text && !fileUrl) {
      alert('메시지 내용 또는 이미지를 선택하세요.');
      return;
    }
    if (!member) {
      alert('로그인 후 사용가능합니다.');
      return;
    }
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      alert('서버와 연결이 끊어졌습니다. 새로고침 후 다시 시도해주세요.');
      return;
    }
    let chatMessage;
    if (input) {
      chatMessage = {
        sender: senderEmail,
        receiver: receiverEmail,
        projectId: projectId,
        content: text,
        fileUrl: null,
      };
    }

    let fileMessage;
    if (fileUrl) {
      fileMessage = {
        sender: senderEmail,
        receiver: receiverEmail,
        projectId: projectId,
        content: null, // 파일이면 여기가 null
        fileUrl: fileUrl, // 여기에 url
      };
    }

    if (stompClientRef.current) {
      if (chatMessage) {
        stompClientRef.current.send('/app/chat.send', {}, JSON.stringify(chatMessage));
      }
      if (fileMessage) {
        console.log('파일메세지:', fileMessage);
        stompClientRef.current.send('/app/chat.send', {}, JSON.stringify(fileMessage));
      }
    }
    setInput('');
    setFile(null);
    setFileUrl(''); // 파일 URL 초기화
  };
  useEffect(() => {
    if (senderEmail) {
      connectWebSocket();
      markRoomRead(roomId!); // 채팅방 읽음 처리
      queryClient.invalidateQueries({ queryKey: ['chatRoomList'] });
    }
  }, [roomId, member]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  console.log('roomId,', roomId);
  return (
    <div className="flex gap-24 items-start">
      <Suspense>
        <ChattingList
          chatRoomList={chatRoomList}
          handleRoomChange={handleRoomChange}
          room={roomId}
          handleFilterChange={handleFilterChange}
        />
      </Suspense>
      <div className="w-full flex-col min-w-690 max-w-828">
        {/* 채팅화면 */}
        <div
          className="w-full flex flex-col gap-32 bg-black1 px-32 py-32 rounded-[8px] h-745 overflow-y-scroll mb-16"
          ref={messagesEndRef}
        >
          {messages &&
            messages.map(message => (
              <MessageTemplate
                key={`${message.timestamp}-${message.content}`}
                dateTime={new Date(message.timestamp)}
                message={message.content}
                tag={message.sender === senderEmail ? 'get' : 'send'}
                fileUrl={message.fileUrl}
              />
            ))}
        </div>
        {/* 파일 이름 */}
        {file && <FilePreview file={file} onDelete={() => setFile(null)} />}
        {/* 채팅입력 */}
        <div className="w-full flex flex-col gap-10">
          <TextInput
            value={input}
            onChange={(value: string) => setInput(value)}
            placeholder="메시지를 입력해주세요. (Enter: 줄바꿈 / Ctrl+Enter: 전송)"
            id="chatting-input"
            type="text"
            disabled={false}
            color="white"
          />

          {/* 채팅 전송 */}
          <div className="flex justify-between items-center">
            <FileInput
              label="이미지업로드"
              name="file-input"
              accept="image/*"
              onChange={handlefileChange}
            />
            <StandardButton
              text="전송"
              state="dark"
              disabled={false}
              onClick={() => {
                // 메시지 전송 로직
                sendMessage();
                setInput(''); // 전송 후 입력창 초기화
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
