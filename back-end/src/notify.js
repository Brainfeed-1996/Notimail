import nodemailer from "nodemailer";

import { EMAIL_SERVICE, EMAIL, EMAIL_PASSWORD, FRONT_END_ADDRESS, ALLMYSMS_TOKEN } from "./environment.js";

const EMAIL_TRANSPORTER = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  }
});

export default function notify(email, phone_number) {
  if (email != null) {
    EMAIL_TRANSPORTER.sendMail(
      {
        from: EMAIL,
        to: email,
        subject: "Vous avez recu un courrier",
        html: `Rendez vous sur ${FRONT_END_ADDRESS} pour confirmer sa réception`,
      },
      (err, _info) => {
        if (err) {
          console.error("Error: Failed to send mail: " + err);
          return;
        }
      });
  }

  if (typeof phone_number != "string") {
    return;
  }

  if (phone_number != null) {
    if (phone_number.startsWith("+")) {
      phone_number = phone_number.slice(1);
    }

    fetch(
      "https://api.allmysms.com/sms/send/",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + ALLMYSMS_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: phone_number,
          from: "Notimail",
          text: `Vous avez recu un courrier: Rendez vous sur ${FRONT_END_ADDRESS} pour confirmer sa réception`,
        }),
      }
    )
      .catch(error => {
        console.error("Failed to send sms: " + error);
      });
  }
}
