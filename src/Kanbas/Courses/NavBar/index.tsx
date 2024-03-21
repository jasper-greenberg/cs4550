import { Link, useParams, useLocation } from "react-router-dom";
import { VscChevronRight } from "react-icons/vsc";
import { RxHamburgerMenu } from "react-icons/rx";
import { Navbar } from "react-bootstrap";

import "./index.css";

function NavBar({ courses }: { courses: any[] }) {
    const { courseId } = useParams();
    const course = courses.find((course) => course._id === courseId);

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
                        <Link to={`/Kanbas/Courses/${course?._id}/Home`}>{course?.name}</Link>
                        <VscChevronRight size={15} className="chevron mx-2" />
                        {useLocation().pathname.split("/").pop()}
                    </div>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default NavBar;