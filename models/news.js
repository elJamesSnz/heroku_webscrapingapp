//traer dependencia cheerio
const cheerio = require("cheerio");
//traer dependencia de request-promise
const request = require("request-promise");

const express = require("express");
const NewsModel = require("../db/db");
const CategoriesModel = require("../db/category");
const News = {};

let final_links = {
  enlaces: [],
};

String.prototype.cleanup = function () {
  return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
};

News.create = async (news_model) => {
  var Model = new NewsModel();
  Model.author = news_model.author;
  Model.title = news_model.title;
  Model.subtitle = news_model.subtitle;
  Model.intro = news_model.intro || "";
  Model.sections = news_model.sections;
  Model.uri = news_model.uri;
  Model.img = news_model.img;
  Model.post = news_model.title.cleanup();

  //console.log(Model);

  Model.save((err, data) => {
    if (err) {
      console.error(err);
    } else {
      return data;
    }
  });
};

News.getBitNewsByUri = async ($, URLi) => {
  let news_model = {
    author: undefined,
    title: undefined,
    subtitle: undefined,
    intro: undefined,
    sections: [],
    uri: "",
    img: "",
  };

  const article = $("article").each((i, el) => {
    news_model.author = $(el).find(".pw-author a.au").text();
    news_model.title = $(el).find("h1.pw-post-title").text();
    news_model.subtitle = $(el).find("strong.kh").first().text();
    news_model.uri = URLi;

    //console.log($(".jb").siblings("p.ki.kj")..text());

    let intro_text = "";

    //const img = $(el).find(".wp-block-image").children("img").eq(0).attr("src");
    //news_model.img = img;

    const intro2 = $(".jb")
      .find("figure")
      .first()
      .each((i, el) => {
        intro_text += $(el).nextUntil("h1").text() + "\n";
        news_model.intro = intro_text;
      });

    let texts = $("h1")
      .map((i, el) => {
        if (i != 0) {
          let news_sections = {
            sec_title: "",
            text: "",
          };
          let text = "";
          el = $(el);
          news_sections.sec_title = $(el).text();
          while ((el = el.next())) {
            if (el.length === 0 || el.prop("tagName") === "H1") break;
            text += el.text() + "\n";
          }
          news_sections.text = text;
          //console.log(i, text);
          if (news_sections.text.length > 0) {
            news_model.sections.push(news_sections);
          }
        }
      })
      .get();

    //otro intento de scraping
    if (
      !news_model.intro ||
      news_model.intro == "" ||
      !news_model.title ||
      news_model.title == "" ||
      !news_model.subtitle ||
      news_model.subtitle == "" ||
      !news_model.intro ||
      news_model.intro == ""
    ) {
      const article = $("article");
      news_model.author = $(article)
        .find("span.meta-info-el.meta-info-author")
        .children("a")
        .text();
      news_model.title = $(article).find("h1.single-title.entry-title").text();
      news_model.subtitle = $(article).find("span.h3").first().text();
    }

    //otro intento (2) de scraping

    if (
      !news_model.subtitle ||
      news_model.subtitle == "" ||
      news_model.sections.length == 0 ||
      !news_model.img ||
      news_model.img == ""
    ) {
      const article = $("article");
      const img = $(article).find(".wp-post-image").eq(0).attr("src");
      news_model.img = img;

      news_model.author = $(article)
        .find("span.meta-info-el")
        .children("a")
        .text();
      news_model.title = $(article).find("h1.single-title").text();
      const sub = $(article).find(".entry-content").children("h2").eq(0).text();
      news_model.subtitle = sub;

      let texts = $("h3")
        .map((i, el) => {
          if (i != 0) {
            let news_sections = {
              sec_title: "",
              text: "",
            };
            let text = "";
            el = $(el);

            if ($(el).text() != " Cancel reply") {
              news_sections.sec_title = $(el).text();
              while ((el = el.next())) {
                if (el.length === 0 || el.prop("tagName") === "H1") break;
                text += el.text() + "\n";
              }
              news_sections.text = text;
              //console.log(i, text);
              if (news_sections.text.length > 0) {
                news_model.sections.push(news_sections);
              }
            }
          }
        })
        .get();

      //otro intento (3) de scraping

      if (news_model.sections.length == 0) {
        let texts = $("h2")
          .map((i, el) => {
            if (i != 0) {
              let news_sections = {
                sec_title: "",
                text: "",
              };
              let text = "";
              el = $(el);

              if ($(el).text() != " Cancel reply") {
                news_sections.sec_title = $(el).text();
                while ((el = el.next())) {
                  if (el.length === 0 || el.prop("tagName") === "strong") break;
                  text += el.text() + "\n";
                }
                news_sections.text = text;
                //console.log(i, text);
                if (news_sections.text.length > 0) {
                  news_model.sections.push(news_sections);
                }
              }
            }
          })
          .get();
      }

      //otro intento (4) de scraping, DOGE
      if (news_model.sections.length == 0) {
        let texts = $("p")
          .map((i, el) => {
            if (i != 0 && i < 2) {
              let news_sections = {
                sec_title: "",
                text: "",
              };
              let text = "";
              el = $(el);

              if ($(el).text() != " Cancel reply") {
                //news_sections.sec_title = $(el).text();
                text = $(el).text();
                while ((el = el.next())) {
                  if (el.length === 0 || el.prop("tagName") === "strong") break;
                  text += el.text() + "\n";
                }
                news_sections.text = text;
                //console.log(i, text);
                if (news_sections.text.length > 0) {
                  news_model.sections.push(news_sections);
                }
              }
            }
          })
          .get();
      }
    }
  });
  News.create(news_model);
};

News.exists = async (news_model) => {
  var Model = new NewsModel();

  news_model.links.forEach(async (link) => {
    Model.title = link.enlace;
    var enlace = link.enlace;
    //const data = await Model.exists({ title: link.titulo });
    await NewsModel.exists(
      { title: link.titulo },
      async function (err, result) {
        if (!result) {
          console.log(enlace);
          final_links.enlaces.push(enlace);

          const $ = await request({
            uri: enlace,
            //transformar datos que se pasa a cheerio enviando el body
            transform: (body) => cheerio.load(body),
          });

          News.getBitNewsByUri($, enlace);
        } else {
          console.log("Noticia " + news_model.links.title + " duplicada");
          if (err) {
            throw "Error al buscar las noticias {exists}";
          }
        }
      }
    );
  });
};

News.getBitsoLinks = async ($) => {
  let linksAdded = [];

  let news_links = {
    links: [],
  };

  const article2 = $("a h3").each((i, el) => {
    let links_model = {
      titulo: "",
      enlace: "",
    };

    const link = $(el).parent().attr("href");
    const titulo = $(el).text();

    if (!linksAdded.includes(link)) {
      linksAdded.push(link);
      links_model.titulo = titulo;
      links_model.enlace = link;
      news_links.links.push(links_model);
    }
  });

  if (news_links.links.length == 0) {
    let linksAdded = [];
    const article2 = $("a.p-url").each((i, el) => {
      let links_model = {
        titulo: "",
        enlace: "",
      };

      const link = $(el).attr("href");
      const titulo = $(el).text();

      if (!linksAdded.includes(link)) {
        linksAdded.push(link);
        links_model.titulo = titulo;
        links_model.enlace = link;
        news_links.links.push(links_model);
      }
    });
  }

  // return news_links.links;
  await News.exists(news_links);
};

News.getAll = async () => {
  const data = await NewsModel.find({}).exec();
  return data;
};

News.getCategories = async () => {
  const data = await CategoriesModel.find({}).exec();
  return data;
};

News.getNewsByPostUri = async (news_post) => {
  const data = NewsModel.find({ post: `${news_post}` }).exec();

  return data;
};

//objeto para el controlador
module.exports = News;
