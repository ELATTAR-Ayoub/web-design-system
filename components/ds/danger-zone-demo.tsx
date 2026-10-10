"use client";

import * as React from "react";
import { ShieldAlert, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";

type DeleteStatus = "idle" | "deleting" | "deleted" | "failed";

export type DangerZoneProps = {
  onDelete?: () => Promise<void>;
  unavailableReason?: string;
  loading?: boolean;
};

const DEFAULT_DELETE = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 1400));

export function DangerZone({
  onDelete = DEFAULT_DELETE,
  unavailableReason,
  loading = false,
}: DangerZoneProps) {
  const headingId = React.useId();
  const [status, setStatus] = React.useState<DeleteStatus>("idle");
  const [failure, setFailure] = React.useState<string | null>(null);

  async function runDelete() {
    setStatus("deleting");
    setFailure(null);
    try {
      await onDelete();
      setStatus("deleted");
      toast.success("Account deleted", {
        description: "You have been signed out everywhere.",
      });
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : "The server did not respond.";
      setStatus("failed");
      setFailure(reason);
      toast.error("Could not delete your account", { description: reason });
    }
  }

  return (
    <section
      aria-labelledby={headingId}
      className="overflow-hidden rounded-lg border border-destructive/30 bg-card"
    >
      <div className="flex items-center gap-2 border-b border-destructive/30 bg-destructive/8 px-5 py-3">
        <Icon icon={ShieldAlert} size="sm" tone="error" />
        <h3 id={headingId} className="type-badge text-destructive-ink">
          Danger zone
        </h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        {loading ? (
          <DangerZoneRowSkeleton />
        ) : status === "deleted" ? (
          <DeletedRow />
        ) : (
          <>
            <div className="min-w-0">
              <p className="type-body text-foreground">Delete account</p>
              <p className="type-small mt-1 max-w-md text-muted-foreground">
                Your workspace, its members and every file in it are removed
                immediately. This cannot be undone.
              </p>
            </div>

            {unavailableReason ? (
              <div className="flex flex-col items-end gap-1.5">
                <Button variant="destructive" disabled>
                  Delete account
                </Button>
                {/* Active text beside a disabled control. The control is exempt
                    from contrast (trap 9); this sentence is not, so it takes
                    `text-muted-foreground` and clears AA in both themes. */}
                <p className="type-small text-right text-muted-foreground">
                  {unavailableReason}
                </p>
              </div>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" loading={status === "deleting"}>
                    Delete account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your workspace, its 14 members and all 2,480 files are
                      removed immediately. Support cannot restore them, and the
                      workspace name becomes available to anyone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep my account</AlertDialogCancel>
                    <AlertDialogAction onClick={runDelete}>
                      Delete my account and all files
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </>
        )}
      </div>

      {status === "failed" && failure && (
        <div className="anim-enter px-5 pb-5">
          <Alert variant="destructive">
            <Icon icon={TriangleAlert} tone="error" />
            <AlertTitle>Account not deleted</AlertTitle>
            <AlertDescription>
              {failure} Nothing was removed. Try again, or contact support if it
              keeps failing.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </section>
  );
}

function DeletedRow() {
  return (
    <div className="anim-enter min-w-0">
      <p className="type-body text-foreground">Account deleted</p>
      <p className="type-small mt-1 max-w-md text-muted-foreground">
        Deleted a moment ago. You will be signed out of every device shortly.
      </p>
    </div>
  );
}

function DangerZoneRowSkeleton() {
  return (
    <>
      <div className="min-w-0">
        <p className="type-body">
          <Skeleton as="span" className="h-4 w-36 align-middle" />
        </p>
        <p className="type-small mt-1 max-w-md text-muted-foreground">
          <Skeleton as="span" className="h-3.5 w-72 align-middle" />
        </p>
      </div>
      <Skeleton className="h-10 w-36 rounded-pill" />
    </>
  );
}
