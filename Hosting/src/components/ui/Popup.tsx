import { ReactNode, Dispatch, SetStateAction } from 'react';
import { Modal, ModalDialog, ModalOverflow } from '@mui/joy';
import { FaXmark } from 'react-icons/fa6';

interface PopupProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

export const Popup = (props: PopupProps) => {
  const { visible, setVisible, children } = props;

  return (
    <Modal
      onClose={() => {
        setVisible(false);
      }}
      open={visible}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ModalOverflow>
        <ModalDialog layout="center">
          <label
            className="absolute right-4 top-4 cursor-pointer"
            onClick={() => {
              setVisible(false);
            }}>
            <FaXmark />
          </label>
          {children}
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
};
