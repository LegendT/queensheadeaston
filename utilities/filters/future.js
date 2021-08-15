module.exports = (future) => {

  let now = new Date().getTime();
  return future.filter((p) => {
    if (now < p.date.getTime()) return false;
    return true;
  });