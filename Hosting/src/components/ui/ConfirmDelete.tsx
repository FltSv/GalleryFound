import { useCallback } from 'react';
import { createCallable } from 'react-call';

interface Props {
  title: string;
  message: string;
}

type Response = boolean;

export const ConfirmDelete = createCallable<Props, Response>(
  ({ call, title, message }) => {
    const onAccept = useCallback(() => {
      call.end(true);
    }, [call]);

    const onDecline = useCallback(() => {
      call.end(false);
    }, [call]);

    return (
      <div
        className={`
          fixed inset-0 flex items-center justify-center bg-black bg-opacity-20
          backdrop-blur
        `}>
        <div
          aria-modal="true"
          className={`
            flex max-w-xs flex-col gap-3 rounded-lg bg-white px-6 py-4
            text-gray-800
          `}
          role="dialog">
          <p className="text-lg font-bold">{title}</p>
          <p>{message}</p>
          <hr />
          <div className="flex gap-2">
            <button
              className="rounded-md bg-red-600 px-4 py-2 text-sm text-white"
              onClick={onAccept}>
              削除
            </button>
            <button
              className={`
                rounded-md border border-gray-300 bg-white px-4 py-2 text-sm
              `}
              onClick={onDecline}>
              キャンセル
            </button>
          </div>
        </div>
      </div>
    );
  },
);
