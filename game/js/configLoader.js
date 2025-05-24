const config = {};

async function loadConfig(name = "cells") {
    const response = await fetch(`../config/${name}.json`);
    const json = await response.json();
    config[name] = json;
}

function loadAllConfigs() {
    Promise.all(["cells", "weather", "consumption"].map(loadConfig));
}
