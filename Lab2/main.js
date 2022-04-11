let showSubmit = false;

function testEmail() {
    let email = document.getElementById("email").value;
    let validEmail = document.forms.formid.email.validity.valid;
    if ((email.endsWith("@gmail.com") || email.endsWith("@yahoo.com")) && validEmail) {
        return true;
    } else {
        return false;
    }
}

function testEmail2() {
    if (!testEmail()) {
        alert("You can only submit @gmail.com and @yahoo.com e-mails!");
    }
}

function testWebsite() {
    let website = document.getElementById("favweb").value;
    let validWeb = document.forms.formid.favweb.validity.valid;
    if ((website.match(/http[s]{0,1}:\/\/(?:www\.)*[A-Za-z0-9]*\.[A-Za-z0-9]*\..+/)) && validWeb) {
        return true;
    } else {
        return false;
    }
}

function testWebsite2() {
    if (!testWebsite()) {
        alert("This is not a valid subdomain.domain website!");
    }
}

// last modified
document.getElementById("modifyDate").innerHTML = document.lastModified;

document.getElementById("submit").disabled = true;
function validateForm() {
    let myEmailTest = testEmail();
    let myWebTest = testWebsite();
    let validEmail = document.forms.formid.email.validity.valid;
    let validWeb = document.forms.formid.favweb.validity.valid;
    let validOperator = (document.getElementById("operator").value.length != 0);
    let validNumber = (parseInt(document.getElementById("number").value) >= 5 && parseInt(document.getElementById("number").value) <= 10);

    // ha a validalas oke, akkor leveszi a submitrol a disabled dolgot, majd return true, maskepp false
    if (myEmailTest && myWebTest && validEmail && validWeb && validOperator && validNumber) {
        document.getElementById("submit").disabled = false;
        return true;
    } else {
        document.getElementById("submit").disabled = true;
        return false;
    }
}

// ha a submitre nyomok es megsem valid a form, akkor hibauzenet (azert kellett kulon szedjem mert onChange mindenre lefut a validalas a submit gomb elohozasa miatt)
function validateFormSubmit() {
    if (!validateForm()) {
        let errors = "You have the following errors:\n"
        if (document.forms.formid.email.validity.valid)
            errors += "The browser couldn't validate the given e-mail\n";
        if (document.forms.formid.favweb.validity.valid)
            errors += "The browser couldn't validate the given link\n";
        if (testEmail())
            errors += "The e-mail isn't a yahoo or gmail e-mail\n";
        if (testWebsite())
            errors += "The link isn't valid\n";
        if ((document.getElementById("operator").value.length != 0))
            errors += "The operator isn't valid\n";
        if(parseInt(document.getElementById("number").value) < 5 || parseInt(document.getElementById("number").value) > 10)
            errors += "The number is not valid\n";
        document.getElementById("errors").innerHTML = errors;
        return false;
    }
    else
        return true;
}

// maga a JS jatek resz

let tomb1 = [], tomb2 = [], results = [];
let firstColumnPair, activeNow, column2;
let firstColumnActive;
let operator;
let numOfPairs;
let showResults;
let num;

function JSProblem() {
    // kikerme a numot es az operatort
    document.getElementById("jsresults").style.visibility = "hidden";
    num = document.getElementById("number").value;
    operator = document.getElementById("operator").value;

    // minden jatek elejen visszaallitom az ertekeket
    tomb1 = [];
    tomb2 = [];
    results = [];
    numOfPairs = 0;
    firstColumnActive = false;
    showResults = false;
    firstColumnPair = new Array(parseInt(num)).fill(-1);
    column2 = new Array(parseInt(num)).fill(0);

    // operator switch statement, majd kigeneralom az ertekeket es az eredmenyeket ugy hogy 100-on belul legyenek
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
                results.push((szam1 / szam2).toFixed(3));
                break;
        }
        
        // pusholom a szamokat es az eredmenyt tombbe
        tomb1.push(szam1);
        tomb2.push(szam2);
    }

    // randomizalom az eredmeny tombom elemeinek sorrendjet
    for (let i = results.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [results[i], results[j]] = [results[j], results[i]];
    }

    // kirajzolja elsore a canvast
    redrawCanvas();
}

function redrawCanvas() {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.font = "15px Arial";
    ctx.clearRect(0, 0, c.width, c.height);
    
    for (i=0;i<num;i++)
    {
        // kiirja az elso oszlop elemeit
        ctx.fillText(tomb1[i] + " " + operator + " " + tomb2[i], 20, (i + 1) * 20);
        // negyzet szin aszerint hogy melyik elem az aktiv eppen
        if (i == activeNow)
            ctx.strokeStyle = "#FF0000";
        else
            ctx.strokeStyle = "#0000FF";
        // negyzet kirajzolasa
        ctx.strokeRect(15, i*20 + 7, 70, 15);
        // majd ugyanez csak a masodik oszlopra es ott mindig fekete negyzet
        ctx.fillText(results[i], 120, (i + 1) * 20);
        ctx.strokeStyle = "#0000FF";
        ctx.strokeRect(115, i*20 + 7, 50, 15);

        // vonalak kirajzolasa (-1 jelzi hogy egy elemtol nem kell meg vonalat huzni sehova)
        if (firstColumnPair[i] != -1) {
            ctx.beginPath();
            ctx.moveTo(15 + 70, i*20 + 7 + 7.5);
            ctx.lineTo(115, firstColumnPair[i]*20 + 7 + 7.5);
            let ii = firstColumnPair[i];
            // ha az eredmenyt kell kiertekelni es ugy huzni a vonalat, akkor helyes eseten zold, maskent piros, ha nem kell kiertekelni akkor fekete
            if (showResults && getSum(i) == results[ii])
                ctx.strokeStyle = "#00FF00";
            else if (showResults)
                ctx.strokeStyle = "#FF0000";
            else
                ctx.strokeStyle = "#0000FF";
            ctx.stroke();
        }
    }
}

window.onload = () => {
    const canvas = document.getElementById('myCanvas');

    // rendelünk egy figyelőt a canvashez
    canvas.addEventListener('click', event => {
        const x = event.pageX - canvas.offsetLeft;
        const y = event.pageY - canvas.offsetTop;
        
        for (i=0;i<num;i++)
        {
            if (x >= 15 && x <= 70 + 15)
            {
                // elso oszlop
                if (y >= i*20 + 7 && y <= i*20 + 7 + 15)
                {
                    // ha epp nincs kivalasztva az elso oszlopbol elem, es olyanra kattintottam akinek meg nincs parja jobbrol akkor o lesz a kivalasztott, piros keret, redraw canvas
                    if (!firstColumnActive && firstColumnPair[i] == -1)
                    {
                        firstColumnActive = true;
                        activeNow = i;
                        redrawCanvas();
                    }
                }
            }
            else if (x >= 115 && x <= 115 + 50)
            {
                // masodik oszlop
                if (y >= i*20 + 7 && y <= i*20 + 7 + 15)
                {
                    // ha van epp kivalasztva az elso oszlopbol elem es a jelenlegi masodik oszlopu elem akire kattintottam meg nincs parja, akkor osszekotom oket es redraw
                    if (firstColumnActive && column2[i] == 0) {
                        firstColumnActive = false;
                        firstColumnPair[activeNow] = i;
                        column2[i] = 1;
                        activeNow = -1;
                        ++numOfPairs;
                        redrawCanvas();
                        // ha mindenkinek van parja akkor megjelenik a kiertekeles gomb
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
            sum = (tomb1[i] / tomb2[i]).toFixed(3);
            break;
    }
    return sum;
}

function jsresults() {
    // ha ranyomnak a kiertekeles gombra, akkor ez a fuggveny fog lefutni, kiszamolja hany ok van, hany nem ok, ezt printeli konzolra, majd beallitja hogy szeretnem latni az eredmenyeket, es ujrarajzolja a canvast
    let ok = 0;
    for (i=0;i<numOfPairs;i++) {
        let ii = firstColumnPair[i];
        let sum = getSum(i);
        if (sum == results[ii])
            ++ok;
    }
    showResults = true;
    redrawCanvas();
    console.log("Helyes: " + ok + ", helytelen: " + (numOfPairs-ok));
}