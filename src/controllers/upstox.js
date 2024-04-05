const axios = require("axios");
const moment = require("moment");
const {
  getAllCustomers,
  getCustomersBrokerage,
} = require("../constants/upstoxAPIEndPoints");
const Users = require("../models/users");
const Brokerage = require("../models/brokerage");
const { encryptPassword, chunkArray } = require("../utility/common");
const { AMOUNT_PAID } = require("../constants/enum");
const { sendEmail, getAttachments } = require("../utility/mail/mail");
const {
  customersAddedNotification,
  welcomeMail,
  openDematAccount,
} = require("../utility/mail/mailTemplates");
const ErrorClass = require("../utility/error");
const SavedRandomUsers = require("../models/savedRandomUsers");

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
      await sendWelcomeEmail(results);
      await Users.insertMany(results);
      res
        .status(200)
        .send({ code: 200, message: "Customers fetched successfully !" });
    } catch (err) {
      console.error(err?.response?.data);
      next(err?.response?.data?.error || err);
    }
  },
  getCustomersBrokerage: async (req, res, next) => {
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
      const upstoxRes = await axios.get(getCustomersBrokerage, {
        headers: header,
        params: option,
      });

      await updateBrokerage(upstoxRes.data?.list);
      res
        .status(201)
        .send({ code: 201, message: "Brokerage fetched successfully !" });
    } catch (err) {
      console.error(err?.response);
      next(err?.response?.data?.error || err);
    }
  },
  sendOpenDematAccMail: async (req, res, next) => {
    try {
      const { emails } = req?.body;
      const chunkedMailsArr = chunkArray(emails, 20);
      await Promise.all(
        chunkedMailsArr.map(async (chunk) => {
          await Promise.all(
            chunk.map(async (data) => {
              await sendEmail({
                to: data,
                subject:
                  "Unlock Your Potential: Open Your Demat Account Today!",
                html: openDematAccount(),
                attachments: getAttachments([
                  "logo",
                  "welcomeHero",
                  "upstoxLogo",
                ]),
              });
            })
          );
          // await sendEmail({
          //   to: emailsArr,
          //   subject: "Unlock Your Potential: Open Your Demat Account Today!",
          //   html: openDematAccount(),
          //   attachments: getAttachments(["logo", "welcomeHero", "upstoxLogo"]),
          //   isMultipleReceiver: true,
          // });
        })
      );
      res
        .status(201)
        .send({ code: 201, message: "Mail delivered to all the users !" });
    } catch (err) {
      console.error(err?.response);
      next(err?.response?.data?.error || err);
    }
  },
  getAllSavedUsers: async (req, res, next) => {
    try {
      const results = await SavedRandomUsers.find().distinct("email");
      res.status(200).send({
        code: 200,
        message: "Fetched all the users !",
        data: results,
      });
    } catch (err) {
      console.error(err?.response);
      next(err?.response?.data?.error || err);
    }
  },
};
async function updateBrokerage(brokerageList = []) {
  const today = new Date();
  if ([0, 6].includes(today.getDay())) {
    throw new ErrorClass("Today is Weekend !", 400);
  }
  return Promise.all(
    brokerageList.map(async (brokerage) => {
      if (brokerage?.email && brokerage?.mobile) {
        await Brokerage.findOneAndUpdate(
          {
            email: brokerage?.email,
            mobile: brokerage?.mobile,
            "brokerage.date": { $ne: today.toDateString() },
          },
          {
            $set: { email: brokerage?.email, mobile: brokerage?.mobile },
            $addToSet: {
              brokerage: {
                date: today.toDateString(),
                amount: brokerage?.present / 2,
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
async function sendWelcomeEmail(users = []) {
  return Promise.all(
    users.map(async (user) => {
      const { name, email, ucc } = user;
      await sendEmail({
        to: email,
        subject:
          "Welcome to Our Community - Access to Your Brokerage Dashboard",
        html: welcomeMail({
          name,
          email,
          ucc,
        }),
        attachments: getAttachments(["logo", "welcomeHero"]),
      });
    })
  );
}
