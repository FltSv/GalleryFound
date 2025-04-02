type SpinnerProps = {
  size?: number; // px 単位でスピナーのサイズを指定
};

export const Spinner = ({ size = 48 }: SpinnerProps) => {
  const pixelSize = `${size}px`;

  return (
    <div
      className="animate-spin rounded-full border-gray-300 border-t-green-500"
      style={{
        width: pixelSize,
        height: pixelSize,
        borderWidth: `${size / 8}px`, // サイズに応じて枠の太さも調整
      }}
    />
  );
};
