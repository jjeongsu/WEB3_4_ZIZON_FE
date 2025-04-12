import DopdangLogo from '@/components/atoms/icons/dopdangLogo/DopdangLogo';

function DesktopFooter() {
  return (
    <footer className="w-full py-20 flex justify-center items-center border-t border-black4 pt-40 pb-100 mt-40">
      <div className="flex items-center justify-between min-w-1920 px-320">
        <section className="flex flex-col gap-40">
          <div className="flex flex-col gap-16">
            <div className="w-150 saturate-0 flex">
              <DopdangLogo type="en" />
            </div>
            <p className="text-black7 text-16 font-regular">전문가를 찾는 가장 빠른 길, 돕당!</p>
          </div>
          <p className="text-black7 text-13 font-regular">
            Copyright © Dopdang Inc. All Rights Reserved.
          </p>
        </section>
        <section className="flex gap-48">
          <div className="flex flex-col gap-12">
            <h3 className="text-black10 text-16 font-semibold">돕당소개</h3>
            <ul className="flex flex-col gap-8">
              <li>
                <p className="text-black7 text-16 font-regular">팀소개</p>
              </li>
              <li>
                <p className="text-black7 text-16 font-regular">팀페이지</p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-12">
            <h3 className="text-black10 text-16 font-semibold">FRONTEND</h3>
            <ul className="flex flex-col gap-8">
              <li>
                <p className="text-black7 text-16 font-regular">김영민</p>
              </li>
              <li>
                <p className="text-black7 text-16 font-regular">이정수</p>
              </li>
              <li>
                <p className="text-black7 text-16 font-regular">전성우</p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-12">
            <h3 className="text-black10 text-16 font-semibold">BACKEND</h3>
            <ul className="flex flex-col gap-8">
              <li>
                <p className="text-black7 text-16 font-regular">여경환</p>
              </li>
              <li>
                <p className="text-black7 text-16 font-regular">문경환</p>
              </li>
              <li>
                <p className="text-black7 text-16 font-regular">김한민</p>
              </li>
              <li>
                <p className="text-black7 text-16 font-regular">정재량</p>
              </li>
              <li>
                <p className="text-black7 text-16 font-regular">안선경</p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </footer>
  );
}

export default DesktopFooter;
