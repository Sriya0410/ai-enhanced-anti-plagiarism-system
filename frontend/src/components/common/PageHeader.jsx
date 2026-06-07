const PageHeader = ({
  title,
  subtitle,
  actions = null,
  eyebrow = ""
}) => {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}

        <h1>{title}</h1>

        {subtitle && <p>{subtitle}</p>}
      </div>

      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
};

export default PageHeader;