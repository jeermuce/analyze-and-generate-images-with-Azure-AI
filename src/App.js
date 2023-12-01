import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    analyzeImage,
    isConfigured as isAnalyzerConfigured,
} from "./azure-image-analysis";
import {
    generateImage,
    isConfigured as isGenConfigured,
} from "./openAI-image-generation";

function App() {
    const navigate = useNavigate();
    const [query, setQuery] = React.useState("");
    const [imgurl, setImgurl] = React.useState("");
    const [prompt, setPrompt] = React.useState("");
    const [analysis, setAnalysis] = React.useState("");
    const [caption, setCaption] = React.useState("");
    const [generated, setGenerated] = React.useState("");
    const [analyzerConfigured, setAnalyzerConfigured] = React.useState(true);
    const [genConfigured, setGenConfigured] = React.useState(true);

    useEffect(() => {
        setAnalyzerConfigured(isAnalyzerConfigured());
        setGenConfigured(isGenConfigured());

        const params = new URLSearchParams(window.location.search);
        const query = params.get("query") || "";
        setQuery(query);
        const inputType = identifyInputType(query);
        if (inputType === "image") {
            setImgurl(query);
        } else if (inputType === "prompt") {
            setPrompt(query);
        } else {
            setImgurl("");
            setPrompt("");
        }
    }, []);

    function identifyInputType(query) {
        if (query.startsWith("http")) {
            return "image";
        } else if (query !== "" && query.length > 4) {
            return "prompt";
        } else {
            return "waiting";
        }
    }
    function handleChange(event) {
        const newQuery = event.target.value;
        const inputType = identifyInputType(newQuery);
        setQuery(newQuery);
        if (inputType === "image") {
            setImgurl(newQuery);
        } else if (inputType === "prompt") {
            setPrompt(newQuery);
        } else {
            setImgurl("");
            setPrompt("");
        }
        navigate(`?query=${encodeURIComponent(newQuery)}`);
    }

    function clear() {
        setQuery("");
        setImgurl("");
        setPrompt("");
        setAnalysis("");
        setGenerated("");
        navigate("");
    }

    async function analyze() {
        const analysis = await analyzeImage(imgurl);
        const caption = analysis.captionResult.text;
        setCaption(caption);
        const captionConfidence = analysis.captionResult.confidence;
        let readContent = analysis.readResult.content;
        console.table(caption, captionConfidence, readContent);
        readContent = readContent.split("\n");
        if (readContent[0] === "") readContent = null;
        const userRelevant = {
            caption,
            captionConfidence,
        };
        readContent && (userRelevant.readContent = readContent);
        setAnalysis(userRelevant);
    }

    async function generate() {
        setGenerated("Generating...");
        const generated = await generateImage(prompt);
        setGenerated(generated);
    }

    return genConfigured && analyzerConfigured ? (
        <div className="app">
            <h1>Hooo</h1>
            <label htmlFor="image">Image URL or Prompt</label>
            <section className="buttons">
                <input
                    id="image"
                    type="text"
                    onChange={handleChange}
                    value={query}
                    placeholder="URL or Prompt"
                />
                <button
                    onClick={clear}
                    disabled={query === "" && !generated && !analysis}
                >
                    x
                </button>
            </section>

            <section className="buttons">
                <button
                    onClick={analyze}
                    disabled={identifyInputType(query) !== "image"}
                >
                    Analyze
                </button>
                <button
                    onClick={generate}
                    disabled={identifyInputType(query) !== "prompt"}
                >
                    Generate
                </button>
            </section>
            <section
                style={
                    !!generated
                        ? {
                              display: "flex",
                              flexDirection: "column-reverse",
                              alignItems: "center",
                          }
                        : {
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "2rem",
                          }
                }
            >
                <img
                    src={(!!imgurl && imgurl) || (!!generated && generated)}
                    alt={caption || imgurl || generated}
                    style={
                        !!imgurl || !!generated
                            ? { height: "15rem" }
                            : { display: "none" }
                    }
                />
                {!!prompt && (
                    <div className="prompt">
                        <p>{prompt}</p>
                    </div>
                )}
                {!!analysis && (
                    <div className="analysis">
                        <p>{analysis.caption}</p>
                        <p>{analysis.captionConfidence}</p>
                        {analysis.readContent && (
                            <ul
                                style={
                                    !!analysis.readContent
                                        ? {
                                              display: "flex",
                                              flexDirection: "column",
                                              justifyContent: "bottom",
                                              flexWrap: "wrap",
                                              height: "15rem",
                                              width: "fit-content",
                                              columnGap: "6rem",
                                          }
                                        : { display: "none" }
                                }
                            >
                                {analysis.readContent.map((line) => (
                                    <li style={{ textAlign: "left" }}>
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </section>

            {query.startsWith("http") && (
                <a href={query} target="_blank" rel="noopener noreferrer">
                    {query}
                </a>
            )}
            {!!generated && (
                <a href={generated} target="_blank" rel="noopener noreferrer">
                    {generated}
                </a>
            )}
        </div>
    ) : (
        <div className="app">
            {!analyzerConfigured && (
                <p>
                    Azure Key and/or endpoint not configured for cognitive
                    services
                </p>
            )}
            {!genConfigured && <p>OpenAI key not configured</p>}
            {/* ... rest of your JSX ... */}
        </div>
    );
}

export default App;
