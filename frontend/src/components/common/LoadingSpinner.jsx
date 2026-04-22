import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 40, text = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner" style={{ width: size, height: size }}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
