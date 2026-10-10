"use client";

import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, MinusIcon, PackageIcon, PlusIcon } from "lucide-react";
import type { HTMLAttributes } from "react";
import { createContext, useContext, useMemo } from "react";

type ChangeType = "major" | "minor" | "patch" | "added" | "removed";

interface PackageInfoContextType {
  name: string;
  currentVersion?: string;
  newVersion?: string;
  changeType?: ChangeType;
}

const PackageInfoContext = createContext<PackageInfoContextType>({
  name: "",
});

export type PackageInfoHeaderProps = HTMLAttributes<HTMLDivElement>;

export const PackageInfoHeader = ({
  className,
  children,
  ...props
}: PackageInfoHeaderProps) => (
  <div
    className={cn("flex items-center justify-between gap-2", className)}
    {...props}
  >
    {children}
  </div>
);

export type PackageInfoNameProps = HTMLAttributes<HTMLDivElement>;

export const PackageInfoName = ({
  className,
  children,
  ...props
}: PackageInfoNameProps) => {
  const { name } = useContext(PackageInfoContext);

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Icon icon={PackageIcon} size="sm" tone="muted" />
      <span className="type-identifier">{children ?? name}</span>
    </div>
  );
};

// Vendored change: replaced the vendor's hardcoded palette classes with the system's semantic Badge variants, keeping the same severity mapping.
const changeTypeVariants: Record<
  ChangeType,
  "destructive" | "warning" | "success" | "info" | "secondary"
> = {
  added: "info",
  major: "destructive",
  minor: "warning",
  patch: "success",
  removed: "secondary",
};

const changeTypeIcons: Record<ChangeType, React.ReactNode> = {
  added: <Icon icon={PlusIcon} size="xs" tone="inherit" />,
  major: <Icon icon={ArrowRightIcon} size="xs" tone="inherit" />,
  minor: <Icon icon={ArrowRightIcon} size="xs" tone="inherit" />,
  patch: <Icon icon={ArrowRightIcon} size="xs" tone="inherit" />,
  removed: <Icon icon={MinusIcon} size="xs" tone="inherit" />,
};

export type PackageInfoChangeTypeProps = HTMLAttributes<HTMLDivElement>;

export const PackageInfoChangeType = ({
  className,
  children,
  ...props
}: PackageInfoChangeTypeProps) => {
  const { changeType } = useContext(PackageInfoContext);

  if (!changeType) {
    return null;
  }

  return (
    <Badge
      className={cn("gap-1 capitalize", className)}
      variant={changeTypeVariants[changeType]}
      {...props}
    >
      {changeTypeIcons[changeType]}
      {children ?? changeType}
    </Badge>
  );
};

export type PackageInfoVersionProps = HTMLAttributes<HTMLDivElement>;

export const PackageInfoVersion = ({
  className,
  children,
  ...props
}: PackageInfoVersionProps) => {
  const { currentVersion, newVersion } = useContext(PackageInfoContext);

  if (!(currentVersion || newVersion)) {
    return null;
  }

  return (
    <div
      className={cn(
        "type-identifier mt-2 flex items-center gap-2 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {currentVersion && <span>{currentVersion}</span>}
          {currentVersion && newVersion && (
            <Icon icon={ArrowRightIcon} size="xs" tone="inherit" />
          )}
          {newVersion && (
            <span className="text-foreground">{newVersion}</span>
          )}
        </>
      )}
    </div>
  );
};

export type PackageInfoProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  currentVersion?: string;
  newVersion?: string;
  changeType?: ChangeType;
};

export const PackageInfo = ({
  name,
  currentVersion,
  newVersion,
  changeType,
  className,
  children,
  ...props
}: PackageInfoProps) => {
  const contextValue = useMemo(
    () => ({ changeType, currentVersion, name, newVersion }),
    [changeType, currentVersion, name, newVersion]
  );

  return (
    <PackageInfoContext.Provider value={contextValue}>
      <div
        className={cn("rounded-lg border bg-card p-4", className)}
        {...props}
      >
        {children ?? (
          <>
            <PackageInfoHeader>
              <PackageInfoName />
              {changeType && <PackageInfoChangeType />}
            </PackageInfoHeader>
            {(currentVersion || newVersion) && <PackageInfoVersion />}
          </>
        )}
      </div>
    </PackageInfoContext.Provider>
  );
};

export type PackageInfoDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const PackageInfoDescription = ({
  className,
  children,
  ...props
}: PackageInfoDescriptionProps) => (
  <p className={cn("type-body mt-2 text-muted-foreground", className)} {...props}>
    {children}
  </p>
);

export type PackageInfoContentProps = HTMLAttributes<HTMLDivElement>;

export const PackageInfoContent = ({
  className,
  children,
  ...props
}: PackageInfoContentProps) => (
  <div className={cn("mt-3 border-t pt-3", className)} {...props}>
    {children}
  </div>
);

export type PackageInfoDependenciesProps = HTMLAttributes<HTMLDivElement>;

export const PackageInfoDependencies = ({
  className,
  children,
  ...props
}: PackageInfoDependenciesProps) => (
  <div className={cn("space-y-2", className)} {...props}>
    {/* Vendored change: dropped `font-medium`/`tracking-wide`/uppercase. */}
    <span className="type-small text-muted-foreground">Dependencies</span>
    <div className="space-y-1">{children}</div>
  </div>
);

export type PackageInfoDependencyProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  version?: string;
};

export const PackageInfoDependency = ({
  name,
  version,
  className,
  children,
  ...props
}: PackageInfoDependencyProps) => (
  <div
    className={cn("type-small flex items-center justify-between", className)}
    {...props}
  >
    {children ?? (
      <>
        <span className="type-identifier text-muted-foreground">{name}</span>
        {version && <span className="type-identifier">{version}</span>}
      </>
    )}
  </div>
);
