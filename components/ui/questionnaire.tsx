"use client"

import * as React from "react"
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { CheckboxMark, checkboxControlClassName } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { Kbd } from "@/components/ui/kbd"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioIndicator, radioControlClassName } from "@/components/ui/radio"

function Questionnaire({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root>) {
  return (
    <QuestionnairePrimitive.Root
      data-slot="questionnaire"
      className={cn("flex w-full min-w-0 flex-col gap-4", className)}
      {...props}
    />
  )
}

function QuestionnaireProgress({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Progress>) {
  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-progress"
      className={cn(
        "min-h-4 w-fit min-w-[14ch] text-xs font-medium text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireItem({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) {
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      className={cn(
        "flex min-w-0 flex-col gap-4 border-0 p-0 outline-none",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireTitle({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className={cn(
        "font-sans text-base leading-snug font-medium text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireDescription({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Description>) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      className={cn("text-sm text-pretty text-muted-foreground", className)}
      {...props}
    />
  )
}

function QuestionnaireChoices({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className={cn(
        "group/questionnaire-choices grid min-w-0 gap-2",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireChoice({
  children,
  className,
  disabled,
  disabledReason,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choice> & {
  disabledReason?: string
}) {
  const reasonId = React.useId()
  const hasReason = Boolean(disabledReason)

  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      disabled={disabled}
      className={cn(
        "group/questionnaire-choice relative flex min-h-(--size-target-min) cursor-pointer items-start gap-2.5 rounded-lg border border-input bg-transparent px-3 py-2.5 text-start text-sm transition-colors outline-none select-none hover:bg-muted/50 has-[>input:focus-visible]:border-ring has-[>input:focus-visible]:ring-3 has-[>input:focus-visible]:ring-ring/50 data-invalid:border-destructive dark:bg-input/20 data-checked:border-primary/40 data-checked:bg-muted dark:data-checked:bg-muted",
        "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      render={(renderProps, state) => (
        <label
          {...renderProps}
          data-shortcut={state.shortcut ?? undefined}
          data-invalid={state.invalid || undefined}
        >
          <QuestionnairePrimitive.ChoiceInput
            data-slot="questionnaire-choice-input"
            aria-describedby={hasReason ? reasonId : undefined}
            className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
          />
          <span
            aria-hidden="true"
            data-slot="questionnaire-choice-indicator"
            className={cn(
              "pointer-events-none translate-y-0.5",
              state.type === "radio" ? radioControlClassName : checkboxControlClassName,
              state.checked &&
                "border-primary bg-primary text-primary-foreground shadow-btn-primary",
              state.invalid && "border-destructive"
            )}
          >
            {state.checked ? (
              state.type === "radio" ? <RadioIndicator /> : <CheckboxMark />
            ) : null}
          </span>
          <QuestionnairePrimitive.ChoiceLabel
            data-slot="questionnaire-choice-label"
            className="flex min-w-0 flex-1 flex-col gap-0.5 leading-snug"
          >
            {children}
          </QuestionnairePrimitive.ChoiceLabel>
          <QuestionnaireChoiceShortcut />
          {hasReason ? (
            <>
              <span id={reasonId} className="sr-only">
                {disabledReason}
              </span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    disabled={!disabled}
                    aria-hidden={!disabled}
                    tabIndex={disabled ? 0 : -1}
                    // Keep the click from toggling the choice.
                    onClick={(event) => event.stopPropagation()}
                    className={cn(
                      // pointer-events-auto: the disabled choice sets pointer-events-none on everything inside it.
                      "pointer-events-auto relative z-20 ms-auto shrink-0 translate-y-0.5 self-start rounded-full text-muted-foreground",
                      "after:absolute after:-inset-2.5",
                      !disabled && "invisible"
                    )}
                  >
                    <Icon icon={Info} size="sm" label="Why is this disabled" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" aria-label="Why this is disabled">
                  <p className="type-small text-popover-foreground">
                    {disabledReason}
                  </p>
                </PopoverContent>
              </Popover>
            </>
          ) : null}
        </label>
      )}
      {...props}
    />
  )
}

function QuestionnaireChoiceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

function QuestionnaireChoiceShortcut({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.ChoiceShortcut>) {
  return (
    <QuestionnairePrimitive.ChoiceShortcut
      data-slot="questionnaire-choice-shortcut"
      className={cn(
        "pointer-events-none ms-auto hidden shrink-0 translate-y-0.5 group-data-[shortcut]/questionnaire-choice:inline-flex",
        className
      )}
      render={(renderProps, state) => (
        <Kbd {...renderProps}>{state.shortcut}</Kbd>
      )}
      {...props}
    />
  )
}

function QuestionnaireInput({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Input>) {
  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className="group/questionnaire-input relative w-full min-w-0"
    >
      <QuestionnairePrimitive.Input
        data-slot="questionnaire-input"
        className={cn(
          "h-8 min-h-(--size-target-min) w-full min-w-0 rounded-pill border border-input bg-transparent px-2.5 py-1 text-base transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 sm:min-h-0 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          "selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground",
          className
        )}
        {...props}
      />
    </div>
  )
}

function QuestionnaireError({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className={cn("mt-2 text-sm text-destructive-ink", className)}
      {...props}
    />
  )
}

function QuestionnaireActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        "grid min-h-(--size-target-min) w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 sm:min-h-8",
        className
      )}
      {...props}
    />
  )
}

function QuestionnairePrevious({
  children,
  className,
  size = "default",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Previous> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Previous
      data-slot="questionnaire-previous"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-1 row-start-1 min-h-(--size-target-min) justify-self-start sm:min-h-0",
        className
      )}
      {...props}
    >
      {children ?? "Previous"}
    </QuestionnairePrimitive.Previous>
  )
}

function QuestionnaireSkip({
  children,
  className,
  size = "default",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Skip> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Skip
      data-slot="questionnaire-skip"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-2 row-start-1 min-h-(--size-target-min) justify-self-end sm:min-h-0",
        className
      )}
      {...props}
    >
      {children ?? "Skip"}
    </QuestionnairePrimitive.Skip>
  )
}

function QuestionnaireNext({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Next> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Next
      data-slot="questionnaire-next"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-3 row-start-1 min-h-(--size-target-min) justify-self-end sm:min-h-0",
        className
      )}
      {...props}
    >
      {children ?? "Next"}
    </QuestionnairePrimitive.Next>
  )
}

function QuestionnaireSubmit({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Submit> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Submit
      data-slot="questionnaire-submit"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-3 row-start-1 min-h-(--size-target-min) justify-self-end sm:min-h-0",
        className
      )}
      {...props}
    >
      {children ?? "Submit"}
    </QuestionnairePrimitive.Submit>
  )
}

export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
}
