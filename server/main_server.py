from flask import Flask, render_template, request
import requests
import datetime
import json

now_time = datetime.datetime.now().strftime("%Y-%m-%d")

url = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty"
params = {
    "serviceKey": "oocZw3qEC6C1VXB28C58RO5H/M/r0CI6tl4GahtPWN+Oz4eBImq1541i7/XQ65xs9UzWPE1rTCtLir6QM1v2PQ==",
    "returnType": "json",
    "numOfRows": "100",
    "pageNo": "1",
    "stationName": "종로구",
    "dataTerm": "3MONTH",
    "ver": "1.0",
}

response = requests.get(url, params = params)

dir_file = f"./json/{str(now_time)}.json"
dir_mod_file = f"./json/mod_{str(now_time)}.json"

with open(f"{dir_file}", "w") as f:
  f.write(json.dumps(json.loads(response.content)))

with open(f"{dir_mod_file}", "w") as f:
  mod_value = json.loads(response.content)
  result = mod_value["response"]["body"]["items"][0]
  f.write(json.dumps(result))

# now_time = datetime.datetime.now()
# yesterday_date = (now_time - datetime.timedelta(days = 1)).strftime("%Y%m%d")
# now_hour = now_time.hour
# now_time = now_time.strftime("%Y%m%d")
# url = "http://apis.data.go.kr/1360000/AsosHourlyInfoService/getWthrDataList"
# params = {
#     "serviceKey": "oocZw3qEC6C1VXB28C58RO5H/M/r0CI6tl4GahtPWN+Oz4eBImq1541i7/XQ65xs9UzWPE1rTCtLir6QM1v2PQ==",
#     "pageNo": "1",
#     "numOfRows": "10",
#     "dataType": "json",
#     "dataCd": "ASOS",
#     "dateCd": "HR",
#     "startDt": yesterday_date,
#     "startHh": "01",
#     "endDt": now_time,
#     "endHh": now_hour,
#     "stnIds": "108"
# }

# response = requests.get(url, params = params)
# print(json.loads(response.content))
# dir_file = f"./json/{str(now_time)}_weather.json"

# with open(f"{dir_file}", "w") as f:
#   f.write(json.dumps(json.loads(response.content)))

app = Flask(__name__, static_folder = "./static", template_folder = "./template")

@app.route("/")
def index():
  return render_template("./jinja2/index.j2")

@app.get("/grade")
def air_grade():
  with open(f"{dir_mod_file}", "r") as f:
    air_json = json.loads(f.read())
    air_json_grade = {}
    for key, value in air_json.items():
      if "Grade" in key:
        air_json_grade[key] = value
    print(air_json_grade)
    return json.dumps(air_json_grade)

@app.get("/value")
def air_value():
  with open(f"{dir_mod_file}", "r") as f:
    air_json = json.loads(f.read())
    air_json_value = {}
    for key, value in air_json.items():
      if "Value" in key:
        air_json_value[key] = value
    print(air_json_value)
    return json.dumps(air_json_value)

@app.get("/flag")
def air_flag():
  with open(f"{dir_mod_file}", "r") as f:
    air_json = json.loads(f.read())
    air_json_flag = {}
    for key, value in air_json.items():
      if "Flag" in key:
        air_json_flag[key] = value
    print(air_json_flag)
    return json.dumps(air_json_flag)

@app.get("/graph")
def value_date():
  result_dict = {}
  with open(f"{dir_file}", "r") as f:
    air_json = json.loads(f.read())
    for key in air_json["response"]["body"]["items"][0]:
      if "Value" in key:
        result_dict[key] = []
    for array_list in air_json["response"]["body"]["items"]:
      for key in array_list:
        if "Value" in key:
          result_dict[key].append(array_list[key])
  return json.dumps(result_dict)

if __name__ == "__main__":
  app.run(host = "0.0.0.0", port = 5000, debug = True)
