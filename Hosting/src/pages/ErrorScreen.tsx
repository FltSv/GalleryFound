import { FC, useCallback, useEffect, useState } from 'react';
import ReactGA from 'react-ga4';

import { Button } from 'components/Input';
import { ProgressBar } from 'components/ProgressBar';

export const ErrorScreen: FC<{ error: unknown }> = ({ error }) => {
  const errorInstance = error instanceof Error ? error : undefined;

  const [reportProgress, setReportProgress] = useState(0);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    (async () => {
      setReportProgress(0);
      setReported(false);

      await new Promise(r => setTimeout(r, 1000));
      setReportProgress(0.2);

      if (process.env.NODE_ENV !== 'development') {
        ReactGA.event('exception', {
          description: formatError(error),
          fatal: true,
        });
      }
      await new Promise(r => setTimeout(r, 1000));

      // 送信完了
      setReportProgress(1);
      setReported(true);
    })();
  }, [error]);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-4 bg-red-100/50 px-8 py-6
        text-center text-red-700
        md:mx-10 md:rounded-md
      `}>
      <h2 className="font-yojo text-6xl font-bold">えらー</h2>
      <p>処理中に予期せぬ問題が発生しました。</p>
      {errorInstance && (
        <p>
          <span className="font-bold">エラーメッセージ: </span>
          <span>{errorInstance.message}</span>
        </p>
      )}
      <p>
        問題を解決するため、エラー情報を自動収集し、サポートへ送信しています。
        <br />
        収集した情報は、技術チームが原因を特定し、サービスの安定性向上および不具合の迅速な解決に使用します。
      </p>
      <ProgressBar value={reportProgress} />
      <Button
        className="rounded-sm bg-red-200 text-red-700"
        disabled={!reported}
        onClick={handleReload}>
        再読み込み
      </Button>
    </div>
  );
};

const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    const errorDetails = {
      name: error.name,
      message: error.message,
      stack: error.stack ?? 'No stack trace available',
    };

    // Errorオブジェクトにカスタムプロパティがある場合に対応
    const additionalDetails = Object.entries(error)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    return `
=== Error Details ===
Name: ${errorDetails.name}
Message: ${errorDetails.message}
Stack:
${errorDetails.stack}
${additionalDetails ? `\nAdditional Details:\n${additionalDetails}` : ''}
====================
`;
  } else {
    // Error型ではない場合
    return `Unknown error: ${JSON.stringify(error, null, 2)}`;
  }
};
