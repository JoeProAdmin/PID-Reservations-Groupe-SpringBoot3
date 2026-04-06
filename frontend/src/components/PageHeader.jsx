import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle, breadcrumb }) => {
    if (!title) return null;

    return (
        <div className="page-header">
            <div className="container">
                {breadcrumb && (
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-3">
                            {breadcrumb.map((item, index) => (
                                index < breadcrumb.length - 1 ? (
                                    <li className="breadcrumb-item" key={index}>
                                        <Link to={item.path} className="breadcrumb-link">{item.label}</Link>
                                    </li>
                                ) : (
                                    <li className="breadcrumb-item active" key={index}>{item.label}</li>
                                )
                            ))}
                        </ol>
                    </nav>
                )}
                <h2>{title}</h2>
                {subtitle && <p>{subtitle}</p>}
            </div>
        </div>
    );
};

export default PageHeader;