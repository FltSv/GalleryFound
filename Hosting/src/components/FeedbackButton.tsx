import { useState, useEffect, useCallback, MouseEvent } from 'react';
import { FaRegCommentDots } from 'react-icons/fa';

export const FeedbackButton = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // 画面サイズに基づいてモバイルかどうかを判定
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 初期チェック
    checkIfMobile();

    // リサイズイベントのリスナー追加
    window.addEventListener('resize', checkIfMobile);

    // クリーンアップ
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // モバイル用のトグル機能
  const toggleButton = useCallback(() => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
  }, [isExpanded, isMobile]);

  // PC用のホバー機能
  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsExpanded(true);
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setIsExpanded(false);
    }
  }, [isMobile]);

  // フィードバックページへ移動
  const goToFeedback = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // バブリング防止
    window.open('https://forms.gle/1NQouur9PhdSyf1z5');
  }, []);

  return (
    <div
      className={`
        fixed right-4 bottom-4 z-10
        md:right-8 md:bottom-8
      `}>
      <div className="flex flex-col items-end gap-2">
        {/* 展開時に表示されるフィードバックボタン（モバイルのみ） */}
        {isMobile && isExpanded && (
          <button
            className={`
              border-primary-500 bg-primary-500 flex items-center gap-2
              rounded-lg border px-4 py-2 text-white shadow-lg
            `}
            onClick={goToFeedback}>
            <FaRegCommentDots size={20} />
            <span>フィードバックを送る</span>
          </button>
        )}

        {/* メインボタン */}
        <button
          aria-label="フィードバックを送る"
          className={`
            bg-primary-500 flex items-center justify-center gap-2 rounded-full
            font-medium text-white shadow-lg transition-all duration-300
            ${isExpanded && !isMobile ? 'px-6 py-3' : 'p-3'}
          `}
          onClick={isMobile ? toggleButton : goToFeedback}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          <FaRegCommentDots size={24} />
          {isExpanded && !isMobile && <span>フィードバックを送る</span>}
        </button>
      </div>
    </div>
  );
};
