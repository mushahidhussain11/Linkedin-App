import { mailtrapClient, sender } from "../backend/lib/mailtrap.js";

import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to the Unlinked",
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: "Welcome",
    });

    console.log("Welcome email sent successfully ", response);
  } catch (error) {
    throw error;
  }
};
