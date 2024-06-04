/* eslint react/display-name: 0 */
import { FC, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';
import {
  Button as MuiJoyButton,
  ButtonProps,
  CircularProgress,
  Input,
  InputProps,
  FormControl,
} from '@mui/joy';

interface TextboxProps extends InputProps {
  type: 'text' | 'password';
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
          className="my-1 rounded-full border bg-transparent"
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

interface SubmitButtonProps extends ButtonProps {
  isSubmitted: boolean;
}

export const SubmitButton: FC<SubmitButtonProps> = props => {
  const { isSubmitted, ...otherProps } = props;
  const disabled = props.isSubmitted || props.disabled;

  return (
    <MuiJoyButton
      {...otherProps}
      type="submit"
      className={`rounded-full font-normal transition
        ${disabled ? '' : 'hover:opacity-80'} ${props.className ?? ''}`}
      sx={{ opacity: disabled ? 0.4 : 1 }}
      startDecorator={
        isSubmitted ? <CircularProgress size="sm" /> : props.startDecorator
      }
      disabled={disabled}>
      {isSubmitted ? 'Loading...' : props.children}
    </MuiJoyButton>
  );
};
