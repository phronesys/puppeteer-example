const puppeteer = require('puppeteer');

async function scrape(url, xpath, type) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [element] = await page.$x(xpath); /* get element using xpath */
  const scrapped = await element.getProperty(type); /* get property from the element */
  let content = await scrapped.jsonValue();
  if (type === 'textContent') content = content.trim();

  browser.close(); /* end puppeteer instance */
  return content;
}

async function resolvePromise(promise) {
  return await Promise.resolve(promise)
    .then(data => data)
    .catch(error => console.log(error));
}

const url = 'https://www.amazon.com/-/es/Chromebook-pantalla-procesador-81JW0000US-empresarial/dp/B07GLV1VC7/?_encoding=UTF8&pd_rd_w=VOmE4&pf_rd_p=fc14f148-253a-4e8d-95cd-c94956af94ff&pf_rd_r=31F6MD93Z3R9NHYJBGK6&pd_rd_r=3d0e4599-ae66-4e8b-bb1e-667d5d8a77b3&pd_rd_wg=FJXSM&ref_=pd_gw_cr_wsim';
const titleXPath = '//*[@id="productTitle"]'; /* xpath copied from elements using developer tools */
const imageXPath = '//*[@id="landingImage"]';
const priceXPath = '//*[@id="price_inside_buybox"]';


const productTitle = scrape(url, titleXPath, 'textContent');
const productImage = scrape(url, imageXPath, 'src');
const productPrice = scrape(url, priceXPath, 'textContent');
const data = {
  title: resolvePromise(productTitle),
  image: resolvePromise(productImage),
  price: resolvePromise(productPrice)
}

Object.entries(data).forEach(([key, value]) => {
  value.then(val => console.log(key, val))
})

