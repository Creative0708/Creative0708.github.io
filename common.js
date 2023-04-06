// poor man's react

(function (){
    let mainEl = document.createElement("main");

    let formatEl;

    let textareas = {};

    function createTextarea(id, options){
        const textarea = document.createElement("textarea");
        textarea.rows = 16;
        textarea.cols = 64;

        textarea.id = id;
        textarea.placeholder = options.desc;

        if(options.readonly)
            textarea.readOnly = true;

        textareas[id] = textarea;

        return textarea;
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
            mainEl.appendChild(desc);
        }
    }
    function finishCommon(version){
        const footerEl = document.createElement("footer");
        footerEl.append("Made by Creative0708#1593.");
        footerEl.appendChild(document.createElement("br"));
        footerEl.append("Version " + version);

        document.body.appendChild(mainEl);
    }

    window.setupTranslator = function(title, version, desc, textareaOptions, formatOptions){
        setupCommon(title, desc);

        if(formatOptions){
            mainEl.appendChild(createFormat(formatOptions));
        }
        for(const [id, options] of Object.entries(textareaOptions)){
            mainEl.appendChild(createTextarea(id, options));
        }

        for(const [id, options] of Object.entries(textareaOptions)){
            if(options.listener){
                const currTextarea = textareas[id];
                if(options.style)
                    Object.assign(currTextarea.style, options.style);
                
                const listenedTextareas = options.listenIds ?
                    options.listenIds.map((id) => textareas[id]) :
                    [textareas[options.listenId]];
                function update(){
                    const args = listenedTextareas.map((el) => el.value);
                    if(formatEl)
                        args.push(formatEl.value)
                    currTextarea.textContent = options.listener.apply(undefined, args);
                }
                currTextarea._updateFunc = update;
                for(const textarea of listenedTextareas){
                    textarea.addEventListener("input", update);
                }
            }
        }

        for(const textareaId in textareas){
            const currTextarea = textareas[textareaId];
            if(currTextarea._updateFunc)
                currTextarea._updateFunc();
        }

        finishCommon(version);
    };
})();