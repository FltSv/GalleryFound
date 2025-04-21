import { useState, useEffect, useCallback, useMemo } from 'react';
import { createCallable } from 'react-call';
import { FaCheck } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { IconType } from 'react-icons';

interface Props {
  message: string;
  theme?: 'success';
}

type ThemeStyle = {
  bg: string;
  text: string;
  bar: string;
  icon?: IconType;
};

const themeStyles: Record<string, ThemeStyle> = {
  success: {
    bg: 'bg-teal-50',
    text: 'text-teal-500',
    bar: 'bg-teal-500',
    icon: FaCheck,
  },
};

const defaultStyle: ThemeStyle = {
  bg: 'bg-gray-50',
  text: 'text-gray-500',
  bar: 'bg-gray-500',
};

export const Snackbar = createCallable<Props>(({ call, message, theme }) => {
  const startSeconds = 3;
  const durationMs = 100;
  const [seconds, setSeconds] = useState(startSeconds);

  // カウントダウン処理
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds(prev => {
        const durationSeconds = durationMs / 1000;
        const newSeconds = prev > 0 ? prev - durationSeconds : 0;

        if (newSeconds > 0) {
          return newSeconds;
        }

        setTimeout(() => {
          call.end();
        }, durationMs);
        return 0;
      });
    }, durationMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [call]);

  const onClose = useCallback(() => {
    call.end();
  }, [call]);

  const style = useMemo(
    () => (theme ? (themeStyles[theme] ?? defaultStyle) : defaultStyle),
    [theme],
  );
  const Icon = style.icon;

  return (
    <div
      className={`
        pointer-events-none fixed inset-0 z-50 flex items-end justify-center
        pb-6
      `}>
      <div
        className={`
          pointer-events-auto w-fit max-w-sm rounded-md shadow

          ${style.bg}
        `}>
        <div className="flex items-start justify-between p-4 pb-3">
          {Icon && (
            <Icon
              className={`
                h-6 w-6

                ${style.text}
              `}
            />
          )}
          <p
            className={`
              px-4 font-bold

              ${style.text}
            `}>
            {message}
          </p>
          <button onClick={onClose}>
            <FaXmark className="h-4 w-4" />
          </button>
        </div>
        <div
          className={`
            h-2 origin-left

            ${style.bar}
          `}
          style={{
            width: `${(seconds / startSeconds) * 100}%`,
            transition: `width ${durationMs}ms linear`,
          }}
        />
      </div>
    </div>
  );
});
