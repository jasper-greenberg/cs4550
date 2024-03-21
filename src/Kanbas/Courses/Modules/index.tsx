import ModuleList from "./List";

function Modules() {
    return (
        <div>
            <div className="d-flex align-items-center button-grp">
                <button type="button" className="wd-modules-button">
                    Collapse All
                </button>
                <button type="button" className="wd-modules-button">
                    View Progress
                </button>
                <select className="form-control me-2 w-25">
                    <option>Publish All</option>
                    <option>Publish All Modules and Items</option>
                    <option>Publish Modules Only</option>
                    <option>Unpublish All</option>
                </select>
                {/* <button type="button" className="wd-modules-button add-module">
                    + Module
                </button> */}
            </div>
            <hr className="horizontal-line" />
            <ModuleList />
        </div>
    );
}

export default Modules;
