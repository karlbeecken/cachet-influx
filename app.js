const Influx = require("influx");
const os = require("os");
const axios = require("axios");

axios.get("https://status.fffutu.re/api/v1/components").then((res) => {
  console.log(res.data.data);

  res.data.data.forEach((val) => {
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

    influx
      .writePoints([
        {
          measurement: val.name.replace(/ /gi, "_"),
          tags: { host: os.hostname() },
          fields: { name: val.name, status: val.status, id: val.id },
        },
      ])
  });
});
