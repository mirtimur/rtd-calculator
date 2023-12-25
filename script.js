function calculateTemperature() {
  const filterType = document.querySelector("#filterType").value;
  const temperatureCoefficient = Number(
    document.querySelector("#temperatureCoefficient").value
  );
  const resistance = Number(document.querySelector("#fieldResistance").value);

  if (typeof resistance !== "number" || resistance <= 0) {
    return "Неверное значение сопротивления";
  }

  // Вычисляем сопротивление при 0 °C
  const R0 = Number(filterType.slice(2));

  // Определяем коэффициенты A и B в зависимости от типа термометра
  let A, B;
  switch (temperatureCoefficient) {
    case 0.00385:
      A = 3.9083e-3;
      B = -5.775e-7;
      break;
    case 0.00391:
      A = 3.969e-3;
      B = -5.841e-7;
      break;
    default:
      return "Неверное значение коэффициента температуры";
  }

  // Решаем уравнение для нахождения температуры
  const temperature =
    (-R0 * A + Math.sqrt(R0 * R0 * A * A - 4 * R0 * B * (R0 - resistance))) /
    (2 * R0 * B);

  return Math.round(temperature * 10) / 10;
}

function calculateResistance() {
  const filterType = document.querySelector("#filterType").value;
  const temperatureCoefficient = Number(
    document.querySelector("#temperatureCoefficient").value
  );
  const temperature = Number(document.querySelector("#fieldCelsius").value);

  if (typeof temperature !== "number" || !temperature) {
    return "Неверное значение температуры";
  }

  // Вычисляем сопротивление при 0 °C
  const R0 = Number(filterType.slice(2));

  // Определяем коэффициенты A, B и C в зависимости от типа термометра
  let A, B, C;
  switch (temperatureCoefficient) {
    case 0.00385:
      A = 3.9083e-3;
      B = -5.775e-7;
      C = -4.183e-12;
      break;
    case 0.00391:
      A = 3.969e-3;
      B = -5.841e-7;
      C = -4.33e-12;
      break;
    default:
      return "Неверное значение коэффициента температуры";
  }

  // Вычисляем сопротивление по формуле, в зависимости от диапазона температуры
  let resistance;
  if (temperature >= -200 && temperature < 0) {
    resistance =
      R0 *
      (1 +
        A * temperature +
        B * temperature * temperature +
        C * (temperature - 100) * temperature * temperature * temperature);
  } else if (temperature >= 0 && temperature <= 850) {
    resistance = R0 * (1 + A * temperature + B * temperature * temperature);
  } else {
    return "Неверное значение температуры";
  }

  return Math.round(resistance * 10) / 10;
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

// function temperatureConverter(valNum) {
//   valNum = parseFloat(valNum);
//   if (document.getElementById("fieldCelsius").value) {

//     document.getElementById("fieldFahrenheit").value =
//       Math.round((valNum * 1.8 + 32) * 10) / 10;
//     document.getElementById("fieldKelvin").value =
//       Math.round((valNum + 273.15) * 10) / 10;
//   }
//   if (document.getElementById("fieldFahrenheit").value) {
//     document.getElementById("fieldCelsius").value =
//     Math.round(((valNum - 32) / 1.8) * 10) / 10;
//     document.getElementById("fieldKelvin").value =
//     Math.round(((valNum - 32) / 1.8 + 273.15) * 10) / 10;
//   }
//   if (document.getElementById("fieldKelvin").value) {
//     document.getElementById("fieldFahrenheit").value =
//     Math.round(((valNum - 273.15) * 1.8 + 32) * 10) / 10;
//     document.getElementById("fieldCelsius").value =
//     Math.round((valNum - 273.15) * 10) / 10;
//   }
// }

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
