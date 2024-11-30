import React, { useState } from "react";

import { buttonAttrs } from "./styles";
import usePathTranslation from "@/i18n/hook";

/** Hook that provides an overlay.
 *
 * It has a simple button that closes it.
 *
 * Returns the component and a function that opens the overlay.
 */
const useOverlay = (msg: string) => {
  const [isVisible, setIsVisible] = useState(false); // State to toggle overlay visibility

  const { t } = usePathTranslation();

  const handleClose = () => {
    setIsVisible(false); // Hides the overlay
  };

  const open = () => setIsVisible(true);

  const component = (
    <>
      {isVisible && (
        <div
          style={{
            position: "fixed", // Ensures overlay covers the entire screen
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent background
            display: "flex",
            justifyContent: "center", // Centers content horizontally
            alignItems: "center", // Centers content vertically
            zIndex: 1000, // Ensures it's above other elements
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              maxWidth: "300px",
            }}
          >
            <p style={{ margin: "0 0 20px" }}>{msg}</p>
            <button onClick={handleClose} {...buttonAttrs}>
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
  return { open, component };
};

export default useOverlay;
