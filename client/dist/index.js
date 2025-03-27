(() => {

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

      var $parcel$global = globalThis;
    
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire94c2"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire94c2"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;
parcelRegister("i35iy", function(module, exports) {

$parcel$export(module.exports, "register", () => $d23c9df46dea4e30$export$6503ec6e8aabbaf, (v) => $d23c9df46dea4e30$export$6503ec6e8aabbaf = v);
$parcel$export(module.exports, "resolve", () => $d23c9df46dea4e30$export$f7ad0328861e2f03, (v) => $d23c9df46dea4e30$export$f7ad0328861e2f03 = v);
var $d23c9df46dea4e30$export$6503ec6e8aabbaf;
var $d23c9df46dea4e30$export$f7ad0328861e2f03;
"use strict";
var $d23c9df46dea4e30$var$mapping = new Map();
function $d23c9df46dea4e30$var$register(baseUrl, manifest) {
    for(var i = 0; i < manifest.length - 1; i += 2)$d23c9df46dea4e30$var$mapping.set(manifest[i], {
        baseUrl: baseUrl,
        path: manifest[i + 1]
    });
}
function $d23c9df46dea4e30$var$resolve(id) {
    var resolved = $d23c9df46dea4e30$var$mapping.get(id);
    if (resolved == null) throw new Error('Could not resolve bundle with id ' + id);
    return new URL(resolved.path, resolved.baseUrl).toString();
}
$d23c9df46dea4e30$export$6503ec6e8aabbaf = $d23c9df46dea4e30$var$register;
$d23c9df46dea4e30$export$f7ad0328861e2f03 = $d23c9df46dea4e30$var$resolve;

});

parcelRegister("jn4pO", function(module, exports) {

$parcel$export(module.exports, "getBundleURL", () => $e1a397194cf67d3d$export$bdfd709ae4826697, (v) => $e1a397194cf67d3d$export$bdfd709ae4826697 = v);
var $e1a397194cf67d3d$export$bdfd709ae4826697;
var $e1a397194cf67d3d$export$c9e73fbda7da57b6;
var $e1a397194cf67d3d$export$5a759dc7a1cfb72a;
"use strict";
var $e1a397194cf67d3d$var$bundleURL = {};
function $e1a397194cf67d3d$var$getBundleURLCached(id) {
    var value = $e1a397194cf67d3d$var$bundleURL[id];
    if (!value) {
        value = $e1a397194cf67d3d$var$getBundleURL();
        $e1a397194cf67d3d$var$bundleURL[id] = value;
    }
    return value;
}
function $e1a397194cf67d3d$var$getBundleURL() {
    try {
        throw new Error();
    } catch (err) {
        var matches = ('' + err.stack).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^)\n]+/g);
        if (matches) // The first two stack frames will be this function and getBundleURLCached.
        // Use the 3rd one, which will be a runtime in the original bundle.
        return $e1a397194cf67d3d$var$getBaseURL(matches[2]);
    }
    return '/';
}
function $e1a397194cf67d3d$var$getBaseURL(url) {
    return ('' + url).replace(/^((?:https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}
// TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.
function $e1a397194cf67d3d$var$getOrigin(url) {
    var matches = ('' + url).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^/]+/);
    if (!matches) throw new Error('Origin not found');
    return matches[0];
}
$e1a397194cf67d3d$export$bdfd709ae4826697 = $e1a397194cf67d3d$var$getBundleURLCached;
$e1a397194cf67d3d$export$c9e73fbda7da57b6 = $e1a397194cf67d3d$var$getBaseURL;
$e1a397194cf67d3d$export$5a759dc7a1cfb72a = $e1a397194cf67d3d$var$getOrigin;

});

parcelRegister("iZi0K", function(module, exports) {


module.exports = (parcelRequire("jHRVE"))((parcelRequire("i35iy")).resolve("jbhc8")).then(()=>parcelRequire('kSHSU'));

});
parcelRegister("jHRVE", function(module, exports) {
"use strict";

var $3nnn0 = parcelRequire("3nnn0");
module.exports = $3nnn0(function(bundle) {
    return new Promise(function(resolve, reject) {
        // Don't insert the same script twice (e.g. if it was already in the HTML)
        var existingScripts = document.getElementsByTagName('script');
        if ([].concat(existingScripts).some(function(script) {
            return script.src === bundle;
        })) {
            resolve();
            return;
        }
        var preloadLink = document.createElement('link');
        preloadLink.href = bundle;
        preloadLink.rel = 'preload';
        preloadLink.as = 'script';
        document.head.appendChild(preloadLink);
        var script = document.createElement('script');
        script.async = true;
        script.type = 'text/javascript';
        script.src = bundle;
        script.onerror = function(e) {
            var error = new TypeError("Failed to fetch dynamically imported module: ".concat(bundle, ". Error: ").concat(e.message));
            script.onerror = script.onload = null;
            script.remove();
            reject(error);
        };
        script.onload = function() {
            script.onerror = script.onload = null;
            resolve();
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    });
});

});
parcelRegister("3nnn0", function(module, exports) {
"use strict";
var $2755a5e882c2aac1$var$cachedBundles = {};
var $2755a5e882c2aac1$var$cachedPreloads = {};
var $2755a5e882c2aac1$var$cachedPrefetches = {};
function $2755a5e882c2aac1$var$getCache(type) {
    switch(type){
        case 'preload':
            return $2755a5e882c2aac1$var$cachedPreloads;
        case 'prefetch':
            return $2755a5e882c2aac1$var$cachedPrefetches;
        default:
            return $2755a5e882c2aac1$var$cachedBundles;
    }
}
module.exports = function(loader, type) {
    return function(bundle) {
        var cache = $2755a5e882c2aac1$var$getCache(type);
        if (cache[bundle]) return cache[bundle];
        return cache[bundle] = loader.apply(null, arguments).catch(function(e) {
            delete cache[bundle];
            throw e;
        });
    };
};

});



var $b5b764c851158610$exports = {};


(parcelRequire("i35iy")).register((parcelRequire("jn4pO")).getBundleURL('66wtG'), JSON.parse("[\"66wtG\",\"index.js\",\"jbhc8\",\"debug.ce74e50c.js\"]"));

/**
 * @fileoverview Main entry point for the Kinectron client library
 * @version 0.3.9
 */ class $3f935fb176e3a62a$var$$e8379818650e2442$export$93654d4f2d6cd524 {
    constructor(){
        this.encoder = new TextEncoder();
        this._pieces = [];
        this._parts = [];
    }
    append_buffer(data) {
        this.flush();
        this._parts.push(data);
    }
    append(data) {
        this._pieces.push(data);
    }
    flush() {
        if (this._pieces.length > 0) {
            const buf = new Uint8Array(this._pieces);
            this._parts.push(buf);
            this._pieces = [];
        }
    }
    toArrayBuffer() {
        const buffer = [];
        for (const part of this._parts)buffer.push(part);
        return $3f935fb176e3a62a$var$$e8379818650e2442$var$concatArrayBuffers(buffer).buffer;
    }
}
function $3f935fb176e3a62a$var$$e8379818650e2442$var$concatArrayBuffers(bufs) {
    let size = 0;
    for (const buf of bufs)size += buf.byteLength;
    const result = new Uint8Array(size);
    let offset = 0;
    for (const buf of bufs){
        const view = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
        result.set(view, offset);
        offset += buf.byteLength;
    }
    return result;
}
function $3f935fb176e3a62a$export$417857010dc9287f(data) {
    const unpacker = new $3f935fb176e3a62a$var$$0cfd7828ad59115f$var$Unpacker(data);
    return unpacker.unpack();
}
function $3f935fb176e3a62a$export$2a703dbb0cb35339(data) {
    const packer = new $3f935fb176e3a62a$export$b9ec4b114aa40074();
    const res = packer.pack(data);
    if (res instanceof Promise) return res.then(()=>packer.getBuffer());
    return packer.getBuffer();
}
class $3f935fb176e3a62a$var$$0cfd7828ad59115f$var$Unpacker {
    constructor(data){
        this.index = 0;
        this.dataBuffer = data;
        this.dataView = new Uint8Array(this.dataBuffer);
        this.length = this.dataBuffer.byteLength;
    }
    unpack() {
        const type = this.unpack_uint8();
        if (type < 0x80) return type;
        else if ((type ^ 0xe0) < 0x20) return (type ^ 0xe0) - 0x20;
        let size;
        if ((size = type ^ 0xa0) <= 0x0f) return this.unpack_raw(size);
        else if ((size = type ^ 0xb0) <= 0x0f) return this.unpack_string(size);
        else if ((size = type ^ 0x90) <= 0x0f) return this.unpack_array(size);
        else if ((size = type ^ 0x80) <= 0x0f) return this.unpack_map(size);
        switch(type){
            case 0xc0:
                return null;
            case 0xc1:
                return undefined;
            case 0xc2:
                return false;
            case 0xc3:
                return true;
            case 0xca:
                return this.unpack_float();
            case 0xcb:
                return this.unpack_double();
            case 0xcc:
                return this.unpack_uint8();
            case 0xcd:
                return this.unpack_uint16();
            case 0xce:
                return this.unpack_uint32();
            case 0xcf:
                return this.unpack_uint64();
            case 0xd0:
                return this.unpack_int8();
            case 0xd1:
                return this.unpack_int16();
            case 0xd2:
                return this.unpack_int32();
            case 0xd3:
                return this.unpack_int64();
            case 0xd4:
                return undefined;
            case 0xd5:
                return undefined;
            case 0xd6:
                return undefined;
            case 0xd7:
                return undefined;
            case 0xd8:
                size = this.unpack_uint16();
                return this.unpack_string(size);
            case 0xd9:
                size = this.unpack_uint32();
                return this.unpack_string(size);
            case 0xda:
                size = this.unpack_uint16();
                return this.unpack_raw(size);
            case 0xdb:
                size = this.unpack_uint32();
                return this.unpack_raw(size);
            case 0xdc:
                size = this.unpack_uint16();
                return this.unpack_array(size);
            case 0xdd:
                size = this.unpack_uint32();
                return this.unpack_array(size);
            case 0xde:
                size = this.unpack_uint16();
                return this.unpack_map(size);
            case 0xdf:
                size = this.unpack_uint32();
                return this.unpack_map(size);
        }
    }
    unpack_uint8() {
        const byte = this.dataView[this.index] & 0xff;
        this.index++;
        return byte;
    }
    unpack_uint16() {
        const bytes = this.read(2);
        const uint16 = (bytes[0] & 0xff) * 256 + (bytes[1] & 0xff);
        this.index += 2;
        return uint16;
    }
    unpack_uint32() {
        const bytes = this.read(4);
        const uint32 = ((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3];
        this.index += 4;
        return uint32;
    }
    unpack_uint64() {
        const bytes = this.read(8);
        const uint64 = ((((((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3]) * 256 + bytes[4]) * 256 + bytes[5]) * 256 + bytes[6]) * 256 + bytes[7];
        this.index += 8;
        return uint64;
    }
    unpack_int8() {
        const uint8 = this.unpack_uint8();
        return uint8 < 0x80 ? uint8 : uint8 - 256;
    }
    unpack_int16() {
        const uint16 = this.unpack_uint16();
        return uint16 < 0x8000 ? uint16 : uint16 - 65536;
    }
    unpack_int32() {
        const uint32 = this.unpack_uint32();
        return uint32 < 2 ** 31 ? uint32 : uint32 - 2 ** 32;
    }
    unpack_int64() {
        const uint64 = this.unpack_uint64();
        return uint64 < 2 ** 63 ? uint64 : uint64 - 2 ** 64;
    }
    unpack_raw(size) {
        if (this.length < this.index + size) throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${size} ${this.length}`);
        const buf = this.dataBuffer.slice(this.index, this.index + size);
        this.index += size;
        return buf;
    }
    unpack_string(size) {
        const bytes = this.read(size);
        let i = 0;
        let str = "";
        let c;
        let code;
        while(i < size){
            c = bytes[i];
            // The length of a UTF-8 sequence is specified in the first byte:
            // 0xxxxxxx means length 1,
            // 110xxxxx means length 2,
            // 1110xxxx means length 3,
            // 11110xxx means length 4.
            // 10xxxxxx is for non-initial bytes.
            if (c < 0xa0) {
                // One-byte sequence: bits 0xxxxxxx
                code = c;
                i++;
            } else if ((c ^ 0xc0) < 0x20) {
                // Two-byte sequence: bits 110xxxxx 10xxxxxx
                code = (c & 0x1f) << 6 | bytes[i + 1] & 0x3f;
                i += 2;
            } else if ((c ^ 0xe0) < 0x10) {
                // Three-byte sequence: bits 1110xxxx 10xxxxxx 10xxxxxx
                code = (c & 0x0f) << 12 | (bytes[i + 1] & 0x3f) << 6 | bytes[i + 2] & 0x3f;
                i += 3;
            } else {
                // Four-byte sequence: bits 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                code = (c & 0x07) << 18 | (bytes[i + 1] & 0x3f) << 12 | (bytes[i + 2] & 0x3f) << 6 | bytes[i + 3] & 0x3f;
                i += 4;
            }
            str += String.fromCodePoint(code);
        }
        this.index += size;
        return str;
    }
    unpack_array(size) {
        const objects = new Array(size);
        for(let i = 0; i < size; i++)objects[i] = this.unpack();
        return objects;
    }
    unpack_map(size) {
        const map = {};
        for(let i = 0; i < size; i++){
            const key = this.unpack();
            map[key] = this.unpack();
        }
        return map;
    }
    unpack_float() {
        const uint32 = this.unpack_uint32();
        const sign = uint32 >> 31;
        const exp = (uint32 >> 23 & 0xff) - 127;
        const fraction = uint32 & 0x7fffff | 0x800000;
        return (sign === 0 ? 1 : -1) * fraction * 2 ** (exp - 23);
    }
    unpack_double() {
        const h32 = this.unpack_uint32();
        const l32 = this.unpack_uint32();
        const sign = h32 >> 31;
        const exp = (h32 >> 20 & 0x7ff) - 1023;
        const hfrac = h32 & 0xfffff | 0x100000;
        const frac = hfrac * 2 ** (exp - 20) + l32 * 2 ** (exp - 52);
        return (sign === 0 ? 1 : -1) * frac;
    }
    read(length) {
        const j = this.index;
        if (j + length <= this.length) return this.dataView.subarray(j, j + length);
        else throw new Error("BinaryPackFailure: read index out of range");
    }
}
class $3f935fb176e3a62a$export$b9ec4b114aa40074 {
    getBuffer() {
        return this._bufferBuilder.toArrayBuffer();
    }
    pack(value) {
        if (typeof value === "string") this.pack_string(value);
        else if (typeof value === "number") {
            if (Math.floor(value) === value) this.pack_integer(value);
            else this.pack_double(value);
        } else if (typeof value === "boolean") {
            if (value === true) this._bufferBuilder.append(0xc3);
            else if (value === false) this._bufferBuilder.append(0xc2);
        } else if (value === undefined) this._bufferBuilder.append(0xc0);
        else if (typeof value === "object") {
            if (value === null) this._bufferBuilder.append(0xc0);
            else {
                const constructor = value.constructor;
                if (value instanceof Array) {
                    const res = this.pack_array(value);
                    if (res instanceof Promise) return res.then(()=>this._bufferBuilder.flush());
                } else if (value instanceof ArrayBuffer) this.pack_bin(new Uint8Array(value));
                else if ("BYTES_PER_ELEMENT" in value) {
                    const v = value;
                    this.pack_bin(new Uint8Array(v.buffer, v.byteOffset, v.byteLength));
                } else if (value instanceof Date) this.pack_string(value.toString());
                else if (value instanceof Blob) return value.arrayBuffer().then((buffer)=>{
                    this.pack_bin(new Uint8Array(buffer));
                    this._bufferBuilder.flush();
                });
                else if (constructor == Object || constructor.toString().startsWith("class")) {
                    const res = this.pack_object(value);
                    if (res instanceof Promise) return res.then(()=>this._bufferBuilder.flush());
                } else throw new Error(`Type "${constructor.toString()}" not yet supported`);
            }
        } else throw new Error(`Type "${typeof value}" not yet supported`);
        this._bufferBuilder.flush();
    }
    pack_bin(blob) {
        const length = blob.length;
        if (length <= 0x0f) this.pack_uint8(0xa0 + length);
        else if (length <= 0xffff) {
            this._bufferBuilder.append(0xda);
            this.pack_uint16(length);
        } else if (length <= 0xffffffff) {
            this._bufferBuilder.append(0xdb);
            this.pack_uint32(length);
        } else throw new Error("Invalid length");
        this._bufferBuilder.append_buffer(blob);
    }
    pack_string(str) {
        const encoded = this._textEncoder.encode(str);
        const length = encoded.length;
        if (length <= 0x0f) this.pack_uint8(0xb0 + length);
        else if (length <= 0xffff) {
            this._bufferBuilder.append(0xd8);
            this.pack_uint16(length);
        } else if (length <= 0xffffffff) {
            this._bufferBuilder.append(0xd9);
            this.pack_uint32(length);
        } else throw new Error("Invalid length");
        this._bufferBuilder.append_buffer(encoded);
    }
    pack_array(ary) {
        const length = ary.length;
        if (length <= 0x0f) this.pack_uint8(0x90 + length);
        else if (length <= 0xffff) {
            this._bufferBuilder.append(0xdc);
            this.pack_uint16(length);
        } else if (length <= 0xffffffff) {
            this._bufferBuilder.append(0xdd);
            this.pack_uint32(length);
        } else throw new Error("Invalid length");
        const packNext = (index)=>{
            if (index < length) {
                const res = this.pack(ary[index]);
                if (res instanceof Promise) return res.then(()=>packNext(index + 1));
                return packNext(index + 1);
            }
        };
        return packNext(0);
    }
    pack_integer(num) {
        if (num >= -32 && num <= 0x7f) this._bufferBuilder.append(num & 0xff);
        else if (num >= 0x00 && num <= 0xff) {
            this._bufferBuilder.append(0xcc);
            this.pack_uint8(num);
        } else if (num >= -128 && num <= 0x7f) {
            this._bufferBuilder.append(0xd0);
            this.pack_int8(num);
        } else if (num >= 0x0000 && num <= 0xffff) {
            this._bufferBuilder.append(0xcd);
            this.pack_uint16(num);
        } else if (num >= -32768 && num <= 0x7fff) {
            this._bufferBuilder.append(0xd1);
            this.pack_int16(num);
        } else if (num >= 0x00000000 && num <= 0xffffffff) {
            this._bufferBuilder.append(0xce);
            this.pack_uint32(num);
        } else if (num >= -2147483648 && num <= 0x7fffffff) {
            this._bufferBuilder.append(0xd2);
            this.pack_int32(num);
        } else if (num >= -9223372036854776000 && num <= 0x7fffffffffffffff) {
            this._bufferBuilder.append(0xd3);
            this.pack_int64(num);
        } else if (num >= 0x0000000000000000 && num <= 0xffffffffffffffff) {
            this._bufferBuilder.append(0xcf);
            this.pack_uint64(num);
        } else throw new Error("Invalid integer");
    }
    pack_double(num) {
        let sign = 0;
        if (num < 0) {
            sign = 1;
            num = -num;
        }
        const exp = Math.floor(Math.log(num) / Math.LN2);
        const frac0 = num / 2 ** exp - 1;
        const frac1 = Math.floor(frac0 * 2 ** 52);
        const b32 = 2 ** 32;
        const h32 = sign << 31 | exp + 1023 << 20 | frac1 / b32 & 0x0fffff;
        const l32 = frac1 % b32;
        this._bufferBuilder.append(0xcb);
        this.pack_int32(h32);
        this.pack_int32(l32);
    }
    pack_object(obj) {
        const keys = Object.keys(obj);
        const length = keys.length;
        if (length <= 0x0f) this.pack_uint8(0x80 + length);
        else if (length <= 0xffff) {
            this._bufferBuilder.append(0xde);
            this.pack_uint16(length);
        } else if (length <= 0xffffffff) {
            this._bufferBuilder.append(0xdf);
            this.pack_uint32(length);
        } else throw new Error("Invalid length");
        const packNext = (index)=>{
            if (index < keys.length) {
                const prop = keys[index];
                // eslint-disable-next-line no-prototype-builtins
                if (obj.hasOwnProperty(prop)) {
                    this.pack(prop);
                    const res = this.pack(obj[prop]);
                    if (res instanceof Promise) return res.then(()=>packNext(index + 1));
                }
                return packNext(index + 1);
            }
        };
        return packNext(0);
    }
    pack_uint8(num) {
        this._bufferBuilder.append(num);
    }
    pack_uint16(num) {
        this._bufferBuilder.append(num >> 8);
        this._bufferBuilder.append(num & 0xff);
    }
    pack_uint32(num) {
        const n = num & 0xffffffff;
        this._bufferBuilder.append((n & 0xff000000) >>> 24);
        this._bufferBuilder.append((n & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((n & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(n & 0x000000ff);
    }
    pack_uint64(num) {
        const high = num / 2 ** 32;
        const low = num % 2 ** 32;
        this._bufferBuilder.append((high & 0xff000000) >>> 24);
        this._bufferBuilder.append((high & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((high & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(high & 0x000000ff);
        this._bufferBuilder.append((low & 0xff000000) >>> 24);
        this._bufferBuilder.append((low & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((low & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(low & 0x000000ff);
    }
    pack_int8(num) {
        this._bufferBuilder.append(num & 0xff);
    }
    pack_int16(num) {
        this._bufferBuilder.append((num & 0xff00) >> 8);
        this._bufferBuilder.append(num & 0xff);
    }
    pack_int32(num) {
        this._bufferBuilder.append(num >>> 24 & 0xff);
        this._bufferBuilder.append((num & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((num & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(num & 0x000000ff);
    }
    pack_int64(num) {
        const high = Math.floor(num / 2 ** 32);
        const low = num % 2 ** 32;
        this._bufferBuilder.append((high & 0xff000000) >>> 24);
        this._bufferBuilder.append((high & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((high & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(high & 0x000000ff);
        this._bufferBuilder.append((low & 0xff000000) >>> 24);
        this._bufferBuilder.append((low & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((low & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(low & 0x000000ff);
    }
    constructor(){
        this._bufferBuilder = new $3f935fb176e3a62a$var$$e8379818650e2442$export$93654d4f2d6cd524();
        this._textEncoder = new TextEncoder();
    }
}


/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ /*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 'use strict';
let $b7dae01f7fd17da1$var$logDisabled_ = true;
let $b7dae01f7fd17da1$var$deprecationWarnings_ = true;
function $b7dae01f7fd17da1$export$e3c02be309be1f23(uastring, expr, pos) {
    const match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
}
function $b7dae01f7fd17da1$export$1f48841962b828b1(window1, eventNameToWrap, wrapper) {
    if (!window1.RTCPeerConnection) return;
    const proto = window1.RTCPeerConnection.prototype;
    const nativeAddEventListener = proto.addEventListener;
    proto.addEventListener = function(nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap) return nativeAddEventListener.apply(this, arguments);
        const wrappedCallback = (e)=>{
            const modifiedEvent = wrapper(e);
            if (modifiedEvent) {
                if (cb.handleEvent) cb.handleEvent(modifiedEvent);
                else cb(modifiedEvent);
            }
        };
        this._eventMap = this._eventMap || {};
        if (!this._eventMap[eventNameToWrap]) this._eventMap[eventNameToWrap] = new Map();
        this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
        return nativeAddEventListener.apply(this, [
            nativeEventName,
            wrappedCallback
        ]);
    };
    const nativeRemoveEventListener = proto.removeEventListener;
    proto.removeEventListener = function(nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) return nativeRemoveEventListener.apply(this, arguments);
        if (!this._eventMap[eventNameToWrap].has(cb)) return nativeRemoveEventListener.apply(this, arguments);
        const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
        this._eventMap[eventNameToWrap].delete(cb);
        if (this._eventMap[eventNameToWrap].size === 0) delete this._eventMap[eventNameToWrap];
        if (Object.keys(this._eventMap).length === 0) delete this._eventMap;
        return nativeRemoveEventListener.apply(this, [
            nativeEventName,
            unwrappedCb
        ]);
    };
    Object.defineProperty(proto, 'on' + eventNameToWrap, {
        get () {
            return this['_on' + eventNameToWrap];
        },
        set (cb) {
            if (this['_on' + eventNameToWrap]) {
                this.removeEventListener(eventNameToWrap, this['_on' + eventNameToWrap]);
                delete this['_on' + eventNameToWrap];
            }
            if (cb) this.addEventListener(eventNameToWrap, this['_on' + eventNameToWrap] = cb);
        },
        enumerable: true,
        configurable: true
    });
}
function $b7dae01f7fd17da1$export$afbfee8cc06fd3e4(bool) {
    if (typeof bool !== 'boolean') return new Error('Argument type: ' + typeof bool + '. Please use a boolean.');
    $b7dae01f7fd17da1$var$logDisabled_ = bool;
    return bool ? 'adapter.js logging disabled' : 'adapter.js logging enabled';
}
function $b7dae01f7fd17da1$export$51516be4b019e41e(bool) {
    if (typeof bool !== 'boolean') return new Error('Argument type: ' + typeof bool + '. Please use a boolean.');
    $b7dae01f7fd17da1$var$deprecationWarnings_ = !bool;
    return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
}
function $b7dae01f7fd17da1$export$bef1f36f5486a6a3() {
    if (typeof window === 'object') {
        if ($b7dae01f7fd17da1$var$logDisabled_) return;
        if (typeof console !== 'undefined' && typeof console.log === 'function') console.log.apply(console, arguments);
    }
}
function $b7dae01f7fd17da1$export$cdd73fc4100a6ef4(oldMethod, newMethod) {
    if (!$b7dae01f7fd17da1$var$deprecationWarnings_) return;
    console.warn(oldMethod + ' is deprecated, please use ' + newMethod + ' instead.');
}
function $b7dae01f7fd17da1$export$2d31490a0c05f094(window1) {
    // Returned result object.
    const result = {
        browser: null,
        version: null
    };
    // Fail early if it's not a browser
    if (typeof window1 === 'undefined' || !window1.navigator || !window1.navigator.userAgent) {
        result.browser = 'Not a browser.';
        return result;
    }
    const { navigator: navigator } = window1;
    if (navigator.mozGetUserMedia) {
        result.browser = 'firefox';
        result.version = $b7dae01f7fd17da1$export$e3c02be309be1f23(navigator.userAgent, /Firefox\/(\d+)\./, 1);
    } else if (navigator.webkitGetUserMedia || window1.isSecureContext === false && window1.webkitRTCPeerConnection) {
        // Chrome, Chromium, Webview, Opera.
        // Version matches Chrome/WebRTC version.
        // Chrome 74 removed webkitGetUserMedia on http as well so we need the
        // more complicated fallback to webkitRTCPeerConnection.
        result.browser = 'chrome';
        result.version = $b7dae01f7fd17da1$export$e3c02be309be1f23(navigator.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
    } else if (window1.RTCPeerConnection && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
        result.browser = 'safari';
        result.version = $b7dae01f7fd17da1$export$e3c02be309be1f23(navigator.userAgent, /AppleWebKit\/(\d+)\./, 1);
        result.supportsUnifiedPlan = window1.RTCRtpTransceiver && 'currentDirection' in window1.RTCRtpTransceiver.prototype;
    } else {
        result.browser = 'Not a supported browser.';
        return result;
    }
    return result;
}
/**
 * Checks if something is an object.
 *
 * @param {*} val The something you want to check.
 * @return true if val is an object, false otherwise.
 */ function $b7dae01f7fd17da1$var$isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
}
function $b7dae01f7fd17da1$export$15384eac40dc88c8(data) {
    if (!$b7dae01f7fd17da1$var$isObject(data)) return data;
    return Object.keys(data).reduce(function(accumulator, key) {
        const isObj = $b7dae01f7fd17da1$var$isObject(data[key]);
        const value = isObj ? $b7dae01f7fd17da1$export$15384eac40dc88c8(data[key]) : data[key];
        const isEmptyObject = isObj && !Object.keys(value).length;
        if (value === undefined || isEmptyObject) return accumulator;
        return Object.assign(accumulator, {
            [key]: value
        });
    }, {});
}
function $b7dae01f7fd17da1$export$571b373e75babb58(stats, base, resultSet) {
    if (!base || resultSet.has(base.id)) return;
    resultSet.set(base.id, base);
    Object.keys(base).forEach((name)=>{
        if (name.endsWith('Id')) $b7dae01f7fd17da1$export$571b373e75babb58(stats, stats.get(base[name]), resultSet);
        else if (name.endsWith('Ids')) base[name].forEach((id)=>{
            $b7dae01f7fd17da1$export$571b373e75babb58(stats, stats.get(id), resultSet);
        });
    });
}
function $b7dae01f7fd17da1$export$93439ffc3f787d51(result, track, outbound) {
    const streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
    const filteredResult = new Map();
    if (track === null) return filteredResult;
    const trackStats = [];
    result.forEach((value)=>{
        if (value.type === 'track' && value.trackIdentifier === track.id) trackStats.push(value);
    });
    trackStats.forEach((trackStat)=>{
        result.forEach((stats)=>{
            if (stats.type === streamStatsType && stats.trackId === trackStat.id) $b7dae01f7fd17da1$export$571b373e75babb58(result, stats, filteredResult);
        });
    });
    return filteredResult;
}


var $25c38b78ffb66cc0$exports = {};

$parcel$export($25c38b78ffb66cc0$exports, "shimMediaStream", () => $25c38b78ffb66cc0$export$33ee24e7a300bcd1);
$parcel$export($25c38b78ffb66cc0$exports, "shimOnTrack", () => $25c38b78ffb66cc0$export$f358708f68ab068);
$parcel$export($25c38b78ffb66cc0$exports, "shimGetSendersWithDtmf", () => $25c38b78ffb66cc0$export$a41a030a2842f5d6);
$parcel$export($25c38b78ffb66cc0$exports, "shimGetStats", () => $25c38b78ffb66cc0$export$90608323826f0b17);
$parcel$export($25c38b78ffb66cc0$exports, "shimSenderReceiverGetStats", () => $25c38b78ffb66cc0$export$f2f0f2338114eb4b);
$parcel$export($25c38b78ffb66cc0$exports, "shimAddTrackRemoveTrackWithNative", () => $25c38b78ffb66cc0$export$30e3cdd46f8d5100);
$parcel$export($25c38b78ffb66cc0$exports, "shimAddTrackRemoveTrack", () => $25c38b78ffb66cc0$export$9588259fcf4ebc91);
$parcel$export($25c38b78ffb66cc0$exports, "shimPeerConnection", () => $25c38b78ffb66cc0$export$852a08dda9a55ea7);
$parcel$export($25c38b78ffb66cc0$exports, "fixNegotiationNeeded", () => $25c38b78ffb66cc0$export$341293bbeaae37cb);
$parcel$export($25c38b78ffb66cc0$exports, "shimGetUserMedia", () => $8506e72a2302b805$export$1ed4910f4d37dc5e);
$parcel$export($25c38b78ffb66cc0$exports, "shimGetDisplayMedia", () => $95b4354991aca0bb$export$97270b87351d9c04);
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 
'use strict';
const $8506e72a2302b805$var$logging = $b7dae01f7fd17da1$export$bef1f36f5486a6a3;
function $8506e72a2302b805$export$1ed4910f4d37dc5e(window, browserDetails) {
    const navigator = window && window.navigator;
    if (!navigator.mediaDevices) return;
    const constraintsToChrome_ = function(c) {
        if (typeof c !== 'object' || c.mandatory || c.optional) return c;
        const cc = {};
        Object.keys(c).forEach((key)=>{
            if (key === 'require' || key === 'advanced' || key === 'mediaSource') return;
            const r = typeof c[key] === 'object' ? c[key] : {
                ideal: c[key]
            };
            if (r.exact !== undefined && typeof r.exact === 'number') r.min = r.max = r.exact;
            const oldname_ = function(prefix, name) {
                if (prefix) return prefix + name.charAt(0).toUpperCase() + name.slice(1);
                return name === 'deviceId' ? 'sourceId' : name;
            };
            if (r.ideal !== undefined) {
                cc.optional = cc.optional || [];
                let oc = {};
                if (typeof r.ideal === 'number') {
                    oc[oldname_('min', key)] = r.ideal;
                    cc.optional.push(oc);
                    oc = {};
                    oc[oldname_('max', key)] = r.ideal;
                    cc.optional.push(oc);
                } else {
                    oc[oldname_('', key)] = r.ideal;
                    cc.optional.push(oc);
                }
            }
            if (r.exact !== undefined && typeof r.exact !== 'number') {
                cc.mandatory = cc.mandatory || {};
                cc.mandatory[oldname_('', key)] = r.exact;
            } else [
                'min',
                'max'
            ].forEach((mix)=>{
                if (r[mix] !== undefined) {
                    cc.mandatory = cc.mandatory || {};
                    cc.mandatory[oldname_(mix, key)] = r[mix];
                }
            });
        });
        if (c.advanced) cc.optional = (cc.optional || []).concat(c.advanced);
        return cc;
    };
    const shimConstraints_ = function(constraints, func) {
        if (browserDetails.version >= 61) return func(constraints);
        constraints = JSON.parse(JSON.stringify(constraints));
        if (constraints && typeof constraints.audio === 'object') {
            const remap = function(obj, a, b) {
                if (a in obj && !(b in obj)) {
                    obj[b] = obj[a];
                    delete obj[a];
                }
            };
            constraints = JSON.parse(JSON.stringify(constraints));
            remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
            remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
            constraints.audio = constraintsToChrome_(constraints.audio);
        }
        if (constraints && typeof constraints.video === 'object') {
            // Shim facingMode for mobile & surface pro.
            let face = constraints.video.facingMode;
            face = face && (typeof face === 'object' ? face : {
                ideal: face
            });
            const getSupportedFacingModeLies = browserDetails.version < 66;
            if (face && (face.exact === 'user' || face.exact === 'environment' || face.ideal === 'user' || face.ideal === 'environment') && !(navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
                delete constraints.video.facingMode;
                let matches;
                if (face.exact === 'environment' || face.ideal === 'environment') matches = [
                    'back',
                    'rear'
                ];
                else if (face.exact === 'user' || face.ideal === 'user') matches = [
                    'front'
                ];
                if (matches) // Look for matches in label, or use last cam for back (typical).
                return navigator.mediaDevices.enumerateDevices().then((devices)=>{
                    devices = devices.filter((d)=>d.kind === 'videoinput');
                    let dev = devices.find((d)=>matches.some((match)=>d.label.toLowerCase().includes(match)));
                    if (!dev && devices.length && matches.includes('back')) dev = devices[devices.length - 1]; // more likely the back cam
                    if (dev) constraints.video.deviceId = face.exact ? {
                        exact: dev.deviceId
                    } : {
                        ideal: dev.deviceId
                    };
                    constraints.video = constraintsToChrome_(constraints.video);
                    $8506e72a2302b805$var$logging('chrome: ' + JSON.stringify(constraints));
                    return func(constraints);
                });
            }
            constraints.video = constraintsToChrome_(constraints.video);
        }
        $8506e72a2302b805$var$logging('chrome: ' + JSON.stringify(constraints));
        return func(constraints);
    };
    const shimError_ = function(e) {
        if (browserDetails.version >= 64) return e;
        return {
            name: ({
                PermissionDeniedError: 'NotAllowedError',
                PermissionDismissedError: 'NotAllowedError',
                InvalidStateError: 'NotAllowedError',
                DevicesNotFoundError: 'NotFoundError',
                ConstraintNotSatisfiedError: 'OverconstrainedError',
                TrackStartError: 'NotReadableError',
                MediaDeviceFailedDueToShutdown: 'NotAllowedError',
                MediaDeviceKillSwitchOn: 'NotAllowedError',
                TabCaptureError: 'AbortError',
                ScreenCaptureError: 'AbortError',
                DeviceCaptureError: 'AbortError'
            })[e.name] || e.name,
            message: e.message,
            constraint: e.constraint || e.constraintName,
            toString () {
                return this.name + (this.message && ': ') + this.message;
            }
        };
    };
    const getUserMedia_ = function(constraints, onSuccess, onError) {
        shimConstraints_(constraints, (c)=>{
            navigator.webkitGetUserMedia(c, onSuccess, (e)=>{
                if (onError) onError(shimError_(e));
            });
        });
    };
    navigator.getUserMedia = getUserMedia_.bind(navigator);
    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
    // function which returns a Promise, it does not accept spec-style
    // constraints.
    if (navigator.mediaDevices.getUserMedia) {
        const origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function(cs) {
            return shimConstraints_(cs, (c)=>origGetUserMedia(c).then((stream)=>{
                    if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
                        stream.getTracks().forEach((track)=>{
                            track.stop();
                        });
                        throw new DOMException('', 'NotFoundError');
                    }
                    return stream;
                }, (e)=>Promise.reject(shimError_(e))));
        };
    }
}


/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 'use strict';
function $95b4354991aca0bb$export$97270b87351d9c04(window, getSourceId) {
    if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) return;
    if (!window.navigator.mediaDevices) return;
    // getSourceId is a function that returns a promise resolving with
    // the sourceId of the screen/window/tab to be shared.
    if (typeof getSourceId !== 'function') {
        console.error("shimGetDisplayMedia: getSourceId argument is not a function");
        return;
    }
    window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
        return getSourceId(constraints).then((sourceId)=>{
            const widthSpecified = constraints.video && constraints.video.width;
            const heightSpecified = constraints.video && constraints.video.height;
            const frameRateSpecified = constraints.video && constraints.video.frameRate;
            constraints.video = {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    maxFrameRate: frameRateSpecified || 3
                }
            };
            if (widthSpecified) constraints.video.mandatory.maxWidth = widthSpecified;
            if (heightSpecified) constraints.video.mandatory.maxHeight = heightSpecified;
            return window.navigator.mediaDevices.getUserMedia(constraints);
        });
    };
}


'use strict';
function $25c38b78ffb66cc0$export$33ee24e7a300bcd1(window) {
    window.MediaStream = window.MediaStream || window.webkitMediaStream;
}
function $25c38b78ffb66cc0$export$f358708f68ab068(window) {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
            get () {
                return this._ontrack;
            },
            set (f) {
                if (this._ontrack) this.removeEventListener('track', this._ontrack);
                this.addEventListener('track', this._ontrack = f);
            },
            enumerable: true,
            configurable: true
        });
        const origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
            if (!this._ontrackpoly) {
                this._ontrackpoly = (e)=>{
                    // onaddstream does not fire when a track is added to an existing
                    // stream. But stream.onaddtrack is implemented so we use that.
                    e.stream.addEventListener('addtrack', (te)=>{
                        let receiver;
                        if (window.RTCPeerConnection.prototype.getReceivers) receiver = this.getReceivers().find((r)=>r.track && r.track.id === te.track.id);
                        else receiver = {
                            track: te.track
                        };
                        const event = new Event('track');
                        event.track = te.track;
                        event.receiver = receiver;
                        event.transceiver = {
                            receiver: receiver
                        };
                        event.streams = [
                            e.stream
                        ];
                        this.dispatchEvent(event);
                    });
                    e.stream.getTracks().forEach((track)=>{
                        let receiver;
                        if (window.RTCPeerConnection.prototype.getReceivers) receiver = this.getReceivers().find((r)=>r.track && r.track.id === track.id);
                        else receiver = {
                            track: track
                        };
                        const event = new Event('track');
                        event.track = track;
                        event.receiver = receiver;
                        event.transceiver = {
                            receiver: receiver
                        };
                        event.streams = [
                            e.stream
                        ];
                        this.dispatchEvent(event);
                    });
                };
                this.addEventListener('addstream', this._ontrackpoly);
            }
            return origSetRemoteDescription.apply(this, arguments);
        };
    } else // even if RTCRtpTransceiver is in window, it is only used and
    // emitted in unified-plan. Unfortunately this means we need
    // to unconditionally wrap the event.
    $b7dae01f7fd17da1$export$1f48841962b828b1(window, 'track', (e)=>{
        if (!e.transceiver) Object.defineProperty(e, 'transceiver', {
            value: {
                receiver: e.receiver
            }
        });
        return e;
    });
}
function $25c38b78ffb66cc0$export$a41a030a2842f5d6(window) {
    // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
    if (typeof window === 'object' && window.RTCPeerConnection && !('getSenders' in window.RTCPeerConnection.prototype) && 'createDTMFSender' in window.RTCPeerConnection.prototype) {
        const shimSenderWithDtmf = function(pc, track) {
            return {
                track: track,
                get dtmf () {
                    if (this._dtmf === undefined) {
                        if (track.kind === 'audio') this._dtmf = pc.createDTMFSender(track);
                        else this._dtmf = null;
                    }
                    return this._dtmf;
                },
                _pc: pc
            };
        };
        // augment addTrack when getSenders is not available.
        if (!window.RTCPeerConnection.prototype.getSenders) {
            window.RTCPeerConnection.prototype.getSenders = function getSenders() {
                this._senders = this._senders || [];
                return this._senders.slice(); // return a copy of the internal state.
            };
            const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
            window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
                let sender = origAddTrack.apply(this, arguments);
                if (!sender) {
                    sender = shimSenderWithDtmf(this, track);
                    this._senders.push(sender);
                }
                return sender;
            };
            const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
            window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
                origRemoveTrack.apply(this, arguments);
                const idx = this._senders.indexOf(sender);
                if (idx !== -1) this._senders.splice(idx, 1);
            };
        }
        const origAddStream = window.RTCPeerConnection.prototype.addStream;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
            this._senders = this._senders || [];
            origAddStream.apply(this, [
                stream
            ]);
            stream.getTracks().forEach((track)=>{
                this._senders.push(shimSenderWithDtmf(this, track));
            });
        };
        const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
        window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
            this._senders = this._senders || [];
            origRemoveStream.apply(this, [
                stream
            ]);
            stream.getTracks().forEach((track)=>{
                const sender = this._senders.find((s)=>s.track === track);
                if (sender) this._senders.splice(this._senders.indexOf(sender), 1);
            });
        };
    } else if (typeof window === 'object' && window.RTCPeerConnection && 'getSenders' in window.RTCPeerConnection.prototype && 'createDTMFSender' in window.RTCPeerConnection.prototype && window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
        const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            const senders = origGetSenders.apply(this, []);
            senders.forEach((sender)=>sender._pc = this);
            return senders;
        };
        Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
            get () {
                if (this._dtmf === undefined) {
                    if (this.track.kind === 'audio') this._dtmf = this._pc.createDTMFSender(this.track);
                    else this._dtmf = null;
                }
                return this._dtmf;
            }
        });
    }
}
function $25c38b78ffb66cc0$export$90608323826f0b17(window) {
    if (!window.RTCPeerConnection) return;
    const origGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function getStats() {
        const [selector, onSucc, onErr] = arguments;
        // If selector is a function then we are in the old style stats so just
        // pass back the original getStats format to avoid breaking old users.
        if (arguments.length > 0 && typeof selector === 'function') return origGetStats.apply(this, arguments);
        // When spec-style getStats is supported, return those when called with
        // either no arguments or the selector argument is null.
        if (origGetStats.length === 0 && (arguments.length === 0 || typeof selector !== 'function')) return origGetStats.apply(this, []);
        const fixChromeStats_ = function(response) {
            const standardReport = {};
            const reports = response.result();
            reports.forEach((report)=>{
                const standardStats = {
                    id: report.id,
                    timestamp: report.timestamp,
                    type: {
                        localcandidate: 'local-candidate',
                        remotecandidate: 'remote-candidate'
                    }[report.type] || report.type
                };
                report.names().forEach((name)=>{
                    standardStats[name] = report.stat(name);
                });
                standardReport[standardStats.id] = standardStats;
            });
            return standardReport;
        };
        // shim getStats with maplike support
        const makeMapStats = function(stats) {
            return new Map(Object.keys(stats).map((key)=>[
                    key,
                    stats[key]
                ]));
        };
        if (arguments.length >= 2) {
            const successCallbackWrapper_ = function(response) {
                onSucc(makeMapStats(fixChromeStats_(response)));
            };
            return origGetStats.apply(this, [
                successCallbackWrapper_,
                selector
            ]);
        }
        // promise-support
        return new Promise((resolve, reject)=>{
            origGetStats.apply(this, [
                function(response) {
                    resolve(makeMapStats(fixChromeStats_(response)));
                },
                reject
            ]);
        }).then(onSucc, onErr);
    };
}
function $25c38b78ffb66cc0$export$f2f0f2338114eb4b(window) {
    if (!(typeof window === 'object' && window.RTCPeerConnection && window.RTCRtpSender && window.RTCRtpReceiver)) return;
    // shim sender stats.
    if (!('getStats' in window.RTCRtpSender.prototype)) {
        const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        if (origGetSenders) window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            const senders = origGetSenders.apply(this, []);
            senders.forEach((sender)=>sender._pc = this);
            return senders;
        };
        const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        if (origAddTrack) window.RTCPeerConnection.prototype.addTrack = function addTrack() {
            const sender = origAddTrack.apply(this, arguments);
            sender._pc = this;
            return sender;
        };
        window.RTCRtpSender.prototype.getStats = function getStats() {
            const sender = this;
            return this._pc.getStats().then((result)=>/* Note: this will include stats of all senders that
         *   send a track with the same id as sender.track as
         *   it is not possible to identify the RTCRtpSender.
         */ $b7dae01f7fd17da1$export$93439ffc3f787d51(result, sender.track, true));
        };
    }
    // shim receiver stats.
    if (!('getStats' in window.RTCRtpReceiver.prototype)) {
        const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
        if (origGetReceivers) window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
            const receivers = origGetReceivers.apply(this, []);
            receivers.forEach((receiver)=>receiver._pc = this);
            return receivers;
        };
        $b7dae01f7fd17da1$export$1f48841962b828b1(window, 'track', (e)=>{
            e.receiver._pc = e.srcElement;
            return e;
        });
        window.RTCRtpReceiver.prototype.getStats = function getStats() {
            const receiver = this;
            return this._pc.getStats().then((result)=>$b7dae01f7fd17da1$export$93439ffc3f787d51(result, receiver.track, false));
        };
    }
    if (!('getStats' in window.RTCRtpSender.prototype && 'getStats' in window.RTCRtpReceiver.prototype)) return;
    // shim RTCPeerConnection.getStats(track).
    const origGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function getStats() {
        if (arguments.length > 0 && arguments[0] instanceof window.MediaStreamTrack) {
            const track = arguments[0];
            let sender;
            let receiver;
            let err;
            this.getSenders().forEach((s)=>{
                if (s.track === track) {
                    if (sender) err = true;
                    else sender = s;
                }
            });
            this.getReceivers().forEach((r)=>{
                if (r.track === track) {
                    if (receiver) err = true;
                    else receiver = r;
                }
                return r.track === track;
            });
            if (err || sender && receiver) return Promise.reject(new DOMException('There are more than one sender or receiver for the track.', 'InvalidAccessError'));
            else if (sender) return sender.getStats();
            else if (receiver) return receiver.getStats();
            return Promise.reject(new DOMException('There is no sender or receiver for the track.', 'InvalidAccessError'));
        }
        return origGetStats.apply(this, arguments);
    };
}
function $25c38b78ffb66cc0$export$30e3cdd46f8d5100(window) {
    // shim addTrack/removeTrack with native variants in order to make
    // the interactions with legacy getLocalStreams behave as in other browsers.
    // Keeps a mapping stream.id => [stream, rtpsenders...]
    window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        return Object.keys(this._shimmedLocalStreams).map((streamId)=>this._shimmedLocalStreams[streamId][0]);
    };
    const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        if (!stream) return origAddTrack.apply(this, arguments);
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        const sender = origAddTrack.apply(this, arguments);
        if (!this._shimmedLocalStreams[stream.id]) this._shimmedLocalStreams[stream.id] = [
            stream,
            sender
        ];
        else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) this._shimmedLocalStreams[stream.id].push(sender);
        return sender;
    };
    const origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        stream.getTracks().forEach((track)=>{
            const alreadyExists = this.getSenders().find((s)=>s.track === track);
            if (alreadyExists) throw new DOMException('Track already exists.', 'InvalidAccessError');
        });
        const existingSenders = this.getSenders();
        origAddStream.apply(this, arguments);
        const newSenders = this.getSenders().filter((newSender)=>existingSenders.indexOf(newSender) === -1);
        this._shimmedLocalStreams[stream.id] = [
            stream
        ].concat(newSenders);
    };
    const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        delete this._shimmedLocalStreams[stream.id];
        return origRemoveStream.apply(this, arguments);
    };
    const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
    window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        if (sender) Object.keys(this._shimmedLocalStreams).forEach((streamId)=>{
            const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
            if (idx !== -1) this._shimmedLocalStreams[streamId].splice(idx, 1);
            if (this._shimmedLocalStreams[streamId].length === 1) delete this._shimmedLocalStreams[streamId];
        });
        return origRemoveTrack.apply(this, arguments);
    };
}
function $25c38b78ffb66cc0$export$9588259fcf4ebc91(window, browserDetails) {
    if (!window.RTCPeerConnection) return;
    // shim addTrack and removeTrack.
    if (window.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) return $25c38b78ffb66cc0$export$30e3cdd46f8d5100(window);
    // also shim pc.getLocalStreams when addTrack is shimmed
    // to return the original streams.
    const origGetLocalStreams = window.RTCPeerConnection.prototype.getLocalStreams;
    window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        const nativeStreams = origGetLocalStreams.apply(this);
        this._reverseStreams = this._reverseStreams || {};
        return nativeStreams.map((stream)=>this._reverseStreams[stream.id]);
    };
    const origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        stream.getTracks().forEach((track)=>{
            const alreadyExists = this.getSenders().find((s)=>s.track === track);
            if (alreadyExists) throw new DOMException('Track already exists.', 'InvalidAccessError');
        });
        // Add identity mapping for consistency with addTrack.
        // Unless this is being used with a stream from addTrack.
        if (!this._reverseStreams[stream.id]) {
            const newStream = new window.MediaStream(stream.getTracks());
            this._streams[stream.id] = newStream;
            this._reverseStreams[newStream.id] = stream;
            stream = newStream;
        }
        origAddStream.apply(this, [
            stream
        ]);
    };
    const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        origRemoveStream.apply(this, [
            this._streams[stream.id] || stream
        ]);
        delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
        delete this._streams[stream.id];
    };
    window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        if (this.signalingState === 'closed') throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
        const streams = [].slice.call(arguments, 1);
        if (streams.length !== 1 || !streams[0].getTracks().find((t)=>t === track)) // this is not fully correct but all we can manage without
        // [[associated MediaStreams]] internal slot.
        throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", 'NotSupportedError');
        const alreadyExists = this.getSenders().find((s)=>s.track === track);
        if (alreadyExists) throw new DOMException('Track already exists.', 'InvalidAccessError');
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        const oldStream = this._streams[stream.id];
        if (oldStream) {
            // this is using odd Chrome behaviour, use with caution:
            // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
            // Note: we rely on the high-level addTrack/dtmf shim to
            // create the sender with a dtmf sender.
            oldStream.addTrack(track);
            // Trigger ONN async.
            Promise.resolve().then(()=>{
                this.dispatchEvent(new Event('negotiationneeded'));
            });
        } else {
            const newStream = new window.MediaStream([
                track
            ]);
            this._streams[stream.id] = newStream;
            this._reverseStreams[newStream.id] = stream;
            this.addStream(newStream);
        }
        return this.getSenders().find((s)=>s.track === track);
    };
    // replace the internal stream id with the external one and
    // vice versa.
    function replaceInternalStreamId(pc, description) {
        let sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach((internalId)=>{
            const externalStream = pc._reverseStreams[internalId];
            const internalStream = pc._streams[externalStream.id];
            sdp = sdp.replace(new RegExp(internalStream.id, 'g'), externalStream.id);
        });
        return new RTCSessionDescription({
            type: description.type,
            sdp: sdp
        });
    }
    function replaceExternalStreamId(pc, description) {
        let sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach((internalId)=>{
            const externalStream = pc._reverseStreams[internalId];
            const internalStream = pc._streams[externalStream.id];
            sdp = sdp.replace(new RegExp(externalStream.id, 'g'), internalStream.id);
        });
        return new RTCSessionDescription({
            type: description.type,
            sdp: sdp
        });
    }
    [
        'createOffer',
        'createAnswer'
    ].forEach(function(method) {
        const nativeMethod = window.RTCPeerConnection.prototype[method];
        const methodObj = {
            [method] () {
                const args = arguments;
                const isLegacyCall = arguments.length && typeof arguments[0] === 'function';
                if (isLegacyCall) return nativeMethod.apply(this, [
                    (description)=>{
                        const desc = replaceInternalStreamId(this, description);
                        args[0].apply(null, [
                            desc
                        ]);
                    },
                    (err)=>{
                        if (args[1]) args[1].apply(null, err);
                    },
                    arguments[2]
                ]);
                return nativeMethod.apply(this, arguments).then((description)=>replaceInternalStreamId(this, description));
            }
        };
        window.RTCPeerConnection.prototype[method] = methodObj[method];
    });
    const origSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
    window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
        if (!arguments.length || !arguments[0].type) return origSetLocalDescription.apply(this, arguments);
        arguments[0] = replaceExternalStreamId(this, arguments[0]);
        return origSetLocalDescription.apply(this, arguments);
    };
    // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier
    const origLocalDescription = Object.getOwnPropertyDescriptor(window.RTCPeerConnection.prototype, 'localDescription');
    Object.defineProperty(window.RTCPeerConnection.prototype, 'localDescription', {
        get () {
            const description = origLocalDescription.get.apply(this);
            if (description.type === '') return description;
            return replaceInternalStreamId(this, description);
        }
    });
    window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        if (this.signalingState === 'closed') throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
        // We can not yet check for sender instanceof RTCRtpSender
        // since we shim RTPSender. So we check if sender._pc is set.
        if (!sender._pc) throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", 'TypeError');
        const isLocal = sender._pc === this;
        if (!isLocal) throw new DOMException('Sender was not created by this connection.', 'InvalidAccessError');
        // Search for the native stream the senders track belongs to.
        this._streams = this._streams || {};
        let stream;
        Object.keys(this._streams).forEach((streamid)=>{
            const hasTrack = this._streams[streamid].getTracks().find((track)=>sender.track === track);
            if (hasTrack) stream = this._streams[streamid];
        });
        if (stream) {
            if (stream.getTracks().length === 1) // if this is the last track of the stream, remove the stream. This
            // takes care of any shimmed _senders.
            this.removeStream(this._reverseStreams[stream.id]);
            else // relying on the same odd chrome behaviour as above.
            stream.removeTrack(sender.track);
            this.dispatchEvent(new Event('negotiationneeded'));
        }
    };
}
function $25c38b78ffb66cc0$export$852a08dda9a55ea7(window, browserDetails) {
    if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) // very basic support for old versions.
    window.RTCPeerConnection = window.webkitRTCPeerConnection;
    if (!window.RTCPeerConnection) return;
    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
    if (browserDetails.version < 53) [
        'setLocalDescription',
        'setRemoteDescription',
        'addIceCandidate'
    ].forEach(function(method) {
        const nativeMethod = window.RTCPeerConnection.prototype[method];
        const methodObj = {
            [method] () {
                arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
                return nativeMethod.apply(this, arguments);
            }
        };
        window.RTCPeerConnection.prototype[method] = methodObj[method];
    });
}
function $25c38b78ffb66cc0$export$341293bbeaae37cb(window, browserDetails) {
    $b7dae01f7fd17da1$export$1f48841962b828b1(window, 'negotiationneeded', (e)=>{
        const pc = e.target;
        if (browserDetails.version < 72 || pc.getConfiguration && pc.getConfiguration().sdpSemantics === 'plan-b') {
            if (pc.signalingState !== 'stable') return;
        }
        return e;
    });
}


var $33faccbba98b0a26$exports = {};

$parcel$export($33faccbba98b0a26$exports, "shimOnTrack", () => $33faccbba98b0a26$export$f358708f68ab068);
$parcel$export($33faccbba98b0a26$exports, "shimPeerConnection", () => $33faccbba98b0a26$export$852a08dda9a55ea7);
$parcel$export($33faccbba98b0a26$exports, "shimSenderGetStats", () => $33faccbba98b0a26$export$f0525502095c04ef);
$parcel$export($33faccbba98b0a26$exports, "shimReceiverGetStats", () => $33faccbba98b0a26$export$83d69126527b1171);
$parcel$export($33faccbba98b0a26$exports, "shimRemoveStream", () => $33faccbba98b0a26$export$825e523ef749bd8c);
$parcel$export($33faccbba98b0a26$exports, "shimRTCDataChannel", () => $33faccbba98b0a26$export$ff9cb3bc8990e8f7);
$parcel$export($33faccbba98b0a26$exports, "shimAddTransceiver", () => $33faccbba98b0a26$export$70c77533b6e9908d);
$parcel$export($33faccbba98b0a26$exports, "shimGetParameters", () => $33faccbba98b0a26$export$66238223c298fbaa);
$parcel$export($33faccbba98b0a26$exports, "shimCreateOffer", () => $33faccbba98b0a26$export$51beccf0e777b843);
$parcel$export($33faccbba98b0a26$exports, "shimCreateAnswer", () => $33faccbba98b0a26$export$df0b46e7cef08150);
$parcel$export($33faccbba98b0a26$exports, "shimGetUserMedia", () => $307cb1e4d51c5369$export$1ed4910f4d37dc5e);
$parcel$export($33faccbba98b0a26$exports, "shimGetDisplayMedia", () => $aab0cfac242b4f60$export$97270b87351d9c04);
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 
'use strict';
function $307cb1e4d51c5369$export$1ed4910f4d37dc5e(window, browserDetails) {
    const navigator = window && window.navigator;
    const MediaStreamTrack = window && window.MediaStreamTrack;
    navigator.getUserMedia = function(constraints, onSuccess, onError) {
        // Replace Firefox 44+'s deprecation warning with unprefixed version.
        $b7dae01f7fd17da1$export$cdd73fc4100a6ef4('navigator.getUserMedia', 'navigator.mediaDevices.getUserMedia');
        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    };
    if (!(browserDetails.version > 55 && 'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
        const remap = function(obj, a, b) {
            if (a in obj && !(b in obj)) {
                obj[b] = obj[a];
                delete obj[a];
            }
        };
        const nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function(c) {
            if (typeof c === 'object' && typeof c.audio === 'object') {
                c = JSON.parse(JSON.stringify(c));
                remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
                remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
            }
            return nativeGetUserMedia(c);
        };
        if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
            const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
            MediaStreamTrack.prototype.getSettings = function() {
                const obj = nativeGetSettings.apply(this, arguments);
                remap(obj, 'mozAutoGainControl', 'autoGainControl');
                remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
                return obj;
            };
        }
        if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
            const nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
            MediaStreamTrack.prototype.applyConstraints = function(c) {
                if (this.kind === 'audio' && typeof c === 'object') {
                    c = JSON.parse(JSON.stringify(c));
                    remap(c, 'autoGainControl', 'mozAutoGainControl');
                    remap(c, 'noiseSuppression', 'mozNoiseSuppression');
                }
                return nativeApplyConstraints.apply(this, [
                    c
                ]);
            };
        }
    }
}


/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 'use strict';
function $aab0cfac242b4f60$export$97270b87351d9c04(window, preferredMediaSource) {
    if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) return;
    if (!window.navigator.mediaDevices) return;
    window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
        if (!(constraints && constraints.video)) {
            const err = new DOMException("getDisplayMedia without video constraints is undefined");
            err.name = 'NotFoundError';
            // from https://heycam.github.io/webidl/#idl-DOMException-error-names
            err.code = 8;
            return Promise.reject(err);
        }
        if (constraints.video === true) constraints.video = {
            mediaSource: preferredMediaSource
        };
        else constraints.video.mediaSource = preferredMediaSource;
        return window.navigator.mediaDevices.getUserMedia(constraints);
    };
}


'use strict';
function $33faccbba98b0a26$export$f358708f68ab068(window) {
    if (typeof window === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
        get () {
            return {
                receiver: this.receiver
            };
        }
    });
}
function $33faccbba98b0a26$export$852a08dda9a55ea7(window, browserDetails) {
    if (typeof window !== 'object' || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) return; // probably media.peerconnection.enabled=false in about:config
    if (!window.RTCPeerConnection && window.mozRTCPeerConnection) // very basic support for old versions.
    window.RTCPeerConnection = window.mozRTCPeerConnection;
    if (browserDetails.version < 53) // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    [
        'setLocalDescription',
        'setRemoteDescription',
        'addIceCandidate'
    ].forEach(function(method) {
        const nativeMethod = window.RTCPeerConnection.prototype[method];
        const methodObj = {
            [method] () {
                arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
                return nativeMethod.apply(this, arguments);
            }
        };
        window.RTCPeerConnection.prototype[method] = methodObj[method];
    });
    const modernStatsTypes = {
        inboundrtp: 'inbound-rtp',
        outboundrtp: 'outbound-rtp',
        candidatepair: 'candidate-pair',
        localcandidate: 'local-candidate',
        remotecandidate: 'remote-candidate'
    };
    const nativeGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function getStats() {
        const [selector, onSucc, onErr] = arguments;
        return nativeGetStats.apply(this, [
            selector || null
        ]).then((stats)=>{
            if (browserDetails.version < 53 && !onSucc) // Shim only promise getStats with spec-hyphens in type names
            // Leave callback version alone; misc old uses of forEach before Map
            try {
                stats.forEach((stat)=>{
                    stat.type = modernStatsTypes[stat.type] || stat.type;
                });
            } catch (e) {
                if (e.name !== 'TypeError') throw e;
                // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
                stats.forEach((stat, i)=>{
                    stats.set(i, Object.assign({}, stat, {
                        type: modernStatsTypes[stat.type] || stat.type
                    }));
                });
            }
            return stats;
        }).then(onSucc, onErr);
    };
}
function $33faccbba98b0a26$export$f0525502095c04ef(window) {
    if (!(typeof window === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) return;
    if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) return;
    const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach((sender)=>sender._pc = this);
        return senders;
    };
    const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) window.RTCPeerConnection.prototype.addTrack = function addTrack() {
        const sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
    };
    window.RTCRtpSender.prototype.getStats = function getStats() {
        return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map());
    };
}
function $33faccbba98b0a26$export$83d69126527b1171(window) {
    if (!(typeof window === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) return;
    if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) return;
    const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
        const receivers = origGetReceivers.apply(this, []);
        receivers.forEach((receiver)=>receiver._pc = this);
        return receivers;
    };
    $b7dae01f7fd17da1$export$1f48841962b828b1(window, 'track', (e)=>{
        e.receiver._pc = e.srcElement;
        return e;
    });
    window.RTCRtpReceiver.prototype.getStats = function getStats() {
        return this._pc.getStats(this.track);
    };
}
function $33faccbba98b0a26$export$825e523ef749bd8c(window) {
    if (!window.RTCPeerConnection || 'removeStream' in window.RTCPeerConnection.prototype) return;
    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        $b7dae01f7fd17da1$export$cdd73fc4100a6ef4('removeStream', 'removeTrack');
        this.getSenders().forEach((sender)=>{
            if (sender.track && stream.getTracks().includes(sender.track)) this.removeTrack(sender);
        });
    };
}
function $33faccbba98b0a26$export$ff9cb3bc8990e8f7(window) {
    // rename DataChannel to RTCDataChannel (native fix in FF60):
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
    if (window.DataChannel && !window.RTCDataChannel) window.RTCDataChannel = window.DataChannel;
}
function $33faccbba98b0a26$export$70c77533b6e9908d(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!(typeof window === 'object' && window.RTCPeerConnection)) return;
    const origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
    if (origAddTransceiver) window.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
        this.setParametersPromises = [];
        // WebIDL input coercion and validation
        let sendEncodings = arguments[1] && arguments[1].sendEncodings;
        if (sendEncodings === undefined) sendEncodings = [];
        sendEncodings = [
            ...sendEncodings
        ];
        const shouldPerformCheck = sendEncodings.length > 0;
        if (shouldPerformCheck) // If sendEncodings params are provided, validate grammar
        sendEncodings.forEach((encodingParam)=>{
            if ('rid' in encodingParam) {
                const ridRegex = /^[a-z0-9]{0,16}$/i;
                if (!ridRegex.test(encodingParam.rid)) throw new TypeError('Invalid RID value provided.');
            }
            if ('scaleResolutionDownBy' in encodingParam) {
                if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) throw new RangeError('scale_resolution_down_by must be >= 1.0');
            }
            if ('maxFramerate' in encodingParam) {
                if (!(parseFloat(encodingParam.maxFramerate) >= 0)) throw new RangeError('max_framerate must be >= 0.0');
            }
        });
        const transceiver = origAddTransceiver.apply(this, arguments);
        if (shouldPerformCheck) {
            // Check if the init options were applied. If not we do this in an
            // asynchronous way and save the promise reference in a global object.
            // This is an ugly hack, but at the same time is way more robust than
            // checking the sender parameters before and after the createOffer
            // Also note that after the createoffer we are not 100% sure that
            // the params were asynchronously applied so we might miss the
            // opportunity to recreate offer.
            const { sender: sender } = transceiver;
            const params = sender.getParameters();
            if (!('encodings' in params) || // Avoid being fooled by patched getParameters() below.
            params.encodings.length === 1 && Object.keys(params.encodings[0]).length === 0) {
                params.encodings = sendEncodings;
                sender.sendEncodings = sendEncodings;
                this.setParametersPromises.push(sender.setParameters(params).then(()=>{
                    delete sender.sendEncodings;
                }).catch(()=>{
                    delete sender.sendEncodings;
                }));
            }
        }
        return transceiver;
    };
}
function $33faccbba98b0a26$export$66238223c298fbaa(window) {
    if (!(typeof window === 'object' && window.RTCRtpSender)) return;
    const origGetParameters = window.RTCRtpSender.prototype.getParameters;
    if (origGetParameters) window.RTCRtpSender.prototype.getParameters = function getParameters() {
        const params = origGetParameters.apply(this, arguments);
        if (!('encodings' in params)) params.encodings = [].concat(this.sendEncodings || [
            {}
        ]);
        return params;
    };
}
function $33faccbba98b0a26$export$51beccf0e777b843(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!(typeof window === 'object' && window.RTCPeerConnection)) return;
    const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
    window.RTCPeerConnection.prototype.createOffer = function createOffer() {
        if (this.setParametersPromises && this.setParametersPromises.length) return Promise.all(this.setParametersPromises).then(()=>{
            return origCreateOffer.apply(this, arguments);
        }).finally(()=>{
            this.setParametersPromises = [];
        });
        return origCreateOffer.apply(this, arguments);
    };
}
function $33faccbba98b0a26$export$df0b46e7cef08150(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!(typeof window === 'object' && window.RTCPeerConnection)) return;
    const origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
    window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
        if (this.setParametersPromises && this.setParametersPromises.length) return Promise.all(this.setParametersPromises).then(()=>{
            return origCreateAnswer.apply(this, arguments);
        }).finally(()=>{
            this.setParametersPromises = [];
        });
        return origCreateAnswer.apply(this, arguments);
    };
}


var $6d50fd7ff2a1bc1f$exports = {};

$parcel$export($6d50fd7ff2a1bc1f$exports, "shimLocalStreamsAPI", () => $6d50fd7ff2a1bc1f$export$8df41282f4fdcea2);
$parcel$export($6d50fd7ff2a1bc1f$exports, "shimRemoteStreamsAPI", () => $6d50fd7ff2a1bc1f$export$762aa4cbb4f2f857);
$parcel$export($6d50fd7ff2a1bc1f$exports, "shimCallbacksAPI", () => $6d50fd7ff2a1bc1f$export$da31df245debdd3);
$parcel$export($6d50fd7ff2a1bc1f$exports, "shimGetUserMedia", () => $6d50fd7ff2a1bc1f$export$1ed4910f4d37dc5e);
$parcel$export($6d50fd7ff2a1bc1f$exports, "shimConstraints", () => $6d50fd7ff2a1bc1f$export$494a01ac68ba81ac);
$parcel$export($6d50fd7ff2a1bc1f$exports, "shimRTCIceServerUrls", () => $6d50fd7ff2a1bc1f$export$671a8b47b41b6f41);
$parcel$export($6d50fd7ff2a1bc1f$exports, "shimTrackEventTransceiver", () => $6d50fd7ff2a1bc1f$export$85d53da088cb1b14);
$parcel$export($6d50fd7ff2a1bc1f$exports, "shimCreateOfferLegacy", () => $6d50fd7ff2a1bc1f$export$d444266503fdd2d4);
$parcel$export($6d50fd7ff2a1bc1f$exports, "shimAudioContext", () => $6d50fd7ff2a1bc1f$export$857cd739a7b795d2);
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ 
'use strict';
function $6d50fd7ff2a1bc1f$export$8df41282f4fdcea2(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) return;
    if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        if (!this._localStreams) this._localStreams = [];
        return this._localStreams;
    };
    if (!('addStream' in window.RTCPeerConnection.prototype)) {
        const _addTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
            if (!this._localStreams) this._localStreams = [];
            if (!this._localStreams.includes(stream)) this._localStreams.push(stream);
            // Try to emulate Chrome's behaviour of adding in audio-video order.
            // Safari orders by track id.
            stream.getAudioTracks().forEach((track)=>_addTrack.call(this, track, stream));
            stream.getVideoTracks().forEach((track)=>_addTrack.call(this, track, stream));
        };
        window.RTCPeerConnection.prototype.addTrack = function addTrack(track, ...streams) {
            if (streams) streams.forEach((stream)=>{
                if (!this._localStreams) this._localStreams = [
                    stream
                ];
                else if (!this._localStreams.includes(stream)) this._localStreams.push(stream);
            });
            return _addTrack.apply(this, arguments);
        };
    }
    if (!('removeStream' in window.RTCPeerConnection.prototype)) window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        if (!this._localStreams) this._localStreams = [];
        const index = this._localStreams.indexOf(stream);
        if (index === -1) return;
        this._localStreams.splice(index, 1);
        const tracks = stream.getTracks();
        this.getSenders().forEach((sender)=>{
            if (tracks.includes(sender.track)) this.removeTrack(sender);
        });
    };
}
function $6d50fd7ff2a1bc1f$export$762aa4cbb4f2f857(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) return;
    if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) window.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
        return this._remoteStreams ? this._remoteStreams : [];
    };
    if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
            get () {
                return this._onaddstream;
            },
            set (f) {
                if (this._onaddstream) {
                    this.removeEventListener('addstream', this._onaddstream);
                    this.removeEventListener('track', this._onaddstreampoly);
                }
                this.addEventListener('addstream', this._onaddstream = f);
                this.addEventListener('track', this._onaddstreampoly = (e)=>{
                    e.streams.forEach((stream)=>{
                        if (!this._remoteStreams) this._remoteStreams = [];
                        if (this._remoteStreams.includes(stream)) return;
                        this._remoteStreams.push(stream);
                        const event = new Event('addstream');
                        event.stream = stream;
                        this.dispatchEvent(event);
                    });
                });
            }
        });
        const origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
            const pc = this;
            if (!this._onaddstreampoly) this.addEventListener('track', this._onaddstreampoly = function(e) {
                e.streams.forEach((stream)=>{
                    if (!pc._remoteStreams) pc._remoteStreams = [];
                    if (pc._remoteStreams.indexOf(stream) >= 0) return;
                    pc._remoteStreams.push(stream);
                    const event = new Event('addstream');
                    event.stream = stream;
                    pc.dispatchEvent(event);
                });
            });
            return origSetRemoteDescription.apply(pc, arguments);
        };
    }
}
function $6d50fd7ff2a1bc1f$export$da31df245debdd3(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) return;
    const prototype = window.RTCPeerConnection.prototype;
    const origCreateOffer = prototype.createOffer;
    const origCreateAnswer = prototype.createAnswer;
    const setLocalDescription = prototype.setLocalDescription;
    const setRemoteDescription = prototype.setRemoteDescription;
    const addIceCandidate = prototype.addIceCandidate;
    prototype.createOffer = function createOffer(successCallback, failureCallback) {
        const options = arguments.length >= 2 ? arguments[2] : arguments[0];
        const promise = origCreateOffer.apply(this, [
            options
        ]);
        if (!failureCallback) return promise;
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
        const options = arguments.length >= 2 ? arguments[2] : arguments[0];
        const promise = origCreateAnswer.apply(this, [
            options
        ]);
        if (!failureCallback) return promise;
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    let withCallback = function(description, successCallback, failureCallback) {
        const promise = setLocalDescription.apply(this, [
            description
        ]);
        if (!failureCallback) return promise;
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    prototype.setLocalDescription = withCallback;
    withCallback = function(description, successCallback, failureCallback) {
        const promise = setRemoteDescription.apply(this, [
            description
        ]);
        if (!failureCallback) return promise;
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    prototype.setRemoteDescription = withCallback;
    withCallback = function(candidate, successCallback, failureCallback) {
        const promise = addIceCandidate.apply(this, [
            candidate
        ]);
        if (!failureCallback) return promise;
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    prototype.addIceCandidate = withCallback;
}
function $6d50fd7ff2a1bc1f$export$1ed4910f4d37dc5e(window) {
    const navigator = window && window.navigator;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // shim not needed in Safari 12.1
        const mediaDevices = navigator.mediaDevices;
        const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
        navigator.mediaDevices.getUserMedia = (constraints)=>{
            return _getUserMedia($6d50fd7ff2a1bc1f$export$494a01ac68ba81ac(constraints));
        };
    }
    if (!navigator.getUserMedia && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) navigator.getUserMedia = (function getUserMedia(constraints, cb, errcb) {
        navigator.mediaDevices.getUserMedia(constraints).then(cb, errcb);
    }).bind(navigator);
}
function $6d50fd7ff2a1bc1f$export$494a01ac68ba81ac(constraints) {
    if (constraints && constraints.video !== undefined) return Object.assign({}, constraints, {
        video: $b7dae01f7fd17da1$export$15384eac40dc88c8(constraints.video)
    });
    return constraints;
}
function $6d50fd7ff2a1bc1f$export$671a8b47b41b6f41(window) {
    if (!window.RTCPeerConnection) return;
    // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
    const OrigPeerConnection = window.RTCPeerConnection;
    window.RTCPeerConnection = function RTCPeerConnection(pcConfig, pcConstraints) {
        if (pcConfig && pcConfig.iceServers) {
            const newIceServers = [];
            for(let i = 0; i < pcConfig.iceServers.length; i++){
                let server = pcConfig.iceServers[i];
                if (server.urls === undefined && server.url) {
                    $b7dae01f7fd17da1$export$cdd73fc4100a6ef4('RTCIceServer.url', 'RTCIceServer.urls');
                    server = JSON.parse(JSON.stringify(server));
                    server.urls = server.url;
                    delete server.url;
                    newIceServers.push(server);
                } else newIceServers.push(pcConfig.iceServers[i]);
            }
            pcConfig.iceServers = newIceServers;
        }
        return new OrigPeerConnection(pcConfig, pcConstraints);
    };
    window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
    // wrap static methods. Currently just generateCertificate.
    if ('generateCertificate' in OrigPeerConnection) Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
        get () {
            return OrigPeerConnection.generateCertificate;
        }
    });
}
function $6d50fd7ff2a1bc1f$export$85d53da088cb1b14(window) {
    // Add event.transceiver member over deprecated event.receiver
    if (typeof window === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
        get () {
            return {
                receiver: this.receiver
            };
        }
    });
}
function $6d50fd7ff2a1bc1f$export$d444266503fdd2d4(window) {
    const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
    window.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
        if (offerOptions) {
            if (typeof offerOptions.offerToReceiveAudio !== 'undefined') // support bit values
            offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
            const audioTransceiver = this.getTransceivers().find((transceiver)=>transceiver.receiver.track.kind === 'audio');
            if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
                if (audioTransceiver.direction === 'sendrecv') {
                    if (audioTransceiver.setDirection) audioTransceiver.setDirection('sendonly');
                    else audioTransceiver.direction = 'sendonly';
                } else if (audioTransceiver.direction === 'recvonly') {
                    if (audioTransceiver.setDirection) audioTransceiver.setDirection('inactive');
                    else audioTransceiver.direction = 'inactive';
                }
            } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) this.addTransceiver('audio', {
                direction: 'recvonly'
            });
            if (typeof offerOptions.offerToReceiveVideo !== 'undefined') // support bit values
            offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
            const videoTransceiver = this.getTransceivers().find((transceiver)=>transceiver.receiver.track.kind === 'video');
            if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
                if (videoTransceiver.direction === 'sendrecv') {
                    if (videoTransceiver.setDirection) videoTransceiver.setDirection('sendonly');
                    else videoTransceiver.direction = 'sendonly';
                } else if (videoTransceiver.direction === 'recvonly') {
                    if (videoTransceiver.setDirection) videoTransceiver.setDirection('inactive');
                    else videoTransceiver.direction = 'inactive';
                }
            } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) this.addTransceiver('video', {
                direction: 'recvonly'
            });
        }
        return origCreateOffer.apply(this, arguments);
    };
}
function $6d50fd7ff2a1bc1f$export$857cd739a7b795d2(window) {
    if (typeof window !== 'object' || window.AudioContext) return;
    window.AudioContext = window.webkitAudioContext;
}


var $4a0d4a9ee74b0777$exports = {};

$parcel$export($4a0d4a9ee74b0777$exports, "shimRTCIceCandidate", () => $4a0d4a9ee74b0777$export$cf133661e444ccfe);
$parcel$export($4a0d4a9ee74b0777$exports, "shimRTCIceCandidateRelayProtocol", () => $4a0d4a9ee74b0777$export$fdafb8d8280e29b5);
$parcel$export($4a0d4a9ee74b0777$exports, "shimMaxMessageSize", () => $4a0d4a9ee74b0777$export$a99147c78a56edc4);
$parcel$export($4a0d4a9ee74b0777$exports, "shimSendThrowTypeError", () => $4a0d4a9ee74b0777$export$d461c8d5c5db5da7);
$parcel$export($4a0d4a9ee74b0777$exports, "shimConnectionState", () => $4a0d4a9ee74b0777$export$63bb816cc75460);
$parcel$export($4a0d4a9ee74b0777$exports, "removeExtmapAllowMixed", () => $4a0d4a9ee74b0777$export$a57d114344295149);
$parcel$export($4a0d4a9ee74b0777$exports, "shimAddIceCandidateNullOrEmpty", () => $4a0d4a9ee74b0777$export$51d5e40b48c771c7);
$parcel$export($4a0d4a9ee74b0777$exports, "shimParameterlessSetLocalDescription", () => $4a0d4a9ee74b0777$export$7170d04e59f9d553);
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ var $68d92d6d835b94db$exports = {};
/* eslint-env node */ 'use strict';
// SDP helpers.
const $68d92d6d835b94db$var$SDPUtils = {};
// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
$68d92d6d835b94db$var$SDPUtils.generateIdentifier = function() {
    return Math.random().toString(36).substring(2, 12);
};
// The RTCP CNAME used by all peerconnections from the same JS.
$68d92d6d835b94db$var$SDPUtils.localCName = $68d92d6d835b94db$var$SDPUtils.generateIdentifier();
// Splits SDP into lines, dealing with both CRLF and LF.
$68d92d6d835b94db$var$SDPUtils.splitLines = function(blob) {
    return blob.trim().split('\n').map((line)=>line.trim());
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
$68d92d6d835b94db$var$SDPUtils.splitSections = function(blob) {
    const parts = blob.split('\nm=');
    return parts.map((part, index)=>(index > 0 ? 'm=' + part : part).trim() + '\r\n');
};
// Returns the session description.
$68d92d6d835b94db$var$SDPUtils.getDescription = function(blob) {
    const sections = $68d92d6d835b94db$var$SDPUtils.splitSections(blob);
    return sections && sections[0];
};
// Returns the individual media sections.
$68d92d6d835b94db$var$SDPUtils.getMediaSections = function(blob) {
    const sections = $68d92d6d835b94db$var$SDPUtils.splitSections(blob);
    sections.shift();
    return sections;
};
// Returns lines that start with a certain prefix.
$68d92d6d835b94db$var$SDPUtils.matchPrefix = function(blob, prefix) {
    return $68d92d6d835b94db$var$SDPUtils.splitLines(blob).filter((line)=>line.indexOf(prefix) === 0);
};
// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
// Input can be prefixed with a=.
$68d92d6d835b94db$var$SDPUtils.parseCandidate = function(line) {
    let parts;
    // Parse both variants.
    if (line.indexOf('a=candidate:') === 0) parts = line.substring(12).split(' ');
    else parts = line.substring(10).split(' ');
    const candidate = {
        foundation: parts[0],
        component: {
            1: 'rtp',
            2: 'rtcp'
        }[parts[1]] || parts[1],
        protocol: parts[2].toLowerCase(),
        priority: parseInt(parts[3], 10),
        ip: parts[4],
        address: parts[4],
        port: parseInt(parts[5], 10),
        // skip parts[6] == 'typ'
        type: parts[7]
    };
    for(let i = 8; i < parts.length; i += 2)switch(parts[i]){
        case 'raddr':
            candidate.relatedAddress = parts[i + 1];
            break;
        case 'rport':
            candidate.relatedPort = parseInt(parts[i + 1], 10);
            break;
        case 'tcptype':
            candidate.tcpType = parts[i + 1];
            break;
        case 'ufrag':
            candidate.ufrag = parts[i + 1]; // for backward compatibility.
            candidate.usernameFragment = parts[i + 1];
            break;
        default:
            if (candidate[parts[i]] === undefined) candidate[parts[i]] = parts[i + 1];
            break;
    }
    return candidate;
};
// Translates a candidate object into SDP candidate attribute.
// This does not include the a= prefix!
$68d92d6d835b94db$var$SDPUtils.writeCandidate = function(candidate) {
    const sdp = [];
    sdp.push(candidate.foundation);
    const component = candidate.component;
    if (component === 'rtp') sdp.push(1);
    else if (component === 'rtcp') sdp.push(2);
    else sdp.push(component);
    sdp.push(candidate.protocol.toUpperCase());
    sdp.push(candidate.priority);
    sdp.push(candidate.address || candidate.ip);
    sdp.push(candidate.port);
    const type = candidate.type;
    sdp.push('typ');
    sdp.push(type);
    if (type !== 'host' && candidate.relatedAddress && candidate.relatedPort) {
        sdp.push('raddr');
        sdp.push(candidate.relatedAddress);
        sdp.push('rport');
        sdp.push(candidate.relatedPort);
    }
    if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
        sdp.push('tcptype');
        sdp.push(candidate.tcpType);
    }
    if (candidate.usernameFragment || candidate.ufrag) {
        sdp.push('ufrag');
        sdp.push(candidate.usernameFragment || candidate.ufrag);
    }
    return 'candidate:' + sdp.join(' ');
};
// Parses an ice-options line, returns an array of option tags.
// Sample input:
// a=ice-options:foo bar
$68d92d6d835b94db$var$SDPUtils.parseIceOptions = function(line) {
    return line.substring(14).split(' ');
};
// Parses a rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
$68d92d6d835b94db$var$SDPUtils.parseRtpMap = function(line) {
    let parts = line.substring(9).split(' ');
    const parsed = {
        payloadType: parseInt(parts.shift(), 10)
    };
    parts = parts[0].split('/');
    parsed.name = parts[0];
    parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
    parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
    // legacy alias, got renamed back to channels in ORTC.
    parsed.numChannels = parsed.channels;
    return parsed;
};
// Generates a rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
$68d92d6d835b94db$var$SDPUtils.writeRtpMap = function(codec) {
    let pt = codec.payloadType;
    if (codec.preferredPayloadType !== undefined) pt = codec.preferredPayloadType;
    const channels = codec.channels || codec.numChannels || 1;
    return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate + (channels !== 1 ? '/' + channels : '') + '\r\n';
};
// Parses a extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
$68d92d6d835b94db$var$SDPUtils.parseExtmap = function(line) {
    const parts = line.substring(9).split(' ');
    return {
        id: parseInt(parts[0], 10),
        direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
        uri: parts[1],
        attributes: parts.slice(2).join(' ')
    };
};
// Generates an extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
$68d92d6d835b94db$var$SDPUtils.writeExtmap = function(headerExtension) {
    return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== 'sendrecv' ? '/' + headerExtension.direction : '') + ' ' + headerExtension.uri + (headerExtension.attributes ? ' ' + headerExtension.attributes : '') + '\r\n';
};
// Parses a fmtp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
$68d92d6d835b94db$var$SDPUtils.parseFmtp = function(line) {
    const parsed = {};
    let kv;
    const parts = line.substring(line.indexOf(' ') + 1).split(';');
    for(let j = 0; j < parts.length; j++){
        kv = parts[j].trim().split('=');
        parsed[kv[0].trim()] = kv[1];
    }
    return parsed;
};
// Generates a fmtp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
$68d92d6d835b94db$var$SDPUtils.writeFmtp = function(codec) {
    let line = '';
    let pt = codec.payloadType;
    if (codec.preferredPayloadType !== undefined) pt = codec.preferredPayloadType;
    if (codec.parameters && Object.keys(codec.parameters).length) {
        const params = [];
        Object.keys(codec.parameters).forEach((param)=>{
            if (codec.parameters[param] !== undefined) params.push(param + '=' + codec.parameters[param]);
            else params.push(param);
        });
        line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
    }
    return line;
};
// Parses a rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
$68d92d6d835b94db$var$SDPUtils.parseRtcpFb = function(line) {
    const parts = line.substring(line.indexOf(' ') + 1).split(' ');
    return {
        type: parts.shift(),
        parameter: parts.join(' ')
    };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
$68d92d6d835b94db$var$SDPUtils.writeRtcpFb = function(codec) {
    let lines = '';
    let pt = codec.payloadType;
    if (codec.preferredPayloadType !== undefined) pt = codec.preferredPayloadType;
    if (codec.rtcpFeedback && codec.rtcpFeedback.length) // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach((fb)=>{
        lines += 'a=rtcp-fb:' + pt + ' ' + fb.type + (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') + '\r\n';
    });
    return lines;
};
// Parses a RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
$68d92d6d835b94db$var$SDPUtils.parseSsrcMedia = function(line) {
    const sp = line.indexOf(' ');
    const parts = {
        ssrc: parseInt(line.substring(7, sp), 10)
    };
    const colon = line.indexOf(':', sp);
    if (colon > -1) {
        parts.attribute = line.substring(sp + 1, colon);
        parts.value = line.substring(colon + 1);
    } else parts.attribute = line.substring(sp + 1);
    return parts;
};
// Parse a ssrc-group line (see RFC 5576). Sample input:
// a=ssrc-group:semantics 12 34
$68d92d6d835b94db$var$SDPUtils.parseSsrcGroup = function(line) {
    const parts = line.substring(13).split(' ');
    return {
        semantics: parts.shift(),
        ssrcs: parts.map((ssrc)=>parseInt(ssrc, 10))
    };
};
// Extracts the MID (RFC 5888) from a media section.
// Returns the MID or undefined if no mid line was found.
$68d92d6d835b94db$var$SDPUtils.getMid = function(mediaSection) {
    const mid = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
    if (mid) return mid.substring(6);
};
// Parses a fingerprint line for DTLS-SRTP.
$68d92d6d835b94db$var$SDPUtils.parseFingerprint = function(line) {
    const parts = line.substring(14).split(' ');
    return {
        algorithm: parts[0].toLowerCase(),
        value: parts[1].toUpperCase()
    };
};
// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
$68d92d6d835b94db$var$SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
    const lines = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=fingerprint:');
    // Note: a=setup line is ignored since we use the 'auto' role in Edge.
    return {
        role: 'auto',
        fingerprints: lines.map($68d92d6d835b94db$var$SDPUtils.parseFingerprint)
    };
};
// Serializes DTLS parameters to SDP.
$68d92d6d835b94db$var$SDPUtils.writeDtlsParameters = function(params, setupType) {
    let sdp = 'a=setup:' + setupType + '\r\n';
    params.fingerprints.forEach((fp)=>{
        sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
    });
    return sdp;
};
// Parses a=crypto lines into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members
$68d92d6d835b94db$var$SDPUtils.parseCryptoLine = function(line) {
    const parts = line.substring(9).split(' ');
    return {
        tag: parseInt(parts[0], 10),
        cryptoSuite: parts[1],
        keyParams: parts[2],
        sessionParams: parts.slice(3)
    };
};
$68d92d6d835b94db$var$SDPUtils.writeCryptoLine = function(parameters) {
    return 'a=crypto:' + parameters.tag + ' ' + parameters.cryptoSuite + ' ' + (typeof parameters.keyParams === 'object' ? $68d92d6d835b94db$var$SDPUtils.writeCryptoKeyParams(parameters.keyParams) : parameters.keyParams) + (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') + '\r\n';
};
// Parses the crypto key parameters into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*
$68d92d6d835b94db$var$SDPUtils.parseCryptoKeyParams = function(keyParams) {
    if (keyParams.indexOf('inline:') !== 0) return null;
    const parts = keyParams.substring(7).split('|');
    return {
        keyMethod: 'inline',
        keySalt: parts[0],
        lifeTime: parts[1],
        mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
        mkiLength: parts[2] ? parts[2].split(':')[1] : undefined
    };
};
$68d92d6d835b94db$var$SDPUtils.writeCryptoKeyParams = function(keyParams) {
    return keyParams.keyMethod + ':' + keyParams.keySalt + (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') + (keyParams.mkiValue && keyParams.mkiLength ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength : '');
};
// Extracts all SDES parameters.
$68d92d6d835b94db$var$SDPUtils.getCryptoParameters = function(mediaSection, sessionpart) {
    const lines = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=crypto:');
    return lines.map($68d92d6d835b94db$var$SDPUtils.parseCryptoLine);
};
// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
$68d92d6d835b94db$var$SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
    const ufrag = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=ice-ufrag:')[0];
    const pwd = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=ice-pwd:')[0];
    if (!(ufrag && pwd)) return null;
    return {
        usernameFragment: ufrag.substring(12),
        password: pwd.substring(10)
    };
};
// Serializes ICE parameters to SDP.
$68d92d6d835b94db$var$SDPUtils.writeIceParameters = function(params) {
    let sdp = 'a=ice-ufrag:' + params.usernameFragment + '\r\n' + 'a=ice-pwd:' + params.password + '\r\n';
    if (params.iceLite) sdp += 'a=ice-lite\r\n';
    return sdp;
};
// Parses the SDP media section and returns RTCRtpParameters.
$68d92d6d835b94db$var$SDPUtils.parseRtpParameters = function(mediaSection) {
    const description = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: [],
        rtcp: []
    };
    const lines = $68d92d6d835b94db$var$SDPUtils.splitLines(mediaSection);
    const mline = lines[0].split(' ');
    description.profile = mline[2];
    for(let i = 3; i < mline.length; i++){
        const pt = mline[i];
        const rtpmapline = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=rtpmap:' + pt + ' ')[0];
        if (rtpmapline) {
            const codec = $68d92d6d835b94db$var$SDPUtils.parseRtpMap(rtpmapline);
            const fmtps = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=fmtp:' + pt + ' ');
            // Only the first a=fmtp:<pt> is considered.
            codec.parameters = fmtps.length ? $68d92d6d835b94db$var$SDPUtils.parseFmtp(fmtps[0]) : {};
            codec.rtcpFeedback = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=rtcp-fb:' + pt + ' ').map($68d92d6d835b94db$var$SDPUtils.parseRtcpFb);
            description.codecs.push(codec);
            // parse FEC mechanisms from rtpmap lines.
            switch(codec.name.toUpperCase()){
                case 'RED':
                case 'ULPFEC':
                    description.fecMechanisms.push(codec.name.toUpperCase());
                    break;
                default:
                    break;
            }
        }
    }
    $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach((line)=>{
        description.headerExtensions.push($68d92d6d835b94db$var$SDPUtils.parseExtmap(line));
    });
    const wildcardRtcpFb = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=rtcp-fb:* ').map($68d92d6d835b94db$var$SDPUtils.parseRtcpFb);
    description.codecs.forEach((codec)=>{
        wildcardRtcpFb.forEach((fb)=>{
            const duplicate = codec.rtcpFeedback.find((existingFeedback)=>{
                return existingFeedback.type === fb.type && existingFeedback.parameter === fb.parameter;
            });
            if (!duplicate) codec.rtcpFeedback.push(fb);
        });
    });
    // FIXME: parse rtcp.
    return description;
};
// Generates parts of the SDP media section describing the capabilities /
// parameters.
$68d92d6d835b94db$var$SDPUtils.writeRtpDescription = function(kind, caps) {
    let sdp = '';
    // Build the mline.
    sdp += 'm=' + kind + ' ';
    sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
    sdp += ' ' + (caps.profile || 'UDP/TLS/RTP/SAVPF') + ' ';
    sdp += caps.codecs.map((codec)=>{
        if (codec.preferredPayloadType !== undefined) return codec.preferredPayloadType;
        return codec.payloadType;
    }).join(' ') + '\r\n';
    sdp += 'c=IN IP4 0.0.0.0\r\n';
    sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';
    // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
    caps.codecs.forEach((codec)=>{
        sdp += $68d92d6d835b94db$var$SDPUtils.writeRtpMap(codec);
        sdp += $68d92d6d835b94db$var$SDPUtils.writeFmtp(codec);
        sdp += $68d92d6d835b94db$var$SDPUtils.writeRtcpFb(codec);
    });
    let maxptime = 0;
    caps.codecs.forEach((codec)=>{
        if (codec.maxptime > maxptime) maxptime = codec.maxptime;
    });
    if (maxptime > 0) sdp += 'a=maxptime:' + maxptime + '\r\n';
    if (caps.headerExtensions) caps.headerExtensions.forEach((extension)=>{
        sdp += $68d92d6d835b94db$var$SDPUtils.writeExtmap(extension);
    });
    // FIXME: write fecMechanisms.
    return sdp;
};
// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
$68d92d6d835b94db$var$SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
    const encodingParameters = [];
    const description = $68d92d6d835b94db$var$SDPUtils.parseRtpParameters(mediaSection);
    const hasRed = description.fecMechanisms.indexOf('RED') !== -1;
    const hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;
    // filter a=ssrc:... cname:, ignore PlanB-msid
    const ssrcs = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map((line)=>$68d92d6d835b94db$var$SDPUtils.parseSsrcMedia(line)).filter((parts)=>parts.attribute === 'cname');
    const primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
    let secondarySsrc;
    const flows = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID').map((line)=>{
        const parts = line.substring(17).split(' ');
        return parts.map((part)=>parseInt(part, 10));
    });
    if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) secondarySsrc = flows[0][1];
    description.codecs.forEach((codec)=>{
        if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
            let encParam = {
                ssrc: primarySsrc,
                codecPayloadType: parseInt(codec.parameters.apt, 10)
            };
            if (primarySsrc && secondarySsrc) encParam.rtx = {
                ssrc: secondarySsrc
            };
            encodingParameters.push(encParam);
            if (hasRed) {
                encParam = JSON.parse(JSON.stringify(encParam));
                encParam.fec = {
                    ssrc: primarySsrc,
                    mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
                };
                encodingParameters.push(encParam);
            }
        }
    });
    if (encodingParameters.length === 0 && primarySsrc) encodingParameters.push({
        ssrc: primarySsrc
    });
    // we support both b=AS and b=TIAS but interpret AS as TIAS.
    let bandwidth = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'b=');
    if (bandwidth.length) {
        if (bandwidth[0].indexOf('b=TIAS:') === 0) bandwidth = parseInt(bandwidth[0].substring(7), 10);
        else if (bandwidth[0].indexOf('b=AS:') === 0) // use formula from JSEP to convert b=AS to TIAS value.
        bandwidth = parseInt(bandwidth[0].substring(5), 10) * 950 - 16000;
        else bandwidth = undefined;
        encodingParameters.forEach((params)=>{
            params.maxBitrate = bandwidth;
        });
    }
    return encodingParameters;
};
// parses http://draft.ortc.org/#rtcrtcpparameters*
$68d92d6d835b94db$var$SDPUtils.parseRtcpParameters = function(mediaSection) {
    const rtcpParameters = {};
    // Gets the first SSRC. Note that with RTX there might be multiple
    // SSRCs.
    const remoteSsrc = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map((line)=>$68d92d6d835b94db$var$SDPUtils.parseSsrcMedia(line)).filter((obj)=>obj.attribute === 'cname')[0];
    if (remoteSsrc) {
        rtcpParameters.cname = remoteSsrc.value;
        rtcpParameters.ssrc = remoteSsrc.ssrc;
    }
    // Edge uses the compound attribute instead of reducedSize
    // compound is !reducedSize
    const rsize = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
    rtcpParameters.reducedSize = rsize.length > 0;
    rtcpParameters.compound = rsize.length === 0;
    // parses the rtcp-mux attrіbute.
    // Note that Edge does not support unmuxed RTCP.
    const mux = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
    rtcpParameters.mux = mux.length > 0;
    return rtcpParameters;
};
$68d92d6d835b94db$var$SDPUtils.writeRtcpParameters = function(rtcpParameters) {
    let sdp = '';
    if (rtcpParameters.reducedSize) sdp += 'a=rtcp-rsize\r\n';
    if (rtcpParameters.mux) sdp += 'a=rtcp-mux\r\n';
    if (rtcpParameters.ssrc !== undefined && rtcpParameters.cname) sdp += 'a=ssrc:' + rtcpParameters.ssrc + ' cname:' + rtcpParameters.cname + '\r\n';
    return sdp;
};
// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
$68d92d6d835b94db$var$SDPUtils.parseMsid = function(mediaSection) {
    let parts;
    const spec = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=msid:');
    if (spec.length === 1) {
        parts = spec[0].substring(7).split(' ');
        return {
            stream: parts[0],
            track: parts[1]
        };
    }
    const planB = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map((line)=>$68d92d6d835b94db$var$SDPUtils.parseSsrcMedia(line)).filter((msidParts)=>msidParts.attribute === 'msid');
    if (planB.length > 0) {
        parts = planB[0].value.split(' ');
        return {
            stream: parts[0],
            track: parts[1]
        };
    }
};
// SCTP
// parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
// to draft-ietf-mmusic-sctp-sdp-05
$68d92d6d835b94db$var$SDPUtils.parseSctpDescription = function(mediaSection) {
    const mline = $68d92d6d835b94db$var$SDPUtils.parseMLine(mediaSection);
    const maxSizeLine = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
    let maxMessageSize;
    if (maxSizeLine.length > 0) maxMessageSize = parseInt(maxSizeLine[0].substring(19), 10);
    if (isNaN(maxMessageSize)) maxMessageSize = 65536;
    const sctpPort = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');
    if (sctpPort.length > 0) return {
        port: parseInt(sctpPort[0].substring(12), 10),
        protocol: mline.fmt,
        maxMessageSize: maxMessageSize
    };
    const sctpMapLines = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');
    if (sctpMapLines.length > 0) {
        const parts = sctpMapLines[0].substring(10).split(' ');
        return {
            port: parseInt(parts[0], 10),
            protocol: parts[1],
            maxMessageSize: maxMessageSize
        };
    }
};
// SCTP
// outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
// support by now receiving in this format, unless we originally parsed
// as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
// protocol of DTLS/SCTP -- without UDP/ or TCP/)
$68d92d6d835b94db$var$SDPUtils.writeSctpDescription = function(media, sctp) {
    let output = [];
    if (media.protocol !== 'DTLS/SCTP') output = [
        'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n',
        'c=IN IP4 0.0.0.0\r\n',
        'a=sctp-port:' + sctp.port + '\r\n'
    ];
    else output = [
        'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n',
        'c=IN IP4 0.0.0.0\r\n',
        'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n'
    ];
    if (sctp.maxMessageSize !== undefined) output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
    return output.join('');
};
// Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range
$68d92d6d835b94db$var$SDPUtils.generateSessionId = function() {
    return Math.random().toString().substr(2, 22);
};
// Write boiler plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
// sessUser is optional and defaults to 'thisisadapterortc'
$68d92d6d835b94db$var$SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
    let sessionId;
    const version = sessVer !== undefined ? sessVer : 2;
    if (sessId) sessionId = sessId;
    else sessionId = $68d92d6d835b94db$var$SDPUtils.generateSessionId();
    const user = sessUser || 'thisisadapterortc';
    // FIXME: sess-id should be an NTP timestamp.
    return "v=0\r\no=" + user + ' ' + sessionId + ' ' + version + ' IN IP4 127.0.0.1\r\n' + 's=-\r\n' + 't=0 0\r\n';
};
// Gets the direction from the mediaSection or the sessionpart.
$68d92d6d835b94db$var$SDPUtils.getDirection = function(mediaSection, sessionpart) {
    // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
    const lines = $68d92d6d835b94db$var$SDPUtils.splitLines(mediaSection);
    for(let i = 0; i < lines.length; i++)switch(lines[i]){
        case 'a=sendrecv':
        case 'a=sendonly':
        case 'a=recvonly':
        case 'a=inactive':
            return lines[i].substring(2);
        default:
    }
    if (sessionpart) return $68d92d6d835b94db$var$SDPUtils.getDirection(sessionpart);
    return 'sendrecv';
};
$68d92d6d835b94db$var$SDPUtils.getKind = function(mediaSection) {
    const lines = $68d92d6d835b94db$var$SDPUtils.splitLines(mediaSection);
    const mline = lines[0].split(' ');
    return mline[0].substring(2);
};
$68d92d6d835b94db$var$SDPUtils.isRejected = function(mediaSection) {
    return mediaSection.split(' ', 2)[1] === '0';
};
$68d92d6d835b94db$var$SDPUtils.parseMLine = function(mediaSection) {
    const lines = $68d92d6d835b94db$var$SDPUtils.splitLines(mediaSection);
    const parts = lines[0].substring(2).split(' ');
    return {
        kind: parts[0],
        port: parseInt(parts[1], 10),
        protocol: parts[2],
        fmt: parts.slice(3).join(' ')
    };
};
$68d92d6d835b94db$var$SDPUtils.parseOLine = function(mediaSection) {
    const line = $68d92d6d835b94db$var$SDPUtils.matchPrefix(mediaSection, 'o=')[0];
    const parts = line.substring(2).split(' ');
    return {
        username: parts[0],
        sessionId: parts[1],
        sessionVersion: parseInt(parts[2], 10),
        netType: parts[3],
        addressType: parts[4],
        address: parts[5]
    };
};
// a very naive interpretation of a valid SDP.
$68d92d6d835b94db$var$SDPUtils.isValidSDP = function(blob) {
    if (typeof blob !== 'string' || blob.length === 0) return false;
    const lines = $68d92d6d835b94db$var$SDPUtils.splitLines(blob);
    for(let i = 0; i < lines.length; i++){
        if (lines[i].length < 2 || lines[i].charAt(1) !== '=') return false;
    // TODO: check the modifier a bit more.
    }
    return true;
};
$68d92d6d835b94db$exports = $68d92d6d835b94db$var$SDPUtils;



'use strict';
function $4a0d4a9ee74b0777$export$cf133661e444ccfe(window) {
    // foundation is arbitrarily chosen as an indicator for full support for
    // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
    if (!window.RTCIceCandidate || window.RTCIceCandidate && 'foundation' in window.RTCIceCandidate.prototype) return;
    const NativeRTCIceCandidate = window.RTCIceCandidate;
    window.RTCIceCandidate = function RTCIceCandidate(args) {
        // Remove the a= which shouldn't be part of the candidate string.
        if (typeof args === 'object' && args.candidate && args.candidate.indexOf('a=') === 0) {
            args = JSON.parse(JSON.stringify(args));
            args.candidate = args.candidate.substring(2);
        }
        if (args.candidate && args.candidate.length) {
            // Augment the native candidate with the parsed fields.
            const nativeCandidate = new NativeRTCIceCandidate(args);
            const parsedCandidate = (0, (/*@__PURE__*/$parcel$interopDefault($68d92d6d835b94db$exports))).parseCandidate(args.candidate);
            for(const key in parsedCandidate)if (!(key in nativeCandidate)) Object.defineProperty(nativeCandidate, key, {
                value: parsedCandidate[key]
            });
            // Override serializer to not serialize the extra attributes.
            nativeCandidate.toJSON = function toJSON() {
                return {
                    candidate: nativeCandidate.candidate,
                    sdpMid: nativeCandidate.sdpMid,
                    sdpMLineIndex: nativeCandidate.sdpMLineIndex,
                    usernameFragment: nativeCandidate.usernameFragment
                };
            };
            return nativeCandidate;
        }
        return new NativeRTCIceCandidate(args);
    };
    window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;
    // Hook up the augmented candidate in onicecandidate and
    // addEventListener('icecandidate', ...)
    $b7dae01f7fd17da1$export$1f48841962b828b1(window, 'icecandidate', (e)=>{
        if (e.candidate) Object.defineProperty(e, 'candidate', {
            value: new window.RTCIceCandidate(e.candidate),
            writable: 'false'
        });
        return e;
    });
}
function $4a0d4a9ee74b0777$export$fdafb8d8280e29b5(window) {
    if (!window.RTCIceCandidate || window.RTCIceCandidate && 'relayProtocol' in window.RTCIceCandidate.prototype) return;
    // Hook up the augmented candidate in onicecandidate and
    // addEventListener('icecandidate', ...)
    $b7dae01f7fd17da1$export$1f48841962b828b1(window, 'icecandidate', (e)=>{
        if (e.candidate) {
            const parsedCandidate = (0, (/*@__PURE__*/$parcel$interopDefault($68d92d6d835b94db$exports))).parseCandidate(e.candidate.candidate);
            if (parsedCandidate.type === 'relay') // This is a libwebrtc-specific mapping of local type preference
            // to relayProtocol.
            e.candidate.relayProtocol = ({
                0: 'tls',
                1: 'tcp',
                2: 'udp'
            })[parsedCandidate.priority >> 24];
        }
        return e;
    });
}
function $4a0d4a9ee74b0777$export$a99147c78a56edc4(window, browserDetails) {
    if (!window.RTCPeerConnection) return;
    if (!('sctp' in window.RTCPeerConnection.prototype)) Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
        get () {
            return typeof this._sctp === 'undefined' ? null : this._sctp;
        }
    });
    const sctpInDescription = function(description) {
        if (!description || !description.sdp) return false;
        const sections = (0, (/*@__PURE__*/$parcel$interopDefault($68d92d6d835b94db$exports))).splitSections(description.sdp);
        sections.shift();
        return sections.some((mediaSection)=>{
            const mLine = (0, (/*@__PURE__*/$parcel$interopDefault($68d92d6d835b94db$exports))).parseMLine(mediaSection);
            return mLine && mLine.kind === 'application' && mLine.protocol.indexOf('SCTP') !== -1;
        });
    };
    const getRemoteFirefoxVersion = function(description) {
        // TODO: Is there a better solution for detecting Firefox?
        const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
        if (match === null || match.length < 2) return -1;
        const version = parseInt(match[1], 10);
        // Test for NaN (yes, this is ugly)
        return version !== version ? -1 : version;
    };
    const getCanSendMaxMessageSize = function(remoteIsFirefox) {
        // Every implementation we know can send at least 64 KiB.
        // Note: Although Chrome is technically able to send up to 256 KiB, the
        //       data does not reach the other peer reliably.
        //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
        let canSendMaxMessageSize = 65536;
        if (browserDetails.browser === 'firefox') {
            if (browserDetails.version < 57) {
                if (remoteIsFirefox === -1) // FF < 57 will send in 16 KiB chunks using the deprecated PPID
                // fragmentation.
                canSendMaxMessageSize = 16384;
                else // However, other FF (and RAWRTC) can reassemble PPID-fragmented
                // messages. Thus, supporting ~2 GiB when sending.
                canSendMaxMessageSize = 2147483637;
            } else if (browserDetails.version < 60) // Currently, all FF >= 57 will reset the remote maximum message size
            // to the default value when a data channel is created at a later
            // stage. :(
            // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
            canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
            else // FF >= 60 supports sending ~2 GiB
            canSendMaxMessageSize = 2147483637;
        }
        return canSendMaxMessageSize;
    };
    const getMaxMessageSize = function(description, remoteIsFirefox) {
        // Note: 65536 bytes is the default value from the SDP spec. Also,
        //       every implementation we know supports receiving 65536 bytes.
        let maxMessageSize = 65536;
        // FF 57 has a slightly incorrect default remote max message size, so
        // we need to adjust it here to avoid a failure when sending.
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
        if (browserDetails.browser === 'firefox' && browserDetails.version === 57) maxMessageSize = 65535;
        const match = (0, (/*@__PURE__*/$parcel$interopDefault($68d92d6d835b94db$exports))).matchPrefix(description.sdp, 'a=max-message-size:');
        if (match.length > 0) maxMessageSize = parseInt(match[0].substring(19), 10);
        else if (browserDetails.browser === 'firefox' && remoteIsFirefox !== -1) // If the maximum message size is not present in the remote SDP and
        // both local and remote are Firefox, the remote peer can receive
        // ~2 GiB.
        maxMessageSize = 2147483637;
        return maxMessageSize;
    };
    const origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
        this._sctp = null;
        // Chrome decided to not expose .sctp in plan-b mode.
        // As usual, adapter.js has to do an 'ugly worakaround'
        // to cover up the mess.
        if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
            const { sdpSemantics: sdpSemantics } = this.getConfiguration();
            if (sdpSemantics === 'plan-b') Object.defineProperty(this, 'sctp', {
                get () {
                    return typeof this._sctp === 'undefined' ? null : this._sctp;
                },
                enumerable: true,
                configurable: true
            });
        }
        if (sctpInDescription(arguments[0])) {
            // Check if the remote is FF.
            const isFirefox = getRemoteFirefoxVersion(arguments[0]);
            // Get the maximum message size the local peer is capable of sending
            const canSendMMS = getCanSendMaxMessageSize(isFirefox);
            // Get the maximum message size of the remote peer.
            const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);
            // Determine final maximum message size
            let maxMessageSize;
            if (canSendMMS === 0 && remoteMMS === 0) maxMessageSize = Number.POSITIVE_INFINITY;
            else if (canSendMMS === 0 || remoteMMS === 0) maxMessageSize = Math.max(canSendMMS, remoteMMS);
            else maxMessageSize = Math.min(canSendMMS, remoteMMS);
            // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
            // attribute.
            const sctp = {};
            Object.defineProperty(sctp, 'maxMessageSize', {
                get () {
                    return maxMessageSize;
                }
            });
            this._sctp = sctp;
        }
        return origSetRemoteDescription.apply(this, arguments);
    };
}
function $4a0d4a9ee74b0777$export$d461c8d5c5db5da7(window) {
    if (!(window.RTCPeerConnection && 'createDataChannel' in window.RTCPeerConnection.prototype)) return;
    // Note: Although Firefox >= 57 has a native implementation, the maximum
    //       message size can be reset for all data channels at a later stage.
    //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
    function wrapDcSend(dc, pc) {
        const origDataChannelSend = dc.send;
        dc.send = function send() {
            const data = arguments[0];
            const length = data.length || data.size || data.byteLength;
            if (dc.readyState === 'open' && pc.sctp && length > pc.sctp.maxMessageSize) throw new TypeError('Message too large (can send a maximum of ' + pc.sctp.maxMessageSize + ' bytes)');
            return origDataChannelSend.apply(dc, arguments);
        };
    }
    const origCreateDataChannel = window.RTCPeerConnection.prototype.createDataChannel;
    window.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
        const dataChannel = origCreateDataChannel.apply(this, arguments);
        wrapDcSend(dataChannel, this);
        return dataChannel;
    };
    $b7dae01f7fd17da1$export$1f48841962b828b1(window, 'datachannel', (e)=>{
        wrapDcSend(e.channel, e.target);
        return e;
    });
}
function $4a0d4a9ee74b0777$export$63bb816cc75460(window) {
    if (!window.RTCPeerConnection || 'connectionState' in window.RTCPeerConnection.prototype) return;
    const proto = window.RTCPeerConnection.prototype;
    Object.defineProperty(proto, 'connectionState', {
        get () {
            return ({
                completed: 'connected',
                checking: 'connecting'
            })[this.iceConnectionState] || this.iceConnectionState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(proto, 'onconnectionstatechange', {
        get () {
            return this._onconnectionstatechange || null;
        },
        set (cb) {
            if (this._onconnectionstatechange) {
                this.removeEventListener('connectionstatechange', this._onconnectionstatechange);
                delete this._onconnectionstatechange;
            }
            if (cb) this.addEventListener('connectionstatechange', this._onconnectionstatechange = cb);
        },
        enumerable: true,
        configurable: true
    });
    [
        'setLocalDescription',
        'setRemoteDescription'
    ].forEach((method)=>{
        const origMethod = proto[method];
        proto[method] = function() {
            if (!this._connectionstatechangepoly) {
                this._connectionstatechangepoly = (e)=>{
                    const pc = e.target;
                    if (pc._lastConnectionState !== pc.connectionState) {
                        pc._lastConnectionState = pc.connectionState;
                        const newEvent = new Event('connectionstatechange', e);
                        pc.dispatchEvent(newEvent);
                    }
                    return e;
                };
                this.addEventListener('iceconnectionstatechange', this._connectionstatechangepoly);
            }
            return origMethod.apply(this, arguments);
        };
    });
}
function $4a0d4a9ee74b0777$export$a57d114344295149(window, browserDetails) {
    /* remove a=extmap-allow-mixed for webrtc.org < M71 */ if (!window.RTCPeerConnection) return;
    if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) return;
    if (browserDetails.browser === 'safari' && browserDetails.version >= 605) return;
    const nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
        if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
            const sdp = desc.sdp.split('\n').filter((line)=>{
                return line.trim() !== 'a=extmap-allow-mixed';
            }).join('\n');
            // Safari enforces read-only-ness of RTCSessionDescription fields.
            if (window.RTCSessionDescription && desc instanceof window.RTCSessionDescription) arguments[0] = new window.RTCSessionDescription({
                type: desc.type,
                sdp: sdp
            });
            else desc.sdp = sdp;
        }
        return nativeSRD.apply(this, arguments);
    };
}
function $4a0d4a9ee74b0777$export$51d5e40b48c771c7(window, browserDetails) {
    // Support for addIceCandidate(null or undefined)
    // as well as addIceCandidate({candidate: "", ...})
    // https://bugs.chromium.org/p/chromium/issues/detail?id=978582
    // Note: must be called before other polyfills which change the signature.
    if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) return;
    const nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
    if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) return;
    window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
        if (!arguments[0]) {
            if (arguments[1]) arguments[1].apply(null);
            return Promise.resolve();
        }
        // Firefox 68+ emits and processes {candidate: "", ...}, ignore
        // in older versions.
        // Native support for ignoring exists for Chrome M77+.
        // Safari ignores as well, exact version unknown but works in the same
        // version that also ignores addIceCandidate(null).
        if ((browserDetails.browser === 'chrome' && browserDetails.version < 78 || browserDetails.browser === 'firefox' && browserDetails.version < 68 || browserDetails.browser === 'safari') && arguments[0] && arguments[0].candidate === '') return Promise.resolve();
        return nativeAddIceCandidate.apply(this, arguments);
    };
}
function $4a0d4a9ee74b0777$export$7170d04e59f9d553(window, browserDetails) {
    if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) return;
    const nativeSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
    if (!nativeSetLocalDescription || nativeSetLocalDescription.length === 0) return;
    window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
        let desc = arguments[0] || {};
        if (typeof desc !== 'object' || desc.type && desc.sdp) return nativeSetLocalDescription.apply(this, arguments);
        // The remaining steps should technically happen when SLD comes off the
        // RTCPeerConnection's operations chain (not ahead of going on it), but
        // this is too difficult to shim. Instead, this shim only covers the
        // common case where the operations chain is empty. This is imperfect, but
        // should cover many cases. Rationale: Even if we can't reduce the glare
        // window to zero on imperfect implementations, there's value in tapping
        // into the perfect negotiation pattern that several browsers support.
        desc = {
            type: desc.type,
            sdp: desc.sdp
        };
        if (!desc.type) switch(this.signalingState){
            case 'stable':
            case 'have-local-offer':
            case 'have-remote-pranswer':
                desc.type = 'offer';
                break;
            default:
                desc.type = 'answer';
                break;
        }
        if (desc.sdp || desc.type !== 'offer' && desc.type !== 'answer') return nativeSetLocalDescription.apply(this, [
            desc
        ]);
        const func = desc.type === 'offer' ? this.createOffer : this.createAnswer;
        return func.apply(this).then((d)=>nativeSetLocalDescription.apply(this, [
                d
            ]));
    };
}



function $b9252250d6c37e0a$export$e77bf46c04ac7d12({ window: window } = {}, options = {
    shimChrome: true,
    shimFirefox: true,
    shimSafari: true
}) {
    // Utils.
    const logging = $b7dae01f7fd17da1$export$bef1f36f5486a6a3;
    const browserDetails = $b7dae01f7fd17da1$export$2d31490a0c05f094(window);
    const adapter = {
        browserDetails: browserDetails,
        commonShim: $4a0d4a9ee74b0777$exports,
        extractVersion: $b7dae01f7fd17da1$export$e3c02be309be1f23,
        disableLog: $b7dae01f7fd17da1$export$afbfee8cc06fd3e4,
        disableWarnings: $b7dae01f7fd17da1$export$51516be4b019e41e,
        sdp: // Expose sdp as a convenience. For production apps include directly.
        $68d92d6d835b94db$exports
    };
    // Shim browser if found.
    switch(browserDetails.browser){
        case 'chrome':
            if (!$25c38b78ffb66cc0$exports || !$25c38b78ffb66cc0$exports.shimPeerConnection || !options.shimChrome) {
                logging('Chrome shim is not included in this adapter release.');
                return adapter;
            }
            if (browserDetails.version === null) {
                logging('Chrome shim can not determine version, not shimming.');
                return adapter;
            }
            logging('adapter.js shimming chrome.');
            // Export to the adapter global object visible in the browser.
            adapter.browserShim = $25c38b78ffb66cc0$exports;
            // Must be called before shimPeerConnection.
            $4a0d4a9ee74b0777$export$51d5e40b48c771c7(window, browserDetails);
            $4a0d4a9ee74b0777$export$7170d04e59f9d553(window, browserDetails);
            $25c38b78ffb66cc0$exports.shimGetUserMedia(window, browserDetails);
            $25c38b78ffb66cc0$exports.shimMediaStream(window, browserDetails);
            $25c38b78ffb66cc0$exports.shimPeerConnection(window, browserDetails);
            $25c38b78ffb66cc0$exports.shimOnTrack(window, browserDetails);
            $25c38b78ffb66cc0$exports.shimAddTrackRemoveTrack(window, browserDetails);
            $25c38b78ffb66cc0$exports.shimGetSendersWithDtmf(window, browserDetails);
            $25c38b78ffb66cc0$exports.shimGetStats(window, browserDetails);
            $25c38b78ffb66cc0$exports.shimSenderReceiverGetStats(window, browserDetails);
            $25c38b78ffb66cc0$exports.fixNegotiationNeeded(window, browserDetails);
            $4a0d4a9ee74b0777$export$cf133661e444ccfe(window, browserDetails);
            $4a0d4a9ee74b0777$export$fdafb8d8280e29b5(window, browserDetails);
            $4a0d4a9ee74b0777$export$63bb816cc75460(window, browserDetails);
            $4a0d4a9ee74b0777$export$a99147c78a56edc4(window, browserDetails);
            $4a0d4a9ee74b0777$export$d461c8d5c5db5da7(window, browserDetails);
            $4a0d4a9ee74b0777$export$a57d114344295149(window, browserDetails);
            break;
        case 'firefox':
            if (!$33faccbba98b0a26$exports || !$33faccbba98b0a26$exports.shimPeerConnection || !options.shimFirefox) {
                logging('Firefox shim is not included in this adapter release.');
                return adapter;
            }
            logging('adapter.js shimming firefox.');
            // Export to the adapter global object visible in the browser.
            adapter.browserShim = $33faccbba98b0a26$exports;
            // Must be called before shimPeerConnection.
            $4a0d4a9ee74b0777$export$51d5e40b48c771c7(window, browserDetails);
            $4a0d4a9ee74b0777$export$7170d04e59f9d553(window, browserDetails);
            $33faccbba98b0a26$exports.shimGetUserMedia(window, browserDetails);
            $33faccbba98b0a26$exports.shimPeerConnection(window, browserDetails);
            $33faccbba98b0a26$exports.shimOnTrack(window, browserDetails);
            $33faccbba98b0a26$exports.shimRemoveStream(window, browserDetails);
            $33faccbba98b0a26$exports.shimSenderGetStats(window, browserDetails);
            $33faccbba98b0a26$exports.shimReceiverGetStats(window, browserDetails);
            $33faccbba98b0a26$exports.shimRTCDataChannel(window, browserDetails);
            $33faccbba98b0a26$exports.shimAddTransceiver(window, browserDetails);
            $33faccbba98b0a26$exports.shimGetParameters(window, browserDetails);
            $33faccbba98b0a26$exports.shimCreateOffer(window, browserDetails);
            $33faccbba98b0a26$exports.shimCreateAnswer(window, browserDetails);
            $4a0d4a9ee74b0777$export$cf133661e444ccfe(window, browserDetails);
            $4a0d4a9ee74b0777$export$63bb816cc75460(window, browserDetails);
            $4a0d4a9ee74b0777$export$a99147c78a56edc4(window, browserDetails);
            $4a0d4a9ee74b0777$export$d461c8d5c5db5da7(window, browserDetails);
            break;
        case 'safari':
            if (!$6d50fd7ff2a1bc1f$exports || !options.shimSafari) {
                logging('Safari shim is not included in this adapter release.');
                return adapter;
            }
            logging('adapter.js shimming safari.');
            // Export to the adapter global object visible in the browser.
            adapter.browserShim = $6d50fd7ff2a1bc1f$exports;
            // Must be called before shimCallbackAPI.
            $4a0d4a9ee74b0777$export$51d5e40b48c771c7(window, browserDetails);
            $4a0d4a9ee74b0777$export$7170d04e59f9d553(window, browserDetails);
            $6d50fd7ff2a1bc1f$exports.shimRTCIceServerUrls(window, browserDetails);
            $6d50fd7ff2a1bc1f$exports.shimCreateOfferLegacy(window, browserDetails);
            $6d50fd7ff2a1bc1f$exports.shimCallbacksAPI(window, browserDetails);
            $6d50fd7ff2a1bc1f$exports.shimLocalStreamsAPI(window, browserDetails);
            $6d50fd7ff2a1bc1f$exports.shimRemoteStreamsAPI(window, browserDetails);
            $6d50fd7ff2a1bc1f$exports.shimTrackEventTransceiver(window, browserDetails);
            $6d50fd7ff2a1bc1f$exports.shimGetUserMedia(window, browserDetails);
            $6d50fd7ff2a1bc1f$exports.shimAudioContext(window, browserDetails);
            $4a0d4a9ee74b0777$export$cf133661e444ccfe(window, browserDetails);
            $4a0d4a9ee74b0777$export$fdafb8d8280e29b5(window, browserDetails);
            $4a0d4a9ee74b0777$export$a99147c78a56edc4(window, browserDetails);
            $4a0d4a9ee74b0777$export$d461c8d5c5db5da7(window, browserDetails);
            $4a0d4a9ee74b0777$export$a57d114344295149(window, browserDetails);
            break;
        default:
            logging('Unsupported browser!');
            break;
    }
    return adapter;
}


'use strict';
const $038806bc06671657$var$adapter = (0, $b9252250d6c37e0a$export$e77bf46c04ac7d12)({
    window: typeof window === 'undefined' ? undefined : window
});
var $038806bc06671657$export$2e2bcd8739ae039 = $038806bc06671657$var$adapter;


var $f6af8687a2c23fac$exports = {};
"use strict";


var $f048fe83766b6c6f$require$Buffer = $f6af8687a2c23fac$exports.Buffer;
let $f048fe83766b6c6f$var$decoder;
try {
    $f048fe83766b6c6f$var$decoder = new TextDecoder();
} catch (error) {}
let $f048fe83766b6c6f$var$src;
let $f048fe83766b6c6f$var$srcEnd;
let $f048fe83766b6c6f$var$position = 0;
let $f048fe83766b6c6f$var$alreadySet;
const $f048fe83766b6c6f$var$EMPTY_ARRAY = [];
const $f048fe83766b6c6f$var$LEGACY_RECORD_INLINE_ID = 105;
const $f048fe83766b6c6f$var$RECORD_DEFINITIONS_ID = 0xdffe;
const $f048fe83766b6c6f$var$RECORD_INLINE_ID = 0xdfff // temporary first-come first-serve tag // proposed tag: 0x7265 // 're'
;
const $f048fe83766b6c6f$var$BUNDLED_STRINGS_ID = 0xdff9;
const $f048fe83766b6c6f$var$PACKED_TABLE_TAG_ID = 51;
const $f048fe83766b6c6f$var$PACKED_REFERENCE_TAG_ID = 6;
const $f048fe83766b6c6f$var$STOP_CODE = {};
let $f048fe83766b6c6f$var$strings = $f048fe83766b6c6f$var$EMPTY_ARRAY;
let $f048fe83766b6c6f$var$stringPosition = 0;
let $f048fe83766b6c6f$var$currentDecoder = {};
let $f048fe83766b6c6f$var$currentStructures;
let $f048fe83766b6c6f$var$srcString;
let $f048fe83766b6c6f$var$srcStringStart = 0;
let $f048fe83766b6c6f$var$srcStringEnd = 0;
let $f048fe83766b6c6f$var$bundledStrings;
let $f048fe83766b6c6f$var$referenceMap;
let $f048fe83766b6c6f$var$currentExtensions = [];
let $f048fe83766b6c6f$var$currentExtensionRanges = [];
let $f048fe83766b6c6f$var$packedValues;
let $f048fe83766b6c6f$var$dataView;
let $f048fe83766b6c6f$var$restoreMapsAsObject;
let $f048fe83766b6c6f$var$defaultOptions = {
    useRecords: false,
    mapsAsObjects: true
};
let $f048fe83766b6c6f$var$sequentialMode = false;
let $f048fe83766b6c6f$var$inlineObjectReadThreshold = 2;
var $f048fe83766b6c6f$var$BlockedFunction // we use search and replace to change the next call to BlockedFunction to avoid CSP issues for
;
// no-eval build
try {
    new Function('');
} catch (error) {
    // if eval variants are not supported, do not create inline object readers ever
    $f048fe83766b6c6f$var$inlineObjectReadThreshold = Infinity;
}
class $f048fe83766b6c6f$export$f9de6ca0bc043724 {
    constructor(options){
        if (options) {
            if ((options.keyMap || options._keyMap) && !options.useRecords) {
                options.useRecords = false;
                options.mapsAsObjects = true;
            }
            if (options.useRecords === false && options.mapsAsObjects === undefined) options.mapsAsObjects = true;
            if (options.getStructures) options.getShared = options.getStructures;
            if (options.getShared && !options.structures) (options.structures = []).uninitialized = true // this is what we use to denote an uninitialized structures
            ;
            if (options.keyMap) {
                this.mapKey = new Map();
                for (let [k, v] of Object.entries(options.keyMap))this.mapKey.set(v, k);
            }
        }
        Object.assign(this, options);
    }
    /*
	decodeKey(key) {
		return this.keyMap
			? Object.keys(this.keyMap)[Object.values(this.keyMap).indexOf(key)] || key
			: key
	}
	*/ decodeKey(key) {
        return this.keyMap ? this.mapKey.get(key) || key : key;
    }
    encodeKey(key) {
        return this.keyMap && this.keyMap.hasOwnProperty(key) ? this.keyMap[key] : key;
    }
    encodeKeys(rec) {
        if (!this._keyMap) return rec;
        let map = new Map();
        for (let [k, v] of Object.entries(rec))map.set(this._keyMap.hasOwnProperty(k) ? this._keyMap[k] : k, v);
        return map;
    }
    decodeKeys(map) {
        if (!this._keyMap || map.constructor.name != 'Map') return map;
        if (!this._mapKey) {
            this._mapKey = new Map();
            for (let [k, v] of Object.entries(this._keyMap))this._mapKey.set(v, k);
        }
        let res = {};
        //map.forEach((v,k) => res[Object.keys(this._keyMap)[Object.values(this._keyMap).indexOf(k)] || k] = v)
        map.forEach((v, k)=>res[$f048fe83766b6c6f$var$safeKey(this._mapKey.has(k) ? this._mapKey.get(k) : k)] = v);
        return res;
    }
    mapDecode(source, end) {
        let res = this.decode(source);
        if (this._keyMap) //Experiemntal support for Optimised KeyMap  decoding 
        switch(res.constructor.name){
            case 'Array':
                return res.map((r)=>this.decodeKeys(r));
        }
        return res;
    }
    decode(source, end) {
        if ($f048fe83766b6c6f$var$src) // re-entrant execution, save the state and restore it after we do this decode
        return $f048fe83766b6c6f$var$saveState(()=>{
            $f048fe83766b6c6f$export$e6f020404d5b6c15();
            return this ? this.decode(source, end) : $f048fe83766b6c6f$export$f9de6ca0bc043724.prototype.decode.call($f048fe83766b6c6f$var$defaultOptions, source, end);
        });
        $f048fe83766b6c6f$var$srcEnd = end > -1 ? end : source.length;
        $f048fe83766b6c6f$var$position = 0;
        $f048fe83766b6c6f$var$stringPosition = 0;
        $f048fe83766b6c6f$var$srcStringEnd = 0;
        $f048fe83766b6c6f$var$srcString = null;
        $f048fe83766b6c6f$var$strings = $f048fe83766b6c6f$var$EMPTY_ARRAY;
        $f048fe83766b6c6f$var$bundledStrings = null;
        $f048fe83766b6c6f$var$src = source;
        // this provides cached access to the data view for a buffer if it is getting reused, which is a recommend
        // technique for getting data from a database where it can be copied into an existing buffer instead of creating
        // new ones
        try {
            $f048fe83766b6c6f$var$dataView = source.dataView || (source.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength));
        } catch (error) {
            // if it doesn't have a buffer, maybe it is the wrong type of object
            $f048fe83766b6c6f$var$src = null;
            if (source instanceof Uint8Array) throw error;
            throw new Error('Source must be a Uint8Array or Buffer but was a ' + (source && typeof source == 'object' ? source.constructor.name : typeof source));
        }
        if (this instanceof $f048fe83766b6c6f$export$f9de6ca0bc043724) {
            $f048fe83766b6c6f$var$currentDecoder = this;
            $f048fe83766b6c6f$var$packedValues = this.sharedValues && (this.pack ? new Array(this.maxPrivatePackedValues || 16).concat(this.sharedValues) : this.sharedValues);
            if (this.structures) {
                $f048fe83766b6c6f$var$currentStructures = this.structures;
                return $f048fe83766b6c6f$export$8cb90b5f58dd32e2();
            } else if (!$f048fe83766b6c6f$var$currentStructures || $f048fe83766b6c6f$var$currentStructures.length > 0) $f048fe83766b6c6f$var$currentStructures = [];
        } else {
            $f048fe83766b6c6f$var$currentDecoder = $f048fe83766b6c6f$var$defaultOptions;
            if (!$f048fe83766b6c6f$var$currentStructures || $f048fe83766b6c6f$var$currentStructures.length > 0) $f048fe83766b6c6f$var$currentStructures = [];
            $f048fe83766b6c6f$var$packedValues = null;
        }
        return $f048fe83766b6c6f$export$8cb90b5f58dd32e2();
    }
    decodeMultiple(source, forEach) {
        let values, lastPosition = 0;
        try {
            let size = source.length;
            $f048fe83766b6c6f$var$sequentialMode = true;
            let value = this ? this.decode(source, size) : $f048fe83766b6c6f$var$defaultDecoder.decode(source, size);
            if (forEach) {
                if (forEach(value) === false) return;
                while($f048fe83766b6c6f$var$position < size){
                    lastPosition = $f048fe83766b6c6f$var$position;
                    if (forEach($f048fe83766b6c6f$export$8cb90b5f58dd32e2()) === false) return;
                }
            } else {
                values = [
                    value
                ];
                while($f048fe83766b6c6f$var$position < size){
                    lastPosition = $f048fe83766b6c6f$var$position;
                    values.push($f048fe83766b6c6f$export$8cb90b5f58dd32e2());
                }
                return values;
            }
        } catch (error) {
            error.lastPosition = lastPosition;
            error.values = values;
            throw error;
        } finally{
            $f048fe83766b6c6f$var$sequentialMode = false;
            $f048fe83766b6c6f$export$e6f020404d5b6c15();
        }
    }
}
function $f048fe83766b6c6f$export$1690e12b840569b9() {
    return $f048fe83766b6c6f$var$position;
}
function $f048fe83766b6c6f$export$8cb90b5f58dd32e2() {
    try {
        let result = $f048fe83766b6c6f$export$aafa59e2e03f2942();
        if ($f048fe83766b6c6f$var$bundledStrings) {
            if ($f048fe83766b6c6f$var$position >= $f048fe83766b6c6f$var$bundledStrings.postBundlePosition) {
                let error = new Error('Unexpected bundle position');
                error.incomplete = true;
                throw error;
            }
            // bundled strings to skip past
            $f048fe83766b6c6f$var$position = $f048fe83766b6c6f$var$bundledStrings.postBundlePosition;
            $f048fe83766b6c6f$var$bundledStrings = null;
        }
        if ($f048fe83766b6c6f$var$position == $f048fe83766b6c6f$var$srcEnd) {
            // finished reading this source, cleanup references
            $f048fe83766b6c6f$var$currentStructures = null;
            $f048fe83766b6c6f$var$src = null;
            if ($f048fe83766b6c6f$var$referenceMap) $f048fe83766b6c6f$var$referenceMap = null;
        } else if ($f048fe83766b6c6f$var$position > $f048fe83766b6c6f$var$srcEnd) {
            // over read
            let error = new Error('Unexpected end of CBOR data');
            error.incomplete = true;
            throw error;
        } else if (!$f048fe83766b6c6f$var$sequentialMode) throw new Error('Data read, but end of buffer not reached');
        // else more to read, but we are reading sequentially, so don't clear source yet
        return result;
    } catch (error) {
        $f048fe83766b6c6f$export$e6f020404d5b6c15();
        if (error instanceof RangeError || error.message.startsWith('Unexpected end of buffer')) error.incomplete = true;
        throw error;
    }
}
function $f048fe83766b6c6f$export$aafa59e2e03f2942() {
    let token = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
    let majorType = token >> 5;
    token = token & 0x1f;
    if (token > 0x17) switch(token){
        case 0x18:
            token = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
            break;
        case 0x19:
            if (majorType == 7) return $f048fe83766b6c6f$var$getFloat16();
            token = $f048fe83766b6c6f$var$dataView.getUint16($f048fe83766b6c6f$var$position);
            $f048fe83766b6c6f$var$position += 2;
            break;
        case 0x1a:
            if (majorType == 7) {
                let value = $f048fe83766b6c6f$var$dataView.getFloat32($f048fe83766b6c6f$var$position);
                if ($f048fe83766b6c6f$var$currentDecoder.useFloat32 > 2) {
                    // this does rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
                    let multiplier = $f048fe83766b6c6f$export$c652a5bbb6be7a36[($f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position] & 0x7f) << 1 | $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position + 1] >> 7];
                    $f048fe83766b6c6f$var$position += 4;
                    return (multiplier * value + (value > 0 ? 0.5 : -0.5) >> 0) / multiplier;
                }
                $f048fe83766b6c6f$var$position += 4;
                return value;
            }
            token = $f048fe83766b6c6f$var$dataView.getUint32($f048fe83766b6c6f$var$position);
            $f048fe83766b6c6f$var$position += 4;
            break;
        case 0x1b:
            if (majorType == 7) {
                let value = $f048fe83766b6c6f$var$dataView.getFloat64($f048fe83766b6c6f$var$position);
                $f048fe83766b6c6f$var$position += 8;
                return value;
            }
            if (majorType > 1) {
                if ($f048fe83766b6c6f$var$dataView.getUint32($f048fe83766b6c6f$var$position) > 0) throw new Error('JavaScript does not support arrays, maps, or strings with length over 4294967295');
                token = $f048fe83766b6c6f$var$dataView.getUint32($f048fe83766b6c6f$var$position + 4);
            } else if ($f048fe83766b6c6f$var$currentDecoder.int64AsNumber) {
                token = $f048fe83766b6c6f$var$dataView.getUint32($f048fe83766b6c6f$var$position) * 0x100000000;
                token += $f048fe83766b6c6f$var$dataView.getUint32($f048fe83766b6c6f$var$position + 4);
            } else token = $f048fe83766b6c6f$var$dataView.getBigUint64($f048fe83766b6c6f$var$position);
            $f048fe83766b6c6f$var$position += 8;
            break;
        case 0x1f:
            // indefinite length
            switch(majorType){
                case 2:
                case 3:
                    throw new Error('Indefinite length not supported for byte or text strings');
                case 4:
                    let array = [];
                    let value, i = 0;
                    while((value = $f048fe83766b6c6f$export$aafa59e2e03f2942()) != $f048fe83766b6c6f$var$STOP_CODE)array[i++] = value;
                    return majorType == 4 ? array : majorType == 3 ? array.join('') : $f048fe83766b6c6f$require$Buffer.concat(array);
                case 5:
                    let key;
                    if ($f048fe83766b6c6f$var$currentDecoder.mapsAsObjects) {
                        let object = {};
                        if ($f048fe83766b6c6f$var$currentDecoder.keyMap) while((key = $f048fe83766b6c6f$export$aafa59e2e03f2942()) != $f048fe83766b6c6f$var$STOP_CODE)object[$f048fe83766b6c6f$var$safeKey($f048fe83766b6c6f$var$currentDecoder.decodeKey(key))] = $f048fe83766b6c6f$export$aafa59e2e03f2942();
                        else while((key = $f048fe83766b6c6f$export$aafa59e2e03f2942()) != $f048fe83766b6c6f$var$STOP_CODE)object[$f048fe83766b6c6f$var$safeKey(key)] = $f048fe83766b6c6f$export$aafa59e2e03f2942();
                        return object;
                    } else {
                        if ($f048fe83766b6c6f$var$restoreMapsAsObject) {
                            $f048fe83766b6c6f$var$currentDecoder.mapsAsObjects = true;
                            $f048fe83766b6c6f$var$restoreMapsAsObject = false;
                        }
                        let map = new Map();
                        if ($f048fe83766b6c6f$var$currentDecoder.keyMap) while((key = $f048fe83766b6c6f$export$aafa59e2e03f2942()) != $f048fe83766b6c6f$var$STOP_CODE)map.set($f048fe83766b6c6f$var$currentDecoder.decodeKey(key), $f048fe83766b6c6f$export$aafa59e2e03f2942());
                        else while((key = $f048fe83766b6c6f$export$aafa59e2e03f2942()) != $f048fe83766b6c6f$var$STOP_CODE)map.set(key, $f048fe83766b6c6f$export$aafa59e2e03f2942());
                        return map;
                    }
                case 7:
                    return $f048fe83766b6c6f$var$STOP_CODE;
                default:
                    throw new Error('Invalid major type for indefinite length ' + majorType);
            }
        default:
            throw new Error('Unknown token ' + token);
    }
    switch(majorType){
        case 0:
            return token;
        case 1:
            return ~token;
        case 2:
            return $f048fe83766b6c6f$var$readBin(token);
        case 3:
            if ($f048fe83766b6c6f$var$srcStringEnd >= $f048fe83766b6c6f$var$position) return $f048fe83766b6c6f$var$srcString.slice($f048fe83766b6c6f$var$position - $f048fe83766b6c6f$var$srcStringStart, ($f048fe83766b6c6f$var$position += token) - $f048fe83766b6c6f$var$srcStringStart);
            if ($f048fe83766b6c6f$var$srcStringEnd == 0 && $f048fe83766b6c6f$var$srcEnd < 140 && token < 32) {
                // for small blocks, avoiding the overhead of the extract call is helpful
                let string = token < 16 ? $f048fe83766b6c6f$var$shortStringInJS(token) : $f048fe83766b6c6f$var$longStringInJS(token);
                if (string != null) return string;
            }
            return $f048fe83766b6c6f$var$readFixedString(token);
        case 4:
            let array1 = new Array(token);
            //if (currentDecoder.keyMap) for (let i = 0; i < token; i++) array[i] = currentDecoder.decodeKey(read())	
            //else 
            for(let i = 0; i < token; i++)array1[i] = $f048fe83766b6c6f$export$aafa59e2e03f2942();
            return array1;
        case 5:
            if ($f048fe83766b6c6f$var$currentDecoder.mapsAsObjects) {
                let object = {};
                if ($f048fe83766b6c6f$var$currentDecoder.keyMap) for(let i = 0; i < token; i++)object[$f048fe83766b6c6f$var$safeKey($f048fe83766b6c6f$var$currentDecoder.decodeKey($f048fe83766b6c6f$export$aafa59e2e03f2942()))] = $f048fe83766b6c6f$export$aafa59e2e03f2942();
                else for(let i = 0; i < token; i++)object[$f048fe83766b6c6f$var$safeKey($f048fe83766b6c6f$export$aafa59e2e03f2942())] = $f048fe83766b6c6f$export$aafa59e2e03f2942();
                return object;
            } else {
                if ($f048fe83766b6c6f$var$restoreMapsAsObject) {
                    $f048fe83766b6c6f$var$currentDecoder.mapsAsObjects = true;
                    $f048fe83766b6c6f$var$restoreMapsAsObject = false;
                }
                let map = new Map();
                if ($f048fe83766b6c6f$var$currentDecoder.keyMap) for(let i = 0; i < token; i++)map.set($f048fe83766b6c6f$var$currentDecoder.decodeKey($f048fe83766b6c6f$export$aafa59e2e03f2942()), $f048fe83766b6c6f$export$aafa59e2e03f2942());
                else for(let i = 0; i < token; i++)map.set($f048fe83766b6c6f$export$aafa59e2e03f2942(), $f048fe83766b6c6f$export$aafa59e2e03f2942());
                return map;
            }
        case 6:
            if (token >= $f048fe83766b6c6f$var$BUNDLED_STRINGS_ID) {
                let structure = $f048fe83766b6c6f$var$currentStructures[token & 0x1fff] // check record structures first
                ;
                // At some point we may provide an option for dynamic tag assignment with a range like token >= 8 && (token < 16 || (token > 0x80 && token < 0xc0) || (token > 0x130 && token < 0x4000))
                if (structure) {
                    if (!structure.read) structure.read = $f048fe83766b6c6f$var$createStructureReader(structure);
                    return structure.read();
                }
                if (token < 0x10000) {
                    if (token == $f048fe83766b6c6f$var$RECORD_INLINE_ID) {
                        // currentExtensions as densely stored array (v8 stores arrays densely under about 3000 elements)
                        let length = $f048fe83766b6c6f$var$readJustLength();
                        let id = $f048fe83766b6c6f$export$aafa59e2e03f2942();
                        let structure = $f048fe83766b6c6f$export$aafa59e2e03f2942();
                        $f048fe83766b6c6f$var$recordDefinition(id, structure);
                        let object = {};
                        if ($f048fe83766b6c6f$var$currentDecoder.keyMap) for(let i = 2; i < length; i++){
                            let key = $f048fe83766b6c6f$var$currentDecoder.decodeKey(structure[i - 2]);
                            object[$f048fe83766b6c6f$var$safeKey(key)] = $f048fe83766b6c6f$export$aafa59e2e03f2942();
                        }
                        else for(let i = 2; i < length; i++){
                            let key = structure[i - 2];
                            object[$f048fe83766b6c6f$var$safeKey(key)] = $f048fe83766b6c6f$export$aafa59e2e03f2942();
                        }
                        return object;
                    } else if (token == $f048fe83766b6c6f$var$RECORD_DEFINITIONS_ID) {
                        let length = $f048fe83766b6c6f$var$readJustLength();
                        let id = $f048fe83766b6c6f$export$aafa59e2e03f2942();
                        for(let i = 2; i < length; i++)$f048fe83766b6c6f$var$recordDefinition(id++, $f048fe83766b6c6f$export$aafa59e2e03f2942());
                        return $f048fe83766b6c6f$export$aafa59e2e03f2942();
                    } else if (token == $f048fe83766b6c6f$var$BUNDLED_STRINGS_ID) return $f048fe83766b6c6f$var$readBundleExt();
                    if ($f048fe83766b6c6f$var$currentDecoder.getShared) {
                        $f048fe83766b6c6f$var$loadShared();
                        structure = $f048fe83766b6c6f$var$currentStructures[token & 0x1fff];
                        if (structure) {
                            if (!structure.read) structure.read = $f048fe83766b6c6f$var$createStructureReader(structure);
                            return structure.read();
                        }
                    }
                }
            }
            let extension = $f048fe83766b6c6f$var$currentExtensions[token];
            if (extension) {
                if (extension.handlesRead) return extension($f048fe83766b6c6f$export$aafa59e2e03f2942);
                else return extension($f048fe83766b6c6f$export$aafa59e2e03f2942());
            } else {
                let input = $f048fe83766b6c6f$export$aafa59e2e03f2942();
                for(let i = 0; i < $f048fe83766b6c6f$var$currentExtensionRanges.length; i++){
                    let value = $f048fe83766b6c6f$var$currentExtensionRanges[i](token, input);
                    if (value !== undefined) return value;
                }
                return new $f048fe83766b6c6f$export$3288d34c523a1192(input, token);
            }
        case 7:
            switch(token){
                case 0x14:
                    return false;
                case 0x15:
                    return true;
                case 0x16:
                    return null;
                case 0x17:
                    return; // undefined
                case 0x1f:
                default:
                    let packedValue = ($f048fe83766b6c6f$var$packedValues || $f048fe83766b6c6f$var$getPackedValues())[token];
                    if (packedValue !== undefined) return packedValue;
                    throw new Error('Unknown token ' + token);
            }
        default:
            if (isNaN(token)) {
                let error = new Error('Unexpected end of CBOR data');
                error.incomplete = true;
                throw error;
            }
            throw new Error('Unknown CBOR token ' + token);
    }
}
const $f048fe83766b6c6f$var$validName = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
function $f048fe83766b6c6f$var$createStructureReader(structure) {
    function readObject() {
        // get the array size from the header
        let length = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
        //let majorType = token >> 5
        length = length & 0x1f;
        if (length > 0x17) switch(length){
            case 0x18:
                length = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                break;
            case 0x19:
                length = $f048fe83766b6c6f$var$dataView.getUint16($f048fe83766b6c6f$var$position);
                $f048fe83766b6c6f$var$position += 2;
                break;
            case 0x1a:
                length = $f048fe83766b6c6f$var$dataView.getUint32($f048fe83766b6c6f$var$position);
                $f048fe83766b6c6f$var$position += 4;
                break;
            default:
                throw new Error('Expected array header, but got ' + $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position - 1]);
        }
        // This initial function is quick to instantiate, but runs slower. After several iterations pay the cost to build the faster function
        let compiledReader = this.compiledReader // first look to see if we have the fast compiled function
        ;
        while(compiledReader){
            // we have a fast compiled object literal reader
            if (compiledReader.propertyCount === length) return compiledReader($f048fe83766b6c6f$export$aafa59e2e03f2942) // with the right length, so we use it
            ;
            compiledReader = compiledReader.next // see if there is another reader with the right length
            ;
        }
        if (this.slowReads++ >= $f048fe83766b6c6f$var$inlineObjectReadThreshold) {
            let array = this.length == length ? this : this.slice(0, length);
            compiledReader = $f048fe83766b6c6f$var$currentDecoder.keyMap ? new Function('r', 'return {' + array.map((k)=>$f048fe83766b6c6f$var$currentDecoder.decodeKey(k)).map((k)=>$f048fe83766b6c6f$var$validName.test(k) ? $f048fe83766b6c6f$var$safeKey(k) + ':r()' : '[' + JSON.stringify(k) + ']:r()').join(',') + '}') : new Function('r', 'return {' + array.map((key)=>$f048fe83766b6c6f$var$validName.test(key) ? $f048fe83766b6c6f$var$safeKey(key) + ':r()' : '[' + JSON.stringify(key) + ']:r()').join(',') + '}');
            if (this.compiledReader) compiledReader.next = this.compiledReader // if there is an existing one, we store multiple readers as a linked list because it is usually pretty rare to have multiple readers (of different length) for the same structure
            ;
            compiledReader.propertyCount = length;
            this.compiledReader = compiledReader;
            return compiledReader($f048fe83766b6c6f$export$aafa59e2e03f2942);
        }
        let object = {};
        if ($f048fe83766b6c6f$var$currentDecoder.keyMap) for(let i = 0; i < length; i++)object[$f048fe83766b6c6f$var$safeKey($f048fe83766b6c6f$var$currentDecoder.decodeKey(this[i]))] = $f048fe83766b6c6f$export$aafa59e2e03f2942();
        else for(let i = 0; i < length; i++)object[$f048fe83766b6c6f$var$safeKey(this[i])] = $f048fe83766b6c6f$export$aafa59e2e03f2942();
        return object;
    }
    structure.slowReads = 0;
    return readObject;
}
function $f048fe83766b6c6f$var$safeKey(key) {
    return key === '__proto__' ? '__proto_' : key;
}
let $f048fe83766b6c6f$var$readFixedString = $f048fe83766b6c6f$var$readStringJS;
let $f048fe83766b6c6f$var$readString8 = $f048fe83766b6c6f$var$readStringJS;
let $f048fe83766b6c6f$var$readString16 = $f048fe83766b6c6f$var$readStringJS;
let $f048fe83766b6c6f$var$readString32 = $f048fe83766b6c6f$var$readStringJS;
let $f048fe83766b6c6f$export$ae7c2166c4fa454a = false;
function $f048fe83766b6c6f$export$b9cf06aee99126ca(extractStrings) {
    $f048fe83766b6c6f$export$ae7c2166c4fa454a = true;
    $f048fe83766b6c6f$var$readFixedString = readString(1);
    $f048fe83766b6c6f$var$readString8 = readString(2);
    $f048fe83766b6c6f$var$readString16 = readString(3);
    $f048fe83766b6c6f$var$readString32 = readString(5);
    function readString(headerLength) {
        return function readString(length) {
            let string = $f048fe83766b6c6f$var$strings[$f048fe83766b6c6f$var$stringPosition++];
            if (string == null) {
                if ($f048fe83766b6c6f$var$bundledStrings) return $f048fe83766b6c6f$var$readStringJS(length);
                let extraction = extractStrings($f048fe83766b6c6f$var$position, $f048fe83766b6c6f$var$srcEnd, length, $f048fe83766b6c6f$var$src);
                if (typeof extraction == 'string') {
                    string = extraction;
                    $f048fe83766b6c6f$var$strings = $f048fe83766b6c6f$var$EMPTY_ARRAY;
                } else {
                    $f048fe83766b6c6f$var$strings = extraction;
                    $f048fe83766b6c6f$var$stringPosition = 1;
                    $f048fe83766b6c6f$var$srcStringEnd = 1 // even if a utf-8 string was decoded, must indicate we are in the midst of extracted strings and can't skip strings
                    ;
                    string = $f048fe83766b6c6f$var$strings[0];
                    if (string === undefined) throw new Error('Unexpected end of buffer');
                }
            }
            let srcStringLength = string.length;
            if (srcStringLength <= length) {
                $f048fe83766b6c6f$var$position += length;
                return string;
            }
            $f048fe83766b6c6f$var$srcString = string;
            $f048fe83766b6c6f$var$srcStringStart = $f048fe83766b6c6f$var$position;
            $f048fe83766b6c6f$var$srcStringEnd = $f048fe83766b6c6f$var$position + srcStringLength;
            $f048fe83766b6c6f$var$position += length;
            return string.slice(0, length) // we know we just want the beginning
            ;
        };
    }
}
function $f048fe83766b6c6f$var$readStringJS(length) {
    let result;
    if (length < 16) {
        if (result = $f048fe83766b6c6f$var$shortStringInJS(length)) return result;
    }
    if (length > 64 && $f048fe83766b6c6f$var$decoder) return $f048fe83766b6c6f$var$decoder.decode($f048fe83766b6c6f$var$src.subarray($f048fe83766b6c6f$var$position, $f048fe83766b6c6f$var$position += length));
    const end = $f048fe83766b6c6f$var$position + length;
    const units = [];
    result = '';
    while($f048fe83766b6c6f$var$position < end){
        const byte1 = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
        if ((byte1 & 0x80) === 0) // 1 byte
        units.push(byte1);
        else if ((byte1 & 0xe0) === 0xc0) {
            // 2 bytes
            const byte2 = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++] & 0x3f;
            units.push((byte1 & 0x1f) << 6 | byte2);
        } else if ((byte1 & 0xf0) === 0xe0) {
            // 3 bytes
            const byte2 = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++] & 0x3f;
            const byte3 = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++] & 0x3f;
            units.push((byte1 & 0x1f) << 12 | byte2 << 6 | byte3);
        } else if ((byte1 & 0xf8) === 0xf0) {
            // 4 bytes
            const byte2 = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++] & 0x3f;
            const byte3 = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++] & 0x3f;
            const byte4 = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++] & 0x3f;
            let unit = (byte1 & 0x07) << 0x12 | byte2 << 0x0c | byte3 << 0x06 | byte4;
            if (unit > 0xffff) {
                unit -= 0x10000;
                units.push(unit >>> 10 & 0x3ff | 0xd800);
                unit = 0xdc00 | unit & 0x3ff;
            }
            units.push(unit);
        } else units.push(byte1);
        if (units.length >= 0x1000) {
            result += $f048fe83766b6c6f$var$fromCharCode.apply(String, units);
            units.length = 0;
        }
    }
    if (units.length > 0) result += $f048fe83766b6c6f$var$fromCharCode.apply(String, units);
    return result;
}
let $f048fe83766b6c6f$var$fromCharCode = String.fromCharCode;
function $f048fe83766b6c6f$var$longStringInJS(length) {
    let start = $f048fe83766b6c6f$var$position;
    let bytes = new Array(length);
    for(let i = 0; i < length; i++){
        const byte = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
        if ((byte & 0x80) > 0) {
            $f048fe83766b6c6f$var$position = start;
            return;
        }
        bytes[i] = byte;
    }
    return $f048fe83766b6c6f$var$fromCharCode.apply(String, bytes);
}
function $f048fe83766b6c6f$var$shortStringInJS(length) {
    if (length < 4) {
        if (length < 2) {
            if (length === 0) return '';
            else {
                let a = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                if ((a & 0x80) > 1) {
                    $f048fe83766b6c6f$var$position -= 1;
                    return;
                }
                return $f048fe83766b6c6f$var$fromCharCode(a);
            }
        } else {
            let a = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
            let b = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
            if ((a & 0x80) > 0 || (b & 0x80) > 0) {
                $f048fe83766b6c6f$var$position -= 2;
                return;
            }
            if (length < 3) return $f048fe83766b6c6f$var$fromCharCode(a, b);
            let c = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
            if ((c & 0x80) > 0) {
                $f048fe83766b6c6f$var$position -= 3;
                return;
            }
            return $f048fe83766b6c6f$var$fromCharCode(a, b, c);
        }
    } else {
        let a = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
        let b = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
        let c = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
        let d = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
        if ((a & 0x80) > 0 || (b & 0x80) > 0 || (c & 0x80) > 0 || (d & 0x80) > 0) {
            $f048fe83766b6c6f$var$position -= 4;
            return;
        }
        if (length < 6) {
            if (length === 4) return $f048fe83766b6c6f$var$fromCharCode(a, b, c, d);
            else {
                let e = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                if ((e & 0x80) > 0) {
                    $f048fe83766b6c6f$var$position -= 5;
                    return;
                }
                return $f048fe83766b6c6f$var$fromCharCode(a, b, c, d, e);
            }
        } else if (length < 8) {
            let e = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
            let f = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
            if ((e & 0x80) > 0 || (f & 0x80) > 0) {
                $f048fe83766b6c6f$var$position -= 6;
                return;
            }
            if (length < 7) return $f048fe83766b6c6f$var$fromCharCode(a, b, c, d, e, f);
            let g = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
            if ((g & 0x80) > 0) {
                $f048fe83766b6c6f$var$position -= 7;
                return;
            }
            return $f048fe83766b6c6f$var$fromCharCode(a, b, c, d, e, f, g);
        } else {
            let e = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
            let f = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
            let g = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
            let h = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
            if ((e & 0x80) > 0 || (f & 0x80) > 0 || (g & 0x80) > 0 || (h & 0x80) > 0) {
                $f048fe83766b6c6f$var$position -= 8;
                return;
            }
            if (length < 10) {
                if (length === 8) return $f048fe83766b6c6f$var$fromCharCode(a, b, c, d, e, f, g, h);
                else {
                    let i = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                    if ((i & 0x80) > 0) {
                        $f048fe83766b6c6f$var$position -= 9;
                        return;
                    }
                    return $f048fe83766b6c6f$var$fromCharCode(a, b, c, d, e, f, g, h, i);
                }
            } else if (length < 12) {
                let i = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                let j = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                if ((i & 0x80) > 0 || (j & 0x80) > 0) {
                    $f048fe83766b6c6f$var$position -= 10;
                    return;
                }
                if (length < 11) return $f048fe83766b6c6f$var$fromCharCode(a, b, c, d, e, f, g, h, i, j);
                let k = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                if ((k & 0x80) > 0) {
                    $f048fe83766b6c6f$var$position -= 11;
                    return;
                }
                return $f048fe83766b6c6f$var$fromCharCode(a, b, c, d, e, f, g, h, i, j, k);
            } else {
                let i = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                let j = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                let k = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                let l = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                if ((i & 0x80) > 0 || (j & 0x80) > 0 || (k & 0x80) > 0 || (l & 0x80) > 0) {
                    $f048fe83766b6c6f$var$position -= 12;
                    return;
                }
                if (length < 14) {
                    if (length === 12) return $f048fe83766b6c6f$var$fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l);
                    else {
                        let m = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                        if ((m & 0x80) > 0) {
                            $f048fe83766b6c6f$var$position -= 13;
                            return;
                        }
                        return $f048fe83766b6c6f$var$fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m);
                    }
                } else {
                    let m = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                    let n = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                    if ((m & 0x80) > 0 || (n & 0x80) > 0) {
                        $f048fe83766b6c6f$var$position -= 14;
                        return;
                    }
                    if (length < 15) return $f048fe83766b6c6f$var$fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
                    let o = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
                    if ((o & 0x80) > 0) {
                        $f048fe83766b6c6f$var$position -= 15;
                        return;
                    }
                    return $f048fe83766b6c6f$var$fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
                }
            }
        }
    }
}
function $f048fe83766b6c6f$var$readBin(length) {
    return $f048fe83766b6c6f$var$currentDecoder.copyBuffers ? // specifically use the copying slice (not the node one)
    Uint8Array.prototype.slice.call($f048fe83766b6c6f$var$src, $f048fe83766b6c6f$var$position, $f048fe83766b6c6f$var$position += length) : $f048fe83766b6c6f$var$src.subarray($f048fe83766b6c6f$var$position, $f048fe83766b6c6f$var$position += length);
}
function $f048fe83766b6c6f$var$readExt(length) {
    let type = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
    if ($f048fe83766b6c6f$var$currentExtensions[type]) return $f048fe83766b6c6f$var$currentExtensions[type]($f048fe83766b6c6f$var$src.subarray($f048fe83766b6c6f$var$position, $f048fe83766b6c6f$var$position += length));
    else throw new Error('Unknown extension type ' + type);
}
let $f048fe83766b6c6f$var$f32Array = new Float32Array(1);
let $f048fe83766b6c6f$var$u8Array = new Uint8Array($f048fe83766b6c6f$var$f32Array.buffer, 0, 4);
function $f048fe83766b6c6f$var$getFloat16() {
    let byte0 = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
    let byte1 = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
    let exponent = (byte0 & 0x7f) >> 2;
    if (exponent === 0x1f) {
        if (byte1 || byte0 & 3) return NaN;
        return byte0 & 0x80 ? -Infinity : Infinity;
    }
    if (exponent === 0) {
        // significand with 10 fractional bits and divided by 2^14
        let abs = ((byte0 & 3) << 8 | byte1) / 16777216;
        return byte0 & 0x80 ? -abs : abs;
    }
    $f048fe83766b6c6f$var$u8Array[3] = byte0 & 0x80 | // sign bit
    (exponent >> 1) + 56 // 4 of 5 of the exponent bits, re-offset-ed
    ;
    $f048fe83766b6c6f$var$u8Array[2] = (byte0 & 7) << 5 | // last exponent bit and first two mantissa bits
    byte1 >> 3 // next 5 bits of mantissa
    ;
    $f048fe83766b6c6f$var$u8Array[1] = byte1 << 5; // last three bits of mantissa
    $f048fe83766b6c6f$var$u8Array[0] = 0;
    return $f048fe83766b6c6f$var$f32Array[0];
}
let $f048fe83766b6c6f$var$keyCache = new Array(4096);
function $f048fe83766b6c6f$var$readKey() {
    let length = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
    if (length >= 0x60 && length < 0x78) {
        // fixstr, potentially use key cache
        length = length - 0x60;
        if ($f048fe83766b6c6f$var$srcStringEnd >= $f048fe83766b6c6f$var$position) return $f048fe83766b6c6f$var$srcString.slice($f048fe83766b6c6f$var$position - $f048fe83766b6c6f$var$srcStringStart, ($f048fe83766b6c6f$var$position += length) - $f048fe83766b6c6f$var$srcStringStart);
        else if (!($f048fe83766b6c6f$var$srcStringEnd == 0 && $f048fe83766b6c6f$var$srcEnd < 180)) return $f048fe83766b6c6f$var$readFixedString(length);
    } else {
        $f048fe83766b6c6f$var$position--;
        return $f048fe83766b6c6f$export$aafa59e2e03f2942();
    }
    let key = (length << 5 ^ (length > 1 ? $f048fe83766b6c6f$var$dataView.getUint16($f048fe83766b6c6f$var$position) : length > 0 ? $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position] : 0)) & 0xfff;
    let entry = $f048fe83766b6c6f$var$keyCache[key];
    let checkPosition = $f048fe83766b6c6f$var$position;
    let end = $f048fe83766b6c6f$var$position + length - 3;
    let chunk;
    let i = 0;
    if (entry && entry.bytes == length) {
        while(checkPosition < end){
            chunk = $f048fe83766b6c6f$var$dataView.getUint32(checkPosition);
            if (chunk != entry[i++]) {
                checkPosition = 0x70000000;
                break;
            }
            checkPosition += 4;
        }
        end += 3;
        while(checkPosition < end){
            chunk = $f048fe83766b6c6f$var$src[checkPosition++];
            if (chunk != entry[i++]) {
                checkPosition = 0x70000000;
                break;
            }
        }
        if (checkPosition === end) {
            $f048fe83766b6c6f$var$position = checkPosition;
            return entry.string;
        }
        end -= 3;
        checkPosition = $f048fe83766b6c6f$var$position;
    }
    entry = [];
    $f048fe83766b6c6f$var$keyCache[key] = entry;
    entry.bytes = length;
    while(checkPosition < end){
        chunk = $f048fe83766b6c6f$var$dataView.getUint32(checkPosition);
        entry.push(chunk);
        checkPosition += 4;
    }
    end += 3;
    while(checkPosition < end){
        chunk = $f048fe83766b6c6f$var$src[checkPosition++];
        entry.push(chunk);
    }
    // for small blocks, avoiding the overhead of the extract call is helpful
    let string = length < 16 ? $f048fe83766b6c6f$var$shortStringInJS(length) : $f048fe83766b6c6f$var$longStringInJS(length);
    if (string != null) return entry.string = string;
    return entry.string = $f048fe83766b6c6f$var$readFixedString(length);
}
class $f048fe83766b6c6f$export$3288d34c523a1192 {
    constructor(value, tag){
        this.value = value;
        this.tag = tag;
    }
}
$f048fe83766b6c6f$var$currentExtensions[0] = (dateString)=>{
    // string date extension
    return new Date(dateString);
};
$f048fe83766b6c6f$var$currentExtensions[1] = (epochSec)=>{
    // numeric date extension
    return new Date(Math.round(epochSec * 1000));
};
$f048fe83766b6c6f$var$currentExtensions[2] = (buffer)=>{
    // bigint extension
    let value = BigInt(0);
    for(let i = 0, l = buffer.byteLength; i < l; i++)value = BigInt(buffer[i]) + value << BigInt(8);
    return value;
};
$f048fe83766b6c6f$var$currentExtensions[3] = (buffer)=>{
    // negative bigint extension
    return BigInt(-1) - $f048fe83766b6c6f$var$currentExtensions[2](buffer);
};
$f048fe83766b6c6f$var$currentExtensions[4] = (fraction)=>{
    // best to reparse to maintain accuracy
    return +(fraction[1] + 'e' + fraction[0]);
};
$f048fe83766b6c6f$var$currentExtensions[5] = (fraction)=>{
    // probably not sufficiently accurate
    return fraction[1] * Math.exp(fraction[0] * Math.log(2));
};
// the registration of the record definition extension
const $f048fe83766b6c6f$var$recordDefinition = (id, structure)=>{
    id = id - 0xe000;
    let existingStructure = $f048fe83766b6c6f$var$currentStructures[id];
    if (existingStructure && existingStructure.isShared) ($f048fe83766b6c6f$var$currentStructures.restoreStructures || ($f048fe83766b6c6f$var$currentStructures.restoreStructures = []))[id] = existingStructure;
    $f048fe83766b6c6f$var$currentStructures[id] = structure;
    structure.read = $f048fe83766b6c6f$var$createStructureReader(structure);
};
$f048fe83766b6c6f$var$currentExtensions[$f048fe83766b6c6f$var$LEGACY_RECORD_INLINE_ID] = (data)=>{
    let length = data.length;
    let structure = data[1];
    $f048fe83766b6c6f$var$recordDefinition(data[0], structure);
    let object = {};
    for(let i = 2; i < length; i++){
        let key = structure[i - 2];
        object[$f048fe83766b6c6f$var$safeKey(key)] = data[i];
    }
    return object;
};
$f048fe83766b6c6f$var$currentExtensions[14] = (value)=>{
    if ($f048fe83766b6c6f$var$bundledStrings) return $f048fe83766b6c6f$var$bundledStrings[0].slice($f048fe83766b6c6f$var$bundledStrings.position0, $f048fe83766b6c6f$var$bundledStrings.position0 += value);
    return new $f048fe83766b6c6f$export$3288d34c523a1192(value, 14);
};
$f048fe83766b6c6f$var$currentExtensions[15] = (value)=>{
    if ($f048fe83766b6c6f$var$bundledStrings) return $f048fe83766b6c6f$var$bundledStrings[1].slice($f048fe83766b6c6f$var$bundledStrings.position1, $f048fe83766b6c6f$var$bundledStrings.position1 += value);
    return new $f048fe83766b6c6f$export$3288d34c523a1192(value, 15);
};
let $f048fe83766b6c6f$var$glbl = {
    Error: Error,
    RegExp: RegExp
};
$f048fe83766b6c6f$var$currentExtensions[27] = (data)=>{
    return ($f048fe83766b6c6f$var$glbl[data[0]] || Error)(data[1], data[2]);
};
const $f048fe83766b6c6f$var$packedTable = (read)=>{
    if ($f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++] != 0x84) throw new Error('Packed values structure must be followed by a 4 element array');
    let newPackedValues = read() // packed values
    ;
    $f048fe83766b6c6f$var$packedValues = $f048fe83766b6c6f$var$packedValues ? newPackedValues.concat($f048fe83766b6c6f$var$packedValues.slice(newPackedValues.length)) : newPackedValues;
    $f048fe83766b6c6f$var$packedValues.prefixes = read();
    $f048fe83766b6c6f$var$packedValues.suffixes = read();
    return read() // read the rump
    ;
};
$f048fe83766b6c6f$var$packedTable.handlesRead = true;
$f048fe83766b6c6f$var$currentExtensions[51] = $f048fe83766b6c6f$var$packedTable;
$f048fe83766b6c6f$var$currentExtensions[$f048fe83766b6c6f$var$PACKED_REFERENCE_TAG_ID] = (data)=>{
    if (!$f048fe83766b6c6f$var$packedValues) {
        if ($f048fe83766b6c6f$var$currentDecoder.getShared) $f048fe83766b6c6f$var$loadShared();
        else return new $f048fe83766b6c6f$export$3288d34c523a1192(data, $f048fe83766b6c6f$var$PACKED_REFERENCE_TAG_ID);
    }
    if (typeof data == 'number') return $f048fe83766b6c6f$var$packedValues[16 + (data >= 0 ? 2 * data : -2 * data - 1)];
    throw new Error('No support for non-integer packed references yet');
};
// The following code is an incomplete implementation of http://cbor.schmorp.de/stringref
// the real thing would need to implemennt more logic to populate the stringRefs table and
// maintain a stack of stringRef "namespaces".
//
// currentExtensions[25] = (id) => {
// 	return stringRefs[id]
// }
// currentExtensions[256] = (read) => {
// 	stringRefs = []
// 	try {
// 		return read()
// 	} finally {
// 		stringRefs = null
// 	}
// }
// currentExtensions[256].handlesRead = true
$f048fe83766b6c6f$var$currentExtensions[28] = (read)=>{
    // shareable http://cbor.schmorp.de/value-sharing (for structured clones)
    if (!$f048fe83766b6c6f$var$referenceMap) {
        $f048fe83766b6c6f$var$referenceMap = new Map();
        $f048fe83766b6c6f$var$referenceMap.id = 0;
    }
    let id = $f048fe83766b6c6f$var$referenceMap.id++;
    let token = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position];
    let target;
    // TODO: handle Maps, Sets, and other types that can cycle; this is complicated, because you potentially need to read
    // ahead past references to record structure definitions
    if (token >> 5 == 4) target = [];
    else target = {};
    let refEntry = {
        target: target
    } // a placeholder object
    ;
    $f048fe83766b6c6f$var$referenceMap.set(id, refEntry);
    let targetProperties = read() // read the next value as the target object to id
    ;
    if (refEntry.used) return Object.assign(target, targetProperties);
    refEntry.target = targetProperties // the placeholder wasn't used, replace with the deserialized one
    ;
    return targetProperties // no cycle, can just use the returned read object
    ;
};
$f048fe83766b6c6f$var$currentExtensions[28].handlesRead = true;
$f048fe83766b6c6f$var$currentExtensions[29] = (id)=>{
    // sharedref http://cbor.schmorp.de/value-sharing (for structured clones)
    let refEntry = $f048fe83766b6c6f$var$referenceMap.get(id);
    refEntry.used = true;
    return refEntry.target;
};
$f048fe83766b6c6f$var$currentExtensions[258] = (array)=>new Set(array); // https://github.com/input-output-hk/cbor-sets-spec/blob/master/CBOR_SETS.md
($f048fe83766b6c6f$var$currentExtensions[259] = (read)=>{
    // https://github.com/shanewholloway/js-cbor-codec/blob/master/docs/CBOR-259-spec
    // for decoding as a standard Map
    if ($f048fe83766b6c6f$var$currentDecoder.mapsAsObjects) {
        $f048fe83766b6c6f$var$currentDecoder.mapsAsObjects = false;
        $f048fe83766b6c6f$var$restoreMapsAsObject = true;
    }
    return read();
}).handlesRead = true;
function $f048fe83766b6c6f$var$combine(a, b) {
    if (typeof a === 'string') return a + b;
    if (a instanceof Array) return a.concat(b);
    return Object.assign({}, a, b);
}
function $f048fe83766b6c6f$var$getPackedValues() {
    if (!$f048fe83766b6c6f$var$packedValues) {
        if ($f048fe83766b6c6f$var$currentDecoder.getShared) $f048fe83766b6c6f$var$loadShared();
        else throw new Error('No packed values available');
    }
    return $f048fe83766b6c6f$var$packedValues;
}
const $f048fe83766b6c6f$var$SHARED_DATA_TAG_ID = 0x53687264 // ascii 'Shrd'
;
$f048fe83766b6c6f$var$currentExtensionRanges.push((tag, input)=>{
    if (tag >= 225 && tag <= 255) return $f048fe83766b6c6f$var$combine($f048fe83766b6c6f$var$getPackedValues().prefixes[tag - 224], input);
    if (tag >= 28704 && tag <= 32767) return $f048fe83766b6c6f$var$combine($f048fe83766b6c6f$var$getPackedValues().prefixes[tag - 28672], input);
    if (tag >= 1879052288 && tag <= 2147483647) return $f048fe83766b6c6f$var$combine($f048fe83766b6c6f$var$getPackedValues().prefixes[tag - 1879048192], input);
    if (tag >= 216 && tag <= 223) return $f048fe83766b6c6f$var$combine(input, $f048fe83766b6c6f$var$getPackedValues().suffixes[tag - 216]);
    if (tag >= 27647 && tag <= 28671) return $f048fe83766b6c6f$var$combine(input, $f048fe83766b6c6f$var$getPackedValues().suffixes[tag - 27639]);
    if (tag >= 1811940352 && tag <= 1879048191) return $f048fe83766b6c6f$var$combine(input, $f048fe83766b6c6f$var$getPackedValues().suffixes[tag - 1811939328]);
    if (tag == $f048fe83766b6c6f$var$SHARED_DATA_TAG_ID) return {
        packedValues: $f048fe83766b6c6f$var$packedValues,
        structures: $f048fe83766b6c6f$var$currentStructures.slice(0),
        version: input
    };
    if (tag == 55799) return input;
});
const $f048fe83766b6c6f$var$isLittleEndianMachine = new Uint8Array(new Uint16Array([
    1
]).buffer)[0] == 1;
const $f048fe83766b6c6f$export$aae3eaec024a56b7 = [
    Uint8Array,
    Uint8ClampedArray,
    Uint16Array,
    Uint32Array,
    typeof BigUint64Array == 'undefined' ? {
        name: 'BigUint64Array'
    } : BigUint64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    typeof BigInt64Array == 'undefined' ? {
        name: 'BigInt64Array'
    } : BigInt64Array,
    Float32Array,
    Float64Array
];
const $f048fe83766b6c6f$var$typedArrayTags = [
    64,
    68,
    69,
    70,
    71,
    72,
    77,
    78,
    79,
    85,
    86
];
for(let i = 0; i < $f048fe83766b6c6f$export$aae3eaec024a56b7.length; i++)$f048fe83766b6c6f$var$registerTypedArray($f048fe83766b6c6f$export$aae3eaec024a56b7[i], $f048fe83766b6c6f$var$typedArrayTags[i]);
function $f048fe83766b6c6f$var$registerTypedArray(TypedArray, tag) {
    let dvMethod = 'get' + TypedArray.name.slice(0, -5);
    let bytesPerElement;
    if (typeof TypedArray === 'function') bytesPerElement = TypedArray.BYTES_PER_ELEMENT;
    else TypedArray = null;
    for(let littleEndian = 0; littleEndian < 2; littleEndian++){
        if (!littleEndian && bytesPerElement == 1) continue;
        let sizeShift = bytesPerElement == 2 ? 1 : bytesPerElement == 4 ? 2 : 3;
        $f048fe83766b6c6f$var$currentExtensions[littleEndian ? tag : tag - 4] = bytesPerElement == 1 || littleEndian == $f048fe83766b6c6f$var$isLittleEndianMachine ? (buffer)=>{
            if (!TypedArray) throw new Error('Could not find typed array for code ' + tag);
            // we have to always slice/copy here to get a new ArrayBuffer that is word/byte aligned
            return new TypedArray(Uint8Array.prototype.slice.call(buffer, 0).buffer);
        } : (buffer)=>{
            if (!TypedArray) throw new Error('Could not find typed array for code ' + tag);
            let dv = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
            let elements = buffer.length >> sizeShift;
            let ta = new TypedArray(elements);
            let method = dv[dvMethod];
            for(let i = 0; i < elements; i++)ta[i] = method.call(dv, i << sizeShift, littleEndian);
            return ta;
        };
    }
}
function $f048fe83766b6c6f$var$readBundleExt() {
    let length = $f048fe83766b6c6f$var$readJustLength();
    let bundlePosition = $f048fe83766b6c6f$var$position + $f048fe83766b6c6f$export$aafa59e2e03f2942();
    for(let i = 2; i < length; i++){
        // skip past bundles that were already read
        let bundleLength = $f048fe83766b6c6f$var$readJustLength() // this will increment position, so must add to position afterwards
        ;
        $f048fe83766b6c6f$var$position += bundleLength;
    }
    let dataPosition = $f048fe83766b6c6f$var$position;
    $f048fe83766b6c6f$var$position = bundlePosition;
    $f048fe83766b6c6f$var$bundledStrings = [
        $f048fe83766b6c6f$var$readStringJS($f048fe83766b6c6f$var$readJustLength()),
        $f048fe83766b6c6f$var$readStringJS($f048fe83766b6c6f$var$readJustLength())
    ];
    $f048fe83766b6c6f$var$bundledStrings.position0 = 0;
    $f048fe83766b6c6f$var$bundledStrings.position1 = 0;
    $f048fe83766b6c6f$var$bundledStrings.postBundlePosition = $f048fe83766b6c6f$var$position;
    $f048fe83766b6c6f$var$position = dataPosition;
    return $f048fe83766b6c6f$export$aafa59e2e03f2942();
}
function $f048fe83766b6c6f$var$readJustLength() {
    let token = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++] & 0x1f;
    if (token > 0x17) switch(token){
        case 0x18:
            token = $f048fe83766b6c6f$var$src[$f048fe83766b6c6f$var$position++];
            break;
        case 0x19:
            token = $f048fe83766b6c6f$var$dataView.getUint16($f048fe83766b6c6f$var$position);
            $f048fe83766b6c6f$var$position += 2;
            break;
        case 0x1a:
            token = $f048fe83766b6c6f$var$dataView.getUint32($f048fe83766b6c6f$var$position);
            $f048fe83766b6c6f$var$position += 4;
            break;
    }
    return token;
}
function $f048fe83766b6c6f$var$loadShared() {
    if ($f048fe83766b6c6f$var$currentDecoder.getShared) {
        let sharedData = $f048fe83766b6c6f$var$saveState(()=>{
            // save the state in case getShared modifies our buffer
            $f048fe83766b6c6f$var$src = null;
            return $f048fe83766b6c6f$var$currentDecoder.getShared();
        }) || {};
        let updatedStructures = sharedData.structures || [];
        $f048fe83766b6c6f$var$currentDecoder.sharedVersion = sharedData.version;
        $f048fe83766b6c6f$var$packedValues = $f048fe83766b6c6f$var$currentDecoder.sharedValues = sharedData.packedValues;
        if ($f048fe83766b6c6f$var$currentStructures === true) $f048fe83766b6c6f$var$currentDecoder.structures = $f048fe83766b6c6f$var$currentStructures = updatedStructures;
        else $f048fe83766b6c6f$var$currentStructures.splice.apply($f048fe83766b6c6f$var$currentStructures, [
            0,
            updatedStructures.length
        ].concat(updatedStructures));
    }
}
function $f048fe83766b6c6f$var$saveState(callback) {
    let savedSrcEnd = $f048fe83766b6c6f$var$srcEnd;
    let savedPosition = $f048fe83766b6c6f$var$position;
    let savedStringPosition = $f048fe83766b6c6f$var$stringPosition;
    let savedSrcStringStart = $f048fe83766b6c6f$var$srcStringStart;
    let savedSrcStringEnd = $f048fe83766b6c6f$var$srcStringEnd;
    let savedSrcString = $f048fe83766b6c6f$var$srcString;
    let savedStrings = $f048fe83766b6c6f$var$strings;
    let savedReferenceMap = $f048fe83766b6c6f$var$referenceMap;
    let savedBundledStrings = $f048fe83766b6c6f$var$bundledStrings;
    // TODO: We may need to revisit this if we do more external calls to user code (since it could be slow)
    let savedSrc = new Uint8Array($f048fe83766b6c6f$var$src.slice(0, $f048fe83766b6c6f$var$srcEnd)) // we copy the data in case it changes while external data is processed
    ;
    let savedStructures = $f048fe83766b6c6f$var$currentStructures;
    let savedDecoder = $f048fe83766b6c6f$var$currentDecoder;
    let savedSequentialMode = $f048fe83766b6c6f$var$sequentialMode;
    let value = callback();
    $f048fe83766b6c6f$var$srcEnd = savedSrcEnd;
    $f048fe83766b6c6f$var$position = savedPosition;
    $f048fe83766b6c6f$var$stringPosition = savedStringPosition;
    $f048fe83766b6c6f$var$srcStringStart = savedSrcStringStart;
    $f048fe83766b6c6f$var$srcStringEnd = savedSrcStringEnd;
    $f048fe83766b6c6f$var$srcString = savedSrcString;
    $f048fe83766b6c6f$var$strings = savedStrings;
    $f048fe83766b6c6f$var$referenceMap = savedReferenceMap;
    $f048fe83766b6c6f$var$bundledStrings = savedBundledStrings;
    $f048fe83766b6c6f$var$src = savedSrc;
    $f048fe83766b6c6f$var$sequentialMode = savedSequentialMode;
    $f048fe83766b6c6f$var$currentStructures = savedStructures;
    $f048fe83766b6c6f$var$currentDecoder = savedDecoder;
    $f048fe83766b6c6f$var$dataView = new DataView($f048fe83766b6c6f$var$src.buffer, $f048fe83766b6c6f$var$src.byteOffset, $f048fe83766b6c6f$var$src.byteLength);
    return value;
}
function $f048fe83766b6c6f$export$e6f020404d5b6c15() {
    $f048fe83766b6c6f$var$src = null;
    $f048fe83766b6c6f$var$referenceMap = null;
    $f048fe83766b6c6f$var$currentStructures = null;
}
function $f048fe83766b6c6f$export$4e11b2f4fcd6c82d(extension) {
    $f048fe83766b6c6f$var$currentExtensions[extension.tag] = extension.decode;
}
const $f048fe83766b6c6f$export$c652a5bbb6be7a36 = new Array(147) // this is a table matching binary exponents to the multiplier to determine significant digit rounding
;
for(let i = 0; i < 256; i++)$f048fe83766b6c6f$export$c652a5bbb6be7a36[i] = +('1e' + Math.floor(45.15 - i * 0.30103));
let $f048fe83766b6c6f$var$defaultDecoder = new $f048fe83766b6c6f$export$f9de6ca0bc043724({
    useRecords: false
});
const $f048fe83766b6c6f$export$2f872c0f2117be69 = $f048fe83766b6c6f$var$defaultDecoder.decode;
const $f048fe83766b6c6f$export$ddfa300a3790ac32 = $f048fe83766b6c6f$var$defaultDecoder.decodeMultiple;
const $f048fe83766b6c6f$export$2239e49a3e351685 = {
    NEVER: 0,
    ALWAYS: 1,
    DECIMAL_ROUND: 3,
    DECIMAL_FIT: 4
};
function $f048fe83766b6c6f$export$36da082398e4f139(float32Number) {
    $f048fe83766b6c6f$var$f32Array[0] = float32Number;
    let multiplier = $f048fe83766b6c6f$export$c652a5bbb6be7a36[($f048fe83766b6c6f$var$u8Array[3] & 0x7f) << 1 | $f048fe83766b6c6f$var$u8Array[2] >> 7];
    return (multiplier * float32Number + (float32Number > 0 ? 0.5 : -0.5) >> 0) / multiplier;
}


let $5641ea8d38d79299$var$textEncoder;
try {
    $5641ea8d38d79299$var$textEncoder = new TextEncoder();
} catch (error) {}
let $5641ea8d38d79299$var$extensions, $5641ea8d38d79299$var$extensionClasses;
const $5641ea8d38d79299$var$Buffer = typeof globalThis === 'object' && globalThis.Buffer;
const $5641ea8d38d79299$var$hasNodeBuffer = typeof $5641ea8d38d79299$var$Buffer !== 'undefined';
const $5641ea8d38d79299$var$ByteArrayAllocate = $5641ea8d38d79299$var$hasNodeBuffer ? $5641ea8d38d79299$var$Buffer.allocUnsafeSlow : Uint8Array;
const $5641ea8d38d79299$var$ByteArray = $5641ea8d38d79299$var$hasNodeBuffer ? $5641ea8d38d79299$var$Buffer : Uint8Array;
const $5641ea8d38d79299$var$MAX_STRUCTURES = 0x100;
const $5641ea8d38d79299$var$MAX_BUFFER_SIZE = $5641ea8d38d79299$var$hasNodeBuffer ? 0x100000000 : 0x7fd00000;
let $5641ea8d38d79299$var$serializationId = 1;
let $5641ea8d38d79299$var$throwOnIterable;
let $5641ea8d38d79299$var$target;
let $5641ea8d38d79299$var$targetView;
let $5641ea8d38d79299$var$position = 0;
let $5641ea8d38d79299$var$safeEnd;
let $5641ea8d38d79299$var$bundledStrings = null;
const $5641ea8d38d79299$var$MAX_BUNDLE_SIZE = 0xf000;
const $5641ea8d38d79299$var$hasNonLatin = /[\u0080-\uFFFF]/;
const $5641ea8d38d79299$var$RECORD_SYMBOL = Symbol('record-id');
class $5641ea8d38d79299$export$a50aceb0e02a00aa extends (0, $f048fe83766b6c6f$export$f9de6ca0bc043724) {
    constructor(options){
        super(options);
        this.offset = 0;
        let typeBuffer;
        let start;
        let sharedStructures;
        let hasSharedUpdate;
        let structures;
        let referenceMap;
        options = options || {};
        let encodeUtf8 = $5641ea8d38d79299$var$ByteArray.prototype.utf8Write ? function(string, position, maxBytes) {
            return $5641ea8d38d79299$var$target.utf8Write(string, position, maxBytes);
        } : $5641ea8d38d79299$var$textEncoder && $5641ea8d38d79299$var$textEncoder.encodeInto ? function(string, position) {
            return $5641ea8d38d79299$var$textEncoder.encodeInto(string, $5641ea8d38d79299$var$target.subarray(position)).written;
        } : false;
        let encoder = this;
        let hasSharedStructures = options.structures || options.saveStructures;
        let maxSharedStructures = options.maxSharedStructures;
        if (maxSharedStructures == null) maxSharedStructures = hasSharedStructures ? 128 : 0;
        if (maxSharedStructures > 8190) throw new Error('Maximum maxSharedStructure is 8190');
        let isSequential = options.sequential;
        if (isSequential) maxSharedStructures = 0;
        if (!this.structures) this.structures = [];
        if (this.saveStructures) this.saveShared = this.saveStructures;
        let samplingPackedValues, packedObjectMap1, sharedValues = options.sharedValues;
        let sharedPackedObjectMap1;
        if (sharedValues) {
            sharedPackedObjectMap1 = Object.create(null);
            for(let i = 0, l = sharedValues.length; i < l; i++)sharedPackedObjectMap1[sharedValues[i]] = i;
        }
        let recordIdsToRemove = [];
        let transitionsCount = 0;
        let serializationsSinceTransitionRebuild = 0;
        this.mapEncode = function(value, encodeOptions) {
            // Experimental support for premapping keys using _keyMap instad of keyMap - not optiimised yet)
            if (this._keyMap && !this._mapped) //console.log('encoding ', value)
            switch(value.constructor.name){
                case 'Array':
                    value = value.map((r)=>this.encodeKeys(r));
                    break;
            }
            return this.encode(value, encodeOptions);
        };
        this.encode = function(value, encodeOptions) {
            if (!$5641ea8d38d79299$var$target) {
                $5641ea8d38d79299$var$target = new $5641ea8d38d79299$var$ByteArrayAllocate(8192);
                $5641ea8d38d79299$var$targetView = new DataView($5641ea8d38d79299$var$target.buffer, 0, 8192);
                $5641ea8d38d79299$var$position = 0;
            }
            $5641ea8d38d79299$var$safeEnd = $5641ea8d38d79299$var$target.length - 10;
            if ($5641ea8d38d79299$var$safeEnd - $5641ea8d38d79299$var$position < 0x800) {
                // don't start too close to the end, 
                $5641ea8d38d79299$var$target = new $5641ea8d38d79299$var$ByteArrayAllocate($5641ea8d38d79299$var$target.length);
                $5641ea8d38d79299$var$targetView = new DataView($5641ea8d38d79299$var$target.buffer, 0, $5641ea8d38d79299$var$target.length);
                $5641ea8d38d79299$var$safeEnd = $5641ea8d38d79299$var$target.length - 10;
                $5641ea8d38d79299$var$position = 0;
            } else if (encodeOptions === $5641ea8d38d79299$export$d41ac1453288b342) $5641ea8d38d79299$var$position = $5641ea8d38d79299$var$position + 7 & 0x7ffffff8 // Word align to make any future copying of this buffer faster
            ;
            start = $5641ea8d38d79299$var$position;
            if (encoder.useSelfDescribedHeader) {
                $5641ea8d38d79299$var$targetView.setUint32($5641ea8d38d79299$var$position, 0xd9d9f700) // tag two byte, then self-descriptive tag
                ;
                $5641ea8d38d79299$var$position += 3;
            }
            referenceMap = encoder.structuredClone ? new Map() : null;
            if (encoder.bundleStrings && typeof value !== 'string') {
                $5641ea8d38d79299$var$bundledStrings = [];
                $5641ea8d38d79299$var$bundledStrings.size = Infinity // force a new bundle start on first string
                ;
            } else $5641ea8d38d79299$var$bundledStrings = null;
            sharedStructures = encoder.structures;
            if (sharedStructures) {
                if (sharedStructures.uninitialized) {
                    let sharedData = encoder.getShared() || {};
                    encoder.structures = sharedStructures = sharedData.structures || [];
                    encoder.sharedVersion = sharedData.version;
                    let sharedValues = encoder.sharedValues = sharedData.packedValues;
                    if (sharedValues) {
                        sharedPackedObjectMap1 = {};
                        for(let i = 0, l = sharedValues.length; i < l; i++)sharedPackedObjectMap1[sharedValues[i]] = i;
                    }
                }
                let sharedStructuresLength = sharedStructures.length;
                if (sharedStructuresLength > maxSharedStructures && !isSequential) sharedStructuresLength = maxSharedStructures;
                if (!sharedStructures.transitions) {
                    // rebuild our structure transitions
                    sharedStructures.transitions = Object.create(null);
                    for(let i = 0; i < sharedStructuresLength; i++){
                        let keys = sharedStructures[i];
                        //console.log('shared struct keys:', keys)
                        if (!keys) continue;
                        let nextTransition, transition = sharedStructures.transitions;
                        for(let j = 0, l = keys.length; j < l; j++){
                            if (transition[$5641ea8d38d79299$var$RECORD_SYMBOL] === undefined) transition[$5641ea8d38d79299$var$RECORD_SYMBOL] = i;
                            let key = keys[j];
                            nextTransition = transition[key];
                            if (!nextTransition) nextTransition = transition[key] = Object.create(null);
                            transition = nextTransition;
                        }
                        transition[$5641ea8d38d79299$var$RECORD_SYMBOL] = i | 0x100000;
                    }
                }
                if (!isSequential) sharedStructures.nextId = sharedStructuresLength;
            }
            if (hasSharedUpdate) hasSharedUpdate = false;
            structures = sharedStructures || [];
            packedObjectMap1 = sharedPackedObjectMap1;
            if (options.pack) {
                let packedValues = new Map();
                packedValues.values = [];
                packedValues.encoder = encoder;
                packedValues.maxValues = options.maxPrivatePackedValues || (sharedPackedObjectMap1 ? 16 : Infinity);
                packedValues.objectMap = sharedPackedObjectMap1 || false;
                packedValues.samplingPackedValues = samplingPackedValues;
                $5641ea8d38d79299$var$findRepetitiveStrings(value, packedValues);
                if (packedValues.values.length > 0) {
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xd8 // one-byte tag
                    ;
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 51 // tag 51 for packed shared structures https://www.potaroo.net/ietf/ids/draft-ietf-cbor-packed-03.txt
                    ;
                    $5641ea8d38d79299$var$writeArrayHeader(4);
                    let valuesArray = packedValues.values;
                    encode(valuesArray);
                    $5641ea8d38d79299$var$writeArrayHeader(0) // prefixes
                    ;
                    $5641ea8d38d79299$var$writeArrayHeader(0) // suffixes
                    ;
                    packedObjectMap1 = Object.create(sharedPackedObjectMap1 || null);
                    for(let i = 0, l = valuesArray.length; i < l; i++)packedObjectMap1[valuesArray[i]] = i;
                }
            }
            $5641ea8d38d79299$var$throwOnIterable = encodeOptions & $5641ea8d38d79299$export$e724ae76933ea297;
            try {
                if ($5641ea8d38d79299$var$throwOnIterable) return;
                encode(value);
                if ($5641ea8d38d79299$var$bundledStrings) $5641ea8d38d79299$var$writeBundles(start, encode);
                encoder.offset = $5641ea8d38d79299$var$position // update the offset so next serialization doesn't write over our buffer, but can continue writing to same buffer sequentially
                ;
                if (referenceMap && referenceMap.idsToInsert) {
                    $5641ea8d38d79299$var$position += referenceMap.idsToInsert.length * 2;
                    if ($5641ea8d38d79299$var$position > $5641ea8d38d79299$var$safeEnd) makeRoom($5641ea8d38d79299$var$position);
                    encoder.offset = $5641ea8d38d79299$var$position;
                    let serialized = $5641ea8d38d79299$var$insertIds($5641ea8d38d79299$var$target.subarray(start, $5641ea8d38d79299$var$position), referenceMap.idsToInsert);
                    referenceMap = null;
                    return serialized;
                }
                if (encodeOptions & $5641ea8d38d79299$export$d41ac1453288b342) {
                    $5641ea8d38d79299$var$target.start = start;
                    $5641ea8d38d79299$var$target.end = $5641ea8d38d79299$var$position;
                    return $5641ea8d38d79299$var$target;
                }
                return $5641ea8d38d79299$var$target.subarray(start, $5641ea8d38d79299$var$position) // position can change if we call encode again in saveShared, so we get the buffer now
                ;
            } finally{
                if (sharedStructures) {
                    if (serializationsSinceTransitionRebuild < 10) serializationsSinceTransitionRebuild++;
                    if (sharedStructures.length > maxSharedStructures) sharedStructures.length = maxSharedStructures;
                    if (transitionsCount > 10000) {
                        // force a rebuild occasionally after a lot of transitions so it can get cleaned up
                        sharedStructures.transitions = null;
                        serializationsSinceTransitionRebuild = 0;
                        transitionsCount = 0;
                        if (recordIdsToRemove.length > 0) recordIdsToRemove = [];
                    } else if (recordIdsToRemove.length > 0 && !isSequential) {
                        for(let i = 0, l = recordIdsToRemove.length; i < l; i++)recordIdsToRemove[i][$5641ea8d38d79299$var$RECORD_SYMBOL] = undefined;
                        recordIdsToRemove = [];
                    //sharedStructures.nextId = maxSharedStructures
                    }
                }
                if (hasSharedUpdate && encoder.saveShared) {
                    if (encoder.structures.length > maxSharedStructures) encoder.structures = encoder.structures.slice(0, maxSharedStructures);
                    // we can't rely on start/end with REUSE_BUFFER_MODE since they will (probably) change when we save
                    let returnBuffer = $5641ea8d38d79299$var$target.subarray(start, $5641ea8d38d79299$var$position);
                    if (encoder.updateSharedData() === false) return encoder.encode(value) // re-encode if it fails
                    ;
                    return returnBuffer;
                }
                if (encodeOptions & $5641ea8d38d79299$export$5687accb6effa257) $5641ea8d38d79299$var$position = start;
            }
        };
        this.findCommonStringsToPack = ()=>{
            samplingPackedValues = new Map();
            if (!sharedPackedObjectMap1) sharedPackedObjectMap1 = Object.create(null);
            return (options)=>{
                let threshold = options && options.threshold || 4;
                let position = this.pack ? options.maxPrivatePackedValues || 16 : 0;
                if (!sharedValues) sharedValues = this.sharedValues = [];
                for (let [key, status] of samplingPackedValues)if (status.count > threshold) {
                    sharedPackedObjectMap1[key] = position++;
                    sharedValues.push(key);
                    hasSharedUpdate = true;
                }
                while(this.saveShared && this.updateSharedData() === false);
                samplingPackedValues = null;
            };
        };
        const encode = (value)=>{
            if ($5641ea8d38d79299$var$position > $5641ea8d38d79299$var$safeEnd) $5641ea8d38d79299$var$target = makeRoom($5641ea8d38d79299$var$position);
            var type = typeof value;
            var length;
            if (type === 'string') {
                if (packedObjectMap1) {
                    let packedPosition = packedObjectMap1[value];
                    if (packedPosition >= 0) {
                        if (packedPosition < 16) $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = packedPosition + 0xe0 // simple values, defined in https://www.potaroo.net/ietf/ids/draft-ietf-cbor-packed-03.txt
                        ;
                        else {
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xc6 // tag 6 defined in https://www.potaroo.net/ietf/ids/draft-ietf-cbor-packed-03.txt
                            ;
                            if (packedPosition & 1) encode(15 - packedPosition >> 1);
                            else encode(packedPosition - 16 >> 1);
                        }
                        return;
                    /*						} else if (packedStatus.serializationId != serializationId) {
							packedStatus.serializationId = serializationId
							packedStatus.count = 1
							if (options.sharedPack) {
								let sharedCount = packedStatus.sharedCount = (packedStatus.sharedCount || 0) + 1
								if (shareCount > (options.sharedPack.threshold || 5)) {
									let sharedPosition = packedStatus.position = packedStatus.nextSharedPosition
									hasSharedUpdate = true
									if (sharedPosition < 16)
										target[position++] = sharedPosition + 0xc0

								}
							}
						} // else any in-doc incrementation?*/ } else if (samplingPackedValues && !options.pack) {
                        let status = samplingPackedValues.get(value);
                        if (status) status.count++;
                        else samplingPackedValues.set(value, {
                            count: 1
                        });
                    }
                }
                let strLength = value.length;
                if ($5641ea8d38d79299$var$bundledStrings && strLength >= 4 && strLength < 0x400) {
                    if (($5641ea8d38d79299$var$bundledStrings.size += strLength) > $5641ea8d38d79299$var$MAX_BUNDLE_SIZE) {
                        let extStart;
                        let maxBytes = ($5641ea8d38d79299$var$bundledStrings[0] ? $5641ea8d38d79299$var$bundledStrings[0].length * 3 + $5641ea8d38d79299$var$bundledStrings[1].length : 0) + 10;
                        if ($5641ea8d38d79299$var$position + maxBytes > $5641ea8d38d79299$var$safeEnd) $5641ea8d38d79299$var$target = makeRoom($5641ea8d38d79299$var$position + maxBytes);
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xd9 // tag 16-bit
                        ;
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xdf // tag 0xdff9
                        ;
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xf9;
                        // TODO: If we only have one bundle with any string data, only write one string bundle
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = $5641ea8d38d79299$var$bundledStrings.position ? 0x84 : 0x82 // array of 4 or 2 elements depending on if we write bundles
                        ;
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x1a // 32-bit unsigned int
                        ;
                        extStart = $5641ea8d38d79299$var$position - start;
                        $5641ea8d38d79299$var$position += 4 // reserve for writing bundle reference
                        ;
                        if ($5641ea8d38d79299$var$bundledStrings.position) $5641ea8d38d79299$var$writeBundles(start, encode) // write the last bundles
                        ;
                        $5641ea8d38d79299$var$bundledStrings = [
                            '',
                            ''
                        ] // create new ones
                        ;
                        $5641ea8d38d79299$var$bundledStrings.size = 0;
                        $5641ea8d38d79299$var$bundledStrings.position = extStart;
                    }
                    let twoByte = $5641ea8d38d79299$var$hasNonLatin.test(value);
                    $5641ea8d38d79299$var$bundledStrings[twoByte ? 0 : 1] += value;
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = twoByte ? 0xce : 0xcf;
                    encode(strLength);
                    return;
                }
                let headerSize;
                // first we estimate the header size, so we can write to the correct location
                if (strLength < 0x20) headerSize = 1;
                else if (strLength < 0x100) headerSize = 2;
                else if (strLength < 0x10000) headerSize = 3;
                else headerSize = 5;
                let maxBytes = strLength * 3;
                if ($5641ea8d38d79299$var$position + maxBytes > $5641ea8d38d79299$var$safeEnd) $5641ea8d38d79299$var$target = makeRoom($5641ea8d38d79299$var$position + maxBytes);
                if (strLength < 0x40 || !encodeUtf8) {
                    let i, c1, c2, strPosition = $5641ea8d38d79299$var$position + headerSize;
                    for(i = 0; i < strLength; i++){
                        c1 = value.charCodeAt(i);
                        if (c1 < 0x80) $5641ea8d38d79299$var$target[strPosition++] = c1;
                        else if (c1 < 0x800) {
                            $5641ea8d38d79299$var$target[strPosition++] = c1 >> 6 | 0xc0;
                            $5641ea8d38d79299$var$target[strPosition++] = c1 & 0x3f | 0x80;
                        } else if ((c1 & 0xfc00) === 0xd800 && ((c2 = value.charCodeAt(i + 1)) & 0xfc00) === 0xdc00) {
                            c1 = 0x10000 + ((c1 & 0x03ff) << 10) + (c2 & 0x03ff);
                            i++;
                            $5641ea8d38d79299$var$target[strPosition++] = c1 >> 18 | 0xf0;
                            $5641ea8d38d79299$var$target[strPosition++] = c1 >> 12 & 0x3f | 0x80;
                            $5641ea8d38d79299$var$target[strPosition++] = c1 >> 6 & 0x3f | 0x80;
                            $5641ea8d38d79299$var$target[strPosition++] = c1 & 0x3f | 0x80;
                        } else {
                            $5641ea8d38d79299$var$target[strPosition++] = c1 >> 12 | 0xe0;
                            $5641ea8d38d79299$var$target[strPosition++] = c1 >> 6 & 0x3f | 0x80;
                            $5641ea8d38d79299$var$target[strPosition++] = c1 & 0x3f | 0x80;
                        }
                    }
                    length = strPosition - $5641ea8d38d79299$var$position - headerSize;
                } else length = encodeUtf8(value, $5641ea8d38d79299$var$position + headerSize, maxBytes);
                if (length < 0x18) $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x60 | length;
                else if (length < 0x100) {
                    if (headerSize < 2) $5641ea8d38d79299$var$target.copyWithin($5641ea8d38d79299$var$position + 2, $5641ea8d38d79299$var$position + 1, $5641ea8d38d79299$var$position + 1 + length);
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x78;
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length;
                } else if (length < 0x10000) {
                    if (headerSize < 3) $5641ea8d38d79299$var$target.copyWithin($5641ea8d38d79299$var$position + 3, $5641ea8d38d79299$var$position + 2, $5641ea8d38d79299$var$position + 2 + length);
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x79;
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length >> 8;
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length & 0xff;
                } else {
                    if (headerSize < 5) $5641ea8d38d79299$var$target.copyWithin($5641ea8d38d79299$var$position + 5, $5641ea8d38d79299$var$position + 3, $5641ea8d38d79299$var$position + 3 + length);
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x7a;
                    $5641ea8d38d79299$var$targetView.setUint32($5641ea8d38d79299$var$position, length);
                    $5641ea8d38d79299$var$position += 4;
                }
                $5641ea8d38d79299$var$position += length;
            } else if (type === 'number') {
                if (!this.alwaysUseFloat && value >>> 0 === value) {
                    // positive uint
                    if (value < 0x18) $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = value;
                    else if (value < 0x100) {
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x18;
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = value;
                    } else if (value < 0x10000) {
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x19;
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = value >> 8;
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = value & 0xff;
                    } else {
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x1a;
                        $5641ea8d38d79299$var$targetView.setUint32($5641ea8d38d79299$var$position, value);
                        $5641ea8d38d79299$var$position += 4;
                    }
                } else if (!this.alwaysUseFloat && value >> 0 === value) {
                    if (value >= -24) $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x1f - value;
                    else if (value >= -256) {
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x38;
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = ~value;
                    } else if (value >= -65536) {
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x39;
                        $5641ea8d38d79299$var$targetView.setUint16($5641ea8d38d79299$var$position, ~value);
                        $5641ea8d38d79299$var$position += 2;
                    } else {
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x3a;
                        $5641ea8d38d79299$var$targetView.setUint32($5641ea8d38d79299$var$position, ~value);
                        $5641ea8d38d79299$var$position += 4;
                    }
                } else {
                    let useFloat32;
                    if ((useFloat32 = this.useFloat32) > 0 && value < 0x100000000 && value >= -2147483648) {
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xfa;
                        $5641ea8d38d79299$var$targetView.setFloat32($5641ea8d38d79299$var$position, value);
                        let xShifted;
                        if (useFloat32 < 4 || (xShifted = value * (0, $f048fe83766b6c6f$export$c652a5bbb6be7a36)[($5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position] & 0x7f) << 1 | $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position + 1] >> 7]) >> 0 === xShifted) {
                            $5641ea8d38d79299$var$position += 4;
                            return;
                        } else $5641ea8d38d79299$var$position-- // move back into position for writing a double
                        ;
                    }
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xfb;
                    $5641ea8d38d79299$var$targetView.setFloat64($5641ea8d38d79299$var$position, value);
                    $5641ea8d38d79299$var$position += 8;
                }
            } else if (type === 'object') {
                if (!value) $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xf6;
                else {
                    if (referenceMap) {
                        let referee = referenceMap.get(value);
                        if (referee) {
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xd8;
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 29 // http://cbor.schmorp.de/value-sharing
                            ;
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x19 // 16-bit uint
                            ;
                            if (!referee.references) {
                                let idsToInsert = referenceMap.idsToInsert || (referenceMap.idsToInsert = []);
                                referee.references = [];
                                idsToInsert.push(referee);
                            }
                            referee.references.push($5641ea8d38d79299$var$position - start);
                            $5641ea8d38d79299$var$position += 2 // TODO: also support 32-bit
                            ;
                            return;
                        } else referenceMap.set(value, {
                            offset: $5641ea8d38d79299$var$position - start
                        });
                    }
                    let constructor = value.constructor;
                    if (constructor === Object) writeObject(value, true);
                    else if (constructor === Array) {
                        length = value.length;
                        if (length < 0x18) $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x80 | length;
                        else $5641ea8d38d79299$var$writeArrayHeader(length);
                        for(let i = 0; i < length; i++)encode(value[i]);
                    } else if (constructor === Map) {
                        if (this.mapsAsObjects ? this.useTag259ForMaps !== false : this.useTag259ForMaps) {
                            // use Tag 259 (https://github.com/shanewholloway/js-cbor-codec/blob/master/docs/CBOR-259-spec--explicit-maps.md) for maps if the user wants it that way
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xd9;
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 1;
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 3;
                        }
                        length = value.size;
                        if (length < 0x18) $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xa0 | length;
                        else if (length < 0x100) {
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xb8;
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length;
                        } else if (length < 0x10000) {
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xb9;
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length >> 8;
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length & 0xff;
                        } else {
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xba;
                            $5641ea8d38d79299$var$targetView.setUint32($5641ea8d38d79299$var$position, length);
                            $5641ea8d38d79299$var$position += 4;
                        }
                        if (encoder.keyMap) for (let [key, entryValue] of value){
                            encode(encoder.encodeKey(key));
                            encode(entryValue);
                        }
                        else for (let [key, entryValue] of value){
                            encode(key);
                            encode(entryValue);
                        }
                    } else {
                        for(let i = 0, l = $5641ea8d38d79299$var$extensions.length; i < l; i++){
                            let extensionClass = $5641ea8d38d79299$var$extensionClasses[i];
                            if (value instanceof extensionClass) {
                                let extension = $5641ea8d38d79299$var$extensions[i];
                                let tag = extension.tag;
                                if (tag == undefined) tag = extension.getTag && extension.getTag.call(this, value);
                                if (tag < 0x18) $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xc0 | tag;
                                else if (tag < 0x100) {
                                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xd8;
                                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = tag;
                                } else if (tag < 0x10000) {
                                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xd9;
                                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = tag >> 8;
                                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = tag & 0xff;
                                } else if (tag > -1) {
                                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xda;
                                    $5641ea8d38d79299$var$targetView.setUint32($5641ea8d38d79299$var$position, tag);
                                    $5641ea8d38d79299$var$position += 4;
                                } // else undefined, don't write tag
                                extension.encode.call(this, value, encode, makeRoom);
                                return;
                            }
                        }
                        if (value[Symbol.iterator]) {
                            if ($5641ea8d38d79299$var$throwOnIterable) {
                                let error = new Error('Iterable should be serialized as iterator');
                                error.iteratorNotHandled = true;
                                throw error;
                            }
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x9f // indefinite length array
                            ;
                            for (let entry of value)encode(entry);
                            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xff // stop-code
                            ;
                            return;
                        }
                        if (value[Symbol.asyncIterator] || $5641ea8d38d79299$var$isBlob(value)) {
                            let error = new Error('Iterable/blob should be serialized as iterator');
                            error.iteratorNotHandled = true;
                            throw error;
                        }
                        if (this.useToJSON && value.toJSON) {
                            const json = value.toJSON();
                            // if for some reason value.toJSON returns itself it'll loop forever
                            if (json !== value) return encode(json);
                        }
                        // no extension found, write as object
                        writeObject(value, !value.hasOwnProperty) // if it doesn't have hasOwnProperty, don't do hasOwnProperty checks
                        ;
                    }
                }
            } else if (type === 'boolean') $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = value ? 0xf5 : 0xf4;
            else if (type === 'bigint') {
                if (value < BigInt(1) << BigInt(64) && value >= 0) {
                    // use an unsigned int as long as it fits
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x1b;
                    $5641ea8d38d79299$var$targetView.setBigUint64($5641ea8d38d79299$var$position, value);
                } else if (value > -(BigInt(1) << BigInt(64)) && value < 0) {
                    // if we can fit an unsigned int, use that
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x3b;
                    $5641ea8d38d79299$var$targetView.setBigUint64($5641ea8d38d79299$var$position, -value - BigInt(1));
                } else {
                    // overflow
                    if (this.largeBigIntToFloat) {
                        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xfb;
                        $5641ea8d38d79299$var$targetView.setFloat64($5641ea8d38d79299$var$position, Number(value));
                    } else throw new RangeError(value + ' was too large to fit in CBOR 64-bit integer format, set largeBigIntToFloat to convert to float-64');
                }
                $5641ea8d38d79299$var$position += 8;
            } else if (type === 'undefined') $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xf7;
            else throw new Error('Unknown type: ' + type);
        };
        const writeObject = this.useRecords === false ? this.variableMapSize ? (object)=>{
            // this method is slightly slower, but generates "preferred serialization" (optimally small for smaller objects)
            let keys = Object.keys(object);
            let vals = Object.values(object);
            let length = keys.length;
            if (length < 0x18) $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xa0 | length;
            else if (length < 0x100) {
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xb8;
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length;
            } else if (length < 0x10000) {
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xb9;
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length >> 8;
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length & 0xff;
            } else {
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xba;
                $5641ea8d38d79299$var$targetView.setUint32($5641ea8d38d79299$var$position, length);
                $5641ea8d38d79299$var$position += 4;
            }
            let key;
            if (encoder.keyMap) for(let i = 0; i < length; i++){
                encode(encoder.encodeKey(keys[i]));
                encode(vals[i]);
            }
            else for(let i = 0; i < length; i++){
                encode(keys[i]);
                encode(vals[i]);
            }
        } : (object, safePrototype)=>{
            $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xb9 // always use map 16, so we can preallocate and set the length afterwards
            ;
            let objectOffset = $5641ea8d38d79299$var$position - start;
            $5641ea8d38d79299$var$position += 2;
            let size = 0;
            if (encoder.keyMap) {
                for(let key in object)if (safePrototype || object.hasOwnProperty(key)) {
                    encode(encoder.encodeKey(key));
                    encode(object[key]);
                    size++;
                }
            } else {
                for(let key in object)if (safePrototype || object.hasOwnProperty(key)) {
                    encode(key);
                    encode(object[key]);
                    size++;
                }
            }
            $5641ea8d38d79299$var$target[objectOffset++ + start] = size >> 8;
            $5641ea8d38d79299$var$target[objectOffset + start] = size & 0xff;
        } : (object, safePrototype)=>{
            let nextTransition, transition = structures.transitions || (structures.transitions = Object.create(null));
            let newTransitions = 0;
            let length = 0;
            let parentRecordId;
            let keys;
            if (this.keyMap) {
                keys = Object.keys(object).map((k)=>this.encodeKey(k));
                length = keys.length;
                for(let i = 0; i < length; i++){
                    let key = keys[i];
                    nextTransition = transition[key];
                    if (!nextTransition) {
                        nextTransition = transition[key] = Object.create(null);
                        newTransitions++;
                    }
                    transition = nextTransition;
                }
            } else {
                for(let key in object)if (safePrototype || object.hasOwnProperty(key)) {
                    nextTransition = transition[key];
                    if (!nextTransition) {
                        if (transition[$5641ea8d38d79299$var$RECORD_SYMBOL] & 0x100000) parentRecordId = transition[$5641ea8d38d79299$var$RECORD_SYMBOL] & 0xffff;
                        nextTransition = transition[key] = Object.create(null);
                        newTransitions++;
                    }
                    transition = nextTransition;
                    length++;
                }
            }
            let recordId = transition[$5641ea8d38d79299$var$RECORD_SYMBOL];
            if (recordId !== undefined) {
                recordId &= 0xffff;
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xd9;
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = recordId >> 8 | 0xe0;
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = recordId & 0xff;
            } else {
                if (!keys) keys = transition.__keys__ || (transition.__keys__ = Object.keys(object));
                if (parentRecordId === undefined) {
                    recordId = structures.nextId++;
                    if (!recordId) {
                        recordId = 0;
                        structures.nextId = 1;
                    }
                    if (recordId >= $5641ea8d38d79299$var$MAX_STRUCTURES) structures.nextId = (recordId = maxSharedStructures) + 1;
                } else recordId = parentRecordId;
                structures[recordId] = keys;
                if (recordId < maxSharedStructures) {
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xd9;
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = recordId >> 8 | 0xe0;
                    $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = recordId & 0xff;
                    transition = structures.transitions;
                    for(let i = 0; i < length; i++){
                        if (transition[$5641ea8d38d79299$var$RECORD_SYMBOL] === undefined || transition[$5641ea8d38d79299$var$RECORD_SYMBOL] & 0x100000) transition[$5641ea8d38d79299$var$RECORD_SYMBOL] = recordId;
                        transition = transition[keys[i]];
                    }
                    transition[$5641ea8d38d79299$var$RECORD_SYMBOL] = recordId | 0x100000 // indicates it is a extendable terminal
                    ;
                    hasSharedUpdate = true;
                } else {
                    transition[$5641ea8d38d79299$var$RECORD_SYMBOL] = recordId;
                    $5641ea8d38d79299$var$targetView.setUint32($5641ea8d38d79299$var$position, 0xd9dfff00) // tag two byte, then record definition id
                    ;
                    $5641ea8d38d79299$var$position += 3;
                    if (newTransitions) transitionsCount += serializationsSinceTransitionRebuild * newTransitions;
                    // record the removal of the id, we can maintain our shared structure
                    if (recordIdsToRemove.length >= $5641ea8d38d79299$var$MAX_STRUCTURES - maxSharedStructures) recordIdsToRemove.shift()[$5641ea8d38d79299$var$RECORD_SYMBOL] = undefined // we are cycling back through, and have to remove old ones
                    ;
                    recordIdsToRemove.push(transition);
                    $5641ea8d38d79299$var$writeArrayHeader(length + 2);
                    encode(0xe000 + recordId);
                    encode(keys);
                    if (safePrototype === null) return; // special exit for iterator
                    for(let key in object)if (safePrototype || object.hasOwnProperty(key)) encode(object[key]);
                    return;
                }
            }
            if (length < 0x18) $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x80 | length;
            else $5641ea8d38d79299$var$writeArrayHeader(length);
            if (safePrototype === null) return; // special exit for iterator
            for(let key in object)if (safePrototype || object.hasOwnProperty(key)) encode(object[key]);
        };
        const makeRoom = (end)=>{
            let newSize;
            if (end > 0x1000000) {
                // special handling for really large buffers
                if (end - start > $5641ea8d38d79299$var$MAX_BUFFER_SIZE) throw new Error('Encoded buffer would be larger than maximum buffer size');
                newSize = Math.min($5641ea8d38d79299$var$MAX_BUFFER_SIZE, Math.round(Math.max((end - start) * (end > 0x4000000 ? 1.25 : 2), 0x400000) / 0x1000) * 0x1000);
            } else newSize = (Math.max(end - start << 2, $5641ea8d38d79299$var$target.length - 1) >> 12) + 1 << 12;
            let newBuffer = new $5641ea8d38d79299$var$ByteArrayAllocate(newSize);
            $5641ea8d38d79299$var$targetView = new DataView(newBuffer.buffer, 0, newSize);
            if ($5641ea8d38d79299$var$target.copy) $5641ea8d38d79299$var$target.copy(newBuffer, 0, start, end);
            else newBuffer.set($5641ea8d38d79299$var$target.slice(start, end));
            $5641ea8d38d79299$var$position -= start;
            start = 0;
            $5641ea8d38d79299$var$safeEnd = newBuffer.length - 10;
            return $5641ea8d38d79299$var$target = newBuffer;
        };
        let chunkThreshold = 100;
        let continuedChunkThreshold = 1000;
        this.encodeAsIterable = function(value, options) {
            return startEncoding(value, options, encodeObjectAsIterable);
        };
        this.encodeAsAsyncIterable = function(value, options) {
            return startEncoding(value, options, encodeObjectAsAsyncIterable);
        };
        function* encodeObjectAsIterable(object, iterateProperties, finalIterable) {
            let constructor = object.constructor;
            if (constructor === Object) {
                let useRecords = encoder.useRecords !== false;
                if (useRecords) writeObject(object, null); // write the record identifier
                else $5641ea8d38d79299$var$writeEntityLength(Object.keys(object).length, 0xa0);
                for(let key in object){
                    let value = object[key];
                    if (!useRecords) encode(key);
                    if (value && typeof value === 'object') {
                        if (iterateProperties[key]) yield* encodeObjectAsIterable(value, iterateProperties[key]);
                        else yield* tryEncode(value, iterateProperties, key);
                    } else encode(value);
                }
            } else if (constructor === Array) {
                let length = object.length;
                $5641ea8d38d79299$var$writeArrayHeader(length);
                for(let i = 0; i < length; i++){
                    let value = object[i];
                    if (value && (typeof value === 'object' || $5641ea8d38d79299$var$position - start > chunkThreshold)) {
                        if (iterateProperties.element) yield* encodeObjectAsIterable(value, iterateProperties.element);
                        else yield* tryEncode(value, iterateProperties, 'element');
                    } else encode(value);
                }
            } else if (object[Symbol.iterator]) {
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x9f; // start indefinite array
                for (let value of object)if (value && (typeof value === 'object' || $5641ea8d38d79299$var$position - start > chunkThreshold)) {
                    if (iterateProperties.element) yield* encodeObjectAsIterable(value, iterateProperties.element);
                    else yield* tryEncode(value, iterateProperties, 'element');
                } else encode(value);
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xff; // stop byte
            } else if ($5641ea8d38d79299$var$isBlob(object)) {
                $5641ea8d38d79299$var$writeEntityLength(object.size, 0x40); // encode as binary data
                yield $5641ea8d38d79299$var$target.subarray(start, $5641ea8d38d79299$var$position);
                yield object; // directly return blobs, they have to be encoded asynchronously
                restartEncoding();
            } else if (object[Symbol.asyncIterator]) {
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x9f; // start indefinite array
                yield $5641ea8d38d79299$var$target.subarray(start, $5641ea8d38d79299$var$position);
                yield object; // directly return async iterators, they have to be encoded asynchronously
                restartEncoding();
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xff; // stop byte
            } else encode(object);
            if (finalIterable && $5641ea8d38d79299$var$position > start) yield $5641ea8d38d79299$var$target.subarray(start, $5641ea8d38d79299$var$position);
            else if ($5641ea8d38d79299$var$position - start > chunkThreshold) {
                yield $5641ea8d38d79299$var$target.subarray(start, $5641ea8d38d79299$var$position);
                restartEncoding();
            }
        }
        function* tryEncode(value, iterateProperties, key) {
            let restart = $5641ea8d38d79299$var$position - start;
            try {
                encode(value);
                if ($5641ea8d38d79299$var$position - start > chunkThreshold) {
                    yield $5641ea8d38d79299$var$target.subarray(start, $5641ea8d38d79299$var$position);
                    restartEncoding();
                }
            } catch (error) {
                if (error.iteratorNotHandled) {
                    iterateProperties[key] = {};
                    $5641ea8d38d79299$var$position = start + restart; // restart our position so we don't have partial data from last encode
                    yield* encodeObjectAsIterable.call(this, value, iterateProperties[key]);
                } else throw error;
            }
        }
        function restartEncoding() {
            chunkThreshold = continuedChunkThreshold;
            encoder.encode(null, $5641ea8d38d79299$export$e724ae76933ea297); // restart encoding
        }
        function startEncoding(value, options, encodeIterable) {
            if (options && options.chunkThreshold) chunkThreshold = continuedChunkThreshold = options.chunkThreshold;
            else chunkThreshold = 100;
            if (value && typeof value === 'object') {
                encoder.encode(null, $5641ea8d38d79299$export$e724ae76933ea297); // start encoding
                return encodeIterable(value, encoder.iterateProperties || (encoder.iterateProperties = {}), true);
            }
            return [
                encoder.encode(value)
            ];
        }
        async function* encodeObjectAsAsyncIterable(value, iterateProperties) {
            for (let encodedValue of encodeObjectAsIterable(value, iterateProperties, true)){
                let constructor = encodedValue.constructor;
                if (constructor === $5641ea8d38d79299$var$ByteArray || constructor === Uint8Array) yield encodedValue;
                else if ($5641ea8d38d79299$var$isBlob(encodedValue)) {
                    let reader = encodedValue.stream().getReader();
                    let next;
                    while(!(next = await reader.read()).done)yield next.value;
                } else if (encodedValue[Symbol.asyncIterator]) for await (let asyncValue of encodedValue){
                    restartEncoding();
                    if (asyncValue) yield* encodeObjectAsAsyncIterable(asyncValue, iterateProperties.async || (iterateProperties.async = {}));
                    else yield encoder.encode(asyncValue);
                }
                else yield encodedValue;
            }
        }
    }
    useBuffer(buffer) {
        // this means we are finished using our own buffer and we can write over it safely
        $5641ea8d38d79299$var$target = buffer;
        $5641ea8d38d79299$var$targetView = new DataView($5641ea8d38d79299$var$target.buffer, $5641ea8d38d79299$var$target.byteOffset, $5641ea8d38d79299$var$target.byteLength);
        $5641ea8d38d79299$var$position = 0;
    }
    clearSharedData() {
        if (this.structures) this.structures = [];
        if (this.sharedValues) this.sharedValues = undefined;
    }
    updateSharedData() {
        let lastVersion = this.sharedVersion || 0;
        this.sharedVersion = lastVersion + 1;
        let structuresCopy = this.structures.slice(0);
        let sharedData = new $5641ea8d38d79299$var$SharedData(structuresCopy, this.sharedValues, this.sharedVersion);
        let saveResults = this.saveShared(sharedData, (existingShared)=>(existingShared && existingShared.version || 0) == lastVersion);
        if (saveResults === false) {
            // get updated structures and try again if the update failed
            sharedData = this.getShared() || {};
            this.structures = sharedData.structures || [];
            this.sharedValues = sharedData.packedValues;
            this.sharedVersion = sharedData.version;
            this.structures.nextId = this.structures.length;
        } else // restore structures
        structuresCopy.forEach((structure, i)=>this.structures[i] = structure);
        // saveShared may fail to write and reload, or may have reloaded to check compatibility and overwrite saved data, either way load the correct shared data
        return saveResults;
    }
}
function $5641ea8d38d79299$var$writeEntityLength(length, majorValue) {
    if (length < 0x18) $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = majorValue | length;
    else if (length < 0x100) {
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = majorValue | 0x18;
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length;
    } else if (length < 0x10000) {
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = majorValue | 0x19;
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length >> 8;
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length & 0xff;
    } else {
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = majorValue | 0x1a;
        $5641ea8d38d79299$var$targetView.setUint32($5641ea8d38d79299$var$position, length);
        $5641ea8d38d79299$var$position += 4;
    }
}
class $5641ea8d38d79299$var$SharedData {
    constructor(structures, values, version){
        this.structures = structures;
        this.packedValues = values;
        this.version = version;
    }
}
function $5641ea8d38d79299$var$writeArrayHeader(length) {
    if (length < 0x18) $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x80 | length;
    else if (length < 0x100) {
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x98;
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length;
    } else if (length < 0x10000) {
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x99;
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length >> 8;
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length & 0xff;
    } else {
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x9a;
        $5641ea8d38d79299$var$targetView.setUint32($5641ea8d38d79299$var$position, length);
        $5641ea8d38d79299$var$position += 4;
    }
}
const $5641ea8d38d79299$var$BlobConstructor = typeof Blob === 'undefined' ? function() {} : Blob;
function $5641ea8d38d79299$var$isBlob(object) {
    if (object instanceof $5641ea8d38d79299$var$BlobConstructor) return true;
    let tag = object[Symbol.toStringTag];
    return tag === 'Blob' || tag === 'File';
}
function $5641ea8d38d79299$var$findRepetitiveStrings(value, packedValues) {
    switch(typeof value){
        case 'string':
            if (value.length > 3) {
                if (packedValues.objectMap[value] > -1 || packedValues.values.length >= packedValues.maxValues) return;
                let packedStatus = packedValues.get(value);
                if (packedStatus) {
                    if (++packedStatus.count == 2) packedValues.values.push(value);
                } else {
                    packedValues.set(value, {
                        count: 1
                    });
                    if (packedValues.samplingPackedValues) {
                        let status = packedValues.samplingPackedValues.get(value);
                        if (status) status.count++;
                        else packedValues.samplingPackedValues.set(value, {
                            count: 1
                        });
                    }
                }
            }
            break;
        case 'object':
            if (value) {
                if (value instanceof Array) for(let i = 0, l = value.length; i < l; i++)$5641ea8d38d79299$var$findRepetitiveStrings(value[i], packedValues);
                else {
                    let includeKeys = !packedValues.encoder.useRecords;
                    for(var key in value)if (value.hasOwnProperty(key)) {
                        if (includeKeys) $5641ea8d38d79299$var$findRepetitiveStrings(key, packedValues);
                        $5641ea8d38d79299$var$findRepetitiveStrings(value[key], packedValues);
                    }
                }
            }
            break;
        case 'function':
            console.log(value);
    }
}
const $5641ea8d38d79299$var$isLittleEndianMachine = new Uint8Array(new Uint16Array([
    1
]).buffer)[0] == 1;
$5641ea8d38d79299$var$extensionClasses = [
    Date,
    Set,
    Error,
    RegExp,
    (0, $f048fe83766b6c6f$export$3288d34c523a1192),
    ArrayBuffer,
    Uint8Array,
    Uint8ClampedArray,
    Uint16Array,
    Uint32Array,
    typeof BigUint64Array == 'undefined' ? function() {} : BigUint64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    typeof BigInt64Array == 'undefined' ? function() {} : BigInt64Array,
    Float32Array,
    Float64Array,
    $5641ea8d38d79299$var$SharedData
];
//Object.getPrototypeOf(Uint8Array.prototype).constructor /*TypedArray*/
$5641ea8d38d79299$var$extensions = [
    {
        tag: 1,
        encode (date, encode) {
            let seconds = date.getTime() / 1000;
            if ((this.useTimestamp32 || date.getMilliseconds() === 0) && seconds >= 0 && seconds < 0x100000000) {
                // Timestamp 32
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x1a;
                $5641ea8d38d79299$var$targetView.setUint32($5641ea8d38d79299$var$position, seconds);
                $5641ea8d38d79299$var$position += 4;
            } else {
                // Timestamp float64
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xfb;
                $5641ea8d38d79299$var$targetView.setFloat64($5641ea8d38d79299$var$position, seconds);
                $5641ea8d38d79299$var$position += 8;
            }
        }
    },
    {
        tag: 258,
        encode (set, encode) {
            let array = Array.from(set);
            encode(array);
        }
    },
    {
        tag: 27,
        encode (error, encode) {
            encode([
                error.name,
                error.message
            ]);
        }
    },
    {
        tag: 27,
        encode (regex, encode) {
            encode([
                'RegExp',
                regex.source,
                regex.flags
            ]);
        }
    },
    {
        getTag (tag) {
            return tag.tag;
        },
        encode (tag, encode) {
            encode(tag.value);
        }
    },
    {
        encode (arrayBuffer, encode, makeRoom) {
            $5641ea8d38d79299$var$writeBuffer(arrayBuffer, makeRoom);
        }
    },
    {
        getTag (typedArray) {
            if (typedArray.constructor === Uint8Array) {
                if (this.tagUint8Array || $5641ea8d38d79299$var$hasNodeBuffer && this.tagUint8Array !== false) return 64;
            } // else no tag
        },
        encode (typedArray, encode, makeRoom) {
            $5641ea8d38d79299$var$writeBuffer(typedArray, makeRoom);
        }
    },
    $5641ea8d38d79299$var$typedArrayEncoder(68, 1),
    $5641ea8d38d79299$var$typedArrayEncoder(69, 2),
    $5641ea8d38d79299$var$typedArrayEncoder(70, 4),
    $5641ea8d38d79299$var$typedArrayEncoder(71, 8),
    $5641ea8d38d79299$var$typedArrayEncoder(72, 1),
    $5641ea8d38d79299$var$typedArrayEncoder(77, 2),
    $5641ea8d38d79299$var$typedArrayEncoder(78, 4),
    $5641ea8d38d79299$var$typedArrayEncoder(79, 8),
    $5641ea8d38d79299$var$typedArrayEncoder(85, 4),
    $5641ea8d38d79299$var$typedArrayEncoder(86, 8),
    {
        encode (sharedData, encode) {
            let packedValues = sharedData.packedValues || [];
            let sharedStructures = sharedData.structures || [];
            if (packedValues.values.length > 0) {
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0xd8 // one-byte tag
                ;
                $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 51 // tag 51 for packed shared structures https://www.potaroo.net/ietf/ids/draft-ietf-cbor-packed-03.txt
                ;
                $5641ea8d38d79299$var$writeArrayHeader(4);
                let valuesArray = packedValues.values;
                encode(valuesArray);
                $5641ea8d38d79299$var$writeArrayHeader(0) // prefixes
                ;
                $5641ea8d38d79299$var$writeArrayHeader(0) // suffixes
                ;
                packedObjectMap = Object.create(sharedPackedObjectMap || null);
                for(let i = 0, l = valuesArray.length; i < l; i++)packedObjectMap[valuesArray[i]] = i;
            }
            if (sharedStructures) {
                $5641ea8d38d79299$var$targetView.setUint32($5641ea8d38d79299$var$position, 0xd9dffe00);
                $5641ea8d38d79299$var$position += 3;
                let definitions = sharedStructures.slice(0);
                definitions.unshift(0xe000);
                definitions.push(new (0, $f048fe83766b6c6f$export$3288d34c523a1192)(sharedData.version, 0x53687264));
                encode(definitions);
            } else encode(new (0, $f048fe83766b6c6f$export$3288d34c523a1192)(sharedData.version, 0x53687264));
        }
    }
];
function $5641ea8d38d79299$var$typedArrayEncoder(tag, size) {
    if (!$5641ea8d38d79299$var$isLittleEndianMachine && size > 1) tag -= 4 // the big endian equivalents are 4 less
    ;
    return {
        tag: tag,
        encode: function writeExtBuffer(typedArray, encode) {
            let length = typedArray.byteLength;
            let offset = typedArray.byteOffset || 0;
            let buffer = typedArray.buffer || typedArray;
            encode($5641ea8d38d79299$var$hasNodeBuffer ? $5641ea8d38d79299$var$Buffer.from(buffer, offset, length) : new Uint8Array(buffer, offset, length));
        }
    };
}
function $5641ea8d38d79299$var$writeBuffer(buffer, makeRoom) {
    let length = buffer.byteLength;
    if (length < 0x18) $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x40 + length;
    else if (length < 0x100) {
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x58;
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length;
    } else if (length < 0x10000) {
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x59;
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length >> 8;
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = length & 0xff;
    } else {
        $5641ea8d38d79299$var$target[$5641ea8d38d79299$var$position++] = 0x5a;
        $5641ea8d38d79299$var$targetView.setUint32($5641ea8d38d79299$var$position, length);
        $5641ea8d38d79299$var$position += 4;
    }
    if ($5641ea8d38d79299$var$position + length >= $5641ea8d38d79299$var$target.length) makeRoom($5641ea8d38d79299$var$position + length);
    // if it is already a typed array (has an ArrayBuffer), use that, but if it is an ArrayBuffer itself,
    // must wrap it to set it.
    $5641ea8d38d79299$var$target.set(buffer.buffer ? buffer : new Uint8Array(buffer), $5641ea8d38d79299$var$position);
    $5641ea8d38d79299$var$position += length;
}
function $5641ea8d38d79299$var$insertIds(serialized, idsToInsert) {
    // insert the ids that need to be referenced for structured clones
    let nextId;
    let distanceToMove = idsToInsert.length * 2;
    let lastEnd = serialized.length - distanceToMove;
    idsToInsert.sort((a, b)=>a.offset > b.offset ? 1 : -1);
    for(let id = 0; id < idsToInsert.length; id++){
        let referee = idsToInsert[id];
        referee.id = id;
        for (let position of referee.references){
            serialized[position++] = id >> 8;
            serialized[position] = id & 0xff;
        }
    }
    while(nextId = idsToInsert.pop()){
        let offset = nextId.offset;
        serialized.copyWithin(offset + distanceToMove, offset, lastEnd);
        distanceToMove -= 2;
        let position = offset + distanceToMove;
        serialized[position++] = 0xd8;
        serialized[position++] = 28 // http://cbor.schmorp.de/value-sharing
        ;
        lastEnd = offset;
    }
    return serialized;
}
function $5641ea8d38d79299$var$writeBundles(start, encode) {
    $5641ea8d38d79299$var$targetView.setUint32($5641ea8d38d79299$var$bundledStrings.position + start, $5641ea8d38d79299$var$position - $5641ea8d38d79299$var$bundledStrings.position - start + 1) // the offset to bundle
    ;
    let writeStrings = $5641ea8d38d79299$var$bundledStrings;
    $5641ea8d38d79299$var$bundledStrings = null;
    encode(writeStrings[0]);
    encode(writeStrings[1]);
}
function $5641ea8d38d79299$export$4e11b2f4fcd6c82d(extension) {
    if (extension.Class) {
        if (!extension.encode) throw new Error('Extension has no encode function');
        $5641ea8d38d79299$var$extensionClasses.unshift(extension.Class);
        $5641ea8d38d79299$var$extensions.unshift(extension);
    }
    (0, $f048fe83766b6c6f$export$4e11b2f4fcd6c82d)(extension);
}
let $5641ea8d38d79299$var$defaultEncoder = new $5641ea8d38d79299$export$a50aceb0e02a00aa({
    useRecords: false
});
const $5641ea8d38d79299$export$c564cdbbe6da493 = $5641ea8d38d79299$var$defaultEncoder.encode;
const $5641ea8d38d79299$export$62a5d0ccbd8ba53e = $5641ea8d38d79299$var$defaultEncoder.encodeAsIterable;
const $5641ea8d38d79299$export$ba03bcdfc44f370a = $5641ea8d38d79299$var$defaultEncoder.encodeAsAsyncIterable;
const { NEVER: $5641ea8d38d79299$export$96c94437c95d7862, ALWAYS: $5641ea8d38d79299$export$9252627518dcde93, DECIMAL_ROUND: $5641ea8d38d79299$export$50de32e2440ab0bf, DECIMAL_FIT: $5641ea8d38d79299$export$fa7c7714126eb380 } = (0, $f048fe83766b6c6f$export$2239e49a3e351685);
const $5641ea8d38d79299$export$d41ac1453288b342 = 512;
const $5641ea8d38d79299$export$5687accb6effa257 = 1024;
const $5641ea8d38d79299$export$e724ae76933ea297 = 2048;






var $dfbfc22cd47084a6$require$Buffer = $f6af8687a2c23fac$exports.Buffer;
function $dfbfc22cd47084a6$export$82db1b517a03d6f4(objectIterator, options = {}) {
    if (!objectIterator || typeof objectIterator !== 'object') throw new Error('first argument must be an Iterable, Async Iterable, or a Promise for an Async Iterable');
    else if (typeof objectIterator[Symbol.iterator] === 'function') return $dfbfc22cd47084a6$var$encodeIterSync(objectIterator, options);
    else if (typeof objectIterator.then === 'function' || typeof objectIterator[Symbol.asyncIterator] === 'function') return $dfbfc22cd47084a6$var$encodeIterAsync(objectIterator, options);
    else throw new Error('first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a Promise');
}
function* $dfbfc22cd47084a6$var$encodeIterSync(objectIterator, options) {
    const encoder = new (0, $5641ea8d38d79299$export$a50aceb0e02a00aa)(options);
    for (const value of objectIterator)yield encoder.encode(value);
}
async function* $dfbfc22cd47084a6$var$encodeIterAsync(objectIterator, options) {
    const encoder = new (0, $5641ea8d38d79299$export$a50aceb0e02a00aa)(options);
    for await (const value of objectIterator)yield encoder.encode(value);
}
function $dfbfc22cd47084a6$export$5201756020406471(bufferIterator, options = {}) {
    if (!bufferIterator || typeof bufferIterator !== 'object') throw new Error('first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a promise');
    const decoder = new (0, $f048fe83766b6c6f$export$f9de6ca0bc043724)(options);
    let incomplete;
    const parser = (chunk)=>{
        let yields;
        // if there's incomplete data from previous chunk, concatinate and try again
        if (incomplete) {
            chunk = $dfbfc22cd47084a6$require$Buffer.concat([
                incomplete,
                chunk
            ]);
            incomplete = undefined;
        }
        try {
            yields = decoder.decodeMultiple(chunk);
        } catch (err) {
            if (err.incomplete) {
                incomplete = chunk.slice(err.lastPosition);
                yields = err.values;
            } else throw err;
        }
        return yields;
    };
    if (typeof bufferIterator[Symbol.iterator] === 'function') return function* iter() {
        for (const value of bufferIterator)yield* parser(value);
    }();
    else if (typeof bufferIterator[Symbol.asyncIterator] === 'function') return async function* iter() {
        for await (const value of bufferIterator)yield* parser(value);
    }();
}




function $8396ba2e7917554a$export$78406e843f5312da(byte) {
    return "".concat(byte < 0 ? "-" : "", "0x").concat(Math.abs(byte).toString(16).padStart(2, "0"));
}


// ExtensionCodec to handle MessagePack extensions
/**
 * ExtData is used to handle Extension Types that are not registered to ExtensionCodec.
 */ var $2bb58564d39d7fde$export$bcbeb236456bc779 = /** @class */ function() {
    function ExtData(type, data) {
        this.type = type;
        this.data = data;
    }
    return ExtData;
}();


// https://github.com/msgpack/msgpack/blob/master/spec.md#timestamp-extension-type
var $96320e97c443d180$var$__extends = undefined && undefined.__extends || function() {
    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function(d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var $96320e97c443d180$export$ef3eed12d06c0285 = /** @class */ function(_super) {
    $96320e97c443d180$var$__extends(DecodeError, _super);
    function DecodeError(message) {
        var _this = _super.call(this, message) || this;
        // fix the prototype chain in a cross-platform way
        var proto = Object.create(DecodeError.prototype);
        Object.setPrototypeOf(_this, proto);
        Object.defineProperty(_this, "name", {
            configurable: true,
            enumerable: false,
            value: DecodeError.name
        });
        return _this;
    }
    return DecodeError;
}(Error);


// Integer Utility
var $ede83edbc76bbf56$export$3314b2c271c86d70 = 4294967295;
function $ede83edbc76bbf56$export$20f71c4c8b0f96c3(view, offset, value) {
    var high = value / 4294967296;
    var low = value; // high bits are truncated by DataView
    view.setUint32(offset, high);
    view.setUint32(offset + 4, low);
}
function $ede83edbc76bbf56$export$8532a5209571c04a(view, offset, value) {
    var high = Math.floor(value / 4294967296);
    var low = value; // high bits are truncated by DataView
    view.setUint32(offset, high);
    view.setUint32(offset + 4, low);
}
function $ede83edbc76bbf56$export$69825c7adcc820c6(view, offset) {
    var high = view.getInt32(offset);
    var low = view.getUint32(offset + 4);
    return high * 4294967296 + low;
}
function $ede83edbc76bbf56$export$59a2dbf579ff9568(view, offset) {
    var high = view.getUint32(offset);
    var low = view.getUint32(offset + 4);
    return high * 4294967296 + low;
}


var $24f57d6205cf5953$export$f18369fc203f4e13 = -1;
var $24f57d6205cf5953$var$TIMESTAMP32_MAX_SEC = 4294967295; // 32-bit unsigned int
var $24f57d6205cf5953$var$TIMESTAMP64_MAX_SEC = 17179869183; // 34-bit unsigned int
function $24f57d6205cf5953$export$2fd05b828dd81159(_a) {
    var sec = _a.sec, nsec = _a.nsec;
    if (sec >= 0 && nsec >= 0 && sec <= $24f57d6205cf5953$var$TIMESTAMP64_MAX_SEC) {
        // Here sec >= 0 && nsec >= 0
        if (nsec === 0 && sec <= $24f57d6205cf5953$var$TIMESTAMP32_MAX_SEC) {
            // timestamp 32 = { sec32 (unsigned) }
            var rv = new Uint8Array(4);
            var view = new DataView(rv.buffer);
            view.setUint32(0, sec);
            return rv;
        } else {
            // timestamp 64 = { nsec30 (unsigned), sec34 (unsigned) }
            var secHigh = sec / 0x100000000;
            var secLow = sec & 0xffffffff;
            var rv = new Uint8Array(8);
            var view = new DataView(rv.buffer);
            // nsec30 | secHigh2
            view.setUint32(0, nsec << 2 | secHigh & 0x3);
            // secLow32
            view.setUint32(4, secLow);
            return rv;
        }
    } else {
        // timestamp 96 = { nsec32 (unsigned), sec64 (signed) }
        var rv = new Uint8Array(12);
        var view = new DataView(rv.buffer);
        view.setUint32(0, nsec);
        (0, $ede83edbc76bbf56$export$8532a5209571c04a)(view, 4, sec);
        return rv;
    }
}
function $24f57d6205cf5953$export$221d97b3b00b03c2(date) {
    var msec = date.getTime();
    var sec = Math.floor(msec / 1e3);
    var nsec = (msec - sec * 1e3) * 1e6;
    // Normalizes { sec, nsec } to ensure nsec is unsigned.
    var nsecInSec = Math.floor(nsec / 1e9);
    return {
        sec: sec + nsecInSec,
        nsec: nsec - nsecInSec * 1e9
    };
}
function $24f57d6205cf5953$export$32420f352fe0fc83(object) {
    if (object instanceof Date) {
        var timeSpec = $24f57d6205cf5953$export$221d97b3b00b03c2(object);
        return $24f57d6205cf5953$export$2fd05b828dd81159(timeSpec);
    } else return null;
}
function $24f57d6205cf5953$export$abfc8800a5159711(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    // data may be 32, 64, or 96 bits
    switch(data.byteLength){
        case 4:
            // timestamp 32 = { sec32 }
            var sec = view.getUint32(0);
            var nsec = 0;
            return {
                sec: sec,
                nsec: nsec
            };
        case 8:
            // timestamp 64 = { nsec30, sec34 }
            var nsec30AndSecHigh2 = view.getUint32(0);
            var secLow32 = view.getUint32(4);
            var sec = (nsec30AndSecHigh2 & 0x3) * 0x100000000 + secLow32;
            var nsec = nsec30AndSecHigh2 >>> 2;
            return {
                sec: sec,
                nsec: nsec
            };
        case 12:
            // timestamp 96 = { nsec32 (unsigned), sec64 (signed) }
            var sec = (0, $ede83edbc76bbf56$export$69825c7adcc820c6)(view, 4);
            var nsec = view.getUint32(0);
            return {
                sec: sec,
                nsec: nsec
            };
        default:
            throw new (0, $96320e97c443d180$export$ef3eed12d06c0285)("Unrecognized data size for timestamp (expected 4, 8, or 12): ".concat(data.length));
    }
}
function $24f57d6205cf5953$export$80b8ff9315e4298f(data) {
    var timeSpec = $24f57d6205cf5953$export$abfc8800a5159711(data);
    return new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
}
var $24f57d6205cf5953$export$8654479533463da1 = {
    type: $24f57d6205cf5953$export$f18369fc203f4e13,
    encode: $24f57d6205cf5953$export$32420f352fe0fc83,
    decode: $24f57d6205cf5953$export$80b8ff9315e4298f
};


var $038228c8c0f33552$export$12677a794dbd89d7 = /** @class */ function() {
    function ExtensionCodec() {
        // built-in extensions
        this.builtInEncoders = [];
        this.builtInDecoders = [];
        // custom extensions
        this.encoders = [];
        this.decoders = [];
        this.register((0, $24f57d6205cf5953$export$8654479533463da1));
    }
    ExtensionCodec.prototype.register = function(_a) {
        var type = _a.type, encode = _a.encode, decode = _a.decode;
        if (type >= 0) {
            // custom extensions
            this.encoders[type] = encode;
            this.decoders[type] = decode;
        } else {
            // built-in extensions
            var index = 1 + type;
            this.builtInEncoders[index] = encode;
            this.builtInDecoders[index] = decode;
        }
    };
    ExtensionCodec.prototype.tryToEncode = function(object, context) {
        // built-in extensions
        for(var i = 0; i < this.builtInEncoders.length; i++){
            var encodeExt = this.builtInEncoders[i];
            if (encodeExt != null) {
                var data = encodeExt(object, context);
                if (data != null) {
                    var type = -1 - i;
                    return new (0, $2bb58564d39d7fde$export$bcbeb236456bc779)(type, data);
                }
            }
        }
        // custom extensions
        for(var i = 0; i < this.encoders.length; i++){
            var encodeExt = this.encoders[i];
            if (encodeExt != null) {
                var data = encodeExt(object, context);
                if (data != null) {
                    var type = i;
                    return new (0, $2bb58564d39d7fde$export$bcbeb236456bc779)(type, data);
                }
            }
        }
        if (object instanceof (0, $2bb58564d39d7fde$export$bcbeb236456bc779)) // to keep ExtData as is
        return object;
        return null;
    };
    ExtensionCodec.prototype.decode = function(data, type, context) {
        var decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
        if (decodeExt) return decodeExt(data, type, context);
        else // decode() does not fail, returns ExtData instead.
        return new (0, $2bb58564d39d7fde$export$bcbeb236456bc779)(type, data);
    };
    ExtensionCodec.defaultCodec = new ExtensionCodec();
    return ExtensionCodec;
}();




var $07c3e2276d973f13$exports = {};
// shim for using process in browser
var $07c3e2276d973f13$var$process = $07c3e2276d973f13$exports = {};
// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
var $07c3e2276d973f13$var$cachedSetTimeout;
var $07c3e2276d973f13$var$cachedClearTimeout;
function $07c3e2276d973f13$var$defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function $07c3e2276d973f13$var$defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function() {
    try {
        if (typeof setTimeout === 'function') $07c3e2276d973f13$var$cachedSetTimeout = setTimeout;
        else $07c3e2276d973f13$var$cachedSetTimeout = $07c3e2276d973f13$var$defaultSetTimout;
    } catch (e) {
        $07c3e2276d973f13$var$cachedSetTimeout = $07c3e2276d973f13$var$defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') $07c3e2276d973f13$var$cachedClearTimeout = clearTimeout;
        else $07c3e2276d973f13$var$cachedClearTimeout = $07c3e2276d973f13$var$defaultClearTimeout;
    } catch (e) {
        $07c3e2276d973f13$var$cachedClearTimeout = $07c3e2276d973f13$var$defaultClearTimeout;
    }
})();
function $07c3e2276d973f13$var$runTimeout(fun) {
    if ($07c3e2276d973f13$var$cachedSetTimeout === setTimeout) //normal enviroments in sane situations
    return setTimeout(fun, 0);
    // if setTimeout wasn't available but was latter defined
    if (($07c3e2276d973f13$var$cachedSetTimeout === $07c3e2276d973f13$var$defaultSetTimout || !$07c3e2276d973f13$var$cachedSetTimeout) && setTimeout) {
        $07c3e2276d973f13$var$cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return $07c3e2276d973f13$var$cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return $07c3e2276d973f13$var$cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return $07c3e2276d973f13$var$cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function $07c3e2276d973f13$var$runClearTimeout(marker) {
    if ($07c3e2276d973f13$var$cachedClearTimeout === clearTimeout) //normal enviroments in sane situations
    return clearTimeout(marker);
    // if clearTimeout wasn't available but was latter defined
    if (($07c3e2276d973f13$var$cachedClearTimeout === $07c3e2276d973f13$var$defaultClearTimeout || !$07c3e2276d973f13$var$cachedClearTimeout) && clearTimeout) {
        $07c3e2276d973f13$var$cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return $07c3e2276d973f13$var$cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return $07c3e2276d973f13$var$cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return $07c3e2276d973f13$var$cachedClearTimeout.call(this, marker);
        }
    }
}
var $07c3e2276d973f13$var$queue = [];
var $07c3e2276d973f13$var$draining = false;
var $07c3e2276d973f13$var$currentQueue;
var $07c3e2276d973f13$var$queueIndex = -1;
function $07c3e2276d973f13$var$cleanUpNextTick() {
    if (!$07c3e2276d973f13$var$draining || !$07c3e2276d973f13$var$currentQueue) return;
    $07c3e2276d973f13$var$draining = false;
    if ($07c3e2276d973f13$var$currentQueue.length) $07c3e2276d973f13$var$queue = $07c3e2276d973f13$var$currentQueue.concat($07c3e2276d973f13$var$queue);
    else $07c3e2276d973f13$var$queueIndex = -1;
    if ($07c3e2276d973f13$var$queue.length) $07c3e2276d973f13$var$drainQueue();
}
function $07c3e2276d973f13$var$drainQueue() {
    if ($07c3e2276d973f13$var$draining) return;
    var timeout = $07c3e2276d973f13$var$runTimeout($07c3e2276d973f13$var$cleanUpNextTick);
    $07c3e2276d973f13$var$draining = true;
    var len = $07c3e2276d973f13$var$queue.length;
    while(len){
        $07c3e2276d973f13$var$currentQueue = $07c3e2276d973f13$var$queue;
        $07c3e2276d973f13$var$queue = [];
        while(++$07c3e2276d973f13$var$queueIndex < len)if ($07c3e2276d973f13$var$currentQueue) $07c3e2276d973f13$var$currentQueue[$07c3e2276d973f13$var$queueIndex].run();
        $07c3e2276d973f13$var$queueIndex = -1;
        len = $07c3e2276d973f13$var$queue.length;
    }
    $07c3e2276d973f13$var$currentQueue = null;
    $07c3e2276d973f13$var$draining = false;
    $07c3e2276d973f13$var$runClearTimeout(timeout);
}
$07c3e2276d973f13$var$process.nextTick = function(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) for(var i = 1; i < arguments.length; i++)args[i - 1] = arguments[i];
    $07c3e2276d973f13$var$queue.push(new $07c3e2276d973f13$var$Item(fun, args));
    if ($07c3e2276d973f13$var$queue.length === 1 && !$07c3e2276d973f13$var$draining) $07c3e2276d973f13$var$runTimeout($07c3e2276d973f13$var$drainQueue);
};
// v8 likes predictible objects
function $07c3e2276d973f13$var$Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
$07c3e2276d973f13$var$Item.prototype.run = function() {
    this.fun.apply(null, this.array);
};
$07c3e2276d973f13$var$process.title = 'browser';
$07c3e2276d973f13$var$process.browser = true;
$07c3e2276d973f13$var$process.env = {};
$07c3e2276d973f13$var$process.argv = [];
$07c3e2276d973f13$var$process.version = ''; // empty string to avoid regexp issues
$07c3e2276d973f13$var$process.versions = {};
function $07c3e2276d973f13$var$noop() {}
$07c3e2276d973f13$var$process.on = $07c3e2276d973f13$var$noop;
$07c3e2276d973f13$var$process.addListener = $07c3e2276d973f13$var$noop;
$07c3e2276d973f13$var$process.once = $07c3e2276d973f13$var$noop;
$07c3e2276d973f13$var$process.off = $07c3e2276d973f13$var$noop;
$07c3e2276d973f13$var$process.removeListener = $07c3e2276d973f13$var$noop;
$07c3e2276d973f13$var$process.removeAllListeners = $07c3e2276d973f13$var$noop;
$07c3e2276d973f13$var$process.emit = $07c3e2276d973f13$var$noop;
$07c3e2276d973f13$var$process.prependListener = $07c3e2276d973f13$var$noop;
$07c3e2276d973f13$var$process.prependOnceListener = $07c3e2276d973f13$var$noop;
$07c3e2276d973f13$var$process.listeners = function(name) {
    return [];
};
$07c3e2276d973f13$var$process.binding = function(name) {
    throw new Error('process.binding is not supported');
};
$07c3e2276d973f13$var$process.cwd = function() {
    return '/';
};
$07c3e2276d973f13$var$process.chdir = function(dir) {
    throw new Error('process.chdir is not supported');
};
$07c3e2276d973f13$var$process.umask = function() {
    return 0;
};


var $5adb2e463a139f49$var$_a, $5adb2e463a139f49$var$_b, $5adb2e463a139f49$var$_c;
var $5adb2e463a139f49$var$TEXT_ENCODING_AVAILABLE = (typeof $07c3e2276d973f13$exports === "undefined" || (($5adb2e463a139f49$var$_a = $07c3e2276d973f13$exports === null || $07c3e2276d973f13$exports === void 0 ? void 0 : $07c3e2276d973f13$exports.env) === null || $5adb2e463a139f49$var$_a === void 0 ? void 0 : $5adb2e463a139f49$var$_a["TEXT_ENCODING"]) !== "never") && typeof TextEncoder !== "undefined" && typeof TextDecoder !== "undefined";
function $5adb2e463a139f49$export$b61de95301265227(str) {
    var strLength = str.length;
    var byteLength = 0;
    var pos = 0;
    while(pos < strLength){
        var value = str.charCodeAt(pos++);
        if ((value & 0xffffff80) === 0) {
            // 1-byte
            byteLength++;
            continue;
        } else if ((value & 0xfffff800) === 0) // 2-bytes
        byteLength += 2;
        else {
            // handle surrogate pair
            if (value >= 0xd800 && value <= 0xdbff) // high surrogate
            {
                if (pos < strLength) {
                    var extra = str.charCodeAt(pos);
                    if ((extra & 0xfc00) === 0xdc00) {
                        ++pos;
                        value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
                    }
                }
            }
            if ((value & 0xffff0000) === 0) // 3-byte
            byteLength += 3;
            else // 4-byte
            byteLength += 4;
        }
    }
    return byteLength;
}
function $5adb2e463a139f49$export$1042e4338f1ef853(str, output, outputOffset) {
    var strLength = str.length;
    var offset = outputOffset;
    var pos = 0;
    while(pos < strLength){
        var value = str.charCodeAt(pos++);
        if ((value & 0xffffff80) === 0) {
            // 1-byte
            output[offset++] = value;
            continue;
        } else if ((value & 0xfffff800) === 0) // 2-bytes
        output[offset++] = value >> 6 & 0x1f | 0xc0;
        else {
            // handle surrogate pair
            if (value >= 0xd800 && value <= 0xdbff) // high surrogate
            {
                if (pos < strLength) {
                    var extra = str.charCodeAt(pos);
                    if ((extra & 0xfc00) === 0xdc00) {
                        ++pos;
                        value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
                    }
                }
            }
            if ((value & 0xffff0000) === 0) {
                // 3-byte
                output[offset++] = value >> 12 & 0x0f | 0xe0;
                output[offset++] = value >> 6 & 0x3f | 0x80;
            } else {
                // 4-byte
                output[offset++] = value >> 18 & 0x07 | 0xf0;
                output[offset++] = value >> 12 & 0x3f | 0x80;
                output[offset++] = value >> 6 & 0x3f | 0x80;
            }
        }
        output[offset++] = value & 0x3f | 0x80;
    }
}
var $5adb2e463a139f49$var$sharedTextEncoder = $5adb2e463a139f49$var$TEXT_ENCODING_AVAILABLE ? new TextEncoder() : undefined;
var $5adb2e463a139f49$export$ed34c0622b397238 = !$5adb2e463a139f49$var$TEXT_ENCODING_AVAILABLE ? (0, $ede83edbc76bbf56$export$3314b2c271c86d70) : typeof $07c3e2276d973f13$exports !== "undefined" && (($5adb2e463a139f49$var$_b = $07c3e2276d973f13$exports === null || $07c3e2276d973f13$exports === void 0 ? void 0 : $07c3e2276d973f13$exports.env) === null || $5adb2e463a139f49$var$_b === void 0 ? void 0 : $5adb2e463a139f49$var$_b["TEXT_ENCODING"]) !== "force" ? 200 : 0;
function $5adb2e463a139f49$var$utf8EncodeTEencode(str, output, outputOffset) {
    output.set($5adb2e463a139f49$var$sharedTextEncoder.encode(str), outputOffset);
}
function $5adb2e463a139f49$var$utf8EncodeTEencodeInto(str, output, outputOffset) {
    $5adb2e463a139f49$var$sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}
var $5adb2e463a139f49$export$34cfdc82d430524 = ($5adb2e463a139f49$var$sharedTextEncoder === null || $5adb2e463a139f49$var$sharedTextEncoder === void 0 ? void 0 : $5adb2e463a139f49$var$sharedTextEncoder.encodeInto) ? $5adb2e463a139f49$var$utf8EncodeTEencodeInto : $5adb2e463a139f49$var$utf8EncodeTEencode;
var $5adb2e463a139f49$var$CHUNK_SIZE = 4096;
function $5adb2e463a139f49$export$551117984c2adf4f(bytes, inputOffset, byteLength) {
    var offset = inputOffset;
    var end = offset + byteLength;
    var units = [];
    var result = "";
    while(offset < end){
        var byte1 = bytes[offset++];
        if ((byte1 & 0x80) === 0) // 1 byte
        units.push(byte1);
        else if ((byte1 & 0xe0) === 0xc0) {
            // 2 bytes
            var byte2 = bytes[offset++] & 0x3f;
            units.push((byte1 & 0x1f) << 6 | byte2);
        } else if ((byte1 & 0xf0) === 0xe0) {
            // 3 bytes
            var byte2 = bytes[offset++] & 0x3f;
            var byte3 = bytes[offset++] & 0x3f;
            units.push((byte1 & 0x1f) << 12 | byte2 << 6 | byte3);
        } else if ((byte1 & 0xf8) === 0xf0) {
            // 4 bytes
            var byte2 = bytes[offset++] & 0x3f;
            var byte3 = bytes[offset++] & 0x3f;
            var byte4 = bytes[offset++] & 0x3f;
            var unit = (byte1 & 0x07) << 0x12 | byte2 << 0x0c | byte3 << 0x06 | byte4;
            if (unit > 0xffff) {
                unit -= 0x10000;
                units.push(unit >>> 10 & 0x3ff | 0xd800);
                unit = 0xdc00 | unit & 0x3ff;
            }
            units.push(unit);
        } else units.push(byte1);
        if (units.length >= $5adb2e463a139f49$var$CHUNK_SIZE) {
            result += String.fromCharCode.apply(String, units);
            units.length = 0;
        }
    }
    if (units.length > 0) result += String.fromCharCode.apply(String, units);
    return result;
}
var $5adb2e463a139f49$var$sharedTextDecoder = $5adb2e463a139f49$var$TEXT_ENCODING_AVAILABLE ? new TextDecoder() : null;
var $5adb2e463a139f49$export$d866281c5a66d1ef = !$5adb2e463a139f49$var$TEXT_ENCODING_AVAILABLE ? (0, $ede83edbc76bbf56$export$3314b2c271c86d70) : typeof $07c3e2276d973f13$exports !== "undefined" && (($5adb2e463a139f49$var$_c = $07c3e2276d973f13$exports === null || $07c3e2276d973f13$exports === void 0 ? void 0 : $07c3e2276d973f13$exports.env) === null || $5adb2e463a139f49$var$_c === void 0 ? void 0 : $5adb2e463a139f49$var$_c["TEXT_DECODER"]) !== "force" ? 200 : 0;
function $5adb2e463a139f49$export$6ed79e41309992dc(bytes, inputOffset, byteLength) {
    var stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
    return $5adb2e463a139f49$var$sharedTextDecoder.decode(stringBytes);
}


function $94b3351f007aab3f$export$f8d669c2a17882f2(buffer) {
    if (buffer instanceof Uint8Array) return buffer;
    else if (ArrayBuffer.isView(buffer)) return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    else if (buffer instanceof ArrayBuffer) return new Uint8Array(buffer);
    else // ArrayLike<number>
    return Uint8Array.from(buffer);
}
function $94b3351f007aab3f$export$7277868462c1ba02(buffer) {
    if (buffer instanceof ArrayBuffer) return new DataView(buffer);
    var bufferView = $94b3351f007aab3f$export$f8d669c2a17882f2(buffer);
    return new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
}



var $70dc5d5b9435ce6a$var$DEFAULT_MAX_KEY_LENGTH = 16;
var $70dc5d5b9435ce6a$var$DEFAULT_MAX_LENGTH_PER_KEY = 16;
var $70dc5d5b9435ce6a$export$529b830450faf29c = /** @class */ function() {
    function CachedKeyDecoder(maxKeyLength, maxLengthPerKey) {
        if (maxKeyLength === void 0) maxKeyLength = $70dc5d5b9435ce6a$var$DEFAULT_MAX_KEY_LENGTH;
        if (maxLengthPerKey === void 0) maxLengthPerKey = $70dc5d5b9435ce6a$var$DEFAULT_MAX_LENGTH_PER_KEY;
        this.maxKeyLength = maxKeyLength;
        this.maxLengthPerKey = maxLengthPerKey;
        this.hit = 0;
        this.miss = 0;
        // avoid `new Array(N)`, which makes a sparse array,
        // because a sparse array is typically slower than a non-sparse array.
        this.caches = [];
        for(var i = 0; i < this.maxKeyLength; i++)this.caches.push([]);
    }
    CachedKeyDecoder.prototype.canBeCached = function(byteLength) {
        return byteLength > 0 && byteLength <= this.maxKeyLength;
    };
    CachedKeyDecoder.prototype.find = function(bytes, inputOffset, byteLength) {
        var records = this.caches[byteLength - 1];
        FIND_CHUNK: for(var _i = 0, records_1 = records; _i < records_1.length; _i++){
            var record = records_1[_i];
            var recordBytes = record.bytes;
            for(var j = 0; j < byteLength; j++){
                if (recordBytes[j] !== bytes[inputOffset + j]) continue FIND_CHUNK;
            }
            return record.str;
        }
        return null;
    };
    CachedKeyDecoder.prototype.store = function(bytes, value) {
        var records = this.caches[bytes.length - 1];
        var record = {
            bytes: bytes,
            str: value
        };
        if (records.length >= this.maxLengthPerKey) // `records` are full!
        // Set `record` to an arbitrary position.
        records[Math.random() * records.length | 0] = record;
        else records.push(record);
    };
    CachedKeyDecoder.prototype.decode = function(bytes, inputOffset, byteLength) {
        var cachedValue = this.find(bytes, inputOffset, byteLength);
        if (cachedValue != null) {
            this.hit++;
            return cachedValue;
        }
        this.miss++;
        var str = (0, $5adb2e463a139f49$export$551117984c2adf4f)(bytes, inputOffset, byteLength);
        // Ensure to copy a slice of bytes because the byte may be NodeJS Buffer and Buffer#slice() returns a reference to its internal ArrayBuffer.
        var slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
        this.store(slicedCopyOfBytes, str);
        return str;
    };
    return CachedKeyDecoder;
}();



var $e46bc75f53e4362d$var$__awaiter = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $e46bc75f53e4362d$var$__generator = undefined && undefined.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var $e46bc75f53e4362d$var$__asyncValues = undefined && undefined.__asyncValues || function(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
    }, i);
    function verb(n) {
        i[n] = o[n] && function(v) {
            return new Promise(function(resolve, reject) {
                v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
        };
    }
    function settle(resolve, reject, d, v) {
        Promise.resolve(v).then(function(v) {
            resolve({
                value: v,
                done: d
            });
        }, reject);
    }
};
var $e46bc75f53e4362d$var$__await = undefined && undefined.__await || function(v) {
    return this instanceof $e46bc75f53e4362d$var$__await ? (this.v = v, this) : new $e46bc75f53e4362d$var$__await(v);
};
var $e46bc75f53e4362d$var$__asyncGenerator = undefined && undefined.__asyncGenerator || function(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
    }, i;
    function verb(n) {
        if (g[n]) i[n] = function(v) {
            return new Promise(function(a, b) {
                q.push([
                    n,
                    v,
                    a,
                    b
                ]) > 1 || resume(n, v);
            });
        };
    }
    function resume(n, v) {
        try {
            step(g[n](v));
        } catch (e) {
            settle(q[0][3], e);
        }
    }
    function step(r) {
        r.value instanceof $e46bc75f53e4362d$var$__await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
        resume("next", value);
    }
    function reject(value) {
        resume("throw", value);
    }
    function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
};
var $e46bc75f53e4362d$var$isValidMapKeyType = function(key) {
    var keyType = typeof key;
    return keyType === "string" || keyType === "number";
};
var $e46bc75f53e4362d$var$HEAD_BYTE_REQUIRED = -1;
var $e46bc75f53e4362d$var$EMPTY_VIEW = new DataView(new ArrayBuffer(0));
var $e46bc75f53e4362d$var$EMPTY_BYTES = new Uint8Array($e46bc75f53e4362d$var$EMPTY_VIEW.buffer);
var $e46bc75f53e4362d$export$449c37eaf7093493 = function() {
    try {
        // IE11: The spec says it should throw RangeError,
        // IE11: but in IE11 it throws TypeError.
        $e46bc75f53e4362d$var$EMPTY_VIEW.getInt8(0);
    } catch (e) {
        return e.constructor;
    }
    throw new Error("never reached");
}();
var $e46bc75f53e4362d$var$MORE_DATA = new $e46bc75f53e4362d$export$449c37eaf7093493("Insufficient data");
var $e46bc75f53e4362d$var$sharedCachedKeyDecoder = new (0, $70dc5d5b9435ce6a$export$529b830450faf29c)();
var $e46bc75f53e4362d$export$f9de6ca0bc043724 = /** @class */ function() {
    function Decoder(extensionCodec, context, maxStrLength, maxBinLength, maxArrayLength, maxMapLength, maxExtLength, keyDecoder) {
        if (extensionCodec === void 0) extensionCodec = (0, $038228c8c0f33552$export$12677a794dbd89d7).defaultCodec;
        if (context === void 0) context = undefined;
        if (maxStrLength === void 0) maxStrLength = (0, $ede83edbc76bbf56$export$3314b2c271c86d70);
        if (maxBinLength === void 0) maxBinLength = (0, $ede83edbc76bbf56$export$3314b2c271c86d70);
        if (maxArrayLength === void 0) maxArrayLength = (0, $ede83edbc76bbf56$export$3314b2c271c86d70);
        if (maxMapLength === void 0) maxMapLength = (0, $ede83edbc76bbf56$export$3314b2c271c86d70);
        if (maxExtLength === void 0) maxExtLength = (0, $ede83edbc76bbf56$export$3314b2c271c86d70);
        if (keyDecoder === void 0) keyDecoder = $e46bc75f53e4362d$var$sharedCachedKeyDecoder;
        this.extensionCodec = extensionCodec;
        this.context = context;
        this.maxStrLength = maxStrLength;
        this.maxBinLength = maxBinLength;
        this.maxArrayLength = maxArrayLength;
        this.maxMapLength = maxMapLength;
        this.maxExtLength = maxExtLength;
        this.keyDecoder = keyDecoder;
        this.totalPos = 0;
        this.pos = 0;
        this.view = $e46bc75f53e4362d$var$EMPTY_VIEW;
        this.bytes = $e46bc75f53e4362d$var$EMPTY_BYTES;
        this.headByte = $e46bc75f53e4362d$var$HEAD_BYTE_REQUIRED;
        this.stack = [];
    }
    Decoder.prototype.reinitializeState = function() {
        this.totalPos = 0;
        this.headByte = $e46bc75f53e4362d$var$HEAD_BYTE_REQUIRED;
        this.stack.length = 0;
    // view, bytes, and pos will be re-initialized in setBuffer()
    };
    Decoder.prototype.setBuffer = function(buffer) {
        this.bytes = (0, $94b3351f007aab3f$export$f8d669c2a17882f2)(buffer);
        this.view = (0, $94b3351f007aab3f$export$7277868462c1ba02)(this.bytes);
        this.pos = 0;
    };
    Decoder.prototype.appendBuffer = function(buffer) {
        if (this.headByte === $e46bc75f53e4362d$var$HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) this.setBuffer(buffer);
        else {
            var remainingData = this.bytes.subarray(this.pos);
            var newData = (0, $94b3351f007aab3f$export$f8d669c2a17882f2)(buffer);
            // concat remainingData + newData
            var newBuffer = new Uint8Array(remainingData.length + newData.length);
            newBuffer.set(remainingData);
            newBuffer.set(newData, remainingData.length);
            this.setBuffer(newBuffer);
        }
    };
    Decoder.prototype.hasRemaining = function(size) {
        return this.view.byteLength - this.pos >= size;
    };
    Decoder.prototype.createExtraByteError = function(posToShow) {
        var _a = this, view = _a.view, pos = _a.pos;
        return new RangeError("Extra ".concat(view.byteLength - pos, " of ").concat(view.byteLength, " byte(s) found at buffer[").concat(posToShow, "]"));
    };
    /**
     * @throws {@link DecodeError}
     * @throws {@link RangeError}
     */ Decoder.prototype.decode = function(buffer) {
        this.reinitializeState();
        this.setBuffer(buffer);
        var object = this.doDecodeSync();
        if (this.hasRemaining(1)) throw this.createExtraByteError(this.pos);
        return object;
    };
    Decoder.prototype.decodeMulti = function(buffer) {
        return $e46bc75f53e4362d$var$__generator(this, function(_a) {
            switch(_a.label){
                case 0:
                    this.reinitializeState();
                    this.setBuffer(buffer);
                    _a.label = 1;
                case 1:
                    if (!this.hasRemaining(1)) return [
                        3 /*break*/ ,
                        3
                    ];
                    return [
                        4 /*yield*/ ,
                        this.doDecodeSync()
                    ];
                case 2:
                    _a.sent();
                    return [
                        3 /*break*/ ,
                        1
                    ];
                case 3:
                    return [
                        2 /*return*/ 
                    ];
            }
        });
    };
    Decoder.prototype.decodeAsync = function(stream) {
        var stream_1, stream_1_1;
        var e_1, _a;
        return $e46bc75f53e4362d$var$__awaiter(this, void 0, void 0, function() {
            var decoded, object, buffer, e_1_1, _b, headByte, pos, totalPos;
            return $e46bc75f53e4362d$var$__generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        decoded = false;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([
                            1,
                            6,
                            7,
                            12
                        ]);
                        stream_1 = $e46bc75f53e4362d$var$__asyncValues(stream);
                        _c.label = 2;
                    case 2:
                        return [
                            4 /*yield*/ ,
                            stream_1.next()
                        ];
                    case 3:
                        if (!(stream_1_1 = _c.sent(), !stream_1_1.done)) return [
                            3 /*break*/ ,
                            5
                        ];
                        buffer = stream_1_1.value;
                        if (decoded) throw this.createExtraByteError(this.totalPos);
                        this.appendBuffer(buffer);
                        try {
                            object = this.doDecodeSync();
                            decoded = true;
                        } catch (e) {
                            if (!(e instanceof $e46bc75f53e4362d$export$449c37eaf7093493)) throw e; // rethrow
                        // fallthrough
                        }
                        this.totalPos += this.pos;
                        _c.label = 4;
                    case 4:
                        return [
                            3 /*break*/ ,
                            2
                        ];
                    case 5:
                        return [
                            3 /*break*/ ,
                            12
                        ];
                    case 6:
                        e_1_1 = _c.sent();
                        e_1 = {
                            error: e_1_1
                        };
                        return [
                            3 /*break*/ ,
                            12
                        ];
                    case 7:
                        _c.trys.push([
                            7,
                            ,
                            10,
                            11
                        ]);
                        if (!(stream_1_1 && !stream_1_1.done && (_a = stream_1.return))) return [
                            3 /*break*/ ,
                            9
                        ];
                        return [
                            4 /*yield*/ ,
                            _a.call(stream_1)
                        ];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9:
                        return [
                            3 /*break*/ ,
                            11
                        ];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [
                            7 /*endfinally*/ 
                        ];
                    case 11:
                        return [
                            7 /*endfinally*/ 
                        ];
                    case 12:
                        if (decoded) {
                            if (this.hasRemaining(1)) throw this.createExtraByteError(this.totalPos);
                            return [
                                2 /*return*/ ,
                                object
                            ];
                        }
                        _b = this, headByte = _b.headByte, pos = _b.pos, totalPos = _b.totalPos;
                        throw new RangeError("Insufficient data in parsing ".concat((0, $8396ba2e7917554a$export$78406e843f5312da)(headByte), " at ").concat(totalPos, " (").concat(pos, " in the current buffer)"));
                }
            });
        });
    };
    Decoder.prototype.decodeArrayStream = function(stream) {
        return this.decodeMultiAsync(stream, true);
    };
    Decoder.prototype.decodeStream = function(stream) {
        return this.decodeMultiAsync(stream, false);
    };
    Decoder.prototype.decodeMultiAsync = function(stream, isArray) {
        return $e46bc75f53e4362d$var$__asyncGenerator(this, arguments, function decodeMultiAsync_1() {
            var isArrayHeaderRequired, arrayItemsLeft, stream_2, stream_2_1, buffer, e_2, e_3_1;
            var e_3, _a;
            return $e46bc75f53e4362d$var$__generator(this, function(_b) {
                switch(_b.label){
                    case 0:
                        isArrayHeaderRequired = isArray;
                        arrayItemsLeft = -1;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([
                            1,
                            13,
                            14,
                            19
                        ]);
                        stream_2 = $e46bc75f53e4362d$var$__asyncValues(stream);
                        _b.label = 2;
                    case 2:
                        return [
                            4 /*yield*/ ,
                            $e46bc75f53e4362d$var$__await(stream_2.next())
                        ];
                    case 3:
                        if (!(stream_2_1 = _b.sent(), !stream_2_1.done)) return [
                            3 /*break*/ ,
                            12
                        ];
                        buffer = stream_2_1.value;
                        if (isArray && arrayItemsLeft === 0) throw this.createExtraByteError(this.totalPos);
                        this.appendBuffer(buffer);
                        if (isArrayHeaderRequired) {
                            arrayItemsLeft = this.readArraySize();
                            isArrayHeaderRequired = false;
                            this.complete();
                        }
                        _b.label = 4;
                    case 4:
                        _b.trys.push([
                            4,
                            9,
                            ,
                            10
                        ]);
                        _b.label = 5;
                    case 5:
                        return [
                            4 /*yield*/ ,
                            $e46bc75f53e4362d$var$__await(this.doDecodeSync())
                        ];
                    case 6:
                        return [
                            4 /*yield*/ ,
                            _b.sent()
                        ];
                    case 7:
                        _b.sent();
                        if (--arrayItemsLeft === 0) return [
                            3 /*break*/ ,
                            8
                        ];
                        return [
                            3 /*break*/ ,
                            5
                        ];
                    case 8:
                        return [
                            3 /*break*/ ,
                            10
                        ];
                    case 9:
                        e_2 = _b.sent();
                        if (!(e_2 instanceof $e46bc75f53e4362d$export$449c37eaf7093493)) throw e_2; // rethrow
                        return [
                            3 /*break*/ ,
                            10
                        ];
                    case 10:
                        this.totalPos += this.pos;
                        _b.label = 11;
                    case 11:
                        return [
                            3 /*break*/ ,
                            2
                        ];
                    case 12:
                        return [
                            3 /*break*/ ,
                            19
                        ];
                    case 13:
                        e_3_1 = _b.sent();
                        e_3 = {
                            error: e_3_1
                        };
                        return [
                            3 /*break*/ ,
                            19
                        ];
                    case 14:
                        _b.trys.push([
                            14,
                            ,
                            17,
                            18
                        ]);
                        if (!(stream_2_1 && !stream_2_1.done && (_a = stream_2.return))) return [
                            3 /*break*/ ,
                            16
                        ];
                        return [
                            4 /*yield*/ ,
                            $e46bc75f53e4362d$var$__await(_a.call(stream_2))
                        ];
                    case 15:
                        _b.sent();
                        _b.label = 16;
                    case 16:
                        return [
                            3 /*break*/ ,
                            18
                        ];
                    case 17:
                        if (e_3) throw e_3.error;
                        return [
                            7 /*endfinally*/ 
                        ];
                    case 18:
                        return [
                            7 /*endfinally*/ 
                        ];
                    case 19:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    Decoder.prototype.doDecodeSync = function() {
        DECODE: while(true){
            var headByte = this.readHeadByte();
            var object = void 0;
            if (headByte >= 0xe0) // negative fixint (111x xxxx) 0xe0 - 0xff
            object = headByte - 0x100;
            else if (headByte < 0xc0) {
                if (headByte < 0x80) // positive fixint (0xxx xxxx) 0x00 - 0x7f
                object = headByte;
                else if (headByte < 0x90) {
                    // fixmap (1000 xxxx) 0x80 - 0x8f
                    var size = headByte - 0x80;
                    if (size !== 0) {
                        this.pushMapState(size);
                        this.complete();
                        continue DECODE;
                    } else object = {};
                } else if (headByte < 0xa0) {
                    // fixarray (1001 xxxx) 0x90 - 0x9f
                    var size = headByte - 0x90;
                    if (size !== 0) {
                        this.pushArrayState(size);
                        this.complete();
                        continue DECODE;
                    } else object = [];
                } else {
                    // fixstr (101x xxxx) 0xa0 - 0xbf
                    var byteLength = headByte - 0xa0;
                    object = this.decodeUtf8String(byteLength, 0);
                }
            } else if (headByte === 0xc0) // nil
            object = null;
            else if (headByte === 0xc2) // false
            object = false;
            else if (headByte === 0xc3) // true
            object = true;
            else if (headByte === 0xca) // float 32
            object = this.readF32();
            else if (headByte === 0xcb) // float 64
            object = this.readF64();
            else if (headByte === 0xcc) // uint 8
            object = this.readU8();
            else if (headByte === 0xcd) // uint 16
            object = this.readU16();
            else if (headByte === 0xce) // uint 32
            object = this.readU32();
            else if (headByte === 0xcf) // uint 64
            object = this.readU64();
            else if (headByte === 0xd0) // int 8
            object = this.readI8();
            else if (headByte === 0xd1) // int 16
            object = this.readI16();
            else if (headByte === 0xd2) // int 32
            object = this.readI32();
            else if (headByte === 0xd3) // int 64
            object = this.readI64();
            else if (headByte === 0xd9) {
                // str 8
                var byteLength = this.lookU8();
                object = this.decodeUtf8String(byteLength, 1);
            } else if (headByte === 0xda) {
                // str 16
                var byteLength = this.lookU16();
                object = this.decodeUtf8String(byteLength, 2);
            } else if (headByte === 0xdb) {
                // str 32
                var byteLength = this.lookU32();
                object = this.decodeUtf8String(byteLength, 4);
            } else if (headByte === 0xdc) {
                // array 16
                var size = this.readU16();
                if (size !== 0) {
                    this.pushArrayState(size);
                    this.complete();
                    continue DECODE;
                } else object = [];
            } else if (headByte === 0xdd) {
                // array 32
                var size = this.readU32();
                if (size !== 0) {
                    this.pushArrayState(size);
                    this.complete();
                    continue DECODE;
                } else object = [];
            } else if (headByte === 0xde) {
                // map 16
                var size = this.readU16();
                if (size !== 0) {
                    this.pushMapState(size);
                    this.complete();
                    continue DECODE;
                } else object = {};
            } else if (headByte === 0xdf) {
                // map 32
                var size = this.readU32();
                if (size !== 0) {
                    this.pushMapState(size);
                    this.complete();
                    continue DECODE;
                } else object = {};
            } else if (headByte === 0xc4) {
                // bin 8
                var size = this.lookU8();
                object = this.decodeBinary(size, 1);
            } else if (headByte === 0xc5) {
                // bin 16
                var size = this.lookU16();
                object = this.decodeBinary(size, 2);
            } else if (headByte === 0xc6) {
                // bin 32
                var size = this.lookU32();
                object = this.decodeBinary(size, 4);
            } else if (headByte === 0xd4) // fixext 1
            object = this.decodeExtension(1, 0);
            else if (headByte === 0xd5) // fixext 2
            object = this.decodeExtension(2, 0);
            else if (headByte === 0xd6) // fixext 4
            object = this.decodeExtension(4, 0);
            else if (headByte === 0xd7) // fixext 8
            object = this.decodeExtension(8, 0);
            else if (headByte === 0xd8) // fixext 16
            object = this.decodeExtension(16, 0);
            else if (headByte === 0xc7) {
                // ext 8
                var size = this.lookU8();
                object = this.decodeExtension(size, 1);
            } else if (headByte === 0xc8) {
                // ext 16
                var size = this.lookU16();
                object = this.decodeExtension(size, 2);
            } else if (headByte === 0xc9) {
                // ext 32
                var size = this.lookU32();
                object = this.decodeExtension(size, 4);
            } else throw new (0, $96320e97c443d180$export$ef3eed12d06c0285)("Unrecognized type byte: ".concat((0, $8396ba2e7917554a$export$78406e843f5312da)(headByte)));
            this.complete();
            var stack = this.stack;
            while(stack.length > 0){
                // arrays and maps
                var state = stack[stack.length - 1];
                if (state.type === 0 /* State.ARRAY */ ) {
                    state.array[state.position] = object;
                    state.position++;
                    if (state.position === state.size) {
                        stack.pop();
                        object = state.array;
                    } else continue DECODE;
                } else if (state.type === 1 /* State.MAP_KEY */ ) {
                    if (!$e46bc75f53e4362d$var$isValidMapKeyType(object)) throw new (0, $96320e97c443d180$export$ef3eed12d06c0285)("The type of key must be string or number but " + typeof object);
                    if (object === "__proto__") throw new (0, $96320e97c443d180$export$ef3eed12d06c0285)("The key __proto__ is not allowed");
                    state.key = object;
                    state.type = 2 /* State.MAP_VALUE */ ;
                    continue DECODE;
                } else {
                    // it must be `state.type === State.MAP_VALUE` here
                    state.map[state.key] = object;
                    state.readCount++;
                    if (state.readCount === state.size) {
                        stack.pop();
                        object = state.map;
                    } else {
                        state.key = null;
                        state.type = 1 /* State.MAP_KEY */ ;
                        continue DECODE;
                    }
                }
            }
            return object;
        }
    };
    Decoder.prototype.readHeadByte = function() {
        if (this.headByte === $e46bc75f53e4362d$var$HEAD_BYTE_REQUIRED) this.headByte = this.readU8();
        return this.headByte;
    };
    Decoder.prototype.complete = function() {
        this.headByte = $e46bc75f53e4362d$var$HEAD_BYTE_REQUIRED;
    };
    Decoder.prototype.readArraySize = function() {
        var headByte = this.readHeadByte();
        switch(headByte){
            case 0xdc:
                return this.readU16();
            case 0xdd:
                return this.readU32();
            default:
                if (headByte < 0xa0) return headByte - 0x90;
                else throw new (0, $96320e97c443d180$export$ef3eed12d06c0285)("Unrecognized array type byte: ".concat((0, $8396ba2e7917554a$export$78406e843f5312da)(headByte)));
        }
    };
    Decoder.prototype.pushMapState = function(size) {
        if (size > this.maxMapLength) throw new (0, $96320e97c443d180$export$ef3eed12d06c0285)("Max length exceeded: map length (".concat(size, ") > maxMapLengthLength (").concat(this.maxMapLength, ")"));
        this.stack.push({
            type: 1 /* State.MAP_KEY */ ,
            size: size,
            key: null,
            readCount: 0,
            map: {}
        });
    };
    Decoder.prototype.pushArrayState = function(size) {
        if (size > this.maxArrayLength) throw new (0, $96320e97c443d180$export$ef3eed12d06c0285)("Max length exceeded: array length (".concat(size, ") > maxArrayLength (").concat(this.maxArrayLength, ")"));
        this.stack.push({
            type: 0 /* State.ARRAY */ ,
            size: size,
            array: new Array(size),
            position: 0
        });
    };
    Decoder.prototype.decodeUtf8String = function(byteLength, headerOffset) {
        var _a;
        if (byteLength > this.maxStrLength) throw new (0, $96320e97c443d180$export$ef3eed12d06c0285)("Max length exceeded: UTF-8 byte length (".concat(byteLength, ") > maxStrLength (").concat(this.maxStrLength, ")"));
        if (this.bytes.byteLength < this.pos + headerOffset + byteLength) throw $e46bc75f53e4362d$var$MORE_DATA;
        var offset = this.pos + headerOffset;
        var object;
        if (this.stateIsMapKey() && ((_a = this.keyDecoder) === null || _a === void 0 ? void 0 : _a.canBeCached(byteLength))) object = this.keyDecoder.decode(this.bytes, offset, byteLength);
        else if (byteLength > (0, $5adb2e463a139f49$export$d866281c5a66d1ef)) object = (0, $5adb2e463a139f49$export$6ed79e41309992dc)(this.bytes, offset, byteLength);
        else object = (0, $5adb2e463a139f49$export$551117984c2adf4f)(this.bytes, offset, byteLength);
        this.pos += headerOffset + byteLength;
        return object;
    };
    Decoder.prototype.stateIsMapKey = function() {
        if (this.stack.length > 0) {
            var state = this.stack[this.stack.length - 1];
            return state.type === 1 /* State.MAP_KEY */ ;
        }
        return false;
    };
    Decoder.prototype.decodeBinary = function(byteLength, headOffset) {
        if (byteLength > this.maxBinLength) throw new (0, $96320e97c443d180$export$ef3eed12d06c0285)("Max length exceeded: bin length (".concat(byteLength, ") > maxBinLength (").concat(this.maxBinLength, ")"));
        if (!this.hasRemaining(byteLength + headOffset)) throw $e46bc75f53e4362d$var$MORE_DATA;
        var offset = this.pos + headOffset;
        var object = this.bytes.subarray(offset, offset + byteLength);
        this.pos += headOffset + byteLength;
        return object;
    };
    Decoder.prototype.decodeExtension = function(size, headOffset) {
        if (size > this.maxExtLength) throw new (0, $96320e97c443d180$export$ef3eed12d06c0285)("Max length exceeded: ext length (".concat(size, ") > maxExtLength (").concat(this.maxExtLength, ")"));
        var extType = this.view.getInt8(this.pos + headOffset);
        var data = this.decodeBinary(size, headOffset + 1 /* extType */ );
        return this.extensionCodec.decode(data, extType, this.context);
    };
    Decoder.prototype.lookU8 = function() {
        return this.view.getUint8(this.pos);
    };
    Decoder.prototype.lookU16 = function() {
        return this.view.getUint16(this.pos);
    };
    Decoder.prototype.lookU32 = function() {
        return this.view.getUint32(this.pos);
    };
    Decoder.prototype.readU8 = function() {
        var value = this.view.getUint8(this.pos);
        this.pos++;
        return value;
    };
    Decoder.prototype.readI8 = function() {
        var value = this.view.getInt8(this.pos);
        this.pos++;
        return value;
    };
    Decoder.prototype.readU16 = function() {
        var value = this.view.getUint16(this.pos);
        this.pos += 2;
        return value;
    };
    Decoder.prototype.readI16 = function() {
        var value = this.view.getInt16(this.pos);
        this.pos += 2;
        return value;
    };
    Decoder.prototype.readU32 = function() {
        var value = this.view.getUint32(this.pos);
        this.pos += 4;
        return value;
    };
    Decoder.prototype.readI32 = function() {
        var value = this.view.getInt32(this.pos);
        this.pos += 4;
        return value;
    };
    Decoder.prototype.readU64 = function() {
        var value = (0, $ede83edbc76bbf56$export$59a2dbf579ff9568)(this.view, this.pos);
        this.pos += 8;
        return value;
    };
    Decoder.prototype.readI64 = function() {
        var value = (0, $ede83edbc76bbf56$export$69825c7adcc820c6)(this.view, this.pos);
        this.pos += 8;
        return value;
    };
    Decoder.prototype.readF32 = function() {
        var value = this.view.getFloat32(this.pos);
        this.pos += 4;
        return value;
    };
    Decoder.prototype.readF64 = function() {
        var value = this.view.getFloat64(this.pos);
        this.pos += 8;
        return value;
    };
    return Decoder;
}();


// utility for whatwg streams
var $89060679a3532466$var$__generator = undefined && undefined.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var $89060679a3532466$var$__await = undefined && undefined.__await || function(v) {
    return this instanceof $89060679a3532466$var$__await ? (this.v = v, this) : new $89060679a3532466$var$__await(v);
};
var $89060679a3532466$var$__asyncGenerator = undefined && undefined.__asyncGenerator || function(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
    }, i;
    function verb(n) {
        if (g[n]) i[n] = function(v) {
            return new Promise(function(a, b) {
                q.push([
                    n,
                    v,
                    a,
                    b
                ]) > 1 || resume(n, v);
            });
        };
    }
    function resume(n, v) {
        try {
            step(g[n](v));
        } catch (e) {
            settle(q[0][3], e);
        }
    }
    function step(r) {
        r.value instanceof $89060679a3532466$var$__await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
        resume("next", value);
    }
    function reject(value) {
        resume("throw", value);
    }
    function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
};
function $89060679a3532466$export$edb10ab8dd75a915(object) {
    return object[Symbol.asyncIterator] != null;
}
function $89060679a3532466$var$assertNonNull(value) {
    if (value == null) throw new Error("Assertion Failure: value must not be null nor undefined");
}
function $89060679a3532466$export$f62cf0e66867a58e(stream) {
    return $89060679a3532466$var$__asyncGenerator(this, arguments, function asyncIterableFromStream_1() {
        var reader, _a, done, value;
        return $89060679a3532466$var$__generator(this, function(_b) {
            switch(_b.label){
                case 0:
                    reader = stream.getReader();
                    _b.label = 1;
                case 1:
                    _b.trys.push([
                        1,
                        ,
                        9,
                        10
                    ]);
                    _b.label = 2;
                case 2:
                    return [
                        4 /*yield*/ ,
                        $89060679a3532466$var$__await(reader.read())
                    ];
                case 3:
                    _a = _b.sent(), done = _a.done, value = _a.value;
                    if (!done) return [
                        3 /*break*/ ,
                        5
                    ];
                    return [
                        4 /*yield*/ ,
                        $89060679a3532466$var$__await(void 0)
                    ];
                case 4:
                    return [
                        2 /*return*/ ,
                        _b.sent()
                    ];
                case 5:
                    $89060679a3532466$var$assertNonNull(value);
                    return [
                        4 /*yield*/ ,
                        $89060679a3532466$var$__await(value)
                    ];
                case 6:
                    return [
                        4 /*yield*/ ,
                        _b.sent()
                    ];
                case 7:
                    _b.sent();
                    return [
                        3 /*break*/ ,
                        2
                    ];
                case 8:
                    return [
                        3 /*break*/ ,
                        10
                    ];
                case 9:
                    reader.releaseLock();
                    return [
                        7 /*endfinally*/ 
                    ];
                case 10:
                    return [
                        2 /*return*/ 
                    ];
            }
        });
    });
}
function $89060679a3532466$export$bf99ef56e8bd104(streamLike) {
    if ($89060679a3532466$export$edb10ab8dd75a915(streamLike)) return streamLike;
    else return $89060679a3532466$export$f62cf0e66867a58e(streamLike);
}



var $d76e52262b9f6a79$export$ca6ec972f712a9eb = {};
function $d76e52262b9f6a79$export$2f872c0f2117be69(buffer, options) {
    if (options === void 0) options = $d76e52262b9f6a79$export$ca6ec972f712a9eb;
    var decoder = new (0, $e46bc75f53e4362d$export$f9de6ca0bc043724)(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decode(buffer);
}
function $d76e52262b9f6a79$export$43cc91859d9fdc54(buffer, options) {
    if (options === void 0) options = $d76e52262b9f6a79$export$ca6ec972f712a9eb;
    var decoder = new (0, $e46bc75f53e4362d$export$f9de6ca0bc043724)(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeMulti(buffer);
}


var $2a3fad6258da7792$var$__awaiter = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $2a3fad6258da7792$var$__generator = undefined && undefined.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
function $2a3fad6258da7792$export$e4c183687a6ff9b(streamLike, options) {
    if (options === void 0) options = (0, $d76e52262b9f6a79$export$ca6ec972f712a9eb);
    return $2a3fad6258da7792$var$__awaiter(this, void 0, void 0, function() {
        var stream, decoder;
        return $2a3fad6258da7792$var$__generator(this, function(_a) {
            stream = (0, $89060679a3532466$export$bf99ef56e8bd104)(streamLike);
            decoder = new (0, $e46bc75f53e4362d$export$f9de6ca0bc043724)(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
            return [
                2 /*return*/ ,
                decoder.decodeAsync(stream)
            ];
        });
    });
}
function $2a3fad6258da7792$export$b1b94ac44d9853a4(streamLike, options) {
    if (options === void 0) options = (0, $d76e52262b9f6a79$export$ca6ec972f712a9eb);
    var stream = (0, $89060679a3532466$export$bf99ef56e8bd104)(streamLike);
    var decoder = new (0, $e46bc75f53e4362d$export$f9de6ca0bc043724)(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeArrayStream(stream);
}
function $2a3fad6258da7792$export$bf87d8a088c760fb(streamLike, options) {
    if (options === void 0) options = (0, $d76e52262b9f6a79$export$ca6ec972f712a9eb);
    var stream = (0, $89060679a3532466$export$bf99ef56e8bd104)(streamLike);
    var decoder = new (0, $e46bc75f53e4362d$export$f9de6ca0bc043724)(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeStream(stream);
}
function $2a3fad6258da7792$export$7fb0f205e4fd0bbe(streamLike, options) {
    if (options === void 0) options = (0, $d76e52262b9f6a79$export$ca6ec972f712a9eb);
    return $2a3fad6258da7792$export$bf87d8a088c760fb(streamLike, options);
}





var $b9919a45dd64548b$export$2c6de1218fe0e46d = 100;
var $b9919a45dd64548b$export$29659805a45f979c = 2048;
var $b9919a45dd64548b$export$a50aceb0e02a00aa = /** @class */ function() {
    function Encoder(extensionCodec, context, maxDepth, initialBufferSize, sortKeys, forceFloat32, ignoreUndefined, forceIntegerToFloat) {
        if (extensionCodec === void 0) extensionCodec = (0, $038228c8c0f33552$export$12677a794dbd89d7).defaultCodec;
        if (context === void 0) context = undefined;
        if (maxDepth === void 0) maxDepth = $b9919a45dd64548b$export$2c6de1218fe0e46d;
        if (initialBufferSize === void 0) initialBufferSize = $b9919a45dd64548b$export$29659805a45f979c;
        if (sortKeys === void 0) sortKeys = false;
        if (forceFloat32 === void 0) forceFloat32 = false;
        if (ignoreUndefined === void 0) ignoreUndefined = false;
        if (forceIntegerToFloat === void 0) forceIntegerToFloat = false;
        this.extensionCodec = extensionCodec;
        this.context = context;
        this.maxDepth = maxDepth;
        this.initialBufferSize = initialBufferSize;
        this.sortKeys = sortKeys;
        this.forceFloat32 = forceFloat32;
        this.ignoreUndefined = ignoreUndefined;
        this.forceIntegerToFloat = forceIntegerToFloat;
        this.pos = 0;
        this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
        this.bytes = new Uint8Array(this.view.buffer);
    }
    Encoder.prototype.reinitializeState = function() {
        this.pos = 0;
    };
    /**
     * This is almost equivalent to {@link Encoder#encode}, but it returns an reference of the encoder's internal buffer and thus much faster than {@link Encoder#encode}.
     *
     * @returns Encodes the object and returns a shared reference the encoder's internal buffer.
     */ Encoder.prototype.encodeSharedRef = function(object) {
        this.reinitializeState();
        this.doEncode(object, 1);
        return this.bytes.subarray(0, this.pos);
    };
    /**
     * @returns Encodes the object and returns a copy of the encoder's internal buffer.
     */ Encoder.prototype.encode = function(object) {
        this.reinitializeState();
        this.doEncode(object, 1);
        return this.bytes.slice(0, this.pos);
    };
    Encoder.prototype.doEncode = function(object, depth) {
        if (depth > this.maxDepth) throw new Error("Too deep objects in depth ".concat(depth));
        if (object == null) this.encodeNil();
        else if (typeof object === "boolean") this.encodeBoolean(object);
        else if (typeof object === "number") this.encodeNumber(object);
        else if (typeof object === "string") this.encodeString(object);
        else this.encodeObject(object, depth);
    };
    Encoder.prototype.ensureBufferSizeToWrite = function(sizeToWrite) {
        var requiredSize = this.pos + sizeToWrite;
        if (this.view.byteLength < requiredSize) this.resizeBuffer(requiredSize * 2);
    };
    Encoder.prototype.resizeBuffer = function(newSize) {
        var newBuffer = new ArrayBuffer(newSize);
        var newBytes = new Uint8Array(newBuffer);
        var newView = new DataView(newBuffer);
        newBytes.set(this.bytes);
        this.view = newView;
        this.bytes = newBytes;
    };
    Encoder.prototype.encodeNil = function() {
        this.writeU8(0xc0);
    };
    Encoder.prototype.encodeBoolean = function(object) {
        if (object === false) this.writeU8(0xc2);
        else this.writeU8(0xc3);
    };
    Encoder.prototype.encodeNumber = function(object) {
        if (Number.isSafeInteger(object) && !this.forceIntegerToFloat) {
            if (object >= 0) {
                if (object < 0x80) // positive fixint
                this.writeU8(object);
                else if (object < 0x100) {
                    // uint 8
                    this.writeU8(0xcc);
                    this.writeU8(object);
                } else if (object < 0x10000) {
                    // uint 16
                    this.writeU8(0xcd);
                    this.writeU16(object);
                } else if (object < 0x100000000) {
                    // uint 32
                    this.writeU8(0xce);
                    this.writeU32(object);
                } else {
                    // uint 64
                    this.writeU8(0xcf);
                    this.writeU64(object);
                }
            } else {
                if (object >= -32) // negative fixint
                this.writeU8(0xe0 | object + 0x20);
                else if (object >= -128) {
                    // int 8
                    this.writeU8(0xd0);
                    this.writeI8(object);
                } else if (object >= -32768) {
                    // int 16
                    this.writeU8(0xd1);
                    this.writeI16(object);
                } else if (object >= -2147483648) {
                    // int 32
                    this.writeU8(0xd2);
                    this.writeI32(object);
                } else {
                    // int 64
                    this.writeU8(0xd3);
                    this.writeI64(object);
                }
            }
        } else // non-integer numbers
        if (this.forceFloat32) {
            // float 32
            this.writeU8(0xca);
            this.writeF32(object);
        } else {
            // float 64
            this.writeU8(0xcb);
            this.writeF64(object);
        }
    };
    Encoder.prototype.writeStringHeader = function(byteLength) {
        if (byteLength < 32) // fixstr
        this.writeU8(0xa0 + byteLength);
        else if (byteLength < 0x100) {
            // str 8
            this.writeU8(0xd9);
            this.writeU8(byteLength);
        } else if (byteLength < 0x10000) {
            // str 16
            this.writeU8(0xda);
            this.writeU16(byteLength);
        } else if (byteLength < 0x100000000) {
            // str 32
            this.writeU8(0xdb);
            this.writeU32(byteLength);
        } else throw new Error("Too long string: ".concat(byteLength, " bytes in UTF-8"));
    };
    Encoder.prototype.encodeString = function(object) {
        var maxHeaderSize = 5;
        var strLength = object.length;
        if (strLength > (0, $5adb2e463a139f49$export$ed34c0622b397238)) {
            var byteLength = (0, $5adb2e463a139f49$export$b61de95301265227)(object);
            this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
            this.writeStringHeader(byteLength);
            (0, $5adb2e463a139f49$export$34cfdc82d430524)(object, this.bytes, this.pos);
            this.pos += byteLength;
        } else {
            var byteLength = (0, $5adb2e463a139f49$export$b61de95301265227)(object);
            this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
            this.writeStringHeader(byteLength);
            (0, $5adb2e463a139f49$export$1042e4338f1ef853)(object, this.bytes, this.pos);
            this.pos += byteLength;
        }
    };
    Encoder.prototype.encodeObject = function(object, depth) {
        // try to encode objects with custom codec first of non-primitives
        var ext = this.extensionCodec.tryToEncode(object, this.context);
        if (ext != null) this.encodeExtension(ext);
        else if (Array.isArray(object)) this.encodeArray(object, depth);
        else if (ArrayBuffer.isView(object)) this.encodeBinary(object);
        else if (typeof object === "object") this.encodeMap(object, depth);
        else // symbol, function and other special object come here unless extensionCodec handles them.
        throw new Error("Unrecognized object: ".concat(Object.prototype.toString.apply(object)));
    };
    Encoder.prototype.encodeBinary = function(object) {
        var size = object.byteLength;
        if (size < 0x100) {
            // bin 8
            this.writeU8(0xc4);
            this.writeU8(size);
        } else if (size < 0x10000) {
            // bin 16
            this.writeU8(0xc5);
            this.writeU16(size);
        } else if (size < 0x100000000) {
            // bin 32
            this.writeU8(0xc6);
            this.writeU32(size);
        } else throw new Error("Too large binary: ".concat(size));
        var bytes = (0, $94b3351f007aab3f$export$f8d669c2a17882f2)(object);
        this.writeU8a(bytes);
    };
    Encoder.prototype.encodeArray = function(object, depth) {
        var size = object.length;
        if (size < 16) // fixarray
        this.writeU8(0x90 + size);
        else if (size < 0x10000) {
            // array 16
            this.writeU8(0xdc);
            this.writeU16(size);
        } else if (size < 0x100000000) {
            // array 32
            this.writeU8(0xdd);
            this.writeU32(size);
        } else throw new Error("Too large array: ".concat(size));
        for(var _i = 0, object_1 = object; _i < object_1.length; _i++){
            var item = object_1[_i];
            this.doEncode(item, depth + 1);
        }
    };
    Encoder.prototype.countWithoutUndefined = function(object, keys) {
        var count = 0;
        for(var _i = 0, keys_1 = keys; _i < keys_1.length; _i++){
            var key = keys_1[_i];
            if (object[key] !== undefined) count++;
        }
        return count;
    };
    Encoder.prototype.encodeMap = function(object, depth) {
        var keys = Object.keys(object);
        if (this.sortKeys) keys.sort();
        var size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;
        if (size < 16) // fixmap
        this.writeU8(0x80 + size);
        else if (size < 0x10000) {
            // map 16
            this.writeU8(0xde);
            this.writeU16(size);
        } else if (size < 0x100000000) {
            // map 32
            this.writeU8(0xdf);
            this.writeU32(size);
        } else throw new Error("Too large map object: ".concat(size));
        for(var _i = 0, keys_2 = keys; _i < keys_2.length; _i++){
            var key = keys_2[_i];
            var value = object[key];
            if (!(this.ignoreUndefined && value === undefined)) {
                this.encodeString(key);
                this.doEncode(value, depth + 1);
            }
        }
    };
    Encoder.prototype.encodeExtension = function(ext) {
        var size = ext.data.length;
        if (size === 1) // fixext 1
        this.writeU8(0xd4);
        else if (size === 2) // fixext 2
        this.writeU8(0xd5);
        else if (size === 4) // fixext 4
        this.writeU8(0xd6);
        else if (size === 8) // fixext 8
        this.writeU8(0xd7);
        else if (size === 16) // fixext 16
        this.writeU8(0xd8);
        else if (size < 0x100) {
            // ext 8
            this.writeU8(0xc7);
            this.writeU8(size);
        } else if (size < 0x10000) {
            // ext 16
            this.writeU8(0xc8);
            this.writeU16(size);
        } else if (size < 0x100000000) {
            // ext 32
            this.writeU8(0xc9);
            this.writeU32(size);
        } else throw new Error("Too large extension object: ".concat(size));
        this.writeI8(ext.type);
        this.writeU8a(ext.data);
    };
    Encoder.prototype.writeU8 = function(value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setUint8(this.pos, value);
        this.pos++;
    };
    Encoder.prototype.writeU8a = function(values) {
        var size = values.length;
        this.ensureBufferSizeToWrite(size);
        this.bytes.set(values, this.pos);
        this.pos += size;
    };
    Encoder.prototype.writeI8 = function(value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setInt8(this.pos, value);
        this.pos++;
    };
    Encoder.prototype.writeU16 = function(value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setUint16(this.pos, value);
        this.pos += 2;
    };
    Encoder.prototype.writeI16 = function(value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setInt16(this.pos, value);
        this.pos += 2;
    };
    Encoder.prototype.writeU32 = function(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setUint32(this.pos, value);
        this.pos += 4;
    };
    Encoder.prototype.writeI32 = function(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setInt32(this.pos, value);
        this.pos += 4;
    };
    Encoder.prototype.writeF32 = function(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setFloat32(this.pos, value);
        this.pos += 4;
    };
    Encoder.prototype.writeF64 = function(value) {
        this.ensureBufferSizeToWrite(8);
        this.view.setFloat64(this.pos, value);
        this.pos += 8;
    };
    Encoder.prototype.writeU64 = function(value) {
        this.ensureBufferSizeToWrite(8);
        (0, $ede83edbc76bbf56$export$20f71c4c8b0f96c3)(this.view, this.pos, value);
        this.pos += 8;
    };
    Encoder.prototype.writeI64 = function(value) {
        this.ensureBufferSizeToWrite(8);
        (0, $ede83edbc76bbf56$export$8532a5209571c04a)(this.view, this.pos, value);
        this.pos += 8;
    };
    return Encoder;
}();


function $272dc2e0ef532137$var$$parcel$export(e, n, v, s) {
    Object.defineProperty(e, n, {
        get: v,
        set: s,
        enumerable: true,
        configurable: true
    });
}
class $272dc2e0ef532137$var$$fcbcc7538a6776d5$export$f1c5f4c9cb95390b {
    constructor(){
        this.chunkedMTU = 16300 // The original 60000 bytes setting does not work when sending data from Firefox to Chrome, which is "cut off" after 16384 bytes and delivered individually.
        ;
        // Binary stuff
        this._dataCount = 1;
        this.chunk = (blob)=>{
            const chunks = [];
            const size = blob.byteLength;
            const total = Math.ceil(size / this.chunkedMTU);
            let index = 0;
            let start = 0;
            while(start < size){
                const end = Math.min(size, start + this.chunkedMTU);
                const b = blob.slice(start, end);
                const chunk = {
                    __peerData: this._dataCount,
                    n: index,
                    data: b,
                    total: total
                };
                chunks.push(chunk);
                start = end;
                index++;
            }
            this._dataCount++;
            return chunks;
        };
    }
}
function $272dc2e0ef532137$var$$fcbcc7538a6776d5$export$52c89ebcdc4f53f2(bufs) {
    let size = 0;
    for (const buf of bufs)size += buf.byteLength;
    const result = new Uint8Array(size);
    let offset = 0;
    for (const buf of bufs){
        result.set(buf, offset);
        offset += buf.byteLength;
    }
    return result;
}
const $272dc2e0ef532137$var$$fb63e766cfafaab9$var$webRTCAdapter = (0, $038806bc06671657$export$2e2bcd8739ae039).default || (0, $038806bc06671657$export$2e2bcd8739ae039);
const $272dc2e0ef532137$var$$fb63e766cfafaab9$export$25be9502477c137d = new class {
    isWebRTCSupported() {
        return typeof RTCPeerConnection !== "undefined";
    }
    isBrowserSupported() {
        const browser = this.getBrowser();
        const version = this.getVersion();
        const validBrowser = this.supportedBrowsers.includes(browser);
        if (!validBrowser) return false;
        if (browser === "chrome") return version >= this.minChromeVersion;
        if (browser === "firefox") return version >= this.minFirefoxVersion;
        if (browser === "safari") return !this.isIOS && version >= this.minSafariVersion;
        return false;
    }
    getBrowser() {
        return $272dc2e0ef532137$var$$fb63e766cfafaab9$var$webRTCAdapter.browserDetails.browser;
    }
    getVersion() {
        return $272dc2e0ef532137$var$$fb63e766cfafaab9$var$webRTCAdapter.browserDetails.version || 0;
    }
    isUnifiedPlanSupported() {
        const browser = this.getBrowser();
        const version = $272dc2e0ef532137$var$$fb63e766cfafaab9$var$webRTCAdapter.browserDetails.version || 0;
        if (browser === "chrome" && version < this.minChromeVersion) return false;
        if (browser === "firefox" && version >= this.minFirefoxVersion) return true;
        if (!window.RTCRtpTransceiver || !("currentDirection" in RTCRtpTransceiver.prototype)) return false;
        let tempPc;
        let supported = false;
        try {
            tempPc = new RTCPeerConnection();
            tempPc.addTransceiver("audio");
            supported = true;
        } catch (e) {} finally{
            if (tempPc) tempPc.close();
        }
        return supported;
    }
    toString() {
        return `Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`;
    }
    constructor(){
        this.isIOS = [
            "iPad",
            "iPhone",
            "iPod"
        ].includes(navigator.platform);
        this.supportedBrowsers = [
            "firefox",
            "chrome",
            "safari"
        ];
        this.minFirefoxVersion = 59;
        this.minChromeVersion = 72;
        this.minSafariVersion = 605;
    }
}();
const $272dc2e0ef532137$var$$9a84a32bf0bf36bb$export$f35f128fd59ea256 = (id)=>{
    // Allow empty ids
    return !id || /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(id);
};
const $272dc2e0ef532137$var$$0e5fd1585784c252$export$4e61f672936bec77 = ()=>Math.random().toString(36).slice(2);
const $272dc2e0ef532137$var$$4f4134156c446392$var$DEFAULT_CONFIG = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        },
        {
            urls: [
                "turn:eu-0.turn.peerjs.com:3478",
                "turn:us-0.turn.peerjs.com:3478"
            ],
            username: "peerjs",
            credential: "peerjsp"
        }
    ],
    sdpSemantics: "unified-plan"
};
class $272dc2e0ef532137$var$$4f4134156c446392$export$f8f26dd395d7e1bd extends $272dc2e0ef532137$var$$fcbcc7538a6776d5$export$f1c5f4c9cb95390b {
    noop() {}
    blobToArrayBuffer(blob, cb) {
        const fr = new FileReader();
        fr.onload = function(evt) {
            if (evt.target) cb(evt.target.result);
        };
        fr.readAsArrayBuffer(blob);
        return fr;
    }
    binaryStringToArrayBuffer(binary) {
        const byteArray = new Uint8Array(binary.length);
        for(let i = 0; i < binary.length; i++)byteArray[i] = binary.charCodeAt(i) & 0xff;
        return byteArray.buffer;
    }
    isSecure() {
        return location.protocol === "https:";
    }
    constructor(...args){
        super(...args);
        this.CLOUD_HOST = "0.peerjs.com";
        this.CLOUD_PORT = 443;
        // Browsers that need chunking:
        this.chunkedBrowsers = {
            Chrome: 1,
            chrome: 1
        };
        // Returns browser-agnostic default config
        this.defaultConfig = $272dc2e0ef532137$var$$4f4134156c446392$var$DEFAULT_CONFIG;
        this.browser = $272dc2e0ef532137$var$$fb63e766cfafaab9$export$25be9502477c137d.getBrowser();
        this.browserVersion = $272dc2e0ef532137$var$$fb63e766cfafaab9$export$25be9502477c137d.getVersion();
        this.pack = (0, $3f935fb176e3a62a$export$2a703dbb0cb35339);
        this.unpack = (0, $3f935fb176e3a62a$export$417857010dc9287f);
        /**
	 * A hash of WebRTC features mapped to booleans that correspond to whether the feature is supported by the current browser.
	 *
	 * :::caution
	 * Only the properties documented here are guaranteed to be present on `util.supports`
	 * :::
	 */ this.supports = function() {
            const supported = {
                browser: $272dc2e0ef532137$var$$fb63e766cfafaab9$export$25be9502477c137d.isBrowserSupported(),
                webRTC: $272dc2e0ef532137$var$$fb63e766cfafaab9$export$25be9502477c137d.isWebRTCSupported(),
                audioVideo: false,
                data: false,
                binaryBlob: false,
                reliable: false
            };
            if (!supported.webRTC) return supported;
            let pc;
            try {
                pc = new RTCPeerConnection($272dc2e0ef532137$var$$4f4134156c446392$var$DEFAULT_CONFIG);
                supported.audioVideo = true;
                let dc;
                try {
                    dc = pc.createDataChannel("_PEERJSTEST", {
                        ordered: true
                    });
                    supported.data = true;
                    supported.reliable = !!dc.ordered;
                    // Binary test
                    try {
                        dc.binaryType = "blob";
                        supported.binaryBlob = !$272dc2e0ef532137$var$$fb63e766cfafaab9$export$25be9502477c137d.isIOS;
                    } catch (e) {}
                } catch (e) {} finally{
                    if (dc) dc.close();
                }
            } catch (e) {} finally{
                if (pc) pc.close();
            }
            return supported;
        }();
        // Ensure alphanumeric ids
        this.validateId = $272dc2e0ef532137$var$$9a84a32bf0bf36bb$export$f35f128fd59ea256;
        this.randomToken = $272dc2e0ef532137$var$$0e5fd1585784c252$export$4e61f672936bec77;
    }
}
const $272dc2e0ef532137$export$7debb50ef11d5e0b = new $272dc2e0ef532137$var$$4f4134156c446392$export$f8f26dd395d7e1bd();
const $272dc2e0ef532137$var$$257947e92926277a$var$LOG_PREFIX = "PeerJS: ";
var $272dc2e0ef532137$var$$257947e92926277a$export$243e62d78d3b544d;
(function(LogLevel) {
    /**
	 * Prints no logs.
	 */ LogLevel[LogLevel["Disabled"] = 0] = "Disabled";
    /**
	 * Prints only errors.
	 */ LogLevel[LogLevel["Errors"] = 1] = "Errors";
    /**
	 * Prints errors and warnings.
	 */ LogLevel[LogLevel["Warnings"] = 2] = "Warnings";
    /**
	 * Prints all logs.
	 */ LogLevel[LogLevel["All"] = 3] = "All";
})($272dc2e0ef532137$var$$257947e92926277a$export$243e62d78d3b544d || ($272dc2e0ef532137$var$$257947e92926277a$export$243e62d78d3b544d = {}));
class $272dc2e0ef532137$var$$257947e92926277a$var$Logger {
    get logLevel() {
        return this._logLevel;
    }
    set logLevel(logLevel) {
        this._logLevel = logLevel;
    }
    log(...args) {
        if (this._logLevel >= 3) this._print(3, ...args);
    }
    warn(...args) {
        if (this._logLevel >= 2) this._print(2, ...args);
    }
    error(...args) {
        if (this._logLevel >= 1) this._print(1, ...args);
    }
    setLogFunction(fn) {
        this._print = fn;
    }
    _print(logLevel, ...rest) {
        const copy = [
            $272dc2e0ef532137$var$$257947e92926277a$var$LOG_PREFIX,
            ...rest
        ];
        for(const i in copy)if (copy[i] instanceof Error) copy[i] = "(" + copy[i].name + ") " + copy[i].message;
        if (logLevel >= 3) console.log(...copy);
        else if (logLevel >= 2) console.warn("WARNING", ...copy);
        else if (logLevel >= 1) console.error("ERROR", ...copy);
    }
    constructor(){
        this._logLevel = 0;
    }
}
var $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039 = new $272dc2e0ef532137$var$$257947e92926277a$var$Logger();
var $272dc2e0ef532137$var$$c4dcfd1d1ea86647$exports = {};
"use strict";
var $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$has = Object.prototype.hasOwnProperty, $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix = "~";
/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */ function $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$Events() {}
//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
    $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$Events.prototype = Object.create(null);
    //
    // This hack is needed because the `__proto__` property is still inherited in
    // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
    //
    if (!new $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$Events().__proto__) $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix = false;
}
/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */ function $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
}
/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */ function $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$addListener(emitter, event, fn, context, once) {
    if (typeof fn !== "function") throw new TypeError("The listener must be a function");
    var listener = new $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EE(fn, context || emitter, once), evt = $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix ? $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix + event : event;
    if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
    else emitter._events[evt] = [
        emitter._events[evt],
        listener
    ];
    return emitter;
}
/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */ function $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0) emitter._events = new $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$Events();
    else delete emitter._events[evt];
}
/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */ function $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter() {
    this._events = new $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$Events();
    this._eventsCount = 0;
}
/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */ $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0) return names;
    for(name in events = this._events)if ($272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$has.call(events, name)) names.push($272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix ? name.slice(1) : name);
    if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
    return names;
};
/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */ $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter.prototype.listeners = function listeners(event) {
    var evt = $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix ? $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix + event : event, handlers = this._events[evt];
    if (!handlers) return [];
    if (handlers.fn) return [
        handlers.fn
    ];
    for(var i = 0, l = handlers.length, ee = new Array(l); i < l; i++)ee[i] = handlers[i].fn;
    return ee;
};
/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */ $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix ? $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix + event : event, listeners = this._events[evt];
    if (!listeners) return 0;
    if (listeners.fn) return 1;
    return listeners.length;
};
/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */ $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix ? $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix + event : event;
    if (!this._events[evt]) return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
        switch(len){
            case 1:
                return listeners.fn.call(listeners.context), true;
            case 2:
                return listeners.fn.call(listeners.context, a1), true;
            case 3:
                return listeners.fn.call(listeners.context, a1, a2), true;
            case 4:
                return listeners.fn.call(listeners.context, a1, a2, a3), true;
            case 5:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
            case 6:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for(i = 1, args = new Array(len - 1); i < len; i++)args[i - 1] = arguments[i];
        listeners.fn.apply(listeners.context, args);
    } else {
        var length = listeners.length, j;
        for(i = 0; i < length; i++){
            if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
            switch(len){
                case 1:
                    listeners[i].fn.call(listeners[i].context);
                    break;
                case 2:
                    listeners[i].fn.call(listeners[i].context, a1);
                    break;
                case 3:
                    listeners[i].fn.call(listeners[i].context, a1, a2);
                    break;
                case 4:
                    listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                    break;
                default:
                    if (!args) for(j = 1, args = new Array(len - 1); j < len; j++)args[j - 1] = arguments[j];
                    listeners[i].fn.apply(listeners[i].context, args);
            }
        }
    }
    return true;
};
/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */ $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter.prototype.on = function on(event, fn, context) {
    return $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$addListener(this, event, fn, context, false);
};
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */ $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter.prototype.once = function once(event, fn, context) {
    return $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$addListener(this, event, fn, context, true);
};
/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */ $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix ? $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix + event : event;
    if (!this._events[evt]) return this;
    if (!fn) {
        $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$clearEvent(this, evt);
        return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$clearEvent(this, evt);
    } else {
        for(var i = 0, events = [], length = listeners.length; i < length; i++)if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) events.push(listeners[i]);
        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$clearEvent(this, evt);
    }
    return this;
};
/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */ $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
        evt = $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix ? $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix + event : event;
        if (this._events[evt]) $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$clearEvent(this, evt);
    } else {
        this._events = new $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$Events();
        this._eventsCount = 0;
    }
    return this;
};
//
// Alias methods names because people roll like that.
//
$272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter.prototype.off = $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter.prototype.removeListener;
$272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter.prototype.addListener = $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter.prototype.on;
//
// Expose the prefix.
//
$272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter.prefixed = $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$prefix;
//
// Allow `EventEmitter` to be imported as module namespace.
//
$272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter.EventEmitter = $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter;
$272dc2e0ef532137$var$$c4dcfd1d1ea86647$exports = $272dc2e0ef532137$var$$c4dcfd1d1ea86647$var$EventEmitter;
var $272dc2e0ef532137$var$$78455e22dea96b8c$exports = {};
$272dc2e0ef532137$var$$parcel$export($272dc2e0ef532137$var$$78455e22dea96b8c$exports, "ConnectionType", ()=>$272dc2e0ef532137$export$3157d57b4135e3bc);
$272dc2e0ef532137$var$$parcel$export($272dc2e0ef532137$var$$78455e22dea96b8c$exports, "PeerErrorType", ()=>$272dc2e0ef532137$export$9547aaa2e39030ff);
$272dc2e0ef532137$var$$parcel$export($272dc2e0ef532137$var$$78455e22dea96b8c$exports, "BaseConnectionErrorType", ()=>$272dc2e0ef532137$export$7974935686149686);
$272dc2e0ef532137$var$$parcel$export($272dc2e0ef532137$var$$78455e22dea96b8c$exports, "DataConnectionErrorType", ()=>$272dc2e0ef532137$export$49ae800c114df41d);
$272dc2e0ef532137$var$$parcel$export($272dc2e0ef532137$var$$78455e22dea96b8c$exports, "SerializationType", ()=>$272dc2e0ef532137$export$89f507cf986a947);
$272dc2e0ef532137$var$$parcel$export($272dc2e0ef532137$var$$78455e22dea96b8c$exports, "SocketEventType", ()=>$272dc2e0ef532137$export$3b5c4a4b6354f023);
$272dc2e0ef532137$var$$parcel$export($272dc2e0ef532137$var$$78455e22dea96b8c$exports, "ServerMessageType", ()=>$272dc2e0ef532137$export$adb4a1754da6f10d);
var $272dc2e0ef532137$export$3157d57b4135e3bc;
(function(ConnectionType) {
    ConnectionType["Data"] = "data";
    ConnectionType["Media"] = "media";
})($272dc2e0ef532137$export$3157d57b4135e3bc || ($272dc2e0ef532137$export$3157d57b4135e3bc = {}));
var $272dc2e0ef532137$export$9547aaa2e39030ff;
(function(PeerErrorType) {
    /**
	 * The client's browser does not support some or all WebRTC features that you are trying to use.
	 */ PeerErrorType["BrowserIncompatible"] = "browser-incompatible";
    /**
	 * You've already disconnected this peer from the server and can no longer make any new connections on it.
	 */ PeerErrorType["Disconnected"] = "disconnected";
    /**
	 * The ID passed into the Peer constructor contains illegal characters.
	 */ PeerErrorType["InvalidID"] = "invalid-id";
    /**
	 * The API key passed into the Peer constructor contains illegal characters or is not in the system (cloud server only).
	 */ PeerErrorType["InvalidKey"] = "invalid-key";
    /**
	 * Lost or cannot establish a connection to the signalling server.
	 */ PeerErrorType["Network"] = "network";
    /**
	 * The peer you're trying to connect to does not exist.
	 */ PeerErrorType["PeerUnavailable"] = "peer-unavailable";
    /**
	 * PeerJS is being used securely, but the cloud server does not support SSL. Use a custom PeerServer.
	 */ PeerErrorType["SslUnavailable"] = "ssl-unavailable";
    /**
	 * Unable to reach the server.
	 */ PeerErrorType["ServerError"] = "server-error";
    /**
	 * An error from the underlying socket.
	 */ PeerErrorType["SocketError"] = "socket-error";
    /**
	 * The underlying socket closed unexpectedly.
	 */ PeerErrorType["SocketClosed"] = "socket-closed";
    /**
	 * The ID passed into the Peer constructor is already taken.
	 *
	 * :::caution
	 * This error is not fatal if your peer has open peer-to-peer connections.
	 * This can happen if you attempt to {@apilink Peer.reconnect} a peer that has been disconnected from the server,
	 * but its old ID has now been taken.
	 * :::
	 */ PeerErrorType["UnavailableID"] = "unavailable-id";
    /**
	 * Native WebRTC errors.
	 */ PeerErrorType["WebRTC"] = "webrtc";
})($272dc2e0ef532137$export$9547aaa2e39030ff || ($272dc2e0ef532137$export$9547aaa2e39030ff = {}));
var $272dc2e0ef532137$export$7974935686149686;
(function(BaseConnectionErrorType) {
    BaseConnectionErrorType["NegotiationFailed"] = "negotiation-failed";
    BaseConnectionErrorType["ConnectionClosed"] = "connection-closed";
})($272dc2e0ef532137$export$7974935686149686 || ($272dc2e0ef532137$export$7974935686149686 = {}));
var $272dc2e0ef532137$export$49ae800c114df41d;
(function(DataConnectionErrorType) {
    DataConnectionErrorType["NotOpenYet"] = "not-open-yet";
    DataConnectionErrorType["MessageToBig"] = "message-too-big";
})($272dc2e0ef532137$export$49ae800c114df41d || ($272dc2e0ef532137$export$49ae800c114df41d = {}));
var $272dc2e0ef532137$export$89f507cf986a947;
(function(SerializationType) {
    SerializationType["Binary"] = "binary";
    SerializationType["BinaryUTF8"] = "binary-utf8";
    SerializationType["JSON"] = "json";
    SerializationType["None"] = "raw";
})($272dc2e0ef532137$export$89f507cf986a947 || ($272dc2e0ef532137$export$89f507cf986a947 = {}));
var $272dc2e0ef532137$export$3b5c4a4b6354f023;
(function(SocketEventType) {
    SocketEventType["Message"] = "message";
    SocketEventType["Disconnected"] = "disconnected";
    SocketEventType["Error"] = "error";
    SocketEventType["Close"] = "close";
})($272dc2e0ef532137$export$3b5c4a4b6354f023 || ($272dc2e0ef532137$export$3b5c4a4b6354f023 = {}));
var $272dc2e0ef532137$export$adb4a1754da6f10d;
(function(ServerMessageType) {
    ServerMessageType["Heartbeat"] = "HEARTBEAT";
    ServerMessageType["Candidate"] = "CANDIDATE";
    ServerMessageType["Offer"] = "OFFER";
    ServerMessageType["Answer"] = "ANSWER";
    ServerMessageType["Open"] = "OPEN";
    ServerMessageType["Error"] = "ERROR";
    ServerMessageType["IdTaken"] = "ID-TAKEN";
    ServerMessageType["InvalidKey"] = "INVALID-KEY";
    ServerMessageType["Leave"] = "LEAVE";
    ServerMessageType["Expire"] = "EXPIRE";
})($272dc2e0ef532137$export$adb4a1754da6f10d || ($272dc2e0ef532137$export$adb4a1754da6f10d = {}));
var $272dc2e0ef532137$var$$f5f881ec4575f1fc$exports = {};
$272dc2e0ef532137$var$$f5f881ec4575f1fc$exports = JSON.parse('{"name":"peerjs","version":"1.5.2","keywords":["peerjs","webrtc","p2p","rtc"],"description":"PeerJS client","homepage":"https://peerjs.com","bugs":{"url":"https://github.com/peers/peerjs/issues"},"repository":{"type":"git","url":"https://github.com/peers/peerjs"},"license":"MIT","contributors":["Michelle Bu <michelle@michellebu.com>","afrokick <devbyru@gmail.com>","ericz <really.ez@gmail.com>","Jairo <kidandcat@gmail.com>","Jonas Gloning <34194370+jonasgloning@users.noreply.github.com>","Jairo Caro-Accino Viciana <jairo@galax.be>","Carlos Caballero <carlos.caballero.gonzalez@gmail.com>","hc <hheennrryy@gmail.com>","Muhammad Asif <capripio@gmail.com>","PrashoonB <prashoonbhattacharjee@gmail.com>","Harsh Bardhan Mishra <47351025+HarshCasper@users.noreply.github.com>","akotynski <aleksanderkotbury@gmail.com>","lmb <i@lmb.io>","Jairooo <jairocaro@msn.com>","Moritz St\xfcckler <moritz.stueckler@gmail.com>","Simon <crydotsnakegithub@gmail.com>","Denis Lukov <denismassters@gmail.com>","Philipp Hancke <fippo@andyet.net>","Hans Oksendahl <hansoksendahl@gmail.com>","Jess <jessachandler@gmail.com>","khankuan <khankuan@gmail.com>","DUODVK <kurmanov.work@gmail.com>","XiZhao <kwang1imsa@gmail.com>","Matthias Lohr <matthias@lohr.me>","=frank tree <=frnktrb@googlemail.com>","Andre Eckardt <aeckardt@outlook.com>","Chris Cowan <agentme49@gmail.com>","Alex Chuev <alex@chuev.com>","alxnull <alxnull@e.mail.de>","Yemel Jardi <angel.jardi@gmail.com>","Ben Parnell <benjaminparnell.94@gmail.com>","Benny Lichtner <bennlich@gmail.com>","fresheneesz <bitetrudpublic@gmail.com>","bob.barstead@exaptive.com <bob.barstead@exaptive.com>","chandika <chandika@gmail.com>","emersion <contact@emersion.fr>","Christopher Van <cvan@users.noreply.github.com>","eddieherm <edhermoso@gmail.com>","Eduardo Pinho <enet4mikeenet@gmail.com>","Evandro Zanatta <ezanatta@tray.net.br>","Gardner Bickford <gardner@users.noreply.github.com>","Gian Luca <gianluca.cecchi@cynny.com>","PatrickJS <github@gdi2290.com>","jonnyf <github@jonathanfoss.co.uk>","Hizkia Felix <hizkifw@gmail.com>","Hristo Oskov <hristo.oskov@gmail.com>","Isaac Madwed <i.madwed@gmail.com>","Ilya Konanykhin <ilya.konanykhin@gmail.com>","jasonbarry <jasbarry@me.com>","Jonathan Burke <jonathan.burke.1311@googlemail.com>","Josh Hamit <josh.hamit@gmail.com>","Jordan Austin <jrax86@gmail.com>","Joel Wetzell <jwetzell@yahoo.com>","xizhao <kevin.wang@cloudera.com>","Alberto Torres <kungfoobar@gmail.com>","Jonathan Mayol <mayoljonathan@gmail.com>","Jefferson Felix <me@jsfelix.dev>","Rolf Erik Lekang <me@rolflekang.com>","Kevin Mai-Husan Chia <mhchia@users.noreply.github.com>","Pepijn de Vos <pepijndevos@gmail.com>","JooYoung <qkdlql@naver.com>","Tobias Speicher <rootcommander@gmail.com>","Steve Blaurock <sblaurock@gmail.com>","Kyrylo Shegeda <shegeda@ualberta.ca>","Diwank Singh Tomer <singh@diwank.name>","So\u0308ren Balko <Soeren.Balko@gmail.com>","Arpit Solanki <solankiarpit1997@gmail.com>","Yuki Ito <yuki@gnnk.net>","Artur Zayats <zag2art@gmail.com>"],"funding":{"type":"opencollective","url":"https://opencollective.com/peer"},"collective":{"type":"opencollective","url":"https://opencollective.com/peer"},"files":["dist/*"],"sideEffects":["lib/global.ts","lib/supports.ts"],"main":"dist/bundler.cjs","module":"dist/bundler.mjs","browser-minified":"dist/peerjs.min.js","browser-unminified":"dist/peerjs.js","browser-minified-cbor":"dist/serializer.cbor.mjs","browser-minified-msgpack":"dist/serializer.msgpack.mjs","types":"dist/types.d.ts","engines":{"node":">= 14"},"targets":{"types":{"source":"lib/exports.ts"},"main":{"source":"lib/exports.ts","sourceMap":{"inlineSources":true}},"module":{"source":"lib/exports.ts","includeNodeModules":["eventemitter3"],"sourceMap":{"inlineSources":true}},"browser-minified":{"context":"browser","outputFormat":"global","optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 80, safari >= 15"},"source":"lib/global.ts"},"browser-unminified":{"context":"browser","outputFormat":"global","optimize":false,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 80, safari >= 15"},"source":"lib/global.ts"},"browser-minified-cbor":{"context":"browser","outputFormat":"esmodule","isLibrary":true,"optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 102, safari >= 15"},"source":"lib/dataconnection/StreamConnection/Cbor.ts"},"browser-minified-msgpack":{"context":"browser","outputFormat":"esmodule","isLibrary":true,"optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 102, safari >= 15"},"source":"lib/dataconnection/StreamConnection/MsgPack.ts"}},"scripts":{"contributors":"git-authors-cli --print=false && prettier --write package.json && git add package.json package-lock.json && git commit -m \\"chore(contributors): update and sort contributors list\\"","check":"tsc --noEmit && tsc -p e2e/tsconfig.json --noEmit","watch":"parcel watch","build":"rm -rf dist && parcel build","prepublishOnly":"npm run build","test":"jest","test:watch":"jest --watch","coverage":"jest --coverage --collectCoverageFrom=\\"./lib/**\\"","format":"prettier --write .","format:check":"prettier --check .","semantic-release":"semantic-release","e2e":"wdio run e2e/wdio.local.conf.ts","e2e:bstack":"wdio run e2e/wdio.bstack.conf.ts"},"devDependencies":{"@parcel/config-default":"^2.9.3","@parcel/packager-ts":"^2.9.3","@parcel/transformer-typescript-tsc":"^2.9.3","@parcel/transformer-typescript-types":"^2.9.3","@semantic-release/changelog":"^6.0.1","@semantic-release/git":"^10.0.1","@swc/core":"^1.3.27","@swc/jest":"^0.2.24","@types/jasmine":"^4.3.4","@wdio/browserstack-service":"^8.11.2","@wdio/cli":"^8.11.2","@wdio/globals":"^8.11.2","@wdio/jasmine-framework":"^8.11.2","@wdio/local-runner":"^8.11.2","@wdio/spec-reporter":"^8.11.2","@wdio/types":"^8.10.4","http-server":"^14.1.1","jest":"^29.3.1","jest-environment-jsdom":"^29.3.1","mock-socket":"^9.0.0","parcel":"^2.9.3","prettier":"^3.0.0","semantic-release":"^21.0.0","ts-node":"^10.9.1","typescript":"^5.0.0","wdio-geckodriver-service":"^5.0.1"},"dependencies":{"@msgpack/msgpack":"^2.8.0","cbor-x":"1.5.4","eventemitter3":"^4.0.7","peerjs-js-binarypack":"^2.1.0","webrtc-adapter":"^8.0.0"},"alias":{"process":false,"buffer":false}}');
class $272dc2e0ef532137$var$$8f5bfa60836d261d$export$4798917dbf149b79 extends $272dc2e0ef532137$var$$c4dcfd1d1ea86647$exports.EventEmitter {
    constructor(secure, host, port, path, key, pingInterval = 5000){
        super();
        this.pingInterval = pingInterval;
        this._disconnected = true;
        this._messagesQueue = [];
        const wsProtocol = secure ? "wss://" : "ws://";
        this._baseUrl = wsProtocol + host + ":" + port + path + "peerjs?key=" + key;
    }
    start(id, token) {
        this._id = id;
        const wsUrl = `${this._baseUrl}&id=${id}&token=${token}`;
        if (!!this._socket || !this._disconnected) return;
        this._socket = new WebSocket(wsUrl + "&version=" + $272dc2e0ef532137$var$$f5f881ec4575f1fc$exports.version);
        this._disconnected = false;
        this._socket.onmessage = (event)=>{
            let data;
            try {
                data = JSON.parse(event.data);
                $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Server message received:", data);
            } catch (e) {
                $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Invalid server message", event.data);
                return;
            }
            this.emit($272dc2e0ef532137$export$3b5c4a4b6354f023.Message, data);
        };
        this._socket.onclose = (event)=>{
            if (this._disconnected) return;
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Socket closed.", event);
            this._cleanup();
            this._disconnected = true;
            this.emit($272dc2e0ef532137$export$3b5c4a4b6354f023.Disconnected);
        };
        // Take care of the queue of connections if necessary and make sure Peer knows
        // socket is open.
        this._socket.onopen = ()=>{
            if (this._disconnected) return;
            this._sendQueuedMessages();
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Socket open");
            this._scheduleHeartbeat();
        };
    }
    _scheduleHeartbeat() {
        this._wsPingTimer = setTimeout(()=>{
            this._sendHeartbeat();
        }, this.pingInterval);
    }
    _sendHeartbeat() {
        if (!this._wsOpen()) {
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`Cannot send heartbeat, because socket closed`);
            return;
        }
        const message = JSON.stringify({
            type: $272dc2e0ef532137$export$adb4a1754da6f10d.Heartbeat
        });
        this._socket.send(message);
        this._scheduleHeartbeat();
    }
    /** Is the websocket currently open? */ _wsOpen() {
        return !!this._socket && this._socket.readyState === 1;
    }
    /** Send queued messages. */ _sendQueuedMessages() {
        //Create copy of queue and clear it,
        //because send method push the message back to queue if smth will go wrong
        const copiedQueue = [
            ...this._messagesQueue
        ];
        this._messagesQueue = [];
        for (const message of copiedQueue)this.send(message);
    }
    /** Exposed send for DC & Peer. */ send(data) {
        if (this._disconnected) return;
        // If we didn't get an ID yet, we can't yet send anything so we should queue
        // up these messages.
        if (!this._id) {
            this._messagesQueue.push(data);
            return;
        }
        if (!data.type) {
            this.emit($272dc2e0ef532137$export$3b5c4a4b6354f023.Error, "Invalid message");
            return;
        }
        if (!this._wsOpen()) return;
        const message = JSON.stringify(data);
        this._socket.send(message);
    }
    close() {
        if (this._disconnected) return;
        this._cleanup();
        this._disconnected = true;
    }
    _cleanup() {
        if (this._socket) {
            this._socket.onopen = this._socket.onmessage = this._socket.onclose = null;
            this._socket.close();
            this._socket = undefined;
        }
        clearTimeout(this._wsPingTimer);
    }
}
class $272dc2e0ef532137$var$$b82fb8fc0514bfc1$export$89e6bb5ad64bf4a {
    constructor(connection){
        this.connection = connection;
    }
    /** Returns a PeerConnection object set up correctly (for data, media). */ startConnection(options) {
        const peerConnection = this._startPeerConnection();
        // Set the connection's PC.
        this.connection.peerConnection = peerConnection;
        if (this.connection.type === $272dc2e0ef532137$export$3157d57b4135e3bc.Media && options._stream) this._addTracksToConnection(options._stream, peerConnection);
        // What do we need to do now?
        if (options.originator) {
            const dataConnection = this.connection;
            const config = {
                ordered: !!options.reliable
            };
            const dataChannel = peerConnection.createDataChannel(dataConnection.label, config);
            dataConnection._initializeDataChannel(dataChannel);
            this._makeOffer();
        } else this.handleSDP("OFFER", options.sdp);
    }
    /** Start a PC. */ _startPeerConnection() {
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Creating RTCPeerConnection.");
        const peerConnection = new RTCPeerConnection(this.connection.provider.options.config);
        this._setupListeners(peerConnection);
        return peerConnection;
    }
    /** Set up various WebRTC listeners. */ _setupListeners(peerConnection) {
        const peerId = this.connection.peer;
        const connectionId = this.connection.connectionId;
        const connectionType = this.connection.type;
        const provider = this.connection.provider;
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Listening for ICE candidates.");
        peerConnection.onicecandidate = (evt)=>{
            if (!evt.candidate || !evt.candidate.candidate) return;
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`Received ICE candidates for ${peerId}:`, evt.candidate);
            provider.socket.send({
                type: $272dc2e0ef532137$export$adb4a1754da6f10d.Candidate,
                payload: {
                    candidate: evt.candidate,
                    type: connectionType,
                    connectionId: connectionId
                },
                dst: peerId
            });
        };
        peerConnection.oniceconnectionstatechange = ()=>{
            switch(peerConnection.iceConnectionState){
                case "failed":
                    $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("iceConnectionState is failed, closing connections to " + peerId);
                    this.connection.emitError($272dc2e0ef532137$export$7974935686149686.NegotiationFailed, "Negotiation of connection to " + peerId + " failed.");
                    this.connection.close();
                    break;
                case "closed":
                    $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("iceConnectionState is closed, closing connections to " + peerId);
                    this.connection.emitError($272dc2e0ef532137$export$7974935686149686.ConnectionClosed, "Connection to " + peerId + " closed.");
                    this.connection.close();
                    break;
                case "disconnected":
                    $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("iceConnectionState changed to disconnected on the connection with " + peerId);
                    break;
                case "completed":
                    peerConnection.onicecandidate = ()=>{};
                    break;
            }
            this.connection.emit("iceStateChanged", peerConnection.iceConnectionState);
        };
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Listening for data channel");
        // Fired between offer and answer, so options should already be saved
        // in the options hash.
        peerConnection.ondatachannel = (evt)=>{
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Received data channel");
            const dataChannel = evt.channel;
            const connection = provider.getConnection(peerId, connectionId);
            connection._initializeDataChannel(dataChannel);
        };
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Listening for remote stream");
        peerConnection.ontrack = (evt)=>{
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Received remote stream");
            const stream = evt.streams[0];
            const connection = provider.getConnection(peerId, connectionId);
            if (connection.type === $272dc2e0ef532137$export$3157d57b4135e3bc.Media) {
                const mediaConnection = connection;
                this._addStreamToMediaConnection(stream, mediaConnection);
            }
        };
    }
    cleanup() {
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Cleaning up PeerConnection to " + this.connection.peer);
        const peerConnection = this.connection.peerConnection;
        if (!peerConnection) return;
        this.connection.peerConnection = null;
        //unsubscribe from all PeerConnection's events
        peerConnection.onicecandidate = peerConnection.oniceconnectionstatechange = peerConnection.ondatachannel = peerConnection.ontrack = ()=>{};
        const peerConnectionNotClosed = peerConnection.signalingState !== "closed";
        let dataChannelNotClosed = false;
        const dataChannel = this.connection.dataChannel;
        if (dataChannel) dataChannelNotClosed = !!dataChannel.readyState && dataChannel.readyState !== "closed";
        if (peerConnectionNotClosed || dataChannelNotClosed) peerConnection.close();
    }
    async _makeOffer() {
        const peerConnection = this.connection.peerConnection;
        const provider = this.connection.provider;
        try {
            const offer = await peerConnection.createOffer(this.connection.options.constraints);
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Created offer.");
            if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function") offer.sdp = this.connection.options.sdpTransform(offer.sdp) || offer.sdp;
            try {
                await peerConnection.setLocalDescription(offer);
                $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Set localDescription:", offer, `for:${this.connection.peer}`);
                let payload = {
                    sdp: offer,
                    type: this.connection.type,
                    connectionId: this.connection.connectionId,
                    metadata: this.connection.metadata
                };
                if (this.connection.type === $272dc2e0ef532137$export$3157d57b4135e3bc.Data) {
                    const dataConnection = this.connection;
                    payload = {
                        ...payload,
                        label: dataConnection.label,
                        reliable: dataConnection.reliable,
                        serialization: dataConnection.serialization
                    };
                }
                provider.socket.send({
                    type: $272dc2e0ef532137$export$adb4a1754da6f10d.Offer,
                    payload: payload,
                    dst: this.connection.peer
                });
            } catch (err) {
                // TODO: investigate why _makeOffer is being called from the answer
                if (err != "OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer") {
                    provider.emitError($272dc2e0ef532137$export$9547aaa2e39030ff.WebRTC, err);
                    $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Failed to setLocalDescription, ", err);
                }
            }
        } catch (err_1) {
            provider.emitError($272dc2e0ef532137$export$9547aaa2e39030ff.WebRTC, err_1);
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Failed to createOffer, ", err_1);
        }
    }
    async _makeAnswer() {
        const peerConnection = this.connection.peerConnection;
        const provider = this.connection.provider;
        try {
            const answer = await peerConnection.createAnswer();
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Created answer.");
            if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function") answer.sdp = this.connection.options.sdpTransform(answer.sdp) || answer.sdp;
            try {
                await peerConnection.setLocalDescription(answer);
                $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`Set localDescription:`, answer, `for:${this.connection.peer}`);
                provider.socket.send({
                    type: $272dc2e0ef532137$export$adb4a1754da6f10d.Answer,
                    payload: {
                        sdp: answer,
                        type: this.connection.type,
                        connectionId: this.connection.connectionId
                    },
                    dst: this.connection.peer
                });
            } catch (err) {
                provider.emitError($272dc2e0ef532137$export$9547aaa2e39030ff.WebRTC, err);
                $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Failed to setLocalDescription, ", err);
            }
        } catch (err_1) {
            provider.emitError($272dc2e0ef532137$export$9547aaa2e39030ff.WebRTC, err_1);
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Failed to create answer, ", err_1);
        }
    }
    /** Handle an SDP. */ async handleSDP(type, sdp) {
        sdp = new RTCSessionDescription(sdp);
        const peerConnection = this.connection.peerConnection;
        const provider = this.connection.provider;
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Setting remote description", sdp);
        const self = this;
        try {
            await peerConnection.setRemoteDescription(sdp);
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`Set remoteDescription:${type} for:${this.connection.peer}`);
            if (type === "OFFER") await self._makeAnswer();
        } catch (err) {
            provider.emitError($272dc2e0ef532137$export$9547aaa2e39030ff.WebRTC, err);
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Failed to setRemoteDescription, ", err);
        }
    }
    /** Handle a candidate. */ async handleCandidate(ice) {
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`handleCandidate:`, ice);
        try {
            await this.connection.peerConnection.addIceCandidate(ice);
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`Added ICE candidate for:${this.connection.peer}`);
        } catch (err) {
            this.connection.provider.emitError($272dc2e0ef532137$export$9547aaa2e39030ff.WebRTC, err);
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Failed to handleCandidate, ", err);
        }
    }
    _addTracksToConnection(stream, peerConnection) {
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`add tracks from stream ${stream.id} to peer connection`);
        if (!peerConnection.addTrack) return $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.error(`Your browser does't support RTCPeerConnection#addTrack. Ignored.`);
        stream.getTracks().forEach((track)=>{
            peerConnection.addTrack(track, stream);
        });
    }
    _addStreamToMediaConnection(stream, mediaConnection) {
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`add stream ${stream.id} to media connection ${mediaConnection.connectionId}`);
        mediaConnection.addStream(stream);
    }
}
class $272dc2e0ef532137$var$$23779d1881157a18$export$6a678e589c8a4542 extends $272dc2e0ef532137$var$$c4dcfd1d1ea86647$exports.EventEmitter {
    /**
	 * Emits a typed error message.
	 *
	 * @internal
	 */ emitError(type, err) {
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.error("Error:", err);
        // @ts-ignore
        this.emit("error", new $272dc2e0ef532137$export$98871882f492de82(`${type}`, err));
    }
}
class $272dc2e0ef532137$export$98871882f492de82 extends Error {
    /**
	 * @internal
	 */ constructor(type, err){
        if (typeof err === "string") super(err);
        else {
            super();
            Object.assign(this, err);
        }
        this.type = type;
    }
}
class $272dc2e0ef532137$var$$5045192fc6d387ba$export$23a2a68283c24d80 extends $272dc2e0ef532137$var$$23779d1881157a18$export$6a678e589c8a4542 {
    /**
	 * Whether the media connection is active (e.g. your call has been answered).
	 * You can check this if you want to set a maximum wait time for a one-sided call.
	 */ get open() {
        return this._open;
    }
    constructor(/**
		 * The ID of the peer on the other end of this connection.
		 */ peer, provider, options){
        super();
        this.peer = peer;
        this.provider = provider;
        this.options = options;
        this._open = false;
        this.metadata = options.metadata;
    }
}
class $272dc2e0ef532137$var$$5c1d08c7c57da9a3$export$4a84e95a2324ac29 extends $272dc2e0ef532137$var$$5045192fc6d387ba$export$23a2a68283c24d80 {
    static #_ = this.ID_PREFIX = "mc_";
    /**
	 * For media connections, this is always 'media'.
	 */ get type() {
        return $272dc2e0ef532137$export$3157d57b4135e3bc.Media;
    }
    get localStream() {
        return this._localStream;
    }
    get remoteStream() {
        return this._remoteStream;
    }
    constructor(peerId, provider, options){
        super(peerId, provider, options);
        this._localStream = this.options._stream;
        this.connectionId = this.options.connectionId || $272dc2e0ef532137$var$$5c1d08c7c57da9a3$export$4a84e95a2324ac29.ID_PREFIX + $272dc2e0ef532137$export$7debb50ef11d5e0b.randomToken();
        this._negotiator = new $272dc2e0ef532137$var$$b82fb8fc0514bfc1$export$89e6bb5ad64bf4a(this);
        if (this._localStream) this._negotiator.startConnection({
            _stream: this._localStream,
            originator: true
        });
    }
    /** Called by the Negotiator when the DataChannel is ready. */ _initializeDataChannel(dc) {
        this.dataChannel = dc;
        this.dataChannel.onopen = ()=>{
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`DC#${this.connectionId} dc connection success`);
            this.emit("willCloseOnRemote");
        };
        this.dataChannel.onclose = ()=>{
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`DC#${this.connectionId} dc closed for:`, this.peer);
            this.close();
        };
    }
    addStream(remoteStream) {
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log("Receiving stream", remoteStream);
        this._remoteStream = remoteStream;
        super.emit("stream", remoteStream); // Should we call this `open`?
    }
    /**
	 * @internal
	 */ handleMessage(message) {
        const type = message.type;
        const payload = message.payload;
        switch(message.type){
            case $272dc2e0ef532137$export$adb4a1754da6f10d.Answer:
                // Forward to negotiator
                this._negotiator.handleSDP(type, payload.sdp);
                this._open = true;
                break;
            case $272dc2e0ef532137$export$adb4a1754da6f10d.Candidate:
                this._negotiator.handleCandidate(payload.candidate);
                break;
            default:
                $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.warn(`Unrecognized message type:${type} from peer:${this.peer}`);
                break;
        }
    }
    /**
     * When receiving a {@apilink PeerEvents | `call`} event on a peer, you can call
     * `answer` on the media connection provided by the callback to accept the call
     * and optionally send your own media stream.

     *
     * @param stream A WebRTC media stream.
     * @param options
     * @returns
     */ answer(stream, options = {}) {
        if (this._localStream) {
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");
            return;
        }
        this._localStream = stream;
        if (options && options.sdpTransform) this.options.sdpTransform = options.sdpTransform;
        this._negotiator.startConnection({
            ...this.options._payload,
            _stream: stream
        });
        // Retrieve lost messages stored because PeerConnection not set up.
        const messages = this.provider._getMessages(this.connectionId);
        for (const message of messages)this.handleMessage(message);
        this._open = true;
    }
    /**
	 * Exposed functionality for users.
	 */ /**
	 * Closes the media connection.
	 */ close() {
        if (this._negotiator) {
            this._negotiator.cleanup();
            this._negotiator = null;
        }
        this._localStream = null;
        this._remoteStream = null;
        if (this.provider) {
            this.provider._removeConnection(this);
            this.provider = null;
        }
        if (this.options && this.options._stream) this.options._stream = null;
        if (!this.open) return;
        this._open = false;
        super.emit("close");
    }
}
class $272dc2e0ef532137$var$$abf266641927cd89$export$2c4e825dc9120f87 {
    constructor(_options){
        this._options = _options;
    }
    _buildRequest(method) {
        const protocol = this._options.secure ? "https" : "http";
        const { host: host, port: port, path: path, key: key } = this._options;
        const url = new URL(`${protocol}://${host}:${port}${path}${key}/${method}`);
        // TODO: Why timestamp, why random?
        url.searchParams.set("ts", `${Date.now()}${Math.random()}`);
        url.searchParams.set("version", $272dc2e0ef532137$var$$f5f881ec4575f1fc$exports.version);
        return fetch(url.href, {
            referrerPolicy: this._options.referrerPolicy
        });
    }
    /** Get a unique ID from the server via XHR and initialize with it. */ async retrieveId() {
        try {
            const response = await this._buildRequest("id");
            if (response.status !== 200) throw new Error(`Error. Status:${response.status}`);
            return response.text();
        } catch (error) {
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.error("Error retrieving ID", error);
            let pathError = "";
            if (this._options.path === "/" && this._options.host !== $272dc2e0ef532137$export$7debb50ef11d5e0b.CLOUD_HOST) pathError = " If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer.";
            throw new Error("Could not get an ID from the server." + pathError);
        }
    }
    /** @deprecated */ async listAllPeers() {
        try {
            const response = await this._buildRequest("peers");
            if (response.status !== 200) {
                if (response.status === 401) {
                    let helpfulError = "";
                    if (this._options.host === $272dc2e0ef532137$export$7debb50ef11d5e0b.CLOUD_HOST) helpfulError = "It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.";
                    else helpfulError = "You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.";
                    throw new Error("It doesn't look like you have permission to list peers IDs. " + helpfulError);
                }
                throw new Error(`Error. Status:${response.status}`);
            }
            return response.json();
        } catch (error) {
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.error("Error retrieving list peers", error);
            throw new Error("Could not get list peers from the server." + error);
        }
    }
}
class $272dc2e0ef532137$var$$6366c4ca161bc297$export$d365f7ad9d7df9c9 extends $272dc2e0ef532137$var$$5045192fc6d387ba$export$23a2a68283c24d80 {
    static #_ = this.ID_PREFIX = "dc_";
    static #_1 = this.MAX_BUFFERED_AMOUNT = 8388608;
    get type() {
        return $272dc2e0ef532137$export$3157d57b4135e3bc.Data;
    }
    constructor(peerId, provider, options){
        super(peerId, provider, options);
        this.connectionId = this.options.connectionId || $272dc2e0ef532137$var$$6366c4ca161bc297$export$d365f7ad9d7df9c9.ID_PREFIX + $272dc2e0ef532137$var$$0e5fd1585784c252$export$4e61f672936bec77();
        this.label = this.options.label || this.connectionId;
        this.reliable = !!this.options.reliable;
        this._negotiator = new $272dc2e0ef532137$var$$b82fb8fc0514bfc1$export$89e6bb5ad64bf4a(this);
        this._negotiator.startConnection(this.options._payload || {
            originator: true,
            reliable: this.reliable
        });
    }
    /** Called by the Negotiator when the DataChannel is ready. */ _initializeDataChannel(dc) {
        this.dataChannel = dc;
        this.dataChannel.onopen = ()=>{
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`DC#${this.connectionId} dc connection success`);
            this._open = true;
            this.emit("open");
        };
        this.dataChannel.onmessage = (e)=>{
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`DC#${this.connectionId} dc onmessage:`, e.data);
        // this._handleDataMessage(e);
        };
        this.dataChannel.onclose = ()=>{
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`DC#${this.connectionId} dc closed for:`, this.peer);
            this.close();
        };
    }
    /**
	 * Exposed functionality for users.
	 */ /** Allows user to close connection. */ close(options) {
        if (options?.flush) {
            this.send({
                __peerData: {
                    type: "close"
                }
            });
            return;
        }
        if (this._negotiator) {
            this._negotiator.cleanup();
            this._negotiator = null;
        }
        if (this.provider) {
            this.provider._removeConnection(this);
            this.provider = null;
        }
        if (this.dataChannel) {
            this.dataChannel.onopen = null;
            this.dataChannel.onmessage = null;
            this.dataChannel.onclose = null;
            this.dataChannel = null;
        }
        if (!this.open) return;
        this._open = false;
        super.emit("close");
    }
    /** Allows user to send data. */ send(data, chunked = false) {
        if (!this.open) {
            this.emitError($272dc2e0ef532137$export$49ae800c114df41d.NotOpenYet, "Connection is not open. You should listen for the `open` event before sending messages.");
            return;
        }
        return this._send(data, chunked);
    }
    async handleMessage(message) {
        const payload = message.payload;
        switch(message.type){
            case $272dc2e0ef532137$export$adb4a1754da6f10d.Answer:
                await this._negotiator.handleSDP(message.type, payload.sdp);
                break;
            case $272dc2e0ef532137$export$adb4a1754da6f10d.Candidate:
                await this._negotiator.handleCandidate(payload.candidate);
                break;
            default:
                $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.warn("Unrecognized message type:", message.type, "from peer:", this.peer);
                break;
        }
    }
}
class $272dc2e0ef532137$export$ff7c9d4c11d94e8b extends $272dc2e0ef532137$var$$6366c4ca161bc297$export$d365f7ad9d7df9c9 {
    get bufferSize() {
        return this._bufferSize;
    }
    _initializeDataChannel(dc) {
        super._initializeDataChannel(dc);
        this.dataChannel.binaryType = "arraybuffer";
        this.dataChannel.addEventListener("message", (e)=>this._handleDataMessage(e));
    }
    _bufferedSend(msg) {
        if (this._buffering || !this._trySend(msg)) {
            this._buffer.push(msg);
            this._bufferSize = this._buffer.length;
        }
    }
    // Returns true if the send succeeds.
    _trySend(msg) {
        if (!this.open) return false;
        if (this.dataChannel.bufferedAmount > $272dc2e0ef532137$var$$6366c4ca161bc297$export$d365f7ad9d7df9c9.MAX_BUFFERED_AMOUNT) {
            this._buffering = true;
            setTimeout(()=>{
                this._buffering = false;
                this._tryBuffer();
            }, 50);
            return false;
        }
        try {
            this.dataChannel.send(msg);
        } catch (e) {
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.error(`DC#:${this.connectionId} Error when sending:`, e);
            this._buffering = true;
            this.close();
            return false;
        }
        return true;
    }
    // Try to send the first message in the buffer.
    _tryBuffer() {
        if (!this.open) return;
        if (this._buffer.length === 0) return;
        const msg = this._buffer[0];
        if (this._trySend(msg)) {
            this._buffer.shift();
            this._bufferSize = this._buffer.length;
            this._tryBuffer();
        }
    }
    close(options) {
        if (options?.flush) {
            this.send({
                __peerData: {
                    type: "close"
                }
            });
            return;
        }
        this._buffer = [];
        this._bufferSize = 0;
        super.close();
    }
    constructor(...args){
        super(...args);
        this._buffer = [];
        this._bufferSize = 0;
        this._buffering = false;
    }
}
class $272dc2e0ef532137$var$$9fcfddb3ae148f88$export$f0a5a64d5bb37108 extends $272dc2e0ef532137$export$ff7c9d4c11d94e8b {
    close(options) {
        super.close(options);
        this._chunkedData = {};
    }
    constructor(peerId, provider, options){
        super(peerId, provider, options);
        this.chunker = new $272dc2e0ef532137$var$$fcbcc7538a6776d5$export$f1c5f4c9cb95390b();
        this.serialization = $272dc2e0ef532137$export$89f507cf986a947.Binary;
        this._chunkedData = {};
    }
    // Handles a DataChannel message.
    _handleDataMessage({ data: data }) {
        const deserializedData = (0, $3f935fb176e3a62a$export$417857010dc9287f)(data);
        // PeerJS specific message
        const peerData = deserializedData["__peerData"];
        if (peerData) {
            if (peerData.type === "close") {
                this.close();
                return;
            }
            // Chunked data -- piece things back together.
            // @ts-ignore
            this._handleChunk(deserializedData);
            return;
        }
        this.emit("data", deserializedData);
    }
    _handleChunk(data) {
        const id = data.__peerData;
        const chunkInfo = this._chunkedData[id] || {
            data: [],
            count: 0,
            total: data.total
        };
        chunkInfo.data[data.n] = new Uint8Array(data.data);
        chunkInfo.count++;
        this._chunkedData[id] = chunkInfo;
        if (chunkInfo.total === chunkInfo.count) {
            // Clean up before making the recursive call to `_handleDataMessage`.
            delete this._chunkedData[id];
            // We've received all the chunks--time to construct the complete data.
            // const data = new Blob(chunkInfo.data);
            const data = $272dc2e0ef532137$var$$fcbcc7538a6776d5$export$52c89ebcdc4f53f2(chunkInfo.data);
            this._handleDataMessage({
                data: data
            });
        }
    }
    _send(data, chunked) {
        const blob = (0, $3f935fb176e3a62a$export$2a703dbb0cb35339)(data);
        if (blob instanceof Promise) return this._send_blob(blob);
        if (!chunked && blob.byteLength > this.chunker.chunkedMTU) {
            this._sendChunks(blob);
            return;
        }
        this._bufferedSend(blob);
    }
    async _send_blob(blobPromise) {
        const blob = await blobPromise;
        if (blob.byteLength > this.chunker.chunkedMTU) {
            this._sendChunks(blob);
            return;
        }
        this._bufferedSend(blob);
    }
    _sendChunks(blob) {
        const blobs = this.chunker.chunk(blob);
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`DC#${this.connectionId} Try to send ${blobs.length} chunks...`);
        for (const blob of blobs)this.send(blob, true);
    }
}
class $272dc2e0ef532137$var$$bbaee3f15f714663$export$6f88fe47d32c9c94 extends $272dc2e0ef532137$export$ff7c9d4c11d94e8b {
    _handleDataMessage({ data: data }) {
        super.emit("data", data);
    }
    _send(data, _chunked) {
        this._bufferedSend(data);
    }
    constructor(...args){
        super(...args);
        this.serialization = $272dc2e0ef532137$export$89f507cf986a947.None;
    }
}
class $272dc2e0ef532137$var$$817f931e3f9096cf$export$48880ac635f47186 extends $272dc2e0ef532137$export$ff7c9d4c11d94e8b {
    // Handles a DataChannel message.
    _handleDataMessage({ data: data }) {
        const deserializedData = this.parse(this.decoder.decode(data));
        // PeerJS specific message
        const peerData = deserializedData["__peerData"];
        if (peerData && peerData.type === "close") {
            this.close();
            return;
        }
        this.emit("data", deserializedData);
    }
    _send(data, _chunked) {
        const encodedData = this.encoder.encode(this.stringify(data));
        if (encodedData.byteLength >= $272dc2e0ef532137$export$7debb50ef11d5e0b.chunkedMTU) {
            this.emitError($272dc2e0ef532137$export$49ae800c114df41d.MessageToBig, "Message too big for JSON channel");
            return;
        }
        this._bufferedSend(encodedData);
    }
    constructor(...args){
        super(...args);
        this.serialization = $272dc2e0ef532137$export$89f507cf986a947.JSON;
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
        this.stringify = JSON.stringify;
        this.parse = JSON.parse;
    }
}
class $272dc2e0ef532137$var$$416260bce337df90$var$PeerOptions {
}
class $272dc2e0ef532137$export$ecd1fc136c422448 extends $272dc2e0ef532137$var$$23779d1881157a18$export$6a678e589c8a4542 {
    static #_ = this.DEFAULT_KEY = "peerjs";
    /**
	 * The brokering ID of this peer
	 *
	 * If no ID was specified in {@apilink Peer | the constructor},
	 * this will be `undefined` until the {@apilink PeerEvents | `open`} event is emitted.
	 */ get id() {
        return this._id;
    }
    get options() {
        return this._options;
    }
    get open() {
        return this._open;
    }
    /**
	 * @internal
	 */ get socket() {
        return this._socket;
    }
    /**
	 * A hash of all connections associated with this peer, keyed by the remote peer's ID.
	 * @deprecated
	 * Return type will change from Object to Map<string,[]>
	 */ get connections() {
        const plainConnections = Object.create(null);
        for (const [k, v] of this._connections)plainConnections[k] = v;
        return plainConnections;
    }
    /**
	 * true if this peer and all of its connections can no longer be used.
	 */ get destroyed() {
        return this._destroyed;
    }
    /**
	 * false if there is an active connection to the PeerServer.
	 */ get disconnected() {
        return this._disconnected;
    }
    constructor(id, options){
        super();
        this._serializers = {
            raw: $272dc2e0ef532137$var$$bbaee3f15f714663$export$6f88fe47d32c9c94,
            json: $272dc2e0ef532137$var$$817f931e3f9096cf$export$48880ac635f47186,
            binary: $272dc2e0ef532137$var$$9fcfddb3ae148f88$export$f0a5a64d5bb37108,
            "binary-utf8": $272dc2e0ef532137$var$$9fcfddb3ae148f88$export$f0a5a64d5bb37108,
            default: $272dc2e0ef532137$var$$9fcfddb3ae148f88$export$f0a5a64d5bb37108
        };
        this._id = null;
        this._lastServerId = null;
        // States.
        this._destroyed = false // Connections have been killed
        ;
        this._disconnected = false // Connection to PeerServer killed but P2P connections still active
        ;
        this._open = false // Sockets and such are not yet open.
        ;
        this._connections = new Map() // All connections for this peer.
        ;
        this._lostMessages = new Map() // src => [list of messages]
        ;
        let userId;
        // Deal with overloading
        if (id && id.constructor == Object) options = id;
        else if (id) userId = id.toString();
        // Configurize options
        options = {
            debug: 0,
            host: $272dc2e0ef532137$export$7debb50ef11d5e0b.CLOUD_HOST,
            port: $272dc2e0ef532137$export$7debb50ef11d5e0b.CLOUD_PORT,
            path: "/",
            key: $272dc2e0ef532137$export$ecd1fc136c422448.DEFAULT_KEY,
            token: $272dc2e0ef532137$export$7debb50ef11d5e0b.randomToken(),
            config: $272dc2e0ef532137$export$7debb50ef11d5e0b.defaultConfig,
            referrerPolicy: "strict-origin-when-cross-origin",
            serializers: {},
            ...options
        };
        this._options = options;
        this._serializers = {
            ...this._serializers,
            ...this.options.serializers
        };
        // Detect relative URL host.
        if (this._options.host === "/") this._options.host = window.location.hostname;
        // Set path correctly.
        if (this._options.path) {
            if (this._options.path[0] !== "/") this._options.path = "/" + this._options.path;
            if (this._options.path[this._options.path.length - 1] !== "/") this._options.path += "/";
        }
        // Set whether we use SSL to same as current host
        if (this._options.secure === undefined && this._options.host !== $272dc2e0ef532137$export$7debb50ef11d5e0b.CLOUD_HOST) this._options.secure = $272dc2e0ef532137$export$7debb50ef11d5e0b.isSecure();
        else if (this._options.host == $272dc2e0ef532137$export$7debb50ef11d5e0b.CLOUD_HOST) this._options.secure = true;
        // Set a custom log function if present
        if (this._options.logFunction) $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.setLogFunction(this._options.logFunction);
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.logLevel = this._options.debug || 0;
        this._api = new $272dc2e0ef532137$var$$abf266641927cd89$export$2c4e825dc9120f87(options);
        this._socket = this._createServerConnection();
        // Sanity checks
        // Ensure WebRTC supported
        if (!$272dc2e0ef532137$export$7debb50ef11d5e0b.supports.audioVideo && !$272dc2e0ef532137$export$7debb50ef11d5e0b.supports.data) {
            this._delayedAbort($272dc2e0ef532137$export$9547aaa2e39030ff.BrowserIncompatible, "The current browser does not support WebRTC");
            return;
        }
        // Ensure alphanumeric id
        if (!!userId && !$272dc2e0ef532137$export$7debb50ef11d5e0b.validateId(userId)) {
            this._delayedAbort($272dc2e0ef532137$export$9547aaa2e39030ff.InvalidID, `ID "${userId}" is invalid`);
            return;
        }
        if (userId) this._initialize(userId);
        else this._api.retrieveId().then((id)=>this._initialize(id)).catch((error)=>this._abort($272dc2e0ef532137$export$9547aaa2e39030ff.ServerError, error));
    }
    _createServerConnection() {
        const socket = new $272dc2e0ef532137$var$$8f5bfa60836d261d$export$4798917dbf149b79(this._options.secure, this._options.host, this._options.port, this._options.path, this._options.key, this._options.pingInterval);
        socket.on($272dc2e0ef532137$export$3b5c4a4b6354f023.Message, (data)=>{
            this._handleMessage(data);
        });
        socket.on($272dc2e0ef532137$export$3b5c4a4b6354f023.Error, (error)=>{
            this._abort($272dc2e0ef532137$export$9547aaa2e39030ff.SocketError, error);
        });
        socket.on($272dc2e0ef532137$export$3b5c4a4b6354f023.Disconnected, ()=>{
            if (this.disconnected) return;
            this.emitError($272dc2e0ef532137$export$9547aaa2e39030ff.Network, "Lost connection to server.");
            this.disconnect();
        });
        socket.on($272dc2e0ef532137$export$3b5c4a4b6354f023.Close, ()=>{
            if (this.disconnected) return;
            this._abort($272dc2e0ef532137$export$9547aaa2e39030ff.SocketClosed, "Underlying socket is already closed.");
        });
        return socket;
    }
    /** Initialize a connection with the server. */ _initialize(id) {
        this._id = id;
        this.socket.start(id, this._options.token);
    }
    /** Handles messages from the server. */ _handleMessage(message) {
        const type = message.type;
        const payload = message.payload;
        const peerId = message.src;
        switch(type){
            case $272dc2e0ef532137$export$adb4a1754da6f10d.Open:
                this._lastServerId = this.id;
                this._open = true;
                this.emit("open", this.id);
                break;
            case $272dc2e0ef532137$export$adb4a1754da6f10d.Error:
                this._abort($272dc2e0ef532137$export$9547aaa2e39030ff.ServerError, payload.msg);
                break;
            case $272dc2e0ef532137$export$adb4a1754da6f10d.IdTaken:
                this._abort($272dc2e0ef532137$export$9547aaa2e39030ff.UnavailableID, `ID "${this.id}" is taken`);
                break;
            case $272dc2e0ef532137$export$adb4a1754da6f10d.InvalidKey:
                this._abort($272dc2e0ef532137$export$9547aaa2e39030ff.InvalidKey, `API KEY "${this._options.key}" is invalid`);
                break;
            case $272dc2e0ef532137$export$adb4a1754da6f10d.Leave:
                $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`Received leave message from ${peerId}`);
                this._cleanupPeer(peerId);
                this._connections.delete(peerId);
                break;
            case $272dc2e0ef532137$export$adb4a1754da6f10d.Expire:
                this.emitError($272dc2e0ef532137$export$9547aaa2e39030ff.PeerUnavailable, `Could not connect to peer ${peerId}`);
                break;
            case $272dc2e0ef532137$export$adb4a1754da6f10d.Offer:
                {
                    // we should consider switching this to CALL/CONNECT, but this is the least breaking option.
                    const connectionId = payload.connectionId;
                    let connection = this.getConnection(peerId, connectionId);
                    if (connection) {
                        connection.close();
                        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.warn(`Offer received for existing Connection ID:${connectionId}`);
                    }
                    // Create a new connection.
                    if (payload.type === $272dc2e0ef532137$export$3157d57b4135e3bc.Media) {
                        const mediaConnection = new $272dc2e0ef532137$var$$5c1d08c7c57da9a3$export$4a84e95a2324ac29(peerId, this, {
                            connectionId: connectionId,
                            _payload: payload,
                            metadata: payload.metadata
                        });
                        connection = mediaConnection;
                        this._addConnection(peerId, connection);
                        this.emit("call", mediaConnection);
                    } else if (payload.type === $272dc2e0ef532137$export$3157d57b4135e3bc.Data) {
                        const dataConnection = new this._serializers[payload.serialization](peerId, this, {
                            connectionId: connectionId,
                            _payload: payload,
                            metadata: payload.metadata,
                            label: payload.label,
                            serialization: payload.serialization,
                            reliable: payload.reliable
                        });
                        connection = dataConnection;
                        this._addConnection(peerId, connection);
                        this.emit("connection", dataConnection);
                    } else {
                        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.warn(`Received malformed connection type:${payload.type}`);
                        return;
                    }
                    // Find messages.
                    const messages = this._getMessages(connectionId);
                    for (const message of messages)connection.handleMessage(message);
                    break;
                }
            default:
                {
                    if (!payload) {
                        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.warn(`You received a malformed message from ${peerId} of type ${type}`);
                        return;
                    }
                    const connectionId = payload.connectionId;
                    const connection = this.getConnection(peerId, connectionId);
                    if (connection && connection.peerConnection) connection.handleMessage(message);
                    else if (connectionId) this._storeMessage(connectionId, message);
                    else $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.warn("You received an unrecognized message:", message);
                    break;
                }
        }
    }
    /** Stores messages without a set up connection, to be claimed later. */ _storeMessage(connectionId, message) {
        if (!this._lostMessages.has(connectionId)) this._lostMessages.set(connectionId, []);
        this._lostMessages.get(connectionId).push(message);
    }
    /**
	 * Retrieve messages from lost message store
	 * @internal
	 */ //TODO Change it to private
    _getMessages(connectionId) {
        const messages = this._lostMessages.get(connectionId);
        if (messages) {
            this._lostMessages.delete(connectionId);
            return messages;
        }
        return [];
    }
    /**
	 * Connects to the remote peer specified by id and returns a data connection.
	 * @param peer The brokering ID of the remote peer (their {@apilink Peer.id}).
	 * @param options for specifying details about Peer Connection
	 */ connect(peer, options = {}) {
        options = {
            serialization: "default",
            ...options
        };
        if (this.disconnected) {
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available.");
            this.emitError($272dc2e0ef532137$export$9547aaa2e39030ff.Disconnected, "Cannot connect to new Peer after disconnecting from server.");
            return;
        }
        const dataConnection = new this._serializers[options.serialization](peer, this, options);
        this._addConnection(peer, dataConnection);
        return dataConnection;
    }
    /**
	 * Calls the remote peer specified by id and returns a media connection.
	 * @param peer The brokering ID of the remote peer (their peer.id).
	 * @param stream The caller's media stream
	 * @param options Metadata associated with the connection, passed in by whoever initiated the connection.
	 */ call(peer, stream, options = {}) {
        if (this.disconnected) {
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect.");
            this.emitError($272dc2e0ef532137$export$9547aaa2e39030ff.Disconnected, "Cannot connect to new Peer after disconnecting from server.");
            return;
        }
        if (!stream) {
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");
            return;
        }
        const mediaConnection = new $272dc2e0ef532137$var$$5c1d08c7c57da9a3$export$4a84e95a2324ac29(peer, this, {
            ...options,
            _stream: stream
        });
        this._addConnection(peer, mediaConnection);
        return mediaConnection;
    }
    /** Add a data/media connection to this peer. */ _addConnection(peerId, connection) {
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`add connection ${connection.type}:${connection.connectionId} to peerId:${peerId}`);
        if (!this._connections.has(peerId)) this._connections.set(peerId, []);
        this._connections.get(peerId).push(connection);
    }
    //TODO should be private
    _removeConnection(connection) {
        const connections = this._connections.get(connection.peer);
        if (connections) {
            const index = connections.indexOf(connection);
            if (index !== -1) connections.splice(index, 1);
        }
        //remove from lost messages
        this._lostMessages.delete(connection.connectionId);
    }
    /** Retrieve a data/media connection for this peer. */ getConnection(peerId, connectionId) {
        const connections = this._connections.get(peerId);
        if (!connections) return null;
        for (const connection of connections){
            if (connection.connectionId === connectionId) return connection;
        }
        return null;
    }
    _delayedAbort(type, message) {
        setTimeout(()=>{
            this._abort(type, message);
        }, 0);
    }
    /**
	 * Emits an error message and destroys the Peer.
	 * The Peer is not destroyed if it's in a disconnected state, in which case
	 * it retains its disconnected state and its existing connections.
	 */ _abort(type, message) {
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.error("Aborting!");
        this.emitError(type, message);
        if (!this._lastServerId) this.destroy();
        else this.disconnect();
    }
    /**
	 * Destroys the Peer: closes all active connections as well as the connection
	 * to the server.
	 *
	 * :::caution
	 * This cannot be undone; the respective peer object will no longer be able
	 * to create or receive any connections, its ID will be forfeited on the server,
	 * and all of its data and media connections will be closed.
	 * :::
	 */ destroy() {
        if (this.destroyed) return;
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`Destroy peer with ID:${this.id}`);
        this.disconnect();
        this._cleanup();
        this._destroyed = true;
        this.emit("close");
    }
    /** Disconnects every connection on this peer. */ _cleanup() {
        for (const peerId of this._connections.keys()){
            this._cleanupPeer(peerId);
            this._connections.delete(peerId);
        }
        this.socket.removeAllListeners();
    }
    /** Closes all connections to this peer. */ _cleanupPeer(peerId) {
        const connections = this._connections.get(peerId);
        if (!connections) return;
        for (const connection of connections)connection.close();
    }
    /**
	 * Disconnects the Peer's connection to the PeerServer. Does not close any
	 *  active connections.
	 * Warning: The peer can no longer create or accept connections after being
	 *  disconnected. It also cannot reconnect to the server.
	 */ disconnect() {
        if (this.disconnected) return;
        const currentId = this.id;
        $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`Disconnect peer with ID:${currentId}`);
        this._disconnected = true;
        this._open = false;
        this.socket.close();
        this._lastServerId = currentId;
        this._id = null;
        this.emit("disconnected", currentId);
    }
    /** Attempts to reconnect with the same ID.
	 *
	 * Only {@apilink Peer.disconnect | disconnected peers} can be reconnected.
	 * Destroyed peers cannot be reconnected.
	 * If the connection fails (as an example, if the peer's old ID is now taken),
	 * the peer's existing connections will not close, but any associated errors events will fire.
	 */ reconnect() {
        if (this.disconnected && !this.destroyed) {
            $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.log(`Attempting reconnection to server with ID ${this._lastServerId}`);
            this._disconnected = false;
            this._initialize(this._lastServerId);
        } else if (this.destroyed) throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");
        else if (!this.disconnected && !this.open) $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.error("In a hurry? We're still trying to make the initial connection!");
        else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`);
    }
    /**
	 * Get a list of available peer IDs. If you're running your own server, you'll
	 * want to set allow_discovery: true in the PeerServer options. If you're using
	 * the cloud server, email team@peerjs.com to get the functionality enabled for
	 * your key.
	 */ listAllPeers(cb = (_)=>{}) {
        this._api.listAllPeers().then((peers)=>cb(peers)).catch((error)=>this._abort($272dc2e0ef532137$export$9547aaa2e39030ff.ServerError, error));
    }
}
class $272dc2e0ef532137$export$72aa44612e2200cd extends $272dc2e0ef532137$var$$6366c4ca161bc297$export$d365f7ad9d7df9c9 {
    constructor(peerId, provider, options){
        super(peerId, provider, {
            ...options,
            reliable: true
        });
        this._CHUNK_SIZE = 32768;
        this._splitStream = new TransformStream({
            transform: (chunk, controller)=>{
                for(let split = 0; split < chunk.length; split += this._CHUNK_SIZE)controller.enqueue(chunk.subarray(split, split + this._CHUNK_SIZE));
            }
        });
        this._rawSendStream = new WritableStream({
            write: async (chunk, controller)=>{
                const openEvent = new Promise((resolve)=>this.dataChannel.addEventListener("bufferedamountlow", resolve, {
                        once: true
                    }));
                // if we can send the chunk now, send it
                // if not, we wait until at least half of the sending buffer is free again
                await (this.dataChannel.bufferedAmount <= $272dc2e0ef532137$var$$6366c4ca161bc297$export$d365f7ad9d7df9c9.MAX_BUFFERED_AMOUNT - chunk.byteLength || openEvent);
                // TODO: what can go wrong here?
                try {
                    this.dataChannel.send(chunk);
                } catch (e) {
                    $272dc2e0ef532137$var$$257947e92926277a$export$2e2bcd8739ae039.error(`DC#:${this.connectionId} Error when sending:`, e);
                    controller.error(e);
                    this.close();
                }
            }
        });
        this.writer = this._splitStream.writable.getWriter();
        this._rawReadStream = new ReadableStream({
            start: (controller)=>{
                this.once("open", ()=>{
                    this.dataChannel.addEventListener("message", (e)=>{
                        controller.enqueue(e.data);
                    });
                });
            }
        });
        this._splitStream.readable.pipeTo(this._rawSendStream);
    }
    _initializeDataChannel(dc) {
        super._initializeDataChannel(dc);
        this.dataChannel.binaryType = "arraybuffer";
        this.dataChannel.bufferedAmountLowThreshold = $272dc2e0ef532137$var$$6366c4ca161bc297$export$d365f7ad9d7df9c9.MAX_BUFFERED_AMOUNT / 2;
    }
}
const $272dc2e0ef532137$var$$dcf98445f54823f4$var$NullValue = Symbol.for(null);
function $272dc2e0ef532137$var$$dcf98445f54823f4$var$concatUint8Array(buffer1, buffer2) {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(buffer1, 0);
    tmp.set(buffer2, buffer1.byteLength);
    return new Uint8Array(tmp.buffer);
}
const $272dc2e0ef532137$var$$dcf98445f54823f4$var$iterateOver = async function*(stream) {
    const reader = stream.getReader();
    try {
        while(true){
            const { done: done, value: value } = await reader.read();
            if (done) return;
            yield value;
        }
    } finally{
        reader.releaseLock();
    }
};
class $272dc2e0ef532137$export$7e9583c3c8a0a2cc extends $272dc2e0ef532137$export$72aa44612e2200cd {
    constructor(peerId, provider, options){
        super(peerId, provider, {
            ...options,
            reliable: true
        });
        this.serialization = "Cbor";
        this._encoder = new (0, $5641ea8d38d79299$export$a50aceb0e02a00aa)();
        this._decoder = new (0, $f048fe83766b6c6f$export$f9de6ca0bc043724)();
        this._decoderStream = new TransformStream({
            transform: (abchunk, controller)=>{
                let chunk = new Uint8Array(abchunk);
                if (this._inc) {
                    chunk = $272dc2e0ef532137$var$$dcf98445f54823f4$var$concatUint8Array(this._inc, chunk);
                    this._inc = null;
                }
                let values;
                try {
                    values = this._decoder.decodeMultiple(chunk);
                } catch (error) {
                    if (error.incomplete) {
                        this._inc = chunk.subarray(error.lastPosition);
                        values = error.values;
                    } else throw error;
                } finally{
                    for (let value of values || []){
                        if (value === null) value = $272dc2e0ef532137$var$$dcf98445f54823f4$var$NullValue;
                        controller.enqueue(value);
                    }
                }
            }
        });
        this._rawReadStream.pipeTo(this._decoderStream.writable);
        (async ()=>{
            for await (const msg of $272dc2e0ef532137$var$$dcf98445f54823f4$var$iterateOver(this._decoderStream.readable)){
                if (msg.__peerData?.type === "close") {
                    this.close();
                    return;
                }
                this.emit("data", msg);
            }
        })();
    }
    _send(data) {
        return this.writer.write(this._encoder.encode(data));
    }
}
class $272dc2e0ef532137$export$f6a74c7ffa2903e6 extends $272dc2e0ef532137$export$ecd1fc136c422448 {
    constructor(...args){
        super(...args);
        this._serializers = {
            Cbor: $272dc2e0ef532137$export$7e9583c3c8a0a2cc,
            default: $272dc2e0ef532137$export$7e9583c3c8a0a2cc
        };
    }
}
class $272dc2e0ef532137$export$80f5de1a66c4d624 extends $272dc2e0ef532137$export$72aa44612e2200cd {
    constructor(peerId, provider, options){
        super(peerId, provider, options);
        this.serialization = "MsgPack";
        this._encoder = new (0, $b9919a45dd64548b$export$a50aceb0e02a00aa)();
        (async ()=>{
            for await (const msg of (0, $2a3fad6258da7792$export$bf87d8a088c760fb)(this._rawReadStream)){
                // @ts-ignore
                if (msg.__peerData?.type === "close") {
                    this.close();
                    return;
                }
                this.emit("data", msg);
            }
        })();
    }
    _send(data) {
        return this.writer.write(this._encoder.encode(data));
    }
}
class $272dc2e0ef532137$export$d72c7bf8eef50853 extends $272dc2e0ef532137$export$ecd1fc136c422448 {
    constructor(...args){
        super(...args);
        this._serializers = {
            MsgPack: $272dc2e0ef532137$export$80f5de1a66c4d624,
            default: $272dc2e0ef532137$export$80f5de1a66c4d624
        };
    }
}
var $272dc2e0ef532137$export$2e2bcd8739ae039 = $272dc2e0ef532137$export$ecd1fc136c422448;


/**
 * Base class for ngrok-related errors
 */ class $2050641be2ebe8fe$export$1f153bdfce7cff1b extends Error {
    /**
   * @param {string} message - Error message
   * @param {Object} details - Additional error details
   */ constructor(message, details = {}){
        super(message);
        this.name = 'NgrokError';
        this.details = details;
        this.timestamp = new Date().toISOString();
        this.troubleshooting = [
            'Verify the ngrok tunnel is running',
            'Check if the ngrok URL is correct',
            'Ensure the Kinectron application is running'
        ];
    }
}
class $2050641be2ebe8fe$export$4166255d9634c9ec extends $2050641be2ebe8fe$export$1f153bdfce7cff1b {
    constructor(message, details = {}){
        super(message, {
            ...details,
            type: 'connection_error'
        });
        this.name = 'NgrokConnectionError';
        this.troubleshooting = [
            'Check if the ngrok tunnel is still active',
            'Verify your internet connection',
            'Try restarting the ngrok tunnel',
            'Ensure no firewall is blocking the connection'
        ];
    }
}
class $2050641be2ebe8fe$export$f8c51391769a899a extends $2050641be2ebe8fe$export$1f153bdfce7cff1b {
    constructor(message, details = {}){
        super(message, {
            ...details,
            type: 'timeout_error'
        });
        this.name = 'NgrokTimeoutError';
        this.troubleshooting = [
            'The connection attempt timed out',
            'Check your internet connection speed',
            'Verify the Kinectron server is running',
            'Try increasing the connection timeout'
        ];
    }
}
class $2050641be2ebe8fe$export$824c682561d91b13 extends $2050641be2ebe8fe$export$1f153bdfce7cff1b {
    constructor(message, details = {}){
        super(message, {
            ...details,
            type: 'validation_error'
        });
        this.name = 'NgrokValidationError';
        this.troubleshooting = [
            'Ensure the URL includes "ngrok-free.app"',
            'Copy the URL directly from the Kinectron application',
            'Make sure to include the full domain name'
        ];
    }
}
const $2050641be2ebe8fe$export$724281d238664ba = {
    INVALID_URL: {
        code: 'NGROK_001',
        message: 'Invalid ngrok URL format'
    },
    CONNECTION_FAILED: {
        code: 'NGROK_002',
        message: 'Failed to establish ngrok connection'
    },
    CONNECTION_TIMEOUT: {
        code: 'NGROK_003',
        message: 'Connection attempt timed out'
    },
    TUNNEL_CLOSED: {
        code: 'NGROK_004',
        message: 'Ngrok tunnel was closed'
    },
    SERVER_UNREACHABLE: {
        code: 'NGROK_005',
        message: 'Unable to reach Kinectron server'
    }
};


/**
 * Validates a ngrok URL format
 * @param {string} url - The URL to validate
 * @throws {NgrokValidationError} If URL is invalid
 */ function $792b08ff1dfd8e83$var$validateNgrokUrl(url) {
    if (!url.includes('ngrok-free.app')) throw new (0, $2050641be2ebe8fe$export$824c682561d91b13)((0, $2050641be2ebe8fe$export$724281d238664ba).INVALID_URL.message, {
        code: (0, $2050641be2ebe8fe$export$724281d238664ba).INVALID_URL.code,
        url: url,
        reason: 'URL must include ngrok-free.app domain'
    });
}
const $792b08ff1dfd8e83$export$d9abfac191d6fb15 = {
    host: '127.0.0.1',
    port: 9001,
    path: '/',
    secure: false,
    debug: 3,
    role: 'default',
    // For local connections, we don't need STUN/TURN servers
    // This matches the original kinectron implementation
    config: {
        iceServers: [],
        sdpSemantics: 'unified-plan'
    }
};
const $792b08ff1dfd8e83$export$ed3bb69bb836b297 = 'kinectron';
function $792b08ff1dfd8e83$export$fb6f4b3558343497(config) {
    if (!config) return $792b08ff1dfd8e83$export$d9abfac191d6fb15;
    // Handle ngrok addresses
    if (typeof config === 'string' && config.includes('ngrok')) try {
        $792b08ff1dfd8e83$var$validateNgrokUrl(config);
        return {
            host: config,
            port: '443',
            path: '/',
            secure: true,
            debug: 3,
            config: {
                iceServers: [],
                sdpSemantics: 'unified-plan'
            }
        };
    } catch (error) {
        // Add connection context to validation errors
        if (error instanceof (0, $2050641be2ebe8fe$export$824c682561d91b13)) {
            error.details.context = 'peer_config_validation';
            error.details.timestamp = new Date().toISOString();
        }
        throw error;
    }
    // Handle IP addresses or custom configs
    if (typeof config === 'string') return {
        ...$792b08ff1dfd8e83$export$d9abfac191d6fb15,
        host: config
    };
    // Handle full custom config objects
    return {
        ...$792b08ff1dfd8e83$export$d9abfac191d6fb15,
        ...config
    };
}


/**
 * Represents a client-side ngrok connection state error
 */ class $b0904cb4b6312074$export$37c12b0d5395ed1f extends Error {
    constructor(message, details = {}){
        super(message);
        this.name = 'NgrokClientError';
        this.details = details;
        this.timestamp = new Date().toISOString();
        this.troubleshooting = [
            'Check if the ngrok tunnel is running',
            'Verify the URL is correct',
            'Ensure the Kinectron application is running'
        ];
    }
}
class $b0904cb4b6312074$export$575c13c422fb6041 {
    /**
   * Available connection states
   */ static STATES = {
        DISCONNECTED: 'disconnected',
        VALIDATING: 'validating',
        CONNECTING: 'connecting',
        CONNECTED: 'connected',
        RECONNECTING: 'reconnecting',
        ERROR: 'error'
    };
    /**
   * Valid state transitions
   */ static VALID_TRANSITIONS = {
        [$b0904cb4b6312074$export$575c13c422fb6041.STATES.DISCONNECTED]: [
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.VALIDATING,
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.CONNECTING
        ],
        [$b0904cb4b6312074$export$575c13c422fb6041.STATES.VALIDATING]: [
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.CONNECTING,
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.ERROR
        ],
        [$b0904cb4b6312074$export$575c13c422fb6041.STATES.CONNECTING]: [
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.CONNECTED,
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.RECONNECTING,
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.ERROR,
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.CONNECTING
        ],
        [$b0904cb4b6312074$export$575c13c422fb6041.STATES.CONNECTED]: [
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.DISCONNECTED,
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.RECONNECTING,
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.ERROR
        ],
        [$b0904cb4b6312074$export$575c13c422fb6041.STATES.RECONNECTING]: [
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.CONNECTED,
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.CONNECTING,
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.ERROR
        ],
        [$b0904cb4b6312074$export$575c13c422fb6041.STATES.ERROR]: [
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.DISCONNECTED,
            $b0904cb4b6312074$export$575c13c422fb6041.STATES.CONNECTING
        ]
    };
    constructor(){
        this.currentState = null; // Start with no state
        this.metadata = {
            url: null,
            startTime: null,
            lastStateChange: new Date(),
            errorHistory: [],
            metrics: {
                latency: {
                    current: 0,
                    average: 0,
                    samples: []
                },
                connectionQuality: 'unknown',
                reconnects: {
                    count: 0,
                    lastAttempt: null
                },
                errors: {
                    total: 0,
                    byType: {}
                }
            }
        };
        // Event handlers
        this.handlers = {
            stateChange: new Set(),
            error: new Set(),
            metrics: new Set()
        };
    }
    /**
   * Add event listener
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */ on(event, handler) {
        if (this.handlers[event]) this.handlers[event].add(handler);
    }
    /**
   * Remove event listener
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */ off(event, handler) {
        if (this.handlers[event]) this.handlers[event].delete(handler);
    }
    /**
   * Emit event to handlers
   * @private
   * @param {string} event - Event type
   * @param {*} data - Event data
   */ _emit(event, data) {
        if (this.handlers[event]) this.handlers[event].forEach((handler)=>handler(data));
    }
    /**
   * Get current state
   * @returns {string} Current state
   */ getState() {
        return this.currentState;
    }
    /**
   * Get state metadata
   * @returns {Object} State metadata
   */ getMetadata() {
        return {
            ...this.metadata,
            currentState: this.currentState,
            uptime: this._calculateUptime()
        };
    }
    /**
   * Update connection metrics
   * @param {Object} metrics - New metrics
   */ updateMetrics(metrics) {
        // Update latency
        if (metrics.latency !== undefined) {
            this.metadata.metrics.latency.current = metrics.latency;
            this.metadata.metrics.latency.samples.push({
                value: metrics.latency,
                timestamp: new Date()
            });
            // Keep last 10 samples
            if (this.metadata.metrics.latency.samples.length > 10) this.metadata.metrics.latency.samples.shift();
            // Calculate average
            this.metadata.metrics.latency.average = this.metadata.metrics.latency.samples.reduce((sum, sample)=>sum + sample.value, 0) / this.metadata.metrics.latency.samples.length;
        }
        // Update connection quality based on metrics
        this._updateConnectionQuality();
        // Emit metrics update
        this._emit('metrics', this.metadata.metrics);
    }
    /**
   * Set connection state
   * @param {string} newState - New state
   * @param {Object} details - Transition details
   * @throws {NgrokClientError} If transition is invalid
   */ setState(newState, details = {}) {
        if (!this._isValidTransition(newState)) throw new $b0904cb4b6312074$export$37c12b0d5395ed1f(`Invalid state transition from ${this.currentState} to ${newState}`, {
            from: this.currentState,
            to: newState,
            details: details
        });
        const oldState = this.currentState;
        this.currentState = newState;
        this.metadata.lastStateChange = new Date();
        // Update metadata based on state
        if (newState === $b0904cb4b6312074$export$575c13c422fb6041.STATES.CONNECTED) {
            if (!this.metadata.startTime) this.metadata.startTime = new Date();
        } else if (newState === $b0904cb4b6312074$export$575c13c422fb6041.STATES.RECONNECTING) {
            this.metadata.metrics.reconnects.count++;
            this.metadata.metrics.reconnects.lastAttempt = new Date();
        }
        // Emit state change event
        this._emit('stateChange', {
            from: oldState,
            to: newState,
            timestamp: this.metadata.lastStateChange,
            details: details
        });
    }
    /**
   * Record an error
   * @param {Error} error - Error to record
   * @param {Object} context - Error context
   */ recordError(error, context = {}) {
        const errorRecord = {
            name: error.name,
            message: error.message,
            timestamp: new Date(),
            context: context,
            state: this.currentState
        };
        // Add to error history (keep last 10)
        this.metadata.errorHistory.unshift(errorRecord);
        if (this.metadata.errorHistory.length > 10) this.metadata.errorHistory.pop();
        // Update error metrics
        this.metadata.metrics.errors.total++;
        this.metadata.metrics.errors.byType[error.name] = (this.metadata.metrics.errors.byType[error.name] || 0) + 1;
        // Emit error event
        this._emit('error', errorRecord);
    }
    /**
   * Reset state to initial values
   */ reset() {
        this.currentState = null;
        this.metadata = {
            url: null,
            startTime: null,
            lastStateChange: new Date(),
            errorHistory: [],
            metrics: {
                latency: {
                    current: 0,
                    average: 0,
                    samples: []
                },
                connectionQuality: 'unknown',
                reconnects: {
                    count: 0,
                    lastAttempt: null
                },
                errors: {
                    total: 0,
                    byType: {}
                }
            }
        };
    }
    /**
   * Calculate connection uptime
   * @private
   * @returns {number} Uptime in milliseconds
   */ _calculateUptime() {
        if (!this.metadata.startTime || this.currentState !== $b0904cb4b6312074$export$575c13c422fb6041.STATES.CONNECTED) return 0;
        return Date.now() - this.metadata.startTime.getTime();
    }
    /**
   * Update connection quality based on metrics
   * @private
   */ _updateConnectionQuality() {
        const avgLatency = this.metadata.metrics.latency.average;
        const recentErrors = this.metadata.errorHistory.filter((e)=>Date.now() - new Date(e.timestamp).getTime() < 60000).length;
        if (recentErrors > 2) this.metadata.metrics.connectionQuality = 'poor';
        else if (avgLatency > 1000) // 1 second
        this.metadata.metrics.connectionQuality = 'unstable';
        else if (avgLatency > 500) // 500ms
        this.metadata.metrics.connectionQuality = 'fair';
        else this.metadata.metrics.connectionQuality = 'good';
    }
    /**
   * Check if state transition is valid
   * @private
   * @param {string} newState - State to transition to
   * @returns {boolean} Whether transition is valid
   */ _isValidTransition(newState) {
        // Allow any initial state transition
        if (this.currentState === null) return true;
        const validNextStates = $b0904cb4b6312074$export$575c13c422fb6041.VALID_TRANSITIONS[this.currentState];
        return validNextStates && validNextStates.includes(newState);
    }
}


class $4d767ee87242f6c3$export$d84cf184fade0488 {
    /**
   * @param {string|PeerNetworkConfig} [networkConfig] - Network configuration or host address
   * @param {string} [peerId] - ID of the peer to connect to
   */ constructor(networkConfig, peerId){
        /** @private */ this.peer = null;
        /** @private */ this.connection = null;
        /** @private */ this.targetPeerId = peerId || (0, $792b08ff1dfd8e83$export$ed3bb69bb836b297);
        /** @private */ this.config = (0, $792b08ff1dfd8e83$export$fb6f4b3558343497)(networkConfig);
        /** @private */ this.messageHandlers = new Map();
        /** @private */ this.messageQueue = [];
        /** @private */ this.maxQueueSize = 100;
        /** @private */ this.lastPingTime = 0;
        /** @private */ this.pingInterval = null;
        /** @private */ this.healthCheckInterval = null;
        /** @private */ this.clientId = this.generateClientId();
        /** @private */ this.state = new (0, $b0904cb4b6312074$export$575c13c422fb6041)();
        // Forward state events to message handlers
        this.state.on('stateChange', (data)=>{
            const handler = this.messageHandlers.get('stateChange');
            if (handler) handler(data);
        });
        this.state.on('error', (data)=>{
            const handler = this.messageHandlers.get('error');
            if (handler) handler(data);
        });
        this.state.on('metrics', (data)=>{
            const handler = this.messageHandlers.get('metrics');
            if (handler) handler(data);
        });
        this.initialize();
    }
    /**
   * Generate a consistent client ID
   * @private
   * @returns {string} Client ID
   */ generateClientId() {
        // Generate unique ID for each instance
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        const prefix = this.config.host?.includes('ngrok') ? 'ngrok' : 'local';
        const role = this.config.role || 'default';
        return `${prefix}-${role}-${timestamp}-${random}`;
    }
    /**
   * Get current connection state
   * @returns {Object} Current state information
   */ getState() {
        return this.state.getMetadata();
    }
    /**
   * Initialize the peer connection with enhanced reliability
   * @private
   */ initialize() {
        try {
            if (this.peer) {
                console.warn('Peer already initialized');
                return;
            }
            console.log('Initializing peer with config:', this.config);
            // Check if this is an ngrok connection
            const isNgrok = typeof this.config.host === 'string' && this.config.host.includes('ngrok');
            if (isNgrok) {
                // Set state to validating for ngrok connections
                this.state.setState((0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.VALIDATING);
                // Validate ngrok URL format
                if (!this.config.host.includes('ngrok-free.app')) throw new (0, $b0904cb4b6312074$export$37c12b0d5395ed1f)('Invalid ngrok URL format', {
                    url: this.config.host,
                    reason: 'URL must include ngrok-free.app domain'
                });
            }
            // Create peer instance with consistent ID
            this.peer = new (0, $272dc2e0ef532137$export$2e2bcd8739ae039)(this.clientId, {
                ...this.config,
                // Basic reliability options
                reliable: true,
                retries: 2,
                timeout: isNgrok ? 5000 : 3000,
                debug: 0
            });
            // Move to connecting state (skip validation for local connections)
            if (!isNgrok) this.state.setState((0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTING);
            this.setupPeerEventHandlers();
            this.startHealthCheck();
        } catch (error) {
            console.error('Peer initialization error:', error);
            this.handleError(error);
            this.state.setState((0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.ERROR, {
                error: error.message,
                context: 'initialization'
            });
        }
    }
    /**
   * Set up event handlers for the peer instance
   * @private
   */ setupPeerEventHandlers() {
        this.peer.on('open', (id)=>{
            console.log('My peer ID is:', id);
            // Already in CONNECTING state, proceed with connection
            this.connect();
        });
        this.peer.on('error', (error)=>{
            console.error('Peer connection error:', error);
            // Handle ID taken error by generating new ID
            if (error.type === 'unavailable-id') {
                console.log('Client ID taken, generating new ID');
                this.clientId = this.generateClientId();
                this._cleanup(false);
                this.initialize();
                return;
            }
            this.handleError(error);
            // Set error state
            this.state.setState((0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.ERROR, {
                error: error.message,
                type: error.type
            });
            // Attempt reconnection if appropriate
            if (this.shouldAttemptReconnection(error)) this._handleReconnection(error);
        });
        this.peer.on('disconnected', ()=>{
            console.log('Peer disconnected from server');
            this.state.setState((0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.DISCONNECTED, {
                reason: 'peer_disconnected'
            });
            this._handleReconnection({
                type: 'disconnected'
            });
        });
    }
    /**
   * Start health check interval
   * @private
   */ startHealthCheck() {
        // Clear any existing intervals
        if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
        if (this.pingInterval) clearInterval(this.pingInterval);
        // Start health check
        this.healthCheckInterval = setInterval(()=>{
            if (this.state.getState() === (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED && this.connection) this.checkConnectionHealth();
        }, 10000);
        // Start ping interval
        this.pingInterval = setInterval(()=>{
            if (this.state.getState() === (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED && this.connection?.open) this.sendPing();
        }, 5000);
    }
    /**
   * Check connection health
   * @private
   */ async checkConnectionHealth() {
        if (!this.connection?.open) {
            console.warn('Connection appears dead, attempting recovery');
            await this.handleConnectionFailure();
            return;
        }
        // Check last ping time
        const timeSinceLastPing = Date.now() - this.lastPingTime;
        if (timeSinceLastPing > 15000) {
            // No ping response for 15 seconds
            console.warn('No ping response, connection may be dead');
            await this.handleConnectionFailure();
        }
        // Update connection metrics
        this.state.updateMetrics({
            latency: timeSinceLastPing,
            timestamp: new Date()
        });
    }
    /**
   * Send ping to peer
   * @private
   */ sendPing() {
        try {
            this.connection.send({
                event: 'ping',
                data: {
                    timestamp: Date.now()
                }
            });
        } catch (error) {
            console.error('Failed to send ping:', error);
        }
    }
    /**
   * Handle connection failure
   * @private
   */ async handleConnectionFailure() {
        if (this.connection) {
            try {
                this.connection.close();
            } catch (error) {
                console.error('Error closing connection:', error);
            }
            this.connection = null;
        }
        this.state.setState((0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.RECONNECTING, {
            reason: 'connection_failure',
            timestamp: new Date()
        });
        await this._handleReconnection({
            type: 'connection_failure'
        });
    }
    /**
   * Handle errors with enhanced information
   * @private
   * @param {Error} error - The error that occurred
   */ handleError(error) {
        // Record error in state
        this.state.recordError(error, {
            type: error.type || 'server-error',
            state: this.state.getState(),
            timestamp: new Date().toISOString()
        });
        // Forward to message handler
        const handler = this.messageHandlers.get('error');
        if (handler) {
            const errorInfo = {
                status: 'error',
                error: this._getErrorMessage(error),
                details: {
                    type: error.type || 'server-error',
                    state: this.state.getState(),
                    timestamp: new Date().toISOString()
                }
            };
            handler(errorInfo);
        }
    }
    /**
   * Get user-friendly error message
   * @private
   * @param {Error} error - The error object
   * @returns {string} User-friendly error message
   */ _getErrorMessage(error) {
        const errorMessages = {
            network: 'Network error - Could not connect to peer server',
            'invalid-id': 'Invalid ID - The peer ID is invalid or already taken',
            'unavailable-id': 'ID Unavailable - The peer ID is already taken',
            'browser-incompatible': 'Browser Incompatible - WebRTC is not supported',
            'connection-failure': 'Connection failed - Unable to establish or maintain connection',
            disconnected: 'Disconnected - Lost connection to peer server'
        };
        return errorMessages[error.type] || error.message || 'Peer connection error';
    }
    /**
   * Determine if reconnection should be attempted
   * @private
   * @param {Error} error - The error that occurred
   * @returns {boolean} Whether to attempt reconnection
   */ shouldAttemptReconnection(error) {
        // Don't reconnect for certain error types
        const fatalErrors = [
            'browser-incompatible',
            'invalid-id',
            'invalid-key'
        ];
        if (fatalErrors.includes(error.type)) return false;
        return this.state.getMetadata().metrics.reconnects.count < 3;
    }
    /**
   * Set connection timeout with enhanced retry logic
   * @private
   */ _setConnectionTimeout() {
        const timeoutDuration = 15000; // 15 second timeout for ngrok connections
        setTimeout(()=>{
            if (this.state.getState() !== (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED) {
                console.log('Connection attempt timed out');
                if (this.shouldAttemptReconnection({
                    type: 'timeout'
                })) this._handleReconnection({
                    type: 'timeout'
                });
                else this.handleError({
                    type: 'timeout',
                    message: 'Connection timeout - Max attempts reached'
                });
            }
        }, timeoutDuration);
    }
    /**
   * Handle reconnection logic with improved retry strategy
   * @private
   * @param {Error} error - The error that triggered reconnection
   */ async _handleReconnection(error) {
        // Update state to reconnecting
        this.state.setState((0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.RECONNECTING, {
            error: error.message,
            attempt: this.state.getMetadata().metrics.reconnects.count + 1
        });
        // Use exponential backoff with jitter
        const baseDelay = Math.min(2000 * Math.pow(1.5, this.state.getMetadata().metrics.reconnects.count), 15000);
        const jitter = baseDelay * 0.2 * (Math.random() * 2 - 1);
        const delay = Math.max(2000, baseDelay + jitter);
        console.log(`Attempting reconnection ${this.state.getMetadata().metrics.reconnects.count + 1} of 3 in ${Math.round(delay)}ms`);
        // Wait for delay
        await new Promise((resolve)=>setTimeout(resolve, delay));
        if (this.state.getState() === (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.RECONNECTING) {
            console.log('Attempting to reconnect...');
            // Clean up existing resources
            await this._cleanup(false);
            // Only try to reconnect if we haven't exceeded max attempts
            if (this.shouldAttemptReconnection(error)) {
                // Move back to connecting state
                this.state.setState((0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTING);
                this.initialize();
            } else {
                console.log('Max reconnection attempts reached');
                this.state.setState((0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.ERROR, {
                    error: 'Maximum reconnection attempts reached',
                    type: 'max_retries'
                });
            }
        }
    }
    /**
   * Clean up resources
   * @private
   * @param {boolean} [isClosing=true] - Whether this is a final cleanup
   */ async _cleanup(isClosing = true) {
        // Clean up existing peer
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
        // Clean up existing connection
        if (this.connection) {
            this.connection.close();
            this.connection = null;
        }
        // Clear intervals if doing final cleanup
        if (isClosing) {
            if (this.healthCheckInterval) {
                clearInterval(this.healthCheckInterval);
                this.healthCheckInterval = null;
            }
            if (this.pingInterval) {
                clearInterval(this.pingInterval);
                this.pingInterval = null;
            }
        }
    }
    /**
   * Connect to target peer with enhanced reliability
   */ connect() {
        try {
            // Check if we already have a connection
            if (this.peer.connections[this.targetPeerId]?.length > 0) {
                const existingConn = this.peer.connections[this.targetPeerId][0];
                if (existingConn.open) {
                    console.log('Reusing existing connection');
                    this.connection = existingConn;
                    this.setupConnectionHandlers();
                    return;
                }
            }
            // Create new connection
            console.log('Creating new connection to:', this.targetPeerId);
            this.connection = this.peer.connect(this.targetPeerId, {
                reliable: true,
                serialization: 'binary'
            });
            this.setupConnectionHandlers();
            this._setConnectionTimeout();
        } catch (error) {
            console.error('Error establishing connection:', error);
            this._handleReconnection(error);
        }
    }
    /**
   * Set up handlers for the peer connection
   * @private
   */ setupConnectionHandlers() {
        this.connection.on('open', ()=>{
            console.log('Connected to peer:', this.targetPeerId);
            // Update state
            this.state.setState((0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED, {
                peerId: this.targetPeerId,
                timestamp: new Date()
            });
            // Process any queued messages
            this.processMessageQueue();
            // Emit ready event
            const handler = this.messageHandlers.get('ready');
            if (handler) handler({
                status: 'connected',
                peerId: this.targetPeerId,
                state: this.state.getState(),
                timestamp: new Date().toISOString()
            });
        });
        this.connection.on('data', (data)=>{
            if (data.event === 'pong') {
                this.lastPingTime = Date.now();
                // Update latency metrics
                const latency = Date.now() - data.data.timestamp;
                this.state.updateMetrics({
                    latency: latency
                });
                return;
            }
            console.log('Received data from peer:', data);
            this.handleIncomingData(data);
        });
        this.connection.on('close', ()=>{
            console.log('Peer connection closed');
            if (!this._isClosing) {
                this.state.setState((0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.DISCONNECTED, {
                    reason: 'connection_closed'
                });
                this._handleReconnection({
                    type: 'connection_closed'
                });
            }
        });
        this.connection.on('error', (error)=>{
            console.error('Data connection error:', error);
            this.state.setState((0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.ERROR, {
                error: error.message,
                type: error.type
            });
            this.handleError(error);
            this._handleReconnection(error);
        });
    }
    /**
   * Handle incoming data from peer with enhanced error handling
   * @private
   * @param {Object} data - Data received from peer
   * @param {string} data.event - Event type
   * @param {*} data.data - Event data
   */ handleIncomingData(data) {
        try {
            console.log('PeerConnection: Received event:', data.event, 'with data:', data.data);
            // First, try to find a specific handler for this event
            const handler = this.messageHandlers.get(data.event);
            if (handler) {
                console.log('PeerConnection: Found specific handler for event:', data.event);
                handler({
                    ...data.data,
                    timestamp: Date.now(),
                    state: this.state.getState()
                });
            } else {
                console.log('PeerConnection: No specific handler for event:', data.event, 'forwarding to data handler');
                // If no specific handler is found, forward the event to the data handler
                // This ensures all events are forwarded to the Kinectron class
                const dataHandler = this.messageHandlers.get('data');
                if (dataHandler) dataHandler(data);
                else console.warn('PeerConnection: No data handler found for event:', data.event);
            }
        } catch (error) {
            console.error('Error handling incoming data:', error);
            this.handleError({
                type: 'data_handling_error',
                message: 'Error processing received data',
                originalError: error
            });
        }
    }
    /**
   * Process queued messages
   * @private
   */ async processMessageQueue() {
        while(this.messageQueue.length > 0 && this.state.getState() === (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED){
            const message = this.messageQueue.shift();
            try {
                await this.send(message.event, message.data);
            } catch (error) {
                console.error('Failed to send queued message:', error);
                // Re-queue message if connection is still open
                if (this.state.getState() === (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED && this.messageQueue.length < this.maxQueueSize) this.messageQueue.push(message);
            }
        }
    }
    /**
   * Register a handler for a specific event type with validation
   * @param {string} event - Event type to handle
   * @param {Function} handler - Handler function for the event
   */ on(event, handler) {
        if (typeof handler !== 'function') throw new Error('Handler must be a function');
        this.messageHandlers.set(event, handler);
    }
    /**
   * Send data to peer with enhanced reliability
   * @param {string} event - Event type
   * @param {*} data - Data to send
   * @returns {Promise<void>}
   */ async send(event, data) {
        return new Promise((resolve, reject)=>{
            if (this.state.getState() !== (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED || !this.connection?.open) {
                // Queue message if not connected
                if (this.messageQueue.length < this.maxQueueSize) {
                    this.messageQueue.push({
                        event: event,
                        data: data
                    });
                    resolve(); // Resolve since message was queued
                } else reject(new Error('Message queue full'));
                return;
            }
            try {
                const message = {
                    event: event,
                    data: data,
                    timestamp: Date.now()
                };
                const timeout = setTimeout(()=>{
                    reject(new Error('Send timeout'));
                }, 5000);
                this.connection.send(message);
                clearTimeout(timeout);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
   * Close the peer connection with graceful shutdown
   */ async close() {
        this._isClosing = true;
        // Send shutdown message if possible
        if (this.connection?.open) try {
            await this.send('shutdown', {
                reason: 'client_close'
            });
        } catch (error) {
            console.error('Error sending shutdown message:', error);
        }
        // Clean up resources
        await this._cleanup(true);
        // Reset state
        this.state.reset();
        this.messageQueue = [];
        this._isClosing = false;
    }
    /**
   * Check if peer is connected
   * @returns {boolean} Connection status
   */ isConnected() {
        return this.state.getState() === (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED && this.connection?.open;
    }
}







class $dc79748ed7dcc9e9$export$9369465eba7492ab {
    constructor(networkConfig){
        this.peer = new (0, $4d767ee87242f6c3$export$d84cf184fade0488)(networkConfig);
        this.messageHandlers = new Map();
        this.state = null;
        // Set up event handlers
        this.peer.on('ready', (data)=>{
            this.state = data.state;
            const handler = this.messageHandlers.get('ready');
            if (handler) handler(data);
        });
        this.peer.on('error', (error)=>{
            const handler = this.messageHandlers.get('error');
            if (handler) handler(error);
        });
        // Handle state changes
        this.peer.on('stateChange', (data)=>{
            this.state = data.to;
            const handler = this.messageHandlers.get('stateChange');
            if (handler) handler(data);
        });
        // Handle metrics updates
        this.peer.on('metrics', (data)=>{
            const handler = this.messageHandlers.get('metrics');
            if (handler) handler(data);
        });
        // Handle incoming data
        this.peer.on('data', (data)=>{
            const { event: event, data: eventData } = data;
            const handler = this.messageHandlers.get(event);
            if (handler) handler(eventData);
            else console.warn('Kinectron: No handler found for event:', event);
        });
    }
    // Event registration
    on(event, callback) {
        this.messageHandlers.set(event, callback);
    }
    // Get current state
    getState() {
        return this.peer.getState();
    }
    // Check if connected
    isConnected() {
        return this.state === (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED;
    }
    // Set Kinect type (azure or windows)
    setKinectType(kinectType) {
        if (!this.isConnected()) {
            console.warn('Cannot set Kinect type: not connected');
            return;
        }
        this.send('setkinect', kinectType);
    }
    // Initialize Kinect
    initKinect(callback) {
        if (!this.isConnected()) {
            console.warn('Cannot initialize Kinect: not connected');
            return Promise.reject(new Error('Cannot initialize Kinect: not connected'));
        }
        // Create a promise that resolves when we get the kinectInitialized event
        const initPromise = new Promise((resolve, reject)=>{
            // Set up a one-time handler for the initialization response
            const handler = (data)=>{
                // Normalize the success value to handle nested structure
                let isSuccess = false;
                if (data.success && typeof data.success === 'object' && data.success.success === true) isSuccess = true;
                else if (typeof data.success === 'boolean' && data.success === true) isSuccess = true;
                // Create a normalized result object
                const normalizedResult = {
                    success: isSuccess,
                    alreadyInitialized: !!data.alreadyInitialized,
                    error: data.error || null,
                    rawData: data
                };
                if (isSuccess || data.alreadyInitialized) resolve(normalizedResult);
                else reject(new Error(data.error || 'Failed to initialize Kinect'));
                // Remove the handler after it's been called
                this.messageHandlers.delete('kinectInitialized');
            };
            this.messageHandlers.set('kinectInitialized', handler);
            // Send initialization request to server
            this.send('initkinect', {});
        });
        // For backward compatibility, if a callback is provided, use it
        if (callback) initPromise.then((data)=>callback(data)).catch((error)=>callback({
                success: false,
                error: error.message
            }));
        // Return the promise for modern Promise-based usage
        return initPromise;
    }
    // Send data to peer
    send(event, data) {
        if (!this.isConnected()) {
            console.warn('Cannot send data: not connected');
            return;
        }
        this.peer.send(event, data);
    }
    // Start feed methods
    startColor(callback) {
        if (callback) // Set up frame handler to process color frames
        this.messageHandlers.set('frame', (data)=>{
            // Extract the actual frame data
            const frameData = data.data || data;
            // Only process frames with name 'color'
            if (frameData.name === 'color' && frameData.imagedata) {
                // Create a canvas to convert image data to a data URL
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const { width: width, height: height } = frameData.imagedata;
                canvas.width = width;
                canvas.height = height;
                try {
                    // Check if data is a string (data URL)
                    if (typeof frameData.imagedata.data === 'string') {
                        // Create an image from the data URL
                        const img = new Image();
                        img.onload = ()=>{
                            // Draw the image to the canvas
                            ctx.drawImage(img, 0, 0, width, height);
                            // Use the original data URL
                            const src = frameData.imagedata.data;
                            // Call the user callback with processed frame
                            callback({
                                src: src,
                                width: width,
                                height: height,
                                raw: frameData.imagedata,
                                timestamp: frameData.timestamp || Date.now()
                            });
                        };
                        // Set error handler
                        img.onerror = (err)=>{
                            console.error('Kinectron: Error loading image from data URL:', err);
                            // Try to call callback anyway with the raw data
                            callback({
                                src: frameData.imagedata.data,
                                width: width,
                                height: height,
                                raw: frameData.imagedata,
                                timestamp: frameData.timestamp || Date.now()
                            });
                        };
                        // Start loading the image
                        img.src = frameData.imagedata.data;
                        // Return early - callback will be called from onload handler
                        return;
                    } else {
                        // Original code for handling raw pixel data
                        // Ensure we have a Uint8ClampedArray
                        let pixelData;
                        if (frameData.imagedata.data instanceof Uint8ClampedArray) pixelData = frameData.imagedata.data;
                        else if (frameData.imagedata.data instanceof Uint8Array) pixelData = new Uint8ClampedArray(frameData.imagedata.data);
                        else if (Array.isArray(frameData.imagedata.data)) pixelData = new Uint8ClampedArray(frameData.imagedata.data);
                        else // Handle case where data is an object (e.g., from JSON)
                        pixelData = new Uint8ClampedArray(Object.values(frameData.imagedata.data));
                        const imgData = new ImageData(pixelData, width, height);
                        // Put the image data on the canvas
                        ctx.putImageData(imgData, 0, 0);
                        // Convert to data URL for easy display
                        const src = canvas.toDataURL('image/jpeg');
                        // Call the user callback with processed frame
                        callback({
                            src: src,
                            width: width,
                            height: height,
                            raw: frameData.imagedata,
                            timestamp: frameData.timestamp || Date.now()
                        });
                    }
                } catch (error) {
                    console.error('Kinectron: Error processing color frame:', error);
                    console.error('Kinectron: Frame data:', frameData.imagedata);
                }
            } else console.warn("Kinectron: Received frame event but it's not a valid color frame:", 'name=', frameData.name, 'has imagedata=', !!frameData.imagedata);
        });
        this.send('feed', {
            feed: 'color'
        });
    }
    startDepth(callback) {
        console.log('Kinectron: startDepth called');
        if (callback) {
            console.log('Kinectron: Setting up frame handler for depth frames');
            // Set up frame handler to process depth frames
            this.messageHandlers.set('frame', (data)=>{
                console.log('Kinectron: Received frame event:', data);
                // Extract the actual frame data
                const frameData = data.data || data;
                console.log('Kinectron: Frame data extracted:', frameData ? `name=${frameData.name}, has imagedata=${!!frameData.imagedata}` : 'null');
                // Only process frames with name 'depth'
                if (frameData.name === 'depth' && frameData.imagedata) {
                    console.log('Kinectron: Processing depth frame with dimensions:', frameData.imagedata.width, 'x', frameData.imagedata.height);
                    // Create a canvas to convert image data to a data URL
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const { width: width, height: height } = frameData.imagedata;
                    canvas.width = width;
                    canvas.height = height;
                    try {
                        // Check if data is a string (data URL)
                        if (typeof frameData.imagedata.data === 'string') {
                            console.log('Kinectron: Received depth frame with data URL');
                            // Create an image from the data URL
                            const img = new Image();
                            img.onload = ()=>{
                                console.log('Kinectron: Depth image loaded successfully');
                                // Draw the image to the canvas
                                ctx.drawImage(img, 0, 0, width, height);
                                // Use the original data URL
                                const src = frameData.imagedata.data;
                                // Call the user callback with processed frame
                                console.log('Kinectron: Calling user callback with processed depth frame');
                                callback({
                                    src: src,
                                    width: width,
                                    height: height,
                                    raw: frameData.imagedata,
                                    timestamp: frameData.timestamp || Date.now()
                                });
                            };
                            // Set error handler
                            img.onerror = (err)=>{
                                console.error('Kinectron: Error loading depth image from data URL:', err);
                                // Try to call callback anyway with the raw data
                                console.log('Kinectron: Calling user callback with raw data due to image load error');
                                callback({
                                    src: frameData.imagedata.data,
                                    width: width,
                                    height: height,
                                    raw: frameData.imagedata,
                                    timestamp: frameData.timestamp || Date.now()
                                });
                            };
                            // Start loading the image
                            console.log('Kinectron: Setting image src to data URL');
                            img.src = frameData.imagedata.data;
                            // Return early - callback will be called from onload handler
                            return;
                        } else {
                            console.log('Kinectron: Received depth frame with raw pixel data');
                            // Original code for handling raw pixel data
                            // Ensure we have a Uint8ClampedArray
                            let pixelData;
                            if (frameData.imagedata.data instanceof Uint8ClampedArray) pixelData = frameData.imagedata.data;
                            else if (frameData.imagedata.data instanceof Uint8Array) pixelData = new Uint8ClampedArray(frameData.imagedata.data);
                            else if (Array.isArray(frameData.imagedata.data)) pixelData = new Uint8ClampedArray(frameData.imagedata.data);
                            else // Handle case where data is an object (e.g., from JSON)
                            pixelData = new Uint8ClampedArray(Object.values(frameData.imagedata.data));
                            const imgData = new ImageData(pixelData, width, height);
                            // Put the image data on the canvas
                            ctx.putImageData(imgData, 0, 0);
                            // Convert to data URL for easy display
                            const src = canvas.toDataURL('image/jpeg');
                            // Call the user callback with processed frame
                            callback({
                                src: src,
                                width: width,
                                height: height,
                                raw: frameData.imagedata,
                                timestamp: frameData.timestamp || Date.now()
                            });
                        }
                    } catch (error) {
                        console.error('Kinectron: Error processing depth frame:', error);
                        console.error('Kinectron: Frame data:', frameData.imagedata);
                    }
                } else console.warn("Kinectron: Received frame event but it's not a valid depth frame:", 'name=', frameData.name, 'has imagedata=', !!frameData.imagedata);
            });
        }
        this.send('feed', {
            feed: 'depth'
        });
    }
    /**
   * Unpacks raw depth data from a WebP image
   * @private
   * @param {string} dataUrl - The data URL containing the depth data
   * @param {number} width - The width of the image
   * @param {number} height - The height of the image
   * @param {number} originalWidth - The original width of the depth data (not used in new implementation)
   * @param {Object} testValues - Test values to verify unpacking accuracy
   * @returns {Promise<Uint16Array>} - Promise resolving to the unpacked depth values
   */ _unpackRawDepthData(dataUrl, width, height, originalWidth, testValues) {
        // Import the debug configuration
        (parcelRequire("iZi0K")).then(({ DEBUG: DEBUG })=>{
            // Enable debug if needed
            if (DEBUG.RAW_DEPTH) console.log('Unpacking raw depth data with dimensions:', width, 'x', height);
        }).catch((err)=>{
        // Silently fail if debug module can't be loaded
        });
        return new Promise((resolve, reject)=>{
            // Create image to load the data URL
            const img = new Image();
            img.onload = ()=>{
                // Use OffscreenCanvas for efficient processing
                const canvas = new OffscreenCanvas(width, height);
                const ctx = canvas.getContext('2d');
                // Draw the image to the canvas
                ctx.drawImage(img, 0, 0);
                // Get the pixel data
                const imageData = ctx.getImageData(0, 0, width, height).data;
                // Create array for unpacked depth values
                const depthValues = new Uint16Array(width * height);
                // Process the raw depth data exactly like the app.js client code
                let j = 0;
                for(let i = 0; i < imageData.length; i += 4){
                    // Extract depth value from R and G channels
                    const depth = imageData[i + 1] << 8 | imageData[i]; // Get uint16 data from buffer
                    depthValues[j++] = depth;
                }
                // Verify test values if provided
                if (testValues) // Import the debug configuration
                (parcelRequire("iZi0K")).then(({ DEBUG: DEBUG })=>{
                    if (DEBUG.RAW_DEPTH && DEBUG.DATA) {
                        const unpackedValue1000 = depthValues[1000];
                        const unpackedValue2000 = depthValues[2000];
                        const unpackedValue3000 = depthValues[3000];
                        console.log('Test values comparison:', {
                            'Index 1000': {
                                Original: testValues.index1000,
                                Unpacked: unpackedValue1000,
                                Difference: testValues.index1000 - unpackedValue1000
                            },
                            'Index 2000': {
                                Original: testValues.index2000,
                                Unpacked: unpackedValue2000,
                                Difference: testValues.index2000 - unpackedValue2000
                            },
                            'Index 3000': {
                                Original: testValues.index3000,
                                Unpacked: unpackedValue3000,
                                Difference: testValues.index3000 - unpackedValue3000
                            }
                        });
                    }
                }).catch((err)=>{
                // Silently fail if debug module can't be loaded
                });
                resolve(depthValues);
            };
            img.onerror = (err)=>{
                reject(new Error('Failed to load depth image: ' + err));
            };
            img.src = dataUrl;
        });
    }
    startRawDepth(callback) {
        if (callback) // Set up handler to process raw depth frames
        this.messageHandlers.set('rawDepth', (data)=>{
            if (data && data.imagedata) // Process the data regardless of isPacked flag
            // The new implementation always unpacks the data
            this._unpackRawDepthData(data.imagedata, data.width, data.height, data.width, data.testValues).then((depthValues)=>{
                // Call the callback with the unpacked data
                callback({
                    ...data,
                    depthValues: depthValues,
                    timestamp: data.timestamp || Date.now()
                });
            }).catch((error)=>{
                console.error('Error unpacking raw depth data:', error);
                // Still call the callback with the original data
                callback({
                    ...data,
                    error: 'Failed to unpack depth data: ' + error.message,
                    timestamp: data.timestamp || Date.now()
                });
            });
            else if (data && data.rawDepthData) // Legacy format - raw depth data is already in a usable format
            callback({
                ...data,
                timestamp: data.timestamp || Date.now()
            });
            else {
                console.warn('Received raw depth frame with invalid data format:', data);
                callback({
                    ...data,
                    error: 'Invalid data format',
                    timestamp: data.timestamp || Date.now()
                });
            }
        });
        this.send('feed', {
            feed: 'raw-depth'
        });
    }
    startBodies(callback) {
        if (callback) // Set up handler to process body tracking frames
        this.messageHandlers.set('bodyFrame', (data)=>{
            if (data && data.bodies) // Body data is already in a usable format (array of body objects)
            // Just add timestamp and pass it through
            callback({
                bodies: data.bodies,
                timestamp: data.timestamp || Date.now(),
                floorClipPlane: data.floorClipPlane,
                trackingId: data.trackingId
            });
        });
        this.send('feed', {
            feed: 'body'
        });
    }
    startKey(callback) {
        if (callback) // Set up frame handler to process key frames
        this.messageHandlers.set('frame', (data)=>{
            // Extract the actual frame data
            const frameData = data.data || data;
            // Only process frames with name 'key'
            if (frameData.name === 'key' && frameData.imagedata) {
                // Create a canvas to convert image data to a data URL
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const { width: width, height: height } = frameData.imagedata;
                canvas.width = width;
                canvas.height = height;
                try {
                    // Check if data is a string (data URL)
                    if (typeof frameData.imagedata.data === 'string') {
                        // Create an image from the data URL
                        const img = new Image();
                        img.onload = ()=>{
                            // Draw the image to the canvas
                            ctx.drawImage(img, 0, 0, width, height);
                            // Use the original data URL
                            const src = frameData.imagedata.data;
                            // Call the user callback with processed frame
                            callback({
                                src: src,
                                width: width,
                                height: height,
                                raw: frameData.imagedata,
                                timestamp: frameData.timestamp || Date.now()
                            });
                        };
                        // Set error handler
                        img.onerror = (err)=>{
                            console.error('Kinectron: Error loading key image from data URL:', err);
                            // Try to call callback anyway with the raw data
                            callback({
                                src: frameData.imagedata.data,
                                width: width,
                                height: height,
                                raw: frameData.imagedata,
                                timestamp: frameData.timestamp || Date.now()
                            });
                        };
                        // Start loading the image
                        img.src = frameData.imagedata.data;
                        // Return early - callback will be called from onload handler
                        return;
                    } else {
                        // Original code for handling raw pixel data
                        // Ensure we have a Uint8ClampedArray
                        let pixelData;
                        if (frameData.imagedata.data instanceof Uint8ClampedArray) pixelData = frameData.imagedata.data;
                        else if (frameData.imagedata.data instanceof Uint8Array) pixelData = new Uint8ClampedArray(frameData.imagedata.data);
                        else if (Array.isArray(frameData.imagedata.data)) pixelData = new Uint8ClampedArray(frameData.imagedata.data);
                        else // Handle case where data is an object (e.g., from JSON)
                        pixelData = new Uint8ClampedArray(Object.values(frameData.imagedata.data));
                        const imgData = new ImageData(pixelData, width, height);
                        // Put the image data on the canvas
                        ctx.putImageData(imgData, 0, 0);
                        // Convert to data URL for easy display
                        const src = canvas.toDataURL('image/jpeg');
                        // Call the user callback with processed frame
                        callback({
                            src: src,
                            width: width,
                            height: height,
                            raw: frameData.imagedata,
                            timestamp: frameData.timestamp || Date.now()
                        });
                    }
                } catch (error) {
                    console.error('Kinectron: Error processing key frame:', error);
                    console.error('Kinectron: Frame data:', frameData.imagedata);
                }
            } else console.warn("Kinectron: Received frame event but it's not a valid key frame:", 'name=', frameData.name, 'has imagedata=', !!frameData.imagedata);
        });
        this.send('feed', {
            feed: 'key'
        });
    }
    startDepthKey(callback) {
        if (callback) // Set up handler to process depth key frames
        this.messageHandlers.set('depthKey', (data)=>{
            if (data && data.imagedata) {
                // Create a canvas to convert image data to a data URL
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const { width: width, height: height } = data.imagedata;
                canvas.width = width;
                canvas.height = height;
                // Create ImageData object from the raw data
                const imgData = new ImageData(new Uint8ClampedArray(data.imagedata.data), width, height);
                // Put the image data on the canvas
                ctx.putImageData(imgData, 0, 0);
                // Convert to data URL for easy display
                const src = canvas.toDataURL('image/jpeg');
                // Call the user callback with processed frame
                callback({
                    src: src,
                    width: width,
                    height: height,
                    raw: data.imagedata,
                    timestamp: data.timestamp || Date.now()
                });
            }
        });
        this.send('feed', {
            feed: 'depth-key'
        });
    }
    startRGBD(callback) {
        if (callback) // Set up frame handler to process RGBD frames
        this.messageHandlers.set('frame', (data)=>{
            // Only process frames with name 'rgbd'
            if (data.name === 'rgbd' && data.imagedata) {
                // Create a canvas to convert image data to a data URL
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const { width: width, height: height } = data.imagedata;
                canvas.width = width;
                canvas.height = height;
                // Create ImageData object from the raw data
                const imgData = new ImageData(new Uint8ClampedArray(data.imagedata.data), width, height);
                // Put the image data on the canvas
                ctx.putImageData(imgData, 0, 0);
                // Convert to data URL for easy display
                const src = canvas.toDataURL('image/jpeg');
                // Call the user callback with processed frame
                callback({
                    src: src,
                    width: width,
                    height: height,
                    raw: data.imagedata,
                    timestamp: data.timestamp || Date.now()
                });
            }
        });
        this.send('feed', {
            feed: 'rgbd'
        });
    }
    startMultiFrame(frames, callback) {
        if (callback) // Set up handler to process multi-frame data
        this.messageHandlers.set('multiFrame', (data)=>{
            if (data && data.frames) {
                // Process each frame based on its type
                const processedFrames = {};
                // Process each frame in the multiframe data
                Object.entries(data.frames).forEach(([type, frameData])=>{
                    if (frameData.imagedata) {
                        // For image-based frames, convert to data URL
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const { width: width, height: height } = frameData.imagedata;
                        canvas.width = width;
                        canvas.height = height;
                        // Create ImageData object from the raw data
                        const imgData = new ImageData(new Uint8ClampedArray(frameData.imagedata.data), width, height);
                        // Put the image data on the canvas
                        ctx.putImageData(imgData, 0, 0);
                        // Convert to data URL
                        processedFrames[type] = {
                            src: canvas.toDataURL('image/jpeg'),
                            width: width,
                            height: height,
                            raw: frameData.imagedata
                        };
                    } else // For non-image data (like body tracking), pass through
                    processedFrames[type] = frameData;
                });
                // Call the user callback with processed frames
                callback({
                    frames: processedFrames,
                    timestamp: data.timestamp || Date.now()
                });
            }
        });
        this.send('multi', frames);
    }
    // Stop all feeds
    stopAll() {
        this.send('feed', {
            feed: 'stop-all'
        });
    }
    // Clean up
    close() {
        this.peer.close();
        this.messageHandlers.clear();
        this.state = null;
    }
}



console.log('You are running Kinectron API version 0.3.9');
/**
 * Legacy Kinectron class for backward compatibility
 */ class $6efb768676258e07$export$9369465eba7492ab {
    /**
   * @param {string|Object} arg1 - Network configuration or host address
   * @param {Object} [arg2] - Additional peer configuration
   */ constructor(arg1, arg2){
        // Merge configurations for backward compatibility
        const config = typeof arg1 === 'string' ? {
            ...(0, $792b08ff1dfd8e83$export$d9abfac191d6fb15),
            host: arg1,
            ...arg2
        } : {
            ...(0, $792b08ff1dfd8e83$export$d9abfac191d6fb15),
            ...arg1
        };
        this.peerConnection = new (0, $4d767ee87242f6c3$export$d84cf184fade0488)(config);
        this.feed = null;
        this.state = null;
        // Set up state change handler
        this.peerConnection.on('stateChange', (data)=>{
            this.state = data.to;
            if (data.to === (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.ERROR) console.error('Connection error:', data.details);
        });
        // Set up error handler
        this.peerConnection.on('error', (error)=>{
            console.error('Kinectron error:', error);
        });
    }
    /**
   * Make peer connection
   */ makeConnection() {
        // No need to implement - handled by PeerConnection constructor
        console.warn('makeConnection() is deprecated - connection is now automatic');
    }
    /**
   * Set Kinect type
   * @param {string} kinectType - Type of Kinect ('azure' or 'windows')
   */ setKinectType(kinectType) {
        if (this.state !== (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED) {
            console.warn('Cannot set Kinect type: not connected');
            return;
        }
        this.peerConnection.send('setkinect', kinectType);
    }
    /**
   * Register event handler
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */ on(event, callback) {
        this.peerConnection.on(event, callback);
    }
    /**
   * Start color feed
   * @param {Function} [callback] - Frame callback
   */ startColor(callback) {
        if (callback) this.peerConnection.on('frame', callback);
        if (this.state !== (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED) {
            console.warn('Cannot start color feed: not connected');
            return;
        }
        this.feed = 'color';
        this.peerConnection.send('feed', {
            feed: this.feed
        });
    }
    /**
   * Start depth feed
   * @param {Function} [callback] - Frame callback
   */ startDepth(callback) {
        if (callback) this.peerConnection.on('frame', callback);
        if (this.state !== (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED) {
            console.warn('Cannot start depth feed: not connected');
            return;
        }
        this.feed = 'depth';
        this.peerConnection.send('feed', {
            feed: this.feed
        });
    }
    /**
   * Start raw depth feed
   * @param {Function} [callback] - Frame callback
   */ startRawDepth(callback) {
        if (callback) this.peerConnection.on('rawDepth', callback);
        if (this.state !== (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED) {
            console.warn('Cannot start raw depth feed: not connected');
            return;
        }
        this.feed = 'raw-depth';
        this.peerConnection.send('feed', {
            feed: this.feed
        });
    }
    /**
   * Start body tracking
   * @param {Function} [callback] - Body frame callback
   */ startTrackedBodies(callback) {
        if (callback) this.peerConnection.on('trackedBodyFrame', callback);
        if (this.state !== (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED) {
            console.warn('Cannot start body tracking: not connected');
            return;
        }
        this.feed = 'body';
        this.peerConnection.send('feed', {
            feed: this.feed
        });
    }
    /**
   * Stop all feeds
   */ stopAll() {
        if (this.state !== (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED) {
            console.warn('Cannot stop feeds: not connected');
            return;
        }
        this.feed = null;
        this.peerConnection.send('feed', {
            feed: 'stop-all'
        });
    }
    /**
   * Get current state
   * @returns {Object} Current state information
   */ getState() {
        return this.peerConnection.getState();
    }
    /**
   * Check if connected
   * @returns {boolean} Whether peer is connected
   */ isConnected() {
        return this.state === (0, $b0904cb4b6312074$export$575c13c422fb6041).STATES.CONNECTED;
    }
    /**
   * Close connection
   */ close() {
        this.feed = null;
        this.state = null;
        this.peerConnection.close();
    }
}
// For backward compatibility, also attach to window
if (typeof window !== 'undefined') window.Kinectron = $6efb768676258e07$export$9369465eba7492ab;

})();
//# sourceMappingURL=index.js.map
