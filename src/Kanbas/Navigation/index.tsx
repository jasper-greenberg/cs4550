import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaRegUserCircle, FaBook, FaRegCalendarAlt, FaRegFileVideo, FaQuestionCircle, FaHistory, FaInbox } from "react-icons/fa";

import "./index.css";

function KanbasNavigation() {
    const links = [
        { label: "Account", icon: <FaRegUserCircle className="fs-2" /> },
        { label: "Dashboard", icon: <FaTachometerAlt className="fs-2" /> },
        { label: "Courses", icon: <FaBook className="fs-2" /> },
        { label: "Calendar", icon: <FaRegCalendarAlt className="fs-2" /> },
        { label: "Inbox", icon: <FaInbox className="fs-2" /> },
        { label: "History", icon: <FaHistory className="fs-2" /> },
        { label: "Studio", icon: <FaRegFileVideo className="fs-2" /> },
        { label: "Help", icon: <FaQuestionCircle className="fs-2" /> },
    ];

    const { pathname } = useLocation();

    return (
        <ul className="wd-kanbas-navigation">
            <li>
                <NEUIcon />
            </li>
            {links.map((link, index) => (
                <li key={index} className={pathname.toLowerCase().includes(link.label.toLowerCase()) ? "wd-active" : ""}>
                    <Link to={`/Kanbas/${link.label}`}>
                        <span className={link.label === "Account" ? "account-icon" : "icon"}>{link.icon}</span>
                        <span className={link.label === "Account" ? "account-label" : "label"}>{link.label}</span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

function NEUIcon() {
    return (
        <a href="http://northeastern.edu">
            <img src="https://alumni.northeastern.edu/wp-content/uploads/2020/05/howlin-huskies-trivia-logo.png" alt="..." className="neu-icon center" />
        </a>
    );
}

export default KanbasNavigation;
