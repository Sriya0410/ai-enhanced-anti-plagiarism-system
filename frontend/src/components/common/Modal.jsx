import { X } from "lucide-react";

const Modal = ({
  open,
  title,
  children,
  onClose,
  footer,
  size = "md"
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className={`modal-card modal-${size}`}>
        <div className="modal-header">
          <h3>{title}</h3>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;