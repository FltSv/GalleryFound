import {
  ChangeEvent,
  forwardRef,
  useCallback,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import { useTheme } from '@mui/joy';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // refを外部に公開（react-hook-formのregisterで使えるように）
    useImperativeHandle(ref, () => {
      if (textareaRef.current === null) {
        throw new Error('Textarea ref is not assigned');
      }

      return textareaRef.current;
    });

    const joyTheme = useTheme();

    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        /* eslint-disable functional/immutable-data */
        textarea.style.height = 'auto'; // 一旦リセット
        textarea.style.height = `${textarea.scrollHeight}px`; // スクロール高さに合わせる
        /* eslint-enable functional/immutable-data */
      }
    }, []);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        adjustHeight();
        props.onChange?.(e);
      },
      [adjustHeight, props],
    );

    useEffect(() => {
      adjustHeight();

      // 画面幅変更時の折り返しによる高さ調整
      window.addEventListener('resize', adjustHeight);
      return () => window.removeEventListener('resize', adjustHeight);
    }, [adjustHeight]);

    return (
      <textarea
        {...props}
        className={`
          w-full resize-none overflow-hidden rounded-md border border-black
          bg-transparent px-3 py-2 outline-hidden
          focus:border-blue-600 focus:ring-1 focus:ring-blue-600
        `}
        onChange={handleChange}
        ref={textareaRef}
        style={{
          ...props.style,
          fontFamily: joyTheme.fontFamily.body,
        }}
      />
    );
  },
);
