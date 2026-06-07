const Input = ({
  label,
  error,
  className = "",
  containerClassName = "",
  ...props
}) => {
  return (
    <div className={`form-group ${containerClassName}`}>
      {label && <label className="form-label">{label}</label>}

      <input className={`form-input ${className}`} {...props} />

      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default Input;