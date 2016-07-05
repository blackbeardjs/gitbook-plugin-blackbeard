"use strict";

const defaultReferences = require("./references");
const utils  = require("./utils");

const marked = require("marked");

/**
 * Generates a table of contents for Markdown files
 * @param  {[type]} input [description]
 * @return {[type]}       [description]
 */
module.exports = exports = function(input) {
    const references      = JSON.parse(JSON.stringify(defaultReferences));
    const tableOfContents = [];
    const headlines  = {
        "#":      "h1",
        "##":     "h2",
        "###":    "h3",
        "####":   "h4",
        "#####":  "h5",
        "######": "h6"
    };

    let tableLevels = [], markdown = input;

    markdown = markdown.replace(/(^#+)\s(.+)$/gmi, ($0, $1, $2) => {
        let header;

        if ((header = headlines[$1]) !== undefined) {
            if ($1.length > tableLevels.length) {
                tableLevels.push($2);
            } else if ($1.length < tableLevels.length) {
                tableLevels.pop();
            }

            const slug = utils.slugify(tableLevels.slice(1, tableLevels.length - 1).join(" ") + " " + $2);

            tableOfContents.push({
                level: $1.length - 1,
                slug:  slug,
                title: $2.trim()
            });

            references[utils.normalize($2)] = slug;

            return `<${header} id="${slug}">${marked($2)}</${header}>\n`;
        }

        return `${$1} ${$2}\n`;
    });

    markdown = markdown.replace("<!-- toc -->", ($0, $1) => {
        let result = "";

        for(let entry of tableOfContents) {
            let line = "";

            for(let i = 1; i <= entry.level; i++) {
                line += "  ";
            }

            line   += `* [${entry.title}](#${entry.slug})\n`;
            result += line;
        }

        return result;
    });

    return [markdown, references];
};
