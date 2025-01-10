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
} from 'react';
import { Textarea, TextareaProps } from '@mui/joy';

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

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
        setHashtags(newText);

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
            <span className="text-blue-500" key={`hash-${i}`}>
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

      setHashtags(defaultText);
    }, [defaultText, setHashtags]);

    return (
      <div className="relative w-full" ref={ref}>
        {/* 重ねるための下レイヤー */}
        <div
          ref={highlighterRef}
          style={{
            position: 'absolute',
            padding: '0.5rem 0.75rem',
            left: 0,
            top: 0,
            width: '100%',
            whiteSpace: 'pre-wrap', // 改行を保持
            wordBreak: 'break-word',
            pointerEvents: 'none', // 下の Textarea の操作を邪魔しないようにする
          }}>
          {getHighlightedElements(text)}
        </div>
        {/* 実際の入力用 Textarea（透明にして上に重ねる） */}
        <Textarea
          {...restProps}
          onChange={handleChange}
          slotProps={{
            ...props.slotProps,
            textarea: { ref: textareaRef },
          }}
          sx={{
            ...props.sx,
            'position': 'relative',
            'backgroundColor': 'transparent',
            'color': 'transparent',
            'caretColor': 'black', // キャレットだけは見えるように
            '&::placeholder': { color: 'gray' },
          }}
          value={text}
        />
      </div>
    );
  },
);
