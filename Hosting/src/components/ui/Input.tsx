/* eslint react/display-name: 0 */
import { FC, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';
import {
  Button as MuiJoyButton,
  ButtonProps,
  Input,
  InputProps,
  FormControl,
  styled,
} from '@mui/joy';
import { FaCloudUploadAlt } from 'react-icons/fa';

interface TextboxProps extends InputProps {
  label: string;
  fieldError?: FieldError;
  defaultDateValue?: Date;
}

export const Textbox = forwardRef<HTMLInputElement, TextboxProps>(
  (props, ref) => {
    const { fieldError, defaultDateValue, ...others } = props;
    const isError = props.fieldError !== undefined;
    const defaultDate = defaultDateValue?.toISOString().split('T')[0];

    return (
      <FormControl error={isError}>
        <p className="font-ibmflex">{props.label}</p>
        <Input
          {...others}
          autoComplete={others.autoComplete ?? 'off'}
          className={`my-1 border bg-transparent ${others.className ?? ''}`}
          defaultValue={defaultDate ?? others.defaultValue}
          ref={ref}
          sx={{
            borderColor: 'black', //isError ? 'red' : 'black',
          }}
          type={others.type ?? 'text'}
        />
        <p className="text-xs text-red-600">{fieldError?.message}</p>
      </FormControl>
    );
  },
);

export const Button: FC<ButtonProps> = props => (
  <MuiJoyButton
    {...props}
    className={`rounded-full font-normal transition hover:opacity-80 ${props.className ?? ''}`}
    sx={{
      opacity: props.disabled ?? false ? 0.4 : 1,
    }}>
    {props.children}
  </MuiJoyButton>
);

export const SubmitButton: FC<ButtonProps> = props => {
  const isLoading = props.loading ?? false;
  const disabled = isLoading || (props.disabled ?? false);

  return (
    <MuiJoyButton
      {...props}
      className={`rounded-full font-normal transition
        ${disabled ? '' : 'hover:opacity-80'} ${props.className ?? ''}`}
      disabled={disabled}
      loadingPosition="start"
      startDecorator={props.startDecorator}
      sx={{ opacity: disabled ? 0.4 : 1 }}
      type="submit">
      {isLoading ? 'Loading...' : props.children}
    </MuiJoyButton>
  );
};

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

interface FileInputProps extends InputProps {
  multiple?: boolean;
  accept: string;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (props, ref) => (
    <Button
      className="min-w-fit bg-white"
      color="neutral"
      component="label"
      startDecorator={<FaCloudUploadAlt />}
      variant="outlined">
      ファイルを選択
      <VisuallyHiddenInput {...props} ref={ref} size={undefined} type="file" />
    </Button>
  ),
);
