//CSVファイルを読み込む関数getCSV()の定義
function getCSV() {
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", "sample.csv", true); // アクセスするファイルを指定
    req.send(null); // HTTPリクエストの発行

    // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
    req.onload = function () {
        convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
    }
}

// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray(str) { // 読み込んだCSVデータが文字列として渡される
    var result = []; // 最終的な二次元配列を入れるための配列
    var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for (var i = 0; i < tmp.length; ++i) {
        result[i] = tmp[i].split(',');
    }

    let csvs = [];
    for (r of result) {
        csvs.push({
            disp: toHalfWidth(r[0]),
            ruby: toHalfWidth(r[1]),
            ans: toHalfWidth(r[2])
        });
    }
    console.log(csvs);
    console.log(Object.keys(csvs[0]).length);

    let table = document.createElement('table');
    table.classList = "table table-striped table-hover";
    document.querySelector('#result').appendChild(table);

    // header
    {
        let thead = document.createElement('thead');
        table.appendChild(thead);
        let tr = document.createElement('tr');
        thead.appendChild(tr);
        let key = Object.keys(csvs[0]);
        for (let i = 0; i < key.length; i++) {
            console.log(key[i], csvs[0][key[i]]);
            let th = document.createElement('th');
            th.setAttribute('scope', "col");
            th.innerHTML = csvs[0][key[i]];
            tr.appendChild(th);
        }
    }
    // table data
    {
        let tbody = document.createElement('tbody');
        table.appendChild(tbody);

        let count = 0;
        for (csv of csvs) {
            if (count > 0) {
                let tr = document.createElement('tr');
                tbody.appendChild(tr);
                let key = Object.keys(csv);
                for (let i = 0; i < key.length; i++) {
                    console.log(key[i], csv[key[i]]);
                    let td = document.createElement('td');
                    td.innerHTML = csv[key[i]];
                    tr.appendChild(td);
                }
            }
            count++;
        }
    }
    console.log(document.querySelector("#result"));
}

window.onload = function () {
    getCSV();
}

function search(keyword) {

    // get all td items
    let trs = document.querySelector('tbody').querySelectorAll('tr');
    for (tr of trs) {
        let tds = tr.querySelectorAll('td');
        if (tds[0].innerHTML.toUpperCase().indexOf(keyword.toUpperCase()) >= 0) {
            tr.hidden = false;
        }
        else {
            tr.hidden = true;
        }
    }
}


/**
 * https://webllica.com/change-double-byte-to-half-width/
 * 全角から半角への変革関数
 * 入力値の英数記号を半角変換して返却
 * [引数]   strVal: 入力値
 * [返却値] String(): 半角変換された文字列
 */
function toHalfWidth(strVal) {
    // 半角変換
    var halfVal = strVal.replace(/[！-～]/g,
        function (tmpStr) {
            // 文字コードをシフト
            return String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0);
        }
    );

    // 文字コードシフトで対応できない文字の変換
    return halfVal.replace(/”/g, "\"")
        .replace(/’/g, "'")
        .replace(/‘/g, "`")
        .replace(/￥/g, "\\")
        .replace(/　/g, " ")
        .replace(/〜/g, "~");
}