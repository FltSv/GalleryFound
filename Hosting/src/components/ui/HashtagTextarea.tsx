import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  forwardRef,
  useCallback,
  ReactNode,
  Fragment,
  useMemo,
  TextareaHTMLAttributes,
} from 'react';
import { useTheme } from '@mui/joy';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
interface HashtagTextareaProps extends TextareaProps {
  onHashtagsChange: (hashtags: string[]) => void;
}

export const HashtagTextarea = forwardRef<HTMLDivElement, HashtagTextareaProps>(
  function HashtagTextarea(props, ref) {
    const HASHTAG_REGEX = useMemo(() => /[\s\u3000s]#[^#\s\u3000]*/g, []);

    // valueとdefaultValueの同時指定で不具合となるため、propsからdefaultValueを除外
    const { defaultValue, onHashtagsChange, ...restProps } = props;
    const defaultText = defaultValue?.toString() ?? '';

    const [text, setText] = useState<string>(defaultText);
    const highlighterRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const joyTheme = useTheme();

    const extractHashtags = (input: string, regex: RegExp): string[] =>
      [...input.matchAll(regex)].map(m => m[0]);

    // ハッシュタグの配列から空白文字を削除し、コールバックを呼び出す
    const setHashtags = useCallback(
      (text: string) => {
        const hashtags = extractHashtags(text, HASHTAG_REGEX);
        const cleanedHashtags = hashtags.map(tag =>
          tag.replace(/[\s\u3000]/g, ''),
        );
        onHashtagsChange([...new Set(cleanedHashtags)]);
      },
      [HASHTAG_REGEX, onHashtagsChange],
    );

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        /* eslint-disable functional/immutable-data */
        textarea.style.height = 'auto'; // 一旦リセット
        textarea.style.height = `${textarea.scrollHeight}px`; // スクロール高さに合わせる
        /* eslint-enable functional/immutable-data */
      }
    };

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
        setHashtags(newText);
        adjustHeight();

        props.onChange?.(e);
      },
      [props, setHashtags],
    );

    // 入力テキストをハッシュタグ部分と通常テキスト部分に分割し、React要素の配列を返す関数
    const getHighlightedElements = (input: string): ReactNode[] => {
      if (input.trim() === '') return [<Fragment key="empty" />];

      // 入力テキストをハッシュタグで分割
      // 例: "テスト #hello #world テスト" → ["テスト ", "#hello", " ", "#world", " テスト"]
      const parts = input.split(HASHTAG_REGEX);

      // 入力テキストからハッシュタグを抽出
      const matchedTags = extractHashtags(input, HASHTAG_REGEX);

      // parts配列とmatchedTags配列から、通常テキストとハッシュタグを交互に含むReact要素の配列を生成
      // 例:
      // parts のインデックス: 0 1 2 3 4
      // matchedTags のインデックス: 0 1
      //
      // parts.length は matchedTags.length + 1 以上になる可能性がある
      // 交互にループしながら要素を追加する

      return parts.reduce<ReactNode[]>((acc, part, i) => {
        // 通常テキスト部分をspan要素として生成
        const normalText = <span key={`normal-${i}`}>{part}</span>;

        // 対応するハッシュタグが存在する場合、通常テキストの後にハッシュタグ要素を追加
        if (i < matchedTags.length) {
          const tag = matchedTags[i];
          const hashTag = (
            <span className="text-pink-500" key={`hash-${i}`}>
              {tag}
            </span>
          );
          return [...acc, normalText, hashTag];
        }

        return [...acc, normalText];
      }, []);
    };

    useEffect(() => {
      // スクロール同期
      if (textareaRef.current && highlighterRef.current) {
        highlighterRef.current.scrollTop = textareaRef.current.scrollTop;
      }

      adjustHeight();
      setHashtags(defaultText);

      // 画面幅変更時の折り返しによる高さ調整
      window.addEventListener('resize', adjustHeight);
      return () => window.removeEventListener('resize', adjustHeight);
    }, [defaultText, setHashtags]);

    return (
      <div className="relative w-full" ref={ref}>
        {/* 重ねるための下レイヤー */}
        <div
          className={`
            absolute left-0 top-0 w-full border border-transparent px-3 py-2
          `}
          ref={highlighterRef}
          style={{
            fontFamily: joyTheme.fontFamily.body,
            whiteSpace: 'pre-wrap', // 改行を保持
            wordBreak: 'break-word',
            pointerEvents: 'none', // 下の Textarea の操作を邪魔しないようにする
          }}>
          {getHighlightedElements(text)}
        </div>
        {/* 実際の入力用 Textarea（透明にして上に重ねる） */}
        <textarea
          {...restProps}
          className={`
            relative w-full rounded-md border border-black bg-transparent px-3
            py-2 text-transparent outline-none

            focus:border-2 focus:border-blue-600
          `}
          onChange={handleChange}
          ref={textareaRef}
          style={{
            ...props.style,
            fontFamily: joyTheme.fontFamily.body,
            caretColor: 'black', // キャレットだけは見えるように
            overflow: 'hidden',
            resize: 'none',
            transition: 'height 0.2s ease', // 高さ変更時のラグ軽減
          }}
          value={text}
        />
      </div>
    );
  },
);
