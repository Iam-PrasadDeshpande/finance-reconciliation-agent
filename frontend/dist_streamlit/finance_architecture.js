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
	}, E = Object.prototype.hasOwnProperty;
	function D(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function O(e, t) {
		return D(e.type, t, e.props);
	}
	function ee(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function te(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var ne = /\/+/g;
	function re(e, t) {
		return typeof e == "object" && e && e.key != null ? te("" + e.key) : t.toString(36);
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
		if (c) return o = o(e), c = a === "" ? "." + re(e, 0) : a, C(o) ? (i = "", c != null && (i = c.replace(ne, "$&/") + "/"), ae(o, r, i, "", function(e) {
			return e;
		})) : o != null && (ee(o) && (o = O(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(ne, "$&/") + "/") + c)), r.push(o)), 1;
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
	function k(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return ae(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function oe(e) {
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
	var se = typeof reportError == "function" ? reportError : function(e) {
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
	function ce(e) {
		var t = T.T, n = {};
		n.types = t === null ? null : t.types, T.T = n;
		try {
			var r = e(), i = T.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(w, se);
		} catch (e) {
			se(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), T.T = t;
		}
	}
	function le(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else ce(le.bind(null, e));
	}
	var A = {
		map: k,
		forEach: function(e, t, n) {
			k(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return k(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return k(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!ee(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = A, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = le, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !E.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return D(e.type, i, r);
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
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) E.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return D(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = ee, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: oe
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = ce, e.unstable_useCacheRefresh = function() {
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
			if (n(c) !== null) m = !0, S || (S = !0, O());
			else {
				var t = n(l);
				t !== null && ne(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function E() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function D() {
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
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && E());) {
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
								u !== null && ne(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? O() : S = !1;
			}
		}
	}
	var O;
	if (typeof y == "function") O = function() {
		y(D);
	};
	else if (typeof MessageChannel < "u") {
		var ee = new MessageChannel(), te = ee.port2;
		ee.port1.onmessage = D, O = function() {
			te.postMessage(null);
		};
	} else O = function() {
		_(D, 0);
	};
	function ne(t, n) {
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
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, ne(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, O()))), r;
	}, e.unstable_shouldYield = E, e.unstable_wrapCallback = function(e) {
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
	function E(e, t, n) {
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
	var D = Object.assign, O = Symbol.for("react.element"), ee = Symbol.for("react.transitional.element"), te = Symbol.for("react.portal"), ne = Symbol.for("react.fragment"), re = Symbol.for("react.strict_mode"), ie = Symbol.for("react.profiler"), ae = Symbol.for("react.consumer"), k = Symbol.for("react.context"), oe = Symbol.for("react.forward_ref"), se = Symbol.for("react.suspense"), ce = Symbol.for("react.suspense_list"), le = Symbol.for("react.memo"), A = Symbol.for("react.lazy"), ue = Symbol.for("react.activity"), de = Symbol.for("react.legacy_hidden"), fe = Symbol.for("react.memo_cache_sentinel"), pe = Symbol.for("react.view_transition"), me = Symbol.for("react.recoverable"), he = Symbol.iterator;
	function j(e) {
		return typeof e != "object" || !e ? null : (e = he && e[he] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var ge = Symbol.for("react.client.reference");
	function _e(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === ge ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case ne: return "Fragment";
			case ie: return "Profiler";
			case re: return "StrictMode";
			case se: return "Suspense";
			case ce: return "SuspenseList";
			case ue: return "Activity";
			case pe: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case te: return "Portal";
			case k: return e.displayName || "Context";
			case ae: return (e._context.displayName || "Context") + ".Consumer";
			case oe:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case le: return t = e.displayName || null, t === null ? _e(e.type) || "Memo" : t;
			case A:
				t = e._payload, e = e._init;
				try {
					return _e(e(t));
				} catch {}
		}
		return null;
	}
	var ve = Array.isArray, M = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, N = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ye = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, be = [], P = -1;
	function xe(e) {
		return { current: e };
	}
	function Se(e) {
		0 > P || (e.current = be[P], be[P] = null, P--);
	}
	function F(e, t) {
		P++, be[P] = e.current, e.current = t;
	}
	var Ce = xe(null), we = xe(null), Te = xe(null), Ee = xe(null);
	function De(e, t) {
		switch (F(Te, t), F(we, e), F(Ce, null), t.nodeType) {
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
		Se(Ce), F(Ce, e);
	}
	function Oe() {
		Se(Ce), Se(we), Se(Te);
	}
	function ke(e) {
		var t = e.memoizedState;
		t !== null && (sh._currentValue = t.memoizedState, F(Ee, e)), t = Ce.current;
		var n = dp(t, e.type);
		t !== n && (F(we, e), F(Ce, n));
	}
	function Ae(e) {
		we.current === e && (Se(Ce), Se(we)), Ee.current === e && (Se(Ee), sh._currentValue = ye);
	}
	var je, Me;
	function Ne(e) {
		if (je === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			je = t && t[1] || "", Me = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + je + e + Me;
	}
	var I = !1;
	function Pe(e, t) {
		if (!e || I) return "";
		I = !0;
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
			I = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Ne(n) : "";
	}
	function Fe(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Ne(e.type);
			case 16: return Ne("Lazy");
			case 13: return e.child !== t && t !== null ? Ne("Suspense Fallback") : Ne("Suspense");
			case 19: return Ne("SuspenseList");
			case 0:
			case 15: return Pe(e.type, !1);
			case 11: return Pe(e.type.render, !1);
			case 1: return Pe(e.type, !0);
			case 31: return Ne("Activity");
			case 30: return Ne("ViewTransition");
			default: return "";
		}
	}
	function Ie(e) {
		try {
			var t = "", n = null;
			do
				t += Fe(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Le = Object.prototype.hasOwnProperty, Re = t.unstable_scheduleCallback, ze = t.unstable_cancelCallback, Be = t.unstable_shouldYield, Ve = t.unstable_requestPaint, He = t.unstable_now, Ue = t.unstable_getCurrentPriorityLevel, We = t.unstable_ImmediatePriority, Ge = t.unstable_UserBlockingPriority, Ke = t.unstable_NormalPriority, qe = t.unstable_LowPriority, Je = t.unstable_IdlePriority, Ye = t.log, Xe = t.unstable_setDisableYieldValue, Ze = null, Qe = null;
	function $e(e) {
		if (typeof Ye == "function" && Xe(e), Qe && typeof Qe.setStrictMode == "function") try {
			Qe.setStrictMode(Ze, e);
		} catch {}
	}
	var et = Math.clz32 ? Math.clz32 : L, tt = Math.log, nt = Math.LN2;
	function L(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (tt(e) / nt | 0) | 0;
	}
	var rt = 256, it = 262144, at = 4194304;
	function ot(e) {
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
	function st(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = ot(n))) : i = ot(o) : i = ot(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = ot(n))) : i = ot(o)) : i = ot(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function ct(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function lt(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - et(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function ut(e, t) {
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
	function dt() {
		var e = at;
		return at <<= 1, !(at & 62914560) && (at = 4194304), e;
	}
	function ft(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function pt(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function mt(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - et(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && ht(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function ht(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - et(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function gt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - et(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function _t(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : vt(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function vt(e) {
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
	function yt(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function bt() {
		var e = N.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Ch(e.type)) : e;
	}
	function xt(e, t) {
		var n = N.p;
		try {
			return N.p = e, t();
		} finally {
			N.p = n;
		}
	}
	var St = Math.random().toString(36).slice(2), Ct = "__reactFiber$" + St, R = "__reactProps$" + St, wt = "__reactContainer$" + St, Tt = "__reactEvents$" + St, Et = "__reactListeners$" + St, Dt = "__reactHandles$" + St, Ot = "__reactResources$" + St, kt = "__reactMarker$" + St, At = "__reactLoad$" + St;
	function jt(e) {
		delete e[Ct], delete e[R], delete e[Et], delete e[Dt];
	}
	function Mt(e) {
		var t;
		if (t = e[Ct]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[wt] || n[Ct]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = fm(e); e !== null;) {
					if (n = e[Ct]) return n;
					e = fm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Nt(e) {
		if (e = e[Ct] || e[wt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Pt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Ft(e) {
		var t = e[Ot];
		return t ||= e[Ot] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function It(e) {
		e[kt] = !0;
	}
	function Lt(e) {
		e[At] = void 0;
	}
	var Rt = /* @__PURE__ */ new Set(), zt = {};
	function Bt(e, t) {
		Vt(e, t), Vt(e + "Capture", t);
	}
	function Vt(e, t) {
		for (zt[e] = t, e = 0; e < t.length; e++) Rt.add(t[e]);
	}
	var Ht = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Ut = {}, Wt = {};
	function Gt(e) {
		return Le.call(Wt, e) ? !0 : Le.call(Ut, e) ? !1 : Ht.test(e) ? Wt[e] = !0 : (Ut[e] = !0, !1);
	}
	var z = !1;
	function Kt() {
		var e = z;
		return z = !1, e;
	}
	function qt(e, t, n) {
		if (Gt(t)) {
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
	function Jt(e, t, n) {
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
	function Yt(e, t, n, r) {
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
	function Xt(e) {
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
	function Zt(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Qt(e, t, n) {
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
	function $t(e) {
		if (!e._valueTracker) {
			var t = Zt(e) ? "checked" : "value";
			e._valueTracker = Qt(e, t, "" + e[t]);
		}
	}
	function en(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Zt(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var tn = /[\n"\\]/g;
	function nn(e) {
		return e.replace(tn, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function rn(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Xt(t)) : e.value !== "" + Xt(t) && (e.value = "" + Xt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : on(e, Xt(n)) : o === "number" && e.value == t ? on(e, Xt(e.value)) : on(e, Xt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Xt(s) : e.removeAttribute("name");
	}
	function an(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				$t(e);
				return;
			}
			n = n == null ? "" : "" + Xt(n), t = t == null ? n : "" + Xt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), $t(e);
	}
	function on(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function sn(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Xt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function cn(e, t, n) {
		t != null && (t = "" + Xt(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + Xt(n);
	}
	function ln(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (ve(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Xt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), $t(e);
	}
	function un(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var dn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function fn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || dn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function pn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", z = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (fn(e, a, r), z = !0);
		} else for (var o in t) t.hasOwnProperty(o) && fn(e, o, t[o]);
	}
	function mn(e) {
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
	var hn = /* @__PURE__ */ new Map([
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
	]), gn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function _n(e) {
		return gn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function vn() {}
	var yn = null;
	function bn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var xn = null, Sn = null;
	function Cn(e) {
		var t = Nt(e);
		if (t && (e = t.stateNode)) {
			var n = e[R] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (rn(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + nn("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[R] || null;
								if (!a) throw Error(i(90));
								rn(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && en(r);
					}
					break a;
				case "textarea":
					cn(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && sn(e, !!n.multiple, t, !1);
			}
		}
	}
	var wn = !1;
	function Tn(e, t, n) {
		if (wn) return e(t, n);
		wn = !0;
		try {
			return e(t);
		} finally {
			if (wn = !1, (xn !== null || Sn !== null) && (zd(), xn && (t = xn, e = Sn, Sn = xn = null, Cn(t), e))) for (t = 0; t < e.length; t++) Cn(e[t]);
		}
	}
	function En(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[R] || null;
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
	var Dn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, On = !1;
	if (Dn) try {
		var kn = {};
		Object.defineProperty(kn, "passive", { get: function() {
			On = !0;
		} }), window.addEventListener("test", kn, kn), window.removeEventListener("test", kn, kn);
	} catch {
		On = !1;
	}
	var An = null, jn = null, Mn = null;
	function Nn() {
		if (Mn) return Mn;
		var e, t = jn, n = t.length, r, i = "value" in An ? An.value : An.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Mn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function Pn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Fn() {
		return !0;
	}
	function In() {
		return !1;
	}
	function Ln(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Fn : In, this.isPropagationStopped = In, this;
		}
		return D(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Fn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Fn);
			},
			persist: function() {},
			isPersistent: Fn
		}), t;
	}
	var Rn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, zn = Ln(Rn), Bn = D({}, Rn, {
		view: 0,
		detail: 0
	}), Vn = Ln(Bn), Hn, Un, Wn, Gn = D({}, Bn, {
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
		getModifierState: nr,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Wn && (Wn && e.type === "mousemove" ? (Hn = e.screenX - Wn.screenX, Un = e.screenY - Wn.screenY) : Un = Hn = 0, Wn = e), Hn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Un;
		}
	}), Kn = Ln(Gn), qn = Ln(D({}, Gn, { dataTransfer: 0 })), Jn = Ln(D({}, Bn, { relatedTarget: 0 })), Yn = Ln(D({}, Rn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Xn = Ln(D({}, Rn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Zn = Ln(D({}, Rn, { data: 0 })), Qn = {
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
	}, $n = {
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
	}, er = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function tr(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = er[e]) ? !!t[e] : !1;
	}
	function nr() {
		return tr;
	}
	var rr = Ln(D({}, Bn, {
		key: function(e) {
			if (e.key) {
				var t = Qn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Pn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? $n[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: nr,
		charCode: function(e) {
			return e.type === "keypress" ? Pn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? Pn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), ir = Ln(D({}, Gn, {
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
	})), ar = Ln(D({}, Rn, { submitter: 0 })), or = Ln(D({}, Bn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: nr
	})), sr = Ln(D({}, Rn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), cr = Ln(D({}, Gn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), lr = Ln(D({}, Rn, {
		newState: 0,
		oldState: 0,
		source: 0
	})), ur = [
		9,
		13,
		27,
		32
	], dr = Dn && "CompositionEvent" in window, fr = null;
	Dn && "documentMode" in document && (fr = document.documentMode);
	var pr = Dn && "TextEvent" in window && !fr, mr = Dn && (!dr || fr && 8 < fr && 11 >= fr), hr = " ", gr = !1;
	function _r(e, t) {
		switch (e) {
			case "keyup": return ur.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function vr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var yr = !1;
	function br(e, t) {
		switch (e) {
			case "compositionend": return vr(t);
			case "keypress": return t.which === 32 ? (gr = !0, hr) : null;
			case "textInput": return e = t.data, e === hr && gr ? null : e;
			default: return null;
		}
	}
	function xr(e, t) {
		if (yr) return e === "compositionend" || !dr && _r(e, t) ? (e = Nn(), Mn = jn = An = null, yr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return mr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var Sr = {
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
	function Cr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!Sr[e.type] : t === "textarea";
	}
	function wr(e, t, n, r) {
		xn ? Sn ? Sn.push(r) : Sn = [r] : xn = r, t = Jf(t, "onChange"), 0 < t.length && (n = new zn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var B = null, Tr = null;
	function Er(e) {
		Vf(e, 0);
	}
	function Dr(e) {
		if (en(Pt(e))) return e;
	}
	function Or(e, t) {
		if (e === "change") return t;
	}
	var kr = !1;
	if (Dn) {
		var Ar;
		if (Dn) {
			var jr = "oninput" in document;
			if (!jr) {
				var Mr = document.createElement("div");
				Mr.setAttribute("oninput", "return;"), jr = typeof Mr.oninput == "function";
			}
			Ar = jr;
		} else Ar = !1;
		kr = Ar && (!document.documentMode || 9 < document.documentMode);
	}
	function Nr() {
		B && (B.detachEvent("onpropertychange", Pr), Tr = B = null);
	}
	function Pr(e) {
		if (e.propertyName === "value" && Dr(Tr)) {
			var t = [];
			wr(t, Tr, e, bn(e)), Tn(Er, t);
		}
	}
	function Fr(e, t, n) {
		e === "focusin" ? (Nr(), B = t, Tr = n, B.attachEvent("onpropertychange", Pr)) : e === "focusout" && Nr();
	}
	function Ir(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return Dr(Tr);
	}
	function Lr(e, t) {
		if (e === "click") return Dr(t);
	}
	function Rr(e, t) {
		if (e === "input" || e === "change") return Dr(t);
	}
	function zr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Br = typeof Object.is == "function" ? Object.is : zr;
	function Vr(e, t) {
		if (Br(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Le.call(t, i) || !Br(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Hr(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Ur(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Wr(e, t) {
		var n = Ur(e);
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
			n = Ur(n);
		}
	}
	function Gr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Gr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Kr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Hr(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Hr(e.document);
		}
		return t;
	}
	function qr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Jr = Dn && "documentMode" in document && 11 >= document.documentMode, Yr = null, Xr = null, Zr = null, Qr = !1;
	function $r(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Qr || Yr == null || Yr !== Hr(r) || (r = Yr, "selectionStart" in r && qr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Zr && Vr(Zr, r) || (Zr = r, r = Jf(Xr, "onSelect"), 0 < r.length && (t = new zn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Yr)));
	}
	function ei(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var ti = {
		animationend: ei("Animation", "AnimationEnd"),
		animationiteration: ei("Animation", "AnimationIteration"),
		animationstart: ei("Animation", "AnimationStart"),
		transitionrun: ei("Transition", "TransitionRun"),
		transitionstart: ei("Transition", "TransitionStart"),
		transitioncancel: ei("Transition", "TransitionCancel"),
		transitionend: ei("Transition", "TransitionEnd")
	}, ni = {}, ri = {};
	Dn && (ri = document.createElement("div").style, "AnimationEvent" in window || (delete ti.animationend.animation, delete ti.animationiteration.animation, delete ti.animationstart.animation), "TransitionEvent" in window || delete ti.transitionend.transition);
	function ii(e) {
		if (ni[e]) return ni[e];
		if (!ti[e]) return e;
		var t = ti[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in ri) return ni[e] = t[n];
		return e;
	}
	var ai = ii("animationend"), oi = ii("animationiteration"), si = ii("animationstart"), ci = ii("transitionrun"), li = ii("transitionstart"), ui = ii("transitioncancel"), di = ii("transitionend"), fi = /* @__PURE__ */ new Map(), pi = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	pi.push("scrollEnd");
	function mi(e, t) {
		fi.set(e, t), Bt(t, [e]);
	}
	var hi = 0;
	function gi(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = bd.identifierPrefix;
		var n = hi++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function _i(e) {
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
	function vi(e, t) {
		return e = _i(e), t = _i(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var yi = typeof reportError == "function" ? reportError : function(e) {
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
	}, bi = [], xi = 0, Si = 0;
	function Ci() {
		for (var e = xi, t = Si = xi = 0; t < e;) {
			var n = bi[t];
			bi[t++] = null;
			var r = bi[t];
			bi[t++] = null;
			var i = bi[t];
			bi[t++] = null;
			var a = bi[t];
			if (bi[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Di(n, i, a);
		}
	}
	function wi(e, t, n, r) {
		bi[xi++] = e, bi[xi++] = t, bi[xi++] = n, bi[xi++] = r, Si |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function Ti(e, t, n, r) {
		return wi(e, t, n, r), Oi(e);
	}
	function Ei(e, t) {
		return wi(e, null, null, t), Oi(e);
	}
	function Di(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - et(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Oi(e) {
		if (50 < kd) throw kd = 0, Ad = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var ki = {};
	function Ai(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function ji(e, t, n, r) {
		return new Ai(e, t, n, r);
	}
	function Mi(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function Ni(e, t) {
		var n = e.alternate;
		return n === null ? (n = ji(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Pi(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Fi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") Mi(r) && (s = 1);
		else if (typeof r == "string") s = qm(e, n, Ce.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case ue: return e = ji(31, n, t, a), e.elementType = ue, e.lanes = o, e;
			case ne: return Ii(n.children, a, o, t);
			case re:
				s = 8, a |= 24;
				break;
			case ie: return e = ji(12, n, t, a | 2), e.elementType = ie, e.lanes = o, e;
			case se: return e = ji(13, n, t, a), e.elementType = se, e.lanes = o, e;
			case ce: return e = ji(19, n, t, a), e.elementType = ce, e.lanes = o, e;
			case de:
			case pe: return e = a | 32, e = ji(30, n, t, e), e.elementType = pe, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case k:
						s = 10;
						break a;
					case ae:
						s = 9;
						break a;
					case oe:
						s = 11;
						break a;
					case le:
						s = 14;
						break a;
					case A:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = ji(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Ii(e, t, n, r) {
		return e = ji(7, e, r, t), e.lanes = n, e;
	}
	function Li(e, t, n) {
		return e = ji(6, e, null, t), e.lanes = n, e;
	}
	function Ri(e) {
		var t = ji(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function zi(e, t, n) {
		return t = ji(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Bi = /* @__PURE__ */ new WeakMap();
	function Vi(e, t) {
		if (typeof e == "object" && e) {
			var n = Bi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Ie(t)
			}, Bi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Ie(t)
		};
	}
	var Hi = [], Ui = 0, Wi = null, Gi = 0, Ki = [], qi = 0, Ji = null, Yi = 1, Xi = "";
	function Zi(e, t) {
		Hi[Ui++] = Gi, Hi[Ui++] = Wi, Wi = e, Gi = t;
	}
	function Qi(e, t, n) {
		Ki[qi++] = Yi, Ki[qi++] = Xi, Ki[qi++] = Ji, Ji = e;
		var r = Yi;
		e = Xi;
		var i = 32 - et(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - et(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Yi = 1 << 32 - et(t) + i | n << i | r, Xi = a + e;
		} else Yi = 1 << a | n << i | r, Xi = e;
	}
	function $i(e) {
		e.return !== null && (Zi(e, 1), Qi(e, 1, 0));
	}
	function ea(e) {
		for (; e === Wi;) Wi = Hi[--Ui], Hi[Ui] = null, Gi = Hi[--Ui], Hi[Ui] = null;
		for (; e === Ji;) Ji = Ki[--qi], Ki[qi] = null, Xi = Ki[--qi], Ki[qi] = null, Yi = Ki[--qi], Ki[qi] = null;
	}
	function ta(e, t) {
		Ki[qi++] = Yi, Ki[qi++] = Xi, Ki[qi++] = Ji, Yi = t.id, Xi = t.overflow, Ji = e;
	}
	var na = null, ra = null, V = !1, ia = null, aa = !1, oa = Error(i(519));
	function sa(e) {
		throw pa(Vi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), oa;
	}
	function ca(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[Ct] = e, t[R] = r, n) {
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
				Q("invalid", t), an(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), ln(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || ep(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = vn), t = !0) : t = !1, t || sa(e, !0);
	}
	function la(e) {
		for (na = e.return; na;) switch (na.tag) {
			case 5:
			case 31:
			case 13:
				aa = !1;
				return;
			case 27:
			case 3:
				aa = !0;
				return;
			default: na = na.return;
		}
	}
	function ua(e) {
		if (e !== na) return !1;
		if (!V) return la(e), V = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || pp(e.type, e.memoizedProps)), n = !n), n && ra && sa(e), la(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			ra = dm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			ra = dm(e);
		} else t === 27 ? (t = ra, Sp(e.type) ? (e = um, um = null, ra = e) : ra = t) : ra = na ? lm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function da() {
		ra = na = null, V = !1;
	}
	function fa() {
		var e = ia;
		return e !== null && (fd === null ? fd = e : fd.push.apply(fd, e), ia = null), e;
	}
	function pa(e) {
		ia === null ? ia = [e] : ia.push(e);
	}
	var ma = xe(null), ha = null, ga = null;
	function _a(e, t, n) {
		F(ma, t._currentValue), t._currentValue = n;
	}
	function va(e) {
		e._currentValue = ma.current, Se(ma);
	}
	function ya(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function ba(e, t, n, r) {
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
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), ya(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), ya(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), ya(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
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
	function xa(e, t, n, r) {
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
					Br(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === Ee.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [sh] : e.push(sh));
			}
			a = a.return;
		}
		return e !== null && ba(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function Sa(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Br(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function Ca(e) {
		ha = e, ga = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function wa(e) {
		return Ea(ha, e);
	}
	function Ta(e, t) {
		return ha === null && Ca(e), Ea(e, t);
	}
	function Ea(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, ga === null) {
			if (e === null) throw Error(i(308));
			ga = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else ga = ga.next = t;
		return n;
	}
	var Da = typeof AbortController < "u" ? AbortController : function() {
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
	}, Oa = t.unstable_scheduleCallback, ka = t.unstable_NormalPriority, Aa = {
		$$typeof: k,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function ja() {
		return {
			controller: new Da(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function Ma(e) {
		e.refCount--, e.refCount === 0 && Oa(ka, function() {
			e.controller.abort();
		});
	}
	function Na(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Pa = null;
	function Fa(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Ia = null, La = 0, Ra = 0, za = null;
	function Ba(e, t) {
		if (Ia === null) {
			var n = Ia = [];
			La = 0, Ra = Pf(), za = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return La++, t.then(Va, Va), t;
	}
	function Va() {
		if (--La === 0 && (Pa = null, Ia !== null)) {
			za !== null && (za.status = "fulfilled");
			var e = Ia;
			Ia = null, Ra = 0, za = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Ha(e, t) {
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
	var Ua = M.S;
	M.S = function(e, t) {
		if (hd = He(), typeof t == "object" && t && typeof t.then == "function" && Ba(e, t), Pa !== null) for (var n = bf; n !== null;) Na(n, Pa), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = bf; r !== null;) Na(r, n), r = r.next;
			if (Ra !== 0) {
				r = Pa, r === null && (r = Pa = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ua !== null && Ua(e, t);
	};
	var Wa = xe(null);
	function Ga() {
		var e = Wa.current;
		return e === null ? q.pooledCache : e;
	}
	function Ka(e, t) {
		t === null ? F(Wa, Wa.current) : F(Wa, t.pool);
	}
	function qa() {
		var e = Ga();
		return e === null ? null : {
			parent: Aa._currentValue,
			pool: e
		};
	}
	var Ja = Error(i(460)), Ya = Error(i(474)), Xa = Error(i(542)), Za = { then: function() {} };
	function Qa(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function $a(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(vn, vn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, ro(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(vn, vn);
				else {
					if (e = q, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
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
					case "rejected": throw e = t.reason, ro(e), e;
				}
				throw to = t, Ja;
		}
	}
	function eo(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (to = e, Ja) : e;
		}
	}
	var to = null;
	function no() {
		if (to === null) throw Error(i(459));
		var e = to;
		return to = null, e;
	}
	function ro(e) {
		if (e === Ja || e === Xa) throw Error(i(483));
	}
	var io = null, ao = 0;
	function oo(e) {
		var t = ao;
		return ao += 1, io === null && (io = []), $a(io, e, t);
	}
	function so(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function co(e, t) {
		throw t.$$typeof === O ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function lo(e) {
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
			return e = Ni(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Li(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === ne ? (e = d(e, t, n.props.children, r, n.key), so(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === A && eo(i) === t.type) ? (t = a(t, n.props), so(t, n), t.return = e, t) : (t = Fi(n.type, n.key, n.props, null, e.mode, r), so(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = zi(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Ii(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Li("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case ee: return n = Fi(t.type, t.key, t.props, null, e.mode, n), so(n, t), n.return = e, n;
					case te: return t = zi(t, e.mode, n), t.return = e, t;
					case A: return t = eo(t), f(e, t, n);
				}
				if (ve(t) || j(t)) return t = Ii(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, oo(t), n);
				if (t.$$typeof === k) return f(e, Ta(e, t), n);
				co(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case ee: return n.key === i ? l(e, t, n, r) : null;
					case te: return n.key === i ? u(e, t, n, r) : null;
					case A: return n = eo(n), p(e, t, n, r);
				}
				if (ve(n) || j(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, oo(n), r);
				if (n.$$typeof === k) return p(e, t, Ta(e, n), r);
				co(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case ee: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case te: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case A: return r = eo(r), m(e, t, n, r, i);
				}
				if (ve(r) || j(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, oo(r), i);
				if (r.$$typeof === k) return m(e, t, n, Ta(t, r), i);
				co(t, r);
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
			if (h === s.length) return n(i, d), V && Zi(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return V && Zi(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), V && Zi(i, h), l;
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
			if (v.done) return n(a, h), V && Zi(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return V && Zi(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), V && Zi(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === ne && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case ee:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === ne) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), so(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === A && eo(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), so(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === ne ? (c = Ii(o.props.children, e.mode, c, o.key), so(c, o), c.return = e, e = c) : (c = Fi(o.type, o.key, o.props, null, e.mode, c), so(c, o), c.return = e, e = c);
						}
						return s(e);
					case te:
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
							c = zi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case A: return o = eo(o), _(e, r, o, c);
				}
				if (ve(o)) return h(e, r, o, c);
				if (j(o)) {
					if (l = j(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, oo(o), c);
				if (o.$$typeof === k) return _(e, r, Ta(e, o), c);
				co(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = Li(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				ao = 0;
				var i = _(e, t, n, r);
				return io = null, i;
			} catch (t) {
				if (t === Ja || t === Xa) throw t;
				var a = ji(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var uo = lo(!0), fo = lo(!1), po = !1;
	function mo(e) {
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
	function ho(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function go(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function _o(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, K & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Oi(e), Di(e, null, n), t;
		}
		return wi(e, r, t, n), Oi(e);
	}
	function vo(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, gt(e, n);
		}
	}
	function yo(e, t) {
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
	var bo = !1;
	function xo() {
		if (bo) {
			var e = za;
			if (e !== null) throw e;
		}
	}
	function So(e, t, n, r) {
		bo = !1;
		var i = e.updateQueue;
		po = !1;
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
				if (p ? (Y & f) === f : (r & f) === f) {
					f !== 0 && f === Ra && (bo = !0), u !== null && (u = u.next = {
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
								d = D({}, d, f);
								break a;
							case 2: po = !0;
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
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), od |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Co(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function wo(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Co(n[e], t);
	}
	var To = xe(null), Eo = xe(0);
	function Do(e, t) {
		e = id, F(Eo, e), F(To, t), id = e | t.baseLanes;
	}
	function Oo() {
		F(Eo, id), F(To, To.current);
	}
	function ko() {
		id = Eo.current, Se(To), Se(Eo);
	}
	var Ao = xe(null), jo = null;
	function Mo(e) {
		var t = e.alternate;
		F(Lo, Lo.current & 1), F(Ao, e), jo === null && (t === null || To.current !== null || t.memoizedState !== null) && (jo = e);
	}
	function No(e) {
		F(Lo, Lo.current), F(Ao, e), jo === null && (jo = e);
	}
	function Po(e) {
		e.tag === 22 ? (F(Lo, Lo.current), F(Ao, e), jo === null && (jo = e)) : Fo();
	}
	function Fo() {
		F(Lo, Lo.current), F(Ao, Ao.current);
	}
	function Io(e) {
		Se(Ao), jo === e && (jo = null), Se(Lo);
	}
	var Lo = xe(0);
	function Ro(e, t) {
		F(Ao, Ao.current), F(Lo, t);
	}
	function zo(e) {
		Se(Lo), Se(Ao), jo === e && (jo = null);
	}
	function Bo(e) {
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
	var Vo = 0, H = null, U = null, Ho = null, Uo = !1, Wo = !1, Go = !1, Ko = 0, qo = 0, Jo = null, Yo = 0;
	function Xo() {
		throw Error(i(321));
	}
	function Zo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Br(e[n], t[n])) return !1;
		return !0;
	}
	function Qo(e, t, n, r, i, a) {
		return Vo = a, H = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, M.H = e === null || e.memoizedState === null ? hc : gc, Go = !1, a = n(r, i), Go = !1, Wo && (a = es(t, n, r, i)), $o(e), a;
	}
	function $o(e) {
		M.H = mc;
		var t = U !== null && U.next !== null;
		if (Vo = 0, Ho = U = H = null, Uo = !1, qo = 0, Jo = null, t) throw Error(i(300));
		e === null || Nc || (e = e.dependencies, e !== null && Sa(e) && (Nc = !0));
	}
	function es(e, t, n, r) {
		H = e;
		var a = 0;
		do {
			if (Wo && (Jo = null), qo = 0, Wo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Ho = U = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			M.H = _c, o = t(n, r);
		} while (Wo);
		return o;
	}
	function ts() {
		var e = M.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? cs(t) : t, e = e.useState()[0], (U === null ? null : U.memoizedState) !== e && (H.flags |= 1024), t;
	}
	function ns() {
		var e = Ko !== 0;
		return Ko = 0, e;
	}
	function rs(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function is(e) {
		if (Uo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Uo = !1;
		}
		Vo = 0, Ho = U = H = null, Wo = !1, qo = Ko = 0, Jo = null;
	}
	function as() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Ho === null ? H.memoizedState = Ho = e : Ho = Ho.next = e, Ho;
	}
	function os() {
		if (U === null) {
			var e = H.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = U.next;
		var t = Ho === null ? H.memoizedState : Ho.next;
		if (t !== null) Ho = t, U = e;
		else {
			if (e === null) throw H.alternate === null ? Error(i(467)) : Error(i(310));
			U = e, e = {
				memoizedState: U.memoizedState,
				baseState: U.baseState,
				baseQueue: U.baseQueue,
				queue: U.queue,
				next: null
			}, Ho === null ? H.memoizedState = Ho = e : Ho = Ho.next = e;
		}
		return Ho;
	}
	function ss() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function cs(e) {
		var t = qo;
		return qo += 1, Jo === null && (Jo = []), e = $a(Jo, e, t), t = H, (Ho === null ? t.memoizedState : Ho.next) === null && (t = t.alternate, M.H = t === null || t.memoizedState === null ? hc : gc), e;
	}
	function ls(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return cs(e);
			if (e.$$typeof === me) return;
			if (e.$$typeof === k) return wa(e);
		}
		throw Error(i(438, String(e)));
	}
	function us(e) {
		var t = null, n = H.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = H.alternate;
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
		}, n === null && (n = ss(), H.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = fe;
		return t.index++, n;
	}
	function ds(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function fs(e) {
		return ps(os(), U, e);
	}
	function ps(e, t, n) {
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
				if (f === u.lane ? (Vo & f) === f : (Y & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === Ra && (d = !0);
					else if ((Vo & p) === p) {
						u = u.next, p === Ra && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, H.lanes |= p, od |= p;
					f = u.action, Go && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, H.lanes |= f, od |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Br(o, e.memoizedState) && (Nc = !0, d && (n = za, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function ms(e) {
		var t = os(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Br(o, t.memoizedState) || (Nc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function hs(e, t, n) {
		var r = H, a = os(), o = V;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Br((U || a).memoizedState, n);
		if (s && (a.memoizedState = n, Nc = !0), a = a.queue, Bs(vs.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Ho !== null && !!(Ho.memoizedState.tag & 1), Fs(e ? 9 : 8, { destroy: void 0 }, _s.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, q === null) throw Error(i(349));
			o || Vo & 127 || gs(r, t, n);
		}
		return n;
	}
	function gs(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = H.updateQueue, t === null ? (t = ss(), H.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function _s(e, t, n, r) {
		t.value = n, t.getSnapshot = r, ys(t) && bs(e);
	}
	function vs(e, t, n) {
		return n(function() {
			ys(t) && bs(e);
		});
	}
	function ys(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Br(e, n);
		} catch {
			return !0;
		}
	}
	function bs(e) {
		var t = Ei(e, 2);
		t !== null && Pd(t, e, 2);
	}
	function xs(e) {
		var t = as();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Go) {
				$e(!0);
				try {
					n();
				} finally {
					$e(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: ds,
			lastRenderedState: e
		}, t;
	}
	function Ss(e, t, n, r) {
		return e.baseState = n, ps(e, U, typeof r == "function" ? r : ds);
	}
	function Cs(e, t, n, r, a) {
		if (dc(e)) throw Error(i(485));
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
			M.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, ws(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function ws(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = M.T, o = {};
			o.types = a === null ? null : a.types, M.T = o;
			try {
				var s = n(i, r), c = M.S;
				c !== null && c(o, s), Ts(e, t, s);
			} catch (n) {
				Ds(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), M.T = a;
			}
		} else try {
			a = n(i, r), Ts(e, t, a);
		} catch (n) {
			Ds(e, t, n);
		}
	}
	function Ts(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Es(e, t, n);
		}, function(n) {
			return Ds(e, t, n);
		}) : Es(e, t, n);
	}
	function Es(e, t, n) {
		t.status = "fulfilled", t.value = n, Os(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, ws(e, n)));
	}
	function Ds(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Os(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Os(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function ks(e, t) {
		return t;
	}
	function As(e, t) {
		if (V) {
			var n = q.formState;
			if (n !== null) {
				a: {
					var r = H;
					if (V) {
						if (ra) {
							b: {
								for (var i = ra, a = aa; i.nodeType !== 8;) if (!a || (i = lm(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								ra = lm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						sa(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = as(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: ks,
			lastRenderedState: t
		}, n.queue = r, n = cc.bind(null, H, r), r.dispatch = n, r = xs(!1), a = uc.bind(null, H, !1, r.queue), r = as(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Cs.bind(null, H, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function js(e) {
		return Ms(os(), U, e);
	}
	function Ms(e, t, n) {
		if (t = ps(e, t, ks)[0], e = fs(ds)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = cs(t);
		} catch (e) {
			throw e === Ja ? Xa : e;
		}
		else r = t;
		t = os();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (H.flags |= 2048, Fs(9, { destroy: void 0 }, Ns.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Ns(e, t) {
		e.action = t;
	}
	function Ps(e) {
		var t = os(), n = U;
		if (n !== null) return Ms(t, n, e);
		os(), t = t.memoizedState, n = os();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function Fs(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = H.updateQueue, t === null && (t = ss(), H.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function Is() {
		return os().memoizedState;
	}
	function Ls(e, t, n, r) {
		var i = as();
		H.flags |= e, i.memoizedState = Fs(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Rs(e, t, n, r) {
		var i = os();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		U !== null && r !== null && Zo(r, U.memoizedState.deps) ? i.memoizedState = Fs(t, a, n, r) : (H.flags |= e, i.memoizedState = Fs(1 | t, a, n, r));
	}
	function zs(e, t) {
		Ls(8390656, 8, e, t);
	}
	function Bs(e, t) {
		Rs(2048, 8, e, t);
	}
	function Vs(e) {
		H.flags |= 4;
		var t = H.updateQueue;
		if (t === null) t = ss(), H.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Hs(e) {
		var t = os().memoizedState;
		return Vs({
			ref: t,
			nextImpl: e
		}), function() {
			if (K & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Us(e, t) {
		return Rs(4, 2, e, t);
	}
	function Ws(e, t) {
		return Rs(4, 4, e, t);
	}
	function Gs(e, t) {
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
	function Ks(e, t, n) {
		n = n == null ? null : n.concat([e]), Rs(4, 4, Gs.bind(null, t, e), n);
	}
	function qs() {}
	function Js(e, t) {
		var n = os();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Zo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Ys(e, t) {
		var n = os();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Zo(t, r[1])) return r[0];
		if (r = e(), Go) {
			$e(!0);
			try {
				e();
			} finally {
				$e(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Xs(e, t, n) {
		return n === void 0 || Vo & 1073741824 && !(Y & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Md(), H.lanes |= e, od |= e, n);
	}
	function Zs(e, t, n, r) {
		return Br(n, t) ? n : To.current === null ? !(Vo & 106) || Vo & 1073741824 && !(Y & 261930) ? (Nc = !0, e.memoizedState = n) : (e = Md(), H.lanes |= e, od |= e, t) : (e = Xs(e, n, r), Br(e, t) || (Nc = !0), e);
	}
	function Qs(e, t, n, r, i) {
		var a = N.p;
		N.p = a !== 0 && 8 > a ? a : 8;
		var o = M.T, s = {};
		s.types = o === null ? null : o.types, M.T = s, uc(e, !1, t, n);
		try {
			var c = i(), l = M.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? lc(e, t, Ha(c, r), jd(e)) : lc(e, t, r, jd(e));
		} catch (n) {
			lc(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, jd());
		} finally {
			N.p = a, o !== null && s.types !== null && (o.types = s.types), M.T = o;
		}
	}
	function $s() {}
	function ec(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = tc(e).queue;
		Qs(e, a, t, ye, n === null ? $s : function() {
			return nc(e), n(r);
		});
	}
	function tc(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: ye,
			baseState: ye,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: ds,
				lastRenderedState: ye
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
				lastRenderedReducer: ds,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function nc(e) {
		var t = tc(e);
		t.next === null && (t = e.alternate.memoizedState), lc(e, t.next.queue, {}, jd());
	}
	function rc() {
		return wa(sh);
	}
	function ic() {
		return os().memoizedState;
	}
	function ac() {
		return os().memoizedState;
	}
	function oc(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = jd();
					e = go(n);
					var r = _o(t, e, n);
					r !== null && (Pd(r, t, n), vo(r, t, n)), t = { cache: ja() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function sc(e, t, n) {
		var r = jd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, dc(e) ? fc(t, n) : (n = Ti(e, t, n, r), n !== null && (Pd(n, e, r), pc(n, t, r)));
	}
	function cc(e, t, n) {
		lc(e, t, n, jd());
	}
	function lc(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (dc(e)) fc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Br(s, o)) return wi(e, t, i, 0), q === null && Ci(), !1;
			} catch {}
			if (n = Ti(e, t, i, r), n !== null) return Pd(n, e, r), pc(n, t, r), !0;
		}
		return !1;
	}
	function uc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Pf(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, dc(e)) {
			if (t) throw Error(i(479));
		} else t = Ti(e, n, r, 2), t !== null && Pd(t, e, 2);
	}
	function dc(e) {
		var t = e.alternate;
		return e === H || t !== null && t === H;
	}
	function fc(e, t) {
		Wo = Uo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function pc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, gt(e, n);
		}
	}
	var mc = {
		readContext: wa,
		use: ls,
		useCallback: Xo,
		useContext: Xo,
		useEffect: Xo,
		useImperativeHandle: Xo,
		useLayoutEffect: Xo,
		useInsertionEffect: Xo,
		useMemo: Xo,
		useReducer: Xo,
		useRef: Xo,
		useState: Xo,
		useDebugValue: Xo,
		useDeferredValue: Xo,
		useTransition: Xo,
		useSyncExternalStore: Xo,
		useId: Xo,
		useHostTransitionStatus: Xo,
		useFormState: Xo,
		useActionState: Xo,
		useOptimistic: Xo,
		useMemoCache: Xo,
		useCacheRefresh: Xo,
		useEffectEvent: Xo
	}, hc = {
		readContext: wa,
		use: ls,
		useCallback: function(e, t) {
			return as().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: wa,
		useEffect: zs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), Ls(4194308, 4, Gs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return Ls(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			Ls(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = as();
			t = t === void 0 ? null : t;
			var r = e();
			if (Go) {
				$e(!0);
				try {
					e();
				} finally {
					$e(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = as();
			if (n !== void 0) {
				var i = n(t);
				if (Go) {
					$e(!0);
					try {
						n(t);
					} finally {
						$e(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = sc.bind(null, H, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = as();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = xs(e);
			var t = e.queue, n = cc.bind(null, H, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: qs,
		useDeferredValue: function(e, t) {
			return Xs(as(), e, t);
		},
		useTransition: function() {
			var e = xs(!1);
			return e = Qs.bind(null, H, e.queue, !0, !1), as().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = H, a = as();
			if (V) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), q === null) throw Error(i(349));
				Y & 127 || gs(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, zs(vs.bind(null, r, o, e), [e]), r.flags |= 2048, Fs(9, { destroy: void 0 }, _s.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = as(), t = q.identifierPrefix;
			if (V) {
				var n = Xi, r = Yi;
				n = (r & ~(1 << 32 - et(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Ko++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Yo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: rc,
		useFormState: As,
		useActionState: As,
		useOptimistic: function(e) {
			var t = as();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = uc.bind(null, H, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: us,
		useCacheRefresh: function() {
			return as().memoizedState = oc.bind(null, H);
		},
		useEffectEvent: function(e) {
			var t = as(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (K & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, gc = {
		readContext: wa,
		use: ls,
		useCallback: Js,
		useContext: wa,
		useEffect: Bs,
		useImperativeHandle: Ks,
		useInsertionEffect: Us,
		useLayoutEffect: Ws,
		useMemo: Ys,
		useReducer: fs,
		useRef: Is,
		useState: function() {
			return fs(ds);
		},
		useDebugValue: qs,
		useDeferredValue: function(e, t) {
			return Zs(os(), U.memoizedState, e, t);
		},
		useTransition: function() {
			var e = fs(ds)[0], t = os().memoizedState;
			return [typeof e == "boolean" ? e : cs(e), t];
		},
		useSyncExternalStore: hs,
		useId: ic,
		useHostTransitionStatus: rc,
		useFormState: js,
		useActionState: js,
		useOptimistic: function(e, t) {
			return Ss(os(), U, e, t);
		},
		useMemoCache: us,
		useCacheRefresh: ac,
		useEffectEvent: Hs
	}, _c = {
		readContext: wa,
		use: ls,
		useCallback: Js,
		useContext: wa,
		useEffect: Bs,
		useImperativeHandle: Ks,
		useInsertionEffect: Us,
		useLayoutEffect: Ws,
		useMemo: Ys,
		useReducer: ms,
		useRef: Is,
		useState: function() {
			return ms(ds);
		},
		useDebugValue: qs,
		useDeferredValue: function(e, t) {
			var n = os();
			return U === null ? Xs(n, e, t) : Zs(n, U.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ms(ds)[0], t = os().memoizedState;
			return [typeof e == "boolean" ? e : cs(e), t];
		},
		useSyncExternalStore: hs,
		useId: ic,
		useHostTransitionStatus: rc,
		useFormState: Ps,
		useActionState: Ps,
		useOptimistic: function(e, t) {
			var n = os();
			return U === null ? (n.baseState = e, [e, n.queue.dispatch]) : Ss(n, U, e, t);
		},
		useMemoCache: us,
		useCacheRefresh: ac,
		useEffectEvent: Hs
	};
	function vc(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : D({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var yc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = go(r);
			i.payload = t, n != null && (i.callback = n), t = _o(e, i, r), t !== null && (Pd(t, e, r), vo(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = go(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = _o(e, i, r), t !== null && (Pd(t, e, r), vo(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = jd(), r = go(n);
			r.tag = 2, t != null && (r.callback = t), t = _o(e, r, n), t !== null && (Pd(t, e, n), vo(t, e, n));
		}
	};
	function bc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Vr(n, r) || !Vr(i, a) : !0;
	}
	function xc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && yc.enqueueReplaceState(t, t.state, null);
	}
	function Sc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = D({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Cc(e) {
		yi(e);
	}
	function wc(e) {
		console.error(e);
	}
	function Tc(e) {
		yi(e);
	}
	function Ec(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Dc(e, t, n) {
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
	function Oc(e, t, n) {
		return n = go(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Ec(e, t);
		}, n;
	}
	function kc(e) {
		return e = go(e), e.tag = 3, e;
	}
	function Ac(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Dc(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Dc(t, n, r), typeof i != "function" && (vd === null ? vd = /* @__PURE__ */ new Set([this]) : vd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function jc(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && xa(t, n, a, !0), n = Ao.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return jo === null ? Kd() : n.alternate === null && ad === 0 && (ad = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === Za ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), mf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === Za ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), mf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return mf(e, r, a), Kd(), !1;
		}
		if (V) return t = Ao.current, t === null ? (r !== oa && (t = Error(i(423), { cause: r }), pa(Vi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Vi(r, n), a = Oc(e.stateNode, r, a), yo(e, a), ad !== 4 && (ad = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== oa && (e = Error(i(422), { cause: r }), pa(Vi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Vi(o, n), dd === null ? dd = [o] : dd.push(o), ad !== 4 && (ad = 2), t === null) return !0;
		r = Vi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Oc(n.stateNode, r, e), yo(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (vd === null || !vd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = kc(a), Ac(a, e, n, r), yo(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Mc = Error(i(461)), Nc = !1;
	function Pc(e, t, n, r) {
		t.child = e === null ? fo(t, null, n, r) : uo(t, e.child, n, r);
	}
	function Fc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return Ca(t), r = Qo(e, t, n, o, a, i), s = ns(), e !== null && !Nc ? (rs(e, t, i), ll(e, t, i)) : (V && s && $i(t), t.flags |= 1, Pc(e, t, r, i), t.child);
	}
	function Ic(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Mi(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Lc(e, t, a, r, i)) : (e = Fi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !ul(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Vr : n, n(o, r) && e.ref === t.ref) return ll(e, t, i);
		}
		return t.flags |= 1, e = Ni(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Lc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Vr(a, r) && e.ref === t.ref) {
				if (Nc = !1, t.pendingProps = r = a, ul(e, i)) e.flags & 131072 && (Nc = !0);
				else return t.lanes = e.lanes, ll(e, t, i);
			}
		}
		return Gc(e, t, n, r, i);
	}
	function Rc(e, t, n, r) {
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
				return Bc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Ka(t, a === null ? null : a.cachePool), a === null ? Oo() : Do(t, a), Po(t);
			else return r = t.lanes = 536870912, Bc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Ka(t, null), Oo(), Fo()) : (Ka(t, a.cachePool), Do(t, a), Fo(), t.memoizedState = null);
		return Pc(e, t, i, n), t.child;
	}
	function zc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Bc(e, t, n, r, i) {
		var a = Ga();
		return a = a === null ? null : {
			parent: Aa._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Ka(t, null), Oo(), Po(t), e !== null && xa(e, t, r, !0), t.childLanes = i, null;
	}
	function Vc(e, t) {
		return t = el({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Hc(e, t, n) {
		return uo(t, e.child, null, n), e = Vc(t, t.pendingProps), e.flags |= 2, Io(t), t.memoizedState = null, e;
	}
	function Uc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (V) {
				if (r.mode === "hidden") return e = Vc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, zc(null, e);
				if (No(t), (e = ra) ? (e = am(e, aa), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ji === null ? null : {
						id: Yi,
						overflow: Xi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ri(e), n.return = t, t.child = n, na = t, ra = null)) : e = null, e === null) throw sa(t);
				return t.lanes = 536870912, null;
			}
			return Vc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (No(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Hc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Nc || xa(e, t, n, !1), a = (n & e.childLanes) !== 0, Nc || a) {
				if (To.current === null) {
					if (r = q, r !== null && (s = _t(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, Ei(e, s), Pd(r, e, s), Mc;
					Kd();
				}
				t = Hc(e, t, n);
			} else e = o.treeContext, ra = lm(s.nextSibling), na = t, V = !0, ia = null, aa = !1, e !== null && ta(t, e), t = Vc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = Ni(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function Wc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Gc(e, t, n, r, i) {
		return Ca(t), n = Qo(e, t, n, r, void 0, i), r = ns(), e !== null && !Nc ? (rs(e, t, i), ll(e, t, i)) : (V && r && $i(t), t.flags |= 1, Pc(e, t, n, i), t.child);
	}
	function Kc(e, t, n, r, i, a) {
		return Ca(t), t.updateQueue = null, n = es(t, r, n, i), $o(e), r = ns(), e !== null && !Nc ? (rs(e, t, a), ll(e, t, a)) : (V && r && $i(t), t.flags |= 1, Pc(e, t, n, a), t.child);
	}
	function qc(e, t, n, r, i) {
		if (Ca(t), t.stateNode === null) {
			var a = ki, o = n.contextType;
			typeof o == "object" && o && (a = wa(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = yc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, mo(t), o = n.contextType, a.context = typeof o == "object" && o ? wa(o) : ki, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (vc(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && yc.enqueueReplaceState(a, a.state, null), So(t, r, a, i), xo(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Sc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = ki, typeof u == "object" && u && (o = wa(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && xc(t, a, r, o), po = !1;
			var f = t.memoizedState;
			a.state = f, So(t, r, a, i), xo(), l = t.memoizedState, s || f !== l || po ? (typeof d == "function" && (vc(t, n, d, r), l = t.memoizedState), (c = po || bc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, ho(e, t), o = t.memoizedProps, u = Sc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = ki, typeof l == "object" && l && (c = wa(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && xc(t, a, r, c), po = !1, f = t.memoizedState, a.state = f, So(t, r, a, i), xo();
			var p = t.memoizedState;
			o !== d || f !== p || po || e !== null && e.dependencies !== null && Sa(e.dependencies) ? (typeof s == "function" && (vc(t, n, s, r), p = t.memoizedState), (u = po || bc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && Sa(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, Wc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = uo(t, e.child, null, i), t.child = uo(t, null, n, i)) : Pc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = ll(e, t, i), e;
	}
	function Jc(e, t, n, r) {
		return da(), t.flags |= 256, Pc(e, t, n, r), t.child;
	}
	var Yc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Xc(e) {
		return {
			baseLanes: e,
			cachePool: qa()
		};
	}
	function Zc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= ld), e;
	}
	function Qc(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(Lo.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (V) {
				if (i ? Mo(t) : Fo(), (e = ra) ? (e = am(e, aa), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ji === null ? null : {
						id: Yi,
						overflow: Xi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ri(e), n.return = t, t.child = n, na = t, ra = null)) : e = null, e === null) throw sa(t);
				return t.lanes = sm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Fo(), i = t.mode, a = el({
				mode: "hidden",
				children: a
			}, i), r = Ii(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = Xc(n), r.childLanes = Zc(e, o, n), t.memoizedState = Yc, zc(null, r)) : (Mo(t), $c(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return nl(e, t, a, o, r, c, s, n);
		}
		return i ? (Fo(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = Ni(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Ii(i, a, n, null), i.flags |= 2) : i = Ni(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, zc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = Xc(n) : (a = i.cachePool, a === null ? a = qa() : (s = Aa._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = Zc(e, o, n), t.memoizedState = Yc, zc(e.child, r)) : (Mo(t), n = e.child, e = n.sibling, n = Ni(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function $c(e, t) {
		return t = el({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function el(e, t) {
		return e = ji(22, e, null, t), e.lanes = 0, e;
	}
	function tl(e, t, n) {
		return uo(t, e.child, null, n), e = $c(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function nl(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (Mo(t), t.flags &= -257, tl(e, t, c)) : t.memoizedState === null ? (Fo(), o = a.fallback, s = t.mode, a = el({
			mode: "visible",
			children: a.children
		}, s), o = Ii(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, uo(t, e.child, null, c), a = t.child, a.memoizedState = Xc(c), a.childLanes = Zc(e, r, c), t.memoizedState = Yc, zc(null, a)) : (Fo(), t.child = e.child, t.flags |= 128, null);
		if (Mo(t), sm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, pa({
				value: a,
				source: null,
				stack: null
			})), tl(e, t, c);
		}
		if (Nc || xa(e, t, c, !1), r = (c & e.childLanes) !== 0, Nc || r) {
			if (To.current !== null) return tl(e, t, c);
			if (r = q, r !== null && (a = _t(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, Ei(e, a), Pd(r, e, a), Mc;
			return om(o) || Kd(), tl(e, t, c);
		}
		return om(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, ra = lm(o.nextSibling), na = t, V = !0, ia = null, aa = !1, e !== null && ta(t, e), t = $c(t, a.children), t.flags |= 134221824, t);
	}
	function rl(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), ya(e.return, t, n);
	}
	function il(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && Bo(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function al(e, t, n, r, i, a) {
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
	function ol(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function sl(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = Lo.current;
		if (t.flags & 128) return Ro(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Ro(t, o), i === "backwards" && e !== null ? (ol(e), Pc(e, t, r, n), ol(e)) : Pc(e, t, r, n), r = V ? Gi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && rl(e, n, t);
			else if (e.tag === 19) rl(e, n, t);
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
				n = il(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, ol(t)), al(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && Bo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				al(t, !0, n, null, a, r);
				break;
			case "together":
				al(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = il(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), al(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function cl(e, t, n) {
		var r = t.pendingProps;
		return _a(t, t.type, r.value), Pc(e, t, r.children, n), t.child;
	}
	function ll(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), od |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (xa(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = Ni(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Ni(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function ul(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && Sa(e)));
	}
	function dl(e, t, n) {
		switch (t.tag) {
			case 3:
				De(t, t.stateNode.containerInfo), _a(t, Aa, e.memoizedState.cache), da();
				break;
			case 27:
			case 5:
				ke(t);
				break;
			case 4:
				De(t, t.stateNode.containerInfo);
				break;
			case 10:
				_a(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, No(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return Mo(t), t.flags |= 128, null;
					r = xa(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? Qc(e, t, n) : (Mo(t), e = ll(e, t, n), e === null ? null : e.sibling);
				}
				Mo(t);
				break;
			case 19:
				if (t.flags & 128) return sl(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (xa(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return sl(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Ro(t, Lo.current), r) break;
				return null;
			case 22: return t.lanes = 0, Rc(e, t, n, t.pendingProps);
			case 24: _a(t, Aa, e.memoizedState.cache);
		}
		return ll(e, t, n);
	}
	function fl(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Nc = !0;
			else {
				if (!ul(e, n) && !(t.flags & 128)) return Nc = !1, dl(e, t, n);
				Nc = !!(e.flags & 131072);
			}
		} else Nc = !1, V && t.flags & 1048576 && Qi(t, Gi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = eo(t.elementType), t.type = e, typeof e == "function") Mi(e) ? (r = Sc(e, r), t.tag = 1, t = qc(null, t, e, r, n)) : (t.tag = 0, t = Gc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === oe) {
								t.tag = 11, t = Fc(null, t, e, r, n);
								break a;
							}
							if (a === le) {
								t.tag = 14, t = Ic(null, t, e, r, n);
								break a;
							}
							if (a === k) {
								t.tag = 10, t.type = e, t = cl(null, t, n);
								break a;
							}
						}
						throw t = _e(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Gc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = Sc(r, t.pendingProps), qc(e, t, r, a, n);
			case 3:
				a: {
					if (De(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, ho(e, t), So(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, _a(t, Aa, r), r !== o.cache && ba(t, [Aa], n, !0), xo(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = Jc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = Vi(Error(i(424)), t), pa(a), t = Jc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (ra = lm(e.firstChild), na = t, V = !0, ia = null, aa = !0, n = fo(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (da(), r === a) {
							t = ll(e, t, n);
							break a;
						}
						Pc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return Wc(e, t), e === null ? (n = Nm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : V || (t.stateNode = fp(t.type, t.pendingProps, Te.current, t)) : t.memoizedState = Nm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return ke(t), e === null && V && (r = t.stateNode = hm(t.type, t.pendingProps, Te.current), na = t, aa = !0, a = ra, Sp(t.type) ? (um = a, ra = lm(r.firstChild)) : ra = a), Pc(e, t, t.pendingProps.children, n), Wc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && V && ((a = r = ra) && (r = rm(r, t.type, t.pendingProps, aa), r === null ? a = !1 : (t.stateNode = r, na = t, ra = lm(r.firstChild), aa = !1, a = !0)), a || sa(t)), ke(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, pp(a, o) ? r = null : s !== null && pp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = Qo(e, t, ts, null, null, n), sh._currentValue = a), Wc(e, t), Pc(e, t, r, n), t.child;
			case 6: return e === null && V && ((e = n = ra) && (n = im(n, t.pendingProps, aa), n === null ? e = !1 : (t.stateNode = n, na = t, ra = null, e = !0)), e || sa(t)), null;
			case 13: return Qc(e, t, n);
			case 4: return De(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = uo(t, null, r, n) : Pc(e, t, r, n), t.child;
			case 11: return Fc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, Wc(e, t), Pc(e, t, r, n), t.child;
			case 8: return Pc(e, t, t.pendingProps.children, n), t.child;
			case 12: return Pc(e, t, t.pendingProps.children, n), t.child;
			case 10: return cl(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, Ca(t), a = wa(a), r = r(a), t.flags |= 1, Pc(e, t, r, n), t.child;
			case 14: return Ic(e, t, t.type, t.pendingProps, n);
			case 15: return Lc(e, t, t.type, t.pendingProps, n);
			case 19: return sl(e, t, n);
			case 31: return Uc(e, t, n);
			case 22: return Rc(e, t, n, t.pendingProps);
			case 24: return Ca(t), r = wa(Aa), e === null ? (a = Ga(), a === null && (a = q, o = ja(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, mo(t), _a(t, Aa, a)) : ((e.lanes & n) !== 0 && (ho(e, t), So(t, null, null, n), xo()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, _a(t, Aa, r), r !== a.cache && ba(t, [Aa], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), _a(t, Aa, r))), Pc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : V && $i(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : Wc(e, t), Pc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function pl(e) {
		e.flags |= 4;
	}
	function ml(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Jm(t, r) : Jm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Ud()) e.flags |= 8192;
				else throw to = Za, Ya;
			}
		} else e.flags &= -16777217;
	}
	function hl(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Ym(t)) {
			if (Ud()) e.flags |= 8192;
			else throw to = Za, Ya;
		}
	}
	function gl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : dt(), e.lanes |= t, ud |= t);
	}
	function _l(e, t) {
		if (!V) switch (e.tailMode) {
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
	function W(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function vl(e, t, n) {
		var r = t.pendingProps;
		switch (ea(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return W(t), null;
			case 1: return W(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), va(Aa), Oe(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (ua(t) ? pl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, fa())), W(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (pl(t), o === null ? (W(t), ml(t, a, null, r, n)) : (W(t), hl(t, o))) : o ? o === e.memoizedState ? (W(t), t.flags &= -16777217) : (pl(t), W(t), hl(t, o)) : (e = e.memoizedProps, e !== r && pl(t), W(t), ml(t, a, e, r, n)), null;
			case 27:
				if (Ae(t), n = Te.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && pl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return W(t), t.subtreeFlags &= -33554433, null;
					}
					e = Ce.current, ua(t) ? ca(t, e) : (e = hm(a, r, n), t.stateNode = e, pl(t));
				}
				return W(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (Ae(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && pl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return W(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = Ce.current, ua(t)) ca(t, o);
					else {
						var s = lp(Te.current);
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
						o[Ct] = t, o[R] = r;
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
						r && pl(t);
					}
				}
				return W(t), t.subtreeFlags &= -33554433, ml(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && pl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = Te.current, ua(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = na, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[Ct] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || ep(e.nodeValue, n)), e || sa(t, !0);
					} else e = lp(e).createTextNode(r), e[Ct] = t, t.stateNode = e;
				}
				return W(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = ua(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[Ct] = t;
						} else da(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						W(t), e = !1;
					} else n = fa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (Io(t), t) : (Io(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return W(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = ua(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[Ct] = t;
						} else da(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						W(t), a = !1;
					} else a = fa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (Io(t), t) : (Io(t), null);
				}
				return Io(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), gl(t, t.updateQueue), W(t), null);
			case 4: return Oe(), e === null && Wf(t.stateNode.containerInfo), t.flags |= 67108864, W(t), null;
			case 10: return va(t.type), W(t), null;
			case 19:
				if (zo(t), r = t.memoizedState, r === null) return W(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) _l(r, !1);
					else {
						if (ad !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = Bo(e), o !== null) {
								for (t.flags |= 128, _l(r, !1), e = o.updateQueue, t.updateQueue = e, gl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Pi(n, e), n = n.sibling;
								return Ro(t, Lo.current & 1 | 2), V && Zi(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && He() > gd && (t.flags |= 128, a = !0, _l(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = Bo(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, gl(t, e), _l(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !V) return W(t), null;
						} else 2 * He() - r.renderingStartTime > gd && n !== 536870912 && (t.flags |= 128, a = !0, _l(r, !1), t.lanes = 4194304);
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
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = He(), e.sibling = null, o = Lo.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || V ? Ro(t, o) : (n = o, F(Ao, t), F(Lo, n), jo === null && (jo = t)), V && Zi(t, r.treeForkCount), e;
				}
				return W(t), null;
			case 22:
			case 23: return Io(t), ko(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (W(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : W(t), n = t.updateQueue, n !== null && gl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && Se(Wa), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), va(Aa), W(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, W(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function yl(e, t) {
		switch (ea(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return va(Aa), Oe(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return Ae(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (Io(t), t.alternate === null) throw Error(i(340));
					da();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (Io(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					da();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return zo(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return Oe(), null;
			case 10: return va(t.type), null;
			case 22:
			case 23: return Io(t), ko(), e !== null && Se(Wa), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return va(Aa), null;
			case 25: return null;
			default: return null;
		}
	}
	function bl(e, t) {
		switch (ea(t), t.tag) {
			case 3:
				va(Aa), Oe();
				break;
			case 26:
			case 27:
			case 5:
				Ae(t);
				break;
			case 4:
				Oe();
				break;
			case 31:
				t.memoizedState !== null && Io(t);
				break;
			case 13:
				Io(t);
				break;
			case 19:
				zo(t);
				break;
			case 10:
				va(t.type);
				break;
			case 22:
			case 23:
				Io(t), ko(), e !== null && Se(Wa);
				break;
			case 24: va(Aa);
		}
	}
	function xl(e, t) {
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
	function Sl(e, t, n) {
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
	function Cl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				wo(t, n);
			} catch (t) {
				Z(e, e.return, t);
			}
		}
	}
	function wl(e, t, n) {
		n.props = Sc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Z(e, t, n);
		}
	}
	function Tl(e, t) {
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
						var i = e.stateNode, a = gi(e.memoizedProps, i);
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
	function El(e, t) {
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
	function Dl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) em(e.stateNode, t[n]);
	}
	function Ol(e) {
		for (var t = e.return; t !== null && (jl(t) && em(e.stateNode, t.stateNode), !Al(t));) t = t.return;
	}
	function kl(e) {
		for (var t = e.return; t !== null && (jl(t) && tm(e.stateNode, t.stateNode), !Al(t));) t = t.return;
	}
	function Al(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function jl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Ml(e) {
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
	function Nl(e, t, n) {
		try {
			var r = e.stateNode;
			ip(r, e.type, n, t), r[R] = t;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Pl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Sp(e.type) || e.tag === 4;
	}
	function Fl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Pl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Sp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Il(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = vn)), Dl(e, r), z = !0;
		else if (i !== 4 && (i === 27 && (Dl(e, r), r = null, Sp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Il(e, t, n, r), e = e.sibling; e !== null;) Il(e, t, n, r), e = e.sibling;
	}
	function Ll(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), Dl(e, r), z = !0;
		else if (i !== 4 && (i === 27 && (Dl(e, r), r = null, Sp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Ll(e, t, n, r), e = e.sibling; e !== null;) Ll(e, t, n, r), e = e.sibling;
	}
	function Rl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			np(t, r, n), t[Ct] = e, t[R] = n;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	var zl = !1, Bl = null;
	function Vl(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (zl = !0);
	}
	var Hl = null;
	function Ul() {
		var e = Hl;
		return Hl = null, e;
	}
	var Wl = 0;
	function Gl(e, t, n, r, i) {
		return Wl = 0, Kl(e.child, t, n, r, i);
	}
	function Kl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Op(o);
					r.push(s), s.view && (a = !0);
				} else a || Op(o).view && (a = !0);
				zl = !0, Tp(o, Wl === 0 ? t : t + "_" + Wl, n), Wl++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || Kl(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function ql(e, t) {
		for (; e !== null;) e.tag === 5 ? Ep(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || ql(e.child, t), e = e.sibling;
	}
	function Jl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Jl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = vi(t.default, t.share), t !== "none" && (Gl(e, n, t, null, !1) || ql(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Yl(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = gi(r, n), a = vi(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Jl(e) : Gl(e, i, a, null, !1) ? (Jl(e), n.paired || t || Nd(e, r.onEnter)) : ql(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Yl(e, t), e = e.sibling;
		else Jl(e);
	}
	function Xl(e) {
		if (Bl !== null && Bl.size !== 0) {
			var t = Bl;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = vi(n.default, n.share);
								if (a !== "none" && (Gl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Nd(e, n.onShare)) : ql(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					Xl(e);
				}
				e = e.sibling;
			}
		}
	}
	function Zl(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = gi(t, e.stateNode), r = Bl === null ? void 0 : Bl.get(n), i = vi(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Gl(e, n, i, null, !1) ? r === void 0 ? Nd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Bl.delete(n), Nd(e, t.onShare)) : ql(e.child, !1)), Bl !== null && Xl(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Zl(e), e = e.sibling;
		else Bl !== null && Xl(e);
	}
	function Ql(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = gi(t, e.stateNode);
				t = vi(t.default, t.update), e.flags &= -5, t !== "none" && Gl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && Ql(e);
			e = e.sibling;
		}
	}
	function $l(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, ql(e.child, !1));
				}
				$l(e);
			}
			e = e.sibling;
		}
	}
	function eu(e) {
		if (e.tag === 30) e.stateNode.paired = null, ql(e.child, !1), $l(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) eu(e), e = e.sibling;
		else $l(e);
	}
	function tu(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? ql(e.child, !1) : e.subtreeFlags & 33554432 && tu(e), e = e.sibling;
	}
	function nu(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && Wl < a.length) {
					var l = a[Wl], u = Op(c);
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
				e.flags & 4 && Tp(c, Wl === 0 ? n : n + "_" + Wl, i), s && e.flags & 4 || (Hl === null && (Hl = []), Hl.push(c, Wl === 0 ? r : r + "_" + Wl, t.memoizedProps)), Wl++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : nu(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function ru(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = gi(n, r), a = vi(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(kp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				Wl = 0, i = nu(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Nd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && ru(e, t);
			e = e.sibling;
		}
	}
	var iu = !1, G = !1, au = !1, ou = !1, su = typeof WeakSet == "function" ? WeakSet : Set, cu = null, lu = !1, uu = !1, du = !1, fu = !1;
	function pu(e, t, n) {
		if (e = e.containerInfo, sp = gh, e = Kr(e), qr(e)) {
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
		}, gh = !1, n = (n & 335544064) === n, cu = t, t = n ? 9270 : 1024; cu !== null;) {
			if (e = cu, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && Zl(r[a]);
			if (e.alternate === null && e.flags & 2) n && Vl(e), mu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && Zl(r), mu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Vl(e), mu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, cu = r) : (n && Ql(e), mu(n));
			}
		}
		Bl = null;
	}
	function mu(e) {
		for (; cu !== null;) {
			var t = cu, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = Sc(t.type, a);
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
					n && r !== null && (n = gi(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = vi(a.default, a.update), a !== "none" && Gl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, cu = r;
				break;
			}
			cu = t.return;
		}
	}
	function hu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Fu(e, n), r & 4 && xl(5, n);
				break;
			case 1:
				if (Fu(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						Z(n, n.return, e);
					}
					else {
						var i = Sc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							Z(n, n.return, e);
						}
					}
				}
				r & 64 && Cl(n), r & 512 && Tl(n, n.return);
				break;
			case 3:
				if (Fu(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						wo(e, t);
					} catch (e) {
						Z(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Rl(n);
			case 26:
			case 5:
				Fu(e, n), t === null && r & 4 && Ml(n), r & 512 && Tl(n, n.return);
				break;
			case 12:
				Fu(e, n);
				break;
			case 31:
				Fu(e, n), r & 4 && wu(e, n);
				break;
			case 13:
				Fu(e, n), r & 4 && Tu(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = _f.bind(null, n), cm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || iu, !r) {
					var a = t !== null && t.memoizedState !== null || G;
					t = iu, i = G, iu = r, (G = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Lu(e, n, r)) : Fu(e, n), iu = t, G = i;
				}
				break;
			case 30:
				Fu(e, n), r & 512 && Tl(n, n.return);
				break;
			case 7: r & 512 && Tl(n, n.return);
			default: Fu(e, n);
		}
	}
	function gu(e, t) {
		for (e = e.child; e !== null;) _u(e, t), e = e.sibling;
	}
	function _u(e, t) {
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
				vu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, z = !0;
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
				e.memoizedState === null && gu(e, t);
				break;
			default: gu(e, t);
		}
	}
	function vu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						_u(n, r);
						break a;
					case 22:
						n.memoizedState === null && vu(n, r);
						break a;
					default: vu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function yu(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, yu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && jt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var bu = null, xu = !1;
	function Su(e, t, n) {
		for (n = n.child; n !== null;) Cu(e, t, n), n = n.sibling;
	}
	function Cu(e, t, n) {
		if (Qe && typeof Qe.onCommitFiberUnmount == "function") try {
			Qe.onCommitFiberUnmount(Ze, n);
		} catch {}
		switch (n.tag) {
			case 26:
				G || El(n, t), Su(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !G && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				G || El(n, t), kl(n);
				var r = bu, i = xu;
				Sp(n.type) && (bu = n.stateNode, xu = !1), Su(e, t, n), gm(n.stateNode, n.type, n.memoizedProps), bu = r, xu = i;
				break;
			case 5: G || El(n, t), kl(n);
			case 6:
				if (n.tag === 6 && kl(n), r = bu, i = xu, bu = null, Su(e, t, n), bu = r, xu = i, bu !== null) {
					if (xu) try {
						(bu.nodeType === 9 ? bu.body : bu.nodeName === "HTML" ? bu.ownerDocument.body : bu).removeChild(n.stateNode), z = !0;
					} catch (e) {
						Z(n, t, e);
					}
					else try {
						bu.removeChild(n.stateNode), z = !0;
					} catch (e) {
						Z(n, t, e);
					}
				}
				break;
			case 18:
				bu !== null && (xu ? (e = bu, Cp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Hh(e)) : Cp(bu, n.stateNode));
				break;
			case 4:
				r = bu, i = xu, bu = n.stateNode.containerInfo, xu = !0, Su(e, t, n), bu = r, xu = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Sl(2, n, t), G || Sl(4, n, t), Su(e, t, n);
				break;
			case 1:
				G || (El(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && wl(n, t, r)), Su(e, t, n);
				break;
			case 21:
				Su(e, t, n);
				break;
			case 22:
				G = (r = G) || n.memoizedState !== null, Su(e, t, n), G = r;
				break;
			case 30:
				El(n, t), Su(e, t, n);
				break;
			case 7:
				G || El(n, t), Su(e, t, n);
				break;
			default: Su(e, t, n);
		}
	}
	function wu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Hh(e);
			} catch (e) {
				Z(t, t.return, e);
			}
		}
	}
	function Tu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Hh(e);
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Eu(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new su()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new su()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Du(e, t) {
		var n = Eu(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = vf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function Ou(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Sp(l.type)) {
							bu = l.stateNode, xu = !1;
							break a;
						}
						break;
					case 5:
						bu = l.stateNode, xu = !1;
						break a;
					case 3:
					case 4:
						bu = l.stateNode.containerInfo, xu = !0;
						break a;
				}
				l = l.return;
			}
			if (bu === null) throw Error(i(160));
			Cu(s, c, o), bu = null, xu = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Au(t, e, n), t = t.sibling;
	}
	var ku = null;
	function Au(e, t, n) {
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
				Ou(t, e, n), ju(e), a & 4 && (Sl(3, e, e.return), xl(3, e), Sl(5, e, e.return));
				break;
			case 1:
				Ou(t, e, n), ju(e), a & 512 && (G || r === null || El(r, r.return)), a & 64 && iu && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = ku, Ou(t, e, n), ju(e), a & 512 && (G || r === null || El(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (iu) e.stateNode = fp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[kt] || r[Ct] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), np(r, t, n), r[Ct] = e, It(r), t = r;
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
										r[Ct] = e, It(r), t = r;
									}
									e.stateNode = t;
								}
							} else iu || Km(o, e.type, e.stateNode);
						} else e.stateNode = Bm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && Nl(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || G || t.parentNode.removeChild(t)) : a.count--, n === null ? iu || Km(o, e.type, e.stateNode) : Bm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				Ou(t, e, n), ju(e), a & 512 && (G || r === null || El(r, r.return)), r !== null && a & 4 && Nl(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = au, au = !1, Ou(t, e, n), au = o, ju(e), a & 512 && (G || r === null || El(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						un(t, ""), z = !0;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, Nl(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (ou = !0);
				break;
			case 6:
				if (Ou(t, e, n), ju(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, z = !0;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				break;
			case 3:
				if (z = !1, Wm = null, o = ku, ku = bm(t.containerInfo), Ou(t, e, n), ku = o, ju(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Hh(t.containerInfo);
				} catch (t) {
					Z(e, e.return, t);
				}
				ou && (ou = !1, Mu(e)), z = !1;
				break;
			case 4:
				a = au, au = iu, r = Kt(), o = ku, ku = bm(e.stateNode.containerInfo), Ou(t, e, n), ju(e), ku = o, z && uu && (du = !0), z = r, au = a;
				break;
			case 12:
				Ou(t, e, n), ju(e);
				break;
			case 31:
				Ou(t, e, n), ju(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Du(e, t)));
				break;
			case 13:
				Ou(t, e, n), ju(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (md = He()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Du(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = iu, l = G, u = au;
				iu = c || o, au = u || o, G = l || s, Ou(t, e, n), G = l, au = u, iu = c, ju(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || iu || G || (t = s || G, n = iu, r = G, iu = o || iu, G = t, Iu(e, 2), iu = n, G = r), !o && au || gu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Du(e, n))));
				break;
			case 19:
				Ou(t, e, n), ju(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Du(e, t)));
				break;
			case 30:
				a & 512 && (G || r === null || El(r, r.return)), a = Kt(), o = uu, s = (n & 335544064) === n, c = e.memoizedProps, uu = s && vi(c.default, c.update) !== "none", Ou(t, e, n), ju(e), s && r !== null && z && (e.flags |= 4), uu = o, z = a;
				break;
			case 21: break;
			case 7: a & 512 && (G || r === null || El(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: Ou(t, e, n), ju(e);
		}
	}
	function ju(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Pl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (jl(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Al(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Ll(e, Fl(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (un(l, ""), n.flags &= -33), Ll(e, Fl(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Il(e, Fl(e), u, s);
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
	function Mu(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Mu(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, gh = !0, t.reset(), gh = !1), e = e.sibling;
		}
	}
	function Nu(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Pu(t, e), t = t.sibling;
		else ru(t, !1);
	}
	function Pu(e, t) {
		var n = e.alternate;
		if (n === null) Yl(e, !1);
		else switch (e.tag) {
			case 3:
				if (fu = lu = !1, Ul(), Nu(t, e), !lu && !du) {
					if (e = Hl, e !== null) for (var r = 0; r < e.length; r += 3) {
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
					})), fu = !0;
				}
				Hl = null;
				break;
			case 5:
				Nu(t, e);
				break;
			case 4:
				r = lu, lu = !1, Nu(t, e), lu && (du = !0), lu = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Nu(t, e) : Yl(e, !1));
				break;
			case 30:
				r = lu, i = Ul(), lu = !1, Nu(t, e), lu && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = gi(a, o), o = gi(n.memoizedProps, o);
				var s = vi(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, Wl = 0, t = nu(e, n, t, o, s, a, !0), Wl !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Nd(e, e.memoizedProps.onUpdate), Hl = i) : i !== null && (i.push.apply(i, Hl), Hl = i), lu = e.flags & 32 ? !0 : r;
				break;
			default: Nu(t, e);
		}
	}
	function Fu(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) hu(e, t.alternate, t), t = t.sibling;
	}
	function Iu(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Sl(4, n, n.return), Iu(n, r);
					break;
				case 1:
					El(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && wl(n, n.return, i), Iu(n, r);
					break;
				case 27: r & 2 && gm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					El(n, n.return), n.tag !== 5 && n.tag !== 27 || kl(n), Iu(n, r);
					break;
				case 6:
					kl(n);
					break;
				case 26:
					El(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || G || i.parentNode.removeChild(i), Iu(n, r);
					break;
				case 22:
					n.memoizedState === null && Iu(n, r);
					break;
				case 30:
					El(n, n.return), Iu(n, r);
					break;
				case 7: El(n, n.return);
				default: Iu(n, r);
			}
			e = e.sibling;
		}
	}
	function Lu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Lu(i, a, n), xl(4, a);
					break;
				case 1:
					if (Lu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Z(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) Co(l[i], c);
						} catch (e) {
							Z(r, r.return, e);
						}
					}
					s && o & 64 && Cl(a), Tl(a, a.return);
					break;
				case 27: n & 2 && Rl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || Ol(a), Lu(i, a, n), s && r === null && o & 4 && Ml(a), Tl(a, a.return);
					break;
				case 6:
					Ol(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || iu || Km(bm(c.ownerDocument), a.type, c), Lu(i, a, n), s && r === null && o & 4 && Ml(a), Tl(a, a.return);
					break;
				case 12:
					Lu(i, a, n);
					break;
				case 31:
					Lu(i, a, n), s && o & 4 && wu(i, a);
					break;
				case 13:
					Lu(i, a, n), s && o & 4 && Tu(i, a);
					break;
				case 22:
					a.memoizedState === null && Lu(i, a, n), Tl(a, a.return);
					break;
				case 30:
					Lu(i, a, n), Tl(a, a.return);
					break;
				case 7: Tl(a, a.return);
				default: Lu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Ru(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Ma(n));
	}
	function zu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ma(e));
	}
	function Bu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Vu(e, t, n, r), t = t.sibling;
		else i && tu(t);
	}
	function Vu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && eu(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Bu(e, t, n, r), a & 2048 && xl(9, t);
				break;
			case 1:
				Bu(e, t, n, r);
				break;
			case 3:
				Bu(e, t, n, r), i && fu && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && Ma(a)));
				break;
			case 12:
				if (a & 2048) {
					Bu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						Z(t, t.return, e);
					}
				} else Bu(e, t, n, r);
				break;
			case 31:
				Bu(e, t, n, r);
				break;
			case 13:
				Bu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && eu(t), o._visibility & 2 ? Bu(e, t, n, r) : (o._visibility |= 2, Hu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && eu(s), o._visibility & 2 ? Bu(e, t, n, r) : Uu(e, t)), a & 2048 && Ru(s, t);
				break;
			case 24:
				Bu(e, t, n, r), a & 2048 && zu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (ql(a.child, !0), ql(t.child, !0))), Bu(e, t, n, r);
				break;
			default: Bu(e, t, n, r);
		}
	}
	function Hu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Hu(a, o, s, c, i), xl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Hu(a, o, s, c, i)) : u._visibility & 2 ? Hu(a, o, s, c, i) : Uu(a, o), i && l & 2048 && Ru(o.alternate, o);
					break;
				case 24:
					Hu(a, o, s, c, i), i && l & 2048 && zu(o.alternate, o);
					break;
				default: Hu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Uu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Uu(n, r), i & 2048 && Ru(r.alternate, r);
					break;
				case 24:
					Uu(n, r), i & 2048 && zu(r.alternate, r);
					break;
				default: Uu(n, r);
			}
			t = t.sibling;
		}
	}
	var Wu = 8192;
	function Gu(e, t, n) {
		if (e.subtreeFlags & Wu) for (e = e.child; e !== null;) Ku(e, t, n), e = e.sibling;
	}
	function Ku(e, t, n) {
		switch (e.tag) {
			case 26:
				Gu(e, t, n), e.flags & Wu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && Zm(n, e)) : Qm(n, ku, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Gu(e, t, n), e.flags & Wu && (e = e.stateNode, (t & 335544128) === t && Zm(n, e));
				break;
			case 3:
			case 4:
				var r = ku;
				ku = bm(e.stateNode.containerInfo), Gu(e, t, n), ku = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Wu, Wu = 16777216, Gu(e, t, n), Wu = r) : Gu(e, t, n));
				break;
			case 30:
				if ((e.flags & Wu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Bl === null && (Bl = /* @__PURE__ */ new Map()), Bl.set(r, i);
				}
				Gu(e, t, n);
				break;
			default: Gu(e, t, n);
		}
	}
	function qu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Ju(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				cu = r, Zu(r, e);
			}
			qu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Yu(e), e = e.sibling;
	}
	function Yu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Ju(e), e.flags & 2048 && Sl(9, e, e.return);
				break;
			case 3:
				Ju(e);
				break;
			case 12:
				Ju(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Xu(e)) : Ju(e);
				break;
			default: Ju(e);
		}
	}
	function Xu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				cu = r, Zu(r, e);
			}
			qu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Sl(8, t, t.return), Xu(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Xu(t));
					break;
				default: Xu(t);
			}
			e = e.sibling;
		}
	}
	function Zu(e, t) {
		for (; cu !== null;) {
			var n = cu;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Sl(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: Ma(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, cu = r;
			else a: for (n = e; cu !== null;) {
				r = cu;
				var i = r.sibling, a = r.return;
				if (yu(r), r === n) {
					cu = null;
					break a;
				}
				if (i !== null) {
					i.return = a, cu = i;
					break a;
				}
				cu = a;
			}
		}
	}
	var Qu = {
		getCacheForType: function(e) {
			var t = wa(Aa), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return wa(Aa).controller.signal;
		}
	}, $u = typeof WeakMap == "function" ? WeakMap : Map, K = 0, q = null, J = null, Y = 0, X = 0, ed = null, td = !1, nd = !1, rd = !1, id = 0, ad = 0, od = 0, sd = 0, cd = 0, ld = 0, ud = 0, dd = null, fd = null, pd = !1, md = 0, hd = 0, gd = Infinity, _d = null, vd = null, yd = 0, bd = null, xd = null, Sd = 0, Cd = 0, wd = null, Td = null, Ed = null, Dd = null, Od = null, kd = 0, Ad = null;
	function jd() {
		return K & 2 && Y !== 0 ? Y & -Y : M.T === null ? bt() : Pf();
	}
	function Md() {
		if (ld === 0) {
			if (!(Y & 536870912) || V) {
				var e = it;
				it <<= 1, !(it & 3932160) && (it = 262144), ld = e;
			} else ld = 536870912;
		}
		return e = Ao.current, e !== null && (e.flags |= 32), ld;
	}
	function Nd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Pp(gi(e.memoizedProps, n))), Dd === null && (Dd = []), Dd.push(t.bind(null, r));
		}
	}
	function Pd(e, t, n) {
		(e === q && (X === 2 || X === 9) || e.cancelPendingCommit !== null) && (Vd(e, 0), Rd(e, Y, ld, !1)), pt(e, n), K & 2 && e === q || (e === q && (!(K & 2) && (sd |= n), ad === 4 && Rd(e, Y, ld, !1)), Ef(e));
	}
	function Fd(e, t, n) {
		if (K & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || ct(e, t), a = r ? Yd(e, t) : qd(e, t, !0), o = r;
		do {
			if (a === 0) {
				nd && !r && Rd(e, t, 0, !1);
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
							a = dd;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Vd(c, s).flags |= 256), s = qd(c, s, !1), s !== 2 && s !== 6) {
								if (rd && !l) {
									c.errorRecoveryDisabledLanes |= o, sd |= o, a = 4;
									break a;
								}
								o = fd, fd = a, o !== null && (fd === null ? fd = o : fd.push.apply(fd, o));
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
							Rd(r, t, ld, !td);
							break a;
						case 2:
							fd = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = md + 300 - He(), 10 < a)) {
						if (Rd(r, t, ld, !td), st(r, 0, !0) !== 0) break a;
						Sd = t, r.timeoutHandle = gp(Id.bind(null, r, n, fd, _d, pd, t, ld, sd, ud, td, o, "Throttled", -0, 0), a);
						break a;
					}
					Id(r, n, fd, _d, pd, t, ld, sd, ud, td, o, null, -0, 0);
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
			unsuspend: vn
		}, Bl = null, Ku(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = nh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? md - He() : (a & 4194048) === a ? hd - He() : 0, m = eh(d, m), m !== null) ? (Sd = a, e.cancelPendingCommit = m(nf.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Rd(e, a, o, !l)) : nf(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Ld(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Br(a(), i)) return !1;
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
		t = lt(e, t), t &= ~cd, t &= ~sd, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - et(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && ht(e, n, t);
	}
	function zd() {
		return K & 6 ? !0 : (Df(0, !1), !1);
	}
	function Bd() {
		if (J !== null) {
			if (X === 0) var e = J.return;
			else e = J, ga = ha = null, is(e), io = null, ao = 0, e = J;
			for (; e !== null;) bl(e.alternate, e), e = e.return;
			J = null;
		}
	}
	function Vd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, _p(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Sd = 0, Bd(), q = e, J = n = Ni(e.current, null), Y = t, X = 0, ed = null, td = !1, nd = ct(e, t), rd = !1, ud = ld = cd = sd = od = ad = 0, fd = dd = null, pd = !1, id = lt(e, t), Ci(), n;
	}
	function Hd(e, t) {
		H = null, M.H = mc, t === Ja || t === Xa ? (t = no(), X = 3) : t === Ya ? (t = no(), X = 4) : X = t === Mc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, ed = t, J === null && (ad = 1, Ec(e, Vi(t, e.current)));
	}
	function Ud() {
		var e = Ao.current;
		return e === null ? !0 : (Y & 4194048) === Y ? jo === null : (Y & 62914560) === Y || Y & 536870912 ? e === jo : !1;
	}
	function Wd() {
		var e = M.H;
		return M.H = mc, e === null ? mc : e;
	}
	function Gd() {
		var e = M.A;
		return M.A = Qu, e;
	}
	function Kd() {
		ad = 4, td || (Y & 4194048) !== Y && Ao.current !== null || (nd = !0), !(od & 134217727) && !(sd & 134217727) || q === null || Rd(q, Y, ld, !1);
	}
	function qd(e, t, n) {
		var r = K;
		K |= 2;
		var i = Wd(), a = Gd();
		(q !== e || Y !== t) && (_d = null, Vd(e, t)), t = !1;
		var o = ad;
		a: do
			try {
				if (X !== 0 && J !== null) {
					var s = J, c = ed;
					switch (X) {
						case 8:
							Bd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							Ao.current === null && (t = !0);
							var l = X;
							if (X = 0, ed = null, $d(e, s, c, l), n && nd) {
								o = 0;
								break a;
							}
							break;
						default: l = X, X = 0, ed = null, $d(e, s, c, l);
					}
				}
				Jd(), o = ad;
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, ga = ha = null, K = r, M.H = i, M.A = a, J === null && (q = null, Y = 0, Ci()), o;
	}
	function Jd() {
		for (; J !== null;) Zd(J);
	}
	function Yd(e, t) {
		var n = K;
		K |= 2;
		var r = Wd(), a = Gd();
		q !== e || Y !== t ? (_d = null, gd = He() + 500, Vd(e, t)) : nd = ct(e, t);
		a: do
			try {
				if (X !== 0 && J !== null) {
					t = J;
					var o = ed;
					b: switch (X) {
						case 1:
							X = 0, ed = null, $d(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Qa(o)) {
								X = 0, ed = null, Qd(t);
								break;
							}
							t = function() {
								X !== 2 && X !== 9 || q !== e || (X = 7), Ef(e);
							}, o.then(t, t);
							break a;
						case 3:
							X = 7;
							break a;
						case 4:
							X = 5;
							break a;
						case 7:
							Qa(o) ? (X = 0, ed = null, Qd(t)) : (X = 0, ed = null, $d(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (J.tag) {
								case 26: s = J.memoizedState;
								case 5:
								case 27:
									var c = J;
									if (s ? Ym(s) : c.stateNode.complete) {
										X = 0, ed = null;
										var l = c.sibling;
										if (l !== null) J = l;
										else {
											var u = c.return;
											u === null ? J = null : (J = u, ef(u));
										}
										break b;
									}
							}
							X = 0, ed = null, $d(e, t, o, 5);
							break;
						case 6:
							X = 0, ed = null, $d(e, t, o, 6);
							break;
						case 8:
							Bd(), ad = 6;
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
		return ga = ha = null, M.H = r, M.A = a, K = n, J === null ? (q = null, Y = 0, Ci(), ad) : 0;
	}
	function Xd() {
		for (; J !== null && !Be();) Zd(J);
	}
	function Zd(e) {
		var t = fl(e.alternate, e, id);
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : J = t;
	}
	function Qd(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Kc(n, t, t.pendingProps, t.type, void 0, Y);
				break;
			case 11:
				t = Kc(n, t, t.pendingProps, t.type.render, t.ref, Y);
				break;
			case 5:
				is(t);
				var r = t;
				r === na && (V ? (la(r), r.tag === 5 && r.stateNode != null && (ra = r.stateNode)) : (la(r), V = !0));
			default: bl(n, t), t = J = Pi(t, id), t = fl(n, t, id);
		}
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : J = t;
	}
	function $d(e, t, n, r) {
		ga = ha = null, is(t), io = null, ao = 0;
		var i = t.return;
		try {
			if (jc(e, i, t, n, Y)) {
				ad = 1, Ec(e, Vi(n, e.current)), J = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw J = i, t;
			ad = 1, Ec(e, Vi(n, e.current)), J = null;
			return;
		}
		t.flags & 32768 ? (V || r === 1 ? e = !0 : nd || Y & 536870912 ? e = !1 : (td = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Ao.current, r !== null && r.tag === 13 && (r.flags |= 16384))), tf(t, e)) : ef(t);
	}
	function ef(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				tf(t, td);
				return;
			}
			e = t.return;
			var n = vl(t.alternate, t, id);
			if (n !== null) {
				J = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				J = t;
				return;
			}
			J = t = e;
		} while (t !== null);
		ad === 0 && (ad = 5);
	}
	function tf(e, t) {
		do {
			var n = yl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, J = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				J = e;
				return;
			}
			J = e = n;
		} while (e !== null);
		ad = 6, J = null;
	}
	function nf(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			df();
		while (yd !== 0);
		if (K & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === q && (J = q = null, Y = 0), xd = t, bd = e, Sd = n, wd = a, Td = r, rf(e, t, n, s, c, l, f);
		}
	}
	function rf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (Cd = s, s |= Si, mt(e, n, s, r, i, a), Dd = null, (n & 335544064) === n ? (Od = Fa(e), r = 10262) : (Od = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, yf(Ke, function() {
			return ff(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), zl = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = M.T, M.T = null, i = N.p, N.p = 2, a = K, K |= 4;
			try {
				pu(e, t, n);
			} finally {
				K = a, N.p = i, M.T = r;
			}
		}
		yd = 1, zl ? Ed = Mp(o, e.containerInfo, Od, sf, cf, of, lf, ff, af, null, null) : (sf(), cf(), lf());
	}
	function af(e) {
		if (yd !== 0) {
			var t = bd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function of() {
		yd === 3 && (yd = 0, Pu(xd, bd), yd = 4);
	}
	function sf() {
		if (yd === 1) {
			yd = 0;
			var e = bd, t = xd, n = Sd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = M.T, M.T = null;
				var i = N.p;
				N.p = 2;
				var a = K;
				K |= 4;
				try {
					uu = du = !1, Au(t, e, n), n = cp;
					var o = Kr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Gr(s.ownerDocument.documentElement, s)) {
						if (c !== null && qr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Wr(s, h), v = Wr(s, g);
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
					K = a, N.p = i, M.T = r;
				}
			}
			e.current = t, yd = 2;
		}
	}
	function cf() {
		if (yd === 2) {
			yd = 0;
			var e = bd, t = xd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = M.T, M.T = null;
				var r = N.p;
				N.p = 2;
				var i = K;
				K |= 4;
				try {
					hu(e, t.alternate, t);
				} finally {
					K = i, N.p = r, M.T = n;
				}
			}
			yd = 3;
		}
	}
	function lf() {
		if (yd === 4 || yd === 3) {
			yd = 0;
			var e = Ed;
			Ed = null, Ve();
			var t = bd, n = xd, r = Sd, i = Td, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? yd = 5 : (yd = 0, xd = bd = null, uf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (vd = null), yt(r), n = n.stateNode, Qe && typeof Qe.onCommitFiberRoot == "function") try {
				Qe.onCommitFiberRoot(Ze, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = M.T, a = N.p, N.p = 2, M.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					M.T = n, N.p = a;
				}
			}
			if (i = Dd, o = Od, Od = null, i !== null && (Dd = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			Sd & 3 && df(), Ef(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Ad ? kd++ : (kd = 0, Ad = t) : (kd = 0, Ad = null), Df(0, !1);
		}
	}
	function uf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Ma(t)));
	}
	function df() {
		return Ed !== null && (Ed.skipTransition(), Ed = null), sf(), cf(), lf(), ff();
	}
	function ff() {
		if (yd !== 5) return !1;
		var e = bd, t = Cd;
		Cd = 0;
		var n = yt(Sd), r = M.T, a = N.p;
		try {
			N.p = 32 > n ? 32 : n, M.T = null, n = wd, wd = null;
			var o = bd, s = Sd;
			if (yd = 0, xd = bd = null, Sd = 0, K & 6) throw Error(i(331));
			var c = K;
			if (K |= 4, Yu(o.current), Vu(o, o.current, s, n), K = c, Df(0, !1), Qe && typeof Qe.onPostCommitFiberRoot == "function") try {
				Qe.onPostCommitFiberRoot(Ze, o);
			} catch {}
			return !0;
		} finally {
			N.p = a, M.T = r, uf(e, t);
		}
	}
	function pf(e, t, n) {
		t = Vi(n, t), t = Oc(e.stateNode, t, 2), e = _o(e, t, 2), e !== null && (pt(e, 2), Ef(e));
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
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (vd === null || !vd.has(r))) {
					e = Vi(n, e), n = kc(2), r = _o(t, n, 2), r !== null && (Ac(n, r, t, e), pt(r, 2), Ef(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function mf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new $u();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (rd = !0, i.add(n), e = hf.bind(null, e, t, n), t.then(e, e));
	}
	function hf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, q === e && (Y & n) === n && (ad === 4 || ad === 3 && (Y & 62914560) === Y && 300 > He() - md ? K & 2 ? cd |= n : Vd(e, 0) : cd |= n, ud === Y && (ud = 0)), Ef(e);
	}
	function gf(e, t) {
		t === 0 && (t = dt()), e = Ei(e, t), e !== null && (pt(e, t), Ef(e));
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
		return Re(e, t);
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
								a = (1 << 31 - et(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Mf(r, a));
						} else a = Y, a = st(r, r === q ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || ct(r, a) || (n = !0, Mf(r, a));
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
		for (var t = He(), n = null, r = bf; r !== null;) {
			var i = r.next, a = Af(r, t);
			a === 0 ? (r.next = null, n === null ? bf = i : n.next = i, i === null && (xf = n)) : (n = r, (e !== 0 || a & 3) && (Cf = !0)), r = i;
		}
		yd !== 0 && yd !== 5 || Df(e, !1), Tf !== 0 && (Tf = 0);
	}
	function Af(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - et(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = ut(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = q, n = Y, n = st(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (X === 2 || X === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && ze(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || ct(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && ze(r), yt(n)) {
				case 2:
				case 8:
					n = Ge;
					break;
				case 32:
					n = Ke;
					break;
				case 268435456:
					n = Je;
					break;
				default: n = Ke;
			}
			return r = jf.bind(null, e), n = Re(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && ze(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function jf(e, t) {
		if (yd !== 0 && yd !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (df() && e.callbackNode !== n) return null;
		var r = Y;
		return r = st(e, e === q ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Fd(e, r, t), Af(e, He()), e.callbackNode != null && e.callbackNode === n ? jf.bind(null, e) : null);
	}
	function Mf(e, t) {
		if (df()) return null;
		Fd(e, t, !0);
	}
	function Nf() {
		bp(function() {
			K & 6 ? Re(We, Of) : kf();
		});
	}
	function Pf() {
		if (Tf === 0) {
			var e = Ra;
			e === 0 && (e = rt, rt <<= 1, !(rt & 261888) && (rt = 256)), Tf = e;
		}
		return Tf;
	}
	function Ff(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : _n(e);
	}
	function If(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Ff((i[R] || null).action), o = r.submitter;
			o && (t = (t = o[R] || null) ? Ff(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new zn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (Tf !== 0) {
								var e = new FormData(i, o);
								ec(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), ec(n, {
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
	for (var Lf = 0; Lf < pi.length; Lf++) {
		var Rf = pi[Lf];
		mi(Rf.toLowerCase(), "on" + (Rf[0].toUpperCase() + Rf.slice(1)));
	}
	mi(ai, "onAnimationEnd"), mi(oi, "onAnimationIteration"), mi(si, "onAnimationStart"), mi("dblclick", "onDoubleClick"), mi("focusin", "onFocus"), mi("focusout", "onBlur"), mi(ci, "onTransitionRun"), mi(li, "onTransitionStart"), mi(ui, "onTransitionCancel"), mi(di, "onTransitionEnd"), Vt("onMouseEnter", ["mouseout", "mouseover"]), Vt("onMouseLeave", ["mouseout", "mouseover"]), Vt("onPointerEnter", ["pointerout", "pointerover"]), Vt("onPointerLeave", ["pointerout", "pointerover"]), Bt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Bt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Bt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Bt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Bt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Bt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
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
						yi(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						yi(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Q(e, t) {
		var n = t[Tt];
		n === void 0 && (n = t[Tt] = /* @__PURE__ */ new Set());
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
			e[Uf] = !0, Rt.forEach(function(t) {
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
		n = i.bind(null, t, n, e), i = void 0, !On || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
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
					if (s = Mt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		Tn(function() {
			var r = a, i = bn(n), s = [];
			a: {
				var c = fi.get(e);
				if (c !== void 0) {
					var l = zn, u = e;
					switch (e) {
						case "keypress": if (Pn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = rr;
							break;
						case "focusin":
							u = "focus", l = Jn;
							break;
						case "focusout":
							u = "blur", l = Jn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Jn;
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
							l = Kn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = qn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = or;
							break;
						case ai:
						case oi:
						case si:
							l = Yn;
							break;
						case di:
							l = sr;
							break;
						case "scroll":
						case "scrollend":
							l = Vn;
							break;
						case "wheel":
							l = cr;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Xn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = ir;
							break;
						case "submit":
							l = ar;
							break;
						case "toggle":
						case "beforetoggle": l = lr;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = En(m, p), g != null && d.push(qf(m, g, h))), f) break;
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
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== yn && (u = n.relatedTarget || n.fromElement) && (Mt(u) || u[wt])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Mt(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = Kn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = ir, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : Pt(c), h = l == null ? u : Pt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, Mt(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? E(c, l, Yf) : null, c !== null && Xf(s, u, c, d, !1), l !== null && f !== null && Xf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? Pt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = Or;
					else if (Cr(c)) {
						if (kr) _ = Rr;
						else {
							_ = Ir;
							var v = Fr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && mn(r.elementType) && (_ = Or) : _ = Lr;
					if (_ &&= _(e, r)) {
						wr(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? Pt(r) : window, e) {
					case "focusin":
						(Cr(v) || v.contentEditable === "true") && (Yr = v, Xr = r, Zr = null);
						break;
					case "focusout":
						Zr = Xr = Yr = null;
						break;
					case "mousedown":
						Qr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Qr = !1, $r(s, n, i);
						break;
					case "selectionchange": if (Jr) break;
					case "keydown":
					case "keyup": $r(s, n, i);
				}
				var y;
				if (dr) b: {
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
				else yr ? _r(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (mr && n.locale !== "ko" && (yr || b !== "onCompositionStart" ? b === "onCompositionEnd" && yr && (y = Nn()) : (An = i, jn = "value" in An ? An.value : An.textContent, yr = !0)), v = Jf(r, b), 0 < v.length && (b = new Zn(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = vr(n), y !== null && (b.data = y)))), (y = pr ? br(e, n) : xr(e, n)) && (b = Jf(r, "onBeforeInput"), 0 < b.length && (v = new Zn("onBeforeInput", "beforeinput", null, n, i), s.push({
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
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = En(e, n), i != null && r.unshift(qf(e, i, a)), i = En(e, t), i != null && r.push(qf(e, i, a))), e.tag === 3) return r;
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
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = En(n, a), l != null && o.unshift(qf(n, l, c))) : i || (l = En(n, a), l != null && o.push(qf(n, l, c)))), n = n.return;
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
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || un(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && un(e, "" + r);
				else return;
				break;
			case "className":
				Jt(e, "class", r);
				break;
			case "tabIndex":
				Jt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Jt(e, n, r);
				break;
			case "style":
				pn(e, r, o);
				return;
			case "data": if (t !== "object") {
				Jt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = _n(r), e.setAttribute(n, r);
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
				r = _n(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = vn);
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
				n = _n(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
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
				Q("beforetoggle", e), Q("toggle", e), qt(e, "popover", r);
				break;
			case "xlinkActuate":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Yt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Yt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Yt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				qt(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = hn.get(n) || n, qt(e, n, r);
			else return;
		}
		z = !0;
	}
	function tp(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				pn(e, r, o);
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
				if (typeof r == "string") un(e, r);
				else if (typeof r == "number" || typeof r == "bigint") un(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = vn);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!zt.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[R] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					z = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : qt(e, n, r);
				}
				return;
		}
		z = !0;
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
				an(e, o, c, l, u, s, a, !1);
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
				t = o, n = s, e.multiple = !!r, t == null ? n != null && sn(e, !!r, n, !0) : sn(e, !!r, t, !1);
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
				ln(e, r, a, o);
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
			default: if (mn(t)) {
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
							m !== f && (z = !0), o = m;
							break;
						case "name":
							m !== f && (z = !0), a = m;
							break;
						case "checked":
							m !== f && (z = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (z = !0), d = m;
							break;
						case "value":
							m !== f && (z = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (z = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && $(e, t, p, m, r, f);
					}
				}
				rn(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || $(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (z = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (z = !0), c = o;
						break;
					case "multiple": o !== l && (z = !0), s = o;
					default: o !== l && $(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? sn(e, !!n, n ? [] : "", !1) : sn(e, !!n, t, !0)) : sn(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: $(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (z = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (z = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && $(e, t, s, a, r, o);
				}
				cn(e, p, m);
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
						p !== m && (z = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
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
			default: if (mn(t)) {
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
		return n = lp(n).createElement(e), n[Ct] = r, n[R] = t, np(n, e, t), It(n), n;
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
						a[kt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
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
		return t = typeof t == "number" ? { duration: t } : D({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
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
		var a = Mt(i);
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
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = E(n, a, T), t === null ? t = !1 : (h(t, !0, C, a, n), a = x, x = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = E(r, a, T), t === null ? t = !1 : (h(t, !0, w, a, r), a = x, S = x = null, t = a !== null)), t) : !1;
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
					nm(n), jt(n);
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
			} else if (!e[kt]) switch (t) {
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
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === vn && (e.onclick = null), jt(e);
	}
	function _m(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		jt(e);
	}
	var vm = /* @__PURE__ */ new Map(), ym = /* @__PURE__ */ new Set();
	function bm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var xm = N.d;
	N.d = {
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
		var t = Nt(e);
		t !== null && t.tag === 5 && t.type === "form" ? nc(t) : xm.r(e);
	}
	var wm = typeof document > "u" ? null : document;
	function Tm(e, t, n) {
		var r = wm;
		if (r && typeof t == "string" && t) {
			var i = nn(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), ym.has(i) || (ym.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), np(t, "link", e), It(t), r.head.appendChild(t)));
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
			var i = "link[rel=\"preload\"][as=\"" + nn(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + nn(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + nn(n.imageSizes) + "\"]")) : i += "[href=\"" + nn(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Pm(e);
					break;
				case "script": a = Rm(e);
			}
			if (!(vm.has(a) || (e = D({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), vm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Fm(a)) || t === "script" && r.querySelector(zm(a))))) {
				var o = r.createElement("link");
				np(o, "link", e), t === "style" && (o[At] = !0, o.onload = o.onerror = function() {
					Lt(o);
				}), It(o), r.head.appendChild(o);
			}
		}
	}
	function km(e, t) {
		xm.m(e, t);
		var n = wm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + nn(r) + "\"][href=\"" + nn(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Rm(e);
			}
			if (!vm.has(a) && (e = D({
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
				r = n.createElement("link"), np(r, "link", e), It(r), n.head.appendChild(r);
			}
		}
	}
	function Am(e, t, n) {
		xm.S(e, t, n);
		var r = wm;
		if (r && e) {
			var i = Ft(r).hoistableStyles, a = Pm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Fm(a))) s.loading = 5;
				else {
					e = D({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = vm.get(a)) && Hm(e, n);
					var c = o = r.createElement("link");
					It(c), np(c, "link", e), c._p = new Promise(function(e, t) {
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
			var r = Ft(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = D({
				src: e,
				async: !0
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), It(a), np(a, "link", e), n.head.appendChild(a)), a = {
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
			var r = Ft(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = D({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), It(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Nm(e, t, n, r) {
		var a = (a = Te.current) ? bm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Pm(n.href), t = Ft(a).hoistableStyles, r = t.get(n), r || (r = {
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
					var o = Ft(a).hoistableStyles, s = o.get(e);
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
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Rm(n), t = Ft(a).hoistableScripts, r = t.get(n), r || (r = {
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
		return "href=\"" + nn(e) + "\"";
	}
	function Fm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Im(e) {
		return D({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Lm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[At]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[At] = !0, t.onload = t.onerror = Lt.bind(null, t), np(t, "link", n), It(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Rm(e) {
		return "[src=\"" + nn(e) + "\"]";
	}
	function zm(e) {
		return "script[async]" + e;
	}
	function Bm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + nn(n.href) + "\"]");
				if (r) return t.instance = r, It(r), r;
				var a = D({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), It(r), np(r, "style", a), Vm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Pm(n.href);
				var o = e.querySelector(Fm(a));
				if (o) return t.state.loading |= 4, t.instance = o, It(o), o;
				r = Im(n), (a = vm.get(a)) && Hm(r, a), o = (e.ownerDocument || e).createElement("link"), It(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), np(o, "link", r), t.state.loading |= 4, Vm(o, n.precedence, e), t.instance = o;
			case "script": return o = Rm(n.src), (a = e.querySelector(zm(o))) ? (t.instance = a, It(a), a) : (r = n, (a = vm.get(o)) && (r = D({}, n), Um(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), It(a), np(a, "link", r), e.head.appendChild(a), t.instance = a);
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
			if (!(a[kt] || a[Ct] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
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
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = nh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, It(a);
					return;
				}
				a = t.ownerDocument || t, r = Im(r), (i = vm.get(i)) && Hm(r, i), a = a.createElement("link"), It(a);
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
		$$typeof: k,
		Provider: null,
		Consumer: null,
		_currentValue: ye,
		_currentValue2: ye,
		_threadCount: 0
	};
	function ch(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = ft(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ft(0), this.hiddenUpdates = ft(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function lh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new ch(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = ji(3, null, null, t), e.current = a, a.stateNode = e, t = ja(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, mo(a), e;
	}
	function uh(e) {
		return e ? (e = ki, e) : ki;
	}
	function dh(e, t, n, r, i, a) {
		i = uh(i), r.context === null ? r.context = i : r.pendingContext = i, r = go(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = _o(e, r, t), n !== null && (Pd(n, e, t), vo(n, e, t));
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
			var t = Ei(e, 67108864);
			t !== null && Pd(t, e, 67108864), ph(e, 67108864);
		}
	}
	function hh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = jd();
			t = vt(t);
			var n = Ei(e, t);
			n !== null && Pd(n, e, t), ph(e, t);
		}
	}
	var gh = !0;
	function _h(e, t, n, r) {
		var i = M.T;
		M.T = null;
		var a = N.p;
		try {
			N.p = 2, yh(e, t, n, r);
		} finally {
			N.p = a, M.T = i;
		}
	}
	function vh(e, t, n, r) {
		var i = M.T;
		M.T = null;
		var a = N.p;
		try {
			N.p = 8, yh(e, t, n, r);
		} finally {
			N.p = a, M.T = i;
		}
	}
	function yh(e, t, n, r) {
		if (gh) {
			var i = bh(r);
			if (i === null) Kf(e, t, r, xh, n), Mh(e, r);
			else if (Ph(i, e, t, n, r)) r.stopPropagation();
			else if (Mh(e, r), t & 4 && -1 < jh.indexOf(e)) {
				for (; i !== null;) {
					var a = Nt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = ot(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - et(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Ef(a), !(K & 6) && (gd = He() + 500, Df(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = Ei(a, 2), s !== null && Pd(s, a, 2), zd(), ph(a, 2);
					}
					if (a = bh(r), a === null && Kf(e, t, r, xh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Kf(e, t, r, null, n);
		}
	}
	function bh(e) {
		return e = bn(e), Sh(e);
	}
	var xh = null;
	function Sh(e) {
		if (xh = null, e = Mt(e), e !== null) {
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
			case "message": switch (Ue()) {
				case We: return 2;
				case Ge: return 8;
				case Ke:
				case qe: return 32;
				case Je: return 268435456;
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
		}, t !== null && (t = Nt(t), t !== null && mh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
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
		var t = Mt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, xt(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, xt(e.priority, function() {
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
				yn = r, n.target.dispatchEvent(r), yn = null;
			} else return t = Nt(n), t !== null && mh(t), e.blockedOn = n, !1;
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
				var a = Nt(n);
				a !== null && (e.splice(t, 3), t -= 3, ec(a, {
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
			var i = n[r], a = n[r + 1], o = i[R] || null;
			if (typeof a == "function") o || Vh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[R] || null) s = o.formAction;
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
			dh(e.current, 2, null, e, null, null), zd(), t[wt] = null;
		}
	};
	function Gh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = bt();
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
	N.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var qh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: M,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Jh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Jh.isDisabled && Jh.supportsFiber) try {
			Ze = Jh.inject(qh), Qe = Jh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Cc, s = wc, c = Tc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = lh(e, 1, !1, null, null, n, r, null, o, s, c, Uh), e[wt] = t.current, Wf(e), new Wh(t);
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
})), _ = /* @__PURE__ */ c(u(), 1), v = g(), y = "2026-11", b = [
	"january",
	"february",
	"march",
	"april",
	"may",
	"june",
	"july",
	"august",
	"september",
	"october",
	"november",
	"december"
], x = "finance.selected_period", S = (e) => /^\d{4}-(0[1-9]|1[0-2])$/.test(e || ""), C = (e) => {
	if (!S(e)) return "No period";
	let [t, n] = e.split("-").map(Number);
	return `${b[n - 1][0].toUpperCase()}${b[n - 1].slice(1)} ${t}`;
}, w = (e) => S(e) ? `${C(e).slice(0, 3)} ${e.slice(0, 4)}` : "Select month", T = (e) => S(e) ? `FY${e.slice(0, 4)} · P${e.slice(5)}` : "";
function E(e) {
	let t = String(e || "").toLowerCase(), n = t.match(/\b(2025|2026)-(0[1-9]|1[0-2])\b/);
	if (n) return n[0];
	for (let e = 1; e <= 12; e += 1) {
		let n = b[e - 1], r = t.match(RegExp(`\\b(?:${n}|${n.slice(0, 3)})\\s+(2025|2026)\\b`));
		if (r) return `${r[1]}-${String(e).padStart(2, "0")}`;
	}
	return null;
}
function D(e) {
	let t = String(e || "").toLowerCase();
	if (E(t)) return null;
	let n = t.match(/* @__PURE__ */ RegExp("\\b(?:20\\d{2}-(?:0[1-9]|1[0-2])|(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\\s+20\\d{2})\\b"));
	return n ? n[0] : null;
}
function O() {
	try {
		let e = new URLSearchParams(window.location.search).get("period");
		if (S(e)) return e;
	} catch {}
	try {
		let e = window.sessionStorage.getItem(x);
		if (S(e)) return e;
	} catch {}
	return y;
}
function ee(e) {
	try {
		window.sessionStorage.setItem(x, e);
	} catch {}
	try {
		let t = new URL(window.location.href);
		t.searchParams.set("period", e), window.history.replaceState(null, "", t);
	} catch {}
}
// src/cockpit.js
function te(e = []) {
	let t = e || [], n = Object.fromEntries(t.map((e) => [e.id, e])), r = t.find((e) => e.default) || t[0] || null, i = t.filter((e) => e.routing?.words?.length).map((e) => ({
		id: e.id,
		priority: e.routing.priority,
		re: RegExp(`\\b(${e.routing.words.join("|")})\\b`)
	})), a = (e, t) => String(e || "").replace("{period}", C(t));
	return {
		modules: t,
		byId: n,
		def: r,
		route: (e) => {
			let t = String(e || "").toLowerCase(), n = i.filter((e) => e.re.test(t));
			return n.length ? n.reduce((e, t) => t.priority > e.priority ? t : e).id : r?.id || "reconciliation";
		},
		ask: (e, t) => a((n[e] || r)?.ask_template, t),
		examples: (e, t) => ((n[e] || r)?.examples || []).map((e) => a(e, t)),
		label: (e) => n[e]?.family_label || e || "",
		name: (e) => n[e]?.name || e || "",
		tabs: t.filter((e) => e.tab)
	};
}
var ne = (0, _.createContext)(null), re = ({ value: e, children: t }) => (0, _.createElement)(ne.Provider, { value: e }, t), ie = () => (0, _.useContext)(ne) || te([]), ae = /* @__PURE__ */ o(((e) => {
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
})), k = (/* @__PURE__ */ o(((e, t) => {
	t.exports = ae();
})))(), oe = [
	[
		"actor",
		"Actor",
		"#0e7c86",
		"#e9f6f8"
	],
	[
		"process",
		"Process",
		"#6b4fb3",
		"#f1ecfa"
	],
	[
		"entity",
		"Entity",
		"#0a6ed1",
		"#e8f1fb"
	],
	[
		"measure",
		"Measure",
		"#107E3E",
		"#f2faf4"
	],
	[
		"rule",
		"Rule",
		"#d99a25",
		"#fff8eb"
	],
	[
		"artifact",
		"Artifact",
		"#6b7f8f",
		"#f4f6f8"
	]
], se = Object.fromEntries(oe.map(([e, t, n, r]) => [e, {
	label: t,
	stroke: n,
	fill: r
}])), ce = {
	DOCUMENTED: ["Documented by SAP", "ok"],
	SAP_TERM: ["SAP term, not source-checked", "warn"],
	DEMO_ONLY: ["Demo concept only", ""]
}, le = 190, A = 46, ue = 70, de = 34, fe = 12;
function pe(e, t) {
	let n = {}, r = t.filter((t) => e.some((e) => e.module === t.id));
	r.forEach((t, r) => {
		e.filter((e) => e.module === t.id).sort((e, t) => oe.findIndex((t) => t[0] === e.kind) - oe.findIndex((e) => e[0] === t.kind) || e.label.localeCompare(t.label)).forEach((e, t) => {
			n[e.id] = {
				x: fe + r * 260,
				y: de + t * 60
			};
		});
	});
	let i = Math.max(1, ...r.map((t) => e.filter((e) => e.module === t.id).length));
	return {
		pos: n,
		cols: r,
		width: 24 + r.length * le + Math.max(0, r.length - 1) * ue,
		height: de + i * 60 + fe
	};
}
function me(e, t) {
	if (e.x === t.x) {
		let n = e.x + le;
		return `M${n},${e.y + A / 2} C${n + 36},${e.y + A / 2} ${n + 36},${t.y + A / 2} ${n},${t.y + A / 2}`;
	}
	let n = e.x < t.x, r = n ? e.x + le : e.x, i = n ? t.x : t.x + le, a = Math.max(30, Math.abs(i - r) / 2) * (n ? 1 : -1);
	return `M${r},${e.y + A / 2} C${r + a},${e.y + A / 2} ${i - a},${t.y + A / 2} ${i},${t.y + A / 2}`;
}
function he({ ontology: e, references: t = [], focus: n, onOpenTab: r }) {
	let [i, a] = (0, _.useState)("all"), [o, s] = (0, _.useState)(""), [c, l] = (0, _.useState)(n || null);
	(0, _.useEffect)(() => {
		n && (l(n), a("all"), s(""));
	}, [n]);
	let u = e?.classes || [], d = e?.relations || [], f = e?.modules || [], p = (0, _.useMemo)(() => Object.fromEntries(u.map((e) => [e.id, e])), [u]), m = Object.fromEntries(t.map((e) => [e.id, e])), h = o.trim().toLowerCase(), g = u.filter((e) => (i === "all" || e.module === i || e.module === "core" && i !== "all" && d.some((t) => t.from === e.id && p[t.to]?.module === i || t.to === e.id && p[t.from]?.module === i)) && (!h || `${e.label} ${e.description} ${e.sap_term || ""}`.toLowerCase().includes(h))), v = new Set(g.map((e) => e.id)), { pos: y, cols: b, width: x, height: S } = (0, _.useMemo)(() => pe(g, f), [g.map((e) => e.id).join("|"), f.length]), C = d.filter((e) => v.has(e.from) && v.has(e.to)), w = c && p[c] ? p[c] : null, T = new Set(w ? [w.id, ...C.filter((e) => e.from === w.id || e.to === w.id).flatMap((e) => [e.from, e.to])] : []), E = w ? d.filter((e) => e.from === w.id || e.to === w.id) : [];
	return e ? /* @__PURE__ */ (0, k.jsxs)("main", {
		className: "ontology-page",
		"aria-label": "Ontology",
		"data-testid": "ontology-view",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("header", {
				className: "surface ont-head",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [
					/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: "ONTOLOGY · THE CONCEPTS THE AGENTS WORK WITH"
					}),
					/* @__PURE__ */ (0, k.jsx)("h2", { children: "Ontology" }),
					/* @__PURE__ */ (0, k.jsxs)("p", { children: [
						u.length,
						" concepts and ",
						d.length,
						" relations. Each agent module brings its own concepts; shared concepts are listed once. ",
						e.note
					] })
				] }), /* @__PURE__ */ (0, k.jsxs)("div", {
					className: "ont-controls",
					children: [
						/* @__PURE__ */ (0, k.jsx)("div", {
							className: "ont-chips",
							role: "group",
							"aria-label": "Show concepts from",
							children: [{
								id: "all",
								name: "All"
							}, ...f].map((e) => /* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								className: i === e.id ? "active" : "",
								"aria-pressed": i === e.id,
								onClick: () => a(e.id),
								children: e.name
							}, e.id))
						}),
						/* @__PURE__ */ (0, k.jsx)("label", {
							className: "sr-only",
							htmlFor: "ont-search",
							children: "Search concepts"
						}),
						/* @__PURE__ */ (0, k.jsx)("input", {
							id: "ont-search",
							type: "search",
							placeholder: "Search concepts",
							value: o,
							onChange: (e) => s(e.target.value)
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "ont-body",
				children: [/* @__PURE__ */ (0, k.jsxs)("section", {
					className: "surface ont-graph",
					"aria-label": "Ontology graph",
					children: [/* @__PURE__ */ (0, k.jsxs)("svg", {
						viewBox: `0 0 ${x} ${S}`,
						width: x,
						height: S,
						role: "img",
						"aria-label": "Concepts and their relations",
						onClick: (e) => {
							e.target.tagName === "svg" && l(null);
						},
						children: [
							b.map((e, t) => /* @__PURE__ */ (0, k.jsx)("text", {
								x: fe + t * 260,
								y: 20,
								fontSize: "11",
								fontWeight: "800",
								fill: "#557695",
								letterSpacing: ".05em",
								children: e.name.toUpperCase()
							}, e.id)),
							C.map((e, t) => {
								let n = y[e.from], r = y[e.to], i = w && (e.from === w.id || e.to === w.id), a = (n.x + r.x + le) / 2, o = (n.y + r.y + A) / 2;
								return /* @__PURE__ */ (0, k.jsxs)("g", {
									opacity: w ? i ? 1 : .08 : .45,
									children: [/* @__PURE__ */ (0, k.jsx)("path", {
										d: me(n, r),
										fill: "none",
										stroke: i ? "#0a6ed1" : "#8aa2b4",
										strokeWidth: i ? 1.8 : 1
									}), i && /* @__PURE__ */ (0, k.jsx)("text", {
										x: a,
										y: o - 3,
										fontSize: "10",
										textAnchor: "middle",
										fill: "#075793",
										paintOrder: "stroke",
										stroke: "#fff",
										strokeWidth: "3",
										children: e.label
									})]
								}, t);
							}),
							g.map((e) => {
								let t = y[e.id], n = se[e.kind] || se.artifact, r = w && !T.has(e.id);
								return /* @__PURE__ */ (0, k.jsxs)("g", {
									"data-testid": "ontology-node",
									"data-id": e.id,
									opacity: r ? .3 : 1,
									tabIndex: 0,
									role: "button",
									"aria-label": `${e.label}, ${n.label}`,
									onClick: () => l(e.id),
									onKeyDown: (t) => {
										(t.key === "Enter" || t.key === " ") && (t.preventDefault(), l(e.id));
									},
									style: { cursor: "pointer" },
									children: [
										/* @__PURE__ */ (0, k.jsx)("rect", {
											x: t.x,
											y: t.y,
											width: le,
											height: A,
											rx: "5",
											fill: n.fill,
											stroke: w?.id === e.id ? "#0a4f9e" : n.stroke,
											strokeWidth: w?.id === e.id ? 3 : e.sap_status === "DOCUMENTED" ? 2 : 1.2,
											strokeDasharray: e.sap_status === "DEMO_ONLY" ? "4 3" : void 0
										}),
										/* @__PURE__ */ (0, k.jsx)("text", {
											x: t.x + 9,
											y: t.y + 19,
											fontSize: "12",
											fontWeight: "700",
											fill: "#1d2d3e",
											children: e.label.length > 25 ? e.label.slice(0, 24) + "…" : e.label
										}),
										/* @__PURE__ */ (0, k.jsxs)("text", {
											x: t.x + 9,
											y: t.y + 35,
											fontSize: "9.5",
											fill: "#587184",
											children: [
												n.label,
												" · ",
												(ce[e.sap_status] || [e.sap_status])[0]
											]
										})
									]
								}, e.id);
							})
						]
					}), /* @__PURE__ */ (0, k.jsxs)("div", {
						className: "ont-legend",
						"aria-label": "Legend",
						children: [
							oe.map(([e, t, n, r]) => /* @__PURE__ */ (0, k.jsxs)("span", { children: [/* @__PURE__ */ (0, k.jsx)("i", { style: {
								background: r,
								borderColor: n
							} }), t] }, e)),
							/* @__PURE__ */ (0, k.jsxs)("span", { children: [/* @__PURE__ */ (0, k.jsx)("i", { className: "dashed" }), "Dashed: demo concept only"] }),
							/* @__PURE__ */ (0, k.jsxs)("span", { children: [/* @__PURE__ */ (0, k.jsx)("i", { className: "solid" }), "Bold: documented by SAP"] })
						]
					})]
				}), /* @__PURE__ */ (0, k.jsx)("aside", {
					className: "surface ont-detail",
					"aria-live": "polite",
					"data-testid": "ontology-detail",
					children: w ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
						/* @__PURE__ */ (0, k.jsxs)("span", {
							className: "eyebrow",
							children: [
								(se[w.kind] || se.artifact).label.toUpperCase(),
								" · ",
								(f.find((e) => e.id === w.module) || {}).name
							]
						}),
						/* @__PURE__ */ (0, k.jsx)("h3", { children: w.label }),
						/* @__PURE__ */ (0, k.jsx)("p", { children: w.description }),
						w.properties?.length > 0 && /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("h4", { children: "Properties" }), /* @__PURE__ */ (0, k.jsx)("p", {
							className: "ont-props",
							children: w.properties.join(" · ")
						})] }),
						/* @__PURE__ */ (0, k.jsx)("h4", { children: "SAP grounding" }),
						/* @__PURE__ */ (0, k.jsxs)("p", { children: [
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: `ont-chip ${(ce[w.sap_status] || [])[1] || ""}`,
								children: (ce[w.sap_status] || [w.sap_status])[0]
							}),
							" ",
							w.sap_term || "No SAP counterpart is claimed."
						] }),
						w.sources?.length > 0 && /* @__PURE__ */ (0, k.jsx)("ul", {
							className: "ont-list",
							children: w.sources.map((e) => m[e] ? /* @__PURE__ */ (0, k.jsxs)("li", { children: [
								/* @__PURE__ */ (0, k.jsxs)("a", {
									href: m[e].url,
									target: "_blank",
									rel: "noreferrer",
									children: [
										e,
										" · ",
										m[e].title,
										" ↗"
									]
								}),
								" ",
								/* @__PURE__ */ (0, k.jsxs)("small", { children: [
									"[",
									m[e].status,
									"]"
								] })
							] }, e) : /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e))
						}),
						/* @__PURE__ */ (0, k.jsx)("h4", { children: "Used by" }),
						w.used_by?.length ? /* @__PURE__ */ (0, k.jsx)("ul", {
							className: "ont-list",
							"data-testid": "ontology-used-by",
							children: w.used_by.map((e, t) => /* @__PURE__ */ (0, k.jsxs)("li", { children: [
								/* @__PURE__ */ (0, k.jsx)("b", { children: e.agent || e.module }),
								" · ",
								/* @__PURE__ */ (0, k.jsx)("code", { children: e.tool }),
								" ",
								/* @__PURE__ */ (0, k.jsx)("small", { children: e.access === "reads" ? "reads" : "produces" })
							] }, t))
						}) : /* @__PURE__ */ (0, k.jsx)("p", {
							className: "ont-note",
							children: "No tool reads or produces it directly."
						}),
						/* @__PURE__ */ (0, k.jsx)("h4", { children: "Relations" }),
						E.length ? /* @__PURE__ */ (0, k.jsx)("ul", {
							className: "ont-list",
							children: E.map((e, t) => {
								let n = e.from === w.id, r = p[n ? e.to : e.from];
								return /* @__PURE__ */ (0, k.jsxs)("li", { children: [n ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
									"this ",
									/* @__PURE__ */ (0, k.jsx)("em", { children: e.label }),
									" "
								] }) : /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
									/* @__PURE__ */ (0, k.jsx)("button", {
										type: "button",
										className: "ont-link",
										onClick: () => l(r.id),
										children: r.label
									}),
									" ",
									/* @__PURE__ */ (0, k.jsx)("em", { children: e.label }),
									" this"
								] }), n && /* @__PURE__ */ (0, k.jsx)("button", {
									type: "button",
									className: "ont-link",
									onClick: () => l(r.id),
									children: r.label
								})] }, t);
							})
						}) : /* @__PURE__ */ (0, k.jsx)("p", {
							className: "ont-note",
							children: "None."
						}),
						w.where && r && /* @__PURE__ */ (0, k.jsxs)("button", {
							type: "button",
							className: "ont-open",
							onClick: () => r(w.where.tab),
							children: [
								"Open ",
								w.where.label,
								" →"
							]
						})
					] }) : /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("h3", { children: "Select a concept" }), /* @__PURE__ */ (0, k.jsx)("p", {
						className: "ont-note",
						children: "Click a box to see what it means, where SAP describes it, which agents and tools use it, and how it relates to other concepts. Relations of the selected concept are labelled on the graph."
					})] })
				})]
			}),
			/* @__PURE__ */ (0, k.jsxs)("details", {
				className: "surface ont-table",
				children: [/* @__PURE__ */ (0, k.jsxs)("summary", { children: [
					/* @__PURE__ */ (0, k.jsx)("strong", { children: "Table view" }),
					" ",
					/* @__PURE__ */ (0, k.jsxs)("span", { children: [g.length, " concepts"] })
				] }), /* @__PURE__ */ (0, k.jsxs)("table", {
					className: "rr-table",
					children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Concept" }),
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Kind" }),
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Module" }),
						/* @__PURE__ */ (0, k.jsx)("th", { children: "SAP term" }),
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Status" })
					] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: g.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.label }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: (se[e.kind] || {}).label }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: (f.find((t) => t.id === e.module) || {}).name }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.sap_term || "none claimed" }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: (ce[e.sap_status] || [e.sap_status])[0] })
					] }, e.id)) })]
				})]
			})
		]
	}) : /* @__PURE__ */ (0, k.jsx)("main", {
		className: "ontology-page",
		children: /* @__PURE__ */ (0, k.jsx)("div", {
			className: "empty-state",
			role: "status",
			children: /* @__PURE__ */ (0, k.jsx)("strong", { children: "Loading the ontology…" })
		})
	});
}
// src/Blocks.jsx
var j = (e) => Number(e || 0).toLocaleString("en-US"), ge = (e) => `${Number(e) > 0 ? "+" : Number(e) < 0 ? "−" : ""}${j(Math.abs(Number(e || 0)))}`;
function _e(e, t) {
	let n = t[e.key];
	return e.tones ? /* @__PURE__ */ (0, k.jsx)("span", {
		className: `blk-chip ${e.tones[n] || ""}`,
		children: e.words && e.words[n] || n
	}) : e.format === "int" ? j(n) : e.format === "signed" ? ge(n) : n ?? "";
}
function ve(e, t) {
	return e ? e.equals === void 0 ? e.notequals !== void 0 && t[e.key] !== e.notequals : t[e.key] === e.equals : !1;
}
function M({ blocks: e = [] }) {
	return /* @__PURE__ */ (0, k.jsx)("div", {
		className: "blk-stack",
		children: e.map((e, t) => e.type === "kpis" ? /* @__PURE__ */ (0, k.jsx)("div", {
			className: "blk-kpis",
			children: e.items.map((e) => /* @__PURE__ */ (0, k.jsxs)("div", {
				className: e.tone || "",
				children: [
					/* @__PURE__ */ (0, k.jsx)("span", { children: e.label }),
					/* @__PURE__ */ (0, k.jsx)("strong", { children: e.value }),
					e.note && /* @__PURE__ */ (0, k.jsx)("small", { children: e.note })
				]
			}, e.label))
		}, t) : e.type === "table" ? /* @__PURE__ */ (0, k.jsxs)("section", {
			className: "blk-table",
			children: [e.title && /* @__PURE__ */ (0, k.jsx)("h4", { children: e.title }), /* @__PURE__ */ (0, k.jsx)("div", {
				className: "blk-scroll",
				children: /* @__PURE__ */ (0, k.jsxs)("table", { children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsx)("tr", { children: e.columns.map((e) => /* @__PURE__ */ (0, k.jsx)("th", {
					className: e.align === "right" ? "num" : "",
					children: e.label
				}, e.key)) }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: e.rows.map((t, n) => /* @__PURE__ */ (0, k.jsx)("tr", {
					className: ve(e.highlight, t) ? "hl" : "",
					children: e.columns.map((e) => /* @__PURE__ */ (0, k.jsx)("td", {
						className: e.align === "right" ? "num" : "",
						children: _e(e, t)
					}, e.key))
				}, n)) })] })
			})]
		}, t) : e.type === "list" ? /* @__PURE__ */ (0, k.jsxs)("section", {
			className: "blk-list",
			children: [e.title && /* @__PURE__ */ (0, k.jsx)("h4", { children: e.title }), /* @__PURE__ */ (0, k.jsx)("ul", { children: e.items.map((e, t) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, t)) })]
		}, t) : e.type === "note" ? /* @__PURE__ */ (0, k.jsx)("p", {
			className: `blk-note ${e.tone || ""}`,
			children: e.text
		}, t) : null)
	});
}
// src/PeriodUi.jsx
function N({ period: e, periods: t, onPeriod: n, label: r = "Period", id: i }) {
	let a = t?.length ? t : [e], o = a.includes(e) ? a : [e, ...a];
	return /* @__PURE__ */ (0, k.jsxs)("label", {
		className: "period-select",
		children: [/* @__PURE__ */ (0, k.jsx)("span", { children: r }), /* @__PURE__ */ (0, k.jsx)("select", {
			id: i,
			value: e,
			onChange: (e) => n(e.target.value),
			"aria-label": r,
			children: o.map((e) => /* @__PURE__ */ (0, k.jsxs)("option", {
				value: e,
				children: [
					w(e),
					" · ",
					T(e),
					a.includes(e) ? "" : " · no data"
				]
			}, e))
		})]
	});
}
function ye({ text: e, period: t, periods: n }) {
	let r = E(e), i = D(e), a = r || t;
	return i ? /* @__PURE__ */ (0, k.jsxs)("span", {
		className: "period-effective bad",
		role: "status",
		children: ["NO DATA AVAILABLE FOR ", i.toUpperCase()]
	}) : n?.length && !n.includes(a) ? /* @__PURE__ */ (0, k.jsxs)("span", {
		className: "period-effective bad",
		role: "status",
		children: ["NO DATA AVAILABLE FOR ", C(a).toUpperCase()]
	}) : /* @__PURE__ */ (0, k.jsxs)("span", {
		className: "period-effective",
		role: "status",
		children: [
			"Effective period: ",
			/* @__PURE__ */ (0, k.jsx)("b", { children: C(a) }),
			/* @__PURE__ */ (0, k.jsx)("em", { children: r ? r === t ? "selector and request agree" : "taken from your request" : "taken from the selector" })
		]
	});
}
function be(e, t) {
	let n = ie(), [r, i] = (0, _.useState)(null);
	return (0, _.useEffect)(() => {
		i(null);
	}, [e, t]), [r ?? n.ask(t, e), i];
}
function P({ text: e }) {
	let t = ie(), n = t.route(e);
	return /* @__PURE__ */ (0, k.jsxs)("span", {
		className: `route-chip ${n}`,
		"data-testid": "route-chip",
		"data-domain": n,
		children: ["Routed to ", /* @__PURE__ */ (0, k.jsx)("b", { children: t.label(n) })]
	});
}
function xe({ provenance: e, compact: t }) {
	let n = e || {
		data_source: "SYNTHETIC / DEMONSTRATION",
		sap_access: "NOT CONNECTED / NOT VERIFIED",
		execution_mode: "READ-ONLY PROPOSED WORKFLOW"
	};
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: `provenance ${t ? "compact" : ""}`,
		role: "group",
		"aria-label": "Data source and SAP access",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("span", { children: [/* @__PURE__ */ (0, k.jsx)("i", { children: "DATA SOURCE" }), /* @__PURE__ */ (0, k.jsx)("b", { children: n.data_source })] }),
			/* @__PURE__ */ (0, k.jsxs)("span", { children: [/* @__PURE__ */ (0, k.jsx)("i", { children: "SAP ACCESS" }), /* @__PURE__ */ (0, k.jsx)("b", { children: n.sap_access })] }),
			/* @__PURE__ */ (0, k.jsxs)("span", { children: [/* @__PURE__ */ (0, k.jsx)("i", { children: "EXECUTION MODE" }), /* @__PURE__ */ (0, k.jsx)("b", { children: n.execution_mode })] })
		]
	});
}
// src/GenericModuleView.jsx
function Se({ module: e, period: t, view: n, state: r, onAsk: i }) {
	if (r === "none") return /* @__PURE__ */ (0, k.jsx)("main", {
		className: "module-page",
		children: /* @__PURE__ */ (0, k.jsxs)("div", {
			className: "period-nodata",
			role: "alert",
			"data-testid": "module-nodata",
			children: ["NO DATA AVAILABLE FOR ", C(t).toUpperCase()]
		})
	});
	if (!n) return /* @__PURE__ */ (0, k.jsx)("main", {
		className: "module-page",
		children: /* @__PURE__ */ (0, k.jsx)("div", {
			className: "empty-state",
			role: "status",
			children: /* @__PURE__ */ (0, k.jsxs)("strong", { children: [
				"Loading ",
				C(t),
				"…"
			] })
		})
	});
	let a = n.ui || {
		title: e.name,
		blocks: []
	};
	return /* @__PURE__ */ (0, k.jsxs)("main", {
		className: "module-page",
		"aria-label": e.name,
		"data-testid": "module-page",
		"data-module": e.id,
		"data-period": n.period,
		children: [/* @__PURE__ */ (0, k.jsxs)("section", {
			className: "surface module-head",
			children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [
				/* @__PURE__ */ (0, k.jsx)("span", {
					className: "eyebrow",
					children: e.name.toUpperCase()
				}),
				/* @__PURE__ */ (0, k.jsx)("h2", { children: a.title }),
				/* @__PURE__ */ (0, k.jsxs)("p", { children: [
					a.subtitle,
					" · ",
					C(t),
					" · ",
					T(t)
				] })
			] }), /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "tr-head-actions",
				children: [/* @__PURE__ */ (0, k.jsx)(xe, {
					provenance: n.provenance,
					compact: !0
				}), e.examples?.length > 0 && /* @__PURE__ */ (0, k.jsx)("div", {
					className: "tr-buttons",
					children: /* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						className: "primary",
						onClick: () => i(e.ask_template.replace("{period}", C(t))),
						children: "Ask this agent"
					})
				})]
			})]
		}), /* @__PURE__ */ (0, k.jsx)("section", {
			className: "surface module-body",
			children: /* @__PURE__ */ (0, k.jsx)(M, { blocks: a.blocks })
		})]
	});
}
// src/TreasuryCockpit.jsx
var F = (e) => Number(e || 0).toLocaleString("en-US"), Ce = (e) => `${Number(e) > 0 ? "+" : Number(e) < 0 ? "−" : ""}${F(Math.abs(Number(e || 0)))}`, we = {
	DEFICIT: "Deficit",
	IDLE_CASH: "Idle cash",
	WITHIN_POLICY: "Within policy"
}, Te = {
	DEFICIT: "bad",
	IDLE_CASH: "warn",
	WITHIN_POLICY: "ok"
}, Ee = ({ status: e }) => /* @__PURE__ */ (0, k.jsx)("span", {
	className: `tr-chip ${Te[e] || ""}`,
	children: we[e] || e
});
function De({ series: e, minimum: t, label: n }) {
	if (!e?.length) return null;
	let r = e.map((e) => e.balance), i = Math.min(...r, t ?? Infinity) * .98, a = Math.max(...r) * 1.02, o = (t) => 6 + 308 * (t / Math.max(1, e.length - 1)), s = (e) => 6 + 84 * (1 - (e - i) / Math.max(1, a - i)), c = e.map((e, t) => `${t ? "L" : "M"}${o(t).toFixed(1)},${s(e.balance).toFixed(1)}`).join(" ");
	return /* @__PURE__ */ (0, k.jsxs)("svg", {
		className: "tr-spark",
		viewBox: "0 0 320 96",
		role: "img",
		"aria-label": n,
		children: [
			t ? /* @__PURE__ */ (0, k.jsx)("line", {
				x1: 6,
				x2: 314,
				y1: s(t),
				y2: s(t),
				stroke: "#BB0000",
				strokeDasharray: "4 3",
				strokeWidth: "1"
			}) : null,
			/* @__PURE__ */ (0, k.jsx)("path", {
				d: `${c} L${o(e.length - 1)},90 L${o(0)},90 Z`,
				fill: "#0a6ed122"
			}),
			/* @__PURE__ */ (0, k.jsx)("path", {
				d: c,
				fill: "none",
				stroke: "#0a6ed1",
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, k.jsx)("text", {
				x: 6,
				y: 95,
				fontSize: "9",
				fill: "#587184",
				children: e[0].date.slice(5)
			}),
			/* @__PURE__ */ (0, k.jsx)("text", {
				x: 314,
				y: 95,
				fontSize: "9",
				fill: "#587184",
				textAnchor: "end",
				children: e[e.length - 1].date.slice(5)
			})
		]
	});
}
function Oe({ period: e, data: t, state: n, role: r, onRole: i, onOpenDetail: a, onDecision: o, onAsk: s }) {
	if (n === "none") return /* @__PURE__ */ (0, k.jsx)("main", {
		className: "treasury-page",
		children: /* @__PURE__ */ (0, k.jsxs)("div", {
			className: "period-nodata",
			role: "alert",
			"data-testid": "treasury-nodata",
			children: ["NO DATA AVAILABLE FOR ", C(e).toUpperCase()]
		})
	});
	if (!t) return /* @__PURE__ */ (0, k.jsx)("main", {
		className: "treasury-page",
		children: /* @__PURE__ */ (0, k.jsx)("div", {
			className: "empty-state",
			role: "status",
			children: /* @__PURE__ */ (0, k.jsxs)("strong", { children: [
				"Loading ",
				C(e),
				"…"
			] })
		})
	});
	let c = t.position, l = c.totals, u = t.forecast[30], d = t.recommendations, f = c.policy_checks.filter((e) => e.status === "BREACH"), p = Object.fromEntries((t.proposals || []).map((e) => [e.proposal_id, e])), m = u.by_currency.reduce((e, t) => e + Math.round(t.minimum_required * (c.fx[t.ccy] || 1)), 0), h = u.by_currency.filter((e) => e.first_shortfall);
	return /* @__PURE__ */ (0, k.jsxs)("main", {
		className: "treasury-page",
		"aria-label": "Cash and treasury",
		"data-testid": "treasury-page",
		"data-period": c.period,
		children: [
			/* @__PURE__ */ (0, k.jsxs)("section", {
				className: "surface tr-head",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [
					/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: "FINANCE / CASH & TREASURY"
					}),
					/* @__PURE__ */ (0, k.jsx)("h2", { children: "Cash & treasury" }),
					/* @__PURE__ */ (0, k.jsxs)("p", {
						className: "tr-sub",
						children: [
							"Daily cash positioning as of ",
							/* @__PURE__ */ (0, k.jsx)("b", { children: c.as_of }),
							" · ",
							C(e),
							" · ",
							T(e),
							" · display currency ",
							c.display_currency,
							", rate type ",
							c.exchange_rate_type
						]
					})
				] }), /* @__PURE__ */ (0, k.jsxs)("div", {
					className: "tr-head-actions",
					children: [/* @__PURE__ */ (0, k.jsx)(xe, {
						provenance: c.provenance,
						compact: !0
					}), /* @__PURE__ */ (0, k.jsxs)("div", {
						className: "tr-buttons",
						children: [/* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							className: "primary",
							onClick: () => a("position"),
							children: "Open detailed cash & treasury view →"
						}), /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							onClick: () => s("Propose transfers to cover shortfalls"),
							children: "Ask the treasury agents"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, k.jsxs)("section", {
				className: "tr-kpis",
				"aria-label": "Key figures",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", {
						"data-testid": "kpi-cash",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "Group cash (USD equivalent)" }),
							/* @__PURE__ */ (0, k.jsx)("strong", { children: F(l.usd_opening) }),
							/* @__PURE__ */ (0, k.jsxs)("small", { children: [
								l.accounts,
								" accounts · ",
								Object.keys(l.by_currency).join(" · ")
							] })
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: l.deficit ? "attn" : "",
						"data-testid": "kpi-deficit",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "Deficit accounts" }),
							/* @__PURE__ */ (0, k.jsx)("strong", { children: l.deficit }),
							/* @__PURE__ */ (0, k.jsx)("small", { children: "expected close below minimum" })
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: l.idle ? "warn" : "",
						"data-testid": "kpi-idle",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "Idle-cash accounts" }),
							/* @__PURE__ */ (0, k.jsx)("strong", { children: l.idle }),
							/* @__PURE__ */ (0, k.jsx)("small", { children: "above 1.5 × target" })
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: f.length ? "attn" : "",
						"data-testid": "kpi-policy",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "Policy rules breached" }),
							/* @__PURE__ */ (0, k.jsxs)("strong", { children: [
								f.length,
								" of ",
								c.policy_checks.length
							] }),
							/* @__PURE__ */ (0, k.jsx)("small", { children: f.map((e) => e.rule).join(" · ") || "none" })
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: c.statements.ready ? "" : "warn",
						"data-testid": "kpi-statements",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "Bank statements" }),
							/* @__PURE__ */ (0, k.jsxs)("strong", { children: [
								c.statements.complete,
								" of ",
								c.statements.expected
							] }),
							/* @__PURE__ */ (0, k.jsxs)("small", { children: [c.statements.opening_mismatches.length, " opening-balance mismatch(es)"] })
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: u.shortfall ? "warn" : "",
						"data-testid": "kpi-forecast",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "30-day forecast" }),
							/* @__PURE__ */ (0, k.jsx)("strong", { children: h.length ? "Shortfall" : "No shortfall" }),
							/* @__PURE__ */ (0, k.jsx)("small", { children: h.length ? h.map((e) => `${e.ccy} ${e.first_shortfall.date.slice(5)}`).join(" · ") : "all currencies above minimum" })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "tr-grid",
				children: [/* @__PURE__ */ (0, k.jsxs)("section", {
					className: "surface tr-card",
					"aria-label": "Bank accounts",
					children: [/* @__PURE__ */ (0, k.jsx)("h3", { children: "Bank accounts · opening balance and expected close" }), /* @__PURE__ */ (0, k.jsx)("div", {
						className: "tr-scroll",
						children: /* @__PURE__ */ (0, k.jsxs)("table", {
							className: "tr-table",
							"data-testid": "treasury-accounts",
							children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, k.jsx)("th", { children: "Account" }),
								/* @__PURE__ */ (0, k.jsx)("th", { children: "Bank" }),
								/* @__PURE__ */ (0, k.jsx)("th", { children: "Ccy" }),
								/* @__PURE__ */ (0, k.jsx)("th", {
									className: "num",
									children: "Opening"
								}),
								/* @__PURE__ */ (0, k.jsx)("th", {
									className: "num",
									children: "Expected close"
								}),
								/* @__PURE__ */ (0, k.jsx)("th", {
									className: "num",
									children: "Minimum"
								}),
								/* @__PURE__ */ (0, k.jsx)("th", { children: "Status" }),
								/* @__PURE__ */ (0, k.jsx)("th", { children: "Statement" })
							] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: c.accounts.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", {
								className: e.status === "DEFICIT" ? "hl" : "",
								children: [
									/* @__PURE__ */ (0, k.jsxs)("td", { children: [
										/* @__PURE__ */ (0, k.jsx)("b", { children: e.id }),
										" ",
										/* @__PURE__ */ (0, k.jsx)("small", { children: e.kind })
									] }),
									/* @__PURE__ */ (0, k.jsx)("td", { children: e.bank_name }),
									/* @__PURE__ */ (0, k.jsx)("td", { children: e.ccy }),
									/* @__PURE__ */ (0, k.jsx)("td", {
										className: "num",
										children: F(e.opening)
									}),
									/* @__PURE__ */ (0, k.jsx)("td", {
										className: "num",
										children: F(e.expected_closing)
									}),
									/* @__PURE__ */ (0, k.jsx)("td", {
										className: "num",
										children: F(e.min)
									}),
									/* @__PURE__ */ (0, k.jsx)("td", { children: /* @__PURE__ */ (0, k.jsx)(Ee, { status: e.status }) }),
									/* @__PURE__ */ (0, k.jsx)("td", { children: e.statement.complete && e.statement.opening_check === "OK" ? /* @__PURE__ */ (0, k.jsx)("span", {
										className: "tr-ok",
										children: "OK"
									}) : /* @__PURE__ */ (0, k.jsx)("span", {
										className: "tr-flag",
										title: `${e.statement.complete ? "" : `Statement ${e.statement.gap_days} business days old. `}${e.statement.opening_check === "OK" ? "" : `Opening differs from prior closing by ${Ce(e.statement.opening_difference)}`}`,
										children: e.statement.complete ? "Opening mismatch" : "Missing"
									}) })
								]
							}, e.id)) })]
						})
					})]
				}), /* @__PURE__ */ (0, k.jsxs)("div", {
					className: "tr-side",
					children: [
						/* @__PURE__ */ (0, k.jsxs)("section", {
							className: "surface tr-card",
							"aria-label": "Liquidity forecast",
							children: [
								/* @__PURE__ */ (0, k.jsx)("h3", { children: "30-day liquidity (USD equivalent)" }),
								/* @__PURE__ */ (0, k.jsx)(De, {
									series: u.usd_series,
									minimum: m,
									label: "Projected group cash for the next 30 days"
								}),
								/* @__PURE__ */ (0, k.jsxs)("p", {
									className: "tr-note",
									children: [h.length ? `First shortfall: ${h.map((e) => `${e.ccy} on ${e.first_shortfall.date}`).join("; ")}. ` : "No currency falls below the sum of its account minimums. ", "Dashed line is the minimum."]
								})
							]
						}),
						/* @__PURE__ */ (0, k.jsxs)("section", {
							className: "surface tr-card",
							"aria-label": "Transfer recommendations",
							children: [
								/* @__PURE__ */ (0, k.jsx)("h3", { children: "Transfer recommendations" }),
								d.recommendations.length ? /* @__PURE__ */ (0, k.jsx)("ul", {
									className: "tr-recs",
									"data-testid": "treasury-recs",
									children: d.recommendations.map((e) => {
										let t = p[e.proposal_id];
										return /* @__PURE__ */ (0, k.jsxs)("li", { children: [
											/* @__PURE__ */ (0, k.jsxs)("div", { children: [
												/* @__PURE__ */ (0, k.jsxs)("b", { children: [
													F(e.amount),
													" ",
													e.ccy
												] }),
												" ",
												e.from_account,
												" → ",
												e.to_account,
												" ",
												/* @__PURE__ */ (0, k.jsxs)("small", { children: [
													"(",
													e.template,
													" · ",
													e.template_name,
													")"
												] })
											] }),
											/* @__PURE__ */ (0, k.jsx)("small", { children: e.reason }),
											e.caveat && /* @__PURE__ */ (0, k.jsx)("small", {
												className: "tr-caveat",
												children: e.caveat
											}),
											/* @__PURE__ */ (0, k.jsx)("div", {
												className: "tr-rec-actions",
												children: t ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("span", {
													className: `tr-chip ${t.status === "approved_marker" ? "ok" : t.status === "rejected" ? "bad" : "warn"}`,
													children: t.status.replace("_", " ")
												}), t.status === "awaiting_approval" && /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("button", {
													type: "button",
													disabled: r !== "approver",
													onClick: () => o(t, !0),
													children: "Approve (marker)"
												}), /* @__PURE__ */ (0, k.jsx)("button", {
													type: "button",
													disabled: r !== "approver",
													onClick: () => o(t, !1),
													children: "Reject"
												})] })] }) : /* @__PURE__ */ (0, k.jsx)("button", {
													type: "button",
													onClick: () => s("Propose transfers to cover shortfalls"),
													children: "Ask the agents to draft it"
												})
											})
										] }, e.proposal_id);
									})
								}) : /* @__PURE__ */ (0, k.jsx)("p", {
									className: "tr-note",
									children: "No deficit that a transfer template can fund."
								}),
								d.unfunded.length > 0 && /* @__PURE__ */ (0, k.jsxs)("p", {
									className: "tr-caveat",
									"data-testid": "treasury-unfunded",
									children: [
										"Not covered by any template: ",
										d.unfunded.map((e) => `${e.account} (${F(e.remaining)} ${e.ccy})`).join(", "),
										". A person must decide."
									]
								}),
								/* @__PURE__ */ (0, k.jsxs)("label", {
									className: "tr-role",
									children: ["Demo role ", /* @__PURE__ */ (0, k.jsxs)("select", {
										value: r,
										onChange: (e) => i(e.target.value),
										children: [/* @__PURE__ */ (0, k.jsx)("option", {
											value: "maker",
											children: "Finance maker"
										}), /* @__PURE__ */ (0, k.jsx)("option", {
											value: "approver",
											children: "Finance approver"
										})]
									})]
								}),
								/* @__PURE__ */ (0, k.jsx)("p", {
									className: "tr-note",
									children: "Approval records a local synthetic marker only. No bank transfer is initiated and SAP is not changed."
								})
							]
						}),
						/* @__PURE__ */ (0, k.jsxs)("section", {
							className: "surface tr-card",
							"aria-label": "Bank concentration",
							children: [/* @__PURE__ */ (0, k.jsxs)("h3", { children: [
								"Bank concentration · limit ",
								c.policy.concentration_limit_pct,
								"%"
							] }), /* @__PURE__ */ (0, k.jsx)("ul", {
								className: "tr-bars",
								children: c.banks.map((e) => /* @__PURE__ */ (0, k.jsxs)("li", {
									className: e.share_pct > c.policy.concentration_limit_pct ? "over" : "",
									children: [
										/* @__PURE__ */ (0, k.jsx)("span", { children: e.name }),
										/* @__PURE__ */ (0, k.jsx)("i", { style: { width: `${Math.min(100, e.share_pct)}%` } }),
										/* @__PURE__ */ (0, k.jsxs)("b", { children: [e.share_pct, "%"] })
									]
								}, e.bank))
							})]
						})
					]
				})]
			})
		]
	});
}
// src/TreasuryDetail.jsx
var ke = [
	["position", "Position"],
	["forecast", "Forecast"],
	["banks", "Bank relationships"],
	["policy", "Policy & statements"],
	["proposals", "Transfer proposals"],
	["sap", "SAP guidance & sources"]
], Ae = [
	["Cash Position (F1737)", "Daily positions by account. Display currency and exchange rate type are mandatory fields in SAP."],
	["Liquidity Forecast Details (F0741)", "Forecast flows by liquidity item."],
	["Cash Flow Analyzer", "Combines cash position details, liquidity forecast detail and actual cash flow."],
	["Bank transfer templates and Make Bank Transfers", "Where a person with authorization creates the transfer from an approved proposal."],
	["Manage Bank Accounts", "Bank account master data."]
];
function je({ data: e }) {
	let t = e.position;
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane",
		children: [/* @__PURE__ */ (0, k.jsxs)("table", {
			className: "rr-table",
			"data-testid": "detail-accounts",
			children: [
				/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Account" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Entity" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Bank" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Ccy" }),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Opening"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "+ Receipts"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "− Payments"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Expected close"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Minimum"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Target"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Status" }),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "USD equiv. close"
					})
				] }) }),
				/* @__PURE__ */ (0, k.jsx)("tbody", { children: t.accounts.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", {
					className: e.status === "DEFICIT" ? "hl" : "",
					children: [
						/* @__PURE__ */ (0, k.jsxs)("td", { children: [
							e.id,
							" ",
							/* @__PURE__ */ (0, k.jsx)("small", { children: e.kind })
						] }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.entity }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.bank_name }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.ccy }),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.opening)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.receipts)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.payments)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.expected_closing)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.min)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.target)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", { children: /* @__PURE__ */ (0, k.jsx)(Ee, { status: e.status }) }),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.usd_closing)
						})
					]
				}, e.id)) }),
				/* @__PURE__ */ (0, k.jsx)("tfoot", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [/* @__PURE__ */ (0, k.jsx)("th", {
					colSpan: "11",
					children: "Group total, USD equivalent"
				}), /* @__PURE__ */ (0, k.jsx)("td", {
					className: "num",
					children: F(t.totals.usd_closing)
				})] }) })
			]
		}), /* @__PURE__ */ (0, k.jsxs)("p", {
			className: "rr-note",
			children: [
				"Expected close = opening + expected receipts − expected payments for the as-of business day. Deficit = expected close below the minimum. Idle cash = opening above 1.5 × target. Rates are synthetic (",
				Object.entries(t.fx).map(([e, t]) => `${e} ${t}`).join(", "),
				")."
			]
		})]
	});
}
function Me({ data: e }) {
	let [t, n] = (0, _.useState)("30"), r = e.forecast[t];
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane",
		"data-testid": "detail-forecast",
		children: [
			/* @__PURE__ */ (0, k.jsx)("div", {
				className: "tr-horizon",
				role: "group",
				"aria-label": "Forecast horizon",
				children: [
					"7",
					"30",
					"90"
				].map((e) => /* @__PURE__ */ (0, k.jsxs)("button", {
					type: "button",
					className: t === e ? "active" : "",
					"aria-pressed": t === e,
					onClick: () => n(e),
					children: [e, " days"]
				}, e))
			}),
			/* @__PURE__ */ (0, k.jsxs)("table", {
				className: "rr-table",
				children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Currency" }),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Opening"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Projected close"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Net"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Sum of minimums"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Lowest"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "First shortfall" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "If paid on due date" })
				] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: r.by_currency.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", {
					className: e.first_shortfall ? "hl" : "",
					children: [
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.ccy }),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.opening)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.closing)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: Ce(e.net)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.minimum_required)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.lowest)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.first_shortfall ? e.first_shortfall.date : "none" }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.first_shortfall_if_paid_on_due_date ? e.first_shortfall_if_paid_on_due_date.date : "none" })
					]
				}, e.ccy)) })]
			}),
			/* @__PURE__ */ (0, k.jsx)(De, {
				series: r.usd_series,
				label: `Projected group cash, ${t} days`
			}),
			/* @__PURE__ */ (0, k.jsx)("h3", { children: "Flows by flow type and liquidity item" }),
			/* @__PURE__ */ (0, k.jsxs)("table", {
				className: "rr-table",
				children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Flow type" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Liquidity item" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Planning level" }),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "USD equivalent"
					})
				] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: r.by_flow_type.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.name }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.liquidity_item }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.planning_level }),
					/* @__PURE__ */ (0, k.jsx)("td", {
						className: "num",
						children: Ce(e.usd)
					})
				] }, e.flow_type)) })]
			}),
			/* @__PURE__ */ (0, k.jsxs)("p", {
				className: "rr-note",
				children: [
					"Receipts are moved by observed payment behaviour (",
					r.payment_behaviour.map((e) => `${e.segment} ${e.days_late} days late`).join(", "),
					"). ",
					r.basis
				]
			})
		]
	});
}
function Ne({ data: e }) {
	let t = e.banks;
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane",
		children: [/* @__PURE__ */ (0, k.jsxs)("table", {
			className: "rr-table",
			"data-testid": "detail-banks",
			children: [
				/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Bank" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Accounts" }),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Balance (USD)"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Share"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Average balance"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Payments"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Volume (USD)"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Credit line"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Drawn"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Borrowings"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Investments"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Fees (USD)"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Fee per payment"
					})
				] }) }),
				/* @__PURE__ */ (0, k.jsx)("tbody", { children: t.banks.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", {
					className: e.share_pct > t.concentration_limit_pct ? "hl" : "",
					children: [
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.name }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.accounts.join(", ") }),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.usd_balance)
						}),
						/* @__PURE__ */ (0, k.jsxs)("td", {
							className: "num",
							children: [e.share_pct, "%"]
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.avg_balance_usd)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.payment_count)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.payment_volume_usd)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.credit_line_limit)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.credit_line_drawn)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.borrowings)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.investments)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: F(e.fees_total_usd)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: e.fee_per_payment_usd.toFixed(2)
						})
					]
				}, e.bank)) }),
				/* @__PURE__ */ (0, k.jsx)("tfoot", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", {
						colSpan: "7",
						children: "Total"
					}),
					/* @__PURE__ */ (0, k.jsx)("td", {
						className: "num",
						children: F(t.totals.credit_limit)
					}),
					/* @__PURE__ */ (0, k.jsx)("td", {
						className: "num",
						children: F(t.totals.credit_drawn)
					}),
					/* @__PURE__ */ (0, k.jsx)("td", {
						className: "num",
						children: F(t.totals.borrowings)
					}),
					/* @__PURE__ */ (0, k.jsx)("td", {
						className: "num",
						children: F(t.totals.investments)
					}),
					/* @__PURE__ */ (0, k.jsx)("td", {
						className: "num",
						children: F(t.totals.fees_usd)
					}),
					/* @__PURE__ */ (0, k.jsx)("td", {})
				] }) })
			]
		}), /* @__PURE__ */ (0, k.jsxs)("p", {
			className: "rr-note",
			children: [t.over_concentration_limit.length ? `Over the ${t.concentration_limit_pct}% concentration limit: ${t.over_concentration_limit.join(", ")}. ` : `No bank is over the ${t.concentration_limit_pct}% limit. `, "Credit lines, borrowings, investments, volumes and fees are synthetic."]
		})]
	});
}
function I({ data: e }) {
	let t = e.position, n = t.statements;
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("table", {
				className: "rr-table",
				"data-testid": "detail-policy",
				children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Rule" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Policy" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Result" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Detail" })
				] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: t.policy_checks.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", {
					className: e.status === "BREACH" ? "hl" : "",
					children: [
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.rule }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.text }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: /* @__PURE__ */ (0, k.jsx)("span", {
							className: `tr-chip ${e.status === "PASS" ? "ok" : "bad"}`,
							children: e.status
						}) }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.detail })
					]
				}, e.rule)) })]
			}),
			/* @__PURE__ */ (0, k.jsx)("h3", { children: "Bank statements" }),
			/* @__PURE__ */ (0, k.jsxs)("p", {
				className: "rr-note",
				children: [
					n.complete,
					" of ",
					n.expected,
					" complete. ",
					n.missing.length ? `Missing: ${n.missing.join(", ")}. ` : "",
					n.opening_mismatches.length ? `Opening balance differs from prior closing: ${n.opening_mismatches.map((e) => `${e.account} (${Ce(e.difference)} ${e.ccy})`).join(", ")}.` : "All opening balances agree with the prior closing."
				]
			})
		]
	});
}
function Pe({ data: e, role: t, onDecision: n, onAsk: r }) {
	let i = Object.fromEntries((e.proposals || []).map((e) => [e.proposal_id, e])), a = e.recommendations;
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane",
		"data-testid": "detail-proposals",
		children: [
			a.recommendations.length ? /* @__PURE__ */ (0, k.jsxs)("table", {
				className: "rr-table",
				children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Proposal" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "From" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "To" }),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Amount"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Template" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Policy rule" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Status" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Decision" })
				] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: a.recommendations.map((e) => {
					let a = i[e.proposal_id];
					return /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.proposal_id }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.from_account }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.to_account }),
						/* @__PURE__ */ (0, k.jsxs)("td", {
							className: "num",
							children: [
								F(e.amount),
								" ",
								e.ccy
							]
						}),
						/* @__PURE__ */ (0, k.jsxs)("td", { children: [
							e.template,
							" · ",
							e.template_name
						] }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.policy_rule }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: a ? a.status.replace("_", " ") : "not yet drafted" }),
						/* @__PURE__ */ (0, k.jsxs)("td", { children: [a ? a.status === "awaiting_approval" ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
							/* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								disabled: t !== "approver",
								onClick: () => n(a, !0),
								children: "Approve (marker)"
							}),
							" ",
							/* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								disabled: t !== "approver",
								onClick: () => n(a, !1),
								children: "Reject"
							})
						] }) : a.note : /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							onClick: () => r("Propose transfers to cover shortfalls"),
							children: "Ask the agents to draft"
						}), e.caveat && /* @__PURE__ */ (0, k.jsxs)("small", {
							className: "tr-caveat",
							children: [" ", e.caveat]
						})] })
					] }, e.proposal_id);
				}) })]
			}) : /* @__PURE__ */ (0, k.jsx)("p", {
				className: "rr-empty",
				children: "No deficit that a transfer template can fund for this period."
			}),
			a.unfunded.length > 0 && /* @__PURE__ */ (0, k.jsxs)("p", {
				className: "tr-caveat",
				children: [
					"Not covered by any template: ",
					a.unfunded.map((e) => `${e.account} (${F(e.remaining)} ${e.ccy})`).join(", "),
					". ",
					a.unfunded[0].reason
				]
			}),
			/* @__PURE__ */ (0, k.jsx)("h3", { children: "Bank transfer templates" }),
			/* @__PURE__ */ (0, k.jsxs)("table", {
				className: "rr-table",
				children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Template" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "From" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "To" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Ccy" }),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Maximum"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Name" })
				] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: e.templates.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.template }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.from }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.to }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.ccy }),
					/* @__PURE__ */ (0, k.jsx)("td", {
						className: "num",
						children: F(e.max_amount)
					}),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.name })
				] }, e.template)) })]
			}),
			/* @__PURE__ */ (0, k.jsx)("p", {
				className: "rr-note",
				children: "SAP describes initiating a bank transfer from an approved proposal. Here an approval records a local marker; nothing is initiated and SAP is not changed."
			})
		]
	});
}
function Fe({ refs: e }) {
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane",
		"data-testid": "detail-sap",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "rr-banner warn",
				children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "Manual in SAP" }), /* @__PURE__ */ (0, k.jsx)("span", { children: "This demo never initiates a bank transfer. A person with authorization does it in SAP from an approved proposal, then the position is refreshed and checked again." })]
			}),
			/* @__PURE__ */ (0, k.jsx)("h3", { children: "Where a person verifies in SAP" }),
			/* @__PURE__ */ (0, k.jsx)("ul", { children: Ae.map(([e, t]) => /* @__PURE__ */ (0, k.jsxs)("li", { children: [
				/* @__PURE__ */ (0, k.jsx)("b", { children: e }),
				": ",
				t
			] }, e)) }),
			/* @__PURE__ */ (0, k.jsx)("p", {
				className: "rr-note",
				children: "App names and IDs come from SAP knowledge base articles and SAP Learning. They are NOT_VERIFIED for your release and roles: confirm each one in the SAP Fiori Apps Reference Library."
			}),
			/* @__PURE__ */ (0, k.jsx)("h3", { children: "What SAP documents, and what this demo imitates" }),
			/* @__PURE__ */ (0, k.jsxs)("table", {
				className: "rr-table",
				children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Source" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Supports" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Status" })
				] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: e.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("td", { children: /* @__PURE__ */ (0, k.jsxs)("a", {
						href: e.url,
						target: "_blank",
						rel: "noreferrer",
						children: [
							e.id,
							" · ",
							e.title,
							" ↗"
						]
					}) }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.supports }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.status })
				] }, e.id)) })]
			})
		]
	});
}
function Ie({ data: e, period: t, periods: n, onPeriod: r, role: i, onDecision: a, onAsk: o, refs: s, initial: c = "position", onClose: l }) {
	let u = (0, _.useRef)(null), [d, f] = (0, _.useState)(c);
	(0, _.useEffect)(() => {
		let e = u.current;
		return e && !e.open && e.showModal(), () => {
			e?.open && e.close();
		};
	}, []);
	let p = e?.position, m = (e) => {
		let t = ke.findIndex(([e]) => e === d);
		e.key === "ArrowRight" && (f(ke[(t + 1) % ke.length][0]), e.preventDefault()), e.key === "ArrowLeft" && (f(ke[(t + ke.length - 1) % ke.length][0]), e.preventDefault());
	}, h = e ? {
		position: /* @__PURE__ */ (0, k.jsx)(je, { data: e }),
		forecast: /* @__PURE__ */ (0, k.jsx)(Me, { data: e }),
		banks: /* @__PURE__ */ (0, k.jsx)(Ne, { data: e }),
		policy: /* @__PURE__ */ (0, k.jsx)(I, { data: e }),
		proposals: /* @__PURE__ */ (0, k.jsx)(Pe, {
			data: e,
			role: i,
			onDecision: a,
			onAsk: o
		}),
		sap: /* @__PURE__ */ (0, k.jsx)(Fe, { refs: s || [] })
	}[d] : null;
	return /* @__PURE__ */ (0, k.jsxs)("dialog", {
		ref: u,
		className: "rr-dialog",
		"aria-labelledby": "tr-title",
		onClose: l,
		children: [/* @__PURE__ */ (0, k.jsxs)("header", {
			className: "rr-header",
			children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [
				/* @__PURE__ */ (0, k.jsxs)("span", {
					className: "eyebrow",
					children: ["SYNTHETIC CASH & TREASURY VIEW · AS OF ", p?.as_of || "…"]
				}),
				/* @__PURE__ */ (0, k.jsx)("h2", {
					id: "tr-title",
					children: e ? `${C(t)} (${T(t)}) · display currency ${p.display_currency}` : `Loading ${C(t)}…`
				}),
				p && /* @__PURE__ */ (0, k.jsx)(xe, {
					provenance: p.provenance,
					compact: !0
				})
			] }), /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "rr-actions",
				children: [r && /* @__PURE__ */ (0, k.jsx)(N, {
					period: t,
					periods: n,
					onPeriod: r,
					id: "tr-period"
				}), /* @__PURE__ */ (0, k.jsx)("button", {
					type: "button",
					onClick: l,
					"aria-label": "Close cash and treasury view",
					children: "×"
				})]
			})]
		}), e ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("div", {
			className: "rr-tabs",
			role: "tablist",
			"aria-label": "Cash and treasury sections",
			onKeyDown: m,
			children: ke.map(([e, t]) => /* @__PURE__ */ (0, k.jsx)("button", {
				type: "button",
				role: "tab",
				"aria-selected": d === e,
				tabIndex: d === e ? 0 : -1,
				className: d === e ? "active" : "",
				onClick: () => f(e),
				children: t
			}, e))
		}), /* @__PURE__ */ (0, k.jsx)("div", {
			className: "rr-body",
			role: "tabpanel",
			children: h
		})] }) : /* @__PURE__ */ (0, k.jsx)("div", {
			className: "rr-body",
			children: /* @__PURE__ */ (0, k.jsx)("p", {
				className: "rr-empty",
				role: "status",
				children: "Loading the synthetic treasury view…"
			})
		})]
	});
}
// src/CloseCockpit.jsx
var Le = (e) => new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0
}).format(Number(e || 0)), Re = (e) => `${Number(e) > 0 ? "+" : Number(e) < 0 ? "−" : ""}${Le(Math.abs(Number(e || 0)))}`;
function ze({ period: e, onPeriod: t, onOpenReport: n, onAsk: r, banner: i, conditions: a = [], onCondition: o, history: s, cases: c = [], currentCase: l, proposal: u, role: d, onRole: f, approve: p, onOpenEvidence: m, summary: h, periodPanel: g, extrasLeft: v, extrasRight: y }) {
	let [b, x] = (0, _.useState)("all"), [S, w] = (0, _.useState)(""), [E, D] = (0, _.useState)(""), O = s?.periods || [], ee = (e) => Object.entries(e.sources || {}).filter(([, e]) => e.freshness !== "current").map(([e]) => e.toUpperCase()), te = O.filter((e) => ee(e).length > 0), ne = O.filter((e) => b === "all" || b === "exception" == ee(e).length > 0);
	h?.summary;
	let re = l?.result;
	return /* @__PURE__ */ (0, k.jsxs)("section", {
		className: "close-screen",
		"aria-label": "Close and reconcile",
		"data-testid": "close-screen",
		children: [/* @__PURE__ */ (0, k.jsxs)("div", {
			className: "surface cl-head",
			children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [
				/* @__PURE__ */ (0, k.jsx)("span", {
					className: "eyebrow",
					children: "FINANCE / PERIOD-END CLOSE"
				}),
				/* @__PURE__ */ (0, k.jsx)("h2", { children: "Close & reconcile" }),
				i || /* @__PURE__ */ (0, k.jsxs)("p", { children: [
					"S/4HANA versus Central Finance for company code 1000, ledger 0L, USD · selected ",
					C(e),
					" · ",
					T(e)
				] })
			] }), /* @__PURE__ */ (0, k.jsx)("div", {
				className: "cl-head-actions",
				children: /* @__PURE__ */ (0, k.jsxs)("div", {
					className: "cl-buttons",
					children: [/* @__PURE__ */ (0, k.jsxs)("button", {
						type: "button",
						className: "primary",
						onClick: r,
						children: ["Ask the agents about ", C(e)]
					}), /* @__PURE__ */ (0, k.jsxs)("button", {
						type: "button",
						className: "rr-row-report",
						onClick: () => n?.(e),
						children: [
							"Detailed report for ",
							e,
							" →"
						]
					})]
				})
			})]
		}), /* @__PURE__ */ (0, k.jsxs)("div", {
			className: "cl-grid",
			children: [/* @__PURE__ */ (0, k.jsxs)("section", {
				className: "surface cl-left",
				"aria-label": "Monthly reconciliation",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "cl-toolbar",
						children: [/* @__PURE__ */ (0, k.jsxs)("h3", { children: [
							"Monthly reconciliation · ",
							O.length,
							" periods · ",
							O.length - te.length,
							" comparable · ",
							/* @__PURE__ */ (0, k.jsxs)("span", {
								className: te.length ? "cl-bad" : "",
								children: [te.length, " exceptions"]
							})
						] }), /* @__PURE__ */ (0, k.jsx)("div", {
							className: "cl-filter",
							role: "group",
							"aria-label": "Status filter",
							children: [
								["all", "All"],
								["ready", "Ready"],
								["exception", "Exception"]
							].map(([e, t]) => /* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								className: b === e ? "active" : "",
								"aria-pressed": b === e,
								onClick: () => x(e),
								children: t
							}, e))
						})]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "cl-cols",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "Period" }),
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: "num",
								children: "S/4HANA"
							}),
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: "num",
								children: "Central Finance"
							}),
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: "num",
								children: "Variance"
							}),
							/* @__PURE__ */ (0, k.jsx)("span", { children: "Status" })
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "worklist",
						children: [ne.map((n) => {
							let r = ee(n), i = n.sources.s4.balance - n.sources.cfin.balance;
							return /* @__PURE__ */ (0, k.jsxs)("button", {
								type: "button",
								className: e === n.period ? "selected" : "",
								"aria-pressed": e === n.period,
								onClick: () => t?.(n.period),
								title: r.length ? `${r.join(", ")} freshness requires review` : void 0,
								children: [
									/* @__PURE__ */ (0, k.jsx)("span", { children: n.period }),
									/* @__PURE__ */ (0, k.jsx)("span", {
										className: "num",
										children: Le(n.sources.s4.balance)
									}),
									/* @__PURE__ */ (0, k.jsx)("span", {
										className: "num",
										children: Le(n.sources.cfin.balance)
									}),
									/* @__PURE__ */ (0, k.jsx)("strong", {
										className: "num",
										children: r.length ? "Source review" : Re(i)
									}),
									/* @__PURE__ */ (0, k.jsx)("em", {
										className: r.length ? "warn" : "ok",
										children: r.length ? "EXCEPTION" : "READY"
									})
								]
							}, n.period);
						}), !ne.length && /* @__PURE__ */ (0, k.jsx)("p", {
							className: "fi-empty-filter",
							children: "No periods match the filter."
						})]
					}),
					a.length > 0 && /* @__PURE__ */ (0, k.jsxs)("div", {
						className: "rr-condition cl-lab",
						role: "group",
						"aria-label": "Simulate a close condition",
						children: [
							/* @__PURE__ */ (0, k.jsx)("div", { children: /* @__PURE__ */ (0, k.jsx)("span", {
								className: "eyebrow",
								children: "SCENARIO LAB · SYNTHETIC"
							}) }),
							/* @__PURE__ */ (0, k.jsxs)("select", {
								value: S,
								onChange: (e) => {
									w(e.target.value), D("");
								},
								"aria-label": "Condition",
								children: [/* @__PURE__ */ (0, k.jsx)("option", {
									value: "",
									children: "Choose a condition…"
								}), a.map((e) => /* @__PURE__ */ (0, k.jsx)("option", {
									value: e.id,
									children: e.label
								}, e.id))]
							}),
							/* @__PURE__ */ (0, k.jsxs)("button", {
								type: "button",
								disabled: !S,
								onClick: () => {
									o?.(e, S), D(S);
								},
								children: ["Apply to ", e]
							}),
							(E || S) && /* @__PURE__ */ (0, k.jsx)("span", {
								className: "rr-condition-note",
								role: "status",
								children: E ? `${a.find((e) => e.id === E)?.what} Run the period again, then open the detailed report.` : a.find((e) => e.id === S)?.what
							})
						]
					}),
					v
				]
			}), /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "cl-right",
				children: [
					g,
					y,
					/* @__PURE__ */ (0, k.jsxs)("details", {
						className: "surface cl-case",
						children: [
							/* @__PURE__ */ (0, k.jsxs)("summary", { children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "Case, evidence and approval" }), /* @__PURE__ */ (0, k.jsxs)("span", { children: [c.length, " case(s) reviewed this session"] })] }),
							re ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
								re.scope?.period === e && re.advisory_explanation && /* @__PURE__ */ (0, k.jsx)("p", {
									className: "micro",
									"data-testid": "case-explanation",
									children: re.advisory_explanation
								}),
								/* @__PURE__ */ (0, k.jsxs)("div", {
									className: "detail-line",
									children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Case" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: l.case_id })]
								}),
								/* @__PURE__ */ (0, k.jsxs)("div", {
									className: "detail-line",
									children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Period / route" }), /* @__PURE__ */ (0, k.jsxs)("strong", { children: [
										re.scope.period,
										" · ",
										l.scenario
									] })]
								}),
								/* @__PURE__ */ (0, k.jsxs)("div", {
									className: "detail-line",
									children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "S/4HANA − Central Finance" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: Le(re.variance.amount) })]
								}),
								/* @__PURE__ */ (0, k.jsxs)("div", {
									className: "detail-line",
									children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Source status" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: re.variance.state })]
								}),
								/* @__PURE__ */ (0, k.jsx)("button", {
									className: "detail-toggle",
									type: "button",
									onClick: m,
									children: "Open account, document and correlation evidence →"
								})
							] }) : /* @__PURE__ */ (0, k.jsx)("p", {
								className: "micro",
								children: "Ask the agents for a reconciliation to attach a case and its source lineage."
							}),
							/* @__PURE__ */ (0, k.jsxs)("div", {
								className: "approval-lane",
								children: [
									/* @__PURE__ */ (0, k.jsx)("span", {
										className: "eyebrow",
										children: "SEPARATE SYNTHETIC APPROVAL LANE"
									}),
									/* @__PURE__ */ (0, k.jsx)("p", { children: u ? `Proposal ${u.proposal_id} · ${u.status} · signed variance marker ${Le(u.amount)}` : "No proposal for this case." }),
									/* @__PURE__ */ (0, k.jsx)("label", {
										htmlFor: "demo-role",
										children: "Demo role"
									}),
									/* @__PURE__ */ (0, k.jsxs)("select", {
										id: "demo-role",
										value: d,
										onChange: (e) => f(e.target.value),
										children: [/* @__PURE__ */ (0, k.jsx)("option", {
											value: "maker",
											children: "Finance maker"
										}), /* @__PURE__ */ (0, k.jsx)("option", {
											value: "approver",
											children: "Finance approver"
										})]
									}),
									/* @__PURE__ */ (0, k.jsx)("button", {
										type: "button",
										disabled: d !== "approver" || u?.status !== "awaiting_approval",
										onClick: p,
										children: "Approve variance marker"
									}),
									/* @__PURE__ */ (0, k.jsx)("small", { children: "Approval records a local synthetic marker only; it does not determine accounts or post to SAP." })
								]
							})
						]
					})
				]
			})]
		})]
	});
}
// src/EvidenceShortcut.jsx
function Be({ investigation: e, onOpen: t }) {
	let n = e?.diagnosis?.classification?.replaceAll("_", " ");
	return /* @__PURE__ */ (0, k.jsxs)("section", {
		className: "surface evidence-shortcut",
		children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [
			/* @__PURE__ */ (0, k.jsx)("span", {
				className: "eyebrow",
				children: "EVIDENCE & CORRELATION"
			}),
			/* @__PURE__ */ (0, k.jsx)("strong", { children: e ? `${n || "Investigation in progress"} · ${e.status.replaceAll("_", " ")}` : "Trace the agent’s proof" }),
			/* @__PURE__ */ (0, k.jsx)("small", { children: e ? `${e.proof?.length || 0} evidence items · ${e.plan?.filter((e) => e.status === "complete").length || 0} plan steps complete` : "Document comparison, decisions, source lineage and component events" })
		] }), /* @__PURE__ */ (0, k.jsx)("button", {
			type: "button",
			className: "text-link",
			onClick: t,
			children: "Open proof & correlation →"
		})]
	});
}
// src/ProofDossier.jsx
var Ve = (e) => e == null ? "—" : new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0
}).format(Number(e));
function He({ investigation: e, currentCase: t, busy: n, onStart: r, onResolve: i, onTrace: a, architect: o = !1 }) {
	let [s, c] = (0, _.useState)("replication_gap"), [l, u] = (0, _.useState)(null), d = t?.status === "complete" && t?.scope?.period === "2026-11" && t?.result?.variance?.state === "comparable" && Number(t?.result?.variance?.amount) !== 0, f = e && (e.case_id === t?.case_id || e.after?.case_id === t?.case_id) ? e : null, p = f?.proof?.find((e) => e.proof_id === l) || f?.proof?.at(-1);
	return /* @__PURE__ */ (0, k.jsxs)("section", {
		className: `surface proof-dossier ${o ? "proof-architect" : ""}`,
		"aria-label": "Dynamic proof dossier",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "section-heading",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
					className: "eyebrow",
					children: "AGENTIC INVESTIGATION · DOCUMENT PROOF"
				}), /* @__PURE__ */ (0, k.jsx)("h2", { children: "Dynamic proof dossier" })] }), /* @__PURE__ */ (0, k.jsx)("span", {
					className: `pill ${f?.status === "held" ? "warn" : f?.status === "resolved" ? "ok" : "quiet"}`,
					children: f?.status?.replaceAll("_", " ") || "Ready for a case"
				})]
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "proof-intro",
				children: [/* @__PURE__ */ (0, k.jsx)("p", { children: "Trace the agent’s plan, each tool observation, its rule, and the before/after result. All evidence is synthetic and scoped to November 2026." }), /* @__PURE__ */ (0, k.jsxs)("div", {
					className: "proof-actions",
					children: [
						/* @__PURE__ */ (0, k.jsxs)("label", { children: ["Fault profile", /* @__PURE__ */ (0, k.jsxs)("select", {
							value: s,
							onChange: (e) => c(e.target.value),
							disabled: n,
							children: [/* @__PURE__ */ (0, k.jsx)("option", {
								value: "replication_gap",
								children: "Missing replication"
							}), /* @__PURE__ */ (0, k.jsx)("option", {
								value: "mapping_conflict",
								children: "Mapping conflict"
							})]
						})] }),
						/* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							className: "primary",
							disabled: !d || n || f?.status === "running" || f?.status === "reconciling",
							onClick: () => r(s),
							children: n ? "Working…" : "Investigate variance"
						}),
						f && /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							onClick: () => a(f.case_id),
							children: "Inspect investigation trace"
						})
					]
				})]
			}),
			f ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
				/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "proof-summary",
					children: [
						/* @__PURE__ */ (0, k.jsxs)("div", { children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "Before" }),
							/* @__PURE__ */ (0, k.jsx)("strong", { children: Ve(f.before?.variance?.amount) }),
							/* @__PURE__ */ (0, k.jsx)("small", { children: f.before?.case_id })
						] }),
						/* @__PURE__ */ (0, k.jsx)("div", {
							className: "proof-arrow",
							children: "→"
						}),
						/* @__PURE__ */ (0, k.jsxs)("div", { children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "After" }),
							/* @__PURE__ */ (0, k.jsx)("strong", { children: f.after ? Ve(f.after.variance?.amount) : "Awaiting action" }),
							/* @__PURE__ */ (0, k.jsx)("small", { children: f.after?.case_id || f.diagnosis?.classification?.replaceAll("_", " ") || "Plan in progress" })
						] })
					]
				}),
				/* @__PURE__ */ (0, k.jsx)("div", {
					className: "proof-plan",
					children: f.plan.map((e, t) => /* @__PURE__ */ (0, k.jsxs)("div", {
						className: `proof-step proof-step-${e.status}`,
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: "proof-step-no",
								children: String(t + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: e.label }), /* @__PURE__ */ (0, k.jsxs)("small", { children: [
								e.component_id.replaceAll("_", " "),
								" · ",
								e.status
							] })] }),
							/* @__PURE__ */ (0, k.jsxs)("span", { children: [e.proof_ids.length, " proof"] })
						]
					}, e.step_id))
				}),
				/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "proof-decision",
					children: [
						/* @__PURE__ */ (0, k.jsx)("span", {
							className: "eyebrow",
							children: "AGENT DECISION"
						}),
						/* @__PURE__ */ (0, k.jsx)("strong", { children: f.diagnosis?.classification?.replaceAll("_", " ") || "Testing hypotheses" }),
						/* @__PURE__ */ (0, k.jsx)("p", { children: f.reason || "Document and source evidence are being checked." }),
						f.status === "action_proposed" && /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							disabled: n,
							onClick: () => i(f.investigation_id),
							children: "Apply simulated reprocess and re-reconcile"
						}),
						f.status === "held" && /* @__PURE__ */ (0, k.jsx)("small", { children: "Held for finance and integration review. No source mutation was made." }),
						f.status === "resolved" && /* @__PURE__ */ (0, k.jsx)("small", { children: "Reprocess and downstream refresh were simulated locally. No SAP document was posted." })
					]
				}),
				/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "proof-evidence",
					children: [
						/* @__PURE__ */ (0, k.jsxs)("div", {
							className: "proof-evidence-head",
							children: [/* @__PURE__ */ (0, k.jsx)("span", {
								className: "eyebrow",
								children: "EVIDENCE LEDGER"
							}), /* @__PURE__ */ (0, k.jsxs)("strong", { children: [f.proof.length, " items"] })]
						}),
						/* @__PURE__ */ (0, k.jsx)("div", {
							className: "proof-evidence-list",
							children: f.proof.map((e) => /* @__PURE__ */ (0, k.jsxs)("button", {
								type: "button",
								className: p?.proof_id === e.proof_id ? "selected" : "",
								onClick: () => u(e.proof_id),
								children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: e.label }), /* @__PURE__ */ (0, k.jsx)("span", { children: e.evidence_id })]
							}, e.proof_id))
						}),
						p && /* @__PURE__ */ (0, k.jsxs)("div", {
							className: "proof-inspector",
							children: [
								/* @__PURE__ */ (0, k.jsx)("strong", { children: p.label }),
								/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Owner" }), /* @__PURE__ */ (0, k.jsx)("b", { children: p.component_id.replaceAll("_", " ") })] }),
								/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Evidence ID" }), /* @__PURE__ */ (0, k.jsx)("b", { children: p.evidence_id })] }),
								/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "SHA-256" }), /* @__PURE__ */ (0, k.jsx)("code", { children: p.sha256 })] }),
								!o && /* @__PURE__ */ (0, k.jsx)("pre", { children: JSON.stringify(p.data, null, 2) }),
								o && /* @__PURE__ */ (0, k.jsx)("p", { children: "Open the business workspace to inspect document values. This architecture view shows neutral evidence references and the decision path." })
							]
						})
					]
				})
			] }) : /* @__PURE__ */ (0, k.jsx)("div", {
				className: "proof-empty",
				children: "Run a comparable November case, then investigate. The missing-document and mapping-conflict profiles show a resolution path and a controlled hold."
			})
		]
	});
}
// src/EvidenceDetails.jsx
var Ue = {
	s4: "S/4HANA",
	cfin: "Central Finance",
	bw: "BW/4HANA",
	databricks: "Databricks"
}, We = (e) => e == null ? "Not comparable" : new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0
}).format(Number(e));
function Ge({ currentCase: e, history: t, historyDetail: n }) {
	let r = e?.result?.variance ? e.result : null;
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "finance-evidence",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("section", {
				className: "surface",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "section-heading",
					children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: "DETERMINISTIC FINANCE OUTPUT"
					}), /* @__PURE__ */ (0, k.jsx)("h2", { children: "Source snapshots and calculation" })] }), r && /* @__PURE__ */ (0, k.jsx)("span", {
						className: "pill quiet",
						children: r.case_id
					})]
				}), r ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "finance-evidence-summary",
						children: [
							/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Variance" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: We(r.variance.amount) })] }),
							/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Comparability" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: r.variance.state })] }),
							/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Period · route" }), /* @__PURE__ */ (0, k.jsxs)("strong", { children: [
								r.scope.period,
								" · ",
								r.scenario
							] })] })
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("p", {
						className: "report-note",
						children: [
							/* @__PURE__ */ (0, k.jsx)("strong", { children: "Calculation:" }),
							" ",
							r.variance.formula,
							". The model explanation is advisory."
						]
					}),
					/* @__PURE__ */ (0, k.jsx)("div", {
						className: "finance-evidence-table",
						children: /* @__PURE__ */ (0, k.jsxs)("table", { children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, k.jsx)("th", { children: "Source" }),
							/* @__PURE__ */ (0, k.jsx)("th", { children: "Balance" }),
							/* @__PURE__ */ (0, k.jsx)("th", { children: "Freshness" }),
							/* @__PURE__ */ (0, k.jsx)("th", { children: "Snapshot UTC" }),
							/* @__PURE__ */ (0, k.jsx)("th", { children: "Evidence ID" })
						] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: Object.values(r.sources || {}).map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, k.jsx)("th", {
								scope: "row",
								children: Ue[e.source] || e.source
							}),
							/* @__PURE__ */ (0, k.jsx)("td", { children: We(e.balance) }),
							/* @__PURE__ */ (0, k.jsx)("td", { children: e.freshness }),
							/* @__PURE__ */ (0, k.jsx)("td", { children: e.timestamp_utc }),
							/* @__PURE__ */ (0, k.jsx)("td", { children: e.evidence_id })
						] }, e.source)) })] })
					}),
					/* @__PURE__ */ (0, k.jsx)("p", {
						className: "report-note",
						children: r.advisory_explanation
					})
				] }) : /* @__PURE__ */ (0, k.jsx)("p", {
					className: "empty-inline",
					children: "Run a synthetic reconciliation to see source balances, timestamps and evidence IDs."
				})]
			}),
			/* @__PURE__ */ (0, k.jsxs)("section", {
				className: "surface",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "section-heading",
					children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: "SQLITE SYNTHETIC HISTORY"
					}), /* @__PURE__ */ (0, k.jsx)("h2", { children: "12-month evidence set" })] }), /* @__PURE__ */ (0, k.jsxs)("span", {
						className: "pill quiet",
						children: [t?.account_count || 6, " G/L accounts"]
					})]
				}), /* @__PURE__ */ (0, k.jsx)("div", {
					className: "evidence-months",
					children: (t?.periods || []).map((e) => /* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: e.period }), /* @__PURE__ */ (0, k.jsx)("span", { children: Object.values(e.sources || {}).some((e) => e.freshness !== "current") ? "Source review" : We(e.sources.s4.balance - e.sources.cfin.balance) })] }, e.period))
				})]
			}),
			n && /* @__PURE__ */ (0, k.jsxs)("section", {
				className: "surface source-evidence",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "section-heading",
						children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
							className: "eyebrow",
							children: "MONTHLY SOURCE LINEAGE"
						}), /* @__PURE__ */ (0, k.jsx)("h2", { children: "Account and journal evidence" })] }), /* @__PURE__ */ (0, k.jsx)("span", {
							className: "pill quiet",
							children: n.period
						})]
					}),
					/* @__PURE__ */ (0, k.jsx)("p", { children: "Illustrative seeded rows; closing balances are aggregate source snapshots." }),
					/* @__PURE__ */ (0, k.jsxs)("details", { children: [/* @__PURE__ */ (0, k.jsxs)("summary", { children: [
						"Open ",
						n.balances.length,
						" G/L account balances"
					] }), /* @__PURE__ */ (0, k.jsx)("div", {
						className: "source-evidence-rows",
						children: n.balances.map((e) => /* @__PURE__ */ (0, k.jsxs)("div", { children: [
							/* @__PURE__ */ (0, k.jsx)("strong", { children: e.account }),
							/* @__PURE__ */ (0, k.jsx)("span", { children: e.source.toUpperCase() }),
							/* @__PURE__ */ (0, k.jsxs)("b", { children: [Number(e.balance).toLocaleString("en-US"), " USD"] }),
							/* @__PURE__ */ (0, k.jsx)("small", { children: e.evidence_id })
						] }, `${e.source}-${e.account}`))
					})] }),
					/* @__PURE__ */ (0, k.jsxs)("details", { children: [/* @__PURE__ */ (0, k.jsxs)("summary", { children: [
						"Open ",
						n.journals.length,
						" journal evidence records"
					] }), /* @__PURE__ */ (0, k.jsx)("div", {
						className: "source-evidence-rows",
						children: n.journals.map((e) => /* @__PURE__ */ (0, k.jsxs)("div", { children: [
							/* @__PURE__ */ (0, k.jsx)("strong", { children: e.journal_id }),
							/* @__PURE__ */ (0, k.jsx)("span", { children: e.account }),
							/* @__PURE__ */ (0, k.jsxs)("b", { children: [Number(e.amount).toLocaleString("en-US"), " USD"] }),
							/* @__PURE__ */ (0, k.jsx)("small", { children: e.description })
						] }, e.journal_id))
					})] })
				]
			})
		]
	});
}
function Ke({ run: e, questions: t = [], requestedSeq: n }) {
	let [r, i] = (0, _.useState)(null);
	(0, _.useEffect)(() => i(n || e?.steps?.[0]?.seq || null), [e?.run_id, n]);
	let a = e?.steps?.find((e) => e.seq === r) || e?.steps?.[0], o = t.find((t) => t.id === e?.question_id);
	function s() {
		if (!e) return;
		let t = document.createElement("a"), n = new Blob([JSON.stringify({
			...e,
			meeting_status: "OPEN — no human decision recorded"
		}, null, 2)], { type: "application/json" });
		t.href = URL.createObjectURL(n), t.download = `${e.run_id}-architecture-decision.json`, t.click(), setTimeout(() => URL.revokeObjectURL(t.href), 1e3);
	}
	return /* @__PURE__ */ (0, k.jsxs)("section", {
		className: "surface question-evidence",
		children: [/* @__PURE__ */ (0, k.jsxs)("div", {
			className: "section-heading",
			children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
				className: "eyebrow",
				children: "ARCHITECTURE DECISION EVIDENCE"
			}), /* @__PURE__ */ (0, k.jsx)("h2", { children: o?.title || "Question handoffs" })] }), e && /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "heading-actions",
				children: [/* @__PURE__ */ (0, k.jsxs)("span", {
					className: "pill quiet",
					children: [
						e.status,
						" · ",
						e.route
					]
				}), /* @__PURE__ */ (0, k.jsx)("button", {
					type: "button",
					className: "export-button",
					onClick: s,
					children: "Download synthetic decision packet"
				})]
			})]
		}), e ? /* @__PURE__ */ (0, k.jsxs)("div", {
			className: "question-evidence-body",
			children: [/* @__PURE__ */ (0, k.jsx)("div", {
				className: "question-evidence-steps",
				children: (e.steps || []).map((e) => /* @__PURE__ */ (0, k.jsxs)("button", {
					type: "button",
					className: a?.seq === e.seq ? "selected" : "",
					onClick: () => i(e.seq),
					children: [
						/* @__PURE__ */ (0, k.jsx)("span", { children: String(e.seq).padStart(2, "0") }),
						/* @__PURE__ */ (0, k.jsx)("strong", { children: e.component }),
						/* @__PURE__ */ (0, k.jsx)("small", { children: e.status })
					]
				}, e.seq))
			}), /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "question-evidence-detail",
				children: [
					a ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("h3", { children: a.component }), /* @__PURE__ */ (0, k.jsxs)("dl", { children: [
						/* @__PURE__ */ (0, k.jsx)("dt", { children: "Received input" }),
						/* @__PURE__ */ (0, k.jsx)("dd", { children: a.input }),
						/* @__PURE__ */ (0, k.jsx)("dt", { children: "Control and owner" }),
						/* @__PURE__ */ (0, k.jsxs)("dd", { children: [
							a.control,
							/* @__PURE__ */ (0, k.jsx)("br", {}),
							a.owner
						] }),
						/* @__PURE__ */ (0, k.jsx)("dt", { children: "Passed output" }),
						/* @__PURE__ */ (0, k.jsx)("dd", { children: a.output }),
						/* @__PURE__ */ (0, k.jsx)("dt", { children: "Identity reference" }),
						/* @__PURE__ */ (0, k.jsx)("dd", { children: a.identity }),
						/* @__PURE__ */ (0, k.jsx)("dt", { children: "Proof still needed" }),
						/* @__PURE__ */ (0, k.jsx)("dd", { children: a.proof_gap }),
						/* @__PURE__ */ (0, k.jsx)("dt", { children: "Synthetic evidence ID" }),
						/* @__PURE__ */ (0, k.jsx)("dd", { children: a.evidence_id })
					] })] }) : /* @__PURE__ */ (0, k.jsx)("p", { children: "Select a handoff." }),
					/* @__PURE__ */ (0, k.jsx)("h3", { children: "Proof gates" }),
					/* @__PURE__ */ (0, k.jsx)("ul", { children: (o?.gates || []).map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) }),
					/* @__PURE__ */ (0, k.jsx)("h3", { children: "Control ownership" }),
					/* @__PURE__ */ (0, k.jsx)("div", {
						className: "question-evidence-matrix",
						children: (e.control_matrix || []).map((e) => /* @__PURE__ */ (0, k.jsxs)("div", { children: [
							/* @__PURE__ */ (0, k.jsx)("strong", { children: e.component }),
							/* @__PURE__ */ (0, k.jsx)("span", { children: e.owner }),
							/* @__PURE__ */ (0, k.jsx)("p", { children: e.responsibility })
						] }, e.component))
					})
				]
			})]
		}) : /* @__PURE__ */ (0, k.jsx)("p", {
			className: "empty-inline",
			children: "Run an architecture question to inspect its input, output, owner and remaining proof."
		})]
	});
}
// src/ImplementationEvidence.jsx
var qe = [
	["External agent contract", "AgentCore Runtime, identity and MCP client are named simulator components. The local Python runtime follows a bounded plan; no external agent is connected."],
	["SAP-owned capability", "The SAP finance tool, Apigee candidate, Integration Suite path and backend roles are simulated boundaries. No SAP tenant call or principal propagation is proved."],
	["Presentation", "The Fiori-inspired interface is built with React and Node.js tooling. Streamlit hosts its compiled assets; Node.js is not an agent in the runtime path."],
	["Execution and proof", "Python evaluates the finance rules and SQLite stores synthetic snapshots, cases and request/response events. The variance amount comes from the deterministic engine."]
];
function Je({ currentCase: e, events: t = [] }) {
	return /* @__PURE__ */ (0, k.jsxs)("section", {
		className: "surface implementation-evidence",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "section-heading",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
					className: "eyebrow",
					children: "IMPLEMENTATION AND VALIDATION BOUNDARY"
				}), /* @__PURE__ */ (0, k.jsx)("h2", { children: "What the external-agent view represents" })] }), /* @__PURE__ */ (0, k.jsx)("span", {
					className: "pill simulated",
					children: "SYNTHETIC"
				})]
			}),
			/* @__PURE__ */ (0, k.jsx)("p", {
				className: "implementation-intro",
				children: "The live diagram presents a proposed external agent calling SAP-owned finance capabilities. The runnable demo uses one local simulator process and does not establish deployed gateway, SAP, or identity integration."
			}),
			/* @__PURE__ */ (0, k.jsx)("div", {
				className: "implementation-grid",
				children: qe.map(([e, t]) => /* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: e }), /* @__PURE__ */ (0, k.jsx)("p", { children: t })] }, e))
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "implementation-state",
				children: [
					/* @__PURE__ */ (0, k.jsx)("strong", { children: "Current trace" }),
					/* @__PURE__ */ (0, k.jsxs)("span", { children: [
						e?.case_id || "No case selected",
						" · ",
						t.length,
						" stored events"
					] }),
					/* @__PURE__ */ (0, k.jsx)("span", { children: "S1/S2 simulated alternatives · S3 proposed combined path remains open" })
				]
			})
		]
	});
}
// src/EvidenceCorrelation.jsx
function Ye({ investigation: e, currentCase: t, history: n, historyDetail: r, events: i, caseEvents: a, decisionRun: o, decisionQuestions: s, componentDetails: c, reviewPanel: l, focus: u, busy: d, onStart: f, onResolve: p, onTrace: m }) {
	let [h, g] = (0, _.useState)(null), [v, y] = (0, _.useState)(""), [b, x] = (0, _.useState)("investigation"), [S, C] = (0, _.useState)("proof");
	(0, _.useEffect)(() => {
		u?.section && C(u.section);
	}, [u?.nonce]);
	let w = (0, _.useRef)(null), T = Math.min(...e?.plan?.map((e) => e.last_event_seq).filter(Boolean) || []), E = Number.isFinite(T) ? T - 2 : 0, D = (0, _.useMemo)(() => i.filter((e) => (b === "full" || e.seq >= E) && `${e.operation} ${e.source_component_id} ${e.target_component_id} ${e.status}`.toLowerCase().includes(v.toLowerCase())), [
		i,
		v,
		b,
		E
	]), O = i.find((e) => e.seq === h) || D.at(-1);
	return (0, _.useEffect)(() => {
		h && w.current?.querySelector(`[data-seq="${h}"]`)?.scrollIntoView({ block: "nearest" });
	}, [h, D]), /* @__PURE__ */ (0, k.jsxs)("main", {
		className: "evidence-workspace",
		"aria-label": "Evidence and correlation",
		children: [/* @__PURE__ */ (0, k.jsx)("nav", {
			className: "evidence-section-nav",
			"aria-label": "Evidence sections",
			children: [
				["proof", "Investigation proof"],
				["finance", "Finance sources"],
				["components", "Component trace"],
				["questions", "Question handoffs"],
				["implementation", "Implementation"]
			].map(([e, t]) => /* @__PURE__ */ (0, k.jsx)("button", {
				type: "button",
				className: S === e ? "active" : "",
				onClick: () => C(e),
				children: t
			}, e))
		}), /* @__PURE__ */ (0, k.jsxs)("div", {
			className: "evidence-stage",
			children: [
				S === "proof" && /* @__PURE__ */ (0, k.jsxs)("div", {
					className: "evidence-layout",
					children: [/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "evidence-detail-column",
						children: [/* @__PURE__ */ (0, k.jsx)(He, {
							investigation: e,
							currentCase: t,
							busy: d,
							onStart: f,
							onResolve: p,
							onTrace: m
						}), r && /* @__PURE__ */ (0, k.jsxs)("section", {
							className: "surface source-evidence",
							children: [
								/* @__PURE__ */ (0, k.jsxs)("div", {
									className: "section-heading",
									children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
										className: "eyebrow",
										children: "MONTHLY SOURCE LINEAGE"
									}), /* @__PURE__ */ (0, k.jsx)("h2", { children: "Account and journal evidence" })] }), /* @__PURE__ */ (0, k.jsx)("span", {
										className: "pill quiet",
										children: r.period
									})]
								}),
								/* @__PURE__ */ (0, k.jsx)("p", { children: "Illustrative seeded rows; closing balances are aggregate source snapshots." }),
								/* @__PURE__ */ (0, k.jsxs)("details", { children: [/* @__PURE__ */ (0, k.jsxs)("summary", { children: [
									"Open ",
									r.balances.length,
									" G/L account balances"
								] }), /* @__PURE__ */ (0, k.jsx)("div", {
									className: "source-evidence-rows",
									children: r.balances.map((e) => /* @__PURE__ */ (0, k.jsxs)("div", { children: [
										/* @__PURE__ */ (0, k.jsx)("strong", { children: e.account }),
										/* @__PURE__ */ (0, k.jsx)("span", { children: e.source.toUpperCase() }),
										/* @__PURE__ */ (0, k.jsxs)("b", { children: [Number(e.balance).toLocaleString("en-US"), " USD"] }),
										/* @__PURE__ */ (0, k.jsx)("small", { children: e.evidence_id })
									] }, `${e.source}-${e.account}`))
								})] }),
								/* @__PURE__ */ (0, k.jsxs)("details", { children: [/* @__PURE__ */ (0, k.jsxs)("summary", { children: [
									"Open ",
									r.journals.length,
									" journal evidence records"
								] }), /* @__PURE__ */ (0, k.jsx)("div", {
									className: "source-evidence-rows",
									children: r.journals.map((e) => /* @__PURE__ */ (0, k.jsxs)("div", { children: [
										/* @__PURE__ */ (0, k.jsx)("strong", { children: e.journal_id }),
										/* @__PURE__ */ (0, k.jsx)("span", { children: e.account }),
										/* @__PURE__ */ (0, k.jsxs)("b", { children: [Number(e.amount).toLocaleString("en-US"), " USD"] }),
										/* @__PURE__ */ (0, k.jsx)("small", { children: e.description })
									] }, e.journal_id))
								})] })
							]
						})]
					}), /* @__PURE__ */ (0, k.jsxs)("section", {
						className: "surface correlation-panel",
						children: [
							/* @__PURE__ */ (0, k.jsxs)("div", {
								className: "section-heading",
								children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
									className: "eyebrow",
									children: "PERSISTED COMPONENT COMMUNICATION"
								}), /* @__PURE__ */ (0, k.jsx)("h2", { children: "Evidence correlation" })] }), /* @__PURE__ */ (0, k.jsxs)("span", {
									className: "pill quiet",
									children: [i.length, " events"]
								})]
							}),
							/* @__PURE__ */ (0, k.jsx)("p", {
								className: "correlation-intro",
								children: "Select a plan step or event to see which component received the request, returned the result, and recorded the decision."
							}),
							e && /* @__PURE__ */ (0, k.jsx)("div", {
								className: "correlation-steps",
								children: e.plan.map((e) => /* @__PURE__ */ (0, k.jsxs)("button", {
									type: "button",
									onClick: () => g(e.last_event_seq),
									disabled: !e.last_event_seq,
									children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: e.label }), /* @__PURE__ */ (0, k.jsx)("span", { children: e.last_event_seq ? `Event #${e.last_event_seq}` : e.status })]
								}, e.step_id))
							}),
							/* @__PURE__ */ (0, k.jsxs)("div", {
								className: "correlation-segment",
								children: [/* @__PURE__ */ (0, k.jsx)("button", {
									type: "button",
									className: b === "investigation" ? "active" : "",
									onClick: () => x("investigation"),
									children: "Investigation segment"
								}), /* @__PURE__ */ (0, k.jsx)("button", {
									type: "button",
									className: b === "full" ? "active" : "",
									onClick: () => x("full"),
									children: "Entire request"
								})]
							}),
							/* @__PURE__ */ (0, k.jsxs)("label", {
								className: "correlation-filter",
								children: ["Find operation or component", /* @__PURE__ */ (0, k.jsx)("input", {
									value: v,
									onChange: (e) => y(e.target.value),
									placeholder: "compare, gateway, policy…"
								})]
							}),
							/* @__PURE__ */ (0, k.jsx)("div", {
								className: "correlation-events",
								ref: w,
								children: D.map((e) => /* @__PURE__ */ (0, k.jsxs)("button", {
									type: "button",
									"data-seq": e.seq,
									className: O?.seq === e.seq ? "selected" : "",
									onClick: () => g(e.seq),
									children: [
										/* @__PURE__ */ (0, k.jsxs)("span", { children: ["#", e.seq] }),
										/* @__PURE__ */ (0, k.jsx)("strong", { children: e.operation.replaceAll("_", " ") }),
										/* @__PURE__ */ (0, k.jsxs)("small", { children: [
											e.source_component_id.replaceAll("_", " "),
											" → ",
											e.target_component_id.replaceAll("_", " ")
										] }),
										/* @__PURE__ */ (0, k.jsxs)("em", { children: [
											e.direction,
											" · ",
											e.status
										] })
									]
								}, e.seq))
							}),
							O && /* @__PURE__ */ (0, k.jsxs)("div", {
								className: "correlation-inspector",
								children: [
									/* @__PURE__ */ (0, k.jsxs)("span", {
										className: "eyebrow",
										children: ["SELECTED MESSAGE · #", O.seq]
									}),
									/* @__PURE__ */ (0, k.jsx)("strong", { children: O.operation.replaceAll("_", " ") }),
									/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "From" }), /* @__PURE__ */ (0, k.jsx)("b", { children: O.source_component_id.replaceAll("_", " ") })] }),
									/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "To" }), /* @__PURE__ */ (0, k.jsx)("b", { children: O.target_component_id.replaceAll("_", " ") })] }),
									/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Direction" }), /* @__PURE__ */ (0, k.jsxs)("b", { children: [
										O.direction,
										" · ",
										O.status
									] })] }),
									/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Time" }), /* @__PURE__ */ (0, k.jsx)("b", { children: O.timestamp_utc })] }),
									/* @__PURE__ */ (0, k.jsx)("pre", { children: JSON.stringify(O.payload_summary || {}, null, 2) })
								]
							})
						]
					})]
				}),
				S === "finance" && /* @__PURE__ */ (0, k.jsx)(Ge, {
					currentCase: t,
					history: n,
					historyDetail: r
				}),
				S === "components" && /* @__PURE__ */ (0, k.jsxs)("div", {
					className: "evidence-component-layout",
					children: [/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "evidence-component-details",
						children: [c, l]
					}), /* @__PURE__ */ (0, k.jsxs)("section", {
						className: "surface evidence-component-link",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: "eyebrow",
								children: "PERSISTED TRACE"
							}),
							/* @__PURE__ */ (0, k.jsxs)("h2", { children: [a?.length || 0, " component events"] }),
							/* @__PURE__ */ (0, k.jsx)("p", { children: "Open Investigation proof to filter and inspect the selected case events." }),
							/* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								onClick: () => C("proof"),
								children: "Inspect event messages →"
							})
						]
					})]
				}),
				S === "questions" && /* @__PURE__ */ (0, k.jsx)(Ke, {
					run: o,
					questions: s,
					requestedSeq: u?.section === "questions" ? u.stepSeq : null
				}),
				S === "implementation" && /* @__PURE__ */ (0, k.jsx)(Je, {
					currentCase: t,
					events: a || i
				})
			]
		})]
	});
}
// src/ArchitectureQuestions.jsx
var Xe = [
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
function Ze({ step: e, selected: t, processing: n, onSelect: r }) {
	return /* @__PURE__ */ (0, k.jsxs)("button", {
		type: "button",
		"data-seq": e.seq,
		className: `lab-node ${e.status} ${t ? "selected" : ""} ${n ? "processing" : ""}`,
		onClick: r,
		"aria-label": `Step ${e.seq}: ${e.component}, ${e.status}`,
		children: [
			/* @__PURE__ */ (0, k.jsxs)("small", { children: [
				String(e.seq).padStart(2, "0"),
				" · ",
				e.phase
			] }),
			/* @__PURE__ */ (0, k.jsx)("strong", { children: e.component }),
			/* @__PURE__ */ (0, k.jsx)("span", { children: e.status.toUpperCase() })
		]
	});
}
function Qe({ playbooks: e, question: t, initialRoute: n, onClose: r }) {
	let [i, a] = (0, _.useState)(n), [o, s] = (0, _.useState)(0), c = e[i], l = c?.steps?.[o];
	return (0, _.useEffect)(() => {
		let e = (e) => {
			e.key === "Escape" && r();
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [r]), /* @__PURE__ */ (0, k.jsx)("div", {
		className: "route-plan-backdrop",
		onMouseDown: (e) => {
			e.target === e.currentTarget && r();
		},
		children: /* @__PURE__ */ (0, k.jsxs)("section", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Gateway implementation plan",
			className: "route-plan-dialog",
			children: [
				/* @__PURE__ */ (0, k.jsxs)("header", { children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [
					/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: "ARCHITECTURE IMPLEMENTATION PLAN · CANDIDATE ONLY"
					}),
					/* @__PURE__ */ (0, k.jsx)("h2", { children: "What must be built and proved" }),
					/* @__PURE__ */ (0, k.jsx)("p", { children: "Choose a scenario and a handoff to inspect its configuration, dependency and acceptance proof." })
				] }), /* @__PURE__ */ (0, k.jsx)("button", {
					type: "button",
					onClick: r,
					"aria-label": "Close implementation plan",
					children: "Close ×"
				})] }),
				/* @__PURE__ */ (0, k.jsx)("nav", {
					className: "route-plan-tabs",
					"aria-label": "Gateway scenarios",
					children: Xe.map((e) => /* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						className: i === e.id ? "active" : "",
						onClick: () => {
							a(e.id), s(0);
						},
						"aria-pressed": i === e.id,
						children: e.label
					}, e.id))
				}),
				c ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "route-plan-summary",
						children: [
							/* @__PURE__ */ (0, k.jsx)("strong", { children: c.title }),
							/* @__PURE__ */ (0, k.jsx)("span", { children: c.status }),
							/* @__PURE__ */ (0, k.jsx)("p", { children: c.path }),
							/* @__PURE__ */ (0, k.jsxs)("small", { children: [
								/* @__PURE__ */ (0, k.jsx)("b", { children: "Hosting:" }),
								" ",
								c.hosting
							] })
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "route-plan-body",
						children: [
							/* @__PURE__ */ (0, k.jsxs)("div", {
								className: "route-plan-sequence",
								children: [/* @__PURE__ */ (0, k.jsx)("h3", { children: "Build sequence" }), c.steps.map((e, t) => /* @__PURE__ */ (0, k.jsxs)("button", {
									type: "button",
									className: o === t ? "active" : "",
									onClick: () => s(t),
									"aria-pressed": o === t,
									children: [
										/* @__PURE__ */ (0, k.jsx)("em", { children: String(t + 1).padStart(2, "0") }),
										/* @__PURE__ */ (0, k.jsx)("span", { children: e.handoff }),
										/* @__PURE__ */ (0, k.jsx)("b", {
											"aria-hidden": "true",
											children: "›"
										})
									]
								}, e.handoff))]
							}),
							/* @__PURE__ */ (0, k.jsxs)("div", {
								className: "route-plan-detail",
								children: [
									/* @__PURE__ */ (0, k.jsxs)("span", {
										className: "eyebrow",
										children: [
											"HANDOFF ",
											o + 1,
											" OF ",
											c.steps.length
										]
									}),
									/* @__PURE__ */ (0, k.jsx)("h3", { children: l?.handoff }),
									/* @__PURE__ */ (0, k.jsxs)("dl", { children: [
										/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("dt", { children: "Configure" }), /* @__PURE__ */ (0, k.jsx)("dd", { children: l?.configure })] }),
										/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("dt", { children: "Depends on" }), /* @__PURE__ */ (0, k.jsx)("dd", { children: l?.dependency })] }),
										/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("dt", { children: "Proof to accept" }), /* @__PURE__ */ (0, k.jsx)("dd", { children: l?.proof })] }),
										/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("dt", { children: "Accountable team" }), /* @__PURE__ */ (0, k.jsx)("dd", { children: l?.owner })] })
									] })
								]
							}),
							/* @__PURE__ */ (0, k.jsxs)("aside", {
								className: "route-plan-decisions",
								children: [
									/* @__PURE__ */ (0, k.jsx)("h3", { children: "Open decisions for this route" }),
									/* @__PURE__ */ (0, k.jsx)("ol", { children: c.decisions.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) }),
									t && /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
										/* @__PURE__ */ (0, k.jsxs)("h3", { children: ["For this question: ", t.title] }),
										/* @__PURE__ */ (0, k.jsx)("ul", { children: (t.dependencies || []).map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) }),
										/* @__PURE__ */ (0, k.jsxs)("strong", { children: ["Next: ", t.next_action] })
									] })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("footer", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Reference designs only. Hosting, credentials, identity and SAP authorization require tenant proof and owner approval." }), /* @__PURE__ */ (0, k.jsx)("div", { children: c.sources.map((e) => /* @__PURE__ */ (0, k.jsxs)("a", {
						href: e.url,
						target: "_blank",
						rel: "noreferrer",
						children: [e.label, " ↗"]
					}, e.url)) })] })
				] }) : /* @__PURE__ */ (0, k.jsx)("p", {
					className: "empty-inline",
					children: "No route plan is available."
				})
			]
		})
	});
}
function $e({ questions: e = [], routePlaybooks: t = {}, focus: n, run: r, onRun: i, busy: a, onOpenEvidence: o }) {
	let [s, c] = (0, _.useState)(r?.question_id || null), [l, u] = (0, _.useState)(r?.route || "S3"), [d, f] = (0, _.useState)(r?.probe || ""), [p, m] = (0, _.useState)(null), [h, g] = (0, _.useState)(!0), [v, y] = (0, _.useState)(!1), b = (0, _.useRef)(null), x = e.find((e) => e.id === s), S = r?.question_id === s ? r : null, C = S?.steps || [], w = C.filter((e) => e.phase === "design-time"), T = C.filter((e) => e.phase !== "design-time"), E = C.find((e) => e.seq === p) || C.at(-1), D = C.findIndex((e) => e.seq === E?.seq);
	(0, _.useEffect)(() => {
		C.length && (h || p === null || !C.some((e) => e.seq === p)) && m(C.at(-1).seq);
	}, [
		S?.run_id,
		C.length,
		h
	]), (0, _.useEffect)(() => {
		S?.status === "complete" && h && C.length && (m(C[0].seq), g(!1));
	}, [
		S?.run_id,
		S?.status,
		C.length,
		h
	]), (0, _.useEffect)(() => {
		if (!n?.id || n.nonce === b.current) return;
		let t = e.find((e) => e.id === n.id);
		t && (b.current = n.nonce, O(t));
	}, [n?.nonce, e]);
	function O(e) {
		let t = e.default_route || "S3", n = e.probes[0].id;
		c(e.id), u(t), f(n), m(null), g(!0), i(e.id, t, n);
	}
	function ee() {
		x && (m(null), g(!0), i(x.id, l, d));
	}
	function te(e) {
		let t = C[D + e];
		t && (m(t.seq), g(!1));
	}
	return /* @__PURE__ */ (0, k.jsxs)("main", {
		className: "question-lab",
		"aria-label": "Architecture questions",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("aside", {
				className: "surface question-rail",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "section-heading",
						children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
							className: "eyebrow",
							children: "ARCHITECTURE ALIGNMENT"
						}), /* @__PURE__ */ (0, k.jsx)("h2", { children: "Open questions" })] }), /* @__PURE__ */ (0, k.jsx)("span", {
							className: "pill simulated",
							children: "6 decisions"
						})]
					}),
					/* @__PURE__ */ (0, k.jsx)("p", {
						className: "lab-intro",
						children: "Select a question to run a synthetic component path. Each result remains an open architecture decision."
					}),
					/* @__PURE__ */ (0, k.jsx)("div", {
						className: "question-list",
						children: e.map((e, t) => /* @__PURE__ */ (0, k.jsxs)("button", {
							type: "button",
							className: `question-card ${s === e.id ? "selected" : ""}`,
							onClick: () => O(e),
							"aria-pressed": s === e.id,
							children: [
								/* @__PURE__ */ (0, k.jsxs)("span", { children: [
									"Q",
									t + 1,
									" · OPEN"
								] }),
								/* @__PURE__ */ (0, k.jsx)("strong", { children: e.title }),
								/* @__PURE__ */ (0, k.jsx)("small", { children: e.summary })
							]
						}, e.id))
					}),
					/* @__PURE__ */ (0, k.jsx)("p", {
						className: "lab-footnote",
						children: "S1 and S2 are simulated alternatives. S3 tests a proposed external agent → AgentCore Gateway → SAP Apigee path; approval remains open."
					})
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)("section", {
				className: "lab-center",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("section", {
						className: "surface lab-command",
						children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: "eyebrow",
								children: "EXTERNAL AGENT / SAP ALIGNMENT PROBE"
							}),
							/* @__PURE__ */ (0, k.jsx)("h2", { children: x?.title || "Choose an architecture question" }),
							/* @__PURE__ */ (0, k.jsx)("p", { children: x?.summary || "Run a question to inspect the propagated request and response at each component." })
						] }), x && /* @__PURE__ */ (0, k.jsxs)("div", {
							className: "lab-controls",
							children: [
								/* @__PURE__ */ (0, k.jsxs)("label", { children: ["Route", /* @__PURE__ */ (0, k.jsx)("select", {
									"aria-label": "Architecture route",
									value: l,
									onChange: (e) => u(e.target.value),
									children: Xe.map((e) => /* @__PURE__ */ (0, k.jsx)("option", {
										value: e.id,
										children: e.label
									}, e.id))
								})] }),
								/* @__PURE__ */ (0, k.jsxs)("label", { children: ["Probe", /* @__PURE__ */ (0, k.jsx)("select", {
									"aria-label": "Architecture probe",
									value: d,
									onChange: (e) => f(e.target.value),
									children: x.probes.map((e) => /* @__PURE__ */ (0, k.jsx)("option", {
										value: e.id,
										children: e.label
									}, e.id))
								})] }),
								/* @__PURE__ */ (0, k.jsx)("button", {
									type: "button",
									className: "primary",
									onClick: ee,
									disabled: a,
									children: a ? "Running…" : "Run selected probe"
								}),
								/* @__PURE__ */ (0, k.jsx)("button", {
									type: "button",
									className: "route-plan-open",
									onClick: () => y(!0),
									children: "Hosting & dependencies →"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, k.jsxs)("section", {
						className: "surface lab-flow-panel",
						children: [/* @__PURE__ */ (0, k.jsxs)("div", {
							className: "section-heading",
							children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
								className: "eyebrow",
								children: "COMPONENT HANDOFFS"
							}), /* @__PURE__ */ (0, k.jsx)("h2", { children: "Propagated flow" })] }), /* @__PURE__ */ (0, k.jsxs)("div", {
								className: "lab-step-nav",
								children: [
									/* @__PURE__ */ (0, k.jsx)("button", {
										type: "button",
										onClick: () => te(-1),
										disabled: D <= 0,
										"aria-label": "Previous handoff",
										children: "←"
									}),
									/* @__PURE__ */ (0, k.jsx)("span", { children: E ? `${E.seq}/${S.total_steps}` : "—" }),
									/* @__PURE__ */ (0, k.jsx)("button", {
										type: "button",
										onClick: () => te(1),
										disabled: D < 0 || D >= C.length - 1,
										"aria-label": "Next handoff",
										children: "→"
									}),
									/* @__PURE__ */ (0, k.jsx)("span", {
										className: `pill ${S?.outcome === "DENIED" ? "warn" : "quiet"}`,
										children: S ? `${C.length}/${S.total_steps} steps · ${S.status}` : "Awaiting question"
									})
								]
							})]
						}), S ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
							/* @__PURE__ */ (0, k.jsxs)("div", {
								className: "lab-route-note",
								children: [
									/* @__PURE__ */ (0, k.jsx)("strong", { children: S.route_label }),
									/* @__PURE__ */ (0, k.jsx)("span", { children: S.route_status }),
									/* @__PURE__ */ (0, k.jsx)("span", { children: S.outcome })
								]
							}),
							/* @__PURE__ */ (0, k.jsxs)("div", {
								className: "lab-design-branch",
								children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "DESIGN-TIME PREREQUISITE · NOT A RUNTIME HOP" }), w.map((e) => /* @__PURE__ */ (0, k.jsx)(Ze, {
									step: e,
									selected: E?.seq === e.seq,
									processing: S.status === "running" && e.seq === C.at(-1)?.seq,
									onSelect: () => {
										m(e.seq), g(!1);
									}
								}, e.seq))]
							}),
							/* @__PURE__ */ (0, k.jsxs)("div", {
								className: "lab-flow",
								"aria-label": "Architecture runtime call path",
								children: [
									/* @__PURE__ */ (0, k.jsx)("span", {
										className: "lab-flow-caption",
										children: "RUNTIME CALL PATH · LEFT TO RIGHT, THEN NEXT ROW"
									}),
									T.map((e) => /* @__PURE__ */ (0, k.jsx)(Ze, {
										step: e,
										selected: E?.seq === e.seq,
										processing: S.status === "running" && e.seq === C.at(-1)?.seq,
										onSelect: () => {
											m(e.seq), g(!1);
										}
									}, e.seq)),
									S.status === "running" && /* @__PURE__ */ (0, k.jsx)("div", {
										className: "lab-pending",
										"aria-live": "polite",
										children: "Evaluating next handoff…"
									})
								]
							})
						] }) : /* @__PURE__ */ (0, k.jsx)("div", {
							className: "empty-inline",
							children: "Click an open question to generate its route and control trace."
						})]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "lab-evidence-link",
						children: [/* @__PURE__ */ (0, k.jsx)("span", { children: E ? `Selected handoff · ${E.component}` : "Select a question to trace its route" }), /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							onClick: () => o?.(E?.seq),
							disabled: !S,
							children: "Inspect handoff details in Evidence →"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)("aside", {
				className: "surface lab-decision",
				children: [/* @__PURE__ */ (0, k.jsx)("div", {
					className: "section-heading",
					children: /* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: "MEETING DECISION RECORD"
					}), /* @__PURE__ */ (0, k.jsx)("h2", { children: "Required alignment" })] })
				}), x ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "lab-position",
						children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Discussion baseline · not approved policy" }), /* @__PURE__ */ (0, k.jsx)("p", { children: x.current_position })]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "lab-decision-question",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "Decision to resolve" }),
							/* @__PURE__ */ (0, k.jsx)("strong", { children: x.decision }),
							/* @__PURE__ */ (0, k.jsxs)("small", { children: ["Owner · ", x.owner] })
						]
					}),
					/* @__PURE__ */ (0, k.jsx)("div", {
						className: "lab-open-status",
						children: "OPEN · No policy or tenant approval is asserted by this simulator."
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "lab-next-action",
						children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Next action" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: x.next_action })]
					}),
					/* @__PURE__ */ (0, k.jsx)("h3", { children: "Proof required to close" }),
					/* @__PURE__ */ (0, k.jsx)("ul", {
						className: "lab-gates",
						children: x.gates.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e))
					}),
					/* @__PURE__ */ (0, k.jsx)("p", {
						className: "lab-decision-hint",
						children: "Detailed handoff records and the synthetic decision packet are in Evidence & correlation."
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						className: "lab-export",
						onClick: () => o?.(E?.seq),
						children: "Open decision evidence →"
					})
				] }) : /* @__PURE__ */ (0, k.jsx)("p", {
					className: "empty-inline",
					children: "Select an open question to see its decision owner and required architecture alignment. Control details are in Evidence."
				})]
			}),
			v && /* @__PURE__ */ (0, k.jsx)(Qe, {
				playbooks: t,
				question: x,
				initialRoute: l,
				onClose: () => y(!1)
			})
		]
	});
}
// src/diagrams/s1.svg?raw
var et = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 840\" role=\"img\" aria-labelledby=\"t d\" font-family=\"'Segoe UI','Segoe UI Variable','Helvetica Neue',Arial,sans-serif\" text-rendering=\"geometricPrecision\" shape-rendering=\"geometricPrecision\"><title id=\"t\">S1 · Google Apigee MCP</title><desc id=\"d\">Detailed L2 architecture diagram S1 · Google Apigee MCP</desc><rect width=\"1200\" height=\"840\" fill=\"#F1F4F7\"/><rect x=\"0\" y=\"0\" width=\"1200\" height=\"840\" fill=\"#F1F4F7\" stroke=\"none\"/><rect x=\"0\" y=\"0\" width=\"1200\" height=\"58.24\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"20.93\" y=\"24.45\" font-size=\"12\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">AI FOUNDRY  /  MONTH-END RECONCILIATION</text><text x=\"21.63\" y=\"41.14\" font-size=\"6.97\" fill=\"#E8F1FB\" text-anchor=\"start\">L2  |  Worked reconciliation, identity and controls</text><rect x=\"945.35\" y=\"15.18\" width=\"233.72\" height=\"24.35\" rx=\"12.18\" fill=\"#FFF1E0\" stroke=\"none\"/><text x=\"1010.12\" y=\"30.55\" font-size=\"7.25\" font-weight=\"700\" fill=\"#C26A00\" text-anchor=\"start\">S1  ·  Google Apigee MCP</text><text x=\"20.93\" y=\"70.47\" font-size=\"5.58\" font-weight=\"700\" fill=\"#506778\" text-anchor=\"start\">ARCHITECTURE REVIEW DRAFT  ·  logically aligned; integration, identity and finance controls pending validation</text><rect x=\"20.93\" y=\"79.41\" width=\"537.21\" height=\"46.59\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"79.41\" width=\"537.21\" height=\"3.18\" rx=\"1.59\" fill=\"#5B3F8C\" stroke=\"none\"/><text x=\"28.6\" y=\"96.18\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">A  AI Foundry · design time</text><text x=\"28.6\" y=\"107.88\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Source, tool contracts and deployment pipeline; deployment interface TBD</text><rect x=\"31.4\" y=\"100.94\" width=\"104.65\" height=\"18.35\" rx=\"3.18\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.28\"/><text x=\"50.57\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Custom Foundry SDK</text><rect x=\"141.28\" y=\"100.94\" width=\"113.37\" height=\"18.35\" rx=\"3.18\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.28\"/><text x=\"160.77\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Local agent creation API</text><rect x=\"259.88\" y=\"100.94\" width=\"118.6\" height=\"18.35\" rx=\"3.18\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.28\"/><text x=\"274.55\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Python agent + tool bindings</text><rect x=\"383.72\" y=\"100.94\" width=\"162.21\" height=\"18.35\" rx=\"3.18\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.28\"/><text x=\"414.36\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">GitLab · tests · CI/CD · deploy TBD</text><line x1=\"136.05\" y1=\"110.12\" x2=\"140.23\" y2=\"110.12\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><polygon points=\"137.44,106.59 140.23,113.65 134.65,113.65\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(137.44 110.12) rotate(90) translate(-137.44 -110.12)\"/><line x1=\"254.65\" y1=\"110.12\" x2=\"258.84\" y2=\"110.12\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><polygon points=\"256.05,106.59 258.84,113.65 253.26,113.65\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(256.05 110.12) rotate(90) translate(-256.05 -110.12)\"/><line x1=\"378.49\" y1=\"110.12\" x2=\"382.67\" y2=\"110.12\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><polygon points=\"379.88,106.59 382.67,113.65 377.09,113.65\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(379.88 110.12) rotate(90) translate(-379.88 -110.12)\"/><rect x=\"568.6\" y=\"79.41\" width=\"610.47\" height=\"46.59\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#C9D5DE\" stroke-width=\"0.56\"/><text x=\"579.07\" y=\"94.46\" font-size=\"5.86\" font-weight=\"700\" fill=\"#0A4F9E\" text-anchor=\"start\">SCENARIO INVARIANT</text><text x=\"579.07\" y=\"106.79\" font-size=\"6.97\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Only MCP gateway placement and its inbound / outbound auth controls change.</text><text x=\"579.07\" y=\"117.76\" font-size=\"5.58\" fill=\"#506778\" text-anchor=\"start\">Agent logic, domain tools, SAP integration, data, model and approval paths remain equivalent.</text><rect x=\"20.93\" y=\"132.35\" width=\"1158.14\" height=\"33.53\" rx=\"4.94\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><text x=\"28.95\" y=\"143.53\" font-size=\"5.3\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">IDENTITY &amp; CREDENTIAL PATH · CANDIDATE</text><text x=\"28.95\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">IdP → app user session</text><line x1=\"165\" y1=\"153.88\" x2=\"175.47\" y2=\"153.88\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"172.67,150.35 175.47,157.41 169.88,157.41\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(172.67 153.88) rotate(90) translate(-172.67 -153.88)\"/><text x=\"181.4\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">AgentCore inbound + workload</text><line x1=\"355.81\" y1=\"153.88\" x2=\"366.28\" y2=\"153.88\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"363.49,150.35 366.28,157.41 360.7,157.41\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(363.49 153.88) rotate(90) translate(-363.49 -153.88)\"/><text x=\"376.74\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Gateway inbound authZ</text><line x1=\"526.74\" y1=\"153.88\" x2=\"537.21\" y2=\"153.88\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"534.42,150.35 537.21,157.41 531.63,157.41\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(534.42 153.88) rotate(90) translate(-534.42 -153.88)\"/><text x=\"547.67\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Tool credential / operation policy</text><line x1=\"715.12\" y1=\"153.88\" x2=\"725.58\" y2=\"153.88\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"722.79,150.35 725.58,157.41 720,157.41\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(722.79 153.88) rotate(90) translate(-722.79 -153.88)\"/><text x=\"732.56\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">IS/iFlow propagation: TBD</text><line x1=\"906.98\" y1=\"153.88\" x2=\"917.44\" y2=\"153.88\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"914.65,150.35 917.44,157.41 911.86,157.41\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(914.65 153.88) rotate(90) translate(-914.65 -153.88)\"/><text x=\"927.91\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SCC if private → SAP user / ABAP</text><text x=\"1049.23\" y=\"144.25\" font-size=\"4.74\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">Delegation vs service identity: TO VALIDATE</text><rect x=\"20.93\" y=\"176.47\" width=\"104.65\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"176.47\" width=\"104.65\" height=\"3.18\" rx=\"1.59\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"28.6\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">01  Business entry</text><text x=\"28.6\" y=\"204.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Human intent and app</text><rect x=\"136.05\" y=\"176.47\" width=\"313.95\" height=\"307.06\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"136.05\" y=\"176.47\" width=\"313.95\" height=\"3.18\" rx=\"1.59\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"143.72\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">02  AWS AgentCore</text><text x=\"143.72\" y=\"204.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Managed runtime + custom agent</text><rect x=\"460.47\" y=\"176.47\" width=\"115.12\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"460.47\" y=\"176.47\" width=\"115.12\" height=\"3.18\" rx=\"1.59\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"468.14\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">03  MCP gateway</text><text x=\"468.14\" y=\"204.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Google Apigee · external to AWS</text><rect x=\"586.05\" y=\"176.47\" width=\"139.53\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"586.05\" y=\"176.47\" width=\"139.53\" height=\"3.18\" rx=\"1.59\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"593.72\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">04  Domain MCP</text><text x=\"593.72\" y=\"204.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Finance-owned tool targets</text><rect x=\"736.05\" y=\"176.47\" width=\"143.02\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"736.05\" y=\"176.47\" width=\"143.02\" height=\"3.18\" rx=\"1.59\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"743.72\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">05  SAP BAIP</text><text x=\"743.72\" y=\"204.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Integration Suite · direct/iFlow route TBD</text><rect x=\"889.53\" y=\"176.47\" width=\"59.3\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><rect x=\"889.53\" y=\"176.47\" width=\"59.3\" height=\"3.18\" rx=\"1.59\" fill=\"#5B3F8C\" stroke=\"none\"/><text x=\"897.21\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">06  SCC</text><text x=\"897.21\" y=\"204.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Only if private</text><rect x=\"959.3\" y=\"176.47\" width=\"219.77\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"959.3\" y=\"176.47\" width=\"219.77\" height=\"3.18\" rx=\"1.59\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"966.98\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">07  SAP backends</text><text x=\"966.98\" y=\"204.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Distinct systems / authorizations</text><rect x=\"28.6\" y=\"215.29\" width=\"89.3\" height=\"42.35\" rx=\"4.24\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"215.29\" width=\"2.79\" height=\"42.35\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"36.28\" y=\"227.85\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Finance user</text><text x=\"36.28\" y=\"239.18\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Company code · ledger</text><text x=\"36.28\" y=\"249.06\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Period · scope</text><rect x=\"28.6\" y=\"268.24\" width=\"89.3\" height=\"48.71\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"268.24\" width=\"2.79\" height=\"48.71\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"36.28\" y=\"280.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Business application</text><text x=\"36.28\" y=\"292.12\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Chat / finance UI</text><text x=\"36.28\" y=\"302\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Authorized invocation</text><rect x=\"28.6\" y=\"328.24\" width=\"89.3\" height=\"49.41\" rx=\"4.24\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"328.24\" width=\"2.79\" height=\"49.41\" rx=\"1.12\" fill=\"#5B3F8C\" stroke=\"none\"/><text x=\"36.28\" y=\"340.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Enterprise IdP / SSO</text><text x=\"36.28\" y=\"352.12\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Human authentication</text><text x=\"36.28\" y=\"362\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">OIDC / SAML TBD</text><rect x=\"28.6\" y=\"388.24\" width=\"89.3\" height=\"51.18\" rx=\"4.23\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"388.24\" width=\"2.79\" height=\"51.18\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"36.28\" y=\"400.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Business rule</text><text x=\"36.28\" y=\"412.12\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Read-only by default</text><text x=\"36.28\" y=\"422\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Writes need approval</text><line x1=\"73.26\" y1=\"257.65\" x2=\"73.26\" y2=\"266.82\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"0.84\"/><polygon points=\"73.26,256.24 77.44,266.82 69.07,266.82\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(73.26 261.53) rotate(180) translate(-73.26 -261.53)\"/><line x1=\"73.26\" y1=\"318\" x2=\"73.26\" y2=\"328.24\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(73.26 323.12) scale(1 -1) translate(-73.26 -323.12)\"/><polygon points=\"73.26,318 77.44,328.59 69.07,328.59\" fill=\"#5B3F8C\" stroke=\"none\"/><rect x=\"144.77\" y=\"213.53\" width=\"296.51\" height=\"148.24\" rx=\"4.24\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"144.77\" y=\"213.53\" width=\"2.79\" height=\"148.24\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"152.44\" y=\"226.06\" font-size=\"7.81\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Amazon Bedrock AgentCore Runtime</text><text x=\"152.44\" y=\"237.41\" font-size=\"5.58\" fill=\"#506778\" text-anchor=\"start\">Managed hosting for deployed custom Python agent</text><rect x=\"153.49\" y=\"250.59\" width=\"132.56\" height=\"47.65\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"153.49\" y=\"250.59\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"161.16\" y=\"263.15\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Agent + MCP client</text><text x=\"161.16\" y=\"274.47\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Custom · typed tool binding</text><text x=\"161.16\" y=\"284.36\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Trace / case ID</text><rect x=\"293.02\" y=\"250.59\" width=\"139.53\" height=\"47.65\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"293.02\" y=\"250.59\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"300.7\" y=\"263.15\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Context Manager</text><text x=\"300.7\" y=\"274.47\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Custom · scoped evidence</text><text x=\"300.7\" y=\"284.36\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Provenance / timestamps</text><rect x=\"153.49\" y=\"307.06\" width=\"132.56\" height=\"47.65\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"153.49\" y=\"307.06\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"161.16\" y=\"319.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Reconciliation Engine</text><text x=\"161.16\" y=\"330.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Custom · deterministic math</text><text x=\"161.16\" y=\"340.83\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Ledger / FX / tolerance</text><rect x=\"293.02\" y=\"307.06\" width=\"139.53\" height=\"47.65\" rx=\"4.23\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"293.02\" y=\"307.06\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"300.7\" y=\"319.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Posting Executor</text><text x=\"300.7\" y=\"330.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Custom · approved writes</text><text x=\"300.7\" y=\"340.83\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Rechecks + idempotency</text><rect x=\"153.49\" y=\"374.12\" width=\"87.21\" height=\"44.12\" rx=\"4.24\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><rect x=\"153.49\" y=\"374.12\" width=\"2.79\" height=\"44.12\" rx=\"1.12\" fill=\"#5B3F8C\" stroke=\"none\"/><text x=\"161.16\" y=\"386.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">AgentCore Identity</text><text x=\"161.16\" y=\"398.01\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">Managed credential access</text><text x=\"161.16\" y=\"407.89\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">Inbound/outbound design TBD</text><rect x=\"247.67\" y=\"374.12\" width=\"81.98\" height=\"44.12\" rx=\"4.24\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><rect x=\"247.67\" y=\"374.12\" width=\"2.79\" height=\"44.12\" rx=\"1.12\" fill=\"#5B3F8C\" stroke=\"none\"/><text x=\"255.35\" y=\"386.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">AgentCore Memory</text><text x=\"255.35\" y=\"398.01\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">Managed · optional</text><text x=\"255.35\" y=\"407.89\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">Conversation only</text><rect x=\"336.63\" y=\"374.12\" width=\"95.93\" height=\"44.12\" rx=\"4.24\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"336.63\" y=\"374.12\" width=\"2.79\" height=\"44.12\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"344.3\" y=\"386.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Observability</text><text x=\"344.3\" y=\"398.01\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">Managed traces/metrics</text><text x=\"344.3\" y=\"407.89\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">Case + audit correlation</text><text x=\"153.84\" y=\"439.3\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">AWS support: IAM / workload roles · Secrets Manager · KMS · CloudWatch</text><text x=\"153.84\" y=\"453.41\" font-size=\"5.3\" font-weight=\"700\" fill=\"#0A4F9E\" text-anchor=\"start\">Gateway integration: MCP client + versioned, typed tool bindings</text><rect x=\"468.84\" y=\"217.06\" width=\"98.37\" height=\"51.18\" rx=\"4.23\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"468.84\" y=\"217.06\" width=\"2.79\" height=\"51.18\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"476.51\" y=\"229.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">MCP entry</text><text x=\"476.51\" y=\"240.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Tool discovery / invoke</text><text x=\"476.51\" y=\"250.83\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Apigee mode TBD</text><rect x=\"468.84\" y=\"277.06\" width=\"98.37\" height=\"52.94\" rx=\"4.24\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"468.84\" y=\"277.06\" width=\"2.79\" height=\"52.94\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"476.51\" y=\"289.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Inbound authZ</text><text x=\"476.51\" y=\"300.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Caller policy + scopes</text><text x=\"476.51\" y=\"310.83\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Operation allowlist TBD</text><rect x=\"468.84\" y=\"338.82\" width=\"98.37\" height=\"52.94\" rx=\"4.24\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"468.84\" y=\"338.82\" width=\"2.79\" height=\"52.94\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"476.51\" y=\"351.4\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Outbound target auth</text><text x=\"476.51\" y=\"362.71\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Separate target credential</text><text x=\"476.51\" y=\"372.59\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Exchange/delegation TBD</text><text x=\"470.23\" y=\"414.6\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Diagnostics: version · audit ID · timeout</text><text x=\"470.23\" y=\"430.48\" font-size=\"5.02\" font-weight=\"700\" fill=\"#C26A00\" text-anchor=\"start\">ONE selected gateway · no Portkey MCP</text><rect x=\"594.77\" y=\"215.29\" width=\"122.09\" height=\"65.29\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"215.29\" width=\"2.79\" height=\"65.29\" rx=\"1.12\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"602.44\" y=\"227.85\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP Finance · read</text><text x=\"602.44\" y=\"239.18\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">S/4 · Central Finance · BW</text><text x=\"602.44\" y=\"249.06\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Scoped read APIs</text><text x=\"602.44\" y=\"258.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">No direct database access</text><rect x=\"594.77\" y=\"291.18\" width=\"122.09\" height=\"58.24\" rx=\"4.23\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"291.18\" width=\"2.79\" height=\"58.24\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"602.44\" y=\"303.74\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP Finance · posting</text><text x=\"602.44\" y=\"315.06\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Restricted, typed API</text><text x=\"602.44\" y=\"324.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">S/4 default · TO VALIDATE</text><rect x=\"594.77\" y=\"358.24\" width=\"122.09\" height=\"37.06\" rx=\"4.24\" fill=\"#E5F5F2\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"358.24\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"602.44\" y=\"370.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Databricks · read</text><text x=\"602.44\" y=\"382.12\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Approved SQL / API · UC grants</text><rect x=\"594.77\" y=\"405.88\" width=\"122.09\" height=\"32.47\" rx=\"4.24\" fill=\"#F3F3F3\" stroke=\"#6B6B6B\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"405.88\" width=\"2.79\" height=\"32.47\" rx=\"1.12\" fill=\"#6B6B6B\" stroke=\"none\"/><text x=\"602.44\" y=\"418.45\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">BDC · future read</text><text x=\"602.44\" y=\"429.77\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Optional approved MCP target</text><text x=\"594.77\" y=\"451.65\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Domain tool: owner · schema/version · input checks</text><text x=\"594.77\" y=\"462.24\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Per-operation authZ · bounded result · audit ID</text><rect x=\"744.77\" y=\"215.29\" width=\"125.58\" height=\"61.76\" rx=\"4.24\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"744.77\" y=\"215.29\" width=\"2.79\" height=\"61.76\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"752.44\" y=\"227.85\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">API Management</text><text x=\"752.44\" y=\"239.18\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Policies · API authorization</text><text x=\"752.44\" y=\"249.06\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Token exchange · scoped access</text><rect x=\"744.77\" y=\"287.65\" width=\"125.58\" height=\"61.76\" rx=\"4.24\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"744.77\" y=\"287.65\" width=\"2.79\" height=\"61.76\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"752.44\" y=\"300.21\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Cloud Integration</text><text x=\"752.44\" y=\"311.53\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Custom iFlows as needed</text><text x=\"752.44\" y=\"321.41\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Principal propagation candidate</text><text x=\"752.44\" y=\"331.3\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Route · error handling · trace</text><rect x=\"744.77\" y=\"360\" width=\"125.58\" height=\"58.24\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"744.77\" y=\"360\" width=\"2.79\" height=\"58.24\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"752.44\" y=\"372.56\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Destinations / connectivity</text><text x=\"752.44\" y=\"383.88\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">SAP API + identity mapping</text><text x=\"752.44\" y=\"393.77\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Backend ABAP auth still applies</text><text x=\"744.77\" y=\"435.77\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">API-managed direct or custom iFlow per target</text><text x=\"744.77\" y=\"448.12\" font-size=\"5.02\" fill=\"#5B3F8C\" text-anchor=\"start\">Identity mapping per backend: TO VALIDATE</text><rect x=\"896.51\" y=\"243.53\" width=\"45.35\" height=\"111.18\" rx=\"3.35\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><rect x=\"896.51\" y=\"243.53\" width=\"2.79\" height=\"111.18\" rx=\"1.12\" fill=\"#5B3F8C\" stroke=\"none\"/><text x=\"904.19\" y=\"256.11\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Cloud</text><text x=\"904.19\" y=\"267.42\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Connector</text><text x=\"904.19\" y=\"277.3\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">private</text><text x=\"904.19\" y=\"287.18\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">network</text><text x=\"904.19\" y=\"297.07\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">only</text><text x=\"895.47\" y=\"374.01\" font-size=\"5.02\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">Private route</text><text x=\"895.47\" y=\"383.18\" font-size=\"5.02\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">and mapping</text><text x=\"895.47\" y=\"392.36\" font-size=\"5.02\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">need proof</text><rect x=\"968.02\" y=\"215.29\" width=\"202.33\" height=\"68.82\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"968.02\" y=\"215.29\" width=\"2.79\" height=\"68.82\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"975.7\" y=\"227.84\" font-size=\"7.25\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP S/4HANA</text><text x=\"975.7\" y=\"239.18\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Live G/L balances · journals · open items</text><text x=\"975.7\" y=\"249.06\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Custom ABAP read API · controlled posting API</text><text x=\"975.7\" y=\"258.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">SAP document reference + status</text><rect x=\"968.02\" y=\"294.71\" width=\"202.33\" height=\"68.82\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"968.02\" y=\"294.71\" width=\"2.79\" height=\"68.82\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"975.7\" y=\"307.26\" font-size=\"6.97\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP S/4HANA Central Finance</text><text x=\"975.7\" y=\"318.59\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Central posted / replicated accounting</text><text x=\"975.7\" y=\"328.47\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Source mapping · errors · status · cutoff</text><text x=\"975.7\" y=\"338.36\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Posting target not assumed</text><rect x=\"968.02\" y=\"374.12\" width=\"202.33\" height=\"68.82\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"968.02\" y=\"374.12\" width=\"2.79\" height=\"68.82\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"975.7\" y=\"386.66\" font-size=\"7.25\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP BW/4HANA</text><text x=\"975.7\" y=\"398\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Reporting aggregates / hierarchy</text><text x=\"975.7\" y=\"407.88\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Load and refresh status</text><text x=\"975.7\" y=\"417.77\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Read-only analytic role</text><text x=\"976.74\" y=\"273.42\" font-size=\"5.02\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">Mapped principal + ABAP roles: TO VALIDATE</text><text x=\"976.74\" y=\"352.83\" font-size=\"5.02\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">Mapped principal + ABAP roles: TO VALIDATE</text><text x=\"976.74\" y=\"432.24\" font-size=\"5.02\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">Mapped principal + ABAP roles: TO VALIDATE</text><line x1=\"117.91\" y1=\"300\" x2=\"144.07\" y2=\"300\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.4\"/><polygon points=\"137.09,291.18 144.07,308.82 130.12,308.82\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(137.09 300) rotate(90) translate(-137.09 -300)\"/><rect x=\"117.91\" y=\"282.71\" width=\"59.3\" height=\"12.71\" rx=\"3.18\" fill=\"#FFFFFF\" stroke=\"#C9D5DE\" stroke-width=\"0.28\"/><text x=\"125.42\" y=\"291.42\" font-size=\"5.02\" font-weight=\"700\" fill=\"#0A4F9E\" text-anchor=\"start\">intent · HTTPS</text><line x1=\"441.28\" y1=\"240\" x2=\"468.14\" y2=\"240\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.4\"/><polygon points=\"461.16,231.18 468.14,248.82 454.19,248.82\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(461.16 240) rotate(90) translate(-461.16 -240)\"/><line x1=\"567.56\" y1=\"240\" x2=\"594.07\" y2=\"240\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.4\"/><polygon points=\"587.09,231.18 594.07,248.82 580.12,248.82\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(587.09 240) rotate(90) translate(-587.09 -240)\"/><line x1=\"717.56\" y1=\"240\" x2=\"744.07\" y2=\"240\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.4\"/><polygon points=\"737.09,231.18 744.07,248.82 730.12,248.82\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(737.09 240) rotate(90) translate(-737.09 -240)\"/><line x1=\"807.56\" y1=\"277.06\" x2=\"807.56\" y2=\"286.94\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"0.84\"/><polygon points=\"807.56,276.35 811.74,286.94 803.37,286.94\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(807.56 281.65) rotate(180) translate(-807.56 -281.65)\"/><line x1=\"807.56\" y1=\"349.41\" x2=\"807.56\" y2=\"359.29\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"0.84\"/><polygon points=\"807.56,348.71 811.74,359.29 803.37,359.29\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(807.56 354) rotate(180) translate(-807.56 -354)\"/><line x1=\"840.7\" y1=\"277.06\" x2=\"840.7\" y2=\"286.94\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\"/><polygon points=\"840.7,276.35 844.88,286.94 836.51,286.94\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(840.7 281.65) rotate(180) translate(-840.7 -281.65)\"/><line x1=\"840.7\" y1=\"349.41\" x2=\"840.7\" y2=\"359.29\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\"/><polygon points=\"840.7,348.71 844.88,359.29 836.51,359.29\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(840.7 354) rotate(180) translate(-840.7 -354)\"/><line x1=\"870.35\" y1=\"247.06\" x2=\"883.26\" y2=\"247.06\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><line x1=\"883.26\" y1=\"210\" x2=\"883.26\" y2=\"247.06\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\" transform=\"translate(883.26 228.53) scale(1 -1) translate(-883.26 -228.53)\"/><line x1=\"883.26\" y1=\"210\" x2=\"952.33\" y2=\"210\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"210\" x2=\"952.33\" y2=\"249.53\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"249.53\" x2=\"967.33\" y2=\"249.53\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><polygon points=\"961.74,242.47 967.33,256.59 956.16,256.59\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(961.74 249.53) rotate(90) translate(-961.74 -249.53)\"/><line x1=\"952.33\" y1=\"249.53\" x2=\"952.33\" y2=\"328.24\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"328.24\" x2=\"967.33\" y2=\"328.24\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><polygon points=\"961.74,321.18 967.33,335.29 956.16,335.29\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(961.74 328.24) rotate(90) translate(-961.74 -328.24)\"/><line x1=\"952.33\" y1=\"328.24\" x2=\"952.33\" y2=\"407.65\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"407.65\" x2=\"967.33\" y2=\"407.65\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><polygon points=\"961.74,400.59 967.33,414.71 956.16,414.71\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(961.74 407.65) rotate(90) translate(-961.74 -407.65)\"/><line x1=\"870.35\" y1=\"388.24\" x2=\"883.26\" y2=\"388.24\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"883.26\" y1=\"317.65\" x2=\"883.26\" y2=\"388.24\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(883.26 352.94) scale(1 -1) translate(-883.26 -352.94)\"/><line x1=\"883.26\" y1=\"317.65\" x2=\"895.81\" y2=\"317.65\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"891.63,312.35 895.81,322.94 887.44,322.94\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(891.63 317.65) rotate(90) translate(-891.63 -317.65)\"/><line x1=\"941.86\" y1=\"317.65\" x2=\"952.33\" y2=\"317.65\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"948.14,312.35 952.33,322.94 943.95,322.94\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(948.14 317.65) rotate(90) translate(-948.14 -317.65)\"/><text x=\"968.72\" y=\"462.95\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Direct API or iFlow/SCC route is selected per backend.</text><line x1=\"717.56\" y1=\"320.47\" x2=\"729.07\" y2=\"320.47\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><line x1=\"729.07\" y1=\"264.71\" x2=\"729.07\" y2=\"320.47\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\" transform=\"translate(729.07 292.59) scale(1 -1) translate(-729.07 -292.59)\"/><line x1=\"729.07\" y1=\"264.71\" x2=\"744.07\" y2=\"264.71\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><polygon points=\"738.49,257.65 744.07,271.76 732.91,271.76\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(738.49 264.71) rotate(90) translate(-738.49 -264.71)\"/><line x1=\"432.56\" y1=\"338.82\" x2=\"455.23\" y2=\"338.82\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><line x1=\"455.23\" y1=\"319.41\" x2=\"455.23\" y2=\"338.82\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\" transform=\"translate(455.23 329.12) scale(1 -1) translate(-455.23 -329.12)\"/><line x1=\"455.23\" y1=\"319.41\" x2=\"468.14\" y2=\"319.41\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><polygon points=\"462.56,312.35 468.14,326.47 456.98,326.47\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(462.56 319.41) rotate(90) translate(-462.56 -319.41)\"/><line x1=\"567.56\" y1=\"319.41\" x2=\"594.07\" y2=\"319.41\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><polygon points=\"588.49,312.35 594.07,326.47 582.91,326.47\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(588.49 319.41) rotate(90) translate(-588.49 -319.41)\"/><line x1=\"567.56\" y1=\"381.18\" x2=\"579.77\" y2=\"381.18\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"1.12\"/><line x1=\"579.77\" y1=\"381.18\" x2=\"579.77\" y2=\"390\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"1.12\"/><line x1=\"579.77\" y1=\"390\" x2=\"594.07\" y2=\"390\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"1.12\"/><polygon points=\"588.49,382.94 594.07,397.06 582.91,397.06\" fill=\"#0C8F76\" stroke=\"none\" transform=\"translate(588.49 390) rotate(90) translate(-588.49 -390)\"/><line x1=\"968.02\" y1=\"457.06\" x2=\"968.02\" y2=\"471.18\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"139.53\" y1=\"471.18\" x2=\"968.02\" y2=\"471.18\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(553.78 471.18) scale(-1 1) translate(-553.78 -471.18)\"/><polygon points=\"143.72,465.88 147.91,476.47 139.53,476.47\" fill=\"#0C8F76\" stroke=\"none\" transform=\"translate(143.72 471.18) rotate(270) translate(-143.72 -471.18)\"/><rect x=\"282.56\" y=\"457.06\" width=\"226.74\" height=\"12.71\" rx=\"3.18\" fill=\"#FFFFFF\" stroke=\"#C9D5DE\" stroke-width=\"0.28\"/><text x=\"312.77\" y=\"465.77\" font-size=\"5.02\" font-weight=\"700\" fill=\"#0C8F76\" text-anchor=\"start\">read results + source status return via same mediated path</text><rect x=\"20.93\" y=\"501.18\" width=\"415.12\" height=\"88.24\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"501.18\" width=\"415.12\" height=\"3.18\" rx=\"1.59\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"28.6\" y=\"517.94\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">B  LLM inference branch</text><text x=\"28.6\" y=\"529.65\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Selected, sanitized exception context only</text><rect x=\"29.65\" y=\"540\" width=\"160.47\" height=\"38.82\" rx=\"4.24\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"29.65\" y=\"540\" width=\"2.79\" height=\"38.82\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"37.33\" y=\"552.56\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Portkey · model governance</text><text x=\"37.33\" y=\"563.89\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Auth · routing · guardrails</text><text x=\"37.33\" y=\"573.77\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Redaction · logs · usage</text><rect x=\"244.19\" y=\"540\" width=\"181.4\" height=\"38.82\" rx=\"4.24\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"244.19\" y=\"540\" width=\"2.79\" height=\"38.82\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"251.86\" y=\"552.56\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Amazon Bedrock · foundation model</text><text x=\"251.86\" y=\"563.89\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Approved model · explanation</text><text x=\"251.86\" y=\"573.77\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">No authoritative math / posting</text><line x1=\"190.12\" y1=\"559.41\" x2=\"243.49\" y2=\"559.41\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><polygon points=\"237.91,552.35 243.49,566.47 232.33,566.47\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(237.91 559.41) rotate(90) translate(-237.91 -559.41)\"/><line x1=\"190.81\" y1=\"571.76\" x2=\"244.19\" y2=\"571.76\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(217.5 571.76) scale(-1 1) translate(-217.5 -571.76)\"/><polygon points=\"195,566.47 199.19,577.06 190.81,577.06\" fill=\"#0C8F76\" stroke=\"none\" transform=\"translate(195 571.76) rotate(270) translate(-195 -571.76)\"/><line x1=\"209.3\" y1=\"362.47\" x2=\"209.3\" y2=\"367.06\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"132.56\" y1=\"367.06\" x2=\"209.3\" y2=\"367.06\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(170.93 367.06) scale(-1 1) translate(-170.93 -367.06)\"/><line x1=\"132.56\" y1=\"367.06\" x2=\"132.56\" y2=\"488.82\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"101.16\" y1=\"488.82\" x2=\"132.56\" y2=\"488.82\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(116.86 488.82) scale(-1 1) translate(-116.86 -488.82)\"/><line x1=\"101.16\" y1=\"488.82\" x2=\"101.16\" y2=\"539.29\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"101.16,528.71 105.35,539.29 96.98,539.29\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(101.16 534) rotate(180) translate(-101.16 -534)\"/><line x1=\"111.63\" y1=\"494.12\" x2=\"111.63\" y2=\"540\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(111.63 517.06) scale(1 -1) translate(-111.63 -517.06)\"/><line x1=\"111.63\" y1=\"494.12\" x2=\"127.33\" y2=\"494.12\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"127.33\" y1=\"370.59\" x2=\"127.33\" y2=\"494.12\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(127.33 432.35) scale(1 -1) translate(-127.33 -432.35)\"/><line x1=\"127.33\" y1=\"370.59\" x2=\"209.3\" y2=\"370.59\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"209.3\" y1=\"362.47\" x2=\"209.3\" y2=\"370.59\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(209.3 366.53) scale(1 -1) translate(-209.3 -366.53)\"/><polygon points=\"209.3,362.47 213.49,373.06 205.12,373.06\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"31.4\" y=\"585.77\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Minimized prompt; response via Portkey to Runtime; advisory only.</text><rect x=\"20.93\" y=\"603.53\" width=\"415.12\" height=\"95.29\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"603.53\" width=\"415.12\" height=\"3.18\" rx=\"1.59\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"28.6\" y=\"620.29\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">C  n8n approval side path</text><text x=\"28.6\" y=\"632\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Only for a proposed financial write</text><rect x=\"29.65\" y=\"640.59\" width=\"111.63\" height=\"37.06\" rx=\"4.24\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"29.65\" y=\"640.59\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"37.33\" y=\"653.15\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Finance approver</text><text x=\"37.33\" y=\"664.48\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Verified decision</text><text x=\"37.33\" y=\"674.36\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Approve / reject</text><rect x=\"160.47\" y=\"640.59\" width=\"111.63\" height=\"37.06\" rx=\"4.24\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"160.47\" y=\"640.59\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"168.14\" y=\"653.15\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">n8n workflow</text><text x=\"168.14\" y=\"664.48\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Case version + hash</text><text x=\"168.14\" y=\"674.36\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Trusted callback</text><rect x=\"291.28\" y=\"640.59\" width=\"132.56\" height=\"37.06\" rx=\"4.24\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"291.28\" y=\"640.59\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"298.95\" y=\"653.15\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Executor recheck</text><text x=\"298.95\" y=\"664.48\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">SAP state + authorization</text><text x=\"298.95\" y=\"674.36\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Idempotency / retry stop</text><line x1=\"141.98\" y1=\"649.41\" x2=\"160.47\" y2=\"649.41\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" transform=\"translate(151.22 649.41) scale(-1 1) translate(-151.22 -649.41)\"/><polygon points=\"146.16,644.12 150.35,654.71 141.98,654.71\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(146.16 649.41) rotate(270) translate(-146.16 -649.41)\"/><line x1=\"141.28\" y1=\"665.29\" x2=\"159.77\" y2=\"665.29\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><polygon points=\"154.19,658.24 159.77,672.35 148.6,672.35\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(154.19 665.29) rotate(90) translate(-154.19 -665.29)\"/><line x1=\"272.09\" y1=\"660\" x2=\"290.58\" y2=\"660\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><polygon points=\"285,652.94 290.58,667.06 279.42,667.06\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(285 660) rotate(90) translate(-285 -660)\"/><line x1=\"380.23\" y1=\"355.41\" x2=\"380.23\" y2=\"365.29\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"380.23\" y1=\"365.29\" x2=\"437.79\" y2=\"365.29\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"437.79\" y1=\"365.29\" x2=\"437.79\" y2=\"494.12\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"437.79\" y1=\"494.12\" x2=\"441.28\" y2=\"494.12\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"441.28\" y1=\"494.12\" x2=\"441.28\" y2=\"608.82\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"216.28\" y1=\"608.82\" x2=\"441.28\" y2=\"608.82\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(328.78 608.82) scale(-1 1) translate(-328.78 -608.82)\"/><line x1=\"216.28\" y1=\"608.82\" x2=\"216.28\" y2=\"639.88\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"216.28,629.29 220.47,639.88 212.09,639.88\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(216.28 634.59) rotate(180) translate(-216.28 -634.59)\"/><line x1=\"359.3\" y1=\"598.24\" x2=\"359.3\" y2=\"640.59\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(359.3 619.41) scale(1 -1) translate(-359.3 -619.41)\"/><line x1=\"359.3\" y1=\"598.24\" x2=\"444.77\" y2=\"598.24\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"444.77\" y1=\"365.29\" x2=\"444.77\" y2=\"598.24\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(444.77 481.76) scale(1 -1) translate(-444.77 -481.76)\"/><line x1=\"362.79\" y1=\"365.29\" x2=\"444.77\" y2=\"365.29\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(403.78 365.29) scale(-1 1) translate(-403.78 -365.29)\"/><line x1=\"362.79\" y1=\"355.41\" x2=\"362.79\" y2=\"365.29\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(362.79 360.35) scale(1 -1) translate(-362.79 -360.35)\"/><polygon points=\"362.79,355.41 366.98,366 358.6,366\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"29.65\" y=\"688.12\" font-size=\"5.02\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">n8n request → finance decision → exact-match callback → recheck → posting/audit.</text><rect x=\"446.51\" y=\"501.18\" width=\"352.33\" height=\"197.65\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"446.51\" y=\"501.18\" width=\"352.33\" height=\"3.18\" rx=\"1.59\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"454.19\" y=\"517.94\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">D  Enterprise Databricks</text><text x=\"454.19\" y=\"529.65\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Current governed history and evidence</text><rect x=\"455.23\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"455.23\" y=\"540\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"462.91\" y=\"552.58\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Unity Catalog</text><text x=\"462.91\" y=\"563.89\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Grants + policy</text><rect x=\"566.86\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"566.86\" y=\"540\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"574.53\" y=\"552.58\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Delta / Lakehouse</text><text x=\"574.53\" y=\"563.89\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Balances + snapshots</text><rect x=\"678.49\" y=\"540\" width=\"111.63\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"678.49\" y=\"540\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"686.16\" y=\"552.58\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SQL Warehouse</text><text x=\"686.16\" y=\"563.89\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Scoped SQL</text><rect x=\"455.23\" y=\"592.94\" width=\"162.21\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"455.23\" y=\"592.94\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"462.91\" y=\"605.52\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Data Engineering Pipelines</text><text x=\"462.91\" y=\"616.83\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Freshness + load status</text><rect x=\"627.91\" y=\"592.94\" width=\"162.21\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"627.91\" y=\"592.94\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"635.58\" y=\"605.52\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Approved API / MCP access</text><text x=\"635.58\" y=\"616.83\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Bounded read + audit</text><text x=\"455.23\" y=\"652.83\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Data ownership, freshness and stored results: TO VALIDATE.</text><text x=\"455.23\" y=\"666.95\" font-size=\"5.02\" fill=\"#5B3F8C\" text-anchor=\"start\">UC grants + OAuth / service principal or delegated identity.</text><line x1=\"655.12\" y1=\"395.29\" x2=\"655.12\" y2=\"487.06\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\"/><line x1=\"655.12\" y1=\"487.06\" x2=\"675\" y2=\"487.06\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\"/><line x1=\"675\" y1=\"487.06\" x2=\"675\" y2=\"585.88\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\"/><line x1=\"675\" y1=\"585.88\" x2=\"704.65\" y2=\"585.88\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\"/><line x1=\"704.65\" y1=\"585.88\" x2=\"704.65\" y2=\"592.24\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\"/><polygon points=\"704.65,581.65 708.84,592.24 700.47,592.24\" fill=\"#0C8F76\" stroke=\"none\" transform=\"translate(704.65 586.94) rotate(180) translate(-704.65 -586.94)\"/><rect x=\"812.79\" y=\"501.18\" width=\"366.28\" height=\"197.65\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#6B6B6B\" stroke-width=\"0.56\"/><rect x=\"812.79\" y=\"501.18\" width=\"366.28\" height=\"3.18\" rx=\"1.59\" fill=\"#6B6B6B\" stroke=\"none\"/><text x=\"820.47\" y=\"517.94\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">E  SAP Business Data Cloud</text><text x=\"820.47\" y=\"529.65\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Future state · entitlement and scope TO VALIDATE</text><rect x=\"821.51\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"3.53\" fill=\"#F3F3F3\" stroke=\"#6B6B6B\" stroke-width=\"0.28\"/><text x=\"846.35\" y=\"561.05\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP Datasphere</text><rect x=\"933.14\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"3.53\" fill=\"#F3F3F3\" stroke=\"#6B6B6B\" stroke-width=\"0.28\"/><text x=\"959.12\" y=\"561.05\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP Databricks</text><rect x=\"1044.77\" y=\"540\" width=\"125.58\" height=\"40.59\" rx=\"3.53\" fill=\"#F3F3F3\" stroke=\"#6B6B6B\" stroke-width=\"0.28\"/><text x=\"1063.08\" y=\"561.05\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP Analytics Cloud (SAC)</text><rect x=\"821.51\" y=\"592.94\" width=\"348.84\" height=\"52.94\" rx=\"4.24\" fill=\"#F3F3F3\" stroke=\"#6B6B6B\" stroke-width=\"0.56\"/><rect x=\"821.51\" y=\"592.94\" width=\"2.79\" height=\"52.94\" rx=\"1.12\" fill=\"#6B6B6B\" stroke=\"none\"/><text x=\"829.19\" y=\"605.49\" font-size=\"6.97\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">BDC Connect · zero-copy sharing</text><text x=\"829.19\" y=\"616.82\" font-size=\"5.58\" fill=\"#506778\" text-anchor=\"start\">Future governed link with existing enterprise Databricks</text><text x=\"829.19\" y=\"626.7\" font-size=\"5.58\" fill=\"#506778\" text-anchor=\"start\">Bidirectional data products via Delta Sharing</text><text x=\"829.19\" y=\"636.59\" font-size=\"5.58\" fill=\"#506778\" text-anchor=\"start\">Provisioning, grants and product scope TO VALIDATE</text><line x1=\"798.84\" y1=\"610.59\" x2=\"820.81\" y2=\"610.59\" fill=\"none\" stroke=\"#6B6B6B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"816.63,605.29 820.81,615.88 812.44,615.88\" fill=\"#6B6B6B\" stroke=\"none\" transform=\"translate(816.63 610.59) rotate(90) translate(-816.63 -610.59)\"/><line x1=\"799.53\" y1=\"626.47\" x2=\"821.51\" y2=\"626.47\" fill=\"none\" stroke=\"#6B6B6B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(810.52 626.47) scale(-1 1) translate(-810.52 -626.47)\"/><polygon points=\"803.72,621.18 807.91,631.76 799.53,631.76\" fill=\"#6B6B6B\" stroke=\"none\" transform=\"translate(803.72 626.47) rotate(270) translate(-803.72 -626.47)\"/><line x1=\"717.56\" y1=\"421.76\" x2=\"717.56\" y2=\"488.82\" fill=\"none\" stroke=\"#6B6B6B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"717.56\" y1=\"488.82\" x2=\"973.26\" y2=\"488.82\" fill=\"none\" stroke=\"#6B6B6B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"973.26\" y1=\"488.82\" x2=\"973.26\" y2=\"500.47\" fill=\"none\" stroke=\"#6B6B6B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"973.26,489.88 977.44,500.47 969.07,500.47\" fill=\"#6B6B6B\" stroke=\"none\" transform=\"translate(973.26 495.18) rotate(180) translate(-973.26 -495.18)\"/><text x=\"821.51\" y=\"665.18\" font-size=\"5.3\" fill=\"#6B6B6B\" text-anchor=\"start\">Future retrieval through approved MCP capability, if selected.</text><ellipse cx=\"130.81\" cy=\"300\" rx=\"4.74\" ry=\"6\" fill=\"#0A4F9E\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"125.51\" y=\"302.36\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">1</text><ellipse cx=\"455.23\" cy=\"240\" rx=\"4.74\" ry=\"6\" fill=\"#0A4F9E\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"449.93\" y=\"242.36\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">2</text><ellipse cx=\"580.81\" cy=\"240\" rx=\"4.74\" ry=\"6\" fill=\"#0A4F9E\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"575.51\" y=\"242.36\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">3</text><ellipse cx=\"216.28\" cy=\"365.29\" rx=\"4.74\" ry=\"6\" fill=\"#0A4F9E\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"210.98\" y=\"367.65\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">4</text><ellipse cx=\"216.28\" cy=\"559.41\" rx=\"4.74\" ry=\"6\" fill=\"#C26A00\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"210.98\" y=\"561.77\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">5</text><ellipse cx=\"136.05\" cy=\"471.18\" rx=\"4.74\" ry=\"6\" fill=\"#0C8F76\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"130.74\" y=\"473.53\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">6</text><ellipse cx=\"150.7\" cy=\"665.29\" rx=\"4.74\" ry=\"6\" fill=\"#C26A00\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"145.4\" y=\"667.65\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">7</text><rect x=\"20.93\" y=\"709.41\" width=\"1158.14\" height=\"97.06\" rx=\"5.65\" fill=\"#FFFFFF\" stroke=\"#C9D5DE\" stroke-width=\"0.56\"/><text x=\"29.65\" y=\"725.85\" font-size=\"6.69\" font-weight=\"700\" fill=\"#0A4F9E\" text-anchor=\"start\">WORKED EXAMPLE  ·  company code 1000  ·  ledger 0L  ·  Nov 2026  ·  illustrative USD $25,000 variance</text><rect x=\"29.65\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.28\"/><text x=\"35.23\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">1–2  Sign-in + scope</text><text x=\"35.23\" y=\"759.42\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">User → app → AgentCore</text><rect x=\"219.77\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.28\"/><text x=\"225.35\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">3  Current SAP reads</text><text x=\"225.35\" y=\"759.42\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">S/4 · Central Finance · BW</text><rect x=\"409.88\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.28\"/><text x=\"415.47\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">4  Reconcile</text><text x=\"415.47\" y=\"759.42\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Snapshot / timestamps / tolerance</text><rect x=\"600\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.28\"/><text x=\"605.58\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">5  Explain</text><text x=\"605.58\" y=\"759.42\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Sanitized context → model</text><rect x=\"790.12\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.28\"/><text x=\"795.7\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">6  Read-only result</text><text x=\"795.7\" y=\"759.42\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Evidence-backed answer</text><rect x=\"980.23\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.28\"/><text x=\"985.81\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">7  If adjustment</text><text x=\"985.81\" y=\"759.42\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">n8n → recheck → posting → audit</text><text x=\"29.65\" y=\"795.06\" font-size=\"5.3\" fill=\"#5B3F8C\" text-anchor=\"start\">L2 identity caveat: Integration Suite / custom iFlow propagation is a candidate; prove identity mapping and ABAP roles at each SAP backend.</text><line x1=\"30\" y1=\"818.12\" x2=\"52.33\" y2=\"818.12\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.4\"/><polygon points=\"45.35,809.29 52.33,826.94 38.37,826.94\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(45.35 818.12) rotate(90) translate(-45.35 -818.12)\"/><text x=\"57.56\" y=\"820.48\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">read / result</text><line x1=\"132.56\" y1=\"818.12\" x2=\"154.88\" y2=\"818.12\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.4\"/><polygon points=\"147.91,809.29 154.88,826.94 140.93,826.94\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(147.91 818.12) rotate(90) translate(-147.91 -818.12)\"/><text x=\"160.47\" y=\"820.48\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">approval-gated write</text><line x1=\"268.6\" y1=\"818.12\" x2=\"290.93\" y2=\"818.12\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"1.12\" stroke-dasharray=\"4.46 3.35\"/><polygon points=\"285.35,811.06 290.93,825.18 279.77,825.18\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(285.35 818.12) rotate(90) translate(-285.35 -818.12)\"/><text x=\"296.51\" y=\"820.48\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">identity / credentials</text><line x1=\"425.58\" y1=\"818.12\" x2=\"447.91\" y2=\"818.12\" fill=\"none\" stroke=\"#6B6B6B\" stroke-width=\"1.12\" stroke-dasharray=\"4.46 3.35\"/><polygon points=\"442.33,811.06 447.91,825.18 436.74,825.18\" fill=\"#6B6B6B\" stroke=\"none\" transform=\"translate(442.33 818.12) rotate(90) translate(-442.33 -818.12)\"/><text x=\"453.49\" y=\"820.48\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">optional / future</text><text x=\"1062.35\" y=\"820.48\" font-size=\"4.74\" font-weight=\"700\" fill=\"#506778\" text-anchor=\"start\">S1 / L2  ·  22 NOV 2026  ·  REVIEW DRAFT</text></svg>\r\n", tt = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 840\" role=\"img\" aria-labelledby=\"t d\" font-family=\"'Segoe UI','Segoe UI Variable','Helvetica Neue',Arial,sans-serif\" text-rendering=\"geometricPrecision\" shape-rendering=\"geometricPrecision\"><title id=\"t\">S2 · AgentCore Gateway MCP</title><desc id=\"d\">Detailed L2 architecture diagram S2 · AgentCore Gateway MCP</desc><rect width=\"1200\" height=\"840\" fill=\"#F1F4F7\"/><rect x=\"0\" y=\"0\" width=\"1200\" height=\"840\" fill=\"#F1F4F7\" stroke=\"none\"/><rect x=\"0\" y=\"0\" width=\"1200\" height=\"58.24\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"20.93\" y=\"24.45\" font-size=\"12\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">AI FOUNDRY  /  MONTH-END RECONCILIATION</text><text x=\"21.63\" y=\"41.14\" font-size=\"6.97\" fill=\"#E8F1FB\" text-anchor=\"start\">L2  |  Worked reconciliation, identity and controls</text><rect x=\"945.35\" y=\"15.18\" width=\"233.72\" height=\"24.35\" rx=\"12.18\" fill=\"#FFF1E0\" stroke=\"none\"/><text x=\"999.93\" y=\"30.55\" font-size=\"7.25\" font-weight=\"700\" fill=\"#C26A00\" text-anchor=\"start\">S2  ·  AgentCore Gateway MCP</text><text x=\"20.93\" y=\"70.47\" font-size=\"5.58\" font-weight=\"700\" fill=\"#506778\" text-anchor=\"start\">ARCHITECTURE REVIEW DRAFT  ·  logically aligned; integration, identity and finance controls pending validation</text><rect x=\"20.93\" y=\"79.41\" width=\"537.21\" height=\"46.59\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"79.41\" width=\"537.21\" height=\"3.18\" rx=\"1.59\" fill=\"#5B3F8C\" stroke=\"none\"/><text x=\"28.6\" y=\"96.18\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">A  AI Foundry · design time</text><text x=\"28.6\" y=\"107.88\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Source, tool contracts and deployment pipeline; deployment interface TBD</text><rect x=\"31.4\" y=\"100.94\" width=\"104.65\" height=\"18.35\" rx=\"3.18\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.28\"/><text x=\"50.57\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Custom Foundry SDK</text><rect x=\"141.28\" y=\"100.94\" width=\"113.37\" height=\"18.35\" rx=\"3.18\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.28\"/><text x=\"160.77\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Local agent creation API</text><rect x=\"259.88\" y=\"100.94\" width=\"118.6\" height=\"18.35\" rx=\"3.18\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.28\"/><text x=\"274.55\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Python agent + tool bindings</text><rect x=\"383.72\" y=\"100.94\" width=\"162.21\" height=\"18.35\" rx=\"3.18\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.28\"/><text x=\"414.36\" y=\"113.18\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">GitLab · tests · CI/CD · deploy TBD</text><line x1=\"136.05\" y1=\"110.12\" x2=\"140.23\" y2=\"110.12\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><polygon points=\"137.44,106.59 140.23,113.65 134.65,113.65\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(137.44 110.12) rotate(90) translate(-137.44 -110.12)\"/><line x1=\"254.65\" y1=\"110.12\" x2=\"258.84\" y2=\"110.12\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><polygon points=\"256.05,106.59 258.84,113.65 253.26,113.65\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(256.05 110.12) rotate(90) translate(-256.05 -110.12)\"/><line x1=\"378.49\" y1=\"110.12\" x2=\"382.67\" y2=\"110.12\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><polygon points=\"379.88,106.59 382.67,113.65 377.09,113.65\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(379.88 110.12) rotate(90) translate(-379.88 -110.12)\"/><rect x=\"568.6\" y=\"79.41\" width=\"610.47\" height=\"46.59\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#C9D5DE\" stroke-width=\"0.56\"/><text x=\"579.07\" y=\"94.46\" font-size=\"5.86\" font-weight=\"700\" fill=\"#0A4F9E\" text-anchor=\"start\">SCENARIO INVARIANT</text><text x=\"579.07\" y=\"106.79\" font-size=\"6.97\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Only MCP gateway placement and its inbound / outbound auth controls change.</text><text x=\"579.07\" y=\"117.76\" font-size=\"5.58\" fill=\"#506778\" text-anchor=\"start\">Agent logic, domain tools, SAP integration, data, model and approval paths remain equivalent.</text><rect x=\"20.93\" y=\"132.35\" width=\"1158.14\" height=\"33.53\" rx=\"4.94\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><text x=\"28.95\" y=\"143.53\" font-size=\"5.3\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">IDENTITY &amp; CREDENTIAL PATH · CANDIDATE</text><text x=\"28.95\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">IdP → app user session</text><line x1=\"165\" y1=\"153.88\" x2=\"175.47\" y2=\"153.88\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"172.67,150.35 175.47,157.41 169.88,157.41\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(172.67 153.88) rotate(90) translate(-172.67 -153.88)\"/><text x=\"181.4\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">AgentCore inbound + workload</text><line x1=\"355.81\" y1=\"153.88\" x2=\"366.28\" y2=\"153.88\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"363.49,150.35 366.28,157.41 360.7,157.41\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(363.49 153.88) rotate(90) translate(-363.49 -153.88)\"/><text x=\"376.74\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Gateway inbound authZ</text><line x1=\"526.74\" y1=\"153.88\" x2=\"537.21\" y2=\"153.88\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"534.42,150.35 537.21,157.41 531.63,157.41\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(534.42 153.88) rotate(90) translate(-534.42 -153.88)\"/><text x=\"547.67\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Tool credential / operation policy</text><line x1=\"715.12\" y1=\"153.88\" x2=\"725.58\" y2=\"153.88\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"722.79,150.35 725.58,157.41 720,157.41\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(722.79 153.88) rotate(90) translate(-722.79 -153.88)\"/><text x=\"732.56\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">IS/iFlow propagation: TBD</text><line x1=\"906.98\" y1=\"153.88\" x2=\"917.44\" y2=\"153.88\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.56\" stroke-dasharray=\"2.23 1.67\"/><polygon points=\"914.65,150.35 917.44,157.41 911.86,157.41\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(914.65 153.88) rotate(90) translate(-914.65 -153.88)\"/><text x=\"927.91\" y=\"156.59\" font-size=\"5.3\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SCC if private → SAP user / ABAP</text><text x=\"1049.23\" y=\"144.25\" font-size=\"4.74\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">Delegation vs service identity: TO VALIDATE</text><rect x=\"132.56\" y=\"172.59\" width=\"446.51\" height=\"315.53\" rx=\"7.06\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"475.12\" y=\"162.71\" width=\"71.51\" height=\"12.71\" rx=\"3.18\" fill=\"#FFFFFF\" stroke=\"#C9D5DE\" stroke-width=\"0.28\"/><text x=\"480.63\" y=\"171.42\" font-size=\"5.02\" font-weight=\"700\" fill=\"#0A4F9E\" text-anchor=\"start\">AWS trust boundary</text><rect x=\"20.93\" y=\"176.47\" width=\"104.65\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"176.47\" width=\"104.65\" height=\"3.18\" rx=\"1.59\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"28.6\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">01  Business entry</text><text x=\"28.6\" y=\"204.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Human intent and app</text><rect x=\"136.05\" y=\"176.47\" width=\"313.95\" height=\"307.06\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"136.05\" y=\"176.47\" width=\"313.95\" height=\"3.18\" rx=\"1.59\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"143.72\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">02  AWS AgentCore</text><text x=\"143.72\" y=\"204.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Managed runtime + custom agent</text><rect x=\"460.47\" y=\"176.47\" width=\"115.12\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"460.47\" y=\"176.47\" width=\"115.12\" height=\"3.18\" rx=\"1.59\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"468.14\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">03  MCP gateway</text><text x=\"468.14\" y=\"204.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">AgentCore Gateway · inside AWS</text><rect x=\"586.05\" y=\"176.47\" width=\"139.53\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"586.05\" y=\"176.47\" width=\"139.53\" height=\"3.18\" rx=\"1.59\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"593.72\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">04  Domain MCP</text><text x=\"593.72\" y=\"204.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Finance-owned tool targets</text><rect x=\"736.05\" y=\"176.47\" width=\"143.02\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"736.05\" y=\"176.47\" width=\"143.02\" height=\"3.18\" rx=\"1.59\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"743.72\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">05  SAP BAIP</text><text x=\"743.72\" y=\"204.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Integration Suite · direct/iFlow route TBD</text><rect x=\"889.53\" y=\"176.47\" width=\"59.3\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><rect x=\"889.53\" y=\"176.47\" width=\"59.3\" height=\"3.18\" rx=\"1.59\" fill=\"#5B3F8C\" stroke=\"none\"/><text x=\"897.21\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">06  SCC</text><text x=\"897.21\" y=\"204.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Only if private</text><rect x=\"959.3\" y=\"176.47\" width=\"219.77\" height=\"307.06\" rx=\"4.74\" fill=\"#FFFFFF\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"959.3\" y=\"176.47\" width=\"219.77\" height=\"3.18\" rx=\"1.59\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"966.98\" y=\"193.24\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">07  SAP backends</text><text x=\"966.98\" y=\"204.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Distinct systems / authorizations</text><rect x=\"28.6\" y=\"215.29\" width=\"89.3\" height=\"42.35\" rx=\"4.24\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"215.29\" width=\"2.79\" height=\"42.35\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"36.28\" y=\"227.85\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Finance user</text><text x=\"36.28\" y=\"239.18\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Company code · ledger</text><text x=\"36.28\" y=\"249.06\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Period · scope</text><rect x=\"28.6\" y=\"268.24\" width=\"89.3\" height=\"48.71\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"268.24\" width=\"2.79\" height=\"48.71\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"36.28\" y=\"280.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Business application</text><text x=\"36.28\" y=\"292.12\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Chat / finance UI</text><text x=\"36.28\" y=\"302\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Authorized invocation</text><rect x=\"28.6\" y=\"328.24\" width=\"89.3\" height=\"49.41\" rx=\"4.24\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"328.24\" width=\"2.79\" height=\"49.41\" rx=\"1.12\" fill=\"#5B3F8C\" stroke=\"none\"/><text x=\"36.28\" y=\"340.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Enterprise IdP / SSO</text><text x=\"36.28\" y=\"352.12\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Human authentication</text><text x=\"36.28\" y=\"362\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">OIDC / SAML TBD</text><rect x=\"28.6\" y=\"388.24\" width=\"89.3\" height=\"51.18\" rx=\"4.23\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"28.6\" y=\"388.24\" width=\"2.79\" height=\"51.18\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"36.28\" y=\"400.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Business rule</text><text x=\"36.28\" y=\"412.12\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Read-only by default</text><text x=\"36.28\" y=\"422\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Writes need approval</text><line x1=\"73.26\" y1=\"257.65\" x2=\"73.26\" y2=\"266.82\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"0.84\"/><polygon points=\"73.26,256.24 77.44,266.82 69.07,266.82\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(73.26 261.53) rotate(180) translate(-73.26 -261.53)\"/><line x1=\"73.26\" y1=\"318\" x2=\"73.26\" y2=\"328.24\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(73.26 323.12) scale(1 -1) translate(-73.26 -323.12)\"/><polygon points=\"73.26,318 77.44,328.59 69.07,328.59\" fill=\"#5B3F8C\" stroke=\"none\"/><rect x=\"144.77\" y=\"213.53\" width=\"296.51\" height=\"148.24\" rx=\"4.24\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"144.77\" y=\"213.53\" width=\"2.79\" height=\"148.24\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"152.44\" y=\"226.06\" font-size=\"7.81\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Amazon Bedrock AgentCore Runtime</text><text x=\"152.44\" y=\"237.41\" font-size=\"5.58\" fill=\"#506778\" text-anchor=\"start\">Managed hosting for deployed custom Python agent</text><rect x=\"153.49\" y=\"250.59\" width=\"132.56\" height=\"47.65\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"153.49\" y=\"250.59\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"161.16\" y=\"263.15\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Agent + MCP client</text><text x=\"161.16\" y=\"274.47\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Custom · typed tool binding</text><text x=\"161.16\" y=\"284.36\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Trace / case ID</text><rect x=\"293.02\" y=\"250.59\" width=\"139.53\" height=\"47.65\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"293.02\" y=\"250.59\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"300.7\" y=\"263.15\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Context Manager</text><text x=\"300.7\" y=\"274.47\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Custom · scoped evidence</text><text x=\"300.7\" y=\"284.36\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Provenance / timestamps</text><rect x=\"153.49\" y=\"307.06\" width=\"132.56\" height=\"47.65\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"153.49\" y=\"307.06\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"161.16\" y=\"319.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Reconciliation Engine</text><text x=\"161.16\" y=\"330.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Custom · deterministic math</text><text x=\"161.16\" y=\"340.83\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Ledger / FX / tolerance</text><rect x=\"293.02\" y=\"307.06\" width=\"139.53\" height=\"47.65\" rx=\"4.23\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"293.02\" y=\"307.06\" width=\"2.79\" height=\"47.65\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"300.7\" y=\"319.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Posting Executor</text><text x=\"300.7\" y=\"330.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Custom · approved writes</text><text x=\"300.7\" y=\"340.83\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Rechecks + idempotency</text><rect x=\"153.49\" y=\"374.12\" width=\"87.21\" height=\"44.12\" rx=\"4.24\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><rect x=\"153.49\" y=\"374.12\" width=\"2.79\" height=\"44.12\" rx=\"1.12\" fill=\"#5B3F8C\" stroke=\"none\"/><text x=\"161.16\" y=\"386.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">AgentCore Identity</text><text x=\"161.16\" y=\"398.01\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">Managed credential access</text><text x=\"161.16\" y=\"407.89\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">Inbound/outbound design TBD</text><rect x=\"247.67\" y=\"374.12\" width=\"81.98\" height=\"44.12\" rx=\"4.24\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><rect x=\"247.67\" y=\"374.12\" width=\"2.79\" height=\"44.12\" rx=\"1.12\" fill=\"#5B3F8C\" stroke=\"none\"/><text x=\"255.35\" y=\"386.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">AgentCore Memory</text><text x=\"255.35\" y=\"398.01\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">Managed · optional</text><text x=\"255.35\" y=\"407.89\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">Conversation only</text><rect x=\"336.63\" y=\"374.12\" width=\"95.93\" height=\"44.12\" rx=\"4.24\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"336.63\" y=\"374.12\" width=\"2.79\" height=\"44.12\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"344.3\" y=\"386.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Observability</text><text x=\"344.3\" y=\"398.01\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">Managed traces/metrics</text><text x=\"344.3\" y=\"407.89\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">Case + audit correlation</text><text x=\"153.84\" y=\"439.3\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">AWS support: IAM / workload roles · Secrets Manager · KMS · CloudWatch</text><text x=\"153.84\" y=\"453.41\" font-size=\"5.3\" font-weight=\"700\" fill=\"#0A4F9E\" text-anchor=\"start\">Gateway integration: MCP client + versioned, typed tool bindings</text><rect x=\"468.84\" y=\"217.06\" width=\"98.37\" height=\"51.18\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"468.84\" y=\"217.06\" width=\"2.79\" height=\"51.18\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"476.51\" y=\"229.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">MCP entry</text><text x=\"476.51\" y=\"240.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Tool discovery / invoke</text><text x=\"476.51\" y=\"250.83\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Target type TBD</text><rect x=\"468.84\" y=\"277.06\" width=\"98.37\" height=\"52.94\" rx=\"4.24\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"468.84\" y=\"277.06\" width=\"2.79\" height=\"52.94\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"476.51\" y=\"289.62\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Inbound authZ</text><text x=\"476.51\" y=\"300.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Caller policy + scopes</text><text x=\"476.51\" y=\"310.83\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Operation allowlist TBD</text><rect x=\"468.84\" y=\"338.82\" width=\"98.37\" height=\"52.94\" rx=\"4.24\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"468.84\" y=\"338.82\" width=\"2.79\" height=\"52.94\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"476.51\" y=\"351.4\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Outbound target auth</text><text x=\"476.51\" y=\"362.71\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Separate target credential</text><text x=\"476.51\" y=\"372.59\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Exchange/delegation TBD</text><text x=\"470.23\" y=\"414.6\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Diagnostics: version · audit ID · timeout</text><text x=\"470.23\" y=\"430.48\" font-size=\"5.02\" font-weight=\"700\" fill=\"#0A4F9E\" text-anchor=\"start\">ONE selected gateway · no Portkey MCP</text><rect x=\"594.77\" y=\"215.29\" width=\"122.09\" height=\"65.29\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"215.29\" width=\"2.79\" height=\"65.29\" rx=\"1.12\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"602.44\" y=\"227.85\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP Finance · read</text><text x=\"602.44\" y=\"239.18\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">S/4 · Central Finance · BW</text><text x=\"602.44\" y=\"249.06\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Scoped read APIs</text><text x=\"602.44\" y=\"258.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">No direct database access</text><rect x=\"594.77\" y=\"291.18\" width=\"122.09\" height=\"58.24\" rx=\"4.23\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"291.18\" width=\"2.79\" height=\"58.24\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"602.44\" y=\"303.74\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP Finance · posting</text><text x=\"602.44\" y=\"315.06\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Restricted, typed API</text><text x=\"602.44\" y=\"324.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">S/4 default · TO VALIDATE</text><rect x=\"594.77\" y=\"358.24\" width=\"122.09\" height=\"37.06\" rx=\"4.24\" fill=\"#E5F5F2\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"358.24\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"602.44\" y=\"370.8\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Databricks · read</text><text x=\"602.44\" y=\"382.12\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Approved SQL / API · UC grants</text><rect x=\"594.77\" y=\"405.88\" width=\"122.09\" height=\"32.47\" rx=\"4.24\" fill=\"#F3F3F3\" stroke=\"#6B6B6B\" stroke-width=\"0.56\"/><rect x=\"594.77\" y=\"405.88\" width=\"2.79\" height=\"32.47\" rx=\"1.12\" fill=\"#6B6B6B\" stroke=\"none\"/><text x=\"602.44\" y=\"418.45\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">BDC · future read</text><text x=\"602.44\" y=\"429.77\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Optional approved MCP target</text><text x=\"594.77\" y=\"451.65\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Domain tool: owner · schema/version · input checks</text><text x=\"594.77\" y=\"462.24\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Per-operation authZ · bounded result · audit ID</text><rect x=\"744.77\" y=\"215.29\" width=\"125.58\" height=\"61.76\" rx=\"4.24\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"744.77\" y=\"215.29\" width=\"2.79\" height=\"61.76\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"752.44\" y=\"227.85\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">API Management</text><text x=\"752.44\" y=\"239.18\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Policies · API authorization</text><text x=\"752.44\" y=\"249.06\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Token exchange · scoped access</text><rect x=\"744.77\" y=\"287.65\" width=\"125.58\" height=\"61.76\" rx=\"4.24\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"744.77\" y=\"287.65\" width=\"2.79\" height=\"61.76\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"752.44\" y=\"300.21\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Cloud Integration</text><text x=\"752.44\" y=\"311.53\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Custom iFlows as needed</text><text x=\"752.44\" y=\"321.41\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Principal propagation candidate</text><text x=\"752.44\" y=\"331.3\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Route · error handling · trace</text><rect x=\"744.77\" y=\"360\" width=\"125.58\" height=\"58.24\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"744.77\" y=\"360\" width=\"2.79\" height=\"58.24\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"752.44\" y=\"372.56\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Destinations / connectivity</text><text x=\"752.44\" y=\"383.88\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">SAP API + identity mapping</text><text x=\"752.44\" y=\"393.77\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Backend ABAP auth still applies</text><text x=\"744.77\" y=\"435.77\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">API-managed direct or custom iFlow per target</text><text x=\"744.77\" y=\"448.12\" font-size=\"5.02\" fill=\"#5B3F8C\" text-anchor=\"start\">Identity mapping per backend: TO VALIDATE</text><rect x=\"896.51\" y=\"243.53\" width=\"45.35\" height=\"111.18\" rx=\"3.35\" fill=\"#F0EAF8\" stroke=\"#5B3F8C\" stroke-width=\"0.56\"/><rect x=\"896.51\" y=\"243.53\" width=\"2.79\" height=\"111.18\" rx=\"1.12\" fill=\"#5B3F8C\" stroke=\"none\"/><text x=\"904.19\" y=\"256.11\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Cloud</text><text x=\"904.19\" y=\"267.42\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Connector</text><text x=\"904.19\" y=\"277.3\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">private</text><text x=\"904.19\" y=\"287.18\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">network</text><text x=\"904.19\" y=\"297.07\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">only</text><text x=\"895.47\" y=\"374.01\" font-size=\"5.02\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">Private route</text><text x=\"895.47\" y=\"383.18\" font-size=\"5.02\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">and mapping</text><text x=\"895.47\" y=\"392.36\" font-size=\"5.02\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">need proof</text><rect x=\"968.02\" y=\"215.29\" width=\"202.33\" height=\"68.82\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"968.02\" y=\"215.29\" width=\"2.79\" height=\"68.82\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"975.7\" y=\"227.84\" font-size=\"7.25\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP S/4HANA</text><text x=\"975.7\" y=\"239.18\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Live G/L balances · journals · open items</text><text x=\"975.7\" y=\"249.06\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Custom ABAP read API · controlled posting API</text><text x=\"975.7\" y=\"258.94\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">SAP document reference + status</text><rect x=\"968.02\" y=\"294.71\" width=\"202.33\" height=\"68.82\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"968.02\" y=\"294.71\" width=\"2.79\" height=\"68.82\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"975.7\" y=\"307.26\" font-size=\"6.97\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP S/4HANA Central Finance</text><text x=\"975.7\" y=\"318.59\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Central posted / replicated accounting</text><text x=\"975.7\" y=\"328.47\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Source mapping · errors · status · cutoff</text><text x=\"975.7\" y=\"338.36\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Posting target not assumed</text><rect x=\"968.02\" y=\"374.12\" width=\"202.33\" height=\"68.82\" rx=\"4.23\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"968.02\" y=\"374.12\" width=\"2.79\" height=\"68.82\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"975.7\" y=\"386.66\" font-size=\"7.25\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP BW/4HANA</text><text x=\"975.7\" y=\"398\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Reporting aggregates / hierarchy</text><text x=\"975.7\" y=\"407.88\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Load and refresh status</text><text x=\"975.7\" y=\"417.77\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Read-only analytic role</text><text x=\"976.74\" y=\"273.42\" font-size=\"5.02\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">Mapped principal + ABAP roles: TO VALIDATE</text><text x=\"976.74\" y=\"352.83\" font-size=\"5.02\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">Mapped principal + ABAP roles: TO VALIDATE</text><text x=\"976.74\" y=\"432.24\" font-size=\"5.02\" font-weight=\"700\" fill=\"#5B3F8C\" text-anchor=\"start\">Mapped principal + ABAP roles: TO VALIDATE</text><line x1=\"117.91\" y1=\"300\" x2=\"144.07\" y2=\"300\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.4\"/><polygon points=\"137.09,291.18 144.07,308.82 130.12,308.82\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(137.09 300) rotate(90) translate(-137.09 -300)\"/><rect x=\"117.91\" y=\"282.71\" width=\"59.3\" height=\"12.71\" rx=\"3.18\" fill=\"#FFFFFF\" stroke=\"#C9D5DE\" stroke-width=\"0.28\"/><text x=\"125.42\" y=\"291.42\" font-size=\"5.02\" font-weight=\"700\" fill=\"#0A4F9E\" text-anchor=\"start\">intent · HTTPS</text><line x1=\"441.28\" y1=\"240\" x2=\"468.14\" y2=\"240\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.4\"/><polygon points=\"461.16,231.18 468.14,248.82 454.19,248.82\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(461.16 240) rotate(90) translate(-461.16 -240)\"/><line x1=\"567.56\" y1=\"240\" x2=\"594.07\" y2=\"240\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.4\"/><polygon points=\"587.09,231.18 594.07,248.82 580.12,248.82\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(587.09 240) rotate(90) translate(-587.09 -240)\"/><line x1=\"717.56\" y1=\"240\" x2=\"744.07\" y2=\"240\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.4\"/><polygon points=\"737.09,231.18 744.07,248.82 730.12,248.82\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(737.09 240) rotate(90) translate(-737.09 -240)\"/><line x1=\"807.56\" y1=\"277.06\" x2=\"807.56\" y2=\"286.94\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"0.84\"/><polygon points=\"807.56,276.35 811.74,286.94 803.37,286.94\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(807.56 281.65) rotate(180) translate(-807.56 -281.65)\"/><line x1=\"807.56\" y1=\"349.41\" x2=\"807.56\" y2=\"359.29\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"0.84\"/><polygon points=\"807.56,348.71 811.74,359.29 803.37,359.29\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(807.56 354) rotate(180) translate(-807.56 -354)\"/><line x1=\"840.7\" y1=\"277.06\" x2=\"840.7\" y2=\"286.94\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\"/><polygon points=\"840.7,276.35 844.88,286.94 836.51,286.94\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(840.7 281.65) rotate(180) translate(-840.7 -281.65)\"/><line x1=\"840.7\" y1=\"349.41\" x2=\"840.7\" y2=\"359.29\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\"/><polygon points=\"840.7,348.71 844.88,359.29 836.51,359.29\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(840.7 354) rotate(180) translate(-840.7 -354)\"/><line x1=\"870.35\" y1=\"247.06\" x2=\"883.26\" y2=\"247.06\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><line x1=\"883.26\" y1=\"210\" x2=\"883.26\" y2=\"247.06\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\" transform=\"translate(883.26 228.53) scale(1 -1) translate(-883.26 -228.53)\"/><line x1=\"883.26\" y1=\"210\" x2=\"952.33\" y2=\"210\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"210\" x2=\"952.33\" y2=\"249.53\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"249.53\" x2=\"967.33\" y2=\"249.53\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><polygon points=\"961.74,242.47 967.33,256.59 956.16,256.59\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(961.74 249.53) rotate(90) translate(-961.74 -249.53)\"/><line x1=\"952.33\" y1=\"249.53\" x2=\"952.33\" y2=\"328.24\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"328.24\" x2=\"967.33\" y2=\"328.24\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><polygon points=\"961.74,321.18 967.33,335.29 956.16,335.29\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(961.74 328.24) rotate(90) translate(-961.74 -328.24)\"/><line x1=\"952.33\" y1=\"328.24\" x2=\"952.33\" y2=\"407.65\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><line x1=\"952.33\" y1=\"407.65\" x2=\"967.33\" y2=\"407.65\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.12\"/><polygon points=\"961.74,400.59 967.33,414.71 956.16,414.71\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(961.74 407.65) rotate(90) translate(-961.74 -407.65)\"/><line x1=\"870.35\" y1=\"388.24\" x2=\"883.26\" y2=\"388.24\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"883.26\" y1=\"317.65\" x2=\"883.26\" y2=\"388.24\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(883.26 352.94) scale(1 -1) translate(-883.26 -352.94)\"/><line x1=\"883.26\" y1=\"317.65\" x2=\"895.81\" y2=\"317.65\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"891.63,312.35 895.81,322.94 887.44,322.94\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(891.63 317.65) rotate(90) translate(-891.63 -317.65)\"/><line x1=\"941.86\" y1=\"317.65\" x2=\"952.33\" y2=\"317.65\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"948.14,312.35 952.33,322.94 943.95,322.94\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(948.14 317.65) rotate(90) translate(-948.14 -317.65)\"/><text x=\"968.72\" y=\"462.95\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Direct API or iFlow/SCC route is selected per backend.</text><line x1=\"717.56\" y1=\"320.47\" x2=\"729.07\" y2=\"320.47\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><line x1=\"729.07\" y1=\"264.71\" x2=\"729.07\" y2=\"320.47\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\" transform=\"translate(729.07 292.59) scale(1 -1) translate(-729.07 -292.59)\"/><line x1=\"729.07\" y1=\"264.71\" x2=\"744.07\" y2=\"264.71\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><polygon points=\"738.49,257.65 744.07,271.76 732.91,271.76\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(738.49 264.71) rotate(90) translate(-738.49 -264.71)\"/><line x1=\"432.56\" y1=\"338.82\" x2=\"455.23\" y2=\"338.82\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><line x1=\"455.23\" y1=\"319.41\" x2=\"455.23\" y2=\"338.82\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\" transform=\"translate(455.23 329.12) scale(1 -1) translate(-455.23 -329.12)\"/><line x1=\"455.23\" y1=\"319.41\" x2=\"468.14\" y2=\"319.41\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><polygon points=\"462.56,312.35 468.14,326.47 456.98,326.47\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(462.56 319.41) rotate(90) translate(-462.56 -319.41)\"/><line x1=\"567.56\" y1=\"319.41\" x2=\"594.07\" y2=\"319.41\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><polygon points=\"588.49,312.35 594.07,326.47 582.91,326.47\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(588.49 319.41) rotate(90) translate(-588.49 -319.41)\"/><line x1=\"567.56\" y1=\"381.18\" x2=\"579.77\" y2=\"381.18\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"1.12\"/><line x1=\"579.77\" y1=\"381.18\" x2=\"579.77\" y2=\"390\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"1.12\"/><line x1=\"579.77\" y1=\"390\" x2=\"594.07\" y2=\"390\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"1.12\"/><polygon points=\"588.49,382.94 594.07,397.06 582.91,397.06\" fill=\"#0C8F76\" stroke=\"none\" transform=\"translate(588.49 390) rotate(90) translate(-588.49 -390)\"/><line x1=\"968.02\" y1=\"457.06\" x2=\"968.02\" y2=\"471.18\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"139.53\" y1=\"471.18\" x2=\"968.02\" y2=\"471.18\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(553.78 471.18) scale(-1 1) translate(-553.78 -471.18)\"/><polygon points=\"143.72,465.88 147.91,476.47 139.53,476.47\" fill=\"#0C8F76\" stroke=\"none\" transform=\"translate(143.72 471.18) rotate(270) translate(-143.72 -471.18)\"/><rect x=\"282.56\" y=\"457.06\" width=\"226.74\" height=\"12.71\" rx=\"3.18\" fill=\"#FFFFFF\" stroke=\"#C9D5DE\" stroke-width=\"0.28\"/><text x=\"312.77\" y=\"465.77\" font-size=\"5.02\" font-weight=\"700\" fill=\"#0C8F76\" text-anchor=\"start\">read results + source status return via same mediated path</text><rect x=\"20.93\" y=\"501.18\" width=\"415.12\" height=\"88.24\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"501.18\" width=\"415.12\" height=\"3.18\" rx=\"1.59\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"28.6\" y=\"517.94\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">B  LLM inference branch</text><text x=\"28.6\" y=\"529.65\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Selected, sanitized exception context only</text><rect x=\"29.65\" y=\"540\" width=\"160.47\" height=\"38.82\" rx=\"4.24\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"29.65\" y=\"540\" width=\"2.79\" height=\"38.82\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"37.33\" y=\"552.56\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Portkey · model governance</text><text x=\"37.33\" y=\"563.89\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Auth · routing · guardrails</text><text x=\"37.33\" y=\"573.77\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Redaction · logs · usage</text><rect x=\"244.19\" y=\"540\" width=\"181.4\" height=\"38.82\" rx=\"4.24\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.56\"/><rect x=\"244.19\" y=\"540\" width=\"2.79\" height=\"38.82\" rx=\"1.12\" fill=\"#0A4F9E\" stroke=\"none\"/><text x=\"251.86\" y=\"552.56\" font-size=\"6.41\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Amazon Bedrock · foundation model</text><text x=\"251.86\" y=\"563.89\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Approved model · explanation</text><text x=\"251.86\" y=\"573.77\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">No authoritative math / posting</text><line x1=\"190.12\" y1=\"559.41\" x2=\"243.49\" y2=\"559.41\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><polygon points=\"237.91,552.35 243.49,566.47 232.33,566.47\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(237.91 559.41) rotate(90) translate(-237.91 -559.41)\"/><line x1=\"190.81\" y1=\"571.76\" x2=\"244.19\" y2=\"571.76\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(217.5 571.76) scale(-1 1) translate(-217.5 -571.76)\"/><polygon points=\"195,566.47 199.19,577.06 190.81,577.06\" fill=\"#0C8F76\" stroke=\"none\" transform=\"translate(195 571.76) rotate(270) translate(-195 -571.76)\"/><line x1=\"209.3\" y1=\"362.47\" x2=\"209.3\" y2=\"367.06\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"132.56\" y1=\"367.06\" x2=\"209.3\" y2=\"367.06\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(170.93 367.06) scale(-1 1) translate(-170.93 -367.06)\"/><line x1=\"132.56\" y1=\"367.06\" x2=\"132.56\" y2=\"488.82\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"101.16\" y1=\"488.82\" x2=\"132.56\" y2=\"488.82\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(116.86 488.82) scale(-1 1) translate(-116.86 -488.82)\"/><line x1=\"101.16\" y1=\"488.82\" x2=\"101.16\" y2=\"539.29\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"101.16,528.71 105.35,539.29 96.98,539.29\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(101.16 534) rotate(180) translate(-101.16 -534)\"/><line x1=\"111.63\" y1=\"494.12\" x2=\"111.63\" y2=\"540\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(111.63 517.06) scale(1 -1) translate(-111.63 -517.06)\"/><line x1=\"111.63\" y1=\"494.12\" x2=\"127.33\" y2=\"494.12\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"127.33\" y1=\"370.59\" x2=\"127.33\" y2=\"494.12\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(127.33 432.35) scale(1 -1) translate(-127.33 -432.35)\"/><line x1=\"127.33\" y1=\"370.59\" x2=\"209.3\" y2=\"370.59\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"209.3\" y1=\"362.47\" x2=\"209.3\" y2=\"370.59\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(209.3 366.53) scale(1 -1) translate(-209.3 -366.53)\"/><polygon points=\"209.3,362.47 213.49,373.06 205.12,373.06\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"31.4\" y=\"585.77\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Minimized prompt; response via Portkey to Runtime; advisory only.</text><rect x=\"20.93\" y=\"603.53\" width=\"415.12\" height=\"95.29\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"20.93\" y=\"603.53\" width=\"415.12\" height=\"3.18\" rx=\"1.59\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"28.6\" y=\"620.29\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">C  n8n approval side path</text><text x=\"28.6\" y=\"632\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Only for a proposed financial write</text><rect x=\"29.65\" y=\"640.59\" width=\"111.63\" height=\"37.06\" rx=\"4.24\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"29.65\" y=\"640.59\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"37.33\" y=\"653.15\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Finance approver</text><text x=\"37.33\" y=\"664.48\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Verified decision</text><text x=\"37.33\" y=\"674.36\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Approve / reject</text><rect x=\"160.47\" y=\"640.59\" width=\"111.63\" height=\"37.06\" rx=\"4.24\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"160.47\" y=\"640.59\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"168.14\" y=\"653.15\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">n8n workflow</text><text x=\"168.14\" y=\"664.48\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Case version + hash</text><text x=\"168.14\" y=\"674.36\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Trusted callback</text><rect x=\"291.28\" y=\"640.59\" width=\"132.56\" height=\"37.06\" rx=\"4.24\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.56\"/><rect x=\"291.28\" y=\"640.59\" width=\"2.79\" height=\"37.06\" rx=\"1.12\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"298.95\" y=\"653.15\" font-size=\"6.13\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Executor recheck</text><text x=\"298.95\" y=\"664.48\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">SAP state + authorization</text><text x=\"298.95\" y=\"674.36\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Idempotency / retry stop</text><line x1=\"141.98\" y1=\"649.41\" x2=\"160.47\" y2=\"649.41\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" transform=\"translate(151.22 649.41) scale(-1 1) translate(-151.22 -649.41)\"/><polygon points=\"146.16,644.12 150.35,654.71 141.98,654.71\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(146.16 649.41) rotate(270) translate(-146.16 -649.41)\"/><line x1=\"141.28\" y1=\"665.29\" x2=\"159.77\" y2=\"665.29\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><polygon points=\"154.19,658.24 159.77,672.35 148.6,672.35\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(154.19 665.29) rotate(90) translate(-154.19 -665.29)\"/><line x1=\"272.09\" y1=\"660\" x2=\"290.58\" y2=\"660\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.12\"/><polygon points=\"285,652.94 290.58,667.06 279.42,667.06\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(285 660) rotate(90) translate(-285 -660)\"/><line x1=\"380.23\" y1=\"355.41\" x2=\"380.23\" y2=\"365.29\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"380.23\" y1=\"365.29\" x2=\"437.79\" y2=\"365.29\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"437.79\" y1=\"365.29\" x2=\"437.79\" y2=\"494.12\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"437.79\" y1=\"494.12\" x2=\"441.28\" y2=\"494.12\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"441.28\" y1=\"494.12\" x2=\"441.28\" y2=\"608.82\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"216.28\" y1=\"608.82\" x2=\"441.28\" y2=\"608.82\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(328.78 608.82) scale(-1 1) translate(-328.78 -608.82)\"/><line x1=\"216.28\" y1=\"608.82\" x2=\"216.28\" y2=\"639.88\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"216.28,629.29 220.47,639.88 212.09,639.88\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(216.28 634.59) rotate(180) translate(-216.28 -634.59)\"/><line x1=\"359.3\" y1=\"598.24\" x2=\"359.3\" y2=\"640.59\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(359.3 619.41) scale(1 -1) translate(-359.3 -619.41)\"/><line x1=\"359.3\" y1=\"598.24\" x2=\"444.77\" y2=\"598.24\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"444.77\" y1=\"365.29\" x2=\"444.77\" y2=\"598.24\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(444.77 481.76) scale(1 -1) translate(-444.77 -481.76)\"/><line x1=\"362.79\" y1=\"365.29\" x2=\"444.77\" y2=\"365.29\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(403.78 365.29) scale(-1 1) translate(-403.78 -365.29)\"/><line x1=\"362.79\" y1=\"355.41\" x2=\"362.79\" y2=\"365.29\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(362.79 360.35) scale(1 -1) translate(-362.79 -360.35)\"/><polygon points=\"362.79,355.41 366.98,366 358.6,366\" fill=\"#C26A00\" stroke=\"none\"/><text x=\"29.65\" y=\"688.12\" font-size=\"5.02\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">n8n request → finance decision → exact-match callback → recheck → posting/audit.</text><rect x=\"446.51\" y=\"501.18\" width=\"352.33\" height=\"197.65\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"446.51\" y=\"501.18\" width=\"352.33\" height=\"3.18\" rx=\"1.59\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"454.19\" y=\"517.94\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">D  Enterprise Databricks</text><text x=\"454.19\" y=\"529.65\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Current governed history and evidence</text><rect x=\"455.23\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"455.23\" y=\"540\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"462.91\" y=\"552.58\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Unity Catalog</text><text x=\"462.91\" y=\"563.89\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Grants + policy</text><rect x=\"566.86\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"566.86\" y=\"540\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"574.53\" y=\"552.58\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Delta / Lakehouse</text><text x=\"574.53\" y=\"563.89\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Balances + snapshots</text><rect x=\"678.49\" y=\"540\" width=\"111.63\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"678.49\" y=\"540\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"686.16\" y=\"552.58\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SQL Warehouse</text><text x=\"686.16\" y=\"563.89\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Scoped SQL</text><rect x=\"455.23\" y=\"592.94\" width=\"162.21\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"455.23\" y=\"592.94\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"462.91\" y=\"605.52\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Data Engineering Pipelines</text><text x=\"462.91\" y=\"616.83\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Freshness + load status</text><rect x=\"627.91\" y=\"592.94\" width=\"162.21\" height=\"40.59\" rx=\"4.23\" fill=\"#E5F5F2\" stroke=\"#0C8F76\" stroke-width=\"0.56\"/><rect x=\"627.91\" y=\"592.94\" width=\"2.79\" height=\"40.59\" rx=\"1.12\" fill=\"#0C8F76\" stroke=\"none\"/><text x=\"635.58\" y=\"605.52\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">Approved API / MCP access</text><text x=\"635.58\" y=\"616.83\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Bounded read + audit</text><text x=\"455.23\" y=\"652.83\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Data ownership, freshness and stored results: TO VALIDATE.</text><text x=\"455.23\" y=\"666.95\" font-size=\"5.02\" fill=\"#5B3F8C\" text-anchor=\"start\">UC grants + OAuth / service principal or delegated identity.</text><line x1=\"655.12\" y1=\"395.29\" x2=\"655.12\" y2=\"487.06\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\"/><line x1=\"655.12\" y1=\"487.06\" x2=\"675\" y2=\"487.06\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\"/><line x1=\"675\" y1=\"487.06\" x2=\"675\" y2=\"585.88\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\"/><line x1=\"675\" y1=\"585.88\" x2=\"704.65\" y2=\"585.88\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\"/><line x1=\"704.65\" y1=\"585.88\" x2=\"704.65\" y2=\"592.24\" fill=\"none\" stroke=\"#0C8F76\" stroke-width=\"0.84\"/><polygon points=\"704.65,581.65 708.84,592.24 700.47,592.24\" fill=\"#0C8F76\" stroke=\"none\" transform=\"translate(704.65 586.94) rotate(180) translate(-704.65 -586.94)\"/><rect x=\"812.79\" y=\"501.18\" width=\"366.28\" height=\"197.65\" rx=\"6\" fill=\"#FFFFFF\" stroke=\"#6B6B6B\" stroke-width=\"0.56\"/><rect x=\"812.79\" y=\"501.18\" width=\"366.28\" height=\"3.18\" rx=\"1.59\" fill=\"#6B6B6B\" stroke=\"none\"/><text x=\"820.47\" y=\"517.94\" font-size=\"8.09\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">E  SAP Business Data Cloud</text><text x=\"820.47\" y=\"529.65\" font-size=\"5.3\" fill=\"#506778\" text-anchor=\"start\">Future state · entitlement and scope TO VALIDATE</text><rect x=\"821.51\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"3.53\" fill=\"#F3F3F3\" stroke=\"#6B6B6B\" stroke-width=\"0.28\"/><text x=\"846.35\" y=\"561.05\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP Datasphere</text><rect x=\"933.14\" y=\"540\" width=\"104.65\" height=\"40.59\" rx=\"3.53\" fill=\"#F3F3F3\" stroke=\"#6B6B6B\" stroke-width=\"0.28\"/><text x=\"959.12\" y=\"561.05\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP Databricks</text><rect x=\"1044.77\" y=\"540\" width=\"125.58\" height=\"40.59\" rx=\"3.53\" fill=\"#F3F3F3\" stroke=\"#6B6B6B\" stroke-width=\"0.28\"/><text x=\"1063.08\" y=\"561.05\" font-size=\"5.86\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">SAP Analytics Cloud (SAC)</text><rect x=\"821.51\" y=\"592.94\" width=\"348.84\" height=\"52.94\" rx=\"4.24\" fill=\"#F3F3F3\" stroke=\"#6B6B6B\" stroke-width=\"0.56\"/><rect x=\"821.51\" y=\"592.94\" width=\"2.79\" height=\"52.94\" rx=\"1.12\" fill=\"#6B6B6B\" stroke=\"none\"/><text x=\"829.19\" y=\"605.49\" font-size=\"6.97\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">BDC Connect · zero-copy sharing</text><text x=\"829.19\" y=\"616.82\" font-size=\"5.58\" fill=\"#506778\" text-anchor=\"start\">Future governed link with existing enterprise Databricks</text><text x=\"829.19\" y=\"626.7\" font-size=\"5.58\" fill=\"#506778\" text-anchor=\"start\">Bidirectional data products via Delta Sharing</text><text x=\"829.19\" y=\"636.59\" font-size=\"5.58\" fill=\"#506778\" text-anchor=\"start\">Provisioning, grants and product scope TO VALIDATE</text><line x1=\"798.84\" y1=\"610.59\" x2=\"820.81\" y2=\"610.59\" fill=\"none\" stroke=\"#6B6B6B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"816.63,605.29 820.81,615.88 812.44,615.88\" fill=\"#6B6B6B\" stroke=\"none\" transform=\"translate(816.63 610.59) rotate(90) translate(-816.63 -610.59)\"/><line x1=\"799.53\" y1=\"626.47\" x2=\"821.51\" y2=\"626.47\" fill=\"none\" stroke=\"#6B6B6B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\" transform=\"translate(810.52 626.47) scale(-1 1) translate(-810.52 -626.47)\"/><polygon points=\"803.72,621.18 807.91,631.76 799.53,631.76\" fill=\"#6B6B6B\" stroke=\"none\" transform=\"translate(803.72 626.47) rotate(270) translate(-803.72 -626.47)\"/><line x1=\"717.56\" y1=\"421.76\" x2=\"717.56\" y2=\"488.82\" fill=\"none\" stroke=\"#6B6B6B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"717.56\" y1=\"488.82\" x2=\"973.26\" y2=\"488.82\" fill=\"none\" stroke=\"#6B6B6B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><line x1=\"973.26\" y1=\"488.82\" x2=\"973.26\" y2=\"500.47\" fill=\"none\" stroke=\"#6B6B6B\" stroke-width=\"0.84\" stroke-dasharray=\"3.35 2.51\"/><polygon points=\"973.26,489.88 977.44,500.47 969.07,500.47\" fill=\"#6B6B6B\" stroke=\"none\" transform=\"translate(973.26 495.18) rotate(180) translate(-973.26 -495.18)\"/><text x=\"821.51\" y=\"665.18\" font-size=\"5.3\" fill=\"#6B6B6B\" text-anchor=\"start\">Future retrieval through approved MCP capability, if selected.</text><ellipse cx=\"130.81\" cy=\"300\" rx=\"4.74\" ry=\"6\" fill=\"#0A4F9E\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"125.51\" y=\"302.36\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">1</text><ellipse cx=\"455.23\" cy=\"240\" rx=\"4.74\" ry=\"6\" fill=\"#0A4F9E\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"449.93\" y=\"242.36\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">2</text><ellipse cx=\"580.81\" cy=\"240\" rx=\"4.74\" ry=\"6\" fill=\"#0A4F9E\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"575.51\" y=\"242.36\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">3</text><ellipse cx=\"216.28\" cy=\"365.29\" rx=\"4.74\" ry=\"6\" fill=\"#0A4F9E\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"210.98\" y=\"367.65\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">4</text><ellipse cx=\"216.28\" cy=\"559.41\" rx=\"4.74\" ry=\"6\" fill=\"#C26A00\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"210.98\" y=\"561.77\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">5</text><ellipse cx=\"136.05\" cy=\"471.18\" rx=\"4.74\" ry=\"6\" fill=\"#0C8F76\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"130.74\" y=\"473.53\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">6</text><ellipse cx=\"150.7\" cy=\"665.29\" rx=\"4.74\" ry=\"6\" fill=\"#C26A00\" stroke=\"#FFFFFF\" stroke-width=\"0.84\"/><text x=\"145.4\" y=\"667.65\" font-size=\"5.3\" font-weight=\"700\" fill=\"#FFFFFF\" text-anchor=\"start\">7</text><rect x=\"20.93\" y=\"709.41\" width=\"1158.14\" height=\"97.06\" rx=\"5.65\" fill=\"#FFFFFF\" stroke=\"#C9D5DE\" stroke-width=\"0.56\"/><text x=\"29.65\" y=\"725.85\" font-size=\"6.69\" font-weight=\"700\" fill=\"#0A4F9E\" text-anchor=\"start\">WORKED EXAMPLE  ·  company code 1000  ·  ledger 0L  ·  Nov 2026  ·  illustrative USD $25,000 variance</text><rect x=\"29.65\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.28\"/><text x=\"35.23\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">1–2  Sign-in + scope</text><text x=\"35.23\" y=\"759.42\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">User → app → AgentCore</text><rect x=\"219.77\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.28\"/><text x=\"225.35\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">3  Current SAP reads</text><text x=\"225.35\" y=\"759.42\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">S/4 · Central Finance · BW</text><rect x=\"409.88\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.28\"/><text x=\"415.47\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">4  Reconcile</text><text x=\"415.47\" y=\"759.42\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Snapshot / timestamps / tolerance</text><rect x=\"600\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.28\"/><text x=\"605.58\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">5  Explain</text><text x=\"605.58\" y=\"759.42\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Sanitized context → model</text><rect x=\"790.12\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#E8F1FB\" stroke=\"#0A4F9E\" stroke-width=\"0.28\"/><text x=\"795.7\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">6  Read-only result</text><text x=\"795.7\" y=\"759.42\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">Evidence-backed answer</text><rect x=\"980.23\" y=\"734.12\" width=\"183.14\" height=\"44.12\" rx=\"3.53\" fill=\"#FFF1E0\" stroke=\"#C26A00\" stroke-width=\"0.28\"/><text x=\"985.81\" y=\"746.7\" font-size=\"5.58\" font-weight=\"700\" fill=\"#1D2D3E\" text-anchor=\"start\">7  If adjustment</text><text x=\"985.81\" y=\"759.42\" font-size=\"5.02\" fill=\"#506778\" text-anchor=\"start\">n8n → recheck → posting → audit</text><text x=\"29.65\" y=\"795.06\" font-size=\"5.3\" fill=\"#5B3F8C\" text-anchor=\"start\">L2 identity caveat: Integration Suite / custom iFlow propagation is a candidate; prove identity mapping and ABAP roles at each SAP backend.</text><line x1=\"30\" y1=\"818.12\" x2=\"52.33\" y2=\"818.12\" fill=\"none\" stroke=\"#0A4F9E\" stroke-width=\"1.4\"/><polygon points=\"45.35,809.29 52.33,826.94 38.37,826.94\" fill=\"#0A4F9E\" stroke=\"none\" transform=\"translate(45.35 818.12) rotate(90) translate(-45.35 -818.12)\"/><text x=\"57.56\" y=\"820.48\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">read / result</text><line x1=\"132.56\" y1=\"818.12\" x2=\"154.88\" y2=\"818.12\" fill=\"none\" stroke=\"#C26A00\" stroke-width=\"1.4\"/><polygon points=\"147.91,809.29 154.88,826.94 140.93,826.94\" fill=\"#C26A00\" stroke=\"none\" transform=\"translate(147.91 818.12) rotate(90) translate(-147.91 -818.12)\"/><text x=\"160.47\" y=\"820.48\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">approval-gated write</text><line x1=\"268.6\" y1=\"818.12\" x2=\"290.93\" y2=\"818.12\" fill=\"none\" stroke=\"#5B3F8C\" stroke-width=\"1.12\" stroke-dasharray=\"4.46 3.35\"/><polygon points=\"285.35,811.06 290.93,825.18 279.77,825.18\" fill=\"#5B3F8C\" stroke=\"none\" transform=\"translate(285.35 818.12) rotate(90) translate(-285.35 -818.12)\"/><text x=\"296.51\" y=\"820.48\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">identity / credentials</text><line x1=\"425.58\" y1=\"818.12\" x2=\"447.91\" y2=\"818.12\" fill=\"none\" stroke=\"#6B6B6B\" stroke-width=\"1.12\" stroke-dasharray=\"4.46 3.35\"/><polygon points=\"442.33,811.06 447.91,825.18 436.74,825.18\" fill=\"#6B6B6B\" stroke=\"none\" transform=\"translate(442.33 818.12) rotate(90) translate(-442.33 -818.12)\"/><text x=\"453.49\" y=\"820.48\" font-size=\"4.74\" fill=\"#506778\" text-anchor=\"start\">optional / future</text><text x=\"1062.35\" y=\"820.48\" font-size=\"4.74\" font-weight=\"700\" fill=\"#506778\" text-anchor=\"start\">S2 / L2  ·  22 NOV 2026  ·  REVIEW DRAFT</text></svg>\r\n", nt = {
	label: "Finance user",
	owner: "Experience",
	detail: "Fiori-style reconciliation request",
	out: "business intent",
	type: "ux"
}, L = {
	label: "SAP Integration Suite",
	owner: "SAP Integration",
	detail: "Approved API and iFlow mapping",
	out: "backend read",
	type: "sap"
}, rt = {
	label: "Cloud Connector",
	owner: "SAP connectivity",
	detail: "Controlled route to SAP landscape",
	out: "authorized call",
	type: "sap"
}, it = {
	label: "SAP finance backend",
	owner: "SAP Security + FI",
	detail: "S/4HANA and Central Finance role checks",
	out: "finance evidence",
	type: "sap"
}, at = {
	S1: {
		title: "S1 · Direct SAP Apigee MCP",
		status: "SAP domain baseline · direct access open",
		stages: [
			nt,
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
			L,
			rt,
			it
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
			nt,
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
			L,
			rt,
			it
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
			nt,
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
			L,
			rt,
			it
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
}, ot = {
	agentcore: {
		title: "AgentCore Runtime · agent hosting",
		status: "Leading validation candidate · conditional",
		stages: [
			nt,
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
			L,
			rt,
			it
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
			nt,
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
			L,
			rt,
			it
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
			nt,
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
			L,
			rt,
			it
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
			L,
			rt,
			it
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
}, st = "2026-11-24", ct = "TBD — REQUIRES VALIDATION", lt = {
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
}, ut = [
	"S1",
	"S2",
	"S3"
], dt = [
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
], ft = [
	[
		"Agent development environment",
		`Enterprise-approved pro-code (Python) agent environment. ${ct}`,
		`Same as S1. ${ct}`,
		`Same as S1. ${ct}`
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
		`Enterprise AI Foundry publication approval. ${ct}`,
		`Enterprise AI Foundry, or the AWS Agent Registry curator role. ${ct}`,
		`Enterprise AI Foundry as the single approver across both catalogs. ${ct}`
	],
	[
		"Source-code repository",
		`Organization Git repository for specs, tool definitions, policies and tests. ${ct}`,
		`Organization Git repository for server source, target schemas and infrastructure code. ${ct}`,
		`Organization Git repository covering both sides. ${ct}`
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
		`Two gateway logs. Correlation across them needs a propagated trace id. ${ct}`
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
], pt = [
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
], mt = "Vendor-documented · tenant NOT_VERIFIED", ht = "Design assumption", gt = ct, _t = "Read tools default; write tools only via the separate posting domain", vt = {
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
			_t,
			"API hub entry",
			mt
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
			_t,
			"OpenAPI spec in API hub",
			gt
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
			_t,
			"None (not a registry object)",
			ht
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
			gt
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
			gt
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
			ht
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
			_t,
			"Registry record (optional)",
			mt
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
			_t,
			"Registry record",
			mt
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
			_t,
			"Registry record",
			"Alternative; " + mt.toLowerCase()
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
			_t,
			"None",
			gt
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
			gt
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
			mt
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
			ht
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
			_t,
			"AWS Agent Registry reference",
			mt
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
			_t,
			"API hub entry; AWS record is a manual reference",
			gt
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
			_t,
			"OpenAPI spec in API hub",
			gt
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
			_t,
			"None",
			ht
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
			gt
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
			gt
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
			ht
		]
	]
}, yt = [
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
], bt = [
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
], xt = {
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
}, St = [
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
], Ct = `Sources were read on ${st}. Vendor documents describe product capability only. They are not evidence of our tenant's entitlement, activation or approval.`, R = (e, t, n, r, i, a) => ({
	id: e,
	row: t,
	col: n,
	title: r,
	sub: i,
	kind: a
}), wt = {
	idp: R("idp", 0, 0, "Enterprise identity provider", "OAuth 2.1 / OIDC · user and agent identity", "identity"),
	ent: R("ent", 3, 0, "Enterprise AI Foundry", "Publication and approval authority · TBD", "registry"),
	repo: R("repo", 4, 0, "Git repository", "Source, specs, tool definitions, tests", "artifact")
}, Tt = {
	S1: {
		cols: 5,
		nodes: [
			wt.idp,
			wt.ent,
			wt.repo,
			R("agent", 1, 0, "Agent runtime · MCP client", "Approved host · demo: AgentCore Runtime", "agent"),
			R("gw", 1, 1, "Apigee MCP endpoint", "MCP gateway · OAuth and API-product policy", "gateway"),
			R("dom", 1, 2, "SAP Finance domain tools", "Read domain and separate posting domain · derived from OpenAPI", "domain"),
			R("int", 1, 3, "SAP Integration Suite", "API and iFlow layer · Cloud Connector", "integration"),
			R("sap", 1, 4, "SAP S/4HANA · CF · BW/4HANA", "ABAP authorization boundary", "backend"),
			R("data", 2, 3, "Analytical MCP · Databricks / BDC", "Future state · entitlement TO VALIDATE", "data"),
			R("hub", 3, 2, "Apigee API hub", "SAP-domain MCP catalog (proposed)", "registry"),
			R("reg", 3, 3, "Google Agent Registry", "Synced from API hub · maturity TO VALIDATE", "registry"),
			R("cicd", 4, 1, "CI/CD → Apigee deploy", "Proxies, products, policies", "artifact"),
			R("spec", 4, 2, "OpenAPI and tool specs", "Versioned in Git, registered in API hub", "artifact")
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
			wt.idp,
			wt.ent,
			wt.repo,
			R("agent", 1, 0, "Agent runtime · MCP client", "Approved host · demo: AgentCore Runtime", "agent"),
			R("gw", 1, 1, "AgentCore Gateway", "MCP gateway · inbound auth, outbound credentials · no custom tool code", "gateway"),
			R("dom", 1, 2, "Finance domain MCP server", "Coded server on AgentCore Runtime, or gateway-generated tools", "domain"),
			R("int", 1, 3, "SAP Integration Suite", "API and iFlow layer · Cloud Connector", "integration"),
			R("sap", 1, 4, "SAP S/4HANA · CF · BW/4HANA", "ABAP authorization boundary", "backend"),
			R("data", 2, 3, "Analytical MCP · Databricks / BDC", "Future state · entitlement TO VALIDATE", "data"),
			R("aid", 0, 1, "AgentCore Identity", "Credential providers for outbound auth", "identity"),
			R("reg", 3, 2, "AWS Agent Registry", "Discovery and approval · agent-registry namespace", "registry"),
			R("cicd", 4, 1, "CI/CD → AWS deploy", "Runtime image, gateway targets", "artifact"),
			R("ecr", 4, 2, "Container registry (ECR)", "Runtime image for the MCP server", "artifact")
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
			wt.idp,
			wt.ent,
			wt.repo,
			R("agent", 1, 0, "Agent runtime · MCP client", "Approved host · demo: AgentCore Runtime", "agent"),
			R("gw", 1, 1, "AgentCore Gateway", "First gateway · agent entry on AWS", "gateway"),
			R("gw2", 1, 2, "Apigee MCP endpoint", "Second gateway · SAP-domain policy", "gateway"),
			R("dom", 1, 3, "SAP Finance domain tools", "Owned on the SAP-facing side · from OpenAPI", "domain"),
			R("int", 1, 4, "SAP Integration Suite", "API and iFlow layer", "integration"),
			R("sap", 1, 5, "SAP S/4HANA · CF · BW/4HANA", "ABAP authorization boundary", "backend"),
			R("data", 2, 4, "Analytical MCP · Databricks / BDC", "Future state · TO VALIDATE", "data"),
			R("aid", 0, 1, "AgentCore Identity", "Outbound token handling", "identity"),
			R("areg", 3, 1, "AWS Agent Registry", "Reference record · manual or custom sync", "registry"),
			R("hub", 3, 3, "Apigee API hub", "SAP-domain source of truth (proposed)", "registry"),
			R("cicd", 4, 2, "CI/CD → both platforms", "Apigee bundle and AWS target", "artifact"),
			R("spec", 4, 3, "Specs and interface contract", "OpenAPI plus cross-gateway contract", "artifact")
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
}, Et = {
	control: "#FFFFFF",
	decision: "#FFF8EE",
	agent: "#E8F1FB",
	gateway: "#FFF1E0",
	domain: "#EAF6EC",
	integration: "#F0EAF8",
	backend: "#E3E9EF",
	data: "#EEF2F5",
	registry: "#E5F5F2",
	artifact: "#F3F3F3",
	identity: "#FFF7DA"
}, Dt = {
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
	},
	return: {
		c: "#0C8F76",
		w: 2.2,
		d: "7 4"
	}
}, Ot = [
	["invoke", "Runtime invocation"],
	["registry", "Registry / discovery"],
	["deploy", "Deployment / artifacts"],
	["identity", "Identity / authentication"],
	["approval", "Approval-gated operation"]
], kt = {
	google: "#C26A00",
	aws: "#0A4F9E",
	sap: "#5B3F8C"
}, At = (e) => String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function jt(e, t) {
	let n = [], r = "";
	for (let i of String(e).split(" ")) (r + " " + i).trim().length > t && r ? (n.push(r), r = i) : r = (r + " " + i).trim();
	return r && n.push(r), n;
}
var Mt = [
	[104, "IDENTITY AND SECURITY"],
	[224, "RUNTIME INVOCATION PATH"],
	[392, "DATA / ANALYTICS BRANCH"],
	[514, "REGISTRY AND DISCOVERY (NOT AN INVOCATION HOP)"],
	[654, "ARTIFACT REPOSITORY AND DEPLOYMENT"]
], Nt = "Proposed design for review. Vendor names are design projections, not connected services. Placeholders are not tenant addresses. Registry and deployment arrows are not invocation traffic.";
function Pt(e) {
	let t = Tt[e], n = lt[e];
	return Ft({
		...t,
		title: `${n.label} · MCP topology`,
		chain: n.chain,
		banner: "PROPOSED DESIGN · NOT TENANT-VERIFIED · NOT AN APPROVED ARCHITECTURE",
		captions: Mt,
		legend: Ot,
		footer: Nt
	});
}
function Ft(e) {
	let t = e.height || 840, n = e.nh || 92, r = (1140 - (e.cols - 1) * 30) / e.cols, i = e.ys || [
		118,
		258,
		398,
		528,
		668
	], a = {};
	for (let t of e.nodes) {
		let e = t.span || 1;
		a[t.id] = {
			x: 30 + t.col * (r + 30),
			y: i[t.row],
			w: e * r + (e - 1) * 30,
			h: t.h || n,
			n: t
		};
	}
	let o = [];
	for (let [t, n, r] of e.bounds) {
		let e = n.map((e) => a[e]), i = Math.min(...e.map((e) => e.x)) - 10, s = Math.min(...e.map((e) => e.y)) - 24, c = Math.max(...e.map((e) => e.x + e.w)) + 10, l = Math.max(...e.map((e) => e.y + e.h)) + 10;
		o.push(`<rect x="${i}" y="${s}" width="${c - i}" height="${l - s}" rx="8" fill="none" stroke="${kt[r]}" stroke-width="2" stroke-dasharray="14 5"/>`), o.push(`<text x="${i + 8}" y="${s + 15}" font-size="12" font-weight="700" fill="${kt[r]}">${At(t)}</text>`);
	}
	let s = (e, t, n = "end") => o.push(`<text x="${n === "end" ? 1170 : 30}" y="${e}" font-size="11.5" font-weight="700" fill="#506778" text-anchor="${n}">${t}</text>`);
	for (let [t, n, r] of e.captions) s(t, n, r);
	let c = [], l = [], u = {};
	for (let [t, n, r, i, s = {}] of e.edges) {
		let e = r === "identity" ? u[t] = (u[t] ?? -1) + 1 : 0, d = a[t], f = a[n], p = s.active ? {
			...Dt[r],
			c: "#E9730C",
			w: Dt[r].w + 1
		} : Dt[r], m = {
			x: d.x + d.w / 2,
			y: d.y + d.h / 2
		}, h = {
			x: f.x + f.w / 2,
			y: f.y + f.h / 2
		}, g, _, v, y, b, x, S;
		if (r === "return" && d.n.row === f.n.row && !s.straight) {
			let e = d.x + d.w / 2, t = f.x + f.w / 2, n = d.y + d.h, r = n + 56;
			g = `M${e},${n} L${e},${r} L${t},${r} L${t},${n}`, _ = (e + t) / 2, v = r - 7, y = t, b = n, x = 0, S = -1;
		} else if (d.n.row === f.n.row) {
			let e = d.x < f.x, t = e ? d.x + d.w : d.x, n = e ? f.x : f.x + f.w, i = m.y + (r === "identity" ? 14 : 0);
			g = `M${t},${i} L${n},${i}`, _ = (t + n) / 2, v = d.y + d.h + (d.n.row === 1 ? 26 : 14), y = n, b = i, x = e ? 1 : -1, S = 0;
		} else {
			let t = d.y < f.y, n = t ? d.y + d.h : d.y, i = t ? f.y : f.y + f.h, a = r === "identity" ? 14 + e * 40 : r === "approval" ? -12 : s.off || 0, o = m.x + a, c = h.x + a, l = s.my ?? (n + i) / 2;
			g = `M${o},${n} L${o},${l} L${c},${l} L${c},${i}`, r === "identity" ? (_ = o, v = n + (t ? 18 + e * 14 : -8)) : s.labelAt === "mid" ? (_ = (o + c) / 2, v = l - 6) : (_ = c, v = t ? i - 8 : i + 20), y = c, b = i, x = 0, S = t ? 1 : -1;
		}
		o.push(`<path d="${g}" fill="none" stroke="${p.c}" stroke-width="${p.w}"${p.d ? ` stroke-dasharray="${p.d}"` : ""}${s.active ? " class=\"live-flow\"" : ""} data-edge="${t}-${n}"/>`), l.push(x === 0 ? `<polygon points="${y},${b} ${y - 7 * .7},${b - S * 7 * 1.6} ${y + 7 * .7},${b - S * 7 * 1.6}" fill="${p.c}"/>` : `<polygon points="${y},${b} ${y - x * 7 * 1.6},${b - 7 * .7} ${y - x * 7 * 1.6},${b + 7 * .7}" fill="${p.c}"/>`), i && c.push([
			_,
			v,
			i,
			p.c
		]);
	}
	o.push(...l);
	for (let t of e.nodes) {
		let e = a[t.id], n = `${t.stage ? " data-stage=\"1\"" : ""}${t.kind === "control" ? " data-control=\"1\"" : ""}`;
		o.push(`<rect data-node="${t.id}"${n} x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="7" fill="${Et[t.kind]}" stroke="${t.stroke || "#506778"}" stroke-width="${t.strokeWidth || 1.4}"${t.dashed ? " stroke-dasharray=\"7 4\"" : ""}${t.cls ? ` class="${t.cls}"` : ""}/>`);
		let r = jt(t.title, Math.floor(e.w / 7.1)).slice(0, 2);
		r.forEach((t, n) => o.push(`<text x="${e.x + 8}" y="${e.y + 20 + n * 15}" font-size="12.5" font-weight="700" fill="#1D2D3E">${At(t)}</text>`)), jt(t.sub, Math.floor((e.w - 8) / 5.7)).slice(0, Math.max(2, Math.floor((e.h - 20 - r.length * 15 - 8) / 12.5) - +!!t.status)).forEach((t, n) => o.push(`<text x="${e.x + 8}" y="${e.y + 20 + r.length * 15 + n * 12.5}" font-size="10.5" fill="#34495C">${At(t)}</text>`)), t.status && o.push(`<text x="${e.x + 8}" y="${e.y + e.h - 9}" font-size="10.5" font-weight="700" fill="${t.statusColor || "#34495C"}">${At(t.status)}</text>`), t.zone && o.push(`<rect data-zone="${At(t.zone)}" x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="7" fill="transparent"/>`);
	}
	for (let [e, t, n, r] of c) {
		let i = n.length * 5.6 + 10;
		o.push(`<rect x="${e - i / 2}" y="${t - 11}" width="${i}" height="15" rx="3" fill="#F1F4F7" opacity="0.94"/><text x="${e}" y="${t}" font-size="10.5" font-weight="600" fill="${r}" text-anchor="middle">${At(n)}</text>`);
	}
	let d = 30;
	o.push(`<rect x="22" y="${t - 54}" width="1156" height="40" rx="6" fill="#FFFFFF" stroke="#D9E1E7"/>`), o.push(`<text x="30" y="${t - 36}" font-size="11" font-weight="700" fill="#506778">LEGEND</text>`);
	for (let [n, r] of e.legend) {
		let e = Dt[n];
		o.push(`<line x1="${d + 60}" y1="${t - 40}" x2="${d + 90}" y2="${t - 40}" stroke="${e.c}" stroke-width="${e.w}"${e.d ? ` stroke-dasharray="${e.d}"` : ""}/><text x="${d + 96}" y="${t - 36}" font-size="11" fill="#1D2D3E">${At(r)}</text>`), d += 96 + r.length * 5.4 + 8;
	}
	o.push(`<text x="30" y="${t - 20}" font-size="10.5" fill="#506778">${At(e.footer)}</text>`);
	let f = e.title;
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 ${t}" role="img" aria-labelledby="t d" font-family="'Segoe UI','Segoe UI Variable','Helvetica Neue',Arial,sans-serif" text-rendering="geometricPrecision"><title id="t">${At(f)}</title><desc id="d">${At(e.chain)}</desc><rect width="1200" height="${t}" fill="#F1F4F7"/><text x="30" y="40" font-size="20" font-weight="700" fill="#1D2D3E">${At(f)}</text><text x="30" y="62" font-size="12" fill="#34495C">${At(e.chain.length > 150 ? e.chain.slice(0, 147) + "…" : e.chain)}</text><text x="30" y="82" font-size="11" fill="#B3261E" font-weight="700">${At(e.banner)}</text>${o.join("")}</svg>\n`;
}
// src/landscapeDiagrams.js
var It = [...[
	"S1",
	"S2",
	"S3"
].map((e) => ({
	key: `mcp-${e}`,
	kind: "mcp",
	id: e,
	tab: at[e].title.split(" · ")[0] + " path",
	title: at[e].title
})), ...[
	["agentcore", "AgentCore"],
	["btp", "SAP BTP"],
	["microsoft", "Foundry"],
	["joule", "Joule"]
].map(([e, t]) => ({
	key: `host-${e}`,
	kind: "hosting",
	id: e,
	tab: `Host · ${t}`,
	title: ot[e].title
}))], Lt = (e, t, n, r, i, a, o = {}) => ({
	id: e,
	row: t,
	col: n,
	title: r,
	sub: i,
	kind: a,
	...o
}), Rt = [
	["invoke", "Request / tool call"],
	["return", "Evidence / response"],
	["identity", "Identity / authentication"]
], zt = [
	[104, "IDENTITY AND SECURITY"],
	[224, "REQUEST AND TOOL-CALL PATH"],
	[514, "CROSS-CUTTING CONTROLS · design dependencies, not proved connections"],
	[654, "OPEN DECISION"]
];
function Bt(e) {
	return e.type === "ux" ? "agent" : e.type === "agent" ? "domain" : e.type === "gateway" ? "gateway" : /backend/i.test(e.label) ? "backend" : "integration";
}
function Vt(e, t) {
	let n = (e === "mcp" ? at : ot)[t], r = n.stages.length, i = n.stages.map((e, t) => Lt(`s${t}`, 1, t, e.label, `${e.owner}. ${e.detail}`, Bt(e), {
		h: 124,
		stage: !0
	}));
	i.push(Lt("idp", 0, 0, "Identity and access", "Caller or service identity is proved at every hop. The SAP backend role check is the final authorization.", "identity"));
	let a = r / 4;
	n.controls.forEach(([e, t], n) => i.push(Lt(`c${n}`, 3, n * a, e, t, "control", {
		span: a,
		h: 108
	}))), i.push(Lt("decision", 4, 0, "Open decision", n.decision, "decision", {
		span: r,
		h: 70
	}));
	let o = n.stages.slice(1).map((e, t) => [
		`s${t}`,
		`s${t + 1}`,
		"invoke",
		n.stages[t].out
	]);
	o.push([
		`s${r - 1}`,
		"s0",
		"return",
		n.returnFlow
	]);
	let s = n.stages.findIndex((e) => e.type === "gateway");
	return o.push([
		"idp",
		"s1",
		"identity",
		"agent identity"
	]), s > 1 && o.push([
		"idp",
		`s${s}`,
		"identity",
		"tool credential"
	]), Ft({
		cols: r,
		nodes: i,
		edges: o,
		bounds: [[
			"SAP landscape",
			n.stages.map((e, t) => e.type === "sap" && t > 0 ? `s${t}` : null).filter(Boolean),
			"sap"
		]],
		captions: zt,
		legend: Rt,
		title: n.title,
		chain: n.stages.map((e) => e.label).join(" → "),
		banner: n.status.toUpperCase(),
		footer: "Proposed design for review. Vendor names are design projections, not connected services. Nothing here is an approved tenant architecture."
	});
}
// src/DetailedDiagrams.jsx
var Ht = 1200, Ut = 840, Wt = 12, Gt = [2, 4], z = (e, t, n) => Math.min(n, Math.max(t, e)), Kt = {
	S1: {
		id: "S1",
		tab: "S1 · Google Apigee MCP",
		title: "S1 · Google Apigee MCP",
		svg: et,
		gateway: "Google Apigee MCP, external to AWS",
		summary: "The custom agent runs on Amazon Bedrock AgentCore Runtime and reaches the finance-owned domain MCP tools, SAP BAIP and the SAP backends through one MCP gateway: Google Apigee, outside the AWS boundary. Apigee applies inbound authorization and outbound target credentials; read paths return results over the same mediated path."
	},
	S2: {
		id: "S2",
		tab: "S2 · AgentCore Gateway MCP",
		title: "S2 · AgentCore Gateway MCP",
		svg: tt,
		gateway: "AgentCore Gateway MCP, inside AWS",
		summary: "The same agent and downstream path, but the single MCP gateway is AgentCore Gateway inside the AWS trust boundary. Inbound authorization and outbound target credentials are applied by the gateway before the finance-owned domain MCP tools, SAP BAIP and the SAP backends."
	}
}, qt = Object.fromEntries(It.map((e) => {
	let t = (e.kind === "mcp" ? at : ot)[e.id];
	return [e.key, {
		id: e.key,
		tab: e.tab,
		title: e.title,
		svg: Vt(e.kind, e.id),
		file: `landscape-${e.key}`,
		png: !0,
		landscape: !0,
		data: t,
		summary: `${t.status}. ${t.decision}`
	}];
})), Jt = "Only MCP gateway placement and its inbound / outbound auth controls change. Agent logic, domain tools, SAP integration, data, model and approval paths remain equivalent.", Yt = [
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
], Xt = [
	"Delegation versus service identity: TO VALIDATE",
	"Integration Suite / iFlow identity propagation: TBD",
	"Mapped principal and ABAP roles at each SAP backend: TO VALIDATE",
	"Operation allowlist and outbound target credential or exchange: TBD",
	"Direct API versus iFlow / Cloud Connector route per backend; private route needs proof",
	"SAP Business Data Cloud and Databricks entitlement and scope: TO VALIDATE (future state)"
];
function Zt(e, t) {
	return e.replace("aria-labelledby=\"t d\"", `aria-labelledby="${t}-t ${t}-d"`).replace("id=\"t\"", `id="${t}-t"`).replace("id=\"d\"", `id="${t}-d"`);
}
function Qt(e) {
	return new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${e}`], { type: "image/svg+xml" });
}
function $t({ diagram: e, uid: t, view: n, onView: r, onFit: i, expanded: a, onExpand: o, compact: s, onPick: c }) {
	let l = e.w || Ht, u = e.h || Ut, d = (0, _.useRef)(null), f = (0, _.useRef)(null), p = (0, _.useRef)(null), m = (0, _.useRef)(n), h = (0, _.useRef)({
		s: .5,
		x: 0,
		y: 0
	}), g = (0, _.useRef)(!0), v = (0, _.useRef)(/* @__PURE__ */ new Map()), y = (0, _.useRef)(null);
	m.current = n;
	let b = (0, _.useRef)(r), x = (0, _.useRef)(i);
	b.current = r, x.current = i;
	let S = (0, _.useMemo)(() => Zt(e.svg, t), [e, t]), C = (0, _.useCallback)(() => {
		let e = f.current?.getBoundingClientRect();
		if (!e || !e.width || !e.height) return null;
		let t = Math.min((e.width - 16) / l, (e.height - 16) / u);
		return {
			s: t,
			x: (e.width - l * t) / 2,
			y: (e.height - u * t) / 2
		};
	}, [l, u]), w = (0, _.useCallback)(() => {
		let e = C();
		e && (h.current = e, g.current = !0, x.current(e));
	}, [C]);
	(0, _.useLayoutEffect)(() => {
		w();
	}, [
		w,
		a,
		e.id
	]), (0, _.useEffect)(() => {
		let e = f.current;
		if (!e || typeof ResizeObserver > "u") return;
		let t = new ResizeObserver(() => {
			if (g.current) w();
			else {
				let e = C();
				e && (h.current = e);
			}
		});
		return t.observe(e), () => t.disconnect();
	}, [w, C]);
	let T = (0, _.useCallback)((e, t, n) => {
		let r = m.current;
		if (!r) return;
		let i = Math.max(.05, h.current.s * .5), a = z(r.s * e, i, Wt), o = a / r.s;
		g.current = !1, b.current({
			s: a,
			x: t - (t - r.x) * o,
			y: n - (n - r.y) * o
		});
	}, []), E = (e) => {
		let t = f.current.getBoundingClientRect();
		T(e, t.width / 2, t.height / 2);
	}, D = (e, t) => {
		let n = m.current;
		n && (g.current = !1, b.current({
			...n,
			x: n.x + e,
			y: n.y + t
		}));
	}, O = () => {
		let e = f.current.getBoundingClientRect(), t = m.current, n = 1 / t.s;
		g.current = !1;
		let r = e.width / 2, i = e.height / 2;
		b.current({
			s: 1,
			x: r - (r - t.x) * n,
			y: i - (i - t.y) * n
		});
	};
	(0, _.useEffect)(() => {
		let e = f.current;
		if (!e) return;
		let t = (t) => {
			t.preventDefault();
			let n = e.getBoundingClientRect(), r = t.deltaMode === 1 ? 32 : t.deltaMode === 2 ? 400 : 1;
			T(Math.exp(-t.deltaY * r * (t.ctrlKey ? .01 : .0016)), t.clientX - n.left, t.clientY - n.top);
		};
		return e.addEventListener("wheel", t, { passive: !1 }), () => e.removeEventListener("wheel", t);
	}, [T]);
	let ee = (e) => {
		if (!e.target.closest("button") && (f.current.setPointerCapture?.(e.pointerId), v.current.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY
		}), d.current = {
			x: e.clientX,
			y: e.clientY
		}, v.current.size === 2)) {
			let [e, t] = [...v.current.values()];
			y.current = Math.hypot(e.x - t.x, e.y - t.y);
		}
	}, te = (e) => {
		let t = v.current.get(e.pointerId);
		if (!t) return;
		let n = {
			x: e.clientX,
			y: e.clientY
		};
		if (v.current.size === 1) D(n.x - t.x, n.y - t.y);
		else if (v.current.size === 2 && y.current) {
			v.current.set(e.pointerId, n);
			let [t, r] = [...v.current.values()], i = Math.hypot(t.x - r.x, t.y - r.y), a = f.current.getBoundingClientRect();
			T(i / y.current, (t.x + r.x) / 2 - a.left, (t.y + r.y) / 2 - a.top), y.current = i;
			return;
		}
		v.current.set(e.pointerId, n);
	}, ne = (e) => {
		let t = d.current;
		if (v.current.delete(e.pointerId), v.current.size < 2 && (y.current = null), c && t && e.type === "pointerup" && v.current.size === 0 && Math.hypot(e.clientX - t.x, e.clientY - t.y) < 5) {
			let t = f.current?.getRootNode?.(), n = (t?.elementFromPoint ? t : document).elementFromPoint(e.clientX, e.clientY)?.closest?.("[data-zone]");
			n && c(n.getAttribute("data-zone"));
		}
		d.current = null;
	}, re = (e) => {
		if (e.key === "+" || e.key === "=") E(1.25);
		else if (e.key === "-" || e.key === "_") E(.8);
		else if (e.key === "0") w();
		else if (e.key === "1") O();
		else if (e.key === "ArrowLeft") D(60, 0);
		else if (e.key === "ArrowRight") D(-60, 0);
		else if (e.key === "ArrowUp") D(0, 60);
		else if (e.key === "ArrowDown") D(0, -60);
		else if (e.key === "Escape" && a) o(!1);
		else return;
		e.preventDefault(), e.stopPropagation();
	};
	(0, _.useEffect)(() => {
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
	let ie = () => {
		if (a) document.fullscreenElement && document.exitFullscreen?.().catch(() => {}), o(!1);
		else {
			o(!0);
			try {
				p.current?.requestFullscreen?.().catch(() => {});
			} catch {}
		}
	}, ae = () => {
		let t = URL.createObjectURL(Qt(e.svg));
		window.open(t, "_blank", "noopener"), setTimeout(() => URL.revokeObjectURL(t), 6e4);
	}, oe = () => {
		let t = URL.createObjectURL(Qt(e.svg)), n = document.createElement("a");
		n.href = t, n.download = `${e.file || `finance-architecture-${e.id.toLowerCase()}`}.svg`, document.body.appendChild(n), n.click(), n.remove(), setTimeout(() => URL.revokeObjectURL(t), 1e3);
	}, se = (t) => {
		let n = URL.createObjectURL(Qt(e.svg)), r = new Image();
		r.onload = () => {
			let i = document.createElement("canvas");
			i.width = l * t, i.height = u * t, i.getContext("2d").drawImage(r, 0, 0, i.width, i.height), URL.revokeObjectURL(n), i.toBlob((n) => {
				if (!n) return;
				let r = URL.createObjectURL(n), i = document.createElement("a");
				i.href = r, i.download = `${e.file || `finance-architecture-${e.id.toLowerCase()}`}-${t}x.png`, document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
			}, "image/png");
		}, r.onerror = () => URL.revokeObjectURL(n), r.src = n;
	}, ce = Math.round((n?.s || 0) * 100), le = n ? `translate(${n.x}px,${n.y}px) scale(${n.s})` : "none";
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		ref: p,
		className: `dd-viewer ${a ? "expanded" : ""} ${s ? "compact" : ""}`,
		children: [/* @__PURE__ */ (0, k.jsxs)("div", {
			className: "dd-toolbar",
			role: "toolbar",
			"aria-label": `${e.title} viewer controls`,
			children: [/* @__PURE__ */ (0, k.jsxs)("strong", {
				className: "dd-viewer-title",
				children: [/* @__PURE__ */ (0, k.jsx)("span", {
					className: `dd-dot ${e.id.toLowerCase()}`,
					"aria-hidden": "true"
				}), e.title]
			}), /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "dd-tools",
				children: [
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: () => E(.8),
						"aria-label": `Zoom out ${e.id}`,
						title: "Zoom out (−)",
						children: "−"
					}),
					/* @__PURE__ */ (0, k.jsxs)("output", {
						className: "dd-zoom",
						"aria-live": "polite",
						"aria-label": `${e.id} zoom level`,
						children: [ce, "%"]
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: () => E(1.25),
						"aria-label": `Zoom in ${e.id}`,
						title: "Zoom in (+)",
						children: "+"
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: w,
						"aria-label": `Reset ${e.id} view to fit`,
						title: "Reset to fit (0)",
						children: "Reset"
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: O,
						"aria-label": `${e.id} actual size`,
						title: "Actual size, 100% (1)",
						children: "100%"
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: ie,
						"aria-label": a ? `Exit expanded ${e.id} view` : `Expand ${e.id} to full screen`,
						"aria-pressed": a,
						children: a ? "Close ✕" : "Expand ⤢"
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: ae,
						title: "Open the vector SVG in a new browser tab",
						children: "Open full-size ↗"
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: oe,
						title: "Download the vector SVG",
						children: "SVG ⤓"
					}),
					e.png && Gt.map((t) => /* @__PURE__ */ (0, k.jsxs)("button", {
						type: "button",
						onClick: () => se(t),
						"aria-label": `Download ${e.id} as ${t}x PNG`,
						title: `Download a ${l * t} x ${u * t} px PNG`,
						children: [
							"PNG ",
							t,
							"× ⤓"
						]
					}, t))
				]
			})]
		}), /* @__PURE__ */ (0, k.jsxs)("div", {
			ref: f,
			className: "dd-viewport",
			tabIndex: 0,
			role: "group",
			"aria-label": `${e.title} diagram. Scroll or pinch to zoom, drag to pan. Keys: plus and minus zoom, arrow keys pan, 0 resets, 1 actual size.`,
			onPointerDown: ee,
			onPointerMove: te,
			onPointerUp: ne,
			onPointerCancel: ne,
			onKeyDown: re,
			onDoubleClick: (e) => {
				if (e.target.closest("button")) return;
				let t = f.current.getBoundingClientRect();
				T(1.8, e.clientX - t.left, e.clientY - t.top);
			},
			children: [/* @__PURE__ */ (0, k.jsx)("div", {
				className: "dd-stage",
				"data-testid": `diagram-${e.id}`,
				style: {
					width: l,
					height: u,
					transform: le
				},
				dangerouslySetInnerHTML: { __html: S }
			}), /* @__PURE__ */ (0, k.jsx)("span", {
				className: "dd-hint",
				"aria-hidden": "true",
				children: "Scroll to zoom · drag to pan · double-click to zoom in"
			})]
		})]
	});
}
function en({ view: e = "S1", onView: t, onBack: n }) {
	let [r, i] = (0, _.useState)(null), [a, o] = (0, _.useState)(null), [s, c] = (0, _.useState)(!0), [l, u] = (0, _.useState)(null), d = e === "compare", f = (e) => {
		u(null), t(e);
	}, p = !!qt[e], m = qt[e] || Kt[d ? "S1" : e] || Kt.S1, h = (0, _.useCallback)((e) => {
		i(e), o(e);
	}, []), g = ["S1", "S2"];
	return /* @__PURE__ */ (0, k.jsxs)("main", {
		className: "detailed-diagrams",
		"aria-label": "Detailed architecture diagrams",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("header", {
				className: "surface dd-header",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "dd-title",
						children: [/* @__PURE__ */ (0, k.jsx)("span", {
							className: "eyebrow",
							children: p ? "ARCHITECTURE DIAGRAMS · LANDSCAPE PATH (GENERATED VECTOR)" : "ARCHITECTURE DIAGRAMS · DETAILED L2 VIEW (VECTOR)"
						}), /* @__PURE__ */ (0, k.jsx)("h2", { children: d ? "S1 and S2 side by side" : m.title })]
					}),
					/* @__PURE__ */ (0, k.jsx)("nav", {
						className: "dd-selector",
						role: "tablist",
						"aria-label": "Detailed diagram selection",
						children: [...g, "compare"].map((t) => /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": e === t,
							className: e === t ? "active" : "",
							onClick: () => f(t),
							children: t === "compare" ? "Compare side-by-side" : Kt[t].tab
						}, t))
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "dd-header-actions",
						children: [/* @__PURE__ */ (0, k.jsx)("span", {
							className: "pill warn",
							children: "PROPOSED DESIGN · REVIEW DRAFT · NOT TENANT-VERIFIED"
						}), /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							onClick: n,
							children: "← Complete architecture"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)("section", {
				className: "surface dd-summary",
				"aria-label": "Diagram summary",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
					className: "eyebrow",
					children: d ? "WHAT THIS VIEW SHOWS" : p ? "LANDSCAPE PATH · STATUS AND OPEN DECISION" : `${m.id} · MCP GATEWAY`
				}), /* @__PURE__ */ (0, k.jsx)("p", { children: d ? "Both detailed diagrams share one worked month-end reconciliation path. Use the synchronized viewers to inspect lane 03 (MCP gateway) and the AWS trust boundary, where they differ." : m.summary })] }), /* @__PURE__ */ (0, k.jsxs)("div", {
					className: "dd-invariant",
					children: [/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: "SCENARIO INVARIANT"
					}), /* @__PURE__ */ (0, k.jsx)("p", { children: Jt })]
				})]
			}),
			/* @__PURE__ */ (0, k.jsxs)("section", {
				className: "surface dd-landscape-bar",
				"aria-label": "Landscape diagrams",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
					className: "eyebrow",
					children: "LANDSCAPE PATHS"
				}), /* @__PURE__ */ (0, k.jsx)("strong", { children: "MCP route and agent-hosting diagrams" })] }), /* @__PURE__ */ (0, k.jsx)("nav", {
					className: "dd-selector",
					role: "tablist",
					"aria-label": "Landscape diagram selection",
					children: It.map((t) => /* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": e === t.key,
						className: e === t.key ? "active" : "",
						onClick: () => f(t.key),
						children: t.tab
					}, t.key))
				})]
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: `dd-body ${d ? "is-compare" : ""}`,
				children: [d ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "dd-compare-bar surface",
					children: [/* @__PURE__ */ (0, k.jsxs)("label", { children: [/* @__PURE__ */ (0, k.jsx)("input", {
						type: "checkbox",
						checked: s,
						onChange: (e) => c(e.target.checked)
					}), " Synchronize zoom and pan"] }), /* @__PURE__ */ (0, k.jsx)("span", { children: "Zoom into lane 03 and the AWS trust boundary to see where the two options differ." })]
				}), /* @__PURE__ */ (0, k.jsx)("div", {
					className: "dd-compare-grid",
					children: g.map((e, t) => /* @__PURE__ */ (0, k.jsx)($t, {
						diagram: Kt[e],
						uid: `dd-${e}-cmp`,
						compact: !0,
						view: t === 0 ? r : a,
						onView: (e) => {
							s ? h(e) : (t === 0 ? i : o)(e);
						},
						onFit: (e) => {
							s ? h(e) : (t === 0 ? i : o)(e);
						},
						expanded: l === e,
						onExpand: (t) => u(t ? e : null)
					}, e))
				})] }) : /* @__PURE__ */ (0, k.jsx)($t, {
					diagram: m,
					uid: `dd-${m.id}`,
					view: r,
					onView: i,
					onFit: i,
					expanded: l === m.id,
					onExpand: (e) => u(e ? m.id : null)
				}, m.id), p ? /* @__PURE__ */ (0, k.jsxs)("aside", {
					className: "surface dd-side",
					"aria-label": "Controls and open decision",
					children: [
						/* @__PURE__ */ (0, k.jsx)("h3", { children: "Cross-cutting controls" }),
						/* @__PURE__ */ (0, k.jsx)("ul", { children: m.data.controls.map(([e, t]) => /* @__PURE__ */ (0, k.jsxs)("li", { children: [
							/* @__PURE__ */ (0, k.jsxs)("strong", { children: [e, "."] }),
							" ",
							t
						] }, e)) }),
						/* @__PURE__ */ (0, k.jsx)("h3", { children: "Open decision" }),
						/* @__PURE__ */ (0, k.jsx)("p", { children: m.data.decision }),
						/* @__PURE__ */ (0, k.jsx)("p", {
							className: "micro",
							children: "Vendor-named components are design projections, not connected services."
						}),
						/* @__PURE__ */ (0, k.jsx)("a", {
							className: "text-link",
							href: m.data.source,
							target: "_blank",
							rel: "noreferrer",
							children: "Vendor reference ↗"
						}),
						/* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							className: "text-link",
							onClick: n,
							children: "Back to complete architecture →"
						})
					]
				}) : /* @__PURE__ */ (0, k.jsxs)("aside", {
					className: "surface dd-side",
					"aria-label": "Key differences and open validations",
					children: [
						/* @__PURE__ */ (0, k.jsx)("h3", { children: "What changes between S1 and S2" }),
						/* @__PURE__ */ (0, k.jsxs)("table", { children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, k.jsx)("th", {
								scope: "col",
								children: "Item"
							}),
							/* @__PURE__ */ (0, k.jsx)("th", {
								scope: "col",
								children: "S1"
							}),
							/* @__PURE__ */ (0, k.jsx)("th", {
								scope: "col",
								children: "S2"
							})
						] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: Yt.map(([t, n, r]) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, k.jsx)("th", {
								scope: "row",
								children: t
							}),
							/* @__PURE__ */ (0, k.jsx)("td", {
								className: e === "S2" ? "dim" : "",
								children: n
							}),
							/* @__PURE__ */ (0, k.jsx)("td", {
								className: e === "S1" ? "dim" : "",
								children: r
							})
						] }, t)) })] }),
						/* @__PURE__ */ (0, k.jsx)("h3", { children: "Open validations shown in the diagram" }),
						/* @__PURE__ */ (0, k.jsx)("ul", { children: Xt.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) }),
						/* @__PURE__ */ (0, k.jsx)("p", {
							className: "micro",
							children: "Vendor-named components are design projections, not connected services. S3 has no detailed L2 diagram; see the S3 landscape path."
						}),
						/* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							className: "text-link",
							onClick: n,
							children: "Back to complete architecture →"
						})
					]
				})]
			})
		]
	});
}
// src/ArchitectureDiagram.jsx
function tn({ kind: e, id: t, onClose: n, onDetails: r }) {
	let i = (e === "mcp" ? at : ot)[t], [a, o] = (0, _.useState)(null), [s, c] = (0, _.useState)(!1), l = (0, _.useMemo)(() => i ? {
		id: `${e}-${t}`,
		title: i.title,
		svg: Vt(e, t),
		file: `landscape-${e}-${t}`,
		png: !0
	} : null, [
		i,
		e,
		t
	]);
	return (0, _.useEffect)(() => {
		let e = (e) => {
			e.key === "Escape" && n();
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [n]), i ? /* @__PURE__ */ (0, k.jsx)("div", {
		className: "arch-diagram-backdrop",
		onMouseDown: (e) => {
			e.target === e.currentTarget && n();
		},
		children: /* @__PURE__ */ (0, k.jsxs)("section", {
			className: "surface arch-diagram-modal",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": `${i.title} architecture diagram`,
			children: [
				/* @__PURE__ */ (0, k.jsxs)("header", {
					className: "arch-diagram-header",
					children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsxs)("span", {
						className: "eyebrow",
						children: ["ARCHITECTURE DIAGRAM · ", e === "mcp" ? "MCP HOSTING PATH" : "AGENT HOSTING PATH"]
					}), /* @__PURE__ */ (0, k.jsx)("h2", { children: i.title })] }), /* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
						className: "pill warn",
						children: i.status
					}), /* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: n,
						autoFocus: !0,
						children: "Close"
					})] })]
				}),
				/* @__PURE__ */ (0, k.jsx)("div", {
					className: "arch-diagram-viewer",
					children: /* @__PURE__ */ (0, k.jsx)($t, {
						diagram: l,
						uid: `arch-${e}-${t}`,
						view: a,
						onView: o,
						onFit: o,
						expanded: s,
						onExpand: c
					})
				}),
				/* @__PURE__ */ (0, k.jsxs)("footer", {
					className: "arch-diagram-footer",
					children: [/* @__PURE__ */ (0, k.jsxs)("p", { children: [
						/* @__PURE__ */ (0, k.jsx)("strong", { children: "Open decision:" }),
						" ",
						i.decision
					] }), /* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("a", {
						href: i.source,
						target: "_blank",
						rel: "noreferrer",
						children: "Vendor reference ↗"
					}), r && /* @__PURE__ */ (0, k.jsx)("button", {
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
var nn = {
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
}, rn = [
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
], an = [
	{
		id: "S1",
		mcp: "SAP Apigee",
		entry: "Direct to Apigee",
		identity: "Agent host → Apigee → SAP",
		state: "Direct-access policy open"
	},
	{
		id: "S2",
		mcp: "SAP MCP adapter on AgentCore Runtime",
		entry: "AgentCore Gateway",
		identity: "Agent → Gateway → adapter → SAP",
		state: "AWS hosting approval open"
	},
	{
		id: "S3",
		mcp: "SAP Apigee behind AgentCore Gateway",
		entry: "AgentCore Gateway",
		identity: "Agent → Gateway → Apigee → SAP",
		state: "Combined path approval open"
	}
];
function on({ playbooks: e = {}, onQuestion: t, onDetailedDiagram: n, onGovernance: r, onAgentHosting: i }) {
	let [a, o] = (0, _.useState)("S1"), [s, c] = (0, _.useState)(null), [l, u] = (0, _.useState)(null), d = a === "compare" ? null : a, f = d ? nn[d] : null, p = d ? e[d] : null, m = d ? an.find((e) => e.id === d) : null;
	(0, _.useEffect)(() => {
		if (!s) return;
		let e = (e) => {
			e.key === "Escape" && c(null);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [s]);
	let h = [
		...rn,
		...[
			"Simplicity",
			"Cost efficiency",
			"Maintainability",
			"Future flexibility"
		].map((e, t) => [e, ...[
			"S1",
			"S2",
			"S3"
		].map((e) => `${nn[e].criteria[t][1]} — ${nn[e].criteria[t][2]}`)]),
		["Benefits", ...[
			"S1",
			"S2",
			"S3"
		].map((e) => nn[e].benefits.join(" • "))],
		["Tradeoffs", ...[
			"S1",
			"S2",
			"S3"
		].map((e) => nn[e].tradeoffs.join(" • "))],
		["Open decisions", ...[
			"S1",
			"S2",
			"S3"
		].map((t) => (e[t]?.decisions || []).join(" • "))]
	];
	return /* @__PURE__ */ (0, k.jsxs)("main", {
		className: "mcp-comparison mcp-bird arch-page",
		"aria-label": "Complete architecture",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("header", {
				className: "surface mcp-bird-header",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("h2", { children: "Complete architecture" }), /* @__PURE__ */ (0, k.jsx)("span", {
					className: "eyebrow",
					children: "AGENT → MCP → SAP, END TO END"
				})] }), /* @__PURE__ */ (0, k.jsx)("span", {
					className: "pill warn",
					children: "SYNTHETIC DESIGN · DECISIONS OPEN"
				})]
			}),
			/* @__PURE__ */ (0, k.jsx)("nav", {
				className: "surface mcp-route-tabs mcp-bird-tabs",
				role: "tablist",
				"aria-label": "Architecture approach details",
				children: [
					"S1",
					"S2",
					"S3",
					"compare"
				].map((e) => /* @__PURE__ */ (0, k.jsxs)("button", {
					type: "button",
					role: "tab",
					"aria-selected": a === e,
					className: a === e ? "active" : "",
					onClick: () => o(e),
					children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: e === "compare" ? "Compare all" : e }), /* @__PURE__ */ (0, k.jsx)("span", { children: e === "compare" ? "Three routes side by side" : nn[e].name })]
				}, e))
			}),
			d ? /* @__PURE__ */ (0, k.jsxs)("section", {
				className: "surface mcp-bird-panel arch-panel",
				role: "tabpanel",
				"aria-label": `${d} architecture overview`,
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "mcp-bird-panel-title",
						children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsxs)("span", {
							className: "eyebrow",
							children: [
								"ROUTE ",
								d,
								" · ",
								f.position
							]
						}), /* @__PURE__ */ (0, k.jsx)("h3", { children: f.name })] }), /* @__PURE__ */ (0, k.jsxs)("div", {
							className: "mcp-bird-title-actions",
							children: [/* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								className: "diagram-action",
								onClick: () => u({
									kind: "mcp",
									id: d
								}),
								children: "Architecture diagram ↗"
							}), /* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								onClick: () => c("route"),
								children: "Handoffs and proof →"
							})]
						})]
					}),
					/* @__PURE__ */ (0, k.jsx)("div", {
						className: "mcp-bird-path arch-path",
						"aria-label": "Selected request path",
						children: (p?.path || "").split(" → ").map((e, t) => /* @__PURE__ */ (0, k.jsxs)(_.Fragment, { children: [t > 0 && /* @__PURE__ */ (0, k.jsx)("span", {
							"aria-hidden": "true",
							children: "→"
						}), /* @__PURE__ */ (0, k.jsx)("b", { children: e })] }, e + t))
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "arch-grid",
						children: [
							/* @__PURE__ */ (0, k.jsxs)("section", {
								"aria-label": "Route facts",
								children: [/* @__PURE__ */ (0, k.jsx)("h4", { children: "How it connects" }), /* @__PURE__ */ (0, k.jsxs)("div", {
									className: "arch-cards",
									children: [
										/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "MCP endpoint" }), /* @__PURE__ */ (0, k.jsx)("b", { children: m.mcp })] }),
										/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Agent entry" }), /* @__PURE__ */ (0, k.jsx)("b", { children: m.entry })] }),
										/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Caller identity" }), /* @__PURE__ */ (0, k.jsx)("b", { children: m.identity })] }),
										/* @__PURE__ */ (0, k.jsxs)("div", {
											className: "warn",
											children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Open decision" }), /* @__PURE__ */ (0, k.jsx)("b", { children: m.state })]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, k.jsxs)("section", {
								"aria-label": "Route assessment",
								children: [/* @__PURE__ */ (0, k.jsx)("h4", { children: "How it scores" }), /* @__PURE__ */ (0, k.jsx)("div", {
									className: "arch-cards",
									children: f.criteria.map(([e, t, n]) => /* @__PURE__ */ (0, k.jsxs)("div", {
										title: n,
										children: [
											/* @__PURE__ */ (0, k.jsx)("span", { children: e }),
											/* @__PURE__ */ (0, k.jsx)("b", { children: t }),
											/* @__PURE__ */ (0, k.jsx)("small", { children: n })
										]
									}, e))
								})]
							}),
							/* @__PURE__ */ (0, k.jsxs)("section", {
								"aria-label": "Benefit and tradeoff",
								className: "arch-judgment",
								children: [
									/* @__PURE__ */ (0, k.jsx)("h4", { children: "Judgment" }),
									/* @__PURE__ */ (0, k.jsxs)("p", {
										className: "good",
										children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "Benefit" }), f.benefits[0]]
									}),
									/* @__PURE__ */ (0, k.jsxs)("p", {
										className: "bad",
										children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "Tradeoff" }), f.tradeoffs[0]]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "arch-links",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "Related, separate views:" }),
							r && /* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								className: "text-link",
								onClick: () => r(d),
								children: "MCP hosting →"
							}),
							i && /* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								className: "text-link",
								onClick: i,
								children: "Agent hosting →"
							}),
							n && (d === "S1" || d === "S2") && /* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								className: "text-link",
								onClick: () => n(d),
								children: "Detailed diagram (zoom) →"
							})
						]
					})
				]
			}) : /* @__PURE__ */ (0, k.jsxs)("section", {
				className: "surface mcp-bird-panel mcp-bird-compare arch-panel",
				role: "tabpanel",
				"aria-label": "Route comparison overview",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "mcp-bird-panel-title",
					children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: "COMPLETE ARCHITECTURE · SIDE BY SIDE"
					}), /* @__PURE__ */ (0, k.jsx)("h3", { children: "Three routes, one decision view" })] }), /* @__PURE__ */ (0, k.jsxs)("div", {
						className: "mcp-bird-title-actions",
						children: [n && /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							onClick: () => n("compare"),
							children: "Compare S1 and S2 detailed diagrams →"
						}), /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							onClick: () => c("compare"),
							children: "View full control matrix →"
						})]
					})]
				}), /* @__PURE__ */ (0, k.jsx)("div", {
					className: "mcp-bird-compare-grid",
					children: an.map((e) => {
						let t = nn[e.id];
						return /* @__PURE__ */ (0, k.jsxs)("article", { children: [
							/* @__PURE__ */ (0, k.jsxs)("h4", { children: [
								e.id,
								" · ",
								t.name
							] }),
							/* @__PURE__ */ (0, k.jsxs)("dl", { children: [
								/* @__PURE__ */ (0, k.jsx)("dt", { children: "MCP" }),
								/* @__PURE__ */ (0, k.jsx)("dd", { children: e.mcp }),
								/* @__PURE__ */ (0, k.jsx)("dt", { children: "Entry" }),
								/* @__PURE__ */ (0, k.jsx)("dd", { children: e.entry }),
								/* @__PURE__ */ (0, k.jsx)("dt", { children: "Identity" }),
								/* @__PURE__ */ (0, k.jsx)("dd", { children: e.identity }),
								/* @__PURE__ */ (0, k.jsx)("dt", { children: "Simplicity" }),
								/* @__PURE__ */ (0, k.jsx)("dd", { children: t.criteria[0][1] }),
								/* @__PURE__ */ (0, k.jsx)("dt", { children: "Cost" }),
								/* @__PURE__ */ (0, k.jsx)("dd", { children: t.criteria[1][1] }),
								/* @__PURE__ */ (0, k.jsx)("dt", { children: "Maintenance" }),
								/* @__PURE__ */ (0, k.jsx)("dd", { children: t.criteria[2][1] }),
								/* @__PURE__ */ (0, k.jsx)("dt", { children: "Flexibility" }),
								/* @__PURE__ */ (0, k.jsx)("dd", { children: t.criteria[3][1] })
							] }),
							/* @__PURE__ */ (0, k.jsx)("span", { children: e.state })
						] }, e.id);
					})
				})]
			}),
			l && /* @__PURE__ */ (0, k.jsx)(tn, {
				kind: l.kind,
				id: l.id,
				onClose: () => u(null),
				onDetails: () => {
					c("route"), u(null);
				}
			}),
			s && /* @__PURE__ */ (0, k.jsx)("div", {
				className: "mcp-bird-modal-backdrop",
				onMouseDown: (e) => {
					e.target === e.currentTarget && c(null);
				},
				children: /* @__PURE__ */ (0, k.jsxs)("section", {
					className: "surface mcp-bird-modal",
					role: "dialog",
					"aria-modal": "true",
					"aria-label": s === "compare" ? "Full MCP control matrix" : `${d} architecture details`,
					children: [/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "mcp-bird-modal-header",
						children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
							className: "eyebrow",
							children: "ARCHITECTURE DETAIL · DESIGN REVIEW ONLY"
						}), /* @__PURE__ */ (0, k.jsx)("h3", { children: s === "compare" ? "Full MCP control matrix" : `${d} · handoffs, owners and proof` })] }), /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							onClick: () => c(null),
							autoFocus: !0,
							children: "Close"
						})]
					}), /* @__PURE__ */ (0, k.jsx)("div", {
						className: "mcp-bird-modal-body",
						children: s === "compare" ? /* @__PURE__ */ (0, k.jsxs)("table", {
							className: "mcp-bird-full-table",
							children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, k.jsx)("th", { children: "Control" }),
								/* @__PURE__ */ (0, k.jsx)("th", { children: "S1 · Direct Apigee" }),
								/* @__PURE__ */ (0, k.jsx)("th", { children: "S2 · AgentCore" }),
								/* @__PURE__ */ (0, k.jsx)("th", { children: "S3 · Federated" })
							] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: h.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [/* @__PURE__ */ (0, k.jsx)("th", {
								scope: "row",
								children: e[0]
							}), e.slice(1).map((e, t) => /* @__PURE__ */ (0, k.jsx)("td", { children: e }, t))] }, e[0])) })]
						}) : /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
							/* @__PURE__ */ (0, k.jsxs)("div", {
								className: "mcp-bird-modal-owners",
								children: [/* @__PURE__ */ (0, k.jsxs)("article", { children: [/* @__PURE__ */ (0, k.jsx)("h4", { children: "AgentCore / AI Foundry" }), /* @__PURE__ */ (0, k.jsx)("p", { children: f.agentcore })] }), /* @__PURE__ */ (0, k.jsxs)("article", { children: [/* @__PURE__ */ (0, k.jsx)("h4", { children: "SAP / Apigee / Integration" }), /* @__PURE__ */ (0, k.jsx)("p", { children: f.sap })] })]
							}),
							/* @__PURE__ */ (0, k.jsx)("div", {
								className: "mcp-bird-modal-steps",
								children: p?.steps?.map((e, t) => /* @__PURE__ */ (0, k.jsxs)("article", { children: [
									/* @__PURE__ */ (0, k.jsxs)("h4", { children: [
										t + 1,
										". ",
										e.handoff
									] }),
									/* @__PURE__ */ (0, k.jsxs)("p", { children: [
										/* @__PURE__ */ (0, k.jsx)("strong", { children: "Owner:" }),
										" ",
										e.owner
									] }),
									/* @__PURE__ */ (0, k.jsxs)("p", { children: [
										/* @__PURE__ */ (0, k.jsx)("strong", { children: "Configure:" }),
										" ",
										e.configure
									] }),
									/* @__PURE__ */ (0, k.jsxs)("p", { children: [
										/* @__PURE__ */ (0, k.jsx)("strong", { children: "Depends on:" }),
										" ",
										e.dependency
									] }),
									/* @__PURE__ */ (0, k.jsxs)("p", { children: [
										/* @__PURE__ */ (0, k.jsx)("strong", { children: "Proof:" }),
										" ",
										e.proof
									] })
								] }, e.handoff))
							}),
							/* @__PURE__ */ (0, k.jsx)("h4", { children: "Open decisions" }),
							/* @__PURE__ */ (0, k.jsx)("ul", { children: p?.decisions?.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) }),
							/* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								className: "mcp-question-link",
								onClick: () => {
									c(null), t();
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
// src/McpGovernance.jsx
var sn = [
	"MCP registry and discovery",
	"Enterprise registry / approval authority",
	"Source-code repository",
	"MCP specifications and versioned artifacts",
	"Container / package artifact storage",
	"Gateway-target configuration",
	"Deployment ownership"
], cn = [
	["mg-responsibility", "Responsibility matrix"],
	["mg-connections", "Endpoint connectivity"],
	["mg-registry", "Registry and artifacts"],
	["mg-domain", "Finance domain design"],
	["mg-decision", "Decision matrix"],
	["mg-recommendation", "Recommendation"],
	["mg-evidence", "Evidence"]
];
function ln(e) {
	return {
		id: e,
		title: lt[e].label,
		svg: Pt(e),
		file: `mcp-topology-${e.toLowerCase()}`,
		png: !0
	};
}
var un = (e) => /TBD|TO VALIDATE|unproven|NOT_VERIFIED|REQUIRES VALIDATION|needs proof|must be proven|unmeasured/i.test(e), dn = ({ text: e }) => /* @__PURE__ */ (0, k.jsx)("td", {
	className: un(e) ? "mg-open" : "",
	children: e
});
function fn({ id: e, testid: t, title: n, hint: r, open: i, onToggle: a, children: o }) {
	return /* @__PURE__ */ (0, k.jsxs)("details", {
		id: e,
		className: "surface mg-section mg-fold",
		"data-testid": t,
		open: i,
		onToggle: (t) => a(e, t.currentTarget.open),
		children: [/* @__PURE__ */ (0, k.jsxs)("summary", { children: [/* @__PURE__ */ (0, k.jsx)("h3", { children: n }), /* @__PURE__ */ (0, k.jsx)("span", {
			className: "mg-hint",
			children: r
		})] }), o]
	});
}
var pn = {
	"mg-responsibility": "21 rows: who creates, hosts, registers and calls the Finance MCP",
	"mg-registry": "Catalog, source and artifact owners",
	"mg-domain": "Read, posting and analytical tools with separate authorizations",
	"mg-hosting": "Which agent platforms work with which route",
	"mg-decision": "15 dimensions compared across S1, S2 and S3",
	"mg-recommendation": "Proposal, what would change it, and the proof plan",
	"mg-evidence": "Vendor sources read on the access date",
	"mg-connections": "Every connection, with invocation separated from registry and deployment"
};
function mn({ view: e = "S1", onView: t, onApproaches: n, onAgentHosting: r, onDetailed: i }) {
	let a = (0, _.useRef)(null), [o, s] = (0, _.useState)({ "mg-recommendation": !0 }), c = (e, t) => s((n) => n[e] === t ? n : {
		...n,
		[e]: t
	}), [l, u] = (0, _.useState)(null), [d, f] = (0, _.useState)(null), [p, m] = (0, _.useState)(!0), [h, g] = (0, _.useState)(null), [v, y] = (0, _.useState)("S3"), b = e === "compare", x = b ? "S1" : e, S = lt[x], C = (0, _.useMemo)(() => Object.fromEntries(ut.map((e) => [e, ln(e)])), []), w = (0, _.useCallback)((e) => {
		u(e), f(e);
	}, []), T = v === x ? ut.find((e) => e !== x) : v, E = (n) => {
		n !== e && (g(null), t(n));
	}, D = (e) => {
		s((t) => ({
			...t,
			[e]: !0
		})), requestAnimationFrame(() => a.current?.querySelector(`#${e}`)?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		}));
	}, O = b ? ["S1", T] : [x];
	return /* @__PURE__ */ (0, k.jsxs)("main", {
		ref: a,
		className: "detailed-diagrams mcp-governance",
		"aria-label": "MCP hosting",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("header", {
				className: "surface dd-header",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "dd-title",
						children: [/* @__PURE__ */ (0, k.jsx)("span", {
							className: "eyebrow",
							children: "MCP HOSTING · WHO CREATES, HOSTS, REGISTERS AND CALLS THE FINANCE MCP"
						}), /* @__PURE__ */ (0, k.jsx)("h2", { children: b ? "Compare MCP topologies" : S.label })]
					}),
					/* @__PURE__ */ (0, k.jsx)("nav", {
						className: "dd-selector",
						role: "tablist",
						"aria-label": "MCP scenario selection",
						children: [...ut, "compare"].map((t) => /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": e === t,
							className: e === t ? "active" : "",
							onClick: () => E(t),
							children: t === "compare" ? "Compare side-by-side" : lt[t].label
						}, t))
					}),
					/* @__PURE__ */ (0, k.jsx)("div", {
						className: "dd-header-actions",
						children: /* @__PURE__ */ (0, k.jsx)("span", {
							className: "pill warn",
							children: "PROPOSED DESIGN · NOT APPROVED · NOT TENANT-VERIFIED"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)("section", {
				className: "surface dd-summary",
				"aria-label": "Scenario summary",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [
					/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: b ? "WHAT THIS VIEW SHOWS" : `${x} · ${S.short.toUpperCase()}`
					}),
					/* @__PURE__ */ (0, k.jsx)("p", { children: b ? "Two scenarios side by side. Pick the second one below. The matrices further down always show all three." : S.summary }),
					!b && /* @__PURE__ */ (0, k.jsx)("p", {
						className: "mg-baseline",
						children: S.baseline
					})
				] }), /* @__PURE__ */ (0, k.jsxs)("div", {
					className: "dd-invariant",
					children: [/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: "MCP ONLY · AGENT HOSTING IS ITS OWN PAGE"
					}), /* @__PURE__ */ (0, k.jsx)("p", { children: "A registry is a catalog, never an invocation hop. A gateway routes and authorizes; it does not necessarily run the domain tools. Where the agent itself runs is decided separately." })]
				})]
			}),
			/* @__PURE__ */ (0, k.jsxs)("nav", {
				className: "mg-anchors",
				"aria-label": "Sections on this page",
				children: [
					cn.map(([e, t]) => /* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: () => D(e),
						children: t
					}, e)),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: n,
						children: "Complete architecture →"
					}),
					r && /* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: r,
						children: "Agent hosting →"
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: () => i(x === "S3" || b ? "S1" : x),
						children: "Detailed reference diagrams →"
					})
				]
			}),
			b && /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "surface dd-compare-bar",
				children: [/* @__PURE__ */ (0, k.jsxs)("label", { children: [/* @__PURE__ */ (0, k.jsx)("input", {
					type: "checkbox",
					checked: p,
					onChange: (e) => m(e.target.checked)
				}), " Synchronize zoom and pan"] }), /* @__PURE__ */ (0, k.jsxs)("label", { children: ["Compare S1 with ", /* @__PURE__ */ (0, k.jsx)("select", {
					value: T,
					onChange: (e) => y(e.target.value),
					"aria-label": "Second scenario",
					children: ut.filter((e) => e !== "S1").map((e) => /* @__PURE__ */ (0, k.jsx)("option", {
						value: e,
						children: lt[e].label
					}, e))
				})] })]
			}),
			/* @__PURE__ */ (0, k.jsx)("div", {
				className: `mg-viewers ${b ? "two" : ""}`,
				children: O.map((e, t) => /* @__PURE__ */ (0, k.jsx)("div", {
					className: "mg-viewer",
					"data-scenario": e,
					children: /* @__PURE__ */ (0, k.jsx)($t, {
						diagram: C[e],
						uid: `mg-${e}-${b ? "c" : "s"}`,
						compact: b,
						view: t === 0 ? l : d,
						onView: (e) => {
							b && p ? w(e) : (t === 0 ? u : f)(e);
						},
						onFit: (e) => {
							b && p ? w(e) : (t === 0 ? u : f)(e);
						},
						expanded: h === e,
						onExpand: (t) => g(t ? e : null)
					})
				}, e))
			}),
			/* @__PURE__ */ (0, k.jsxs)(fn, {
				id: "mg-responsibility",
				testid: "mg-matrix",
				title: /* @__PURE__ */ (0, k.jsx)(k.Fragment, { children: "Responsibility matrix · 21 rows" }),
				hint: pn["mg-responsibility"],
				open: !!o["mg-responsibility"],
				onToggle: c,
				children: [/* @__PURE__ */ (0, k.jsxs)("p", {
					className: "micro",
					children: [
						"Selected scenario highlighted. “",
						ct,
						"” and other open items are tinted. Every cell comes from one scenario configuration."
					]
				}), /* @__PURE__ */ (0, k.jsx)("div", {
					className: "mg-scroll",
					children: /* @__PURE__ */ (0, k.jsxs)("table", {
						className: "mg-table",
						children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [/* @__PURE__ */ (0, k.jsx)("th", {
							scope: "col",
							children: "Responsibility"
						}), ut.map((e) => /* @__PURE__ */ (0, k.jsx)("th", {
							scope: "col",
							className: O.includes(e) ? "sel" : "",
							children: lt[e].label
						}, e))] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: ft.map(([e, ...t], n) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [/* @__PURE__ */ (0, k.jsxs)("th", {
							scope: "row",
							children: [
								n + 1,
								". ",
								e
							]
						}), t.map((e, t) => /* @__PURE__ */ (0, k.jsx)("td", {
							className: `${O.includes(ut[t]) ? "sel" : ""} ${un(e) ? "mg-open" : ""}`,
							children: e
						}, ut[t]))] }, e)) })]
					})
				})]
			}),
			O.map((e) => /* @__PURE__ */ (0, k.jsxs)(fn, {
				id: e === O[0] ? "mg-connections" : `mg-connections-${e}`,
				testid: `mg-connections-${e}`,
				title: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: ["Endpoint connectivity · ", lt[e].label] }),
				hint: pn["mg-connections"],
				open: !!o[e === O[0] ? "mg-connections" : `mg-connections-${e}`],
				onToggle: c,
				children: [/* @__PURE__ */ (0, k.jsx)("p", {
					className: "micro",
					children: "Invocation traffic is listed separately from registry lookups and artifact deployment. Endpoint addresses are conceptual placeholders."
				}), /* @__PURE__ */ (0, k.jsx)("div", {
					className: "mg-scroll",
					children: /* @__PURE__ */ (0, k.jsxs)("table", {
						className: "mg-table wide",
						children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsx)("tr", { children: pt.map((e) => /* @__PURE__ */ (0, k.jsx)("th", {
							scope: "col",
							children: e
						}, e)) }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: vt[e].map((e, t) => /* @__PURE__ */ (0, k.jsx)("tr", {
							className: /not invocation/i.test(e[2]) ? "mg-aside" : "",
							children: e.map((e, t) => t === 0 ? /* @__PURE__ */ (0, k.jsx)("th", {
								scope: "row",
								children: e
							}, t) : /* @__PURE__ */ (0, k.jsx)(dn, { text: e }, t))
						}, t)) })]
					})
				})]
			}, e)),
			/* @__PURE__ */ (0, k.jsxs)(fn, {
				id: "mg-registry",
				testid: "mg-registry",
				title: /* @__PURE__ */ (0, k.jsx)(k.Fragment, { children: "Registry and artifact ownership" }),
				hint: pn["mg-registry"],
				open: !!o["mg-registry"],
				onToggle: c,
				children: [
					/* @__PURE__ */ (0, k.jsx)("p", {
						className: "micro",
						children: "Registries catalog; repositories hold source and specifications; runtimes execute. These rows are the same cells as the responsibility matrix."
					}),
					/* @__PURE__ */ (0, k.jsx)("div", {
						className: "mg-scroll",
						children: /* @__PURE__ */ (0, k.jsxs)("table", {
							className: "mg-table",
							children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [/* @__PURE__ */ (0, k.jsx)("th", {
								scope: "col",
								children: "Item"
							}), ut.map((e) => /* @__PURE__ */ (0, k.jsx)("th", {
								scope: "col",
								className: O.includes(e) ? "sel" : "",
								children: lt[e].label
							}, e))] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: ft.filter((e) => sn.includes(e[0])).map(([e, ...t]) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [/* @__PURE__ */ (0, k.jsx)("th", {
								scope: "row",
								children: e
							}), t.map((e, t) => /* @__PURE__ */ (0, k.jsx)("td", {
								className: `${O.includes(ut[t]) ? "sel" : ""} ${un(e) ? "mg-open" : ""}`,
								children: e
							}, ut[t]))] }, e)) })]
						})
					}),
					/* @__PURE__ */ (0, k.jsx)("p", {
						className: "micro",
						children: "Proposed hybrid source of truth: Apigee API hub for the SAP domain; AWS Agent Registry holds a reference; Enterprise AI Foundry owns publication approval. No automatic cross-platform synchronization is assumed."
					})
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)(fn, {
				id: "mg-domain",
				testid: "mg-domain",
				title: /* @__PURE__ */ (0, k.jsx)(k.Fragment, { children: "Finance domain MCP design" }),
				hint: pn["mg-domain"],
				open: !!o["mg-domain"],
				onToggle: c,
				children: [
					/* @__PURE__ */ (0, k.jsx)("p", {
						className: "micro",
						children: "Read and write use separate authorizations. No generic write-capable tool may bypass SAP validation, approval, idempotency, posting-period control or audit. This demo never posts to SAP."
					}),
					/* @__PURE__ */ (0, k.jsx)("div", {
						className: "mg-cards",
						children: yt.map((e) => /* @__PURE__ */ (0, k.jsxs)("article", { children: [
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: `pill ${e.mode.startsWith("WRITE") ? "warn" : "quiet"}`,
								children: e.mode
							}),
							/* @__PURE__ */ (0, k.jsx)("h4", { children: e.name }),
							/* @__PURE__ */ (0, k.jsx)("p", { children: e.tools }),
							/* @__PURE__ */ (0, k.jsxs)("p", { children: [
								/* @__PURE__ */ (0, k.jsx)("strong", { children: "Control" }),
								" ",
								e.control
							] })
						] }, e.name))
					}),
					/* @__PURE__ */ (0, k.jsxs)("p", {
						className: "micro",
						children: [
							"Five authorizations stay distinct: business approval, agent authorization, gateway authorization, SAP backend user authorization and the actual SAP posting result. Service identity is simpler to prove; end-user delegation needs proven token exchange, Cloud Connector, identity mapping and ABAP roles (",
							ct,
							")."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)(fn, {
				id: "mg-decision",
				testid: "mg-decision",
				title: /* @__PURE__ */ (0, k.jsx)(k.Fragment, { children: "Decision matrix" }),
				hint: pn["mg-decision"],
				open: !!o["mg-decision"],
				onToggle: c,
				children: [
					/* @__PURE__ */ (0, k.jsx)("p", {
						className: "micro",
						children: "Qualitative assessment. These are architectural judgments, not verified product claims or an approval."
					}),
					/* @__PURE__ */ (0, k.jsx)("div", {
						className: "mg-scroll",
						children: /* @__PURE__ */ (0, k.jsxs)("table", {
							className: "mg-table",
							children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [/* @__PURE__ */ (0, k.jsx)("th", {
								scope: "col",
								children: "Dimension"
							}), ut.map((e) => /* @__PURE__ */ (0, k.jsx)("th", {
								scope: "col",
								className: O.includes(e) ? "sel" : "",
								children: lt[e].label
							}, e))] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: bt.map(([e, ...t]) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [/* @__PURE__ */ (0, k.jsx)("th", {
								scope: "row",
								children: e
							}), t.map((e, t) => /* @__PURE__ */ (0, k.jsx)("td", {
								className: O.includes(ut[t]) ? "sel" : "",
								children: e
							}, ut[t]))] }, e)) })]
						})
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						className: "text-link",
						onClick: n,
						children: "Compare with the complete architecture view →"
					})
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)(fn, {
				id: "mg-recommendation",
				testid: "mg-recommendation",
				title: /* @__PURE__ */ (0, k.jsx)(k.Fragment, { children: "Recommendation and proof plan" }),
				hint: pn["mg-recommendation"],
				open: !!o["mg-recommendation"],
				onToggle: c,
				children: [
					/* @__PURE__ */ (0, k.jsx)("p", {
						className: "mg-reco",
						children: /* @__PURE__ */ (0, k.jsx)("strong", { children: xt.headline })
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "mg-cards",
						children: [
							/* @__PURE__ */ (0, k.jsxs)("article", { children: [/* @__PURE__ */ (0, k.jsx)("h4", { children: "Why" }), /* @__PURE__ */ (0, k.jsx)("ul", { children: xt.why.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) })] }),
							/* @__PURE__ */ (0, k.jsxs)("article", { children: [/* @__PURE__ */ (0, k.jsx)("h4", { children: "Depends on" }), /* @__PURE__ */ (0, k.jsx)("ul", { children: xt.standards.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) })] }),
							/* @__PURE__ */ (0, k.jsxs)("article", { children: [/* @__PURE__ */ (0, k.jsx)("h4", { children: "Open decisions" }), /* @__PURE__ */ (0, k.jsx)("ul", { children: xt.open.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) })] }),
							/* @__PURE__ */ (0, k.jsxs)("article", { children: [/* @__PURE__ */ (0, k.jsx)("h4", { children: "What would change it" }), /* @__PURE__ */ (0, k.jsx)("ul", { children: xt.changes.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) })] }),
							/* @__PURE__ */ (0, k.jsxs)("article", { children: [/* @__PURE__ */ (0, k.jsx)("h4", { children: "How a POC proves it" }), /* @__PURE__ */ (0, k.jsx)("ul", { children: xt.poc.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) })] })
						]
					}),
					/* @__PURE__ */ (0, k.jsx)("p", {
						className: "micro",
						children: "A recommendation is not production authorization."
					})
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)(fn, {
				id: "mg-evidence",
				testid: "mg-evidence",
				title: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: ["Source evidence · accessed ", st] }),
				hint: pn["mg-evidence"],
				open: !!o["mg-evidence"],
				onToggle: c,
				children: [/* @__PURE__ */ (0, k.jsx)("p", {
					className: "micro",
					children: Ct
				}), /* @__PURE__ */ (0, k.jsx)("div", {
					className: "mg-scroll",
					children: /* @__PURE__ */ (0, k.jsxs)("table", {
						className: "mg-table wide",
						children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsx)("tr", { children: [
							"Platform",
							"Source",
							"Documented capability",
							"Architecture consequence",
							"Validation still required"
						].map((e) => /* @__PURE__ */ (0, k.jsx)("th", {
							scope: "col",
							children: e
						}, e)) }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: St.map(([e, t, n, r, i, a]) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, k.jsx)("th", {
								scope: "row",
								children: e
							}),
							/* @__PURE__ */ (0, k.jsx)("td", { children: /* @__PURE__ */ (0, k.jsx)("a", {
								href: n,
								target: "_blank",
								rel: "noopener noreferrer",
								children: t
							}) }),
							/* @__PURE__ */ (0, k.jsx)("td", { children: r }),
							/* @__PURE__ */ (0, k.jsx)("td", { children: i }),
							/* @__PURE__ */ (0, k.jsx)("td", {
								className: "mg-open",
								children: a
							})
						] }, n)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, k.jsxs)("section", {
				className: "surface mg-section",
				"aria-label": "Glossary",
				children: [/* @__PURE__ */ (0, k.jsxs)("details", { children: [/* @__PURE__ */ (0, k.jsx)("summary", { children: /* @__PURE__ */ (0, k.jsx)("strong", { children: "Glossary · MCP terms used on this page" }) }), /* @__PURE__ */ (0, k.jsx)("dl", {
					className: "mg-glossary",
					children: dt.map(([e, t]) => /* @__PURE__ */ (0, k.jsxs)(_.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("dt", { children: e }), /* @__PURE__ */ (0, k.jsx)("dd", { children: t })] }, e))
				})] }), /* @__PURE__ */ (0, k.jsxs)("p", {
					className: "micro",
					children: [
						"Legend: ",
						Ot.map(([, e]) => e).join(" · "),
						"."
					]
				})]
			})
		]
	});
}
// src/HostingPriority.jsx
var hn = [
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
], gn = [
	["Experience", "Fiori/UI5 or approved chat is the user interface; it does not host the agent."],
	["Agent runtime", "Runs orchestration and tool selection; needs scaling, isolation, deployment and recovery."],
	["Model access", "PTP/PAP, Bedrock, SAP AI Core or Foundry model endpoint must be approved separately."],
	["SAP tools", "Apigee MCP remains the SAP-facing boundary unless architecture owners change it."],
	["Business state", "Durable checkpoints, approvals and retries need a defined store and owner."],
	["Governance", "Registry, versioning, evaluation, audit, secrets and incident ownership need evidence."]
], _n = [
	"Approved production service and region",
	"Data policy and model-processing geography",
	"SAP identity and connectivity proof",
	"Entitlement and three-year total cost",
	"Named operating and incident owner",
	"Recovery, rollback and audit controls"
];
function vn({ onMcp: e, onComplete: t }) {
	let [n, r] = (0, _.useState)("agentcore"), [i, a] = (0, _.useState)(null), [o, s] = (0, _.useState)(null), c = hn.find((e) => e.id === n);
	(0, _.useEffect)(() => {
		if (!i) return;
		let e = (e) => {
			e.key === "Escape" && a(null);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [i]);
	let l = i === "gates" ? "Eligibility before ranking" : i === "layers" ? "Complete operating platform" : `${c.name} hosting details`;
	return /* @__PURE__ */ (0, k.jsxs)("main", {
		className: "mcp-comparison mcp-bird arch-page hosting-page",
		"aria-label": "Agent hosting",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("header", {
				className: "surface mcp-bird-header",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("h2", { children: "Agent hosting" }), /* @__PURE__ */ (0, k.jsx)("span", {
					className: "eyebrow",
					children: "WHERE THE CUSTOM FINANCE AGENT RUNS"
				})] }), /* @__PURE__ */ (0, k.jsx)("span", {
					className: "pill warn",
					children: "SHORTLIST · NO TENANT PROOF YET"
				})]
			}),
			/* @__PURE__ */ (0, k.jsx)("nav", {
				className: "surface mcp-route-tabs mcp-bird-tabs",
				role: "tablist",
				"aria-label": "Agent hosting options",
				children: hn.map((e) => /* @__PURE__ */ (0, k.jsxs)("button", {
					type: "button",
					role: "tab",
					"aria-selected": n === e.id,
					className: n === e.id ? "active" : "",
					onClick: () => r(e.id),
					children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: e.name }), /* @__PURE__ */ (0, k.jsx)("span", { children: e.priority })]
				}, e.id))
			}),
			/* @__PURE__ */ (0, k.jsxs)("section", {
				className: "surface mcp-bird-panel arch-panel",
				role: "tabpanel",
				"aria-label": `${c.name} overview`,
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "mcp-bird-panel-title",
						children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
							className: "eyebrow",
							children: c.priority
						}), /* @__PURE__ */ (0, k.jsx)("h3", { children: c.name })] }), /* @__PURE__ */ (0, k.jsxs)("div", {
							className: "mcp-bird-title-actions",
							children: [/* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								className: "diagram-action",
								onClick: () => s(c.id),
								children: "Architecture diagram ↗"
							}), /* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								onClick: () => a("detail"),
								children: "Prerequisites and proof →"
							})]
						})]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "mcp-bird-path arch-path",
						"aria-label": "Where the agent sits",
						children: [
							/* @__PURE__ */ (0, k.jsx)("b", { children: "User or Fiori" }),
							/* @__PURE__ */ (0, k.jsx)("span", {
								"aria-hidden": "true",
								children: "→"
							}),
							/* @__PURE__ */ (0, k.jsxs)("b", { children: ["Agent runtime · ", c.name] }),
							/* @__PURE__ */ (0, k.jsx)("span", {
								"aria-hidden": "true",
								children: "→"
							}),
							/* @__PURE__ */ (0, k.jsx)("b", { children: "Model endpoint" }),
							/* @__PURE__ */ (0, k.jsx)("span", {
								"aria-hidden": "true",
								children: "→"
							}),
							/* @__PURE__ */ (0, k.jsx)("b", { children: "MCP route S1 · S2 · S3" })
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "arch-grid two",
						children: [/* @__PURE__ */ (0, k.jsxs)("section", {
							"aria-label": "Platform facts",
							children: [/* @__PURE__ */ (0, k.jsx)("h4", { children: "What runs where" }), /* @__PURE__ */ (0, k.jsxs)("div", {
								className: "arch-cards",
								children: [
									/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Agent host" }), /* @__PURE__ */ (0, k.jsx)("b", { children: c.host })] }),
									/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Model access" }), /* @__PURE__ */ (0, k.jsx)("b", { children: c.model })] }),
									/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Operators" }), /* @__PURE__ */ (0, k.jsx)("b", { children: c.owner })] })
								]
							})]
						}), /* @__PURE__ */ (0, k.jsxs)("section", {
							"aria-label": "Platform fit",
							children: [
								/* @__PURE__ */ (0, k.jsx)("h4", { children: "Why assess it" }),
								/* @__PURE__ */ (0, k.jsx)("p", { children: c.fit }),
								/* @__PURE__ */ (0, k.jsx)("h4", { children: "What must be proved" }),
								/* @__PURE__ */ (0, k.jsx)("p", { children: c.gates }),
								/* @__PURE__ */ (0, k.jsx)("a", {
									href: c.source,
									target: "_blank",
									rel: "noreferrer",
									children: "Official product reference ↗"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "arch-links",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "Also:" }),
							/* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								className: "text-link",
								onClick: () => a("gates"),
								children: "Eligibility gates"
							}),
							/* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								className: "text-link",
								onClick: () => a("layers"),
								children: "Operating platform layers"
							}),
							e && /* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								className: "text-link",
								onClick: e,
								children: "MCP hosting →"
							}),
							t && /* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								className: "text-link",
								onClick: t,
								children: "Complete architecture →"
							}),
							/* @__PURE__ */ (0, k.jsx)("small", { children: "Choosing a host does not choose the MCP route or the model." })
						]
					})
				]
			}),
			o && /* @__PURE__ */ (0, k.jsx)(tn, {
				kind: "hosting",
				id: o,
				onClose: () => s(null),
				onDetails: () => {
					r(o), s(null), a("detail");
				}
			}),
			i && /* @__PURE__ */ (0, k.jsx)("div", {
				className: "mcp-bird-modal-backdrop",
				onMouseDown: (e) => {
					e.target === e.currentTarget && a(null);
				},
				children: /* @__PURE__ */ (0, k.jsxs)("section", {
					className: "surface mcp-bird-modal",
					role: "dialog",
					"aria-modal": "true",
					"aria-label": l,
					children: [/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "mcp-bird-modal-header",
						children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
							className: "eyebrow",
							children: "AGENT HOSTING · DESIGN REVIEW ONLY"
						}), /* @__PURE__ */ (0, k.jsx)("h3", { children: l })] }), /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							onClick: () => a(null),
							autoFocus: !0,
							children: "Close"
						})]
					}), /* @__PURE__ */ (0, k.jsx)("div", {
						className: "mcp-bird-modal-body",
						children: i === "gates" ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("ul", { children: _n.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) }), /* @__PURE__ */ (0, k.jsx)("p", { children: "UNKNOWN remains conditional. Compare the same workflow and approved model on eligible platforms; measure cost, latency, failure recovery and final SAP authorization before selecting one. Kyma is a separate SAP option only with a demonstrated container requirement; AgentCore Runtime with SAP AI Core model access is an exception that needs a specific governance reason." })] }) : i === "layers" ? /* @__PURE__ */ (0, k.jsx)("div", {
							className: "mcp-bird-modal-owners",
							children: gn.map(([e, t]) => /* @__PURE__ */ (0, k.jsxs)("article", { children: [/* @__PURE__ */ (0, k.jsx)("h4", { children: e }), /* @__PURE__ */ (0, k.jsx)("p", { children: t })] }, e))
						}) : /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsxs)("dl", {
							className: "mcp-bird-host-detail",
							children: [
								/* @__PURE__ */ (0, k.jsx)("dt", { children: "Priority" }),
								/* @__PURE__ */ (0, k.jsx)("dd", { children: c.priority }),
								/* @__PURE__ */ (0, k.jsx)("dt", { children: "Agent host" }),
								/* @__PURE__ */ (0, k.jsx)("dd", { children: c.host }),
								/* @__PURE__ */ (0, k.jsx)("dt", { children: "Model access" }),
								/* @__PURE__ */ (0, k.jsx)("dd", { children: c.model }),
								/* @__PURE__ */ (0, k.jsx)("dt", { children: "Operators" }),
								/* @__PURE__ */ (0, k.jsx)("dd", { children: c.owner }),
								/* @__PURE__ */ (0, k.jsx)("dt", { children: "Why assess" }),
								/* @__PURE__ */ (0, k.jsx)("dd", { children: c.fit }),
								/* @__PURE__ */ (0, k.jsx)("dt", { children: "Proof needed" }),
								/* @__PURE__ */ (0, k.jsx)("dd", { children: c.gates })
							]
						}), /* @__PURE__ */ (0, k.jsx)("a", {
							href: c.source,
							target: "_blank",
							rel: "noreferrer",
							children: "Official product reference ↗"
						})] })
					})]
				})
			})
		]
	});
}
// src/roleData.js
var yn = [
	{
		id: "ea",
		name: "Enterprise architect",
		ask: "Is the target coherent, governable and decision-ready?",
		links: [
			["brief", "Decision brief"],
			["ontology", "Ontology"],
			["approaches", "Complete architecture"]
		]
	},
	{
		id: "ia",
		name: "Integration architect",
		ask: "Which interfaces, identities and hops does each route need?",
		links: [
			["mcp", "MCP hosting"],
			["ontology", "Ontology"],
			["diagrams", "Detailed diagrams"]
		]
	},
	{
		id: "fin",
		name: "Finance",
		ask: "Can I trust the close result, and who approves what?",
		links: [
			["business", "Close & reconcile"],
			["treasury", "Cash & treasury"],
			["agents", "Ask the agents"]
		]
	},
	{
		id: "ba",
		name: "Business architect",
		ask: "What changes in the process, and where are the controls?",
		links: [
			["business", "Who does what"],
			["agents", "Agent roles"],
			["brief", "Decision brief"]
		]
	}
], bn = [
	[
		"Collect source balances",
		"System",
		"Simulated S/4HANA, Central Finance and BW snapshots"
	],
	[
		"Compare and compute variance",
		"Agent · read only",
		"Reconciliation agent, deterministic rules"
	],
	[
		"Explain the variance",
		"Agent · read only",
		"Investigator agent; advisory, never a posting"
	],
	[
		"Draft an adjustment proposal",
		"Agent · local draft",
		"Proposal agent writes a draft only, never to SAP"
	],
	[
		"Approve",
		"Person",
		"Finance approver, a different role from the maker"
	],
	[
		"Post to SAP",
		"Outside this demo",
		"Human-approved path; only a nonproduction marker is simulated"
	]
], xn = [
	"Maker and approver are separate roles",
	"Approval is bound to the proposal hash and case version",
	"Every step is stored as an event you can inspect",
	"No agent tool can post to SAP"
], Sn = [
	[
		"Route for the SAP finance interface",
		"S1 as the proof-of-concept baseline",
		"Enterprise architecture + SAP integration"
	],
	[
		"Agent runtime host",
		"Validate the approved enterprise platform first; SAP BTP is the conditional alternative",
		"Enterprise AI + platform team"
	],
	[
		"Identity: user delegation or service identity",
		"Prove service identity first, then delegation",
		"Security + SAP Basis"
	],
	[
		"Registry source of truth",
		"API hub for the SAP domain; agent registry holds a reference",
		"Enterprise AI Foundry"
	],
	[
		"Model access (PTP/PAP)",
		"Separate approval; does not decide the host",
		"Enterprise AI"
	],
	[
		"Posting to SAP",
		"Out of scope. Human approval and nonproduction evidence first",
		"Finance + SAP"
	],
	[
		"12-month total cost",
		"Unmeasured; needs an estimate per route",
		"Finance + procurement"
	]
], Cn = [
	[
		"G1",
		"Scenario, owners, licensing, cost and network topology",
		"OPEN"
	],
	[
		"G2",
		"Gateway inbound authorization, target type and outbound credential proof",
		"OPEN"
	],
	[
		"G3",
		"Integration Suite identity mapping and SAP authorization at all backends",
		"OPEN · P0"
	],
	[
		"G4",
		"Finance rules, source contracts, freshness and reconciliation vectors",
		"OPEN"
	],
	[
		"G5",
		"Human approval tests and nonproduction SAP document evidence",
		"OPEN · P0"
	],
	[
		"G6",
		"Privacy, Unity Catalog grants, BDC sharing and Portkey retention",
		"OPEN"
	],
	[
		"G7",
		"Cross-system trace correlation, retention and incident ownership",
		"OPEN"
	]
], wn = [
	"The workflow shape: ask, plan, specialist calls, evidence, proposal, approval",
	"What each agent may and may not do, shown as read-only tools and refusals",
	"Where each route puts the gateway, the identity hop and the owner"
], Tn = [
	"Any live SAP, AWS, Google or Databricks connection",
	"A real MCP transport (calls are in-process and MCP-shaped)",
	"Identity propagation, performance, availability or cost"
], En = {
	change: ["What would change the recommendation", xt.changes],
	poc: ["How a proof of concept settles it", xt.poc],
	depends: ["What the recommendation depends on", xt.standards],
	limits: ["What this demo proves, and what it does not", null]
};
function Dn({ onComplete: e, onMcp: t, onAgentHosting: n }) {
	let [r, i] = (0, _.useState)(null);
	(0, _.useEffect)(() => {
		if (!r) return;
		let e = (e) => {
			e.key === "Escape" && i(null);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [r]);
	let a = xt.headline.replace(/^ARCHITECTURE_RECOMMENDED \(proposal for owner decision, not approval\): /, "");
	return /* @__PURE__ */ (0, k.jsxs)("main", {
		className: "mcp-comparison mcp-bird arch-page brief-page",
		"aria-label": "Decision brief",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("header", {
				className: "surface mcp-bird-header",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("h2", { children: "Decision brief" }), /* @__PURE__ */ (0, k.jsx)("span", {
					className: "eyebrow",
					children: "WHAT NEEDS DECIDING, WHO OWNS IT, WHAT IS STILL OPEN"
				})] }), /* @__PURE__ */ (0, k.jsx)("span", {
					className: "pill warn",
					children: "PROPOSAL FOR OWNER DECISION · NOT AN APPROVAL"
				})]
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "brief-grid",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("section", {
						className: "surface brief-card",
						"aria-label": "Recommendation",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: "eyebrow",
								children: "PROPOSED BASELINE"
							}),
							/* @__PURE__ */ (0, k.jsx)("h3", { children: a.charAt(0).toUpperCase() + a.slice(1) }),
							/* @__PURE__ */ (0, k.jsx)("ul", { children: xt.why.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) }),
							/* @__PURE__ */ (0, k.jsxs)("div", {
								className: "brief-links",
								children: [
									/* @__PURE__ */ (0, k.jsx)("button", {
										type: "button",
										onClick: () => i("change"),
										children: "What would change it"
									}),
									/* @__PURE__ */ (0, k.jsx)("button", {
										type: "button",
										onClick: () => i("poc"),
										children: "Proof plan"
									}),
									/* @__PURE__ */ (0, k.jsx)("button", {
										type: "button",
										onClick: () => i("depends"),
										children: "Depends on"
									}),
									/* @__PURE__ */ (0, k.jsx)("button", {
										type: "button",
										onClick: () => i("limits"),
										children: "Proves / does not prove"
									})
								]
							}),
							/* @__PURE__ */ (0, k.jsxs)("div", {
								className: "brief-links alt",
								children: [
									/* @__PURE__ */ (0, k.jsx)("button", {
										type: "button",
										onClick: e,
										children: "Complete architecture →"
									}),
									/* @__PURE__ */ (0, k.jsx)("button", {
										type: "button",
										onClick: t,
										children: "MCP hosting →"
									}),
									/* @__PURE__ */ (0, k.jsx)("button", {
										type: "button",
										onClick: n,
										children: "Agent hosting →"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("section", {
						className: "surface brief-card",
						"aria-label": "Decisions needed",
						children: [/* @__PURE__ */ (0, k.jsxs)("span", {
							className: "eyebrow",
							children: ["DECISIONS NEEDED · ", Sn.length]
						}), /* @__PURE__ */ (0, k.jsxs)("table", {
							className: "brief-table",
							children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, k.jsx)("th", {
									scope: "col",
									children: "Decision"
								}),
								/* @__PURE__ */ (0, k.jsx)("th", {
									scope: "col",
									children: "Proposal"
								}),
								/* @__PURE__ */ (0, k.jsx)("th", {
									scope: "col",
									children: "Owner"
								}),
								/* @__PURE__ */ (0, k.jsx)("th", {
									scope: "col",
									children: "Status"
								})
							] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: Sn.map(([e, t, n]) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, k.jsx)("th", {
									scope: "row",
									children: e
								}),
								/* @__PURE__ */ (0, k.jsx)("td", { children: t }),
								/* @__PURE__ */ (0, k.jsx)("td", { children: n }),
								/* @__PURE__ */ (0, k.jsx)("td", { children: /* @__PURE__ */ (0, k.jsx)("span", {
									className: "brief-open",
									children: "OPEN"
								}) })
							] }, e)) })]
						})]
					}),
					/* @__PURE__ */ (0, k.jsxs)("section", {
						className: "surface brief-card",
						"aria-label": "Proof gates",
						children: [/* @__PURE__ */ (0, k.jsx)("span", {
							className: "eyebrow",
							children: "PROOF GATES · NONE PASSED"
						}), /* @__PURE__ */ (0, k.jsx)("ul", {
							className: "brief-gates",
							children: Cn.map(([e, t, n]) => /* @__PURE__ */ (0, k.jsxs)("li", { children: [
								/* @__PURE__ */ (0, k.jsx)("b", { children: e }),
								/* @__PURE__ */ (0, k.jsx)("span", { children: t }),
								/* @__PURE__ */ (0, k.jsx)("em", {
									className: n.includes("P0") ? "p0" : "",
									children: n
								})
							] }, e))
						})]
					})
				]
			}),
			r && /* @__PURE__ */ (0, k.jsx)("div", {
				className: "mcp-bird-modal-backdrop",
				onMouseDown: (e) => {
					e.target === e.currentTarget && i(null);
				},
				children: /* @__PURE__ */ (0, k.jsxs)("section", {
					className: "surface mcp-bird-modal",
					role: "dialog",
					"aria-modal": "true",
					"aria-label": En[r][0],
					children: [/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "mcp-bird-modal-header",
						children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
							className: "eyebrow",
							children: "DECISION BRIEF · DESIGN REVIEW ONLY"
						}), /* @__PURE__ */ (0, k.jsx)("h3", { children: En[r][0] })] }), /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							onClick: () => i(null),
							autoFocus: !0,
							children: "Close"
						})]
					}), /* @__PURE__ */ (0, k.jsx)("div", {
						className: "mcp-bird-modal-body",
						children: r === "limits" ? /* @__PURE__ */ (0, k.jsxs)("div", {
							className: "mcp-bird-modal-owners",
							children: [/* @__PURE__ */ (0, k.jsxs)("article", { children: [/* @__PURE__ */ (0, k.jsx)("h4", { children: "This demo shows" }), /* @__PURE__ */ (0, k.jsx)("ul", { children: wn.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) })] }), /* @__PURE__ */ (0, k.jsxs)("article", { children: [/* @__PURE__ */ (0, k.jsx)("h4", { children: "This demo does not prove" }), /* @__PURE__ */ (0, k.jsx)("ul", { children: Tn.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) })] })]
						}) : /* @__PURE__ */ (0, k.jsx)("ul", { children: En[r][1].map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) })
					})]
				})
			})
		]
	});
}
// src/ReconciliationReport.jsx
var On = (e) => new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0
}).format(Number(e || 0)), kn = (e) => `${Number(e) > 0 ? "+" : Number(e) < 0 ? "−" : ""}${On(Math.abs(Number(e || 0)))}`, An = [
	["summary", "Summary"],
	["accounts", "Accounts"],
	["matching", "Matching details"],
	["items", "Reconciling items"],
	["aging", "Aging"],
	["controls", "Controls"],
	["posting", "SAP posting guide"],
	["ai", "AI review"],
	["audit", "Audit trail"]
], jn = {
	BALANCED: "Balanced",
	WITHIN_TOLERANCE: "Within tolerance",
	EXPLAINED: "Explained · approval needed",
	EXCEPTION: "Exception · investigate",
	HOLD: "On hold · sources stale"
}, Mn = {
	BALANCED: "ok",
	WITHIN_TOLERANCE: "ok",
	EXPLAINED: "info",
	EXCEPTION: "bad",
	HOLD: "warn"
};
function Nn(e, t, n) {
	let r = URL.createObjectURL(new Blob([n], { type: t })), i = document.createElement("a");
	i.href = r, i.download = e, document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
var Pn = (e) => `"${String(e ?? "").replace(/"/g, "\"\"")}"`;
function Fn(e) {
	let t = [
		"item_id",
		"document_id",
		"document_type",
		"account",
		"account_name",
		"posting_date",
		"age_days",
		"s4_amount",
		"cfin_amount",
		"difference",
		"materiality",
		"category",
		"reason_code",
		"status",
		"owner",
		"recommended_action",
		"ai_confidence"
	];
	return [t.join(","), ...e.items.map((e) => t.map((t) => Pn(t === "ai_confidence" ? e.ai.confidence : e[t])).join(","))].join("\r\n");
}
function In({ bridge: e }) {
	let t = e[0].value, n = e[e.length - 1].value, r = Math.min(t, n) * .985, i = Math.max(t, n) * 1.005, a = 640 / e.length, o = (e) => 24 + 142 * (1 - (e - r) / Math.max(1, i - r)), s = t;
	return /* @__PURE__ */ (0, k.jsx)("svg", {
		className: "rr-bridge",
		viewBox: "0 0 640 210",
		role: "img",
		"aria-label": "Variance bridge from the S/4HANA balance to the Central Finance balance",
		children: e.map((e, t) => {
			let n = t * a + a * .2, i = a * .6, c, l, u;
			e.kind === "total" ? (c = r, l = e.value, u = "#0a6ed1") : (c = s, l = s + e.value, s = l, u = e.value < 0 ? "#bb0000" : "#107e3e");
			let d = o(Math.max(c, l)), f = Math.max(3, Math.abs(o(c) - o(l)));
			return /* @__PURE__ */ (0, k.jsxs)("g", { children: [
				/* @__PURE__ */ (0, k.jsx)("rect", {
					x: n,
					y: d,
					width: i,
					height: f,
					fill: u,
					rx: "2"
				}),
				/* @__PURE__ */ (0, k.jsx)("text", {
					x: n + i / 2,
					y: d - 6,
					textAnchor: "middle",
					fontSize: "11",
					fontWeight: "700",
					fill: "#1d2d3e",
					children: e.kind === "total" ? On(e.value) : kn(e.value)
				}),
				/* @__PURE__ */ (0, k.jsx)("text", {
					x: n + i / 2,
					y: 188,
					textAnchor: "middle",
					fontSize: "10.5",
					fill: "#34495c",
					children: e.label.length > 20 ? e.label.slice(0, 19) + "…" : e.label
				})
			] }, e.label);
		})
	});
}
function Ln({ status: e }) {
	return /* @__PURE__ */ (0, k.jsx)("span", {
		className: `rr-chip ${String(e).toLowerCase().replace("_", "-")}`,
		children: String(e).replace("_", " ")
	});
}
function Rn({ report: e }) {
	let t = e.summary;
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: `rr-banner ${Mn[t.status]}`,
				children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: jn[t.status] }), /* @__PURE__ */ (0, k.jsx)("span", { children: t.status_text })]
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "rr-kpis",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "S/4HANA balance" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: On(t.s4_total) })] }),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Central Finance balance" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: On(t.cfin_total) })] }),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: t.variance ? "attn" : "",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "Variance" }),
							/* @__PURE__ */ (0, k.jsx)("strong", { children: kn(t.variance) }),
							/* @__PURE__ */ (0, k.jsxs)("small", { children: ["Tolerance ", On(t.tolerance)] })
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [
						/* @__PURE__ */ (0, k.jsx)("span", { children: "Explained" }),
						/* @__PURE__ */ (0, k.jsxs)("strong", { children: [t.explained_pct, "%"] }),
						/* @__PURE__ */ (0, k.jsxs)("small", { children: [
							On(t.explained),
							" of ",
							On(t.variance)
						] })
					] }),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: t.unexplained ? "attn" : "",
						children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Unexplained" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: On(t.unexplained) })]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [
						/* @__PURE__ */ (0, k.jsx)("span", { children: "Open items" }),
						/* @__PURE__ */ (0, k.jsx)("strong", { children: t.open_items }),
						/* @__PURE__ */ (0, k.jsxs)("small", { children: [
							t.high_items,
							" high · ",
							t.matched_movements,
							" matched movements"
						] })
					] })
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "rr-grid2",
				children: [/* @__PURE__ */ (0, k.jsxs)("section", { children: [
					/* @__PURE__ */ (0, k.jsx)("h3", { children: "Variance bridge" }),
					/* @__PURE__ */ (0, k.jsx)("p", {
						className: "rr-note",
						children: "From the S/4HANA balance to the Central Finance balance, by reason."
					}),
					e.bridge.length > 2 ? /* @__PURE__ */ (0, k.jsx)(In, { bridge: e.bridge }) : /* @__PURE__ */ (0, k.jsx)("p", {
						className: "rr-empty",
						children: "No reconciling items. The two balances agree."
					})
				] }), /* @__PURE__ */ (0, k.jsxs)("section", { children: [/* @__PURE__ */ (0, k.jsx)("h3", { children: "Close timeline · source checks" }), /* @__PURE__ */ (0, k.jsx)("ol", {
					className: "rr-timeline",
					children: e.timeline.map((e) => /* @__PURE__ */ (0, k.jsxs)("li", {
						className: e.freshness === "current" ? "ok" : "warn",
						children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: e.step }), /* @__PURE__ */ (0, k.jsxs)("span", { children: [
							On(e.balance),
							" · ",
							e.freshness,
							" · ",
							e.timestamp_utc?.slice(11, 16),
							" UTC"
						] })]
					}, e.source))
				})] })]
			}),
			/* @__PURE__ */ (0, k.jsxs)("section", { children: [/* @__PURE__ */ (0, k.jsx)("h3", { children: "Next actions" }), e.actions.length ? /* @__PURE__ */ (0, k.jsxs)("table", {
				className: "rr-table",
				children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", { children: "#" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Item" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Owner" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Action" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Due" }),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Amount"
					})
				] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: e.actions.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.priority }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.item_id }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.owner }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.action }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.due }),
					/* @__PURE__ */ (0, k.jsx)("td", {
						className: "num",
						children: kn(e.amount)
					})
				] }, e.item_id)) })]
			}) : /* @__PURE__ */ (0, k.jsx)("p", {
				className: "rr-empty",
				children: "No action needed for this period."
			})] }),
			/* @__PURE__ */ (0, k.jsx)("p", {
				className: "rr-note",
				children: e.sign_convention
			}),
			/* @__PURE__ */ (0, k.jsxs)("p", {
				className: "rr-note",
				children: [
					"Approval readiness: ",
					t.ready_for_approval ? "ready for a separate finance approval." : "not ready. Resolve the items above first.",
					" This report never posts to SAP."
				]
			})
		]
	});
}
function zn({ report: e }) {
	let t = Math.max(1, ...e.accounts.map((e) => Math.abs(e.difference)));
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane",
		children: [/* @__PURE__ */ (0, k.jsxs)("table", {
			className: "rr-table",
			children: [
				/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Account" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Name" }),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "S/4HANA"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Central Finance"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Difference"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Open items" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Status" })
				] }) }),
				/* @__PURE__ */ (0, k.jsx)("tbody", { children: e.accounts.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", {
					className: e.status === "variance" ? "hl" : "",
					children: [
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.account }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.name }),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: On(e.s4_balance)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: On(e.cfin_balance)
						}),
						/* @__PURE__ */ (0, k.jsxs)("td", {
							className: "num",
							children: [/* @__PURE__ */ (0, k.jsx)("span", {
								className: "rr-bar",
								style: { width: `${Math.abs(e.difference) / t * 60}px` },
								"aria-hidden": "true"
							}), kn(e.difference)]
						}),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.open_items }),
						/* @__PURE__ */ (0, k.jsxs)("td", { children: [
							/* @__PURE__ */ (0, k.jsx)(Ln, { status: e.status === "variance" ? "EXCEPTION" : (e.status, "PASS") }),
							" ",
							e.status.replace("_", " ")
						] })
					]
				}, e.account)) }),
				/* @__PURE__ */ (0, k.jsx)("tfoot", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", {
						colSpan: "2",
						children: "Total"
					}),
					/* @__PURE__ */ (0, k.jsx)("td", {
						className: "num",
						children: On(e.summary.s4_total)
					}),
					/* @__PURE__ */ (0, k.jsx)("td", {
						className: "num",
						children: On(e.summary.cfin_total)
					}),
					/* @__PURE__ */ (0, k.jsx)("td", {
						className: "num",
						children: kn(e.summary.variance)
					}),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.summary.open_items }),
					/* @__PURE__ */ (0, k.jsx)("td", {})
				] }) })
			]
		}), /* @__PURE__ */ (0, k.jsx)("p", {
			className: "rr-note",
			children: "S/4HANA lines come from the synthetic history. Central Finance lines are derived from the document-level differences so that every column adds up."
		})]
	});
}
var Bn = [
	["all", "All rows"],
	["exceptions", "Exceptions only"],
	["MATCHED", "Matched"],
	["UNMATCHED_SOURCE", "Unmatched source"],
	["UNMATCHED_TARGET", "Unmatched target"],
	["AMOUNT_MISMATCH", "Amount mismatch"],
	["TIMING_DIFFERENCE", "Timing difference"],
	["DUPLICATE", "Duplicate"],
	["REQUIRES_REVIEW", "Requires review"]
];
function Vn({ report: e }) {
	let [t, n] = (0, _.useState)("all"), r = e.matching, i = r.totals, a = r.rows.filter((e) => t === "all" || (t === "exceptions" ? e.status !== "MATCHED" : e.status === t));
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "rr-match-totals",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Matched" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: i.matched_count })] }),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Exceptions" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: i.exception_count })] }),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Sum of row differences" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: kn(i.difference_total) })] }),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Summary variance" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: kn(i.summary_variance) })] }),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Check" }), /* @__PURE__ */ (0, k.jsx)("strong", {
						className: i.reconciles ? "rr-match-ok" : "rr-match-bad",
						"data-testid": "match-check",
						children: i.reconciles ? "Rows explain the variance" : "Rows do not explain the variance"
					})] })
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)("label", {
				className: "rr-filter",
				children: ["Show ", /* @__PURE__ */ (0, k.jsx)("select", {
					value: t,
					onChange: (e) => n(e.target.value),
					"aria-label": "Matching status filter",
					children: Bn.map(([e, t]) => /* @__PURE__ */ (0, k.jsx)("option", {
						value: e,
						children: t
					}, e))
				})]
			}),
			/* @__PURE__ */ (0, k.jsxs)("table", {
				className: "rr-table",
				"data-testid": "matching-table",
				children: [
					/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Matching key" }),
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Source ref" }),
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Target ref" }),
						/* @__PURE__ */ (0, k.jsx)("th", {
							className: "num",
							children: "Amount"
						}),
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Cur." }),
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Posting date" }),
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Rule" }),
						/* @__PURE__ */ (0, k.jsx)("th", {
							className: "num",
							children: "Difference"
						}),
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Status" }),
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Exception reason" })
					] }) }),
					/* @__PURE__ */ (0, k.jsxs)("tbody", { children: [a.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", {
						className: e.status === "MATCHED" ? "" : "hl",
						children: [
							/* @__PURE__ */ (0, k.jsx)("td", { children: e.matching_key }),
							/* @__PURE__ */ (0, k.jsx)("td", { children: e.source_ref }),
							/* @__PURE__ */ (0, k.jsx)("td", { children: e.target_ref || "none" }),
							/* @__PURE__ */ (0, k.jsx)("td", {
								className: "num",
								children: On(e.amount)
							}),
							/* @__PURE__ */ (0, k.jsx)("td", { children: e.currency }),
							/* @__PURE__ */ (0, k.jsx)("td", { children: e.posting_date || "n/a" }),
							/* @__PURE__ */ (0, k.jsx)("td", { children: e.rule }),
							/* @__PURE__ */ (0, k.jsx)("td", {
								className: "num",
								children: kn(e.difference)
							}),
							/* @__PURE__ */ (0, k.jsx)("td", { children: e.status }),
							/* @__PURE__ */ (0, k.jsx)("td", { children: e.reason || "none" })
						]
					}, e.matching_key)), !a.length && /* @__PURE__ */ (0, k.jsx)("tr", { children: /* @__PURE__ */ (0, k.jsx)("td", {
						colSpan: "10",
						children: "No rows with this status in this period."
					}) })] }),
					/* @__PURE__ */ (0, k.jsx)("tfoot", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, k.jsx)("th", {
							colSpan: "7",
							children: "Total of all rows"
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: kn(i.difference_total)
						}),
						/* @__PURE__ */ (0, k.jsxs)("td", {
							colSpan: "2",
							children: ["Summary variance ", kn(i.summary_variance)]
						})
					] }) })
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)("p", {
				className: "rr-note",
				children: [
					i.scope_note,
					" ",
					e.sign_convention
				]
			})
		]
	});
}
var Hn = [
	["Post General Journal Entries (F0718), SAP Help", "https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/7340a09096454b7abf4379f926a21567/950f8054747b053de10000000a441470.html?version=2023.latest"],
	["Manage Journal Entries, SAP Help", "https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/3cb1182b4a184bdd93f8d62e3f1f0741/d2d78154f9a7033de10000000a441470.html?version=2023.latest"],
	["Verify General Journal Entries – For Requester, SAP Help", "https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/6b33e9e760b840098d4c66f49121dc98.html"],
	["SAP Fiori Apps Reference Library", "https://fioriappslibrary.hana.ondemand.com/"]
], Un = {
	no: "No journal entry",
	conditional: "Conditional",
	after_investigation: "Only after investigation"
};
function Wn({ report: e }) {
	let t = e.manual_posting;
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane rr-guide",
		"data-testid": "posting-guide",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "rr-banner warn",
				children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "Manual posting only" }), /* @__PURE__ */ (0, k.jsx)("span", { children: "This app never posts to SAP and shows no SAP document number. A person with SAP authorization posts, after approval." })]
			}),
			/* @__PURE__ */ (0, k.jsx)("h3", { children: "Which items need a journal entry?" }),
			e.items.length ? /* @__PURE__ */ (0, k.jsxs)("table", {
				className: "rr-table",
				children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Item" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Cause" }),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Difference"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Manual G/L entry" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Recommended route" })
				] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: e.items.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.item_id }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.category_label }),
					/* @__PURE__ */ (0, k.jsx)("td", {
						className: "num",
						children: kn(e.difference)
					}),
					/* @__PURE__ */ (0, k.jsx)("td", { children: Un[e.treatment.manual_journal_entry] }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.treatment.route })
				] }, e.item_id)) })]
			}) : /* @__PURE__ */ (0, k.jsx)("p", {
				className: "rr-empty",
				children: "No reconciling items for this period, so there is nothing to correct."
			}),
			/* @__PURE__ */ (0, k.jsx)("h3", { children: "SAP Fiori apps" }),
			/* @__PURE__ */ (0, k.jsx)("div", {
				className: "rr-apps",
				children: t.apps.map((e) => /* @__PURE__ */ (0, k.jsxs)("article", { children: [
					/* @__PURE__ */ (0, k.jsxs)("b", { children: [
						e.id,
						" · ",
						e.name
					] }),
					/* @__PURE__ */ (0, k.jsx)("p", { children: e.use }),
					/* @__PURE__ */ (0, k.jsx)("p", { children: /* @__PURE__ */ (0, k.jsx)("em", { children: e.note }) })
				] }, e.id))
			}),
			/* @__PURE__ */ (0, k.jsx)("h3", { children: "Manual workflow" }),
			/* @__PURE__ */ (0, k.jsx)("ol", { children: t.steps.map((e) => /* @__PURE__ */ (0, k.jsxs)("li", { children: [
				/* @__PURE__ */ (0, k.jsxs)("strong", { children: [e.title, "."] }),
				" ",
				e.text
			] }, e.title)) }),
			/* @__PURE__ */ (0, k.jsxs)("details", { children: [
				/* @__PURE__ */ (0, k.jsx)("summary", { children: "Fields the accountant reviews before posting" }),
				/* @__PURE__ */ (0, k.jsx)("ul", { children: t.fields.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) }),
				/* @__PURE__ */ (0, k.jsx)("p", {
					className: "rr-note",
					children: "No account, amount or posting rule is proposed here. Any example would be synthetic and is intentionally not shown."
				})
			] }),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "rr-not-done",
				children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "What this app did not do" }), /* @__PURE__ */ (0, k.jsx)("ul", { children: t.not_done.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) })]
			}),
			/* @__PURE__ */ (0, k.jsx)("p", {
				className: "rr-note",
				children: t.verification
			}),
			/* @__PURE__ */ (0, k.jsx)("p", {
				className: "rr-note",
				children: Hn.map(([e, t], n) => /* @__PURE__ */ (0, k.jsxs)(_.Fragment, { children: [n > 0 && " · ", /* @__PURE__ */ (0, k.jsxs)("a", {
					href: t,
					target: "_blank",
					rel: "noreferrer",
					children: [e, " ↗"]
				})] }, t))
			})
		]
	});
}
function Gn({ report: e }) {
	let [t, n] = (0, _.useState)("all"), [r, i] = (0, _.useState)("all"), [a, o] = (0, _.useState)(null), s = e.items.filter((e) => (t === "all" || e.status === t) && (r === "all" || e.materiality === r));
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "rr-filters",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("label", { children: ["Status", /* @__PURE__ */ (0, k.jsxs)("select", {
						value: t,
						onChange: (e) => n(e.target.value),
						children: [
							/* @__PURE__ */ (0, k.jsx)("option", {
								value: "all",
								children: "All"
							}),
							/* @__PURE__ */ (0, k.jsx)("option", {
								value: "needs_review",
								children: "Needs review"
							}),
							/* @__PURE__ */ (0, k.jsx)("option", {
								value: "explained",
								children: "Explained"
							})
						]
					})] }),
					/* @__PURE__ */ (0, k.jsxs)("label", { children: ["Materiality", /* @__PURE__ */ (0, k.jsxs)("select", {
						value: r,
						onChange: (e) => i(e.target.value),
						children: [
							/* @__PURE__ */ (0, k.jsx)("option", {
								value: "all",
								children: "All"
							}),
							/* @__PURE__ */ (0, k.jsx)("option", {
								value: "high",
								children: "High"
							}),
							/* @__PURE__ */ (0, k.jsx)("option", {
								value: "medium",
								children: "Medium"
							}),
							/* @__PURE__ */ (0, k.jsx)("option", {
								value: "low",
								children: "Low"
							})
						]
					})] }),
					/* @__PURE__ */ (0, k.jsxs)("span", { children: [
						s.length,
						" of ",
						e.items.length,
						" items"
					] })
				]
			}),
			e.items.length === 0 ? /* @__PURE__ */ (0, k.jsx)("p", {
				className: "rr-empty",
				children: "No reconciling items for this period."
			}) : /* @__PURE__ */ (0, k.jsxs)("table", {
				className: "rr-table",
				children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", {}),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Document" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Type" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Account" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Posted" }),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "S/4HANA"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Central Finance"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Difference"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Reason" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Status" })
				] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: s.map((e) => /* @__PURE__ */ (0, k.jsxs)(_.Fragment, { children: [/* @__PURE__ */ (0, k.jsxs)("tr", {
					className: a === e.item_id ? "hl" : "",
					children: [
						/* @__PURE__ */ (0, k.jsx)("td", { children: /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							className: "rr-expand",
							"aria-expanded": a === e.item_id,
							"aria-label": `Details for ${e.document_id}`,
							onClick: () => o(a === e.item_id ? null : e.item_id),
							children: a === e.item_id ? "▾" : "▸"
						}) }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.document_id }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.document_type }),
						/* @__PURE__ */ (0, k.jsxs)("td", { children: [
							e.account,
							" ",
							e.account_name
						] }),
						/* @__PURE__ */ (0, k.jsxs)("td", { children: [
							e.posting_date,
							" · ",
							e.age_days,
							"d"
						] }),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: On(e.s4_amount)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: On(e.cfin_amount)
						}),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: /* @__PURE__ */ (0, k.jsx)("strong", { children: kn(e.difference) })
						}),
						/* @__PURE__ */ (0, k.jsxs)("td", { children: [
							e.reason_code,
							" · ",
							e.category_label
						] }),
						/* @__PURE__ */ (0, k.jsxs)("td", { children: [
							/* @__PURE__ */ (0, k.jsx)(Ln, { status: e.status === "explained" ? "PASS" : "HOLD" }),
							" ",
							e.status.replace("_", " "),
							" · ",
							e.materiality
						] })
					]
				}), a === e.item_id && /* @__PURE__ */ (0, k.jsxs)("tr", {
					className: "rr-detail",
					children: [/* @__PURE__ */ (0, k.jsx)("td", {}), /* @__PURE__ */ (0, k.jsx)("td", {
						colSpan: "9",
						children: /* @__PURE__ */ (0, k.jsxs)("div", {
							className: "rr-detail-grid",
							children: [
								/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "AIF / mapping" }), /* @__PURE__ */ (0, k.jsxs)("strong", { children: [
									e.aif_status,
									" · ",
									e.mapping_status
								] })] }),
								/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Owner" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: e.owner })] }),
								/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "SAP reference" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: e.sap_reference })] }),
								/* @__PURE__ */ (0, k.jsxs)("div", {
									className: "wide",
									children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Recommended action" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: e.recommended_action })]
								}),
								/* @__PURE__ */ (0, k.jsxs)("div", {
									className: "wide",
									children: [
										/* @__PURE__ */ (0, k.jsxs)("span", { children: [
											"AI assessment · ",
											Math.round(e.ai.confidence * 100),
											"% confidence"
										] }),
										/* @__PURE__ */ (0, k.jsx)("strong", { children: e.ai.rationale }),
										/* @__PURE__ */ (0, k.jsx)("small", { children: e.ai.basis })
									]
								})
							]
						})
					})]
				})] }, e.item_id)) })]
			}),
			/* @__PURE__ */ (0, k.jsxs)("details", {
				className: "rr-matched",
				children: [/* @__PURE__ */ (0, k.jsxs)("summary", { children: [/* @__PURE__ */ (0, k.jsxs)("strong", { children: [
					"Matched movements (",
					e.matched.length,
					")"
				] }), " · agree in S/4HANA and Central Finance"] }), /* @__PURE__ */ (0, k.jsxs)("table", {
					className: "rr-table",
					children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Journal" }),
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Account" }),
						/* @__PURE__ */ (0, k.jsx)("th", { children: "Description" }),
						/* @__PURE__ */ (0, k.jsx)("th", {
							className: "num",
							children: "Amount"
						})
					] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: e.matched.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.journal_id }),
						/* @__PURE__ */ (0, k.jsxs)("td", { children: [
							e.account,
							" ",
							e.account_name
						] }),
						/* @__PURE__ */ (0, k.jsx)("td", { children: e.description }),
						/* @__PURE__ */ (0, k.jsx)("td", {
							className: "num",
							children: On(e.amount)
						})
					] }, e.journal_id)) })]
				})]
			})
		]
	});
}
function Kn({ report: e }) {
	let t = Math.max(1, ...e.aging.map((e) => Math.abs(e.amount)));
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane",
		children: [
			/* @__PURE__ */ (0, k.jsx)("p", {
				className: "rr-note",
				children: "Age of open reconciling items at the period end."
			}),
			/* @__PURE__ */ (0, k.jsx)("div", {
				className: "rr-aging",
				children: e.aging.map((e) => /* @__PURE__ */ (0, k.jsxs)("div", { children: [
					/* @__PURE__ */ (0, k.jsx)("span", { children: e.bucket }),
					/* @__PURE__ */ (0, k.jsx)("div", {
						className: "rr-meter",
						children: /* @__PURE__ */ (0, k.jsx)("i", { style: { width: `${Math.abs(e.amount) / t * 100}%` } })
					}),
					/* @__PURE__ */ (0, k.jsxs)("strong", { children: [
						e.count,
						" item",
						e.count === 1 ? "" : "s",
						" · ",
						kn(e.amount)
					] })
				] }, e.bucket))
			}),
			e.aging[3].count + e.aging[2].count > 0 && /* @__PURE__ */ (0, k.jsxs)("p", {
				className: "rr-banner warn",
				children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "Older items" }), /* @__PURE__ */ (0, k.jsx)("span", { children: "Items older than 30 days need an owner and a clearing date before sign-off." })]
			})
		]
	});
}
function qn({ report: e }) {
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane",
		children: [/* @__PURE__ */ (0, k.jsx)("p", {
			className: "rr-note",
			children: "PASS, HOLD and NOT_VERIFIED are reported separately. NOT_VERIFIED means the demo cannot prove it without a real tenant."
		}), /* @__PURE__ */ (0, k.jsxs)("table", {
			className: "rr-table",
			children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, k.jsx)("th", { children: "ID" }),
				/* @__PURE__ */ (0, k.jsx)("th", { children: "Control" }),
				/* @__PURE__ */ (0, k.jsx)("th", { children: "Status" }),
				/* @__PURE__ */ (0, k.jsx)("th", { children: "Detail" })
			] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: e.controls.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, k.jsx)("td", { children: e.id }),
				/* @__PURE__ */ (0, k.jsx)("td", { children: e.name }),
				/* @__PURE__ */ (0, k.jsx)("td", { children: /* @__PURE__ */ (0, k.jsx)(Ln, { status: e.status }) }),
				/* @__PURE__ */ (0, k.jsx)("td", { children: e.detail })
			] }, e.id)) })]
		})]
	});
}
function Jn({ report: e }) {
	let t = e.ai_review;
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("p", {
				className: "rr-banner info",
				children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "Advisory only" }), /* @__PURE__ */ (0, k.jsxs)("span", { children: [
					"The assistant explains and ranks. A person decides. Model: ",
					t.model,
					"."
				] })]
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "rr-grid2",
				children: [/* @__PURE__ */ (0, k.jsxs)("section", { children: [/* @__PURE__ */ (0, k.jsx)("h3", { children: "What the AI did" }), /* @__PURE__ */ (0, k.jsx)("ul", { children: t.did.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) })] }), /* @__PURE__ */ (0, k.jsxs)("section", { children: [/* @__PURE__ */ (0, k.jsx)("h3", { children: "What it did not do" }), /* @__PURE__ */ (0, k.jsx)("ul", { children: t.did_not.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: e }, e)) })] })]
			}),
			/* @__PURE__ */ (0, k.jsxs)("section", { children: [
				/* @__PURE__ */ (0, k.jsx)("h3", { children: "Confidence by item" }),
				e.items.length ? /* @__PURE__ */ (0, k.jsx)("div", {
					className: "rr-aging",
					children: e.items.map((e) => /* @__PURE__ */ (0, k.jsxs)("div", { children: [
						/* @__PURE__ */ (0, k.jsx)("span", { children: e.document_id }),
						/* @__PURE__ */ (0, k.jsx)("div", {
							className: "rr-meter",
							children: /* @__PURE__ */ (0, k.jsx)("i", {
								style: { width: `${e.ai.confidence * 100}%` },
								className: e.ai.confidence < .7 ? "low" : ""
							})
						}),
						/* @__PURE__ */ (0, k.jsxs)("strong", { children: [
							Math.round(e.ai.confidence * 100),
							"% · ",
							e.ai.classification
						] })
					] }, e.item_id))
				}) : /* @__PURE__ */ (0, k.jsx)("p", {
					className: "rr-empty",
					children: "Nothing to classify."
				}),
				/* @__PURE__ */ (0, k.jsx)("p", {
					className: "rr-note",
					children: "Items below 70% confidence are flagged for human review."
				})
			] })
		]
	});
}
function Yn({ report: e }) {
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "rr-pane",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "rr-detail-grid",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Report" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: e.report_id })] }),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Case / route" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: e.case_id ? `${e.case_id} · ${e.scenario}` : "Not attached" })] }),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Trace" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: e.trace_id || "Run the period to attach a trace" })] }),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "As of" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: e.as_of })] })
				]
			}),
			/* @__PURE__ */ (0, k.jsx)("h3", { children: "Source evidence" }),
			/* @__PURE__ */ (0, k.jsxs)("table", {
				className: "rr-table",
				children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Source" }),
					/* @__PURE__ */ (0, k.jsx)("th", {
						className: "num",
						children: "Balance"
					}),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Freshness" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Timestamp" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Evidence id" })
				] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: e.sources.map((t) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("td", { children: t.source }),
					/* @__PURE__ */ (0, k.jsx)("td", {
						className: "num",
						children: On(t.balance)
					}),
					/* @__PURE__ */ (0, k.jsxs)("td", { children: [
						/* @__PURE__ */ (0, k.jsx)(Ln, { status: t.freshness === "current" ? "PASS" : "HOLD" }),
						" ",
						t.freshness
					] }),
					/* @__PURE__ */ (0, k.jsxs)("td", { children: [t.timestamp_utc?.replace("T", " ").slice(0, 16), " UTC"] }),
					/* @__PURE__ */ (0, k.jsxs)("td", { children: [
						"SYN-",
						t.source.toUpperCase(),
						"-",
						e.period,
						"-AGG"
					] })
				] }, t.source)) })]
			}),
			/* @__PURE__ */ (0, k.jsxs)("h3", { children: [
				"Stored events (",
				e.events.length,
				")"
			] }),
			e.events.length ? /* @__PURE__ */ (0, k.jsxs)("table", {
				className: "rr-table",
				children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("th", { children: "#" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "From" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "To" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Operation" }),
					/* @__PURE__ */ (0, k.jsx)("th", { children: "Status" })
				] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: e.events.map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.seq }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.source }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.target }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.operation }),
					/* @__PURE__ */ (0, k.jsx)("td", { children: e.status })
				] }, e.seq)) })]
			}) : /* @__PURE__ */ (0, k.jsx)("p", {
				className: "rr-empty",
				children: "No run is attached to this report. Run the period to record events."
			}),
			/* @__PURE__ */ (0, k.jsx)("p", {
				className: "rr-note",
				children: e.disclaimer
			})
		]
	});
}
function Xn({ report: e, period: t, periods: n, onPeriod: r, onClose: i }) {
	let a = (0, _.useRef)(null), [o, s] = (0, _.useState)("summary"), [c, l] = (0, _.useState)(!1);
	(0, _.useEffect)(() => {
		let e = a.current;
		return e && !e.open && e.showModal(), () => {
			e?.open && e.close();
		};
	}, []), (0, _.useEffect)(() => {
		if (!c) return;
		let e = () => l(!1);
		window.addEventListener("afterprint", e);
		let t = setTimeout(() => {
			try {
				window.print();
			} catch {
				e();
			}
		}, 60);
		return () => {
			clearTimeout(t), window.removeEventListener("afterprint", e);
		};
	}, [c]);
	let u = (0, _.useMemo)(() => e ? {
		summary: /* @__PURE__ */ (0, k.jsx)(Rn, { report: e }),
		accounts: /* @__PURE__ */ (0, k.jsx)(zn, { report: e }),
		matching: /* @__PURE__ */ (0, k.jsx)(Vn, { report: e }),
		posting: /* @__PURE__ */ (0, k.jsx)(Wn, { report: e }),
		items: /* @__PURE__ */ (0, k.jsx)(Gn, { report: e }),
		aging: /* @__PURE__ */ (0, k.jsx)(Kn, { report: e }),
		controls: /* @__PURE__ */ (0, k.jsx)(qn, { report: e }),
		ai: /* @__PURE__ */ (0, k.jsx)(Jn, { report: e }),
		audit: /* @__PURE__ */ (0, k.jsx)(Yn, { report: e })
	}[o] : null, [e, o]);
	return /* @__PURE__ */ (0, k.jsxs)("dialog", {
		ref: a,
		className: "rr-dialog",
		"aria-labelledby": "rr-title",
		onClose: i,
		children: [/* @__PURE__ */ (0, k.jsxs)("header", {
			className: "rr-header",
			children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [
				/* @__PURE__ */ (0, k.jsxs)("span", {
					className: "eyebrow",
					children: ["SYNTHETIC RECONCILIATION REPORT · ", e?.report_id || `RPT-${t}`]
				}),
				/* @__PURE__ */ (0, k.jsx)("h2", {
					id: "rr-title",
					children: e ? `Company code ${e.company_code} · ledger ${e.ledger} · ${e.period_label} (FY${e.fiscal.year} P${String(e.fiscal.period).padStart(2, "0")}) · ${e.currency}` : `Loading report for ${t}…`
				}),
				e && /* @__PURE__ */ (0, k.jsx)(xe, {
					provenance: e.provenance,
					compact: !0
				})
			] }), /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "rr-actions",
				children: [
					r && /* @__PURE__ */ (0, k.jsx)(N, {
						period: t,
						periods: n,
						onPeriod: r,
						id: "rr-period"
					}),
					e && /* @__PURE__ */ (0, k.jsx)("span", {
						className: `rr-chip ${Mn[e.summary.status]}`,
						children: jn[e.summary.status]
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						disabled: !e,
						onClick: () => Nn(`${e.report_id}-items.csv`, "text/csv", Fn(e)),
						children: "Items CSV ⤓"
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						disabled: !e,
						onClick: () => Nn(`${e.report_id}.json`, "application/json", JSON.stringify(e, null, 2)),
						children: "Report JSON ⤓"
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						disabled: !e,
						onClick: () => l(!0),
						children: "Print full report"
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: i,
						"aria-label": "Close reconciliation report",
						children: "×"
					})
				]
			})]
		}), e && c ? /* @__PURE__ */ (0, k.jsx)("div", {
			className: "rr-body rr-print-all",
			children: An.map(([t, n]) => /* @__PURE__ */ (0, k.jsxs)("section", { children: [/* @__PURE__ */ (0, k.jsx)("h2", { children: n }), {
				summary: /* @__PURE__ */ (0, k.jsx)(Rn, { report: e }),
				accounts: /* @__PURE__ */ (0, k.jsx)(zn, { report: e }),
				matching: /* @__PURE__ */ (0, k.jsx)(Vn, { report: e }),
				posting: /* @__PURE__ */ (0, k.jsx)(Wn, { report: e }),
				items: /* @__PURE__ */ (0, k.jsx)(Gn, { report: e }),
				aging: /* @__PURE__ */ (0, k.jsx)(Kn, { report: e }),
				controls: /* @__PURE__ */ (0, k.jsx)(qn, { report: e }),
				ai: /* @__PURE__ */ (0, k.jsx)(Jn, { report: e }),
				audit: /* @__PURE__ */ (0, k.jsx)(Yn, { report: e })
			}[t]] }, t))
		}) : e ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("div", {
			className: "rr-tabs",
			role: "tablist",
			"aria-label": "Report sections",
			onKeyDown: (e) => {
				let t = An.findIndex(([e]) => e === o);
				e.key === "ArrowRight" && (s(An[(t + 1) % An.length][0]), e.preventDefault()), e.key === "ArrowLeft" && (s(An[(t + An.length - 1) % An.length][0]), e.preventDefault());
			},
			children: An.map(([t, n]) => /* @__PURE__ */ (0, k.jsxs)("button", {
				type: "button",
				role: "tab",
				"aria-selected": o === t,
				tabIndex: o === t ? 0 : -1,
				className: o === t ? "active" : "",
				onClick: () => s(t),
				children: [n, t === "items" && e.items.length ? /* @__PURE__ */ (0, k.jsx)("em", { children: e.items.length }) : null]
			}, t))
		}), /* @__PURE__ */ (0, k.jsx)("div", {
			className: "rr-body",
			role: "tabpanel",
			children: u
		})] }) : /* @__PURE__ */ (0, k.jsx)("div", {
			className: "rr-body",
			children: /* @__PURE__ */ (0, k.jsx)("p", {
				className: "rr-empty",
				role: "status",
				children: "Loading the synthetic report…"
			})
		})]
	});
}
// src/orchestrationSvg.js
var Zn = {
	w: 1200,
	h: 660
}, Qn = (e, t, n, r, i, a, o = {}) => ({
	id: e,
	row: t,
	col: n,
	title: r,
	sub: i,
	kind: a,
	...o
}), $n = [
	["invoke", "MCP-style tools/call (in-process)"],
	["registry", "Reaches application layer"],
	["identity", "Needs input"],
	["approval", "Blocked by a control"]
], er = {
	"Selected gateway": [
		"Selected MCP gateway",
		"gateway",
		"S1 Apigee or S2 AgentCore"
	],
	"Domain MCP": [
		"Domain MCP tools",
		"domain",
		"Finance read tools"
	],
	"SAP BAIP": [
		"SAP integration",
		"integration",
		"API Management and iFlow"
	],
	"SAP backends": [
		"SAP backends",
		"backend",
		"S/4HANA, Central Finance, BW"
	],
	"Enterprise Databricks": [
		"Databricks",
		"data",
		"Data evidence"
	],
	"AWS runtime": [
		"Agent runtime",
		"domain",
		"Runs the finance agent"
	],
	"Business entry": [
		"Business request",
		"agent",
		"Intent and scope"
	],
	"AWS controls": [
		"Agent identity",
		"identity",
		"Workload identity"
	],
	"Model branch": [
		"AI advisory",
		"agent",
		"Explanation only"
	],
	"Write approval": [
		"Write approval",
		"decision",
		"Separate branch"
	],
	"Future BDC": [
		"BDC (future)",
		"data",
		"Reference only"
	],
	"AI Foundry design time": [
		"Agent registration",
		"registry",
		"Design time"
	]
}, tr = {
	done: "#107E3E",
	running: "#E9730C",
	held: "#E9730C",
	blocked: "#BB0000",
	pending: void 0
};
function nr(e, t, n) {
	return t < n ? e.status : t === n ? "running" : "pending";
}
function rr({ plan: e, catalog: t, shown: n, selectedAgent: r }) {
	let i = (t?.agents || []).filter((e) => e.kind !== "orchestrator"), a = e?.steps || [], o = Math.min(n, a.length), s = (t, r) => e ? nr(t, r, n) : "pending", c = {};
	a.forEach((e, t) => {
		(c[e.agent] ||= []).push({
			step: e,
			index: t
		});
	});
	let l = [], u = e ? o >= a.length ? "All steps dispatched" : `Dispatching step ${o + 1} of ${a.length}` : "Waiting for a request";
	l.push(Qn("orch", 0, 1.5, "Orchestrator · tool client", e ? `${e.orchestrator?.rule || ""}. ${u}. It plans and calls tools; it never touches SAP.` : "Ask a question to start. It plans and calls tools; it never touches SAP.", "agent", {
		span: 3,
		h: 84,
		zone: "agent:orchestrator",
		status: e ? u : "Idle",
		statusColor: e ? "#0A4F9E" : "#506778",
		stroke: r === "orchestrator" ? "#0A6ED1" : "#0A4F9E",
		strokeWidth: 2.4
	})), i.forEach((e, t) => {
		let n = c[e.id] || [], a = n.map(({ step: e, index: t }) => s(e, t)), o = n.length > 0 && a.some((e) => e !== "pending"), u = a.includes("blocked") ? "blocked" : a.includes("held") ? "held" : a.includes("running") ? "running" : o ? "done" : "pending", d = a.filter((e) => e === "done").length;
		l.push(Qn(`agent:${e.id}`, 1, t + (6 - i.length) / 2, e.name, `${e.mcp_server} · ${e.tools.join(", ")}`, "domain", {
			h: 84,
			zone: `agent:${e.id}`,
			status: n.length ? o ? `${d}/${n.length} calls done${n.every(({ step: e }) => !e.trace?.layers?.length) ? " · computed locally" : ""}` : "Queued" : "Not called",
			statusColor: o ? tr[u] : "#506778",
			stroke: r === e.id ? "#0A6ED1" : o ? tr[u] : "#B8C7D3",
			strokeWidth: r === e.id ? 3.2 : o ? 2.2 : 1.2,
			dashed: !o && n.length === 0
		}));
	});
	let d = [], f = [];
	a.forEach((e, t) => {
		let n = s(e, t);
		n !== "pending" && n !== "running" && (e.trace?.layers || []).forEach((t, n) => {
			d.includes(t) || d.push(t), f.push([
				`agent:${e.agent}`,
				`layer:${t}`,
				"registry",
				n === 0 && e.trace?.count ? `${e.trace.count} events` : ""
			]);
		});
	}), d.forEach((e, t) => {
		let n = er[e] || [
			e,
			"control",
			""
		];
		l.push(Qn(`layer:${e}`, t < 6 ? 2 : 3, t % 6, n[0], n[2], n[1], {
			h: 84,
			status: "Reached",
			statusColor: "#0D6A33",
			stroke: "#107E3E",
			strokeWidth: 1.8
		}));
	});
	let p = /* @__PURE__ */ new Set(), m = f.filter(([e, t]) => !p.has(`${e}>${t}`) && p.add(`${e}>${t}`)), h = [];
	return Object.entries(c).forEach(([e, t]) => {
		let n = t.map(({ step: e, index: t }) => s(e, t));
		if (n.every((e) => e === "pending")) return;
		let r = n.includes("blocked") ? "blocked" : n.includes("held") ? "held" : "ok", i = `#${t.map(({ index: e }) => e + 1).join(" #")} ${t[0].step.tool}${t.length > 1 ? ` +${t.length - 1}` : ""}`;
		h.push([
			"orch",
			`agent:${e}`,
			r === "blocked" ? "approval" : r === "held" ? "identity" : "invoke",
			i,
			{ active: n.includes("running") }
		]);
	}), h.push(...m), Ft({
		cols: 6,
		ys: [
			96,
			224,
			392,
			508
		],
		nh: 84,
		height: Zn.h,
		nodes: l,
		edges: h,
		bounds: [],
		legend: $n,
		captions: [[
			88,
			"ORCHESTRATOR · TOOL CLIENT",
			"end"
		], [
			382,
			"APPLICATION LAYERS THE EVENTS TOUCHED",
			"end"
		]],
		title: e ? `Orchestration · ${String(e.intent).replace("_", " ")}` : "Orchestration · waiting for a request",
		chain: a.length ? a.map((e, t) => `#${t + 1} ${e.agent}.${e.tool}`).join(" → ") : "Orchestrator → specialist agents (tool providers) → application layers",
		banner: "SIMULATED AGENTS · DETERMINISTIC RULES · NO LLM · NO SAP WRITES",
		footer: "Each arrow from the orchestrator is an in-process, MCP-style tool call (no MCP transport). Layers are drawn only from the stored events each step produced; steps with none were computed locally."
	});
}
// src/AgentWorkbench.jsx
var ir = {
	done: "✓",
	running: "…",
	pending: "·",
	held: "?",
	blocked: "✕",
	skipped: "–"
}, ar = {
	treasury: "Open Cash & treasury",
	"treasury-forecast": "Open the cash forecast",
	"treasury-banks": "Open bank relationships",
	run: "Open the live architecture",
	report: "Open the detailed report",
	"evidence-proof": "Open the proof dossier",
	"decision-responsibilities": "Open responsibilities & governance",
	close: "Open Close & reconcile",
	plan: "Stay here"
}, or = /* @__PURE__ */ new Set(), sr = () => {
	try {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	} catch {
		return !1;
	}
};
function cr({ onAsk: e, busy: t, label: n = "Ask the agents", period: r = y, periods: i, domain: a = "reconciliation" }) {
	let [o, s] = be(r, a);
	return /* @__PURE__ */ (0, k.jsxs)("form", {
		className: "surface agent-ask-bar",
		onSubmit: (n) => {
			n.preventDefault(), o.trim() && !t && e(o.trim());
		},
		children: [
			/* @__PURE__ */ (0, k.jsxs)("label", {
				htmlFor: "ask-bar-input",
				children: [/* @__PURE__ */ (0, k.jsx)("span", {
					className: "eyebrow",
					children: "AGENTS · SIMULATED"
				}), /* @__PURE__ */ (0, k.jsx)("strong", { children: n })]
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "ask-main",
				children: [/* @__PURE__ */ (0, k.jsx)("input", {
					id: "ask-bar-input",
					value: o,
					onChange: (e) => s(e.target.value),
					"aria-label": n
				}), /* @__PURE__ */ (0, k.jsxs)("span", {
					className: "ask-meta",
					children: [/* @__PURE__ */ (0, k.jsx)(ye, {
						text: o,
						period: r,
						periods: i
					}), /* @__PURE__ */ (0, k.jsx)(P, { text: o })]
				})]
			}),
			/* @__PURE__ */ (0, k.jsx)("button", {
				type: "submit",
				className: "primary",
				disabled: t,
				children: t ? "Running…" : "Ask →"
			})
		]
	});
}
function lr({ plan: e }) {
	return /* @__PURE__ */ (0, k.jsxs)("section", {
		className: "surface aw-result tr-result",
		"aria-label": "Result",
		"data-testid": "module-result",
		"data-module": e.domain,
		children: [
			/* @__PURE__ */ (0, k.jsxs)("span", {
				className: "eyebrow",
				children: [
					"RESULT · ",
					e.effective_period,
					" · SYNTHETIC DATA · NOT AN SAP BALANCE"
				]
			}),
			/* @__PURE__ */ (0, k.jsx)(M, { blocks: e.result_blocks }),
			e.references?.length > 0 && /* @__PURE__ */ (0, k.jsxs)("details", {
				open: !0,
				className: "tr-sources",
				"data-testid": "module-sources",
				children: [/* @__PURE__ */ (0, k.jsx)("summary", { children: /* @__PURE__ */ (0, k.jsx)("b", { children: "SAP sources behind this answer" }) }), /* @__PURE__ */ (0, k.jsx)("ul", {
					className: "tr-refs",
					children: e.references.map((e) => /* @__PURE__ */ (0, k.jsxs)("li", { children: [
						/* @__PURE__ */ (0, k.jsxs)("a", {
							href: e.url,
							target: "_blank",
							rel: "noreferrer",
							children: [
								e.id,
								" · ",
								e.title,
								" ↗"
							]
						}),
						" ",
						/* @__PURE__ */ (0, k.jsxs)("small", { children: [
							e.supports,
							" [",
							e.status,
							"]"
						] })
					] }, e.id))
				})]
			})
		]
	});
}
function ur({ catalog: e, plan: t, busy: n, onAsk: r, onOpenLayer: i, onOpenConcept: a, onOpenOutput: o, period: s = y, periods: c, ontology: l }) {
	let u = ie(), d = e?.order || ["reconciliation"], [f, p] = (0, _.useState)(null), m = f || e?.default || d[0], h = p;
	(0, _.useEffect)(() => {
		t?.domain && p(t.domain);
	}, [t?.plan_id]);
	let g = e?.domains?.[m] || e, v = t && (t.domain || e?.default) === m ? t : null, b = g?.agents || [], x = (e) => b.find((t) => t.id === e)?.kind === "orchestrator", S = (b.find((e) => e.kind === "orchestrator") || {}).id || "orchestrator", [w, E] = be(s, m), D = u.examples(m, s), O = (e) => ((l?.classes || []).find((t) => t.id === e) || {}).label || String(e).split(".").pop(), [ee, te] = (0, _.useState)(0), [ne, re] = (0, _.useState)(null), [ae, oe] = (0, _.useState)(null), [se, ce] = (0, _.useState)(!1), le = (0, _.useRef)(null), A = v?.steps || [];
	(0, _.useEffect)(() => {
		if (!v || le.current === v.plan_id) return;
		if (le.current = v.plan_id, re(null), sr() || !A.length || or.has(v.plan_id)) {
			or.add(v.plan_id), te(A.length);
			return;
		}
		or.add(v.plan_id), te(0);
		let e = 0, t = setInterval(() => {
			e += 1, te(e), e >= A.length && clearInterval(t);
		}, 650);
		return () => clearInterval(t);
	}, [v?.plan_id]);
	let ue = ne?.agent || null, de = (0, _.useMemo)(() => rr({
		plan: v,
		catalog: g,
		shown: ee,
		selectedAgent: x(ue) ? "orchestrator" : ue
	}), [
		v,
		g,
		ee,
		ue
	]), fe = (0, _.useMemo)(() => ({
		id: "orchestration",
		title: "Orchestration",
		svg: de,
		w: Zn.w,
		h: Zn.h,
		file: "orchestration",
		png: !0
	}), [de]), pe = Object.fromEntries(b.map((e) => [e.id, e])), me = (e) => {
		e.preventDefault(), w.trim() && !n && r(w.trim());
	}, he = (e) => {
		if (!e?.startsWith("agent:")) return;
		let t = e.slice(6);
		if (t === "orchestrator") {
			re({ agent: S });
			return;
		}
		let n = A.find((e) => e.agent === t);
		re({
			agent: t,
			step_id: n?.step_id
		});
	}, j = A.find((e) => e.step_id === ne?.step_id) || null, ge = ne ? pe[ne.agent] : null, _e = v && ee >= A.length;
	return /* @__PURE__ */ (0, k.jsxs)("main", {
		className: "agent-workbench",
		"aria-label": "Agents",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("header", {
				className: "surface aw-header",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "aw-title",
					children: [
						/* @__PURE__ */ (0, k.jsx)("div", {
							className: "domain-switch",
							role: "tablist",
							"aria-label": "Agent family",
							children: d.map((t) => /* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": m === t,
								className: m === t ? "active" : "",
								onClick: () => h(t),
								children: e?.domains?.[t]?.name || t
							}, t))
						}),
						/* @__PURE__ */ (0, k.jsxs)("span", {
							className: "eyebrow",
							children: ["AGENTS · ORCHESTRATED WITH MCP-STYLE TOOL CALLS · ", (g?.name || m).toUpperCase()]
						}),
						/* @__PURE__ */ (0, k.jsx)("h2", { children: "Watch the orchestrator call its agents" }),
						/* @__PURE__ */ (0, k.jsx)("p", { children: "The orchestrator plans and calls specialist agents, each a tool provider with a few typed tools. The calls are MCP-shaped but in-process (no MCP transport yet). Select an agent or a step to see what it did and which application layers its events actually touched." })
					]
				}), /* @__PURE__ */ (0, k.jsxs)("form", {
					className: "aw-ask",
					onSubmit: me,
					children: [
						/* @__PURE__ */ (0, k.jsx)("label", {
							htmlFor: "aw-ask-input",
							className: "sr-only",
							children: "Ask the orchestrator"
						}),
						/* @__PURE__ */ (0, k.jsx)("input", {
							id: "aw-ask-input",
							value: w,
							onChange: (e) => E(e.target.value),
							"aria-label": "Ask the orchestrator"
						}),
						/* @__PURE__ */ (0, k.jsx)("button", {
							type: "submit",
							className: "primary",
							disabled: n,
							children: n ? "Running…" : "Run plan"
						}),
						/* @__PURE__ */ (0, k.jsxs)("span", {
							className: "ask-meta",
							children: [/* @__PURE__ */ (0, k.jsx)(ye, {
								text: w,
								period: s,
								periods: c
							}), /* @__PURE__ */ (0, k.jsx)(P, { text: w })]
						}),
						/* @__PURE__ */ (0, k.jsx)("div", {
							className: "aw-examples",
							role: "group",
							"aria-label": "Example requests",
							children: D.map((e) => /* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								onClick: () => E(e),
								children: e.length > 34 ? e.slice(0, 32) + "…" : e
							}, e))
						})
					]
				})]
			}),
			v && /* @__PURE__ */ (0, k.jsx)("p", {
				className: "aw-period",
				children: /* @__PURE__ */ (0, k.jsxs)("span", {
					className: `domain-badge ${v.domain}`,
					"data-testid": "plan-domain",
					children: ["Handled by ", /* @__PURE__ */ (0, k.jsx)("b", { children: u.label(v.domain) })]
				})
			}),
			v?.message && /* @__PURE__ */ (0, k.jsxs)("p", {
				className: "aw-period",
				"data-testid": "plan-request",
				children: ["Your request: ", /* @__PURE__ */ (0, k.jsxs)("b", { children: [
					"“",
					v.message,
					"”"
				] })]
			}),
			v?.effective_period && /* @__PURE__ */ (0, k.jsxs)("p", {
				className: "aw-period",
				"data-testid": "plan-period",
				children: [
					"Plan period: ",
					/* @__PURE__ */ (0, k.jsx)("b", { children: C(v.effective_period) }),
					" · ",
					T(v.effective_period),
					" · taken from ",
					v.period_source === "request" ? "the request" : v.period_source === "selector" ? "the period selector" : "the open case"
				]
			}),
			v?.effective_period && v.effective_period !== s && /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "period-stale",
				role: "alert",
				"data-testid": "plan-stale",
				children: [
					"This plan is for ",
					C(v.effective_period),
					". The selected period is ",
					C(s),
					". ",
					/* @__PURE__ */ (0, k.jsxs)("button", {
						type: "button",
						onClick: () => r(u.ask(v.domain, s)),
						children: ["Run for ", C(s)]
					})
				]
			}),
			v && (_e || A.length === 0) && /* @__PURE__ */ (0, k.jsxs)("section", {
				className: "surface aw-answer",
				"aria-label": "What the agents found",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
					className: "eyebrow",
					children: "WHAT THE AGENTS FOUND"
				}), /* @__PURE__ */ (0, k.jsx)("p", { children: v.answer || v.blocked_reason || v.note })] }), v.adaptations?.length > 0 && /* @__PURE__ */ (0, k.jsxs)("p", {
					className: "aw-adapt",
					children: [
						/* @__PURE__ */ (0, k.jsx)("b", { children: "The orchestrator adapted the plan:" }),
						" ",
						v.adaptations.map((e) => e.added ? `added ${e.added} because ${e.because}` : e.because).join("; "),
						"."
					]
				})]
			}),
			v && v.status === "done" && (_e || A.length === 0) && (() => {
				let e = u.byId[v.domain]?.output;
				return e?.open_label && /* @__PURE__ */ (0, k.jsxs)("section", {
					className: "surface aw-output",
					"data-testid": "plan-output",
					"aria-label": "Open the full output of this run",
					children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: "FULL OUTPUT OF THIS RUN"
					}), /* @__PURE__ */ (0, k.jsxs)("p", { children: [
						"The answer above is a summary. The complete output for ",
						C(v.effective_period),
						" is on the ",
						e.screen_name,
						" screen."
					] })] }), /* @__PURE__ */ (0, k.jsxs)("div", {
						className: "aw-output-actions",
						children: [/* @__PURE__ */ (0, k.jsxs)("button", {
							type: "button",
							className: "primary",
							"data-testid": "plan-output-screen",
							onClick: () => o?.(v, "screen"),
							children: [e.open_label, " →"]
						}), e.detail_label && /* @__PURE__ */ (0, k.jsxs)("button", {
							type: "button",
							"data-testid": "plan-output-detail",
							onClick: () => o?.(v, "detail"),
							children: [e.detail_label, " →"]
						})]
					})]
				});
			})(),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "aw-body",
				children: [/* @__PURE__ */ (0, k.jsx)("section", {
					className: "aw-graph",
					"aria-label": "Orchestration graph",
					children: /* @__PURE__ */ (0, k.jsx)("div", {
						className: "aw-viewer",
						children: /* @__PURE__ */ (0, k.jsx)($t, {
							diagram: fe,
							uid: "orch",
							view: ae,
							onView: oe,
							onFit: oe,
							expanded: se,
							onExpand: ce,
							onPick: he
						})
					})
				}), /* @__PURE__ */ (0, k.jsxs)("aside", {
					className: "surface aw-side",
					"aria-label": "Orchestration log and step detail",
					children: [
						/* @__PURE__ */ (0, k.jsx)("h3", { children: "Orchestration log" }),
						v ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
							/* @__PURE__ */ (0, k.jsxs)("div", {
								className: `aw-plan-state ${v.status}`,
								role: "status",
								children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: String(v.intent).replace("_", " ") }), /* @__PURE__ */ (0, k.jsx)("span", { children: v.blocked_reason || (_e || A.length === 0 ? {
									done: "Plan complete.",
									needs_input: "Stopped: it needs one more detail.",
									blocked: "Stopped at a control. Nothing was changed."
								}[v.status] || "" : `Dispatching step ${Math.min(ee + 1, A.length)} of ${A.length}…`) })]
							}),
							/* @__PURE__ */ (0, k.jsxs)("ol", {
								className: "aw-log",
								children: [/* @__PURE__ */ (0, k.jsx)("li", {
									className: "orch",
									children: /* @__PURE__ */ (0, k.jsxs)("button", {
										type: "button",
										onClick: () => re({ agent: S }),
										children: [
											/* @__PURE__ */ (0, k.jsx)("span", {
												className: "aw-mark",
												children: "◆"
											}),
											/* @__PURE__ */ (0, k.jsx)("b", { children: "Orchestrator" }),
											/* @__PURE__ */ (0, k.jsxs)("small", { children: [
												"Planned ",
												A.length,
												" step",
												A.length === 1 ? "" : "s",
												" (",
												v.orchestrator?.rule,
												"). Calls each agent with an MCP-style tool call (in-process)."
											] })
										]
									})
								}), A.map((e, t) => {
									let n = nr(e, t, ee);
									return n === "pending" && t > ee ? null : /* @__PURE__ */ (0, k.jsx)("li", {
										className: `${n} ${ne?.step_id === e.step_id ? "sel" : ""}`,
										children: /* @__PURE__ */ (0, k.jsxs)("button", {
											type: "button",
											onClick: () => re({
												agent: e.agent,
												step_id: e.step_id
											}),
											children: [
												/* @__PURE__ */ (0, k.jsx)("span", {
													className: "aw-mark",
													"aria-hidden": "true",
													children: ir[n]
												}),
												/* @__PURE__ */ (0, k.jsxs)("b", { children: [
													"#",
													t + 1,
													" ",
													pe[e.agent]?.name || e.agent
												] }),
												/* @__PURE__ */ (0, k.jsx)("small", { children: n === "running" ? e.purpose : e.summary || e.purpose }),
												e.added_by && /* @__PURE__ */ (0, k.jsxs)("small", {
													className: "aw-added",
													children: ["Added by the orchestrator: ", e.added_by]
												}),
												/* @__PURE__ */ (0, k.jsxs)("code", {
													className: "tech",
													children: [
														e.mcp?.server,
														" · ",
														e.tool,
														" · ",
														e.duration_ms ?? 0,
														" ms"
													]
												})
											]
										})
									}, e.step_id);
								})]
							}),
							A.length === 0 && /* @__PURE__ */ (0, k.jsx)("p", {
								className: `aw-note ${v.status === "blocked" ? "bad" : ""}`,
								children: v.blocked_reason || v.note
							})
						] }) : /* @__PURE__ */ (0, k.jsx)("p", {
							className: "aw-empty",
							children: "No plan yet. Run a request to see the orchestrator dispatch its calls."
						}),
						ge && /* @__PURE__ */ (0, k.jsxs)("div", {
							className: "aw-detail",
							"aria-live": "polite",
							children: [
								/* @__PURE__ */ (0, k.jsxs)("h3", { children: [ge.name, j ? ` · step #${A.indexOf(j) + 1}` : ""] }),
								/* @__PURE__ */ (0, k.jsx)("p", { children: ge.role }),
								j ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
									/* @__PURE__ */ (0, k.jsxs)("dl", { children: [
										/* @__PURE__ */ (0, k.jsx)("dt", { children: "Tool provider" }),
										/* @__PURE__ */ (0, k.jsx)("dd", { children: j.mcp?.server }),
										/* @__PURE__ */ (0, k.jsx)("dt", { children: "Call" }),
										/* @__PURE__ */ (0, k.jsxs)("dd", { children: [
											/* @__PURE__ */ (0, k.jsx)("code", { children: "tools/call" }),
											" (MCP-style) · ",
											j.tool,
											" (",
											j.rw,
											")"
										] }),
										/* @__PURE__ */ (0, k.jsx)("dt", { children: "Result" }),
										/* @__PURE__ */ (0, k.jsx)("dd", { children: j.summary || "Pending" }),
										/* @__PURE__ */ (0, k.jsx)("dt", { children: "Layers reached" }),
										/* @__PURE__ */ (0, k.jsx)("dd", { children: j.trace?.layers?.length ? j.trace.layers.join(" → ") : "None. Computed locally, no application layer called." }),
										/* @__PURE__ */ (0, k.jsx)("dt", { children: "Events" }),
										/* @__PURE__ */ (0, k.jsxs)("dd", { children: [
											j.trace?.count ?? 0,
											" stored",
											j.trace?.first_seq ? ` · #${j.trace.first_seq}–#${j.trace.last_seq}` : ""
										] })
									] }),
									(() => {
										let e = (g?.tools || []).find((e) => e.name === j.tool), t = [...(e?.reads || []).map((e) => ["reads", e]), ...(e?.produces || []).map((e) => ["produces", e])];
										return t.length > 0 && /* @__PURE__ */ (0, k.jsxs)("div", {
											className: "concept-chips",
											"data-testid": "concept-chips",
											children: [/* @__PURE__ */ (0, k.jsx)("span", {
												className: "micro",
												children: "Concepts:"
											}), t.map(([e, t]) => /* @__PURE__ */ (0, k.jsxs)("button", {
												type: "button",
												className: `concept-chip ${e}`,
												"data-testid": "concept-chip",
												onClick: () => a?.(t),
												children: [
													e,
													" · ",
													O(t)
												]
											}, e + t))]
										});
									})(),
									j.trace?.hops?.length > 0 && /* @__PURE__ */ (0, k.jsxs)("details", {
										className: "aw-hops",
										children: [/* @__PURE__ */ (0, k.jsxs)("summary", { children: [
											"Calls made (",
											j.trace.hops.length,
											" distinct hops)"
										] }), /* @__PURE__ */ (0, k.jsx)("ul", { children: j.trace.hops.map((e, t) => /* @__PURE__ */ (0, k.jsxs)("li", { children: [
											/* @__PURE__ */ (0, k.jsxs)("code", { children: [
												e.from,
												" → ",
												e.to
											] }),
											" · ",
											e.operation
										] }, t)) })]
									}),
									/* @__PURE__ */ (0, k.jsxs)("details", {
										className: "tech aw-json",
										children: [/* @__PURE__ */ (0, k.jsx)("summary", { children: "MCP-shaped request (illustrative, never sent)" }), /* @__PURE__ */ (0, k.jsx)("pre", { children: JSON.stringify({
											note: "in-process call; no MCP transport",
											jsonrpc: "2.0",
											method: "tools/call",
											params: {
												name: j.tool,
												arguments: j.mcp?.arguments || {}
											}
										}, null, 2) })]
									}),
									/* @__PURE__ */ (0, k.jsxs)("button", {
										type: "button",
										className: "aw-open",
										onClick: () => i(ge, j),
										children: [ge.view_label || ar[j.view || ge.view] || "Open layer", " →"]
									})
								] }) : /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
									/* @__PURE__ */ (0, k.jsxs)("dl", { children: [
										/* @__PURE__ */ (0, k.jsx)("dt", { children: "Tool provider" }),
										/* @__PURE__ */ (0, k.jsx)("dd", { children: ge.mcp_server }),
										/* @__PURE__ */ (0, k.jsx)("dt", { children: "Tools" }),
										/* @__PURE__ */ (0, k.jsx)("dd", { children: ge.tools.join(", ") }),
										/* @__PURE__ */ (0, k.jsx)("dt", { children: "Layers it can reach" }),
										/* @__PURE__ */ (0, k.jsx)("dd", { children: ge.layers.join(" → ") || "None; it only plans and calls" })
									] }),
									/* @__PURE__ */ (0, k.jsx)("p", {
										className: "aw-note",
										children: x(ge.id) ? "It chose this plan with a fixed rule table, then called each agent in order. No model is involved." : "Not called in this plan."
									}),
									!x(ge.id) && /* @__PURE__ */ (0, k.jsxs)("button", {
										type: "button",
										className: "aw-open",
										onClick: () => i(ge),
										children: [ge.view_label || ar[ge.view] || "Open layer", " →"]
									})
								] })
							]
						})
					]
				})]
			}),
			v?.result_blocks?.length > 0 && (_e || A.length === 0) && /* @__PURE__ */ (0, k.jsx)(lr, { plan: v }),
			/* @__PURE__ */ (0, k.jsxs)("section", {
				className: "surface aw-roster",
				"aria-label": "Agent roster",
				children: [/* @__PURE__ */ (0, k.jsx)("div", {
					className: "aw-roster-head",
					children: /* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: "AGENT ROSTER"
					}), /* @__PURE__ */ (0, k.jsx)("strong", { children: "Who does what" })] })
				}), /* @__PURE__ */ (0, k.jsx)("ul", { children: b.map((e) => {
					let t = A.filter((t) => t.agent === e.id);
					return /* @__PURE__ */ (0, k.jsx)("li", { children: /* @__PURE__ */ (0, k.jsxs)("button", {
						type: "button",
						className: `agent-card ${ne?.agent === e.id ? "active" : ""}`,
						onClick: () => re({
							agent: e.id,
							step_id: t[0]?.step_id
						}),
						"aria-label": `Select ${e.name} agent`,
						children: [
							/* @__PURE__ */ (0, k.jsx)("strong", { children: e.name }),
							/* @__PURE__ */ (0, k.jsx)("span", { children: e.role }),
							/* @__PURE__ */ (0, k.jsx)("small", {
								className: "aw-chips",
								children: e.tools.map((e) => /* @__PURE__ */ (0, k.jsx)("i", { children: e }, e))
							}),
							/* @__PURE__ */ (0, k.jsx)("em", { children: e.mcp_server }),
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: "aw-last",
								children: t.length ? t.map((e) => e.summary || e.purpose).join(" · ") : "Not called in this plan"
							})
						]
					}) }, e.id);
				}) })]
			}),
			/* @__PURE__ */ (0, k.jsxs)("details", {
				className: "surface aw-catalog",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("summary", { children: [
						/* @__PURE__ */ (0, k.jsx)("strong", { children: "Tool catalog" }),
						" ",
						/* @__PURE__ */ (0, k.jsxs)("span", { children: [
							"tools/list-shaped · ",
							g?.tools?.length || 0,
							" tools · writes are not tools"
						] })
					] }),
					/* @__PURE__ */ (0, k.jsxs)("table", {
						className: "rr-table",
						children: [/* @__PURE__ */ (0, k.jsx)("thead", { children: /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, k.jsx)("th", { children: "Tool" }),
							/* @__PURE__ */ (0, k.jsx)("th", { children: "Agent" }),
							/* @__PURE__ */ (0, k.jsx)("th", { children: "Class" }),
							/* @__PURE__ */ (0, k.jsx)("th", { children: "Input" }),
							/* @__PURE__ */ (0, k.jsx)("th", { children: "Output" })
						] }) }), /* @__PURE__ */ (0, k.jsx)("tbody", { children: (g?.tools || []).map((e) => /* @__PURE__ */ (0, k.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, k.jsx)("td", { children: /* @__PURE__ */ (0, k.jsx)("code", { children: e.name }) }),
							/* @__PURE__ */ (0, k.jsx)("td", { children: pe[e.agent]?.name }),
							/* @__PURE__ */ (0, k.jsx)("td", { children: e.rw }),
							/* @__PURE__ */ (0, k.jsx)("td", { children: /* @__PURE__ */ (0, k.jsx)("code", { children: JSON.stringify(e.input) }) }),
							/* @__PURE__ */ (0, k.jsx)("td", { children: e.output })
						] }, e.name)) })]
					}),
					/* @__PURE__ */ (0, k.jsxs)("p", {
						className: "micro",
						children: [
							"Not registered as tools, by design: ",
							(g?.not_tools || []).join(", "),
							". ",
							g?.note
						]
					})
				]
			})
		]
	});
}
// src/Entry.jsx
function dr({ periodCount: e, localBundle: t, onOpenApp: n, onOpenAgents: r, onOpenArchitecture: i, onOpenTreasury: a, onAsk: o, onGo: s, period: c = y, periods: l, onPeriod: u }) {
	let d = ie(), [f, p] = be(c, d.def?.id), m = d.modules.flatMap((e) => d.examples(e.id, c).slice(0, 2));
	return /* @__PURE__ */ (0, k.jsxs)("main", {
		className: "entry",
		"aria-label": "Finance agents home",
		children: [
			/* @__PURE__ */ (0, k.jsxs)("section", {
				className: "entry-hero",
				children: [
					/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: "FINANCE / AGENTS"
					}),
					/* @__PURE__ */ (0, k.jsx)("h2", { children: "Ask the finance agents" }),
					/* @__PURE__ */ (0, k.jsx)("p", { children: "An orchestrator plans your request, routes it to the right agent module, and calls its specialist agents with MCP-style tool calls. They read the simulated SAP finance layers; people approve and nothing is posted." }),
					/* @__PURE__ */ (0, k.jsxs)("form", {
						className: "entry-ask",
						onSubmit: (e) => {
							e.preventDefault(), f.trim() && o(f.trim());
						},
						children: [
							u && /* @__PURE__ */ (0, k.jsx)(N, {
								period: c,
								periods: l,
								onPeriod: u,
								id: "entry-period"
							}),
							/* @__PURE__ */ (0, k.jsx)("label", {
								htmlFor: "entry-ask-input",
								className: "sr-only",
								children: "What should the agents do?"
							}),
							/* @__PURE__ */ (0, k.jsx)("input", {
								id: "entry-ask-input",
								value: f,
								onChange: (e) => p(e.target.value),
								"aria-label": "What should the agents do?"
							}),
							/* @__PURE__ */ (0, k.jsx)("button", {
								type: "submit",
								className: "primary",
								children: "Run plan →"
							})
						]
					}),
					/* @__PURE__ */ (0, k.jsx)("div", {
						className: "entry-examples",
						role: "group",
						"aria-label": "Example requests",
						children: m.map((e) => /* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							onClick: () => p(e),
							children: e
						}, e))
					}),
					/* @__PURE__ */ (0, k.jsxs)("span", {
						className: "ask-meta",
						children: [/* @__PURE__ */ (0, k.jsx)(ye, {
							text: f,
							period: c,
							periods: l
						}), /* @__PURE__ */ (0, k.jsx)(P, { text: f })]
					})
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)("section", {
				className: "entry-how",
				"aria-label": "How it works",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "You ask" }), /* @__PURE__ */ (0, k.jsx)("span", { children: "Plain request" })] }),
					/* @__PURE__ */ (0, k.jsx)("b", {
						"aria-hidden": "true",
						children: "→"
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "hot",
						children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "Orchestrator" }), /* @__PURE__ */ (0, k.jsx)("span", { children: "Tool client · plans and calls" })]
					}),
					/* @__PURE__ */ (0, k.jsx)("b", {
						"aria-hidden": "true",
						children: "→"
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "Specialist agents" }), /* @__PURE__ */ (0, k.jsx)("span", { children: "Tool providers · typed tools" })] }),
					/* @__PURE__ */ (0, k.jsx)("b", {
						"aria-hidden": "true",
						children: "→"
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "Application layers" }), /* @__PURE__ */ (0, k.jsx)("span", { children: "Gateway · SAP integration · SAP · Databricks" })] })
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)("ul", {
				className: "entry-cards",
				children: [
					d.tabs.map((e) => /* @__PURE__ */ (0, k.jsx)("li", { children: /* @__PURE__ */ (0, k.jsxs)("button", {
						type: "button",
						className: "entry-card",
						onClick: () => s?.(e.tab.id),
						"aria-label": `Open ${e.short_name}`,
						"data-module": e.id,
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", {
								"aria-hidden": "true",
								children: e.icon
							}),
							/* @__PURE__ */ (0, k.jsx)("strong", { children: e.short_name }),
							/* @__PURE__ */ (0, k.jsx)("small", { children: e.blurb }),
							/* @__PURE__ */ (0, k.jsxs)("em", { children: [
								"Open ",
								e.short_name,
								" →"
							] })
						]
					}) }, e.id)),
					/* @__PURE__ */ (0, k.jsx)("li", { children: /* @__PURE__ */ (0, k.jsxs)("button", {
						type: "button",
						className: "entry-card",
						onClick: r,
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", {
								"aria-hidden": "true",
								children: "◆"
							}),
							/* @__PURE__ */ (0, k.jsx)("strong", { children: "Watch the agents work" }),
							/* @__PURE__ */ (0, k.jsx)("small", { children: "See the orchestrator call each agent and which layers it reached." }),
							/* @__PURE__ */ (0, k.jsx)("em", { children: "Open Agents →" })
						]
					}) }),
					/* @__PURE__ */ (0, k.jsx)("li", { children: /* @__PURE__ */ (0, k.jsxs)("button", {
						type: "button",
						className: "entry-card",
						onClick: i,
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", {
								"aria-hidden": "true",
								children: "⬡"
							}),
							/* @__PURE__ */ (0, k.jsx)("strong", { children: "Review the architecture" }),
							/* @__PURE__ */ (0, k.jsx)("small", { children: "Live run, S1 · S2 · S3 options, governance and diagrams." }),
							/* @__PURE__ */ (0, k.jsx)("em", { children: "Open Architecture →" })
						]
					}) })
				]
			}),
			s && /* @__PURE__ */ (0, k.jsxs)("section", {
				className: "entry-roles",
				"aria-label": "Start from your audience",
				children: [/* @__PURE__ */ (0, k.jsx)("h3", { children: "Presenting this? Start from your audience" }), /* @__PURE__ */ (0, k.jsx)("ul", { children: yn.map((e) => /* @__PURE__ */ (0, k.jsxs)("li", { children: [
					/* @__PURE__ */ (0, k.jsx)("strong", { children: e.name }),
					/* @__PURE__ */ (0, k.jsx)("small", { children: e.ask }),
					/* @__PURE__ */ (0, k.jsx)("div", {
						className: "role-links",
						children: e.links.map(([e, t]) => /* @__PURE__ */ (0, k.jsxs)("button", {
							type: "button",
							onClick: () => s(e),
							children: [t, " →"]
						}, e + t))
					})
				] }, e.id)) })]
			}),
			"    ",
			t && /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "entry-download",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "Run it on your laptop" }), /* @__PURE__ */ (0, k.jsxs)("span", { children: [
					"Windows bundle. Python is needed on first launch. ",
					Math.round(t.bytes / 1024),
					" KB · SHA-256 ",
					t.sha256.slice(0, 12),
					"…"
				] })] }), /* @__PURE__ */ (0, k.jsx)("a", {
					href: t.url,
					download: "finance_reconciliation_local_windows.zip",
					"aria-label": "Download local Windows demo bundle",
					children: "Download Windows bundle ↓"
				})]
			})
		]
	});
}
// src/liveArchitecture.js
var fr = {
	w: 1200,
	h: 520
}, pr = (e, t, n, r, i, a, o = {}) => ({
	id: e,
	row: t,
	col: n,
	title: r,
	sub: i,
	kind: a,
	...o
}), mr = [
	["invoke", "Tool call"],
	["return", "Evidence"],
	["registry", "Reference"],
	["deploy", "Registration"],
	["identity", "Identity"],
	["approval", "Approval"]
], hr = [[
	92,
	"DESIGN TIME AND IDENTITY",
	"end"
], [
	322,
	"RESULT, EVIDENCE AND APPROVAL",
	"start"
]], gr = {
	"Business entry": "agent",
	"AWS runtime": "domain",
	"Selected gateway": "gateway",
	"Domain MCP": "domain",
	"SAP BAIP": "integration",
	"SAP backends": "backend",
	"Enterprise Databricks": "data",
	"Future BDC": "data",
	"Model branch": "agent",
	"AI Foundry design time": "registry",
	"AWS controls": "identity",
	"Write approval": "decision"
}, _r = {
	"AI Foundry design time": [0, 0],
	"AWS controls": [0, 1],
	"Business entry": [1, 0],
	"AWS runtime": [1, 1],
	"Selected gateway": [1, 2],
	"Domain MCP": [1, 3],
	"SAP BAIP": [1, 4],
	"SAP backends": [1, 5],
	"Enterprise Databricks": [2, 3],
	"Future BDC": [2, 4],
	"Write approval": [2, 0],
	"Model branch": [2, 2]
};
function vr({ registry: e, events: t, scenario: n, selectedZone: r, liveRunning: i, reportReady: a, zoneShort: o }) {
	let s = e?.components || [], c = Object.fromEntries(s.map((e) => [e.component_id, e.zone])), l = (e) => s.filter((t) => t.zone === e).length, u = {};
	for (let e of t) {
		let t = c[e.direction === "response" ? e.source_component_id : e.target_component_id];
		t && (u[t] = (u[t] || 0) + 1);
	}
	let d = t.at(-1), f = d ? c[d.direction === "response" ? d.source_component_id : d.target_component_id] : null, p = i && f, m = Object.keys(_r).map((e) => {
		let [t, i] = _r[e], a = p && f === e, s = !!u[e], c = a ? "Processing now" : s ? `${u[e]} events` : e === "Future BDC" ? "Future / simulated" : e === "Write approval" ? "Separate branch" : "Waiting", d = e === "Selected gateway" ? `${n} · ${n === "S1" ? "Apigee, external boundary" : "AgentCore, AWS boundary"}` : `${e} · ${l(e)} components`;
		return pr(e, t, i, o[e] || e, d, gr[e], {
			zone: e,
			status: c,
			statusColor: a ? "#B45309" : s ? "#0D6A33" : "#506778",
			stroke: e === r ? "#0A6ED1" : a ? "#E9730C" : s ? "#107E3E" : void 0,
			strokeWidth: e === r ? 3.2 : a ? 3.4 : s ? 2 : void 0,
			dashed: e === "Future BDC",
			cls: a ? "node-current" : ""
		});
	});
	m.push(pr("__report", 2, 1, "Business report", a ? "Analysis and evidence are ready" : "Run the architecture to generate the result", "control", {
		zone: "__report",
		status: a ? "Complete · open report" : "Awaiting run",
		statusColor: a ? "#0D6A33" : "#506778",
		stroke: a ? "#107E3E" : void 0,
		strokeWidth: a ? 2 : void 0
	}));
	let h = (e) => !!(p && f === e), g = [
		[
			"Business entry",
			"AWS runtime",
			"invoke",
			"business intent",
			{ active: h("Business entry") }
		],
		[
			"AWS runtime",
			"Selected gateway",
			"invoke",
			"MCP tool call",
			{ active: h("AWS runtime") }
		],
		[
			"Selected gateway",
			"Domain MCP",
			"invoke",
			"authorized call",
			{ active: h("Selected gateway") }
		],
		[
			"Domain MCP",
			"SAP BAIP",
			"invoke",
			"typed SAP request",
			{ active: h("Domain MCP") }
		],
		[
			"SAP BAIP",
			"SAP backends",
			"invoke",
			"backend read",
			{ active: h("SAP BAIP") }
		],
		[
			"Domain MCP",
			"Enterprise Databricks",
			"invoke",
			"data evidence",
			{ active: h("Enterprise Databricks") }
		],
		[
			"Enterprise Databricks",
			"Future BDC",
			"registry",
			"future reference"
		],
		[
			"AI Foundry design time",
			"AWS runtime",
			"deploy",
			"agent registration",
			{ off: -34 }
		],
		[
			"AWS controls",
			"AWS runtime",
			"identity",
			"agent identity"
		],
		[
			"SAP backends",
			"Model branch",
			"return",
			"SAP evidence",
			{ labelAt: "mid" }
		],
		[
			"Enterprise Databricks",
			"Model branch",
			"return",
			"data evidence",
			{ straight: !0 }
		],
		[
			"Model branch",
			"__report",
			"return",
			"deterministic result",
			{ straight: !0 }
		],
		[
			"__report",
			"Write approval",
			"approval",
			"separate write branch"
		]
	];
	return Ft({
		cols: 6,
		ys: [
			100,
			214,
			334
		],
		nh: 80,
		height: fr.h,
		nodes: m,
		edges: g,
		bounds: [[
			"SAP landscape",
			["SAP BAIP", "SAP backends"],
			"sap"
		]],
		captions: hr,
		legend: mr,
		title: `Live architecture · ${n === "S1" ? "S1 Google Apigee MCP" : "S2 AgentCore Gateway MCP"}`,
		chain: "Finance request → external agent → selected gateway → domain tools → SAP integration → SAP backend",
		banner: p ? "RUN IN PROGRESS · SIMULATED" : "SIMULATED · NO TENANT CONNECTED",
		footer: "Orange outline: processing now. Green outline: visited. Blue outline: selected zone. Select a zone to inspect its components below. Vendor names are simulations."
	});
}
// src/AgentJourney.jsx
var yr = [
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
function br({ events: e = [], running: t = !1, selectedZone: n, onOpenEvidence: r }) {
	let i = yr.map((t) => {
		let n = e.filter((e) => e.operation === t.operation), r = n.findLast((e) => e.direction === t.doneDirection && e.status !== "denied"), i = n.findLast((e) => e.status === "denied");
		return {
			...t,
			event: r || i || n.at(-1),
			state: i && !r ? "held" : r ? "complete" : n.length ? "working" : "waiting"
		};
	});
	return /* @__PURE__ */ (0, k.jsxs)("section", {
		className: "surface agent-journey",
		"aria-label": "External agent and SAP journey",
		children: [/* @__PURE__ */ (0, k.jsxs)("div", {
			className: "agent-journey-heading",
			children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
				className: "eyebrow",
				children: "EXTERNAL AGENT → SAP · SYNTHETIC FLOW"
			}), /* @__PURE__ */ (0, k.jsx)("strong", { children: n })] }), /* @__PURE__ */ (0, k.jsx)("button", {
				type: "button",
				onClick: r,
				children: "Inspect event proof in Evidence →"
			})]
		}), /* @__PURE__ */ (0, k.jsx)("div", {
			className: "agent-journey-stages",
			children: i.map((e, n) => /* @__PURE__ */ (0, k.jsxs)("div", {
				className: `agent-journey-stage ${e.state}`,
				children: [
					/* @__PURE__ */ (0, k.jsxs)("span", { children: [
						String(n + 1).padStart(2, "0"),
						" · ",
						e.label
					] }),
					/* @__PURE__ */ (0, k.jsx)("strong", { children: e.state === "complete" ? e.success : e.state === "held" ? "Held" : e.state === "working" ? "Processing" : e.description }),
					/* @__PURE__ */ (0, k.jsx)("small", { children: e.event ? `Recorded event #${e.event.seq}` : t ? "Awaiting handoff" : "No event yet" })
				]
			}, e.operation))
		})]
	});
}
// src/App.jsx
var xr = {
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
}, Sr = [
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
], Cr = (e) => {
	if (!e) return "Select month";
	let [t, n] = e.split("-").map(Number);
	return new Date(Date.UTC(t, n - 1, 1)).toLocaleString("en-US", {
		month: "short",
		year: "numeric",
		timeZone: "UTC"
	});
}, wr = (e) => e == null ? "—" : new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0
}).format(Number(e));
async function B(e, t = "GET", n) {
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
function Tr(e, t) {
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
function Er({ menuModules: e = [], open: t, onToggle: n, onNavigate: r }) {
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "shell-menu-wrap",
		children: [/* @__PURE__ */ (0, k.jsxs)("button", {
			type: "button",
			className: "shell-menu-trigger",
			onClick: n,
			"aria-label": "Open application menu",
			"aria-expanded": t,
			"aria-controls": "finance-app-menu",
			children: [/* @__PURE__ */ (0, k.jsx)("span", {
				"aria-hidden": "true",
				children: "▦"
			}), /* @__PURE__ */ (0, k.jsx)("span", { children: "Menu" })]
		}), t && /* @__PURE__ */ (0, k.jsxs)("div", {
			id: "finance-app-menu",
			className: "shell-menu-popover",
			role: "menu",
			"aria-label": "Finance application menu",
			children: [
				/* @__PURE__ */ (0, k.jsx)("strong", { children: "Finance workspace" }),
				/* @__PURE__ */ (0, k.jsxs)("button", {
					type: "button",
					role: "menuitem",
					onClick: () => r("launchpad"),
					children: ["⌂ ", /* @__PURE__ */ (0, k.jsx)("span", { children: "My Home" })]
				}),
				/* @__PURE__ */ (0, k.jsxs)("button", {
					type: "button",
					role: "menuitem",
					onClick: () => r("business"),
					children: ["▤ ", /* @__PURE__ */ (0, k.jsx)("span", { children: "Close worklist" })]
				}),
				e.filter((e) => e.tab && e.tab.id !== "business").map((e) => /* @__PURE__ */ (0, k.jsxs)("button", {
					type: "button",
					role: "menuitem",
					onClick: () => r(e.tab.id),
					children: [
						e.icon,
						" ",
						/* @__PURE__ */ (0, k.jsx)("span", { children: e.short_name })
					]
				}, e.id)),
				/* @__PURE__ */ (0, k.jsxs)("button", {
					type: "button",
					role: "menuitem",
					onClick: () => r("architecture"),
					children: ["⇄ ", /* @__PURE__ */ (0, k.jsx)("span", { children: "Live architecture" })]
				}),
				/* @__PURE__ */ (0, k.jsxs)("button", {
					type: "button",
					role: "menuitem",
					onClick: () => r("approaches"),
					children: ["⇌ ", /* @__PURE__ */ (0, k.jsx)("span", { children: "Complete architecture" })]
				}),
				/* @__PURE__ */ (0, k.jsxs)("button", {
					type: "button",
					role: "menuitem",
					onClick: () => r("agent"),
					children: ["✦ ", /* @__PURE__ */ (0, k.jsx)("span", { children: "Ask Finance Agent" })]
				})
			]
		})]
	});
}
var Dr = (e) => `${Number(e) > 0 ? "+" : Number(e) < 0 ? "−" : ""}${wr(Math.abs(Number(e || 0)))}`;
function Or({ summary: e, state: t, period: n, onOpenDetail: r, onAsk: i, onRun: a }) {
	if (t === "none") return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "period-nodata",
		role: "alert",
		"data-testid": "level1-nodata",
		children: ["NO DATA AVAILABLE FOR ", C(n).toUpperCase()]
	});
	if (!e) return /* @__PURE__ */ (0, k.jsx)("div", {
		className: "empty-state",
		role: "status",
		children: /* @__PURE__ */ (0, k.jsxs)("strong", { children: [
			"Loading ",
			C(n),
			"…"
		] })
	});
	let o = e.summary, s = e.matching.totals, c = e.matching.rows.filter((e) => e.status.startsWith("UNMATCHED")).length, l = o.status === "BALANCED" || o.status === "WITHIN_TOLERANCE" ? "ok" : o.status === "EXCEPTION" ? "bad" : o.status === "HOLD" ? "warn" : "";
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "period-panel",
		"data-testid": "period-panel",
		"data-period": e.period,
		children: [
			/* @__PURE__ */ (0, k.jsx)(xe, {
				provenance: e.provenance,
				compact: !0
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: `pp-status ${l}`,
				children: [
					/* @__PURE__ */ (0, k.jsx)("strong", { children: o.status.replace("_", " ") }),
					" · ",
					o.status_text
				]
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "pp-kpis",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [
						/* @__PURE__ */ (0, k.jsx)("span", { children: "Company · ledger" }),
						/* @__PURE__ */ (0, k.jsxs)("strong", { children: [
							e.company_code,
							" · ",
							e.ledger
						] }),
						/* @__PURE__ */ (0, k.jsxs)("small", { children: [
							e.currency,
							" · FY",
							e.fiscal.year,
							" P",
							String(e.fiscal.period).padStart(2, "0")
						] })
					] }),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: o.variance ? "attn" : "",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "Variance" }),
							/* @__PURE__ */ (0, k.jsx)("strong", {
								"data-testid": "level1-variance",
								children: Dr(o.variance)
							}),
							/* @__PURE__ */ (0, k.jsx)("small", { children: "S/4HANA − Central Finance · positive means S/4HANA is higher" })
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Source balance (S/4HANA)" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: wr(o.s4_total) })] }),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Target balance (Central Finance)" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: wr(o.cfin_total) })] }),
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Matched items" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: s.matched_count })] }),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: s.exception_count ? "attn" : "",
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", { children: "Unmatched · exceptions" }),
							/* @__PURE__ */ (0, k.jsxs)("strong", { children: [
								c,
								" · ",
								s.exception_count
							] }),
							/* @__PURE__ */ (0, k.jsxs)("small", { children: ["Unexplained ", wr(o.unexplained)] })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, k.jsx)("div", {
				className: "pp-actions",
				children: /* @__PURE__ */ (0, k.jsx)("button", {
					type: "button",
					className: "primary",
					onClick: r,
					children: "Open detailed reconciliation →"
				})
			}),
			/* @__PURE__ */ (0, k.jsxs)("details", {
				className: "close-process",
				children: [
					/* @__PURE__ */ (0, k.jsx)("summary", { children: "Who does what in the close" }),
					/* @__PURE__ */ (0, k.jsx)("ol", { children: bn.map(([e, t, n]) => /* @__PURE__ */ (0, k.jsxs)("li", { children: [
						/* @__PURE__ */ (0, k.jsx)("b", { children: e }),
						/* @__PURE__ */ (0, k.jsx)("em", { children: t }),
						/* @__PURE__ */ (0, k.jsx)("small", { children: n })
					] }, e)) }),
					/* @__PURE__ */ (0, k.jsxs)("p", { children: [
						/* @__PURE__ */ (0, k.jsx)("strong", { children: "Controls:" }),
						" ",
						xn.join(" · "),
						"."
					] })
				]
			})
		]
	});
}
var kr = [
	"architecture",
	"approaches",
	"mcp",
	"agenthost",
	"brief",
	"ontology",
	"diagrams"
];
function Ar({ result: e, onOpenEvidence: t, onRunCurrent: n, onOpenDetail: r, period: i, summary: a, summaryState: o, onAskPeriod: s }) {
	return e?.scope?.period === i && e?.variance, /* @__PURE__ */ (0, k.jsxs)("section", {
		className: "surface business-result",
		children: [/* @__PURE__ */ (0, k.jsxs)("div", {
			className: "section-heading",
			children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
				className: "eyebrow",
				children: "MONTH-END RECONCILIATION"
			}), /* @__PURE__ */ (0, k.jsx)("h2", { children: "Selected period" })] }), /* @__PURE__ */ (0, k.jsxs)("span", {
				className: "pill quiet",
				"data-testid": "level1-period",
				children: [
					Cr(i),
					" · ",
					T(i)
				]
			})]
		}), /* @__PURE__ */ (0, k.jsx)(Or, {
			summary: a,
			state: o,
			period: i,
			onOpenDetail: r,
			onAsk: s,
			onRun: n
		})]
	});
}
function jr({ caseRecord: e, onClose: t, onOpenEvidence: n }) {
	let r = (0, _.useRef)(null), i = e?.result, a = i?.variance;
	return (0, _.useEffect)(() => {
		let e = r.current;
		return e?.showModal(), () => {
			e?.open && e.close();
		};
	}, []), /* @__PURE__ */ (0, k.jsxs)("dialog", {
		ref: r,
		className: "business-report-dialog",
		"aria-labelledby": "business-report-title",
		onClose: t,
		children: [
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "business-report-header",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [
					/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: "SYNTHETIC MONTH-END RECONCILIATION"
					}),
					/* @__PURE__ */ (0, k.jsx)("h2", {
						id: "business-report-title",
						children: "Business analysis report"
					}),
					/* @__PURE__ */ (0, k.jsx)("p", { children: i ? `${Cr(i.scope?.period)} · ${i.scenario} · ${i.case_id}` : "No completed case selected" })
				] }), /* @__PURE__ */ (0, k.jsx)("button", {
					type: "button",
					onClick: t,
					"aria-label": "Close business report",
					children: "×"
				})]
			}),
			a ? /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "business-report-body",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "business-report-summary",
						children: [
							/* @__PURE__ */ (0, k.jsxs)("div", { children: [
								/* @__PURE__ */ (0, k.jsx)("span", { children: "Variance" }),
								/* @__PURE__ */ (0, k.jsx)("strong", { children: a.amount === null ? "Not comparable" : wr(a.amount) }),
								/* @__PURE__ */ (0, k.jsx)("small", { children: "S/4HANA − Central Finance" })
							] }),
							/* @__PURE__ */ (0, k.jsxs)("div", { children: [
								/* @__PURE__ */ (0, k.jsx)("span", { children: "Result state" }),
								/* @__PURE__ */ (0, k.jsx)("strong", { children: a.state.toUpperCase() }),
								/* @__PURE__ */ (0, k.jsx)("small", { children: a.state === "comparable" ? "Sources are comparable" : "Source review required" })
							] }),
							/* @__PURE__ */ (0, k.jsxs)("div", { children: [
								/* @__PURE__ */ (0, k.jsx)("span", { children: "Period" }),
								/* @__PURE__ */ (0, k.jsx)("strong", { children: Cr(i.scope?.period) }),
								/* @__PURE__ */ (0, k.jsxs)("small", { children: [i.scenario, " synthetic route"] })
							] })
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("section", { children: [
						/* @__PURE__ */ (0, k.jsx)("h3", { children: "Business conclusion" }),
						/* @__PURE__ */ (0, k.jsx)("p", { children: i.advisory_explanation }),
						/* @__PURE__ */ (0, k.jsx)("p", { children: "The calculation is deterministic. Review the supporting records before proposing any variance marker." })
					] }),
					/* @__PURE__ */ (0, k.jsx)("p", {
						className: "business-report-note",
						children: "Synthetic local data only. This report does not post to SAP or prove live system authorization."
					})
				]
			}) : /* @__PURE__ */ (0, k.jsx)("div", {
				className: "business-report-body",
				children: /* @__PURE__ */ (0, k.jsxs)("div", {
					className: "empty-state",
					children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "No completed report yet" }), /* @__PURE__ */ (0, k.jsx)("p", { children: "Run the architecture for a synthetic month-end period, then open Business report again to inspect the calculated result and evidence." })]
				})
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "business-report-actions",
				children: [i && /* @__PURE__ */ (0, k.jsx)("button", {
					type: "button",
					onClick: () => {
						t(), n();
					},
					children: "Inspect source records in Evidence →"
				}), /* @__PURE__ */ (0, k.jsx)("button", {
					type: "button",
					className: "primary",
					onClick: t,
					children: "Close"
				})]
			})
		]
	});
}
function Mr({ registry: e, events: t, scenario: n, selectedZone: r, onZone: i, liveRunning: a, reportReady: o, onOpenReport: s }) {
	let [c, l] = (0, _.useState)(null), [u, d] = (0, _.useState)(!1), f = (0, _.useMemo)(() => vr({
		registry: e,
		events: t,
		scenario: n,
		selectedZone: r,
		liveRunning: a,
		reportReady: o,
		zoneShort: xr
	}), [
		e,
		t,
		n,
		r,
		a,
		o
	]), p = (0, _.useMemo)(() => ({
		id: "live",
		title: `Live architecture · ${n}`,
		svg: f,
		w: fr.w,
		h: fr.h,
		file: "live-architecture",
		png: !0
	}), [f, n]);
	return /* @__PURE__ */ (0, k.jsx)("div", {
		className: "route-viewer",
		"aria-label": "Live architecture topology",
		children: /* @__PURE__ */ (0, k.jsx)($t, {
			diagram: p,
			uid: "live-arch",
			view: c,
			onView: l,
			onFit: l,
			expanded: u,
			onExpand: d,
			onPick: (e) => e === "__report" ? s() : i(e)
		})
	});
}
function Nr({ registry: e, zone: t, events: n, selectedComponent: r, onComponent: i, scenario: a }) {
	let o = (e?.components || []).filter((e) => e.zone === t), s = (0, _.useMemo)(() => {
		let e = {};
		for (let t of n) {
			let n = t.direction === "response" ? t.source_component_id : t.target_component_id;
			e[n] = t;
		}
		return e;
	}, [n]), c = o.find((e) => e.component_id === r) || o[0], l = c && s[c.component_id];
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "detail-layout",
		children: [/* @__PURE__ */ (0, k.jsxs)("section", {
			className: "surface component-panel",
			children: [/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "section-heading",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
					className: "eyebrow",
					children: "COMPONENT LAYER"
				}), /* @__PURE__ */ (0, k.jsx)("h2", { children: t })] }), /* @__PURE__ */ (0, k.jsxs)("span", {
					className: "pill quiet",
					children: [o.length, " nodes"]
				})]
			}), /* @__PURE__ */ (0, k.jsx)("div", {
				className: "component-grid",
				children: o.map((e) => {
					let t = s[e.component_id], n = e.runtime_state === "scenario_s1" && a === "S2" || e.runtime_state === "scenario_s2" && a === "S1", r = n ? `INACTIVE IN ${a}` : e.runtime_state === "future" ? "FUTURE" : e.runtime_state === "inactive" ? "INACTIVE" : t?.direction === "request" ? "PROCESSING" : t ? "RETURNED" : "READY";
					return /* @__PURE__ */ (0, k.jsxs)("button", {
						type: "button",
						onClick: () => i(e.component_id),
						className: `component-tile ${c?.component_id === e.component_id ? "selected" : ""} ${r === "PROCESSING" ? "working" : ""} ${n ? "skipped" : ""}`,
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: "component-type",
								children: e.classification
							}),
							/* @__PURE__ */ (0, k.jsx)("strong", { children: e.display_name }),
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: `component-state ${r === "RETURNED" ? "ok" : r === "PROCESSING" ? "busy" : ""}`,
								children: r
							}),
							t && /* @__PURE__ */ (0, k.jsxs)("small", { children: [
								t.operation.replaceAll("_", " "),
								" · ",
								t.direction
							] })
						]
					}, e.component_id);
				})
			})]
		}), /* @__PURE__ */ (0, k.jsxs)("aside", {
			className: "surface inspector",
			children: [/* @__PURE__ */ (0, k.jsx)("span", {
				className: "eyebrow",
				children: "ARCHITECT INSPECTOR"
			}), c ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
				/* @__PURE__ */ (0, k.jsx)("h2", { children: c.display_name }),
				/* @__PURE__ */ (0, k.jsx)("p", { children: c.purpose }),
				/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "inspector-row",
					children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Owner" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: c.owner })]
				}),
				/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "inspector-row",
					children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Boundary" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: c.trust_boundary })]
				}),
				/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "inspector-row",
					children: [/* @__PURE__ */ (0, k.jsx)("span", { children: "Contract" }), /* @__PURE__ */ (0, k.jsx)("strong", { children: c.request_schema })]
				}),
				/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "inspector-block",
					children: [/* @__PURE__ */ (0, k.jsx)("span", {
						className: "eyebrow",
						children: "LATEST COMPONENT MESSAGE"
					}), l ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsxs)("p", {
						className: "message-operation",
						children: [
							l.operation.replaceAll("_", " "),
							" · ",
							l.direction,
							" · ",
							l.status
						]
					}), /* @__PURE__ */ (0, k.jsx)("pre", { children: JSON.stringify(l.payload_summary || {}, null, 2) })] }) : /* @__PURE__ */ (0, k.jsx)("p", {
						className: "micro",
						children: "Run a question to see this component's bounded input and output."
					})]
				}),
				/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "validation-note",
					children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "Live validation still required" }), /* @__PURE__ */ (0, k.jsx)("p", { children: c.remaining_live_vendor_validation })]
				})
			] }) : /* @__PURE__ */ (0, k.jsx)("p", { children: "Select a component." })]
		})]
	});
}
function Pr({ bridge: e }) {
	let t = !!e, [n, r] = (0, _.useState)(e?.data || null), i = (0, _.useMemo)(() => te((t ? e?.data?.modules : n?.modules) || []), [
		t,
		e?.data?.modules,
		n?.modules
	]), [a, o] = (0, _.useState)("business"), [s, c] = (0, _.useState)("S1"), [l, u] = (0, _.useState)("S1"), [d, f] = (0, _.useState)(e?.data?.conditions || []), [p, m] = (0, _.useState)(e?.data?.agents || null), [h, g] = (0, _.useState)(e?.data?.agent_plan || null), [v, y] = (0, _.useState)(!1), [b, x] = (0, _.useState)(null), [w, T] = (0, _.useState)(() => {
		try {
			return localStorage.getItem("finance.showTech") === "1";
		} catch {
			return !1;
		}
	}), E = (0, _.useRef)("approaches"), [D, ne] = (0, _.useState)(null), [ie, ae] = (0, _.useState)(null), [oe, se] = (0, _.useState)("launchpad"), ce = (0, _.useRef)("business"), [le, A] = (0, _.useState)(!1), [ue, de] = (0, _.useState)(!1), [fe, pe] = (0, _.useState)(null), [me, j] = (0, _.useState)(null), [ge, _e] = (0, _.useState)({
		section: "proof",
		nonce: 0
	}), [ve, M] = (0, _.useState)(!1), [ye, be] = (0, _.useState)("S1"), [P, xe] = (0, _.useState)(O), F = (0, _.useRef)(0), Ce = (0, _.useRef)(0), we = (0, _.useCallback)((e) => {
		S(e) && (F.current += 1, xe(e), ee(e));
	}, []), [Te, Ee] = (0, _.useState)(60), [De, ke] = (0, _.useState)(""), [Ae, je] = (0, _.useState)("Reconcile the selected synthetic period"), [Me, Ne] = (0, _.useState)([{
		role: "assistant",
		text: "Ask about a reconciliation, the source evidence, an architecture component, or a control. Each answer has an inspectable synthetic flow."
	}]), [I, Pe] = (0, _.useState)(null), [Fe, Le] = (0, _.useState)(null), [Re, Ve] = (0, _.useState)([]), [He, Ue] = (0, _.useState)(!1), [We, Ge] = (0, _.useState)("Business entry"), [Ke, qe] = (0, _.useState)(null), [Je, Xe] = (0, _.useState)(null), [Ze, Qe] = (0, _.useState)(null), [et, tt] = (0, _.useState)(!1), [nt, L] = (0, _.useState)(""), [rt, it] = (0, _.useState)([]), [at, ot] = (0, _.useState)([]), [st, ct] = (0, _.useState)(null), [lt, ut] = (0, _.useState)(e?.data?.investigation || null), [dt, ft] = (0, _.useState)([]), [pt, mt] = (0, _.useState)(!1), [ht, gt] = (0, _.useState)("maker"), [_t, vt] = (0, _.useState)(!1), [yt, bt] = (0, _.useState)(e?.data?.decision_run || null), [xt, St] = (0, _.useState)(!1), Ct = (0, _.useRef)(!1), R = (0, _.useRef)(null), wt = (0, _.useRef)(null), Tt = (0, _.useRef)(null), Et = (0, _.useRef)(null), Dt = n?.architecture, Ot = n?.history, [kt, At] = (0, _.useState)(null);
	(0, _.useEffect)(() => {
		if (t) return;
		let e = !1;
		return At(null), B(`/api/reports/${P}`).then((t) => {
			e || At({
				period: P,
				report: t
			});
		}).catch((t) => {
			e || At({
				period: P,
				error: t.message
			});
		}), () => {
			e = !0;
		};
	}, [
		t,
		P,
		Ot,
		I?.case_id,
		I?.status
	]), (0, _.useEffect)(() => {
		t && e.action({
			type: "select_period",
			period: P
		});
	}, [t, P]);
	let jt = t ? e?.data?.period_report?.period === P ? e.data.period_report : null : kt?.period === P && kt.report || null, [Mt, Nt] = (0, _.useState)(null), [Pt, Ft] = (0, _.useState)(0), [It, Lt] = (0, _.useState)({}), Rt = i.tabs.find((e) => e.tab.id === a && e.renderer !== "builtin:reconciliation") || null, zt = Rt?.has_view ? Rt.id : Mt ? "treasury" : null;
	(0, _.useEffect)(() => {
		if (t || !zt) return;
		let e = !1;
		return B(`/api/cockpit/${zt}/view/${P}`).then((t) => {
			e || Lt((e) => ({
				...e,
				[zt]: {
					period: P,
					view: t
				}
			}));
		}).catch((t) => {
			e || Lt((e) => ({
				...e,
				[zt]: {
					period: P,
					error: t.message
				}
			}));
		}), () => {
			e = !0;
		};
	}, [
		t,
		P,
		zt,
		Pt
	]);
	let Bt = (n) => t ? e?.data?.module_views?.[n]?.period === P ? e.data.module_views[n] : null : It[n]?.period === P && It[n].view || null, Vt = (e) => Bt(e) ? "ok" : Ot?.available_periods && !Ot.available_periods.includes(P) || !t && It[e]?.period === P && It[e].error ? "none" : "loading", Ht = Bt("treasury");
	async function Ut(n, r) {
		if (ht !== "approver") {
			L("Switch to the finance approver role first.");
			return;
		}
		L("");
		let i = {
			proposal_id: n.proposal_id,
			approved: r,
			payload_hash: n.payload_hash
		};
		if (t) e.action({
			type: "module_action",
			module: "treasury",
			name: "decide",
			payload: i,
			role: ht
		});
		else try {
			await B("/api/cockpit/treasury/action/decide", "POST", {
				...i,
				approver_id: "finance.approver"
			}), Ft((e) => e + 1);
		} catch (e) {
			L(e.message);
		}
	}
	let [Wt, Gt] = (0, _.useState)(e?.data?.ontology || null), [z, Kt] = (0, _.useState)(null);
	(0, _.useEffect)(() => {
		t ? e?.data?.ontology && Gt(e.data.ontology) : Wt || B("/api/cockpit/ontology").then(Gt).catch(() => {});
	}, [t, e?.data?.ontology]);
	let qt = Object.values(p?.domains || {}).flatMap((e) => e.references || []);
	function Jt(e) {
		Kt(e), o("ontology");
	}
	let Yt = (e) => {
		let t = h;
		if (!t || t.domain !== e || t.status !== "done" || !t.effective_period || t.effective_period !== P) return null;
		let n = String(t.answer || "");
		return /* @__PURE__ */ (0, k.jsxs)("div", {
			className: "surface agent-run-banner",
			"data-testid": "agent-run-banner",
			children: [
				/* @__PURE__ */ (0, k.jsxs)("span", {
					className: "eyebrow",
					children: ["LATEST AGENT RUN · ", C(t.effective_period).toUpperCase()]
				}),
				/* @__PURE__ */ (0, k.jsxs)("span", {
					className: "arb-text",
					children: [n.slice(0, 180), n.length > 180 ? "…" : ""]
				}),
				/* @__PURE__ */ (0, k.jsx)("button", {
					type: "button",
					onClick: () => o("agents"),
					children: "View agent run →"
				})
			]
		});
	};
	function Xt(e, t) {
		let n = i.byId[e.domain];
		if (!n) return;
		let r = e.effective_period;
		r && r !== P && we(r), t === "detail" && n.renderer === "builtin:reconciliation" ? (o("business"), un(r || P)) : t === "detail" && n.renderer === "treasury" ? (o("treasury"), Nt("position")) : n.tab && o(n.tab.id);
	}
	let Zt = Ot?.available_periods, Qt = jt ? "ok" : Zt && !Zt.includes(P) || !t && kt?.period === P && kt.error ? "none" : "loading", $t = at.find((e) => e.case_id === I?.case_id);
	(0, _.useEffect)(() => {
		(a === "business" || a === "agents" || kr.includes(a) || i.tabs.some((e) => e.tab.id === a)) && (ce.current = a);
	}, [a]), (0, _.useEffect)(() => {
		let e = I?.scope?.period;
		!t && e && B(`/api/history/${e}`).then(ct).catch(() => ct(null));
	}, [t, I?.scope?.period]);
	let tn = Ze === null ? Re : Re.slice(0, Ze + 1), nn = Je || tn.at(-1), rn = nn ? nn.direction === "response" ? nn.source_component_id : nn.target_component_id : null, an = Dt?.components?.find((e) => e.component_id === rn)?.zone;
	(0, _.useEffect)(() => {
		if (!t) return Promise.all([B("/api/bootstrap"), B("/api/proposals")]).then(([e, t]) => {
			r(e), it(e.cases || []), ot(t);
		}).catch((e) => L(e.message)), () => {
			R.current?.close();
		};
	}, [t]), (0, _.useEffect)(() => {
		if (!t) return;
		let n = e.data || {};
		r((e) => ({
			...e,
			...n
		})), it(n.cases || []), ot(n.proposals || []), ct(n.history_detail || null), ut(n.investigation || null), ft(n.investigation_events || []), bt(n.decision_run || null), n.decision_run?.status === "complete" && St(!1), n.active_case && (Pe(n.active_case), Le(n.active_case.case_id), be(n.active_case.scenario)), n.events && Ve(n.events), Ue(n.active_case?.status === "queued" || n.active_case?.status === "running"), n.response && n.response_nonce !== Et.current && (Et.current = n.response_nonce, Ct.current = !1, vt(!1), mt(!1), Ne((e) => [...e, {
			role: "assistant",
			text: n.response.answer || n.response.error || "The synthetic operation completed.",
			limited: n.response.status === "limited",
			actions: Tr(n.response, n.active_case || I)
		}]), n.response.error && L(n.response.error));
	}, [t, e?.data]), (0, _.useEffect)(() => {
		if (t || !lt?.investigation_id || !["running", "reconciling"].includes(lt.status)) return;
		let e = !1, n = setInterval(async () => {
			try {
				let [t, n] = await Promise.all([B(`/api/investigations/${lt.investigation_id}`), B(`/api/architecture/events?case_id=${encodeURIComponent(lt.case_id)}`)]);
				e || (ut(t), ft(n), Le(t.case_id), Ve(n));
			} catch (t) {
				e || L(t.message);
			}
		}, 350);
		return () => {
			e = !0, clearInterval(n);
		};
	}, [
		t,
		lt?.investigation_id,
		lt?.status
	]), (0, _.useEffect)(() => {
		!t && a === "evidence" && lt?.case_id && B(`/api/architecture/events?case_id=${encodeURIComponent(lt.case_id)}`).then(ft).catch((e) => L(e.message));
	}, [
		t,
		a,
		lt?.case_id,
		lt?.status
	]), (0, _.useEffect)(() => {
		if (t || !yt?.run_id || yt.status === "complete") return;
		let e = !1, n = setInterval(async () => {
			try {
				let t = await B(`/api/architecture/questions/runs/${encodeURIComponent(yt.run_id)}`);
				e || (bt(t), t.status === "complete" && St(!1));
			} catch (t) {
				e || (L(t.message), St(!1));
			}
		}, 350);
		return () => {
			e = !0, clearInterval(n);
		};
	}, [
		t,
		yt?.run_id,
		yt?.status
	]), (0, _.useEffect)(() => {
		if (!et || !Re.length) return;
		let e = setInterval(() => Qe((e) => {
			let t = (e ?? -1) + 1;
			return t >= Re.length ? (tt(!1), Re.length - 1) : t;
		}), 140);
		return () => clearInterval(e);
	}, [et, Re.length]), (0, _.useEffect)(() => {
		Tt.current && (Tt.current.scrollTop = Tt.current.scrollHeight);
	}, [Me]), (0, _.useEffect)(() => {
		if (!le) return;
		let e = (e) => {
			e.key === "Escape" && A(!1);
		};
		return window.addEventListener("keydown", e), document.getElementById("chat-question")?.focus(), () => window.removeEventListener("keydown", e);
	}, [le]), (0, _.useEffect)(() => {
		if (!ue) return;
		let e = (e) => {
			e.target.closest(".shell-menu-wrap") || de(!1);
		}, t = (e) => {
			e.key === "Escape" && de(!1);
		};
		return document.addEventListener("pointerdown", e), window.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e), window.removeEventListener("keydown", t);
		};
	}, [ue]), (0, _.useEffect)(() => {
		an && Ze === null && Ge(an);
	}, [an, Ze]), (0, _.useEffect)(() => {
		fe && I?.case_id === fe && (pe(null), M(!0));
	}, [fe, I?.case_id]);
	async function sn(n) {
		if (t) {
			e.action({
				type: "load_case",
				case_id: n
			});
			return;
		}
		let r = F.current, [i, a, o] = await Promise.all([
			B(`/api/cases/${encodeURIComponent(n)}`),
			B(`/api/architecture/events?case_id=${encodeURIComponent(n)}`),
			B(`/api/investigations?case_id=${encodeURIComponent(n)}`)
		]);
		Pe(i), ut(o[0] || null), Le(n), be(i.scenario), r === F.current && i.scope?.period && i.scope.period !== P && we(i.scope.period), Ve(a), Qe(null), Xe(null);
	}
	function cn(e) {
		R.current?.close();
		let t = new EventSource(`/api/architecture/runs/${encodeURIComponent(e)}/stream`);
		R.current = t, t.addEventListener("flow", (e) => {
			let t = JSON.parse(e.data);
			Ve((e) => e.some((e) => e.seq === t.seq) ? e : [...e, t]);
		}), t.addEventListener("complete", async () => {
			t.close(), R.current = null, Ue(!1);
			try {
				await sn(e);
				let t = await B("/api/cases");
				it(t.slice(0, 20));
			} catch (e) {
				L(e.message);
			}
		}), t.onerror = () => {
			L("Live connection interrupted. Stored events can be reloaded from the case list.");
		};
	}
	async function ln() {
		L(""), ut(null), o("architecture"), Ve([]), Qe(null), Xe(null), Ue(!0);
		let n = Ae.trim() === "Reconcile the selected synthetic period" || !Ae.trim() ? `Reconcile ${Cr(P)}` : Ae.trim();
		if (t) e.action({
			type: "run",
			message: n,
			scenario: ye,
			period: P,
			pace: Te
		});
		else try {
			let e = await B("/api/runs", "POST", {
				message: n,
				scenario: ye,
				user_id: "finance.user",
				demo_pace_ms: Te
			});
			if (e.follow_up) {
				Ue(!1), L(e.follow_up);
				return;
			}
			Le(e.case_id), Pe({
				case_id: e.case_id,
				scenario: e.scenario,
				scope: e.scope,
				status: "running"
			}), cn(e.case_id);
		} catch (e) {
			Ue(!1), L(e.message);
		}
	}
	async function un(n) {
		if (we(n), ne(n), ae(null), t) e.action({
			type: "report",
			period: n
		});
		else try {
			let e = I?.scope?.period === n ? `?case_id=${encodeURIComponent(I.case_id)}` : "";
			ae(await B(`/api/reports/${n}${e}`));
		} catch (e) {
			L(e.message), ne(null);
		}
	}
	(0, _.useEffect)(() => {
		t ? f(e.data?.conditions || []) : B("/api/conditions").then(f).catch(() => {});
	}, [t, e?.data?.conditions]);
	async function dn(n, i) {
		if (L(""), t) e.action({
			type: "condition",
			period: n,
			condition: i
		});
		else try {
			await B("/api/conditions", "POST", {
				period: n,
				condition: i
			});
			let e = await B("/api/history");
			r((t) => ({
				...t,
				history: e
			})), D && un(D);
		} catch (e) {
			L(e.message);
		}
	}
	function fn() {
		ne(null), ae(null), t && e.action({
			type: "report",
			period: null
		});
	}
	(0, _.useEffect)(() => {
		t && D && e.data?.report?.period === D && ae(e.data.report);
	}, [
		t,
		D,
		e?.data?.report
	]), (0, _.useEffect)(() => {
		try {
			localStorage.setItem("finance.showTech", w ? "1" : "0");
		} catch {}
	}, [w]), (0, _.useEffect)(() => {
		kr.includes(a) && (E.current = a);
	}, [a]), (0, _.useEffect)(() => {
		if (t) {
			let t = e.data || {};
			t.agents && m(t.agents), t.agent_plan && t.agent_plan.plan_id !== h?.plan_id && (g(t.agent_plan), y(!1), t.agent_plan.period_source === "request" && t.agent_plan.effective_period && we(t.agent_plan.effective_period));
		} else B("/api/agent/catalog").then(m).catch(() => {});
	}, [
		t,
		e?.data?.agents,
		e?.data?.agent_plan
	]);
	async function pn(n) {
		L(""), se("app"), o("agents"), y(!0);
		let i = ++Ce.current;
		if (t) e.action({
			type: "agent_plan",
			message: n,
			scenario: ye,
			case_id: I?.case_id || null,
			period: P
		});
		else try {
			let e = await B("/api/agent/plan", "POST", {
				message: n,
				scenario: ye,
				user_id: "finance.user",
				case_id: I?.case_id || null,
				period: P,
				demo_pace_ms: 0
			});
			if (i !== Ce.current) return;
			if (e.period_source === "request" && e.effective_period && e.effective_period !== P && we(e.effective_period), g(e), Ft((e) => e + 1), e.trace_case_id && !e.case_id && (Le(e.trace_case_id), Ve(await B(`/api/architecture/events?case_id=${encodeURIComponent(e.trace_case_id)}`)), Qe(null)), e.case_id) {
				await sn(e.case_id);
				let t = await B("/api/history");
				r((e) => ({
					...e,
					history: t
				})), it((await B("/api/cases")).slice(0, 20));
			}
		} catch (e) {
			L(e.message);
		} finally {
			y(!1);
		}
	}
	function hn(e, t) {
		if (!e?.id) return;
		x({
			id: e.id,
			name: e.name,
			role: e.role,
			tools: e.tools || []
		});
		let n = t?.view || e.view, r = t?.ref?.period || I?.scope?.period || Ot?.available_periods?.at(-1);
		if (n === "run") o("architecture");
		else if (n === "report") un(r);
		else if (n === "evidence-proof") Cn("proof");
		else if (n === "decision-responsibilities") o("mcp");
		else if (typeof n == "string" && n.startsWith("module:")) {
			let [, e, t] = n.split(":"), r = i.byId[e];
			r?.tab && o(r.tab.id), e === "treasury" && t && Nt(t);
		} else o("business");
	}
	function gn(e) {
		let t = [
			...i.tabs.map((e) => e.tab.id),
			"agents",
			"architecture"
		], n = t.findIndex((e) => e === "architecture" ? kr.includes(a) : a === e), r = null;
		if (e.key === "ArrowRight" && (r = (n + 1) % t.length), e.key === "ArrowLeft" && (r = (n + t.length - 1) % t.length), r === null) return;
		e.preventDefault();
		let s = t[r], c = e.currentTarget;
		o(s === "architecture" ? E.current : s), requestAnimationFrame(() => c.querySelectorAll("[role=tab]")[r]?.focus());
	}
	async function _n() {
		if (ht !== "approver") L("Switch to the synthetic finance approver lane first.");
		else if (t) e.action({
			type: "approve",
			case_id: I?.case_id,
			role: ht
		});
		else try {
			let e = (await B("/api/proposals")).find((e) => e.case_id === I?.case_id && e.status === "awaiting_approval");
			if (!e) {
				L("No pending synthetic proposal for this case.");
				return;
			}
			let t = await B("/api/decisions", "POST", {
				proposal_id: e.proposal_id,
				approver_id: "finance.approver",
				approved: !0,
				payload_hash: e.payload_hash,
				case_version: e.case_version
			});
			Ne((e) => [...e, {
				role: "assistant",
				text: `Approval result: ${t.status}. Synthetic variance marker ${t.document_number || "not created"}.`
			}]), Ve(await B(`/api/architecture/events?case_id=${encodeURIComponent(I.case_id)}`)), ot(await B("/api/proposals"));
		} catch (e) {
			L(e.message);
		}
	}
	async function yn(n) {
		if (I?.case_id) {
			if (L(""), mt(!0), t) e.action({
				type: "investigate",
				case_id: I.case_id,
				fault_profile: n
			});
			else try {
				let e = await B("/api/investigations", "POST", {
					case_id: I.case_id,
					fault_profile: n
				});
				ut(e), Le(e.case_id), Qe(null), Ve(await B(`/api/architecture/events?case_id=${encodeURIComponent(e.case_id)}`));
			} catch (e) {
				L(e.message);
			} finally {
				mt(!1);
			}
		}
	}
	async function bn(n) {
		if (L(""), mt(!0), t) e.action({
			type: "reprocess",
			investigation_id: n,
			operator_id: "finance.operator"
		});
		else try {
			let e = await B(`/api/investigations/${n}/reprocess`, "POST", { operator_id: "finance.operator" });
			e.after?.case_id && await sn(e.after.case_id), ut(e);
			let t = await B("/api/history");
			r((e) => ({
				...e,
				history: t
			})), it((await B("/api/cases")).slice(0, 20)), Ne((t) => [...t, {
				role: "assistant",
				text: e.reason
			}]);
		} catch (e) {
			L(e.message);
		} finally {
			mt(!1);
		}
	}
	async function xn(n) {
		t ? (e.action({
			type: "load_case",
			case_id: n
		}), o("architecture")) : (Le(n), Ve(await B(`/api/architecture/events?case_id=${encodeURIComponent(n)}`)), Qe(null), o("architecture"));
	}
	async function Sn(n, r, i) {
		if (o("questions"), L(""), St(!0), bt(null), t) e.action({
			type: "decision_run",
			question_id: n,
			route: r,
			probe: i
		});
		else try {
			let e = await B("/api/architecture/questions/runs", "POST", {
				question_id: n,
				route: r,
				probe: i
			});
			bt(e);
		} catch (e) {
			L(e.message), St(!1);
		}
	}
	function Cn(e = "proof", t = {}) {
		_e((n) => ({
			section: e,
			...t,
			nonce: n.nonce + 1
		})), o("evidence");
	}
	function wn(e) {
		de(!1), A(!1), e === "launchpad" ? se("launchpad") : (se("app"), o(e === "agent" ? "agents" : e));
	}
	let Tn = /* @__PURE__ */ (0, k.jsx)("footer", {
		className: "app-footer",
		children: /* @__PURE__ */ (0, k.jsxs)("span", { children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: "Demo and learning purposes only." }), " Synthetic finance data; no live SAP or cloud system is connected."] })
	});
	return ((e) => /* @__PURE__ */ (0, k.jsx)(re, {
		value: i,
		children: e
	}))(oe === "launchpad" ? /* @__PURE__ */ (0, k.jsxs)("div", {
		className: `app-shell launchpad-shell ${t ? "embedded" : ""}`,
		children: [
			/* @__PURE__ */ (0, k.jsxs)("header", {
				className: "shell-header launchpad-header",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "brand",
					children: [/* @__PURE__ */ (0, k.jsx)(Er, {
						menuModules: i.modules,
						open: ue,
						onToggle: () => de((e) => !e),
						onNavigate: wn
					}), /* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
						className: "brand-overline",
						children: "SAP FINANCE AGENT COCKPIT / LOCAL DEMO"
					}), /* @__PURE__ */ (0, k.jsx)("h1", { children: "My Home" })] })]
				}), /* @__PURE__ */ (0, k.jsx)("div", {
					className: "header-meta",
					children: /* @__PURE__ */ (0, k.jsx)("span", {
						className: "pill simulated",
						children: "LOCAL SIMULATION"
					})
				})]
			}),
			/* @__PURE__ */ (0, k.jsx)(dr, {
				period: P,
				periods: Ot?.available_periods,
				onPeriod: we,
				periodCount: Ot?.available_periods?.length || 12,
				localBundle: n?.local_bundle,
				onOpenApp: () => {
					o("business"), se("app");
				},
				onOpenAgents: () => {
					o("agents"), se("app");
				},
				onOpenArchitecture: () => {
					o(E.current), se("app");
				},
				onOpenTreasury: () => {
					o("treasury"), se("app");
				},
				onAsk: pn,
				onGo: (e) => {
					o(e === "live" ? "architecture" : e), se("app");
				}
			}),
			Tn
		]
	}) : /* @__PURE__ */ (0, k.jsxs)("div", {
		className: `app-shell ${t ? "embedded" : ""} ${w ? "" : "tech-off"}`,
		children: [
			/* @__PURE__ */ (0, k.jsxs)("header", {
				className: "shell-header",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "brand",
					children: [
						/* @__PURE__ */ (0, k.jsx)("button", {
							type: "button",
							className: "shell-home",
							onClick: () => wn("launchpad"),
							"aria-label": "Back to Finance Launchpad",
							children: "⌂"
						}),
						/* @__PURE__ */ (0, k.jsx)(Er, {
							menuModules: i.modules,
							open: ue,
							onToggle: () => de((e) => !e),
							onNavigate: wn
						}),
						/* @__PURE__ */ (0, k.jsx)("span", {
							className: "brand-mark",
							"aria-hidden": "true",
							children: "F"
						}),
						/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
							className: "brand-overline",
							children: "HOME / FINANCE / AGENT COCKPIT"
						}), /* @__PURE__ */ (0, k.jsx)("h1", { children: "SAP Finance Agent Cockpit" })] })
					]
				}), /* @__PURE__ */ (0, k.jsxs)("div", {
					className: "header-meta",
					children: [
						/* @__PURE__ */ (0, k.jsx)("span", {
							className: "pill simulated",
							children: "LOCAL SIMULATION"
						}),
						/* @__PURE__ */ (0, k.jsx)("span", { className: "header-separator" }),
						/* @__PURE__ */ (0, k.jsx)(N, {
							period: P,
							periods: Ot?.available_periods,
							onPeriod: we,
							id: "global-period"
						}),
						/* @__PURE__ */ (0, k.jsx)("span", { className: "header-separator" }),
						/* @__PURE__ */ (0, k.jsxs)("label", {
							className: "tech-toggle",
							children: [/* @__PURE__ */ (0, k.jsx)("input", {
								type: "checkbox",
								checked: w,
								onChange: (e) => T(e.target.checked)
							}), " Technical details"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, k.jsx)("div", {
				className: "tab-nav four",
				style: { gridTemplateColumns: `repeat(${i.tabs.length + 2},minmax(0,1fr))` },
				role: "tablist",
				"aria-label": "Application sections",
				onKeyDown: gn,
				children: [
					...i.tabs.map((e) => [
						e.tab.id,
						e.tab.icon,
						e.tab.label,
						e.tab.short
					]),
					[
						"agents",
						"◆",
						"Agents",
						"Agents"
					],
					[
						"architecture",
						"⬡",
						"Architecture",
						"Design"
					]
				].map(([e, t, n, r]) => {
					let i = e === "architecture" ? kr.includes(a) : a === e;
					return /* @__PURE__ */ (0, k.jsxs)("button", {
						type: "button",
						role: "tab",
						tabIndex: i ? 0 : -1,
						"aria-selected": i,
						className: i ? "active" : "",
						onClick: () => o(e === "architecture" ? E.current : e),
						children: [
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: "tab-icon",
								"aria-hidden": "true",
								children: t
							}),
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: "tab-label-full",
								children: n
							}),
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: "tab-label-mobile",
								children: r
							})
						]
					}, e);
				})
			}),
			(a === "evidence" || a === "questions") && /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "detail-return-bar",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
					className: "eyebrow",
					children: "ON-DEMAND DETAIL"
				}), /* @__PURE__ */ (0, k.jsx)("strong", { children: a === "evidence" ? "Evidence & correlation" : "Architecture questions" })] }), /* @__PURE__ */ (0, k.jsxs)("button", {
					type: "button",
					onClick: () => o(ce.current),
					children: ["← Back to ", {
						business: "Execution simulator",
						treasury: "Cash & treasury",
						ontology: "Ontology",
						architecture: "Live architecture",
						approaches: "Complete architecture",
						agenthost: "Agent hosting",
						brief: "Decision brief",
						diagrams: "Architecture diagrams",
						mcp: "MCP hosting",
						agents: "Agents"
					}[ce.current]]
				})]
			}),
			nt && /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "error-banner",
				role: "alert",
				children: [
					/* @__PURE__ */ (0, k.jsx)("strong", { children: "Needs attention" }),
					/* @__PURE__ */ (0, k.jsx)("span", { children: nt }),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: () => L(""),
						"aria-label": "Dismiss error",
						children: "×"
					})
				]
			}),
			kr.includes(a) && /* @__PURE__ */ (0, k.jsx)("div", {
				className: "surface decision-nav",
				role: "tablist",
				"aria-label": "Architecture views",
				children: [
					[
						"architecture",
						"Live run",
						"Replay a run through the architecture"
					],
					[
						"approaches",
						"Complete architecture",
						"S1 · S2 · S3 end to end"
					],
					[
						"mcp",
						"MCP hosting",
						"Who creates, hosts and registers the MCP"
					],
					[
						"agenthost",
						"Agent hosting",
						"Where the finance agent runs"
					],
					[
						"brief",
						"Decision brief",
						"What is open, who owns it"
					],
					[
						"ontology",
						"Ontology",
						"Concepts and how the agents use them"
					],
					[
						"diagrams",
						"Diagrams",
						"Detailed and landscape, zoom and export"
					]
				].map(([e, t, n]) => /* @__PURE__ */ (0, k.jsxs)("button", {
					type: "button",
					role: "tab",
					"aria-selected": a === e,
					className: a === e ? "active" : "",
					onClick: () => o(e),
					children: [t, /* @__PURE__ */ (0, k.jsx)("small", { children: n })]
				}, e))
			}),
			b && /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "agent-ribbon",
				role: "status",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("strong", { children: [
						"Opened by the ",
						b.name,
						" agent"
					] }),
					/* @__PURE__ */ (0, k.jsx)("span", { children: b.role }),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: () => {
							o("agents"), x(null);
						},
						children: "Back to Agents"
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: () => x(null),
						"aria-label": "Dismiss agent banner",
						children: "Dismiss"
					})
				]
			}),
			Mt && /* @__PURE__ */ (0, k.jsx)(Ie, {
				data: Ht,
				period: P,
				periods: Ot?.available_periods,
				onPeriod: we,
				role: ht,
				onDecision: Ut,
				onAsk: pn,
				refs: p?.domains?.treasury?.references,
				initial: Mt,
				onClose: () => Nt(null)
			}),
			D && /* @__PURE__ */ (0, k.jsx)(Xn, {
				report: ie,
				period: D,
				periods: Ot?.available_periods,
				onPeriod: un,
				onClose: fn
			}),
			Rt ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
				/* @__PURE__ */ (0, k.jsx)(cr, {
					onAsk: pn,
					busy: v,
					period: P,
					periods: Ot?.available_periods,
					domain: Rt.id,
					label: `Ask the ${Rt.short_name} agents`
				}),
				Yt(Rt.id),
				Rt.renderer === "treasury" ? /* @__PURE__ */ (0, k.jsx)(Oe, {
					period: P,
					periods: Ot?.available_periods,
					data: Ht,
					state: Vt("treasury"),
					role: ht,
					onRole: gt,
					onOpenDetail: Nt,
					onDecision: Ut,
					onAsk: pn
				}) : /* @__PURE__ */ (0, k.jsx)(Se, {
					module: Rt,
					period: P,
					view: Bt(Rt.id),
					state: Vt(Rt.id),
					onAsk: pn
				})
			] }) : a === "business" ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)(cr, {
				onAsk: pn,
				busy: v,
				period: P,
				periods: Ot?.available_periods,
				domain: "reconciliation"
			}), /* @__PURE__ */ (0, k.jsx)(ze, {
				period: P,
				onPeriod: we,
				onOpenReport: un,
				onAsk: () => pn(i.ask("reconciliation", P)),
				banner: Yt("reconciliation"),
				conditions: d,
				onCondition: dn,
				history: Ot,
				cases: rt,
				currentCase: I,
				proposal: $t,
				role: ht,
				onRole: gt,
				approve: _n,
				onOpenEvidence: () => Cn("finance"),
				summary: jt,
				periodPanel: /* @__PURE__ */ (0, k.jsx)(Ar, {
					result: I?.result,
					period: P,
					summary: jt,
					summaryState: Qt,
					onAskPeriod: () => pn(i.ask("reconciliation", P)),
					onOpenDetail: () => un(P),
					onOpenEvidence: () => Cn("finance"),
					onRunCurrent: () => pn(i.ask("reconciliation", P))
				}),
				extrasRight: lt ? /* @__PURE__ */ (0, k.jsx)(Be, {
					investigation: lt,
					onOpen: () => Cn("proof")
				}) : null,
				extrasLeft: /* @__PURE__ */ (0, k.jsx)(k.Fragment, { children: I?.result?.variance?.amount !== null && I?.result?.variance?.amount !== void 0 && Number(I.result.variance.amount) !== 0 && lt?.case_id !== I.case_id && /* @__PURE__ */ (0, k.jsxs)("section", {
					className: "surface action-strip",
					children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [
						/* @__PURE__ */ (0, k.jsx)("span", {
							className: "eyebrow",
							children: "CONTROLLED WRITE BRANCH"
						}),
						/* @__PURE__ */ (0, k.jsx)("strong", { children: "Signed variance marker requires separate approval" }),
						/* @__PURE__ */ (0, k.jsx)("p", { children: "A comparable nonzero variance may create a local marker proposal." })
					] }), /* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: () => pn("Propose an adjustment"),
						children: "Ask the agents to propose a variance marker"
					})]
				}) })
			})] }) : a === "agents" ? /* @__PURE__ */ (0, k.jsx)(ur, {
				catalog: p,
				plan: h,
				busy: v,
				onAsk: pn,
				onOpenLayer: hn,
				onOpenConcept: Jt,
				onOpenOutput: Xt,
				ontology: Wt,
				period: P,
				periods: Ot?.available_periods
			}) : a === "architecture" ? /* @__PURE__ */ (0, k.jsxs)("main", {
				className: "architecture-layout",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("section", {
						className: "surface command-bar",
						children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [
							/* @__PURE__ */ (0, k.jsx)("span", {
								className: "eyebrow",
								children: "EXTERNAL AGENT → SAP FINANCE"
							}),
							/* @__PURE__ */ (0, k.jsx)("h2", { children: "Follow an external agent into SAP" }),
							/* @__PURE__ */ (0, k.jsx)("p", { children: "S1 Apigee and S2 AgentCore are simulated alternatives. The combined S3 path requires a separate architecture decision." }),
							/* @__PURE__ */ (0, k.jsx)("button", {
								type: "button",
								className: "text-link architecture-question-link",
								onClick: () => o("questions"),
								children: "Review open architecture questions →"
							})
						] }), /* @__PURE__ */ (0, k.jsxs)("div", {
							className: "command-controls",
							children: [
								/* @__PURE__ */ (0, k.jsxs)("label", { children: ["Business intent", /* @__PURE__ */ (0, k.jsx)("input", {
									value: Ae,
									onChange: (e) => je(e.target.value),
									"aria-label": "Business intent"
								})] }),
								/* @__PURE__ */ (0, k.jsxs)("label", { children: ["Period", /* @__PURE__ */ (0, k.jsx)("select", {
									value: P,
									onChange: (e) => we(e.target.value),
									children: (Ot?.available_periods || ["2026-11"]).map((e) => /* @__PURE__ */ (0, k.jsx)("option", {
										value: e,
										children: Cr(e)
									}, e))
								})] }),
								/* @__PURE__ */ (0, k.jsxs)("label", { children: ["Route", /* @__PURE__ */ (0, k.jsxs)("select", {
									value: ye,
									onChange: (e) => be(e.target.value),
									disabled: He,
									children: [/* @__PURE__ */ (0, k.jsx)("option", {
										value: "S1",
										children: "S1 · Apigee"
									}), /* @__PURE__ */ (0, k.jsx)("option", {
										value: "S2",
										children: "S2 · AgentCore"
									})]
								})] }),
								/* @__PURE__ */ (0, k.jsxs)("label", { children: ["Pace", /* @__PURE__ */ (0, k.jsxs)("select", {
									value: Te,
									onChange: (e) => Ee(Number(e.target.value)),
									children: [
										/* @__PURE__ */ (0, k.jsx)("option", {
											value: 30,
											children: "Fast"
										}),
										/* @__PURE__ */ (0, k.jsx)("option", {
											value: 60,
											children: "Normal"
										}),
										/* @__PURE__ */ (0, k.jsx)("option", {
											value: 120,
											children: "Slow"
										})
									]
								})] }),
								/* @__PURE__ */ (0, k.jsx)("button", {
									type: "button",
									className: "primary",
									onClick: ln,
									disabled: He,
									children: He ? "Running…" : "Run architecture"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, k.jsxs)("section", {
						className: "surface route-panel",
						children: [
							/* @__PURE__ */ (0, k.jsxs)("div", {
								className: "section-heading",
								children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
									className: "eyebrow",
									children: "COMPONENT COMMUNICATION"
								}), /* @__PURE__ */ (0, k.jsx)("h2", { children: He ? "Processing live" : I?.status === "complete" ? "Case complete" : "Architecture ready" })] }), /* @__PURE__ */ (0, k.jsxs)("div", {
									className: "route-actions",
									children: [
										/* @__PURE__ */ (0, k.jsx)("span", {
											className: "pill quiet tech",
											children: Fe || "No trace selected"
										}),
										/* @__PURE__ */ (0, k.jsx)("button", {
											type: "button",
											onClick: () => {
												Qe(-1), Xe(null), tt(!0);
											},
											disabled: !Re.length,
											children: "Replay"
										}),
										/* @__PURE__ */ (0, k.jsx)("button", {
											type: "button",
											onClick: () => tt(!1),
											disabled: !et,
											children: "Pause"
										}),
										/* @__PURE__ */ (0, k.jsx)("button", {
											type: "button",
											onClick: () => {
												tt(!1), Qe(null), Xe(null);
											},
											disabled: Ze === null,
											children: "Live"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, k.jsx)(Mr, {
								registry: Dt,
								events: tn,
								scenario: ye,
								selectedZone: We,
								onZone: (e) => {
									Ge(e), qe(null);
								},
								viewportRef: wt,
								liveRunning: He,
								reportReady: !!I?.result?.variance,
								onOpenReport: () => M(!0)
							}),
							/* @__PURE__ */ (0, k.jsxs)("div", {
								className: "flow-caption",
								children: [
									/* @__PURE__ */ (0, k.jsx)("span", { className: `status-dot ${He ? "pulsing" : ""}` }),
									" ",
									/* @__PURE__ */ (0, k.jsx)("strong", { children: nn ? `${nn.status === "denied" ? "Control denied" : "Handoff recorded"} · ${xr[an || We] || an || We}` : "Awaiting a business question" }),
									/* @__PURE__ */ (0, k.jsx)("span", { children: xr[an] || "Select a route zone" }),
									/* @__PURE__ */ (0, k.jsxs)("span", {
										className: "tech",
										children: [Re.length, " stored events"]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, k.jsx)(br, {
						events: tn,
						running: He,
						selectedZone: xr[We] || We,
						onOpenEvidence: () => Cn("components")
					}),
					/* @__PURE__ */ (0, k.jsxs)("section", {
						className: "surface case-strip",
						children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
							className: "eyebrow",
							children: "STORED CASES"
						}), /* @__PURE__ */ (0, k.jsx)("h2", { children: "Replay an earlier run" })] }), /* @__PURE__ */ (0, k.jsxs)("div", {
							className: "case-buttons",
							children: [rt.slice(0, 8).map((e) => /* @__PURE__ */ (0, k.jsxs)("button", {
								type: "button",
								onClick: () => sn(e.case_id),
								children: [
									Cr(e.scope?.period),
									" · ",
									e.scenario,
									" · ",
									e.status
								]
							}, e.case_id)), !rt.length && /* @__PURE__ */ (0, k.jsx)("span", {
								className: "micro",
								children: "No completed case yet."
							})]
						})]
					})
				]
			}) : a === "questions" ? /* @__PURE__ */ (0, k.jsx)($e, {
				questions: n?.decision_questions || [],
				routePlaybooks: n?.route_playbooks || {},
				focus: me,
				run: yt,
				onRun: Sn,
				busy: xt,
				onOpenEvidence: (e) => Cn("questions", { stepSeq: e })
			}) : a === "ontology" ? /* @__PURE__ */ (0, k.jsx)(he, {
				ontology: Wt,
				references: qt,
				focus: z,
				onOpenTab: (e) => o(e)
			}) : a === "brief" ? /* @__PURE__ */ (0, k.jsx)(Dn, {
				onComplete: () => o("approaches"),
				onMcp: () => o("mcp"),
				onAgentHosting: () => o("agenthost")
			}) : a === "agenthost" ? /* @__PURE__ */ (0, k.jsx)(vn, {
				onMcp: () => o("mcp"),
				onComplete: () => o("approaches")
			}) : a === "mcp" ? /* @__PURE__ */ (0, k.jsx)(mn, {
				view: l,
				onView: u,
				onApproaches: () => o("approaches"),
				onAgentHosting: () => o("agenthost"),
				onDetailed: (e) => {
					c(e), o("diagrams");
				}
			}) : a === "diagrams" ? /* @__PURE__ */ (0, k.jsx)(en, {
				view: s,
				onView: c,
				onBack: () => o("approaches")
			}) : a === "approaches" ? /* @__PURE__ */ (0, k.jsx)(on, {
				playbooks: n?.route_playbooks || {},
				onQuestion: () => o("questions"),
				onDetailedDiagram: (e) => {
					c(e), o("diagrams");
				},
				onGovernance: (e) => {
					u(e), o("mcp");
				},
				onAgentHosting: () => o("agenthost")
			}) : /* @__PURE__ */ (0, k.jsx)(Ye, {
				investigation: lt,
				currentCase: I,
				history: Ot,
				busy: pt,
				onStart: yn,
				onResolve: bn,
				onTrace: xn,
				historyDetail: st,
				events: lt?.case_id === I?.case_id && dt.length ? dt : Re,
				caseEvents: Re,
				decisionRun: yt,
				decisionQuestions: n?.decision_questions || [],
				focus: ge,
				componentDetails: /* @__PURE__ */ (0, k.jsx)(Nr, {
					registry: Dt,
					zone: We,
					events: tn,
					selectedComponent: Ke,
					onComponent: qe,
					scenario: ye
				}),
				reviewPanel: /* @__PURE__ */ (0, k.jsxs)("section", {
					className: "surface architect-review",
					children: [
						/* @__PURE__ */ (0, k.jsx)("div", {
							className: "section-heading",
							children: /* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("span", {
								className: "eyebrow",
								children: "CROSS-DISCIPLINE REVIEW"
							}), /* @__PURE__ */ (0, k.jsx)("h2", { children: "Architect questions to test" })] })
						}),
						/* @__PURE__ */ (0, k.jsx)("div", {
							className: "review-list",
							children: Sr.map(([e, t]) => /* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: e }), /* @__PURE__ */ (0, k.jsx)("span", { children: t })] }, e))
						}),
						/* @__PURE__ */ (0, k.jsx)("p", {
							className: "micro",
							children: "Vendor-named stages are simulations. G1–G7 remain open pending tenant evidence."
						})
					]
				})
			}),
			Tn,
			ve && /* @__PURE__ */ (0, k.jsx)(jr, {
				caseRecord: I,
				onClose: () => M(!1),
				onOpenEvidence: () => Cn("finance")
			})
		]
	}));
}
// src/streamlit.jsx
var Fr = /* @__PURE__ */ new WeakMap();
function Ir(e) {
	let { parentElement: t, data: n, setTriggerValue: r } = e, i = t.querySelector(".finance-root");
	if (!i) throw Error("Missing finance component mount");
	let a = Fr.get(t);
	return a || (a = (0, v.createRoot)(i), Fr.set(t, a)), a.render(/* @__PURE__ */ (0, k.jsx)(Pr, { bridge: {
		data: n || {},
		action: (e) => r("action", e)
	} })), () => {
		let e = Fr.get(t);
		e && (e.unmount(), Fr.delete(t));
	};
}
export { Ir as default };
