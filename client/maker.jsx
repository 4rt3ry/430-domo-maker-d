const helper = require("./helper.js");
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector("#domoName").value;
    const age = e.target.querySelector("#domoAge").value;
    const mood = e.target.querySelector("#domoMood").value;

    if (!name || !age || !mood) {
        helper.handleError("All fields are required");
        return false;
    }

    helper.sendPost(e.target.action, { name, age, mood }, onDomoAdded);
    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" name="age" min="0" />
            <label htmlFor="mood">Mood: </label>
            <select name="mood" id="domoMood">
                <option value="Happy">Happy</option>
                <option value="Sad">Sad</option>
                <option value="Angry">Angry</option>
                <option value="Depressed">Depressed</option>
                <option value="Curious">Curious</option>
                <option value="Feisty">Feisty</option>
            </select>
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />

        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const deleteDomo = async (id, handler) => {
        await helper.sendDelete('/deleteDomo', { id });
        if (handler) handler();
    }

    const domoNodes = domos.map(domo => {

        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <div className="description">
                    <h3 className="domoName">Name: {domo.name}</h3>
                    <h3 className="domoAge">Age: {domo.age}</h3>
                    <h3 className="domoMood">Mood: {domo.mood}</h3>
                </div>
                <button className="deleteDomo" onClick={() => { deleteDomo(domo._id, props.triggerReload); }}>
                    Delete
                </button>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    )
}

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.querySelector("#app"));
    root.render(<App />);
};

window.onload = init;