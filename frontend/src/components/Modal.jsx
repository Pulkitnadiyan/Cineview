const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Early return for clarity

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose} // Close modal on backdrop click
    >
      <div 
        className="bg-gray-800 p-2 rounded-lg shadow-2xl border border-gray-700 relative max-w-full max-h-full"
        onClick={(e) => e.stopPropagation()} // Prevent content click from closing modal
      >
        
        {/* Close Button: Enhanced Styling & Positioning */}
        <button
          className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-8 h-8 flex justify-center items-center text-xl font-bold z-20 hover:bg-red-700 transition"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
