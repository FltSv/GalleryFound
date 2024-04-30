import { ReactNode, Dispatch, SetStateAction } from 'react';

interface PopupProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

export const Popup = (props: PopupProps) => {
  const { visible, setVisible, children } = props;

  if (!visible) {
    return <></>;
  }

  return (
    <div className="block z-50 bg-neutral-500/50 fixed w-full h-screen left-0 top-0">
      <div className="fixed -translate-x-1/2 -translate-y-1/2 bg-neutral-50 shadow-[0_0_10px_rgba(0,0,0,0.2)] p-5 rounded-md w-[90vw] max-w-xl left-1/2 top-1/2">
        <label
          className="cursor-pointer absolute -top-6 right-0 text-white"
          onClick={() => { setVisible(false); }}>
          <i className="fa-solid fa-xmark" />
        </label>
        {children}
      </div>
    </div>
  );
};
