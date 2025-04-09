// 사용자 역할 타입
export type UserRole = 'client' | 'expert';

// 계정 상태
export type AccountStatus = 'ACTIVE' | 'UNVERIFIED' | 'DORMANT' | 'SUSPENDED' | 'DEACTIVATED';

// MEMBER 테이블 정보 타입 정의
export interface Member {
  id: number; // 사용자 고유 식별자
  email: string; // 이메일 주소
  name: string; // 사용자 이름
  profileImage: string;
  phone: string;
  accountStatus: AccountStatus;
  expertId: number;
}

// EXPERT 테이블 정보 타입 정의
export interface Expert {
  id: number;
  name: string;
  categoryName: string;
  subCategoryNames: string[];
  introduction: string;
  careerYears: number;
  gender: boolean;
  profileImage: string;
  mainCategoryId: number;
  subCategoryIds: number[];
  certificateNames: string[];
}

// 전역 상태 관리를 위한 타입
export interface UserState {
  member: Member | null;
  expert: Expert | null;
  currentRole: UserRole;
  setMember: (member: Member | null) => void;
  setExpert: (expert: Expert | null) => void;
  setCurrentRole: (role: UserRole) => void;
  initializeStore: () => void;
  logout: () => Promise<void>;
}
