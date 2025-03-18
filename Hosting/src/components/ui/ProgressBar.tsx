import { FC } from 'react';

/**
 * @param props.value - 進捗率 (0.0 ~ 1.0)
 *
 * @example
 * ```tsx
 * <ProgressBar value={0.5} /> // 50%のプログレスバーを表示
 * ```
 */
export const ProgressBar: FC<{ value: number }> = ({ value }) => {
  const progress = Math.round(value * 100);

  return (
    <div className="w-full rounded-full bg-gray-300">
      <div
        className={`
          rounded-full bg-green-500 p-0.5 text-center text-xs text-white
          transition-all duration-500 ease-out
        `}
        style={{ width: `${progress}%` }}>
        {progress}%
      </div>
    </div>
  );
};
