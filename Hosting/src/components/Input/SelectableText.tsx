import { ChangeEvent, useState, useCallback, useRef, useEffect } from 'react';
import { FaCheck, FaPen, FaTimes } from 'react-icons/fa';

interface SelectableTextProps {
  className?: string;
  onChange?: (value: string) => void;
  options: string[];
  placeholder?: string;
  undefinedOption?: string;
  value?: string;
}

export const SelectableText = ({
  className = '',
  onChange,
  options,
  placeholder = '選択してください',
  undefinedOption,
  value,
}: SelectableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [originalValue, setOriginalValue] = useState(value);
  const selectRef = useRef<HTMLSelectElement>(null);

  // 外部からvalueが変更された場合は内部状態も更新
  useEffect(() => {
    setSelectedValue(value);
    setOriginalValue(value);
  }, [value]);

  // 編集モードに切り替え
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setOriginalValue(selectedValue); // 元の値を保存
  }, [selectedValue]);

  // 編集のキャンセル
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setSelectedValue(originalValue); // 元の値に戻す
  }, [originalValue]);

  // 編集内容の保存
  const handleSave = useCallback(() => {
    setIsEditing(false);

    if (selectedValue !== undefined) {
      setOriginalValue(selectedValue); // 保存時に元の値を更新
      onChange?.(selectedValue);
      return;
    }

    if (undefinedOption !== undefined && undefinedOption !== '') {
      setOriginalValue(selectedValue);
      onChange?.(undefinedOption);
    }
  }, [selectedValue, undefinedOption, onChange]);

  // セレクトの内容変更時
  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
  }, []);

  // 編集モードになったらセレクトにフォーカス
  useEffect(() => {
    if (isEditing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [isEditing]);

  // undefinedOptionが指定されている場合は、optionsの末尾に追加
  const displayOptions =
    undefinedOption !== undefined && undefinedOption !== ''
      ? [...options, undefinedOption]
      : options;

  return (
    <div className={className}>
      {isEditing ? (
        <div className="flex">
          <div className="flex-grow">
            <select
              className={`
                w-full border-b border-black py-1 outline-none
                focus:border-b-2 focus:border-blue-600
              `}
              onChange={handleChange}
              ref={selectRef}
              value={selectedValue ?? 'placeholder'}>
              <option disabled value="placeholder">
                {placeholder}
              </option>
              {displayOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
          {selectedValue !== undefined && selectedValue !== undefinedOption ? (
            <p>{selectedValue}</p>
          ) : (
            <p className="text-sm text-gray-400">情報がありません</p>
          )}
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
