const Influx = require("influx");
const os = require("os");
const axios = require("axios");

axios.get("https://status.fffutu.re/api/v1/components").then((res) => {
  console.log(res.data.systems);

  res.data.systems.forEach((val) => {
    console.log()
    const influx = new Influx.InfluxDB({
      host: "localhost",
      database: "cachet",
      schema: [
        {
          measurement: val.name.replace(/ /gi, "_"),
          fields: {
            name: Influx.FieldType.STRING,
            status: Influx.FieldType.INTEGER,
            id: Influx.FieldType.INTEGER,
          },
          tags: ["host"],
        },
      ],
    });

    let status = 0;
    switch (val.current_status) {
      case "Online":
        status = 0;
        break;
      case "Problem":
        status = 2;
        break;
      case "SystemOutage":
        status = 3;
        break;
    }

    influx
      .writePoints([
        {
          measurement: val.name.replace(/ /gi, "_"),
          tags: { host: os.hostname() },
          fields: { name: val.name, status, id: val.id },
        },
      ])
  });
});
