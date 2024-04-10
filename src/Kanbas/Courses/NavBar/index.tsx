import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { VscChevronRight } from "react-icons/vsc";
import { RxHamburgerMenu } from "react-icons/rx";
import { Navbar } from "react-bootstrap";

import "./index.css";

import * as client from "../Quizzes/client";

function NavBar({ course }: { course: any }) {
    const path = useLocation().pathname;

    // strip off everything before and including the course id
    // then split the remaining path into segments
    const splitPath = path.split("/").slice(4);

    const basePath = `/Kanbas/Courses/${course?._id}`;

    const findQuizById = async (quizId: string) => {
        const quiz = await client.findQuizById(quizId);
        return quiz;
    };

    const [segments, setSegments] = useState(splitPath);

    useEffect(() => {
        if (splitPath.length > 1 && splitPath[0] === "Quizzes") {
            findQuizById(splitPath[1]).then((quiz) => {
                const newSegments = [splitPath[0], quiz.title];
                if (JSON.stringify(newSegments) !== JSON.stringify(segments)) {
                    setSegments(newSegments);
                }
            });
        // if the path doesn't match the segments, update the segments
        } else if (JSON.stringify(splitPath) !== JSON.stringify(segments)) {
            setSegments(splitPath);
        }
    }, [splitPath, segments]);

    return (
        <div>
            <Navbar bg="white" expand="sm" className="custom-navbar align-items-center">
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
                        {segments.map((segment, index) => {
                            const pathToSegment = `${basePath}/${splitPath.slice(0, index + 1).join("/")}`;
                            const isLastSegment = index === segments.length - 1;

                            return (
                                <React.Fragment key={index}>
                                    <VscChevronRight size={15} className="chevron mx-2" />
                                    <Link to={pathToSegment} className={isLastSegment ? "last-segment" : ""}>
                                        {segment}
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
