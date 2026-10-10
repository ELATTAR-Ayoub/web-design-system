"use client";

import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import { createContext, useContext, useMemo } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface SchemaParameter {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  location?: "path" | "query" | "header";
}

interface SchemaProperty {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  properties?: SchemaProperty[];
  items?: SchemaProperty;
}

interface SchemaDisplayContextType {
  method: HttpMethod;
  path: string;
  description?: string;
  parameters?: SchemaParameter[];
  requestBody?: SchemaProperty[];
  responseBody?: SchemaProperty[];
}

const SchemaDisplayContext = createContext<SchemaDisplayContextType>({
  method: "GET",
  path: "",
});

// Vendored change: mapped the vendor's per-method palette classes onto the system's semantic Badge variants.
const methodVariants: Record<
  HttpMethod,
  "destructive" | "success" | "warning" | "info"
> = {
  DELETE: "destructive",
  GET: "success",
  PATCH: "warning",
  POST: "info",
  PUT: "warning",
};

export type SchemaDisplayHeaderProps = HTMLAttributes<HTMLDivElement>;

export const SchemaDisplayHeader = ({
  className,
  children,
  ...props
}: SchemaDisplayHeaderProps) => (
  <div
    className={cn("flex items-center gap-3 border-b px-4 py-3", className)}
    {...props}
  >
    {children}
  </div>
);

export type SchemaDisplayMethodProps = ComponentProps<typeof Badge>;

export const SchemaDisplayMethod = ({
  className,
  children,
  ...props
}: SchemaDisplayMethodProps) => {
  const { method } = useContext(SchemaDisplayContext);

  return (
    <Badge
      className={className}
      variant={methodVariants[method]}
      {...props}
    >
      {children ?? method}
    </Badge>
  );
};

export type SchemaDisplayPathProps = HTMLAttributes<HTMLSpanElement>;

export const SchemaDisplayPath = ({
  className,
  children,
  ...props
}: SchemaDisplayPathProps) => {
  const { path } = useContext(SchemaDisplayContext);

  // Vendored change: mapped the embedded `text-blue-*` palette class in this HTML string onto `text-info-ink` — a path parameter is a neutral callout, not an interactive/brand element.
  const highlightedPath = path.replaceAll(
    /\{([^}]+)\}/g,
    '<span class="text-info-ink">{$1}</span>'
  );

  // Vendored change: upstream fed `children` (a ReactNode) into `__html`, which our React types reject — children now render as nodes.
  if (children != null) {
    return (
      <span className={cn("type-identifier", className)} {...props}>
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn("type-identifier", className)}
      // oxlint-disable-next-line eslint-plugin-react(no-danger)
      dangerouslySetInnerHTML={{ __html: highlightedPath }}
      {...props}
    />
  );
};

export type SchemaDisplayDescriptionProps =
  HTMLAttributes<HTMLParagraphElement>;

export const SchemaDisplayDescription = ({
  className,
  children,
  ...props
}: SchemaDisplayDescriptionProps) => {
  const { description } = useContext(SchemaDisplayContext);

  return (
    <p
      className={cn(
        "type-body border-b px-4 py-3 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children ?? description}
    </p>
  );
};

export type SchemaDisplayContentProps = HTMLAttributes<HTMLDivElement>;

export const SchemaDisplayContent = ({
  className,
  children,
  ...props
}: SchemaDisplayContentProps) => (
  <div className={cn("divide-y", className)} {...props}>
    {children}
  </div>
);

export type SchemaDisplayParameterProps = HTMLAttributes<HTMLDivElement> &
  SchemaParameter;

export const SchemaDisplayParameter = ({
  name,
  type,
  required,
  description,
  location,
  className,
  ...props
}: SchemaDisplayParameterProps) => (
  <div className={cn("px-4 py-3 pl-10", className)} {...props}>
    <div className="flex items-center gap-2">
      <span className="type-identifier">{name}</span>
      <Badge variant="outline">{type}</Badge>
      {location && <Badge variant="secondary">{location}</Badge>}
      {required && <Badge variant="destructive">required</Badge>}
    </div>
    {description && (
      <p className="mt-1 type-small text-muted-foreground">{description}</p>
    )}
  </div>
);

export type SchemaDisplayParametersProps = ComponentProps<typeof Collapsible>;

export const SchemaDisplayParameters = ({
  className,
  children,
  ...props
}: SchemaDisplayParametersProps) => {
  const { parameters } = useContext(SchemaDisplayContext);

  return (
    <Collapsible className={cn(className)} defaultOpen {...props}>
      <CollapsibleTrigger className="press group flex min-h-(--size-target-min) w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-muted/50">
        <Icon
          className="shrink-0 transition-transform group-data-[state=open]:rotate-90"
          icon={ChevronRightIcon}
          size="sm"
          tone="muted"
        />
        <span className="type-body">Parameters</span>
        <Badge className="ml-auto" variant="secondary">
          {parameters?.length}
        </Badge>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="divide-y border-t">
          {children ??
            parameters?.map((param) => (
              <SchemaDisplayParameter key={param.name} {...param} />
            ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export type SchemaDisplayPropertyProps = HTMLAttributes<HTMLDivElement> &
  SchemaProperty & {
    depth?: number;
  };

export const SchemaDisplayProperty = ({
  name,
  type,
  required,
  description,
  properties,
  items,
  depth = 0,
  className,
  ...props
}: SchemaDisplayPropertyProps) => {
  const hasChildren = properties || items;
  // Vendored change: the vendor computed a raw pixel `paddingLeft` per nesting depth (`40 + depth * 16`).
  const paddingLeft = `calc(var(--spacing) * ${10 + depth * 4})`;

  if (hasChildren) {
    return (
      <Collapsible defaultOpen={depth < 2}>
        <CollapsibleTrigger
          className={cn(
            "press group flex min-h-(--size-target-min) w-full items-center gap-2 py-3 text-left transition-colors hover:bg-muted/50",
            className
          )}
          style={{ paddingLeft }}
        >
          <Icon
            className="shrink-0 transition-transform group-data-[state=open]:rotate-90"
            icon={ChevronRightIcon}
            size="sm"
            tone="muted"
          />
          <span className="type-identifier">{name}</span>
          <Badge variant="outline">{type}</Badge>
          {required && <Badge variant="destructive">required</Badge>}
        </CollapsibleTrigger>
        {description && (
          <p
            className="type-small pb-2 text-muted-foreground"
            style={{ paddingLeft: `calc(var(--spacing) * ${10 + depth * 4 + 6})` }}
          >
            {description}
          </p>
        )}
        <CollapsibleContent>
          <div className="divide-y border-t">
            {properties?.map((prop) => (
              <SchemaDisplayProperty
                key={prop.name}
                {...prop}
                depth={depth + 1}
              />
            ))}
            {items && (
              <SchemaDisplayProperty
                {...items}
                depth={depth + 1}
                name={`${name}[]`}
              />
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div
      className={cn("py-3 pr-4", className)}
      style={{ paddingLeft }}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="size-4" />
        <span className="type-identifier">{name}</span>
        <Badge variant="outline">{type}</Badge>
        {required && <Badge variant="destructive">required</Badge>}
      </div>
      {description && (
        <p className="mt-1 type-small pl-6 text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export type SchemaDisplayRequestProps = ComponentProps<typeof Collapsible>;

export const SchemaDisplayRequest = ({
  className,
  children,
  ...props
}: SchemaDisplayRequestProps) => {
  const { requestBody } = useContext(SchemaDisplayContext);

  return (
    <Collapsible className={cn(className)} defaultOpen {...props}>
      <CollapsibleTrigger className="press group flex min-h-(--size-target-min) w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-muted/50">
        <Icon
          className="shrink-0 transition-transform group-data-[state=open]:rotate-90"
          icon={ChevronRightIcon}
          size="sm"
          tone="muted"
        />
        <span className="type-body">Request Body</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t">
          {children ??
            requestBody?.map((prop) => (
              <SchemaDisplayProperty key={prop.name} {...prop} depth={0} />
            ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export type SchemaDisplayResponseProps = ComponentProps<typeof Collapsible>;

export const SchemaDisplayResponse = ({
  className,
  children,
  ...props
}: SchemaDisplayResponseProps) => {
  const { responseBody } = useContext(SchemaDisplayContext);

  return (
    <Collapsible className={cn(className)} defaultOpen {...props}>
      <CollapsibleTrigger className="press group flex min-h-(--size-target-min) w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-muted/50">
        <Icon
          className="shrink-0 transition-transform group-data-[state=open]:rotate-90"
          icon={ChevronRightIcon}
          size="sm"
          tone="muted"
        />
        <span className="type-body">Response</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t">
          {children ??
            responseBody?.map((prop) => (
              <SchemaDisplayProperty key={prop.name} {...prop} depth={0} />
            ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export type SchemaDisplayProps = HTMLAttributes<HTMLDivElement> & {
  method: HttpMethod;
  path: string;
  description?: string;
  parameters?: SchemaParameter[];
  requestBody?: SchemaProperty[];
  responseBody?: SchemaProperty[];
};

export const SchemaDisplay = ({
  method,
  path,
  description,
  parameters,
  requestBody,
  responseBody,
  className,
  children,
  ...props
}: SchemaDisplayProps) => {
  const contextValue = useMemo(
    () => ({
      description,
      method,
      parameters,
      path,
      requestBody,
      responseBody,
    }),
    [description, method, parameters, path, requestBody, responseBody]
  );

  return (
    <SchemaDisplayContext.Provider value={contextValue}>
      <div
        className={cn(
          "overflow-hidden rounded-lg border bg-card",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <SchemaDisplayHeader>
              <div className="flex items-center gap-3">
                <SchemaDisplayMethod />
                <SchemaDisplayPath />
              </div>
            </SchemaDisplayHeader>
            {description && <SchemaDisplayDescription />}
            <SchemaDisplayContent>
              {parameters && parameters.length > 0 && (
                <SchemaDisplayParameters />
              )}
              {requestBody && requestBody.length > 0 && (
                <SchemaDisplayRequest />
              )}
              {responseBody && responseBody.length > 0 && (
                <SchemaDisplayResponse />
              )}
            </SchemaDisplayContent>
          </>
        )}
      </div>
    </SchemaDisplayContext.Provider>
  );
};

export type SchemaDisplayBodyProps = HTMLAttributes<HTMLDivElement>;

export const SchemaDisplayBody = ({
  className,
  children,
  ...props
}: SchemaDisplayBodyProps) => (
  <div className={cn("divide-y", className)} {...props}>
    {children}
  </div>
);

export type SchemaDisplayExampleProps = HTMLAttributes<HTMLPreElement>;

export const SchemaDisplayExample = ({
  className,
  children,
  ...props
}: SchemaDisplayExampleProps) => (
  <pre
    className={cn(
      "type-code mx-4 mb-4 overflow-auto rounded-md bg-muted p-4",
      className
    )}
    {...props}
  >
    {children}
  </pre>
);
