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
    <div className="fixed left-0 top-0 z-50 block h-screen w-full bg-neutral-500/50">
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-neutral-50 p-5 shadow-lg shadow-neutral-800">
        <label
          className="absolute -top-6 right-0 cursor-pointer text-white"
          onClick={() => {
            setVisible(false);
          }}>
          <i className="fa-solid fa-xmark" />
        </label>
        {children}
      </div>
    </div>
  );
};
