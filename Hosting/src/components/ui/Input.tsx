/* eslint react/display-name: 0 */
import { FC, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';
import {
  Button as MuiJoyButton,
  ButtonProps,
  Input,
  InputProps,
  FormControl,
} from '@mui/joy';

interface TextboxProps extends InputProps {
  type?: 'text' | 'password';
  label: string;
  fieldError?: FieldError;
}

export const Textbox = forwardRef<HTMLInputElement, TextboxProps>(
  (props, ref) => {
    const { fieldError, ...others } = props;
    const isError = props.fieldError !== undefined;

    return (
      <FormControl error={isError}>
        <p className="font-ibmflex">{props.label}</p>
        <Input
          {...others}
          ref={ref}
          type={others.type ?? 'text'}
          autoComplete={others.autoComplete ?? 'off'}
          className={`my-1 border bg-transparent ${others.className ?? ''}`}
          sx={{
            borderColor: 'black', //isError ? 'red' : 'black',
          }}
        />
        <p className="text-xs text-red-600">{fieldError?.message}</p>
      </FormControl>
    );
  },
);

export const Button: FC<ButtonProps> = props => {
  return (
    <MuiJoyButton
      {...props}
      className={`rounded-full font-normal transition hover:opacity-80 ${props.className ?? ''}`}
      sx={{
        opacity: props.disabled ? 0.4 : 1,
      }}>
      {props.children}
    </MuiJoyButton>
  );
};

export const SubmitButton: FC<ButtonProps> = props => {
  const disabled = props.loading || props.disabled;

  return (
    <MuiJoyButton
      {...props}
      type="submit"
      className={`rounded-full font-normal transition
        ${disabled ? '' : 'hover:opacity-80'} ${props.className ?? ''}`}
      sx={{ opacity: disabled ? 0.4 : 1 }}
      startDecorator={props.startDecorator}
      loadingPosition="start"
      disabled={disabled}>
      {props.loading ? 'Loading...' : props.children}
    </MuiJoyButton>
  );
};
