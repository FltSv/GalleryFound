import {
  ChangeEvent,
  useState,
  useCallback,
  useRef,
  useEffect,
  KeyboardEvent,
} from 'react';
import { FaCheck, FaPen, FaTimes } from 'react-icons/fa';

interface EditableTextProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const EditableText = ({
  value,
  onChange,
  className = '',
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const [originalText, setOriginalText] = useState(value);
  const textareaRef = useRef<HTMLInputElement>(null);

  // 外部からvalueが変更された場合は内部状態も更新
  useEffect(() => {
    setText(value);
    setOriginalText(value);
  }, [value]);

  // 編集モードに切り替え
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setOriginalText(text); // 元の値を保存
  }, [text]);

  // 編集のキャンセル
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setText(originalText); // 元の値に戻す
  }, [originalText]);

  // 編集内容の保存
  const handleSave = useCallback(() => {
    setIsEditing(false);

    if (text !== undefined) {
      setOriginalText(text); // 保存時に元の値を更新
      onChange?.(text);
    }
  }, [text, onChange]);

  // テキストエリアの内容変更時
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  // Enterキーで保存
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // フォームへの伝播を防止
        handleSave();
      }
    },
    [handleSave],
  );

  // 編集モードになったらインプットにフォーカス
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className={className}>
      {isEditing ? (
        <div className="flex">
          <div className="flex-grow">
            <input
              className={`
                w-full border-b border-black py-1 outline-none
                focus:border-b-2 focus:border-blue-600
              `}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              ref={textareaRef}
              type="text"
              value={text}
            />
          </div>
          <div className="ml-2 flex gap-1 self-start p-1">
            <button
              className={`
                self-start p-1 text-green-600
                hover:opacity-70
              `}
              onClick={handleSave}>
              <FaCheck />
            </button>
            <button
              className={`
                self-start p-1 text-red-600
                hover:opacity-70
              `}
              onClick={handleCancel}>
              <FaTimes />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-1">
          <p>{text}</p>
          <button
            className={`
              self-start p-1
              hover:opacity-70
            `}
            onClick={handleEdit}>
            <FaPen />
          </button>
        </div>
      )}
    </div>
  );
};
