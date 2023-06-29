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
      // headless: false,

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

    await inputElement.type(id);
    const inputElementP = await page.$('input[name="p"]');

    await inputElementP.click({ clickCount: 3 });
    const pass = process.env.PASSWORD;

    await inputElementP.type(pass);

    page.click(".ghost-round");
    await page.waitForNavigation();
    const newUrl = await page.url();
    console.log(newUrl);
    if (newUrl) {
      console.log("login done");
    }

    await page.goto(
      "https://lovelyprofessionaluniversity.codetantra.com/secure/tla/m.jsp",
      { waitUntil: "load" }
    );
    // await page.waitForNavigation();
    const elHandleArray = await page.$$(".fc-event-container");

    const fina = await elHandleArray[1];

    const anchorTags = await fina.$$("a");

    console.log(anchorTags.length);

    if (anchorTags.length < 1) {
      throw new Error("there is no any class today");
    }

    //handling which clss have to join
    const hours = new Date().getHours();
    console.log(hours);
    var link;
    if (hours < 11) {
      const text = await page.evaluate(
        (element) => element.getAttribute("title"),
        anchorTags[0]
      );
      let to_join = text.includes("Sarabjit") ? true : false;
      if (to_join) {
        link = await page.evaluate(
          (element) => element.getAttribute("href"),
          anchorTags[1]
        );
        console.log(link);
        console.log("joined dsa classes not sarabjit in morning");
        await anchorTags[1].click();
      } else {
        link = await page.evaluate(
          (element) => element.getAttribute("href"),
          anchorTags[0]
        );
        console.log(link);
        console.log("joined dsa morning");
        await anchorTags[0].click();
      }
      // await anchorTags[0].click();
      // console.log("Clicked on the first link:", link);
    } else {
      if (anchorTags.length >= 3) {
        if (anchorTags.length == 3) {
          const text = await page.evaluate(
            (element) => element.getAttribute("title"),
            anchorTags[1]
          );
          let to_join = text.includes("Sarabjit") ? true : false;
          console.log(
            "have today 3 class",
            to_join
              ? "going to join evening dsa "
              : "in eveing no sarabjit so joining dsa class "
          );
          if (to_join) {
            link = await page.evaluate(
              (element) => element.getAttribute("href"),
              anchorTags[2]
            );
            console.log(link);
          } else {
            link = await page.evaluate(
              (element) => element.getAttribute("href"),
              anchorTags[1]
            );
            console.log(link);
          }

          to_join ? await anchorTags[2].click() : await anchorTags[1].click();
        } else {
          const text = await page.evaluate(
            (element) => element.getAttribute("title"),
            anchorTags[2]
          );
          let to_join = text.includes("Sarabjit") ? true : false;
          if (to_join) {
            link = await page.evaluate(
              (element) => element.getAttribute("href"),
              anchorTags[3]
            );
            console.log(link);
            console.log("joined dsa classes not sarabjit on evening");
            await anchorTags[3].click();
          } else {
            link = await page.evaluate(
              (element) => element.getAttribute("href"),
              anchorTags[1]
            );
            console.log(link);
            console.log("joined dsa evening");
            await anchorTags[1].click();
          }
        }
      } else {
        link = await page.evaluate(
          (element) => element.getAttribute("href"),
          anchorTags[1]
        );
        console.log(link);
        console.log("joined dsa evening have 2 classes max");
        await anchorTags[1].click();
      }
    }

    const arr = link.split("=")[2];
    const classUrlst = `https://lovelyprofessionaluniversity.codetantra.com/secure/tla/jnr.jsp?m=${arr}`;
    await page.goto(classUrlst, { waitUntil: "load" });

    console.log(await page.url());

    const elementHandle = await page.waitForSelector("div.row iframe");
    if (elementHandle) {
      throw new Error("might be class not stared");
    }
    const frame = await elementHandle.contentFrame();
    // await frame.waitForSelector(".custom-input__control");
    // const input = await frame.$(".custom-input__control");
    await frame.waitForSelector('button[aria-label="Listen only"]');

    // Click the button
    await frame.click('button[aria-label="Listen only"]');

    await page.screenshot({
      path: "screenshot2.jpg",
    });
  } catch (error) {
    // console.log(error.message);
    await browser.close();
    console.log(error.message);
    // throw new Error("Something went wrong, please try again");
  }
});

module.exports = joinClass;
// joinClass();
