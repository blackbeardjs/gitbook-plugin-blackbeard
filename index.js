"use strict";

let configRefs = {};

const path   = require("path");

const utils  = require("./lib/utils");
const toc    = require("./lib/toc");

const levels = {
    "0": "red",
    "1": "gray",
    "2": "orange",
    "3": "green",
    "4": "blue"
};
const stabilities = {
    "0": "Deprecated",
    "1": "In development",
    "2": "Unstable",
    "3": "Stable",
    "4": "Stable (Locked)"
};

// (^#+)\s(.+)$
module.exports = {
    hooks: {
        init: function() {
            configRefs = this.options.pluginsConfig.references || {}
        },

        "page:before": function(page) {
            const frontpageLink = path.relative(path.dirname(page.path), ".");

            let content, references;

            // Generate table of contents
            content    = toc(page.content);
            references = content[1];
            content    = content[0];

            // Replace <!-- logo --> with a link to the frontpage
            content = content.replace(/<!--\slogo\s-->/gmi, () => {
                return `[Blackbeard.js](${frontpageLink})`;
            });

            // Replace text references to headlines and standard JS objects
            content = content.replace(/(^[^#|[\s\*].+)(.*)/gmi, ($0, $1, $2) => {
                return $1.replace(/([^\[.]|^)`([\w|\.]+)`/gmi, ($0, $1, $2) => {
                    const normalized = utils.normalize($2);

                    if (references[normalized]) {
                        return ` [\`${normalized}\`][]`;
                    }

                    return ` \`${normalized}\``;
                })
            });

            // Replace "stability box" comments
            content = content.replace(/<!--\sstability:(\d)\s(.*)\s?-->/gmi, ($0, $1, $2) => {
                let further = $2 || "";

                further = further.trim();
                further = further != "" ? `: ${further}` : "";

                return `<span class="stability-level boxed ${levels[$1]}">Stability: ${stabilities[$1]}${further}</span>`;
            });

            // Replace "stability level" comments
            content = content.replace(/<!--\sstability-level:(\d)\s-->/gmi, ($0, $1) => {
                return `<span class="stability-level ${levels[$1]}" title="${stabilities[$1]}"> </span>`;
            });

            // Replace "support" comments
            content = content.replace(/<!--\ssupport:(\d):(\d):(\d)\s-->/gmi, ($0, $1, $2, $3) => {
                return `<div class="support"><span class="badge ios ${levels[$1]}" title="${stabilities[$1]}"></span><span class="badge android ${levels[$2]}" title="${stabilities[$2]}"></span></div>`;
            });

            // Finally, add a reference list to the bottom
            content += "\n\n\n";

            for(let key in configRefs) {
                if (configRefs[key].indexOf("://")) {
                    references[key] = configRefs[key];
                } else {
                    references[key] = path.relative(path.dirname(page.path), path.dirname(configRefs[key]));
                    references[key] = path.join(references[key], path.basename(configRefs[key]));
                }
            }

            for(let key in references) {
                let link = references[key];
                    link = link.indexOf("/") !== -1 || link.indexOf(".html") !== -1 ? link : `#${link}`;

                content += `[\`${key}\`]: ${link} \r\n`;
            }

            page.content = content;

            return page;
        }
    }
};
