/* eslint react/display-name: 0 */
import { FC, ReactNode, ComponentProps, forwardRef, ForwardedRef } from 'react';

interface TextboxProps extends ComponentProps<'input'> {
  type: 'text' | 'password';
}

export const Textbox = forwardRef<HTMLInputElement, TextboxProps>(
  (props, ref) => (
    <input
      {...props}
      ref={ref}
      type={props.type}
      className="w-full rounded border-2 border-blue-100 p-1 outline-none *:border-2 invalid:border-red-500
      invalid:bg-red-100 invalid:text-red-500 focus:border-blue-500"
    />
  ),
);

export interface ButtonProps extends ComponentProps<'button'> {
  iconClass?: string;
  addClass?: string;
  children: ReactNode;
}

export const Button: FC<ButtonProps> = ({ addClass, iconClass, ...props }) => (
  <button
    {...props}
    className={`w-fit select-none rounded-full px-4 py-2 shadow-[0_1px_3px_0_#898282] transition-all duration-300 ${addClass}`}>
    <i className={iconClass ? iconClass + ' m-0 mr-2' : ''}></i>
    {props.children}
  </button>
);
