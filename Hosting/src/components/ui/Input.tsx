/* eslint react/display-name: 0 */
import { FC, ReactNode, ComponentProps, forwardRef, ForwardedRef } from 'react';

interface TextboxProps extends ComponentProps<'input'> {
  type: 'text' | 'password';
}

export const Textbox: FC<
  TextboxProps & { ref?: ForwardedRef<HTMLInputElement> }
> = forwardRef((props, ref) => (
  <input
    {...props}
    ref={ref}
    type={props.type}
    className="w-full p-1 rounded border-2 *:border-2 border-blue-100 focus:border-blue-500 outline-none
      invalid:bg-red-100 invalid:text-red-500 invalid:border-red-500"
  />
));

export interface ButtonProps extends ComponentProps<'button'> {
  iconClass?: string;
  addClass?: string;
  children: ReactNode;
}

export const Button: FC<ButtonProps> = ({ addClass, iconClass, ...props }) => (
  <button
    {...props}
    className={`w-fit select-none transition-all duration-300 shadow-[0_1px_3px_0_#898282] px-4 py-2 rounded-full ${addClass}`}>
    <i className={iconClass ? iconClass + ' m-0 mr-2' : ''}></i>
    {props.children}
  </button>
);
