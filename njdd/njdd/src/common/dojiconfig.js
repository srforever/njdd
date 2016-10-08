dojoConfig = {
    parseOnLoad: true,
    packages: [{
        name: 'bdlib',
        location: this.location.pathname.replace(/\/[^/]+$/, "") + "/../../src/common/tdtlib"
    }]
};
