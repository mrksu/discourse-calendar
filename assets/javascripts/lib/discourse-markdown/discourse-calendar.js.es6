const calendarRule = {
  tag: "calendar",

  before: function(state, info) {
    let wrapperDivToken = state.push("div_open", "div", 1);
    wrapperDivToken.attrs = [["class", "discourse-calendar-wrap"]];

    // div.discourse-calendar-header
    let headerDivToken = state.push("div_open", "div", 1);
    headerDivToken.attrs = [["class", "discourse-calendar-header"]];

    let titleH2Token = state.push("h2_open", "h2", 1);
    titleH2Token.attrs = [["class", "discourse-calendar-title"]];
    state.push("h2_close", "h2", -1);

    let timezoneWrapToken = state.push("span_open", "span", 1);
    timezoneWrapToken.attrs = [
      ["class", "discourse-calendar-timezone-wrap"]
    ]
    if (info.attrs.tzpicker === "true") {
      _renderTimezonePicker(state, info);
    }
    state.push("span_close", "span", -1);

    state.push("div_close", "div", -1);
    // end div.discourse-calendar-header

    // div.calendar
    let mainCalendarDivToken = state.push("div_open", "div", 1);
    mainCalendarDivToken.attrs = [
      ["class", "calendar"],
      ["data-calendar-type", info.attrs.type || "dynamic"],
      ["data-calendar-default-view", info.attrs.defaultView || "month"],
      ["data-calendar-default-timezone", info.attrs.tzdefault]
    ];

    if (info.attrs.weekends) {
      mainCalendarDivToken.attrs.push(["data-weekends", info.attrs.weekends]);
    }

    if (info.attrs.hiddenDays) {
      mainCalendarDivToken.attrs.push([
        "data-hidden-days",
        info.attrs.hiddenDays
      ]);
    }
  },

  after: function(state) {
    state.push("div_close", "div", -1);
    // end div.calendar

    state.push("div_close", "div", -1);
    // end div.discourse-calendar-wrap
  }
};

function _renderTimezonePicker(state, info) {
  let timezoneSelectToken = state.push("select_open", "select", 1);
  timezoneSelectToken.attrs = [
    ["class", "discourse-calendar-timezone-picker"]
  ];

  state.push("select_close", "select", -1);
}

export function setup(helper) {
  helper.whiteList([
    "div.calendar",
    "div.discourse-calendar-header",
    "div.discourse-calendar-wrap",
    "select.discourse-calendar-timezone-picker",
    "span.discourse-calendar-timezone-wrap",
    "h2.discourse-calendar-title",
    "option",
    "div[data-calendar-type]",
    "div[data-calendar-default-view]",
    "div[data-calendar-default-timezone]",
    "div[data-weekends]",
    "div[data-hidden-days]"
  ]);

  helper.registerOptions((opts, siteSettings) => {
    opts.features[
      "discourse-calendar-enabled"
    ] = !!siteSettings.calendar_enabled;
  });

  helper.registerPlugin(md => {
    const features = md.options.discourse.features;
    if (features["discourse-calendar-enabled"]) {
      md.block.bbcode.ruler.push("discourse-calendar", calendarRule);
    }
  });
}
