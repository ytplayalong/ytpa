import React, { useState } from "react";

import usePathTranslation from "@/i18n/hook";

import Dialog from "../components/dialog";
import { primaryButtonAttrs } from "./styles";

/** Hook that provides a simple message dialog.
 *
 * It has a button that closes it.
 *
 * Returns the component and a function that opens the dialog.
 */
const useOverlay = (msg: string) => {
  const [isVisible, setIsVisible] = useState(false);

  const { t } = usePathTranslation();

  const handleClose = () => setIsVisible(false);
  const open = () => setIsVisible(true);

  const component = (
    <>
      {isVisible && (
        <Dialog onClose={handleClose}>
          <p style={{ marginTop: 0 }}>{msg}</p>
          <div className="dialog-buttons">
            <button onClick={handleClose} {...primaryButtonAttrs}>
              {t("close")}
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
  return { open, component };
};

export default useOverlay;
