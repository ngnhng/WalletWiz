module.exports = {
    extends: ["@commitlint/config-conventional"],
    parserPreset: {
        parserOpts: {
            headerPattern: /^(WWIZ-\d+)?\s*(\w*)(\((.*)\))?:\s*(.*)$/,
            headerCorrespondence: ["issue", "type", "scope", "subject"],
        },
    },
    rules: {
        "subject-empty": [2, "never"],
        "type-empty": [2, "never"],
        "subject-full-stop": [2, "never", "."],
        "subject-case": [2, "never", "start-case"],
    },
};
