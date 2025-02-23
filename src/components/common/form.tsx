import { cn } from '@/utils/cn.util';

import React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

import {
  Controller,
  ControllerProps,
  FieldError,
  FieldPath,
  FieldValues,
  FormProvider,
  FormProviderProps,
  useFormContext,
} from 'react-hook-form';

import { Slot } from '@radix-ui/react-slot';
import CommonLabel from '@/components/common/label';

const Form = FormProvider as (<TFieldValues extends FieldValues>(
  props: FormProviderProps<TFieldValues>,
) => React.JSX.Element) & {
  Item: typeof Item;
  Label: typeof Label;
  Control: typeof Control;
  Description: typeof Description;
  Message: typeof Message;
  Field: typeof Field;
};

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const Field = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>): React.JSX.Element => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

export const useFormField = (): {
  invalid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isValidating: boolean;
  error?: FieldError;
  id: string;
  name: string;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
} => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(ItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type ItemContextValue = {
  id: string;
};

const ItemContext = React.createContext<ItemContextValue>({} as ItemContextValue);

const Item = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <ItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props} />
      </ItemContext.Provider>
    );
  },
);
Item.displayName = 'FormItem';

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <CommonLabel
      ref={ref}
      className={cn(error && 'text-red-500', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
Label.displayName = 'FormLabel';

const Control = React.forwardRef<
  React.ComponentRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      id={formItemId}
      {...props}
    />
  );
});
Control.displayName = 'FormControl';

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      className={cn('text-sm text-neutral-500', className)}
      id={formDescriptionId}
      {...props}
    />
  );
});
Description.displayName = 'FormDescription';

const Message = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <p
        ref={ref}
        className={cn('text-xs font-light text-red-500', className)}
        id={formMessageId}
        {...props}
      >
        {body}
      </p>
    );
  },
);
Message.displayName = 'FormMessage';

Form.Item = Item;
Form.Label = Label;
Form.Control = Control;
Form.Description = Description;
Form.Message = Message;
Form.Field = Field;

export default Form;
