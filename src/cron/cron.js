const cron = require("node-cron");
const Brokerage = require("../models/brokerage");
const { AMOUNT_PAID } = require("../constants/enum");

// Schedule the cron job at 8 A.M daily
// const cronMoringDailyTimer = "0 0 10 * * *";
const cronMoringDailyTimer = "*/5 * * * *";

cron.schedule(cronMoringDailyTimer, async () => {
  try {
    await Brokerage.updateMany(
      { "brokerage.status": AMOUNT_PAID.PENDING },
      { $set: { "brokerage.$[elem].status": AMOUNT_PAID.PAID } },
      { arrayFilters: [{ "elem.status": AMOUNT_PAID.PENDING }] }
    );
    console.log(
      "Brokerage Pedning to Padi status updated successfully !",
      new Date().toString()
    );
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
