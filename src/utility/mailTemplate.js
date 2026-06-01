const React = require("react");
const path = require("path");
const fs = require("fs");
const { numberToWords } = require("./common");
const styles = {
  section: {
    flexDirection: "row",
    border: "1px solid black",
    margin: "0",
    borderBottom: "0px solid black",
  },
};
const InvoiceTemp = ({ Document, Page, Text, View, Image, data = {} }) => {
  console.log("pdf data", data);
  const assets = {
    logo: fs.readFileSync(path.join(__dirname, "../assets/logo.png")),
    cancelled: fs.readFileSync(path.join(__dirname, "../assets/cancelled.png")),
    signature: fs.readFileSync(path.join(__dirname, "../assets/signature.png")),
  };
  const { logo, cancelled, signature } = assets;
  const pdfTitle = `${data?.buyerDetails?.name || "Invoice"}_${data?.invoiceDate || ""}`;

  return React.createElement(
    Document,
    { title: pdfTitle, key: pdfTitle },
    React.createElement(
      Page,
      {
        size: "A4",
        style: {
          flexDirection: "col",
          backgroundColor: "#fff",
          padding: "8px",
          fontSize: "10px",
          lineHeight: "16px",
        },
        key: "pdf-page",
      },

      // --- HEADER BLOCK ---
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Image, {
          style: { padding: "2px", width: "45px" },
          src: logo,
          alt: "logo",
        }),
        React.createElement(
          Text,
          {
            style: {
              textDecoration: "underline",
              width: "80%",
              textAlign: "center",
              padding: "4px",
              paddingTop: "14px",
            },
          },
          data?.invoiceNo ? "TAX INVOICE" : "DELIVERY CHALLAN",
        ),
      ),

      // --- SENDER & INVOICE META BLOCK ---
      React.createElement(
        View,
        { style: { ...styles.section } },
        React.createElement(
          View,
          { style: { width: "45%", paddingLeft: "2px", paddingTop: "2px" } },
          React.createElement(
            Text,
            { style: { fontFamily: "Times-Bold", fontSize: "13px" } },
            "Rocksunn Private Limited",
          ),
          React.createElement(Text, null, "NEAR VIVEKANAND COLLEGE,"),
          React.createElement(
            Text,
            null,
            "AMAMRMOU, SHAHGARH, SAGAR - 470339, MP, INDIA",
          ),
          React.createElement(
            Text,
            { style: { fontFamily: "Helvetica-Bold" } },
            "GSTIN/UIN: 23AAPCR7561K1ZT",
          ),
          React.createElement(
            Text,
            null,
            "State Name: Madhya Pradesh, Code: 23",
          ),
          React.createElement(Text, null, "Contact - 8349112391"),
        ),
        React.createElement(
          View,
          {
            style: {
              width: "30%",
              borderLeft: "1px solid black",
              paddingTop: "2px",
            },
          },
          React.createElement(
            View,
            { style: { paddingLeft: "2px" } },
            React.createElement(Text, null, "Invoice No."),
            React.createElement(
              Text,
              { style: { fontFamily: "Helvetica-Bold" } },
              data?.invoiceNo ? data?.invoiceNo : data?.deliveryChNo,
            ),
          ),
          React.createElement(View, {
            style: { borderBottom: "1px solid black" },
          }),
          React.createElement(
            Text,
            { style: { paddingLeft: "2px", paddingTop: "2px" } },
            `${data?.buyerOrderNoText || ""} - ${data?.buyerOrderNoValue || ""}`,
          ),
          React.createElement(
            Text,
            { style: { paddingLeft: "2px", paddingTop: "2px" } },
            `Date - ${data?.date || ""}`,
          ),
        ),
        React.createElement(
          View,
          {
            style: {
              width: "25%",
              borderLeft: "1px solid black",
              paddingTop: "2px",
            },
          },
          React.createElement(
            View,
            { style: { paddingLeft: "2px" } },
            React.createElement(Text, null, "Invoice Date"),
            React.createElement(
              Text,
              { style: { fontFamily: "Helvetica-Bold" } },
              data?.invoiceDate,
            ),
          ),
          React.createElement(View, {
            style: { borderBottom: "1px solid black" },
          }),
          React.createElement(
            Text,
            { style: { paddingLeft: "2px", paddingTop: "2px" } },
            `Dispatch Through - ${data?.dispatchThrough || ""}`,
          ),
          React.createElement(
            Text,
            { style: { paddingLeft: "2px", paddingTop: "2px" } },
            `Destination - ${data?.destination || ""}`,
          ),
        ),
      ),

      // --- BUYER & CONSIGNEE BLOCK ---
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: { width: "45%", paddingLeft: "2px", paddingTop: "2px" } },
          React.createElement(
            Text,
            { style: { fontFamily: "Helvetica-Bold" } },
            `Buyer (Bill To) - ${data?.buyerDetails?.name || ""}`,
          ),
          React.createElement(
            Text,
            null,
            `Address - ${data?.buyerDetails?.address || ""}`,
          ),
          React.createElement(
            Text,
            { style: { fontFamily: "Helvetica-Bold" } },
            `GSTIN/UIN: ${data?.buyerDetails?.gst || ""}`,
          ),
          React.createElement(
            Text,
            null,
            `State - ${data?.buyerDetails?.state || ""}`,
          ),
          React.createElement(
            Text,
            null,
            `Place Of Supply - ${data?.buyerDetails?.placeOfSupply || ""}`,
          ),
        ),
        React.createElement(
          View,
          {
            style: {
              borderLeft: "1px solid black",
              width: "50%",
              paddingLeft: "2px",
              paddingTop: "2px",
            },
          },
          React.createElement(
            Text,
            { style: { fontFamily: "Helvetica-Bold" } },
            `Consignee (Ship To) - ${data?.shipToDetails?.name || ""}`,
          ),
          React.createElement(
            Text,
            null,
            `Address - ${data?.shipToDetails?.address || ""}`,
          ),
          React.createElement(
            Text,
            { style: { fontFamily: "Helvetica-Bold" } },
            `GSTIN/UIN: ${data?.shipToDetails?.gst || ""}`,
          ),
          React.createElement(
            Text,
            null,
            `State - ${data?.shipToDetails?.state || ""}`,
          ),
        ),
      ),

      // --- TABLE HEADER BLOCK ---
      React.createElement(
        View,
        { style: { ...styles.section, fontFamily: "Helvetica-Bold" } },
        React.createElement(
          View,
          { style: { width: "6%", paddingTop: "5px", textAlign: "center" } },
          React.createElement(Text, null, "S. No"),
        ),
        React.createElement(
          View,
          {
            style: {
              width: "30%",
              borderLeft: "1px solid black",
              paddingTop: "5px",
              textAlign: "center",
            },
          },
          React.createElement(Text, null, "Description of Goods"),
        ),
        React.createElement(
          View,
          {
            style: {
              width: "13%",
              borderLeft: "1px solid black",
              paddingTop: "5px",
              textAlign: "center",
            },
          },
          React.createElement(Text, null, "HSN Code"),
        ),
        React.createElement(
          View,
          {
            style: {
              width: "16%",
              borderLeft: "1px solid black",
              paddingTop: "5px",
              textAlign: "center",
            },
          },
          React.createElement(Text, null, "Quantity"),
        ),
        React.createElement(
          View,
          {
            style: {
              width: "26%",
              borderLeft: "1px solid black",
              paddingTop: "5px",
              textAlign: "center",
            },
          },
          React.createElement(Text, null, "Unit"),
        ),
        React.createElement(
          View,
          {
            style: {
              width: "13%",
              borderLeft: "1px solid black",
              paddingTop: "5px",
              textAlign: "center",
            },
          },
          React.createElement(Text, null, "Rate"),
        ),
        React.createElement(
          View,
          {
            style: {
              width: "30%",
              borderLeft: "1px solid black",
              paddingTop: "5px",
              textAlign: "center",
            },
          },
          React.createElement(Text, null, "Amount Rs"),
        ),
      ),

      // --- DYNAMIC PRODUCT ITERATION (MAP) ---
      (data?.productsSellDetails?.productsSell || []).map(
        (productSell, index) => {
          return React.createElement(
            View,
            { style: styles.section, key: `product-${index}` },
            React.createElement(
              View,
              {
                style: {
                  width: "6%",
                  paddingLeft: "2px",
                  paddingTop: "5px",
                  textAlign: "center",
                },
              },
              React.createElement(Text, null, productSell?.sNo),
            ),
            React.createElement(
              View,
              {
                style: {
                  width: "30%",
                  borderLeft: "1px solid black",
                  paddingLeft: "2px",
                  paddingTop: "5px",
                  fontFamily: "Helvetica-Bold",
                  textAlign: "center",
                },
              },
              React.createElement(Text, null, productSell?.description),
            ),
            React.createElement(
              View,
              {
                style: {
                  width: "13%",
                  borderLeft: "1px solid black",
                  paddingLeft: "2px",
                  paddingTop: "5px",
                  textAlign: "center",
                },
              },
              React.createElement(Text, null, productSell?.hsnCode),
            ),
            React.createElement(
              View,
              {
                style: {
                  width: "16%",
                  borderLeft: "1px solid black",
                  paddingLeft: "2px",
                  paddingTop: "5px",
                  fontFamily: "Helvetica-Bold",
                  textAlign: "center",
                },
              },
              React.createElement(Text, null, productSell?.quantity),
            ),
            React.createElement(
              View,
              {
                style: {
                  width: "26%",
                  borderLeft: "1px solid black",
                  paddingLeft: "2px",
                  paddingTop: "5px",
                  fontFamily: "Helvetica-Bold",
                  textAlign: "center",
                },
              },
              React.createElement(Text, null, productSell?.unit),
            ),
            React.createElement(
              View,
              {
                style: {
                  width: "13%",
                  borderLeft: "1px solid black",
                  paddingLeft: "2px",
                  paddingTop: "5px",
                  textAlign: "center",
                },
              },
              React.createElement(Text, null, productSell?.ratePMT),
            ),
            React.createElement(
              View,
              {
                style: {
                  width: "30%",
                  borderLeft: "1px solid black",
                  paddingRight: "2px",
                  paddingTop: "5px",
                  textAlign: "center",
                  fontFamily: "Helvetica-Bold",
                },
              },
              React.createElement(Text, null, productSell?.amount),
            ),
          );
        },
      ),

      // --- SPACING & VALUATION SECTION ---
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          {
            style: {
              width: "61.9%",
              paddingTop: "2px",
              paddingBottom: `${220 - (data?.productsSellDetails?.productsSell?.length || 0) * 10}px`,
            },
          },
          React.createElement(Text, null),
        ),
        data?.invoiceNo
          ? React.createElement(
              View,
              {
                style: {
                  width: "38%",
                  borderLeft: "1px solid black",
                  paddingRight: "2px",
                  paddingTop: "2px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              },
              React.createElement(
                View,
                { style: { paddingLeft: "2px" } },
                React.createElement(
                  Text,
                  { style: { marginTop: "2px" } },
                  data?.productsSellDetails?.otherExpensesGSTText,
                ),
                React.createElement(
                  Text,
                  { style: { fontFamily: "Helvetica-Bold" } },
                  "Taxable Value",
                ),
                data?.productsSellDetails?.igst
                  ? React.createElement(
                      Text,
                      null,
                      `IGST - ${data?.productsSellDetails?.igst} %`,
                    )
                  : null,
                data?.productsSellDetails?.sgst
                  ? React.createElement(
                      React.Fragment,
                      null,
                      React.createElement(
                        Text,
                        null,
                        `SGST - ${Number(data?.productsSellDetails?.sgst) / 2}  %`,
                      ),
                      React.createElement(
                        Text,
                        null,
                        `CGST - ${Number(data?.productsSellDetails?.sgst) / 2} %`,
                      ),
                    )
                  : null,
                React.createElement(
                  Text,
                  null,
                  data?.productsSellDetails?.otherExpensesText,
                ),
                React.createElement(Text, null, "Round Off"),
              ),
              React.createElement(
                View,
                { style: { fontFamily: "Times-Italic" } },
                React.createElement(
                  Text,
                  { style: { marginTop: "2px" } },
                  data?.productsSellDetails?.otherExpensesGST > 0
                    ? data?.productsSellDetails?.otherExpensesGST
                    : "",
                ),
                React.createElement(
                  Text,
                  { style: { fontFamily: "Helvetica-Bold" } },
                  Number(
                    (Number(data?.productsSellDetails?.totalProductAmount) ||
                      0) +
                      (Number(data?.productsSellDetails?.otherExpensesGST) ||
                        0),
                  ).toFixed(2),
                ),
                data?.productsSellDetails?.igst
                  ? React.createElement(
                      Text,
                      null,
                      data?.productsSellDetails?.gstAmount,
                    )
                  : null,
                data?.productsSellDetails?.sgst
                  ? React.createElement(
                      React.Fragment,
                      null,
                      React.createElement(
                        Text,
                        null,
                        Number(data?.productsSellDetails?.gstAmount) / 2,
                      ),
                      React.createElement(
                        Text,
                        null,
                        Number(data?.productsSellDetails?.gstAmount) / 2,
                      ),
                    )
                  : null,
                React.createElement(
                  Text,
                  null,
                  data?.productsSellDetails?.otherExpenses > 0
                    ? data?.productsSellDetails?.otherExpenses
                    : "",
                ),
                React.createElement(
                  Text,
                  null,
                  `${data?.productsSellDetails?.roundOff?.added ? "+" : "-"} ${data?.productsSellDetails?.roundOff?.amountInPaise || ""}`,
                ),
              ),
            )
          : React.createElement(
              View,
              {
                style: {
                  width: "38%",
                  borderLeft: "1px solid black",
                  paddingRight: "2px",
                  paddingTop: "2px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              },
              React.createElement(
                View,
                { style: { paddingLeft: "2px" } },
                React.createElement(
                  Text,
                  { style: { marginTop: "2px" } },
                  data?.productsSellDetails?.otherExpensesGSTText,
                ),
                React.createElement(
                  Text,
                  { style: { fontFamily: "Helvetica-Bold" } },
                  "Total Value",
                ),
              ),
              React.createElement(
                View,
                { style: { fontFamily: "Times-Italic" } },
                React.createElement(
                  Text,
                  { style: { marginTop: "2px" } },
                  data?.productsSellDetails?.totalProductAmount,
                ),
              ),
            ),
      ),

      // --- GRAND TOTAL BLOCK ---
      React.createElement(
        View,
        { style: { ...styles.section, fontFamily: "Helvetica-Bold" } },
        React.createElement(
          View,
          {
            style: {
              width: "61.9%",
              paddingRight: "2px",
              paddingTop: "5px",
              justifyContent: "flex-end",
              textAlign: "right",
            },
          },
          React.createElement(Text, null, "Grand Total"),
        ),
        React.createElement(
          View,
          {
            style: {
              width: "38%",
              borderLeft: "1px solid black",
              textAlign: "right",
              paddingRight: "2px",
              paddingTop: "5px",
            },
          },
          React.createElement(
            Text,
            null,
            data?.invoiceNo
              ? data?.productsSellDetails?.grandTotal
              : data?.productsSellDetails?.totalProductAmount,
          ),
        ),
      ),

      // --- WORDS BLOCK ---
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: { width: "85%", paddingLeft: "2px", paddingTop: "2px" } },
          React.createElement(Text, null, "Amount in words"),
          React.createElement(
            Text,
            { style: { fontFamily: "Helvetica-Bold" } },
            `INDIAN RUPEE: ${data?.invoiceNo ? numberToWords(data?.productsSellDetails?.grandTotal) : numberToWords(data?.productsSellDetails?.totalProductAmount)}`,
          ),
        ),
        React.createElement(
          View,
          {
            style: {
              width: "15%",
              textAlign: "right",
              paddingRight: "2px",
              paddingTop: "2px",
            },
          },
          React.createElement(Text, null, "E. & O.E"),
        ),
      ),

      // --- TERMS & SIGNATURE BLOCK ---
      data?.invoiceNo
        ? React.createElement(
            View,
            { style: styles.section },
            React.createElement(
              View,
              {
                style: {
                  width: "60%",
                  justifyContent: "flex-end",
                  paddingLeft: "2px",
                  paddingTop: "2px",
                },
              },
              React.createElement(Text, null, "Terms and Condition"),
              React.createElement(
                Text,
                null,
                "a) This Bill is payable by Electronic transfer/ DD/ Cheque in favor of Rocksunn Private Limited. Please make payment within 15 days of receipt of this invoice.",
              ),
              React.createElement(
                Text,
                null,
                "b) Bank Details: Central Bank Of India, Bus Stand, Shahgarh, Sagar, Madhya Pradesh - 470339. Account Number: 5986045772, IFSC Code: CBIN0282030",
              ),
              React.createElement(
                Text,
                null,
                "c) For payment made by electronic fund transfer, please send details to receipt@rseverbound.com (Invoice number, Invoice amount, Rocksunn Bank name and Account number, Payment date, Amount paid, TDS). Queries can be sent to us at receipt@rseverbound.com.",
              ),
            ),
            React.createElement(
              View,
              {
                style: {
                  width: "40%",
                  marginLeft: "20px",
                  borderLeft: "1px solid black",
                  paddingTop: "2px",
                },
              },
              React.createElement(
                View,
                { style: { paddingLeft: "2px", fontFamily: "Helvetica-Bold" } },
                React.createElement(Text, null, "Company's Bank Details"),
                React.createElement(Text, null, "A/c Holder's Name: Rock Sunn"),
                React.createElement(
                  Text,
                  null,
                  "Bank Name: Central Bank of India",
                ),
                React.createElement(Text, null, "A/c No.: 5986045772"),
                React.createElement(
                  Text,
                  null,
                  "Branch & IFSC Code: SHAHGARH, SAGAR (M.P.) & CBIN0282030",
                ),
              ),
              React.createElement(
                View,
                {
                  style: {
                    width: "100%",
                    textAlign: "right",
                    borderTop: "1px solid black",
                    paddingRight: "2px",
                    paddingTop: "2px",
                    justifyContent: "flex-end",
                    alignContent: "flex-end",
                    alignItems: "flex-end",
                  },
                },
                React.createElement(
                  Text,
                  { style: { fontFamily: "Helvetica-Bold" } },
                  "for Rock Sunn",
                ),
                React.createElement(Image, {
                  style: { width: "80px" },
                  src: signature,
                }),
                React.createElement(Text, null, "Authorised Signatory"),
              ),
            ),
          )
        : React.createElement(
            View,
            { style: styles.section },
            React.createElement(
              View,
              {
                style: {
                  width: "100%",
                  textAlign: "right",
                  paddingRight: "2px",
                  paddingTop: "2px",
                  justifyContent: "flex-end",
                  alignContent: "flex-end",
                  alignItems: "flex-end",
                },
              },
              React.createElement(
                Text,
                { style: { fontFamily: "Helvetica-Bold" } },
                "for Rock Sunn",
              ),
              React.createElement(Image, {
                style: { width: "80px" },
                src: signature,
              }),
              React.createElement(Text, null, "Authorised Signatory"),
            ),
          ),

      React.createElement(View, {
        style: { borderBottomWidth: 1, borderBottomColor: "black" },
      }),

      // --- WATERMARK CANCELLED OVERLAY ---
      data?.isInvoiceCancel
        ? React.createElement(Image, {
            style: {
              position: "absolute",
              display: "block",
              height: "100%",
              width: "100%",
              zIndex: "-1",
            },
            src: cancelled,
          })
        : null,
    ),
  );
};
module.exports = InvoiceTemp;
