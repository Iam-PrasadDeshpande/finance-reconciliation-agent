// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function x(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var S = x.prototype = new b();
	S.constructor = x, _(S, y.prototype), S.isPureReactComponent = !0;
	var C = Array.isArray;
	function w() {}
	var T = {
		H: null,
		A: null,
		T: null,
		S: null
	}, ee = Object.prototype.hasOwnProperty;
	function E(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function D(e, t) {
		return E(e.type, t, e.props);
	}
	function te(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function ne(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var O = /\/+/g;
	function re(e, t) {
		return typeof e == "object" && e && e.key != null ? ne("" + e.key) : t.toString(36);
	}
	function ie(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(w, w) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function ae(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, ae(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + re(e, 0) : a, C(o) ? (i = "", c != null && (i = c.replace(O, "$&/") + "/"), ae(o, r, i, "", function(e) {
			return e;
		})) : o != null && (te(o) && (o = D(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(O, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (C(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + re(a, u), c += ae(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + re(a, u++), c += ae(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return ae(ie(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function oe(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return ae(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function se(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var ce = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function le(e) {
		var t = T.T, n = {};
		n.types = t === null ? null : t.types, T.T = n;
		try {
			var r = e(), i = T.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(w, ce);
		} catch (e) {
			ce(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), T.T = t;
		}
	}
	function ue(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else le(ue.bind(null, e));
	}
	var de = {
		map: oe,
		forEach: function(e, t, n) {
			oe(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return oe(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return oe(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!te(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = de, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = ue, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !ee.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return E(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) ee.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return E(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = te, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: se
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = le, e.unstable_useCacheRefresh = function() {
		return T.H.useCacheRefresh();
	}, e.use = function(e) {
		return T.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return T.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return T.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return T.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return T.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return T.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return T.H.useEffectEvent(e);
	}, e.useId = function() {
		return T.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return T.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return T.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return T.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return T.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return T.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return T.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return T.H.useRef(e);
	}, e.useState = function(e) {
		return T.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return T.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return T.H.useTransition();
	}, e.version = "19.3.1";
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, S || (S = !0, D());
			else {
				var t = n(l);
				t !== null && O(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function ee() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function E() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && ee());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && O(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? D() : S = !1;
			}
		}
	}
	var D;
	if (typeof y == "function") D = function() {
		y(E);
	};
	else if (typeof MessageChannel < "u") {
		var te = new MessageChannel(), ne = te.port2;
		te.port1.onmessage = E, D = function() {
			ne.postMessage(null);
		};
	} else D = function() {
		_(E, 0);
	};
	function O(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, O(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, D()))), r;
	}, e.unstable_shouldYield = ee, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ o(((e) => {
	var t = u();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function d(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = d(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = d(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.1";
})), m = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = f(), n = u(), r = m();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function p(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = p(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function h(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && h(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function g(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function _(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function v(e) {
		var t = [null, null], n = g(e);
		return n === null || y(t, e, n.child, { foundSelf: !1 }), t;
	}
	function y(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && y(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function b(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(i(559));
		}
	}
	var x = null, S = null;
	function C(e, t, n) {
		return e === n || e === t && (x = e, !0);
	}
	function w(e, t, n) {
		return e === n ? (S = e, !1) : e === t && (S !== null && (x = e), !0);
	}
	function T(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function ee(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var E = Object.assign, D = Symbol.for("react.element"), te = Symbol.for("react.transitional.element"), ne = Symbol.for("react.portal"), O = Symbol.for("react.fragment"), re = Symbol.for("react.strict_mode"), ie = Symbol.for("react.profiler"), ae = Symbol.for("react.consumer"), oe = Symbol.for("react.context"), se = Symbol.for("react.forward_ref"), ce = Symbol.for("react.suspense"), le = Symbol.for("react.suspense_list"), ue = Symbol.for("react.memo"), de = Symbol.for("react.lazy"), fe = Symbol.for("react.activity"), pe = Symbol.for("react.legacy_hidden"), k = Symbol.for("react.memo_cache_sentinel"), me = Symbol.for("react.view_transition"), he = Symbol.for("react.recoverable"), ge = Symbol.iterator;
	function _e(e) {
		return typeof e != "object" || !e ? null : (e = ge && e[ge] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var ve = Symbol.for("react.client.reference");
	function ye(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === ve ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case O: return "Fragment";
			case ie: return "Profiler";
			case re: return "StrictMode";
			case ce: return "Suspense";
			case le: return "SuspenseList";
			case fe: return "Activity";
			case me: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case ne: return "Portal";
			case oe: return e.displayName || "Context";
			case ae: return (e._context.displayName || "Context") + ".Consumer";
			case se:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case ue: return t = e.displayName || null, t === null ? ye(e.type) || "Memo" : t;
			case de:
				t = e._payload, e = e._init;
				try {
					return ye(e(t));
				} catch {}
		}
		return null;
	}
	var be = Array.isArray, A = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, j = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, xe = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, Se = [], Ce = -1;
	function we(e) {
		return { current: e };
	}
	function M(e) {
		0 > Ce || (e.current = Se[Ce], Se[Ce] = null, Ce--);
	}
	function N(e, t) {
		Ce++, Se[Ce] = e.current, e.current = t;
	}
	var Te = we(null), Ee = we(null), De = we(null), Oe = we(null);
	function P(e, t) {
		switch (N(De, t), N(Ee, e), N(Te, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? up(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = up(t), e = dp(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		M(Te), N(Te, e);
	}
	function ke() {
		M(Te), M(Ee), M(De);
	}
	function Ae(e) {
		var t = e.memoizedState;
		t !== null && (sh._currentValue = t.memoizedState, N(Oe, e)), t = Te.current;
		var n = dp(t, e.type);
		t !== n && (N(Ee, e), N(Te, n));
	}
	function je(e) {
		Ee.current === e && (M(Te), M(Ee)), Oe.current === e && (M(Oe), sh._currentValue = xe);
	}
	var Me, Ne;
	function Pe(e) {
		if (Me === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Me = t && t[1] || "", Ne = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Me + e + Ne;
	}
	var Fe = !1;
	function Ie(e, t) {
		if (!e || Fe) return "";
		Fe = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			Fe = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Pe(n) : "";
	}
	function Le(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Pe(e.type);
			case 16: return Pe("Lazy");
			case 13: return e.child !== t && t !== null ? Pe("Suspense Fallback") : Pe("Suspense");
			case 19: return Pe("SuspenseList");
			case 0:
			case 15: return Ie(e.type, !1);
			case 11: return Ie(e.type.render, !1);
			case 1: return Ie(e.type, !0);
			case 31: return Pe("Activity");
			case 30: return Pe("ViewTransition");
			default: return "";
		}
	}
	function Re(e) {
		try {
			var t = "", n = null;
			do
				t += Le(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var ze = Object.prototype.hasOwnProperty, Be = t.unstable_scheduleCallback, Ve = t.unstable_cancelCallback, He = t.unstable_shouldYield, Ue = t.unstable_requestPaint, We = t.unstable_now, Ge = t.unstable_getCurrentPriorityLevel, Ke = t.unstable_ImmediatePriority, qe = t.unstable_UserBlockingPriority, F = t.unstable_NormalPriority, Je = t.unstable_LowPriority, Ye = t.unstable_IdlePriority, Xe = t.log, Ze = t.unstable_setDisableYieldValue, Qe = null, $e = null;
	function et(e) {
		if (typeof Xe == "function" && Ze(e), $e && typeof $e.setStrictMode == "function") try {
			$e.setStrictMode(Qe, e);
		} catch {}
	}
	var tt = Math.clz32 ? Math.clz32 : it, nt = Math.log, rt = Math.LN2;
	function it(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (nt(e) / rt | 0) | 0;
	}
	var at = 256, ot = 262144, st = 4194304;
	function ct(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function lt(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = ct(n))) : i = ct(o) : i = ct(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = ct(n))) : i = ct(o)) : i = ct(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function ut(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function dt(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - tt(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function ft(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function pt() {
		var e = st;
		return st <<= 1, !(st & 62914560) && (st = 4194304), e;
	}
	function mt(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function ht(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function gt(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - tt(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && _t(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function _t(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - tt(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function I(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - tt(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function vt(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : yt(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function yt(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function bt(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function xt() {
		var e = j.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Ch(e.type)) : e;
	}
	function St(e, t) {
		var n = j.p;
		try {
			return j.p = e, t();
		} finally {
			j.p = n;
		}
	}
	var Ct = Math.random().toString(36).slice(2), wt = "__reactFiber$" + Ct, Tt = "__reactProps$" + Ct, Et = "__reactContainer$" + Ct, Dt = "__reactEvents$" + Ct, Ot = "__reactListeners$" + Ct, kt = "__reactHandles$" + Ct, At = "__reactResources$" + Ct, jt = "__reactMarker$" + Ct, Mt = "__reactLoad$" + Ct;
	function Nt(e) {
		delete e[wt], delete e[Tt], delete e[Ot], delete e[kt];
	}
	function Pt(e) {
		var t;
		if (t = e[wt]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[Et] || n[wt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = fm(e); e !== null;) {
					if (n = e[wt]) return n;
					e = fm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Ft(e) {
		if (e = e[wt] || e[Et]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function It(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Lt(e) {
		var t = e[At];
		return t ||= e[At] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function Rt(e) {
		e[jt] = !0;
	}
	function zt(e) {
		e[Mt] = void 0;
	}
	var Bt = /* @__PURE__ */ new Set(), Vt = {};
	function Ht(e, t) {
		Ut(e, t), Ut(e + "Capture", t);
	}
	function Ut(e, t) {
		for (Vt[e] = t, e = 0; e < t.length; e++) Bt.add(t[e]);
	}
	var Wt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Gt = {}, Kt = {};
	function qt(e) {
		return ze.call(Kt, e) ? !0 : ze.call(Gt, e) ? !1 : Wt.test(e) ? Kt[e] = !0 : (Gt[e] = !0, !1);
	}
	var L = !1;
	function Jt() {
		var e = L;
		return L = !1, e;
	}
	function Yt(e, t, n) {
		if (qt(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function Xt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function Zt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function Qt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function $t(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function en(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function tn(e) {
		if (!e._valueTracker) {
			var t = $t(e) ? "checked" : "value";
			e._valueTracker = en(e, t, "" + e[t]);
		}
	}
	function nn(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = $t(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var rn = /[\n"\\]/g;
	function an(e) {
		return e.replace(rn, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function on(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Qt(t)) : e.value !== "" + Qt(t) && (e.value = "" + Qt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : cn(e, Qt(n)) : o === "number" && e.value == t ? cn(e, Qt(e.value)) : cn(e, Qt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Qt(s) : e.removeAttribute("name");
	}
	function sn(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				tn(e);
				return;
			}
			n = n == null ? "" : "" + Qt(n), t = t == null ? n : "" + Qt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), tn(e);
	}
	function cn(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function ln(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Qt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function un(e, t, n) {
		t != null && (t = "" + Qt(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + Qt(n);
	}
	function dn(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (be(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Qt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), tn(e);
	}
	function fn(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var pn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function mn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || pn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function hn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", L = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (mn(e, a, r), L = !0);
		} else for (var o in t) t.hasOwnProperty(o) && mn(e, o, t[o]);
	}
	function gn(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var _n = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), vn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function yn(e) {
		return vn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function bn() {}
	var xn = null;
	function Sn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var Cn = null, wn = null;
	function Tn(e) {
		var t = Ft(e);
		if (t && (e = t.stateNode)) {
			var n = e[Tt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (on(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + an("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[Tt] || null;
								if (!a) throw Error(i(90));
								on(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && nn(r);
					}
					break a;
				case "textarea":
					un(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && ln(e, !!n.multiple, t, !1);
			}
		}
	}
	var En = !1;
	function Dn(e, t, n) {
		if (En) return e(t, n);
		En = !0;
		try {
			return e(t);
		} finally {
			if (En = !1, (Cn !== null || wn !== null) && (zd(), Cn && (t = Cn, e = wn, wn = Cn = null, Tn(t), e))) for (t = 0; t < e.length; t++) Tn(e[t]);
		}
	}
	function On(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[Tt] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var kn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, An = !1;
	if (kn) try {
		var jn = {};
		Object.defineProperty(jn, "passive", { get: function() {
			An = !0;
		} }), window.addEventListener("test", jn, jn), window.removeEventListener("test", jn, jn);
	} catch {
		An = !1;
	}
	var Mn = null, Nn = null, Pn = null;
	function Fn() {
		if (Pn) return Pn;
		var e, t = Nn, n = t.length, r, i = "value" in Mn ? Mn.value : Mn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Pn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function In(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Ln() {
		return !0;
	}
	function Rn() {
		return !1;
	}
	function zn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Ln : Rn, this.isPropagationStopped = Rn, this;
		}
		return E(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Ln);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Ln);
			},
			persist: function() {},
			isPersistent: Ln
		}), t;
	}
	var Bn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Vn = zn(Bn), Hn = E({}, Bn, {
		view: 0,
		detail: 0
	}), Un = zn(Hn), Wn, Gn, Kn, qn = E({}, Hn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: ir,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Kn && (Kn && e.type === "mousemove" ? (Wn = e.screenX - Kn.screenX, Gn = e.screenY - Kn.screenY) : Gn = Wn = 0, Kn = e), Wn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Gn;
		}
	}), Jn = zn(qn), Yn = zn(E({}, qn, { dataTransfer: 0 })), Xn = zn(E({}, Hn, { relatedTarget: 0 })), Zn = zn(E({}, Bn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Qn = zn(E({}, Bn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), $n = zn(E({}, Bn, { data: 0 })), er = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, tr = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, nr = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function rr(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = nr[e]) ? !!t[e] : !1;
	}
	function ir() {
		return rr;
	}
	var ar = zn(E({}, Hn, {
		key: function(e) {
			if (e.key) {
				var t = er[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = In(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? tr[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: ir,
		charCode: function(e) {
			return e.type === "keypress" ? In(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? In(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), or = zn(E({}, qn, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), sr = zn(E({}, Bn, { submitter: 0 })), cr = zn(E({}, Hn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: ir
	})), lr = zn(E({}, Bn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), ur = zn(E({}, qn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), dr = zn(E({}, Bn, {
		newState: 0,
		oldState: 0,
		source: 0
	})), fr = [
		9,
		13,
		27,
		32
	], pr = kn && "CompositionEvent" in window, mr = null;
	kn && "documentMode" in document && (mr = document.documentMode);
	var hr = kn && "TextEvent" in window && !mr, gr = kn && (!pr || mr && 8 < mr && 11 >= mr), _r = " ", vr = !1;
	function yr(e, t) {
		switch (e) {
			case "keyup": return fr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function br(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var xr = !1;
	function Sr(e, t) {
		switch (e) {
			case "compositionend": return br(t);
			case "keypress": return t.which === 32 ? (vr = !0, _r) : null;
			case "textInput": return e = t.data, e === _r && vr ? null : e;
			default: return null;
		}
	}
	function Cr(e, t) {
		if (xr) return e === "compositionend" || !pr && yr(e, t) ? (e = Fn(), Pn = Nn = Mn = null, xr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return gr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var wr = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function Tr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!wr[e.type] : t === "textarea";
	}
	function Er(e, t, n, r) {
		Cn ? wn ? wn.push(r) : wn = [r] : Cn = r, t = Jf(t, "onChange"), 0 < t.length && (n = new Vn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var Dr = null, Or = null;
	function kr(e) {
		Vf(e, 0);
	}
	function Ar(e) {
		if (nn(It(e))) return e;
	}
	function jr(e, t) {
		if (e === "change") return t;
	}
	var Mr = !1;
	if (kn) {
		var Nr;
		if (kn) {
			var Pr = "oninput" in document;
			if (!Pr) {
				var Fr = document.createElement("div");
				Fr.setAttribute("oninput", "return;"), Pr = typeof Fr.oninput == "function";
			}
			Nr = Pr;
		} else Nr = !1;
		Mr = Nr && (!document.documentMode || 9 < document.documentMode);
	}
	function Ir() {
		Dr && (Dr.detachEvent("onpropertychange", Lr), Or = Dr = null);
	}
	function Lr(e) {
		if (e.propertyName === "value" && Ar(Or)) {
			var t = [];
			Er(t, Or, e, Sn(e)), Dn(kr, t);
		}
	}
	function Rr(e, t, n) {
		e === "focusin" ? (Ir(), Dr = t, Or = n, Dr.attachEvent("onpropertychange", Lr)) : e === "focusout" && Ir();
	}
	function zr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return Ar(Or);
	}
	function Br(e, t) {
		if (e === "click") return Ar(t);
	}
	function Vr(e, t) {
		if (e === "input" || e === "change") return Ar(t);
	}
	function Hr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Ur = typeof Object.is == "function" ? Object.is : Hr;
	function Wr(e, t) {
		if (Ur(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!ze.call(t, i) || !Ur(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Gr(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Kr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function qr(e, t) {
		var n = Kr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Kr(n);
		}
	}
	function Jr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Jr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Yr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Gr(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Gr(e.document);
		}
		return t;
	}
	function Xr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Zr = kn && "documentMode" in document && 11 >= document.documentMode, Qr = null, $r = null, ei = null, ti = !1;
	function ni(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		ti || Qr == null || Qr !== Gr(r) || (r = Qr, "selectionStart" in r && Xr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), ei && Wr(ei, r) || (ei = r, r = Jf($r, "onSelect"), 0 < r.length && (t = new Vn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Qr)));
	}
	function ri(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var ii = {
		animationend: ri("Animation", "AnimationEnd"),
		animationiteration: ri("Animation", "AnimationIteration"),
		animationstart: ri("Animation", "AnimationStart"),
		transitionrun: ri("Transition", "TransitionRun"),
		transitionstart: ri("Transition", "TransitionStart"),
		transitioncancel: ri("Transition", "TransitionCancel"),
		transitionend: ri("Transition", "TransitionEnd")
	}, ai = {}, oi = {};
	kn && (oi = document.createElement("div").style, "AnimationEvent" in window || (delete ii.animationend.animation, delete ii.animationiteration.animation, delete ii.animationstart.animation), "TransitionEvent" in window || delete ii.transitionend.transition);
	function si(e) {
		if (ai[e]) return ai[e];
		if (!ii[e]) return e;
		var t = ii[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in oi) return ai[e] = t[n];
		return e;
	}
	var ci = si("animationend"), li = si("animationiteration"), ui = si("animationstart"), di = si("transitionrun"), fi = si("transitionstart"), pi = si("transitioncancel"), mi = si("transitionend"), hi = /* @__PURE__ */ new Map(), gi = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	gi.push("scrollEnd");
	function _i(e, t) {
		hi.set(e, t), Ht(t, [e]);
	}
	var vi = 0;
	function yi(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = bd.identifierPrefix;
		var n = vi++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function bi(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = Od;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function xi(e, t) {
		return e = bi(e), t = bi(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var Si = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, Ci = [], wi = 0, Ti = 0;
	function Ei() {
		for (var e = wi, t = Ti = wi = 0; t < e;) {
			var n = Ci[t];
			Ci[t++] = null;
			var r = Ci[t];
			Ci[t++] = null;
			var i = Ci[t];
			Ci[t++] = null;
			var a = Ci[t];
			if (Ci[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Ai(n, i, a);
		}
	}
	function Di(e, t, n, r) {
		Ci[wi++] = e, Ci[wi++] = t, Ci[wi++] = n, Ci[wi++] = r, Ti |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function Oi(e, t, n, r) {
		return Di(e, t, n, r), ji(e);
	}
	function ki(e, t) {
		return Di(e, null, null, t), ji(e);
	}
	function Ai(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - tt(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function ji(e) {
		if (50 < kd) throw kd = 0, Ad = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Mi = {};
	function Ni(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Pi(e, t, n, r) {
		return new Ni(e, t, n, r);
	}
	function Fi(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function Ii(e, t) {
		var n = e.alternate;
		return n === null ? (n = Pi(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Li(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Ri(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") Fi(r) && (s = 1);
		else if (typeof r == "string") s = qm(e, n, Te.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case fe: return e = Pi(31, n, t, a), e.elementType = fe, e.lanes = o, e;
			case O: return zi(n.children, a, o, t);
			case re:
				s = 8, a |= 24;
				break;
			case ie: return e = Pi(12, n, t, a | 2), e.elementType = ie, e.lanes = o, e;
			case ce: return e = Pi(13, n, t, a), e.elementType = ce, e.lanes = o, e;
			case le: return e = Pi(19, n, t, a), e.elementType = le, e.lanes = o, e;
			case pe:
			case me: return e = a | 32, e = Pi(30, n, t, e), e.elementType = me, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case oe:
						s = 10;
						break a;
					case ae:
						s = 9;
						break a;
					case se:
						s = 11;
						break a;
					case ue:
						s = 14;
						break a;
					case de:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Pi(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function zi(e, t, n, r) {
		return e = Pi(7, e, r, t), e.lanes = n, e;
	}
	function Bi(e, t, n) {
		return e = Pi(6, e, null, t), e.lanes = n, e;
	}
	function Vi(e) {
		var t = Pi(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Hi(e, t, n) {
		return t = Pi(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Ui = /* @__PURE__ */ new WeakMap();
	function Wi(e, t) {
		if (typeof e == "object" && e) {
			var n = Ui.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Re(t)
			}, Ui.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Re(t)
		};
	}
	var Gi = [], Ki = 0, qi = null, Ji = 0, Yi = [], Xi = 0, Zi = null, Qi = 1, $i = "";
	function ea(e, t) {
		Gi[Ki++] = Ji, Gi[Ki++] = qi, qi = e, Ji = t;
	}
	function ta(e, t, n) {
		Yi[Xi++] = Qi, Yi[Xi++] = $i, Yi[Xi++] = Zi, Zi = e;
		var r = Qi;
		e = $i;
		var i = 32 - tt(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - tt(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Qi = 1 << 32 - tt(t) + i | n << i | r, $i = a + e;
		} else Qi = 1 << a | n << i | r, $i = e;
	}
	function na(e) {
		e.return !== null && (ea(e, 1), ta(e, 1, 0));
	}
	function ra(e) {
		for (; e === qi;) qi = Gi[--Ki], Gi[Ki] = null, Ji = Gi[--Ki], Gi[Ki] = null;
		for (; e === Zi;) Zi = Yi[--Xi], Yi[Xi] = null, $i = Yi[--Xi], Yi[Xi] = null, Qi = Yi[--Xi], Yi[Xi] = null;
	}
	function ia(e, t) {
		Yi[Xi++] = Qi, Yi[Xi++] = $i, Yi[Xi++] = Zi, Qi = t.id, $i = t.overflow, Zi = e;
	}
	var aa = null, R = null, z = !1, oa = null, sa = !1, ca = Error(i(519));
	function la(e) {
		throw ha(Wi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), ca;
	}
	function ua(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[wt] = e, t[Tt] = r, n) {
			case "dialog":
				Q("cancel", t), Q("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Q("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < zf.length; n++) Q(zf[n], t);
				break;
			case "source":
				Q("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Q("error", t), Q("load", t);
				break;
			case "details":
				Q("toggle", t);
				break;
			case "input":
				Q("invalid", t), sn(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), dn(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || ep(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = bn), t = !0) : t = !1, t || la(e, !0);
	}
	function da(e) {
		for (aa = e.return; aa;) switch (aa.tag) {
			case 5:
			case 31:
			case 13:
				sa = !1;
				return;
			case 27:
			case 3:
				sa = !0;
				return;
			default: aa = aa.return;
		}
	}
	function fa(e) {
		if (e !== aa) return !1;
		if (!z) return da(e), z = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || pp(e.type, e.memoizedProps)), n = !n), n && R && la(e), da(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			R = dm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			R = dm(e);
		} else t === 27 ? (t = R, Sp(e.type) ? (e = um, um = null, R = e) : R = t) : R = aa ? lm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function pa() {
		R = aa = null, z = !1;
	}
	function ma() {
		var e = oa;
		return e !== null && (pd === null ? pd = e : pd.push.apply(pd, e), oa = null), e;
	}
	function ha(e) {
		oa === null ? oa = [e] : oa.push(e);
	}
	var ga = we(null), _a = null, va = null;
	function ya(e, t, n) {
		N(ga, t._currentValue), t._currentValue = n;
	}
	function ba(e) {
		e._currentValue = ga.current, M(ga);
	}
	function xa(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Sa(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), xa(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), xa(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), xa(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function Ca(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					Ur(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === Oe.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [sh] : e.push(sh));
			}
			a = a.return;
		}
		return e !== null && Sa(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function wa(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Ur(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function Ta(e) {
		_a = e, va = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function Ea(e) {
		return Oa(_a, e);
	}
	function Da(e, t) {
		return _a === null && Ta(e), Oa(e, t);
	}
	function Oa(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, va === null) {
			if (e === null) throw Error(i(308));
			va = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else va = va.next = t;
		return n;
	}
	var ka = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, Aa = t.unstable_scheduleCallback, ja = t.unstable_NormalPriority, Ma = {
		$$typeof: oe,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function Na() {
		return {
			controller: new ka(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function Pa(e) {
		e.refCount--, e.refCount === 0 && Aa(ja, function() {
			e.controller.abort();
		});
	}
	function Fa(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Ia = null;
	function La(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Ra = null, za = 0, Ba = 0, Va = null;
	function Ha(e, t) {
		if (Ra === null) {
			var n = Ra = [];
			za = 0, Ba = Pf(), Va = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return za++, t.then(Ua, Ua), t;
	}
	function Ua() {
		if (--za === 0 && (Ia = null, Ra !== null)) {
			Va !== null && (Va.status = "fulfilled");
			var e = Ra;
			Ra = null, Ba = 0, Va = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Wa(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var Ga = A.S;
	A.S = function(e, t) {
		if (gd = We(), typeof t == "object" && t && typeof t.then == "function" && Ha(e, t), Ia !== null) for (var n = bf; n !== null;) Fa(n, Ia), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = bf; r !== null;) Fa(r, n), r = r.next;
			if (Ba !== 0) {
				r = Ia, r === null && (r = Ia = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ga !== null && Ga(e, t);
	};
	var Ka = we(null);
	function qa() {
		var e = Ka.current;
		return e === null ? K.pooledCache : e;
	}
	function Ja(e, t) {
		t === null ? N(Ka, Ka.current) : N(Ka, t.pool);
	}
	function Ya() {
		var e = qa();
		return e === null ? null : {
			parent: Ma._currentValue,
			pool: e
		};
	}
	var Xa = Error(i(460)), Za = Error(i(474)), Qa = Error(i(542)), $a = { then: function() {} };
	function eo(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function to(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(bn, bn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, ao(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(bn, bn);
				else {
					if (e = K, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, ao(e), e;
				}
				throw ro = t, Xa;
		}
	}
	function no(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (ro = e, Xa) : e;
		}
	}
	var ro = null;
	function io() {
		if (ro === null) throw Error(i(459));
		var e = ro;
		return ro = null, e;
	}
	function ao(e) {
		if (e === Xa || e === Qa) throw Error(i(483));
	}
	var oo = null, so = 0;
	function co(e) {
		var t = so;
		return so += 1, oo === null && (oo = []), to(oo, e, t);
	}
	function lo(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function uo(e, t) {
		throw t.$$typeof === D ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function fo(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = Ii(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Bi(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === O ? (e = d(e, t, n.props.children, r, n.key), lo(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === de && no(i) === t.type) ? (t = a(t, n.props), lo(t, n), t.return = e, t) : (t = Ri(n.type, n.key, n.props, null, e.mode, r), lo(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Hi(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = zi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Bi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case te: return n = Ri(t.type, t.key, t.props, null, e.mode, n), lo(n, t), n.return = e, n;
					case ne: return t = Hi(t, e.mode, n), t.return = e, t;
					case de: return t = no(t), f(e, t, n);
				}
				if (be(t) || _e(t)) return t = zi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, co(t), n);
				if (t.$$typeof === oe) return f(e, Da(e, t), n);
				uo(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case te: return n.key === i ? l(e, t, n, r) : null;
					case ne: return n.key === i ? u(e, t, n, r) : null;
					case de: return n = no(n), p(e, t, n, r);
				}
				if (be(n) || _e(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, co(n), r);
				if (n.$$typeof === oe) return p(e, t, Da(e, n), r);
				uo(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case te: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case ne: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case de: return r = no(r), m(e, t, n, r, i);
				}
				if (be(r) || _e(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, co(r), i);
				if (r.$$typeof === oe) return m(e, t, n, Da(t, r), i);
				uo(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), z && ea(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return z && ea(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), z && ea(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), z && ea(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return z && ea(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), z && ea(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === O && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case te:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === O) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), lo(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === de && no(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), lo(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === O ? (c = zi(o.props.children, e.mode, c, o.key), lo(c, o), c.return = e, e = c) : (c = Ri(o.type, o.key, o.props, null, e.mode, c), lo(c, o), c.return = e, e = c);
						}
						return s(e);
					case ne:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = Hi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case de: return o = no(o), _(e, r, o, c);
				}
				if (be(o)) return h(e, r, o, c);
				if (_e(o)) {
					if (l = _e(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, co(o), c);
				if (o.$$typeof === oe) return _(e, r, Da(e, o), c);
				uo(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = Bi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				so = 0;
				var i = _(e, t, n, r);
				return oo = null, i;
			} catch (t) {
				if (t === Xa || t === Qa) throw t;
				var a = Pi(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var po = fo(!0), mo = fo(!1), ho = !1;
	function go(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function _o(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function vo(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function yo(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, G & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = ji(e), Ai(e, null, n), t;
		}
		return Di(e, r, t, n), ji(e);
	}
	function bo(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, I(e, n);
		}
	}
	function xo(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
		} else e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var So = !1;
	function Co() {
		if (So) {
			var e = Va;
			if (e !== null) throw e;
		}
	}
	function wo(e, t, n, r) {
		So = !1;
		var i = e.updateQueue;
		ho = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (J & f) === f : (r & f) === f) {
					f !== 0 && f === Ba && (So = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break a;
								d = E({}, d, f);
								break a;
							case 2: ho = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), sd |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function To(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Eo(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) To(n[e], t);
	}
	var Do = we(null), Oo = we(0);
	function ko(e, t) {
		e = ad, N(Oo, e), N(Do, t), ad = e | t.baseLanes;
	}
	function Ao() {
		N(Oo, ad), N(Do, Do.current);
	}
	function jo() {
		ad = Oo.current, M(Do), M(Oo);
	}
	var Mo = we(null), No = null;
	function Po(e) {
		var t = e.alternate;
		N(zo, zo.current & 1), N(Mo, e), No === null && (t === null || Do.current !== null || t.memoizedState !== null) && (No = e);
	}
	function Fo(e) {
		N(zo, zo.current), N(Mo, e), No === null && (No = e);
	}
	function Io(e) {
		e.tag === 22 ? (N(zo, zo.current), N(Mo, e), No === null && (No = e)) : Lo();
	}
	function Lo() {
		N(zo, zo.current), N(Mo, Mo.current);
	}
	function Ro(e) {
		M(Mo), No === e && (No = null), M(zo);
	}
	var zo = we(0);
	function Bo(e, t) {
		N(Mo, Mo.current), N(zo, t);
	}
	function Vo(e) {
		M(zo), M(Mo), No === e && (No = null);
	}
	function Ho(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || om(n) || sm(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var Uo = 0, B = null, V = null, Wo = null, Go = !1, Ko = !1, qo = !1, Jo = 0, Yo = 0, Xo = null, Zo = 0;
	function Qo() {
		throw Error(i(321));
	}
	function $o(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Ur(e[n], t[n])) return !1;
		return !0;
	}
	function es(e, t, n, r, i, a) {
		return Uo = a, B = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, A.H = e === null || e.memoizedState === null ? _c : vc, qo = !1, a = n(r, i), qo = !1, Ko && (a = ns(t, n, r, i)), ts(e), a;
	}
	function ts(e) {
		A.H = gc;
		var t = V !== null && V.next !== null;
		if (Uo = 0, Wo = V = B = null, Go = !1, Yo = 0, Xo = null, t) throw Error(i(300));
		e === null || Fc || (e = e.dependencies, e !== null && wa(e) && (Fc = !0));
	}
	function ns(e, t, n, r) {
		B = e;
		var a = 0;
		do {
			if (Ko && (Xo = null), Yo = 0, Ko = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Wo = V = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			A.H = yc, o = t(n, r);
		} while (Ko);
		return o;
	}
	function rs() {
		var e = A.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? us(t) : t, e = e.useState()[0], (V === null ? null : V.memoizedState) !== e && (B.flags |= 1024), t;
	}
	function is() {
		var e = Jo !== 0;
		return Jo = 0, e;
	}
	function as(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function os(e) {
		if (Go) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Go = !1;
		}
		Uo = 0, Wo = V = B = null, Ko = !1, Yo = Jo = 0, Xo = null;
	}
	function ss() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Wo === null ? B.memoizedState = Wo = e : Wo = Wo.next = e, Wo;
	}
	function cs() {
		if (V === null) {
			var e = B.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = V.next;
		var t = Wo === null ? B.memoizedState : Wo.next;
		if (t !== null) Wo = t, V = e;
		else {
			if (e === null) throw B.alternate === null ? Error(i(467)) : Error(i(310));
			V = e, e = {
				memoizedState: V.memoizedState,
				baseState: V.baseState,
				baseQueue: V.baseQueue,
				queue: V.queue,
				next: null
			}, Wo === null ? B.memoizedState = Wo = e : Wo = Wo.next = e;
		}
		return Wo;
	}
	function ls() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function us(e) {
		var t = Yo;
		return Yo += 1, Xo === null && (Xo = []), e = to(Xo, e, t), t = B, (Wo === null ? t.memoizedState : Wo.next) === null && (t = t.alternate, A.H = t === null || t.memoizedState === null ? _c : vc), e;
	}
	function ds(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return us(e);
			if (e.$$typeof === he) return;
			if (e.$$typeof === oe) return Ea(e);
		}
		throw Error(i(438, String(e)));
	}
	function fs(e) {
		var t = null, n = B.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = B.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = ls(), B.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = k;
		return t.index++, n;
	}
	function ps(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function ms(e) {
		return hs(cs(), V, e);
	}
	function hs(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (Uo & f) === f : (J & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === Ba && (d = !0);
					else if ((Uo & p) === p) {
						u = u.next, p === Ba && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, B.lanes |= p, sd |= p;
					f = u.action, qo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, B.lanes |= f, sd |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Ur(o, e.memoizedState) && (Fc = !0, d && (n = Va, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function gs(e) {
		var t = cs(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Ur(o, t.memoizedState) || (Fc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function _s(e, t, n) {
		var r = B, a = cs(), o = z;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Ur((V || a).memoizedState, n);
		if (s && (a.memoizedState = n, Fc = !0), a = a.queue, Hs(bs.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Wo !== null && !!(Wo.memoizedState.tag & 1), Ls(e ? 9 : 8, { destroy: void 0 }, ys.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, K === null) throw Error(i(349));
			o || Uo & 127 || vs(r, t, n);
		}
		return n;
	}
	function vs(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = B.updateQueue, t === null ? (t = ls(), B.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function ys(e, t, n, r) {
		t.value = n, t.getSnapshot = r, xs(t) && Ss(e);
	}
	function bs(e, t, n) {
		return n(function() {
			xs(t) && Ss(e);
		});
	}
	function xs(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Ur(e, n);
		} catch {
			return !0;
		}
	}
	function Ss(e) {
		var t = ki(e, 2);
		t !== null && Pd(t, e, 2);
	}
	function Cs(e) {
		var t = ss();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), qo) {
				et(!0);
				try {
					n();
				} finally {
					et(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: ps,
			lastRenderedState: e
		}, t;
	}
	function ws(e, t, n, r) {
		return e.baseState = n, hs(e, V, typeof r == "function" ? r : ps);
	}
	function Ts(e, t, n, r, a) {
		if (pc(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			A.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Es(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Es(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = A.T, o = {};
			o.types = a === null ? null : a.types, A.T = o;
			try {
				var s = n(i, r), c = A.S;
				c !== null && c(o, s), Ds(e, t, s);
			} catch (n) {
				ks(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), A.T = a;
			}
		} else try {
			a = n(i, r), Ds(e, t, a);
		} catch (n) {
			ks(e, t, n);
		}
	}
	function Ds(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Os(e, t, n);
		}, function(n) {
			return ks(e, t, n);
		}) : Os(e, t, n);
	}
	function Os(e, t, n) {
		t.status = "fulfilled", t.value = n, As(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Es(e, n)));
	}
	function ks(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, As(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function As(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function js(e, t) {
		return t;
	}
	function Ms(e, t) {
		if (z) {
			var n = K.formState;
			if (n !== null) {
				a: {
					var r = B;
					if (z) {
						if (R) {
							b: {
								for (var i = R, a = sa; i.nodeType !== 8;) if (!a || (i = lm(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								R = lm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						la(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = ss(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: js,
			lastRenderedState: t
		}, n.queue = r, n = uc.bind(null, B, r), r.dispatch = n, r = Cs(!1), a = fc.bind(null, B, !1, r.queue), r = ss(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Ts.bind(null, B, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Ns(e) {
		return Ps(cs(), V, e);
	}
	function Ps(e, t, n) {
		if (t = hs(e, t, js)[0], e = ms(ps)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = us(t);
		} catch (e) {
			throw e === Xa ? Qa : e;
		}
		else r = t;
		t = cs();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (B.flags |= 2048, Ls(9, { destroy: void 0 }, Fs.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Fs(e, t) {
		e.action = t;
	}
	function Is(e) {
		var t = cs(), n = V;
		if (n !== null) return Ps(t, n, e);
		cs(), t = t.memoizedState, n = cs();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function Ls(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = B.updateQueue, t === null && (t = ls(), B.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function Rs() {
		return cs().memoizedState;
	}
	function zs(e, t, n, r) {
		var i = ss();
		B.flags |= e, i.memoizedState = Ls(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Bs(e, t, n, r) {
		var i = cs();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		V !== null && r !== null && $o(r, V.memoizedState.deps) ? i.memoizedState = Ls(t, a, n, r) : (B.flags |= e, i.memoizedState = Ls(1 | t, a, n, r));
	}
	function Vs(e, t) {
		zs(8390656, 8, e, t);
	}
	function Hs(e, t) {
		Bs(2048, 8, e, t);
	}
	function Us(e) {
		B.flags |= 4;
		var t = B.updateQueue;
		if (t === null) t = ls(), B.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Ws(e) {
		var t = cs().memoizedState;
		return Us({
			ref: t,
			nextImpl: e
		}), function() {
			if (G & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Gs(e, t) {
		return Bs(4, 2, e, t);
	}
	function Ks(e, t) {
		return Bs(4, 4, e, t);
	}
	function qs(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Js(e, t, n) {
		n = n == null ? null : n.concat([e]), Bs(4, 4, qs.bind(null, t, e), n);
	}
	function Ys() {}
	function Xs(e, t) {
		var n = cs();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && $o(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Zs(e, t) {
		var n = cs();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && $o(t, r[1])) return r[0];
		if (r = e(), qo) {
			et(!0);
			try {
				e();
			} finally {
				et(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Qs(e, t, n) {
		return n === void 0 || Uo & 1073741824 && !(J & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Md(), B.lanes |= e, sd |= e, n);
	}
	function $s(e, t, n, r) {
		return Ur(n, t) ? n : Do.current === null ? !(Uo & 106) || Uo & 1073741824 && !(J & 261930) ? (Fc = !0, e.memoizedState = n) : (e = Md(), B.lanes |= e, sd |= e, t) : (e = Qs(e, n, r), Ur(e, t) || (Fc = !0), e);
	}
	function ec(e, t, n, r, i) {
		var a = j.p;
		j.p = a !== 0 && 8 > a ? a : 8;
		var o = A.T, s = {};
		s.types = o === null ? null : o.types, A.T = s, fc(e, !1, t, n);
		try {
			var c = i(), l = A.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? dc(e, t, Wa(c, r), jd(e)) : dc(e, t, r, jd(e));
		} catch (n) {
			dc(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, jd());
		} finally {
			j.p = a, o !== null && s.types !== null && (o.types = s.types), A.T = o;
		}
	}
	function tc() {}
	function nc(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = rc(e).queue;
		ec(e, a, t, xe, n === null ? tc : function() {
			return ic(e), n(r);
		});
	}
	function rc(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: xe,
			baseState: xe,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: ps,
				lastRenderedState: xe
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: ps,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function ic(e) {
		var t = rc(e);
		t.next === null && (t = e.alternate.memoizedState), dc(e, t.next.queue, {}, jd());
	}
	function ac() {
		return Ea(sh);
	}
	function oc() {
		return cs().memoizedState;
	}
	function sc() {
		return cs().memoizedState;
	}
	function cc(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = jd();
					e = vo(n);
					var r = yo(t, e, n);
					r !== null && (Pd(r, t, n), bo(r, t, n)), t = { cache: Na() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function lc(e, t, n) {
		var r = jd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, pc(e) ? mc(t, n) : (n = Oi(e, t, n, r), n !== null && (Pd(n, e, r), hc(n, t, r)));
	}
	function uc(e, t, n) {
		dc(e, t, n, jd());
	}
	function dc(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (pc(e)) mc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Ur(s, o)) return Di(e, t, i, 0), K === null && Ei(), !1;
			} catch {}
			if (n = Oi(e, t, i, r), n !== null) return Pd(n, e, r), hc(n, t, r), !0;
		}
		return !1;
	}
	function fc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Pf(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, pc(e)) {
			if (t) throw Error(i(479));
		} else t = Oi(e, n, r, 2), t !== null && Pd(t, e, 2);
	}
	function pc(e) {
		var t = e.alternate;
		return e === B || t !== null && t === B;
	}
	function mc(e, t) {
		Ko = Go = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function hc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, I(e, n);
		}
	}
	var gc = {
		readContext: Ea,
		use: ds,
		useCallback: Qo,
		useContext: Qo,
		useEffect: Qo,
		useImperativeHandle: Qo,
		useLayoutEffect: Qo,
		useInsertionEffect: Qo,
		useMemo: Qo,
		useReducer: Qo,
		useRef: Qo,
		useState: Qo,
		useDebugValue: Qo,
		useDeferredValue: Qo,
		useTransition: Qo,
		useSyncExternalStore: Qo,
		useId: Qo,
		useHostTransitionStatus: Qo,
		useFormState: Qo,
		useActionState: Qo,
		useOptimistic: Qo,
		useMemoCache: Qo,
		useCacheRefresh: Qo,
		useEffectEvent: Qo
	}, _c = {
		readContext: Ea,
		use: ds,
		useCallback: function(e, t) {
			return ss().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: Ea,
		useEffect: Vs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), zs(4194308, 4, qs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return zs(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			zs(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = ss();
			t = t === void 0 ? null : t;
			var r = e();
			if (qo) {
				et(!0);
				try {
					e();
				} finally {
					et(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = ss();
			if (n !== void 0) {
				var i = n(t);
				if (qo) {
					et(!0);
					try {
						n(t);
					} finally {
						et(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = lc.bind(null, B, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = ss();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Cs(e);
			var t = e.queue, n = uc.bind(null, B, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Ys,
		useDeferredValue: function(e, t) {
			return Qs(ss(), e, t);
		},
		useTransition: function() {
			var e = Cs(!1);
			return e = ec.bind(null, B, e.queue, !0, !1), ss().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = B, a = ss();
			if (z) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), K === null) throw Error(i(349));
				J & 127 || vs(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Vs(bs.bind(null, r, o, e), [e]), r.flags |= 2048, Ls(9, { destroy: void 0 }, ys.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = ss(), t = K.identifierPrefix;
			if (z) {
				var n = $i, r = Qi;
				n = (r & ~(1 << 32 - tt(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Jo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Zo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: ac,
		useFormState: Ms,
		useActionState: Ms,
		useOptimistic: function(e) {
			var t = ss();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = fc.bind(null, B, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: fs,
		useCacheRefresh: function() {
			return ss().memoizedState = cc.bind(null, B);
		},
		useEffectEvent: function(e) {
			var t = ss(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (G & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, vc = {
		readContext: Ea,
		use: ds,
		useCallback: Xs,
		useContext: Ea,
		useEffect: Hs,
		useImperativeHandle: Js,
		useInsertionEffect: Gs,
		useLayoutEffect: Ks,
		useMemo: Zs,
		useReducer: ms,
		useRef: Rs,
		useState: function() {
			return ms(ps);
		},
		useDebugValue: Ys,
		useDeferredValue: function(e, t) {
			return $s(cs(), V.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ms(ps)[0], t = cs().memoizedState;
			return [typeof e == "boolean" ? e : us(e), t];
		},
		useSyncExternalStore: _s,
		useId: oc,
		useHostTransitionStatus: ac,
		useFormState: Ns,
		useActionState: Ns,
		useOptimistic: function(e, t) {
			return ws(cs(), V, e, t);
		},
		useMemoCache: fs,
		useCacheRefresh: sc,
		useEffectEvent: Ws
	}, yc = {
		readContext: Ea,
		use: ds,
		useCallback: Xs,
		useContext: Ea,
		useEffect: Hs,
		useImperativeHandle: Js,
		useInsertionEffect: Gs,
		useLayoutEffect: Ks,
		useMemo: Zs,
		useReducer: gs,
		useRef: Rs,
		useState: function() {
			return gs(ps);
		},
		useDebugValue: Ys,
		useDeferredValue: function(e, t) {
			var n = cs();
			return V === null ? Qs(n, e, t) : $s(n, V.memoizedState, e, t);
		},
		useTransition: function() {
			var e = gs(ps)[0], t = cs().memoizedState;
			return [typeof e == "boolean" ? e : us(e), t];
		},
		useSyncExternalStore: _s,
		useId: oc,
		useHostTransitionStatus: ac,
		useFormState: Is,
		useActionState: Is,
		useOptimistic: function(e, t) {
			var n = cs();
			return V === null ? (n.baseState = e, [e, n.queue.dispatch]) : ws(n, V, e, t);
		},
		useMemoCache: fs,
		useCacheRefresh: sc,
		useEffectEvent: Ws
	};
	function bc(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : E({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var xc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = vo(r);
			i.payload = t, n != null && (i.callback = n), t = yo(e, i, r), t !== null && (Pd(t, e, r), bo(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = vo(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = yo(e, i, r), t !== null && (Pd(t, e, r), bo(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = jd(), r = vo(n);
			r.tag = 2, t != null && (r.callback = t), t = yo(e, r, n), t !== null && (Pd(t, e, n), bo(t, e, n));
		}
	};
	function Sc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Wr(n, r) || !Wr(i, a) : !0;
	}
	function Cc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && xc.enqueueReplaceState(t, t.state, null);
	}
	function wc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = E({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Tc(e) {
		Si(e);
	}
	function Ec(e) {
		console.error(e);
	}
	function Dc(e) {
		Si(e);
	}
	function Oc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function kc(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Ac(e, t, n) {
		return n = vo(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Oc(e, t);
		}, n;
	}
	function jc(e) {
		return e = vo(e), e.tag = 3, e;
	}
	function Mc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				kc(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			kc(t, n, r), typeof i != "function" && (yd === null ? yd = /* @__PURE__ */ new Set([this]) : yd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Nc(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Ca(t, n, a, !0), n = Mo.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return No === null ? Kd() : n.alternate === null && od === 0 && (od = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === $a ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), mf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === $a ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), mf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return mf(e, r, a), Kd(), !1;
		}
		if (z) return t = Mo.current, t === null ? (r !== ca && (t = Error(i(423), { cause: r }), ha(Wi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Wi(r, n), a = Ac(e.stateNode, r, a), xo(e, a), od !== 4 && (od = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== ca && (e = Error(i(422), { cause: r }), ha(Wi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Wi(o, n), fd === null ? fd = [o] : fd.push(o), od !== 4 && (od = 2), t === null) return !0;
		r = Wi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Ac(n.stateNode, r, e), xo(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (yd === null || !yd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = jc(a), Mc(a, e, n, r), xo(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Pc = Error(i(461)), Fc = !1;
	function Ic(e, t, n, r) {
		t.child = e === null ? mo(t, null, n, r) : po(t, e.child, n, r);
	}
	function Lc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return Ta(t), r = es(e, t, n, o, a, i), s = is(), e !== null && !Fc ? (as(e, t, i), dl(e, t, i)) : (z && s && na(t), t.flags |= 1, Ic(e, t, r, i), t.child);
	}
	function Rc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Fi(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, zc(e, t, a, r, i)) : (e = Ri(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !fl(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Wr : n, n(o, r) && e.ref === t.ref) return dl(e, t, i);
		}
		return t.flags |= 1, e = Ii(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function zc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Wr(a, r) && e.ref === t.ref) {
				if (Fc = !1, t.pendingProps = r = a, fl(e, i)) e.flags & 131072 && (Fc = !0);
				else return t.lanes = e.lanes, dl(e, t, i);
			}
		}
		return qc(e, t, n, r, i);
	}
	function Bc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return Hc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Ja(t, a === null ? null : a.cachePool), a === null ? Ao() : ko(t, a), Io(t);
			else return r = t.lanes = 536870912, Hc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Ja(t, null), Ao(), Lo()) : (Ja(t, a.cachePool), ko(t, a), Lo(), t.memoizedState = null);
		return Ic(e, t, i, n), t.child;
	}
	function Vc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Hc(e, t, n, r, i) {
		var a = qa();
		return a = a === null ? null : {
			parent: Ma._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Ja(t, null), Ao(), Io(t), e !== null && Ca(e, t, r, !0), t.childLanes = i, null;
	}
	function Uc(e, t) {
		return t = nl({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Wc(e, t, n) {
		return po(t, e.child, null, n), e = Uc(t, t.pendingProps), e.flags |= 2, Ro(t), t.memoizedState = null, e;
	}
	function Gc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (z) {
				if (r.mode === "hidden") return e = Uc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Vc(null, e);
				if (Fo(t), (e = R) ? (e = am(e, sa), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Zi === null ? null : {
						id: Qi,
						overflow: $i
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Vi(e), n.return = t, t.child = n, aa = t, R = null)) : e = null, e === null) throw la(t);
				return t.lanes = 536870912, null;
			}
			return Uc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Fo(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Wc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Fc || Ca(e, t, n, !1), a = (n & e.childLanes) !== 0, Fc || a) {
				if (Do.current === null) {
					if (r = K, r !== null && (s = vt(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, ki(e, s), Pd(r, e, s), Pc;
					Kd();
				}
				t = Wc(e, t, n);
			} else e = o.treeContext, R = lm(s.nextSibling), aa = t, z = !0, oa = null, sa = !1, e !== null && ia(t, e), t = Uc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = Ii(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function Kc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function qc(e, t, n, r, i) {
		return Ta(t), n = es(e, t, n, r, void 0, i), r = is(), e !== null && !Fc ? (as(e, t, i), dl(e, t, i)) : (z && r && na(t), t.flags |= 1, Ic(e, t, n, i), t.child);
	}
	function Jc(e, t, n, r, i, a) {
		return Ta(t), t.updateQueue = null, n = ns(t, r, n, i), ts(e), r = is(), e !== null && !Fc ? (as(e, t, a), dl(e, t, a)) : (z && r && na(t), t.flags |= 1, Ic(e, t, n, a), t.child);
	}
	function Yc(e, t, n, r, i) {
		if (Ta(t), t.stateNode === null) {
			var a = Mi, o = n.contextType;
			typeof o == "object" && o && (a = Ea(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = xc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, go(t), o = n.contextType, a.context = typeof o == "object" && o ? Ea(o) : Mi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (bc(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && xc.enqueueReplaceState(a, a.state, null), wo(t, r, a, i), Co(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = wc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Mi, typeof u == "object" && u && (o = Ea(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Cc(t, a, r, o), ho = !1;
			var f = t.memoizedState;
			a.state = f, wo(t, r, a, i), Co(), l = t.memoizedState, s || f !== l || ho ? (typeof d == "function" && (bc(t, n, d, r), l = t.memoizedState), (c = ho || Sc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, _o(e, t), o = t.memoizedProps, u = wc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Mi, typeof l == "object" && l && (c = Ea(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Cc(t, a, r, c), ho = !1, f = t.memoizedState, a.state = f, wo(t, r, a, i), Co();
			var p = t.memoizedState;
			o !== d || f !== p || ho || e !== null && e.dependencies !== null && wa(e.dependencies) ? (typeof s == "function" && (bc(t, n, s, r), p = t.memoizedState), (u = ho || Sc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && wa(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, Kc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = po(t, e.child, null, i), t.child = po(t, null, n, i)) : Ic(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = dl(e, t, i), e;
	}
	function Xc(e, t, n, r) {
		return pa(), t.flags |= 256, Ic(e, t, n, r), t.child;
	}
	var Zc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Qc(e) {
		return {
			baseLanes: e,
			cachePool: Ya()
		};
	}
	function $c(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= ud), e;
	}
	function el(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(zo.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (z) {
				if (i ? Po(t) : Lo(), (e = R) ? (e = am(e, sa), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Zi === null ? null : {
						id: Qi,
						overflow: $i
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Vi(e), n.return = t, t.child = n, aa = t, R = null)) : e = null, e === null) throw la(t);
				return t.lanes = sm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Lo(), i = t.mode, a = nl({
				mode: "hidden",
				children: a
			}, i), r = zi(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = Qc(n), r.childLanes = $c(e, o, n), t.memoizedState = Zc, Vc(null, r)) : (Po(t), tl(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return il(e, t, a, o, r, c, s, n);
		}
		return i ? (Lo(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = Ii(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = zi(i, a, n, null), i.flags |= 2) : i = Ii(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Vc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = Qc(n) : (a = i.cachePool, a === null ? a = Ya() : (s = Ma._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = $c(e, o, n), t.memoizedState = Zc, Vc(e.child, r)) : (Po(t), n = e.child, e = n.sibling, n = Ii(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function tl(e, t) {
		return t = nl({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function nl(e, t) {
		return e = Pi(22, e, null, t), e.lanes = 0, e;
	}
	function rl(e, t, n) {
		return po(t, e.child, null, n), e = tl(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function il(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (Po(t), t.flags &= -257, rl(e, t, c)) : t.memoizedState === null ? (Lo(), o = a.fallback, s = t.mode, a = nl({
			mode: "visible",
			children: a.children
		}, s), o = zi(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, po(t, e.child, null, c), a = t.child, a.memoizedState = Qc(c), a.childLanes = $c(e, r, c), t.memoizedState = Zc, Vc(null, a)) : (Lo(), t.child = e.child, t.flags |= 128, null);
		if (Po(t), sm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, ha({
				value: a,
				source: null,
				stack: null
			})), rl(e, t, c);
		}
		if (Fc || Ca(e, t, c, !1), r = (c & e.childLanes) !== 0, Fc || r) {
			if (Do.current !== null) return rl(e, t, c);
			if (r = K, r !== null && (a = vt(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, ki(e, a), Pd(r, e, a), Pc;
			return om(o) || Kd(), rl(e, t, c);
		}
		return om(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, R = lm(o.nextSibling), aa = t, z = !0, oa = null, sa = !1, e !== null && ia(t, e), t = tl(t, a.children), t.flags |= 134221824, t);
	}
	function al(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), xa(e.return, t, n);
	}
	function ol(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && Ho(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function sl(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function cl(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function ll(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = zo.current;
		if (t.flags & 128) return Bo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Bo(t, o), i === "backwards" && e !== null ? (cl(e), Ic(e, t, r, n), cl(e)) : Ic(e, t, r, n), r = z ? Ji : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && al(e, n, t);
			else if (e.tag === 19) al(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = ol(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, cl(t)), sl(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && Ho(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				sl(t, !0, n, null, a, r);
				break;
			case "together":
				sl(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = ol(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), sl(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function ul(e, t, n) {
		var r = t.pendingProps;
		return ya(t, t.type, r.value), Ic(e, t, r.children, n), t.child;
	}
	function dl(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), sd |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (Ca(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = Ii(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Ii(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function fl(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && wa(e)));
	}
	function pl(e, t, n) {
		switch (t.tag) {
			case 3:
				P(t, t.stateNode.containerInfo), ya(t, Ma, e.memoizedState.cache), pa();
				break;
			case 27:
			case 5:
				Ae(t);
				break;
			case 4:
				P(t, t.stateNode.containerInfo);
				break;
			case 10:
				ya(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Fo(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return Po(t), t.flags |= 128, null;
					r = Ca(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? el(e, t, n) : (Po(t), e = dl(e, t, n), e === null ? null : e.sibling);
				}
				Po(t);
				break;
			case 19:
				if (t.flags & 128) return ll(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (Ca(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return ll(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Bo(t, zo.current), r) break;
				return null;
			case 22: return t.lanes = 0, Bc(e, t, n, t.pendingProps);
			case 24: ya(t, Ma, e.memoizedState.cache);
		}
		return dl(e, t, n);
	}
	function ml(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Fc = !0;
			else {
				if (!fl(e, n) && !(t.flags & 128)) return Fc = !1, pl(e, t, n);
				Fc = !!(e.flags & 131072);
			}
		} else Fc = !1, z && t.flags & 1048576 && ta(t, Ji, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = no(t.elementType), t.type = e, typeof e == "function") Fi(e) ? (r = wc(e, r), t.tag = 1, t = Yc(null, t, e, r, n)) : (t.tag = 0, t = qc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === se) {
								t.tag = 11, t = Lc(null, t, e, r, n);
								break a;
							}
							if (a === ue) {
								t.tag = 14, t = Rc(null, t, e, r, n);
								break a;
							}
							if (a === oe) {
								t.tag = 10, t.type = e, t = ul(null, t, n);
								break a;
							}
						}
						throw t = ye(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return qc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = wc(r, t.pendingProps), Yc(e, t, r, a, n);
			case 3:
				a: {
					if (P(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, _o(e, t), wo(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, ya(t, Ma, r), r !== o.cache && Sa(t, [Ma], n, !0), Co(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = Xc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = Wi(Error(i(424)), t), ha(a), t = Xc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (R = lm(e.firstChild), aa = t, z = !0, oa = null, sa = !0, n = mo(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (pa(), r === a) {
							t = dl(e, t, n);
							break a;
						}
						Ic(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return Kc(e, t), e === null ? (n = Nm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : z || (t.stateNode = fp(t.type, t.pendingProps, De.current, t)) : t.memoizedState = Nm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return Ae(t), e === null && z && (r = t.stateNode = hm(t.type, t.pendingProps, De.current), aa = t, sa = !0, a = R, Sp(t.type) ? (um = a, R = lm(r.firstChild)) : R = a), Ic(e, t, t.pendingProps.children, n), Kc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && z && ((a = r = R) && (r = rm(r, t.type, t.pendingProps, sa), r === null ? a = !1 : (t.stateNode = r, aa = t, R = lm(r.firstChild), sa = !1, a = !0)), a || la(t)), Ae(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, pp(a, o) ? r = null : s !== null && pp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = es(e, t, rs, null, null, n), sh._currentValue = a), Kc(e, t), Ic(e, t, r, n), t.child;
			case 6: return e === null && z && ((e = n = R) && (n = im(n, t.pendingProps, sa), n === null ? e = !1 : (t.stateNode = n, aa = t, R = null, e = !0)), e || la(t)), null;
			case 13: return el(e, t, n);
			case 4: return P(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = po(t, null, r, n) : Ic(e, t, r, n), t.child;
			case 11: return Lc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, Kc(e, t), Ic(e, t, r, n), t.child;
			case 8: return Ic(e, t, t.pendingProps.children, n), t.child;
			case 12: return Ic(e, t, t.pendingProps.children, n), t.child;
			case 10: return ul(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, Ta(t), a = Ea(a), r = r(a), t.flags |= 1, Ic(e, t, r, n), t.child;
			case 14: return Rc(e, t, t.type, t.pendingProps, n);
			case 15: return zc(e, t, t.type, t.pendingProps, n);
			case 19: return ll(e, t, n);
			case 31: return Gc(e, t, n);
			case 22: return Bc(e, t, n, t.pendingProps);
			case 24: return Ta(t), r = Ea(Ma), e === null ? (a = qa(), a === null && (a = K, o = Na(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, go(t), ya(t, Ma, a)) : ((e.lanes & n) !== 0 && (_o(e, t), wo(t, null, null, n), Co()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, ya(t, Ma, r), r !== a.cache && Sa(t, [Ma], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), ya(t, Ma, r))), Ic(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : z && na(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : Kc(e, t), Ic(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function hl(e) {
		e.flags |= 4;
	}
	function gl(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Jm(t, r) : Jm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Ud()) e.flags |= 8192;
				else throw ro = $a, Za;
			}
		} else e.flags &= -16777217;
	}
	function _l(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Ym(t)) {
			if (Ud()) e.flags |= 8192;
			else throw ro = $a, Za;
		}
	}
	function vl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : pt(), e.lanes |= t, dd |= t);
	}
	function yl(e, t) {
		if (!z) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function H(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function bl(e, t, n) {
		var r = t.pendingProps;
		switch (ra(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return H(t), null;
			case 1: return H(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), ba(Ma), ke(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (fa(t) ? hl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, ma())), H(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (hl(t), o === null ? (H(t), gl(t, a, null, r, n)) : (H(t), _l(t, o))) : o ? o === e.memoizedState ? (H(t), t.flags &= -16777217) : (hl(t), H(t), _l(t, o)) : (e = e.memoizedProps, e !== r && hl(t), H(t), gl(t, a, e, r, n)), null;
			case 27:
				if (je(t), n = De.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && hl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return H(t), t.subtreeFlags &= -33554433, null;
					}
					e = Te.current, fa(t) ? ua(t, e) : (e = hm(a, r, n), t.stateNode = e, hl(t));
				}
				return H(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (je(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && hl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return H(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = Te.current, fa(t)) ua(t, o);
					else {
						var s = lp(De.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[wt] = t, o[Tt] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (np(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && hl(t);
					}
				}
				return H(t), t.subtreeFlags &= -33554433, gl(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && hl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = De.current, fa(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = aa, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[wt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || ep(e.nodeValue, n)), e || la(t, !0);
					} else e = lp(e).createTextNode(r), e[wt] = t, t.stateNode = e;
				}
				return H(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = fa(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[wt] = t;
						} else pa(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						H(t), e = !1;
					} else n = ma(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (Ro(t), t) : (Ro(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return H(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = fa(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[wt] = t;
						} else pa(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						H(t), a = !1;
					} else a = ma(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (Ro(t), t) : (Ro(t), null);
				}
				return Ro(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), vl(t, t.updateQueue), H(t), null);
			case 4: return ke(), e === null && Wf(t.stateNode.containerInfo), t.flags |= 67108864, H(t), null;
			case 10: return ba(t.type), H(t), null;
			case 19:
				if (Vo(t), r = t.memoizedState, r === null) return H(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) yl(r, !1);
					else {
						if (od !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = Ho(e), o !== null) {
								for (t.flags |= 128, yl(r, !1), e = o.updateQueue, t.updateQueue = e, vl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Li(n, e), n = n.sibling;
								return Bo(t, zo.current & 1 | 2), z && ea(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && We() > _d && (t.flags |= 128, a = !0, yl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = Ho(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, vl(t, e), yl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !z) return H(t), null;
						} else 2 * We() - r.renderingStartTime > _d && n !== 536870912 && (t.flags |= 128, a = !0, yl(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				if (r.tail !== null) {
					e = r.tail;
					a: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break a;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = We(), e.sibling = null, o = zo.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || z ? Bo(t, o) : (n = o, N(Mo, t), N(zo, n), No === null && (No = t)), z && ea(t, r.treeForkCount), e;
				}
				return H(t), null;
			case 22:
			case 23: return Ro(t), jo(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (H(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : H(t), n = t.updateQueue, n !== null && vl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && M(Ka), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), ba(Ma), H(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, H(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function xl(e, t) {
		switch (ra(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return ba(Ma), ke(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return je(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (Ro(t), t.alternate === null) throw Error(i(340));
					pa();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (Ro(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					pa();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return Vo(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return ke(), null;
			case 10: return ba(t.type), null;
			case 22:
			case 23: return Ro(t), jo(), e !== null && M(Ka), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return ba(Ma), null;
			case 25: return null;
			default: return null;
		}
	}
	function Sl(e, t) {
		switch (ra(t), t.tag) {
			case 3:
				ba(Ma), ke();
				break;
			case 26:
			case 27:
			case 5:
				je(t);
				break;
			case 4:
				ke();
				break;
			case 31:
				t.memoizedState !== null && Ro(t);
				break;
			case 13:
				Ro(t);
				break;
			case 19:
				Vo(t);
				break;
			case 10:
				ba(t.type);
				break;
			case 22:
			case 23:
				Ro(t), jo(), e !== null && M(Ka);
				break;
			case 24: ba(Ma);
		}
	}
	function Cl(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function wl(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Z(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Tl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Eo(t, n);
			} catch (t) {
				Z(e, e.return, t);
			}
		}
	}
	function El(e, t, n) {
		n.props = wc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Z(e, t, n);
		}
	}
	function Dl(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = yi(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Pp(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Fp(e);
							h(e.child, !1, Qp, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Z(e, t, n);
		}
	}
	function Ol(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				Z(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				Z(e, t, n);
			}
			else n.current = null;
		}
	}
	function kl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) em(e.stateNode, t[n]);
	}
	function Al(e) {
		for (var t = e.return; t !== null && (Nl(t) && em(e.stateNode, t.stateNode), !Ml(t));) t = t.return;
	}
	function jl(e) {
		for (var t = e.return; t !== null && (Nl(t) && tm(e.stateNode, t.stateNode), !Ml(t));) t = t.return;
	}
	function Ml(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function Nl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Pl(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Fl(e, t, n) {
		try {
			var r = e.stateNode;
			ip(r, e.type, n, t), r[Tt] = t;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Il(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Sp(e.type) || e.tag === 4;
	}
	function Ll(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Il(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Sp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Rl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = bn)), kl(e, r), L = !0;
		else if (i !== 4 && (i === 27 && (kl(e, r), r = null, Sp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Rl(e, t, n, r), e = e.sibling; e !== null;) Rl(e, t, n, r), e = e.sibling;
	}
	function zl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), kl(e, r), L = !0;
		else if (i !== 4 && (i === 27 && (kl(e, r), r = null, Sp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (zl(e, t, n, r), e = e.sibling; e !== null;) zl(e, t, n, r), e = e.sibling;
	}
	function Bl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			np(t, r, n), t[wt] = e, t[Tt] = n;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	var Vl = !1, Hl = null;
	function Ul(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Vl = !0);
	}
	var Wl = null;
	function Gl() {
		var e = Wl;
		return Wl = null, e;
	}
	var Kl = 0;
	function ql(e, t, n, r, i) {
		return Kl = 0, Jl(e.child, t, n, r, i);
	}
	function Jl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Op(o);
					r.push(s), s.view && (a = !0);
				} else a || Op(o).view && (a = !0);
				Vl = !0, Tp(o, Kl === 0 ? t : t + "_" + Kl, n), Kl++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || Jl(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function Yl(e, t) {
		for (; e !== null;) e.tag === 5 ? Ep(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || Yl(e.child, t), e = e.sibling;
	}
	function Xl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Xl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = xi(t.default, t.share), t !== "none" && (ql(e, n, t, null, !1) || Yl(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Zl(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = yi(r, n), a = xi(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Xl(e) : ql(e, i, a, null, !1) ? (Xl(e), n.paired || t || Nd(e, r.onEnter)) : Yl(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Zl(e, t), e = e.sibling;
		else Xl(e);
	}
	function Ql(e) {
		if (Hl !== null && Hl.size !== 0) {
			var t = Hl;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = xi(n.default, n.share);
								if (a !== "none" && (ql(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Nd(e, n.onShare)) : Yl(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					Ql(e);
				}
				e = e.sibling;
			}
		}
	}
	function $l(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = yi(t, e.stateNode), r = Hl === null ? void 0 : Hl.get(n), i = xi(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (ql(e, n, i, null, !1) ? r === void 0 ? Nd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Hl.delete(n), Nd(e, t.onShare)) : Yl(e.child, !1)), Hl !== null && Ql(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) $l(e), e = e.sibling;
		else Hl !== null && Ql(e);
	}
	function eu(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = yi(t, e.stateNode);
				t = xi(t.default, t.update), e.flags &= -5, t !== "none" && ql(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && eu(e);
			e = e.sibling;
		}
	}
	function tu(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, Yl(e.child, !1));
				}
				tu(e);
			}
			e = e.sibling;
		}
	}
	function nu(e) {
		if (e.tag === 30) e.stateNode.paired = null, Yl(e.child, !1), tu(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) nu(e), e = e.sibling;
		else tu(e);
	}
	function ru(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? Yl(e.child, !1) : e.subtreeFlags & 33554432 && ru(e), e = e.sibling;
	}
	function iu(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && Kl < a.length) {
					var l = a[Kl], u = Op(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Tp(c, Kl === 0 ? n : n + "_" + Kl, i), s && e.flags & 4 || (Wl === null && (Wl = []), Wl.push(c, Kl === 0 ? r : r + "_" + Kl, t.memoizedProps)), Kl++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : iu(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function au(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = yi(n, r), a = xi(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(kp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				Kl = 0, i = iu(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Nd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && au(e, t);
			e = e.sibling;
		}
	}
	var ou = !1, U = !1, su = !1, cu = !1, lu = typeof WeakSet == "function" ? WeakSet : Set, uu = null, du = !1, fu = !1, pu = !1, mu = !1;
	function hu(e, t, n) {
		if (e = e.containerInfo, sp = gh, e = Yr(e), Xr(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (cp = {
			focusedElem: e,
			selectionRange: r
		}, gh = !1, n = (n & 335544064) === n, uu = t, t = n ? 9270 : 1024; uu !== null;) {
			if (e = uu, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && $l(r[a]);
			if (e.alternate === null && e.flags & 2) n && Ul(e), gu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && $l(r), gu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Ul(e), gu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, uu = r) : (n && eu(e), gu(n));
			}
		}
		Hl = null;
	}
	function gu(e) {
		for (; uu !== null;) {
			var t = uu, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = wc(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							Z(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) nm(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								nm(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = yi(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = xi(a.default, a.update), a !== "none" && ql(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, uu = r;
				break;
			}
			uu = t.return;
		}
	}
	function _u(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Iu(e, n), r & 4 && Cl(5, n);
				break;
			case 1:
				if (Iu(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						Z(n, n.return, e);
					}
					else {
						var i = wc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							Z(n, n.return, e);
						}
					}
				}
				r & 64 && Tl(n), r & 512 && Dl(n, n.return);
				break;
			case 3:
				if (Iu(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Eo(e, t);
					} catch (e) {
						Z(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Bl(n);
			case 26:
			case 5:
				Iu(e, n), t === null && r & 4 && Pl(n), r & 512 && Dl(n, n.return);
				break;
			case 12:
				Iu(e, n);
				break;
			case 31:
				Iu(e, n), r & 4 && Tu(e, n);
				break;
			case 13:
				Iu(e, n), r & 4 && Eu(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = _f.bind(null, n), cm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || ou, !r) {
					var a = t !== null && t.memoizedState !== null || U;
					t = ou, i = U, ou = r, (U = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Ru(e, n, r)) : Iu(e, n), ou = t, U = i;
				}
				break;
			case 30:
				Iu(e, n), r & 512 && Dl(n, n.return);
				break;
			case 7: r & 512 && Dl(n, n.return);
			default: Iu(e, n);
		}
	}
	function vu(e, t) {
		for (e = e.child; e !== null;) yu(e, t), e = e.sibling;
	}
	function yu(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					Z(e, e.return, t);
				}
				bu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, L = !0;
				} catch (t) {
					Z(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? wp(s, !0) : wp(e.stateNode, !1);
				} catch (t) {
					Z(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && vu(e, t);
				break;
			default: vu(e, t);
		}
	}
	function bu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						yu(n, r);
						break a;
					case 22:
						n.memoizedState === null && bu(n, r);
						break a;
					default: bu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function xu(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, xu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Nt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var W = null, Su = !1;
	function Cu(e, t, n) {
		for (n = n.child; n !== null;) wu(e, t, n), n = n.sibling;
	}
	function wu(e, t, n) {
		if ($e && typeof $e.onCommitFiberUnmount == "function") try {
			$e.onCommitFiberUnmount(Qe, n);
		} catch {}
		switch (n.tag) {
			case 26:
				U || Ol(n, t), Cu(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !U && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				U || Ol(n, t), jl(n);
				var r = W, i = Su;
				Sp(n.type) && (W = n.stateNode, Su = !1), Cu(e, t, n), gm(n.stateNode, n.type, n.memoizedProps), W = r, Su = i;
				break;
			case 5: U || Ol(n, t), jl(n);
			case 6:
				if (n.tag === 6 && jl(n), r = W, i = Su, W = null, Cu(e, t, n), W = r, Su = i, W !== null) {
					if (Su) try {
						(W.nodeType === 9 ? W.body : W.nodeName === "HTML" ? W.ownerDocument.body : W).removeChild(n.stateNode), L = !0;
					} catch (e) {
						Z(n, t, e);
					}
					else try {
						W.removeChild(n.stateNode), L = !0;
					} catch (e) {
						Z(n, t, e);
					}
				}
				break;
			case 18:
				W !== null && (Su ? (e = W, Cp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Hh(e)) : Cp(W, n.stateNode));
				break;
			case 4:
				r = W, i = Su, W = n.stateNode.containerInfo, Su = !0, Cu(e, t, n), W = r, Su = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				wl(2, n, t), U || wl(4, n, t), Cu(e, t, n);
				break;
			case 1:
				U || (Ol(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && El(n, t, r)), Cu(e, t, n);
				break;
			case 21:
				Cu(e, t, n);
				break;
			case 22:
				U = (r = U) || n.memoizedState !== null, Cu(e, t, n), U = r;
				break;
			case 30:
				Ol(n, t), Cu(e, t, n);
				break;
			case 7:
				U || Ol(n, t), Cu(e, t, n);
				break;
			default: Cu(e, t, n);
		}
	}
	function Tu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Hh(e);
			} catch (e) {
				Z(t, t.return, e);
			}
		}
	}
	function Eu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Hh(e);
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Du(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new lu()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new lu()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Ou(e, t) {
		var n = Du(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = vf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function ku(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Sp(l.type)) {
							W = l.stateNode, Su = !1;
							break a;
						}
						break;
					case 5:
						W = l.stateNode, Su = !1;
						break a;
					case 3:
					case 4:
						W = l.stateNode.containerInfo, Su = !0;
						break a;
				}
				l = l.return;
			}
			if (W === null) throw Error(i(160));
			wu(s, c, o), W = null, Su = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) ju(t, e, n), t = t.sibling;
	}
	var Au = null;
	function ju(e, t, n) {
		var r = e.alternate, a = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (a & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var o = 0; o < r.length; o++) {
					var s = r[o];
					s.ref.impl = s.nextImpl;
				}
				ku(t, e, n), Mu(e), a & 4 && (wl(3, e, e.return), Cl(3, e), wl(5, e, e.return));
				break;
			case 1:
				ku(t, e, n), Mu(e), a & 512 && (U || r === null || Ol(r, r.return)), a & 64 && ou && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = Au, ku(t, e, n), Mu(e), a & 512 && (U || r === null || Ol(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (ou) e.stateNode = fp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[jt] || r[wt] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), np(r, t, n), r[wt] = e, Rt(r), t = r;
												break a;
											case "link":
												if (o = Gm("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), np(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = Gm("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), np(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[wt] = e, Rt(r), t = r;
									}
									e.stateNode = t;
								}
							} else ou || Km(o, e.type, e.stateNode);
						} else e.stateNode = Bm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && Fl(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || U || t.parentNode.removeChild(t)) : a.count--, n === null ? ou || Km(o, e.type, e.stateNode) : Bm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				ku(t, e, n), Mu(e), a & 512 && (U || r === null || Ol(r, r.return)), r !== null && a & 4 && Fl(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = su, su = !1, ku(t, e, n), su = o, Mu(e), a & 512 && (U || r === null || Ol(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						fn(t, ""), L = !0;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, Fl(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (cu = !0);
				break;
			case 6:
				if (ku(t, e, n), Mu(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, L = !0;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				break;
			case 3:
				if (L = !1, Wm = null, o = Au, Au = bm(t.containerInfo), ku(t, e, n), Au = o, Mu(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Hh(t.containerInfo);
				} catch (t) {
					Z(e, e.return, t);
				}
				cu && (cu = !1, Nu(e)), L = !1;
				break;
			case 4:
				a = su, su = ou, r = Jt(), o = Au, Au = bm(e.stateNode.containerInfo), ku(t, e, n), Mu(e), Au = o, L && fu && (pu = !0), L = r, su = a;
				break;
			case 12:
				ku(t, e, n), Mu(e);
				break;
			case 31:
				ku(t, e, n), Mu(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Ou(e, t)));
				break;
			case 13:
				ku(t, e, n), Mu(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (hd = We()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Ou(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = ou, l = U, u = su;
				ou = c || o, su = u || o, U = l || s, ku(t, e, n), U = l, su = u, ou = c, Mu(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || ou || U || (t = s || U, n = ou, r = U, ou = o || ou, U = t, Lu(e, 2), ou = n, U = r), !o && su || vu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Ou(e, n))));
				break;
			case 19:
				ku(t, e, n), Mu(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Ou(e, t)));
				break;
			case 30:
				a & 512 && (U || r === null || Ol(r, r.return)), a = Jt(), o = fu, s = (n & 335544064) === n, c = e.memoizedProps, fu = s && xi(c.default, c.update) !== "none", ku(t, e, n), Mu(e), s && r !== null && L && (e.flags |= 4), fu = o, L = a;
				break;
			case 21: break;
			case 7: a & 512 && (U || r === null || Ol(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: ku(t, e, n), Mu(e);
		}
	}
	function Mu(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Il(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (Nl(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Ml(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						zl(e, Ll(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (fn(l, ""), n.flags &= -33), zl(e, Ll(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Rl(e, Ll(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				Z(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Nu(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Nu(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, gh = !0, t.reset(), gh = !1), e = e.sibling;
		}
	}
	function Pu(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Fu(t, e), t = t.sibling;
		else au(t, !1);
	}
	function Fu(e, t) {
		var n = e.alternate;
		if (n === null) Zl(e, !1);
		else switch (e.tag) {
			case 3:
				if (mu = du = !1, Gl(), Pu(t, e), !du && !pu) {
					if (e = Wl, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						Ep(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), mu = !0;
				}
				Wl = null;
				break;
			case 5:
				Pu(t, e);
				break;
			case 4:
				r = du, du = !1, Pu(t, e), du && (pu = !0), du = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Pu(t, e) : Zl(e, !1));
				break;
			case 30:
				r = du, i = Gl(), du = !1, Pu(t, e), du && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = yi(a, o), o = yi(n.memoizedProps, o);
				var s = xi(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, Kl = 0, t = iu(e, n, t, o, s, a, !0), Kl !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Nd(e, e.memoizedProps.onUpdate), Wl = i) : i !== null && (i.push.apply(i, Wl), Wl = i), du = e.flags & 32 ? !0 : r;
				break;
			default: Pu(t, e);
		}
	}
	function Iu(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) _u(e, t.alternate, t), t = t.sibling;
	}
	function Lu(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					wl(4, n, n.return), Lu(n, r);
					break;
				case 1:
					Ol(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && El(n, n.return, i), Lu(n, r);
					break;
				case 27: r & 2 && gm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					Ol(n, n.return), n.tag !== 5 && n.tag !== 27 || jl(n), Lu(n, r);
					break;
				case 6:
					jl(n);
					break;
				case 26:
					Ol(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || U || i.parentNode.removeChild(i), Lu(n, r);
					break;
				case 22:
					n.memoizedState === null && Lu(n, r);
					break;
				case 30:
					Ol(n, n.return), Lu(n, r);
					break;
				case 7: Ol(n, n.return);
				default: Lu(n, r);
			}
			e = e.sibling;
		}
	}
	function Ru(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Ru(i, a, n), Cl(4, a);
					break;
				case 1:
					if (Ru(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Z(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) To(l[i], c);
						} catch (e) {
							Z(r, r.return, e);
						}
					}
					s && o & 64 && Tl(a), Dl(a, a.return);
					break;
				case 27: n & 2 && Bl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || Al(a), Ru(i, a, n), s && r === null && o & 4 && Pl(a), Dl(a, a.return);
					break;
				case 6:
					Al(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || ou || Km(bm(c.ownerDocument), a.type, c), Ru(i, a, n), s && r === null && o & 4 && Pl(a), Dl(a, a.return);
					break;
				case 12:
					Ru(i, a, n);
					break;
				case 31:
					Ru(i, a, n), s && o & 4 && Tu(i, a);
					break;
				case 13:
					Ru(i, a, n), s && o & 4 && Eu(i, a);
					break;
				case 22:
					a.memoizedState === null && Ru(i, a, n), Dl(a, a.return);
					break;
				case 30:
					Ru(i, a, n), Dl(a, a.return);
					break;
				case 7: Dl(a, a.return);
				default: Ru(i, a, n);
			}
			t = t.sibling;
		}
	}
	function zu(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Pa(n));
	}
	function Bu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Pa(e));
	}
	function Vu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Hu(e, t, n, r), t = t.sibling;
		else i && ru(t);
	}
	function Hu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && nu(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Vu(e, t, n, r), a & 2048 && Cl(9, t);
				break;
			case 1:
				Vu(e, t, n, r);
				break;
			case 3:
				Vu(e, t, n, r), i && mu && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && Pa(a)));
				break;
			case 12:
				if (a & 2048) {
					Vu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						Z(t, t.return, e);
					}
				} else Vu(e, t, n, r);
				break;
			case 31:
				Vu(e, t, n, r);
				break;
			case 13:
				Vu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && nu(t), o._visibility & 2 ? Vu(e, t, n, r) : (o._visibility |= 2, Uu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && nu(s), o._visibility & 2 ? Vu(e, t, n, r) : Wu(e, t)), a & 2048 && zu(s, t);
				break;
			case 24:
				Vu(e, t, n, r), a & 2048 && Bu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (Yl(a.child, !0), Yl(t.child, !0))), Vu(e, t, n, r);
				break;
			default: Vu(e, t, n, r);
		}
	}
	function Uu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Uu(a, o, s, c, i), Cl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Uu(a, o, s, c, i)) : u._visibility & 2 ? Uu(a, o, s, c, i) : Wu(a, o), i && l & 2048 && zu(o.alternate, o);
					break;
				case 24:
					Uu(a, o, s, c, i), i && l & 2048 && Bu(o.alternate, o);
					break;
				default: Uu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Wu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Wu(n, r), i & 2048 && zu(r.alternate, r);
					break;
				case 24:
					Wu(n, r), i & 2048 && Bu(r.alternate, r);
					break;
				default: Wu(n, r);
			}
			t = t.sibling;
		}
	}
	var Gu = 8192;
	function Ku(e, t, n) {
		if (e.subtreeFlags & Gu) for (e = e.child; e !== null;) qu(e, t, n), e = e.sibling;
	}
	function qu(e, t, n) {
		switch (e.tag) {
			case 26:
				Ku(e, t, n), e.flags & Gu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && Zm(n, e)) : Qm(n, Au, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Ku(e, t, n), e.flags & Gu && (e = e.stateNode, (t & 335544128) === t && Zm(n, e));
				break;
			case 3:
			case 4:
				var r = Au;
				Au = bm(e.stateNode.containerInfo), Ku(e, t, n), Au = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Gu, Gu = 16777216, Ku(e, t, n), Gu = r) : Ku(e, t, n));
				break;
			case 30:
				if ((e.flags & Gu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Hl === null && (Hl = /* @__PURE__ */ new Map()), Hl.set(r, i);
				}
				Ku(e, t, n);
				break;
			default: Ku(e, t, n);
		}
	}
	function Ju(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Yu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				uu = r, Qu(r, e);
			}
			Ju(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Xu(e), e = e.sibling;
	}
	function Xu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Yu(e), e.flags & 2048 && wl(9, e, e.return);
				break;
			case 3:
				Yu(e);
				break;
			case 12:
				Yu(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Zu(e)) : Yu(e);
				break;
			default: Yu(e);
		}
	}
	function Zu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				uu = r, Qu(r, e);
			}
			Ju(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					wl(8, t, t.return), Zu(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Zu(t));
					break;
				default: Zu(t);
			}
			e = e.sibling;
		}
	}
	function Qu(e, t) {
		for (; uu !== null;) {
			var n = uu;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					wl(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: Pa(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, uu = r;
			else a: for (n = e; uu !== null;) {
				r = uu;
				var i = r.sibling, a = r.return;
				if (xu(r), r === n) {
					uu = null;
					break a;
				}
				if (i !== null) {
					i.return = a, uu = i;
					break a;
				}
				uu = a;
			}
		}
	}
	var $u = {
		getCacheForType: function(e) {
			var t = Ea(Ma), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return Ea(Ma).controller.signal;
		}
	}, ed = typeof WeakMap == "function" ? WeakMap : Map, G = 0, K = null, q = null, J = 0, Y = 0, td = null, nd = !1, rd = !1, id = !1, ad = 0, od = 0, sd = 0, cd = 0, ld = 0, ud = 0, dd = 0, fd = null, pd = null, md = !1, hd = 0, gd = 0, _d = Infinity, vd = null, yd = null, X = 0, bd = null, xd = null, Sd = 0, Cd = 0, wd = null, Td = null, Ed = null, Dd = null, Od = null, kd = 0, Ad = null;
	function jd() {
		return G & 2 && J !== 0 ? J & -J : A.T === null ? xt() : Pf();
	}
	function Md() {
		if (ud === 0) {
			if (!(J & 536870912) || z) {
				var e = ot;
				ot <<= 1, !(ot & 3932160) && (ot = 262144), ud = e;
			} else ud = 536870912;
		}
		return e = Mo.current, e !== null && (e.flags |= 32), ud;
	}
	function Nd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Pp(yi(e.memoizedProps, n))), Dd === null && (Dd = []), Dd.push(t.bind(null, r));
		}
	}
	function Pd(e, t, n) {
		(e === K && (Y === 2 || Y === 9) || e.cancelPendingCommit !== null) && (Vd(e, 0), Rd(e, J, ud, !1)), ht(e, n), G & 2 && e === K || (e === K && (!(G & 2) && (cd |= n), od === 4 && Rd(e, J, ud, !1)), Ef(e));
	}
	function Fd(e, t, n) {
		if (G & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || ut(e, t), a = r ? Yd(e, t) : qd(e, t, !0), o = r;
		do {
			if (a === 0) {
				rd && !r && Rd(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Ld(n)) a = qd(e, t, !1), o = !1;
			else {
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = fd;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Vd(c, s).flags |= 256), s = qd(c, s, !1), s !== 2 && s !== 6) {
								if (id && !l) {
									c.errorRecoveryDisabledLanes |= o, cd |= o, a = 4;
									break a;
								}
								o = pd, pd = a, o !== null && (pd === null ? pd = o : pd.push.apply(pd, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					Vd(e, 0), Rd(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							Rd(r, t, ud, !nd);
							break a;
						case 2:
							pd = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = hd + 300 - We(), 10 < a)) {
						if (Rd(r, t, ud, !nd), lt(r, 0, !0) !== 0) break a;
						Sd = t, r.timeoutHandle = gp(Id.bind(null, r, n, pd, vd, md, t, ud, cd, dd, nd, o, "Throttled", -0, 0), a);
						break a;
					}
					Id(r, n, pd, vd, md, t, ud, cd, dd, nd, o, null, -0, 0);
				}
				break;
			}
		} while (1);
		Ef(e);
	}
	function Id(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: bn
		}, Hl = null, qu(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = nh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? hd - We() : (a & 4194048) === a ? gd - We() : 0, m = eh(d, m), m !== null) ? (Sd = a, e.cancelPendingCommit = m(nf.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Rd(e, a, o, !l)) : nf(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Ld(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Ur(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Rd(e, t, n, r) {
		t = dt(e, t), t &= ~ld, t &= ~cd, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - tt(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && _t(e, n, t);
	}
	function zd() {
		return G & 6 ? !0 : (Df(0, !1), !1);
	}
	function Bd() {
		if (q !== null) {
			if (Y === 0) var e = q.return;
			else e = q, va = _a = null, os(e), oo = null, so = 0, e = q;
			for (; e !== null;) Sl(e.alternate, e), e = e.return;
			q = null;
		}
	}
	function Vd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, _p(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Sd = 0, Bd(), K = e, q = n = Ii(e.current, null), J = t, Y = 0, td = null, nd = !1, rd = ut(e, t), id = !1, dd = ud = ld = cd = sd = od = 0, pd = fd = null, md = !1, ad = dt(e, t), Ei(), n;
	}
	function Hd(e, t) {
		B = null, A.H = gc, t === Xa || t === Qa ? (t = io(), Y = 3) : t === Za ? (t = io(), Y = 4) : Y = t === Pc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, td = t, q === null && (od = 1, Oc(e, Wi(t, e.current)));
	}
	function Ud() {
		var e = Mo.current;
		return e === null ? !0 : (J & 4194048) === J ? No === null : (J & 62914560) === J || J & 536870912 ? e === No : !1;
	}
	function Wd() {
		var e = A.H;
		return A.H = gc, e === null ? gc : e;
	}
	function Gd() {
		var e = A.A;
		return A.A = $u, e;
	}
	function Kd() {
		od = 4, nd || (J & 4194048) !== J && Mo.current !== null || (rd = !0), !(sd & 134217727) && !(cd & 134217727) || K === null || Rd(K, J, ud, !1);
	}
	function qd(e, t, n) {
		var r = G;
		G |= 2;
		var i = Wd(), a = Gd();
		(K !== e || J !== t) && (vd = null, Vd(e, t)), t = !1;
		var o = od;
		a: do
			try {
				if (Y !== 0 && q !== null) {
					var s = q, c = td;
					switch (Y) {
						case 8:
							Bd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							Mo.current === null && (t = !0);
							var l = Y;
							if (Y = 0, td = null, $d(e, s, c, l), n && rd) {
								o = 0;
								break a;
							}
							break;
						default: l = Y, Y = 0, td = null, $d(e, s, c, l);
					}
				}
				Jd(), o = od;
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, va = _a = null, G = r, A.H = i, A.A = a, q === null && (K = null, J = 0, Ei()), o;
	}
	function Jd() {
		for (; q !== null;) Zd(q);
	}
	function Yd(e, t) {
		var n = G;
		G |= 2;
		var r = Wd(), a = Gd();
		K !== e || J !== t ? (vd = null, _d = We() + 500, Vd(e, t)) : rd = ut(e, t);
		a: do
			try {
				if (Y !== 0 && q !== null) {
					t = q;
					var o = td;
					b: switch (Y) {
						case 1:
							Y = 0, td = null, $d(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (eo(o)) {
								Y = 0, td = null, Qd(t);
								break;
							}
							t = function() {
								Y !== 2 && Y !== 9 || K !== e || (Y = 7), Ef(e);
							}, o.then(t, t);
							break a;
						case 3:
							Y = 7;
							break a;
						case 4:
							Y = 5;
							break a;
						case 7:
							eo(o) ? (Y = 0, td = null, Qd(t)) : (Y = 0, td = null, $d(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (q.tag) {
								case 26: s = q.memoizedState;
								case 5:
								case 27:
									var c = q;
									if (s ? Ym(s) : c.stateNode.complete) {
										Y = 0, td = null;
										var l = c.sibling;
										if (l !== null) q = l;
										else {
											var u = c.return;
											u === null ? q = null : (q = u, ef(u));
										}
										break b;
									}
							}
							Y = 0, td = null, $d(e, t, o, 5);
							break;
						case 6:
							Y = 0, td = null, $d(e, t, o, 6);
							break;
						case 8:
							Bd(), od = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Xd();
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return va = _a = null, A.H = r, A.A = a, G = n, q === null ? (K = null, J = 0, Ei(), od) : 0;
	}
	function Xd() {
		for (; q !== null && !He();) Zd(q);
	}
	function Zd(e) {
		var t = ml(e.alternate, e, ad);
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : q = t;
	}
	function Qd(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Jc(n, t, t.pendingProps, t.type, void 0, J);
				break;
			case 11:
				t = Jc(n, t, t.pendingProps, t.type.render, t.ref, J);
				break;
			case 5:
				os(t);
				var r = t;
				r === aa && (z ? (da(r), r.tag === 5 && r.stateNode != null && (R = r.stateNode)) : (da(r), z = !0));
			default: Sl(n, t), t = q = Li(t, ad), t = ml(n, t, ad);
		}
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : q = t;
	}
	function $d(e, t, n, r) {
		va = _a = null, os(t), oo = null, so = 0;
		var i = t.return;
		try {
			if (Nc(e, i, t, n, J)) {
				od = 1, Oc(e, Wi(n, e.current)), q = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw q = i, t;
			od = 1, Oc(e, Wi(n, e.current)), q = null;
			return;
		}
		t.flags & 32768 ? (z || r === 1 ? e = !0 : rd || J & 536870912 ? e = !1 : (nd = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Mo.current, r !== null && r.tag === 13 && (r.flags |= 16384))), tf(t, e)) : ef(t);
	}
	function ef(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				tf(t, nd);
				return;
			}
			e = t.return;
			var n = bl(t.alternate, t, ad);
			if (n !== null) {
				q = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				q = t;
				return;
			}
			q = t = e;
		} while (t !== null);
		od === 0 && (od = 5);
	}
	function tf(e, t) {
		do {
			var n = xl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, q = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				q = e;
				return;
			}
			q = e = n;
		} while (e !== null);
		od = 6, q = null;
	}
	function nf(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			df();
		while (X !== 0);
		if (G & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === K && (q = K = null, J = 0), xd = t, bd = e, Sd = n, wd = a, Td = r, rf(e, t, n, s, c, l, f);
		}
	}
	function rf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (Cd = s, s |= Ti, gt(e, n, s, r, i, a), Dd = null, (n & 335544064) === n ? (Od = La(e), r = 10262) : (Od = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, yf(F, function() {
			return ff(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Vl = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = A.T, A.T = null, i = j.p, j.p = 2, a = G, G |= 4;
			try {
				hu(e, t, n);
			} finally {
				G = a, j.p = i, A.T = r;
			}
		}
		X = 1, Vl ? Ed = Mp(o, e.containerInfo, Od, sf, cf, of, lf, ff, af, null, null) : (sf(), cf(), lf());
	}
	function af(e) {
		if (X !== 0) {
			var t = bd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function of() {
		X === 3 && (X = 0, Fu(xd, bd), X = 4);
	}
	function sf() {
		if (X === 1) {
			X = 0;
			var e = bd, t = xd, n = Sd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = A.T, A.T = null;
				var i = j.p;
				j.p = 2;
				var a = G;
				G |= 4;
				try {
					fu = pu = !1, ju(t, e, n), n = cp;
					var o = Yr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Jr(s.ownerDocument.documentElement, s)) {
						if (c !== null && Xr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = qr(s, h), v = qr(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					gh = !!sp, cp = sp = null;
				} finally {
					G = a, j.p = i, A.T = r;
				}
			}
			e.current = t, X = 2;
		}
	}
	function cf() {
		if (X === 2) {
			X = 0;
			var e = bd, t = xd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = A.T, A.T = null;
				var r = j.p;
				j.p = 2;
				var i = G;
				G |= 4;
				try {
					_u(e, t.alternate, t);
				} finally {
					G = i, j.p = r, A.T = n;
				}
			}
			X = 3;
		}
	}
	function lf() {
		if (X === 4 || X === 3) {
			X = 0;
			var e = Ed;
			Ed = null, Ue();
			var t = bd, n = xd, r = Sd, i = Td, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? X = 5 : (X = 0, xd = bd = null, uf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (yd = null), bt(r), n = n.stateNode, $e && typeof $e.onCommitFiberRoot == "function") try {
				$e.onCommitFiberRoot(Qe, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = A.T, a = j.p, j.p = 2, A.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					A.T = n, j.p = a;
				}
			}
			if (i = Dd, o = Od, Od = null, i !== null && (Dd = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			Sd & 3 && df(), Ef(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Ad ? kd++ : (kd = 0, Ad = t) : (kd = 0, Ad = null), Df(0, !1);
		}
	}
	function uf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Pa(t)));
	}
	function df() {
		return Ed !== null && (Ed.skipTransition(), Ed = null), sf(), cf(), lf(), ff();
	}
	function ff() {
		if (X !== 5) return !1;
		var e = bd, t = Cd;
		Cd = 0;
		var n = bt(Sd), r = A.T, a = j.p;
		try {
			j.p = 32 > n ? 32 : n, A.T = null, n = wd, wd = null;
			var o = bd, s = Sd;
			if (X = 0, xd = bd = null, Sd = 0, G & 6) throw Error(i(331));
			var c = G;
			if (G |= 4, Xu(o.current), Hu(o, o.current, s, n), G = c, Df(0, !1), $e && typeof $e.onPostCommitFiberRoot == "function") try {
				$e.onPostCommitFiberRoot(Qe, o);
			} catch {}
			return !0;
		} finally {
			j.p = a, A.T = r, uf(e, t);
		}
	}
	function pf(e, t, n) {
		t = Wi(n, t), t = Ac(e.stateNode, t, 2), e = yo(e, t, 2), e !== null && (ht(e, 2), Ef(e));
	}
	function Z(e, t, n) {
		if (e.tag === 3) pf(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				pf(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (yd === null || !yd.has(r))) {
					e = Wi(n, e), n = jc(2), r = yo(t, n, 2), r !== null && (Mc(n, r, t, e), ht(r, 2), Ef(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function mf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new ed();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (id = !0, i.add(n), e = hf.bind(null, e, t, n), t.then(e, e));
	}
	function hf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, K === e && (J & n) === n && (od === 4 || od === 3 && (J & 62914560) === J && 300 > We() - hd ? G & 2 ? ld |= n : Vd(e, 0) : ld |= n, dd === J && (dd = 0)), Ef(e);
	}
	function gf(e, t) {
		t === 0 && (t = pt()), e = ki(e, t), e !== null && (ht(e, t), Ef(e));
	}
	function _f(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), gf(e, n);
	}
	function vf(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), gf(e, n);
	}
	function yf(e, t) {
		return Be(e, t);
	}
	var bf = null, xf = null, Sf = !1, Cf = !1, wf = !1, Tf = 0;
	function Ef(e) {
		e !== xf && e.next === null && (xf === null ? bf = xf = e : xf = xf.next = e), Cf = !0, Sf || (Sf = !0, Nf());
	}
	function Df(e, t) {
		if (!wf && Cf) {
			wf = !0;
			do
				for (var n = !1, r = bf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - tt(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Mf(r, a));
						} else a = J, a = lt(r, r === K ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || ut(r, a) || (n = !0, Mf(r, a));
					}
					r = r.next;
				}
			while (n);
			wf = !1;
		}
	}
	function Of() {
		kf();
	}
	function kf() {
		Cf = Sf = !1;
		var e = 0;
		Tf !== 0 && hp() && (e = Tf);
		for (var t = We(), n = null, r = bf; r !== null;) {
			var i = r.next, a = Af(r, t);
			a === 0 ? (r.next = null, n === null ? bf = i : n.next = i, i === null && (xf = n)) : (n = r, (e !== 0 || a & 3) && (Cf = !0)), r = i;
		}
		X !== 0 && X !== 5 || Df(e, !1), Tf !== 0 && (Tf = 0);
	}
	function Af(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - tt(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = ft(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = K, n = J, n = lt(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (Y === 2 || Y === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Ve(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || ut(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Ve(r), bt(n)) {
				case 2:
				case 8:
					n = qe;
					break;
				case 32:
					n = F;
					break;
				case 268435456:
					n = Ye;
					break;
				default: n = F;
			}
			return r = jf.bind(null, e), n = Be(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Ve(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function jf(e, t) {
		if (X !== 0 && X !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (df() && e.callbackNode !== n) return null;
		var r = J;
		return r = lt(e, e === K ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Fd(e, r, t), Af(e, We()), e.callbackNode != null && e.callbackNode === n ? jf.bind(null, e) : null);
	}
	function Mf(e, t) {
		if (df()) return null;
		Fd(e, t, !0);
	}
	function Nf() {
		bp(function() {
			G & 6 ? Be(Ke, Of) : kf();
		});
	}
	function Pf() {
		if (Tf === 0) {
			var e = Ba;
			e === 0 && (e = at, at <<= 1, !(at & 261888) && (at = 256)), Tf = e;
		}
		return Tf;
	}
	function Ff(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : yn(e);
	}
	function If(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Ff((i[Tt] || null).action), o = r.submitter;
			o && (t = (t = o[Tt] || null) ? Ff(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Vn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (Tf !== 0) {
								var e = new FormData(i, o);
								nc(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), nc(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var Lf = 0; Lf < gi.length; Lf++) {
		var Rf = gi[Lf];
		_i(Rf.toLowerCase(), "on" + (Rf[0].toUpperCase() + Rf.slice(1)));
	}
	_i(ci, "onAnimationEnd"), _i(li, "onAnimationIteration"), _i(ui, "onAnimationStart"), _i("dblclick", "onDoubleClick"), _i("focusin", "onFocus"), _i("focusout", "onBlur"), _i(di, "onTransitionRun"), _i(fi, "onTransitionStart"), _i(pi, "onTransitionCancel"), _i(mi, "onTransitionEnd"), Ut("onMouseEnter", ["mouseout", "mouseover"]), Ut("onMouseLeave", ["mouseout", "mouseover"]), Ut("onPointerEnter", ["pointerout", "pointerover"]), Ut("onPointerLeave", ["pointerout", "pointerover"]), Ht("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Ht("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Ht("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Ht("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Ht("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Ht("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var zf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Bf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(zf));
	function Vf(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Si(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Si(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Q(e, t) {
		var n = t[Dt];
		n === void 0 && (n = t[Dt] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Gf(t, e, 2, !1), n.add(r));
	}
	function Hf(e, t, n) {
		var r = 0;
		t && (r |= 4), Gf(n, e, r, t);
	}
	var Uf = "_reactListening" + Math.random().toString(36).slice(2);
	function Wf(e) {
		if (!e[Uf]) {
			e[Uf] = !0, Bt.forEach(function(t) {
				t !== "selectionchange" && (Bf.has(t) || Hf(t, !1, e), Hf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Uf] || (t[Uf] = !0, Hf("selectionchange", !1, t));
		}
	}
	function Gf(e, t, n, r) {
		switch (Ch(t)) {
			case 2:
				var i = _h;
				break;
			case 8:
				i = vh;
				break;
			default: i = yh;
		}
		n = i.bind(null, t, n, e), i = void 0, !An || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Kf(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = Pt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		Dn(function() {
			var r = a, i = Sn(n), s = [];
			a: {
				var c = hi.get(e);
				if (c !== void 0) {
					var l = Vn, u = e;
					switch (e) {
						case "keypress": if (In(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = ar;
							break;
						case "focusin":
							u = "focus", l = Xn;
							break;
						case "focusout":
							u = "blur", l = Xn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Xn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = Jn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Yn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = cr;
							break;
						case ci:
						case li:
						case ui:
							l = Zn;
							break;
						case mi:
							l = lr;
							break;
						case "scroll":
						case "scrollend":
							l = Un;
							break;
						case "wheel":
							l = ur;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Qn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = or;
							break;
						case "submit":
							l = sr;
							break;
						case "toggle":
						case "beforetoggle": l = dr;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = On(m, p), g != null && d.push(qf(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== xn && (u = n.relatedTarget || n.fromElement) && (Pt(u) || u[Et])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Pt(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = Jn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = or, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : It(c), h = l == null ? u : It(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, Pt(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? ee(c, l, Yf) : null, c !== null && Xf(s, u, c, d, !1), l !== null && f !== null && Xf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? It(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = jr;
					else if (Tr(c)) {
						if (Mr) _ = Vr;
						else {
							_ = zr;
							var v = Rr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && gn(r.elementType) && (_ = jr) : _ = Br;
					if (_ &&= _(e, r)) {
						Er(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? It(r) : window, e) {
					case "focusin":
						(Tr(v) || v.contentEditable === "true") && (Qr = v, $r = r, ei = null);
						break;
					case "focusout":
						ei = $r = Qr = null;
						break;
					case "mousedown":
						ti = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						ti = !1, ni(s, n, i);
						break;
					case "selectionchange": if (Zr) break;
					case "keydown":
					case "keyup": ni(s, n, i);
				}
				var y;
				if (pr) b: {
					switch (e) {
						case "compositionstart":
							var b = "onCompositionStart";
							break b;
						case "compositionend":
							b = "onCompositionEnd";
							break b;
						case "compositionupdate":
							b = "onCompositionUpdate";
							break b;
					}
					b = void 0;
				}
				else xr ? yr(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (gr && n.locale !== "ko" && (xr || b !== "onCompositionStart" ? b === "onCompositionEnd" && xr && (y = Fn()) : (Mn = i, Nn = "value" in Mn ? Mn.value : Mn.textContent, xr = !0)), v = Jf(r, b), 0 < v.length && (b = new $n(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = br(n), y !== null && (b.data = y)))), (y = hr ? Sr(e, n) : Cr(e, n)) && (b = Jf(r, "onBeforeInput"), 0 < b.length && (v = new $n("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), If(s, e, r, n, i);
			}
			Vf(s, t);
		});
	}
	function qf(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Jf(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = On(e, n), i != null && r.unshift(qf(e, i, a)), i = On(e, t), i != null && r.push(qf(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Yf(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Xf(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = On(n, a), l != null && o.unshift(qf(n, l, c))) : i || (l = On(n, a), l != null && o.push(qf(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Zf = /\r\n?/g, Qf = /\u0000|\uFFFD/g;
	function $f(e) {
		return (typeof e == "string" ? e : "" + e).replace(Zf, "\n").replace(Qf, "");
	}
	function ep(e, t) {
		return t = $f(t), $f(e) === t;
	}
	function $(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || fn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && fn(e, "" + r);
				else return;
				break;
			case "className":
				Xt(e, "class", r);
				break;
			case "tabIndex":
				Xt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Xt(e, n, r);
				break;
			case "style":
				hn(e, r, o);
				return;
			case "data": if (t !== "object") {
				Xt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = yn(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && $(e, t, "name", a.name, a, null), $(e, t, "formEncType", a.formEncType, a, null), $(e, t, "formMethod", a.formMethod, a, null), $(e, t, "formTarget", a.formTarget, a, null)) : ($(e, t, "encType", a.encType, a, null), $(e, t, "method", a.method, a, null), $(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = yn(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = bn);
				return;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = yn(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				Q("beforetoggle", e), Q("toggle", e), Yt(e, "popover", r);
				break;
			case "xlinkActuate":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Zt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Zt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Zt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Yt(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = _n.get(n) || n, Yt(e, n, r);
			else return;
		}
		L = !0;
	}
	function tp(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				hn(e, r, o);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") fn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") fn(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = bn);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!Vt.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[Tt] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					L = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Yt(e, n, r);
				}
				return;
		}
		L = !0;
	}
	function np(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				Q("error", e), Q("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: $(e, t, o, s, n, null);
					}
				}
				a && $(e, t, "srcSet", n.srcSet, n, null), r && $(e, t, "src", n.src, n, null);
				return;
			case "input":
				Q("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: $(e, t, r, d, n, null);
					}
				}
				sn(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in Q("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: $(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && ln(e, !!r, n, !0) : ln(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Q("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: $(e, t, s, c, n, null);
				}
				dn(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: $(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Q("beforetoggle", e), Q("toggle", e), Q("cancel", e), Q("close", e);
				break;
			case "iframe":
			case "object":
				Q("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < zf.length; r++) Q(zf[r], e);
				break;
			case "image":
				Q("error", e), Q("load", e);
				break;
			case "details":
				Q("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Q("error", e), Q("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: $(e, t, u, r, n, null);
				}
				return;
			default: if (gn(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && tp(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && $(e, t, c, r, n, null));
	}
	var rp = {};
	function ip(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || $(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (L = !0), o = m;
							break;
						case "name":
							m !== f && (L = !0), a = m;
							break;
						case "checked":
							m !== f && (L = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (L = !0), d = m;
							break;
						case "value":
							m !== f && (L = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (L = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && $(e, t, p, m, r, f);
					}
				}
				on(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || $(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (L = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (L = !0), c = o;
						break;
					case "multiple": o !== l && (L = !0), s = o;
					default: o !== l && $(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? ln(e, !!n, n ? [] : "", !1) : ln(e, !!n, t, !0)) : ln(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: $(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (L = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (L = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && $(e, t, s, a, r, o);
				}
				un(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: $(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (L = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: $(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && $(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: $(e, t, u, p, r, m);
				}
				return;
			default: if (gn(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && tp(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || tp(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && $(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || $(e, t, f, p, r, m);
	}
	function ap(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function op() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && ap(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && ap(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var sp = null, cp = null;
	function lp(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function up(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function dp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function fp(e, t, n, r) {
		return n = lp(n).createElement(e), n[wt] = r, n[Tt] = t, np(n, e, t), Rt(n), n;
	}
	function pp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var mp = null;
	function hp() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== mp && (mp = e, !0) : (mp = null, !1);
	}
	var gp = typeof setTimeout == "function" ? setTimeout : void 0, _p = typeof clearTimeout == "function" ? clearTimeout : void 0, vp = typeof Promise == "function" ? Promise : void 0, yp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : gp, bp = typeof queueMicrotask == "function" ? queueMicrotask : vp === void 0 ? gp : function(e) {
		return vp.resolve(null).then(e).catch(xp);
	};
	function xp(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Sp(e) {
		return e === "head";
	}
	function Cp(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Hh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") _m(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, _m(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[jt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && _m(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Hh(t);
	}
	function wp(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Tp(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function Ep(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function Dp(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function Op(e) {
		return Dp(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function kp(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return Dp(t, n, e);
	}
	function Ap(e) {
		return e.documentElement.clientHeight;
	}
	function jp(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Mp(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (Ap(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += Xm(f), u > $m) {
									s.length = o;
									break;
								}
								f = new Promise(jp.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Np(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Np.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : E({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Np.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Np.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Pp(e) {
		return {
			name: e,
			group: new Np("group", e),
			imagePair: new Np("image-pair", e),
			old: new Np("old", e),
			new: new Np("new", e)
		};
	}
	function Fp(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Fp.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Bp(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = Rp(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), h(this._fragmentFiber.child, !1, Ip, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Ip(e, t, n, r) {
		return b(e).addEventListener(t, n, r), !1;
	}
	Fp.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Bp(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = Rp(i.optionsOrUseCapture), h(this._fragmentFiber.child, !1, Lp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function Lp(e, t, n, r) {
		return b(e).removeEventListener(t, n, r), !1;
	}
	function Rp(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function zp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Bp(e, t, n, r) {
		if (e.length === 0) return -1;
		r = zp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && zp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Fp.prototype.dispatchEvent = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return !0;
		t = b(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Fp.prototype.focus = function(e) {
		h(this._fragmentFiber.child, !0, Vp, e, void 0, void 0);
	};
	function Vp(e, t) {
		return e.tag !== 6 && (e = b(e), pm(e, t));
	}
	Fp.prototype.focusLast = function(e) {
		var t = [];
		h(this._fragmentFiber.child, !0, Hp, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Vp(t[n], e); n--);
	};
	function Hp(e, t) {
		return t.push(e), !1;
	}
	Fp.prototype.blur = function() {
		var e = g(this._fragmentFiber);
		e !== null && (e = b(e), e = lp(e).activeElement, e !== null && h(this._fragmentFiber.child, !1, Up, e, void 0, void 0));
	};
	function Up(e, t) {
		return e.tag !== 6 && (e = b(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Fp.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), h(this._fragmentFiber.child, !1, Wp, e, void 0, void 0);
	};
	function Wp(e, t) {
		return e.tag === 6 || (e = b(e), t.observe(e)), !1;
	}
	Fp.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), h(this._fragmentFiber.child, !1, Gp, e, void 0, void 0);
			for (var n = t = 0; n < Kp.length; n++) {
				var r = Kp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : Kp[t++] = r;
			}
			Kp.length = t;
		}
	};
	function Gp(e, t) {
		return e.tag === 6 || (e = b(e), t.unobserve(e)), !1;
	}
	var Kp = [], qp = !1;
	function Jp(e, t, n) {
		Kp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), qp || (qp = !0, mm(function() {
			qp = !1;
			var e = Kp;
			Kp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Fp.prototype.getClientRects = function() {
		var e = [];
		return h(this._fragmentFiber.child, !1, Yp, e, void 0, void 0), e;
	};
	function Yp(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = b(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Fp.prototype.getRootNode = function(e) {
		var t = g(this._fragmentFiber);
		return t === null ? this : b(t).getRootNode(e);
	}, Fp.prototype.compareDocumentPosition = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		h(this._fragmentFiber.child, !1, Hp, n, void 0, void 0);
		var r = b(t);
		if (n.length === 0) {
			if (n = r, _(this._fragmentFiber)) {
				a: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break a;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = v(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = b(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = b(n[0]), i = b(n[n.length - 1]);
		var a = _(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Xp(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function Xp(e, t, n, r, i) {
		var a = Pt(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) a: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break a;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			a: {
				for (a = t, t = g(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break a;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = ee(n, a, T), t === null ? t = !1 : (h(t, !0, C, a, n), a = x, x = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = ee(r, a, T), t === null ? t = !1 : (h(t, !0, w, a, r), a = x, S = x = null, t = a !== null)), t) : !1;
	}
	function Zp(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Fp.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		h(this._fragmentFiber.child, !1, Hp, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = v(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = b(r), Zp(e, n);
				return;
			}
			if (r = b(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var a = t[r];
			a.tag === 6 ? (a = b(a), Zp(a, n)) : b(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function Qp(e, t) {
		return e = b(e), $p(e, t), !1;
	}
	function $p(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function em(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < Kp.length; i++) {
				var a = Kp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (Kp[r++] = a);
			}
			Kp.length = r, n.observe(e);
		}), $p(e, t));
	}
	function tm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? Jp(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function nm(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					nm(n), Nt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function rm(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[jt]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = lm(e.nextSibling), e === null) break;
		}
		return null;
	}
	function im(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function am(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function om(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function sm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function cm(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function lm(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var um = null;
	function dm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return lm(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function fm(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function pm(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function mm(e) {
		yp(function() {
			yp(function(t) {
				return e(t);
			});
		});
	}
	function hm(e, t, n) {
		switch (t = lp(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function gm(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && $(e, t, r, null, rp, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === bn && (e.onclick = null), Nt(e);
	}
	function _m(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		Nt(e);
	}
	var vm = /* @__PURE__ */ new Map(), ym = /* @__PURE__ */ new Set();
	function bm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var xm = j.d;
	j.d = {
		f: Sm,
		r: Cm,
		D: Em,
		C: Dm,
		L: Om,
		m: km,
		X: jm,
		S: Am,
		M: Mm
	};
	function Sm() {
		var e = xm.f(), t = zd();
		return e || t;
	}
	function Cm(e) {
		var t = Ft(e);
		t !== null && t.tag === 5 && t.type === "form" ? ic(t) : xm.r(e);
	}
	var wm = typeof document > "u" ? null : document;
	function Tm(e, t, n) {
		var r = wm;
		if (r && typeof t == "string" && t) {
			var i = an(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), ym.has(i) || (ym.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), np(t, "link", e), Rt(t), r.head.appendChild(t)));
		}
	}
	function Em(e) {
		xm.D(e), Tm("dns-prefetch", e, null);
	}
	function Dm(e, t) {
		xm.C(e, t), Tm("preconnect", e, t);
	}
	function Om(e, t, n) {
		xm.L(e, t, n);
		var r = wm;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + an(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + an(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + an(n.imageSizes) + "\"]")) : i += "[href=\"" + an(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Pm(e);
					break;
				case "script": a = Rm(e);
			}
			if (!(vm.has(a) || (e = E({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), vm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Fm(a)) || t === "script" && r.querySelector(zm(a))))) {
				var o = r.createElement("link");
				np(o, "link", e), t === "style" && (o[Mt] = !0, o.onload = o.onerror = function() {
					zt(o);
				}), Rt(o), r.head.appendChild(o);
			}
		}
	}
	function km(e, t) {
		xm.m(e, t);
		var n = wm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + an(r) + "\"][href=\"" + an(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Rm(e);
			}
			if (!vm.has(a) && (e = E({
				rel: "modulepreload",
				href: e
			}, t), vm.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(zm(a))) return;
				}
				r = n.createElement("link"), np(r, "link", e), Rt(r), n.head.appendChild(r);
			}
		}
	}
	function Am(e, t, n) {
		xm.S(e, t, n);
		var r = wm;
		if (r && e) {
			var i = Lt(r).hoistableStyles, a = Pm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Fm(a))) s.loading = 5;
				else {
					e = E({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = vm.get(a)) && Hm(e, n);
					var c = o = r.createElement("link");
					Rt(c), np(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Vm(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function jm(e, t) {
		xm.X(e, t);
		var n = wm;
		if (n && e) {
			var r = Lt(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = E({
				src: e,
				async: !0
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), Rt(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Mm(e, t) {
		xm.M(e, t);
		var n = wm;
		if (n && e) {
			var r = Lt(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = E({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), Rt(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Nm(e, t, n, r) {
		var a = (a = De.current) ? bm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Pm(n.href), t = Lt(a).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Pm(n.href);
					var o = Lt(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Fm(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = vm.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, vm.set(e, o)), Lm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Rm(n), t = Lt(a).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Pm(e) {
		return "href=\"" + an(e) + "\"";
	}
	function Fm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Im(e) {
		return E({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Lm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[Mt]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[Mt] = !0, t.onload = t.onerror = zt.bind(null, t), np(t, "link", n), Rt(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Rm(e) {
		return "[src=\"" + an(e) + "\"]";
	}
	function zm(e) {
		return "script[async]" + e;
	}
	function Bm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + an(n.href) + "\"]");
				if (r) return t.instance = r, Rt(r), r;
				var a = E({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Rt(r), np(r, "style", a), Vm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Pm(n.href);
				var o = e.querySelector(Fm(a));
				if (o) return t.state.loading |= 4, t.instance = o, Rt(o), o;
				r = Im(n), (a = vm.get(a)) && Hm(r, a), o = (e.ownerDocument || e).createElement("link"), Rt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), np(o, "link", r), t.state.loading |= 4, Vm(o, n.precedence, e), t.instance = o;
			case "script": return o = Rm(n.src), (a = e.querySelector(zm(o))) ? (t.instance = a, Rt(a), a) : (r = n, (a = vm.get(o)) && (r = E({}, n), Um(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), Rt(a), np(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Vm(r, n.precedence, e));
		return t.instance;
	}
	function Vm(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Hm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Um(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Wm = null;
	function Gm(e, t, n) {
		if (Wm === null) {
			var r = /* @__PURE__ */ new Map(), i = Wm = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Wm, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[jt] || a[wt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Km(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function qm(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Jm(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function Ym(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Xm(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function Zm(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Xm(t), e.suspenseyImages.push(t)), e = rh.bind(e), t.decode().then(e, e));
	}
	function Qm(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Pm(r.href), a = t.querySelector(Fm(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = nh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Rt(a);
					return;
				}
				a = t.ownerDocument || t, r = Im(r), (i = vm.get(i)) && Hm(r, i), a = a.createElement("link"), Rt(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), np(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = nh.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var $m = 0;
	function eh(e, t) {
		return e.stylesheets && e.count === 0 && ah(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && ah(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && $m === 0 && ($m = 62500 * op());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ah(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > $m ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function th(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) ah(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function nh() {
		this.count--, th(this);
	}
	function rh() {
		this.imgCount--, th(this);
	}
	var ih = null;
	function ah(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, ih = /* @__PURE__ */ new Map(), t.forEach(oh, e), ih = null, nh.call(e));
	}
	function oh(e, t) {
		if (!(t.state.loading & 4)) {
			var n = ih.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), ih.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = nh.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var sh = {
		$$typeof: oe,
		Provider: null,
		Consumer: null,
		_currentValue: xe,
		_currentValue2: xe,
		_threadCount: 0
	};
	function ch(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = mt(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = mt(0), this.hiddenUpdates = mt(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function lh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new ch(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Pi(3, null, null, t), e.current = a, a.stateNode = e, t = Na(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, go(a), e;
	}
	function uh(e) {
		return e ? (e = Mi, e) : Mi;
	}
	function dh(e, t, n, r, i, a) {
		i = uh(i), r.context === null ? r.context = i : r.pendingContext = i, r = vo(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = yo(e, r, t), n !== null && (Pd(n, e, t), bo(n, e, t));
	}
	function fh(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function ph(e, t) {
		fh(e, t), (e = e.alternate) && fh(e, t);
	}
	function mh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = ki(e, 67108864);
			t !== null && Pd(t, e, 67108864), ph(e, 67108864);
		}
	}
	function hh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = jd();
			t = yt(t);
			var n = ki(e, t);
			n !== null && Pd(n, e, t), ph(e, t);
		}
	}
	var gh = !0;
	function _h(e, t, n, r) {
		var i = A.T;
		A.T = null;
		var a = j.p;
		try {
			j.p = 2, yh(e, t, n, r);
		} finally {
			j.p = a, A.T = i;
		}
	}
	function vh(e, t, n, r) {
		var i = A.T;
		A.T = null;
		var a = j.p;
		try {
			j.p = 8, yh(e, t, n, r);
		} finally {
			j.p = a, A.T = i;
		}
	}
	function yh(e, t, n, r) {
		if (gh) {
			var i = bh(r);
			if (i === null) Kf(e, t, r, xh, n), Mh(e, r);
			else if (Ph(i, e, t, n, r)) r.stopPropagation();
			else if (Mh(e, r), t & 4 && -1 < jh.indexOf(e)) {
				for (; i !== null;) {
					var a = Ft(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = ct(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - tt(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Ef(a), !(G & 6) && (_d = We() + 500, Df(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = ki(a, 2), s !== null && Pd(s, a, 2), zd(), ph(a, 2);
					}
					if (a = bh(r), a === null && Kf(e, t, r, xh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Kf(e, t, r, null, n);
		}
	}
	function bh(e) {
		return e = Sn(e), Sh(e);
	}
	var xh = null;
	function Sh(e) {
		if (xh = null, e = Pt(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return xh = e, null;
	}
	function Ch(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Ge()) {
				case Ke: return 2;
				case qe: return 8;
				case F:
				case Je: return 32;
				case Ye: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var wh = !1, Th = null, Eh = null, Dh = null, Oh = /* @__PURE__ */ new Map(), kh = /* @__PURE__ */ new Map(), Ah = [], jh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Mh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Th = null;
				break;
			case "dragenter":
			case "dragleave":
				Eh = null;
				break;
			case "mouseover":
			case "mouseout":
				Dh = null;
				break;
			case "pointerover":
			case "pointerout":
				Oh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": kh.delete(t.pointerId);
		}
	}
	function Nh(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = Ft(t), t !== null && mh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Ph(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Th = Nh(Th, e, t, n, r, i), !0;
			case "dragenter": return Eh = Nh(Eh, e, t, n, r, i), !0;
			case "mouseover": return Dh = Nh(Dh, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Oh.set(a, Nh(Oh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, kh.set(a, Nh(kh.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Fh(e) {
		var t = Pt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, St(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, St(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Ih(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = bh(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				xn = r, n.target.dispatchEvent(r), xn = null;
			} else return t = Ft(n), t !== null && mh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Lh(e, t, n) {
		Ih(e) && n.delete(t);
	}
	function Rh() {
		wh = !1, Th !== null && Ih(Th) && (Th = null), Eh !== null && Ih(Eh) && (Eh = null), Dh !== null && Ih(Dh) && (Dh = null), Oh.forEach(Lh), kh.forEach(Lh);
	}
	function zh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, wh || (wh = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Rh)));
	}
	var Bh = null;
	function Vh(e) {
		Bh !== e && (Bh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Bh === e && (Bh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Sh(r || n) === null) continue;
					break;
				}
				var a = Ft(n);
				a !== null && (e.splice(t, 3), t -= 3, nc(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Hh(e) {
		function t(t) {
			return zh(t, e);
		}
		Th !== null && zh(Th, e), Eh !== null && zh(Eh, e), Dh !== null && zh(Dh, e), Oh.forEach(t), kh.forEach(t);
		for (var n = 0; n < Ah.length; n++) {
			var r = Ah[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Ah.length && (n = Ah[0], n.blockedOn === null);) Fh(n), n.blockedOn === null && Ah.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[Tt] || null;
			if (typeof a == "function") o || Vh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[Tt] || null) s = o.formAction;
					else if (Sh(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Vh(n);
			}
		}
	}
	function Uh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Wh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.render = Wh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		dh(n, jd(), e, t, null, null);
	}, Gh.prototype.unmount = Wh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			dh(e.current, 2, null, e, null, null), zd(), t[Et] = null;
		}
	};
	function Gh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = xt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Ah.length && t !== 0 && t < Ah[n].priority; n++);
			Ah.splice(n, 0, e), n === 0 && Fh(e);
		}
	};
	var Kh = n.version;
	if (Kh !== "19.3.1") throw Error(i(527, Kh, "19.3.1"));
	j.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var qh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: A,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Jh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Jh.isDisabled && Jh.supportsFiber) try {
			Qe = Jh.inject(qh), $e = Jh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Tc, s = Ec, c = Dc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = lh(e, 1, !1, null, null, n, r, null, o, s, c, Uh), e[Et] = t.current, Wf(e), new Wh(t);
	};
})), g = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
})), _ = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), v = /* @__PURE__ */ o(((e, t) => {
	t.exports = _();
})), y = g(), b = /* @__PURE__ */ c(u(), 1), x = v(), S = (e) => new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0
}).format(Number(e || 0));
function C({ history: e, historyDetail: t, cases: n, currentCase: r, proposal: i, role: a, onRole: o, approve: s, loadCase: c, onOpenEvidence: l, onOpenAgent: u }) {
	let [d, f] = (0, b.useState)("all"), [p, m] = (0, b.useState)("all"), h = e?.periods || [], g = h.filter((e) => Object.values(e.sources || {}).some((e) => e.freshness !== "current")), _ = h.length - g.length, v = r?.result, y = h.filter((e) => (d === "all" || e.period === d) && (p === "all" || p === "exception" === g.some((t) => t.period === e.period)));
	return /* @__PURE__ */ (0, x.jsxs)("section", {
		className: "surface close-cockpit",
		"aria-label": "Month-end close work center",
		children: [
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "section-heading",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [
					/* @__PURE__ */ (0, x.jsx)("span", {
						className: "eyebrow",
						children: "FINANCE / PERIOD-END CLOSE"
					}),
					/* @__PURE__ */ (0, x.jsx)("h2", { children: "Month-End Reconciliation" }),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "fi-page-subtitle",
						children: "Review close periods, source status and variance outcomes."
					})
				] }), /* @__PURE__ */ (0, x.jsxs)("div", {
					className: "fi-page-actions",
					children: [/* @__PURE__ */ (0, x.jsx)("span", {
						className: "fi-app-status",
						children: "● Synthetic data"
					}), /* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						className: "primary",
						onClick: u,
						children: "Ask Finance Agent"
					})]
				})]
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "cockpit-kpis",
				children: [
					/* @__PURE__ */ (0, x.jsxs)("div", { children: [
						/* @__PURE__ */ (0, x.jsx)("span", { children: "Close periods" }),
						/* @__PURE__ */ (0, x.jsx)("strong", { children: h.length }),
						/* @__PURE__ */ (0, x.jsx)("small", { children: "Monthly snapshots" })
					] }),
					/* @__PURE__ */ (0, x.jsxs)("div", { children: [
						/* @__PURE__ */ (0, x.jsx)("span", { children: "Comparable" }),
						/* @__PURE__ */ (0, x.jsx)("strong", { children: _ }),
						/* @__PURE__ */ (0, x.jsx)("small", { children: "Current source status" })
					] }),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: g.length ? "attention" : "",
						children: [
							/* @__PURE__ */ (0, x.jsx)("span", { children: "Exceptions" }),
							/* @__PURE__ */ (0, x.jsx)("strong", { children: g.length }),
							/* @__PURE__ */ (0, x.jsx)("small", { children: "Stale source periods" })
						]
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", { children: [
						/* @__PURE__ */ (0, x.jsx)("span", { children: "Cases reviewed" }),
						/* @__PURE__ */ (0, x.jsx)("strong", { children: n.length }),
						/* @__PURE__ */ (0, x.jsx)("small", { children: "This demo session" })
					] })
				]
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "fi-filterbar",
				children: [
					/* @__PURE__ */ (0, x.jsxs)("label", { children: ["Period", /* @__PURE__ */ (0, x.jsxs)("select", {
						value: d,
						onChange: (e) => f(e.target.value),
						children: [/* @__PURE__ */ (0, x.jsx)("option", {
							value: "all",
							children: "All periods"
						}), h.map((e) => /* @__PURE__ */ (0, x.jsx)("option", {
							value: e.period,
							children: e.period
						}, e.period))]
					})] }),
					/* @__PURE__ */ (0, x.jsxs)("label", { children: ["Status", /* @__PURE__ */ (0, x.jsxs)("select", {
						value: p,
						onChange: (e) => m(e.target.value),
						children: [
							/* @__PURE__ */ (0, x.jsx)("option", {
								value: "all",
								children: "All statuses"
							}),
							/* @__PURE__ */ (0, x.jsx)("option", {
								value: "ready",
								children: "Ready"
							}),
							/* @__PURE__ */ (0, x.jsx)("option", {
								value: "exception",
								children: "Exception"
							})
						]
					})] }),
					/* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: () => {
							f("all"), m("all");
						},
						children: "Clear filters"
					}),
					/* @__PURE__ */ (0, x.jsxs)("span", { children: [
						y.length,
						" of ",
						h.length,
						" periods"
					] })
				]
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "cockpit-body",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "fi-table-toolbar",
						children: [/* @__PURE__ */ (0, x.jsx)("h3", { children: "Close worklist" }), /* @__PURE__ */ (0, x.jsx)("span", { children: "Period-end source comparison" })]
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "worklist-header",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ (0, x.jsx)("span", { children: "Period" }),
							/* @__PURE__ */ (0, x.jsx)("span", { children: "Variance" }),
							/* @__PURE__ */ (0, x.jsx)("span", { children: "Status" })
						]
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "worklist",
						children: [y.map((e) => {
							let t = g.some((t) => t.period === e.period);
							return /* @__PURE__ */ (0, x.jsxs)("button", {
								type: "button",
								className: r?.scope?.period === e.period ? "selected" : "",
								onClick: () => c?.(e.period),
								children: [
									/* @__PURE__ */ (0, x.jsx)("span", { children: e.period }),
									/* @__PURE__ */ (0, x.jsx)("strong", { children: t ? "Source review" : S(e.sources.s4.balance - e.sources.cfin.balance) }),
									/* @__PURE__ */ (0, x.jsx)("em", {
										className: t ? "warn" : "ok",
										children: t ? "EXCEPTION" : "READY"
									})
								]
							}, e.period);
						}), !y.length && /* @__PURE__ */ (0, x.jsx)("p", {
							className: "fi-empty-filter",
							children: "No periods match the selected filters."
						})]
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "exception-queue",
						children: [/* @__PURE__ */ (0, x.jsx)("h3", { children: "Exception queue" }), g.map((e) => /* @__PURE__ */ (0, x.jsxs)("div", { children: [
							/* @__PURE__ */ (0, x.jsx)("strong", { children: e.period }),
							/* @__PURE__ */ (0, x.jsxs)("span", { children: [Object.entries(e.sources).filter(([, e]) => e.freshness !== "current").map(([e]) => e.toUpperCase()).join(", "), " freshness requires review"] }),
							/* @__PURE__ */ (0, x.jsx)("em", { children: "HELD" })
						] }, e.period))]
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "recent-cases",
						children: [/* @__PURE__ */ (0, x.jsx)("h3", { children: "Recent reconciliation cases" }), n.slice(0, 5).map((e) => /* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsxs)("span", { children: [
							e.scope?.period,
							" · ",
							e.scenario
						] }), /* @__PURE__ */ (0, x.jsx)("strong", { children: e.status })] }, e.case_id))]
					})
				] }), /* @__PURE__ */ (0, x.jsxs)("div", {
					className: "cockpit-detail",
					children: [
						/* @__PURE__ */ (0, x.jsx)("h3", { children: "Selected case and controls" }),
						v ? /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "detail-line",
								children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Case" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: r.case_id })]
							}),
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "detail-line",
								children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Period / route" }), /* @__PURE__ */ (0, x.jsxs)("strong", { children: [
									v.scope.period,
									" · ",
									r.scenario
								] })]
							}),
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "detail-line",
								children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "S/4HANA − Central Finance" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: S(v.variance.amount) })]
							}),
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "detail-line",
								children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Source status" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: v.variance.state })]
							}),
							/* @__PURE__ */ (0, x.jsx)("button", {
								className: "detail-toggle",
								type: "button",
								onClick: l,
								children: "Open account, document and correlation evidence →"
							})
						] }) : /* @__PURE__ */ (0, x.jsx)("p", {
							className: "micro",
							children: "Select a period or ask for a reconciliation to inspect source lineage and controls."
						}),
						/* @__PURE__ */ (0, x.jsxs)("div", {
							className: "approval-lane",
							children: [
								/* @__PURE__ */ (0, x.jsx)("span", {
									className: "eyebrow",
									children: "SEPARATE SYNTHETIC APPROVAL LANE"
								}),
								/* @__PURE__ */ (0, x.jsx)("p", { children: i ? `Proposal ${i.proposal_id} · ${i.status} · signed variance marker ${S(i.amount)}` : "No proposal for this case." }),
								/* @__PURE__ */ (0, x.jsx)("label", {
									htmlFor: "demo-role",
									children: "Demo role"
								}),
								/* @__PURE__ */ (0, x.jsxs)("select", {
									id: "demo-role",
									value: a,
									onChange: (e) => o(e.target.value),
									children: [/* @__PURE__ */ (0, x.jsx)("option", {
										value: "maker",
										children: "Finance maker"
									}), /* @__PURE__ */ (0, x.jsx)("option", {
										value: "approver",
										children: "Finance approver"
									})]
								}),
								/* @__PURE__ */ (0, x.jsx)("button", {
									type: "button",
									disabled: a !== "approver" || i?.status !== "awaiting_approval",
									onClick: s,
									children: "Approve variance marker"
								}),
								/* @__PURE__ */ (0, x.jsx)("small", { children: "Approval records a local synthetic marker only; it does not determine accounts or post to SAP." })
							]
						})
					]
				})]
			})
		]
	});
}
// src/EvidenceShortcut.jsx
function w({ investigation: e, onOpen: t }) {
	let n = e?.diagnosis?.classification?.replaceAll("_", " ");
	return /* @__PURE__ */ (0, x.jsxs)("section", {
		className: "surface evidence-shortcut",
		children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [
			/* @__PURE__ */ (0, x.jsx)("span", {
				className: "eyebrow",
				children: "EVIDENCE & CORRELATION"
			}),
			/* @__PURE__ */ (0, x.jsx)("strong", { children: e ? `${n || "Investigation in progress"} · ${e.status.replaceAll("_", " ")}` : "Trace the agent’s proof" }),
			/* @__PURE__ */ (0, x.jsx)("small", { children: e ? `${e.proof?.length || 0} evidence items · ${e.plan?.filter((e) => e.status === "complete").length || 0} plan steps complete` : "Document comparison, decisions, source lineage and component events" })
		] }), /* @__PURE__ */ (0, x.jsx)("button", {
			type: "button",
			className: "text-link",
			onClick: t,
			children: "Open proof & correlation →"
		})]
	});
}
// src/ProofDossier.jsx
var T = (e) => e == null ? "—" : new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0
}).format(Number(e));
function ee({ investigation: e, currentCase: t, busy: n, onStart: r, onResolve: i, onTrace: a, architect: o = !1 }) {
	let [s, c] = (0, b.useState)("replication_gap"), [l, u] = (0, b.useState)(null), d = t?.status === "complete" && t?.scope?.period === "2026-11" && t?.result?.variance?.state === "comparable" && Number(t?.result?.variance?.amount) !== 0, f = e && (e.case_id === t?.case_id || e.after?.case_id === t?.case_id) ? e : null, p = f?.proof?.find((e) => e.proof_id === l) || f?.proof?.at(-1);
	return /* @__PURE__ */ (0, x.jsxs)("section", {
		className: `surface proof-dossier ${o ? "proof-architect" : ""}`,
		"aria-label": "Dynamic proof dossier",
		children: [
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "section-heading",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
					className: "eyebrow",
					children: "AGENTIC INVESTIGATION · DOCUMENT PROOF"
				}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "Dynamic proof dossier" })] }), /* @__PURE__ */ (0, x.jsx)("span", {
					className: `pill ${f?.status === "held" ? "warn" : f?.status === "resolved" ? "ok" : "quiet"}`,
					children: f?.status?.replaceAll("_", " ") || "Ready for a case"
				})]
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "proof-intro",
				children: [/* @__PURE__ */ (0, x.jsx)("p", { children: "Trace the agent’s plan, each tool observation, its rule, and the before/after result. All evidence is synthetic and scoped to November 2026." }), /* @__PURE__ */ (0, x.jsxs)("div", {
					className: "proof-actions",
					children: [
						/* @__PURE__ */ (0, x.jsxs)("label", { children: ["Fault profile", /* @__PURE__ */ (0, x.jsxs)("select", {
							value: s,
							onChange: (e) => c(e.target.value),
							disabled: n,
							children: [/* @__PURE__ */ (0, x.jsx)("option", {
								value: "replication_gap",
								children: "Missing replication"
							}), /* @__PURE__ */ (0, x.jsx)("option", {
								value: "mapping_conflict",
								children: "Mapping conflict"
							})]
						})] }),
						/* @__PURE__ */ (0, x.jsx)("button", {
							type: "button",
							className: "primary",
							disabled: !d || n || f?.status === "running" || f?.status === "reconciling",
							onClick: () => r(s),
							children: n ? "Working…" : "Investigate variance"
						}),
						f && /* @__PURE__ */ (0, x.jsx)("button", {
							type: "button",
							onClick: () => a(f.case_id),
							children: "Inspect investigation trace"
						})
					]
				})]
			}),
			f ? /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [
				/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "proof-summary",
					children: [
						/* @__PURE__ */ (0, x.jsxs)("div", { children: [
							/* @__PURE__ */ (0, x.jsx)("span", { children: "Before" }),
							/* @__PURE__ */ (0, x.jsx)("strong", { children: T(f.before?.variance?.amount) }),
							/* @__PURE__ */ (0, x.jsx)("small", { children: f.before?.case_id })
						] }),
						/* @__PURE__ */ (0, x.jsx)("div", {
							className: "proof-arrow",
							children: "→"
						}),
						/* @__PURE__ */ (0, x.jsxs)("div", { children: [
							/* @__PURE__ */ (0, x.jsx)("span", { children: "After" }),
							/* @__PURE__ */ (0, x.jsx)("strong", { children: f.after ? T(f.after.variance?.amount) : "Awaiting action" }),
							/* @__PURE__ */ (0, x.jsx)("small", { children: f.after?.case_id || f.diagnosis?.classification?.replaceAll("_", " ") || "Plan in progress" })
						] })
					]
				}),
				/* @__PURE__ */ (0, x.jsx)("div", {
					className: "proof-plan",
					children: f.plan.map((e, t) => /* @__PURE__ */ (0, x.jsxs)("div", {
						className: `proof-step proof-step-${e.status}`,
						children: [
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "proof-step-no",
								children: String(t + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: e.label }), /* @__PURE__ */ (0, x.jsxs)("small", { children: [
								e.component_id.replaceAll("_", " "),
								" · ",
								e.status
							] })] }),
							/* @__PURE__ */ (0, x.jsxs)("span", { children: [e.proof_ids.length, " proof"] })
						]
					}, e.step_id))
				}),
				/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "proof-decision",
					children: [
						/* @__PURE__ */ (0, x.jsx)("span", {
							className: "eyebrow",
							children: "AGENT DECISION"
						}),
						/* @__PURE__ */ (0, x.jsx)("strong", { children: f.diagnosis?.classification?.replaceAll("_", " ") || "Testing hypotheses" }),
						/* @__PURE__ */ (0, x.jsx)("p", { children: f.reason || "Document and source evidence are being checked." }),
						f.status === "action_proposed" && /* @__PURE__ */ (0, x.jsx)("button", {
							type: "button",
							disabled: n,
							onClick: () => i(f.investigation_id),
							children: "Apply simulated reprocess and re-reconcile"
						}),
						f.status === "held" && /* @__PURE__ */ (0, x.jsx)("small", { children: "Held for finance and integration review. No source mutation was made." }),
						f.status === "resolved" && /* @__PURE__ */ (0, x.jsx)("small", { children: "Reprocess and downstream refresh were simulated locally. No SAP document was posted." })
					]
				}),
				/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "proof-evidence",
					children: [
						/* @__PURE__ */ (0, x.jsxs)("div", {
							className: "proof-evidence-head",
							children: [/* @__PURE__ */ (0, x.jsx)("span", {
								className: "eyebrow",
								children: "EVIDENCE LEDGER"
							}), /* @__PURE__ */ (0, x.jsxs)("strong", { children: [f.proof.length, " items"] })]
						}),
						/* @__PURE__ */ (0, x.jsx)("div", {
							className: "proof-evidence-list",
							children: f.proof.map((e) => /* @__PURE__ */ (0, x.jsxs)("button", {
								type: "button",
								className: p?.proof_id === e.proof_id ? "selected" : "",
								onClick: () => u(e.proof_id),
								children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: e.label }), /* @__PURE__ */ (0, x.jsx)("span", { children: e.evidence_id })]
							}, e.proof_id))
						}),
						p && /* @__PURE__ */ (0, x.jsxs)("div", {
							className: "proof-inspector",
							children: [
								/* @__PURE__ */ (0, x.jsx)("strong", { children: p.label }),
								/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Owner" }), /* @__PURE__ */ (0, x.jsx)("b", { children: p.component_id.replaceAll("_", " ") })] }),
								/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Evidence ID" }), /* @__PURE__ */ (0, x.jsx)("b", { children: p.evidence_id })] }),
								/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "SHA-256" }), /* @__PURE__ */ (0, x.jsx)("code", { children: p.sha256 })] }),
								!o && /* @__PURE__ */ (0, x.jsx)("pre", { children: JSON.stringify(p.data, null, 2) }),
								o && /* @__PURE__ */ (0, x.jsx)("p", { children: "Open the business workspace to inspect document values. This architecture view shows neutral evidence references and the decision path." })
							]
						})
					]
				})
			] }) : /* @__PURE__ */ (0, x.jsx)("div", {
				className: "proof-empty",
				children: "Run a comparable November case, then investigate. The missing-document and mapping-conflict profiles show a resolution path and a controlled hold."
			})
		]
	});
}
// src/EvidenceDetails.jsx
var E = {
	s4: "S/4HANA",
	cfin: "Central Finance",
	bw: "BW/4HANA",
	databricks: "Databricks"
}, D = (e) => e == null ? "Not comparable" : new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0
}).format(Number(e));
function te({ currentCase: e, history: t, historyDetail: n }) {
	let r = e?.result?.variance ? e.result : null;
	return /* @__PURE__ */ (0, x.jsxs)("div", {
		className: "finance-evidence",
		children: [
			/* @__PURE__ */ (0, x.jsxs)("section", {
				className: "surface",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "section-heading",
					children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
						className: "eyebrow",
						children: "DETERMINISTIC FINANCE OUTPUT"
					}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "Source snapshots and calculation" })] }), r && /* @__PURE__ */ (0, x.jsx)("span", {
						className: "pill quiet",
						children: r.case_id
					})]
				}), r ? /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "finance-evidence-summary",
						children: [
							/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Variance" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: D(r.variance.amount) })] }),
							/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Comparability" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: r.variance.state })] }),
							/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Period · route" }), /* @__PURE__ */ (0, x.jsxs)("strong", { children: [
								r.scope.period,
								" · ",
								r.scenario
							] })] })
						]
					}),
					/* @__PURE__ */ (0, x.jsxs)("p", {
						className: "report-note",
						children: [
							/* @__PURE__ */ (0, x.jsx)("strong", { children: "Calculation:" }),
							" ",
							r.variance.formula,
							". The model explanation is advisory."
						]
					}),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "finance-evidence-table",
						children: /* @__PURE__ */ (0, x.jsxs)("table", { children: [/* @__PURE__ */ (0, x.jsx)("thead", { children: /* @__PURE__ */ (0, x.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, x.jsx)("th", { children: "Source" }),
							/* @__PURE__ */ (0, x.jsx)("th", { children: "Balance" }),
							/* @__PURE__ */ (0, x.jsx)("th", { children: "Freshness" }),
							/* @__PURE__ */ (0, x.jsx)("th", { children: "Snapshot UTC" }),
							/* @__PURE__ */ (0, x.jsx)("th", { children: "Evidence ID" })
						] }) }), /* @__PURE__ */ (0, x.jsx)("tbody", { children: Object.values(r.sources || {}).map((e) => /* @__PURE__ */ (0, x.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, x.jsx)("th", {
								scope: "row",
								children: E[e.source] || e.source
							}),
							/* @__PURE__ */ (0, x.jsx)("td", { children: D(e.balance) }),
							/* @__PURE__ */ (0, x.jsx)("td", { children: e.freshness }),
							/* @__PURE__ */ (0, x.jsx)("td", { children: e.timestamp_utc }),
							/* @__PURE__ */ (0, x.jsx)("td", { children: e.evidence_id })
						] }, e.source)) })] })
					}),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "report-note",
						children: r.advisory_explanation
					})
				] }) : /* @__PURE__ */ (0, x.jsx)("p", {
					className: "empty-inline",
					children: "Run a synthetic reconciliation to see source balances, timestamps and evidence IDs."
				})]
			}),
			/* @__PURE__ */ (0, x.jsxs)("section", {
				className: "surface",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "section-heading",
					children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
						className: "eyebrow",
						children: "SQLITE SYNTHETIC HISTORY"
					}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "12-month evidence set" })] }), /* @__PURE__ */ (0, x.jsxs)("span", {
						className: "pill quiet",
						children: [t?.account_count || 6, " G/L accounts"]
					})]
				}), /* @__PURE__ */ (0, x.jsx)("div", {
					className: "evidence-months",
					children: (t?.periods || []).map((e) => /* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: e.period }), /* @__PURE__ */ (0, x.jsx)("span", { children: Object.values(e.sources || {}).some((e) => e.freshness !== "current") ? "Source review" : D(e.sources.s4.balance - e.sources.cfin.balance) })] }, e.period))
				})]
			}),
			n && /* @__PURE__ */ (0, x.jsxs)("section", {
				className: "surface source-evidence",
				children: [
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "section-heading",
						children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
							className: "eyebrow",
							children: "MONTHLY SOURCE LINEAGE"
						}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "Account and journal evidence" })] }), /* @__PURE__ */ (0, x.jsx)("span", {
							className: "pill quiet",
							children: n.period
						})]
					}),
					/* @__PURE__ */ (0, x.jsx)("p", { children: "Illustrative seeded rows; closing balances are aggregate source snapshots." }),
					/* @__PURE__ */ (0, x.jsxs)("details", { children: [/* @__PURE__ */ (0, x.jsxs)("summary", { children: [
						"Open ",
						n.balances.length,
						" G/L account balances"
					] }), /* @__PURE__ */ (0, x.jsx)("div", {
						className: "source-evidence-rows",
						children: n.balances.map((e) => /* @__PURE__ */ (0, x.jsxs)("div", { children: [
							/* @__PURE__ */ (0, x.jsx)("strong", { children: e.account }),
							/* @__PURE__ */ (0, x.jsx)("span", { children: e.source.toUpperCase() }),
							/* @__PURE__ */ (0, x.jsxs)("b", { children: [Number(e.balance).toLocaleString("en-US"), " USD"] }),
							/* @__PURE__ */ (0, x.jsx)("small", { children: e.evidence_id })
						] }, `${e.source}-${e.account}`))
					})] }),
					/* @__PURE__ */ (0, x.jsxs)("details", { children: [/* @__PURE__ */ (0, x.jsxs)("summary", { children: [
						"Open ",
						n.journals.length,
						" journal evidence records"
					] }), /* @__PURE__ */ (0, x.jsx)("div", {
						className: "source-evidence-rows",
						children: n.journals.map((e) => /* @__PURE__ */ (0, x.jsxs)("div", { children: [
							/* @__PURE__ */ (0, x.jsx)("strong", { children: e.journal_id }),
							/* @__PURE__ */ (0, x.jsx)("span", { children: e.account }),
							/* @__PURE__ */ (0, x.jsxs)("b", { children: [Number(e.amount).toLocaleString("en-US"), " USD"] }),
							/* @__PURE__ */ (0, x.jsx)("small", { children: e.description })
						] }, e.journal_id))
					})] })
				]
			})
		]
	});
}
function ne({ run: e, questions: t = [], requestedSeq: n }) {
	let [r, i] = (0, b.useState)(null);
	(0, b.useEffect)(() => i(n || e?.steps?.[0]?.seq || null), [e?.run_id, n]);
	let a = e?.steps?.find((e) => e.seq === r) || e?.steps?.[0], o = t.find((t) => t.id === e?.question_id);
	function s() {
		if (!e) return;
		let t = document.createElement("a"), n = new Blob([JSON.stringify({
			...e,
			meeting_status: "OPEN — no human decision recorded"
		}, null, 2)], { type: "application/json" });
		t.href = URL.createObjectURL(n), t.download = `${e.run_id}-architecture-decision.json`, t.click(), setTimeout(() => URL.revokeObjectURL(t.href), 1e3);
	}
	return /* @__PURE__ */ (0, x.jsxs)("section", {
		className: "surface question-evidence",
		children: [/* @__PURE__ */ (0, x.jsxs)("div", {
			className: "section-heading",
			children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
				className: "eyebrow",
				children: "ARCHITECTURE DECISION EVIDENCE"
			}), /* @__PURE__ */ (0, x.jsx)("h2", { children: o?.title || "Question handoffs" })] }), e && /* @__PURE__ */ (0, x.jsxs)("div", {
				className: "heading-actions",
				children: [/* @__PURE__ */ (0, x.jsxs)("span", {
					className: "pill quiet",
					children: [
						e.status,
						" · ",
						e.route
					]
				}), /* @__PURE__ */ (0, x.jsx)("button", {
					type: "button",
					className: "export-button",
					onClick: s,
					children: "Download synthetic decision packet"
				})]
			})]
		}), e ? /* @__PURE__ */ (0, x.jsxs)("div", {
			className: "question-evidence-body",
			children: [/* @__PURE__ */ (0, x.jsx)("div", {
				className: "question-evidence-steps",
				children: (e.steps || []).map((e) => /* @__PURE__ */ (0, x.jsxs)("button", {
					type: "button",
					className: a?.seq === e.seq ? "selected" : "",
					onClick: () => i(e.seq),
					children: [
						/* @__PURE__ */ (0, x.jsx)("span", { children: String(e.seq).padStart(2, "0") }),
						/* @__PURE__ */ (0, x.jsx)("strong", { children: e.component }),
						/* @__PURE__ */ (0, x.jsx)("small", { children: e.status })
					]
				}, e.seq))
			}), /* @__PURE__ */ (0, x.jsxs)("div", {
				className: "question-evidence-detail",
				children: [
					a ? /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [/* @__PURE__ */ (0, x.jsx)("h3", { children: a.component }), /* @__PURE__ */ (0, x.jsxs)("dl", { children: [
						/* @__PURE__ */ (0, x.jsx)("dt", { children: "Received input" }),
						/* @__PURE__ */ (0, x.jsx)("dd", { children: a.input }),
						/* @__PURE__ */ (0, x.jsx)("dt", { children: "Control and owner" }),
						/* @__PURE__ */ (0, x.jsxs)("dd", { children: [
							a.control,
							/* @__PURE__ */ (0, x.jsx)("br", {}),
							a.owner
						] }),
						/* @__PURE__ */ (0, x.jsx)("dt", { children: "Passed output" }),
						/* @__PURE__ */ (0, x.jsx)("dd", { children: a.output }),
						/* @__PURE__ */ (0, x.jsx)("dt", { children: "Identity reference" }),
						/* @__PURE__ */ (0, x.jsx)("dd", { children: a.identity }),
						/* @__PURE__ */ (0, x.jsx)("dt", { children: "Proof still needed" }),
						/* @__PURE__ */ (0, x.jsx)("dd", { children: a.proof_gap }),
						/* @__PURE__ */ (0, x.jsx)("dt", { children: "Synthetic evidence ID" }),
						/* @__PURE__ */ (0, x.jsx)("dd", { children: a.evidence_id })
					] })] }) : /* @__PURE__ */ (0, x.jsx)("p", { children: "Select a handoff." }),
					/* @__PURE__ */ (0, x.jsx)("h3", { children: "Proof gates" }),
					/* @__PURE__ */ (0, x.jsx)("ul", { children: (o?.gates || []).map((e) => /* @__PURE__ */ (0, x.jsx)("li", { children: e }, e)) }),
					/* @__PURE__ */ (0, x.jsx)("h3", { children: "Control ownership" }),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "question-evidence-matrix",
						children: (e.control_matrix || []).map((e) => /* @__PURE__ */ (0, x.jsxs)("div", { children: [
							/* @__PURE__ */ (0, x.jsx)("strong", { children: e.component }),
							/* @__PURE__ */ (0, x.jsx)("span", { children: e.owner }),
							/* @__PURE__ */ (0, x.jsx)("p", { children: e.responsibility })
						] }, e.component))
					})
				]
			})]
		}) : /* @__PURE__ */ (0, x.jsx)("p", {
			className: "empty-inline",
			children: "Run an architecture question to inspect its input, output, owner and remaining proof."
		})]
	});
}
// src/ImplementationEvidence.jsx
var O = [
	["External agent contract", "AgentCore Runtime, identity and MCP client are named simulator components. The local Python runtime follows a bounded plan; no external agent is connected."],
	["SAP-owned capability", "The SAP finance tool, Apigee candidate, Integration Suite path and backend roles are simulated boundaries. No SAP tenant call or principal propagation is proved."],
	["Presentation", "The Fiori-inspired interface is built with React and Node.js tooling. Streamlit hosts its compiled assets; Node.js is not an agent in the runtime path."],
	["Execution and proof", "Python evaluates the finance rules and SQLite stores synthetic snapshots, cases and request/response events. The variance amount comes from the deterministic engine."]
];
function re({ currentCase: e, events: t = [] }) {
	return /* @__PURE__ */ (0, x.jsxs)("section", {
		className: "surface implementation-evidence",
		children: [
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "section-heading",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
					className: "eyebrow",
					children: "IMPLEMENTATION AND VALIDATION BOUNDARY"
				}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "What the external-agent view represents" })] }), /* @__PURE__ */ (0, x.jsx)("span", {
					className: "pill simulated",
					children: "SYNTHETIC"
				})]
			}),
			/* @__PURE__ */ (0, x.jsx)("p", {
				className: "implementation-intro",
				children: "The live diagram presents a proposed external agent calling SAP-owned finance capabilities. The runnable demo uses one local simulator process and does not establish deployed gateway, SAP, or identity integration."
			}),
			/* @__PURE__ */ (0, x.jsx)("div", {
				className: "implementation-grid",
				children: O.map(([e, t]) => /* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: e }), /* @__PURE__ */ (0, x.jsx)("p", { children: t })] }, e))
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "implementation-state",
				children: [
					/* @__PURE__ */ (0, x.jsx)("strong", { children: "Current trace" }),
					/* @__PURE__ */ (0, x.jsxs)("span", { children: [
						e?.case_id || "No case selected",
						" · ",
						t.length,
						" stored events"
					] }),
					/* @__PURE__ */ (0, x.jsx)("span", { children: "S1/S2 simulated alternatives · S3 proposed combined path remains open" })
				]
			})
		]
	});
}
// src/EvidenceCorrelation.jsx
function ie({ investigation: e, currentCase: t, history: n, historyDetail: r, events: i, caseEvents: a, decisionRun: o, decisionQuestions: s, componentDetails: c, reviewPanel: l, focus: u, busy: d, onStart: f, onResolve: p, onTrace: m }) {
	let [h, g] = (0, b.useState)(null), [_, v] = (0, b.useState)(""), [y, S] = (0, b.useState)("investigation"), [C, w] = (0, b.useState)("proof");
	(0, b.useEffect)(() => {
		u?.section && w(u.section);
	}, [u?.nonce]);
	let T = (0, b.useRef)(null), E = Math.min(...e?.plan?.map((e) => e.last_event_seq).filter(Boolean) || []), D = Number.isFinite(E) ? E - 2 : 0, O = (0, b.useMemo)(() => i.filter((e) => (y === "full" || e.seq >= D) && `${e.operation} ${e.source_component_id} ${e.target_component_id} ${e.status}`.toLowerCase().includes(_.toLowerCase())), [
		i,
		_,
		y,
		D
	]), ie = i.find((e) => e.seq === h) || O.at(-1);
	return (0, b.useEffect)(() => {
		h && T.current?.querySelector(`[data-seq="${h}"]`)?.scrollIntoView({ block: "nearest" });
	}, [h, O]), /* @__PURE__ */ (0, x.jsxs)("main", {
		className: "evidence-workspace",
		"aria-label": "Evidence and correlation",
		children: [/* @__PURE__ */ (0, x.jsx)("nav", {
			className: "evidence-section-nav",
			"aria-label": "Evidence sections",
			children: [
				["proof", "Investigation proof"],
				["finance", "Finance sources"],
				["components", "Component trace"],
				["questions", "Question handoffs"],
				["implementation", "Implementation"]
			].map(([e, t]) => /* @__PURE__ */ (0, x.jsx)("button", {
				type: "button",
				className: C === e ? "active" : "",
				onClick: () => w(e),
				children: t
			}, e))
		}), /* @__PURE__ */ (0, x.jsxs)("div", {
			className: "evidence-stage",
			children: [
				C === "proof" && /* @__PURE__ */ (0, x.jsxs)("div", {
					className: "evidence-layout",
					children: [/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "evidence-detail-column",
						children: [/* @__PURE__ */ (0, x.jsx)(ee, {
							investigation: e,
							currentCase: t,
							busy: d,
							onStart: f,
							onResolve: p,
							onTrace: m
						}), r && /* @__PURE__ */ (0, x.jsxs)("section", {
							className: "surface source-evidence",
							children: [
								/* @__PURE__ */ (0, x.jsxs)("div", {
									className: "section-heading",
									children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
										className: "eyebrow",
										children: "MONTHLY SOURCE LINEAGE"
									}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "Account and journal evidence" })] }), /* @__PURE__ */ (0, x.jsx)("span", {
										className: "pill quiet",
										children: r.period
									})]
								}),
								/* @__PURE__ */ (0, x.jsx)("p", { children: "Illustrative seeded rows; closing balances are aggregate source snapshots." }),
								/* @__PURE__ */ (0, x.jsxs)("details", { children: [/* @__PURE__ */ (0, x.jsxs)("summary", { children: [
									"Open ",
									r.balances.length,
									" G/L account balances"
								] }), /* @__PURE__ */ (0, x.jsx)("div", {
									className: "source-evidence-rows",
									children: r.balances.map((e) => /* @__PURE__ */ (0, x.jsxs)("div", { children: [
										/* @__PURE__ */ (0, x.jsx)("strong", { children: e.account }),
										/* @__PURE__ */ (0, x.jsx)("span", { children: e.source.toUpperCase() }),
										/* @__PURE__ */ (0, x.jsxs)("b", { children: [Number(e.balance).toLocaleString("en-US"), " USD"] }),
										/* @__PURE__ */ (0, x.jsx)("small", { children: e.evidence_id })
									] }, `${e.source}-${e.account}`))
								})] }),
								/* @__PURE__ */ (0, x.jsxs)("details", { children: [/* @__PURE__ */ (0, x.jsxs)("summary", { children: [
									"Open ",
									r.journals.length,
									" journal evidence records"
								] }), /* @__PURE__ */ (0, x.jsx)("div", {
									className: "source-evidence-rows",
									children: r.journals.map((e) => /* @__PURE__ */ (0, x.jsxs)("div", { children: [
										/* @__PURE__ */ (0, x.jsx)("strong", { children: e.journal_id }),
										/* @__PURE__ */ (0, x.jsx)("span", { children: e.account }),
										/* @__PURE__ */ (0, x.jsxs)("b", { children: [Number(e.amount).toLocaleString("en-US"), " USD"] }),
										/* @__PURE__ */ (0, x.jsx)("small", { children: e.description })
									] }, e.journal_id))
								})] })
							]
						})]
					}), /* @__PURE__ */ (0, x.jsxs)("section", {
						className: "surface correlation-panel",
						children: [
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "section-heading",
								children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
									className: "eyebrow",
									children: "PERSISTED COMPONENT COMMUNICATION"
								}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "Evidence correlation" })] }), /* @__PURE__ */ (0, x.jsxs)("span", {
									className: "pill quiet",
									children: [i.length, " events"]
								})]
							}),
							/* @__PURE__ */ (0, x.jsx)("p", {
								className: "correlation-intro",
								children: "Select a plan step or event to see which component received the request, returned the result, and recorded the decision."
							}),
							e && /* @__PURE__ */ (0, x.jsx)("div", {
								className: "correlation-steps",
								children: e.plan.map((e) => /* @__PURE__ */ (0, x.jsxs)("button", {
									type: "button",
									onClick: () => g(e.last_event_seq),
									disabled: !e.last_event_seq,
									children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: e.label }), /* @__PURE__ */ (0, x.jsx)("span", { children: e.last_event_seq ? `Event #${e.last_event_seq}` : e.status })]
								}, e.step_id))
							}),
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "correlation-segment",
								children: [/* @__PURE__ */ (0, x.jsx)("button", {
									type: "button",
									className: y === "investigation" ? "active" : "",
									onClick: () => S("investigation"),
									children: "Investigation segment"
								}), /* @__PURE__ */ (0, x.jsx)("button", {
									type: "button",
									className: y === "full" ? "active" : "",
									onClick: () => S("full"),
									children: "Entire request"
								})]
							}),
							/* @__PURE__ */ (0, x.jsxs)("label", {
								className: "correlation-filter",
								children: ["Find operation or component", /* @__PURE__ */ (0, x.jsx)("input", {
									value: _,
									onChange: (e) => v(e.target.value),
									placeholder: "compare, gateway, policy…"
								})]
							}),
							/* @__PURE__ */ (0, x.jsx)("div", {
								className: "correlation-events",
								ref: T,
								children: O.map((e) => /* @__PURE__ */ (0, x.jsxs)("button", {
									type: "button",
									"data-seq": e.seq,
									className: ie?.seq === e.seq ? "selected" : "",
									onClick: () => g(e.seq),
									children: [
										/* @__PURE__ */ (0, x.jsxs)("span", { children: ["#", e.seq] }),
										/* @__PURE__ */ (0, x.jsx)("strong", { children: e.operation.replaceAll("_", " ") }),
										/* @__PURE__ */ (0, x.jsxs)("small", { children: [
											e.source_component_id.replaceAll("_", " "),
											" → ",
											e.target_component_id.replaceAll("_", " ")
										] }),
										/* @__PURE__ */ (0, x.jsxs)("em", { children: [
											e.direction,
											" · ",
											e.status
										] })
									]
								}, e.seq))
							}),
							ie && /* @__PURE__ */ (0, x.jsxs)("div", {
								className: "correlation-inspector",
								children: [
									/* @__PURE__ */ (0, x.jsxs)("span", {
										className: "eyebrow",
										children: ["SELECTED MESSAGE · #", ie.seq]
									}),
									/* @__PURE__ */ (0, x.jsx)("strong", { children: ie.operation.replaceAll("_", " ") }),
									/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "From" }), /* @__PURE__ */ (0, x.jsx)("b", { children: ie.source_component_id.replaceAll("_", " ") })] }),
									/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "To" }), /* @__PURE__ */ (0, x.jsx)("b", { children: ie.target_component_id.replaceAll("_", " ") })] }),
									/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Direction" }), /* @__PURE__ */ (0, x.jsxs)("b", { children: [
										ie.direction,
										" · ",
										ie.status
									] })] }),
									/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Time" }), /* @__PURE__ */ (0, x.jsx)("b", { children: ie.timestamp_utc })] }),
									/* @__PURE__ */ (0, x.jsx)("pre", { children: JSON.stringify(ie.payload_summary || {}, null, 2) })
								]
							})
						]
					})]
				}),
				C === "finance" && /* @__PURE__ */ (0, x.jsx)(te, {
					currentCase: t,
					history: n,
					historyDetail: r
				}),
				C === "components" && /* @__PURE__ */ (0, x.jsxs)("div", {
					className: "evidence-component-layout",
					children: [/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "evidence-component-details",
						children: [c, l]
					}), /* @__PURE__ */ (0, x.jsxs)("section", {
						className: "surface evidence-component-link",
						children: [
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "eyebrow",
								children: "PERSISTED TRACE"
							}),
							/* @__PURE__ */ (0, x.jsxs)("h2", { children: [a?.length || 0, " component events"] }),
							/* @__PURE__ */ (0, x.jsx)("p", { children: "Open Investigation proof to filter and inspect the selected case events." }),
							/* @__PURE__ */ (0, x.jsx)("button", {
								type: "button",
								onClick: () => w("proof"),
								children: "Inspect event messages →"
							})
						]
					})]
				}),
				C === "questions" && /* @__PURE__ */ (0, x.jsx)(ne, {
					run: o,
					questions: s,
					requestedSeq: u?.section === "questions" ? u.stepSeq : null
				}),
				C === "implementation" && /* @__PURE__ */ (0, x.jsx)(re, {
					currentCase: t,
					events: a || i
				})
			]
		})]
	});
}
// src/ArchitectureQuestions.jsx
var ae = [
	{
		id: "S1",
		label: "S1 · Apigee route"
	},
	{
		id: "S2",
		label: "S2 · AgentCore route"
	},
	{
		id: "S3",
		label: "S3 · Combined candidate"
	}
];
function oe({ step: e, selected: t, processing: n, onSelect: r }) {
	return /* @__PURE__ */ (0, x.jsxs)("button", {
		type: "button",
		"data-seq": e.seq,
		className: `lab-node ${e.status} ${t ? "selected" : ""} ${n ? "processing" : ""}`,
		onClick: r,
		"aria-label": `Step ${e.seq}: ${e.component}, ${e.status}`,
		children: [
			/* @__PURE__ */ (0, x.jsxs)("small", { children: [
				String(e.seq).padStart(2, "0"),
				" · ",
				e.phase
			] }),
			/* @__PURE__ */ (0, x.jsx)("strong", { children: e.component }),
			/* @__PURE__ */ (0, x.jsx)("span", { children: e.status.toUpperCase() })
		]
	});
}
function se({ playbooks: e, question: t, initialRoute: n, onClose: r }) {
	let [i, a] = (0, b.useState)(n), [o, s] = (0, b.useState)(0), c = e[i], l = c?.steps?.[o];
	return (0, b.useEffect)(() => {
		let e = (e) => {
			e.key === "Escape" && r();
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [r]), /* @__PURE__ */ (0, x.jsx)("div", {
		className: "route-plan-backdrop",
		onMouseDown: (e) => {
			e.target === e.currentTarget && r();
		},
		children: /* @__PURE__ */ (0, x.jsxs)("section", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Gateway implementation plan",
			className: "route-plan-dialog",
			children: [
				/* @__PURE__ */ (0, x.jsxs)("header", { children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [
					/* @__PURE__ */ (0, x.jsx)("span", {
						className: "eyebrow",
						children: "ARCHITECTURE IMPLEMENTATION PLAN · CANDIDATE ONLY"
					}),
					/* @__PURE__ */ (0, x.jsx)("h2", { children: "What must be built and proved" }),
					/* @__PURE__ */ (0, x.jsx)("p", { children: "Choose a scenario and a handoff to inspect its configuration, dependency and acceptance proof." })
				] }), /* @__PURE__ */ (0, x.jsx)("button", {
					type: "button",
					onClick: r,
					"aria-label": "Close implementation plan",
					children: "Close ×"
				})] }),
				/* @__PURE__ */ (0, x.jsx)("nav", {
					className: "route-plan-tabs",
					"aria-label": "Gateway scenarios",
					children: ae.map((e) => /* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						className: i === e.id ? "active" : "",
						onClick: () => {
							a(e.id), s(0);
						},
						"aria-pressed": i === e.id,
						children: e.label
					}, e.id))
				}),
				c ? /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "route-plan-summary",
						children: [
							/* @__PURE__ */ (0, x.jsx)("strong", { children: c.title }),
							/* @__PURE__ */ (0, x.jsx)("span", { children: c.status }),
							/* @__PURE__ */ (0, x.jsx)("p", { children: c.path }),
							/* @__PURE__ */ (0, x.jsxs)("small", { children: [
								/* @__PURE__ */ (0, x.jsx)("b", { children: "Hosting:" }),
								" ",
								c.hosting
							] })
						]
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "route-plan-body",
						children: [
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "route-plan-sequence",
								children: [/* @__PURE__ */ (0, x.jsx)("h3", { children: "Build sequence" }), c.steps.map((e, t) => /* @__PURE__ */ (0, x.jsxs)("button", {
									type: "button",
									className: o === t ? "active" : "",
									onClick: () => s(t),
									"aria-pressed": o === t,
									children: [
										/* @__PURE__ */ (0, x.jsx)("em", { children: String(t + 1).padStart(2, "0") }),
										/* @__PURE__ */ (0, x.jsx)("span", { children: e.handoff }),
										/* @__PURE__ */ (0, x.jsx)("b", {
											"aria-hidden": "true",
											children: "›"
										})
									]
								}, e.handoff))]
							}),
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "route-plan-detail",
								children: [
									/* @__PURE__ */ (0, x.jsxs)("span", {
										className: "eyebrow",
										children: [
											"HANDOFF ",
											o + 1,
											" OF ",
											c.steps.length
										]
									}),
									/* @__PURE__ */ (0, x.jsx)("h3", { children: l?.handoff }),
									/* @__PURE__ */ (0, x.jsxs)("dl", { children: [
										/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("dt", { children: "Configure" }), /* @__PURE__ */ (0, x.jsx)("dd", { children: l?.configure })] }),
										/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("dt", { children: "Depends on" }), /* @__PURE__ */ (0, x.jsx)("dd", { children: l?.dependency })] }),
										/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("dt", { children: "Proof to accept" }), /* @__PURE__ */ (0, x.jsx)("dd", { children: l?.proof })] }),
										/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("dt", { children: "Accountable team" }), /* @__PURE__ */ (0, x.jsx)("dd", { children: l?.owner })] })
									] })
								]
							}),
							/* @__PURE__ */ (0, x.jsxs)("aside", {
								className: "route-plan-decisions",
								children: [
									/* @__PURE__ */ (0, x.jsx)("h3", { children: "Open decisions for this route" }),
									/* @__PURE__ */ (0, x.jsx)("ol", { children: c.decisions.map((e) => /* @__PURE__ */ (0, x.jsx)("li", { children: e }, e)) }),
									t && /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [
										/* @__PURE__ */ (0, x.jsxs)("h3", { children: ["For this question: ", t.title] }),
										/* @__PURE__ */ (0, x.jsx)("ul", { children: (t.dependencies || []).map((e) => /* @__PURE__ */ (0, x.jsx)("li", { children: e }, e)) }),
										/* @__PURE__ */ (0, x.jsxs)("strong", { children: ["Next: ", t.next_action] })
									] })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, x.jsxs)("footer", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Reference designs only. Hosting, credentials, identity and SAP authorization require tenant proof and owner approval." }), /* @__PURE__ */ (0, x.jsx)("div", { children: c.sources.map((e) => /* @__PURE__ */ (0, x.jsxs)("a", {
						href: e.url,
						target: "_blank",
						rel: "noreferrer",
						children: [e.label, " ↗"]
					}, e.url)) })] })
				] }) : /* @__PURE__ */ (0, x.jsx)("p", {
					className: "empty-inline",
					children: "No route plan is available."
				})
			]
		})
	});
}
function ce({ questions: e = [], routePlaybooks: t = {}, focus: n, run: r, onRun: i, busy: a, onOpenEvidence: o }) {
	let [s, c] = (0, b.useState)(r?.question_id || null), [l, u] = (0, b.useState)(r?.route || "S3"), [d, f] = (0, b.useState)(r?.probe || ""), [p, m] = (0, b.useState)(null), [h, g] = (0, b.useState)(!0), [_, v] = (0, b.useState)(!1), y = (0, b.useRef)(null), S = e.find((e) => e.id === s), C = r?.question_id === s ? r : null, w = C?.steps || [], T = w.filter((e) => e.phase === "design-time"), ee = w.filter((e) => e.phase !== "design-time"), E = w.find((e) => e.seq === p) || w.at(-1), D = w.findIndex((e) => e.seq === E?.seq);
	(0, b.useEffect)(() => {
		w.length && (h || p === null || !w.some((e) => e.seq === p)) && m(w.at(-1).seq);
	}, [
		C?.run_id,
		w.length,
		h
	]), (0, b.useEffect)(() => {
		C?.status === "complete" && h && w.length && (m(w[0].seq), g(!1));
	}, [
		C?.run_id,
		C?.status,
		w.length,
		h
	]), (0, b.useEffect)(() => {
		if (!n?.id || n.nonce === y.current) return;
		let t = e.find((e) => e.id === n.id);
		t && (y.current = n.nonce, te(t));
	}, [n?.nonce, e]);
	function te(e) {
		let t = e.default_route || "S3", n = e.probes[0].id;
		c(e.id), u(t), f(n), m(null), g(!0), i(e.id, t, n);
	}
	function ne() {
		S && (m(null), g(!0), i(S.id, l, d));
	}
	function O(e) {
		let t = w[D + e];
		t && (m(t.seq), g(!1));
	}
	return /* @__PURE__ */ (0, x.jsxs)("main", {
		className: "question-lab",
		"aria-label": "Architecture questions",
		children: [
			/* @__PURE__ */ (0, x.jsxs)("aside", {
				className: "surface question-rail",
				children: [
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "section-heading",
						children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
							className: "eyebrow",
							children: "ARCHITECTURE ALIGNMENT"
						}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "Open questions" })] }), /* @__PURE__ */ (0, x.jsx)("span", {
							className: "pill simulated",
							children: "6 decisions"
						})]
					}),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "lab-intro",
						children: "Select a question to run a synthetic component path. Each result remains an open architecture decision."
					}),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "question-list",
						children: e.map((e, t) => /* @__PURE__ */ (0, x.jsxs)("button", {
							type: "button",
							className: `question-card ${s === e.id ? "selected" : ""}`,
							onClick: () => te(e),
							"aria-pressed": s === e.id,
							children: [
								/* @__PURE__ */ (0, x.jsxs)("span", { children: [
									"Q",
									t + 1,
									" · OPEN"
								] }),
								/* @__PURE__ */ (0, x.jsx)("strong", { children: e.title }),
								/* @__PURE__ */ (0, x.jsx)("small", { children: e.summary })
							]
						}, e.id))
					}),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "lab-footnote",
						children: "S1 and S2 are simulated alternatives. S3 tests a proposed external agent → AgentCore Gateway → SAP Apigee path; approval remains open."
					})
				]
			}),
			/* @__PURE__ */ (0, x.jsxs)("section", {
				className: "lab-center",
				children: [
					/* @__PURE__ */ (0, x.jsxs)("section", {
						className: "surface lab-command",
						children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "eyebrow",
								children: "EXTERNAL AGENT / SAP ALIGNMENT PROBE"
							}),
							/* @__PURE__ */ (0, x.jsx)("h2", { children: S?.title || "Choose an architecture question" }),
							/* @__PURE__ */ (0, x.jsx)("p", { children: S?.summary || "Run a question to inspect the propagated request and response at each component." })
						] }), S && /* @__PURE__ */ (0, x.jsxs)("div", {
							className: "lab-controls",
							children: [
								/* @__PURE__ */ (0, x.jsxs)("label", { children: ["Route", /* @__PURE__ */ (0, x.jsx)("select", {
									"aria-label": "Architecture route",
									value: l,
									onChange: (e) => u(e.target.value),
									children: ae.map((e) => /* @__PURE__ */ (0, x.jsx)("option", {
										value: e.id,
										children: e.label
									}, e.id))
								})] }),
								/* @__PURE__ */ (0, x.jsxs)("label", { children: ["Probe", /* @__PURE__ */ (0, x.jsx)("select", {
									"aria-label": "Architecture probe",
									value: d,
									onChange: (e) => f(e.target.value),
									children: S.probes.map((e) => /* @__PURE__ */ (0, x.jsx)("option", {
										value: e.id,
										children: e.label
									}, e.id))
								})] }),
								/* @__PURE__ */ (0, x.jsx)("button", {
									type: "button",
									className: "primary",
									onClick: ne,
									disabled: a,
									children: a ? "Running…" : "Run selected probe"
								}),
								/* @__PURE__ */ (0, x.jsx)("button", {
									type: "button",
									className: "route-plan-open",
									onClick: () => v(!0),
									children: "Hosting & dependencies →"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, x.jsxs)("section", {
						className: "surface lab-flow-panel",
						children: [/* @__PURE__ */ (0, x.jsxs)("div", {
							className: "section-heading",
							children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
								className: "eyebrow",
								children: "COMPONENT HANDOFFS"
							}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "Propagated flow" })] }), /* @__PURE__ */ (0, x.jsxs)("div", {
								className: "lab-step-nav",
								children: [
									/* @__PURE__ */ (0, x.jsx)("button", {
										type: "button",
										onClick: () => O(-1),
										disabled: D <= 0,
										"aria-label": "Previous handoff",
										children: "←"
									}),
									/* @__PURE__ */ (0, x.jsx)("span", { children: E ? `${E.seq}/${C.total_steps}` : "—" }),
									/* @__PURE__ */ (0, x.jsx)("button", {
										type: "button",
										onClick: () => O(1),
										disabled: D < 0 || D >= w.length - 1,
										"aria-label": "Next handoff",
										children: "→"
									}),
									/* @__PURE__ */ (0, x.jsx)("span", {
										className: `pill ${C?.outcome === "DENIED" ? "warn" : "quiet"}`,
										children: C ? `${w.length}/${C.total_steps} steps · ${C.status}` : "Awaiting question"
									})
								]
							})]
						}), C ? /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "lab-route-note",
								children: [
									/* @__PURE__ */ (0, x.jsx)("strong", { children: C.route_label }),
									/* @__PURE__ */ (0, x.jsx)("span", { children: C.route_status }),
									/* @__PURE__ */ (0, x.jsx)("span", { children: C.outcome })
								]
							}),
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "lab-design-branch",
								children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "DESIGN-TIME PREREQUISITE · NOT A RUNTIME HOP" }), T.map((e) => /* @__PURE__ */ (0, x.jsx)(oe, {
									step: e,
									selected: E?.seq === e.seq,
									processing: C.status === "running" && e.seq === w.at(-1)?.seq,
									onSelect: () => {
										m(e.seq), g(!1);
									}
								}, e.seq))]
							}),
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "lab-flow",
								"aria-label": "Architecture runtime call path",
								children: [
									/* @__PURE__ */ (0, x.jsx)("span", {
										className: "lab-flow-caption",
										children: "RUNTIME CALL PATH · LEFT TO RIGHT, THEN NEXT ROW"
									}),
									ee.map((e) => /* @__PURE__ */ (0, x.jsx)(oe, {
										step: e,
										selected: E?.seq === e.seq,
										processing: C.status === "running" && e.seq === w.at(-1)?.seq,
										onSelect: () => {
											m(e.seq), g(!1);
										}
									}, e.seq)),
									C.status === "running" && /* @__PURE__ */ (0, x.jsx)("div", {
										className: "lab-pending",
										"aria-live": "polite",
										children: "Evaluating next handoff…"
									})
								]
							})
						] }) : /* @__PURE__ */ (0, x.jsx)("div", {
							className: "empty-inline",
							children: "Click an open question to generate its route and control trace."
						})]
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "lab-evidence-link",
						children: [/* @__PURE__ */ (0, x.jsx)("span", { children: E ? `Selected handoff · ${E.component}` : "Select a question to trace its route" }), /* @__PURE__ */ (0, x.jsx)("button", {
							type: "button",
							onClick: () => o?.(E?.seq),
							disabled: !C,
							children: "Inspect handoff details in Evidence →"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, x.jsxs)("aside", {
				className: "surface lab-decision",
				children: [/* @__PURE__ */ (0, x.jsx)("div", {
					className: "section-heading",
					children: /* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
						className: "eyebrow",
						children: "MEETING DECISION RECORD"
					}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "Required alignment" })] })
				}), S ? /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "lab-position",
						children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Discussion baseline · not approved policy" }), /* @__PURE__ */ (0, x.jsx)("p", { children: S.current_position })]
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "lab-decision-question",
						children: [
							/* @__PURE__ */ (0, x.jsx)("span", { children: "Decision to resolve" }),
							/* @__PURE__ */ (0, x.jsx)("strong", { children: S.decision }),
							/* @__PURE__ */ (0, x.jsxs)("small", { children: ["Owner · ", S.owner] })
						]
					}),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "lab-open-status",
						children: "OPEN · No policy or tenant approval is asserted by this simulator."
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "lab-next-action",
						children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Next action" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: S.next_action })]
					}),
					/* @__PURE__ */ (0, x.jsx)("h3", { children: "Proof required to close" }),
					/* @__PURE__ */ (0, x.jsx)("ul", {
						className: "lab-gates",
						children: S.gates.map((e) => /* @__PURE__ */ (0, x.jsx)("li", { children: e }, e))
					}),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "lab-decision-hint",
						children: "Detailed handoff records and the synthetic decision packet are in Evidence & correlation."
					}),
					/* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						className: "lab-export",
						onClick: () => o?.(E?.seq),
						children: "Open decision evidence →"
					})
				] }) : /* @__PURE__ */ (0, x.jsx)("p", {
					className: "empty-inline",
					children: "Select an open question to see its decision owner and required architecture alignment. Control details are in Evidence."
				})]
			}),
			_ && /* @__PURE__ */ (0, x.jsx)(se, {
				playbooks: t,
				question: S,
				initialRoute: l,
				onClose: () => v(!1)
			})
		]
	});
}
// src/HostingPriority.jsx
var le = [
	{
		id: "agentcore",
		name: "Approved enterprise agent platform",
		priority: "NOW · leading validation candidate",
		host: "AgentCore Runtime if the AWS landing zone and service are approved",
		model: "Approved model endpoint; normally Bedrock unless policy requires another provider",
		owner: "Enterprise AI + AWS platform; SAP retains tool/API and backend authorization",
		fit: "Reuse a managed runtime and existing operating team for a portfolio of agents.",
		gates: "Landing zone, Region, entitlement, workload identity, private egress, quotas, durable state, recovery and SAP authorization.",
		source: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-vs-runtime.html"
	},
	{
		id: "btp",
		name: "SAP BTP pro-code agent",
		priority: "CONDITIONAL · SAP-owned alternative",
		host: "Python application on BTP Cloud Foundry; Kyma only when a container topology is needed",
		model: "SAP AI Core generative AI hub if approved and entitled",
		owner: "SAP BTP application team + SAP AI Core + SAP Integration",
		fit: "Keeps an SAP-owned agent portfolio close to existing BTP identity and integration services.",
		gates: "Cloud Foundry quota, AI Core/hub entitlement, agent framework, checkpoints, approvals, monitoring, CI/CD and funded on-call owner.",
		source: "https://architecture.learning.sap.com/docs/golden-path/ai-golden-path/build-and-deliver/build-ai-agents"
	},
	{
		id: "microsoft",
		name: "Microsoft Foundry hosted agent",
		priority: "CONDITIONAL · enterprise standard check",
		host: "Foundry hosted agent service only if an approved Azure project and region exist",
		model: "Foundry model catalog under enterprise policy",
		owner: "Enterprise AI + Azure platform; SAP retains Apigee and backend controls",
		fit: "Compare when the enterprise already operates Microsoft Foundry for agents.",
		gates: "Confirm this is the actual enterprise platform; an internal AI Foundry registry alone proves no Azure hosting. Verify service availability, network, identity and commercial terms.",
		source: "https://learn.microsoft.com/azure/foundry/agents/concepts/hosted-agents"
	},
	{
		id: "joule",
		name: "Managed Joule Studio",
		priority: "LATER · eligibility unresolved",
		host: "SAP-managed agent runtime if the tenant and commercial path are eligible",
		model: "SAP-managed model access subject to the applicable service contract",
		owner: "SAP platform + business process owner",
		fit: "Strategic SAP-managed path for eligible scenarios, not an executable near-term assumption.",
		gates: "The user reports Joule Studio unavailable. Obtain an exact SKU, provisioning, tenant and integration applicability decision without changing the current setup.",
		source: "https://help.sap.com/docs/joule-studio/joule-studio/sap-managed-provisioning-for-joule-studio?ai=true&version=CLOUD"
	}
], ue = {
	label: "Finance user",
	owner: "Experience",
	detail: "Fiori-style reconciliation request",
	out: "business intent",
	type: "ux"
}, de = {
	label: "SAP Integration Suite",
	owner: "SAP Integration",
	detail: "Approved API and iFlow mapping",
	out: "backend read",
	type: "sap"
}, fe = {
	label: "Cloud Connector",
	owner: "SAP connectivity",
	detail: "Controlled route to SAP landscape",
	out: "authorized call",
	type: "sap"
}, pe = {
	label: "SAP finance backend",
	owner: "SAP Security + FI",
	detail: "S/4HANA and Central Finance role checks",
	out: "finance evidence",
	type: "sap"
}, k = {
	S1: {
		title: "S1 · Direct SAP Apigee MCP",
		status: "SAP domain baseline · direct access open",
		stages: [
			ue,
			{
				label: "External finance agent",
				owner: "Approved agent runtime",
				detail: "AgentCore Runtime in demo; other host needs approval",
				out: "MCP tool call",
				type: "agent"
			},
			{
				label: "SAP Apigee MCP",
				owner: "SAP domain",
				detail: "Finance tools, policy and credential check",
				out: "typed SAP request",
				type: "gateway"
			},
			de,
			fe,
			pe
		],
		returnFlow: "SAP evidence and correlation ID → Apigee tool response → agent reconciliation → business report",
		controls: [
			["Agent host", "Separate runtime approval; Apigee is not the agent host."],
			["Identity", "Prove caller or scoped service identity through SAP roles."],
			["Catalog", "SAP owns tool contract; enterprise registry onboarding is open."],
			["Model + audit", "Approved model endpoint and case-level trace correlation."]
		],
		decision: "Direct agent access policy, runtime ownership and SAP principal proof remain open.",
		source: "https://architecture.learning.sap.com/docs/golden-path/ai-golden-path/build-and-deliver/build-ai-agents"
	},
	S2: {
		title: "S2 · AgentCore-hosted SAP finance MCP",
		status: "AWS hosting alternative · approval open",
		stages: [
			ue,
			{
				label: "External finance agent",
				owner: "AgentCore Runtime",
				detail: "Custom orchestration and approved model client",
				out: "MCP tool call",
				type: "agent"
			},
			{
				label: "AgentCore Gateway",
				owner: "AI Foundry",
				detail: "Inbound auth and MCP tool aggregation",
				out: "MCP-server target",
				type: "gateway"
			},
			{
				label: "SAP finance MCP adapter",
				owner: "AgentCore Runtime + SAP contract",
				detail: "Hosted tool facade; SAP owns semantics",
				out: "typed finance API",
				type: "gateway"
			},
			de,
			fe,
			pe
		],
		returnFlow: "SAP evidence → hosted MCP adapter → Gateway → agent reconciliation → business report",
		controls: [
			["Target mode", "MCP-server target; Runtime passthrough is a different non-MCP design."],
			["Identity", "Gateway inbound and outbound identity; final SAP role check."],
			["Catalog", "Listing mode and target synchronization need ownership."],
			["Model + audit", "PTP/PAP contract and AWS-to-SAP trace correlation."]
		],
		decision: "AWS hosting, gateway target mode, outbound credential and SAP API ownership need approval.",
		source: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-MCPservers.html"
	},
	S3: {
		title: "S3 · AgentCore Gateway to SAP Apigee MCP",
		status: "Federated candidate · not approved",
		stages: [
			ue,
			{
				label: "External finance agent",
				owner: "Approved runtime",
				detail: "AgentCore Runtime in demo; external host to assess",
				out: "MCP tool call",
				type: "agent"
			},
			{
				label: "AgentCore Gateway",
				owner: "AI Foundry",
				detail: "Agent-facing auth and target catalog",
				out: "authorized target call",
				type: "gateway"
			},
			{
				label: "SAP Apigee MCP",
				owner: "SAP domain",
				detail: "SAP-facing tools, policy and routing",
				out: "typed SAP request",
				type: "gateway"
			},
			de,
			fe,
			pe
		],
		returnFlow: "SAP evidence → Apigee MCP → AgentCore Gateway → agent reconciliation → business report",
		controls: [
			["Gateway target", "External Apigee MCP URL, protocol, egress and listing mode."],
			["Identity", "Prove user or service identity across both gateways and SAP."],
			["Control split", "Agree policy precedence, credentials and catalog synchronization."],
			["Audit", "Correlate Gateway, Apigee, iFlow and backend events."]
		],
		decision: "Federated hosting policy, cross-gateway controls and end-to-end principal propagation are unapproved.",
		source: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-MCPservers.html"
	}
}, me = {
	agentcore: {
		title: "AgentCore Runtime · agent hosting",
		status: "Leading validation candidate · conditional",
		stages: [
			ue,
			{
				label: "Custom finance agent",
				owner: "AgentCore Runtime",
				detail: "Orchestration, tool choice and recovery",
				out: "approved tool call",
				type: "agent"
			},
			{
				label: "Selected MCP route",
				owner: "S1, S2 or S3 decision",
				detail: "Gateway and domain tool path still to approve",
				out: "SAP finance tool",
				type: "gateway"
			},
			de,
			fe,
			pe
		],
		returnFlow: "SAP evidence → selected MCP route → AgentCore agent → finance result",
		controls: [
			["Model access", "Bedrock or approved PTP/PAP endpoint; separate contract."],
			["Identity", "AgentCore workload identity, tool credential and SAP principal strategy."],
			["Operations", "Region, quotas, private egress, durable state and recovery."],
			["Governance", "Registry, tool versioning, evaluation, audit and on-call owner."]
		],
		decision: "Landing zone, entitlement and SAP identity path must pass tenant proof.",
		source: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-vs-runtime.html"
	},
	btp: {
		title: "SAP BTP pro-code · agent hosting",
		status: "SAP-owned alternative · conditional",
		stages: [
			ue,
			{
				label: "Python finance agent",
				owner: "BTP Cloud Foundry",
				detail: "Kyma only for justified container need",
				out: "approved tool call",
				type: "agent"
			},
			{
				label: "Selected MCP route",
				owner: "SAP domain + AI Foundry",
				detail: "Apigee direct or federated path to decide",
				out: "SAP finance tool",
				type: "gateway"
			},
			de,
			fe,
			pe
		],
		returnFlow: "SAP evidence → MCP tool → BTP agent → finance result",
		controls: [
			["Model access", "SAP AI Core generative AI hub if entitled and approved."],
			["Identity", "BTP workload/destination identity and final SAP authorization."],
			["Operations", "Quota, state, checkpoints, CI/CD, monitoring and support owner."],
			["Governance", "Agent registration and tool lifecycle under enterprise policy."]
		],
		decision: "BTP and AI Core entitlement, operating team and approved gateway route remain open.",
		source: "https://architecture.learning.sap.com/docs/golden-path/ai-golden-path/build-and-deliver/build-ai-agents"
	},
	microsoft: {
		title: "Microsoft Foundry · agent hosting",
		status: "Enterprise-standard check · conditional",
		stages: [
			ue,
			{
				label: "Hosted finance agent",
				owner: "Microsoft Foundry",
				detail: "Custom agent container and Entra agent identity",
				out: "approved tool call",
				type: "agent"
			},
			{
				label: "Selected MCP route",
				owner: "Enterprise AI + SAP",
				detail: "Apigee or Gateway interop to prove",
				out: "SAP finance tool",
				type: "gateway"
			},
			de,
			fe,
			pe
		],
		returnFlow: "SAP evidence → selected MCP route → Foundry agent → finance result",
		controls: [
			["Model access", "Foundry model catalog subject to enterprise policy."],
			["Identity", "Entra agent identity, outbound tool credential and SAP role."],
			["Operations", "Approved Azure region, network, image, state and support."],
			["Governance", "Confirm actual enterprise platform; registry name is not hosting."]
		],
		decision: "Azure project, service availability, network route and commercial approval remain open.",
		source: "https://learn.microsoft.com/azure/foundry/agents/concepts/hosted-agents"
	},
	joule: {
		title: "Joule Studio · agent hosting",
		status: "Later candidate · tenant eligibility unresolved",
		stages: [
			{
				label: "Finance user",
				owner: "Fiori / Joule UX",
				detail: "Approved SAP experience",
				out: "business intent",
				type: "ux"
			},
			{
				label: "Managed finance agent",
				owner: "Joule Studio if enabled",
				detail: "SAP-managed design and runtime",
				out: "approved tool action",
				type: "agent"
			},
			{
				label: "SAP tool binding",
				owner: "SAP platform + Integration",
				detail: "MCP or native tool route must be selected",
				out: "finance API",
				type: "gateway"
			},
			de,
			fe,
			pe
		],
		returnFlow: "SAP evidence → approved tool binding → Joule agent → finance result",
		controls: [
			["Eligibility", "Tenant, SKU, provisioning and commercial access are unresolved."],
			["Model access", "SAP-managed model path subject to service terms."],
			["Identity", "Prove delegated or approved service principal at SAP backend."],
			["Operations", "Approval, audit, state, recovery and support ownership."]
		],
		decision: "Joule Studio is reported unavailable; no executable tenant path is assumed.",
		source: "https://architecture.learning.sap.com/docs/golden-path/ai-golden-path/build-and-deliver/build-ai-agents"
	}
};
function he({ kind: e, id: t, onClose: n, onDetails: r }) {
	let i = (e === "mcp" ? k : me)[t];
	return (0, b.useEffect)(() => {
		let e = (e) => {
			e.key === "Escape" && n();
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [n]), i ? /* @__PURE__ */ (0, x.jsx)("div", {
		className: "arch-diagram-backdrop",
		onMouseDown: (e) => {
			e.target === e.currentTarget && n();
		},
		children: /* @__PURE__ */ (0, x.jsxs)("section", {
			className: "surface arch-diagram-modal",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": `${i.title} architecture diagram`,
			children: [
				/* @__PURE__ */ (0, x.jsxs)("header", {
					className: "arch-diagram-header",
					children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsxs)("span", {
						className: "eyebrow",
						children: ["ARCHITECTURE DIAGRAM · ", e === "mcp" ? "MCP HOSTING PATH" : "AGENT HOSTING PATH"]
					}), /* @__PURE__ */ (0, x.jsx)("h2", { children: i.title })] }), /* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
						className: "pill warn",
						children: i.status
					}), /* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: n,
						autoFocus: !0,
						children: "Close"
					})] })]
				}),
				/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "arch-diagram-canvas",
					children: [
						/* @__PURE__ */ (0, x.jsxs)("div", {
							className: "arch-diagram-boundary",
							children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: "Request and tool call" }), /* @__PURE__ */ (0, x.jsx)("span", { children: "Left to right · proposed component path" })]
						}),
						/* @__PURE__ */ (0, x.jsx)("div", {
							className: "arch-diagram-flow",
							children: i.stages.map((e, t) => /* @__PURE__ */ (0, x.jsxs)(b.Fragment, { children: [t > 0 && /* @__PURE__ */ (0, x.jsx)("span", {
								className: "arch-diagram-arrow",
								"aria-hidden": "true",
								children: "→"
							}), /* @__PURE__ */ (0, x.jsxs)("article", {
								className: `arch-diagram-node ${e.type}`,
								children: [
									/* @__PURE__ */ (0, x.jsxs)("span", { children: [
										String(t + 1).padStart(2, "0"),
										" · ",
										e.owner
									] }),
									/* @__PURE__ */ (0, x.jsx)("h3", { children: e.label }),
									/* @__PURE__ */ (0, x.jsx)("p", { children: e.detail }),
									/* @__PURE__ */ (0, x.jsxs)("small", { children: ["Out: ", e.out] })
								]
							})] }, `${e.label}-${t}`))
						}),
						/* @__PURE__ */ (0, x.jsxs)("div", {
							className: "arch-diagram-return",
							children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: "← Evidence and response" }), /* @__PURE__ */ (0, x.jsx)("span", { children: i.returnFlow })]
						}),
						/* @__PURE__ */ (0, x.jsxs)("div", {
							className: "arch-diagram-controls",
							children: [/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "arch-diagram-control-heading",
								children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: "Cross-cutting controls" }), /* @__PURE__ */ (0, x.jsx)("span", { children: "These are design dependencies, not proved connections." })]
							}), i.controls.map(([e, t]) => /* @__PURE__ */ (0, x.jsxs)("article", { children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: e }), /* @__PURE__ */ (0, x.jsx)("span", { children: t })] }, e))]
						})
					]
				}),
				/* @__PURE__ */ (0, x.jsxs)("footer", {
					className: "arch-diagram-footer",
					children: [/* @__PURE__ */ (0, x.jsxs)("p", { children: [
						/* @__PURE__ */ (0, x.jsx)("strong", { children: "Open decision:" }),
						" ",
						i.decision
					] }), /* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("a", {
						href: i.source,
						target: "_blank",
						rel: "noreferrer",
						children: "Vendor reference ↗"
					}), r && /* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: r,
						children: "View detailed prerequisites →"
					})] })]
				})
			]
		})
	}) : null;
}
// src/McpApproaches.jsx
var ge = {
	S1: {
		name: "SAP Apigee MCP · direct agent access",
		position: "SAP domain baseline · direct access policy open",
		host: "Demo: AgentCore Runtime hosts the finance agent. Without AWS, host the Python agent on approved SAP BTP Cloud Foundry, Kyma, or another enterprise runtime; the agent is the MCP client. Apigee hosts the MCP endpoint, not the agent. PTP/PAP model access is a separate dependency unless it also provides an approved agent runtime.",
		benefits: ["Fewest gateway boundaries if direct Apigee access is permitted.", "SAP Integration keeps its selected Apigee domain capability."],
		tradeoffs: ["Every external agent needs approved onboarding and tool policy at Apigee.", "The agent host, model endpoint and SAP principal path still need owners."],
		criteria: [
			[
				"Simplicity",
				"Favorable",
				"One gateway; the custom agent still requires its own runtime."
			],
			[
				"Cost efficiency",
				"Potentially favorable",
				"Depends on existing Apigee entitlement, chosen agent runtime and call volume; no measured TCO."
			],
			[
				"Maintainability",
				"Favorable if SAP owns the facade",
				"Keep a versioned tool contract and a single SAP-facing policy owner."
			],
			[
				"Future flexibility",
				"Conditional",
				"Multiple agents can use the domain endpoint if onboarding, discovery and access policy scale."
			]
		],
		agentcore: "AgentCore Gateway is absent. In the demo, AgentCore Runtime hosts the agent and calls Apigee directly. An AWS-free implementation substitutes an approved agent runtime and must configure its MCP client identity, egress and model access.",
		sap: "SAP Integration publishes versioned finance APIs as Apigee MCP tools and maps each tool to Integration Suite and the authorized SAP backend."
	},
	S2: {
		name: "AgentCore-hosted SAP finance MCP",
		position: "AWS hosting alternative · approval open",
		host: "Host the custom finance agent and SAP finance MCP adapter as separately governed AgentCore Runtime workloads. The agent calls AgentCore Gateway, which calls the adapter. Model access through PTP/PAP remains a separately approved contract.",
		benefits: ["AI Foundry can own agent runtime and central gateway access.", "SAP can retain the finance tool/API contract while AWS hosts the adapter."],
		tradeoffs: ["SAP MCP operations move from the selected Apigee direction into AWS.", "Catalog synchronization, outbound identity and SAP API ownership need agreement."],
		criteria: [
			[
				"Simplicity",
				"Moderate",
				"Agent workload, Gateway and a separate MCP adapter must be operated."
			],
			[
				"Cost efficiency",
				"Unproven",
				"Runtime, Gateway, networking and SAP API costs need a 12-month estimate."
			],
			[
				"Maintainability",
				"Shared ownership",
				"AI Foundry operates AWS workloads; SAP owns tool semantics and backend authorization."
			],
			[
				"Future flexibility",
				"Conditional",
				"The selected MCP-server target can feed the central catalog if schemas and synchronization are governed."
			]
		],
		agentcore: "AI Foundry would host the finance MCP adapter on AgentCore Runtime and register it with Gateway. Use an MCP-protocol Gateway with the adapter registered as an MCP-server target; configure inbound agent authorization, outbound credentials, listing mode, catalog synchronization and bypass controls.",
		sap: "SAP Integration owns the finance tool/API contract, Integration Suite mapping, connectivity and SAP backend role enforcement; it returns typed finance evidence and correlation IDs."
	},
	S3: {
		name: "AgentCore Gateway → SAP Apigee MCP",
		position: "Federated candidate · not approved",
		host: "The agent still needs a runtime. The demo uses AgentCore Runtime; an approved external runtime could be assessed separately. AgentCore Gateway is a tool access layer, not the host of the custom agent. PTP/PAP model access remains independent.",
		benefits: ["SAP keeps its Apigee domain MCP endpoint while Foundry governs agent-facing tool access.", "A central tool catalog is possible if the Gateway MCP target is synchronized."],
		tradeoffs: ["Two gateway owners must coordinate credentials, policies, versioning and incidents.", "Added latency and total cost are plausible but must be measured."],
		criteria: [
			[
				"Simplicity",
				"Least favorable",
				"Two gateways and cross-cloud handoffs need one agreed control map."
			],
			[
				"Cost efficiency",
				"Likely highest incremental, unproven",
				"Retains Apigee and adds Gateway usage and cross-cloud operations; contract and volume decide actual cost."
			],
			[
				"Maintainability",
				"Conditional",
				"Requires catalog sync, clear deny precedence, shared trace IDs and incident ownership."
			],
			[
				"Future flexibility",
				"Potentially strongest",
				"Fits federated domain ownership if central onboarding is mandatory and the interop proof passes."
			]
		],
		agentcore: "Register the externally reachable Apigee HTTPS MCP URL as an MCP-server target. Configure supported protocol, inbound agent authorization, outbound OAuth or approved token exchange, listing mode, egress and catalog synchronization.",
		sap: "Publish and secure Apigee tools; map them to Integration Suite and backend APIs. Validate principal or scoped service identity, finance role and company/ledger authorization at the final SAP target."
	}
}, _e = [
	[
		"Agent host",
		"Demo: AgentCore Runtime; AWS-free host to decide",
		"AgentCore Runtime",
		"Demo: AgentCore Runtime; external host subject to review"
	],
	[
		"MCP host",
		"SAP Apigee",
		"SAP finance MCP adapter on AgentCore Runtime",
		"SAP Apigee behind AgentCore Gateway"
	],
	[
		"Agent entry",
		"Apigee directly",
		"AgentCore Gateway",
		"AgentCore Gateway"
	],
	[
		"Tool catalog",
		"SAP-owned discovery",
		"MCP-server target aggregation + synchronization",
		"SAP version + Gateway discovery/sync"
	],
	[
		"Caller identity",
		"Agent host → Apigee → SAP",
		"AgentCore agent → Gateway → adapter → SAP",
		"Agent host → Gateway → Apigee → SAP"
	],
	[
		"SAP authorization",
		"Backend role and finance scope",
		"Backend role and finance scope",
		"Backend role and finance scope"
	],
	[
		"12-month TCO",
		"Unmeasured",
		"Unmeasured",
		"Unmeasured"
	],
	[
		"Approval state",
		"Direct-access policy open",
		"AWS hosting and target mode open",
		"Combined path open"
	]
], ve = [
	{
		id: "S1",
		agent: "AgentCore Runtime in demo; other approved host possible",
		mcp: "SAP Apigee",
		entry: "Direct to Apigee",
		state: "Direct-access policy open"
	},
	{
		id: "S2",
		agent: "AgentCore Runtime",
		mcp: "SAP MCP adapter on AgentCore Runtime",
		entry: "AgentCore Gateway",
		state: "AWS hosting approval open"
	},
	{
		id: "S3",
		agent: "AgentCore Runtime in demo; external host to review",
		mcp: "SAP Apigee behind AgentCore Gateway",
		entry: "AgentCore Gateway",
		state: "Combined path approval open"
	}
];
function ye({ playbooks: e = {}, onQuestion: t, onDetailedDiagram: n, onGovernance: r }) {
	let [i, a] = (0, b.useState)("S1"), [o, s] = (0, b.useState)(null), [c, l] = (0, b.useState)(null), u = i === "compare" ? null : i, d = u ? ge[u] : null, f = u ? e[u] : null, p = u ? ve.find((e) => e.id === u) : null, m = le.find((e) => e.id === o);
	(0, b.useEffect)(() => {
		if (!o) return;
		let e = (e) => {
			e.key === "Escape" && s(null);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [o]);
	let h = [
		..._e,
		...[
			"Simplicity",
			"Cost efficiency",
			"Maintainability",
			"Future flexibility"
		].map((e, t) => [e, ...[
			"S1",
			"S2",
			"S3"
		].map((e) => `${ge[e].criteria[t][1]} — ${ge[e].criteria[t][2]}`)]),
		["Benefits", ...[
			"S1",
			"S2",
			"S3"
		].map((e) => ge[e].benefits.join(" • "))],
		["Tradeoffs", ...[
			"S1",
			"S2",
			"S3"
		].map((e) => ge[e].tradeoffs.join(" • "))],
		["Open decisions", ...[
			"S1",
			"S2",
			"S3"
		].map((t) => (e[t]?.decisions || []).join(" • "))]
	];
	return /* @__PURE__ */ (0, x.jsxs)("main", {
		className: "mcp-comparison mcp-bird",
		"aria-label": "MCP architecture approaches",
		children: [
			/* @__PURE__ */ (0, x.jsxs)("header", {
				className: "surface mcp-bird-header",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
					className: "eyebrow",
					children: "ARCHITECTURE PROS & CONS"
				}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "MCP access and agent hosting" })] }), /* @__PURE__ */ (0, x.jsx)("span", {
					className: "pill warn",
					children: "SYNTHETIC DESIGN · DECISIONS OPEN"
				})]
			}),
			/* @__PURE__ */ (0, x.jsx)("nav", {
				className: "surface mcp-route-tabs mcp-bird-tabs",
				role: "tablist",
				"aria-label": "Architecture approach details",
				children: [
					"S1",
					"S2",
					"S3",
					"compare"
				].map((e) => /* @__PURE__ */ (0, x.jsxs)("button", {
					type: "button",
					role: "tab",
					"aria-selected": i === e,
					className: i === e ? "active" : "",
					onClick: () => a(e),
					children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: e === "compare" ? "Compare all" : e }), /* @__PURE__ */ (0, x.jsx)("span", { children: e === "compare" ? "MCP route comparison" : ge[e].name })]
				}, e))
			}),
			u ? /* @__PURE__ */ (0, x.jsxs)("section", {
				className: "surface mcp-bird-panel",
				role: "tabpanel",
				"aria-label": `${u} MCP overview`,
				children: [
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "mcp-bird-panel-title",
						children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsxs)("span", {
							className: "eyebrow",
							children: [
								"MCP ACCESS · ",
								u,
								" · ",
								d.position
							]
						}), /* @__PURE__ */ (0, x.jsx)("h3", { children: d.name })] }), /* @__PURE__ */ (0, x.jsxs)("div", {
							className: "mcp-bird-title-actions",
							children: [
								/* @__PURE__ */ (0, x.jsx)("button", {
									type: "button",
									className: "diagram-action",
									onClick: () => l({
										kind: "mcp",
										id: u
									}),
									children: "Architecture diagram ↗"
								}),
								n && (u === "S1" || u === "S2") && /* @__PURE__ */ (0, x.jsx)("button", {
									type: "button",
									className: "detailed-diagram-action",
									onClick: () => n(u),
									children: "Detailed diagram (zoom) →"
								}),
								r && /* @__PURE__ */ (0, x.jsx)("button", {
									type: "button",
									className: "detailed-diagram-action",
									onClick: () => r(u),
									children: "MCP hosting & governance →"
								}),
								/* @__PURE__ */ (0, x.jsx)("button", {
									type: "button",
									onClick: () => s("route"),
									children: "View handoffs and proof →"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "mcp-bird-path",
						"aria-label": "Selected request path",
						children: (f?.path || "").split(" → ").map((e, t) => /* @__PURE__ */ (0, x.jsxs)(b.Fragment, { children: [t > 0 && /* @__PURE__ */ (0, x.jsx)("span", {
							"aria-hidden": "true",
							children: "→"
						}), /* @__PURE__ */ (0, x.jsx)("b", { children: e })] }, e + t))
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "mcp-bird-facts",
						children: [
							/* @__PURE__ */ (0, x.jsxs)("article", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Agent runtime" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: p.agent })] }),
							/* @__PURE__ */ (0, x.jsxs)("article", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "MCP endpoint" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: p.mcp })] }),
							/* @__PURE__ */ (0, x.jsxs)("article", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Agent entry" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: p.entry })] }),
							/* @__PURE__ */ (0, x.jsxs)("article", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Open decision" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: p.state })] })
						]
					}),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "mcp-bird-scores",
						children: d.criteria.map(([e, t]) => /* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: e }), /* @__PURE__ */ (0, x.jsx)("strong", { children: t })] }, e))
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "mcp-bird-judgment",
						children: [/* @__PURE__ */ (0, x.jsxs)("p", { children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: "Benefit" }), d.benefits[0]] }), /* @__PURE__ */ (0, x.jsxs)("p", { children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: "Tradeoff" }), d.tradeoffs[0]] })]
					})
				]
			}) : /* @__PURE__ */ (0, x.jsxs)("section", {
				className: "surface mcp-bird-panel mcp-bird-compare",
				role: "tabpanel",
				"aria-label": "MCP route comparison overview",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "mcp-bird-panel-title",
					children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
						className: "eyebrow",
						children: "MCP ACCESS · SIDE BY SIDE"
					}), /* @__PURE__ */ (0, x.jsx)("h3", { children: "Three routes, one decision view" })] }), /* @__PURE__ */ (0, x.jsxs)("div", {
						className: "mcp-bird-title-actions",
						children: [n && /* @__PURE__ */ (0, x.jsx)("button", {
							type: "button",
							className: "detailed-diagram-action",
							onClick: () => n("compare"),
							children: "Compare S1 and S2 detailed diagrams →"
						}), /* @__PURE__ */ (0, x.jsx)("button", {
							type: "button",
							onClick: () => s("compare"),
							children: "View full control matrix →"
						})]
					})]
				}), /* @__PURE__ */ (0, x.jsx)("div", {
					className: "mcp-bird-compare-grid",
					children: ve.map((e) => {
						let t = ge[e.id];
						return /* @__PURE__ */ (0, x.jsxs)("article", { children: [
							/* @__PURE__ */ (0, x.jsxs)("h4", { children: [
								e.id,
								" · ",
								t.name
							] }),
							/* @__PURE__ */ (0, x.jsxs)("dl", { children: [
								/* @__PURE__ */ (0, x.jsx)("dt", { children: "MCP" }),
								/* @__PURE__ */ (0, x.jsx)("dd", { children: e.mcp }),
								/* @__PURE__ */ (0, x.jsx)("dt", { children: "Entry" }),
								/* @__PURE__ */ (0, x.jsx)("dd", { children: e.entry }),
								/* @__PURE__ */ (0, x.jsx)("dt", { children: "Simplicity" }),
								/* @__PURE__ */ (0, x.jsx)("dd", { children: t.criteria[0][1] }),
								/* @__PURE__ */ (0, x.jsx)("dt", { children: "Cost" }),
								/* @__PURE__ */ (0, x.jsx)("dd", { children: t.criteria[1][1] }),
								/* @__PURE__ */ (0, x.jsx)("dt", { children: "Maintenance" }),
								/* @__PURE__ */ (0, x.jsx)("dd", { children: t.criteria[2][1] })
							] }),
							/* @__PURE__ */ (0, x.jsx)("span", { children: e.state })
						] }, e.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, x.jsxs)("section", {
				className: "surface mcp-bird-hosting",
				"aria-label": "Agent hosting options",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "mcp-bird-hosting-heading",
					children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
						className: "eyebrow",
						children: "AGENT HOSTING · SEPARATE DECISION FROM MCP"
					}), /* @__PURE__ */ (0, x.jsx)("h3", { children: "Where the custom SAP finance agent could run" })] }), /* @__PURE__ */ (0, x.jsx)("p", { children: "Model access and SAP tool authorization need their own approval." })]
				}), /* @__PURE__ */ (0, x.jsx)("div", {
					className: "mcp-bird-host-grid",
					children: le.map((e) => /* @__PURE__ */ (0, x.jsxs)("button", {
						type: "button",
						onClick: () => l({
							kind: "hosting",
							id: e.id
						}),
						children: [
							/* @__PURE__ */ (0, x.jsx)("span", { children: e.priority }),
							/* @__PURE__ */ (0, x.jsx)("strong", { children: e.name }),
							/* @__PURE__ */ (0, x.jsx)("small", { children: e.fit }),
							/* @__PURE__ */ (0, x.jsx)("em", { children: "Architecture diagram ↗" })
						]
					}, e.id))
				})]
			}),
			c && /* @__PURE__ */ (0, x.jsx)(he, {
				kind: c.kind,
				id: c.id,
				onClose: () => l(null),
				onDetails: () => {
					s(c.kind === "mcp" ? "route" : c.id), l(null);
				}
			}),
			o && /* @__PURE__ */ (0, x.jsx)("div", {
				className: "mcp-bird-modal-backdrop",
				onMouseDown: (e) => {
					e.target === e.currentTarget && s(null);
				},
				children: /* @__PURE__ */ (0, x.jsxs)("section", {
					className: "surface mcp-bird-modal",
					role: "dialog",
					"aria-modal": "true",
					"aria-label": m ? `${m.name} hosting details` : o === "compare" ? "Full MCP control matrix" : `${u} architecture details`,
					children: [/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "mcp-bird-modal-header",
						children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
							className: "eyebrow",
							children: "ARCHITECTURE DETAIL · DESIGN REVIEW ONLY"
						}), /* @__PURE__ */ (0, x.jsx)("h3", { children: m ? m.name : o === "compare" ? "Full MCP control matrix" : `${u} · handoffs, owners and proof` })] }), /* @__PURE__ */ (0, x.jsx)("button", {
							type: "button",
							onClick: () => s(null),
							autoFocus: !0,
							children: "Close"
						})]
					}), /* @__PURE__ */ (0, x.jsx)("div", {
						className: "mcp-bird-modal-body",
						children: m ? /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [/* @__PURE__ */ (0, x.jsxs)("dl", {
							className: "mcp-bird-host-detail",
							children: [
								/* @__PURE__ */ (0, x.jsx)("dt", { children: "Priority" }),
								/* @__PURE__ */ (0, x.jsx)("dd", { children: m.priority }),
								/* @__PURE__ */ (0, x.jsx)("dt", { children: "Agent host" }),
								/* @__PURE__ */ (0, x.jsx)("dd", { children: m.host }),
								/* @__PURE__ */ (0, x.jsx)("dt", { children: "Model access" }),
								/* @__PURE__ */ (0, x.jsx)("dd", { children: m.model }),
								/* @__PURE__ */ (0, x.jsx)("dt", { children: "Operators" }),
								/* @__PURE__ */ (0, x.jsx)("dd", { children: m.owner }),
								/* @__PURE__ */ (0, x.jsx)("dt", { children: "Why assess" }),
								/* @__PURE__ */ (0, x.jsx)("dd", { children: m.fit }),
								/* @__PURE__ */ (0, x.jsx)("dt", { children: "Proof needed" }),
								/* @__PURE__ */ (0, x.jsx)("dd", { children: m.gates })
							]
						}), /* @__PURE__ */ (0, x.jsx)("a", {
							href: m.source,
							target: "_blank",
							rel: "noreferrer",
							children: "Official product reference ↗"
						})] }) : o === "compare" ? /* @__PURE__ */ (0, x.jsxs)("table", {
							className: "mcp-bird-full-table",
							children: [/* @__PURE__ */ (0, x.jsx)("thead", { children: /* @__PURE__ */ (0, x.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, x.jsx)("th", { children: "Control" }),
								/* @__PURE__ */ (0, x.jsx)("th", { children: "S1 · Direct Apigee" }),
								/* @__PURE__ */ (0, x.jsx)("th", { children: "S2 · AgentCore" }),
								/* @__PURE__ */ (0, x.jsx)("th", { children: "S3 · Federated" })
							] }) }), /* @__PURE__ */ (0, x.jsx)("tbody", { children: h.map((e) => /* @__PURE__ */ (0, x.jsxs)("tr", { children: [/* @__PURE__ */ (0, x.jsx)("th", {
								scope: "row",
								children: e[0]
							}), e.slice(1).map((e, t) => /* @__PURE__ */ (0, x.jsx)("td", { children: e }, t))] }, e[0])) })]
						}) : /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [
							/* @__PURE__ */ (0, x.jsxs)("p", { children: [
								/* @__PURE__ */ (0, x.jsx)("strong", { children: "Agent hosting:" }),
								" ",
								d.host
							] }),
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "mcp-bird-modal-owners",
								children: [/* @__PURE__ */ (0, x.jsxs)("article", { children: [/* @__PURE__ */ (0, x.jsx)("h4", { children: "AgentCore / AI Foundry" }), /* @__PURE__ */ (0, x.jsx)("p", { children: d.agentcore })] }), /* @__PURE__ */ (0, x.jsxs)("article", { children: [/* @__PURE__ */ (0, x.jsx)("h4", { children: "SAP / Apigee / Integration" }), /* @__PURE__ */ (0, x.jsx)("p", { children: d.sap })] })]
							}),
							/* @__PURE__ */ (0, x.jsx)("div", {
								className: "mcp-bird-modal-steps",
								children: f?.steps?.map((e, t) => /* @__PURE__ */ (0, x.jsxs)("article", { children: [
									/* @__PURE__ */ (0, x.jsxs)("h4", { children: [
										t + 1,
										". ",
										e.handoff
									] }),
									/* @__PURE__ */ (0, x.jsxs)("p", { children: [
										/* @__PURE__ */ (0, x.jsx)("strong", { children: "Owner:" }),
										" ",
										e.owner
									] }),
									/* @__PURE__ */ (0, x.jsxs)("p", { children: [
										/* @__PURE__ */ (0, x.jsx)("strong", { children: "Configure:" }),
										" ",
										e.configure
									] }),
									/* @__PURE__ */ (0, x.jsxs)("p", { children: [
										/* @__PURE__ */ (0, x.jsx)("strong", { children: "Depends on:" }),
										" ",
										e.dependency
									] }),
									/* @__PURE__ */ (0, x.jsxs)("p", { children: [
										/* @__PURE__ */ (0, x.jsx)("strong", { children: "Proof:" }),
										" ",
										e.proof
									] })
								] }, e.handoff))
							}),
							/* @__PURE__ */ (0, x.jsx)("h4", { children: "Open decisions" }),
							/* @__PURE__ */ (0, x.jsx)("ul", { children: f?.decisions?.map((e) => /* @__PURE__ */ (0, x.jsx)("li", { children: e }, e)) }),
							/* @__PURE__ */ (0, x.jsx)("button", {
								type: "button",
								className: "mcp-question-link",
								onClick: () => {
									s(null), t();
								},
								children: "Run related architecture questions →"
							})
						] })
					})]
				})
			})
		]
	});
}
// src/diagrams/s1.svg?raw
var be = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 840\" role=\"img\" aria-labelledby=\"t d\" font-family=\"'Segoe UI','Segoe UI Variable','Helvetica Neue',Arial,sans-serif\" text-rendering=\"geometricPrecision\" shape-rendering=\"geometricPrecision\"><title id=\"t\">S1 · Google Apigee MCP</title><desc id=\"d\">Detailed architecture diagram S1 · Google Apigee MCP converted from the supplied deck</desc><rect width=\"1200\" height=\"840\" fill=\"#F1F4F7\"/><rect x=\"0\" y=\"0\" width=\"1200\" height=\"840\" fill=\"#F1F4F7\" stroke=\"none\"/><rect x=\"0\" y=\"0\" width=\"1200\" height=\"58.24\" fill=\"#103C68\" stroke=\"none\"/><text x=\"20.93\" y=\"24.45\" font-size=\"12\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">AI FOUNDRY  /  MONTH-END RECONCILIATION</text><text x=\"21.63\" y=\"41.14\" font-size=\"6.97\" fill=\"#DCEBFA\" text-anchor=\"start\">L2  |  Worked reconciliation, identity and controls</text><rect x=\"945.35\" y=\"15.18\" width=\"233.72\" height=\"24.35\" rx=\"12.18\" fill=\"#FFF1E5\" stroke=\"none\"/><text x=\"1010.12\" y=\"30.55\" font-size=\"7.25\" font-weight=\"700\" fill=\"#E4781B\" text-anchor=\"start\">S1  ·  Google Apigee MCP</text><text x=\"20.93\" y=\"70.47\" font-size=\"5.58\" font-weight=\"700\" fill=\"#557086\" text-anchor=\"start\">ARCHITECTURE REVIEW DRAFT  ·  logically aligned; integration, identity and finance controls pending validation</text><rect x=\"20.93\" y=\"79.41\" width=\"537.21\" height=\"46.59\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"79.41\" width=\"537.21\" height=\"3.18\" rx=\"1.59\" fill=\"#7251AD\" stroke=\"none\"/><text x=\"28.6\" y=\"96.18\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">A  AI Foundry · design time</text><text x=\"28.6\" y=\"107.88\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Source, tool contracts and deployment pipeline; deployment interface TBD</text><rect x=\"31.4\" y=\"100.94\" width=\"104.65\" height=\"18.35\" rx=\"3.18\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.28\"/><text x=\"50.57\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Custom Foundry SDK</text><rect x=\"141.28\" y=\"100.94\" width=\"113.37\" height=\"18.35\" rx=\"3.18\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.28\"/><text x=\"160.77\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Local agent creation API</text><rect x=\"259.88\" y=\"100.94\" width=\"118.6\" height=\"18.35\" rx=\"3.18\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.28\"/><text x=\"274.55\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Python agent + tool bindings</text><rect x=\"383.72\" y=\"100.94\" width=\"162.21\" height=\"18.35\" rx=\"3.18\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.28\"/><text x=\"414.36\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">GitLab · tests · CI/CD · deploy TBD</text><line x1=\"136.05\" y1=\"110.12\" x2=\"140.23\" y2=\"110.12\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><polygon points=\"137.44,106.59 140.23,113.65 134.65,113.65\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(137.44 110.12) rotate(90) translate(-137.44 -110.12)\"/><line x1=\"254.65\" y1=\"110.12\" x2=\"258.84\" y2=\"110.12\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><polygon points=\"256.05,106.59 258.84,113.65 253.26,113.65\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(256.05 110.12) rotate(90) translate(-256.05 -110.12)\"/><line x1=\"378.49\" y1=\"110.12\" x2=\"382.67\" y2=\"110.12\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><polygon points=\"379.88,106.59 382.67,113.65 377.09,113.65\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(379.88 110.12) rotate(90) translate(-379.88 -110.12)\"/><rect x=\"568.6\" y=\"79.41\" width=\"610.47\" height=\"46.59\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#C7D3DE\" stroke-width=\"0.56\"/><text x=\"579.07\" y=\"94.46\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1265AD\" text-anchor=\"start\">SCENARIO INVARIANT</text><text x=\"579.07\" y=\"106.79\" font-size=\"6.97\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Only MCP gateway placement and its inbound / outbound auth controls change.</text><text x=\"579.07\" y=\"117.76\" font-size=\"5.58\" fill=\"#557086\" text-anchor=\"start\">Agent logic, domain tools, SAP integration, data, model and approval paths remain equivalent.</text><rect x=\"20.93\" y=\"132.35\" width=\"1158.14\" height=\"33.53\" rx=\"4.94\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><text x=\"28.95\" y=\"143.53\" font-size=\"5.3\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">IDENTITY &amp; CREDENTIAL PATH · CANDIDATE</text><text x=\"28.95\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">IdP → app user session</text><line x1=\"165\" y1=\"153.88\" x2=\"175.47\" y2=\"153.88\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"172.67,150.35 175.47,157.41 169.88,157.41\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(172.67 153.88) rotate(90) translate(-172.67 -153.88)\"/><text x=\"181.4\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">AgentCore inbound + workload</text><line x1=\"355.81\" y1=\"153.88\" x2=\"366.28\" y2=\"153.88\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"363.49,150.35 366.28,157.41 360.7,157.41\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(363.49 153.88) rotate(90) translate(-363.49 -153.88)\"/><text x=\"376.74\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Gateway inbound authZ</text><line x1=\"526.74\" y1=\"153.88\" x2=\"537.21\" y2=\"153.88\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"534.42,150.35 537.21,157.41 531.63,157.41\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(534.42 153.88) rotate(90) translate(-534.42 -153.88)\"/><text x=\"547.67\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Tool credential / operation policy</text><line x1=\"715.12\" y1=\"153.88\" x2=\"725.58\" y2=\"153.88\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"722.79,150.35 725.58,157.41 720,157.41\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(722.79 153.88) rotate(90) translate(-722.79 -153.88)\"/><text x=\"732.56\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">IS/iFlow propagation: TBD</text><line x1=\"906.98\" y1=\"153.88\" x2=\"917.44\" y2=\"153.88\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"914.65,150.35 917.44,157.41 911.86,157.41\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(914.65 153.88) rotate(90) translate(-914.65 -153.88)\"/><text x=\"927.91\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SCC if private → SAP user / ABAP</text><text x=\"1049.23\" y=\"144.25\" font-size=\"4.74\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">Delegation vs service identity: TO VALIDATE</text><rect x=\"20.93\" y=\"176.47\" width=\"104.65\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"176.47\" width=\"104.65\" height=\"3.18\" rx=\"1.59\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"28.6\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">01  Business entry</text><text x=\"28.6\" y=\"204.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Human intent and app</text><rect x=\"136.05\" y=\"176.47\" width=\"313.95\" height=\"307.06\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"136.05\" y=\"176.47\" width=\"313.95\" height=\"3.18\" rx=\"1.59\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"143.72\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">02  AWS AgentCore</text><text x=\"143.72\" y=\"204.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Managed runtime + custom agent</text><rect x=\"460.47\" y=\"176.47\" width=\"115.12\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"460.47\" y=\"176.47\" width=\"115.12\" height=\"3.18\" rx=\"1.59\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"468.14\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">03  MCP gateway</text><text x=\"468.14\" y=\"204.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Google Apigee · external to AWS</text><rect x=\"586.05\" y=\"176.47\" width=\"139.53\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"586.05\" y=\"176.47\" width=\"139.53\" height=\"3.18\" rx=\"1.59\" fill=\"#007F79\" stroke=\"none\"/><text x=\"593.72\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">04  Domain MCP</text><text x=\"593.72\" y=\"204.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Finance-owned tool targets</text><rect x=\"736.05\" y=\"176.47\" width=\"143.02\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"736.05\" y=\"176.47\" width=\"143.02\" height=\"3.18\" rx=\"1.59\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"743.72\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">05  SAP BAIP</text><text x=\"743.72\" y=\"204.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Integration Suite · direct/iFlow route TBD</text><rect x=\"889.53\" y=\"176.47\" width=\"59.3\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><rect x=\"889.53\" y=\"176.47\" width=\"59.3\" height=\"3.18\" rx=\"1.59\" fill=\"#7251AD\" stroke=\"none\"/><text x=\"897.21\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">06  SCC</text><text x=\"897.21\" y=\"204.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Only if private</text><rect x=\"959.3\" y=\"176.47\" width=\"219.77\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"959.3\" y=\"176.47\" width=\"219.77\" height=\"3.18\" rx=\"1.59\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"966.98\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">07  SAP backends</text><text x=\"966.98\" y=\"204.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Distinct systems / authorizations</text><rect x=\"28.6\" y=\"215.29\" width=\"89.3\" height=\"42.35\" rx=\"4.24\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"215.29\" width=\"2.79\" height=\"42.35\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"36.28\" y=\"227.85\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Finance user</text><text x=\"36.28\" y=\"239.18\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Company code · ledger</text><text x=\"36.28\" y=\"249.06\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Period · scope</text><rect x=\"28.6\" y=\"268.24\" width=\"89.3\" height=\"48.71\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"268.24\" width=\"2.79\" height=\"48.71\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"36.28\" y=\"280.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Business application</text><text x=\"36.28\" y=\"292.12\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Chat / finance UI</text><text x=\"36.28\" y=\"302\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Authorized invocation</text><rect x=\"28.6\" y=\"328.24\" width=\"89.3\" height=\"49.41\" rx=\"4.24\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"328.24\" width=\"2.79\" height=\"49.41\" rx=\"1.12\" fill=\"#7251AD\" stroke=\"none\"/><text x=\"36.28\" y=\"340.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Enterprise IdP / SSO</text><text x=\"36.28\" y=\"352.12\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Human authentication</text><text x=\"36.28\" y=\"362\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">OIDC / SAML TBD</text><rect x=\"28.6\" y=\"388.24\" width=\"89.3\" height=\"51.18\" rx=\"4.23\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"388.24\" width=\"2.79\" height=\"51.18\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"36.28\" y=\"400.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Business rule</text><text x=\"36.28\" y=\"412.12\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Read-only by default</text><text x=\"36.28\" y=\"422\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Writes need approval</text><line x1=\"73.26\" y1=\"257.65\" x2=\"73.26\" y2=\"266.82\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"0.84\"/><polygon points=\"73.26,256.24 77.44,266.82 69.07,266.82\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(73.26 261.53) rotate(180) translate(-73.26 -261.53)\"/><line x1=\"73.26\" y1=\"318\" x2=\"73.26\" y2=\"328.24\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(73.26 323.12) scale(1 -1) translate(-73.26 -323.12)\"/><polygon points=\"73.26,318 77.44,328.59 69.07,328.59\" fill=\"#7251AD\" stroke=\"none\"/><rect x=\"144.77\" y=\"213.53\" width=\"296.51\" height=\"148.24\" rx=\"4.24\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"144.77\" y=\"213.53\" width=\"2.79\" height=\"148.24\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"152.44\" y=\"226.06\" font-size=\"7.81\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Amazon Bedrock AgentCore Runtime</text><text x=\"152.44\" y=\"237.41\" font-size=\"5.58\" fill=\"#557086\" text-anchor=\"start\">Managed hosting for deployed custom Python agent</text><rect x=\"153.49\" y=\"250.59\" width=\"132.56\" height=\"47.65\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"153.49\" y=\"250.59\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"161.16\" y=\"263.15\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Agent + MCP client</text><text x=\"161.16\" y=\"274.47\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Custom · typed tool binding</text><text x=\"161.16\" y=\"284.36\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Trace / case ID</text><rect x=\"293.02\" y=\"250.59\" width=\"139.53\" height=\"47.65\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"293.02\" y=\"250.59\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"300.7\" y=\"263.15\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Context Manager</text><text x=\"300.7\" y=\"274.47\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Custom · scoped evidence</text><text x=\"300.7\" y=\"284.36\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Provenance / timestamps</text><rect x=\"153.49\" y=\"307.06\" width=\"132.56\" height=\"47.65\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"153.49\" y=\"307.06\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"161.16\" y=\"319.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Reconciliation Engine</text><text x=\"161.16\" y=\"330.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Custom · deterministic math</text><text x=\"161.16\" y=\"340.83\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Ledger / FX / tolerance</text><rect x=\"293.02\" y=\"307.06\" width=\"139.53\" height=\"47.65\" rx=\"4.23\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"293.02\" y=\"307.06\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"300.7\" y=\"319.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Posting Executor</text><text x=\"300.7\" y=\"330.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Custom · approved writes</text><text x=\"300.7\" y=\"340.83\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Rechecks + idempotency</text><rect x=\"153.49\" y=\"374.12\" width=\"87.21\" height=\"44.12\" rx=\"4.24\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><rect x=\"153.49\" y=\"374.12\" width=\"2.79\" height=\"44.12\" rx=\"1.12\" fill=\"#7251AD\" stroke=\"none\"/><text x=\"161.16\" y=\"386.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">AgentCore Identity</text><text x=\"161.16\" y=\"398.01\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">Managed credential access</text><text x=\"161.16\" y=\"407.89\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">Inbound/outbound design TBD</text><rect x=\"247.67\" y=\"374.12\" width=\"81.98\" height=\"44.12\" rx=\"4.24\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><rect x=\"247.67\" y=\"374.12\" width=\"2.79\" height=\"44.12\" rx=\"1.12\" fill=\"#7251AD\" stroke=\"none\"/><text x=\"255.35\" y=\"386.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">AgentCore Memory</text><text x=\"255.35\" y=\"398.01\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">Managed · optional</text><text x=\"255.35\" y=\"407.89\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">Conversation only</text><rect x=\"336.63\" y=\"374.12\" width=\"95.93\" height=\"44.12\" rx=\"4.24\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"336.63\" y=\"374.12\" width=\"2.79\" height=\"44.12\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"344.3\" y=\"386.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Observability</text><text x=\"344.3\" y=\"398.01\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">Managed traces/metrics</text><text x=\"344.3\" y=\"407.89\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">Case + audit correlation</text><text x=\"153.84\" y=\"439.3\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">AWS support: IAM / workload roles · Secrets Manager · KMS · CloudWatch</text><text x=\"153.84\" y=\"453.41\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1265AD\" text-anchor=\"start\">Gateway integration: MCP client + versioned, typed tool bindings</text><rect x=\"468.84\" y=\"217.06\" width=\"98.37\" height=\"51.18\" rx=\"4.23\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"468.84\" y=\"217.06\" width=\"2.79\" height=\"51.18\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"476.51\" y=\"229.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">MCP entry</text><text x=\"476.51\" y=\"240.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Tool discovery / invoke</text><text x=\"476.51\" y=\"250.83\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Apigee mode TBD</text><rect x=\"468.84\" y=\"277.06\" width=\"98.37\" height=\"52.94\" rx=\"4.24\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"468.84\" y=\"277.06\" width=\"2.79\" height=\"52.94\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"476.51\" y=\"289.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Inbound authZ</text><text x=\"476.51\" y=\"300.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Caller policy + scopes</text><text x=\"476.51\" y=\"310.83\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Operation allowlist TBD</text><rect x=\"468.84\" y=\"338.82\" width=\"98.37\" height=\"52.94\" rx=\"4.24\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"468.84\" y=\"338.82\" width=\"2.79\" height=\"52.94\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"476.51\" y=\"351.4\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Outbound target auth</text><text x=\"476.51\" y=\"362.71\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Separate target credential</text><text x=\"476.51\" y=\"372.59\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Exchange/delegation TBD</text><text x=\"470.23\" y=\"414.6\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Diagnostics: version · audit ID · timeout</text><text x=\"470.23\" y=\"430.48\" font-size=\"5.02\" font-weight=\"700\" fill=\"#E4781B\" text-anchor=\"start\">ONE selected gateway · no Portkey MCP</text><rect x=\"594.77\" y=\"215.29\" width=\"122.09\" height=\"65.29\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"215.29\" width=\"2.79\" height=\"65.29\" rx=\"1.12\" fill=\"#007F79\" stroke=\"none\"/><text x=\"602.44\" y=\"227.85\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP Finance · read</text><text x=\"602.44\" y=\"239.18\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">S/4 · Central Finance · BW</text><text x=\"602.44\" y=\"249.06\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Scoped read APIs</text><text x=\"602.44\" y=\"258.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">No direct database access</text><rect x=\"594.77\" y=\"291.18\" width=\"122.09\" height=\"58.24\" rx=\"4.23\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"291.18\" width=\"2.79\" height=\"58.24\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"602.44\" y=\"303.74\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP Finance · posting</text><text x=\"602.44\" y=\"315.06\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Restricted, typed API</text><text x=\"602.44\" y=\"324.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">S/4 default · TO VALIDATE</text><rect x=\"594.77\" y=\"358.24\" width=\"122.09\" height=\"37.06\" rx=\"4.24\" fill=\"#E5F5F2\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"358.24\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#007F79\" stroke=\"none\"/><text x=\"602.44\" y=\"370.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Databricks · read</text><text x=\"602.44\" y=\"382.12\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Approved SQL / API · UC grants</text><rect x=\"594.77\" y=\"405.88\" width=\"122.09\" height=\"32.47\" rx=\"4.24\" fill=\"#FBF7F1\" stroke=\"#A6825A\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"405.88\" width=\"2.79\" height=\"32.47\" rx=\"1.12\" fill=\"#A6825A\" stroke=\"none\"/><text x=\"602.44\" y=\"418.45\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">BDC · future read</text><text x=\"602.44\" y=\"429.77\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Optional approved MCP target</text><text x=\"594.77\" y=\"451.65\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Domain tool: owner · schema/version · input checks</text><text x=\"594.77\" y=\"462.24\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Per-operation authZ · bounded result · audit ID</text><rect x=\"744.77\" y=\"215.29\" width=\"125.58\" height=\"61.76\" rx=\"4.24\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"744.77\" y=\"215.29\" width=\"2.79\" height=\"61.76\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"752.44\" y=\"227.85\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">API Management</text><text x=\"752.44\" y=\"239.18\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Policies · API authorization</text><text x=\"752.44\" y=\"249.06\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Token exchange · scoped access</text><rect x=\"744.77\" y=\"287.65\" width=\"125.58\" height=\"61.76\" rx=\"4.24\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"744.77\" y=\"287.65\" width=\"2.79\" height=\"61.76\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"752.44\" y=\"300.21\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Cloud Integration</text><text x=\"752.44\" y=\"311.53\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Custom iFlows as needed</text><text x=\"752.44\" y=\"321.41\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Principal propagation candidate</text><text x=\"752.44\" y=\"331.3\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Route · error handling · trace</text><rect x=\"744.77\" y=\"360\" width=\"125.58\" height=\"58.24\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"744.77\" y=\"360\" width=\"2.79\" height=\"58.24\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"752.44\" y=\"372.56\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Destinations / connectivity</text><text x=\"752.44\" y=\"383.88\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">SAP API + identity mapping</text><text x=\"752.44\" y=\"393.77\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Backend ABAP auth still applies</text><text x=\"744.77\" y=\"435.77\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">API-managed direct or custom iFlow per target</text><text x=\"744.77\" y=\"448.12\" font-size=\"5.02\" fill=\"#7251AD\" text-anchor=\"start\">Identity mapping per backend: TO VALIDATE</text><rect x=\"896.51\" y=\"243.53\" width=\"45.35\" height=\"111.18\" rx=\"3.35\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><rect x=\"896.51\" y=\"243.53\" width=\"2.79\" height=\"111.18\" rx=\"1.12\" fill=\"#7251AD\" stroke=\"none\"/><text x=\"904.19\" y=\"256.11\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Cloud</text><text x=\"904.19\" y=\"267.42\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Connector</text><text x=\"904.19\" y=\"277.3\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">private</text><text x=\"904.19\" y=\"287.18\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">network</text><text x=\"904.19\" y=\"297.07\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">only</text><text x=\"895.47\" y=\"374.01\" font-size=\"5.02\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">Private route</text><text x=\"895.47\" y=\"383.18\" font-size=\"5.02\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">and mapping</text><text x=\"895.47\" y=\"392.36\" font-size=\"5.02\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">need proof</text><rect x=\"968.02\" y=\"215.29\" width=\"202.33\" height=\"68.82\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"968.02\" y=\"215.29\" width=\"2.79\" height=\"68.82\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"975.7\" y=\"227.84\" font-size=\"7.25\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP S/4HANA</text><text x=\"975.7\" y=\"239.18\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Live G/L balances · journals · open items</text><text x=\"975.7\" y=\"249.06\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Custom ABAP read API · controlled posting API</text><text x=\"975.7\" y=\"258.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">SAP document reference + status</text><rect x=\"968.02\" y=\"294.71\" width=\"202.33\" height=\"68.82\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"968.02\" y=\"294.71\" width=\"2.79\" height=\"68.82\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"975.7\" y=\"307.26\" font-size=\"6.97\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP S/4HANA Central Finance</text><text x=\"975.7\" y=\"318.59\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Central posted / replicated accounting</text><text x=\"975.7\" y=\"328.47\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Source mapping · errors · status · cutoff</text><text x=\"975.7\" y=\"338.36\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Posting target not assumed</text><rect x=\"968.02\" y=\"374.12\" width=\"202.33\" height=\"68.82\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"968.02\" y=\"374.12\" width=\"2.79\" height=\"68.82\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"975.7\" y=\"386.66\" font-size=\"7.25\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP BW/4HANA</text><text x=\"975.7\" y=\"398\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Reporting aggregates / hierarchy</text><text x=\"975.7\" y=\"407.88\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Load and refresh status</text><text x=\"975.7\" y=\"417.77\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Read-only analytic role</text><text x=\"976.74\" y=\"273.42\" font-size=\"5.02\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">Mapped principal + ABAP roles: TO VALIDATE</text><text x=\"976.74\" y=\"352.83\" font-size=\"5.02\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">Mapped principal + ABAP roles: TO VALIDATE</text><text x=\"976.74\" y=\"432.24\" font-size=\"5.02\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">Mapped principal + ABAP roles: TO VALIDATE</text><line x1=\"117.91\" y1=\"300\" x2=\"144.07\" y2=\"300\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.4\"/><polygon points=\"137.09,291.18 144.07,308.82 130.12,308.82\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(137.09 300) rotate(90) translate(-137.09 -300)\"/><rect x=\"117.91\" y=\"282.71\" width=\"59.3\" height=\"12.71\" rx=\"3.18\" fill=\"#FFFFFF\" stroke=\"#C7D3DE\" stroke-width=\"0.28\"/><text x=\"125.42\" y=\"291.42\" font-size=\"5.02\" font-weight=\"700\" fill=\"#1265AD\" text-anchor=\"start\">intent · HTTPS</text><line x1=\"441.28\" y1=\"240\" x2=\"468.14\" y2=\"240\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.4\"/><polygon points=\"461.16,231.18 468.14,248.82 454.19,248.82\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(461.16 240) rotate(90) translate(-461.16 -240)\"/><line x1=\"567.56\" y1=\"240\" x2=\"594.07\" y2=\"240\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.4\"/><polygon points=\"587.09,231.18 594.07,248.82 580.12,248.82\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(587.09 240) rotate(90) translate(-587.09 -240)\"/><line x1=\"717.56\" y1=\"240\" x2=\"744.07\" y2=\"240\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.4\"/><polygon points=\"737.09,231.18 744.07,248.82 730.12,248.82\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(737.09 240) rotate(90) translate(-737.09 -240)\"/><line x1=\"807.56\" y1=\"277.06\" x2=\"807.56\" y2=\"286.94\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"0.84\"/><polygon points=\"807.56,276.35 811.74,286.94 803.37,286.94\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(807.56 281.65) rotate(180) translate(-807.56 -281.65)\"/><line x1=\"807.56\" y1=\"349.41\" x2=\"807.56\" y2=\"359.29\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"0.84\"/><polygon points=\"807.56,348.71 811.74,359.29 803.37,359.29\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(807.56 354) rotate(180) translate(-807.56 -354)\"/><line x1=\"840.7\" y1=\"277.06\" x2=\"840.7\" y2=\"286.94\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\"/><polygon points=\"840.7,276.35 844.88,286.94 836.51,286.94\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(840.7 281.65) rotate(180) translate(-840.7 -281.65)\"/><line x1=\"840.7\" y1=\"349.41\" x2=\"840.7\" y2=\"359.29\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\"/><polygon points=\"840.7,348.71 844.88,359.29 836.51,359.29\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(840.7 354) rotate(180) translate(-840.7 -354)\"/><line x1=\"870.35\" y1=\"247.06\" x2=\"883.26\" y2=\"247.06\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><line x1=\"883.26\" y1=\"210\" x2=\"883.26\" y2=\"247.06\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\" transform=\"translate(883.26 228.53) scale(1 -1) translate(-883.26 -228.53)\"/><line x1=\"883.26\" y1=\"210\" x2=\"952.33\" y2=\"210\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"210\" x2=\"952.33\" y2=\"249.53\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"249.53\" x2=\"967.33\" y2=\"249.53\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><polygon points=\"961.74,242.47 967.33,256.59 956.16,256.59\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(961.74 249.53) rotate(90) translate(-961.74 -249.53)\"/><line x1=\"952.33\" y1=\"249.53\" x2=\"952.33\" y2=\"328.24\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"328.24\" x2=\"967.33\" y2=\"328.24\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><polygon points=\"961.74,321.18 967.33,335.29 956.16,335.29\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(961.74 328.24) rotate(90) translate(-961.74 -328.24)\"/><line x1=\"952.33\" y1=\"328.24\" x2=\"952.33\" y2=\"407.65\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"407.65\" x2=\"967.33\" y2=\"407.65\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><polygon points=\"961.74,400.59 967.33,414.71 956.16,414.71\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(961.74 407.65) rotate(90) translate(-961.74 -407.65)\"/><line x1=\"870.35\" y1=\"388.24\" x2=\"883.26\" y2=\"388.24\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"883.26\" y1=\"317.65\" x2=\"883.26\" y2=\"388.24\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(883.26 352.94) scale(1 -1) translate(-883.26 -352.94)\"/><line x1=\"883.26\" y1=\"317.65\" x2=\"895.81\" y2=\"317.65\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"891.63,312.35 895.81,322.94 887.44,322.94\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(891.63 317.65) rotate(90) translate(-891.63 -317.65)\"/><line x1=\"941.86\" y1=\"317.65\" x2=\"952.33\" y2=\"317.65\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"948.14,312.35 952.33,322.94 943.95,322.94\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(948.14 317.65) rotate(90) translate(-948.14 -317.65)\"/><text x=\"968.72\" y=\"462.95\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Direct API or iFlow/SCC route is selected per backend.</text><line x1=\"717.56\" y1=\"320.47\" x2=\"729.07\" y2=\"320.47\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><line x1=\"729.07\" y1=\"264.71\" x2=\"729.07\" y2=\"320.47\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\" transform=\"translate(729.07 292.59) scale(1 -1) translate(-729.07 -292.59)\"/><line x1=\"729.07\" y1=\"264.71\" x2=\"744.07\" y2=\"264.71\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><polygon points=\"738.49,257.65 744.07,271.76 732.91,271.76\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(738.49 264.71) rotate(90) translate(-738.49 -264.71)\"/><line x1=\"432.56\" y1=\"338.82\" x2=\"455.23\" y2=\"338.82\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><line x1=\"455.23\" y1=\"319.41\" x2=\"455.23\" y2=\"338.82\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\" transform=\"translate(455.23 329.12) scale(1 -1) translate(-455.23 -329.12)\"/><line x1=\"455.23\" y1=\"319.41\" x2=\"468.14\" y2=\"319.41\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><polygon points=\"462.56,312.35 468.14,326.47 456.98,326.47\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(462.56 319.41) rotate(90) translate(-462.56 -319.41)\"/><line x1=\"567.56\" y1=\"319.41\" x2=\"594.07\" y2=\"319.41\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><polygon points=\"588.49,312.35 594.07,326.47 582.91,326.47\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(588.49 319.41) rotate(90) translate(-588.49 -319.41)\"/><line x1=\"567.56\" y1=\"381.18\" x2=\"579.77\" y2=\"381.18\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"1.12\"/><line x1=\"579.77\" y1=\"381.18\" x2=\"579.77\" y2=\"390\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"1.12\"/><line x1=\"579.77\" y1=\"390\" x2=\"594.07\" y2=\"390\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"1.12\"/><polygon points=\"588.49,382.94 594.07,397.06 582.91,397.06\" fill=\"#007F79\" stroke=\"none\" transform=\"translate(588.49 390) rotate(90) translate(-588.49 -390)\"/><line x1=\"968.02\" y1=\"457.06\" x2=\"968.02\" y2=\"471.18\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"139.53\" y1=\"471.18\" x2=\"968.02\" y2=\"471.18\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(553.78 471.18) scale(-1 1) translate(-553.78 -471.18)\"/><polygon points=\"143.72,465.88 147.91,476.47 139.53,476.47\" fill=\"#007F79\" stroke=\"none\" transform=\"translate(143.72 471.18) rotate(270) translate(-143.72 -471.18)\"/><rect x=\"282.56\" y=\"457.06\" width=\"226.74\" height=\"12.71\" rx=\"3.18\" fill=\"#FFFFFF\" stroke=\"#C7D3DE\" stroke-width=\"0.28\"/><text x=\"312.77\" y=\"465.77\" font-size=\"5.02\" font-weight=\"700\" fill=\"#007F79\" text-anchor=\"start\">read results + source status return via same mediated path</text><rect x=\"20.93\" y=\"501.18\" width=\"415.12\" height=\"88.24\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"501.18\" width=\"415.12\" height=\"3.18\" rx=\"1.59\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"28.6\" y=\"517.94\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">B  LLM inference branch</text><text x=\"28.6\" y=\"529.65\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Selected, sanitized exception context only</text><rect x=\"29.65\" y=\"540\" width=\"160.47\" height=\"38.82\" rx=\"4.24\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"29.65\" y=\"540\" width=\"2.79\" height=\"38.82\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"37.33\" y=\"552.56\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Portkey · model governance</text><text x=\"37.33\" y=\"563.89\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Auth · routing · guardrails</text><text x=\"37.33\" y=\"573.77\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Redaction · logs · usage</text><rect x=\"244.19\" y=\"540\" width=\"181.4\" height=\"38.82\" rx=\"4.24\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"244.19\" y=\"540\" width=\"2.79\" height=\"38.82\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"251.86\" y=\"552.56\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Amazon Bedrock · foundation model</text><text x=\"251.86\" y=\"563.89\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Approved model · explanation</text><text x=\"251.86\" y=\"573.77\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">No authoritative math / posting</text><line x1=\"190.12\" y1=\"559.41\" x2=\"243.49\" y2=\"559.41\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><polygon points=\"237.91,552.35 243.49,566.47 232.33,566.47\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(237.91 559.41) rotate(90) translate(-237.91 -559.41)\"/><line x1=\"190.81\" y1=\"571.76\" x2=\"244.19\" y2=\"571.76\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(217.5 571.76) scale(-1 1) translate(-217.5 -571.76)\"/><polygon points=\"195,566.47 199.19,577.06 190.81,577.06\" fill=\"#007F79\" stroke=\"none\" transform=\"translate(195 571.76) rotate(270) translate(-195 -571.76)\"/><line x1=\"209.3\" y1=\"362.47\" x2=\"209.3\" y2=\"367.06\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"132.56\" y1=\"367.06\" x2=\"209.3\" y2=\"367.06\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(170.93 367.06) scale(-1 1) translate(-170.93 -367.06)\"/><line x1=\"132.56\" y1=\"367.06\" x2=\"132.56\" y2=\"488.82\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"101.16\" y1=\"488.82\" x2=\"132.56\" y2=\"488.82\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(116.86 488.82) scale(-1 1) translate(-116.86 -488.82)\"/><line x1=\"101.16\" y1=\"488.82\" x2=\"101.16\" y2=\"539.29\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"101.16,528.71 105.35,539.29 96.98,539.29\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(101.16 534) rotate(180) translate(-101.16 -534)\"/><line x1=\"111.63\" y1=\"494.12\" x2=\"111.63\" y2=\"540\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(111.63 517.06) scale(1 -1) translate(-111.63 -517.06)\"/><line x1=\"111.63\" y1=\"494.12\" x2=\"127.33\" y2=\"494.12\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"127.33\" y1=\"370.59\" x2=\"127.33\" y2=\"494.12\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(127.33 432.35) scale(1 -1) translate(-127.33 -432.35)\"/><line x1=\"127.33\" y1=\"370.59\" x2=\"209.3\" y2=\"370.59\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"209.3\" y1=\"362.47\" x2=\"209.3\" y2=\"370.59\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(209.3 366.53) scale(1 -1) translate(-209.3 -366.53)\"/><polygon points=\"209.3,362.47 213.49,373.06 205.12,373.06\" fill=\"#007F79\" stroke=\"none\"/><text x=\"31.4\" y=\"585.77\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Minimized prompt; response via Portkey to Runtime; advisory only.</text><rect x=\"20.93\" y=\"603.53\" width=\"415.12\" height=\"95.29\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"603.53\" width=\"415.12\" height=\"3.18\" rx=\"1.59\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"28.6\" y=\"620.29\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">C  n8n approval side path</text><text x=\"28.6\" y=\"632\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Only for a proposed financial write</text><rect x=\"29.65\" y=\"640.59\" width=\"111.63\" height=\"37.06\" rx=\"4.24\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"29.65\" y=\"640.59\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"37.33\" y=\"653.15\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Finance approver</text><text x=\"37.33\" y=\"664.48\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Verified decision</text><text x=\"37.33\" y=\"674.36\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Approve / reject</text><rect x=\"160.47\" y=\"640.59\" width=\"111.63\" height=\"37.06\" rx=\"4.24\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"160.47\" y=\"640.59\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"168.14\" y=\"653.15\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">n8n workflow</text><text x=\"168.14\" y=\"664.48\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Case version + hash</text><text x=\"168.14\" y=\"674.36\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Trusted callback</text><rect x=\"291.28\" y=\"640.59\" width=\"132.56\" height=\"37.06\" rx=\"4.24\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"291.28\" y=\"640.59\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"298.95\" y=\"653.15\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Executor recheck</text><text x=\"298.95\" y=\"664.48\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">SAP state + authorization</text><text x=\"298.95\" y=\"674.36\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Idempotency / retry stop</text><line x1=\"141.98\" y1=\"649.41\" x2=\"160.47\" y2=\"649.41\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" transform=\"translate(151.22 649.41) scale(-1 1) translate(-151.22 -649.41)\"/><polygon points=\"146.16,644.12 150.35,654.71 141.98,654.71\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(146.16 649.41) rotate(270) translate(-146.16 -649.41)\"/><line x1=\"141.28\" y1=\"665.29\" x2=\"159.77\" y2=\"665.29\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><polygon points=\"154.19,658.24 159.77,672.35 148.6,672.35\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(154.19 665.29) rotate(90) translate(-154.19 -665.29)\"/><line x1=\"272.09\" y1=\"660\" x2=\"290.58\" y2=\"660\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><polygon points=\"285,652.94 290.58,667.06 279.42,667.06\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(285 660) rotate(90) translate(-285 -660)\"/><line x1=\"380.23\" y1=\"355.41\" x2=\"380.23\" y2=\"365.29\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"380.23\" y1=\"365.29\" x2=\"437.79\" y2=\"365.29\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"437.79\" y1=\"365.29\" x2=\"437.79\" y2=\"494.12\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"437.79\" y1=\"494.12\" x2=\"441.28\" y2=\"494.12\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"441.28\" y1=\"494.12\" x2=\"441.28\" y2=\"608.82\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"216.28\" y1=\"608.82\" x2=\"441.28\" y2=\"608.82\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(328.78 608.82) scale(-1 1) translate(-328.78 -608.82)\"/><line x1=\"216.28\" y1=\"608.82\" x2=\"216.28\" y2=\"639.88\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"216.28,629.29 220.47,639.88 212.09,639.88\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(216.28 634.59) rotate(180) translate(-216.28 -634.59)\"/><line x1=\"359.3\" y1=\"598.24\" x2=\"359.3\" y2=\"640.59\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(359.3 619.41) scale(1 -1) translate(-359.3 -619.41)\"/><line x1=\"359.3\" y1=\"598.24\" x2=\"444.77\" y2=\"598.24\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"444.77\" y1=\"365.29\" x2=\"444.77\" y2=\"598.24\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(444.77 481.76) scale(1 -1) translate(-444.77 -481.76)\"/><line x1=\"362.79\" y1=\"365.29\" x2=\"444.77\" y2=\"365.29\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(403.78 365.29) scale(-1 1) translate(-403.78 -365.29)\"/><line x1=\"362.79\" y1=\"355.41\" x2=\"362.79\" y2=\"365.29\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(362.79 360.35) scale(1 -1) translate(-362.79 -360.35)\"/><polygon points=\"362.79,355.41 366.98,366 358.6,366\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"29.65\" y=\"688.12\" font-size=\"5.02\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">n8n request → finance decision → exact-match callback → recheck → posting/audit.</text><rect x=\"446.51\" y=\"501.18\" width=\"352.33\" height=\"197.65\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"446.51\" y=\"501.18\" width=\"352.33\" height=\"3.18\" rx=\"1.59\" fill=\"#007F79\" stroke=\"none\"/><text x=\"454.19\" y=\"517.94\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">D  Enterprise Databricks</text><text x=\"454.19\" y=\"529.65\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Current governed history and evidence</text><rect x=\"455.23\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"455.23\" y=\"540\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#007F79\" stroke=\"none\"/><text x=\"462.91\" y=\"552.58\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Unity Catalog</text><text x=\"462.91\" y=\"563.89\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Grants + policy</text><rect x=\"566.86\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"566.86\" y=\"540\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#007F79\" stroke=\"none\"/><text x=\"574.53\" y=\"552.58\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Delta / Lakehouse</text><text x=\"574.53\" y=\"563.89\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Balances + snapshots</text><rect x=\"678.49\" y=\"540\" width=\"111.63\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"678.49\" y=\"540\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#007F79\" stroke=\"none\"/><text x=\"686.16\" y=\"552.58\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SQL Warehouse</text><text x=\"686.16\" y=\"563.89\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Scoped SQL</text><rect x=\"455.23\" y=\"592.94\" width=\"162.21\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"455.23\" y=\"592.94\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#007F79\" stroke=\"none\"/><text x=\"462.91\" y=\"605.52\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Data Engineering Pipelines</text><text x=\"462.91\" y=\"616.83\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Freshness + load status</text><rect x=\"627.91\" y=\"592.94\" width=\"162.21\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"627.91\" y=\"592.94\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#007F79\" stroke=\"none\"/><text x=\"635.58\" y=\"605.52\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Approved API / MCP access</text><text x=\"635.58\" y=\"616.83\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Bounded read + audit</text><text x=\"455.23\" y=\"652.83\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Data ownership, freshness and stored results: TO VALIDATE.</text><text x=\"455.23\" y=\"666.95\" font-size=\"5.02\" fill=\"#7251AD\" text-anchor=\"start\">UC grants + OAuth / service principal or delegated identity.</text><line x1=\"655.12\" y1=\"395.29\" x2=\"655.12\" y2=\"487.06\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\"/><line x1=\"655.12\" y1=\"487.06\" x2=\"675\" y2=\"487.06\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\"/><line x1=\"675\" y1=\"487.06\" x2=\"675\" y2=\"585.88\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\"/><line x1=\"675\" y1=\"585.88\" x2=\"704.65\" y2=\"585.88\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\"/><line x1=\"704.65\" y1=\"585.88\" x2=\"704.65\" y2=\"592.24\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\"/><polygon points=\"704.65,581.65 708.84,592.24 700.47,592.24\" fill=\"#007F79\" stroke=\"none\" transform=\"translate(704.65 586.94) rotate(180) translate(-704.65 -586.94)\"/><rect x=\"812.79\" y=\"501.18\" width=\"366.28\" height=\"197.65\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#A6825A\" stroke-width=\"0.56\"/><rect x=\"812.79\" y=\"501.18\" width=\"366.28\" height=\"3.18\" rx=\"1.59\" fill=\"#A6825A\" stroke=\"none\"/><text x=\"820.47\" y=\"517.94\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">E  SAP Business Data Cloud</text><text x=\"820.47\" y=\"529.65\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Future state · entitlement and scope TO VALIDATE</text><rect x=\"821.51\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"3.53\" fill=\"#FBF7F1\" stroke=\"#A6825A\" stroke-width=\"0.28\"/><text x=\"846.35\" y=\"561.05\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP Datasphere</text><rect x=\"933.14\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"3.53\" fill=\"#FBF7F1\" stroke=\"#A6825A\" stroke-width=\"0.28\"/><text x=\"959.12\" y=\"561.05\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP Databricks</text><rect x=\"1044.77\" y=\"540\" width=\"125.58\" height=\"40.59\" rx=\"3.53\" fill=\"#FBF7F1\" stroke=\"#A6825A\" stroke-width=\"0.28\"/><text x=\"1063.08\" y=\"561.05\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP Analytics Cloud (SAC)</text><rect x=\"821.51\" y=\"592.94\" width=\"348.84\" height=\"52.94\" rx=\"4.24\" fill=\"#FBF7F1\" stroke=\"#A6825A\" stroke-width=\"0.56\"/><rect x=\"821.51\" y=\"592.94\" width=\"2.79\" height=\"52.94\" rx=\"1.12\" fill=\"#A6825A\" stroke=\"none\"/><text x=\"829.19\" y=\"605.49\" font-size=\"6.97\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">BDC Connect · zero-copy sharing</text><text x=\"829.19\" y=\"616.82\" font-size=\"5.58\" fill=\"#557086\" text-anchor=\"start\">Future governed link with existing enterprise Databricks</text><text x=\"829.19\" y=\"626.7\" font-size=\"5.58\" fill=\"#557086\" text-anchor=\"start\">Bidirectional data products via Delta Sharing</text><text x=\"829.19\" y=\"636.59\" font-size=\"5.58\" fill=\"#557086\" text-anchor=\"start\">Provisioning, grants and product scope TO VALIDATE</text><line x1=\"798.84\" y1=\"610.59\" x2=\"820.81\" y2=\"610.59\" fill=\"none\" stroke=\"#A6825A\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"816.63,605.29 820.81,615.88 812.44,615.88\" fill=\"#A6825A\" stroke=\"none\" transform=\"translate(816.63 610.59) rotate(90) translate(-816.63 -610.59)\"/><line x1=\"799.53\" y1=\"626.47\" x2=\"821.51\" y2=\"626.47\" fill=\"none\" stroke=\"#A6825A\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(810.52 626.47) scale(-1 1) translate(-810.52 -626.47)\"/><polygon points=\"803.72,621.18 807.91,631.76 799.53,631.76\" fill=\"#A6825A\" stroke=\"none\" transform=\"translate(803.72 626.47) rotate(270) translate(-803.72 -626.47)\"/><line x1=\"717.56\" y1=\"421.76\" x2=\"717.56\" y2=\"488.82\" fill=\"none\" stroke=\"#A6825A\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"717.56\" y1=\"488.82\" x2=\"973.26\" y2=\"488.82\" fill=\"none\" stroke=\"#A6825A\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"973.26\" y1=\"488.82\" x2=\"973.26\" y2=\"500.47\" fill=\"none\" stroke=\"#A6825A\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"973.26,489.88 977.44,500.47 969.07,500.47\" fill=\"#A6825A\" stroke=\"none\" transform=\"translate(973.26 495.18) rotate(180) translate(-973.26 -495.18)\"/><text x=\"821.51\" y=\"665.18\" font-size=\"5.3\" fill=\"#A6825A\" text-anchor=\"start\">Future retrieval through approved MCP capability, if selected.</text><ellipse cx=\"130.81\" cy=\"300\" rx=\"4.74\" ry=\"6\" fill=\"#1265AD\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"125.51\" y=\"302.36\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">1</text><ellipse cx=\"455.23\" cy=\"240\" rx=\"4.74\" ry=\"6\" fill=\"#1265AD\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"449.93\" y=\"242.36\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">2</text><ellipse cx=\"580.81\" cy=\"240\" rx=\"4.74\" ry=\"6\" fill=\"#1265AD\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"575.51\" y=\"242.36\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">3</text><ellipse cx=\"216.28\" cy=\"365.29\" rx=\"4.74\" ry=\"6\" fill=\"#1265AD\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"210.98\" y=\"367.65\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">4</text><ellipse cx=\"216.28\" cy=\"559.41\" rx=\"4.74\" ry=\"6\" fill=\"#E4781B\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"210.98\" y=\"561.77\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">5</text><ellipse cx=\"136.05\" cy=\"471.18\" rx=\"4.74\" ry=\"6\" fill=\"#007F79\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"130.74\" y=\"473.53\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">6</text><ellipse cx=\"150.7\" cy=\"665.29\" rx=\"4.74\" ry=\"6\" fill=\"#E4781B\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"145.4\" y=\"667.65\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">7</text><rect x=\"20.93\" y=\"709.41\" width=\"1158.14\" height=\"97.06\" rx=\"5.65\" fill=\"#FFFFFF\" stroke=\"#C7D3DE\" stroke-width=\"0.56\"/><text x=\"29.65\" y=\"725.85\" font-size=\"6.69\" font-weight=\"700\" fill=\"#103C68\" text-anchor=\"start\">WORKED EXAMPLE  ·  company code 1000  ·  ledger 0L  ·  Nov 2026  ·  illustrative USD $25,000 variance</text><rect x=\"29.65\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.28\"/><text x=\"35.23\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">1–2  Sign-in + scope</text><text x=\"35.23\" y=\"759.42\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">User → app → AgentCore</text><rect x=\"219.77\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.28\"/><text x=\"225.35\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">3  Current SAP reads</text><text x=\"225.35\" y=\"759.42\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">S/4 · Central Finance · BW</text><rect x=\"409.88\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.28\"/><text x=\"415.47\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">4  Reconcile</text><text x=\"415.47\" y=\"759.42\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Snapshot / timestamps / tolerance</text><rect x=\"600\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.28\"/><text x=\"605.58\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">5  Explain</text><text x=\"605.58\" y=\"759.42\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Sanitized context → model</text><rect x=\"790.12\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.28\"/><text x=\"795.7\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">6  Read-only result</text><text x=\"795.7\" y=\"759.42\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Evidence-backed answer</text><rect x=\"980.23\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.28\"/><text x=\"985.81\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">7  If adjustment</text><text x=\"985.81\" y=\"759.42\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">n8n → recheck → posting → audit</text><text x=\"29.65\" y=\"795.06\" font-size=\"5.3\" fill=\"#7251AD\" text-anchor=\"start\">L2 identity caveat: Integration Suite / custom iFlow propagation is a candidate; prove identity mapping and ABAP roles at each SAP backend.</text><line x1=\"30\" y1=\"818.12\" x2=\"52.33\" y2=\"818.12\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.4\"/><polygon points=\"45.35,809.29 52.33,826.94 38.37,826.94\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(45.35 818.12) rotate(90) translate(-45.35 -818.12)\"/><text x=\"57.56\" y=\"820.48\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">read / result</text><line x1=\"132.56\" y1=\"818.12\" x2=\"154.88\" y2=\"818.12\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.4\"/><polygon points=\"147.91,809.29 154.88,826.94 140.93,826.94\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(147.91 818.12) rotate(90) translate(-147.91 -818.12)\"/><text x=\"160.47\" y=\"820.48\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">approval-gated write</text><line x1=\"268.6\" y1=\"818.12\" x2=\"290.93\" y2=\"818.12\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"1.12\" stroke-dasharray=\"4.46 3.35\"/><polygon points=\"285.35,811.06 290.93,825.18 279.77,825.18\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(285.35 818.12) rotate(90) translate(-285.35 -818.12)\"/><text x=\"296.51\" y=\"820.48\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">identity / credentials</text><line x1=\"425.58\" y1=\"818.12\" x2=\"447.91\" y2=\"818.12\" fill=\"none\" stroke=\"#A6825A\" stroke-width=\"1.12\" stroke-dasharray=\"4.46 3.35\"/><polygon points=\"442.33,811.06 447.91,825.18 436.74,825.18\" fill=\"#A6825A\" stroke=\"none\" transform=\"translate(442.33 818.12) rotate(90) translate(-442.33 -818.12)\"/><text x=\"453.49\" y=\"820.48\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">optional / future</text><text x=\"1062.35\" y=\"820.48\" font-size=\"4.74\" font-weight=\"700\" fill=\"#557086\" text-anchor=\"start\">S1 / L2  ·  22 NOV 2026  ·  REVIEW DRAFT</text></svg>\r\n", A = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 840\" role=\"img\" aria-labelledby=\"t d\" font-family=\"'Segoe UI','Segoe UI Variable','Helvetica Neue',Arial,sans-serif\" text-rendering=\"geometricPrecision\" shape-rendering=\"geometricPrecision\"><title id=\"t\">S2 · AgentCore Gateway MCP</title><desc id=\"d\">Detailed architecture diagram S2 · AgentCore Gateway MCP converted from the supplied deck</desc><rect width=\"1200\" height=\"840\" fill=\"#F1F4F7\"/><rect x=\"0\" y=\"0\" width=\"1200\" height=\"840\" fill=\"#F1F4F7\" stroke=\"none\"/><rect x=\"0\" y=\"0\" width=\"1200\" height=\"58.24\" fill=\"#103C68\" stroke=\"none\"/><text x=\"20.93\" y=\"24.45\" font-size=\"12\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">AI FOUNDRY  /  MONTH-END RECONCILIATION</text><text x=\"21.63\" y=\"41.14\" font-size=\"6.97\" fill=\"#DCEBFA\" text-anchor=\"start\">L2  |  Worked reconciliation, identity and controls</text><rect x=\"945.35\" y=\"15.18\" width=\"233.72\" height=\"24.35\" rx=\"12.18\" fill=\"#FFF1E5\" stroke=\"none\"/><text x=\"999.93\" y=\"30.55\" font-size=\"7.25\" font-weight=\"700\" fill=\"#E4781B\" text-anchor=\"start\">S2  ·  AgentCore Gateway MCP</text><text x=\"20.93\" y=\"70.47\" font-size=\"5.58\" font-weight=\"700\" fill=\"#557086\" text-anchor=\"start\">ARCHITECTURE REVIEW DRAFT  ·  logically aligned; integration, identity and finance controls pending validation</text><rect x=\"20.93\" y=\"79.41\" width=\"537.21\" height=\"46.59\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"79.41\" width=\"537.21\" height=\"3.18\" rx=\"1.59\" fill=\"#7251AD\" stroke=\"none\"/><text x=\"28.6\" y=\"96.18\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">A  AI Foundry · design time</text><text x=\"28.6\" y=\"107.88\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Source, tool contracts and deployment pipeline; deployment interface TBD</text><rect x=\"31.4\" y=\"100.94\" width=\"104.65\" height=\"18.35\" rx=\"3.18\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.28\"/><text x=\"50.57\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Custom Foundry SDK</text><rect x=\"141.28\" y=\"100.94\" width=\"113.37\" height=\"18.35\" rx=\"3.18\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.28\"/><text x=\"160.77\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Local agent creation API</text><rect x=\"259.88\" y=\"100.94\" width=\"118.6\" height=\"18.35\" rx=\"3.18\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.28\"/><text x=\"274.55\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Python agent + tool bindings</text><rect x=\"383.72\" y=\"100.94\" width=\"162.21\" height=\"18.35\" rx=\"3.18\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.28\"/><text x=\"414.36\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">GitLab · tests · CI/CD · deploy TBD</text><line x1=\"136.05\" y1=\"110.12\" x2=\"140.23\" y2=\"110.12\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><polygon points=\"137.44,106.59 140.23,113.65 134.65,113.65\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(137.44 110.12) rotate(90) translate(-137.44 -110.12)\"/><line x1=\"254.65\" y1=\"110.12\" x2=\"258.84\" y2=\"110.12\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><polygon points=\"256.05,106.59 258.84,113.65 253.26,113.65\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(256.05 110.12) rotate(90) translate(-256.05 -110.12)\"/><line x1=\"378.49\" y1=\"110.12\" x2=\"382.67\" y2=\"110.12\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><polygon points=\"379.88,106.59 382.67,113.65 377.09,113.65\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(379.88 110.12) rotate(90) translate(-379.88 -110.12)\"/><rect x=\"568.6\" y=\"79.41\" width=\"610.47\" height=\"46.59\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#C7D3DE\" stroke-width=\"0.56\"/><text x=\"579.07\" y=\"94.46\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1265AD\" text-anchor=\"start\">SCENARIO INVARIANT</text><text x=\"579.07\" y=\"106.79\" font-size=\"6.97\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Only MCP gateway placement and its inbound / outbound auth controls change.</text><text x=\"579.07\" y=\"117.76\" font-size=\"5.58\" fill=\"#557086\" text-anchor=\"start\">Agent logic, domain tools, SAP integration, data, model and approval paths remain equivalent.</text><rect x=\"20.93\" y=\"132.35\" width=\"1158.14\" height=\"33.53\" rx=\"4.94\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><text x=\"28.95\" y=\"143.53\" font-size=\"5.3\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">IDENTITY &amp; CREDENTIAL PATH · CANDIDATE</text><text x=\"28.95\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">IdP → app user session</text><line x1=\"165\" y1=\"153.88\" x2=\"175.47\" y2=\"153.88\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"172.67,150.35 175.47,157.41 169.88,157.41\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(172.67 153.88) rotate(90) translate(-172.67 -153.88)\"/><text x=\"181.4\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">AgentCore inbound + workload</text><line x1=\"355.81\" y1=\"153.88\" x2=\"366.28\" y2=\"153.88\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"363.49,150.35 366.28,157.41 360.7,157.41\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(363.49 153.88) rotate(90) translate(-363.49 -153.88)\"/><text x=\"376.74\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Gateway inbound authZ</text><line x1=\"526.74\" y1=\"153.88\" x2=\"537.21\" y2=\"153.88\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"534.42,150.35 537.21,157.41 531.63,157.41\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(534.42 153.88) rotate(90) translate(-534.42 -153.88)\"/><text x=\"547.67\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Tool credential / operation policy</text><line x1=\"715.12\" y1=\"153.88\" x2=\"725.58\" y2=\"153.88\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"722.79,150.35 725.58,157.41 720,157.41\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(722.79 153.88) rotate(90) translate(-722.79 -153.88)\"/><text x=\"732.56\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">IS/iFlow propagation: TBD</text><line x1=\"906.98\" y1=\"153.88\" x2=\"917.44\" y2=\"153.88\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"914.65,150.35 917.44,157.41 911.86,157.41\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(914.65 153.88) rotate(90) translate(-914.65 -153.88)\"/><text x=\"927.91\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SCC if private → SAP user / ABAP</text><text x=\"1049.23\" y=\"144.25\" font-size=\"4.74\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">Delegation vs service identity: TO VALIDATE</text><rect x=\"132.56\" y=\"172.59\" width=\"446.51\" height=\"315.53\" rx=\"7.06\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"475.12\" y=\"162.71\" width=\"71.51\" height=\"12.71\" rx=\"3.18\" fill=\"#FFFFFF\" stroke=\"#C7D3DE\" stroke-width=\"0.28\"/><text x=\"480.63\" y=\"171.42\" font-size=\"5.02\" font-weight=\"700\" fill=\"#1265AD\" text-anchor=\"start\">AWS trust boundary</text><rect x=\"20.93\" y=\"176.47\" width=\"104.65\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"176.47\" width=\"104.65\" height=\"3.18\" rx=\"1.59\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"28.6\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">01  Business entry</text><text x=\"28.6\" y=\"204.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Human intent and app</text><rect x=\"136.05\" y=\"176.47\" width=\"313.95\" height=\"307.06\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"136.05\" y=\"176.47\" width=\"313.95\" height=\"3.18\" rx=\"1.59\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"143.72\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">02  AWS AgentCore</text><text x=\"143.72\" y=\"204.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Managed runtime + custom agent</text><rect x=\"460.47\" y=\"176.47\" width=\"115.12\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"460.47\" y=\"176.47\" width=\"115.12\" height=\"3.18\" rx=\"1.59\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"468.14\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">03  MCP gateway</text><text x=\"468.14\" y=\"204.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">AgentCore Gateway · inside AWS</text><rect x=\"586.05\" y=\"176.47\" width=\"139.53\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"586.05\" y=\"176.47\" width=\"139.53\" height=\"3.18\" rx=\"1.59\" fill=\"#007F79\" stroke=\"none\"/><text x=\"593.72\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">04  Domain MCP</text><text x=\"593.72\" y=\"204.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Finance-owned tool targets</text><rect x=\"736.05\" y=\"176.47\" width=\"143.02\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"736.05\" y=\"176.47\" width=\"143.02\" height=\"3.18\" rx=\"1.59\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"743.72\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">05  SAP BAIP</text><text x=\"743.72\" y=\"204.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Integration Suite · direct/iFlow route TBD</text><rect x=\"889.53\" y=\"176.47\" width=\"59.3\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><rect x=\"889.53\" y=\"176.47\" width=\"59.3\" height=\"3.18\" rx=\"1.59\" fill=\"#7251AD\" stroke=\"none\"/><text x=\"897.21\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">06  SCC</text><text x=\"897.21\" y=\"204.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Only if private</text><rect x=\"959.3\" y=\"176.47\" width=\"219.77\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"959.3\" y=\"176.47\" width=\"219.77\" height=\"3.18\" rx=\"1.59\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"966.98\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">07  SAP backends</text><text x=\"966.98\" y=\"204.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Distinct systems / authorizations</text><rect x=\"28.6\" y=\"215.29\" width=\"89.3\" height=\"42.35\" rx=\"4.24\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"215.29\" width=\"2.79\" height=\"42.35\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"36.28\" y=\"227.85\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Finance user</text><text x=\"36.28\" y=\"239.18\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Company code · ledger</text><text x=\"36.28\" y=\"249.06\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Period · scope</text><rect x=\"28.6\" y=\"268.24\" width=\"89.3\" height=\"48.71\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"268.24\" width=\"2.79\" height=\"48.71\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"36.28\" y=\"280.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Business application</text><text x=\"36.28\" y=\"292.12\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Chat / finance UI</text><text x=\"36.28\" y=\"302\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Authorized invocation</text><rect x=\"28.6\" y=\"328.24\" width=\"89.3\" height=\"49.41\" rx=\"4.24\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"328.24\" width=\"2.79\" height=\"49.41\" rx=\"1.12\" fill=\"#7251AD\" stroke=\"none\"/><text x=\"36.28\" y=\"340.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Enterprise IdP / SSO</text><text x=\"36.28\" y=\"352.12\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Human authentication</text><text x=\"36.28\" y=\"362\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">OIDC / SAML TBD</text><rect x=\"28.6\" y=\"388.24\" width=\"89.3\" height=\"51.18\" rx=\"4.23\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"388.24\" width=\"2.79\" height=\"51.18\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"36.28\" y=\"400.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Business rule</text><text x=\"36.28\" y=\"412.12\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Read-only by default</text><text x=\"36.28\" y=\"422\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Writes need approval</text><line x1=\"73.26\" y1=\"257.65\" x2=\"73.26\" y2=\"266.82\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"0.84\"/><polygon points=\"73.26,256.24 77.44,266.82 69.07,266.82\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(73.26 261.53) rotate(180) translate(-73.26 -261.53)\"/><line x1=\"73.26\" y1=\"318\" x2=\"73.26\" y2=\"328.24\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(73.26 323.12) scale(1 -1) translate(-73.26 -323.12)\"/><polygon points=\"73.26,318 77.44,328.59 69.07,328.59\" fill=\"#7251AD\" stroke=\"none\"/><rect x=\"144.77\" y=\"213.53\" width=\"296.51\" height=\"148.24\" rx=\"4.24\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"144.77\" y=\"213.53\" width=\"2.79\" height=\"148.24\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"152.44\" y=\"226.06\" font-size=\"7.81\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Amazon Bedrock AgentCore Runtime</text><text x=\"152.44\" y=\"237.41\" font-size=\"5.58\" fill=\"#557086\" text-anchor=\"start\">Managed hosting for deployed custom Python agent</text><rect x=\"153.49\" y=\"250.59\" width=\"132.56\" height=\"47.65\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"153.49\" y=\"250.59\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"161.16\" y=\"263.15\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Agent + MCP client</text><text x=\"161.16\" y=\"274.47\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Custom · typed tool binding</text><text x=\"161.16\" y=\"284.36\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Trace / case ID</text><rect x=\"293.02\" y=\"250.59\" width=\"139.53\" height=\"47.65\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"293.02\" y=\"250.59\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"300.7\" y=\"263.15\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Context Manager</text><text x=\"300.7\" y=\"274.47\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Custom · scoped evidence</text><text x=\"300.7\" y=\"284.36\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Provenance / timestamps</text><rect x=\"153.49\" y=\"307.06\" width=\"132.56\" height=\"47.65\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"153.49\" y=\"307.06\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"161.16\" y=\"319.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Reconciliation Engine</text><text x=\"161.16\" y=\"330.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Custom · deterministic math</text><text x=\"161.16\" y=\"340.83\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Ledger / FX / tolerance</text><rect x=\"293.02\" y=\"307.06\" width=\"139.53\" height=\"47.65\" rx=\"4.23\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"293.02\" y=\"307.06\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"300.7\" y=\"319.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Posting Executor</text><text x=\"300.7\" y=\"330.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Custom · approved writes</text><text x=\"300.7\" y=\"340.83\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Rechecks + idempotency</text><rect x=\"153.49\" y=\"374.12\" width=\"87.21\" height=\"44.12\" rx=\"4.24\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><rect x=\"153.49\" y=\"374.12\" width=\"2.79\" height=\"44.12\" rx=\"1.12\" fill=\"#7251AD\" stroke=\"none\"/><text x=\"161.16\" y=\"386.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">AgentCore Identity</text><text x=\"161.16\" y=\"398.01\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">Managed credential access</text><text x=\"161.16\" y=\"407.89\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">Inbound/outbound design TBD</text><rect x=\"247.67\" y=\"374.12\" width=\"81.98\" height=\"44.12\" rx=\"4.24\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><rect x=\"247.67\" y=\"374.12\" width=\"2.79\" height=\"44.12\" rx=\"1.12\" fill=\"#7251AD\" stroke=\"none\"/><text x=\"255.35\" y=\"386.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">AgentCore Memory</text><text x=\"255.35\" y=\"398.01\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">Managed · optional</text><text x=\"255.35\" y=\"407.89\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">Conversation only</text><rect x=\"336.63\" y=\"374.12\" width=\"95.93\" height=\"44.12\" rx=\"4.24\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"336.63\" y=\"374.12\" width=\"2.79\" height=\"44.12\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"344.3\" y=\"386.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Observability</text><text x=\"344.3\" y=\"398.01\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">Managed traces/metrics</text><text x=\"344.3\" y=\"407.89\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">Case + audit correlation</text><text x=\"153.84\" y=\"439.3\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">AWS support: IAM / workload roles · Secrets Manager · KMS · CloudWatch</text><text x=\"153.84\" y=\"453.41\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1265AD\" text-anchor=\"start\">Gateway integration: MCP client + versioned, typed tool bindings</text><rect x=\"468.84\" y=\"217.06\" width=\"98.37\" height=\"51.18\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"468.84\" y=\"217.06\" width=\"2.79\" height=\"51.18\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"476.51\" y=\"229.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">MCP entry</text><text x=\"476.51\" y=\"240.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Tool discovery / invoke</text><text x=\"476.51\" y=\"250.83\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Target type TBD</text><rect x=\"468.84\" y=\"277.06\" width=\"98.37\" height=\"52.94\" rx=\"4.24\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"468.84\" y=\"277.06\" width=\"2.79\" height=\"52.94\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"476.51\" y=\"289.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Inbound authZ</text><text x=\"476.51\" y=\"300.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Caller policy + scopes</text><text x=\"476.51\" y=\"310.83\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Operation allowlist TBD</text><rect x=\"468.84\" y=\"338.82\" width=\"98.37\" height=\"52.94\" rx=\"4.24\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"468.84\" y=\"338.82\" width=\"2.79\" height=\"52.94\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"476.51\" y=\"351.4\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Outbound target auth</text><text x=\"476.51\" y=\"362.71\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Separate target credential</text><text x=\"476.51\" y=\"372.59\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Exchange/delegation TBD</text><text x=\"470.23\" y=\"414.6\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Diagnostics: version · audit ID · timeout</text><text x=\"470.23\" y=\"430.48\" font-size=\"5.02\" font-weight=\"700\" fill=\"#1265AD\" text-anchor=\"start\">ONE selected gateway · no Portkey MCP</text><rect x=\"594.77\" y=\"215.29\" width=\"122.09\" height=\"65.29\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"215.29\" width=\"2.79\" height=\"65.29\" rx=\"1.12\" fill=\"#007F79\" stroke=\"none\"/><text x=\"602.44\" y=\"227.85\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP Finance · read</text><text x=\"602.44\" y=\"239.18\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">S/4 · Central Finance · BW</text><text x=\"602.44\" y=\"249.06\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Scoped read APIs</text><text x=\"602.44\" y=\"258.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">No direct database access</text><rect x=\"594.77\" y=\"291.18\" width=\"122.09\" height=\"58.24\" rx=\"4.23\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"291.18\" width=\"2.79\" height=\"58.24\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"602.44\" y=\"303.74\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP Finance · posting</text><text x=\"602.44\" y=\"315.06\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Restricted, typed API</text><text x=\"602.44\" y=\"324.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">S/4 default · TO VALIDATE</text><rect x=\"594.77\" y=\"358.24\" width=\"122.09\" height=\"37.06\" rx=\"4.24\" fill=\"#E5F5F2\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"358.24\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#007F79\" stroke=\"none\"/><text x=\"602.44\" y=\"370.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Databricks · read</text><text x=\"602.44\" y=\"382.12\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Approved SQL / API · UC grants</text><rect x=\"594.77\" y=\"405.88\" width=\"122.09\" height=\"32.47\" rx=\"4.24\" fill=\"#FBF7F1\" stroke=\"#A6825A\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"405.88\" width=\"2.79\" height=\"32.47\" rx=\"1.12\" fill=\"#A6825A\" stroke=\"none\"/><text x=\"602.44\" y=\"418.45\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">BDC · future read</text><text x=\"602.44\" y=\"429.77\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Optional approved MCP target</text><text x=\"594.77\" y=\"451.65\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Domain tool: owner · schema/version · input checks</text><text x=\"594.77\" y=\"462.24\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Per-operation authZ · bounded result · audit ID</text><rect x=\"744.77\" y=\"215.29\" width=\"125.58\" height=\"61.76\" rx=\"4.24\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"744.77\" y=\"215.29\" width=\"2.79\" height=\"61.76\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"752.44\" y=\"227.85\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">API Management</text><text x=\"752.44\" y=\"239.18\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Policies · API authorization</text><text x=\"752.44\" y=\"249.06\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Token exchange · scoped access</text><rect x=\"744.77\" y=\"287.65\" width=\"125.58\" height=\"61.76\" rx=\"4.24\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"744.77\" y=\"287.65\" width=\"2.79\" height=\"61.76\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"752.44\" y=\"300.21\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Cloud Integration</text><text x=\"752.44\" y=\"311.53\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Custom iFlows as needed</text><text x=\"752.44\" y=\"321.41\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Principal propagation candidate</text><text x=\"752.44\" y=\"331.3\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Route · error handling · trace</text><rect x=\"744.77\" y=\"360\" width=\"125.58\" height=\"58.24\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"744.77\" y=\"360\" width=\"2.79\" height=\"58.24\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"752.44\" y=\"372.56\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Destinations / connectivity</text><text x=\"752.44\" y=\"383.88\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">SAP API + identity mapping</text><text x=\"752.44\" y=\"393.77\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Backend ABAP auth still applies</text><text x=\"744.77\" y=\"435.77\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">API-managed direct or custom iFlow per target</text><text x=\"744.77\" y=\"448.12\" font-size=\"5.02\" fill=\"#7251AD\" text-anchor=\"start\">Identity mapping per backend: TO VALIDATE</text><rect x=\"896.51\" y=\"243.53\" width=\"45.35\" height=\"111.18\" rx=\"3.35\" fill=\"#F1ECFA\" stroke=\"#7251AD\" stroke-width=\"0.56\"/><rect x=\"896.51\" y=\"243.53\" width=\"2.79\" height=\"111.18\" rx=\"1.12\" fill=\"#7251AD\" stroke=\"none\"/><text x=\"904.19\" y=\"256.11\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Cloud</text><text x=\"904.19\" y=\"267.42\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Connector</text><text x=\"904.19\" y=\"277.3\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">private</text><text x=\"904.19\" y=\"287.18\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">network</text><text x=\"904.19\" y=\"297.07\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">only</text><text x=\"895.47\" y=\"374.01\" font-size=\"5.02\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">Private route</text><text x=\"895.47\" y=\"383.18\" font-size=\"5.02\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">and mapping</text><text x=\"895.47\" y=\"392.36\" font-size=\"5.02\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">need proof</text><rect x=\"968.02\" y=\"215.29\" width=\"202.33\" height=\"68.82\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"968.02\" y=\"215.29\" width=\"2.79\" height=\"68.82\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"975.7\" y=\"227.84\" font-size=\"7.25\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP S/4HANA</text><text x=\"975.7\" y=\"239.18\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Live G/L balances · journals · open items</text><text x=\"975.7\" y=\"249.06\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Custom ABAP read API · controlled posting API</text><text x=\"975.7\" y=\"258.94\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">SAP document reference + status</text><rect x=\"968.02\" y=\"294.71\" width=\"202.33\" height=\"68.82\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"968.02\" y=\"294.71\" width=\"2.79\" height=\"68.82\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"975.7\" y=\"307.26\" font-size=\"6.97\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP S/4HANA Central Finance</text><text x=\"975.7\" y=\"318.59\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Central posted / replicated accounting</text><text x=\"975.7\" y=\"328.47\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Source mapping · errors · status · cutoff</text><text x=\"975.7\" y=\"338.36\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Posting target not assumed</text><rect x=\"968.02\" y=\"374.12\" width=\"202.33\" height=\"68.82\" rx=\"4.23\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"968.02\" y=\"374.12\" width=\"2.79\" height=\"68.82\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"975.7\" y=\"386.66\" font-size=\"7.25\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP BW/4HANA</text><text x=\"975.7\" y=\"398\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Reporting aggregates / hierarchy</text><text x=\"975.7\" y=\"407.88\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Load and refresh status</text><text x=\"975.7\" y=\"417.77\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Read-only analytic role</text><text x=\"976.74\" y=\"273.42\" font-size=\"5.02\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">Mapped principal + ABAP roles: TO VALIDATE</text><text x=\"976.74\" y=\"352.83\" font-size=\"5.02\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">Mapped principal + ABAP roles: TO VALIDATE</text><text x=\"976.74\" y=\"432.24\" font-size=\"5.02\" font-weight=\"700\" fill=\"#7251AD\" text-anchor=\"start\">Mapped principal + ABAP roles: TO VALIDATE</text><line x1=\"117.91\" y1=\"300\" x2=\"144.07\" y2=\"300\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.4\"/><polygon points=\"137.09,291.18 144.07,308.82 130.12,308.82\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(137.09 300) rotate(90) translate(-137.09 -300)\"/><rect x=\"117.91\" y=\"282.71\" width=\"59.3\" height=\"12.71\" rx=\"3.18\" fill=\"#FFFFFF\" stroke=\"#C7D3DE\" stroke-width=\"0.28\"/><text x=\"125.42\" y=\"291.42\" font-size=\"5.02\" font-weight=\"700\" fill=\"#1265AD\" text-anchor=\"start\">intent · HTTPS</text><line x1=\"441.28\" y1=\"240\" x2=\"468.14\" y2=\"240\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.4\"/><polygon points=\"461.16,231.18 468.14,248.82 454.19,248.82\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(461.16 240) rotate(90) translate(-461.16 -240)\"/><line x1=\"567.56\" y1=\"240\" x2=\"594.07\" y2=\"240\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.4\"/><polygon points=\"587.09,231.18 594.07,248.82 580.12,248.82\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(587.09 240) rotate(90) translate(-587.09 -240)\"/><line x1=\"717.56\" y1=\"240\" x2=\"744.07\" y2=\"240\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.4\"/><polygon points=\"737.09,231.18 744.07,248.82 730.12,248.82\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(737.09 240) rotate(90) translate(-737.09 -240)\"/><line x1=\"807.56\" y1=\"277.06\" x2=\"807.56\" y2=\"286.94\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"0.84\"/><polygon points=\"807.56,276.35 811.74,286.94 803.37,286.94\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(807.56 281.65) rotate(180) translate(-807.56 -281.65)\"/><line x1=\"807.56\" y1=\"349.41\" x2=\"807.56\" y2=\"359.29\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"0.84\"/><polygon points=\"807.56,348.71 811.74,359.29 803.37,359.29\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(807.56 354) rotate(180) translate(-807.56 -354)\"/><line x1=\"840.7\" y1=\"277.06\" x2=\"840.7\" y2=\"286.94\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\"/><polygon points=\"840.7,276.35 844.88,286.94 836.51,286.94\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(840.7 281.65) rotate(180) translate(-840.7 -281.65)\"/><line x1=\"840.7\" y1=\"349.41\" x2=\"840.7\" y2=\"359.29\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\"/><polygon points=\"840.7,348.71 844.88,359.29 836.51,359.29\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(840.7 354) rotate(180) translate(-840.7 -354)\"/><line x1=\"870.35\" y1=\"247.06\" x2=\"883.26\" y2=\"247.06\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><line x1=\"883.26\" y1=\"210\" x2=\"883.26\" y2=\"247.06\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\" transform=\"translate(883.26 228.53) scale(1 -1) translate(-883.26 -228.53)\"/><line x1=\"883.26\" y1=\"210\" x2=\"952.33\" y2=\"210\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"210\" x2=\"952.33\" y2=\"249.53\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"249.53\" x2=\"967.33\" y2=\"249.53\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><polygon points=\"961.74,242.47 967.33,256.59 956.16,256.59\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(961.74 249.53) rotate(90) translate(-961.74 -249.53)\"/><line x1=\"952.33\" y1=\"249.53\" x2=\"952.33\" y2=\"328.24\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"328.24\" x2=\"967.33\" y2=\"328.24\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><polygon points=\"961.74,321.18 967.33,335.29 956.16,335.29\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(961.74 328.24) rotate(90) translate(-961.74 -328.24)\"/><line x1=\"952.33\" y1=\"328.24\" x2=\"952.33\" y2=\"407.65\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"407.65\" x2=\"967.33\" y2=\"407.65\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.12\"/><polygon points=\"961.74,400.59 967.33,414.71 956.16,414.71\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(961.74 407.65) rotate(90) translate(-961.74 -407.65)\"/><line x1=\"870.35\" y1=\"388.24\" x2=\"883.26\" y2=\"388.24\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"883.26\" y1=\"317.65\" x2=\"883.26\" y2=\"388.24\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(883.26 352.94) scale(1 -1) translate(-883.26 -352.94)\"/><line x1=\"883.26\" y1=\"317.65\" x2=\"895.81\" y2=\"317.65\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"891.63,312.35 895.81,322.94 887.44,322.94\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(891.63 317.65) rotate(90) translate(-891.63 -317.65)\"/><line x1=\"941.86\" y1=\"317.65\" x2=\"952.33\" y2=\"317.65\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"948.14,312.35 952.33,322.94 943.95,322.94\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(948.14 317.65) rotate(90) translate(-948.14 -317.65)\"/><text x=\"968.72\" y=\"462.95\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Direct API or iFlow/SCC route is selected per backend.</text><line x1=\"717.56\" y1=\"320.47\" x2=\"729.07\" y2=\"320.47\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><line x1=\"729.07\" y1=\"264.71\" x2=\"729.07\" y2=\"320.47\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\" transform=\"translate(729.07 292.59) scale(1 -1) translate(-729.07 -292.59)\"/><line x1=\"729.07\" y1=\"264.71\" x2=\"744.07\" y2=\"264.71\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><polygon points=\"738.49,257.65 744.07,271.76 732.91,271.76\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(738.49 264.71) rotate(90) translate(-738.49 -264.71)\"/><line x1=\"432.56\" y1=\"338.82\" x2=\"455.23\" y2=\"338.82\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><line x1=\"455.23\" y1=\"319.41\" x2=\"455.23\" y2=\"338.82\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\" transform=\"translate(455.23 329.12) scale(1 -1) translate(-455.23 -329.12)\"/><line x1=\"455.23\" y1=\"319.41\" x2=\"468.14\" y2=\"319.41\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><polygon points=\"462.56,312.35 468.14,326.47 456.98,326.47\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(462.56 319.41) rotate(90) translate(-462.56 -319.41)\"/><line x1=\"567.56\" y1=\"319.41\" x2=\"594.07\" y2=\"319.41\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><polygon points=\"588.49,312.35 594.07,326.47 582.91,326.47\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(588.49 319.41) rotate(90) translate(-588.49 -319.41)\"/><line x1=\"567.56\" y1=\"381.18\" x2=\"579.77\" y2=\"381.18\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"1.12\"/><line x1=\"579.77\" y1=\"381.18\" x2=\"579.77\" y2=\"390\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"1.12\"/><line x1=\"579.77\" y1=\"390\" x2=\"594.07\" y2=\"390\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"1.12\"/><polygon points=\"588.49,382.94 594.07,397.06 582.91,397.06\" fill=\"#007F79\" stroke=\"none\" transform=\"translate(588.49 390) rotate(90) translate(-588.49 -390)\"/><line x1=\"968.02\" y1=\"457.06\" x2=\"968.02\" y2=\"471.18\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"139.53\" y1=\"471.18\" x2=\"968.02\" y2=\"471.18\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(553.78 471.18) scale(-1 1) translate(-553.78 -471.18)\"/><polygon points=\"143.72,465.88 147.91,476.47 139.53,476.47\" fill=\"#007F79\" stroke=\"none\" transform=\"translate(143.72 471.18) rotate(270) translate(-143.72 -471.18)\"/><rect x=\"282.56\" y=\"457.06\" width=\"226.74\" height=\"12.71\" rx=\"3.18\" fill=\"#FFFFFF\" stroke=\"#C7D3DE\" stroke-width=\"0.28\"/><text x=\"312.77\" y=\"465.77\" font-size=\"5.02\" font-weight=\"700\" fill=\"#007F79\" text-anchor=\"start\">read results + source status return via same mediated path</text><rect x=\"20.93\" y=\"501.18\" width=\"415.12\" height=\"88.24\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"501.18\" width=\"415.12\" height=\"3.18\" rx=\"1.59\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"28.6\" y=\"517.94\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">B  LLM inference branch</text><text x=\"28.6\" y=\"529.65\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Selected, sanitized exception context only</text><rect x=\"29.65\" y=\"540\" width=\"160.47\" height=\"38.82\" rx=\"4.24\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"29.65\" y=\"540\" width=\"2.79\" height=\"38.82\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"37.33\" y=\"552.56\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Portkey · model governance</text><text x=\"37.33\" y=\"563.89\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Auth · routing · guardrails</text><text x=\"37.33\" y=\"573.77\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Redaction · logs · usage</text><rect x=\"244.19\" y=\"540\" width=\"181.4\" height=\"38.82\" rx=\"4.24\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.56\"/><rect x=\"244.19\" y=\"540\" width=\"2.79\" height=\"38.82\" rx=\"1.12\" fill=\"#1265AD\" stroke=\"none\"/><text x=\"251.86\" y=\"552.56\" font-size=\"6.41\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Amazon Bedrock · foundation model</text><text x=\"251.86\" y=\"563.89\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Approved model · explanation</text><text x=\"251.86\" y=\"573.77\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">No authoritative math / posting</text><line x1=\"190.12\" y1=\"559.41\" x2=\"243.49\" y2=\"559.41\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><polygon points=\"237.91,552.35 243.49,566.47 232.33,566.47\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(237.91 559.41) rotate(90) translate(-237.91 -559.41)\"/><line x1=\"190.81\" y1=\"571.76\" x2=\"244.19\" y2=\"571.76\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(217.5 571.76) scale(-1 1) translate(-217.5 -571.76)\"/><polygon points=\"195,566.47 199.19,577.06 190.81,577.06\" fill=\"#007F79\" stroke=\"none\" transform=\"translate(195 571.76) rotate(270) translate(-195 -571.76)\"/><line x1=\"209.3\" y1=\"362.47\" x2=\"209.3\" y2=\"367.06\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"132.56\" y1=\"367.06\" x2=\"209.3\" y2=\"367.06\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(170.93 367.06) scale(-1 1) translate(-170.93 -367.06)\"/><line x1=\"132.56\" y1=\"367.06\" x2=\"132.56\" y2=\"488.82\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"101.16\" y1=\"488.82\" x2=\"132.56\" y2=\"488.82\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(116.86 488.82) scale(-1 1) translate(-116.86 -488.82)\"/><line x1=\"101.16\" y1=\"488.82\" x2=\"101.16\" y2=\"539.29\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"101.16,528.71 105.35,539.29 96.98,539.29\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(101.16 534) rotate(180) translate(-101.16 -534)\"/><line x1=\"111.63\" y1=\"494.12\" x2=\"111.63\" y2=\"540\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(111.63 517.06) scale(1 -1) translate(-111.63 -517.06)\"/><line x1=\"111.63\" y1=\"494.12\" x2=\"127.33\" y2=\"494.12\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"127.33\" y1=\"370.59\" x2=\"127.33\" y2=\"494.12\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(127.33 432.35) scale(1 -1) translate(-127.33 -432.35)\"/><line x1=\"127.33\" y1=\"370.59\" x2=\"209.3\" y2=\"370.59\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"209.3\" y1=\"362.47\" x2=\"209.3\" y2=\"370.59\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(209.3 366.53) scale(1 -1) translate(-209.3 -366.53)\"/><polygon points=\"209.3,362.47 213.49,373.06 205.12,373.06\" fill=\"#007F79\" stroke=\"none\"/><text x=\"31.4\" y=\"585.77\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Minimized prompt; response via Portkey to Runtime; advisory only.</text><rect x=\"20.93\" y=\"603.53\" width=\"415.12\" height=\"95.29\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"603.53\" width=\"415.12\" height=\"3.18\" rx=\"1.59\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"28.6\" y=\"620.29\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">C  n8n approval side path</text><text x=\"28.6\" y=\"632\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Only for a proposed financial write</text><rect x=\"29.65\" y=\"640.59\" width=\"111.63\" height=\"37.06\" rx=\"4.24\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"29.65\" y=\"640.59\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"37.33\" y=\"653.15\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Finance approver</text><text x=\"37.33\" y=\"664.48\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Verified decision</text><text x=\"37.33\" y=\"674.36\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Approve / reject</text><rect x=\"160.47\" y=\"640.59\" width=\"111.63\" height=\"37.06\" rx=\"4.24\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"160.47\" y=\"640.59\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"168.14\" y=\"653.15\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">n8n workflow</text><text x=\"168.14\" y=\"664.48\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Case version + hash</text><text x=\"168.14\" y=\"674.36\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Trusted callback</text><rect x=\"291.28\" y=\"640.59\" width=\"132.56\" height=\"37.06\" rx=\"4.24\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.56\"/><rect x=\"291.28\" y=\"640.59\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"298.95\" y=\"653.15\" font-size=\"6.13\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Executor recheck</text><text x=\"298.95\" y=\"664.48\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">SAP state + authorization</text><text x=\"298.95\" y=\"674.36\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Idempotency / retry stop</text><line x1=\"141.98\" y1=\"649.41\" x2=\"160.47\" y2=\"649.41\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" transform=\"translate(151.22 649.41) scale(-1 1) translate(-151.22 -649.41)\"/><polygon points=\"146.16,644.12 150.35,654.71 141.98,654.71\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(146.16 649.41) rotate(270) translate(-146.16 -649.41)\"/><line x1=\"141.28\" y1=\"665.29\" x2=\"159.77\" y2=\"665.29\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><polygon points=\"154.19,658.24 159.77,672.35 148.6,672.35\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(154.19 665.29) rotate(90) translate(-154.19 -665.29)\"/><line x1=\"272.09\" y1=\"660\" x2=\"290.58\" y2=\"660\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.12\"/><polygon points=\"285,652.94 290.58,667.06 279.42,667.06\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(285 660) rotate(90) translate(-285 -660)\"/><line x1=\"380.23\" y1=\"355.41\" x2=\"380.23\" y2=\"365.29\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"380.23\" y1=\"365.29\" x2=\"437.79\" y2=\"365.29\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"437.79\" y1=\"365.29\" x2=\"437.79\" y2=\"494.12\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"437.79\" y1=\"494.12\" x2=\"441.28\" y2=\"494.12\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"441.28\" y1=\"494.12\" x2=\"441.28\" y2=\"608.82\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"216.28\" y1=\"608.82\" x2=\"441.28\" y2=\"608.82\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(328.78 608.82) scale(-1 1) translate(-328.78 -608.82)\"/><line x1=\"216.28\" y1=\"608.82\" x2=\"216.28\" y2=\"639.88\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"216.28,629.29 220.47,639.88 212.09,639.88\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(216.28 634.59) rotate(180) translate(-216.28 -634.59)\"/><line x1=\"359.3\" y1=\"598.24\" x2=\"359.3\" y2=\"640.59\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(359.3 619.41) scale(1 -1) translate(-359.3 -619.41)\"/><line x1=\"359.3\" y1=\"598.24\" x2=\"444.77\" y2=\"598.24\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"444.77\" y1=\"365.29\" x2=\"444.77\" y2=\"598.24\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(444.77 481.76) scale(1 -1) translate(-444.77 -481.76)\"/><line x1=\"362.79\" y1=\"365.29\" x2=\"444.77\" y2=\"365.29\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(403.78 365.29) scale(-1 1) translate(-403.78 -365.29)\"/><line x1=\"362.79\" y1=\"355.41\" x2=\"362.79\" y2=\"365.29\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(362.79 360.35) scale(1 -1) translate(-362.79 -360.35)\"/><polygon points=\"362.79,355.41 366.98,366 358.6,366\" fill=\"#E4781B\" stroke=\"none\"/><text x=\"29.65\" y=\"688.12\" font-size=\"5.02\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">n8n request → finance decision → exact-match callback → recheck → posting/audit.</text><rect x=\"446.51\" y=\"501.18\" width=\"352.33\" height=\"197.65\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"446.51\" y=\"501.18\" width=\"352.33\" height=\"3.18\" rx=\"1.59\" fill=\"#007F79\" stroke=\"none\"/><text x=\"454.19\" y=\"517.94\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">D  Enterprise Databricks</text><text x=\"454.19\" y=\"529.65\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Current governed history and evidence</text><rect x=\"455.23\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"455.23\" y=\"540\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#007F79\" stroke=\"none\"/><text x=\"462.91\" y=\"552.58\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Unity Catalog</text><text x=\"462.91\" y=\"563.89\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Grants + policy</text><rect x=\"566.86\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"566.86\" y=\"540\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#007F79\" stroke=\"none\"/><text x=\"574.53\" y=\"552.58\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Delta / Lakehouse</text><text x=\"574.53\" y=\"563.89\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Balances + snapshots</text><rect x=\"678.49\" y=\"540\" width=\"111.63\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"678.49\" y=\"540\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#007F79\" stroke=\"none\"/><text x=\"686.16\" y=\"552.58\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SQL Warehouse</text><text x=\"686.16\" y=\"563.89\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Scoped SQL</text><rect x=\"455.23\" y=\"592.94\" width=\"162.21\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"455.23\" y=\"592.94\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#007F79\" stroke=\"none\"/><text x=\"462.91\" y=\"605.52\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Data Engineering Pipelines</text><text x=\"462.91\" y=\"616.83\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Freshness + load status</text><rect x=\"627.91\" y=\"592.94\" width=\"162.21\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#007F79\" stroke-width=\"0.56\"/><rect x=\"627.91\" y=\"592.94\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#007F79\" stroke=\"none\"/><text x=\"635.58\" y=\"605.52\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">Approved API / MCP access</text><text x=\"635.58\" y=\"616.83\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Bounded read + audit</text><text x=\"455.23\" y=\"652.83\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Data ownership, freshness and stored results: TO VALIDATE.</text><text x=\"455.23\" y=\"666.95\" font-size=\"5.02\" fill=\"#7251AD\" text-anchor=\"start\">UC grants + OAuth / service principal or delegated identity.</text><line x1=\"655.12\" y1=\"395.29\" x2=\"655.12\" y2=\"487.06\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\"/><line x1=\"655.12\" y1=\"487.06\" x2=\"675\" y2=\"487.06\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\"/><line x1=\"675\" y1=\"487.06\" x2=\"675\" y2=\"585.88\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\"/><line x1=\"675\" y1=\"585.88\" x2=\"704.65\" y2=\"585.88\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\"/><line x1=\"704.65\" y1=\"585.88\" x2=\"704.65\" y2=\"592.24\" fill=\"none\" stroke=\"#007F79\" stroke-width=\"0.84\"/><polygon points=\"704.65,581.65 708.84,592.24 700.47,592.24\" fill=\"#007F79\" stroke=\"none\" transform=\"translate(704.65 586.94) rotate(180) translate(-704.65 -586.94)\"/><rect x=\"812.79\" y=\"501.18\" width=\"366.28\" height=\"197.65\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#A6825A\" stroke-width=\"0.56\"/><rect x=\"812.79\" y=\"501.18\" width=\"366.28\" height=\"3.18\" rx=\"1.59\" fill=\"#A6825A\" stroke=\"none\"/><text x=\"820.47\" y=\"517.94\" font-size=\"8.09\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">E  SAP Business Data Cloud</text><text x=\"820.47\" y=\"529.65\" font-size=\"5.3\" fill=\"#557086\" text-anchor=\"start\">Future state · entitlement and scope TO VALIDATE</text><rect x=\"821.51\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"3.53\" fill=\"#FBF7F1\" stroke=\"#A6825A\" stroke-width=\"0.28\"/><text x=\"846.35\" y=\"561.05\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP Datasphere</text><rect x=\"933.14\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"3.53\" fill=\"#FBF7F1\" stroke=\"#A6825A\" stroke-width=\"0.28\"/><text x=\"959.12\" y=\"561.05\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP Databricks</text><rect x=\"1044.77\" y=\"540\" width=\"125.58\" height=\"40.59\" rx=\"3.53\" fill=\"#FBF7F1\" stroke=\"#A6825A\" stroke-width=\"0.28\"/><text x=\"1063.08\" y=\"561.05\" font-size=\"5.86\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">SAP Analytics Cloud (SAC)</text><rect x=\"821.51\" y=\"592.94\" width=\"348.84\" height=\"52.94\" rx=\"4.24\" fill=\"#FBF7F1\" stroke=\"#A6825A\" stroke-width=\"0.56\"/><rect x=\"821.51\" y=\"592.94\" width=\"2.79\" height=\"52.94\" rx=\"1.12\" fill=\"#A6825A\" stroke=\"none\"/><text x=\"829.19\" y=\"605.49\" font-size=\"6.97\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">BDC Connect · zero-copy sharing</text><text x=\"829.19\" y=\"616.82\" font-size=\"5.58\" fill=\"#557086\" text-anchor=\"start\">Future governed link with existing enterprise Databricks</text><text x=\"829.19\" y=\"626.7\" font-size=\"5.58\" fill=\"#557086\" text-anchor=\"start\">Bidirectional data products via Delta Sharing</text><text x=\"829.19\" y=\"636.59\" font-size=\"5.58\" fill=\"#557086\" text-anchor=\"start\">Provisioning, grants and product scope TO VALIDATE</text><line x1=\"798.84\" y1=\"610.59\" x2=\"820.81\" y2=\"610.59\" fill=\"none\" stroke=\"#A6825A\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"816.63,605.29 820.81,615.88 812.44,615.88\" fill=\"#A6825A\" stroke=\"none\" transform=\"translate(816.63 610.59) rotate(90) translate(-816.63 -610.59)\"/><line x1=\"799.53\" y1=\"626.47\" x2=\"821.51\" y2=\"626.47\" fill=\"none\" stroke=\"#A6825A\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(810.52 626.47) scale(-1 1) translate(-810.52 -626.47)\"/><polygon points=\"803.72,621.18 807.91,631.76 799.53,631.76\" fill=\"#A6825A\" stroke=\"none\" transform=\"translate(803.72 626.47) rotate(270) translate(-803.72 -626.47)\"/><line x1=\"717.56\" y1=\"421.76\" x2=\"717.56\" y2=\"488.82\" fill=\"none\" stroke=\"#A6825A\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"717.56\" y1=\"488.82\" x2=\"973.26\" y2=\"488.82\" fill=\"none\" stroke=\"#A6825A\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"973.26\" y1=\"488.82\" x2=\"973.26\" y2=\"500.47\" fill=\"none\" stroke=\"#A6825A\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"973.26,489.88 977.44,500.47 969.07,500.47\" fill=\"#A6825A\" stroke=\"none\" transform=\"translate(973.26 495.18) rotate(180) translate(-973.26 -495.18)\"/><text x=\"821.51\" y=\"665.18\" font-size=\"5.3\" fill=\"#A6825A\" text-anchor=\"start\">Future retrieval through approved MCP capability, if selected.</text><ellipse cx=\"130.81\" cy=\"300\" rx=\"4.74\" ry=\"6\" fill=\"#1265AD\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"125.51\" y=\"302.36\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">1</text><ellipse cx=\"455.23\" cy=\"240\" rx=\"4.74\" ry=\"6\" fill=\"#1265AD\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"449.93\" y=\"242.36\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">2</text><ellipse cx=\"580.81\" cy=\"240\" rx=\"4.74\" ry=\"6\" fill=\"#1265AD\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"575.51\" y=\"242.36\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">3</text><ellipse cx=\"216.28\" cy=\"365.29\" rx=\"4.74\" ry=\"6\" fill=\"#1265AD\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"210.98\" y=\"367.65\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">4</text><ellipse cx=\"216.28\" cy=\"559.41\" rx=\"4.74\" ry=\"6\" fill=\"#E4781B\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"210.98\" y=\"561.77\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">5</text><ellipse cx=\"136.05\" cy=\"471.18\" rx=\"4.74\" ry=\"6\" fill=\"#007F79\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"130.74\" y=\"473.53\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">6</text><ellipse cx=\"150.7\" cy=\"665.29\" rx=\"4.74\" ry=\"6\" fill=\"#E4781B\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"145.4\" y=\"667.65\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">7</text><rect x=\"20.93\" y=\"709.41\" width=\"1158.14\" height=\"97.06\" rx=\"5.65\" fill=\"#FFFFFF\" stroke=\"#C7D3DE\" stroke-width=\"0.56\"/><text x=\"29.65\" y=\"725.85\" font-size=\"6.69\" font-weight=\"700\" fill=\"#103C68\" text-anchor=\"start\">WORKED EXAMPLE  ·  company code 1000  ·  ledger 0L  ·  Nov 2026  ·  illustrative USD $25,000 variance</text><rect x=\"29.65\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.28\"/><text x=\"35.23\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">1–2  Sign-in + scope</text><text x=\"35.23\" y=\"759.42\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">User → app → AgentCore</text><rect x=\"219.77\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.28\"/><text x=\"225.35\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">3  Current SAP reads</text><text x=\"225.35\" y=\"759.42\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">S/4 · Central Finance · BW</text><rect x=\"409.88\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.28\"/><text x=\"415.47\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">4  Reconcile</text><text x=\"415.47\" y=\"759.42\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Snapshot / timestamps / tolerance</text><rect x=\"600\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.28\"/><text x=\"605.58\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">5  Explain</text><text x=\"605.58\" y=\"759.42\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Sanitized context → model</text><rect x=\"790.12\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#EAF3FC\" stroke=\"#1265AD\" stroke-width=\"0.28\"/><text x=\"795.7\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">6  Read-only result</text><text x=\"795.7\" y=\"759.42\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">Evidence-backed answer</text><rect x=\"980.23\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#FFF1E5\" stroke=\"#E4781B\" stroke-width=\"0.28\"/><text x=\"985.81\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#17324D\" text-anchor=\"start\">7  If adjustment</text><text x=\"985.81\" y=\"759.42\" font-size=\"5.02\" fill=\"#557086\" text-anchor=\"start\">n8n → recheck → posting → audit</text><text x=\"29.65\" y=\"795.06\" font-size=\"5.3\" fill=\"#7251AD\" text-anchor=\"start\">L2 identity caveat: Integration Suite / custom iFlow propagation is a candidate; prove identity mapping and ABAP roles at each SAP backend.</text><line x1=\"30\" y1=\"818.12\" x2=\"52.33\" y2=\"818.12\" fill=\"none\" stroke=\"#1265AD\" stroke-width=\"1.4\"/><polygon points=\"45.35,809.29 52.33,826.94 38.37,826.94\" fill=\"#1265AD\" stroke=\"none\" transform=\"translate(45.35 818.12) rotate(90) translate(-45.35 -818.12)\"/><text x=\"57.56\" y=\"820.48\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">read / result</text><line x1=\"132.56\" y1=\"818.12\" x2=\"154.88\" y2=\"818.12\" fill=\"none\" stroke=\"#E4781B\" stroke-width=\"1.4\"/><polygon points=\"147.91,809.29 154.88,826.94 140.93,826.94\" fill=\"#E4781B\" stroke=\"none\" transform=\"translate(147.91 818.12) rotate(90) translate(-147.91 -818.12)\"/><text x=\"160.47\" y=\"820.48\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">approval-gated write</text><line x1=\"268.6\" y1=\"818.12\" x2=\"290.93\" y2=\"818.12\" fill=\"none\" stroke=\"#7251AD\" stroke-width=\"1.12\" stroke-dasharray=\"4.46 3.35\"/><polygon points=\"285.35,811.06 290.93,825.18 279.77,825.18\" fill=\"#7251AD\" stroke=\"none\" transform=\"translate(285.35 818.12) rotate(90) translate(-285.35 -818.12)\"/><text x=\"296.51\" y=\"820.48\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">identity / credentials</text><line x1=\"425.58\" y1=\"818.12\" x2=\"447.91\" y2=\"818.12\" fill=\"none\" stroke=\"#A6825A\" stroke-width=\"1.12\" stroke-dasharray=\"4.46 3.35\"/><polygon points=\"442.33,811.06 447.91,825.18 436.74,825.18\" fill=\"#A6825A\" stroke=\"none\" transform=\"translate(442.33 818.12) rotate(90) translate(-442.33 -818.12)\"/><text x=\"453.49\" y=\"820.48\" font-size=\"4.74\" fill=\"#557086\" text-anchor=\"start\">optional / future</text><text x=\"1062.35\" y=\"820.48\" font-size=\"4.74\" font-weight=\"700\" fill=\"#557086\" text-anchor=\"start\">S2 / L2  ·  22 NOV 2026  ·  REVIEW DRAFT</text></svg>\r\n", j = 1200, xe = 840, Se = 12, Ce = [2, 4], we = (e, t, n) => Math.min(n, Math.max(t, e)), M = {
	S1: {
		id: "S1",
		tab: "S1 · Google Apigee MCP",
		title: "S1 · Google Apigee MCP",
		svg: be,
		gateway: "Google Apigee MCP, external to AWS",
		summary: "The custom agent runs on Amazon Bedrock AgentCore Runtime and reaches the finance-owned domain MCP tools, SAP BAIP and the SAP backends through one MCP gateway: Google Apigee, outside the AWS boundary. Apigee applies inbound authorization and outbound target credentials; read paths return results over the same mediated path."
	},
	S2: {
		id: "S2",
		tab: "S2 · AgentCore Gateway MCP",
		title: "S2 · AgentCore Gateway MCP",
		svg: A,
		gateway: "AgentCore Gateway MCP, inside AWS",
		summary: "The same agent and downstream path, but the single MCP gateway is AgentCore Gateway inside the AWS trust boundary. Inbound authorization and outbound target credentials are applied by the gateway before the finance-owned domain MCP tools, SAP BAIP and the SAP backends."
	}
}, N = "Only MCP gateway placement and its inbound / outbound auth controls change. Agent logic, domain tools, SAP integration, data, model and approval paths remain equivalent.", Te = [
	[
		"Lane 03 MCP gateway",
		"Google Apigee · external to AWS",
		"AgentCore Gateway · inside AWS"
	],
	[
		"Trust boundary",
		"Gateway sits outside the AWS boundary",
		"AWS trust boundary encloses lanes 02 and 03"
	],
	[
		"MCP entry detail",
		"Apigee mode TBD",
		"Target type TBD"
	],
	[
		"Colour coding",
		"Gateway lane in orange (external)",
		"Gateway lane in blue (AWS)"
	],
	[
		"Common to both",
		"ONE selected gateway · no Portkey MCP",
		"ONE selected gateway · no Portkey MCP"
	]
], Ee = [
	"Delegation versus service identity: TO VALIDATE",
	"Integration Suite / iFlow identity propagation: TBD",
	"Mapped principal and ABAP roles at each SAP backend: TO VALIDATE",
	"Operation allowlist and outbound target credential or exchange: TBD",
	"Direct API versus iFlow / Cloud Connector route per backend; private route needs proof",
	"SAP Business Data Cloud and Databricks entitlement and scope: TO VALIDATE (future state)"
];
function De(e, t) {
	return e.replace("aria-labelledby=\"t d\"", `aria-labelledby="${t}-t ${t}-d"`).replace("id=\"t\"", `id="${t}-t"`).replace("id=\"d\"", `id="${t}-d"`);
}
function Oe(e) {
	return new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${e}`], { type: "image/svg+xml" });
}
function P({ diagram: e, uid: t, view: n, onView: r, onFit: i, expanded: a, onExpand: o, compact: s }) {
	let c = (0, b.useRef)(null), l = (0, b.useRef)(null), u = (0, b.useRef)(n), d = (0, b.useRef)({
		s: .5,
		x: 0,
		y: 0
	}), f = (0, b.useRef)(!0), p = (0, b.useRef)(/* @__PURE__ */ new Map()), m = (0, b.useRef)(null);
	u.current = n;
	let h = (0, b.useRef)(r), g = (0, b.useRef)(i);
	h.current = r, g.current = i;
	let _ = (0, b.useMemo)(() => De(e.svg, t), [e, t]), v = (0, b.useCallback)(() => {
		let e = c.current?.getBoundingClientRect();
		if (!e || !e.width || !e.height) return null;
		let t = Math.min((e.width - 16) / j, (e.height - 16) / xe);
		return {
			s: t,
			x: (e.width - j * t) / 2,
			y: (e.height - xe * t) / 2
		};
	}, []), y = (0, b.useCallback)(() => {
		let e = v();
		e && (d.current = e, f.current = !0, g.current(e));
	}, [v]);
	(0, b.useLayoutEffect)(() => {
		y();
	}, [
		y,
		a,
		e.id
	]), (0, b.useEffect)(() => {
		let e = c.current;
		if (!e || typeof ResizeObserver > "u") return;
		let t = new ResizeObserver(() => {
			if (f.current) y();
			else {
				let e = v();
				e && (d.current = e);
			}
		});
		return t.observe(e), () => t.disconnect();
	}, [y, v]);
	let S = (0, b.useCallback)((e, t, n) => {
		let r = u.current;
		if (!r) return;
		let i = Math.max(.05, d.current.s * .5), a = we(r.s * e, i, Se), o = a / r.s;
		f.current = !1, h.current({
			s: a,
			x: t - (t - r.x) * o,
			y: n - (n - r.y) * o
		});
	}, []), C = (e) => {
		let t = c.current.getBoundingClientRect();
		S(e, t.width / 2, t.height / 2);
	}, w = (e, t) => {
		let n = u.current;
		n && (f.current = !1, h.current({
			...n,
			x: n.x + e,
			y: n.y + t
		}));
	}, T = () => {
		let e = c.current.getBoundingClientRect(), t = u.current, n = 1 / t.s;
		f.current = !1;
		let r = e.width / 2, i = e.height / 2;
		h.current({
			s: 1,
			x: r - (r - t.x) * n,
			y: i - (i - t.y) * n
		});
	};
	(0, b.useEffect)(() => {
		let e = c.current;
		if (!e) return;
		let t = (t) => {
			t.preventDefault();
			let n = e.getBoundingClientRect(), r = t.deltaMode === 1 ? 32 : t.deltaMode === 2 ? 400 : 1;
			S(Math.exp(-t.deltaY * r * (t.ctrlKey ? .01 : .0016)), t.clientX - n.left, t.clientY - n.top);
		};
		return e.addEventListener("wheel", t, { passive: !1 }), () => e.removeEventListener("wheel", t);
	}, [S]);
	let ee = (e) => {
		if (!e.target.closest("button") && (c.current.setPointerCapture?.(e.pointerId), p.current.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY
		}), p.current.size === 2)) {
			let [e, t] = [...p.current.values()];
			m.current = Math.hypot(e.x - t.x, e.y - t.y);
		}
	}, E = (e) => {
		let t = p.current.get(e.pointerId);
		if (!t) return;
		let n = {
			x: e.clientX,
			y: e.clientY
		};
		if (p.current.size === 1) w(n.x - t.x, n.y - t.y);
		else if (p.current.size === 2 && m.current) {
			p.current.set(e.pointerId, n);
			let [t, r] = [...p.current.values()], i = Math.hypot(t.x - r.x, t.y - r.y), a = c.current.getBoundingClientRect();
			S(i / m.current, (t.x + r.x) / 2 - a.left, (t.y + r.y) / 2 - a.top), m.current = i;
			return;
		}
		p.current.set(e.pointerId, n);
	}, D = (e) => {
		p.current.delete(e.pointerId), p.current.size < 2 && (m.current = null);
	}, te = (e) => {
		if (e.key === "+" || e.key === "=") C(1.25);
		else if (e.key === "-" || e.key === "_") C(.8);
		else if (e.key === "0") y();
		else if (e.key === "1") T();
		else if (e.key === "ArrowLeft") w(60, 0);
		else if (e.key === "ArrowRight") w(-60, 0);
		else if (e.key === "ArrowUp") w(0, 60);
		else if (e.key === "ArrowDown") w(0, -60);
		else if (e.key === "Escape" && a) o(!1);
		else return;
		e.preventDefault(), e.stopPropagation();
	};
	(0, b.useEffect)(() => {
		if (!a) return;
		let e = (e) => {
			e.key === "Escape" && o(!1);
		};
		document.addEventListener("keydown", e);
		let t = () => {
			!document.fullscreenElement && a && o(!1);
		};
		return document.addEventListener("fullscreenchange", t), () => {
			document.removeEventListener("keydown", e), document.removeEventListener("fullscreenchange", t);
		};
	}, [a, o]);
	let ne = () => {
		if (a) document.fullscreenElement && document.exitFullscreen?.().catch(() => {}), o(!1);
		else {
			o(!0);
			try {
				l.current?.requestFullscreen?.().catch(() => {});
			} catch {}
		}
	}, O = () => {
		let t = URL.createObjectURL(Oe(e.svg));
		window.open(t, "_blank", "noopener"), setTimeout(() => URL.revokeObjectURL(t), 6e4);
	}, re = () => {
		let t = URL.createObjectURL(Oe(e.svg)), n = document.createElement("a");
		n.href = t, n.download = `${e.file || `finance-architecture-${e.id.toLowerCase()}`}.svg`, document.body.appendChild(n), n.click(), n.remove(), setTimeout(() => URL.revokeObjectURL(t), 1e3);
	}, ie = (t) => {
		let n = URL.createObjectURL(Oe(e.svg)), r = new Image();
		r.onload = () => {
			let i = document.createElement("canvas");
			i.width = j * t, i.height = xe * t, i.getContext("2d").drawImage(r, 0, 0, i.width, i.height), URL.revokeObjectURL(n), i.toBlob((n) => {
				if (!n) return;
				let r = URL.createObjectURL(n), i = document.createElement("a");
				i.href = r, i.download = `${e.file || `finance-architecture-${e.id.toLowerCase()}`}-${t}x.png`, document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
			}, "image/png");
		}, r.onerror = () => URL.revokeObjectURL(n), r.src = n;
	}, ae = Math.round((n?.s || 0) * 100), oe = n ? `translate(${n.x}px,${n.y}px) scale(${n.s})` : "none";
	return /* @__PURE__ */ (0, x.jsxs)("div", {
		ref: l,
		className: `dd-viewer ${a ? "expanded" : ""} ${s ? "compact" : ""}`,
		children: [/* @__PURE__ */ (0, x.jsxs)("div", {
			className: "dd-toolbar",
			role: "toolbar",
			"aria-label": `${e.title} viewer controls`,
			children: [/* @__PURE__ */ (0, x.jsxs)("strong", {
				className: "dd-viewer-title",
				children: [/* @__PURE__ */ (0, x.jsx)("span", {
					className: `dd-dot ${e.id.toLowerCase()}`,
					"aria-hidden": "true"
				}), e.title]
			}), /* @__PURE__ */ (0, x.jsxs)("div", {
				className: "dd-tools",
				children: [
					/* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: () => C(.8),
						"aria-label": `Zoom out ${e.id}`,
						title: "Zoom out (−)",
						children: "−"
					}),
					/* @__PURE__ */ (0, x.jsxs)("output", {
						className: "dd-zoom",
						"aria-live": "polite",
						"aria-label": `${e.id} zoom level`,
						children: [ae, "%"]
					}),
					/* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: () => C(1.25),
						"aria-label": `Zoom in ${e.id}`,
						title: "Zoom in (+)",
						children: "+"
					}),
					/* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: y,
						"aria-label": `Reset ${e.id} view to fit`,
						title: "Reset to fit (0)",
						children: "Reset"
					}),
					/* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: T,
						"aria-label": `${e.id} actual size`,
						title: "Actual size, 100% (1)",
						children: "100%"
					}),
					/* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: ne,
						"aria-label": a ? `Exit expanded ${e.id} view` : `Expand ${e.id} to full screen`,
						"aria-pressed": a,
						children: a ? "Close ✕" : "Expand ⤢"
					}),
					/* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: O,
						title: "Open the vector SVG in a new browser tab",
						children: "Open full-size ↗"
					}),
					/* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: re,
						title: "Download the vector SVG",
						children: "SVG ⤓"
					}),
					e.png && Ce.map((t) => /* @__PURE__ */ (0, x.jsxs)("button", {
						type: "button",
						onClick: () => ie(t),
						"aria-label": `Download ${e.id} as ${t}x PNG`,
						title: `Download a ${j * t} x ${xe * t} px PNG`,
						children: [
							"PNG ",
							t,
							"× ⤓"
						]
					}, t))
				]
			})]
		}), /* @__PURE__ */ (0, x.jsxs)("div", {
			ref: c,
			className: "dd-viewport",
			tabIndex: 0,
			role: "group",
			"aria-label": `${e.title} diagram. Scroll or pinch to zoom, drag to pan. Keys: plus and minus zoom, arrow keys pan, 0 resets, 1 actual size.`,
			onPointerDown: ee,
			onPointerMove: E,
			onPointerUp: D,
			onPointerCancel: D,
			onKeyDown: te,
			onDoubleClick: (e) => {
				if (e.target.closest("button")) return;
				let t = c.current.getBoundingClientRect();
				S(1.8, e.clientX - t.left, e.clientY - t.top);
			},
			children: [/* @__PURE__ */ (0, x.jsx)("div", {
				className: "dd-stage",
				"data-testid": `diagram-${e.id}`,
				style: {
					width: j,
					height: xe,
					transform: oe
				},
				dangerouslySetInnerHTML: { __html: _ }
			}), /* @__PURE__ */ (0, x.jsx)("span", {
				className: "dd-hint",
				"aria-hidden": "true",
				children: "Scroll to zoom · drag to pan · double-click to zoom in"
			})]
		})]
	});
}
function ke({ view: e = "S1", onView: t, onBack: n }) {
	let [r, i] = (0, b.useState)(null), [a, o] = (0, b.useState)(null), [s, c] = (0, b.useState)(!0), [l, u] = (0, b.useState)(null), d = e === "compare", f = (e) => {
		u(null), t(e);
	}, p = M[d ? "S1" : e] || M.S1, m = (0, b.useCallback)((e) => {
		i(e), o(e);
	}, []), h = ["S1", "S2"];
	return /* @__PURE__ */ (0, x.jsxs)("main", {
		className: "detailed-diagrams",
		"aria-label": "Detailed architecture diagrams",
		children: [
			/* @__PURE__ */ (0, x.jsxs)("header", {
				className: "surface dd-header",
				children: [
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "dd-title",
						children: [/* @__PURE__ */ (0, x.jsx)("span", {
							className: "eyebrow",
							children: "ARCHITECTURE DIAGRAMS · DETAILED L2 REFERENCE"
						}), /* @__PURE__ */ (0, x.jsx)("h2", { children: d ? "S1 and S2 side by side" : p.title })]
					}),
					/* @__PURE__ */ (0, x.jsx)("nav", {
						className: "dd-selector",
						role: "tablist",
						"aria-label": "Detailed diagram selection",
						children: [...h, "compare"].map((t) => /* @__PURE__ */ (0, x.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": e === t,
							className: e === t ? "active" : "",
							onClick: () => f(t),
							children: t === "compare" ? "Compare side-by-side" : M[t].tab
						}, t))
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "dd-header-actions",
						children: [/* @__PURE__ */ (0, x.jsx)("span", {
							className: "pill warn",
							children: "PROPOSED DESIGN · REVIEW DRAFT · NOT TENANT-VERIFIED"
						}), /* @__PURE__ */ (0, x.jsx)("button", {
							type: "button",
							onClick: n,
							children: "← Architecture pros & cons"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, x.jsxs)("section", {
				className: "surface dd-summary",
				"aria-label": "Diagram summary",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
					className: "eyebrow",
					children: d ? "WHAT THIS VIEW SHOWS" : `${p.id} · MCP GATEWAY`
				}), /* @__PURE__ */ (0, x.jsx)("p", { children: d ? "Both detailed diagrams share one worked month-end reconciliation path. Use the synchronized viewers to inspect lane 03 (MCP gateway) and the AWS trust boundary, where they differ." : p.summary })] }), /* @__PURE__ */ (0, x.jsxs)("div", {
					className: "dd-invariant",
					children: [/* @__PURE__ */ (0, x.jsx)("span", {
						className: "eyebrow",
						children: "SCENARIO INVARIANT"
					}), /* @__PURE__ */ (0, x.jsx)("p", { children: N })]
				})]
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: `dd-body ${d ? "is-compare" : ""}`,
				children: [d ? /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "dd-compare-bar surface",
					children: [/* @__PURE__ */ (0, x.jsxs)("label", { children: [/* @__PURE__ */ (0, x.jsx)("input", {
						type: "checkbox",
						checked: s,
						onChange: (e) => c(e.target.checked)
					}), " Synchronize zoom and pan"] }), /* @__PURE__ */ (0, x.jsx)("span", { children: "Zoom into lane 03 and the AWS trust boundary to see where the two options differ." })]
				}), /* @__PURE__ */ (0, x.jsx)("div", {
					className: "dd-compare-grid",
					children: h.map((e, t) => /* @__PURE__ */ (0, x.jsx)(P, {
						diagram: M[e],
						uid: `dd-${e}-cmp`,
						compact: !0,
						view: t === 0 ? r : a,
						onView: (e) => {
							s ? m(e) : (t === 0 ? i : o)(e);
						},
						onFit: (e) => {
							s ? m(e) : (t === 0 ? i : o)(e);
						},
						expanded: l === e,
						onExpand: (t) => u(t ? e : null)
					}, e))
				})] }) : /* @__PURE__ */ (0, x.jsx)(P, {
					diagram: p,
					uid: `dd-${p.id}`,
					view: r,
					onView: i,
					onFit: i,
					expanded: l === p.id,
					onExpand: (e) => u(e ? p.id : null)
				}, p.id), /* @__PURE__ */ (0, x.jsxs)("aside", {
					className: "surface dd-side",
					"aria-label": "Key differences and open validations",
					children: [
						/* @__PURE__ */ (0, x.jsx)("h3", { children: "What changes between S1 and S2" }),
						/* @__PURE__ */ (0, x.jsxs)("table", { children: [/* @__PURE__ */ (0, x.jsx)("thead", { children: /* @__PURE__ */ (0, x.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, x.jsx)("th", {
								scope: "col",
								children: "Item"
							}),
							/* @__PURE__ */ (0, x.jsx)("th", {
								scope: "col",
								children: "S1"
							}),
							/* @__PURE__ */ (0, x.jsx)("th", {
								scope: "col",
								children: "S2"
							})
						] }) }), /* @__PURE__ */ (0, x.jsx)("tbody", { children: Te.map(([t, n, r]) => /* @__PURE__ */ (0, x.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, x.jsx)("th", {
								scope: "row",
								children: t
							}),
							/* @__PURE__ */ (0, x.jsx)("td", {
								className: e === "S2" ? "dim" : "",
								children: n
							}),
							/* @__PURE__ */ (0, x.jsx)("td", {
								className: e === "S1" ? "dim" : "",
								children: r
							})
						] }, t)) })] }),
						/* @__PURE__ */ (0, x.jsx)("h3", { children: "Open validations shown in the diagram" }),
						/* @__PURE__ */ (0, x.jsx)("ul", { children: Ee.map((e) => /* @__PURE__ */ (0, x.jsx)("li", { children: e }, e)) }),
						/* @__PURE__ */ (0, x.jsx)("p", {
							className: "micro",
							children: "Vendor-named components are design projections, not connected services. S3 has no detailed diagram in the supplied reference."
						}),
						/* @__PURE__ */ (0, x.jsx)("button", {
							type: "button",
							className: "text-link",
							onClick: n,
							children: "Back to architecture pros & cons →"
						})
					]
				})]
			})
		]
	});
}
// src/mcpScenarios.js
var Ae = "2026-11-24", je = "TBD — REQUIRES VALIDATION", Me = {
	S1: {
		id: "S1",
		label: "S1 · Google Apigee MCP",
		short: "Apigee only",
		chain: "Agent runtime (MCP client) → Apigee MCP endpoint → SAP-facing domain capability → SAP Integration Suite → SAP backend",
		summary: "One MCP gateway, Google Apigee, exposes the SAP Finance domain tools. The baseline is the Apigee-managed pattern: an MCP proxy derives its tools from OpenAPI operations that front SAP Integration Suite APIs. Apigee does not run arbitrary Python MCP-server code; a coded domain MCP server would live on a separate runtime that Apigee proxies.",
		baseline: "Baseline: Apigee-managed, API-backed MCP exposure. Alternative: separately hosted domain MCP server governed through Apigee (runtime TBD)."
	},
	S2: {
		id: "S2",
		label: "S2 · AWS AgentCore MCP",
		short: "AgentCore only",
		chain: "Agent runtime (MCP client) → AgentCore Gateway → Finance domain MCP server / gateway target → SAP Integration Suite → SAP backend",
		summary: "One MCP gateway, AgentCore Gateway, fronts the Finance domain MCP capability. The gateway routes and authorizes; it does not execute custom tool code. A coded Finance MCP server runs on AgentCore Runtime (container, MCP protocol), or the gateway generates tools from supported API or function targets. AWS Agent Registry is a separate discovery layer.",
		baseline: "Baseline: custom Finance MCP server on AgentCore Runtime registered as a gateway MCP-server target. Alternative: gateway-generated tools from an OpenAPI or function target."
	},
	S3: {
		id: "S3",
		label: "S3 · AgentCore Gateway + Google Apigee",
		short: "Hybrid",
		chain: "Agent runtime (MCP client) → AgentCore Gateway → Apigee MCP endpoint → SAP-facing domain capability → SAP Integration Suite → SAP backend",
		summary: "Two gateways in series. AgentCore Gateway is the enterprise agent entry on the AWS side; Apigee remains the SAP-domain MCP endpoint, so Finance-specific logic stays on the SAP-facing side. The AgentCore-to-Apigee hop is a gateway MCP-server target whose protocol and token-exchange behaviour is documented separately by each vendor and unproven together.",
		baseline: "Baseline: Apigee owns the SAP-domain MCP interface; AgentCore Gateway holds a reference. Cross-gateway protocol, identity exchange and registry sync are open dependencies."
	}
}, Ne = [
	"S1",
	"S2",
	"S3"
], Pe = [
	["MCP client", "Agent-side component that discovers and invokes MCP tools."],
	["MCP server", "Protocol endpoint exposing tools and resources over MCP."],
	["Domain MCP server", "Business-domain MCP implementation, e.g. SAP Finance read or posting."],
	["MCP gateway", "Governed entry point that routes, authorizes and may aggregate MCP capabilities. It is not necessarily where tool logic runs."],
	["MCP registry", "Catalog and discovery of MCP servers and tool metadata. Never an invocation hop."],
	["Artifact repository", "Versioned source, specifications and configuration (Git, container registry)."],
	["Runtime", "Platform that executes domain logic or MCP-server software."],
	["Backend integration", "API, integration flow or adapter reaching enterprise applications (SAP Integration Suite)."],
	["Agent runtime", "Compute and orchestration platform running the agent. Independent of MCP hosting."],
	["Model runtime", "LLM inference provider. Independent of MCP hosting."]
], Fe = [
	[
		"Agent development environment",
		`Enterprise-approved pro-code (Python) agent environment. ${je}`,
		`Same as S1. ${je}`,
		`Same as S1. ${je}`
	],
	[
		"Agent hosting runtime",
		"Independent of the MCP choice. Demo assumption: AgentCore Runtime. Apigee does not require a Google-hosted agent.",
		"Independent of the MCP choice. AgentCore Runtime is a natural but not mandatory host; choosing AgentCore Gateway does not force it.",
		"Independent of the MCP choice. Demo assumption: AgentCore Runtime; enterprise Agent Platform or SAP BTP possible."
	],
	[
		"MCP client location",
		"Inside the agent process on the agent runtime.",
		"Inside the agent process on the agent runtime.",
		"Inside the agent process on the agent runtime; the gateway also acts as a client toward Apigee."
	],
	[
		"MCP gateway",
		"Google Apigee: MCP proxy (Discovery Proxy template) with OAuth and API-product policies.",
		"AgentCore Gateway: inbound authorizer and outbound credential provider; routes to targets.",
		"Two gateways in series: AgentCore Gateway (agent entry), then Apigee (SAP-domain endpoint)."
	],
	[
		"Finance domain MCP server creation",
		"Baseline: tools derived from OpenAPI 3.0.x operations by the SAP integration/API team. A coded server only in the external-server alternative.",
		"Baseline: coded Finance MCP server by finance engineering. Alternative: gateway-generated tools from an OpenAPI or function target.",
		"Created on the Apigee side as in S1. AgentCore does not recreate it."
	],
	[
		"Finance domain MCP server hosting",
		"Apigee-managed proxy runtime. Not a general Python compute platform. A coded server needs a separate runtime behind Apigee (TBD).",
		"AgentCore Runtime container (MCP protocol, ARM64, port 8000) or none when the gateway generates tools.",
		"Apigee-managed runtime, as S1."
	],
	[
		"MCP server runtime endpoint",
		"Apigee MCP endpoint at <apigee-host>/<mcp-basepath> (conceptual placeholder, not a tenant address).",
		"Gateway MCP URL <gateway-id>.gateway…/mcp; Runtime target at /invocations (conceptual placeholders).",
		"AgentCore Gateway URL for agents; Apigee endpoint URL held as a gateway target (placeholders)."
	],
	[
		"MCP tool definitions",
		"Derived from OpenAPI operations; exposed set limited by API products.",
		"tools/list from the coded server, or from the target schema when gateway-generated.",
		"Tools originate in Apigee; surfaced through the gateway. Name prefixing and collisions: TO VALIDATE."
	],
	[
		"MCP registry and discovery",
		"Apigee API hub imports MCP proxies and parses specs into tools; syncs to Google Agent Registry (enabled by default; maturity TO VALIDATE).",
		"AWS Agent Registry (agent-registry namespace) is a separate discovery and approval layer. Only approved records are discoverable.",
		"API hub is the proposed SAP-domain source of truth. AWS Agent Registry would hold a reference. No automatic cross-platform sync is documented."
	],
	[
		"Enterprise registry / approval authority",
		`Enterprise AI Foundry publication approval. ${je}`,
		`Enterprise AI Foundry, or the AWS Agent Registry curator role. ${je}`,
		`Enterprise AI Foundry as the single approver across both catalogs. ${je}`
	],
	[
		"Source-code repository",
		`Organization Git repository for specs, tool definitions, policies and tests. ${je}`,
		`Organization Git repository for server source, target schemas and infrastructure code. ${je}`,
		`Organization Git repository covering both sides. ${je}`
	],
	[
		"MCP specifications and versioned artifacts",
		"OpenAPI spec versions, Apigee proxy bundles, API products, test collections.",
		"MCP server source, target schemas, gateway and target definitions as code.",
		"Union of S1 and S2 artifacts, plus a written cross-gateway interface contract."
	],
	[
		"Container / package artifact storage",
		"Not needed for the baseline. Needed only if an external coded server is chosen (TBD).",
		"Container registry (Amazon ECR) for the Runtime image.",
		"Not needed on the AWS side unless an AWS-hosted adapter is added."
	],
	[
		"Gateway-target configuration",
		"Proxy target endpoint resolves to the SAP-facing Integration Suite API.",
		"Gateway target of type MCP server (or OpenAPI/function) with a credential provider configuration.",
		"AgentCore target of type MCP server pointing at the Apigee endpoint. Compatibility must be proven."
	],
	[
		"Authentication and token management",
		"Inbound: OAuth 2.1 / OIDC bearer or API key per API product. Outbound to Integration Suite: TBD.",
		"Inbound: JWT authorizer or IAM. Outbound to MCP targets: OAuth (client credentials, authorization code, token exchange), API key or gateway role; AgentCore Identity holds providers.",
		"Two token hops. Agent-to-AgentCore-to-Apigee token exchange and user-context carry-over are unproven."
	],
	[
		"SAP integration layer",
		"SAP Integration Suite (API and iFlow). An Integration Suite MCP Server artifact is a separate option, not assumed.",
		"Same as S1.",
		"Same as S1."
	],
	[
		"Backend authorization boundary",
		"ABAP roles of the mapped user or service identity. Principal propagation not proven in the tenant.",
		"Same as S1.",
		"Same as S1; the extra hop adds one more identity-mapping point."
	],
	[
		"Logging, monitoring and audit evidence",
		"Apigee analytics and logging, Integration Suite monitoring, SAP change documents.",
		"AgentCore Gateway and Runtime observability, Integration Suite monitoring, SAP change documents.",
		`Two gateway logs. Correlation across them needs a propagated trace id. ${je}`
	],
	[
		"Deployment ownership",
		"SAP integration / API platform team deploys proxies and products.",
		"Finance engineering and cloud platform team deploy the container and gateway targets.",
		"Split ownership between both teams plus an interface-contract owner."
	],
	[
		"Cost and operational responsibility",
		"Apigee licensing and operations plus Integration Suite. Unmeasured.",
		"AgentCore Runtime, Gateway and Registry consumption plus ECR. Unmeasured.",
		"Both stacks plus cross-cloud traffic and latency. Unmeasured."
	],
	[
		"Release prerequisites and outstanding decisions",
		"Apigee MCP enabled for the organization (optional switch on hybrid), OpenAPI 3.0.x, direct-access policy, API hub and registry scope.",
		"Region availability, Agent Registry status and namespace, choice of coded server or generated tools.",
		"Gateway-to-Apigee protocol and auth proof, ownership of double policy, registry synchronization method."
	]
], Ie = [
	"Source",
	"Destination",
	"Endpoint type",
	"Protocol",
	"MCP role",
	"Endpoint owner",
	"Hosting location",
	"Authentication",
	"Identity context",
	"Network boundary",
	"Read / write",
	"Registry reference",
	"Verification"
], Le = "Vendor-documented · tenant NOT_VERIFIED", Re = "Design assumption", ze = je, Be = "Read tools default; write tools only via the separate posting domain", Ve = {
	S1: [
		[
			"Agent MCP client",
			"Apigee MCP endpoint",
			"MCP endpoint",
			"MCP over Streamable HTTP (JSON-RPC 2.0)",
			"client → server",
			"SAP integration / API platform team",
			"Apigee (Google-managed)",
			"OAuth 2.1 / OIDC bearer, or API key per API product",
			"Agent identity; end-user delegation TO VALIDATE",
			"Agent runtime network → Apigee ingress; private path TBD",
			Be,
			"API hub entry",
			Le
		],
		[
			"Apigee MCP proxy",
			"SAP-facing domain API",
			"API proxy target",
			"HTTPS, OpenAPI operation",
			"tool call mapped to API call",
			"SAP integration / API platform team",
			"Apigee",
			"Target credentials held by Apigee: TBD",
			"Mapped technical or user identity: TBD",
			"Apigee → Integration Suite",
			Be,
			"OpenAPI spec in API hub",
			ze
		],
		[
			"SAP-facing domain API",
			"SAP Integration Suite",
			"API / iFlow",
			"HTTPS REST or OData",
			"backend integration",
			"SAP integration team",
			"SAP Integration Suite",
			"OAuth client or certificate",
			"Technical user or propagated principal",
			"Customer / SAP BTP boundary",
			Be,
			"None (not a registry object)",
			Re
		],
		[
			"SAP Integration Suite",
			"SAP S/4HANA · Central Finance · BW/4HANA",
			"Backend interface",
			"RFC / OData via Cloud Connector, or direct",
			"backend integration",
			"SAP basis and finance",
			"Customer SAP landscape",
			"Principal propagation or technical user",
			"ABAP roles of the mapped user",
			"Cloud Connector or private link: needs proof",
			"Read-only in the demo; posting needs a separate approval path",
			"None",
			ze
		],
		[
			"Apigee API hub",
			"Google Agent Registry",
			"Registry sync (not invocation)",
			"Metadata sync",
			"catalog → catalog",
			"Google Cloud platform team",
			"Google Cloud",
			"Google IAM",
			"Platform service identity",
			"Google Cloud internal",
			"Metadata only",
			"Registry sync (default on)",
			"Vendor-documented · maturity TO VALIDATE"
		],
		[
			"Agent runtime",
			"API hub / Agent Registry",
			"Discovery lookup (not invocation)",
			"Registry API or registry MCP endpoint",
			"client → catalog",
			"Enterprise AI Foundry (TBD)",
			"Google Cloud",
			"Google IAM or OAuth",
			"Agent identity",
			"Agent runtime → Google APIs",
			"Metadata only",
			"API hub / Agent Registry",
			ze
		],
		[
			"Git and CI/CD",
			"Apigee organization",
			"Deployment (not invocation)",
			"Apigee management API",
			"artifact publication",
			"SAP integration team",
			"Organization CI/CD",
			"Pipeline service account",
			"Deployment identity",
			"CI/CD → Apigee management plane",
			"Not applicable",
			"Spec registered in API hub",
			Re
		]
	],
	S2: [
		[
			"Agent MCP client",
			"AgentCore Gateway",
			"MCP endpoint",
			"MCP over Streamable HTTP",
			"client → server",
			"Cloud platform team",
			"AWS (gateway)",
			"JWT bearer validated by the gateway authorizer, or IAM",
			"Agent identity; end-user delegation TO VALIDATE",
			"Agent runtime → AWS gateway endpoint",
			Be,
			"Registry record (optional)",
			Le
		],
		[
			"AgentCore Gateway",
			"Finance domain MCP server (AgentCore Runtime)",
			"Gateway MCP-server target",
			"MCP over Streamable HTTP to the Runtime /invocations URL",
			"client → server",
			"Finance engineering",
			"AgentCore Runtime (container)",
			"Outbound OAuth, API key or gateway role from an AgentCore Identity credential provider",
			"Gateway service identity or exchanged token: TBD",
			"Inside the AWS account",
			Be,
			"Registry record",
			Le
		],
		[
			"AgentCore Gateway",
			"Gateway-generated tools (alternative)",
			"OpenAPI / function target",
			"HTTPS, target schema",
			"tool call mapped to API call",
			"Finance engineering",
			"AgentCore Gateway",
			"Credential provider per target",
			"TBD",
			"AWS → target API",
			Be,
			"Registry record",
			"Alternative; " + Le.toLowerCase()
		],
		[
			"Finance domain MCP server",
			"SAP Integration Suite",
			"API / iFlow",
			"HTTPS REST or OData",
			"backend integration",
			"SAP integration team",
			"SAP Integration Suite",
			"OAuth client or certificate",
			"Technical user or propagated principal",
			"AWS → SAP BTP; private route needs proof",
			Be,
			"None",
			ze
		],
		[
			"SAP Integration Suite",
			"SAP S/4HANA · Central Finance · BW/4HANA",
			"Backend interface",
			"RFC / OData via Cloud Connector, or direct",
			"backend integration",
			"SAP basis and finance",
			"Customer SAP landscape",
			"Principal propagation or technical user",
			"ABAP roles of the mapped user",
			"Cloud Connector or private link: needs proof",
			"Read-only in the demo; posting needs a separate approval path",
			"None",
			ze
		],
		[
			"Agent runtime",
			"AWS Agent Registry",
			"Discovery lookup (not invocation)",
			"Registry MCP endpoint or API",
			"client → catalog",
			"Enterprise AI Foundry or registry curator",
			"AWS",
			"Bearer token or IAM",
			"Agent identity",
			"Agent runtime → AWS",
			"Metadata only; approved records only",
			"agent-registry namespace",
			Le
		],
		[
			"Git and CI/CD",
			"AgentCore Runtime, container registry and gateway targets",
			"Deployment (not invocation)",
			"AWS control-plane API",
			"artifact publication",
			"Cloud platform team",
			"Organization CI/CD",
			"Pipeline role",
			"Deployment identity",
			"CI/CD → AWS control plane",
			"Not applicable",
			"Record submitted for approval",
			Re
		]
	],
	S3: [
		[
			"Agent MCP client",
			"AgentCore Gateway",
			"MCP endpoint",
			"MCP over Streamable HTTP",
			"client → server",
			"Cloud platform team",
			"AWS (gateway)",
			"JWT bearer validated by the gateway authorizer, or IAM",
			"Agent identity; end-user delegation TO VALIDATE",
			"Agent runtime → AWS gateway endpoint",
			Be,
			"AWS Agent Registry reference",
			Le
		],
		[
			"AgentCore Gateway",
			"Apigee MCP endpoint",
			"Gateway MCP-server target (cross-cloud)",
			"MCP over Streamable HTTP; version compatibility unproven",
			"client → server",
			"SAP integration / API platform team",
			"Apigee (Google-managed)",
			"Outbound OAuth (client credentials, authorization code or token exchange) or API key; Apigee must accept it",
			"Token exchange and user-context carry-over: unproven",
			"AWS → Google ingress; egress and latency unmeasured",
			Be,
			"API hub entry; AWS record is a manual reference",
			ze
		],
		[
			"Apigee MCP proxy",
			"SAP-facing domain API",
			"API proxy target",
			"HTTPS, OpenAPI operation",
			"tool call mapped to API call",
			"SAP integration / API platform team",
			"Apigee",
			"Target credentials held by Apigee: TBD",
			"Mapped technical or user identity: TBD",
			"Apigee → Integration Suite",
			Be,
			"OpenAPI spec in API hub",
			ze
		],
		[
			"SAP-facing domain API",
			"SAP Integration Suite",
			"API / iFlow",
			"HTTPS REST or OData",
			"backend integration",
			"SAP integration team",
			"SAP Integration Suite",
			"OAuth client or certificate",
			"Technical user or propagated principal",
			"Customer / SAP BTP boundary",
			Be,
			"None",
			Re
		],
		[
			"SAP Integration Suite",
			"SAP S/4HANA · Central Finance · BW/4HANA",
			"Backend interface",
			"RFC / OData via Cloud Connector, or direct",
			"backend integration",
			"SAP basis and finance",
			"Customer SAP landscape",
			"Principal propagation or technical user",
			"ABAP roles of the mapped user",
			"Cloud Connector or private link: needs proof",
			"Read-only in the demo; posting needs a separate approval path",
			"None",
			ze
		],
		[
			"Apigee API hub",
			"AWS Agent Registry",
			"Registry publication (not invocation)",
			"Manual registration or custom synchronization",
			"catalog → catalog",
			"Enterprise AI Foundry (TBD)",
			"Across clouds",
			"Both platforms' IAM",
			"Platform identity",
			"Cross-cloud",
			"Metadata only",
			"No automatic sync documented; implementation dependency",
			ze
		],
		[
			"Git and CI/CD",
			"Apigee organization and AWS gateway target",
			"Deployment (not invocation)",
			"Apigee management API and AWS control-plane API",
			"artifact publication",
			"Both platform teams",
			"Organization CI/CD",
			"Pipeline identities",
			"Deployment identity",
			"CI/CD → both control planes",
			"Not applicable",
			"Specs in API hub; reference record in AWS",
			Re
		]
	]
}, He = [
	{
		name: "Finance Read MCP",
		mode: "READ",
		tools: "Reconciliation balances · ledger and period data · approved journal and document status · reconciliation exceptions · approved analytics",
		control: "Own scope and role. Read-only backend operations. No write tool is registered in this domain."
	},
	{
		name: "Finance Posting MCP",
		mode: "WRITE · APPROVAL-GATED",
		tools: "Propose reconciliation adjustment · invoke governed approval · validate posting authorization · post via approved SAP business API · read posting confirmation and audit evidence",
		control: "Separate authorization from read. A proposal does not post. Posting needs a business approval, an agent and gateway allowance, an SAP user authorization, idempotency and a posting-period check. The demo never posts."
	},
	{
		name: "Analytical / Data MCP",
		mode: "READ · FUTURE",
		tools: "Authorized Databricks or BDC-backed context · governed snapshots and support data",
		control: "Data owner and freshness stated per source. Entitlement and scope: TO VALIDATE."
	}
], Ue = [
	[
		"Approved enterprise Agent Platform / AI Foundry",
		"Conditional · remote MCP endpoint reachable",
		"Conditional · remote MCP endpoint reachable",
		"Tenant validation"
	],
	[
		"AWS AgentCore Runtime",
		"Conditional · calls Apigee as a remote MCP server",
		"Documented · native fit",
		"Documented for runtime and gateway; Apigee hop needs proof"
	],
	[
		"SAP BTP pro-code runtime",
		"Conditional · remote MCP endpoint reachable",
		"Tenant validation",
		"Tenant validation"
	],
	[
		"Microsoft Foundry hosted agent",
		"Tenant validation",
		"Tenant validation",
		"Tenant validation"
	],
	[
		"Joule Studio",
		"Tenant validation · eligibility TBD",
		"Not recommended without proof",
		"Not recommended without proof"
	]
], We = [
	[
		"MCP development effort",
		"Low if tools derive from OpenAPI; higher for a coded server",
		"Medium: coded server plus container and target setup",
		"Highest: both stacks plus an interface contract"
	],
	[
		"MCP hosting flexibility",
		"Limited to proxy exposure unless an external server is added",
		"High: Runtime hosts arbitrary server code",
		"High on both sides"
	],
	[
		"Registry maturity",
		"API hub plus Agent Registry sync; maturity TO VALIDATE",
		"AWS Agent Registry (preview status on release; TO VALIDATE)",
		"Two catalogs and no documented sync"
	],
	[
		"Enterprise discovery",
		"Strong for SAP domain; cross-cloud agents need the Google catalog",
		"Strong for AWS-resident agents",
		"Weak without a custom synchronization"
	],
	[
		"Identity propagation",
		"One gateway hop to prove",
		"One gateway hop to prove",
		"Two hops to prove; highest risk"
	],
	[
		"SAP connectivity",
		"Via Integration Suite",
		"Via Integration Suite",
		"Via Integration Suite"
	],
	[
		"Security policy ownership",
		"SAP-facing team",
		"Cloud platform team",
		"Split; double enforcement needs justification"
	],
	[
		"Operational complexity",
		"Lowest of the three",
		"Medium",
		"Highest"
	],
	[
		"Cross-cloud traffic",
		"Agent to Google if the agent runs elsewhere",
		"None when the agent runs on AWS",
		"Always cross-cloud"
	],
	[
		"Vendor lock-in",
		"Apigee for the domain interface",
		"AgentCore for gateway and server",
		"Both"
	],
	[
		"Cost drivers",
		"Apigee licensing",
		"AgentCore consumption",
		"Both plus egress"
	],
	[
		"Observability",
		"Apigee analytics",
		"AWS-native tracing",
		"Needs a propagated trace id"
	],
	[
		"Maintainability",
		"Spec-driven; one owner",
		"Code-driven; one owner",
		"Two owners and a contract"
	],
	[
		"Portability",
		"MCP is open; proxy policy is Apigee-specific",
		"MCP server code is portable; gateway config is AWS-specific",
		"Server code stays portable; two configs"
	],
	[
		"Future BDC alignment",
		"Open: depends on the BDC MCP surface",
		"Open",
		"Open"
	]
], Ge = {
	headline: "ARCHITECTURE_RECOMMENDED (proposal for owner decision, not approval): use S1 as the proof-of-concept baseline for the SAP Finance domain interface.",
	why: [
		"It keeps the Finance domain contract on the SAP-facing side (API hub plus Integration Suite), so an agent hosted on AWS or elsewhere consumes it as a remote MCP endpoint without moving Finance logic into AWS.",
		"It has one gateway hop and one identity mapping to prove, against two for S3.",
		"Documented Apigee capability fits the read-heavy baseline: OpenAPI-derived tools, API-product tool filtering, OAuth 2.1 / OIDC."
	],
	standards: [
		"An enterprise rule on who owns domain MCP interfaces",
		"An approved agent platform that can reach Apigee",
		"An API hub and Agent Registry publication process"
	],
	open: [
		"Delegated user versus service identity for reads and posting",
		"Principal propagation through Integration Suite and Cloud Connector",
		"Registry source of truth and approval authority",
		"Whether Apigee MCP and Agent Registry integration are available in the tenant and region"
	],
	changes: [
		"If enterprise standards already host domain MCP servers on AgentCore, choose S2.",
		"S3 is justified only by a named control that one gateway cannot meet, for example a mandatory AWS-side tool-access policy for all agents plus SAP-owned domain policy. Without that, S3 duplicates policy.",
		"A failed Apigee-to-Integration-Suite identity test would reopen all three."
	],
	poc: [
		"Stand up one read tool through the S1 path with a service identity and record the call, token and SAP user in evidence.",
		"Repeat with user delegation; mark the result PASS, HOLD or NOT_VERIFIED.",
		"Run a single AgentCore Gateway to Apigee call to settle the S3 protocol and token questions before any S3 commitment."
	]
}, Ke = [
	[
		"Google Apigee",
		"Apigee MCP overview",
		"https://docs.cloud.google.com/apigee/docs/api-platform/apigee-mcp/apigee-mcp-overview",
		"MCP proxies expose existing APIs as MCP tools derived from OpenAPI; OAuth 2.1 and OIDC are supported; a proxy may also front your own MCP server.",
		"Apigee exposes and governs MCP endpoints; it is not an arbitrary Python server runtime. Domain tools come from OpenAPI or an external server.",
		"Tenant enablement, region, licensing, hybrid enablement"
	],
	[
		"Google Apigee",
		"Quickstart: MCP Discovery Proxy",
		"https://docs.cloud.google.com/apigee/docs/api-platform/apigee-mcp/apigee-mcp-quickstart",
		"OpenAPI 3.0.0 to 3.0.3; JSON-RPC 2.0 payloads; no SSE streams on GET.",
		"Spec version and transport limits apply to the baseline.",
		"Spec compatibility of the Finance APIs"
	],
	[
		"Google Apigee",
		"Register MCP APIs in API hub",
		"https://docs.cloud.google.com/apigee/docs/apihub/register-mcp-apis",
		"API hub imports Apigee MCP proxies and parses specs into tools.",
		"API hub is the natural SAP-domain MCP catalog in S1 and S3.",
		"API hub licensing and project setup"
	],
	[
		"Google Apigee",
		"Agent Registry integration",
		"https://docs.cloud.google.com/apigee/docs/apihub/manage-agent-registry-integration",
		"API hub syncs MCP tools and server metadata to Agent Registry; sync is on by default; manually styled MCP APIs are not synced.",
		"Google-side discovery needs no custom sync, but maturity and release status must be checked.",
		"Preview or GA status in the tenant"
	],
	[
		"AWS AgentCore",
		"Gateway outbound authorization",
		"https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-outbound-auth.html",
		"For MCP-server targets: no authorization, gateway role, OAuth (client credentials, authorization code, token exchange) and API key; caller IAM and passthrough are not offered.",
		"S3 outbound auth to Apigee must use one of these; caller identity cannot be passed through.",
		"Whether Apigee accepts the chosen method and carries user context"
	],
	[
		"AWS AgentCore",
		"Runtime MCP servers",
		"https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-mcp.html",
		"Runtime hosts MCP servers (Streamable HTTP) when the protocol is set to MCP; containers use port 8000 on ARM64.",
		"A coded Finance MCP server in S2 runs on Runtime, not in the Gateway.",
		"Account, region, image pipeline"
	],
	[
		"AWS AgentCore",
		"AWS Agent Registry",
		"https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html",
		"Registry is a discovery and approval catalog; only approved records are discoverable; newer namespace is agent-registry.",
		"Registry is a separate layer, not an invocation hop; do not use the older namespace as the target.",
		"Release status and the current namespace in the account"
	],
	[
		"AWS AgentCore",
		"Gateway MCP-server targets",
		"https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-MCPservers.html",
		"A gateway can register an external MCP server as a target.",
		"Makes the S3 hop possible in principle; interoperability with Apigee is unproven.",
		"MCP version match and tool discovery against Apigee"
	],
	[
		"SAP",
		"Integration Suite: MCP Server",
		"https://help.sap.com/docs/integration-suite/isuite-integrations-and-apis/model-context-protocol-mcp",
		"Integration Suite can expose MCP servers from an API, an HTTP endpoint with OpenAPI, or RFC; servers run on Integration Cell.",
		"This is a fourth, SAP-managed option. It is not assumed in S1 to S3, which use Integration Suite only as the API and integration layer.",
		"Entitlement, edition and Integration Cell availability"
	],
	[
		"SAP",
		"Reference architecture for agentic SAP access",
		"https://architecture.learning.sap.com/docs/ref-arch/76ec36",
		"SAP reference architecture for agents and MCP access.",
		"Used as context only.",
		"Fit to our landscape"
	],
	[
		"SAP Community",
		"Principal propagation for MCP servers",
		"https://community.sap.com/t5/technology-blog-posts-by-sap/principal-propagation-for-mcp-servers-sap-integration-suite-to-sap-s-4hana/ba-p/14488137",
		"Describes propagation through Integration Suite and Cloud Connector; a client-credentials token carries no user.",
		"Secondary source. End-to-end propagation must be proven in our tenant.",
		"Token exchange, mapping and ABAP authorization"
	]
], qe = `Sources were read on ${Ae}. Vendor documents describe product capability only. They are not evidence of our tenant's entitlement, activation or approval.`, F = (e, t, n, r, i, a) => ({
	id: e,
	row: t,
	col: n,
	title: r,
	sub: i,
	kind: a
}), Je = {
	idp: F("idp", 0, 0, "Enterprise identity provider", "OAuth 2.1 / OIDC · user and agent identity", "identity"),
	ent: F("ent", 3, 0, "Enterprise AI Foundry", "Publication and approval authority · TBD", "registry"),
	repo: F("repo", 4, 0, "Git repository", "Source, specs, tool definitions, tests", "artifact")
}, Ye = {
	S1: {
		cols: 5,
		nodes: [
			Je.idp,
			Je.ent,
			Je.repo,
			F("agent", 1, 0, "Agent runtime · MCP client", "Approved host · demo: AgentCore Runtime", "agent"),
			F("gw", 1, 1, "Apigee MCP endpoint", "MCP gateway · OAuth and API-product policy", "gateway"),
			F("dom", 1, 2, "SAP Finance domain tools", "Read domain and separate posting domain · derived from OpenAPI", "domain"),
			F("int", 1, 3, "SAP Integration Suite", "API and iFlow layer · Cloud Connector", "integration"),
			F("sap", 1, 4, "SAP S/4HANA · CF · BW/4HANA", "ABAP authorization boundary", "backend"),
			F("data", 2, 3, "Analytical MCP · Databricks / BDC", "Future state · entitlement TO VALIDATE", "data"),
			F("hub", 3, 2, "Apigee API hub", "SAP-domain MCP catalog (proposed)", "registry"),
			F("reg", 3, 3, "Google Agent Registry", "Synced from API hub · maturity TO VALIDATE", "registry"),
			F("cicd", 4, 1, "CI/CD → Apigee deploy", "Proxies, products, policies", "artifact"),
			F("spec", 4, 2, "OpenAPI and tool specs", "Versioned in Git, registered in API hub", "artifact")
		],
		edges: [
			[
				"agent",
				"gw",
				"invoke",
				"MCP tools/call"
			],
			[
				"gw",
				"dom",
				"invoke",
				"proxy flow"
			],
			[
				"dom",
				"int",
				"invoke",
				"HTTPS API"
			],
			[
				"int",
				"sap",
				"invoke",
				"RFC / OData"
			],
			[
				"dom",
				"data",
				"invoke",
				"analytics read"
			],
			[
				"idp",
				"agent",
				"identity",
				"agent / user token"
			],
			[
				"idp",
				"gw",
				"identity",
				"token validation"
			],
			[
				"agent",
				"hub",
				"registry",
				"discover"
			],
			[
				"hub",
				"reg",
				"registry",
				"sync"
			],
			[
				"ent",
				"hub",
				"approval",
				"approve publication"
			],
			[
				"repo",
				"cicd",
				"deploy",
				"commit"
			],
			[
				"cicd",
				"gw",
				"deploy",
				"deploy proxy"
			],
			[
				"spec",
				"hub",
				"deploy",
				"register spec"
			]
		],
		bounds: [[
			"Google Apigee (external to AWS)",
			["gw", "dom"],
			"google"
		], [
			"SAP landscape",
			["int", "sap"],
			"sap"
		]]
	},
	S2: {
		cols: 5,
		nodes: [
			Je.idp,
			Je.ent,
			Je.repo,
			F("agent", 1, 0, "Agent runtime · MCP client", "Approved host · demo: AgentCore Runtime", "agent"),
			F("gw", 1, 1, "AgentCore Gateway", "MCP gateway · inbound auth, outbound credentials · no custom tool code", "gateway"),
			F("dom", 1, 2, "Finance domain MCP server", "Coded server on AgentCore Runtime, or gateway-generated tools", "domain"),
			F("int", 1, 3, "SAP Integration Suite", "API and iFlow layer · Cloud Connector", "integration"),
			F("sap", 1, 4, "SAP S/4HANA · CF · BW/4HANA", "ABAP authorization boundary", "backend"),
			F("data", 2, 3, "Analytical MCP · Databricks / BDC", "Future state · entitlement TO VALIDATE", "data"),
			F("aid", 0, 1, "AgentCore Identity", "Credential providers for outbound auth", "identity"),
			F("reg", 3, 2, "AWS Agent Registry", "Discovery and approval · agent-registry namespace", "registry"),
			F("cicd", 4, 1, "CI/CD → AWS deploy", "Runtime image, gateway targets", "artifact"),
			F("ecr", 4, 2, "Container registry (ECR)", "Runtime image for the MCP server", "artifact")
		],
		edges: [
			[
				"agent",
				"gw",
				"invoke",
				"MCP tools/call"
			],
			[
				"gw",
				"dom",
				"invoke",
				"MCP target"
			],
			[
				"dom",
				"int",
				"invoke",
				"HTTPS API"
			],
			[
				"int",
				"sap",
				"invoke",
				"RFC / OData"
			],
			[
				"dom",
				"data",
				"invoke",
				"analytics read"
			],
			[
				"idp",
				"agent",
				"identity",
				"agent / user token"
			],
			[
				"idp",
				"gw",
				"identity",
				"JWT validation"
			],
			[
				"aid",
				"gw",
				"identity",
				"outbound credentials"
			],
			[
				"agent",
				"reg",
				"registry",
				"discover"
			],
			[
				"ent",
				"reg",
				"approval",
				"approve records"
			],
			[
				"repo",
				"cicd",
				"deploy",
				"commit"
			],
			[
				"cicd",
				"ecr",
				"deploy",
				"push image"
			],
			[
				"cicd",
				"gw",
				"deploy",
				"target config"
			]
		],
		bounds: [[
			"AWS trust boundary",
			[
				"agent",
				"gw",
				"dom"
			],
			"aws"
		], [
			"SAP landscape",
			["int", "sap"],
			"sap"
		]]
	},
	S3: {
		cols: 6,
		nodes: [
			Je.idp,
			Je.ent,
			Je.repo,
			F("agent", 1, 0, "Agent runtime · MCP client", "Approved host · demo: AgentCore Runtime", "agent"),
			F("gw", 1, 1, "AgentCore Gateway", "First gateway · agent entry on AWS", "gateway"),
			F("gw2", 1, 2, "Apigee MCP endpoint", "Second gateway · SAP-domain policy", "gateway"),
			F("dom", 1, 3, "SAP Finance domain tools", "Owned on the SAP-facing side · from OpenAPI", "domain"),
			F("int", 1, 4, "SAP Integration Suite", "API and iFlow layer", "integration"),
			F("sap", 1, 5, "SAP S/4HANA · CF · BW/4HANA", "ABAP authorization boundary", "backend"),
			F("data", 2, 4, "Analytical MCP · Databricks / BDC", "Future state · TO VALIDATE", "data"),
			F("aid", 0, 1, "AgentCore Identity", "Outbound token handling", "identity"),
			F("areg", 3, 1, "AWS Agent Registry", "Reference record · manual or custom sync", "registry"),
			F("hub", 3, 3, "Apigee API hub", "SAP-domain source of truth (proposed)", "registry"),
			F("cicd", 4, 2, "CI/CD → both platforms", "Apigee bundle and AWS target", "artifact"),
			F("spec", 4, 3, "Specs and interface contract", "OpenAPI plus cross-gateway contract", "artifact")
		],
		edges: [
			[
				"agent",
				"gw",
				"invoke",
				"MCP tools/call"
			],
			[
				"gw",
				"gw2",
				"invoke",
				"MCP target · unproven"
			],
			[
				"gw2",
				"dom",
				"invoke",
				"proxy flow"
			],
			[
				"dom",
				"int",
				"invoke",
				"HTTPS API"
			],
			[
				"int",
				"sap",
				"invoke",
				"RFC / OData"
			],
			[
				"dom",
				"data",
				"invoke",
				"analytics read"
			],
			[
				"idp",
				"agent",
				"identity",
				"agent / user token"
			],
			[
				"aid",
				"gw",
				"identity",
				"token exchange?"
			],
			[
				"idp",
				"gw2",
				"identity",
				"token validation"
			],
			[
				"agent",
				"areg",
				"registry",
				"discover"
			],
			[
				"hub",
				"areg",
				"registry",
				"manual reference"
			],
			[
				"ent",
				"areg",
				"approval",
				"approve"
			],
			[
				"repo",
				"cicd",
				"deploy",
				"commit"
			],
			[
				"cicd",
				"gw2",
				"deploy",
				"deploy proxy"
			],
			[
				"spec",
				"hub",
				"deploy",
				"register spec"
			]
		],
		bounds: [
			[
				"AWS",
				["agent", "gw"],
				"aws"
			],
			[
				"Google Apigee",
				["gw2", "dom"],
				"google"
			],
			[
				"SAP landscape",
				["int", "sap"],
				"sap"
			]
		]
	}
}, Xe = {
	agent: "#E8F1FB",
	gateway: "#FFF1E0",
	domain: "#EAF6EC",
	integration: "#F0EAF8",
	backend: "#E3E9EF",
	data: "#EEF2F5",
	registry: "#E5F5F2",
	artifact: "#F3F3F3",
	identity: "#FFF7DA"
}, Ze = {
	invoke: {
		c: "#0A4F9E",
		w: 2.6,
		d: ""
	},
	registry: {
		c: "#0C8F76",
		w: 2,
		d: "7 4"
	},
	deploy: {
		c: "#6B6B6B",
		w: 2,
		d: "2 4"
	},
	identity: {
		c: "#C26A00",
		w: 2,
		d: "8 3 2 3"
	},
	approval: {
		c: "#B3261E",
		w: 2.4,
		d: "10 3"
	}
}, Qe = [
	["invoke", "Runtime invocation"],
	["registry", "Registry / discovery"],
	["deploy", "Deployment / artifacts"],
	["identity", "Identity / authentication"],
	["approval", "Approval-gated operation"]
], $e = {
	google: "#C26A00",
	aws: "#0A4F9E",
	sap: "#5B3F8C"
}, et = (e) => String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function tt(e, t) {
	let n = [], r = "";
	for (let i of String(e).split(" ")) (r + " " + i).trim().length > t && r ? (n.push(r), r = i) : r = (r + " " + i).trim();
	return r && n.push(r), n;
}
function nt(e) {
	let t = Ye[e], n = Me[e], r = (1140 - (t.cols - 1) * 30) / t.cols, i = [
		118,
		258,
		398,
		528,
		668
	], a = {};
	for (let e of t.nodes) a[e.id] = {
		x: 30 + e.col * (r + 30),
		y: i[e.row],
		w: r,
		h: 92,
		n: e
	};
	let o = [];
	for (let [e, n, r] of t.bounds) {
		let t = n.map((e) => a[e]), i = Math.min(...t.map((e) => e.x)) - 10, s = Math.min(...t.map((e) => e.y)) - 24, c = Math.max(...t.map((e) => e.x + e.w)) + 10, l = Math.max(...t.map((e) => e.y + e.h)) + 10;
		o.push(`<rect x="${i}" y="${s}" width="${c - i}" height="${l - s}" rx="8" fill="none" stroke="${$e[r]}" stroke-width="2" stroke-dasharray="14 5"/>`), o.push(`<text x="${i + 8}" y="${s + 15}" font-size="12" font-weight="700" fill="${$e[r]}">${et(e)}</text>`);
	}
	let s = (e, t) => o.push(`<text x="1170" y="${e}" font-size="11.5" font-weight="700" fill="#506778" text-anchor="end">${t}</text>`);
	s(104, "IDENTITY AND SECURITY"), s(224, "RUNTIME INVOCATION PATH"), s(392, "DATA / ANALYTICS BRANCH"), s(514, "REGISTRY AND DISCOVERY (NOT AN INVOCATION HOP)"), s(654, "ARTIFACT REPOSITORY AND DEPLOYMENT");
	let c = [], l = [], u = {};
	for (let [e, n, r, i] of t.edges) {
		let t = r === "identity" ? u[e] = (u[e] ?? -1) + 1 : 0, s = a[e], d = a[n], f = Ze[r], p = {
			x: s.x + s.w / 2,
			y: s.y + s.h / 2
		}, m = {
			x: d.x + d.w / 2,
			y: d.y + d.h / 2
		}, h, g, _, v, y, b, x;
		if (s.n.row === d.n.row) {
			let e = s.x < d.x, t = e ? s.x + s.w : s.x, n = e ? d.x : d.x + d.w, i = p.y + (r === "identity" ? 14 : 0);
			h = `M${t},${i} L${n},${i}`, g = (t + n) / 2, _ = s.y + s.h + (s.n.row === 1 ? 26 : 14), v = n, y = i, b = e ? 1 : -1, x = 0;
		} else {
			let e = s.y < d.y, n = e ? s.y + s.h : s.y, i = e ? d.y : d.y + d.h, a = r === "identity" ? 14 + t * 40 : r === "approval" ? -12 : 0, o = p.x + a, c = m.x + a, l = (n + i) / 2;
			h = `M${o},${n} L${o},${l} L${c},${l} L${c},${i}`, r === "identity" ? (g = o, _ = n + (e ? 18 + t * 14 : -8)) : (g = c, _ = e ? i - 8 : i + 20), v = c, y = i, b = 0, x = e ? 1 : -1;
		}
		o.push(`<path d="${h}" fill="none" stroke="${f.c}" stroke-width="${f.w}"${f.d ? ` stroke-dasharray="${f.d}"` : ""} data-edge="${e}-${n}"/>`), l.push(b === 0 ? `<polygon points="${v},${y} ${v - 7 * .7},${y - x * 7 * 1.6} ${v + 7 * .7},${y - x * 7 * 1.6}" fill="${f.c}"/>` : `<polygon points="${v},${y} ${v - b * 7 * 1.6},${y - 7 * .7} ${v - b * 7 * 1.6},${y + 7 * .7}" fill="${f.c}"/>`), c.push([
			g,
			_,
			i,
			f.c
		]);
	}
	o.push(...l);
	for (let e of t.nodes) {
		let t = a[e.id];
		o.push(`<rect x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" rx="7" fill="${Xe[e.kind]}" stroke="#506778" stroke-width="1.4"/>`);
		let n = tt(e.title, Math.floor(t.w / 7.1)).slice(0, 2);
		n.forEach((e, n) => o.push(`<text x="${t.x + 8}" y="${t.y + 20 + n * 15}" font-size="12.5" font-weight="700" fill="#1D2D3E">${et(e)}</text>`)), tt(e.sub, Math.floor(t.w / 5.7)).slice(0, 4).forEach((e, r) => o.push(`<text x="${t.x + 8}" y="${t.y + 20 + n.length * 15 + r * 12.5}" font-size="10.5" fill="#34495C">${et(e)}</text>`));
	}
	for (let [e, t, n, r] of c) {
		let i = n.length * 5.6 + 10;
		o.push(`<rect x="${e - i / 2}" y="${t - 11}" width="${i}" height="15" rx="3" fill="#F1F4F7" opacity="0.94"/><text x="${e}" y="${t}" font-size="10.5" font-weight="600" fill="${r}" text-anchor="middle">${et(n)}</text>`);
	}
	let d = 30;
	o.push("<rect x=\"22\" y=\"786\" width=\"1156\" height=\"40\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#D9E1E7\"/>"), o.push("<text x=\"30\" y=\"804\" font-size=\"11\" font-weight=\"700\" fill=\"#506778\">LEGEND</text>");
	for (let [e, t] of Qe) {
		let n = Ze[e];
		o.push(`<line x1="${d + 60}" y1="800" x2="${d + 90}" y2="800" stroke="${n.c}" stroke-width="${n.w}"${n.d ? ` stroke-dasharray="${n.d}"` : ""}/><text x="${d + 96}" y="804" font-size="11" fill="#1D2D3E">${et(t)}</text>`), d += 96 + t.length * 5.4 + 8;
	}
	o.push("<text x=\"30\" y=\"820\" font-size=\"10.5\" fill=\"#506778\">Proposed design for review. Vendor names are design projections, not connected services. Placeholders are not tenant addresses. Registry and deployment arrows are not invocation traffic.</text>");
	let f = `${n.label} · MCP topology`;
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 840" role="img" aria-labelledby="t d" font-family="'Segoe UI','Segoe UI Variable','Helvetica Neue',Arial,sans-serif" text-rendering="geometricPrecision"><title id="t">${et(f)}</title><desc id="d">${et(n.chain)}</desc><rect width="1200" height="840" fill="#F1F4F7"/><text x="30" y="40" font-size="20" font-weight="700" fill="#1D2D3E">${et(f)}</text><text x="30" y="62" font-size="12" fill="#34495C">${et(n.chain.length > 150 ? n.chain.slice(0, 147) + "…" : n.chain)}</text><text x="30" y="82" font-size="11" fill="#B3261E" font-weight="700">PROPOSED DESIGN · NOT TENANT-VERIFIED · NOT AN APPROVED ARCHITECTURE</text>${o.join("")}</svg>\n`;
}
// src/McpGovernance.jsx
var rt = [
	"MCP registry and discovery",
	"Enterprise registry / approval authority",
	"Source-code repository",
	"MCP specifications and versioned artifacts",
	"Container / package artifact storage",
	"Gateway-target configuration",
	"Deployment ownership"
], it = [
	["mg-responsibility", "Responsibility matrix"],
	["mg-connections", "Endpoint connectivity"],
	["mg-registry", "Registry and artifacts"],
	["mg-domain", "Finance domain design"],
	["mg-hosting", "Agent hosting"],
	["mg-decision", "Decision matrix"],
	["mg-recommendation", "Recommendation"],
	["mg-evidence", "Evidence"]
];
function at(e) {
	return {
		id: e,
		title: Me[e].label,
		svg: nt(e),
		file: `mcp-topology-${e.toLowerCase()}`,
		png: !0
	};
}
var ot = (e) => /TBD|TO VALIDATE|unproven|NOT_VERIFIED|REQUIRES VALIDATION|needs proof|must be proven|unmeasured/i.test(e), st = ({ text: e }) => /* @__PURE__ */ (0, x.jsx)("td", {
	className: ot(e) ? "mg-open" : "",
	children: e
});
function ct({ view: e = "S1", onView: t, onApproaches: n, onDetailed: r }) {
	let [i, a] = (0, b.useState)(null), [o, s] = (0, b.useState)(null), [c, l] = (0, b.useState)(!0), [u, d] = (0, b.useState)(null), [f, p] = (0, b.useState)("S3"), m = e === "compare", h = m ? "S1" : e, g = Me[h], _ = (0, b.useMemo)(() => Object.fromEntries(Ne.map((e) => [e, at(e)])), []), v = (0, b.useCallback)((e) => {
		a(e), s(e);
	}, []), y = f === h ? Ne.find((e) => e !== h) : f, S = (n) => {
		n !== e && (d(null), t(n));
	}, C = (e) => document.getElementById(e)?.scrollIntoView({
		behavior: "smooth",
		block: "start"
	}), w = m ? ["S1", y] : [h];
	return /* @__PURE__ */ (0, x.jsxs)("main", {
		className: "detailed-diagrams mcp-governance",
		"aria-label": "MCP hosting and governance",
		children: [
			/* @__PURE__ */ (0, x.jsxs)("header", {
				className: "surface dd-header",
				children: [
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "dd-title",
						children: [/* @__PURE__ */ (0, x.jsx)("span", {
							className: "eyebrow",
							children: "MCP HOSTING & GOVERNANCE · WHO CREATES, HOSTS, REGISTERS AND CALLS THE FINANCE MCP"
						}), /* @__PURE__ */ (0, x.jsx)("h2", { children: m ? "Compare MCP topologies" : g.label })]
					}),
					/* @__PURE__ */ (0, x.jsx)("nav", {
						className: "dd-selector",
						role: "tablist",
						"aria-label": "MCP scenario selection",
						children: [...Ne, "compare"].map((t) => /* @__PURE__ */ (0, x.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": e === t,
							className: e === t ? "active" : "",
							onClick: () => S(t),
							children: t === "compare" ? "Compare side-by-side" : Me[t].label
						}, t))
					}),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "dd-header-actions",
						children: /* @__PURE__ */ (0, x.jsx)("span", {
							className: "pill warn",
							children: "PROPOSED DESIGN · NOT APPROVED · NOT TENANT-VERIFIED"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, x.jsxs)("section", {
				className: "surface dd-summary",
				"aria-label": "Scenario summary",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [
					/* @__PURE__ */ (0, x.jsx)("span", {
						className: "eyebrow",
						children: m ? "WHAT THIS VIEW SHOWS" : `${h} · ${g.short.toUpperCase()}`
					}),
					/* @__PURE__ */ (0, x.jsx)("p", { children: m ? "Two scenarios side by side. Pick the second one below. The matrices further down always show all three." : g.summary }),
					!m && /* @__PURE__ */ (0, x.jsx)("p", {
						className: "mg-baseline",
						children: g.baseline
					})
				] }), /* @__PURE__ */ (0, x.jsxs)("div", {
					className: "dd-invariant",
					children: [/* @__PURE__ */ (0, x.jsx)("span", {
						className: "eyebrow",
						children: "AGENT HOSTING IS A SEPARATE DECISION"
					}), /* @__PURE__ */ (0, x.jsx)("p", { children: "Choosing a gateway does not choose the agent runtime or the LLM. A registry is a catalog, never an invocation hop. A gateway routes and authorizes; it does not necessarily run the domain tools." })]
				})]
			}),
			/* @__PURE__ */ (0, x.jsxs)("nav", {
				className: "mg-anchors",
				"aria-label": "Sections on this page",
				children: [
					it.map(([e, t]) => /* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: () => C(e),
						children: t
					}, e)),
					/* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: n,
						children: "Pros & cons →"
					}),
					/* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: () => r(h === "S3" || m ? "S1" : h),
						children: "Detailed reference diagrams →"
					})
				]
			}),
			m && /* @__PURE__ */ (0, x.jsxs)("div", {
				className: "surface dd-compare-bar",
				children: [/* @__PURE__ */ (0, x.jsxs)("label", { children: [/* @__PURE__ */ (0, x.jsx)("input", {
					type: "checkbox",
					checked: c,
					onChange: (e) => l(e.target.checked)
				}), " Synchronize zoom and pan"] }), /* @__PURE__ */ (0, x.jsxs)("label", { children: ["Compare S1 with ", /* @__PURE__ */ (0, x.jsx)("select", {
					value: y,
					onChange: (e) => p(e.target.value),
					"aria-label": "Second scenario",
					children: Ne.filter((e) => e !== "S1").map((e) => /* @__PURE__ */ (0, x.jsx)("option", {
						value: e,
						children: Me[e].label
					}, e))
				})] })]
			}),
			/* @__PURE__ */ (0, x.jsx)("div", {
				className: `mg-viewers ${m ? "two" : ""}`,
				children: w.map((e, t) => /* @__PURE__ */ (0, x.jsx)("div", {
					className: "mg-viewer",
					"data-scenario": e,
					children: /* @__PURE__ */ (0, x.jsx)(P, {
						diagram: _[e],
						uid: `mg-${e}-${m ? "c" : "s"}`,
						compact: m,
						view: t === 0 ? i : o,
						onView: (e) => {
							m && c ? v(e) : (t === 0 ? a : s)(e);
						},
						onFit: (e) => {
							m && c ? v(e) : (t === 0 ? a : s)(e);
						},
						expanded: u === e,
						onExpand: (t) => d(t ? e : null)
					})
				}, e))
			}),
			/* @__PURE__ */ (0, x.jsxs)("section", {
				id: "mg-responsibility",
				className: "surface mg-section",
				"data-testid": "mg-matrix",
				children: [
					/* @__PURE__ */ (0, x.jsx)("h3", { children: "Responsibility matrix · 21 rows" }),
					/* @__PURE__ */ (0, x.jsxs)("p", {
						className: "micro",
						children: [
							"Selected scenario highlighted. “",
							je,
							"” and other open items are tinted. Every cell comes from one scenario configuration."
						]
					}),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "mg-scroll",
						children: /* @__PURE__ */ (0, x.jsxs)("table", {
							className: "mg-table",
							children: [/* @__PURE__ */ (0, x.jsx)("thead", { children: /* @__PURE__ */ (0, x.jsxs)("tr", { children: [/* @__PURE__ */ (0, x.jsx)("th", {
								scope: "col",
								children: "Responsibility"
							}), Ne.map((e) => /* @__PURE__ */ (0, x.jsx)("th", {
								scope: "col",
								className: w.includes(e) ? "sel" : "",
								children: Me[e].label
							}, e))] }) }), /* @__PURE__ */ (0, x.jsx)("tbody", { children: Fe.map(([e, ...t], n) => /* @__PURE__ */ (0, x.jsxs)("tr", { children: [/* @__PURE__ */ (0, x.jsxs)("th", {
								scope: "row",
								children: [
									n + 1,
									". ",
									e
								]
							}), t.map((e, t) => /* @__PURE__ */ (0, x.jsx)("td", {
								className: `${w.includes(Ne[t]) ? "sel" : ""} ${ot(e) ? "mg-open" : ""}`,
								children: e
							}, Ne[t]))] }, e)) })]
						})
					})
				]
			}),
			w.map((e) => /* @__PURE__ */ (0, x.jsxs)("section", {
				id: e === w[0] ? "mg-connections" : void 0,
				className: "surface mg-section",
				"data-testid": `mg-connections-${e}`,
				children: [
					/* @__PURE__ */ (0, x.jsxs)("h3", { children: ["Endpoint connectivity · ", Me[e].label] }),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "micro",
						children: "Invocation traffic is listed separately from registry lookups and artifact deployment. Endpoint addresses are conceptual placeholders."
					}),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "mg-scroll",
						children: /* @__PURE__ */ (0, x.jsxs)("table", {
							className: "mg-table wide",
							children: [/* @__PURE__ */ (0, x.jsx)("thead", { children: /* @__PURE__ */ (0, x.jsx)("tr", { children: Ie.map((e) => /* @__PURE__ */ (0, x.jsx)("th", {
								scope: "col",
								children: e
							}, e)) }) }), /* @__PURE__ */ (0, x.jsx)("tbody", { children: Ve[e].map((e, t) => /* @__PURE__ */ (0, x.jsx)("tr", {
								className: /not invocation/i.test(e[2]) ? "mg-aside" : "",
								children: e.map((e, t) => t === 0 ? /* @__PURE__ */ (0, x.jsx)("th", {
									scope: "row",
									children: e
								}, t) : /* @__PURE__ */ (0, x.jsx)(st, { text: e }, t))
							}, t)) })]
						})
					})
				]
			}, e)),
			/* @__PURE__ */ (0, x.jsxs)("section", {
				id: "mg-registry",
				className: "surface mg-section",
				"data-testid": "mg-registry",
				children: [
					/* @__PURE__ */ (0, x.jsx)("h3", { children: "Registry and artifact ownership" }),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "micro",
						children: "Registries catalog; repositories hold source and specifications; runtimes execute. These rows are the same cells as the responsibility matrix."
					}),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "mg-scroll",
						children: /* @__PURE__ */ (0, x.jsxs)("table", {
							className: "mg-table",
							children: [/* @__PURE__ */ (0, x.jsx)("thead", { children: /* @__PURE__ */ (0, x.jsxs)("tr", { children: [/* @__PURE__ */ (0, x.jsx)("th", {
								scope: "col",
								children: "Item"
							}), Ne.map((e) => /* @__PURE__ */ (0, x.jsx)("th", {
								scope: "col",
								className: w.includes(e) ? "sel" : "",
								children: Me[e].label
							}, e))] }) }), /* @__PURE__ */ (0, x.jsx)("tbody", { children: Fe.filter((e) => rt.includes(e[0])).map(([e, ...t]) => /* @__PURE__ */ (0, x.jsxs)("tr", { children: [/* @__PURE__ */ (0, x.jsx)("th", {
								scope: "row",
								children: e
							}), t.map((e, t) => /* @__PURE__ */ (0, x.jsx)("td", {
								className: `${w.includes(Ne[t]) ? "sel" : ""} ${ot(e) ? "mg-open" : ""}`,
								children: e
							}, Ne[t]))] }, e)) })]
						})
					}),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "micro",
						children: "Proposed hybrid source of truth: Apigee API hub for the SAP domain; AWS Agent Registry holds a reference; Enterprise AI Foundry owns publication approval. No automatic cross-platform synchronization is assumed."
					})
				]
			}),
			/* @__PURE__ */ (0, x.jsxs)("section", {
				id: "mg-domain",
				className: "surface mg-section",
				"data-testid": "mg-domain",
				children: [
					/* @__PURE__ */ (0, x.jsx)("h3", { children: "Finance domain MCP design" }),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "micro",
						children: "Read and write use separate authorizations. No generic write-capable tool may bypass SAP validation, approval, idempotency, posting-period control or audit. This demo never posts to SAP."
					}),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "mg-cards",
						children: He.map((e) => /* @__PURE__ */ (0, x.jsxs)("article", { children: [
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: `pill ${e.mode.startsWith("WRITE") ? "warn" : "quiet"}`,
								children: e.mode
							}),
							/* @__PURE__ */ (0, x.jsx)("h4", { children: e.name }),
							/* @__PURE__ */ (0, x.jsx)("p", { children: e.tools }),
							/* @__PURE__ */ (0, x.jsxs)("p", { children: [
								/* @__PURE__ */ (0, x.jsx)("strong", { children: "Control" }),
								" ",
								e.control
							] })
						] }, e.name))
					}),
					/* @__PURE__ */ (0, x.jsxs)("p", {
						className: "micro",
						children: [
							"Five authorizations stay distinct: business approval, agent authorization, gateway authorization, SAP backend user authorization and the actual SAP posting result. Service identity is simpler to prove; end-user delegation needs proven token exchange, Cloud Connector, identity mapping and ABAP roles (",
							je,
							")."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, x.jsxs)("section", {
				id: "mg-hosting",
				className: "surface mg-section",
				"data-testid": "mg-hosting",
				children: [
					/* @__PURE__ */ (0, x.jsx)("h3", { children: "Agent hosting versus MCP scenario" }),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "micro",
						children: "A custom agent can run on one platform and consume an MCP endpoint hosted elsewhere. Nothing here is an enterprise approval."
					}),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "mg-scroll",
						children: /* @__PURE__ */ (0, x.jsxs)("table", {
							className: "mg-table",
							children: [/* @__PURE__ */ (0, x.jsx)("thead", { children: /* @__PURE__ */ (0, x.jsxs)("tr", { children: [/* @__PURE__ */ (0, x.jsx)("th", {
								scope: "col",
								children: "Agent host"
							}), Ne.map((e) => /* @__PURE__ */ (0, x.jsx)("th", {
								scope: "col",
								children: Me[e].label
							}, e))] }) }), /* @__PURE__ */ (0, x.jsx)("tbody", { children: Ue.map(([e, ...t]) => /* @__PURE__ */ (0, x.jsxs)("tr", { children: [/* @__PURE__ */ (0, x.jsx)("th", {
								scope: "row",
								children: e
							}), t.map((e, t) => /* @__PURE__ */ (0, x.jsx)(st, { text: e }, t))] }, e)) })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, x.jsxs)("section", {
				id: "mg-decision",
				className: "surface mg-section",
				"data-testid": "mg-decision",
				children: [
					/* @__PURE__ */ (0, x.jsx)("h3", { children: "Decision matrix" }),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "micro",
						children: "Qualitative assessment. These are architectural judgments, not verified product claims or an approval."
					}),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "mg-scroll",
						children: /* @__PURE__ */ (0, x.jsxs)("table", {
							className: "mg-table",
							children: [/* @__PURE__ */ (0, x.jsx)("thead", { children: /* @__PURE__ */ (0, x.jsxs)("tr", { children: [/* @__PURE__ */ (0, x.jsx)("th", {
								scope: "col",
								children: "Dimension"
							}), Ne.map((e) => /* @__PURE__ */ (0, x.jsx)("th", {
								scope: "col",
								className: w.includes(e) ? "sel" : "",
								children: Me[e].label
							}, e))] }) }), /* @__PURE__ */ (0, x.jsx)("tbody", { children: We.map(([e, ...t]) => /* @__PURE__ */ (0, x.jsxs)("tr", { children: [/* @__PURE__ */ (0, x.jsx)("th", {
								scope: "row",
								children: e
							}), t.map((e, t) => /* @__PURE__ */ (0, x.jsx)("td", {
								className: w.includes(Ne[t]) ? "sel" : "",
								children: e
							}, Ne[t]))] }, e)) })]
						})
					}),
					/* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						className: "text-link",
						onClick: n,
						children: "Compare with the pros & cons view →"
					})
				]
			}),
			/* @__PURE__ */ (0, x.jsxs)("section", {
				id: "mg-recommendation",
				className: "surface mg-section",
				"data-testid": "mg-recommendation",
				children: [
					/* @__PURE__ */ (0, x.jsx)("h3", { children: "Recommendation and proof plan" }),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "mg-reco",
						children: /* @__PURE__ */ (0, x.jsx)("strong", { children: Ge.headline })
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "mg-cards",
						children: [
							/* @__PURE__ */ (0, x.jsxs)("article", { children: [/* @__PURE__ */ (0, x.jsx)("h4", { children: "Why" }), /* @__PURE__ */ (0, x.jsx)("ul", { children: Ge.why.map((e) => /* @__PURE__ */ (0, x.jsx)("li", { children: e }, e)) })] }),
							/* @__PURE__ */ (0, x.jsxs)("article", { children: [/* @__PURE__ */ (0, x.jsx)("h4", { children: "Depends on" }), /* @__PURE__ */ (0, x.jsx)("ul", { children: Ge.standards.map((e) => /* @__PURE__ */ (0, x.jsx)("li", { children: e }, e)) })] }),
							/* @__PURE__ */ (0, x.jsxs)("article", { children: [/* @__PURE__ */ (0, x.jsx)("h4", { children: "Open decisions" }), /* @__PURE__ */ (0, x.jsx)("ul", { children: Ge.open.map((e) => /* @__PURE__ */ (0, x.jsx)("li", { children: e }, e)) })] }),
							/* @__PURE__ */ (0, x.jsxs)("article", { children: [/* @__PURE__ */ (0, x.jsx)("h4", { children: "What would change it" }), /* @__PURE__ */ (0, x.jsx)("ul", { children: Ge.changes.map((e) => /* @__PURE__ */ (0, x.jsx)("li", { children: e }, e)) })] }),
							/* @__PURE__ */ (0, x.jsxs)("article", { children: [/* @__PURE__ */ (0, x.jsx)("h4", { children: "How a POC proves it" }), /* @__PURE__ */ (0, x.jsx)("ul", { children: Ge.poc.map((e) => /* @__PURE__ */ (0, x.jsx)("li", { children: e }, e)) })] })
						]
					}),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "micro",
						children: "A recommendation is not production authorization."
					})
				]
			}),
			/* @__PURE__ */ (0, x.jsxs)("section", {
				id: "mg-evidence",
				className: "surface mg-section",
				"data-testid": "mg-evidence",
				children: [
					/* @__PURE__ */ (0, x.jsxs)("h3", { children: ["Source evidence · accessed ", Ae] }),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "micro",
						children: qe
					}),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "mg-scroll",
						children: /* @__PURE__ */ (0, x.jsxs)("table", {
							className: "mg-table wide",
							children: [/* @__PURE__ */ (0, x.jsx)("thead", { children: /* @__PURE__ */ (0, x.jsx)("tr", { children: [
								"Platform",
								"Source",
								"Documented capability",
								"Architecture consequence",
								"Validation still required"
							].map((e) => /* @__PURE__ */ (0, x.jsx)("th", {
								scope: "col",
								children: e
							}, e)) }) }), /* @__PURE__ */ (0, x.jsx)("tbody", { children: Ke.map(([e, t, n, r, i, a]) => /* @__PURE__ */ (0, x.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, x.jsx)("th", {
									scope: "row",
									children: e
								}),
								/* @__PURE__ */ (0, x.jsx)("td", { children: /* @__PURE__ */ (0, x.jsx)("a", {
									href: n,
									target: "_blank",
									rel: "noopener noreferrer",
									children: t
								}) }),
								/* @__PURE__ */ (0, x.jsx)("td", { children: r }),
								/* @__PURE__ */ (0, x.jsx)("td", { children: i }),
								/* @__PURE__ */ (0, x.jsx)("td", {
									className: "mg-open",
									children: a
								})
							] }, n)) })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, x.jsxs)("section", {
				className: "surface mg-section",
				"aria-label": "Glossary",
				children: [/* @__PURE__ */ (0, x.jsxs)("details", { children: [/* @__PURE__ */ (0, x.jsx)("summary", { children: /* @__PURE__ */ (0, x.jsx)("strong", { children: "Glossary · MCP terms used on this page" }) }), /* @__PURE__ */ (0, x.jsx)("dl", {
					className: "mg-glossary",
					children: Pe.map(([e, t]) => /* @__PURE__ */ (0, x.jsxs)(b.Fragment, { children: [/* @__PURE__ */ (0, x.jsx)("dt", { children: e }), /* @__PURE__ */ (0, x.jsx)("dd", { children: t })] }, e))
				})] }), /* @__PURE__ */ (0, x.jsxs)("p", {
					className: "micro",
					children: [
						"Legend: ",
						Qe.map(([, e]) => e).join(" · "),
						"."
					]
				})]
			})
		]
	});
}
// src/AgentJourney.jsx
var lt = [
	{
		label: "Finance intent",
		operation: "submit_request",
		doneDirection: "request",
		success: "Accepted",
		description: "Request accepted"
	},
	{
		label: "External agent",
		operation: "invoke_agent",
		doneDirection: "request",
		success: "Invoked",
		description: "Bounded plan invoked"
	},
	{
		label: "SAP tool call",
		operation: "read_sap",
		doneDirection: "request",
		success: "Called",
		description: "Read requested through gateway"
	},
	{
		label: "SAP evidence",
		operation: "sap_read",
		doneDirection: "response",
		success: "Returned",
		description: "Source response returned"
	},
	{
		label: "Reconciliation",
		operation: "calculate_variance",
		doneDirection: "response",
		success: "Verified",
		description: "Deterministic check completed"
	}
];
function ut({ events: e = [], running: t = !1, selectedZone: n, onOpenEvidence: r }) {
	let i = lt.map((t) => {
		let n = e.filter((e) => e.operation === t.operation), r = n.findLast((e) => e.direction === t.doneDirection && e.status !== "denied"), i = n.findLast((e) => e.status === "denied");
		return {
			...t,
			event: r || i || n.at(-1),
			state: i && !r ? "held" : r ? "complete" : n.length ? "working" : "waiting"
		};
	});
	return /* @__PURE__ */ (0, x.jsxs)("section", {
		className: "surface agent-journey",
		"aria-label": "External agent and SAP journey",
		children: [/* @__PURE__ */ (0, x.jsxs)("div", {
			className: "agent-journey-heading",
			children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
				className: "eyebrow",
				children: "EXTERNAL AGENT → SAP · SYNTHETIC FLOW"
			}), /* @__PURE__ */ (0, x.jsx)("strong", { children: n })] }), /* @__PURE__ */ (0, x.jsx)("button", {
				type: "button",
				onClick: r,
				children: "Inspect event proof in Evidence →"
			})]
		}), /* @__PURE__ */ (0, x.jsx)("div", {
			className: "agent-journey-stages",
			children: i.map((e, n) => /* @__PURE__ */ (0, x.jsxs)("div", {
				className: `agent-journey-stage ${e.state}`,
				children: [
					/* @__PURE__ */ (0, x.jsxs)("span", { children: [
						String(n + 1).padStart(2, "0"),
						" · ",
						e.label
					] }),
					/* @__PURE__ */ (0, x.jsx)("strong", { children: e.state === "complete" ? e.success : e.state === "held" ? "Held" : e.state === "working" ? "Processing" : e.description }),
					/* @__PURE__ */ (0, x.jsx)("small", { children: e.event ? `Recorded event #${e.event.seq}` : t ? "Awaiting handoff" : "No event yet" })
				]
			}, e.operation))
		})]
	});
}
// src/App.jsx
var dt = [
	"Business entry",
	"AI Foundry design time",
	"AWS runtime",
	"AWS controls",
	"Selected gateway",
	"Domain MCP",
	"SAP BAIP",
	"SAP backends",
	"Enterprise Databricks",
	"Future BDC",
	"Model branch",
	"Write approval"
], ft = [
	"Business entry",
	"AWS runtime",
	"Selected gateway",
	"Domain MCP"
], pt = [
	["AI Foundry design time", "Design-time activation"],
	["AWS controls", "Identity and keys"],
	["Future BDC", "Future reference only"],
	["Write approval", "Separate write branch"]
], mt = {
	"Business entry": "Finance request",
	"AI Foundry design time": "Agent registration",
	"AWS runtime": "External finance agent",
	"AWS controls": "Agent identity",
	"Selected gateway": "Agent gateway",
	"Domain MCP": "Domain tools",
	"SAP BAIP": "SAP integration",
	"SAP backends": "SAP finance",
	"Enterprise Databricks": "Data evidence",
	"Future BDC": "BDC reference",
	"Model branch": "AI advisory",
	"Write approval": "Approval"
}, ht = [
	["FI", "Variance operands, freshness, posting controls"],
	["SAP", "Backend roles and approved APIs"],
	["Central Finance", "Replication mapping and cutoff"],
	["BW/4HANA", "Aggregate context and load state"],
	["Integration", "BAIP, destinations and identity"],
	["Apigee", "S1 policy, routing and audit"],
	["AWS", "Runtime identity and S2 gateway"],
	["Databricks", "Unity Catalog and Delta evidence"],
	["BDC", "Future sharing boundary"],
	["Portkey / AI", "Redaction, guardrails and advisory text"],
	["Node.js / Python", "Typed UI contracts and deterministic engine"],
	["UX", "Task clarity, accessibility and trace readability"]
], gt = (e) => {
	if (!e) return "Select month";
	let [t, n] = e.split("-").map(Number);
	return new Date(Date.UTC(t, n - 1, 1)).toLocaleString("en-US", {
		month: "short",
		year: "numeric",
		timeZone: "UTC"
	});
}, _t = (e) => e == null ? "—" : new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0
}).format(Number(e));
async function I(e, t = "GET", n) {
	let r = await fetch(e, {
		method: t,
		headers: { "Content-Type": "application/json" },
		body: n ? JSON.stringify(n) : void 0
	}), i;
	try {
		i = await r.json();
	} catch {
		i = { detail: r.statusText };
	}
	if (!r.ok) throw Error(i.detail || r.statusText);
	return i;
}
function vt(e, t) {
	if (e.error) return [];
	let n = e.case_id || t?.case_id || null, r = e.trace_case_id || n, i = !!(e.result || t?.result), a = [];
	return i && (a.push({
		label: "View reconciliation report",
		target: "report",
		caseId: n
	}), a.push({
		label: "Inspect source evidence",
		target: "finance",
		caseId: n
	})), r && a.push({
		label: "Follow component flow",
		target: "architecture",
		caseId: n,
		traceId: r
	}), (e.status === "limited" || e.status === "needs_scope") && a.push({
		label: "Open architecture questions",
		target: "questions"
	}), a.length || a.push({
		label: "Open close worklist",
		target: "business"
	}), a;
}
function yt({ open: e, onToggle: t, onNavigate: n }) {
	return /* @__PURE__ */ (0, x.jsxs)("div", {
		className: "shell-menu-wrap",
		children: [/* @__PURE__ */ (0, x.jsxs)("button", {
			type: "button",
			className: "shell-menu-trigger",
			onClick: t,
			"aria-label": "Open application menu",
			"aria-expanded": e,
			"aria-controls": "finance-app-menu",
			children: [/* @__PURE__ */ (0, x.jsx)("span", {
				"aria-hidden": "true",
				children: "▦"
			}), /* @__PURE__ */ (0, x.jsx)("span", { children: "Menu" })]
		}), e && /* @__PURE__ */ (0, x.jsxs)("div", {
			id: "finance-app-menu",
			className: "shell-menu-popover",
			role: "menu",
			"aria-label": "Finance application menu",
			children: [
				/* @__PURE__ */ (0, x.jsx)("strong", { children: "Finance workspace" }),
				/* @__PURE__ */ (0, x.jsxs)("button", {
					type: "button",
					role: "menuitem",
					onClick: () => n("launchpad"),
					children: ["⌂ ", /* @__PURE__ */ (0, x.jsx)("span", { children: "My Home" })]
				}),
				/* @__PURE__ */ (0, x.jsxs)("button", {
					type: "button",
					role: "menuitem",
					onClick: () => n("business"),
					children: ["▤ ", /* @__PURE__ */ (0, x.jsx)("span", { children: "Close worklist" })]
				}),
				/* @__PURE__ */ (0, x.jsxs)("button", {
					type: "button",
					role: "menuitem",
					onClick: () => n("architecture"),
					children: ["⇄ ", /* @__PURE__ */ (0, x.jsx)("span", { children: "Live architecture" })]
				}),
				/* @__PURE__ */ (0, x.jsxs)("button", {
					type: "button",
					role: "menuitem",
					onClick: () => n("approaches"),
					children: ["⇌ ", /* @__PURE__ */ (0, x.jsx)("span", { children: "MCP approaches" })]
				}),
				/* @__PURE__ */ (0, x.jsxs)("button", {
					type: "button",
					role: "menuitem",
					onClick: () => n("agent"),
					children: ["✦ ", /* @__PURE__ */ (0, x.jsx)("span", { children: "Ask Finance Agent" })]
				})
			]
		})]
	});
}
function bt({ questions: e, periodCount: t, localBundle: n, onOpenApp: r, onOpenDecision: i, onOpenQuestions: a }) {
	return /* @__PURE__ */ (0, x.jsxs)("main", {
		className: "launchpad-content",
		"aria-label": "Finance My Home",
		children: [/* @__PURE__ */ (0, x.jsxs)("div", {
			className: "launchpad-page-title",
			children: [
				/* @__PURE__ */ (0, x.jsx)("span", {
					className: "eyebrow",
					children: "MY HOME / FINANCE"
				}),
				/* @__PURE__ */ (0, x.jsx)("h2", { children: "Finance workspace" }),
				/* @__PURE__ */ (0, x.jsx)("p", { children: "Month-end reconciliation and the architecture decisions required before a live SAP integration." })
			]
		}), /* @__PURE__ */ (0, x.jsxs)("div", {
			className: "launchpad-columns",
			children: [/* @__PURE__ */ (0, x.jsxs)("section", {
				className: "launchpad-apps",
				"aria-labelledby": "launchpad-apps-title",
				children: [
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "launchpad-group-heading",
						children: /* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
							className: "eyebrow",
							children: "APPLICATIONS"
						}), /* @__PURE__ */ (0, x.jsx)("h3", {
							id: "launchpad-apps-title",
							children: "My Apps"
						})] })
					}),
					/* @__PURE__ */ (0, x.jsxs)("button", {
						type: "button",
						className: "launchpad-app-tile",
						onClick: r,
						"aria-label": "Open Finance Reconciliation Agent",
						children: [/* @__PURE__ */ (0, x.jsx)("span", {
							className: "launchpad-app-icon",
							"aria-hidden": "true",
							children: "▤"
						}), /* @__PURE__ */ (0, x.jsxs)("span", {
							className: "launchpad-app-copy",
							children: [
								/* @__PURE__ */ (0, x.jsx)("strong", { children: "Finance Reconciliation Agent" }),
								/* @__PURE__ */ (0, x.jsx)("small", { children: "Period-end close work center" }),
								/* @__PURE__ */ (0, x.jsx)("em", { children: "Open application →" })
							]
						})]
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "launchpad-app-facts",
						children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: t }), /* @__PURE__ */ (0, x.jsx)("span", { children: "close periods" })] }), /* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: "2" }), /* @__PURE__ */ (0, x.jsx)("span", { children: "simulated routes" })] })]
					}),
					n && /* @__PURE__ */ (0, x.jsxs)("div", {
						className: "launchpad-download",
						children: [
							/* @__PURE__ */ (0, x.jsx)("strong", { children: "Present on your laptop" }),
							/* @__PURE__ */ (0, x.jsx)("p", { children: "Download the local Windows demo. Python is needed on first launch." }),
							/* @__PURE__ */ (0, x.jsx)("a", {
								href: n.url,
								download: "finance_reconciliation_local_windows.zip",
								"aria-label": "Download local Windows demo bundle",
								children: "Download Windows bundle ↓"
							}),
							/* @__PURE__ */ (0, x.jsxs)("small", { children: [
								Math.round(n.bytes / 1024),
								" KB · SHA-256 ",
								n.sha256.slice(0, 12),
								"…"
							] })
						]
					})
				]
			}), /* @__PURE__ */ (0, x.jsxs)("section", {
				className: "launchpad-decisions surface",
				"aria-labelledby": "launchpad-decisions-title",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "launchpad-decisions-heading",
					children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [
						/* @__PURE__ */ (0, x.jsx)("span", {
							className: "eyebrow",
							children: "ARCHITECTURE ALIGNMENT"
						}),
						/* @__PURE__ */ (0, x.jsx)("h3", {
							id: "launchpad-decisions-title",
							children: "Open decisions"
						}),
						/* @__PURE__ */ (0, x.jsx)("p", { children: "Choose a question to see its component flow, decision owner and required proof." })
					] }), /* @__PURE__ */ (0, x.jsxs)("button", {
						type: "button",
						onClick: a,
						children: [
							"Review all ",
							e.length || 6,
							" →"
						]
					})]
				}), /* @__PURE__ */ (0, x.jsxs)("div", {
					className: "launchpad-decision-list",
					children: [e.map((e, t) => /* @__PURE__ */ (0, x.jsxs)("button", {
						type: "button",
						className: "launchpad-decision-row",
						onClick: () => i(e.id),
						children: [
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "launchpad-decision-number",
								children: String(t + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, x.jsxs)("span", {
								className: "launchpad-decision-copy",
								children: [
									/* @__PURE__ */ (0, x.jsx)("strong", { children: e.title }),
									/* @__PURE__ */ (0, x.jsxs)("small", { children: ["Owner · ", e.owner] }),
									/* @__PURE__ */ (0, x.jsxs)("span", { children: ["Next · ", e.next_action] })
								]
							}),
							/* @__PURE__ */ (0, x.jsx)("em", { children: "OPEN" }),
							/* @__PURE__ */ (0, x.jsx)("b", {
								"aria-hidden": "true",
								children: "›"
							})
						]
					}, e.id)), !e.length && /* @__PURE__ */ (0, x.jsx)("p", {
						className: "launchpad-loading",
						children: "Loading architecture decisions…"
					})]
				})]
			})]
		})]
	});
}
function xt({ result: e, onOpenEvidence: t, onRunCurrent: n }) {
	let r = e?.variance;
	return /* @__PURE__ */ (0, x.jsxs)("section", {
		className: "surface business-result",
		children: [/* @__PURE__ */ (0, x.jsxs)("div", {
			className: "section-heading",
			children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
				className: "eyebrow",
				children: "MONTH-END RECONCILIATION"
			}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "Business outcome" })] }), e && /* @__PURE__ */ (0, x.jsx)("span", {
				className: "pill quiet",
				children: gt(e.scope?.period)
			})]
		}), r ? /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "business-object-status",
				children: [/* @__PURE__ */ (0, x.jsx)("span", {
					className: `business-state ${r.state === "comparable" && Number(r.amount) === 0 ? "business-state-ok" : "business-state-warn"}`,
					children: r.state === "comparable" ? Number(r.amount) === 0 ? "● Reconciled" : "● Variance to review" : "● Source review required"
				}), /* @__PURE__ */ (0, x.jsx)("span", { children: "Period-end close result" })]
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "business-result-metrics",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Variance" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: r.amount === null ? "Not comparable" : _t(r.amount) })] }), /* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Source status" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: r.state.toUpperCase() })] })]
			}),
			/* @__PURE__ */ (0, x.jsx)("p", {
				className: "business-result-explanation",
				children: e.advisory_explanation
			}),
			/* @__PURE__ */ (0, x.jsx)("button", {
				type: "button",
				className: "business-evidence-link",
				onClick: t,
				children: "Inspect source records and calculation →"
			})
		] }) : /* @__PURE__ */ (0, x.jsxs)("div", {
			className: "empty-state",
			children: [
				/* @__PURE__ */ (0, x.jsx)("div", {
					className: "empty-icon",
					children: "▦"
				}),
				/* @__PURE__ */ (0, x.jsx)("strong", { children: "No report selected" }),
				/* @__PURE__ */ (0, x.jsx)("p", { children: "Select a close period to calculate its result, or start with the current period." }),
				/* @__PURE__ */ (0, x.jsx)("button", {
					type: "button",
					className: "primary fi-empty-action",
					onClick: n,
					children: "Reconcile current period"
				})
			]
		})]
	});
}
function St({ caseRecord: e, onClose: t, onOpenEvidence: n }) {
	let r = (0, b.useRef)(null), i = e?.result, a = i?.variance;
	return (0, b.useEffect)(() => {
		let e = r.current;
		return e?.showModal(), () => {
			e?.open && e.close();
		};
	}, []), /* @__PURE__ */ (0, x.jsxs)("dialog", {
		ref: r,
		className: "business-report-dialog",
		"aria-labelledby": "business-report-title",
		onClose: t,
		children: [
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "business-report-header",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [
					/* @__PURE__ */ (0, x.jsx)("span", {
						className: "eyebrow",
						children: "SYNTHETIC MONTH-END RECONCILIATION"
					}),
					/* @__PURE__ */ (0, x.jsx)("h2", {
						id: "business-report-title",
						children: "Business analysis report"
					}),
					/* @__PURE__ */ (0, x.jsx)("p", { children: i ? `${gt(i.scope?.period)} · ${i.scenario} · ${i.case_id}` : "No completed case selected" })
				] }), /* @__PURE__ */ (0, x.jsx)("button", {
					type: "button",
					onClick: t,
					"aria-label": "Close business report",
					children: "×"
				})]
			}),
			a ? /* @__PURE__ */ (0, x.jsxs)("div", {
				className: "business-report-body",
				children: [
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "business-report-summary",
						children: [
							/* @__PURE__ */ (0, x.jsxs)("div", { children: [
								/* @__PURE__ */ (0, x.jsx)("span", { children: "Variance" }),
								/* @__PURE__ */ (0, x.jsx)("strong", { children: a.amount === null ? "Not comparable" : _t(a.amount) }),
								/* @__PURE__ */ (0, x.jsx)("small", { children: "S/4HANA − Central Finance" })
							] }),
							/* @__PURE__ */ (0, x.jsxs)("div", { children: [
								/* @__PURE__ */ (0, x.jsx)("span", { children: "Result state" }),
								/* @__PURE__ */ (0, x.jsx)("strong", { children: a.state.toUpperCase() }),
								/* @__PURE__ */ (0, x.jsx)("small", { children: a.state === "comparable" ? "Sources are comparable" : "Source review required" })
							] }),
							/* @__PURE__ */ (0, x.jsxs)("div", { children: [
								/* @__PURE__ */ (0, x.jsx)("span", { children: "Period" }),
								/* @__PURE__ */ (0, x.jsx)("strong", { children: gt(i.scope?.period) }),
								/* @__PURE__ */ (0, x.jsxs)("small", { children: [i.scenario, " synthetic route"] })
							] })
						]
					}),
					/* @__PURE__ */ (0, x.jsxs)("section", { children: [
						/* @__PURE__ */ (0, x.jsx)("h3", { children: "Business conclusion" }),
						/* @__PURE__ */ (0, x.jsx)("p", { children: i.advisory_explanation }),
						/* @__PURE__ */ (0, x.jsx)("p", { children: "The calculation is deterministic. Review the supporting records before proposing any variance marker." })
					] }),
					/* @__PURE__ */ (0, x.jsx)("p", {
						className: "business-report-note",
						children: "Synthetic local data only. This report does not post to SAP or prove live system authorization."
					})
				]
			}) : /* @__PURE__ */ (0, x.jsx)("div", {
				className: "business-report-body",
				children: /* @__PURE__ */ (0, x.jsxs)("div", {
					className: "empty-state",
					children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: "No completed report yet" }), /* @__PURE__ */ (0, x.jsx)("p", { children: "Run the architecture for a synthetic month-end period, then open Business report again to inspect the calculated result and evidence." })]
				})
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "business-report-actions",
				children: [i && /* @__PURE__ */ (0, x.jsx)("button", {
					type: "button",
					onClick: () => {
						t(), n();
					},
					children: "Inspect source records in Evidence →"
				}), /* @__PURE__ */ (0, x.jsx)("button", {
					type: "button",
					className: "primary",
					onClick: t,
					children: "Close"
				})]
			})
		]
	});
}
function Ct({ registry: e, events: t, scenario: n, selectedZone: r, onZone: i, viewportRef: a, liveRunning: o, reportReady: s, onOpenReport: c }) {
	let l = (0, b.useMemo)(() => Object.fromEntries((e?.components || []).map((e) => [e.component_id, e.zone])), [e]), u = (0, b.useMemo)(() => Object.fromEntries(dt.map((t) => [t, (e?.components || []).filter((e) => e.zone === t)])), [e]), d = (0, b.useMemo)(() => {
		let e = {};
		for (let n of t) {
			let t = n.direction === "response" ? n.source_component_id : n.target_component_id, r = l[t];
			if (!r) continue;
			let i = e[r] || {
				count: 0,
				last: null
			};
			i.count++, i.last = n, e[r] = i;
		}
		return e;
	}, [t, l]), f = t.at(-1), p = f ? l[f.direction === "response" ? f.source_component_id : f.target_component_id] : null;
	(0, b.useEffect)(() => {
		if (!p || !a.current) return;
		let e = a.current.querySelector(`[data-zone="${CSS.escape(p)}"]`);
		e && a.current.scrollTo({
			left: Math.max(0, e.offsetLeft - a.current.clientWidth * .36),
			behavior: "smooth"
		});
	}, [p, a]);
	function m(e, t, a = !1) {
		let s = u[e] || [], c = d[e], l = p === e && o;
		return /* @__PURE__ */ (0, x.jsxs)("button", {
			type: "button",
			"data-zone": e,
			onClick: () => i(e),
			className: `route-zone ${a ? "branch-zone" : ""} ${r === e ? "selected" : ""} ${l ? "current" : ""} ${c ? "visited" : ""} ${e === "Future BDC" ? "future-zone" : ""}`,
			children: [
				/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "route-top",
					children: [/* @__PURE__ */ (0, x.jsx)("span", {
						className: "route-index",
						children: String(t + 1).padStart(2, "0")
					}), /* @__PURE__ */ (0, x.jsx)("span", {
						className: "route-count",
						children: e === "Selected gateway" ? `${n} · ${n === "S1" ? "Apigee" : "AgentCore"}` : `${s.length} components`
					})]
				}),
				/* @__PURE__ */ (0, x.jsx)("div", {
					className: "route-icon",
					children: {
						"Business entry": "◫",
						"AWS runtime": "⬡",
						"Selected gateway": "⇄",
						"Domain MCP": "⊞",
						"SAP BAIP": "⇥",
						"SAP backends": "▦",
						"Enterprise Databricks": "▤",
						"Model branch": "✦",
						"AI Foundry design time": "◇",
						"AWS controls": "◈",
						"Future BDC": "▧",
						"Write approval": "✓"
					}[e]
				}),
				/* @__PURE__ */ (0, x.jsx)("strong", { children: mt[e] }),
				/* @__PURE__ */ (0, x.jsx)("small", { children: e === "Selected gateway" ? n === "S1" ? "S1 · Apigee external boundary" : "S2 · AgentCore AWS boundary" : e }),
				/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "route-status",
					children: [/* @__PURE__ */ (0, x.jsx)("span", { className: `status-dot ${l ? "pulsing" : ""}` }), l ? "Processing now" : c ? `${c.count} events` : e === "Future BDC" ? "Future / simulated" : a ? "Separate branch" : "Waiting"]
				})
			]
		});
	}
	return /* @__PURE__ */ (0, x.jsxs)("div", {
		className: "route-scroll",
		ref: a,
		"aria-label": "Live architecture topology",
		children: [
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "route-section-label",
				children: ["EXTERNAL AGENT DOMAIN ", /* @__PURE__ */ (0, x.jsx)("span", { children: "Finance intent → external agent → selected gateway → approved domain tools" })]
			}),
			/* @__PURE__ */ (0, x.jsx)("div", {
				className: "route-lanes",
				children: ft.map((e, t) => /* @__PURE__ */ (0, x.jsxs)(b.Fragment, { children: [m(e, t), t < ft.length - 1 && /* @__PURE__ */ (0, x.jsx)("div", {
					className: `route-connector ${p === e && o ? "flowing" : ""}`,
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, x.jsx)("span", {})
				})] }, e))
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "route-section-label branch-label",
				children: ["SAP-OWNED FINANCE DOMAIN ", /* @__PURE__ */ (0, x.jsx)("span", { children: "Domain tools → SAP integration → backend authorization; data evidence is a separate path" })]
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "source-route-lanes",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "source-route-group",
					children: [/* @__PURE__ */ (0, x.jsx)("span", {
						className: "source-route-label",
						children: "SAP path"
					}), /* @__PURE__ */ (0, x.jsxs)("div", {
						className: "route-lanes",
						children: [
							m("SAP BAIP", 4),
							/* @__PURE__ */ (0, x.jsx)("div", {
								className: "route-connector",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, x.jsx)("span", {})
							}),
							m("SAP backends", 5)
						]
					})]
				}), /* @__PURE__ */ (0, x.jsxs)("div", {
					className: "source-route-group",
					children: [/* @__PURE__ */ (0, x.jsx)("span", {
						className: "source-route-label",
						children: "Data evidence path"
					}), /* @__PURE__ */ (0, x.jsx)("div", {
						className: "route-lanes",
						children: m("Enterprise Databricks", 6)
					})]
				})]
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "route-section-label branch-label",
				children: ["EVIDENCE TO BUSINESS RESULT ", /* @__PURE__ */ (0, x.jsx)("span", { children: "SAP snapshots return to the agent; the finance calculation is deterministic" })]
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "return-lanes",
				children: [
					m("Model branch", 7),
					/* @__PURE__ */ (0, x.jsx)("div", {
						className: "route-connector",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, x.jsx)("span", {})
					}),
					/* @__PURE__ */ (0, x.jsxs)("button", {
						type: "button",
						className: `report-node ${s ? "complete" : ""}`,
						onClick: c,
						"aria-label": "Open detailed business report",
						children: [
							/* @__PURE__ */ (0, x.jsxs)("span", { children: ["08 / RESULT · ", s ? "COMPLETE" : "AWAITING RUN"] }),
							/* @__PURE__ */ (0, x.jsx)("strong", { children: "Business report" }),
							/* @__PURE__ */ (0, x.jsx)("small", { children: s ? "Open analysis and evidence →" : "Run architecture to generate output" })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "route-section-label branch-label",
				children: ["CONNECTED ARCHITECTURE BRANCHES ", /* @__PURE__ */ (0, x.jsx)("span", { children: "Activated before a run, invoked as a control, optional future, or separate approval" })]
			}),
			/* @__PURE__ */ (0, x.jsx)("div", {
				className: "branch-lanes",
				children: pt.map(([e, t], n) => /* @__PURE__ */ (0, x.jsxs)("div", {
					className: "branch-wrapper",
					children: [/* @__PURE__ */ (0, x.jsx)("div", {
						className: "branch-role",
						children: t
					}), m(e, n + 8, !0)]
				}, e))
			})
		]
	});
}
function wt({ registry: e, zone: t, events: n, selectedComponent: r, onComponent: i, scenario: a }) {
	let o = (e?.components || []).filter((e) => e.zone === t), s = (0, b.useMemo)(() => {
		let e = {};
		for (let t of n) {
			let n = t.direction === "response" ? t.source_component_id : t.target_component_id;
			e[n] = t;
		}
		return e;
	}, [n]), c = o.find((e) => e.component_id === r) || o[0], l = c && s[c.component_id];
	return /* @__PURE__ */ (0, x.jsxs)("div", {
		className: "detail-layout",
		children: [/* @__PURE__ */ (0, x.jsxs)("section", {
			className: "surface component-panel",
			children: [/* @__PURE__ */ (0, x.jsxs)("div", {
				className: "section-heading",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
					className: "eyebrow",
					children: "COMPONENT LAYER"
				}), /* @__PURE__ */ (0, x.jsx)("h2", { children: t })] }), /* @__PURE__ */ (0, x.jsxs)("span", {
					className: "pill quiet",
					children: [o.length, " nodes"]
				})]
			}), /* @__PURE__ */ (0, x.jsx)("div", {
				className: "component-grid",
				children: o.map((e) => {
					let t = s[e.component_id], n = e.runtime_state === "scenario_s1" && a === "S2" || e.runtime_state === "scenario_s2" && a === "S1", r = n ? `INACTIVE IN ${a}` : e.runtime_state === "future" ? "FUTURE" : e.runtime_state === "inactive" ? "INACTIVE" : t?.direction === "request" ? "PROCESSING" : t ? "RETURNED" : "READY";
					return /* @__PURE__ */ (0, x.jsxs)("button", {
						type: "button",
						onClick: () => i(e.component_id),
						className: `component-tile ${c?.component_id === e.component_id ? "selected" : ""} ${r === "PROCESSING" ? "working" : ""} ${n ? "skipped" : ""}`,
						children: [
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "component-type",
								children: e.classification
							}),
							/* @__PURE__ */ (0, x.jsx)("strong", { children: e.display_name }),
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: `component-state ${r === "RETURNED" ? "ok" : r === "PROCESSING" ? "busy" : ""}`,
								children: r
							}),
							t && /* @__PURE__ */ (0, x.jsxs)("small", { children: [
								t.operation.replaceAll("_", " "),
								" · ",
								t.direction
							] })
						]
					}, e.component_id);
				})
			})]
		}), /* @__PURE__ */ (0, x.jsxs)("aside", {
			className: "surface inspector",
			children: [/* @__PURE__ */ (0, x.jsx)("span", {
				className: "eyebrow",
				children: "ARCHITECT INSPECTOR"
			}), c ? /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [
				/* @__PURE__ */ (0, x.jsx)("h2", { children: c.display_name }),
				/* @__PURE__ */ (0, x.jsx)("p", { children: c.purpose }),
				/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "inspector-row",
					children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Owner" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: c.owner })]
				}),
				/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "inspector-row",
					children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Boundary" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: c.trust_boundary })]
				}),
				/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "inspector-row",
					children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Contract" }), /* @__PURE__ */ (0, x.jsx)("strong", { children: c.request_schema })]
				}),
				/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "inspector-block",
					children: [/* @__PURE__ */ (0, x.jsx)("span", {
						className: "eyebrow",
						children: "LATEST COMPONENT MESSAGE"
					}), l ? /* @__PURE__ */ (0, x.jsxs)(x.Fragment, { children: [/* @__PURE__ */ (0, x.jsxs)("p", {
						className: "message-operation",
						children: [
							l.operation.replaceAll("_", " "),
							" · ",
							l.direction,
							" · ",
							l.status
						]
					}), /* @__PURE__ */ (0, x.jsx)("pre", { children: JSON.stringify(l.payload_summary || {}, null, 2) })] }) : /* @__PURE__ */ (0, x.jsx)("p", {
						className: "micro",
						children: "Run a question to see this component's bounded input and output."
					})]
				}),
				/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "validation-note",
					children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: "Live validation still required" }), /* @__PURE__ */ (0, x.jsx)("p", { children: c.remaining_live_vendor_validation })]
				})
			] }) : /* @__PURE__ */ (0, x.jsx)("p", { children: "Select a component." })]
		})]
	});
}
function Tt({ bridge: e }) {
	let t = !!e, [n, r] = (0, b.useState)(e?.data || null), [i, a] = (0, b.useState)("business"), [o, s] = (0, b.useState)("S1"), [c, l] = (0, b.useState)("S1"), [u, d] = (0, b.useState)("launchpad"), f = (0, b.useRef)("business"), [p, m] = (0, b.useState)(!1), [h, g] = (0, b.useState)(!1), [_, v] = (0, b.useState)(null), [y, S] = (0, b.useState)(null), [T, ee] = (0, b.useState)({
		section: "proof",
		nonce: 0
	}), [E, D] = (0, b.useState)(!1), [te, ne] = (0, b.useState)("S1"), [O, re] = (0, b.useState)("2026-11"), [ae, oe] = (0, b.useState)(60), [se, le] = (0, b.useState)(""), [ue, de] = (0, b.useState)("Reconcile the selected synthetic period"), [fe, pe] = (0, b.useState)([{
		role: "assistant",
		text: "Ask about a reconciliation, the source evidence, an architecture component, or a control. Each answer has an inspectable synthetic flow."
	}]), [k, me] = (0, b.useState)(null), [he, ge] = (0, b.useState)(null), [_e, ve] = (0, b.useState)([]), [be, A] = (0, b.useState)(!1), [j, xe] = (0, b.useState)("Business entry"), [Se, Ce] = (0, b.useState)(null), [we, M] = (0, b.useState)(null), [N, Te] = (0, b.useState)(null), [Ee, De] = (0, b.useState)(!1), [Oe, P] = (0, b.useState)(""), [Ae, je] = (0, b.useState)([]), [Me, Ne] = (0, b.useState)([]), [Pe, Fe] = (0, b.useState)(null), [Ie, Le] = (0, b.useState)(e?.data?.investigation || null), [Re, ze] = (0, b.useState)([]), [Be, Ve] = (0, b.useState)(!1), [He, Ue] = (0, b.useState)("maker"), [We, Ge] = (0, b.useState)(!1), [Ke, qe] = (0, b.useState)(e?.data?.decision_run || null), [F, Je] = (0, b.useState)(!1), Ye = (0, b.useRef)(!1), Xe = (0, b.useRef)(null), Ze = (0, b.useRef)(null), Qe = (0, b.useRef)(null), $e = (0, b.useRef)(null), et = n?.architecture, tt = n?.history, nt = Me.find((e) => e.case_id === k?.case_id);
	(0, b.useEffect)(() => {
		[
			"business",
			"architecture",
			"approaches",
			"diagrams",
			"mcp"
		].includes(i) && (f.current = i);
	}, [i]), (0, b.useEffect)(() => {
		let e = k?.scope?.period;
		!t && e && I(`/api/history/${e}`).then(Fe).catch(() => Fe(null));
	}, [t, k?.scope?.period]);
	let rt = N === null ? _e : _e.slice(0, N + 1), it = we || rt.at(-1), at = it ? it.direction === "response" ? it.source_component_id : it.target_component_id : null, ot = et?.components?.find((e) => e.component_id === at)?.zone;
	(0, b.useEffect)(() => {
		if (!t) return Promise.all([I("/api/bootstrap"), I("/api/proposals")]).then(([e, t]) => {
			r(e), je(e.cases || []), Ne(t);
		}).catch((e) => P(e.message)), () => {
			Xe.current?.close();
		};
	}, [t]), (0, b.useEffect)(() => {
		if (!t) return;
		let n = e.data || {};
		r((e) => ({
			...e,
			...n
		})), je(n.cases || []), Ne(n.proposals || []), Fe(n.history_detail || null), Le(n.investigation || null), ze(n.investigation_events || []), qe(n.decision_run || null), n.decision_run?.status === "complete" && Je(!1), n.active_case && (me(n.active_case), ge(n.active_case.case_id), ne(n.active_case.scenario), re(n.active_case.scope?.period || "2026-11")), n.events && ve(n.events), A(n.active_case?.status === "queued" || n.active_case?.status === "running"), n.response && n.response_nonce !== $e.current && ($e.current = n.response_nonce, Ye.current = !1, Ge(!1), Ve(!1), pe((e) => [...e, {
			role: "assistant",
			text: n.response.answer || n.response.error || "The synthetic operation completed.",
			limited: n.response.status === "limited",
			actions: vt(n.response, n.active_case || k)
		}]), n.response.error && P(n.response.error));
	}, [t, e?.data]), (0, b.useEffect)(() => {
		if (t || !Ie?.investigation_id || !["running", "reconciling"].includes(Ie.status)) return;
		let e = !1, n = setInterval(async () => {
			try {
				let [t, n] = await Promise.all([I(`/api/investigations/${Ie.investigation_id}`), I(`/api/architecture/events?case_id=${encodeURIComponent(Ie.case_id)}`)]);
				e || (Le(t), ze(n), ge(t.case_id), ve(n));
			} catch (t) {
				e || P(t.message);
			}
		}, 350);
		return () => {
			e = !0, clearInterval(n);
		};
	}, [
		t,
		Ie?.investigation_id,
		Ie?.status
	]), (0, b.useEffect)(() => {
		!t && i === "evidence" && Ie?.case_id && I(`/api/architecture/events?case_id=${encodeURIComponent(Ie.case_id)}`).then(ze).catch((e) => P(e.message));
	}, [
		t,
		i,
		Ie?.case_id,
		Ie?.status
	]), (0, b.useEffect)(() => {
		if (t || !Ke?.run_id || Ke.status === "complete") return;
		let e = !1, n = setInterval(async () => {
			try {
				let t = await I(`/api/architecture/questions/runs/${encodeURIComponent(Ke.run_id)}`);
				e || (qe(t), t.status === "complete" && Je(!1));
			} catch (t) {
				e || (P(t.message), Je(!1));
			}
		}, 350);
		return () => {
			e = !0, clearInterval(n);
		};
	}, [
		t,
		Ke?.run_id,
		Ke?.status
	]), (0, b.useEffect)(() => {
		if (!Ee || !_e.length) return;
		let e = setInterval(() => Te((e) => {
			let t = (e ?? -1) + 1;
			return t >= _e.length ? (De(!1), _e.length - 1) : t;
		}), 140);
		return () => clearInterval(e);
	}, [Ee, _e.length]), (0, b.useEffect)(() => {
		Qe.current && (Qe.current.scrollTop = Qe.current.scrollHeight);
	}, [fe]), (0, b.useEffect)(() => {
		if (!p) return;
		let e = (e) => {
			e.key === "Escape" && m(!1);
		};
		return window.addEventListener("keydown", e), document.getElementById("chat-question")?.focus(), () => window.removeEventListener("keydown", e);
	}, [p]), (0, b.useEffect)(() => {
		if (!h) return;
		let e = (e) => {
			e.target.closest(".shell-menu-wrap") || g(!1);
		}, t = (e) => {
			e.key === "Escape" && g(!1);
		};
		return document.addEventListener("pointerdown", e), window.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e), window.removeEventListener("keydown", t);
		};
	}, [h]), (0, b.useEffect)(() => {
		ot && N === null && xe(ot);
	}, [ot, N]), (0, b.useEffect)(() => {
		_ && k?.case_id === _ && (v(null), D(!0));
	}, [_, k?.case_id]);
	async function st(n) {
		if (t) {
			e.action({
				type: "load_case",
				case_id: n
			});
			return;
		}
		let [r, i, a] = await Promise.all([
			I(`/api/cases/${encodeURIComponent(n)}`),
			I(`/api/architecture/events?case_id=${encodeURIComponent(n)}`),
			I(`/api/investigations?case_id=${encodeURIComponent(n)}`)
		]);
		me(r), Le(a[0] || null), ge(n), ne(r.scenario), re(r.scope?.period || O), ve(i), Te(null), M(null);
	}
	function lt(e) {
		Xe.current?.close();
		let t = new EventSource(`/api/architecture/runs/${encodeURIComponent(e)}/stream`);
		Xe.current = t, t.addEventListener("flow", (e) => {
			let t = JSON.parse(e.data);
			ve((e) => e.some((e) => e.seq === t.seq) ? e : [...e, t]);
		}), t.addEventListener("complete", async () => {
			t.close(), Xe.current = null, A(!1);
			try {
				await st(e);
				let t = await I("/api/cases");
				je(t.slice(0, 20));
			} catch (e) {
				P(e.message);
			}
		}), t.onerror = () => {
			P("Live connection interrupted. Stored events can be reloaded from the case list.");
		};
	}
	async function dt() {
		P(""), Le(null), a("architecture"), ve([]), Te(null), M(null), A(!0);
		let n = ue.trim() === "Reconcile the selected synthetic period" || !ue.trim() ? `Reconcile ${gt(O)}` : ue.trim();
		if (t) e.action({
			type: "run",
			message: n,
			scenario: te,
			period: O,
			pace: ae
		});
		else try {
			let e = await I("/api/runs", "POST", {
				message: n,
				scenario: te,
				user_id: "finance.user",
				demo_pace_ms: ae
			});
			if (e.follow_up) {
				A(!1), P(e.follow_up);
				return;
			}
			ge(e.case_id), me({
				case_id: e.case_id,
				scenario: e.scenario,
				scope: e.scope,
				status: "running"
			}), lt(e.case_id);
		} catch (e) {
			A(!1), P(e.message);
		}
	}
	async function ft(n = se) {
		let r = n.trim();
		if (r && !Ye.current) {
			if (Ye.current = !0, Ge(!0), le(""), pe((e) => [...e, {
				role: "user",
				text: r
			}]), P(""), t) e.action({
				type: "chat",
				message: r,
				scenario: k?.scenario || te,
				case_id: k?.case_id
			});
			else try {
				let e = await I("/api/chat", "POST", {
					message: r,
					scenario: k?.scenario || te,
					case_id: k?.case_id,
					user_id: "finance.user"
				});
				pe((t) => [...t, {
					role: "assistant",
					text: e.answer || "The synthetic operation completed.",
					limited: e.status === "limited",
					actions: vt(e, e.result ? {
						case_id: e.case_id,
						result: e.result
					} : k)
				}]), e.investigation && Le(e.investigation), e.result && (Le(null), me({
					case_id: e.case_id,
					scenario: e.scenario,
					scope: e.result.scope,
					status: "complete",
					result: e.result
				}), re(e.result.scope.period), ne(e.scenario)), e.trace_case_id && (ge(e.trace_case_id), ve(await I(`/api/architecture/events?case_id=${encodeURIComponent(e.trace_case_id)}`)), Te(null));
				let [t, n] = await Promise.all([I("/api/cases"), I("/api/proposals")]);
				je(t.slice(0, 20)), Ne(n);
			} catch (e) {
				pe((t) => [...t, {
					role: "assistant",
					text: `I could not complete that synthetic request: ${e.message}`,
					limited: !0
				}]), P(e.message);
			} finally {
				Ye.current = !1, Ge(!1);
			}
		}
	}
	async function pt() {
		if (He !== "approver") P("Switch to the synthetic finance approver lane first.");
		else if (t) e.action({
			type: "approve",
			case_id: k?.case_id,
			role: He
		});
		else try {
			let e = (await I("/api/proposals")).find((e) => e.case_id === k?.case_id && e.status === "awaiting_approval");
			if (!e) {
				P("No pending synthetic proposal for this case.");
				return;
			}
			let t = await I("/api/decisions", "POST", {
				proposal_id: e.proposal_id,
				approver_id: "finance.approver",
				approved: !0,
				payload_hash: e.payload_hash,
				case_version: e.case_version
			});
			pe((e) => [...e, {
				role: "assistant",
				text: `Approval result: ${t.status}. Synthetic variance marker ${t.document_number || "not created"}.`
			}]), ve(await I(`/api/architecture/events?case_id=${encodeURIComponent(k.case_id)}`)), Ne(await I("/api/proposals"));
		} catch (e) {
			P(e.message);
		}
	}
	async function _t(n) {
		if (k?.case_id) {
			if (P(""), Ve(!0), t) e.action({
				type: "investigate",
				case_id: k.case_id,
				fault_profile: n
			});
			else try {
				let e = await I("/api/investigations", "POST", {
					case_id: k.case_id,
					fault_profile: n
				});
				Le(e), ge(e.case_id), Te(null), ve(await I(`/api/architecture/events?case_id=${encodeURIComponent(e.case_id)}`));
			} catch (e) {
				P(e.message);
			} finally {
				Ve(!1);
			}
		}
	}
	async function Tt(n) {
		if (P(""), Ve(!0), t) e.action({
			type: "reprocess",
			investigation_id: n,
			operator_id: "finance.operator"
		});
		else try {
			let e = await I(`/api/investigations/${n}/reprocess`, "POST", { operator_id: "finance.operator" });
			e.after?.case_id && await st(e.after.case_id), Le(e);
			let t = await I("/api/history");
			r((e) => ({
				...e,
				history: t
			})), je((await I("/api/cases")).slice(0, 20)), pe((t) => [...t, {
				role: "assistant",
				text: e.reason
			}]);
		} catch (e) {
			P(e.message);
		} finally {
			Ve(!1);
		}
	}
	async function Et(n) {
		t ? (e.action({
			type: "load_case",
			case_id: n
		}), a("architecture")) : (ge(n), ve(await I(`/api/architecture/events?case_id=${encodeURIComponent(n)}`)), Te(null), a("architecture"));
	}
	async function Dt(n, r, i) {
		if (a("questions"), P(""), Je(!0), qe(null), t) e.action({
			type: "decision_run",
			question_id: n,
			route: r,
			probe: i
		});
		else try {
			let e = await I("/api/architecture/questions/runs", "POST", {
				question_id: n,
				route: r,
				probe: i
			});
			qe(e);
		} catch (e) {
			P(e.message), Je(!1);
		}
	}
	function Ot(e = "proof", t = {}) {
		ee((n) => ({
			section: e,
			...t,
			nonce: n.nonce + 1
		})), a("evidence");
	}
	function kt(e) {
		g(!1), m(!1), e === "launchpad" ? d("launchpad") : (d("app"), e === "agent" ? (a("business"), m(!0)) : a(e));
	}
	function At(e) {
		S((t) => ({
			id: e,
			nonce: (t?.nonce || 0) + 1
		})), d("app"), a("questions");
	}
	async function jt(e) {
		m(!1), g(!1), e.target === "architecture" ? a("architecture") : e.target === "finance" ? Ot("finance") : a(e.target === "report" ? "business" : e.target);
		try {
			if (t && e.target === "report" && e.caseId && e.caseId !== k?.case_id) {
				v(e.caseId), await st(e.caseId);
				return;
			}
			e.caseId && e.caseId !== k?.case_id && e.target !== "questions" && await st(e.caseId), e.target === "architecture" && e.traceId && !t && (ge(e.traceId), ve(await I(`/api/architecture/events?case_id=${encodeURIComponent(e.traceId)}`)), Te(null)), e.target === "report" && D(!0);
		} catch (e) {
			P(e.message);
		}
	}
	let Mt = /* @__PURE__ */ (0, x.jsx)("footer", {
		className: "app-footer",
		children: /* @__PURE__ */ (0, x.jsxs)("span", { children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: "Demo and learning purposes only." }), " Synthetic finance data; no live SAP or cloud system is connected."] })
	});
	return u === "launchpad" ? /* @__PURE__ */ (0, x.jsxs)("div", {
		className: `app-shell launchpad-shell ${t ? "embedded" : ""}`,
		children: [
			/* @__PURE__ */ (0, x.jsxs)("header", {
				className: "shell-header launchpad-header",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "brand",
					children: [/* @__PURE__ */ (0, x.jsx)(yt, {
						open: h,
						onToggle: () => g((e) => !e),
						onNavigate: kt
					}), /* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
						className: "brand-overline",
						children: "FINANCE / LOCAL DEMO"
					}), /* @__PURE__ */ (0, x.jsx)("h1", { children: "My Home" })] })]
				}), /* @__PURE__ */ (0, x.jsx)("div", {
					className: "header-meta",
					children: /* @__PURE__ */ (0, x.jsx)("span", {
						className: "pill simulated",
						children: "LOCAL SIMULATION"
					})
				})]
			}),
			/* @__PURE__ */ (0, x.jsx)(bt, {
				questions: n?.decision_questions || [],
				periodCount: tt?.available_periods?.length || 12,
				localBundle: n?.local_bundle,
				onOpenApp: () => {
					a("business"), d("app");
				},
				onOpenDecision: At,
				onOpenQuestions: () => {
					S(null), a("questions"), d("app");
				}
			}),
			Mt
		]
	}) : /* @__PURE__ */ (0, x.jsxs)("div", {
		className: `app-shell ${t ? "embedded" : ""}`,
		children: [
			/* @__PURE__ */ (0, x.jsxs)("header", {
				className: "shell-header",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", {
					className: "brand",
					children: [
						/* @__PURE__ */ (0, x.jsx)("button", {
							type: "button",
							className: "shell-home",
							onClick: () => kt("launchpad"),
							"aria-label": "Back to Finance Launchpad",
							children: "⌂"
						}),
						/* @__PURE__ */ (0, x.jsx)(yt, {
							open: h,
							onToggle: () => g((e) => !e),
							onNavigate: kt
						}),
						/* @__PURE__ */ (0, x.jsx)("span", {
							className: "brand-mark",
							"aria-hidden": "true",
							children: "F"
						}),
						/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
							className: "brand-overline",
							children: "HOME / FINANCE / RECONCILIATION AGENT"
						}), /* @__PURE__ */ (0, x.jsx)("h1", { children: "Finance Reconciliation Agent" })] })
					]
				}), /* @__PURE__ */ (0, x.jsxs)("div", {
					className: "header-meta",
					children: [
						/* @__PURE__ */ (0, x.jsx)("span", {
							className: "pill simulated",
							children: "LOCAL SIMULATION"
						}),
						/* @__PURE__ */ (0, x.jsx)("span", { className: "header-separator" }),
						/* @__PURE__ */ (0, x.jsxs)("span", { children: [tt?.available_periods?.length || 12, " monthly periods"] })
					]
				})]
			}),
			/* @__PURE__ */ (0, x.jsxs)("nav", {
				className: "tab-nav five",
				"aria-label": "Application sections",
				children: [
					/* @__PURE__ */ (0, x.jsxs)("button", {
						type: "button",
						role: "tab",
						"aria-selected": i === "business",
						className: i === "business" ? "active" : "",
						onClick: () => a("business"),
						children: [
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-icon",
								"aria-hidden": "true",
								children: "▦"
							}),
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-label-full",
								children: "Execution simulator"
							}),
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-label-mobile",
								children: "Execute"
							})
						]
					}),
					/* @__PURE__ */ (0, x.jsxs)("button", {
						type: "button",
						role: "tab",
						"aria-selected": i === "architecture",
						className: i === "architecture" ? "active" : "",
						onClick: () => a("architecture"),
						children: [
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-icon",
								"aria-hidden": "true",
								children: "⇄"
							}),
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-label-full",
								children: "Live architecture"
							}),
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-label-mobile",
								children: "Architecture"
							})
						]
					}),
					/* @__PURE__ */ (0, x.jsxs)("button", {
						type: "button",
						role: "tab",
						"aria-selected": i === "approaches",
						className: i === "approaches" ? "active" : "",
						onClick: () => a("approaches"),
						children: [
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-icon",
								"aria-hidden": "true",
								children: "⇌"
							}),
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-label-full",
								children: "Architecture pros & cons"
							}),
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-label-mobile",
								children: "Pros & cons"
							})
						]
					}),
					/* @__PURE__ */ (0, x.jsxs)("button", {
						type: "button",
						role: "tab",
						"aria-selected": i === "diagrams",
						className: i === "diagrams" ? "active" : "",
						onClick: () => a("diagrams"),
						children: [
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-icon",
								"aria-hidden": "true",
								children: "◫"
							}),
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-label-full",
								children: "Architecture diagrams"
							}),
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-label-mobile",
								children: "Diagrams"
							})
						]
					}),
					/* @__PURE__ */ (0, x.jsxs)("button", {
						type: "button",
						role: "tab",
						"aria-selected": i === "mcp",
						className: i === "mcp" ? "active" : "",
						onClick: () => a("mcp"),
						children: [
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-icon",
								"aria-hidden": "true",
								children: "⬡"
							}),
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-label-full",
								children: "MCP hosting & governance"
							}),
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "tab-label-mobile",
								children: "MCP"
							})
						]
					})
				]
			}),
			(i === "evidence" || i === "questions") && /* @__PURE__ */ (0, x.jsxs)("div", {
				className: "detail-return-bar",
				children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
					className: "eyebrow",
					children: "ON-DEMAND DETAIL"
				}), /* @__PURE__ */ (0, x.jsx)("strong", { children: i === "evidence" ? "Evidence & correlation" : "Architecture questions" })] }), /* @__PURE__ */ (0, x.jsxs)("button", {
					type: "button",
					onClick: () => a(f.current),
					children: ["← Back to ", {
						business: "Execution simulator",
						architecture: "Live architecture",
						approaches: "Architecture pros & cons",
						diagrams: "Architecture diagrams",
						mcp: "MCP hosting & governance"
					}[f.current]]
				})]
			}),
			Oe && /* @__PURE__ */ (0, x.jsxs)("div", {
				className: "error-banner",
				role: "alert",
				children: [
					/* @__PURE__ */ (0, x.jsx)("strong", { children: "Needs attention" }),
					/* @__PURE__ */ (0, x.jsx)("span", { children: Oe }),
					/* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						onClick: () => P(""),
						"aria-label": "Dismiss error",
						children: "×"
					})
				]
			}),
			i === "business" ? /* @__PURE__ */ (0, x.jsxs)("main", {
				className: "business-layout fiori-list-report",
				children: [
					/* @__PURE__ */ (0, x.jsx)(C, {
						history: tt,
						historyDetail: Pe,
						onOpenEvidence: () => Ot("finance"),
						onOpenAgent: () => m(!0),
						cases: Ae,
						currentCase: k,
						proposal: nt,
						role: He,
						onRole: Ue,
						approve: pt,
						loadCase: (e) => ft(`Reconcile ${gt(e)}`)
					}),
					p && /* @__PURE__ */ (0, x.jsx)("button", {
						type: "button",
						className: "chat-drawer-backdrop",
						onClick: () => m(!1),
						"aria-label": "Close Finance Agent panel"
					}),
					/* @__PURE__ */ (0, x.jsxs)("section", {
						className: `surface chat-panel ${p ? "open" : ""}`,
						role: "dialog",
						"aria-label": "Finance Agent",
						"aria-modal": p,
						children: [
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "section-heading",
								children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
									className: "eyebrow",
									children: "BUSINESS USER CHAT"
								}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "Ask about the evidence" })] }), /* @__PURE__ */ (0, x.jsxs)("div", {
									className: "chat-heading-actions",
									children: [
										/* @__PURE__ */ (0, x.jsx)("button", {
											type: "button",
											onClick: () => m(!1),
											"aria-label": "Close Finance Agent",
											children: "Close"
										}),
										/* @__PURE__ */ (0, x.jsx)("button", {
											type: "button",
											onClick: () => pe([]),
											disabled: We || fe.length === 0,
											"aria-label": "Clear chat conversation",
											children: "Clear chat"
										}),
										/* @__PURE__ */ (0, x.jsx)("span", {
											className: "pill ok",
											children: "Ready"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "chat-messages",
								ref: Qe,
								"aria-live": "polite",
								children: [!fe.length && /* @__PURE__ */ (0, x.jsx)("div", {
									className: "chat-empty",
									children: "Chat cleared. The selected case and evidence remain available. Ask a finance question to continue."
								}), fe.map((e, t) => /* @__PURE__ */ (0, x.jsxs)("div", {
									className: `chat-message ${e.role} ${e.limited ? "limited" : ""}`,
									children: [
										/* @__PURE__ */ (0, x.jsx)("span", { children: e.role === "user" ? "You" : "Finance assistant" }),
										/* @__PURE__ */ (0, x.jsx)("p", { children: e.text }),
										e.actions?.length > 0 && /* @__PURE__ */ (0, x.jsx)("div", {
											className: "chat-answer-actions",
											children: e.actions.map((e, n) => /* @__PURE__ */ (0, x.jsxs)("button", {
												type: "button",
												onClick: () => jt(e),
												children: [e.label, " →"]
											}, `${t}-${n}`))
										})
									]
								}, t))]
							}),
							/* @__PURE__ */ (0, x.jsxs)("form", {
								className: "chat-composer",
								onSubmit: (e) => {
									e.preventDefault(), ft();
								},
								children: [/* @__PURE__ */ (0, x.jsx)("label", {
									htmlFor: "chat-question",
									children: "Question"
								}), /* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("input", {
									id: "chat-question",
									value: se,
									onChange: (e) => le(e.target.value),
									placeholder: "Ask about a period, variance, source evidence, or controls"
								}), /* @__PURE__ */ (0, x.jsx)("button", {
									type: "submit",
									className: "primary",
									disabled: We,
									children: We ? "Working…" : "Send"
								})] })]
							}),
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "suggestions",
								children: [/* @__PURE__ */ (0, x.jsx)("span", { children: "Try:" }), [
									"Reconcile " + gt(O),
									"Why is there a variance?",
									"Show source evidence",
									"Investigate this variance"
								].map((e) => /* @__PURE__ */ (0, x.jsx)("button", {
									type: "button",
									disabled: We,
									onClick: () => ft(e),
									children: e
								}, e))]
							}),
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "chat-footer",
								children: [/* @__PURE__ */ (0, x.jsx)("button", {
									type: "button",
									className: "text-link",
									onClick: () => a("architecture"),
									children: "Inspect this question’s architecture →"
								}), k && /* @__PURE__ */ (0, x.jsxs)("span", { children: [
									"Case ",
									k.case_id,
									" · ",
									k.scenario
								] })]
							})
						]
					}),
					/* @__PURE__ */ (0, x.jsxs)("div", {
						className: "right-column",
						children: [
							Ie && /* @__PURE__ */ (0, x.jsx)(w, {
								investigation: Ie,
								onOpen: () => Ot("proof")
							}),
							/* @__PURE__ */ (0, x.jsx)(xt, {
								result: k?.result,
								onOpenEvidence: () => Ot("finance"),
								onRunCurrent: () => ft(`Reconcile ${gt(O)}`)
							}),
							k?.result?.variance?.amount !== null && k?.result?.variance?.amount !== void 0 && Number(k.result.variance.amount) !== 0 && Ie?.case_id !== k.case_id && /* @__PURE__ */ (0, x.jsxs)("section", {
								className: "surface action-strip",
								children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [
									/* @__PURE__ */ (0, x.jsx)("span", {
										className: "eyebrow",
										children: "CONTROLLED WRITE BRANCH"
									}),
									/* @__PURE__ */ (0, x.jsx)("strong", { children: "Signed variance marker requires separate approval" }),
									/* @__PURE__ */ (0, x.jsx)("p", { children: "A comparable nonzero variance may create a local marker proposal." })
								] }), /* @__PURE__ */ (0, x.jsx)("button", {
									type: "button",
									onClick: () => ft("Propose an adjustment"),
									children: "Propose variance marker"
								})]
							})
						]
					})
				]
			}) : i === "architecture" ? /* @__PURE__ */ (0, x.jsxs)("main", {
				className: "architecture-layout",
				children: [
					/* @__PURE__ */ (0, x.jsxs)("section", {
						className: "surface command-bar",
						children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [
							/* @__PURE__ */ (0, x.jsx)("span", {
								className: "eyebrow",
								children: "EXTERNAL AGENT → SAP FINANCE"
							}),
							/* @__PURE__ */ (0, x.jsx)("h2", { children: "Follow an external agent into SAP" }),
							/* @__PURE__ */ (0, x.jsx)("p", { children: "S1 Apigee and S2 AgentCore are simulated alternatives. The combined S3 path requires a separate architecture decision." }),
							/* @__PURE__ */ (0, x.jsx)("button", {
								type: "button",
								className: "text-link architecture-question-link",
								onClick: () => a("questions"),
								children: "Review open architecture questions →"
							})
						] }), /* @__PURE__ */ (0, x.jsxs)("div", {
							className: "command-controls",
							children: [
								/* @__PURE__ */ (0, x.jsxs)("label", { children: ["Business intent", /* @__PURE__ */ (0, x.jsx)("input", {
									value: ue,
									onChange: (e) => de(e.target.value),
									"aria-label": "Business intent"
								})] }),
								/* @__PURE__ */ (0, x.jsxs)("label", { children: ["Period", /* @__PURE__ */ (0, x.jsx)("select", {
									value: O,
									onChange: (e) => re(e.target.value),
									children: (tt?.available_periods || ["2026-11"]).map((e) => /* @__PURE__ */ (0, x.jsx)("option", {
										value: e,
										children: gt(e)
									}, e))
								})] }),
								/* @__PURE__ */ (0, x.jsxs)("label", { children: ["Route", /* @__PURE__ */ (0, x.jsxs)("select", {
									value: te,
									onChange: (e) => ne(e.target.value),
									disabled: be,
									children: [/* @__PURE__ */ (0, x.jsx)("option", {
										value: "S1",
										children: "S1 · Apigee"
									}), /* @__PURE__ */ (0, x.jsx)("option", {
										value: "S2",
										children: "S2 · AgentCore"
									})]
								})] }),
								/* @__PURE__ */ (0, x.jsxs)("label", { children: ["Pace", /* @__PURE__ */ (0, x.jsxs)("select", {
									value: ae,
									onChange: (e) => oe(Number(e.target.value)),
									children: [
										/* @__PURE__ */ (0, x.jsx)("option", {
											value: 30,
											children: "Fast"
										}),
										/* @__PURE__ */ (0, x.jsx)("option", {
											value: 60,
											children: "Normal"
										}),
										/* @__PURE__ */ (0, x.jsx)("option", {
											value: 120,
											children: "Slow"
										})
									]
								})] }),
								/* @__PURE__ */ (0, x.jsx)("button", {
									type: "button",
									className: "primary",
									onClick: dt,
									disabled: be,
									children: be ? "Running…" : "Run architecture"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, x.jsxs)("section", {
						className: "surface route-panel",
						children: [
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "section-heading",
								children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
									className: "eyebrow",
									children: "COMPONENT COMMUNICATION"
								}), /* @__PURE__ */ (0, x.jsx)("h2", { children: be ? "Processing live" : k?.status === "complete" ? "Case complete" : "Architecture ready" })] }), /* @__PURE__ */ (0, x.jsxs)("div", {
									className: "route-actions",
									children: [
										/* @__PURE__ */ (0, x.jsx)("span", {
											className: "pill quiet",
											children: he || "No trace selected"
										}),
										/* @__PURE__ */ (0, x.jsx)("button", {
											type: "button",
											onClick: () => {
												Te(-1), M(null), De(!0);
											},
											disabled: !_e.length,
											children: "Replay"
										}),
										/* @__PURE__ */ (0, x.jsx)("button", {
											type: "button",
											onClick: () => De(!1),
											disabled: !Ee,
											children: "Pause"
										}),
										/* @__PURE__ */ (0, x.jsx)("button", {
											type: "button",
											onClick: () => {
												De(!1), Te(null), M(null);
											},
											disabled: N === null,
											children: "Live"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, x.jsx)(Ct, {
								registry: et,
								events: rt,
								scenario: te,
								selectedZone: j,
								onZone: (e) => {
									xe(e), Ce(null);
								},
								viewportRef: Ze,
								liveRunning: be,
								reportReady: !!k?.result?.variance,
								onOpenReport: () => D(!0)
							}),
							/* @__PURE__ */ (0, x.jsxs)("div", {
								className: "flow-caption",
								children: [
									/* @__PURE__ */ (0, x.jsx)("span", { className: `status-dot ${be ? "pulsing" : ""}` }),
									" ",
									/* @__PURE__ */ (0, x.jsx)("strong", { children: it ? `${it.status === "denied" ? "Control denied" : "Handoff recorded"} · ${mt[ot || j] || ot || j}` : "Awaiting a business question" }),
									/* @__PURE__ */ (0, x.jsx)("span", { children: mt[ot] || "Select a route zone" }),
									/* @__PURE__ */ (0, x.jsxs)("span", { children: [_e.length, " stored events"] })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, x.jsx)(ut, {
						events: rt,
						running: be,
						selectedZone: mt[j] || j,
						onOpenEvidence: () => Ot("components")
					}),
					/* @__PURE__ */ (0, x.jsxs)("section", {
						className: "surface case-strip",
						children: [/* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
							className: "eyebrow",
							children: "STORED CASES"
						}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "Replay an earlier run" })] }), /* @__PURE__ */ (0, x.jsxs)("div", {
							className: "case-buttons",
							children: [Ae.slice(0, 8).map((e) => /* @__PURE__ */ (0, x.jsxs)("button", {
								type: "button",
								onClick: () => st(e.case_id),
								children: [
									gt(e.scope?.period),
									" · ",
									e.scenario,
									" · ",
									e.status
								]
							}, e.case_id)), !Ae.length && /* @__PURE__ */ (0, x.jsx)("span", {
								className: "micro",
								children: "No completed case yet."
							})]
						})]
					})
				]
			}) : i === "questions" ? /* @__PURE__ */ (0, x.jsx)(ce, {
				questions: n?.decision_questions || [],
				routePlaybooks: n?.route_playbooks || {},
				focus: y,
				run: Ke,
				onRun: Dt,
				busy: F,
				onOpenEvidence: (e) => Ot("questions", { stepSeq: e })
			}) : i === "mcp" ? /* @__PURE__ */ (0, x.jsx)(ct, {
				view: c,
				onView: l,
				onApproaches: () => a("approaches"),
				onDetailed: (e) => {
					s(e), a("diagrams");
				}
			}) : i === "diagrams" ? /* @__PURE__ */ (0, x.jsx)(ke, {
				view: o,
				onView: s,
				onBack: () => a("approaches")
			}) : i === "approaches" ? /* @__PURE__ */ (0, x.jsx)(ye, {
				playbooks: n?.route_playbooks || {},
				onQuestion: () => a("questions"),
				onDetailedDiagram: (e) => {
					s(e), a("diagrams");
				},
				onGovernance: (e) => {
					l(e), a("mcp");
				}
			}) : /* @__PURE__ */ (0, x.jsx)(ie, {
				investigation: Ie,
				currentCase: k,
				history: tt,
				busy: Be,
				onStart: _t,
				onResolve: Tt,
				onTrace: Et,
				historyDetail: Pe,
				events: Ie?.case_id === k?.case_id && Re.length ? Re : _e,
				caseEvents: _e,
				decisionRun: Ke,
				decisionQuestions: n?.decision_questions || [],
				focus: T,
				componentDetails: /* @__PURE__ */ (0, x.jsx)(wt, {
					registry: et,
					zone: j,
					events: rt,
					selectedComponent: Se,
					onComponent: Ce,
					scenario: te
				}),
				reviewPanel: /* @__PURE__ */ (0, x.jsxs)("section", {
					className: "surface architect-review",
					children: [
						/* @__PURE__ */ (0, x.jsx)("div", {
							className: "section-heading",
							children: /* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("span", {
								className: "eyebrow",
								children: "CROSS-DISCIPLINE REVIEW"
							}), /* @__PURE__ */ (0, x.jsx)("h2", { children: "Architect questions to test" })] })
						}),
						/* @__PURE__ */ (0, x.jsx)("div", {
							className: "review-list",
							children: ht.map(([e, t]) => /* @__PURE__ */ (0, x.jsxs)("div", { children: [/* @__PURE__ */ (0, x.jsx)("strong", { children: e }), /* @__PURE__ */ (0, x.jsx)("span", { children: t })] }, e))
						}),
						/* @__PURE__ */ (0, x.jsx)("p", {
							className: "micro",
							children: "Vendor-named stages are simulations. G1–G7 remain open pending tenant evidence."
						})
					]
				})
			}),
			Mt,
			E && /* @__PURE__ */ (0, x.jsx)(St, {
				caseRecord: k,
				onClose: () => D(!1),
				onOpenEvidence: () => Ot("finance")
			})
		]
	});
}
// src/streamlit.jsx
var Et = /* @__PURE__ */ new WeakMap();
function Dt(e) {
	let { parentElement: t, data: n, setTriggerValue: r } = e, i = t.querySelector(".finance-root");
	if (!i) throw Error("Missing finance component mount");
	let a = Et.get(t);
	return a || (a = (0, y.createRoot)(i), Et.set(t, a)), a.render(/* @__PURE__ */ (0, x.jsx)(Tt, { bridge: {
		data: n || {},
		action: (e) => r("action", e)
	} })), () => {
		let e = Et.get(t);
		e && (e.unmount(), Et.delete(t));
	};
}
export { Dt as default };
