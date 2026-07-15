// Serverless OAuth 2.0 (PKCE, S256) login against latere auth.
//
// This is a *public* client — no client_secret. The browser runs the whole
// authorization-code + PKCE flow directly against auth.latere.ai; there is no
// backend of ours in the loop. The access token is kept in localStorage and
// attached as a Bearer to api.changkun.de calls.
//
// Prerequisites (configured once, out of band):
//   - A public OAuth client registered with:
//       client_type:     "public"
//       redirect_uris:   ["https://changkun.de/blog/ideas/"]
//       allowed_origins: ["https://changkun.de"]   (enables CORS on /token)
//       allowed_scopes:  ["openid", "email", "profile"]
//   - api.changkun.de validates the latere JWT (JWKS) and allows CORS from
//     https://changkun.de.
//
// crypto.subtle requires a secure context (https, or http://localhost for dev).
(function() {
  var AUTH_URL = 'https://auth.latere.ai';
  var CLIENT_ID = 'changkun-blog';
  var SCOPES = 'openid email profile';
  var TOKEN_KEY = 'latere-token';   // localStorage: persisted access/refresh token
  var PKCE_KEY = 'latere-pkce';     // sessionStorage: in-flight verifier + state
  var SKEW_MS = 5000;               // treat tokens expiring within 5s as stale

  // The redirect_uri must be byte-for-byte identical between /authorize and
  // /token, and must match a registered value. origin+pathname stays stable
  // across the round-trip (only the query string carries the code).
  function redirectURI() {
    return location.origin + location.pathname;
  }

  function b64url(bytes) {
    var s = btoa(String.fromCharCode.apply(null, new Uint8Array(bytes)));
    return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function randomString(n) {
    var a = new Uint8Array(n);
    crypto.getRandomValues(a);
    return b64url(a);
  }

  function sha256(str) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  }

  function loadToken() {
    try { return JSON.parse(localStorage.getItem(TOKEN_KEY)); } catch (e) { return null; }
  }

  function saveToken(tok) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tok));
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  function hasValidToken() {
    var t = loadToken();
    return !!(t && t.access_token && t.expires_at > Date.now() + SKEW_MS);
  }

  function storeTokenResponse(data) {
    if (!data || !data.access_token) return null;
    var prev = loadToken() || {};
    var tok = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in ? data.expires_in * 1000 : 300000),
      // Refresh-token rotation may or may not return a new one; keep the last.
      refresh_token: data.refresh_token || prev.refresh_token || null
    };
    saveToken(tok);
    return tok;
  }

  // Redirect to the authorization endpoint to begin login.
  function login(returnURL) {
    var verifier = randomString(48);
    var state = randomString(16);
    return sha256(verifier).then(function(digest) {
      sessionStorage.setItem(PKCE_KEY, JSON.stringify({
        verifier: verifier, state: state, ret: returnURL || location.href
      }));
      var url = AUTH_URL + '/authorize'
        + '?response_type=code'
        + '&client_id=' + encodeURIComponent(CLIENT_ID)
        + '&redirect_uri=' + encodeURIComponent(redirectURI())
        + '&scope=' + encodeURIComponent(SCOPES)
        + '&state=' + encodeURIComponent(state)
        + '&code_challenge=' + encodeURIComponent(b64url(digest))
        + '&code_challenge_method=S256';
      location.href = url;
    });
  }

  function exchange(code, verifier) {
    var body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectURI(),
      client_id: CLIENT_ID,
      code_verifier: verifier
    });
    return fetch(AUTH_URL + '/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    }).then(function(r) {
      if (!r.ok) throw new Error('token exchange failed: ' + r.status);
      return r.json();
    }).then(storeTokenResponse);
  }

  function refresh() {
    var t = loadToken();
    if (!t || !t.refresh_token) return Promise.resolve(null);
    var body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: t.refresh_token,
      client_id: CLIENT_ID
    });
    return fetch(AUTH_URL + '/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    }).then(function(r) {
      if (!r.ok) { clearToken(); return null; }
      return r.json().then(storeTokenResponse);
    }).catch(function() { clearToken(); return null; });
  }

  // Resolve to a valid access token, refreshing if needed, or null.
  function getToken() {
    if (hasValidToken()) return Promise.resolve(loadToken().access_token);
    return refresh().then(function(nt) { return nt ? nt.access_token : null; });
  }

  // Complete the flow if this page load is an auth redirect (?code=...).
  // Always strips OAuth params from the URL. Resolves to the authed state.
  function handleCallback() {
    var params = new URLSearchParams(location.search);
    var code = params.get('code');
    if (!code) return Promise.resolve(hasValidToken());

    var clean = location.origin + location.pathname;
    var saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(PKCE_KEY)); } catch (e) {}
    sessionStorage.removeItem(PKCE_KEY);

    if (!saved || saved.state !== params.get('state')) {
      history.replaceState(null, '', clean);   // CSRF / stale: reject
      return Promise.resolve(false);
    }
    return exchange(code, saved.verifier).then(function() {
      history.replaceState(null, '', clean);
      return true;
    }).catch(function() {
      history.replaceState(null, '', clean);
      return false;
    });
  }

  window.latereAuth = {
    login: login,
    getToken: getToken,
    hasValidToken: hasValidToken,
    handleCallback: handleCallback,
    logout: clearToken
  };
})();
