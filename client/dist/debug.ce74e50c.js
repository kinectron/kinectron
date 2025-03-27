(() => {

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

      var $parcel$global = globalThis;
    var parcelRequire = $parcel$global["parcelRequire94c2"];
var parcelRegister = parcelRequire.register;
parcelRegister("kSHSU", function(module, exports) {

$parcel$export(module.exports, "DEBUG", () => $f33ae462b482966d$export$3f32c2013f0dcc1e);
/**
 * Debug configuration for Kinectron client
 * Controls logging output for different components
 */ const $f33ae462b482966d$export$3f32c2013f0dcc1e = {
    // Master switches for components
    RAW_DEPTH: false,
    // Specific logging categories
    PERFORMANCE: false,
    DATA: false,
    NETWORK: false,
    // Helper method to enable all logs
    enableAll: function() {
        Object.keys(this).forEach((key)=>{
            if (typeof this[key] === 'boolean') this[key] = true;
        });
    },
    // Helper method to disable all logs
    disableAll: function() {
        Object.keys(this).forEach((key)=>{
            if (typeof this[key] === 'boolean') this[key] = false;
        });
    }
};

});

})();
//# sourceMappingURL=debug.ce74e50c.js.map
