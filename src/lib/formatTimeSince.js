import moment from "moment";

export default function (time) {
  const now = moment();
  const pastDate = moment(time);
  // console.log(`now: ${now}, pastDate: ${pastDate}`);
  let result;
  const daysDifference = now.diff(pastDate, "days");
  const hoursDifference = now.diff(pastDate, "hours");
  // console.log(hoursDifference);
  if (
    daysDifference > 7 ||
    pastDate.format("d") > (now.format("d") == 0 ? 7 : now.format("d"))
  ) {
    result = moment(time).format("M/D");
  } else if (daysDifference > 1) {
    result = pastDate.format("dddd");
  } else if (daysDifference == 1) {
    result = "Yesterday";
  } else if (daysDifference < 1 && hoursDifference >= 1) {
    result = `${hoursDifference} ${hoursDifference > 1 ? "hours" : "hour"} ago`;
  }
  return result;
}
