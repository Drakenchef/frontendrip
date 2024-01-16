import {FC} from 'react';
import {Link} from 'react-router-dom';
import React from 'react';
import './BreadCrumbs.css'

export interface IBreadCrumb {
    to: string;
    name: string;
}
// ?
interface BreadCrumbsProps {
    pages: IBreadCrumb[];
}

const BreadCrumbs: FC<BreadCrumbsProps> = ({pages}) => {
    return (
        <div style={{display: 'flex'}}>
            <div className="breadcrumbs-container">
                {pages.map((page, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span className="separator">{' -> '}</span>}
                        <Link to={`/${page.to}`} className="nav-link ps-0">
                            <span className="breadcrumb">{page.name}</span>
                        </Link>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default BreadCrumbs;
