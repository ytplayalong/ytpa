"use client";

import { useEffect, useRef } from "react";

/** Modal dialog based on the native <dialog> element.
 *
 * It is open as long as it is rendered, so render it conditionally.
 * Escape and a click on the backdrop call `onClose`.
 */
export default function Dialog(props: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault(); // The parent decides, by no longer rendering it
        props.onClose();
      }}
      onClick={(e) => e.target === e.currentTarget && props.onClose()}
    >
      <div className="dialog-body">{props.children}</div>
    </dialog>
  );
}
