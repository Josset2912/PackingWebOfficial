// TablaWrapper.jsx
const TablaWrapper = ({ children }) => {
  return (
    <div className="relative z-10 max-h-[calc(100vh-100px)] overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl shadow-lg">
      {children}
    </div>
  );
};

export default TablaWrapper;
