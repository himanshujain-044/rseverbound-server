const axios = require("axios");
const moment = require("moment");
const {
  getAllCustomers,
  getCustomersBrokrage,
} = require("../constants/upstoxAPIEndPoints");
const Users = require("../models/users");
const Brokrage = require("../models/brokrage");
const { encryptPassword } = require("../utility/common");
const { AMOUNT_PAID } = require("../constants/enum");

module.exports = {
  getAllCustomers: async (req, res, next) => {
    try {
      const { accessToken } = req.query;
      const toDate = moment().toISOString();
      const option = {
        type: "json",
        listType: "all",
        dateFilter: {
          from: "2020-12-31T18:30:00.000Z",
          to: toDate,
        },
        orderBy: [{ column: "incorpdate", order: "DESC" }],
        limit: 10000000,
        offset: 0,
      };
      const header = {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
      const upstoxRes = await axios.get(getAllCustomers, {
        headers: header,
        params: option,
      });
      const users = await Users.find();
      const results = upstoxRes.data?.result
        .filter(
          ({ email: upstoxEmail, mobile: upstoxMobile }) =>
            upstoxEmail &&
            upstoxMobile &&
            !users.some(
              ({ email, mobile }) =>
                upstoxEmail !== email && upstoxMobile !== mobile
            )
        )
        .map((user) => {
          return {
            name: user?.name,
            email: user?.email,
            ucc: user?.ucc,
            mobile: user?.mobile,
            password: encryptPassword(user?.ucc),
          };
        });
      await Users.insertMany(results);
      res
        .status(200)
        .send({ code: 200, message: "Customers fetched successfully !" });
    } catch (err) {
      console.error(err?.response?.data);
      next(err?.response?.data?.error || err);
    }
  },
  getCustomersBrokrage: async (req, res, next) => {
    try {
      const { accessToken } = req.query;
      const option = {
        filterType: "day",
        limit: 10000000,
        offset: 0,
        l2SharingRatio: 30,
      };
      const header = {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
      const upstoxRes = await axios.get(getCustomersBrokrage, {
        headers: header,
        params: option,
      });

      await updateBrokrage(upstoxRes.data?.list);
      res
        .status(200)
        .send({ code: 200, message: "Brokrage fetched successfully !" });
    } catch (err) {
      console.error(err?.response);
      next(err?.response?.data?.error || err);
    }
  },
};
async function updateBrokrage(brokrageList = []) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return Promise.all(
    brokrageList.map(async (brokrage) => {
      if (brokrage?.email && brokrage?.mobile) {
        await Brokrage.findOneAndUpdate(
          { email: brokrage?.email, mobile: brokrage?.mobile },
          {
            $set: { email: brokrage?.email, mobile: brokrage?.mobile },
            $addToSet: {
              brokrage: {
                date: yesterday.toDateString(),
                amount: brokrage?.past / 2,
                status: AMOUNT_PAID.NOT_PAID,
              },
            },
          },
          { upsert: true, new: true }
        );
      }
      return;
    })
  );
}
