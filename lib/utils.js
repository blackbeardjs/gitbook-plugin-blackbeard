"use strict";

const slugify = require("slug");

module.exports = exports = {
    normalize: input => {
        let result = input.replace("Class: ", "").replace(/[`]/gmi, "");

        let position = result.indexOf("(");
        let suffix   = "";

        if (position === -1) position = result.length;

        return result.substr(0, position);
    },

    slugify: input => {
        let result = slugify(input.replace(/[.|_|\[|\]|,|\)|\(|`]/g, "-"), {
            replacement:  "-",
            symbols:      true,
            replace:      /^$/,
            lower:        true,
            charmap:      slugify.charmap,
            multicharmap: slugify.multicharmap
        }).replace(/--+/g, "-").replace(/-$/g, "").replace(/^-/g, "");

        const chunks = [];

        result = result.split("-");
        result = result.filter(chunk => {
            if (chunks.indexOf(chunk) !== -1) {
                return false;
            }

            chunks.push(chunk);

            return true;
        });

        return result.join("-");
    }
}
