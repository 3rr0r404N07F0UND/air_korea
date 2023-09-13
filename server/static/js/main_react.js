class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
      className: "site-logo upper-bar"
    }, /*#__PURE__*/React.createElement("img", {
      alt: "logo",
      src: "static/img/weather_logo.png"
    }), /*#__PURE__*/React.createElement("p", null, "AirKorea")), /*#__PURE__*/React.createElement(SideBarList, {
      Title1: "\uC9C0\uC218",
      Title2: "\uADF8\uB798\uD504",
      Title3: "\uB4F1\uAE09",
      Title4: "\uB18D\uB3C4",
      className: "sidebar-list"
    }));
  }
}
const SideBarList = props => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("ul", {
    className: `${props.className}-ul`
  }, /*#__PURE__*/React.createElement("li", {
    className: `${props.className}-li`
  }, props.Title1), /*#__PURE__*/React.createElement("li", {
    className: `${props.className}-li`
  }, props.Title2)), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", {
    className: "sidebar-list-ol-li"
  }, "khai: \uD1B5\uD569\uB300\uAE30\uD658\uACBD\uC218\uCE58"), /*#__PURE__*/React.createElement("li", {
    className: "sidebar-list-ol-li"
  }, "so2: \uC544\uD669\uC0B0\uAC00\uC2A4 \uB18D\uB3C4"), /*#__PURE__*/React.createElement("li", {
    className: "sidebar-list-ol-li"
  }, "co: \uC77C\uC0B0\uD654\uD0C4\uC18C \uB18D\uB3C4"), /*#__PURE__*/React.createElement("li", {
    className: "sidebar-list-ol-li"
  }, "pm10: \uBBF8\uC138\uBA3C\uC9C0 ", /*#__PURE__*/React.createElement("sub", null, "PM10"), " \uB18D\uB3C4"), /*#__PURE__*/React.createElement("li", {
    className: "sidebar-list-ol-li"
  }, "pm25: \uBBF8\uC138\uBA3C\uC9C0 ", /*#__PURE__*/React.createElement("sub", null, "PM25"), " \uB18D\uB3C4"), /*#__PURE__*/React.createElement("li", {
    className: "sidebar-list-ol-li"
  }, "no2: \uC774\uC0B0\uD654\uC9C8\uC18C \uB18D\uB3C4"), /*#__PURE__*/React.createElement("li", {
    className: "sidebar-list-ol-li"
  }, "o3: \uC624\uC874 \uB18D\uB3C4")));
};
class MainSector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weatherText: "날씨?",
      display: props.displayType
    };
    (async () => {
      let weatherText = "좋은 날씨다!";
      const nowWeather = await (await fetch("http://localhost:5000/value")).json();
      if (nowWeather.khaiValue > 251) {
        weatherText = "날씨가 많이 안좋다... 마스크 챙겨서 다녀라!";
      } else if (nowWeather.khaiValue > 101) {
        weatherText = "날씨가 안좋다... 마스크 챙겨서 다녀라!";
      } else if (nowWeather.khaiValue > 51) {
        weatherText = "날씨가 좋지도... 나쁘지도 않다... 마스크 챙겨서 다녀라!";
      } else {
        weatherText = "날씨가 너무 좋다! 밖에 나가서 산책하는 것도 좋을 수도?";
      }
      this.setState({
        weatherText: weatherText
      });
    })();
  }
  componentDidMount() {
    setInterval(() => {}, 1000);
  }
  componentDidUpdate() {}
  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DailyInfo, {
      className: "daily-info upper-bar",
      Weather: "xi-foggy weather-icon",
      WeatherText: this.state.weatherText
    }), /*#__PURE__*/React.createElement(CanvasValue, {
      id: "canvas-main",
      style: {
        display: this.state.display.value
      }
    }), /*#__PURE__*/React.createElement(CanvasGraph, {
      id: "canvas-second",
      style: {
        display: this.state.display.graph
      }
    }));
  }
}
class CanvasValue extends React.Component {
  constructor(props) {
    super(props);
    this.defaultLocate = {
      x: 0,
      y: 830
    };
    this.defaultMaxValue = {
      k50: {
        khaiValue: 50,
        coValue: 2,
        no2Value: 0.03,
        o3Value: 0.03,
        pm10Value: 30,
        pm25Value: 15,
        so2Value: 0.02
      },
      k100: {
        khaiValue: 100,
        coValue: 9,
        no2Value: 0.06,
        o3Value: 0.09,
        pm10Value: 80,
        pm25Value: 35,
        so2Value: 0.05
      },
      k250: {
        khaiValue: 250,
        coValue: 15,
        no2Value: 0.2,
        o3Value: 0.15,
        pm10Value: 150,
        pm25Value: 75,
        so2Value: 0.15
      },
      k251: {
        khaiValue: 251,
        coValue: 15.01,
        no2Value: 0.201,
        o3Value: 0.151,
        pm10Value: 151,
        pm25Value: 76,
        so2Value: 0.151
      }
    };
    this.defaultUnit = {
      khaiValue: "",
      coValue: "ppm",
      no2Value: "ppm",
      o3Value: "ppm",
      pm10Value: "㎍/㎥",
      pm25Value: "㎍/㎥",
      so2Value: "ppm"
    };
  }
  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "#75d5e3";
    this.ctx.font = "30px Arial";
    this.ctx.textAlign = "center";
    this.ctx.strokeStyle = "black";
    (async () => {
      const response = await fetch("http://localhost:5000/value");
      const jsonData = await response.json();
      let locateX = 20;
      let khaiValue;
      if (jsonData.khaiValue < 50) {
        khaiValue = "k50";
      } else if (jsonData.khaiValue < 100) {
        khaiValue = "k100";
      } else if (jsonData.khaiValue < 250) {
        khaiValue = "k250";
      } else {
        khaiValue = "k251";
      }
      for (const key in jsonData) {
        const locateY = parseFloat(jsonData[key]) / this.defaultMaxValue[khaiValue][key] * 100 * 830 / 100;
        this.ctx.rect(this.defaultLocate.x + locateX, this.defaultLocate.y - locateY, 200, locateY);
        this.ctx.strokeText(`${key.replace(/Value/, "")} ${jsonData[key]}${this.defaultUnit[key]}`, this.defaultLocate.x + locateX + 100, this.defaultLocate.y - locateY - 5);
        this.ctx.fill();
        locateX += 220;
      }
    })();
  }
  render() {
    return /*#__PURE__*/React.createElement("canvas", {
      width: "1600",
      height: "830",
      id: this.props.id,
      className: this.props.id,
      style: this.props.style
    });
  }
}
class CanvasGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext("2d");
    (async () => {
      const response = await fetch("http://localhost:5000/graph");
      const jsonData = await response.json();
      const khaiValue = jsonData.khaiValue.map(v => {
        if (v === "-") {
          return 0;
        }
        return parseInt(v);
      });
      const maxAirValue = Math.max(...khaiValue);
      let tableMaxAirValue;
      if (maxAirValue < 50) {
        tableMaxAirValue = "k50";
      } else if (maxAirValue < 100) {
        tableMaxAirValue = "k100";
      } else if (maxAirValue < 250) {
        tableMaxAirValue = "k250";
      } else {
        tableMaxAirValue = "k251";
      }
      const tableAir = {
        k50: {
          khaiValue: 50,
          coValue: 2,
          no2Value: 0.03,
          o3Value: 0.03,
          pm10Value: 30,
          pm25Value: 15,
          so2Value: 0.02
        },
        k100: {
          khaiValue: 100,
          coValue: 9,
          no2Value: 0.06,
          o3Value: 0.09,
          pm10Value: 80,
          pm25Value: 35,
          so2Value: 0.05
        },
        k250: {
          khaiValue: 250,
          coValue: 15,
          no2Value: 0.2,
          o3Value: 0.15,
          pm10Value: 150,
          pm25Value: 75,
          so2Value: 0.15
        },
        k251: {
          khaiValue: 251,
          coValue: 15.01,
          no2Value: 0.201,
          o3Value: 0.151,
          pm10Value: 151,
          pm25Value: 76,
          so2Value: 0.151
        }
      };
      const defaultAirOption = tableAir[tableMaxAirValue];
      const colorTable = ["red", "green", "blue", "white", "yellow", "violet", "black"];
      let tempChecker = 0;
      for (const airArray in jsonData) {
        let locateX = 0;
        this.ctx.strokeStyle = colorTable[tempChecker++];
        this.ctx.moveTo(830, jsonData[airArray][0] / defaultAirOption[airArray] * 100 * 830 / 100);
        console.log(airArray);
        this.ctx.beginPath();
        let tempResult = jsonData[airArray].map(v => {
          locateX += 16;
          return [locateX, v / defaultAirOption[airArray] * 100 * 830 / 100];
        });
        tempResult = tempResult.flat();
        while (tempResult.length) {
          this.ctx.quadraticCurveTo(tempResult.shift(), tempResult.shift(), tempResult.shift(), tempResult.shift());
          this.ctx.stroke();
        }
        this.ctx.closePath();
      }
      // 16
    })();
  }

  render() {
    return /*#__PURE__*/React.createElement("canvas", {
      width: "1600",
      height: "830",
      id: this.props.id,
      className: this.props.id,
      style: this.props.style
    });
  }
}
class CanvasGrade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "#75d5e3";
    this.ctx.font = "30px Arial";
    this.ctx.textAlign = "center";
    this.ctx.strokeStyle = "black";
    (async () => {
      const response = await fetch("http://localhost:5000/grade");
      const jsonData = await response.json();
      let locateX = 20;
      for (const key in jsonData) {}
    })();
  }
  render() {
    return /*#__PURE__*/React.createElement("canvas", {
      width: "1600",
      height: "830",
      id: this.props.id,
      className: this.props.id,
      style: this.props.style
    });
  }
}
const DailyInfo = props => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: props.className
  }, /*#__PURE__*/React.createElement("i", {
    className: props.Weather
  }), /*#__PURE__*/React.createElement("p", null, props.WeatherText)));
};
class HTMLBodyElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: {
        value: "block",
        graph: "none",
        grade: "none",
        flag: "none"
      }
    };
  }
  componentDidMount() {
    for (const element of document.getElementsByTagName("li")) {
      element.addEventListener("click", e => {
        const tempState = {
          ...this.state
        };
        const tempTable = {
          지수: "value",
          그래프: "graph",
          등급: "grade",
          농도: "flag"
        };
        for (const state in tempState["display"]) {
          tempState["display"][state] = "none";
        }
        tempState["display"][tempTable[e.target.innerText]] = "block";
        this.setState(tempState);
      });
    }
    this.setState();
  }
  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("aside", {
      id: "aside-section"
    }, /*#__PURE__*/React.createElement(SideBar, null)), /*#__PURE__*/React.createElement("main", {
      id: "main-section"
    }, /*#__PURE__*/React.createElement(MainSector, {
      displayType: this.state.display
    })));
  }
}
ReactDOM.createRoot(document.getElementsByTagName("body")[0]).render( /*#__PURE__*/React.createElement(HTMLBodyElement, null));