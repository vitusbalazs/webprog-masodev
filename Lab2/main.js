let showSubmit = false;

function testEmail() {
    let email = document.getElementById("email").value;
    if (!(email.endsWith("@gmail.com") || email.endsWith("@yahoo.com"))) {
        alert("You can only use @gmail.com or @yahoo.com e-mail addresses!");
        document.getElementById("email").value = "";
    }
}

function testWebsite() {
    let website = document.getElementById("favweb").value;
    //alert(website);
    if (!(website.match(/https:\/\/(?:www\.)*[A-Za-z0-9]*\.[A-Za-z0-9]*\..+/))) {
        alert("Your favourite website must contain one domain and one subdomain!");
        document.getElementById("favweb").value = "";
    }
}

document.getElementById("modifyDate").innerHTML = document.lastModified;

let tomb1 = [], tomb2 = [], results = [];
let firstColumnPair, activeNow, column2;
let firstColumnActive;
let operator;
let numOfPairs;
let showResults;
let num;

function JSProblem() {
    document.getElementById("jsresults").style.visibility = "hidden";
    num = document.getElementById("number").value;
    operator = document.getElementById("operator").value;

    tomb1 = [];
    tomb2 = [];
    results = [];
    numOfPairs = 0;
    firstColumnActive = false;
    showResults = false;
    firstColumnPair = new Array(parseInt(num)).fill(-1);
    column2 = new Array(parseInt(num)).fill(0);

    for (i=0;i<num;i++)
    {
        let szam1, szam2;
        switch(operator) {
            case "+":
                do {
                    szam1 = Math.floor(Math.random() * 100) + 1;
                    szam2 = Math.floor(Math.random() * 100) + 1;
                } while (szam1 + szam2 > 100)
                results.push(szam1 + szam2);
                break;
            case "-":
                do {
                    szam1 = Math.floor(Math.random() * 100) + 1;
                    szam2 = Math.floor(Math.random() * 100) + 1;
                } while (szam1 - szam2 < 0)
                results.push(szam1 - szam2);
                break;
            case "*":
                do {
                    szam1 = Math.floor(Math.random() * 100) + 1;
                    szam2 = Math.floor(Math.random() * 100) + 1;
                } while (szam1 * szam2 > 100)
                results.push(szam1 * szam2);
                break;
            case "/":
                szam1 = Math.floor(Math.random() * 100) + 1;
                szam2 = Math.floor(Math.random() * 100) + 1;
                results.push(Math.round(szam1 / szam2));
                break;
        }
        // console.log(szam1 + " " + operator + " " + szam2);
        tomb1.push(szam1);
        tomb2.push(szam2);
    }

    // randomize array's items
    for (let i = results.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [results[i], results[j]] = [results[j], results[i]];
    }

    redrawCanvas();
}

function redrawCanvas() {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.font = "15px Arial";
    ctx.clearRect(0, 0, c.width, c.height);
    
    for (i=0;i<num;i++)
    {
        ctx.fillText(tomb1[i] + " " + operator + " " + tomb2[i], 20, (i + 1) * 20);
        if (i == activeNow)
            ctx.strokeStyle = "#FF0000";
        else
            ctx.strokeStyle = "#000000";
        ctx.strokeRect(15, i*20 + 7, 70, 15);
        ctx.fillText(results[i], 120, (i + 1) * 20);
        ctx.strokeStyle = "#000000";
        ctx.strokeRect(115, i*20 + 7, 30, 15);

        if (firstColumnPair[i] != -1) {
            ctx.beginPath();
            ctx.moveTo(15 + 70, i*20 + 7 + 7.5);
            ctx.lineTo(115, firstColumnPair[i]*20 + 7 + 7.5);
            let ii = firstColumnPair[i];
            if (showResults && getSum(i) == results[ii])
                ctx.strokeStyle = "#00FF00";
            else if (showResults)
                ctx.strokeStyle = "#FF0000";
            else
                ctx.strokeStyle = "#000000";
            ctx.stroke();
        }
    }
}

window.onload = () => {
    const canvas = document.getElementById('myCanvas');
    // const num = document.getElementById("number").value
    //let operator = document.getElementById("operator").value

    // rendelünk egy figyelőt a canvashez
    canvas.addEventListener('click', event => {
        //console.log("click");
        const x = event.pageX - canvas.offsetLeft;
        const y = event.pageY - canvas.offsetTop;
        
        for (i=0;i<num;i++)
        {
            if (x >= 15 && x <= 70 + 15)
            {
                // elso oszlop
                if (y >= i*20 + 7 && y <= i*20 + 7 + 15)
                {
                    // console.log(1 + " " + (i+1));
                    if (!firstColumnActive && firstColumnPair[i] == -1)
                    {
                        // console.log("not active first column item");
                        firstColumnActive = true;
                        activeNow = i;
                        redrawCanvas();
                    }
                }
            }
            else if (x >= 115 && x <= 115 + 30)
            {
                // masodik oszlop
                if (y >= i*20 + 7 && y <= i*20 + 7 + 15)
                {
                    // console.log(2 + " " + (i+1));
                    if (firstColumnActive && column2[i] == 0) {
                        firstColumnActive = false;
                        firstColumnPair[activeNow] = i;
                        column2[i] = 1;
                        activeNow = -1;
                        ++numOfPairs;
                        redrawCanvas();
                        if (numOfPairs == num) {
                            document.getElementById("jsresults").style.visibility = "visible";
                        }
                    }
                }
            }
        }
    });
};

function getSum(i) {
    let sum;
    switch(operator) {
        case "+":
            sum = tomb1[i] + tomb2[i];
            break;
        case "-":
            sum = tomb1[i] - tomb2[i];
            break;
        case "*":
            sum = tomb1[i] * tomb2[i];
            break;
        case "/":
            sum = Math.round(tomb1[i] / tomb2[i]);
            break;
    }
    return sum;
}

function jsresults() {
    let ok = 0;
    for (i=0;i<numOfPairs;i++) {
        let ii = firstColumnPair[i];
        let sum = getSum(i);
        if (sum == results[ii])
            ++ok;
        //console.log(sum + " " + results[ii]);
    }
    showResults = true;
    redrawCanvas();
    console.log("Helyes: " + ok + ", helytelen: " + (numOfPairs-ok));
}












    /*let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.font = "15px Arial";
    ctx.clearRect(0, 0, c.width, c.height);
    
    for (i=0;i<num;i++)
    {
        //ctx.strokeRect(20,i*20,60,15);
        ctx.fillText(tomb1[i] + " " + operator + " " + tomb2[i], 20, (i + 1) * 20);
        ctx.strokeStyle = "#000000";
        ctx.strokeRect(15, i*20 + 7, 70, 15);
        ctx.fillText(results[i], 120, (i + 1) * 20);
        ctx.strokeStyle = "#000000";
        ctx.strokeRect(115, i*20 + 7, 30, 15);
    }*/