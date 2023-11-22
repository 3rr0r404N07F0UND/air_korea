class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <h1 className="site-logo upper-bar">
          <img alt="logo" src="static/img/weather_logo.png" />
          <p>AirKorea</p>
        </h1>
        <SideBarList
          Title1="지수"
          Title2="그래프"
          Title3="등급"
          Title4="농도"
          className="sidebar-list"
        />
      </>
    );
  }
}

const SideBarList = (props) => {
  return (
    <>
      <ul className={`${props.className}-ul`}>
        <li className={`${props.className}-li`}>{props.Title1}</li>
        <li className={`${props.className}-li`}>{props.Title2}</li>
        {/* <li className={`${props.className}-li`}>{props.Title3}</li>
      <li className={`${props.className}-li`}>{props.Title4}</li> */}
      </ul>
      <ol>
        <li className="sidebar-list-ol-li" style={{color: "red"}}>khai: 통합대기환경수치</li>
        <li className="sidebar-list-ol-li" style={{color: "green"}}>so2: 아황산가스 농도</li>
        <li className="sidebar-list-ol-li" style={{color: "blue"}}>co: 일산화탄소 농도</li>
        <li className="sidebar-list-ol-li" style={{color: "white"}}>pm10: 미세먼지 <sub>PM10</sub> 농도</li>
        <li className="sidebar-list-ol-li" style={{color: "yellow"}}>pm25: 미세먼지 <sub>PM25</sub> 농도</li>
        <li className="sidebar-list-ol-li" style={{color: "violet"}}>no2: 이산화질소 농도</li>
        <li className="sidebar-list-ol-li" style={{color: "black"}}>o3: 오존 농도</li>
      </ol>
    </>
  );
};

class MainSector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { weatherText: "날씨?", display: props.displayType };
    (async () => {
      let weatherText = "좋은 날씨다!";
      const nowWeather = await (
        await fetch("/value")
      ).json();
      if (nowWeather.khaiValue > 251) {
        weatherText = "날씨가 많이 안좋다... 마스크 챙겨서 다녀라!";
      } else if (nowWeather.khaiValue > 101) {
        weatherText = "날씨가 안좋다... 마스크 챙겨서 다녀라!";
      } else if (nowWeather.khaiValue > 51) {
        weatherText = "날씨가 좋지도... 나쁘지도 않다... 마스크 챙겨서 다녀라!";
      } else {
        weatherText = "날씨가 너무 좋다! 밖에 나가서 산책하는 것도 좋을 수도?";
      }
      this.setState({ weatherText: weatherText });
    })();
  }
  componentDidMount() {
    setInterval(() => {}, 1000);
  }
  componentDidUpdate() {}
  render() {
    return (
      <>
        <DailyInfo
          className="daily-info upper-bar"
          Weather="xi-foggy weather-icon"
          WeatherText={this.state.weatherText}
        />
        <CanvasValue
          id="canvas-main"
          style={{ display: this.state.display.value }}
        />
        <CanvasGraph
          id="canvas-second"
          style={{ display: this.state.display.graph }}
        />
        {/* <CanvasGrade
          id="canvas-third"
          style={{ display: this.state.display.grade }}
        /> */}
      </>
    );
  }
}

class CanvasValue extends React.Component {
  constructor(props) {
    super(props);
    this.defaultLocate = { x: 0, y: 830 };
    this.defaultMaxValue = {
      k50: {
        khaiValue: 50,
        coValue: 2,
        no2Value: 0.03,
        o3Value: 0.03,
        pm10Value: 30,
        pm25Value: 15,
        so2Value: 0.02,
      },
      k100: {
        khaiValue: 100,
        coValue: 9,
        no2Value: 0.06,
        o3Value: 0.09,
        pm10Value: 80,
        pm25Value: 35,
        so2Value: 0.05,
      },
      k250: {
        khaiValue: 250,
        coValue: 15,
        no2Value: 0.2,
        o3Value: 0.15,
        pm10Value: 150,
        pm25Value: 75,
        so2Value: 0.15,
      },
      k251: {
        khaiValue: 251,
        coValue: 15.01,
        no2Value: 0.201,
        o3Value: 0.151,
        pm10Value: 151,
        pm25Value: 76,
        so2Value: 0.151,
      },
    };
    this.defaultUnit = {
      khaiValue: "",
      coValue: "ppm",
      no2Value: "ppm",
      o3Value: "ppm",
      pm10Value: "㎍/㎥",
      pm25Value: "㎍/㎥",
      so2Value: "ppm",
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
      const response = await fetch("/value");
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
        const locateY =
          ((parseFloat(jsonData[key]) / this.defaultMaxValue[khaiValue][key]) *
            100 *
            830) /
          100;
        this.ctx.rect(
          this.defaultLocate.x + locateX,
          this.defaultLocate.y - locateY,
          200,
          locateY
        );
        this.ctx.strokeText(
          `${key.replace(/Value/, "")} ${jsonData[key]}${
            this.defaultUnit[key]
          }`,
          this.defaultLocate.x + locateX + 100,
          this.defaultLocate.y - locateY - 5
        );
        this.ctx.fill();
        locateX += 220;
      }
    })();
  }
  render() {
    return (
      <canvas
        width="1600"
        height="830"
        id={this.props.id}
        className={this.props.id}
        style={this.props.style}
      ></canvas>
    );
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
      const response = await fetch("/graph");
      const jsonData = await response.json();
      const khaiValue = jsonData.khaiValue.map((v) => {
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
          so2Value: 0.02,
        },
        k100: {
          khaiValue: 100,
          coValue: 9,
          no2Value: 0.06,
          o3Value: 0.09,
          pm10Value: 80,
          pm25Value: 35,
          so2Value: 0.05,
        },
        k250: {
          khaiValue: 250,
          coValue: 15,
          no2Value: 0.2,
          o3Value: 0.15,
          pm10Value: 150,
          pm25Value: 75,
          so2Value: 0.15,
        },
        k251: {
          khaiValue: 251,
          coValue: 15.01,
          no2Value: 0.201,
          o3Value: 0.151,
          pm10Value: 151,
          pm25Value: 76,
          so2Value: 0.151,
        },
      };
      const defaultAirOption = tableAir[tableMaxAirValue];
      const colorTable = [
        "red",
        "green",
        "blue",
        "white",
        "yellow",
        "violet",
        "black",
      ];
      let tempChecker = 0;
      for (const airArray in jsonData) {
        let locateX = 0;
        this.ctx.strokeStyle = colorTable[tempChecker++];
        this.ctx.moveTo(
          830,
          ((jsonData[airArray][0] / defaultAirOption[airArray]) * 100 * 830) /
            100
        );
        console.log(airArray);
        this.ctx.beginPath();
        let tempResult = jsonData[airArray].map((v) => {
          locateX += 16;
          return [
            locateX,
            ((v / defaultAirOption[airArray]) * 100 * 830) / 100,
          ];
        });
        tempResult = tempResult.flat();
        while (tempResult.length) {
          this.ctx.quadraticCurveTo(
            tempResult.shift(),
            tempResult.shift(),
            tempResult.shift(),
            tempResult.shift()
          );
          this.ctx.stroke();
        }
        this.ctx.closePath();
      }
      // 16
    })();
  }
  render() {
    return (
      <canvas
        width="1600"
        height="830"
        id={this.props.id}
        className={this.props.id}
        style={this.props.style}
      ></canvas>
    );
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
      const response = await fetch("/grade");
      const jsonData = await response.json();
      let locateX = 20;
      for (const key in jsonData) {
      }
    })();
  }
  render() {
    return (
      <canvas
        width="1600"
        height="830"
        id={this.props.id}
        className={this.props.id}
        style={this.props.style}
      ></canvas>
    );
  }
}

const DailyInfo = (props) => {
  return (
    <>
      <div className={props.className}>
        <i className={props.Weather}></i>
        <p>{props.WeatherText}</p>
      </div>
    </>
  );
};

class HTMLBodyElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: { value: "block", graph: "none", grade: "none", flag: "none" },
    };
  }
  componentDidMount() {
    for (const element of document.getElementsByTagName("li")) {
      element.addEventListener("click", (e) => {
        const tempState = { ...this.state };
        const tempTable = {
          지수: "value",
          그래프: "graph",
          등급: "grade",
          농도: "flag",
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
    return (
      <>
        <aside id="aside-section">
          <SideBar />
        </aside>
        <main id="main-section">
          <MainSector displayType={this.state.display} />
        </main>
      </>
    );
  }
}

ReactDOM.createRoot(document.getElementsByTagName("body")[0]).render(
  <HTMLBodyElement />
);
