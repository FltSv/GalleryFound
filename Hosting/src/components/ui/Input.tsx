import { FC, ReactNode } from 'react';

interface TextboxProps {
  id: string;
  type: 'text' | 'password';
  placeholder: string;
}

export const Textbox: FC<TextboxProps> = props => (
  <input
    type={props.type}
    className="w-full p-1 rounded border-2 *:border-2 border-blue-100 focus:border-blue-500 outline-none
      invalid:bg-red-100 invalid:text-red-500 invalid:border-red-500"
    id={props.id}
    placeholder={props.placeholder}
  />
);

interface SubmitButtonProps {
  id: string;
  iconClass?: string;
  addClass?: string;
  children: ReactNode;
}

export const SubmitButton: FC<SubmitButtonProps> = props => (
  <button
    type="submit"
    id={props.id}
    className={
      'w-fit select-none transition-all duration-300 shadow-[0_1px_3px_0_#898282] px-4 py-2 rounded-full ' +
      props.addClass
    }>
    <i className={props.iconClass ? props.iconClass + ' m-0 mr-2' : ''}></i>
    {props.children}
  </button>
);
