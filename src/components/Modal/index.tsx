import { CloseIcon } from '@/assets/icons';
import React, { useEffect, useRef } from 'react';
import './styles.css';

export interface ModalProps {
  isOpen?: boolean;
  title?: string;
  body?: React.ReactNode;
  onClose?: () => void;
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
  body,
  actionButtons,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose!();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose!();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal__overlay" />
      <section className="modal__container" ref={modalRef}>
        <header className="modal__header">
          <h2 id="modal-title" className="modal__title">
            {title}
          </h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <CloseIcon />
          </button>
        </header>
        <div className="modal__body">{body}</div>
        {actionButtons && (
          <footer className="modal__footer">
            {actionButtons?.map((button, index) => (
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
      </section>
    </div>
  );
};
