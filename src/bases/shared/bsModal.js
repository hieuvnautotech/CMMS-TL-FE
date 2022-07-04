import React, { useEffect } from "react";

const BsModal = ({
  title,
  children,
  toggleModal,
  onClick,
  closeIcon,
  processWhenClose,
  titleProcess,
  titleClose,
  className
}) => {
  var showModal = toggleModal ? "show-modal" : "";
  useEffect(() => {
    if (toggleModal) {
      document.body.classList.add("active-modal");
    } else {
      setTimeout(function() {
        if (document.getElementsByClassName("show-modal").length === 0) {
          document.body.classList.remove("active-modal");
        }
      }, 500);
    }
    return () =>
      setTimeout(function() {
        if (document.getElementsByClassName("show-modal").length === 0) {
          document.body.classList.remove("active-modal");
        }
      }, 500);
  }, [toggleModal]);
  return (
    <div className={`bs-modal modal-top ${showModal} ${className}`}>
      <div className="modal-frame">
        <div className="modal__backdrop" onClick={onClick}></div>
        <div className={`content-modal ${showModal}`}>
          <div className="header-modal">
            <h3 className="modal__title">{title}</h3>
            <span
              title="close"
              className="close__modal"
              onClick={onClick}
            >{closeIcon}</span>
          </div>
          <div className="body-modal">{children}</div>
          <div className="footer-modal">
            {processWhenClose ? (
              <button
                onClick={processWhenClose}
                className="process__btn green__btn"
                type="button"
              >
                {titleProcess}
              </button>
            ) : (
              ""
            )}
            <button
              onClick={onClick}
              className="close__btn red__btn"
              type="button"
            >
              {titleClose}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BsModal;
