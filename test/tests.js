const assert = require('assert');
const puppeteer = require('puppeteer');

let server;
let browser;

describe('The web application', () => {
  before(async () => {
    server = require('..');
  });

  after(async () => {
    await server.close();
  });

  beforeEach(async () => {
    browser = await puppeteer.launch({ headless: true });
  });

  afterEach(async () => {
    await browser.close();
  });

  it('should display a random dicton', async () => {
    let page = await browser.newPage();
    let previousContent = "";
    for (let i = 0; i < 10; i++) {
        await page.goto("http://localhost:3000/");
        let content = await page.content();
        assert.ok(content.includes("<q>"));
        assert.ok(content.includes("</q>"));
        assert.notEqual(previousContent, content)
        previousContent = content;
    }
  }).timeout(10000);

  it('should display a list of dictons', async () => {
    let page = await browser.newPage();
    await page.goto("http://localhost:3000/list");
    let content = await page.content();
    assert.ok(content.includes("<ul>"));
    assert.ok(content.includes("</ul>"));
    let count = (await page.$$('li')).length;
    assert.ok(count > 1000);
  }).timeout(10000);

  it('should display a form creating new dictons', async () => {
    let page = await browser.newPage();
    await page.goto("http://localhost:3000/create");
    let content = await page.content();
    assert.ok(content.includes("form"));
    assert.ok(content.includes("input"));
    assert.ok(content.includes("method"));
    assert.ok(content.includes("POST"));
    assert.ok(content.includes("type"));
    assert.ok(content.includes("text"));
    assert.ok(content.includes("name"));
    assert.ok(content.includes("button"));
  }).timeout(10000);

  it('should create a new dictons when the form is submitted', async () => {
    let page = await browser.newPage();
    await page.goto("http://localhost:3000/list");  
    let countBefore = (await page.$$('li')).length;
    await page.goto("http://localhost:3000/create");
    await page.click("button");
    await page.goto("http://localhost:3000/list");  
    let countAfter = (await page.$$('li')).length;
    assert.equal(countBefore + 1, countAfter);
  }).timeout(10000);

  it('should display dictons by id', async () => {
    let page = await browser.newPage();
    await page.goto("http://localhost:3000/1");  
    let content = await page.content();
    assert.ok(content.includes("à barque désespérée, Dieu fait trouver le port"));
    await page.goto("http://localhost:3000/2");  
    content = await page.content();
    assert.ok(content.includes("à beau jeu, beau ret"));
    await page.goto("http://localhost:3000/150");  
    content = await page.content();
    assert.ok(content.includes("avoir un cheveu sur la langue"));
  }).timeout(10000);

});