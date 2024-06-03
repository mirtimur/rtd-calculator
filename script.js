function calculateResistance() {
  const filterType = document.querySelector("#filterType").value;
  const temperature = Number(document.querySelector("#fieldCelsius").value);
  const resistanceZero = Number(
    document.querySelector("#fieldResistanceZero").value
  );

  if (typeof temperature !== "number" || !temperature) {
    return "Неверное значение температуры";
  }

  if (filterType === "CU") {
    let A, B, C;
    A = 4.28e-3;
    B = -6.2032e-7;
    C = 8.5154e-12;

    let resistance;
    if (temperature >= -180 && temperature < 0) {
      resistance =
        resistanceZero *
        (1 +
          A * temperature +
          B * temperature * (temperature + 6.7) +
          C * Math.pow(temperature, 3));
    } else if (temperature >= 0 && temperature <= 200) {
      resistance = resistanceZero * (1 + A * temperature);
    } else {
      return "Неверное значение температуры";
    }

    return Math.round(resistance * 10) / 10;
  } else if (filterType === "NI") {
    let A, B, C;
    A = 5.4963e-3;
    B = 6.7556e-7;
    C = -9.2004e-10;

    let resistance;
    if (temperature >= -60 && temperature < 100) {
      resistance =
        resistanceZero * (1 + A * temperature + B * Math.pow(temperature, 2));
    } else if (temperature >= 100 && temperature <= 180) {
      resistance =
        resistanceZero *
        (1 +
          A * temperature +
          B * Math.pow(temperature, 2) +
          C * (temperature - 100) * Math.pow(temperature, 2));
    } else {
      return "Неверное значение температуры";
    }
    return Math.round(resistance * 10) / 10;
  } else if (filterType.includes("PT")) {
    let A, B, C;
    switch (filterType) {
      case "PT385":
        A = 3.9083e-3;
        B = -5.775e-7;
        C = -4.183e-12;
        break;
      case "PT391":
        A = 3.969e-3;
        B = -5.841e-7;
        C = -4.33e-12;
        break;
      default:
        return "Неверное значение коэффициента температуры";
    }
    let resistance;
    if (temperature >= -200 && temperature < 0) {
      resistance =
        resistanceZero *
        (1 +
          A * temperature +
          B * temperature * temperature +
          C * (temperature - 100) * temperature * temperature * temperature);
    } else if (temperature >= 0 && temperature <= 850) {
      resistance =
        resistanceZero * (1 + A * temperature + B * temperature * temperature);
    } else {
      return "Неверное значение температуры";
    }
    return Math.round(resistance * 10) / 10;
  }
}

function calculateTemperature() {
  const filterType = document.querySelector("#filterType").value;
  const R0 = Number(document.querySelector("#fieldResistanceZero").value);
  const resistance = Number(document.querySelector("#fieldResistance").value);
  if (typeof resistance !== "number" || resistance <= 0) {
    return "Неверное значение сопротивления";
  }
  if (filterType === "CU") {
    let A;
    A = 4.28e-3;
    let temperature;

    if (resistance / R0 >= 1) {
      temperature = (resistance / R0 - 1) / A;
    } else if (resistance / R0 < 1) {
      const D1 = 233.87;
      const D2 = 7.937;
      const D3 = -2.0062;
      const D4 = -0.3953;
      const t = resistance / R0 - 1;
      temperature =
        D1 * Math.pow(t, 1) +
        D2 * Math.pow(t, 2) +
        D3 * Math.pow(t, 3) +
        D4 * Math.pow(t, 4);
    } else {
      return "Вне диапазона";
    }
    if (temperature <= -180 || temperature >= 200) {
      return "Вне диапазона";
    }

    return Math.round(temperature * 10) / 10;
  } else if (filterType === "NI") {
    let A, B;
    A = 5.4963e-3;
    B = 6.7556e-6;
    if (resistance <= R0) {
      const discriminant = A * A - 4 * B * (1 - resistance / R0);
      temperature = (-A + Math.sqrt(discriminant)) / (2 * B);
    } else if (resistance > R0) {
      const D1 = 144.096;
      const D2 = -25.502;
      const D3 = 4.4876;

      const arg = resistance / R0 - 1.6172;
      temperature =
        100 +
        (D1 * Math.pow(arg, 1) + D2 * Math.pow(arg, 2) + D3 * Math.pow(arg, 3));
    } else {
      return "Вне диапазона";
    }
    if (temperature <= -60 || temperature >= 180) {
      return "Вне диапазона";
    }

    return Math.round(temperature * 10) / 10;
  } else if (filterType.includes("PT")) {
    let A, B;
    switch (filterType) {
      case "PT385":
        A = 3.9083e-3;
        B = -5.775e-7;
        break;
      case "PT391":
        A = 3.969e-3;
        B = -5.841e-7;
        break;
      default:
        return "Неверное значение коэффициента температуры";
    }
    const temperature =
      (-R0 * A + Math.sqrt(R0 * R0 * A * A - 4 * R0 * B * (R0 - resistance))) /
      (2 * R0 * B);
    if (temperature <= -200 || temperature >= 850) {
      return "Вне диапазона";
    }
    return Math.round(temperature * 10) / 10;
  }
}

function temperatureConverterFromCelsiusToFahrenheit(valNum) {
  valNum = parseFloat(valNum);
  document.getElementById("fieldFahrenheit").value =
    Math.round((valNum * 1.8 + 32) * 10) / 10;
}

function temperatureConverterFromCelsiusToKelvin(valNum) {
  valNum = parseFloat(valNum);
  document.getElementById("fieldKelvin").value =
    Math.round((valNum + 273.15) * 10) / 10;
}

function temperatureConverterFromFahrenheitToCelsius(valNum) {
  valNum = parseFloat(valNum);
  document.getElementById("fieldCelsius").value =
    Math.round(((valNum - 32) / 1.8) * 10) / 10;
}

function temperatureConverterFromFahrenheitToKelvin(valNum) {
  valNum = parseFloat(valNum);
  document.getElementById("fieldKelvin").value =
    Math.round(((valNum - 32) / 1.8 + 273.15) * 10) / 10;
}

function temperatureConverterFromKelvinToFahrenheit(valNum) {
  valNum = parseFloat(valNum);
  document.getElementById("fieldFahrenheit").value =
    Math.round(((valNum - 273.15) * 1.8 + 32) * 10) / 10;
}

function temperatureConverterFromKelvinToCelsius(valNum) {
  valNum = parseFloat(valNum);
  document.getElementById("fieldCelsius").value =
    Math.round((valNum - 273.15) * 10) / 10;
}

document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();

  let inputs = document.querySelectorAll("form input[type=text]");
  let filled = 0;
  for (let input of inputs) {
    if (input.value !== "") {
      filled++;
    }
  }
  if (filled > 1) {
    return alert("Заполните только одно поле!");
  }

  if (document.querySelector("#fieldResistance").value) {
    let temperature = calculateTemperature();
    temperatureConverterFromCelsiusToKelvin(temperature);
    temperatureConverterFromCelsiusToFahrenheit(temperature);
    return (document.querySelector("#fieldCelsius").value = temperature);
  }

  if (document.querySelector("#fieldCelsius").value) {
    let resistance = calculateResistance();
    temperatureConverterFromCelsiusToKelvin(
      document.querySelector("#fieldCelsius").value
    );
    temperatureConverterFromCelsiusToFahrenheit(
      document.querySelector("#fieldCelsius").value
    );
    return (document.querySelector("#fieldResistance").value = resistance);
  }

  if (document.querySelector("#fieldFahrenheit").value) {
    let tempFahrenheit = document.querySelector("#fieldFahrenheit").value;
    temperatureConverterFromFahrenheitToCelsius(tempFahrenheit);
    temperatureConverterFromFahrenheitToKelvin(tempFahrenheit);

    let resistance = calculateResistance();
    return (document.querySelector("#fieldResistance").value = resistance);
  }

  if (document.querySelector("#fieldKelvin").value) {
    let tempKelvin = document.querySelector("#fieldKelvin").value;
    temperatureConverterFromKelvinToFahrenheit(tempKelvin);
    temperatureConverterFromKelvinToCelsius(tempKelvin);
    let resistance = calculateResistance();
    return (document.querySelector("#fieldResistance").value = resistance);
  }
});
