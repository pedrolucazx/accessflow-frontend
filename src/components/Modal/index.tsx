import React, { useEffect, useRef } from 'react';
import './styles.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  actionButtons?: {
    label: string;
    onClick: () => void;
    className?: string;
  }[];
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actionButtons,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__overlay" />
      <div className="modal__container" ref={modalRef}>
        <header className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            &times;
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {actionButtons && (
          <footer className="modal__footer">
            {actionButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`modal__button ${button.className || ''}`}
              >
                {button.label}
              </button>
            ))}
          </footer>
        )}
      </div>
    </div>
  );
};
