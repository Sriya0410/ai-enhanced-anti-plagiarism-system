const Select = ({
  label,
  error,
  options = [],
  placeholder = "Select option",
  className = "",
  containerClassName = "",
  ...props
}) => {
  return (
    <div className={`form-group ${containerClassName}`}>
      {label && <label className="form-label">{label}</label>}

      <select className={`form-input form-select ${className}`} {...props}>
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option
            key={String(option.value)}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default Select;