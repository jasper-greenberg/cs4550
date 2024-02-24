import ModuleList from "../Modules/List";

import "./index.css";

function Home() {
    return (
        <div className="d-flex justify-content-between">
            <div className="col col-lg-9">
                <ModuleList />
            </div>
            <div className="status wd-status col-10 d-none d-lg-block status">
                <div className="d-flex align-items-center mb-3">
                    <button className="me-2 w-15">Unpublish</button>
                    <button className="w-15">Publish</button>
                </div>
                <button className="d-block mb-1 w-25 mt-3">Import Existing Content</button>
                <button className="d-block mb-1 w-25">Import From Commons</button>
                <button className="d-block mb-1 w-25">Choose Home Page</button>
            </div>
        </div>
    );
}

export default Home;
