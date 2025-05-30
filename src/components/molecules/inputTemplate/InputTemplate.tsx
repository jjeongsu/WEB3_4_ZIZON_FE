import React, { ReactElement } from 'react';
import InputLabel from '@/components/atoms/texts/inputLabel/InputLabel';
import StandardButton from '@/components/atoms/buttons/standardButton/StandardButton';
import TextInput from '@/components/atoms/inputs/textInput/TextInput';
import NumberInput from '@/components/atoms/inputs/numberInput/NumberInput';
import TextareaInput from '@/components/atoms/inputs/textareaInput/TextareaInput';
import FileInput from '@/components/atoms/inputs/fileInput/FileInput';

type InputType = typeof TextInput | typeof NumberInput | typeof TextareaInput | typeof FileInput;

export interface InputTemplateProps {
  InputComponent: ReactElement<InputType>;
  LabelComponent: ReactElement<typeof InputLabel>;
  ButtonComponent?: ReactElement<typeof StandardButton>;
  TextButtonComponent?: React.ReactNode;
}

export default function InputTemplate({
  InputComponent,
  LabelComponent,
  ButtonComponent,
  TextButtonComponent,
}: InputTemplateProps) {
  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between items-center">
        {LabelComponent}
        {TextButtonComponent}
      </div>
      <div className="flex gap-12">
        <div className="flex-1">{InputComponent}</div>
        {ButtonComponent && <div>{ButtonComponent}</div>}
      </div>
    </div>
  );
}
