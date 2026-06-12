import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

function Loader({ message = "Đang tải dữ liệu..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
}

export default Loader;
