// poor man's react

(function (){
    let mainEl = document.createElement("main");
    let inputsEl = document.createElement("div");
    inputsEl.className = "inputs";

    let formatEl;

    let inputs = {};
    let formulaGroups = {};

    function createInput(id, options){
        const type = options.type ?? "textarea";

        const wrapperEl = document.createElement("div");
        wrapperEl.className = "input-wrapper";

        const inputEl = document.createElement(
            type == "textarea" ? "textarea" :
            type == "html" ? "div" :
            "input");

        inputEl.id = id;
        inputEl.placeholder = options.desc;

        // special options for different types
        switch(type){
            case "textarea":
                inputEl.rows = 16;
                inputEl.cols = 64;
                break;
            case "number":
                inputEl.type = "number";
                break;
            case "html":
                wrapperEl.className = "input-wrapper output-html";
                break;
        }

        if(options.readonly)
            inputEl.readOnly = true;

        inputs[id] = inputEl;

        wrapperEl.appendChild(inputEl);

        if(options.unit){
            const unitEl = document.createElement("span");
            unitEl.className = "unit";
            unitEl.textContent = options.unit;
            wrapperEl.appendChild(unitEl);
        }

        return wrapperEl;
    }
    function createFormat(options){
        formatEl = document.createElement("select");
        for(const [key, desc] of Object.entries(options)){
            const optionEl = document.createElement("option");
            optionEl.value = key;
            optionEl.textContent = desc;
            formatEl.appendChild(optionEl);
        }
        return formatEl;
    }
    function setupCommon(title, desc){
        document.title = title;

        const titleEl = document.createElement("h1");
        titleEl.textContent = title;
        mainEl.appendChild(titleEl);

        if(desc){
            const descEl = document.createElement("h2");
            descEl.textContent = desc;
            mainEl.appendChild(descEl);
        }
    }
    function finishCommon(version){
        mainEl.appendChild(inputsEl);

        const footerEl = document.createElement("footer");
        footerEl.append("Made by Creative0708#1593.");
        footerEl.appendChild(document.createElement("br"));
        footerEl.append("Version " + version);

        mainEl.appendChild(footerEl);

        document.body.appendChild(mainEl);
    }

    window.setupTranslator = function(title, version, desc, inputOptions, formatOptions){
        setupCommon(title, desc);

        if(formatOptions){
            mainEl.appendChild(createFormat(formatOptions));
        }
        for(const [id, options] of Object.entries(inputOptions)){
            inputsEl.appendChild(createInput(id, options));
        }

        for(const [id, options] of Object.entries(inputOptions)){
            if(!options.listener)
                continue;

            const currInput = inputs[id];
            if(options.style)
                Object.assign(currInput.style, options.style);
            
            const formulaGroup = options.formulaGroup;

            if(!formulaGroups[formulaGroup]){
                formulaGroups[formulaGroup] = {
                    inputs: [],
                    selected: undefined
                };
            }

            formulaGroups[formulaGroup].inputs.push(currInput);

            const listenedInputs = options.listenIds ?
                options.listenIds.map((id) => inputs[id]) :
                options.listenId ?
                [inputs[options.listenId]] :
                [];
            const errorMappings = options.errorMappings;

            function update(){
                if(formulaGroup && formulaGroups[formulaGroup].selected != id)
                    return;

                const args = listenedInputs.map((el) => 
                    inputOptions[el.id].type == "number" ?
                    parseFloat(el.value || "0") :
                    el.value);
                
                if(formatEl)
                    args.push(formatEl.value)
                let value;
                try{
                    value = options.listener.apply(undefined, args)
                    if(Number.isNaN(value)){
                        value = "Error: Invalid inputs";
                    }
                }catch(e){
                    value = "Error: " + (errorMappings && errorMappings[e.name] ? errorMappings[e.name] : e);
                }
                if(options.type == "html")
                    currInput.innerHTML = value;
                else
                    currInput.value = value;
            }
            currInput._updateFunc = update;
            for(const input of listenedInputs){
                input.addEventListener("input", update);
                if(inputOptions[input.id].formulaGroup)
                    input.addEventListener("dblclick", update);
            }

            if(formulaGroup){
                function setSelected(){
                    const prevSelected = formulaGroups[formulaGroup].selected;
                    if(prevSelected){
                        if(prevSelected == id)
                            return;
                        const prevInput = inputs[prevSelected];
                        prevInput.className = undefined;
                        prevInput.readOnly = false;
                        if(inputOptions[prevInput.id].type == "number")
                            prevInput.type = "number";
                    }
                    formulaGroups[formulaGroup].selected = id;

                    currInput.className = "formula-selected";
                    currInput.readOnly = true;
                    if(options.type == "number")
                        currInput.type = "text";
                    
                    update();
                }
                currInput.addEventListener("dblclick", setSelected);
                setSelected();
            }
        }

        for(const inputId in inputs){
            const currInput = inputs[inputId];
            if(currInput._updateFunc){
                currInput._updateFunc();
                delete currInput._updateFunc;
            }
        }

        finishCommon(version);
    };

    // utility functions
    window.formatNumber = function(number, precision=10){
        const str = number.toString();
        if(!str.includes('.'))
            return str;
        return str.substring(0, Math.max(a.indexOf('.'), precision))
    };

})();