const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	//

	const page = await browser.newPage();

	await page.goto('https://amazon.es/');
	// await page.waitForSelector('[id=sp-cc-accept]')
	await page.click('#sp-cc-accept');
	await page.type('#twotabsearchtextbox', 'libro de vue');
	await page.click('.nav-search-submit input');
	await page.waitForSelector('[data-component-type=s-search-result]');
	await page.waitForTimeout(2000);
	const enlaces = await page.evaluate(() => {
		const elements = document.querySelectorAll(
			'[data-component-type=s-search-result] h2 a'
		);

		const links = [];
		for (let k in elements) {
			links.push(elements[k].href);
		}
		return links.filter(el => el!=null);
	});
    console.log(enlaces);

	const libros = [];
	for (let enlace of enlaces) {
			await page.goto(enlace);
			await page.waitForSelector('#productTitle');

			const libro = await page.evaluate(() => {
				const tmp = {};
				tmp.title = document.querySelector('#productTitle').innerHTML;
				tmp.author = document.querySelector('.author a').innerText;
				return tmp;
			});
			libros.push(libro);
	}

	console.log(libros);

	await page.screenshot({ path: 'google1.jpg' });
	await browser.close();
})();
