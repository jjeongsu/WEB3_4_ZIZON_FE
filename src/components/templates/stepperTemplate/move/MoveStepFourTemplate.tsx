import React from 'react';
import CommissionTopBox from '@/components/molecules/commissionTopBox/CommissionTopBox';
import StandardButton from '@/components/atoms/buttons/standardButton/StandardButton';
import SelectedOptionList, {
  selectedOptionIndexObject,
} from '@/components/molecules/selectedOptionList/SelectedOptionList';
import { CheckboxProps } from '@/components/atoms/checkboxes/checkboxWithLabel/CheckboxWithLabel';
import CheckSelectBox from '@/components/organisms/checkSelectBox/CheckSelectBox';
import { TableUnionType } from '@/apis/imageUpload/modules/postImageUpload';
import ImageUploadField from '@/components/molecules/imageUploadField/ImageUploadField';

interface MoveStepFourTemplateProps {
  checkSelectBoxProps1: CheckboxProps[];
  checkSelectBoxProps2: CheckboxProps[];
  onClickBefore: () => void;
  onClickNext: () => void;
  selectedOptionListProps: selectedOptionIndexObject[];
  tableUnionType: TableUnionType;
}
export default function MoveStepFourTemplate({tableUnionType, selectedOptionListProps, checkSelectBoxProps1, checkSelectBoxProps2, onClickBefore, onClickNext}: MoveStepFourTemplateProps) {
  return (
    <div className='w-1062 bg-black2'>
      <h1 className="text-24 font-semibold pt-78 mb-28">견적 요청서를 작성하는 중이에요</h1>
      <CommissionTopBox title={'5.옮길 물건 정보'} progressStep={4} isBefore={true} onClickBefore={onClickBefore} />
      <div className='flex mt-24 items-start w-full'>
        <div className='mr-24 w-full bg-black1 rounded-lg pb-40'>
          <CheckSelectBox checkSelectBoxProps={checkSelectBoxProps1} title={'욺길 가전제품을 모두 선택해주세요?'}/>
          <CheckSelectBox checkSelectBoxProps={checkSelectBoxProps2} title={'욺길 가구를 모두 선택해주세요?'}/>
          <div className="px-40 mt-40">
            <ImageUploadField label={'이삿짐 사진을 보내주세요'} tableUnionType={tableUnionType}/>
          </div>
          <div className="float-end mt-32 pr-40">
            <StandardButton text={'다음'} disabled={false} onClick={onClickNext} state={'dark'} size={'fit'} />
          </div>
        </div>
        <div className="w-3/4">
          <SelectedOptionList
            selectedOptionIndex={selectedOptionListProps} />
        </div>
      </div>
    </div>
  );
}