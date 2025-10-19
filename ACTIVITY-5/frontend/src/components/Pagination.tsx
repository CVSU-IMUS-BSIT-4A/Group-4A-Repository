import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '20px 0' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 12px',
          border: '1px solid var(--border)',
          background: 'transparent',
          color: 'var(--text)',
          borderRadius: '6px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
      >
        Previous
      </button>
      
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text)',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            1
          </button>
          {startPage > 2 && <span style={{ color: 'var(--muted)', padding: '8px 4px' }}>...</span>}
        </>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--border)',
            background: page === currentPage ? 'var(--primary)' : 'transparent',
            color: page === currentPage ? 'white' : 'var(--text)',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {page}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span style={{ color: 'var(--muted)', padding: '8px 4px' }}>...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text)',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 12px',
          border: '1px solid var(--border)',
          background: 'transparent',
          color: 'var(--text)',
          borderRadius: '6px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1,
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;