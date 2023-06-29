const puppeteer = require("puppeteer");
const asyncHandler = require("express-async-handler");
const Xvfb = require("xvfb");

const joinClass = asyncHandler(async () => {
  try {
    //launching a browser
    var xvfb = new Xvfb({
      silent: true,
      xvfb_args: ["-screen", "0", "1280x720x24", "-ac"],
    });
    xvfb.start((err) => {
      if (err) console.error("error", err);
    });
    console.log("you are about to launch the browser");
    var browser = await puppeteer.launch({
      headless: false,

      defaultViewport: null, //otherwise it defaults to 800x600
      args: [
        "--no-sandbox",
        "--start-fullscreen",
        "--display=" + xvfb._display,
      ],
    });
    // const browser = await puppeteer.launch();
    // //creating a new page
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
    );

    //opening site to login
    await page.goto("https://myclass.lpu.in/", { waitUntil: "load" });
    await page.screenshot({
      path: "screenshot.jpg",
    });

    const inputElement = await page.$('input[name="i"]');

    await inputElement.click({ clickCount: 3 });
    const id = process.env.REGNO;
    // process.env.ACCESS_SECRET

    await inputElement.type(id);
    const inputElementP = await page.$('input[name="p"]');

    await inputElementP.click({ clickCount: 3 });
    const pass = process.env.PASSWORD;

    await inputElementP.type(pass);

    page.click(".ghost-round");
    await page.waitForNavigation();
    const newUrl = await page.url();
    console.log(newUrl);

    await page.goto(
      "https://lovelyprofessionaluniversity.codetantra.com/secure/tla/m.jsp",
      { waitUntil: "load" }
    );

    const elHandleArray = await page.$$(".fc-event-container");

    const fina = await elHandleArray[1];

    await fina.$$eval("a", async (anchors) => {
      console.log("time: ", new Date().toTimeString().split(" "));
      if (new Date().toTimeString().split(" ")[0] > "11") {
        console.log("second class join");
        anchors[1].click();
      } else {
        console.log("second class join");

        anchors[0].click();
      }
    });
    const classUrl = await page.url();
    const arr = classUrl.split("=")[2];
    const classUrlst = `https://lovelyprofessionaluniversity.codetantra.com/secure/tla/jnr.jsp?m=${arr}`;
    await page.goto(classUrlst, { waitUntil: "load" });

    console.log(await page.url());

    const elementHandle = await page.waitForSelector("div.row iframe");
    if (elementHandle) {
      const frame = await elementHandle.contentFrame();
      // await frame.waitForSelector(".custom-input__control");
      // const input = await frame.$(".custom-input__control");
      await frame.waitForSelector('button[aria-label="Listen only"]');

      // Click the button
      await frame.click('button[aria-label="Listen only"]');

      await page.screenshot({
        path: "screenshot2.jpg",
      });
    }
  } catch (error) {
    console.log(error.message);
    await browser.close();
    // console.log(error);
    // throw new Error("Something went wrong, please try again");
  }
});

module.exports = joinClass;
// joinClass();
