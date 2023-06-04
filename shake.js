"use strict";
var Shake = (function () {
    var blur = create("feGaussianBlur", ["in", "SourceGraphic"], ["stdDeviation", "0, 0"]);

    var svg = document.body.appendChild(chain(create("svg"), create("defs"), create("filter", ["id", "blur"]), blur));

    function create(name, ...attributes) {
        var e = document.createElementNS("http://www.w3.org/2000/svg", name);
        for (let attribute of attributes) {
            e.setAttribute(attribute[0], attribute[1]);
        }
        return e;
    }

    function chain(...elements) {
        var ie = elements[0];
        for (let i = 1; i < elements.length; i++) {
            let e = elements[i];
            ie.appendChild(e);
            ie = e;
        }
        return elements[0];
    }

    function setBlur(x, y){
        blur.setAttribute("stdDeviation", `${x}, ${y}`);	
    }

    var animationframe;
    
    function shake(y=40, delay=40, min=.2, div=1.2, blurfactor=.125, smooth=false) {
        cancelAnimationFrame(animationframe);

        var start = Date.now();
        div = -Math.abs(div);

        var a = 0;
        
        if (smooth) document.body.style.transition = `margin-top ${delay}ms ease-in`;
        else document.body.style.transition = "";

        document.body.style.filter = "url(#blur)";

        iterateShake();
    
        function iterateShake() {
            if (Math.abs(y) >= min) animationframe = requestAnimationFrame(iterateShake);
            else y = 0;
    
            if (Date.now() - start > delay || !y) update();
        }

        function update() {
            start = Date.now();
            document.body.style.marginTop = `${y}px`;
            if (blurfactor) setBlur(0, Math.abs((div - 1) * y * blurfactor));
            y /= div;

            if (!a++ && smooth) document.body.style.transition = `margin-top ${delay}ms ease`;
        }
    }

    return shake;
})();