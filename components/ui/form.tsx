"use client"

import * as React from "react"
import { Slot } from "radix-ui"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form"

import {
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"

const Form = FormProvider

type FormFieldContextValue = {
  name: string
  id: string
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({ ...props }: ControllerProps<TFieldValues, TName, TTransformedValues>) {
  const id = React.useId()
  const value = React.useMemo(
    () => ({ name: props.name as string, id }),
    [props.name, id],
  )

  return (
    <FormFieldContext.Provider value={value}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext?.name })

  if (!fieldContext) {
    throw new Error("useFormField must be used inside a <FormField>")
  }

  const { id, name } = fieldContext
  const fieldState = getFieldState(name, formState)

  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot.Root>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot.Root
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof FieldLabel>) {
  const { formItemId } = useFormField()

  return (
    <FieldLabel
      data-slot="form-label"
      htmlFor={formItemId}
      className={className}
      {...props}
    />
  )
}

function FormDescription({
  className,
  ...props
}: React.ComponentProps<typeof FieldDescription>) {
  const { formDescriptionId } = useFormField()

  return (
    <FieldDescription
      data-slot="form-description"
      id={formDescriptionId}
      className={className}
      {...props}
    />
  )
}

function FormError({
  className,
  ...props
}: React.ComponentProps<typeof FieldError>) {
  const { error, formMessageId } = useFormField()

  const errors = React.useMemo(() => {
    if (!error) return undefined

    const all = Object.values(error.types ?? {})
      .flat()
      .filter((m): m is string => typeof m === "string" && m.length > 0)

    return all.length > 0
      ? all.map((message) => ({ message }))
      : [{ message: error.message }]
  }, [error])

  return (
    <FieldError
      data-slot="form-error"
      id={formMessageId}
      errors={errors}
      className={className}
      {...props}
    />
  )
}

const FOCUSABLE_SELECTOR =
  'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

function resolveFocusTarget(invalid: HTMLElement): HTMLElement {
  if (invalid.matches(FOCUSABLE_SELECTOR)) {
    return invalid
  }
  return invalid.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? invalid
}

function useFormRecovery<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>(form: UseFormReturn<TFieldValues, TContext, TTransformedValues>) {
  const formRef = React.useRef<HTMLFormElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const revealFirstError = React.useCallback(() => {
    const root = formRef.current
    if (!root) return

    const invalid = root.querySelector<HTMLElement>('[aria-invalid="true"]')
    if (!invalid) return

    const target = resolveFocusTarget(invalid)

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    })
    target.focus({ preventScroll: true })
  }, [prefersReducedMotion])

  const handleSubmit = React.useCallback(
    <TResult,>(
      onValid: SubmitHandler<TTransformedValues, TResult>,
      onInvalid?: SubmitErrorHandler<TFieldValues>,
    ) =>
      form.handleSubmit(onValid, (errors, event) => {
        onInvalid?.(errors, event)
        // Deferred: aria-invalid is not in the DOM until the errors commit.
        setTimeout(revealFirstError, 0)
      }),
    [form, revealFirstError],
  )

  return { formRef, handleSubmit }
}

export {
  Form,
  FormControl,
  FormDescription,
  FormError,
  FormField,
  FormLabel,
  useFormField,
  useFormRecovery,
}
