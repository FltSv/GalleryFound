import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  forwardRef,
  useCallback,
  ReactNode,
  Fragment,
} from 'react';
import { Textarea, TextareaProps } from '@mui/joy';

export const HashtagTextarea = forwardRef<HTMLDivElement, TextareaProps>(
  function HashtagTextarea(props, ref) {
    // valueとdefaultValueの同時指定で不具合となるため、propsからdefaultValueを除外
    const { defaultValue, ...restProps } = props;

    const [text, setText] = useState<string>(defaultValue?.toString() ?? '');
    const highlighterRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        props.onChange?.(e);
      },
      [props],
    );

    // 入力テキストをハッシュタグ部分と通常テキスト部分に分割し、React要素の配列を返す関数
    const getHighlightedElements = (input: string): ReactNode[] => {
      if (input.trim() === '') return [<Fragment key="empty" />];

      const HASHTAG_REGEX = /[\s\u3000]#[^#\s\u3000]*/g;

      // 入力テキストをハッシュタグで分割
      // 例: "テスト #hello #world テスト" → ["テスト ", "#hello", " ", "#world", " テスト"]
      const parts = input.split(HASHTAG_REGEX);

      // 入力テキストからハッシュタグを抽出
      const matchedTags = [...input.matchAll(HASHTAG_REGEX)].map(m => m[0]);

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
    }, [text]);

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
