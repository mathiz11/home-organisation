function format(date) {
  return date.toISOString().split("T")[0];
}

const dateUtils = {
  format,
};

export default dateUtils;
