const SectionLabel = ({ icon, text }) => (
    <span className="section-label">
        <i className={`fas fa-${icon} me-2`}></i>{text}
    </span>
);

export default SectionLabel;