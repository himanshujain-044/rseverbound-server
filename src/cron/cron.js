const cron = require("node-cron");
const Brokerage = require("../models/brokerage");
const moment = require("moment");
const { AMOUNT_PAID } = require("../constants/enum");

// Schedule the cron job at 3:30AM daily
const cronStatusUpdateTimeExp = "48 06 * * *";

// Schedule the cron job at 4:30AM daily
const cronRemoveBrokerageTimeExp = "30 07 * * *";

cron.schedule(cronStatusUpdateTimeExp, async () => {
  try {
    await Brokerage.updateMany(
      { "brokerage.status": AMOUNT_PAID.PENDING },
      { $set: { "brokerage.$[elem].status": AMOUNT_PAID.PAID } },
      { arrayFilters: [{ "elem.status": AMOUNT_PAID.PENDING }] }
    );
    console.log(
      "Brokerage updated Pending to Paid status successfully !",
      new Date().toString()
    );
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

cron.schedule(cronRemoveBrokerageTimeExp, async () => {
  try {
    const today = new Date();
    const last30thDay = new Date(today);
    last30thDay.setDate(today.getDate() - 30);
    console.log(last30thDay.toDateString());
    const data = await Brokerage.updateMany(
      {},
      {
        $pull: {
          brokerage: {
            date: last30thDay,
            status: AMOUNT_PAID.NOT_PAID,
          },
        },
      }
    );

    console.log(data);
    console.log(
      "Brokerage updated, removed a month ago brokerage successfully !",
      new Date().toString()
    );
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
