function format(date) {
  return date.toISOString().split("T")[0];
}

const monthList = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const dateUtils = {
  format,
  monthList,
};

export default dateUtils;
