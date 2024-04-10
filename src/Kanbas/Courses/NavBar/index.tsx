import React from "react";
import { Link, useLocation } from "react-router-dom";
import { VscChevronRight } from "react-icons/vsc";
import { RxHamburgerMenu } from "react-icons/rx";
import { Navbar } from "react-bootstrap";

import "./index.css";

function NavBar({ course }: { course: any }) {
    const path = useLocation().pathname;

    // strip off everything before and including the course id
    // then split the remaining path into segments
    const splitPath = path.split("/").slice(4);

    const basePath = `/Kanbas/Courses/${course?._id}`;

    return (
        <div>
            <Navbar bg="white" expand="sm" className="align-items-center custom-navbar">
                <Navbar.Brand href="#">
                    <div className="hamburger">
                        <Link to="#">
                            <RxHamburgerMenu size={30} />
                        </Link>
                    </div>
                </Navbar.Brand>

                <Navbar.Collapse id="basic-navbar-nav">
                    <div className="custom-breadcrumb my-auto d-flex align-items-center">
                        <Link to={`${basePath}/Home`}>{course?.name}</Link>
                        {splitPath.map((segment, index) => {
                            const decodedSegment = decodeURIComponent(segment);
                            const pathToSegment = `${basePath}/${splitPath.slice(0, index + 1).join("/")}`;
                            const isLastSegment = index === splitPath.length - 1;

                            return (
                                <React.Fragment key={index}>
                                    <VscChevronRight size={15} className="chevron mx-2" />
                                    <Link to={pathToSegment} className={isLastSegment ? "last-segment" : ""}>
                                        {decodedSegment}
                                    </Link>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default NavBar;
