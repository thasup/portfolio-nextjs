import { AlertCircle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  beforeData: any;
  afterData: any;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  title,
  beforeData,
  afterData,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-xl border bg-[var(--cos-surface)] p-6 shadow-2xl"
        style={{ borderColor: "var(--cos-border-subtle)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-bold">{title}</h3>
        </div>

        <div className="mb-6">
          <p className="text-sm text-[var(--cos-text-2)] mb-4">
            Please review the changes before confirming this operation.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-lg p-3 border"
              style={{
                background: "var(--cos-surface-2)",
                borderColor: "var(--cos-border-subtle)",
              }}
            >
              <div className="text-xs font-bold text-[var(--cos-text-3)] mb-2 uppercase tracking-wider">
                Before
              </div>
              <pre className="text-xs text-[var(--cos-text-2)] whitespace-pre-wrap overflow-x-auto">
                {beforeData
                  ? JSON.stringify(beforeData, null, 2)
                  : "No previous state"}
              </pre>
            </div>

            <div
              className="rounded-lg p-3 border"
              style={{
                background: "var(--cos-surface-2)",
                borderColor: "var(--cos-accent)",
              }}
            >
              <div className="text-xs font-bold text-[var(--cos-accent)] mb-2 uppercase tracking-wider">
                After
              </div>
              <pre className="text-xs text-[var(--cos-text-1)] whitespace-pre-wrap overflow-x-auto">
                {afterData ? JSON.stringify(afterData, null, 2) : "Deleted"}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-[var(--cos-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
