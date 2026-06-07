const Loader = ({ text = "Loading...", fullScreen = false }) => {
  return (
    <div className={fullScreen ? "loader-screen" : "loader-wrap"}>
      <div className="loader-spinner" />
      <p>{text}</p>
    </div>
  );
};

export default Loader;