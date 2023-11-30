import React from "react";

function App() {
    const value = "World";

    return (
        <div>
            <h1>Analyze or Generate image</h1>
            <label htmlFor="image_url">Image URL</label>
            <input type="text" id="image_url" />
            <button>Analyze</button>
            <button>Generate</button>
        </div>
    );
}

export default App;
