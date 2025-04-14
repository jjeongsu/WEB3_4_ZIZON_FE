'use client'
import React, { useEffect, useState } from 'react';
import SmallTag from '@/components/atoms/tags/smallTag/SmallTag';
import CommissionInfoItem from '@/components/atoms/texts/commissionInfoItem/CommissionInfoItem';
import { getTimeStampTo } from '@/utils/dateFormat';
import { getProjectId, ProjectIdResponse } from '@/apis/project/getProjectId';

interface ProjectViewModalProps {
  projectId: number;
  modalCloseHandler: () => void;
}
export default function ProjectViewModal({
  projectId,
  modalCloseHandler
  }: ProjectViewModalProps) {
  const [commissionDetailResponse, setCommissionDetailResponse] = useState<ProjectIdResponse>({
    id: 0,
    title:'',
    summary:'',
    description:'[{"": ""}]',
    region:'',
    budget:0,
    deadline: '00-00-00T00:00:00',
    status: 'OPEN',
    clientName: '',
    clientProfileImageUrl:'',
    imageUrls:[],
  });
  const getFetchCommissionDetailProps = async () => {
    const response = await getProjectId({id: projectId});
    setCommissionDetailResponse(response);
  }
  useEffect(() => {
    getFetchCommissionDetailProps();
  }, []);
  const rawDescription = commissionDetailResponse?.description;
  const description = JSON.parse(rawDescription).flatMap(obj =>
    Object.entries(obj).map(([key, value]) => ({ [key]: value })),
  );
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50">
      {/* 어두운 배경 오버레이 */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"
        onClick={modalCloseHandler}
      />

      {/* 모달 컨텐츠 */}
      <div className="absolute top-1/2 left-1/2 rounded-xl transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-4/5 overflow-scroll  z-50">
        <article className="bg-black1 rounded-xl px-52 py-48">
          <div className="flex gap-12">
            {commissionDetailResponse.categoryId === 1000 && <SmallTag text="이사/청소" theme="lightBlue" />}
            {commissionDetailResponse.categoryId === 2000 && <SmallTag text="설치/수리" theme="lightGreen" />}
            {commissionDetailResponse.categoryId === 3000 && <SmallTag text="과외" theme="lightPurple" />}
            {commissionDetailResponse.categoryId === 4000 && <SmallTag text="취미생활" theme="lightOrange" />}
            <SmallTag text={commissionDetailResponse.status} />
          </div>

          <h3 className="text-28 font-semibold my-24">{commissionDetailResponse.title}</h3>
          <p className="pb-24 border-b mb-24 text-black7 text-16">{commissionDetailResponse.summary}</p>

          <div className="grid grid-cols-3 gap-24">
            <CommissionInfoItem label="마감일" content={getTimeStampTo(commissionDetailResponse.deadline)} />
            <CommissionInfoItem label="근무지" content={commissionDetailResponse.region} />
            <CommissionInfoItem label="예산" content={commissionDetailResponse.budget} />
          </div>

          <div className="w-700 mt-24 px-44 py-40 bg-black2 rounded-xl">
            <h3 className="text-24 font-semibold mb-32">요청 상세</h3>
            <div className="flex flex-col gap-32">
              {description.map((obj, i) => (
                <div key={i} className="flex flex-col gap-12">
                  <span className="font-medium text-black6 text-16">{Object.keys(obj)}</span>
                  <span className="font-medium text-black10 text-20">{Object.values(obj)}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}