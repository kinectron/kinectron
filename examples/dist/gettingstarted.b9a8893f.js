!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Kinectron = t();
}(this, function() {
    "use strict";
    function e(e, t) {
        return t.forEach(function(t) {
            t && "string" != typeof t && !Array.isArray(t) && Object.keys(t).forEach(function(n) {
                if ("default" !== n && !(n in e)) {
                    var r = Object.getOwnPropertyDescriptor(t, n);
                    Object.defineProperty(e, n, r.get ? r : {
                        enumerable: !0,
                        get: function() {
                            return t[n];
                        }
                    });
                }
            });
        }), Object.freeze(e);
    }
    class t {
        constructor(){
            this.encoder = new TextEncoder, this._pieces = [], this._parts = [];
        }
        append_buffer(e) {
            this.flush(), this._parts.push(e);
        }
        append(e) {
            this._pieces.push(e);
        }
        flush() {
            if (this._pieces.length > 0) {
                const e = new Uint8Array(this._pieces);
                this._parts.push(e), this._pieces = [];
            }
        }
        toArrayBuffer() {
            const e = [];
            for (const t of this._parts)e.push(t);
            return function(e) {
                let t = 0;
                for (const n of e)t += n.byteLength;
                const n = new Uint8Array(t);
                let r = 0;
                for (const t of e){
                    const e = new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
                    n.set(e, r), r += t.byteLength;
                }
                return n;
            }(e).buffer;
        }
    }
    function n(e) {
        return new i(e).unpack();
    }
    function r(e) {
        const t = new s, n = t.pack(e);
        return n instanceof Promise ? n.then(()=>t.getBuffer()) : t.getBuffer();
    }
    class i {
        constructor(e){
            this.index = 0, this.dataBuffer = e, this.dataView = new Uint8Array(this.dataBuffer), this.length = this.dataBuffer.byteLength;
        }
        unpack() {
            const e = this.unpack_uint8();
            if (e < 128) return e;
            if ((224 ^ e) < 32) return (224 ^ e) - 32;
            let t;
            if ((t = 160 ^ e) <= 15) return this.unpack_raw(t);
            if ((t = 176 ^ e) <= 15) return this.unpack_string(t);
            if ((t = 144 ^ e) <= 15) return this.unpack_array(t);
            if ((t = 128 ^ e) <= 15) return this.unpack_map(t);
            switch(e){
                case 192:
                    return null;
                case 193:
                case 212:
                case 213:
                case 214:
                case 215:
                    return;
                case 194:
                    return !1;
                case 195:
                    return !0;
                case 202:
                    return this.unpack_float();
                case 203:
                    return this.unpack_double();
                case 204:
                    return this.unpack_uint8();
                case 205:
                    return this.unpack_uint16();
                case 206:
                    return this.unpack_uint32();
                case 207:
                    return this.unpack_uint64();
                case 208:
                    return this.unpack_int8();
                case 209:
                    return this.unpack_int16();
                case 210:
                    return this.unpack_int32();
                case 211:
                    return this.unpack_int64();
                case 216:
                    return t = this.unpack_uint16(), this.unpack_string(t);
                case 217:
                    return t = this.unpack_uint32(), this.unpack_string(t);
                case 218:
                    return t = this.unpack_uint16(), this.unpack_raw(t);
                case 219:
                    return t = this.unpack_uint32(), this.unpack_raw(t);
                case 220:
                    return t = this.unpack_uint16(), this.unpack_array(t);
                case 221:
                    return t = this.unpack_uint32(), this.unpack_array(t);
                case 222:
                    return t = this.unpack_uint16(), this.unpack_map(t);
                case 223:
                    return t = this.unpack_uint32(), this.unpack_map(t);
            }
        }
        unpack_uint8() {
            const e = 255 & this.dataView[this.index];
            return this.index++, e;
        }
        unpack_uint16() {
            const e = this.read(2), t = 256 * (255 & e[0]) + (255 & e[1]);
            return this.index += 2, t;
        }
        unpack_uint32() {
            const e = this.read(4), t = 256 * (256 * (256 * e[0] + e[1]) + e[2]) + e[3];
            return this.index += 4, t;
        }
        unpack_uint64() {
            const e = this.read(8), t = 256 * (256 * (256 * (256 * (256 * (256 * (256 * e[0] + e[1]) + e[2]) + e[3]) + e[4]) + e[5]) + e[6]) + e[7];
            return this.index += 8, t;
        }
        unpack_int8() {
            const e = this.unpack_uint8();
            return e < 128 ? e : e - 256;
        }
        unpack_int16() {
            const e = this.unpack_uint16();
            return e < 32768 ? e : e - 65536;
        }
        unpack_int32() {
            const e = this.unpack_uint32();
            return e < 2 ** 31 ? e : e - 2 ** 32;
        }
        unpack_int64() {
            const e = this.unpack_uint64();
            return e < 2 ** 63 ? e : e - 2 ** 64;
        }
        unpack_raw(e) {
            if (this.length < this.index + e) throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${e} ${this.length}`);
            const t = this.dataBuffer.slice(this.index, this.index + e);
            return this.index += e, t;
        }
        unpack_string(e) {
            const t = this.read(e);
            let n, r, i = 0, s = "";
            for(; i < e;)n = t[i], n < 160 ? (r = n, i++) : (192 ^ n) < 32 ? (r = (31 & n) << 6 | 63 & t[i + 1], i += 2) : (224 ^ n) < 16 ? (r = (15 & n) << 12 | (63 & t[i + 1]) << 6 | 63 & t[i + 2], i += 3) : (r = (7 & n) << 18 | (63 & t[i + 1]) << 12 | (63 & t[i + 2]) << 6 | 63 & t[i + 3], i += 4), s += String.fromCodePoint(r);
            return this.index += e, s;
        }
        unpack_array(e) {
            const t = new Array(e);
            for(let n = 0; n < e; n++)t[n] = this.unpack();
            return t;
        }
        unpack_map(e) {
            const t = {};
            for(let n = 0; n < e; n++)t[this.unpack()] = this.unpack();
            return t;
        }
        unpack_float() {
            const e = this.unpack_uint32();
            return (0 === e >> 31 ? 1 : -1) * (8388607 & e | 8388608) * 2 ** ((e >> 23 & 255) - 127 - 23);
        }
        unpack_double() {
            const e = this.unpack_uint32(), t = (e >> 20 & 2047) - 1023;
            return (0 === e >> 31 ? 1 : -1) * ((1048575 & e | 1048576) * 2 ** (t - 20) + this.unpack_uint32() * 2 ** (t - 52));
        }
        read(e) {
            const t = this.index;
            if (t + e <= this.length) return this.dataView.subarray(t, t + e);
            throw new Error("BinaryPackFailure: read index out of range");
        }
    }
    class s {
        getBuffer() {
            return this._bufferBuilder.toArrayBuffer();
        }
        pack(e) {
            if ("string" == typeof e) this.pack_string(e);
            else if ("number" == typeof e) Math.floor(e) === e ? this.pack_integer(e) : this.pack_double(e);
            else if ("boolean" == typeof e) !0 === e ? this._bufferBuilder.append(195) : !1 === e && this._bufferBuilder.append(194);
            else if (void 0 === e) this._bufferBuilder.append(192);
            else {
                if ("object" != typeof e) throw new Error(`Type "${typeof e}" not yet supported`);
                if (null === e) this._bufferBuilder.append(192);
                else {
                    const t = e.constructor;
                    if (e instanceof Array) {
                        const t = this.pack_array(e);
                        if (t instanceof Promise) return t.then(()=>this._bufferBuilder.flush());
                    } else if (e instanceof ArrayBuffer) this.pack_bin(new Uint8Array(e));
                    else if ("BYTES_PER_ELEMENT" in e) {
                        const t = e;
                        this.pack_bin(new Uint8Array(t.buffer, t.byteOffset, t.byteLength));
                    } else if (e instanceof Date) this.pack_string(e.toString());
                    else {
                        if (e instanceof Blob) return e.arrayBuffer().then((e)=>{
                            this.pack_bin(new Uint8Array(e)), this._bufferBuilder.flush();
                        });
                        if (t != Object && !t.toString().startsWith("class")) throw new Error(`Type "${t.toString()}" not yet supported`);
                        {
                            const t = this.pack_object(e);
                            if (t instanceof Promise) return t.then(()=>this._bufferBuilder.flush());
                        }
                    }
                }
            }
            this._bufferBuilder.flush();
        }
        pack_bin(e) {
            const t = e.length;
            if (t <= 15) this.pack_uint8(160 + t);
            else if (t <= 65535) this._bufferBuilder.append(218), this.pack_uint16(t);
            else {
                if (!(t <= 4294967295)) throw new Error("Invalid length");
                this._bufferBuilder.append(219), this.pack_uint32(t);
            }
            this._bufferBuilder.append_buffer(e);
        }
        pack_string(e) {
            const t = this._textEncoder.encode(e), n = t.length;
            if (n <= 15) this.pack_uint8(176 + n);
            else if (n <= 65535) this._bufferBuilder.append(216), this.pack_uint16(n);
            else {
                if (!(n <= 4294967295)) throw new Error("Invalid length");
                this._bufferBuilder.append(217), this.pack_uint32(n);
            }
            this._bufferBuilder.append_buffer(t);
        }
        pack_array(e) {
            const t = e.length;
            if (t <= 15) this.pack_uint8(144 + t);
            else if (t <= 65535) this._bufferBuilder.append(220), this.pack_uint16(t);
            else {
                if (!(t <= 4294967295)) throw new Error("Invalid length");
                this._bufferBuilder.append(221), this.pack_uint32(t);
            }
            const n = (r)=>{
                if (r < t) {
                    const t = this.pack(e[r]);
                    return t instanceof Promise ? t.then(()=>n(r + 1)) : n(r + 1);
                }
            };
            return n(0);
        }
        pack_integer(e) {
            if (e >= -32 && e <= 127) this._bufferBuilder.append(255 & e);
            else if (e >= 0 && e <= 255) this._bufferBuilder.append(204), this.pack_uint8(e);
            else if (e >= -128 && e <= 127) this._bufferBuilder.append(208), this.pack_int8(e);
            else if (e >= 0 && e <= 65535) this._bufferBuilder.append(205), this.pack_uint16(e);
            else if (e >= -32768 && e <= 32767) this._bufferBuilder.append(209), this.pack_int16(e);
            else if (e >= 0 && e <= 4294967295) this._bufferBuilder.append(206), this.pack_uint32(e);
            else if (e >= -2147483648 && e <= 2147483647) this._bufferBuilder.append(210), this.pack_int32(e);
            else if (e >= -9223372036854776000 && e <= 0x8000000000000000) this._bufferBuilder.append(211), this.pack_int64(e);
            else {
                if (!(e >= 0 && e <= 0x10000000000000000)) throw new Error("Invalid integer");
                this._bufferBuilder.append(207), this.pack_uint64(e);
            }
        }
        pack_double(e) {
            let t = 0;
            e < 0 && (t = 1, e = -e);
            const n = Math.floor(Math.log(e) / Math.LN2), r = e / 2 ** n - 1, i = Math.floor(r * 2 ** 52), s = 2 ** 32, o = t << 31 | n + 1023 << 20 | i / s & 1048575, a = i % s;
            this._bufferBuilder.append(203), this.pack_int32(o), this.pack_int32(a);
        }
        pack_object(e) {
            const t = Object.keys(e), n = t.length;
            if (n <= 15) this.pack_uint8(128 + n);
            else if (n <= 65535) this._bufferBuilder.append(222), this.pack_uint16(n);
            else {
                if (!(n <= 4294967295)) throw new Error("Invalid length");
                this._bufferBuilder.append(223), this.pack_uint32(n);
            }
            const r = (n)=>{
                if (n < t.length) {
                    const i = t[n];
                    if (e.hasOwnProperty(i)) {
                        this.pack(i);
                        const t = this.pack(e[i]);
                        if (t instanceof Promise) return t.then(()=>r(n + 1));
                    }
                    return r(n + 1);
                }
            };
            return r(0);
        }
        pack_uint8(e) {
            this._bufferBuilder.append(e);
        }
        pack_uint16(e) {
            this._bufferBuilder.append(e >> 8), this._bufferBuilder.append(255 & e);
        }
        pack_uint32(e) {
            const t = 4294967295 & e;
            this._bufferBuilder.append((4278190080 & t) >>> 24), this._bufferBuilder.append((16711680 & t) >>> 16), this._bufferBuilder.append((65280 & t) >>> 8), this._bufferBuilder.append(255 & t);
        }
        pack_uint64(e) {
            const t = e / 2 ** 32, n = e % 2 ** 32;
            this._bufferBuilder.append((4278190080 & t) >>> 24), this._bufferBuilder.append((16711680 & t) >>> 16), this._bufferBuilder.append((65280 & t) >>> 8), this._bufferBuilder.append(255 & t), this._bufferBuilder.append((4278190080 & n) >>> 24), this._bufferBuilder.append((16711680 & n) >>> 16), this._bufferBuilder.append((65280 & n) >>> 8), this._bufferBuilder.append(255 & n);
        }
        pack_int8(e) {
            this._bufferBuilder.append(255 & e);
        }
        pack_int16(e) {
            this._bufferBuilder.append((65280 & e) >> 8), this._bufferBuilder.append(255 & e);
        }
        pack_int32(e) {
            this._bufferBuilder.append(e >>> 24 & 255), this._bufferBuilder.append((16711680 & e) >>> 16), this._bufferBuilder.append((65280 & e) >>> 8), this._bufferBuilder.append(255 & e);
        }
        pack_int64(e) {
            const t = Math.floor(e / 2 ** 32), n = e % 2 ** 32;
            this._bufferBuilder.append((4278190080 & t) >>> 24), this._bufferBuilder.append((16711680 & t) >>> 16), this._bufferBuilder.append((65280 & t) >>> 8), this._bufferBuilder.append(255 & t), this._bufferBuilder.append((4278190080 & n) >>> 24), this._bufferBuilder.append((16711680 & n) >>> 16), this._bufferBuilder.append((65280 & n) >>> 8), this._bufferBuilder.append(255 & n);
        }
        constructor(){
            this._bufferBuilder = new t, this._textEncoder = new TextEncoder;
        }
    }
    let o = !0, a = !0;
    function c(e, t, n) {
        const r = e.match(t);
        return r && r.length >= n && parseFloat(r[n], 10);
    }
    function d(e, t, n) {
        if (!e.RTCPeerConnection) return;
        const r = e.RTCPeerConnection.prototype, i = r.addEventListener;
        r.addEventListener = function(e, r) {
            if (e !== t) return i.apply(this, arguments);
            const s = (e)=>{
                const t = n(e);
                t && (r.handleEvent ? r.handleEvent(t) : r(t));
            };
            return this._eventMap = this._eventMap || {}, this._eventMap[t] || (this._eventMap[t] = new Map), this._eventMap[t].set(r, s), i.apply(this, [
                e,
                s
            ]);
        };
        const s = r.removeEventListener;
        r.removeEventListener = function(e, n) {
            if (e !== t || !this._eventMap || !this._eventMap[t]) return s.apply(this, arguments);
            if (!this._eventMap[t].has(n)) return s.apply(this, arguments);
            const r = this._eventMap[t].get(n);
            return this._eventMap[t].delete(n), 0 === this._eventMap[t].size && delete this._eventMap[t], 0 === Object.keys(this._eventMap).length && delete this._eventMap, s.apply(this, [
                e,
                r
            ]);
        }, Object.defineProperty(r, "on" + t, {
            get () {
                return this["_on" + t];
            },
            set (e) {
                this["_on" + t] && (this.removeEventListener(t, this["_on" + t]), delete this["_on" + t]), e && this.addEventListener(t, this["_on" + t] = e);
            },
            enumerable: !0,
            configurable: !0
        });
    }
    function h(e) {
        return "boolean" != typeof e ? new Error("Argument type: " + typeof e + ". Please use a boolean.") : (o = e, e ? "adapter.js logging disabled" : "adapter.js logging enabled");
    }
    function p(e) {
        return "boolean" != typeof e ? new Error("Argument type: " + typeof e + ". Please use a boolean.") : (a = !e, "adapter.js deprecation warnings " + (e ? "disabled" : "enabled"));
    }
    function l() {
        if ("object" == typeof window) {
            if (o) return;
            "undefined" != typeof console && "function" == typeof console.log && console.log.apply(console, arguments);
        }
    }
    function u(e, t) {
        a && console.warn(e + " is deprecated, please use " + t + " instead.");
    }
    function f(e) {
        return "[object Object]" === Object.prototype.toString.call(e);
    }
    function m(e) {
        return f(e) ? Object.keys(e).reduce(function(t, n) {
            const r = f(e[n]), i = r ? m(e[n]) : e[n], s = r && !Object.keys(i).length;
            return void 0 === i || s ? t : Object.assign(t, {
                [n]: i
            });
        }, {}) : e;
    }
    function g(e, t, n) {
        t && !n.has(t.id) && (n.set(t.id, t), Object.keys(t).forEach((r)=>{
            r.endsWith("Id") ? g(e, e.get(t[r]), n) : r.endsWith("Ids") && t[r].forEach((t)=>{
                g(e, e.get(t), n);
            });
        }));
    }
    function y(e, t, n) {
        const r = n ? "outbound-rtp" : "inbound-rtp", i = new Map;
        if (null === t) return i;
        const s = [];
        return e.forEach((e)=>{
            "track" === e.type && e.trackIdentifier === t.id && s.push(e);
        }), s.forEach((t)=>{
            e.forEach((n)=>{
                n.type === r && n.trackId === t.id && g(e, n, i);
            });
        }), i;
    }
    const C = l;
    function _(e, t) {
        const n = e && e.navigator;
        if (!n.mediaDevices) return;
        const r = function(e) {
            if ("object" != typeof e || e.mandatory || e.optional) return e;
            const t = {};
            return Object.keys(e).forEach((n)=>{
                if ("require" === n || "advanced" === n || "mediaSource" === n) return;
                const r = "object" == typeof e[n] ? e[n] : {
                    ideal: e[n]
                };
                void 0 !== r.exact && "number" == typeof r.exact && (r.min = r.max = r.exact);
                const i = function(e, t) {
                    return e ? e + t.charAt(0).toUpperCase() + t.slice(1) : "deviceId" === t ? "sourceId" : t;
                };
                if (void 0 !== r.ideal) {
                    t.optional = t.optional || [];
                    let e = {};
                    "number" == typeof r.ideal ? (e[i("min", n)] = r.ideal, t.optional.push(e), e = {}, e[i("max", n)] = r.ideal, t.optional.push(e)) : (e[i("", n)] = r.ideal, t.optional.push(e));
                }
                void 0 !== r.exact && "number" != typeof r.exact ? (t.mandatory = t.mandatory || {}, t.mandatory[i("", n)] = r.exact) : [
                    "min",
                    "max"
                ].forEach((e)=>{
                    void 0 !== r[e] && (t.mandatory = t.mandatory || {}, t.mandatory[i(e, n)] = r[e]);
                });
            }), e.advanced && (t.optional = (t.optional || []).concat(e.advanced)), t;
        }, i = function(e, i) {
            if (t.version >= 61) return i(e);
            if ((e = JSON.parse(JSON.stringify(e))) && "object" == typeof e.audio) {
                const t = function(e, t, n) {
                    t in e && !(n in e) && (e[n] = e[t], delete e[t]);
                };
                t((e = JSON.parse(JSON.stringify(e))).audio, "autoGainControl", "googAutoGainControl"), t(e.audio, "noiseSuppression", "googNoiseSuppression"), e.audio = r(e.audio);
            }
            if (e && "object" == typeof e.video) {
                let s = e.video.facingMode;
                s = s && ("object" == typeof s ? s : {
                    ideal: s
                });
                const o = t.version < 66;
                if (s && ("user" === s.exact || "environment" === s.exact || "user" === s.ideal || "environment" === s.ideal) && (!n.mediaDevices.getSupportedConstraints || !n.mediaDevices.getSupportedConstraints().facingMode || o)) {
                    let t;
                    if (delete e.video.facingMode, "environment" === s.exact || "environment" === s.ideal ? t = [
                        "back",
                        "rear"
                    ] : "user" !== s.exact && "user" !== s.ideal || (t = [
                        "front"
                    ]), t) return n.mediaDevices.enumerateDevices().then((n)=>{
                        let o = (n = n.filter((e)=>"videoinput" === e.kind)).find((e)=>t.some((t)=>e.label.toLowerCase().includes(t)));
                        return !o && n.length && t.includes("back") && (o = n[n.length - 1]), o && (e.video.deviceId = s.exact ? {
                            exact: o.deviceId
                        } : {
                            ideal: o.deviceId
                        }), e.video = r(e.video), C("chrome: " + JSON.stringify(e)), i(e);
                    });
                }
                e.video = r(e.video);
            }
            return C("chrome: " + JSON.stringify(e)), i(e);
        }, s = function(e) {
            return t.version >= 64 ? e : {
                name: ({
                    PermissionDeniedError: "NotAllowedError",
                    PermissionDismissedError: "NotAllowedError",
                    InvalidStateError: "NotAllowedError",
                    DevicesNotFoundError: "NotFoundError",
                    ConstraintNotSatisfiedError: "OverconstrainedError",
                    TrackStartError: "NotReadableError",
                    MediaDeviceFailedDueToShutdown: "NotAllowedError",
                    MediaDeviceKillSwitchOn: "NotAllowedError",
                    TabCaptureError: "AbortError",
                    ScreenCaptureError: "AbortError",
                    DeviceCaptureError: "AbortError"
                })[e.name] || e.name,
                message: e.message,
                constraint: e.constraint || e.constraintName,
                toString () {
                    return this.name + (this.message && ": ") + this.message;
                }
            };
        };
        if (n.getUserMedia = (function(e, t, r) {
            i(e, (e)=>{
                n.webkitGetUserMedia(e, t, (e)=>{
                    r && r(s(e));
                });
            });
        }).bind(n), n.mediaDevices.getUserMedia) {
            const e = n.mediaDevices.getUserMedia.bind(n.mediaDevices);
            n.mediaDevices.getUserMedia = function(t) {
                return i(t, (t)=>e(t).then((e)=>{
                        if (t.audio && !e.getAudioTracks().length || t.video && !e.getVideoTracks().length) throw e.getTracks().forEach((e)=>{
                            e.stop();
                        }), new DOMException("", "NotFoundError");
                        return e;
                    }, (e)=>Promise.reject(s(e))));
            };
        }
    }
    function v(e) {
        e.MediaStream = e.MediaStream || e.webkitMediaStream;
    }
    function b(e) {
        if ("object" == typeof e && e.RTCPeerConnection && !("ontrack" in e.RTCPeerConnection.prototype)) {
            Object.defineProperty(e.RTCPeerConnection.prototype, "ontrack", {
                get () {
                    return this._ontrack;
                },
                set (e) {
                    this._ontrack && this.removeEventListener("track", this._ontrack), this.addEventListener("track", this._ontrack = e);
                },
                enumerable: !0,
                configurable: !0
            });
            const t = e.RTCPeerConnection.prototype.setRemoteDescription;
            e.RTCPeerConnection.prototype.setRemoteDescription = function() {
                return this._ontrackpoly || (this._ontrackpoly = (t)=>{
                    t.stream.addEventListener("addtrack", (n)=>{
                        let r;
                        r = e.RTCPeerConnection.prototype.getReceivers ? this.getReceivers().find((e)=>e.track && e.track.id === n.track.id) : {
                            track: n.track
                        };
                        const i = new Event("track");
                        i.track = n.track, i.receiver = r, i.transceiver = {
                            receiver: r
                        }, i.streams = [
                            t.stream
                        ], this.dispatchEvent(i);
                    }), t.stream.getTracks().forEach((n)=>{
                        let r;
                        r = e.RTCPeerConnection.prototype.getReceivers ? this.getReceivers().find((e)=>e.track && e.track.id === n.id) : {
                            track: n
                        };
                        const i = new Event("track");
                        i.track = n, i.receiver = r, i.transceiver = {
                            receiver: r
                        }, i.streams = [
                            t.stream
                        ], this.dispatchEvent(i);
                    });
                }, this.addEventListener("addstream", this._ontrackpoly)), t.apply(this, arguments);
            };
        } else d(e, "track", (e)=>(e.transceiver || Object.defineProperty(e, "transceiver", {
                value: {
                    receiver: e.receiver
                }
            }), e));
    }
    function T(e) {
        if ("object" == typeof e && e.RTCPeerConnection && !("getSenders" in e.RTCPeerConnection.prototype) && "createDTMFSender" in e.RTCPeerConnection.prototype) {
            const t = function(e, t) {
                return {
                    track: t,
                    get dtmf () {
                        return void 0 === this._dtmf && ("audio" === t.kind ? this._dtmf = e.createDTMFSender(t) : this._dtmf = null), this._dtmf;
                    },
                    _pc: e
                };
            };
            if (!e.RTCPeerConnection.prototype.getSenders) {
                e.RTCPeerConnection.prototype.getSenders = function() {
                    return this._senders = this._senders || [], this._senders.slice();
                };
                const n = e.RTCPeerConnection.prototype.addTrack;
                e.RTCPeerConnection.prototype.addTrack = function(e, r) {
                    let i = n.apply(this, arguments);
                    return i || (i = t(this, e), this._senders.push(i)), i;
                };
                const r = e.RTCPeerConnection.prototype.removeTrack;
                e.RTCPeerConnection.prototype.removeTrack = function(e) {
                    r.apply(this, arguments);
                    const t = this._senders.indexOf(e);
                    -1 !== t && this._senders.splice(t, 1);
                };
            }
            const n = e.RTCPeerConnection.prototype.addStream;
            e.RTCPeerConnection.prototype.addStream = function(e) {
                this._senders = this._senders || [], n.apply(this, [
                    e
                ]), e.getTracks().forEach((e)=>{
                    this._senders.push(t(this, e));
                });
            };
            const r = e.RTCPeerConnection.prototype.removeStream;
            e.RTCPeerConnection.prototype.removeStream = function(e) {
                this._senders = this._senders || [], r.apply(this, [
                    e
                ]), e.getTracks().forEach((e)=>{
                    const t = this._senders.find((t)=>t.track === e);
                    t && this._senders.splice(this._senders.indexOf(t), 1);
                });
            };
        } else if ("object" == typeof e && e.RTCPeerConnection && "getSenders" in e.RTCPeerConnection.prototype && "createDTMFSender" in e.RTCPeerConnection.prototype && e.RTCRtpSender && !("dtmf" in e.RTCRtpSender.prototype)) {
            const t = e.RTCPeerConnection.prototype.getSenders;
            e.RTCPeerConnection.prototype.getSenders = function() {
                const e = t.apply(this, []);
                return e.forEach((e)=>e._pc = this), e;
            }, Object.defineProperty(e.RTCRtpSender.prototype, "dtmf", {
                get () {
                    return void 0 === this._dtmf && ("audio" === this.track.kind ? this._dtmf = this._pc.createDTMFSender(this.track) : this._dtmf = null), this._dtmf;
                }
            });
        }
    }
    function S(e) {
        if (!("object" == typeof e && e.RTCPeerConnection && e.RTCRtpSender && e.RTCRtpReceiver)) return;
        if (!("getStats" in e.RTCRtpSender.prototype)) {
            const t = e.RTCPeerConnection.prototype.getSenders;
            t && (e.RTCPeerConnection.prototype.getSenders = function() {
                const e = t.apply(this, []);
                return e.forEach((e)=>e._pc = this), e;
            });
            const n = e.RTCPeerConnection.prototype.addTrack;
            n && (e.RTCPeerConnection.prototype.addTrack = function() {
                const e = n.apply(this, arguments);
                return e._pc = this, e;
            }), e.RTCRtpSender.prototype.getStats = function() {
                const e = this;
                return this._pc.getStats().then((t)=>y(t, e.track, !0));
            };
        }
        if (!("getStats" in e.RTCRtpReceiver.prototype)) {
            const t = e.RTCPeerConnection.prototype.getReceivers;
            t && (e.RTCPeerConnection.prototype.getReceivers = function() {
                const e = t.apply(this, []);
                return e.forEach((e)=>e._pc = this), e;
            }), d(e, "track", (e)=>(e.receiver._pc = e.srcElement, e)), e.RTCRtpReceiver.prototype.getStats = function() {
                const e = this;
                return this._pc.getStats().then((t)=>y(t, e.track, !1));
            };
        }
        if (!("getStats" in e.RTCRtpSender.prototype) || !("getStats" in e.RTCRtpReceiver.prototype)) return;
        const t = e.RTCPeerConnection.prototype.getStats;
        e.RTCPeerConnection.prototype.getStats = function() {
            if (arguments.length > 0 && arguments[0] instanceof e.MediaStreamTrack) {
                const e = arguments[0];
                let t, n, r;
                return this.getSenders().forEach((n)=>{
                    n.track === e && (t ? r = !0 : t = n);
                }), this.getReceivers().forEach((t)=>(t.track === e && (n ? r = !0 : n = t), t.track === e)), r || t && n ? Promise.reject(new DOMException("There are more than one sender or receiver for the track.", "InvalidAccessError")) : t ? t.getStats() : n ? n.getStats() : Promise.reject(new DOMException("There is no sender or receiver for the track.", "InvalidAccessError"));
            }
            return t.apply(this, arguments);
        };
    }
    function k(e) {
        e.RTCPeerConnection.prototype.getLocalStreams = function() {
            return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, Object.keys(this._shimmedLocalStreams).map((e)=>this._shimmedLocalStreams[e][0]);
        };
        const t = e.RTCPeerConnection.prototype.addTrack;
        e.RTCPeerConnection.prototype.addTrack = function(e, n) {
            if (!n) return t.apply(this, arguments);
            this._shimmedLocalStreams = this._shimmedLocalStreams || {};
            const r = t.apply(this, arguments);
            return this._shimmedLocalStreams[n.id] ? -1 === this._shimmedLocalStreams[n.id].indexOf(r) && this._shimmedLocalStreams[n.id].push(r) : this._shimmedLocalStreams[n.id] = [
                n,
                r
            ], r;
        };
        const n = e.RTCPeerConnection.prototype.addStream;
        e.RTCPeerConnection.prototype.addStream = function(e) {
            this._shimmedLocalStreams = this._shimmedLocalStreams || {}, e.getTracks().forEach((e)=>{
                if (this.getSenders().find((t)=>t.track === e)) throw new DOMException("Track already exists.", "InvalidAccessError");
            });
            const t = this.getSenders();
            n.apply(this, arguments);
            const r = this.getSenders().filter((e)=>-1 === t.indexOf(e));
            this._shimmedLocalStreams[e.id] = [
                e
            ].concat(r);
        };
        const r = e.RTCPeerConnection.prototype.removeStream;
        e.RTCPeerConnection.prototype.removeStream = function(e) {
            return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, delete this._shimmedLocalStreams[e.id], r.apply(this, arguments);
        };
        const i = e.RTCPeerConnection.prototype.removeTrack;
        e.RTCPeerConnection.prototype.removeTrack = function(e) {
            return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, e && Object.keys(this._shimmedLocalStreams).forEach((t)=>{
                const n = this._shimmedLocalStreams[t].indexOf(e);
                -1 !== n && this._shimmedLocalStreams[t].splice(n, 1), 1 === this._shimmedLocalStreams[t].length && delete this._shimmedLocalStreams[t];
            }), i.apply(this, arguments);
        };
    }
    function w(e, t) {
        if (!e.RTCPeerConnection) return;
        if (e.RTCPeerConnection.prototype.addTrack && t.version >= 65) return k(e);
        const n = e.RTCPeerConnection.prototype.getLocalStreams;
        e.RTCPeerConnection.prototype.getLocalStreams = function() {
            const e = n.apply(this);
            return this._reverseStreams = this._reverseStreams || {}, e.map((e)=>this._reverseStreams[e.id]);
        };
        const r = e.RTCPeerConnection.prototype.addStream;
        e.RTCPeerConnection.prototype.addStream = function(t) {
            if (this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {}, t.getTracks().forEach((e)=>{
                if (this.getSenders().find((t)=>t.track === e)) throw new DOMException("Track already exists.", "InvalidAccessError");
            }), !this._reverseStreams[t.id]) {
                const n = new e.MediaStream(t.getTracks());
                this._streams[t.id] = n, this._reverseStreams[n.id] = t, t = n;
            }
            r.apply(this, [
                t
            ]);
        };
        const i = e.RTCPeerConnection.prototype.removeStream;
        function s(e, t) {
            let n = t.sdp;
            return Object.keys(e._reverseStreams || []).forEach((t)=>{
                const r = e._reverseStreams[t], i = e._streams[r.id];
                n = n.replace(new RegExp(i.id, "g"), r.id);
            }), new RTCSessionDescription({
                type: t.type,
                sdp: n
            });
        }
        e.RTCPeerConnection.prototype.removeStream = function(e) {
            this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {}, i.apply(this, [
                this._streams[e.id] || e
            ]), delete this._reverseStreams[this._streams[e.id] ? this._streams[e.id].id : e.id], delete this._streams[e.id];
        }, e.RTCPeerConnection.prototype.addTrack = function(t, n) {
            if ("closed" === this.signalingState) throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
            const r = [].slice.call(arguments, 1);
            if (1 !== r.length || !r[0].getTracks().find((e)=>e === t)) throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", "NotSupportedError");
            if (this.getSenders().find((e)=>e.track === t)) throw new DOMException("Track already exists.", "InvalidAccessError");
            this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {};
            const i = this._streams[n.id];
            if (i) i.addTrack(t), Promise.resolve().then(()=>{
                this.dispatchEvent(new Event("negotiationneeded"));
            });
            else {
                const r = new e.MediaStream([
                    t
                ]);
                this._streams[n.id] = r, this._reverseStreams[r.id] = n, this.addStream(r);
            }
            return this.getSenders().find((e)=>e.track === t);
        }, [
            "createOffer",
            "createAnswer"
        ].forEach(function(t) {
            const n = e.RTCPeerConnection.prototype[t], r = {
                [t] () {
                    const e = arguments;
                    return arguments.length && "function" == typeof arguments[0] ? n.apply(this, [
                        (t)=>{
                            const n = s(this, t);
                            e[0].apply(null, [
                                n
                            ]);
                        },
                        (t)=>{
                            e[1] && e[1].apply(null, t);
                        },
                        arguments[2]
                    ]) : n.apply(this, arguments).then((e)=>s(this, e));
                }
            };
            e.RTCPeerConnection.prototype[t] = r[t];
        });
        const o = e.RTCPeerConnection.prototype.setLocalDescription;
        e.RTCPeerConnection.prototype.setLocalDescription = function() {
            return arguments.length && arguments[0].type ? (arguments[0] = function(e, t) {
                let n = t.sdp;
                return Object.keys(e._reverseStreams || []).forEach((t)=>{
                    const r = e._reverseStreams[t], i = e._streams[r.id];
                    n = n.replace(new RegExp(r.id, "g"), i.id);
                }), new RTCSessionDescription({
                    type: t.type,
                    sdp: n
                });
            }(this, arguments[0]), o.apply(this, arguments)) : o.apply(this, arguments);
        };
        const a = Object.getOwnPropertyDescriptor(e.RTCPeerConnection.prototype, "localDescription");
        Object.defineProperty(e.RTCPeerConnection.prototype, "localDescription", {
            get () {
                const e = a.get.apply(this);
                return "" === e.type ? e : s(this, e);
            }
        }), e.RTCPeerConnection.prototype.removeTrack = function(e) {
            if ("closed" === this.signalingState) throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
            if (!e._pc) throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
            if (!(e._pc === this)) throw new DOMException("Sender was not created by this connection.", "InvalidAccessError");
            let t;
            this._streams = this._streams || {}, Object.keys(this._streams).forEach((n)=>{
                this._streams[n].getTracks().find((t)=>e.track === t) && (t = this._streams[n]);
            }), t && (1 === t.getTracks().length ? this.removeStream(this._reverseStreams[t.id]) : t.removeTrack(e.track), this.dispatchEvent(new Event("negotiationneeded")));
        };
    }
    function E(e, t) {
        !e.RTCPeerConnection && e.webkitRTCPeerConnection && (e.RTCPeerConnection = e.webkitRTCPeerConnection), e.RTCPeerConnection && t.version < 53 && [
            "setLocalDescription",
            "setRemoteDescription",
            "addIceCandidate"
        ].forEach(function(t) {
            const n = e.RTCPeerConnection.prototype[t], r = {
                [t] () {
                    return arguments[0] = new ("addIceCandidate" === t ? e.RTCIceCandidate : e.RTCSessionDescription)(arguments[0]), n.apply(this, arguments);
                }
            };
            e.RTCPeerConnection.prototype[t] = r[t];
        });
    }
    function R(e, t) {
        d(e, "negotiationneeded", (e)=>{
            const n = e.target;
            if (!(t.version < 72 || n.getConfiguration && "plan-b" === n.getConfiguration().sdpSemantics) || "stable" === n.signalingState) return e;
        });
    }
    var P = Object.freeze({
        __proto__: null,
        fixNegotiationNeeded: R,
        shimAddTrackRemoveTrack: w,
        shimAddTrackRemoveTrackWithNative: k,
        shimGetSendersWithDtmf: T,
        shimGetUserMedia: _,
        shimMediaStream: v,
        shimOnTrack: b,
        shimPeerConnection: E,
        shimSenderReceiverGetStats: S
    });
    function D(e, t) {
        const n = e && e.navigator, r = e && e.MediaStreamTrack;
        if (n.getUserMedia = function(e, t, r) {
            u("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia"), n.mediaDevices.getUserMedia(e).then(t, r);
        }, !(t.version > 55 && "autoGainControl" in n.mediaDevices.getSupportedConstraints())) {
            const e = function(e, t, n) {
                t in e && !(n in e) && (e[n] = e[t], delete e[t]);
            }, t = n.mediaDevices.getUserMedia.bind(n.mediaDevices);
            if (n.mediaDevices.getUserMedia = function(n) {
                return "object" == typeof n && "object" == typeof n.audio && (n = JSON.parse(JSON.stringify(n)), e(n.audio, "autoGainControl", "mozAutoGainControl"), e(n.audio, "noiseSuppression", "mozNoiseSuppression")), t(n);
            }, r && r.prototype.getSettings) {
                const t = r.prototype.getSettings;
                r.prototype.getSettings = function() {
                    const n = t.apply(this, arguments);
                    return e(n, "mozAutoGainControl", "autoGainControl"), e(n, "mozNoiseSuppression", "noiseSuppression"), n;
                };
            }
            if (r && r.prototype.applyConstraints) {
                const t = r.prototype.applyConstraints;
                r.prototype.applyConstraints = function(n) {
                    return "audio" === this.kind && "object" == typeof n && (n = JSON.parse(JSON.stringify(n)), e(n, "autoGainControl", "mozAutoGainControl"), e(n, "noiseSuppression", "mozNoiseSuppression")), t.apply(this, [
                        n
                    ]);
                };
            }
        }
    }
    function I(e) {
        "object" == typeof e && e.RTCTrackEvent && "receiver" in e.RTCTrackEvent.prototype && !("transceiver" in e.RTCTrackEvent.prototype) && Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", {
            get () {
                return {
                    receiver: this.receiver
                };
            }
        });
    }
    function O(e, t) {
        if ("object" != typeof e || !e.RTCPeerConnection && !e.mozRTCPeerConnection) return;
        !e.RTCPeerConnection && e.mozRTCPeerConnection && (e.RTCPeerConnection = e.mozRTCPeerConnection), t.version < 53 && [
            "setLocalDescription",
            "setRemoteDescription",
            "addIceCandidate"
        ].forEach(function(t) {
            const n = e.RTCPeerConnection.prototype[t], r = {
                [t] () {
                    return arguments[0] = new ("addIceCandidate" === t ? e.RTCIceCandidate : e.RTCSessionDescription)(arguments[0]), n.apply(this, arguments);
                }
            };
            e.RTCPeerConnection.prototype[t] = r[t];
        });
        const n = {
            inboundrtp: "inbound-rtp",
            outboundrtp: "outbound-rtp",
            candidatepair: "candidate-pair",
            localcandidate: "local-candidate",
            remotecandidate: "remote-candidate"
        }, r = e.RTCPeerConnection.prototype.getStats;
        e.RTCPeerConnection.prototype.getStats = function() {
            const [e, i, s] = arguments;
            return r.apply(this, [
                e || null
            ]).then((e)=>{
                if (t.version < 53 && !i) try {
                    e.forEach((e)=>{
                        e.type = n[e.type] || e.type;
                    });
                } catch (t) {
                    if ("TypeError" !== t.name) throw t;
                    e.forEach((t, r)=>{
                        e.set(r, Object.assign({}, t, {
                            type: n[t.type] || t.type
                        }));
                    });
                }
                return e;
            }).then(i, s);
        };
    }
    function x(e) {
        if ("object" != typeof e || !e.RTCPeerConnection || !e.RTCRtpSender) return;
        if (e.RTCRtpSender && "getStats" in e.RTCRtpSender.prototype) return;
        const t = e.RTCPeerConnection.prototype.getSenders;
        t && (e.RTCPeerConnection.prototype.getSenders = function() {
            const e = t.apply(this, []);
            return e.forEach((e)=>e._pc = this), e;
        });
        const n = e.RTCPeerConnection.prototype.addTrack;
        n && (e.RTCPeerConnection.prototype.addTrack = function() {
            const e = n.apply(this, arguments);
            return e._pc = this, e;
        }), e.RTCRtpSender.prototype.getStats = function() {
            return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map);
        };
    }
    function A(e) {
        if ("object" != typeof e || !e.RTCPeerConnection || !e.RTCRtpSender) return;
        if (e.RTCRtpSender && "getStats" in e.RTCRtpReceiver.prototype) return;
        const t = e.RTCPeerConnection.prototype.getReceivers;
        t && (e.RTCPeerConnection.prototype.getReceivers = function() {
            const e = t.apply(this, []);
            return e.forEach((e)=>e._pc = this), e;
        }), d(e, "track", (e)=>(e.receiver._pc = e.srcElement, e)), e.RTCRtpReceiver.prototype.getStats = function() {
            return this._pc.getStats(this.track);
        };
    }
    function M(e) {
        e.RTCPeerConnection && !("removeStream" in e.RTCPeerConnection.prototype) && (e.RTCPeerConnection.prototype.removeStream = function(e) {
            u("removeStream", "removeTrack"), this.getSenders().forEach((t)=>{
                t.track && e.getTracks().includes(t.track) && this.removeTrack(t);
            });
        });
    }
    function N(e) {
        e.DataChannel && !e.RTCDataChannel && (e.RTCDataChannel = e.DataChannel);
    }
    function j(e) {
        if ("object" != typeof e || !e.RTCPeerConnection) return;
        const t = e.RTCPeerConnection.prototype.addTransceiver;
        t && (e.RTCPeerConnection.prototype.addTransceiver = function() {
            this.setParametersPromises = [];
            let e = arguments[1] && arguments[1].sendEncodings;
            void 0 === e && (e = []), e = [
                ...e
            ];
            const n = e.length > 0;
            n && e.forEach((e)=>{
                if ("rid" in e) {
                    if (!/^[a-z0-9]{0,16}$/i.test(e.rid)) throw new TypeError("Invalid RID value provided.");
                }
                if ("scaleResolutionDownBy" in e && !(parseFloat(e.scaleResolutionDownBy) >= 1)) throw new RangeError("scale_resolution_down_by must be >= 1.0");
                if ("maxFramerate" in e && !(parseFloat(e.maxFramerate) >= 0)) throw new RangeError("max_framerate must be >= 0.0");
            });
            const r = t.apply(this, arguments);
            if (n) {
                const { sender: t } = r, n = t.getParameters();
                (!("encodings" in n) || 1 === n.encodings.length && 0 === Object.keys(n.encodings[0]).length) && (n.encodings = e, t.sendEncodings = e, this.setParametersPromises.push(t.setParameters(n).then(()=>{
                    delete t.sendEncodings;
                }).catch(()=>{
                    delete t.sendEncodings;
                })));
            }
            return r;
        });
    }
    function L(e) {
        if ("object" != typeof e || !e.RTCRtpSender) return;
        const t = e.RTCRtpSender.prototype.getParameters;
        t && (e.RTCRtpSender.prototype.getParameters = function() {
            const e = t.apply(this, arguments);
            return "encodings" in e || (e.encodings = [].concat(this.sendEncodings || [
                {}
            ])), e;
        });
    }
    function B(e) {
        if ("object" != typeof e || !e.RTCPeerConnection) return;
        const t = e.RTCPeerConnection.prototype.createOffer;
        e.RTCPeerConnection.prototype.createOffer = function() {
            return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then(()=>t.apply(this, arguments)).finally(()=>{
                this.setParametersPromises = [];
            }) : t.apply(this, arguments);
        };
    }
    function z(e) {
        if ("object" != typeof e || !e.RTCPeerConnection) return;
        const t = e.RTCPeerConnection.prototype.createAnswer;
        e.RTCPeerConnection.prototype.createAnswer = function() {
            return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then(()=>t.apply(this, arguments)).finally(()=>{
                this.setParametersPromises = [];
            }) : t.apply(this, arguments);
        };
    }
    var U = Object.freeze({
        __proto__: null,
        shimAddTransceiver: j,
        shimCreateAnswer: z,
        shimCreateOffer: B,
        shimGetDisplayMedia: function(e, t) {
            e.navigator.mediaDevices && "getDisplayMedia" in e.navigator.mediaDevices || e.navigator.mediaDevices && (e.navigator.mediaDevices.getDisplayMedia = function(n) {
                if (!n || !n.video) {
                    const e = new DOMException("getDisplayMedia without video constraints is undefined");
                    return e.name = "NotFoundError", e.code = 8, Promise.reject(e);
                }
                return !0 === n.video ? n.video = {
                    mediaSource: t
                } : n.video.mediaSource = t, e.navigator.mediaDevices.getUserMedia(n);
            });
        },
        shimGetParameters: L,
        shimGetUserMedia: D,
        shimOnTrack: I,
        shimPeerConnection: O,
        shimRTCDataChannel: N,
        shimReceiverGetStats: A,
        shimRemoveStream: M,
        shimSenderGetStats: x
    });
    function F(e) {
        if ("object" == typeof e && e.RTCPeerConnection) {
            if ("getLocalStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getLocalStreams = function() {
                return this._localStreams || (this._localStreams = []), this._localStreams;
            }), !("addStream" in e.RTCPeerConnection.prototype)) {
                const t = e.RTCPeerConnection.prototype.addTrack;
                e.RTCPeerConnection.prototype.addStream = function(e) {
                    this._localStreams || (this._localStreams = []), this._localStreams.includes(e) || this._localStreams.push(e), e.getAudioTracks().forEach((n)=>t.call(this, n, e)), e.getVideoTracks().forEach((n)=>t.call(this, n, e));
                }, e.RTCPeerConnection.prototype.addTrack = function(e, ...n) {
                    return n && n.forEach((e)=>{
                        this._localStreams ? this._localStreams.includes(e) || this._localStreams.push(e) : this._localStreams = [
                            e
                        ];
                    }), t.apply(this, arguments);
                };
            }
            "removeStream" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.removeStream = function(e) {
                this._localStreams || (this._localStreams = []);
                const t = this._localStreams.indexOf(e);
                if (-1 === t) return;
                this._localStreams.splice(t, 1);
                const n = e.getTracks();
                this.getSenders().forEach((e)=>{
                    n.includes(e.track) && this.removeTrack(e);
                });
            });
        }
    }
    function $(e) {
        if ("object" == typeof e && e.RTCPeerConnection && ("getRemoteStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getRemoteStreams = function() {
            return this._remoteStreams ? this._remoteStreams : [];
        }), !("onaddstream" in e.RTCPeerConnection.prototype))) {
            Object.defineProperty(e.RTCPeerConnection.prototype, "onaddstream", {
                get () {
                    return this._onaddstream;
                },
                set (e) {
                    this._onaddstream && (this.removeEventListener("addstream", this._onaddstream), this.removeEventListener("track", this._onaddstreampoly)), this.addEventListener("addstream", this._onaddstream = e), this.addEventListener("track", this._onaddstreampoly = (e)=>{
                        e.streams.forEach((e)=>{
                            if (this._remoteStreams || (this._remoteStreams = []), this._remoteStreams.includes(e)) return;
                            this._remoteStreams.push(e);
                            const t = new Event("addstream");
                            t.stream = e, this.dispatchEvent(t);
                        });
                    });
                }
            });
            const t = e.RTCPeerConnection.prototype.setRemoteDescription;
            e.RTCPeerConnection.prototype.setRemoteDescription = function() {
                const e = this;
                return this._onaddstreampoly || this.addEventListener("track", this._onaddstreampoly = function(t) {
                    t.streams.forEach((t)=>{
                        if (e._remoteStreams || (e._remoteStreams = []), e._remoteStreams.indexOf(t) >= 0) return;
                        e._remoteStreams.push(t);
                        const n = new Event("addstream");
                        n.stream = t, e.dispatchEvent(n);
                    });
                }), t.apply(e, arguments);
            };
        }
    }
    function H(e) {
        if ("object" != typeof e || !e.RTCPeerConnection) return;
        const t = e.RTCPeerConnection.prototype, n = t.createOffer, r = t.createAnswer, i = t.setLocalDescription, s = t.setRemoteDescription, o = t.addIceCandidate;
        t.createOffer = function(e, t) {
            const r = arguments.length >= 2 ? arguments[2] : arguments[0], i = n.apply(this, [
                r
            ]);
            return t ? (i.then(e, t), Promise.resolve()) : i;
        }, t.createAnswer = function(e, t) {
            const n = arguments.length >= 2 ? arguments[2] : arguments[0], i = r.apply(this, [
                n
            ]);
            return t ? (i.then(e, t), Promise.resolve()) : i;
        };
        let a = function(e, t, n) {
            const r = i.apply(this, [
                e
            ]);
            return n ? (r.then(t, n), Promise.resolve()) : r;
        };
        t.setLocalDescription = a, a = function(e, t, n) {
            const r = s.apply(this, [
                e
            ]);
            return n ? (r.then(t, n), Promise.resolve()) : r;
        }, t.setRemoteDescription = a, a = function(e, t, n) {
            const r = o.apply(this, [
                e
            ]);
            return n ? (r.then(t, n), Promise.resolve()) : r;
        }, t.addIceCandidate = a;
    }
    function V(e) {
        const t = e && e.navigator;
        if (t.mediaDevices && t.mediaDevices.getUserMedia) {
            const e = t.mediaDevices, n = e.getUserMedia.bind(e);
            t.mediaDevices.getUserMedia = (e)=>n(G(e));
        }
        !t.getUserMedia && t.mediaDevices && t.mediaDevices.getUserMedia && (t.getUserMedia = (function(e, n, r) {
            t.mediaDevices.getUserMedia(e).then(n, r);
        }).bind(t));
    }
    function G(e) {
        return e && void 0 !== e.video ? Object.assign({}, e, {
            video: m(e.video)
        }) : e;
    }
    function J(e) {
        if (!e.RTCPeerConnection) return;
        const t = e.RTCPeerConnection;
        e.RTCPeerConnection = function(e, n) {
            if (e && e.iceServers) {
                const t = [];
                for(let n = 0; n < e.iceServers.length; n++){
                    let r = e.iceServers[n];
                    void 0 === r.urls && r.url ? (u("RTCIceServer.url", "RTCIceServer.urls"), r = JSON.parse(JSON.stringify(r)), r.urls = r.url, delete r.url, t.push(r)) : t.push(e.iceServers[n]);
                }
                e.iceServers = t;
            }
            return new t(e, n);
        }, e.RTCPeerConnection.prototype = t.prototype, "generateCertificate" in t && Object.defineProperty(e.RTCPeerConnection, "generateCertificate", {
            get: ()=>t.generateCertificate
        });
    }
    function K(e) {
        "object" == typeof e && e.RTCTrackEvent && "receiver" in e.RTCTrackEvent.prototype && !("transceiver" in e.RTCTrackEvent.prototype) && Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", {
            get () {
                return {
                    receiver: this.receiver
                };
            }
        });
    }
    function W(e) {
        const t = e.RTCPeerConnection.prototype.createOffer;
        e.RTCPeerConnection.prototype.createOffer = function(e) {
            if (e) {
                void 0 !== e.offerToReceiveAudio && (e.offerToReceiveAudio = !!e.offerToReceiveAudio);
                const t = this.getTransceivers().find((e)=>"audio" === e.receiver.track.kind);
                !1 === e.offerToReceiveAudio && t ? "sendrecv" === t.direction ? t.setDirection ? t.setDirection("sendonly") : t.direction = "sendonly" : "recvonly" === t.direction && (t.setDirection ? t.setDirection("inactive") : t.direction = "inactive") : !0 !== e.offerToReceiveAudio || t || this.addTransceiver("audio", {
                    direction: "recvonly"
                }), void 0 !== e.offerToReceiveVideo && (e.offerToReceiveVideo = !!e.offerToReceiveVideo);
                const n = this.getTransceivers().find((e)=>"video" === e.receiver.track.kind);
                !1 === e.offerToReceiveVideo && n ? "sendrecv" === n.direction ? n.setDirection ? n.setDirection("sendonly") : n.direction = "sendonly" : "recvonly" === n.direction && (n.setDirection ? n.setDirection("inactive") : n.direction = "inactive") : !0 !== e.offerToReceiveVideo || n || this.addTransceiver("video", {
                    direction: "recvonly"
                });
            }
            return t.apply(this, arguments);
        };
    }
    function Q(e) {
        "object" != typeof e || e.AudioContext || (e.AudioContext = e.webkitAudioContext);
    }
    var Y = Object.freeze({
        __proto__: null,
        shimAudioContext: Q,
        shimCallbacksAPI: H,
        shimConstraints: G,
        shimCreateOfferLegacy: W,
        shimGetUserMedia: V,
        shimLocalStreamsAPI: F,
        shimRTCIceServerUrls: J,
        shimRemoteStreamsAPI: $,
        shimTrackEventTransceiver: K
    });
    function X(e) {
        return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
    }
    var q = {
        exports: {}
    };
    !function(e) {
        const t = {
            generateIdentifier: function() {
                return Math.random().toString(36).substring(2, 12);
            }
        };
        t.localCName = t.generateIdentifier(), t.splitLines = function(e) {
            return e.trim().split("\n").map((e)=>e.trim());
        }, t.splitSections = function(e) {
            return e.split("\nm=").map((e, t)=>(t > 0 ? "m=" + e : e).trim() + "\r\n");
        }, t.getDescription = function(e) {
            const n = t.splitSections(e);
            return n && n[0];
        }, t.getMediaSections = function(e) {
            const n = t.splitSections(e);
            return n.shift(), n;
        }, t.matchPrefix = function(e, n) {
            return t.splitLines(e).filter((e)=>0 === e.indexOf(n));
        }, t.parseCandidate = function(e) {
            let t;
            t = 0 === e.indexOf("a=candidate:") ? e.substring(12).split(" ") : e.substring(10).split(" ");
            const n = {
                foundation: t[0],
                component: {
                    1: "rtp",
                    2: "rtcp"
                }[t[1]] || t[1],
                protocol: t[2].toLowerCase(),
                priority: parseInt(t[3], 10),
                ip: t[4],
                address: t[4],
                port: parseInt(t[5], 10),
                type: t[7]
            };
            for(let e = 8; e < t.length; e += 2)switch(t[e]){
                case "raddr":
                    n.relatedAddress = t[e + 1];
                    break;
                case "rport":
                    n.relatedPort = parseInt(t[e + 1], 10);
                    break;
                case "tcptype":
                    n.tcpType = t[e + 1];
                    break;
                case "ufrag":
                    n.ufrag = t[e + 1], n.usernameFragment = t[e + 1];
                    break;
                default:
                    void 0 === n[t[e]] && (n[t[e]] = t[e + 1]);
            }
            return n;
        }, t.writeCandidate = function(e) {
            const t = [];
            t.push(e.foundation);
            const n = e.component;
            "rtp" === n ? t.push(1) : "rtcp" === n ? t.push(2) : t.push(n), t.push(e.protocol.toUpperCase()), t.push(e.priority), t.push(e.address || e.ip), t.push(e.port);
            const r = e.type;
            return t.push("typ"), t.push(r), "host" !== r && e.relatedAddress && e.relatedPort && (t.push("raddr"), t.push(e.relatedAddress), t.push("rport"), t.push(e.relatedPort)), e.tcpType && "tcp" === e.protocol.toLowerCase() && (t.push("tcptype"), t.push(e.tcpType)), (e.usernameFragment || e.ufrag) && (t.push("ufrag"), t.push(e.usernameFragment || e.ufrag)), "candidate:" + t.join(" ");
        }, t.parseIceOptions = function(e) {
            return e.substring(14).split(" ");
        }, t.parseRtpMap = function(e) {
            let t = e.substring(9).split(" ");
            const n = {
                payloadType: parseInt(t.shift(), 10)
            };
            return t = t[0].split("/"), n.name = t[0], n.clockRate = parseInt(t[1], 10), n.channels = 3 === t.length ? parseInt(t[2], 10) : 1, n.numChannels = n.channels, n;
        }, t.writeRtpMap = function(e) {
            let t = e.payloadType;
            void 0 !== e.preferredPayloadType && (t = e.preferredPayloadType);
            const n = e.channels || e.numChannels || 1;
            return "a=rtpmap:" + t + " " + e.name + "/" + e.clockRate + (1 !== n ? "/" + n : "") + "\r\n";
        }, t.parseExtmap = function(e) {
            const t = e.substring(9).split(" ");
            return {
                id: parseInt(t[0], 10),
                direction: t[0].indexOf("/") > 0 ? t[0].split("/")[1] : "sendrecv",
                uri: t[1],
                attributes: t.slice(2).join(" ")
            };
        }, t.writeExtmap = function(e) {
            return "a=extmap:" + (e.id || e.preferredId) + (e.direction && "sendrecv" !== e.direction ? "/" + e.direction : "") + " " + e.uri + (e.attributes ? " " + e.attributes : "") + "\r\n";
        }, t.parseFmtp = function(e) {
            const t = {};
            let n;
            const r = e.substring(e.indexOf(" ") + 1).split(";");
            for(let e = 0; e < r.length; e++)n = r[e].trim().split("="), t[n[0].trim()] = n[1];
            return t;
        }, t.writeFmtp = function(e) {
            let t = "", n = e.payloadType;
            if (void 0 !== e.preferredPayloadType && (n = e.preferredPayloadType), e.parameters && Object.keys(e.parameters).length) {
                const r = [];
                Object.keys(e.parameters).forEach((t)=>{
                    void 0 !== e.parameters[t] ? r.push(t + "=" + e.parameters[t]) : r.push(t);
                }), t += "a=fmtp:" + n + " " + r.join(";") + "\r\n";
            }
            return t;
        }, t.parseRtcpFb = function(e) {
            const t = e.substring(e.indexOf(" ") + 1).split(" ");
            return {
                type: t.shift(),
                parameter: t.join(" ")
            };
        }, t.writeRtcpFb = function(e) {
            let t = "", n = e.payloadType;
            return void 0 !== e.preferredPayloadType && (n = e.preferredPayloadType), e.rtcpFeedback && e.rtcpFeedback.length && e.rtcpFeedback.forEach((e)=>{
                t += "a=rtcp-fb:" + n + " " + e.type + (e.parameter && e.parameter.length ? " " + e.parameter : "") + "\r\n";
            }), t;
        }, t.parseSsrcMedia = function(e) {
            const t = e.indexOf(" "), n = {
                ssrc: parseInt(e.substring(7, t), 10)
            }, r = e.indexOf(":", t);
            return r > -1 ? (n.attribute = e.substring(t + 1, r), n.value = e.substring(r + 1)) : n.attribute = e.substring(t + 1), n;
        }, t.parseSsrcGroup = function(e) {
            const t = e.substring(13).split(" ");
            return {
                semantics: t.shift(),
                ssrcs: t.map((e)=>parseInt(e, 10))
            };
        }, t.getMid = function(e) {
            const n = t.matchPrefix(e, "a=mid:")[0];
            if (n) return n.substring(6);
        }, t.parseFingerprint = function(e) {
            const t = e.substring(14).split(" ");
            return {
                algorithm: t[0].toLowerCase(),
                value: t[1].toUpperCase()
            };
        }, t.getDtlsParameters = function(e, n) {
            return {
                role: "auto",
                fingerprints: t.matchPrefix(e + n, "a=fingerprint:").map(t.parseFingerprint)
            };
        }, t.writeDtlsParameters = function(e, t) {
            let n = "a=setup:" + t + "\r\n";
            return e.fingerprints.forEach((e)=>{
                n += "a=fingerprint:" + e.algorithm + " " + e.value + "\r\n";
            }), n;
        }, t.parseCryptoLine = function(e) {
            const t = e.substring(9).split(" ");
            return {
                tag: parseInt(t[0], 10),
                cryptoSuite: t[1],
                keyParams: t[2],
                sessionParams: t.slice(3)
            };
        }, t.writeCryptoLine = function(e) {
            return "a=crypto:" + e.tag + " " + e.cryptoSuite + " " + ("object" == typeof e.keyParams ? t.writeCryptoKeyParams(e.keyParams) : e.keyParams) + (e.sessionParams ? " " + e.sessionParams.join(" ") : "") + "\r\n";
        }, t.parseCryptoKeyParams = function(e) {
            if (0 !== e.indexOf("inline:")) return null;
            const t = e.substring(7).split("|");
            return {
                keyMethod: "inline",
                keySalt: t[0],
                lifeTime: t[1],
                mkiValue: t[2] ? t[2].split(":")[0] : void 0,
                mkiLength: t[2] ? t[2].split(":")[1] : void 0
            };
        }, t.writeCryptoKeyParams = function(e) {
            return e.keyMethod + ":" + e.keySalt + (e.lifeTime ? "|" + e.lifeTime : "") + (e.mkiValue && e.mkiLength ? "|" + e.mkiValue + ":" + e.mkiLength : "");
        }, t.getCryptoParameters = function(e, n) {
            return t.matchPrefix(e + n, "a=crypto:").map(t.parseCryptoLine);
        }, t.getIceParameters = function(e, n) {
            const r = t.matchPrefix(e + n, "a=ice-ufrag:")[0], i = t.matchPrefix(e + n, "a=ice-pwd:")[0];
            return r && i ? {
                usernameFragment: r.substring(12),
                password: i.substring(10)
            } : null;
        }, t.writeIceParameters = function(e) {
            let t = "a=ice-ufrag:" + e.usernameFragment + "\r\na=ice-pwd:" + e.password + "\r\n";
            return e.iceLite && (t += "a=ice-lite\r\n"), t;
        }, t.parseRtpParameters = function(e) {
            const n = {
                codecs: [],
                headerExtensions: [],
                fecMechanisms: [],
                rtcp: []
            }, r = t.splitLines(e)[0].split(" ");
            n.profile = r[2];
            for(let i = 3; i < r.length; i++){
                const s = r[i], o = t.matchPrefix(e, "a=rtpmap:" + s + " ")[0];
                if (o) {
                    const r = t.parseRtpMap(o), i = t.matchPrefix(e, "a=fmtp:" + s + " ");
                    switch(r.parameters = i.length ? t.parseFmtp(i[0]) : {}, r.rtcpFeedback = t.matchPrefix(e, "a=rtcp-fb:" + s + " ").map(t.parseRtcpFb), n.codecs.push(r), r.name.toUpperCase()){
                        case "RED":
                        case "ULPFEC":
                            n.fecMechanisms.push(r.name.toUpperCase());
                    }
                }
            }
            t.matchPrefix(e, "a=extmap:").forEach((e)=>{
                n.headerExtensions.push(t.parseExtmap(e));
            });
            const i = t.matchPrefix(e, "a=rtcp-fb:* ").map(t.parseRtcpFb);
            return n.codecs.forEach((e)=>{
                i.forEach((t)=>{
                    e.rtcpFeedback.find((e)=>e.type === t.type && e.parameter === t.parameter) || e.rtcpFeedback.push(t);
                });
            }), n;
        }, t.writeRtpDescription = function(e, n) {
            let r = "";
            r += "m=" + e + " ", r += n.codecs.length > 0 ? "9" : "0", r += " " + (n.profile || "UDP/TLS/RTP/SAVPF") + " ", r += n.codecs.map((e)=>void 0 !== e.preferredPayloadType ? e.preferredPayloadType : e.payloadType).join(" ") + "\r\n", r += "c=IN IP4 0.0.0.0\r\n", r += "a=rtcp:9 IN IP4 0.0.0.0\r\n", n.codecs.forEach((e)=>{
                r += t.writeRtpMap(e), r += t.writeFmtp(e), r += t.writeRtcpFb(e);
            });
            let i = 0;
            return n.codecs.forEach((e)=>{
                e.maxptime > i && (i = e.maxptime);
            }), i > 0 && (r += "a=maxptime:" + i + "\r\n"), n.headerExtensions && n.headerExtensions.forEach((e)=>{
                r += t.writeExtmap(e);
            }), r;
        }, t.parseRtpEncodingParameters = function(e) {
            const n = [], r = t.parseRtpParameters(e), i = -1 !== r.fecMechanisms.indexOf("RED"), s = -1 !== r.fecMechanisms.indexOf("ULPFEC"), o = t.matchPrefix(e, "a=ssrc:").map((e)=>t.parseSsrcMedia(e)).filter((e)=>"cname" === e.attribute), a = o.length > 0 && o[0].ssrc;
            let c;
            const d = t.matchPrefix(e, "a=ssrc-group:FID").map((e)=>e.substring(17).split(" ").map((e)=>parseInt(e, 10)));
            d.length > 0 && d[0].length > 1 && d[0][0] === a && (c = d[0][1]), r.codecs.forEach((e)=>{
                if ("RTX" === e.name.toUpperCase() && e.parameters.apt) {
                    let t = {
                        ssrc: a,
                        codecPayloadType: parseInt(e.parameters.apt, 10)
                    };
                    a && c && (t.rtx = {
                        ssrc: c
                    }), n.push(t), i && (t = JSON.parse(JSON.stringify(t)), t.fec = {
                        ssrc: a,
                        mechanism: s ? "red+ulpfec" : "red"
                    }, n.push(t));
                }
            }), 0 === n.length && a && n.push({
                ssrc: a
            });
            let h = t.matchPrefix(e, "b=");
            return h.length && (h = 0 === h[0].indexOf("b=TIAS:") ? parseInt(h[0].substring(7), 10) : 0 === h[0].indexOf("b=AS:") ? 1e3 * parseInt(h[0].substring(5), 10) * .95 - 16e3 : void 0, n.forEach((e)=>{
                e.maxBitrate = h;
            })), n;
        }, t.parseRtcpParameters = function(e) {
            const n = {}, r = t.matchPrefix(e, "a=ssrc:").map((e)=>t.parseSsrcMedia(e)).filter((e)=>"cname" === e.attribute)[0];
            r && (n.cname = r.value, n.ssrc = r.ssrc);
            const i = t.matchPrefix(e, "a=rtcp-rsize");
            n.reducedSize = i.length > 0, n.compound = 0 === i.length;
            const s = t.matchPrefix(e, "a=rtcp-mux");
            return n.mux = s.length > 0, n;
        }, t.writeRtcpParameters = function(e) {
            let t = "";
            return e.reducedSize && (t += "a=rtcp-rsize\r\n"), e.mux && (t += "a=rtcp-mux\r\n"), void 0 !== e.ssrc && e.cname && (t += "a=ssrc:" + e.ssrc + " cname:" + e.cname + "\r\n"), t;
        }, t.parseMsid = function(e) {
            let n;
            const r = t.matchPrefix(e, "a=msid:");
            if (1 === r.length) return n = r[0].substring(7).split(" "), {
                stream: n[0],
                track: n[1]
            };
            const i = t.matchPrefix(e, "a=ssrc:").map((e)=>t.parseSsrcMedia(e)).filter((e)=>"msid" === e.attribute);
            return i.length > 0 ? (n = i[0].value.split(" "), {
                stream: n[0],
                track: n[1]
            }) : void 0;
        }, t.parseSctpDescription = function(e) {
            const n = t.parseMLine(e), r = t.matchPrefix(e, "a=max-message-size:");
            let i;
            r.length > 0 && (i = parseInt(r[0].substring(19), 10)), isNaN(i) && (i = 65536);
            const s = t.matchPrefix(e, "a=sctp-port:");
            if (s.length > 0) return {
                port: parseInt(s[0].substring(12), 10),
                protocol: n.fmt,
                maxMessageSize: i
            };
            const o = t.matchPrefix(e, "a=sctpmap:");
            if (o.length > 0) {
                const e = o[0].substring(10).split(" ");
                return {
                    port: parseInt(e[0], 10),
                    protocol: e[1],
                    maxMessageSize: i
                };
            }
        }, t.writeSctpDescription = function(e, t) {
            let n = [];
            return n = "DTLS/SCTP" !== e.protocol ? [
                "m=" + e.kind + " 9 " + e.protocol + " " + t.protocol + "\r\n",
                "c=IN IP4 0.0.0.0\r\n",
                "a=sctp-port:" + t.port + "\r\n"
            ] : [
                "m=" + e.kind + " 9 " + e.protocol + " " + t.port + "\r\n",
                "c=IN IP4 0.0.0.0\r\n",
                "a=sctpmap:" + t.port + " " + t.protocol + " 65535\r\n"
            ], void 0 !== t.maxMessageSize && n.push("a=max-message-size:" + t.maxMessageSize + "\r\n"), n.join("");
        }, t.generateSessionId = function() {
            return Math.random().toString().substr(2, 22);
        }, t.writeSessionBoilerplate = function(e, n, r) {
            let i;
            const s = void 0 !== n ? n : 2;
            i = e || t.generateSessionId();
            return "v=0\r\no=" + (r || "thisisadapterortc") + " " + i + " " + s + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n";
        }, t.getDirection = function(e, n) {
            const r = t.splitLines(e);
            for(let e = 0; e < r.length; e++)switch(r[e]){
                case "a=sendrecv":
                case "a=sendonly":
                case "a=recvonly":
                case "a=inactive":
                    return r[e].substring(2);
            }
            return n ? t.getDirection(n) : "sendrecv";
        }, t.getKind = function(e) {
            return t.splitLines(e)[0].split(" ")[0].substring(2);
        }, t.isRejected = function(e) {
            return "0" === e.split(" ", 2)[1];
        }, t.parseMLine = function(e) {
            const n = t.splitLines(e)[0].substring(2).split(" ");
            return {
                kind: n[0],
                port: parseInt(n[1], 10),
                protocol: n[2],
                fmt: n.slice(3).join(" ")
            };
        }, t.parseOLine = function(e) {
            const n = t.matchPrefix(e, "o=")[0].substring(2).split(" ");
            return {
                username: n[0],
                sessionId: n[1],
                sessionVersion: parseInt(n[2], 10),
                netType: n[3],
                addressType: n[4],
                address: n[5]
            };
        }, t.isValidSDP = function(e) {
            if ("string" != typeof e || 0 === e.length) return !1;
            const n = t.splitLines(e);
            for(let e = 0; e < n.length; e++)if (n[e].length < 2 || "=" !== n[e].charAt(1)) return !1;
            return !0;
        }, e.exports = t;
    }(q);
    var Z = q.exports, ee = X(Z), te = e({
        __proto__: null,
        default: ee
    }, [
        Z
    ]);
    function ne(e) {
        if (!e.RTCIceCandidate || e.RTCIceCandidate && "foundation" in e.RTCIceCandidate.prototype) return;
        const t = e.RTCIceCandidate;
        e.RTCIceCandidate = function(e) {
            if ("object" == typeof e && e.candidate && 0 === e.candidate.indexOf("a=") && ((e = JSON.parse(JSON.stringify(e))).candidate = e.candidate.substring(2)), e.candidate && e.candidate.length) {
                const n = new t(e), r = ee.parseCandidate(e.candidate);
                for(const e in r)e in n || Object.defineProperty(n, e, {
                    value: r[e]
                });
                return n.toJSON = function() {
                    return {
                        candidate: n.candidate,
                        sdpMid: n.sdpMid,
                        sdpMLineIndex: n.sdpMLineIndex,
                        usernameFragment: n.usernameFragment
                    };
                }, n;
            }
            return new t(e);
        }, e.RTCIceCandidate.prototype = t.prototype, d(e, "icecandidate", (t)=>(t.candidate && Object.defineProperty(t, "candidate", {
                value: new e.RTCIceCandidate(t.candidate),
                writable: "false"
            }), t));
    }
    function re(e) {
        !e.RTCIceCandidate || e.RTCIceCandidate && "relayProtocol" in e.RTCIceCandidate.prototype || d(e, "icecandidate", (e)=>{
            if (e.candidate) {
                const t = ee.parseCandidate(e.candidate.candidate);
                "relay" === t.type && (e.candidate.relayProtocol = ({
                    0: "tls",
                    1: "tcp",
                    2: "udp"
                })[t.priority >> 24]);
            }
            return e;
        });
    }
    function ie(e, t) {
        if (!e.RTCPeerConnection) return;
        "sctp" in e.RTCPeerConnection.prototype || Object.defineProperty(e.RTCPeerConnection.prototype, "sctp", {
            get () {
                return void 0 === this._sctp ? null : this._sctp;
            }
        });
        const n = e.RTCPeerConnection.prototype.setRemoteDescription;
        e.RTCPeerConnection.prototype.setRemoteDescription = function() {
            if (this._sctp = null, "chrome" === t.browser && t.version >= 76) {
                const { sdpSemantics: e } = this.getConfiguration();
                "plan-b" === e && Object.defineProperty(this, "sctp", {
                    get () {
                        return void 0 === this._sctp ? null : this._sctp;
                    },
                    enumerable: !0,
                    configurable: !0
                });
            }
            if (function(e) {
                if (!e || !e.sdp) return !1;
                const t = ee.splitSections(e.sdp);
                return t.shift(), t.some((e)=>{
                    const t = ee.parseMLine(e);
                    return t && "application" === t.kind && -1 !== t.protocol.indexOf("SCTP");
                });
            }(arguments[0])) {
                const e = function(e) {
                    const t = e.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
                    if (null === t || t.length < 2) return -1;
                    const n = parseInt(t[1], 10);
                    return n != n ? -1 : n;
                }(arguments[0]), n = function(e) {
                    let n = 65536;
                    return "firefox" === t.browser && (n = t.version < 57 ? -1 === e ? 16384 : 2147483637 : t.version < 60 ? 57 === t.version ? 65535 : 65536 : 2147483637), n;
                }(e), r = function(e, n) {
                    let r = 65536;
                    "firefox" === t.browser && 57 === t.version && (r = 65535);
                    const i = ee.matchPrefix(e.sdp, "a=max-message-size:");
                    return i.length > 0 ? r = parseInt(i[0].substring(19), 10) : "firefox" === t.browser && -1 !== n && (r = 2147483637), r;
                }(arguments[0], e);
                let i;
                i = 0 === n && 0 === r ? Number.POSITIVE_INFINITY : 0 === n || 0 === r ? Math.max(n, r) : Math.min(n, r);
                const s = {};
                Object.defineProperty(s, "maxMessageSize", {
                    get: ()=>i
                }), this._sctp = s;
            }
            return n.apply(this, arguments);
        };
    }
    function se(e) {
        if (!e.RTCPeerConnection || !("createDataChannel" in e.RTCPeerConnection.prototype)) return;
        function t(e, t) {
            const n = e.send;
            e.send = function() {
                const r = arguments[0], i = r.length || r.size || r.byteLength;
                if ("open" === e.readyState && t.sctp && i > t.sctp.maxMessageSize) throw new TypeError("Message too large (can send a maximum of " + t.sctp.maxMessageSize + " bytes)");
                return n.apply(e, arguments);
            };
        }
        const n = e.RTCPeerConnection.prototype.createDataChannel;
        e.RTCPeerConnection.prototype.createDataChannel = function() {
            const e = n.apply(this, arguments);
            return t(e, this), e;
        }, d(e, "datachannel", (e)=>(t(e.channel, e.target), e));
    }
    function oe(e) {
        if (!e.RTCPeerConnection || "connectionState" in e.RTCPeerConnection.prototype) return;
        const t = e.RTCPeerConnection.prototype;
        Object.defineProperty(t, "connectionState", {
            get () {
                return ({
                    completed: "connected",
                    checking: "connecting"
                })[this.iceConnectionState] || this.iceConnectionState;
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(t, "onconnectionstatechange", {
            get () {
                return this._onconnectionstatechange || null;
            },
            set (e) {
                this._onconnectionstatechange && (this.removeEventListener("connectionstatechange", this._onconnectionstatechange), delete this._onconnectionstatechange), e && this.addEventListener("connectionstatechange", this._onconnectionstatechange = e);
            },
            enumerable: !0,
            configurable: !0
        }), [
            "setLocalDescription",
            "setRemoteDescription"
        ].forEach((e)=>{
            const n = t[e];
            t[e] = function() {
                return this._connectionstatechangepoly || (this._connectionstatechangepoly = (e)=>{
                    const t = e.target;
                    if (t._lastConnectionState !== t.connectionState) {
                        t._lastConnectionState = t.connectionState;
                        const n = new Event("connectionstatechange", e);
                        t.dispatchEvent(n);
                    }
                    return e;
                }, this.addEventListener("iceconnectionstatechange", this._connectionstatechangepoly)), n.apply(this, arguments);
            };
        });
    }
    function ae(e, t) {
        if (!e.RTCPeerConnection) return;
        if ("chrome" === t.browser && t.version >= 71) return;
        if ("safari" === t.browser && t._safariVersion >= 13.1) return;
        const n = e.RTCPeerConnection.prototype.setRemoteDescription;
        e.RTCPeerConnection.prototype.setRemoteDescription = function(t) {
            if (t && t.sdp && -1 !== t.sdp.indexOf("\na=extmap-allow-mixed")) {
                const n = t.sdp.split("\n").filter((e)=>"a=extmap-allow-mixed" !== e.trim()).join("\n");
                e.RTCSessionDescription && t instanceof e.RTCSessionDescription ? arguments[0] = new e.RTCSessionDescription({
                    type: t.type,
                    sdp: n
                }) : t.sdp = n;
            }
            return n.apply(this, arguments);
        };
    }
    function ce(e, t) {
        if (!e.RTCPeerConnection || !e.RTCPeerConnection.prototype) return;
        const n = e.RTCPeerConnection.prototype.addIceCandidate;
        n && 0 !== n.length && (e.RTCPeerConnection.prototype.addIceCandidate = function() {
            return arguments[0] ? ("chrome" === t.browser && t.version < 78 || "firefox" === t.browser && t.version < 68 || "safari" === t.browser) && arguments[0] && "" === arguments[0].candidate ? Promise.resolve() : n.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve());
        });
    }
    function de(e, t) {
        if (!e.RTCPeerConnection || !e.RTCPeerConnection.prototype) return;
        const n = e.RTCPeerConnection.prototype.setLocalDescription;
        n && 0 !== n.length && (e.RTCPeerConnection.prototype.setLocalDescription = function() {
            let e = arguments[0] || {};
            if ("object" != typeof e || e.type && e.sdp) return n.apply(this, arguments);
            if (e = {
                type: e.type,
                sdp: e.sdp
            }, !e.type) switch(this.signalingState){
                case "stable":
                case "have-local-offer":
                case "have-remote-pranswer":
                    e.type = "offer";
                    break;
                default:
                    e.type = "answer";
            }
            if (e.sdp || "offer" !== e.type && "answer" !== e.type) return n.apply(this, [
                e
            ]);
            return ("offer" === e.type ? this.createOffer : this.createAnswer).apply(this).then((e)=>n.apply(this, [
                    e
                ]));
        });
    }
    var he = Object.freeze({
        __proto__: null,
        removeExtmapAllowMixed: ae,
        shimAddIceCandidateNullOrEmpty: ce,
        shimConnectionState: oe,
        shimMaxMessageSize: ie,
        shimParameterlessSetLocalDescription: de,
        shimRTCIceCandidate: ne,
        shimRTCIceCandidateRelayProtocol: re,
        shimSendThrowTypeError: se
    });
    const pe = function({ window: e } = {}, t = {
        shimChrome: !0,
        shimFirefox: !0,
        shimSafari: !0
    }) {
        const n = l, r = function(e) {
            const t = {
                browser: null,
                version: null
            };
            if (void 0 === e || !e.navigator || !e.navigator.userAgent) return t.browser = "Not a browser.", t;
            const { navigator: n } = e;
            if (n.userAgentData && n.userAgentData.brands) {
                const e = n.userAgentData.brands.find((e)=>"Chromium" === e.brand);
                if (e) return {
                    browser: "chrome",
                    version: parseInt(e.version, 10)
                };
            }
            if (n.mozGetUserMedia) t.browser = "firefox", t.version = parseInt(c(n.userAgent, /Firefox\/(\d+)\./, 1));
            else if (n.webkitGetUserMedia || !1 === e.isSecureContext && e.webkitRTCPeerConnection) t.browser = "chrome", t.version = parseInt(c(n.userAgent, /Chrom(e|ium)\/(\d+)\./, 2));
            else {
                if (!e.RTCPeerConnection || !n.userAgent.match(/AppleWebKit\/(\d+)\./)) return t.browser = "Not a supported browser.", t;
                t.browser = "safari", t.version = parseInt(c(n.userAgent, /AppleWebKit\/(\d+)\./, 1)), t.supportsUnifiedPlan = e.RTCRtpTransceiver && "currentDirection" in e.RTCRtpTransceiver.prototype, t._safariVersion = c(n.userAgent, /Version\/(\d+(\.?\d+))/, 1);
            }
            return t;
        }(e), i = {
            browserDetails: r,
            commonShim: he,
            extractVersion: c,
            disableLog: h,
            disableWarnings: p,
            sdp: te
        };
        switch(r.browser){
            case "chrome":
                if (!P || !E || !t.shimChrome) return n("Chrome shim is not included in this adapter release."), i;
                if (null === r.version) return n("Chrome shim can not determine version, not shimming."), i;
                n("adapter.js shimming chrome."), i.browserShim = P, ce(e, r), de(e), _(e, r), v(e), E(e, r), b(e), w(e, r), T(e), S(e), R(e, r), ne(e), re(e), oe(e), ie(e, r), se(e), ae(e, r);
                break;
            case "firefox":
                if (!U || !O || !t.shimFirefox) return n("Firefox shim is not included in this adapter release."), i;
                n("adapter.js shimming firefox."), i.browserShim = U, ce(e, r), de(e), D(e, r), O(e, r), I(e), M(e), x(e), A(e), N(e), j(e), L(e), B(e), z(e), ne(e), oe(e), ie(e, r), se(e);
                break;
            case "safari":
                if (!Y || !t.shimSafari) return n("Safari shim is not included in this adapter release."), i;
                n("adapter.js shimming safari."), i.browserShim = Y, ce(e, r), de(e), J(e), W(e), H(e), F(e), $(e), K(e), V(e), Q(e), ne(e), re(e), ie(e, r), se(e), ae(e, r);
                break;
            default:
                n("Unsupported browser!");
        }
        return i;
    }({
        window: "undefined" == typeof window ? void 0 : window
    });
    function le(e, t, n, r) {
        Object.defineProperty(e, t, {
            get: n,
            set: r,
            enumerable: !0,
            configurable: !0
        });
    }
    class ue {
        constructor(){
            this.chunkedMTU = 16300, this._dataCount = 1, this.chunk = (e)=>{
                const t = [], n = e.byteLength, r = Math.ceil(n / this.chunkedMTU);
                let i = 0, s = 0;
                for(; s < n;){
                    const o = Math.min(n, s + this.chunkedMTU), a = e.slice(s, o), c = {
                        __peerData: this._dataCount,
                        n: i,
                        data: a,
                        total: r
                    };
                    t.push(c), s = o, i++;
                }
                return this._dataCount++, t;
            };
        }
    }
    const fe = pe.default || pe, me = new class {
        isWebRTCSupported() {
            return "undefined" != typeof RTCPeerConnection;
        }
        isBrowserSupported() {
            const e = this.getBrowser(), t = this.getVersion();
            return !!this.supportedBrowsers.includes(e) && ("chrome" === e ? t >= this.minChromeVersion : "firefox" === e ? t >= this.minFirefoxVersion : "safari" === e && !this.isIOS && t >= this.minSafariVersion);
        }
        getBrowser() {
            return fe.browserDetails.browser;
        }
        getVersion() {
            return fe.browserDetails.version || 0;
        }
        isUnifiedPlanSupported() {
            const e = this.getBrowser(), t = fe.browserDetails.version || 0;
            if ("chrome" === e && t < this.minChromeVersion) return !1;
            if ("firefox" === e && t >= this.minFirefoxVersion) return !0;
            if (!window.RTCRtpTransceiver || !("currentDirection" in RTCRtpTransceiver.prototype)) return !1;
            let n, r = !1;
            try {
                n = new RTCPeerConnection, n.addTransceiver("audio"), r = !0;
            } catch (e) {} finally{
                n && n.close();
            }
            return r;
        }
        toString() {
            return `Supports:\n    browser:${this.getBrowser()}\n    version:${this.getVersion()}\n    isIOS:${this.isIOS}\n    isWebRTCSupported:${this.isWebRTCSupported()}\n    isBrowserSupported:${this.isBrowserSupported()}\n    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`;
        }
        constructor(){
            this.isIOS = "undefined" != typeof navigator && [
                "iPad",
                "iPhone",
                "iPod"
            ].includes(navigator.platform), this.supportedBrowsers = [
                "firefox",
                "chrome",
                "safari"
            ], this.minFirefoxVersion = 59, this.minChromeVersion = 72, this.minSafariVersion = 605;
        }
    }, ge = (e)=>!e || /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(e), ye = ()=>Math.random().toString(36).slice(2), Ce = {
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
    const _e = new class extends ue {
        noop() {}
        blobToArrayBuffer(e, t) {
            const n = new FileReader;
            return n.onload = function(e) {
                e.target && t(e.target.result);
            }, n.readAsArrayBuffer(e), n;
        }
        binaryStringToArrayBuffer(e) {
            const t = new Uint8Array(e.length);
            for(let n = 0; n < e.length; n++)t[n] = 255 & e.charCodeAt(n);
            return t.buffer;
        }
        isSecure() {
            return "https:" === location.protocol;
        }
        constructor(...e){
            super(...e), this.CLOUD_HOST = "0.peerjs.com", this.CLOUD_PORT = 443, this.chunkedBrowsers = {
                Chrome: 1,
                chrome: 1
            }, this.defaultConfig = Ce, this.browser = me.getBrowser(), this.browserVersion = me.getVersion(), this.pack = r, this.unpack = n, this.supports = function() {
                const e = {
                    browser: me.isBrowserSupported(),
                    webRTC: me.isWebRTCSupported(),
                    audioVideo: !1,
                    data: !1,
                    binaryBlob: !1,
                    reliable: !1
                };
                if (!e.webRTC) return e;
                let t;
                try {
                    let n;
                    t = new RTCPeerConnection(Ce), e.audioVideo = !0;
                    try {
                        n = t.createDataChannel("_PEERJSTEST", {
                            ordered: !0
                        }), e.data = !0, e.reliable = !!n.ordered;
                        try {
                            n.binaryType = "blob", e.binaryBlob = !me.isIOS;
                        } catch (e) {}
                    } catch (e) {} finally{
                        n && n.close();
                    }
                } catch (e) {} finally{
                    t && t.close();
                }
                return e;
            }(), this.validateId = ge, this.randomToken = ye;
        }
    };
    var ve, be;
    (be = ve || (ve = {}))[be.Disabled = 0] = "Disabled", be[be.Errors = 1] = "Errors", be[be.Warnings = 2] = "Warnings", be[be.All = 3] = "All";
    var Te, Se = new class {
        get logLevel() {
            return this._logLevel;
        }
        set logLevel(e) {
            this._logLevel = e;
        }
        log(...e) {
            this._logLevel >= 3 && this._print(3, ...e);
        }
        warn(...e) {
            this._logLevel >= 2 && this._print(2, ...e);
        }
        error(...e) {
            this._logLevel >= 1 && this._print(1, ...e);
        }
        setLogFunction(e) {
            this._print = e;
        }
        _print(e, ...t) {
            const n = [
                "PeerJS: ",
                ...t
            ];
            for(const e in n)n[e] instanceof Error && (n[e] = "(" + n[e].name + ") " + n[e].message);
            e >= 3 ? console.log(...n) : e >= 2 ? console.warn("WARNING", ...n) : e >= 1 && console.error("ERROR", ...n);
        }
        constructor(){
            this._logLevel = 0;
        }
    }, ke = Object.prototype.hasOwnProperty, we = "~";
    function Ee() {}
    function Re(e, t, n) {
        this.fn = e, this.context = t, this.once = n || !1;
    }
    function Pe(e, t, n, r, i) {
        if ("function" != typeof n) throw new TypeError("The listener must be a function");
        var s = new Re(n, r || e, i), o = we ? we + t : t;
        return e._events[o] ? e._events[o].fn ? e._events[o] = [
            e._events[o],
            s
        ] : e._events[o].push(s) : (e._events[o] = s, e._eventsCount++), e;
    }
    function De(e, t) {
        0 == --e._eventsCount ? e._events = new Ee : delete e._events[t];
    }
    function Ie() {
        this._events = new Ee, this._eventsCount = 0;
    }
    Object.create && (Ee.prototype = Object.create(null), (new Ee).__proto__ || (we = !1)), Ie.prototype.eventNames = function() {
        var e, t, n = [];
        if (0 === this._eventsCount) return n;
        for(t in e = this._events)ke.call(e, t) && n.push(we ? t.slice(1) : t);
        return Object.getOwnPropertySymbols ? n.concat(Object.getOwnPropertySymbols(e)) : n;
    }, Ie.prototype.listeners = function(e) {
        var t = we ? we + e : e, n = this._events[t];
        if (!n) return [];
        if (n.fn) return [
            n.fn
        ];
        for(var r = 0, i = n.length, s = new Array(i); r < i; r++)s[r] = n[r].fn;
        return s;
    }, Ie.prototype.listenerCount = function(e) {
        var t = we ? we + e : e, n = this._events[t];
        return n ? n.fn ? 1 : n.length : 0;
    }, Ie.prototype.emit = function(e, t, n, r, i, s) {
        var o = we ? we + e : e;
        if (!this._events[o]) return !1;
        var a, c, d = this._events[o], h = arguments.length;
        if (d.fn) {
            switch(d.once && this.removeListener(e, d.fn, void 0, !0), h){
                case 1:
                    return d.fn.call(d.context), !0;
                case 2:
                    return d.fn.call(d.context, t), !0;
                case 3:
                    return d.fn.call(d.context, t, n), !0;
                case 4:
                    return d.fn.call(d.context, t, n, r), !0;
                case 5:
                    return d.fn.call(d.context, t, n, r, i), !0;
                case 6:
                    return d.fn.call(d.context, t, n, r, i, s), !0;
            }
            for(c = 1, a = new Array(h - 1); c < h; c++)a[c - 1] = arguments[c];
            d.fn.apply(d.context, a);
        } else {
            var p, l = d.length;
            for(c = 0; c < l; c++)switch(d[c].once && this.removeListener(e, d[c].fn, void 0, !0), h){
                case 1:
                    d[c].fn.call(d[c].context);
                    break;
                case 2:
                    d[c].fn.call(d[c].context, t);
                    break;
                case 3:
                    d[c].fn.call(d[c].context, t, n);
                    break;
                case 4:
                    d[c].fn.call(d[c].context, t, n, r);
                    break;
                default:
                    if (!a) for(p = 1, a = new Array(h - 1); p < h; p++)a[p - 1] = arguments[p];
                    d[c].fn.apply(d[c].context, a);
            }
        }
        return !0;
    }, Ie.prototype.on = function(e, t, n) {
        return Pe(this, e, t, n, !1);
    }, Ie.prototype.once = function(e, t, n) {
        return Pe(this, e, t, n, !0);
    }, Ie.prototype.removeListener = function(e, t, n, r) {
        var i = we ? we + e : e;
        if (!this._events[i]) return this;
        if (!t) return De(this, i), this;
        var s = this._events[i];
        if (s.fn) s.fn !== t || r && !s.once || n && s.context !== n || De(this, i);
        else {
            for(var o = 0, a = [], c = s.length; o < c; o++)(s[o].fn !== t || r && !s[o].once || n && s[o].context !== n) && a.push(s[o]);
            a.length ? this._events[i] = 1 === a.length ? a[0] : a : De(this, i);
        }
        return this;
    }, Ie.prototype.removeAllListeners = function(e) {
        var t;
        return e ? (t = we ? we + e : e, this._events[t] && De(this, t)) : (this._events = new Ee, this._eventsCount = 0), this;
    }, Ie.prototype.off = Ie.prototype.removeListener, Ie.prototype.addListener = Ie.prototype.on, Ie.prefixed = we, Ie.EventEmitter = Ie, Te = Ie;
    var Oe, xe, Ae, Me, Ne, je, Le, Be, ze, Ue, Fe, $e, He, Ve, Ge = {};
    le(Ge, "ConnectionType", ()=>Oe), le(Ge, "PeerErrorType", ()=>Ae), le(Ge, "BaseConnectionErrorType", ()=>Ne), le(Ge, "DataConnectionErrorType", ()=>Le), le(Ge, "SerializationType", ()=>ze), le(Ge, "SocketEventType", ()=>Fe), le(Ge, "ServerMessageType", ()=>He), (xe = Oe || (Oe = {})).Data = "data", xe.Media = "media", (Me = Ae || (Ae = {})).BrowserIncompatible = "browser-incompatible", Me.Disconnected = "disconnected", Me.InvalidID = "invalid-id", Me.InvalidKey = "invalid-key", Me.Network = "network", Me.PeerUnavailable = "peer-unavailable", Me.SslUnavailable = "ssl-unavailable", Me.ServerError = "server-error", Me.SocketError = "socket-error", Me.SocketClosed = "socket-closed", Me.UnavailableID = "unavailable-id", Me.WebRTC = "webrtc", (je = Ne || (Ne = {})).NegotiationFailed = "negotiation-failed", je.ConnectionClosed = "connection-closed", (Be = Le || (Le = {})).NotOpenYet = "not-open-yet", Be.MessageToBig = "message-too-big", (Ue = ze || (ze = {})).Binary = "binary", Ue.BinaryUTF8 = "binary-utf8", Ue.JSON = "json", Ue.None = "raw", ($e = Fe || (Fe = {})).Message = "message", $e.Disconnected = "disconnected", $e.Error = "error", $e.Close = "close", (Ve = He || (He = {})).Heartbeat = "HEARTBEAT", Ve.Candidate = "CANDIDATE", Ve.Offer = "OFFER", Ve.Answer = "ANSWER", Ve.Open = "OPEN", Ve.Error = "ERROR", Ve.IdTaken = "ID-TAKEN", Ve.InvalidKey = "INVALID-KEY", Ve.Leave = "LEAVE", Ve.Expire = "EXPIRE";
    var Je;
    Je = JSON.parse('{"name":"peerjs","version":"1.5.4","keywords":["peerjs","webrtc","p2p","rtc"],"description":"PeerJS client","homepage":"https://peerjs.com","bugs":{"url":"https://github.com/peers/peerjs/issues"},"repository":{"type":"git","url":"https://github.com/peers/peerjs"},"license":"MIT","contributors":["Michelle Bu <michelle@michellebu.com>","afrokick <devbyru@gmail.com>","ericz <really.ez@gmail.com>","Jairo <kidandcat@gmail.com>","Jonas Gloning <34194370+jonasgloning@users.noreply.github.com>","Jairo Caro-Accino Viciana <jairo@galax.be>","Carlos Caballero <carlos.caballero.gonzalez@gmail.com>","hc <hheennrryy@gmail.com>","Muhammad Asif <capripio@gmail.com>","PrashoonB <prashoonbhattacharjee@gmail.com>","Harsh Bardhan Mishra <47351025+HarshCasper@users.noreply.github.com>","akotynski <aleksanderkotbury@gmail.com>","lmb <i@lmb.io>","Jairooo <jairocaro@msn.com>","Moritz St\xfcckler <moritz.stueckler@gmail.com>","Simon <crydotsnakegithub@gmail.com>","Denis Lukov <denismassters@gmail.com>","Philipp Hancke <fippo@andyet.net>","Hans Oksendahl <hansoksendahl@gmail.com>","Jess <jessachandler@gmail.com>","khankuan <khankuan@gmail.com>","DUODVK <kurmanov.work@gmail.com>","XiZhao <kwang1imsa@gmail.com>","Matthias Lohr <matthias@lohr.me>","=frank tree <=frnktrb@googlemail.com>","Andre Eckardt <aeckardt@outlook.com>","Chris Cowan <agentme49@gmail.com>","Alex Chuev <alex@chuev.com>","alxnull <alxnull@e.mail.de>","Yemel Jardi <angel.jardi@gmail.com>","Ben Parnell <benjaminparnell.94@gmail.com>","Benny Lichtner <bennlich@gmail.com>","fresheneesz <bitetrudpublic@gmail.com>","bob.barstead@exaptive.com <bob.barstead@exaptive.com>","chandika <chandika@gmail.com>","emersion <contact@emersion.fr>","Christopher Van <cvan@users.noreply.github.com>","eddieherm <edhermoso@gmail.com>","Eduardo Pinho <enet4mikeenet@gmail.com>","Evandro Zanatta <ezanatta@tray.net.br>","Gardner Bickford <gardner@users.noreply.github.com>","Gian Luca <gianluca.cecchi@cynny.com>","PatrickJS <github@gdi2290.com>","jonnyf <github@jonathanfoss.co.uk>","Hizkia Felix <hizkifw@gmail.com>","Hristo Oskov <hristo.oskov@gmail.com>","Isaac Madwed <i.madwed@gmail.com>","Ilya Konanykhin <ilya.konanykhin@gmail.com>","jasonbarry <jasbarry@me.com>","Jonathan Burke <jonathan.burke.1311@googlemail.com>","Josh Hamit <josh.hamit@gmail.com>","Jordan Austin <jrax86@gmail.com>","Joel Wetzell <jwetzell@yahoo.com>","xizhao <kevin.wang@cloudera.com>","Alberto Torres <kungfoobar@gmail.com>","Jonathan Mayol <mayoljonathan@gmail.com>","Jefferson Felix <me@jsfelix.dev>","Rolf Erik Lekang <me@rolflekang.com>","Kevin Mai-Husan Chia <mhchia@users.noreply.github.com>","Pepijn de Vos <pepijndevos@gmail.com>","JooYoung <qkdlql@naver.com>","Tobias Speicher <rootcommander@gmail.com>","Steve Blaurock <sblaurock@gmail.com>","Kyrylo Shegeda <shegeda@ualberta.ca>","Diwank Singh Tomer <singh@diwank.name>","So\u0308ren Balko <Soeren.Balko@gmail.com>","Arpit Solanki <solankiarpit1997@gmail.com>","Yuki Ito <yuki@gnnk.net>","Artur Zayats <zag2art@gmail.com>"],"funding":{"type":"opencollective","url":"https://opencollective.com/peer"},"collective":{"type":"opencollective","url":"https://opencollective.com/peer"},"files":["dist/*"],"sideEffects":["lib/global.ts","lib/supports.ts"],"main":"dist/bundler.cjs","module":"dist/bundler.mjs","browser-minified":"dist/peerjs.min.js","browser-unminified":"dist/peerjs.js","browser-minified-msgpack":"dist/serializer.msgpack.mjs","types":"dist/types.d.ts","engines":{"node":">= 14"},"targets":{"types":{"source":"lib/exports.ts"},"main":{"source":"lib/exports.ts","sourceMap":{"inlineSources":true}},"module":{"source":"lib/exports.ts","includeNodeModules":["eventemitter3"],"sourceMap":{"inlineSources":true}},"browser-minified":{"context":"browser","outputFormat":"global","optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 80, safari >= 15"},"source":"lib/global.ts"},"browser-unminified":{"context":"browser","outputFormat":"global","optimize":false,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 80, safari >= 15"},"source":"lib/global.ts"},"browser-minified-msgpack":{"context":"browser","outputFormat":"esmodule","isLibrary":true,"optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 102, safari >= 15"},"source":"lib/dataconnection/StreamConnection/MsgPack.ts"}},"scripts":{"contributors":"git-authors-cli --print=false && prettier --write package.json && git add package.json package-lock.json && git commit -m \\"chore(contributors): update and sort contributors list\\"","check":"tsc --noEmit && tsc -p e2e/tsconfig.json --noEmit","watch":"parcel watch","build":"rm -rf dist && parcel build","prepublishOnly":"npm run build","test":"jest","test:watch":"jest --watch","coverage":"jest --coverage --collectCoverageFrom=\\"./lib/**\\"","format":"prettier --write .","format:check":"prettier --check .","semantic-release":"semantic-release","e2e":"wdio run e2e/wdio.local.conf.ts","e2e:bstack":"wdio run e2e/wdio.bstack.conf.ts"},"devDependencies":{"@parcel/config-default":"^2.9.3","@parcel/packager-ts":"^2.9.3","@parcel/transformer-typescript-tsc":"^2.9.3","@parcel/transformer-typescript-types":"^2.9.3","@semantic-release/changelog":"^6.0.1","@semantic-release/git":"^10.0.1","@swc/core":"^1.3.27","@swc/jest":"^0.2.24","@types/jasmine":"^4.3.4","@wdio/browserstack-service":"^8.11.2","@wdio/cli":"^8.11.2","@wdio/globals":"^8.11.2","@wdio/jasmine-framework":"^8.11.2","@wdio/local-runner":"^8.11.2","@wdio/spec-reporter":"^8.11.2","@wdio/types":"^8.10.4","http-server":"^14.1.1","jest":"^29.3.1","jest-environment-jsdom":"^29.3.1","mock-socket":"^9.0.0","parcel":"^2.9.3","prettier":"^3.0.0","semantic-release":"^21.0.0","ts-node":"^10.9.1","typescript":"^5.0.0","wdio-geckodriver-service":"^5.0.1"},"dependencies":{"@msgpack/msgpack":"^2.8.0","eventemitter3":"^4.0.7","peerjs-js-binarypack":"^2.1.0","webrtc-adapter":"^9.0.0"},"alias":{"process":false,"buffer":false}}');
    class Ke extends Te.EventEmitter {
        constructor(e, t, n, r, i, s = 5e3){
            super(), this.pingInterval = s, this._disconnected = !0, this._messagesQueue = [];
            const o = e ? "wss://" : "ws://";
            this._baseUrl = o + t + ":" + n + r + "peerjs?key=" + i;
        }
        start(e, t) {
            this._id = e;
            const n = `${this._baseUrl}&id=${e}&token=${t}`;
            !this._socket && this._disconnected && (this._socket = new WebSocket(n + "&version=" + Je.version), this._disconnected = !1, this._socket.onmessage = (e)=>{
                let t;
                try {
                    t = JSON.parse(e.data), Se.log("Server message received:", t);
                } catch (t) {
                    return void Se.log("Invalid server message", e.data);
                }
                this.emit(Fe.Message, t);
            }, this._socket.onclose = (e)=>{
                this._disconnected || (Se.log("Socket closed.", e), this._cleanup(), this._disconnected = !0, this.emit(Fe.Disconnected));
            }, this._socket.onopen = ()=>{
                this._disconnected || (this._sendQueuedMessages(), Se.log("Socket open"), this._scheduleHeartbeat());
            });
        }
        _scheduleHeartbeat() {
            this._wsPingTimer = setTimeout(()=>{
                this._sendHeartbeat();
            }, this.pingInterval);
        }
        _sendHeartbeat() {
            if (!this._wsOpen()) return void Se.log("Cannot send heartbeat, because socket closed");
            const e = JSON.stringify({
                type: He.Heartbeat
            });
            this._socket.send(e), this._scheduleHeartbeat();
        }
        _wsOpen() {
            return !!this._socket && 1 === this._socket.readyState;
        }
        _sendQueuedMessages() {
            const e = [
                ...this._messagesQueue
            ];
            this._messagesQueue = [];
            for (const t of e)this.send(t);
        }
        send(e) {
            if (this._disconnected) return;
            if (!this._id) return void this._messagesQueue.push(e);
            if (!e.type) return void this.emit(Fe.Error, "Invalid message");
            if (!this._wsOpen()) return;
            const t = JSON.stringify(e);
            this._socket.send(t);
        }
        close() {
            this._disconnected || (this._cleanup(), this._disconnected = !0);
        }
        _cleanup() {
            this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(), this._socket = void 0), clearTimeout(this._wsPingTimer);
        }
    }
    class We {
        constructor(e){
            this.connection = e;
        }
        startConnection(e) {
            const t = this._startPeerConnection();
            if (this.connection.peerConnection = t, this.connection.type === Oe.Media && e._stream && this._addTracksToConnection(e._stream, t), e.originator) {
                const n = this.connection, r = {
                    ordered: !!e.reliable
                }, i = t.createDataChannel(n.label, r);
                n._initializeDataChannel(i), this._makeOffer();
            } else this.handleSDP("OFFER", e.sdp);
        }
        _startPeerConnection() {
            Se.log("Creating RTCPeerConnection.");
            const e = new RTCPeerConnection(this.connection.provider.options.config);
            return this._setupListeners(e), e;
        }
        _setupListeners(e) {
            const t = this.connection.peer, n = this.connection.connectionId, r = this.connection.type, i = this.connection.provider;
            Se.log("Listening for ICE candidates."), e.onicecandidate = (e)=>{
                e.candidate && e.candidate.candidate && (Se.log(`Received ICE candidates for ${t}:`, e.candidate), i.socket.send({
                    type: He.Candidate,
                    payload: {
                        candidate: e.candidate,
                        type: r,
                        connectionId: n
                    },
                    dst: t
                }));
            }, e.oniceconnectionstatechange = ()=>{
                switch(e.iceConnectionState){
                    case "failed":
                        Se.log("iceConnectionState is failed, closing connections to " + t), this.connection.emitError(Ne.NegotiationFailed, "Negotiation of connection to " + t + " failed."), this.connection.close();
                        break;
                    case "closed":
                        Se.log("iceConnectionState is closed, closing connections to " + t), this.connection.emitError(Ne.ConnectionClosed, "Connection to " + t + " closed."), this.connection.close();
                        break;
                    case "disconnected":
                        Se.log("iceConnectionState changed to disconnected on the connection with " + t);
                        break;
                    case "completed":
                        e.onicecandidate = ()=>{};
                }
                this.connection.emit("iceStateChanged", e.iceConnectionState);
            }, Se.log("Listening for data channel"), e.ondatachannel = (e)=>{
                Se.log("Received data channel");
                const r = e.channel;
                i.getConnection(t, n)._initializeDataChannel(r);
            }, Se.log("Listening for remote stream"), e.ontrack = (e)=>{
                Se.log("Received remote stream");
                const r = e.streams[0], s = i.getConnection(t, n);
                if (s.type === Oe.Media) {
                    const e = s;
                    this._addStreamToMediaConnection(r, e);
                }
            };
        }
        cleanup() {
            Se.log("Cleaning up PeerConnection to " + this.connection.peer);
            const e = this.connection.peerConnection;
            if (!e) return;
            this.connection.peerConnection = null, e.onicecandidate = e.oniceconnectionstatechange = e.ondatachannel = e.ontrack = ()=>{};
            const t = "closed" !== e.signalingState;
            let n = !1;
            const r = this.connection.dataChannel;
            r && (n = !!r.readyState && "closed" !== r.readyState), (t || n) && e.close();
        }
        async _makeOffer() {
            const e = this.connection.peerConnection, t = this.connection.provider;
            try {
                const n = await e.createOffer(this.connection.options.constraints);
                Se.log("Created offer."), this.connection.options.sdpTransform && "function" == typeof this.connection.options.sdpTransform && (n.sdp = this.connection.options.sdpTransform(n.sdp) || n.sdp);
                try {
                    await e.setLocalDescription(n), Se.log("Set localDescription:", n, `for:${this.connection.peer}`);
                    let r = {
                        sdp: n,
                        type: this.connection.type,
                        connectionId: this.connection.connectionId,
                        metadata: this.connection.metadata
                    };
                    if (this.connection.type === Oe.Data) {
                        const e = this.connection;
                        r = {
                            ...r,
                            label: e.label,
                            reliable: e.reliable,
                            serialization: e.serialization
                        };
                    }
                    t.socket.send({
                        type: He.Offer,
                        payload: r,
                        dst: this.connection.peer
                    });
                } catch (e) {
                    "OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer" != e && (t.emitError(Ae.WebRTC, e), Se.log("Failed to setLocalDescription, ", e));
                }
            } catch (e) {
                t.emitError(Ae.WebRTC, e), Se.log("Failed to createOffer, ", e);
            }
        }
        async _makeAnswer() {
            const e = this.connection.peerConnection, t = this.connection.provider;
            try {
                const n = await e.createAnswer();
                Se.log("Created answer."), this.connection.options.sdpTransform && "function" == typeof this.connection.options.sdpTransform && (n.sdp = this.connection.options.sdpTransform(n.sdp) || n.sdp);
                try {
                    await e.setLocalDescription(n), Se.log("Set localDescription:", n, `for:${this.connection.peer}`), t.socket.send({
                        type: He.Answer,
                        payload: {
                            sdp: n,
                            type: this.connection.type,
                            connectionId: this.connection.connectionId
                        },
                        dst: this.connection.peer
                    });
                } catch (e) {
                    t.emitError(Ae.WebRTC, e), Se.log("Failed to setLocalDescription, ", e);
                }
            } catch (e) {
                t.emitError(Ae.WebRTC, e), Se.log("Failed to create answer, ", e);
            }
        }
        async handleSDP(e, t) {
            t = new RTCSessionDescription(t);
            const n = this.connection.peerConnection, r = this.connection.provider;
            Se.log("Setting remote description", t);
            const i = this;
            try {
                await n.setRemoteDescription(t), Se.log(`Set remoteDescription:${e} for:${this.connection.peer}`), "OFFER" === e && await i._makeAnswer();
            } catch (e) {
                r.emitError(Ae.WebRTC, e), Se.log("Failed to setRemoteDescription, ", e);
            }
        }
        async handleCandidate(e) {
            Se.log("handleCandidate:", e);
            try {
                await this.connection.peerConnection.addIceCandidate(e), Se.log(`Added ICE candidate for:${this.connection.peer}`);
            } catch (e) {
                this.connection.provider.emitError(Ae.WebRTC, e), Se.log("Failed to handleCandidate, ", e);
            }
        }
        _addTracksToConnection(e, t) {
            if (Se.log(`add tracks from stream ${e.id} to peer connection`), !t.addTrack) return Se.error("Your browser does't support RTCPeerConnection#addTrack. Ignored.");
            e.getTracks().forEach((n)=>{
                t.addTrack(n, e);
            });
        }
        _addStreamToMediaConnection(e, t) {
            Se.log(`add stream ${e.id} to media connection ${t.connectionId}`), t.addStream(e);
        }
    }
    class Qe extends Te.EventEmitter {
        emitError(e, t) {
            Se.error("Error:", t), this.emit("error", new Ye(`${e}`, t));
        }
    }
    class Ye extends Error {
        constructor(e, t){
            "string" == typeof t ? super(t) : (super(), Object.assign(this, t)), this.type = e;
        }
    }
    class Xe extends Qe {
        get open() {
            return this._open;
        }
        constructor(e, t, n){
            super(), this.peer = e, this.provider = t, this.options = n, this._open = !1, this.metadata = n.metadata;
        }
    }
    class qe extends Xe {
        static #e = this.ID_PREFIX = "mc_";
        get type() {
            return Oe.Media;
        }
        get localStream() {
            return this._localStream;
        }
        get remoteStream() {
            return this._remoteStream;
        }
        constructor(e, t, n){
            super(e, t, n), this._localStream = this.options._stream, this.connectionId = this.options.connectionId || qe.ID_PREFIX + _e.randomToken(), this._negotiator = new We(this), this._localStream && this._negotiator.startConnection({
                _stream: this._localStream,
                originator: !0
            });
        }
        _initializeDataChannel(e) {
            this.dataChannel = e, this.dataChannel.onopen = ()=>{
                Se.log(`DC#${this.connectionId} dc connection success`), this.emit("willCloseOnRemote");
            }, this.dataChannel.onclose = ()=>{
                Se.log(`DC#${this.connectionId} dc closed for:`, this.peer), this.close();
            };
        }
        addStream(e) {
            Se.log("Receiving stream", e), this._remoteStream = e, super.emit("stream", e);
        }
        handleMessage(e) {
            const t = e.type, n = e.payload;
            switch(e.type){
                case He.Answer:
                    this._negotiator.handleSDP(t, n.sdp), this._open = !0;
                    break;
                case He.Candidate:
                    this._negotiator.handleCandidate(n.candidate);
                    break;
                default:
                    Se.warn(`Unrecognized message type:${t} from peer:${this.peer}`);
            }
        }
        answer(e, t = {}) {
            if (this._localStream) return void Se.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");
            this._localStream = e, t && t.sdpTransform && (this.options.sdpTransform = t.sdpTransform), this._negotiator.startConnection({
                ...this.options._payload,
                _stream: e
            });
            const n = this.provider._getMessages(this.connectionId);
            for (const e of n)this.handleMessage(e);
            this._open = !0;
        }
        close() {
            this._negotiator && (this._negotiator.cleanup(), this._negotiator = null), this._localStream = null, this._remoteStream = null, this.provider && (this.provider._removeConnection(this), this.provider = null), this.options && this.options._stream && (this.options._stream = null), this.open && (this._open = !1, super.emit("close"));
        }
    }
    class Ze {
        constructor(e){
            this._options = e;
        }
        _buildRequest(e) {
            const t = this._options.secure ? "https" : "http", { host: n, port: r, path: i, key: s } = this._options, o = new URL(`${t}://${n}:${r}${i}${s}/${e}`);
            return o.searchParams.set("ts", `${Date.now()}${Math.random()}`), o.searchParams.set("version", Je.version), fetch(o.href, {
                referrerPolicy: this._options.referrerPolicy
            });
        }
        async retrieveId() {
            try {
                const e = await this._buildRequest("id");
                if (200 !== e.status) throw new Error(`Error. Status:${e.status}`);
                return e.text();
            } catch (e) {
                Se.error("Error retrieving ID", e);
                let t = "";
                throw "/" === this._options.path && this._options.host !== _e.CLOUD_HOST && (t = " If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer."), new Error("Could not get an ID from the server." + t);
            }
        }
        async listAllPeers() {
            try {
                const e = await this._buildRequest("peers");
                if (200 !== e.status) {
                    if (401 === e.status) {
                        let e = "";
                        throw e = this._options.host === _e.CLOUD_HOST ? "It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key." : "You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.", new Error("It doesn't look like you have permission to list peers IDs. " + e);
                    }
                    throw new Error(`Error. Status:${e.status}`);
                }
                return e.json();
            } catch (e) {
                throw Se.error("Error retrieving list peers", e), new Error("Could not get list peers from the server." + e);
            }
        }
    }
    class et extends Xe {
        static #e = this.ID_PREFIX = "dc_";
        static #t = this.MAX_BUFFERED_AMOUNT = 8388608;
        get type() {
            return Oe.Data;
        }
        constructor(e, t, n){
            super(e, t, n), this.connectionId = this.options.connectionId || et.ID_PREFIX + ye(), this.label = this.options.label || this.connectionId, this.reliable = !!this.options.reliable, this._negotiator = new We(this), this._negotiator.startConnection(this.options._payload || {
                originator: !0,
                reliable: this.reliable
            });
        }
        _initializeDataChannel(e) {
            this.dataChannel = e, this.dataChannel.onopen = ()=>{
                Se.log(`DC#${this.connectionId} dc connection success`), this._open = !0, this.emit("open");
            }, this.dataChannel.onmessage = (e)=>{
                Se.log(`DC#${this.connectionId} dc onmessage:`, e.data);
            }, this.dataChannel.onclose = ()=>{
                Se.log(`DC#${this.connectionId} dc closed for:`, this.peer), this.close();
            };
        }
        close(e) {
            e?.flush ? this.send({
                __peerData: {
                    type: "close"
                }
            }) : (this._negotiator && (this._negotiator.cleanup(), this._negotiator = null), this.provider && (this.provider._removeConnection(this), this.provider = null), this.dataChannel && (this.dataChannel.onopen = null, this.dataChannel.onmessage = null, this.dataChannel.onclose = null, this.dataChannel = null), this.open && (this._open = !1, super.emit("close")));
        }
        send(e, t = !1) {
            if (this.open) return this._send(e, t);
            this.emitError(Le.NotOpenYet, "Connection is not open. You should listen for the `open` event before sending messages.");
        }
        async handleMessage(e) {
            const t = e.payload;
            switch(e.type){
                case He.Answer:
                    await this._negotiator.handleSDP(e.type, t.sdp);
                    break;
                case He.Candidate:
                    await this._negotiator.handleCandidate(t.candidate);
                    break;
                default:
                    Se.warn("Unrecognized message type:", e.type, "from peer:", this.peer);
            }
        }
    }
    class tt extends et {
        get bufferSize() {
            return this._bufferSize;
        }
        _initializeDataChannel(e) {
            super._initializeDataChannel(e), this.dataChannel.binaryType = "arraybuffer", this.dataChannel.addEventListener("message", (e)=>this._handleDataMessage(e));
        }
        _bufferedSend(e) {
            !this._buffering && this._trySend(e) || (this._buffer.push(e), this._bufferSize = this._buffer.length);
        }
        _trySend(e) {
            if (!this.open) return !1;
            if (this.dataChannel.bufferedAmount > et.MAX_BUFFERED_AMOUNT) return this._buffering = !0, setTimeout(()=>{
                this._buffering = !1, this._tryBuffer();
            }, 50), !1;
            try {
                this.dataChannel.send(e);
            } catch (e) {
                return Se.error(`DC#:${this.connectionId} Error when sending:`, e), this._buffering = !0, this.close(), !1;
            }
            return !0;
        }
        _tryBuffer() {
            if (!this.open) return;
            if (0 === this._buffer.length) return;
            const e = this._buffer[0];
            this._trySend(e) && (this._buffer.shift(), this._bufferSize = this._buffer.length, this._tryBuffer());
        }
        close(e) {
            e?.flush ? this.send({
                __peerData: {
                    type: "close"
                }
            }) : (this._buffer = [], this._bufferSize = 0, super.close());
        }
        constructor(...e){
            super(...e), this._buffer = [], this._bufferSize = 0, this._buffering = !1;
        }
    }
    class nt extends tt {
        close(e) {
            super.close(e), this._chunkedData = {};
        }
        constructor(e, t, n){
            super(e, t, n), this.chunker = new ue, this.serialization = ze.Binary, this._chunkedData = {};
        }
        _handleDataMessage({ data: e }) {
            const t = n(e), r = t.__peerData;
            if (r) return "close" === r.type ? void this.close() : void this._handleChunk(t);
            this.emit("data", t);
        }
        _handleChunk(e) {
            const t = e.__peerData, n = this._chunkedData[t] || {
                data: [],
                count: 0,
                total: e.total
            };
            if (n.data[e.n] = new Uint8Array(e.data), n.count++, this._chunkedData[t] = n, n.total === n.count) {
                delete this._chunkedData[t];
                const e = function(e) {
                    let t = 0;
                    for (const n of e)t += n.byteLength;
                    const n = new Uint8Array(t);
                    let r = 0;
                    for (const t of e)n.set(t, r), r += t.byteLength;
                    return n;
                }(n.data);
                this._handleDataMessage({
                    data: e
                });
            }
        }
        _send(e, t) {
            const n = r(e);
            if (n instanceof Promise) return this._send_blob(n);
            !t && n.byteLength > this.chunker.chunkedMTU ? this._sendChunks(n) : this._bufferedSend(n);
        }
        async _send_blob(e) {
            const t = await e;
            t.byteLength > this.chunker.chunkedMTU ? this._sendChunks(t) : this._bufferedSend(t);
        }
        _sendChunks(e) {
            const t = this.chunker.chunk(e);
            Se.log(`DC#${this.connectionId} Try to send ${t.length} chunks...`);
            for (const e of t)this.send(e, !0);
        }
    }
    class rt extends tt {
        _handleDataMessage({ data: e }) {
            super.emit("data", e);
        }
        _send(e, t) {
            this._bufferedSend(e);
        }
        constructor(...e){
            super(...e), this.serialization = ze.None;
        }
    }
    class it extends tt {
        _handleDataMessage({ data: e }) {
            const t = this.parse(this.decoder.decode(e)), n = t.__peerData;
            n && "close" === n.type ? this.close() : this.emit("data", t);
        }
        _send(e, t) {
            const n = this.encoder.encode(this.stringify(e));
            n.byteLength >= _e.chunkedMTU ? this.emitError(Le.MessageToBig, "Message too big for JSON channel") : this._bufferedSend(n);
        }
        constructor(...e){
            super(...e), this.serialization = ze.JSON, this.encoder = new TextEncoder, this.decoder = new TextDecoder, this.stringify = JSON.stringify, this.parse = JSON.parse;
        }
    }
    class st extends Qe {
        static #e = this.DEFAULT_KEY = "peerjs";
        get id() {
            return this._id;
        }
        get options() {
            return this._options;
        }
        get open() {
            return this._open;
        }
        get socket() {
            return this._socket;
        }
        get connections() {
            const e = Object.create(null);
            for (const [t, n] of this._connections)e[t] = n;
            return e;
        }
        get destroyed() {
            return this._destroyed;
        }
        get disconnected() {
            return this._disconnected;
        }
        constructor(e, t){
            let n;
            super(), this._serializers = {
                raw: rt,
                json: it,
                binary: nt,
                "binary-utf8": nt,
                default: nt
            }, this._id = null, this._lastServerId = null, this._destroyed = !1, this._disconnected = !1, this._open = !1, this._connections = new Map, this._lostMessages = new Map, e && e.constructor == Object ? t = e : e && (n = e.toString()), t = {
                debug: 0,
                host: _e.CLOUD_HOST,
                port: _e.CLOUD_PORT,
                path: "/",
                key: st.DEFAULT_KEY,
                token: _e.randomToken(),
                config: _e.defaultConfig,
                referrerPolicy: "strict-origin-when-cross-origin",
                serializers: {},
                ...t
            }, this._options = t, this._serializers = {
                ...this._serializers,
                ...this.options.serializers
            }, "/" === this._options.host && (this._options.host = window.location.hostname), this._options.path && ("/" !== this._options.path[0] && (this._options.path = "/" + this._options.path), "/" !== this._options.path[this._options.path.length - 1] && (this._options.path += "/")), void 0 === this._options.secure && this._options.host !== _e.CLOUD_HOST ? this._options.secure = _e.isSecure() : this._options.host == _e.CLOUD_HOST && (this._options.secure = !0), this._options.logFunction && Se.setLogFunction(this._options.logFunction), Se.logLevel = this._options.debug || 0, this._api = new Ze(t), this._socket = this._createServerConnection(), _e.supports.audioVideo || _e.supports.data ? !n || _e.validateId(n) ? n ? this._initialize(n) : this._api.retrieveId().then((e)=>this._initialize(e)).catch((e)=>this._abort(Ae.ServerError, e)) : this._delayedAbort(Ae.InvalidID, `ID "${n}" is invalid`) : this._delayedAbort(Ae.BrowserIncompatible, "The current browser does not support WebRTC");
        }
        _createServerConnection() {
            const e = new Ke(this._options.secure, this._options.host, this._options.port, this._options.path, this._options.key, this._options.pingInterval);
            return e.on(Fe.Message, (e)=>{
                this._handleMessage(e);
            }), e.on(Fe.Error, (e)=>{
                this._abort(Ae.SocketError, e);
            }), e.on(Fe.Disconnected, ()=>{
                this.disconnected || (this.emitError(Ae.Network, "Lost connection to server."), this.disconnect());
            }), e.on(Fe.Close, ()=>{
                this.disconnected || this._abort(Ae.SocketClosed, "Underlying socket is already closed.");
            }), e;
        }
        _initialize(e) {
            this._id = e, this.socket.start(e, this._options.token);
        }
        _handleMessage(e) {
            const t = e.type, n = e.payload, r = e.src;
            switch(t){
                case He.Open:
                    this._lastServerId = this.id, this._open = !0, this.emit("open", this.id);
                    break;
                case He.Error:
                    this._abort(Ae.ServerError, n.msg);
                    break;
                case He.IdTaken:
                    this._abort(Ae.UnavailableID, `ID "${this.id}" is taken`);
                    break;
                case He.InvalidKey:
                    this._abort(Ae.InvalidKey, `API KEY "${this._options.key}" is invalid`);
                    break;
                case He.Leave:
                    Se.log(`Received leave message from ${r}`), this._cleanupPeer(r), this._connections.delete(r);
                    break;
                case He.Expire:
                    this.emitError(Ae.PeerUnavailable, `Could not connect to peer ${r}`);
                    break;
                case He.Offer:
                    {
                        const e = n.connectionId;
                        let t = this.getConnection(r, e);
                        if (t && (t.close(), Se.warn(`Offer received for existing Connection ID:${e}`)), n.type === Oe.Media) {
                            const i = new qe(r, this, {
                                connectionId: e,
                                _payload: n,
                                metadata: n.metadata
                            });
                            t = i, this._addConnection(r, t), this.emit("call", i);
                        } else {
                            if (n.type !== Oe.Data) return void Se.warn(`Received malformed connection type:${n.type}`);
                            {
                                const i = new this._serializers[n.serialization](r, this, {
                                    connectionId: e,
                                    _payload: n,
                                    metadata: n.metadata,
                                    label: n.label,
                                    serialization: n.serialization,
                                    reliable: n.reliable
                                });
                                t = i, this._addConnection(r, t), this.emit("connection", i);
                            }
                        }
                        const i = this._getMessages(e);
                        for (const e of i)t.handleMessage(e);
                        break;
                    }
                default:
                    {
                        if (!n) return void Se.warn(`You received a malformed message from ${r} of type ${t}`);
                        const i = n.connectionId, s = this.getConnection(r, i);
                        s && s.peerConnection ? s.handleMessage(e) : i ? this._storeMessage(i, e) : Se.warn("You received an unrecognized message:", e);
                        break;
                    }
            }
        }
        _storeMessage(e, t) {
            this._lostMessages.has(e) || this._lostMessages.set(e, []), this._lostMessages.get(e).push(t);
        }
        _getMessages(e) {
            const t = this._lostMessages.get(e);
            return t ? (this._lostMessages.delete(e), t) : [];
        }
        connect(e, t = {}) {
            if (t = {
                serialization: "default",
                ...t
            }, this.disconnected) return Se.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available."), void this.emitError(Ae.Disconnected, "Cannot connect to new Peer after disconnecting from server.");
            const n = new this._serializers[t.serialization](e, this, t);
            return this._addConnection(e, n), n;
        }
        call(e, t, n = {}) {
            if (this.disconnected) return Se.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect."), void this.emitError(Ae.Disconnected, "Cannot connect to new Peer after disconnecting from server.");
            if (!t) return void Se.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");
            const r = new qe(e, this, {
                ...n,
                _stream: t
            });
            return this._addConnection(e, r), r;
        }
        _addConnection(e, t) {
            Se.log(`add connection ${t.type}:${t.connectionId} to peerId:${e}`), this._connections.has(e) || this._connections.set(e, []), this._connections.get(e).push(t);
        }
        _removeConnection(e) {
            const t = this._connections.get(e.peer);
            if (t) {
                const n = t.indexOf(e);
                -1 !== n && t.splice(n, 1);
            }
            this._lostMessages.delete(e.connectionId);
        }
        getConnection(e, t) {
            const n = this._connections.get(e);
            if (!n) return null;
            for (const e of n)if (e.connectionId === t) return e;
            return null;
        }
        _delayedAbort(e, t) {
            setTimeout(()=>{
                this._abort(e, t);
            }, 0);
        }
        _abort(e, t) {
            Se.error("Aborting!"), this.emitError(e, t), this._lastServerId ? this.disconnect() : this.destroy();
        }
        destroy() {
            this.destroyed || (Se.log(`Destroy peer with ID:${this.id}`), this.disconnect(), this._cleanup(), this._destroyed = !0, this.emit("close"));
        }
        _cleanup() {
            for (const e of this._connections.keys())this._cleanupPeer(e), this._connections.delete(e);
            this.socket.removeAllListeners();
        }
        _cleanupPeer(e) {
            const t = this._connections.get(e);
            if (t) for (const e of t)e.close();
        }
        disconnect() {
            if (this.disconnected) return;
            const e = this.id;
            Se.log(`Disconnect peer with ID:${e}`), this._disconnected = !0, this._open = !1, this.socket.close(), this._lastServerId = e, this._id = null, this.emit("disconnected", e);
        }
        reconnect() {
            if (this.disconnected && !this.destroyed) Se.log(`Attempting reconnection to server with ID ${this._lastServerId}`), this._disconnected = !1, this._initialize(this._lastServerId);
            else {
                if (this.destroyed) throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");
                if (this.disconnected || this.open) throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`);
                Se.error("In a hurry? We're still trying to make the initial connection!");
            }
        }
        listAllPeers(e = (e)=>{}) {
            this._api.listAllPeers().then((t)=>e(t)).catch((e)=>this._abort(Ae.ServerError, e));
        }
    }
    var ot = st;
    class at extends Error {
        constructor(e, t = {}){
            super(e), this.name = "NgrokError", this.details = t, this.timestamp = (new Date).toISOString(), this.troubleshooting = [
                "Verify the ngrok tunnel is running",
                "Check if the ngrok URL is correct",
                "Ensure the Kinectron application is running"
            ];
        }
    }
    class ct extends at {
        constructor(e, t = {}){
            super(e, {
                ...t,
                type: "validation_error"
            }), this.name = "NgrokValidationError", this.troubleshooting = [
                'Ensure the URL includes "ngrok-free.app"',
                "Copy the URL directly from the Kinectron application",
                "Make sure to include the full domain name"
            ];
        }
    }
    const dt = {
        code: "NGROK_001",
        message: "Invalid ngrok URL format"
    };
    const ht = {
        host: "127.0.0.1",
        port: 9001,
        path: "/",
        secure: !1,
        debug: 3,
        role: "default",
        config: {
            iceServers: [],
            sdpSemantics: "unified-plan"
        }
    };
    function pt(e) {
        if (!e) return ht;
        if ("string" == typeof e && e.includes("ngrok")) try {
            return function(e) {
                if (!e.includes("ngrok-free.app")) throw new ct(dt.message, {
                    code: dt.code,
                    url: e,
                    reason: "URL must include ngrok-free.app domain"
                });
            }(e), {
                host: e,
                port: "443",
                path: "/",
                secure: !0,
                debug: 3,
                config: {
                    iceServers: [],
                    sdpSemantics: "unified-plan"
                }
            };
        } catch (e) {
            throw e instanceof ct && (e.details.context = "peer_config_validation", e.details.timestamp = (new Date).toISOString()), e;
        }
        return "string" == typeof e ? {
            ...ht,
            host: e
        } : {
            ...ht,
            ...e
        };
    }
    class lt extends Error {
        constructor(e, t = {}){
            super(e), this.name = "NgrokClientError", this.details = t, this.timestamp = (new Date).toISOString(), this.troubleshooting = [
                "Check if the ngrok tunnel is running",
                "Verify the URL is correct",
                "Ensure the Kinectron application is running"
            ];
        }
    }
    class ut {
        static STATES = {
            DISCONNECTED: "disconnected",
            VALIDATING: "validating",
            CONNECTING: "connecting",
            CONNECTED: "connected",
            RECONNECTING: "reconnecting",
            ERROR: "error"
        };
        static VALID_TRANSITIONS = {
            [ut.STATES.DISCONNECTED]: [
                ut.STATES.VALIDATING,
                ut.STATES.CONNECTING
            ],
            [ut.STATES.VALIDATING]: [
                ut.STATES.CONNECTING,
                ut.STATES.ERROR
            ],
            [ut.STATES.CONNECTING]: [
                ut.STATES.CONNECTED,
                ut.STATES.RECONNECTING,
                ut.STATES.ERROR,
                ut.STATES.CONNECTING
            ],
            [ut.STATES.CONNECTED]: [
                ut.STATES.DISCONNECTED,
                ut.STATES.RECONNECTING,
                ut.STATES.ERROR,
                ut.STATES.CONNECTED
            ],
            [ut.STATES.RECONNECTING]: [
                ut.STATES.CONNECTED,
                ut.STATES.CONNECTING,
                ut.STATES.ERROR
            ],
            [ut.STATES.ERROR]: [
                ut.STATES.DISCONNECTED,
                ut.STATES.CONNECTING
            ]
        };
        constructor(){
            this.currentState = null, this.metadata = {
                url: null,
                startTime: null,
                lastStateChange: new Date,
                errorHistory: [],
                metrics: {
                    latency: {
                        current: 0,
                        average: 0,
                        samples: []
                    },
                    connectionQuality: "unknown",
                    reconnects: {
                        count: 0,
                        lastAttempt: null
                    },
                    errors: {
                        total: 0,
                        byType: {}
                    }
                }
            }, this.handlers = {
                stateChange: new Set,
                error: new Set,
                metrics: new Set
            };
        }
        on(e, t) {
            this.handlers[e] && this.handlers[e].add(t);
        }
        off(e, t) {
            this.handlers[e] && this.handlers[e].delete(t);
        }
        _emit(e, t) {
            this.handlers[e] && this.handlers[e].forEach((e)=>e(t));
        }
        getState() {
            return this.currentState;
        }
        getMetadata() {
            return {
                ...this.metadata,
                currentState: this.currentState,
                uptime: this._calculateUptime()
            };
        }
        updateMetrics(e) {
            void 0 !== e.latency && (this.metadata.metrics.latency.current = e.latency, this.metadata.metrics.latency.samples.push({
                value: e.latency,
                timestamp: new Date
            }), this.metadata.metrics.latency.samples.length > 10 && this.metadata.metrics.latency.samples.shift(), this.metadata.metrics.latency.average = this.metadata.metrics.latency.samples.reduce((e, t)=>e + t.value, 0) / this.metadata.metrics.latency.samples.length), this._updateConnectionQuality(), this._emit("metrics", this.metadata.metrics);
        }
        setState(e, t = {}) {
            if (!this._isValidTransition(e)) throw new lt(`Invalid state transition from ${this.currentState} to ${e}`, {
                from: this.currentState,
                to: e,
                details: t
            });
            const n = this.currentState;
            this.currentState = e, this.metadata.lastStateChange = new Date, e === ut.STATES.CONNECTED ? this.metadata.startTime || (this.metadata.startTime = new Date) : e === ut.STATES.RECONNECTING && (this.metadata.metrics.reconnects.count++, this.metadata.metrics.reconnects.lastAttempt = new Date), this._emit("stateChange", {
                from: n,
                to: e,
                timestamp: this.metadata.lastStateChange,
                details: t
            });
        }
        recordError(e, t = {}) {
            const n = {
                name: e.name,
                message: e.message,
                timestamp: new Date,
                context: t,
                state: this.currentState
            };
            this.metadata.errorHistory.unshift(n), this.metadata.errorHistory.length > 10 && this.metadata.errorHistory.pop(), this.metadata.metrics.errors.total++, this.metadata.metrics.errors.byType[e.name] = (this.metadata.metrics.errors.byType[e.name] || 0) + 1, this._emit("error", n);
        }
        reset() {
            this.currentState = null, this.metadata = {
                url: null,
                startTime: null,
                lastStateChange: new Date,
                errorHistory: [],
                metrics: {
                    latency: {
                        current: 0,
                        average: 0,
                        samples: []
                    },
                    connectionQuality: "unknown",
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
        _calculateUptime() {
            return this.metadata.startTime && this.currentState === ut.STATES.CONNECTED ? Date.now() - this.metadata.startTime.getTime() : 0;
        }
        _updateConnectionQuality() {
            const e = this.metadata.metrics.latency.average, t = this.metadata.errorHistory.filter((e)=>Date.now() - new Date(e.timestamp).getTime() < 6e4).length;
            this.metadata.metrics.connectionQuality = t > 2 ? "poor" : e > 1e3 ? "unstable" : e > 500 ? "fair" : "good";
        }
        _isValidTransition(e) {
            if (null === this.currentState) return !0;
            const t = ut.VALID_TRANSITIONS[this.currentState];
            return t && t.includes(e);
        }
    }
    const ft = function(e, ...t) {
        console.error(e, ...t);
    }, mt = function(e, ...t) {
        console.warn(e, ...t);
    }, gt = function(e, ...t) {}, yt = function(e, ...t) {};
    class Ct {
        constructor(e, t){
            this.peer = null, this.connection = null, this.targetPeerId = t || "kinectron", this.config = pt(e), this.messageHandlers = new Map, this.messageQueue = [], this.maxQueueSize = 100, this.lastPingTime = 0, this.pingInterval = null, this.healthCheckInterval = null, this.clientId = this.generateClientId(), this.state = new ut, this.state.on("stateChange", (e)=>{
                const t = this.messageHandlers.get("stateChange");
                t && t(e);
            }), this.state.on("error", (e)=>{
                const t = this.messageHandlers.get("error");
                t && t(e);
            }), this.state.on("metrics", (e)=>{
                const t = this.messageHandlers.get("metrics");
                t && t(e);
            }), this.initialize();
        }
        generateClientId() {
            const e = Date.now().toString(36), t = Math.random().toString(36).substr(2, 5);
            return `${this.config.host?.includes("ngrok") ? "ngrok" : "local"}-${this.config.role || "default"}-${e}-${t}`;
        }
        getState() {
            return this.state.getMetadata();
        }
        initialize() {
            try {
                if (this.peer) return void console.warn("Peer already initialized");
                const e = "string" == typeof this.config.host && this.config.host.includes("ngrok");
                if (e && (this.state.setState(ut.STATES.VALIDATING), !this.config.host.includes("ngrok-free.app"))) throw new lt("Invalid ngrok URL format", {
                    url: this.config.host,
                    reason: "URL must include ngrok-free.app domain"
                });
                this.peer = new ot(this.clientId, {
                    ...this.config,
                    reliable: !0,
                    retries: 2,
                    timeout: e ? 5e3 : 3e3,
                    debug: 0
                }), e || this.state.setState(ut.STATES.CONNECTING), this.setupPeerEventHandlers(), this.startHealthCheck();
            } catch (e) {
                console.error("Peer initialization error:", e), this.handleError(e), this.state.setState(ut.STATES.ERROR, {
                    error: e.message,
                    context: "initialization"
                });
            }
        }
        setupPeerEventHandlers() {
            this.peer.on("open", (e)=>{
                this.connect();
            }), this.peer.on("error", (e)=>{
                if (console.error("Peer connection error:", e), "unavailable-id" === e.type) return this.clientId = this.generateClientId(), this._cleanup(!1), void this.initialize();
                this.handleError(e), this.state.setState(ut.STATES.ERROR, {
                    error: e.message,
                    type: e.type
                }), this.shouldAttemptReconnection(e) && this._handleReconnection(e);
            }), this.peer.on("disconnected", ()=>{
                this.state.setState(ut.STATES.DISCONNECTED, {
                    reason: "peer_disconnected"
                }), this._handleReconnection({
                    type: "disconnected"
                });
            });
        }
        startHealthCheck() {
            this.healthCheckInterval && clearInterval(this.healthCheckInterval), this.pingInterval && clearInterval(this.pingInterval), this.healthCheckInterval = setInterval(()=>{
                this.state.getState() === ut.STATES.CONNECTED && this.connection && this.checkConnectionHealth();
            }, 1e4), this.pingInterval = setInterval(()=>{
                this.state.getState() === ut.STATES.CONNECTED && this.connection?.open && this.sendPing();
            }, 5e3);
        }
        async checkConnectionHealth() {
            if (!this.connection?.open) return console.warn("Connection appears dead, attempting recovery"), void await this.handleConnectionFailure();
            const e = Date.now() - this.lastPingTime;
            e > 15e3 && (console.warn("No ping response, connection may be dead"), await this.handleConnectionFailure()), this.state.updateMetrics({
                latency: e,
                timestamp: new Date
            });
        }
        sendPing() {
            try {
                this.connection.send({
                    event: "ping",
                    data: {
                        timestamp: Date.now()
                    }
                });
            } catch (e) {
                console.error("Failed to send ping:", e);
            }
        }
        async handleConnectionFailure() {
            if (this.connection) {
                try {
                    this.connection.close();
                } catch (e) {
                    console.error("Error closing connection:", e);
                }
                this.connection = null;
            }
            this.state.setState(ut.STATES.RECONNECTING, {
                reason: "connection_failure",
                timestamp: new Date
            }), await this._handleReconnection({
                type: "connection_failure"
            });
        }
        handleError(e) {
            this.state.recordError(e, {
                type: e.type || "server-error",
                state: this.state.getState(),
                timestamp: (new Date).toISOString()
            });
            const t = this.messageHandlers.get("error");
            if (t) t({
                status: "error",
                error: this._getErrorMessage(e),
                details: {
                    type: e.type || "server-error",
                    state: this.state.getState(),
                    timestamp: (new Date).toISOString()
                }
            });
        }
        _getErrorMessage(e) {
            return ({
                network: "Network error - Could not connect to peer server",
                "invalid-id": "Invalid ID - The peer ID is invalid or already taken",
                "unavailable-id": "ID Unavailable - The peer ID is already taken",
                "browser-incompatible": "Browser Incompatible - WebRTC is not supported",
                "connection-failure": "Connection failed - Unable to establish or maintain connection",
                disconnected: "Disconnected - Lost connection to peer server"
            })[e.type] || e.message || "Peer connection error";
        }
        shouldAttemptReconnection(e) {
            return ![
                "browser-incompatible",
                "invalid-id",
                "invalid-key"
            ].includes(e.type) && this.state.getMetadata().metrics.reconnects.count < 3;
        }
        _setConnectionTimeout() {
            setTimeout(()=>{
                this.state.getState() !== ut.STATES.CONNECTED && (this.shouldAttemptReconnection({
                    type: "timeout"
                }) ? this._handleReconnection({
                    type: "timeout"
                }) : this.handleError({
                    type: "timeout",
                    message: "Connection timeout - Max attempts reached"
                }));
            }, 15e3);
        }
        async _handleReconnection(e) {
            this.state.setState(ut.STATES.RECONNECTING, {
                error: e.message,
                attempt: this.state.getMetadata().metrics.reconnects.count + 1
            });
            const t = Math.min(2e3 * Math.pow(1.5, this.state.getMetadata().metrics.reconnects.count), 15e3), n = .2 * t * (2 * Math.random() - 1), r = Math.max(2e3, t + n);
            await new Promise((e)=>setTimeout(e, r)), this.state.getState() === ut.STATES.RECONNECTING && (await this._cleanup(!1), this.shouldAttemptReconnection(e) ? (this.state.setState(ut.STATES.CONNECTING), this.initialize()) : this.state.setState(ut.STATES.ERROR, {
                error: "Maximum reconnection attempts reached",
                type: "max_retries"
            }));
        }
        async _cleanup(e = !0) {
            this.peer && (this.peer.destroy(), this.peer = null), this.connection && (this.connection.close(), this.connection = null), e && (this.healthCheckInterval && (clearInterval(this.healthCheckInterval), this.healthCheckInterval = null), this.pingInterval && (clearInterval(this.pingInterval), this.pingInterval = null));
        }
        connect() {
            try {
                if (this.peer.connections[this.targetPeerId]?.length > 0) {
                    const e = this.peer.connections[this.targetPeerId][0];
                    if (e.open) return this.connection = e, void this.setupConnectionHandlers();
                }
                this.connection = this.peer.connect(this.targetPeerId, {
                    reliable: !0,
                    serialization: "binary"
                }), this.setupConnectionHandlers(), this._setConnectionTimeout();
            } catch (e) {
                console.error("Error establishing connection:", e), this._handleReconnection(e);
            }
        }
        setupConnectionHandlers() {
            this.connection.on("open", ()=>{
                this.state.setState(ut.STATES.CONNECTED, {
                    peerId: this.targetPeerId,
                    timestamp: new Date
                }), this.processMessageQueue();
                const e = this.messageHandlers.get("ready");
                e && e({
                    status: "connected",
                    peerId: this.targetPeerId,
                    state: this.state.getState(),
                    timestamp: (new Date).toISOString()
                });
            }), this.connection.on("data", (e)=>{
                if ("pong" !== e.event) this.handleIncomingData(e);
                else {
                    this.lastPingTime = Date.now();
                    const t = Date.now() - e.data.timestamp;
                    this.state.updateMetrics({
                        latency: t
                    });
                }
            }), this.connection.on("close", ()=>{
                this._isClosing || (this.state.setState(ut.STATES.DISCONNECTED, {
                    reason: "connection_closed"
                }), this._handleReconnection({
                    type: "connection_closed"
                }));
            }), this.connection.on("error", (e)=>{
                console.error("Data connection error:", e), this.state.setState(ut.STATES.ERROR, {
                    error: e.message,
                    type: e.type
                }), this.handleError(e), this._handleReconnection(e);
            });
        }
        handleIncomingData(e) {
            try {
                const t = this.messageHandlers.get(e.event);
                if (t) t({
                    ...e.data,
                    timestamp: Date.now(),
                    state: this.state.getState()
                });
                else {
                    const t = this.messageHandlers.get("data");
                    t ? t(e) : console.warn("PeerConnection: No data handler found for event:", e.event);
                }
            } catch (e) {
                console.error("Error handling incoming data:", e), this.handleError({
                    type: "data_handling_error",
                    message: "Error processing received data",
                    originalError: e
                });
            }
        }
        async processMessageQueue() {
            for(; this.messageQueue.length > 0 && this.state.getState() === ut.STATES.CONNECTED;){
                const e = this.messageQueue.shift();
                try {
                    await this.send(e.event, e.data);
                } catch (t) {
                    console.error("Failed to send queued message:", t), this.state.getState() === ut.STATES.CONNECTED && this.messageQueue.length < this.maxQueueSize && this.messageQueue.push(e);
                }
            }
        }
        on(e, t) {
            if ("function" != typeof t) throw new Error("Handler must be a function");
            this.messageHandlers.set(e, t);
        }
        async send(e, t) {
            return new Promise((n, r)=>{
                if (this.state.getState() === ut.STATES.CONNECTED && this.connection?.open) try {
                    const i = {
                        event: e,
                        data: t,
                        timestamp: Date.now()
                    }, s = setTimeout(()=>{
                        r(new Error("Send timeout"));
                    }, 5e3);
                    this.connection.send(i), clearTimeout(s), n();
                } catch (e) {
                    r(e);
                }
                else this.messageQueue.length < this.maxQueueSize ? (this.messageQueue.push({
                    event: e,
                    data: t
                }), n()) : r(new Error("Message queue full"));
            });
        }
        async close() {
            if (this._isClosing = !0, this.connection?.open) try {
                await this.send("shutdown", {
                    reason: "client_close"
                });
            } catch (e) {
                console.error("Error sending shutdown message:", e);
            }
            await this._cleanup(!0), this.state.reset(), this.messageQueue = [], this._isClosing = !1;
        }
        isConnected() {
            return this.state.getState() === ut.STATES.CONNECTED && this.connection?.open;
        }
    }
    function _t(e, t) {
        const n = e.imagedata || e.imageData;
        if (!e || !n) return void mt("Invalid frame data received:", e);
        const { width: r, height: i } = n, s = document.createElement("canvas"), o = s.getContext("2d");
        s.width = r, s.height = i;
        try {
            if ("string" == typeof n.data) yt("Processing image data from data URL"), function(e, t, n, r, i) {
                const s = document.createElement("canvas"), o = s.getContext("2d");
                s.width = t, s.height = n;
                const a = new Image;
                a.onload = ()=>{
                    o.drawImage(a, 0, 0, t, n), r(e);
                }, a.onerror = (e)=>{
                    i && i(e);
                }, a.src = e;
            }(n.data, r, i, (s)=>{
                t({
                    src: s,
                    width: r,
                    height: i,
                    raw: n,
                    timestamp: e.timestamp || Date.now()
                });
            }, (s)=>{
                ft("Error loading image from data URL:", s), t({
                    src: n.data,
                    width: r,
                    height: i,
                    raw: n,
                    timestamp: e.timestamp || Date.now()
                });
            });
            else {
                yt("Processing image data from raw pixel data");
                const a = vt(n.data), c = new ImageData(a, r, i);
                o.putImageData(c, 0, 0);
                const d = s.toDataURL("image/jpeg");
                t({
                    src: d,
                    width: r,
                    height: i,
                    raw: n,
                    timestamp: e.timestamp || Date.now()
                });
            }
        } catch (e) {
            ft("Error processing frame:", e), ft("Frame data:", n);
        }
    }
    function vt(e) {
        return e instanceof Uint8ClampedArray ? e : e instanceof Uint8Array || Array.isArray(e) ? new Uint8ClampedArray(e) : new Uint8ClampedArray(Object.values(e));
    }
    function bt(e, t) {
        return (n)=>{
            const r = n.data || n;
            gt(`Frame handler for ${e} received:`, r);
            const i = r.imagedata || r.imageData;
            r.name === e && i ? (r.imageData && !r.imagedata && (r.imagedata = r.imageData), _t(r, t)) : mt(`Received frame event but it's not a valid ${e} frame:`, "name=", r.name, "has imagedata=", !(!r.imagedata && !r.imageData));
        };
    }
    return console.log("You are running Kinectron API version 1.0.0"), class {
        constructor(e){
            this.peer = new Ct(e), this.messageHandlers = new Map, this.state = null, this.peer.on("ready", (e)=>{
                this.state = e.state;
                const t = this.messageHandlers.get("ready");
                t && t(e);
            }), this.peer.on("error", (e)=>{
                const t = this.messageHandlers.get("error");
                t && t(e);
            }), this.peer.on("stateChange", (e)=>{
                this.state = e.to;
                const t = this.messageHandlers.get("stateChange");
                t && t(e);
            }), this.peer.on("metrics", (e)=>{
                const t = this.messageHandlers.get("metrics");
                t && t(e);
            }), this.peer.on("data", (e)=>{
                const { event: t, data: n } = e, r = this.messageHandlers.get(t);
                r ? r(n) : mt("Kinectron: No handler found for event:", t);
            });
        }
        on(e, t) {
            this.messageHandlers.set(e, t);
        }
        getState() {
            return this.peer.getState();
        }
        isConnected() {
            return this.state === ut.STATES.CONNECTED;
        }
        setKinectType(e) {
            this.isConnected() ? this.send("setkinect", e) : mt("Cannot set Kinect type: not connected");
        }
        initKinect(e) {
            if (!this.isConnected()) return mt("Cannot initialize Kinect: not connected"), Promise.reject(new Error("Cannot initialize Kinect: not connected"));
            const t = new Promise((e, t)=>{
                this.messageHandlers.set("kinectInitialized", (n)=>{
                    let r = !1;
                    (n.success && "object" == typeof n.success && !0 === n.success.success || "boolean" == typeof n.success && !0 === n.success) && (r = !0);
                    const i = {
                        success: r,
                        alreadyInitialized: !!n.alreadyInitialized,
                        error: n.error || null,
                        rawData: n
                    };
                    r || n.alreadyInitialized ? e(i) : t(new Error(n.error || "Failed to initialize Kinect")), this.messageHandlers.delete("kinectInitialized");
                }), this.send("initkinect", {});
            });
            return e && t.then((t)=>e(t)).catch((t)=>e({
                    success: !1,
                    error: t.message
                })), t;
        }
        send(e, t) {
            this.isConnected() ? this.peer.send(e, t) : mt("Cannot send data: not connected");
        }
        startColor(e) {
            e && this.messageHandlers.set("frame", bt("color", e)), this.send("feed", {
                feed: "color"
            });
        }
        startDepth(e) {
            e && this.messageHandlers.set("frame", bt("depth", e)), this.send("feed", {
                feed: "depth"
            });
        }
        _unpackRawDepthData(e, t, n, r, i) {
            return new Promise((r, i)=>{
                const s = new Image;
                s.onload = ()=>{
                    const e = new OffscreenCanvas(t, n).getContext("2d");
                    e.drawImage(s, 0, 0);
                    const i = e.getImageData(0, 0, t, n).data, o = new Uint16Array(t * n);
                    let a = 0;
                    for(let e = 0; e < i.length; e += 4){
                        const t = i[e + 1] << 8 | i[e];
                        o[a++] = t;
                    }
                    r(o);
                }, s.onerror = (e)=>{
                    i(new Error("Failed to load depth image: " + e));
                }, s.src = e;
            });
        }
        startRawDepth(e) {
            e && this.messageHandlers.set("rawDepth", function(e, t) {
                return (n)=>{
                    n && n.imagedata ? t(n.imagedata, n.width, n.height, n.width, n.testValues).then((t)=>{
                        e({
                            ...n,
                            depthValues: t,
                            timestamp: n.timestamp || Date.now()
                        });
                    }).catch((t)=>{
                        ft("Error unpacking raw depth data:", t), e({
                            ...n,
                            error: "Failed to unpack depth data: " + t.message,
                            timestamp: n.timestamp || Date.now()
                        });
                    }) : n && n.rawDepthData ? e({
                        ...n,
                        timestamp: n.timestamp || Date.now()
                    }) : (mt("Received raw depth frame with invalid data format:", n), e({
                        ...n,
                        error: "Invalid data format",
                        timestamp: n.timestamp || Date.now()
                    }));
                };
            }(e, this._unpackRawDepthData.bind(this))), this.send("feed", {
                feed: "raw-depth"
            });
        }
        startBodies(e) {
            e && this.messageHandlers.set("bodyFrame", function(e) {
                return gt("Creating body handler with callback:", e), (t)=>{
                    const n = t.data;
                    n && n.bodies && e({
                        bodies: n.bodies,
                        timestamp: n.timestamp || Date.now(),
                        floorClipPlane: n.floorClipPlane,
                        trackingId: n.trackingId
                    });
                };
            }(e)), this.send("feed", {
                feed: "body"
            });
        }
        startKey(e) {
            e && this.messageHandlers.set("frame", bt("key", e)), this.send("feed", {
                feed: "key"
            });
        }
        startDepthKey(e) {
            e && this.messageHandlers.set("depth-key", bt("depth-key", e)), this.send("feed", {
                feed: "depth-key"
            });
        }
        startRGBD(e) {
            e && this.messageHandlers.set("frame", bt("rgbd", e)), this.send("feed", {
                feed: "rgbd"
            });
        }
        startMultiFrame(e, t) {
            t && this.messageHandlers.set("multiFrame", function(e) {
                return (t)=>{
                    if (t && t.frames) {
                        const n = {};
                        Object.entries(t.frames).forEach(([e, t])=>{
                            if (t.imagedata) {
                                const r = document.createElement("canvas"), i = r.getContext("2d"), { width: s, height: o } = t.imagedata;
                                r.width = s, r.height = o;
                                const a = new ImageData(vt(t.imagedata.data), s, o);
                                i.putImageData(a, 0, 0), n[e] = {
                                    src: r.toDataURL("image/jpeg"),
                                    width: s,
                                    height: o,
                                    raw: t.imagedata
                                };
                            } else n[e] = t;
                        }), e({
                            frames: n,
                            timestamp: t.timestamp || Date.now()
                        });
                    }
                };
            }(t)), this.send("multi", e);
        }
        stopAll() {
            this.send("feed", {
                feed: "stop-all"
            });
        }
        close() {
            this.peer.close(), this.messageHandlers.clear(), this.state = null;
        }
    };
});

//# sourceMappingURL=gettingstarted.b9a8893f.js.map
