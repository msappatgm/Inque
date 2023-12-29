const transformContent = (content) => {
    // Replace 't.' with 'browser.' This still needs work
    //content = content.replace(/t\./g, 'browser.');

    // Replace Selector('selector') with $('selector')
    content = content.replace(/Selector\((.*?)\)/g, "$('$1')");

    // Replace fixture with 'describe'
    content = content.replace(/fixture\s*`([^`]*)`/g, "describe('$1',");

    // Replace test.meta with 'it' (if there's a specific pattern for test.meta, add it here)
    // Note: This is a generic replacement, you may need to adjust it based on your actual usage of test.meta
    content = content.replace(/test\.meta\((.*?)\)/g, "it($1)");
    return content;
};

module.exports = {
    transformContent
};
