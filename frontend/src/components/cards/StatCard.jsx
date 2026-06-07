const StatCard = ({ title, value = 0, icon: Icon, subtitle = "" }) => {
  return (
    <div className="stat-card">
      {Icon && (
        <div className="stat-icon">
          <Icon size={26} />
        </div>
      )}

      <div>
        <p>{title}</p>
        <h2>{value}</h2>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
};

export default StatCard;