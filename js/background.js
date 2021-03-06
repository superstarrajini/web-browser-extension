const _browser = chrome || browser;
let domain;
let cookiesList;
let tabID;
let cookiesSent = false;
const sendCookie = (cookies) => {
    _browser.tabs.sendMessage(tabID, { cookies });
    if (cookies[0]) {
        cookiesSent = true;
        const message = `Your ${website} ${cookies.length > 1 ? "cookies have" : "cookie has"} been successfully entered.`;
        // @ts-ignore
        _browser.notifications.create({ type: "basic", message, title: "Phantombuster", iconUrl: "./img/icon.png", silent: true });
    }
};
const cookieChanged = (changeInfo) => {
    _browser.cookies.getAll({ domain }, (cookies) => {
        console.log("domain:", domain);
        const retrievedCookies = cookiesList.map((cookie) => cookies.filter((el) => el.name === cookie.name && el.domain === cookie.domain)[0]);
        console.log("retrievedCookies:", retrievedCookies);
        if (retrievedCookies[0] && !cookiesSent) {
            _browser.cookies.onChanged.removeListener(cookieChanged);
            sendCookie(retrievedCookies);
        }
    });
};
_browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.opening) {
        _browser.cookies.onChanged.addListener(cookieChanged);
    }
    if (msg.website) {
        cookiesSent = false;
        website = msg.website;
        tabID = sender.tab.id;
        domain = WEBSITEENUM[website].domain;
        cookiesList = WEBSITEENUM[website].cookiesList;
        _browser.cookies.getAll({}, (cookies) => {
            console.log("cookies:", cookies);
            const retrievedCookies = cookiesList.map((cookie) => cookies.filter((el) => el.name === cookie.name && el.domain === cookie.domain)[0]);
            console.log("retrievedCookies", retrievedCookies);
            sendCookie(retrievedCookies);
        });
    }
});
// redirecting to phantombuster.com when clicking on main icon
_browser.browserAction.onClicked.addListener((tab) => _browser.tabs.update({ url: "https://phantombuster.com" }));
//# sourceMappingURL=background.js.map