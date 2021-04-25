import React, { useState } from "react";
import "./App.scss";

import Tag from "./components/Tag";

function App() {
  const BASE = `https://twitter.com/search`;
  const KEY_MAPPING = {
    Beds: ["bed", "beds"],
    Ventilators: ["ventilator", "ventilators"],
    require: ['-"required"', '-"require"', '-"requires"'],
    need: ['-"needs"', '-"need"', '-"needed"'],
    want: ['-"wants"', '-"want"', '-"wanted"', '-"wanting"'],
  };
  const DEFAULT_STATES = {
    includeWords: ["Beds", "Ventilators", "oxygen"],
    excludeWords: ["require", "need", "want"],
    cities: ["Pune", "Mumbai", "Delhi", "Agra", "Chennai", "Bangalore"],
    allIncludedWords: [
      "Beds",
      "Ventilators",
      "Oxygen",
      "Remdesivir",
      "ICU",
      "Isolation",
      "Fabiflu",
      "Test",
      "Plasma",
      "Favipiravir",
    ],
  };

  const [city, setCity] = useState("");
  const [includeWords, setIncludeWords] = useState(DEFAULT_STATES.includeWords);
  const [excludeWords, setExcludeWords] = useState("");
  const [newTag, setNewTag] = useState("");
  const [onlyVerified, setOnlyVerified] = useState(true);
  const [onlyNonRequired, setOnlyNonRequired] = useState(true);

  const onIncludeTagClick = (name) => {
    if (includeWords.includes(name)) {
      includeWords.splice(includeWords.indexOf(name), 1);
    } else {
      includeWords.push(name);
    }
    setIncludeWords([...includeWords]);
  };

  const prepareQuery = () => {
    const included = includeWords.reduce(
      (total, word) =>
        KEY_MAPPING[word]
          ? total.concat(KEY_MAPPING[word])
          : total.concat([word]),
      []
    );

    let allExcludeWords = excludeWords.split(",");

    if (onlyNonRequired) {
      allExcludeWords = allExcludeWords.concat(DEFAULT_STATES.excludeWords);
    }

    let excluded = allExcludeWords.reduce(
      (total, word) =>
        KEY_MAPPING[word]
          ? total.concat(KEY_MAPPING[word])
          : total.concat([`-"${word.trim()}"`]),
      []
    );
    const query = new Array([excluded.join(" ")]);
    query.unshift(`(${included.join(" OR ")})`);
    query.unshift(city);

    if (onlyVerified) {
      query.unshift("verified");
      query.push('-"not verified"');
    }

    return query.join(" ");
  };

  const generateLink = (query) => {
    const queryParams = new URLSearchParams();
    queryParams.set("q", query);
    queryParams.set("f", "live");

    return `${BASE}?${queryParams.toString()}`;
  };

  const startSearch = () => {
    if (city.length < 2) {
      return;
    }
    const url = generateLink(prepareQuery());
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const addNewIncludedWord = () => {
    if (newTag.length > 1) {
      onIncludeTagClick(newTag);
      setNewTag("");
    }
  };

  const onCitySelect = (city) => {
    setCity(city);
    startSearch();
  };

  return (
    <div className="App">
      <div className="container">
        <div className="wrapper">
          <h3 className="title">Search twitter for COVID info</h3>
          <div className="includes-container">
            <h4 className="sub-title">Include words:</h4>
            <div className="includes-container__input">
              {includeWords.map((word) => (
                <Tag
                  key={word}
                  name={word}
                  tagState={true}
                  onTagClick={onIncludeTagClick}
                />
              ))}
            </div>
            <div className="includes-container__tags">
              {DEFAULT_STATES.allIncludedWords.map((word) =>
                !includeWords.includes(word) ? (
                  <Tag
                    key={word}
                    name={word}
                    tagState={false}
                    onTagClick={onIncludeTagClick}
                  />
                ) : null
              )}
            </div>
            <div className="includes-container__new-tags">
              <div className="input-w-button">
                <input
                  name="newTag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value.trim())}
                  placeholder="Add other word"
                />
                <button
                  className="btn"
                  type="button"
                  onClick={addNewIncludedWord}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="excludes-container">
            <h4 className="sub-title">Settings:</h4>
            <Tag
              name="Show only VERIFIED tweets"
              tagState={onlyVerified}
              onTagClick={() => setOnlyVerified(!onlyVerified)}
            />
            <Tag
              name="Do NOT show required tweets"
              tagState={onlyNonRequired}
              onTagClick={() => setOnlyNonRequired(!onlyNonRequired)}
            />
            <div className="input-w-button-wrapper">
              <div className="input-w-button">
                <input
                  name="newTag"
                  value={excludeWords}
                  onChange={(e) => setExcludeWords(e.target.value.trim())}
                  placeholder="Exclude specific words(comma separated)"
                />
              </div>
            </div>
          </div>
          <div className="cities-container">
            <h4 className="sub-title">Select city:</h4>
            <div className="cities-list">
              {DEFAULT_STATES.cities.map((city) => (
                <Tag
                  key={city}
                  name={city}
                  tagState={false}
                  onTagClick={onCitySelect}
                  disableToggle={true}
                />
              ))}
            </div>
          </div>
          <div className="bottom-container">
            {}
            <input
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value.trim())}
              placeholder="Or type city name"
              required
            />
            <button className="btn primary-btn" onClick={() => startSearch()}>
              Search
            </button>
          </div>
          <div className="resources-container">
            <h4 className="sub-title">About this website:</h4>
            <a href="https://github.com/ShubhankarDas/covid-search">
              Source code
            </a>
            <p>
              Developed by{" "}
              <a href="https://github.com/ShubhankarDas/covid-search">
                Shubhankar Das
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
