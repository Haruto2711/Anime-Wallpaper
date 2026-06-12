import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ConfirmModal({ show, onHide, onConfirm, title, message }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title>{title || "Xác nhận xóa"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white-50">
        <p>{message || "Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác."}</p>
      </Modal.Body>
      <Modal.Footer className="bg-dark border-secondary">
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Xác nhận xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
