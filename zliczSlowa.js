const fs = require('fs');

function zliczSlowa(sciezkaSkryptu, postacie) {
    const skrypt = fs.readFileSync(sciezkaSkryptu, 'utf8');

    const linie = skrypt.split('\n');
    let liczbaSlowPostaci = {};
    let liczbaSlowCalkowita = 0;

    postacie.forEach((postac) => {
        liczbaSlowPostaci[postac] = 0;
    });

    let aktualnaKwestia = ''; 
    let aktualnePostacie = '';
    const regexCzasowkaKwestia = /^(\d+:\d{2}) ([\w/]+): (.+)$/;
    linie.forEach((linia) => {
        linia = linia.trim(); 
        const dopasowanie = linia.match(regexCzasowkaKwestia);

        if (dopasowanie) {
            if (aktualnaKwestia) {
                const czystyTekst = aktualnaKwestia.replace(/<reag>/g, '').replace(/\^/g, '').trim();
                liczbaSlowCalkowita += czystyTekst.split(/\s+/).filter(word => word).length;

                const listaPostaci = aktualnePostacie.split('/');
                listaPostaci.forEach((postac) => {
                    if (postacie.includes(postac)) {
                        liczbaSlowPostaci[postac] += czystyTekst.split(/\s+/).filter(word => word).length;
                    }
                });
            }

            const [, czasowka, postacieKwestii, tekst] = dopasowanie;
            aktualnaKwestia = tekst;
            aktualnePostacie = postacieKwestii;
        } else if (/^\d+:\d{2}/.test(linia)) {
            return;
        } else {
            aktualnaKwestia += ' ' + linia;
        }
    });

    if (aktualnaKwestia) {
        const czystyTekst = aktualnaKwestia.replace(/<reag>/g, '').replace(/\^/g, '').trim();
        liczbaSlowCalkowita += czystyTekst.split(/\s+/).filter(word => word).length;

        const listaPostaci = aktualnePostacie.split('/');
        listaPostaci.forEach((postac) => {
            if (postacie.includes(postac)) {
                liczbaSlowPostaci[postac] += czystyTekst.split(/\s+/).filter(word => word).length;
            }
        });
    }

    return {
        slowaPostaci: liczbaSlowPostaci,
        slowaCalkowita: liczbaSlowCalkowita,
    };
}

const sciezkaDoSkryptu = 'skrypt_filmu.txt';

const postacie = process.argv.slice(2);

if (postacie.length === 0) {
    console.error('Użycie: node zliczSlowa.js <postać1> [postać2] [postać3] ...');
    process.exit(1);
}

const wynik = zliczSlowa(sciezkaDoSkryptu, postacie);

postacie.forEach((postac) => {
    console.log(`Postać "${postac}" wypowiedziała ${wynik.slowaPostaci[postac] || 0} słów.`);
});
