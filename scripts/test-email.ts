// // scripts/test-email.ts
// import Strapi from "@strapi/strapi";

// async function testEmail() {
//   const strapi = await Strapi({}).load();

//   try {
//     await strapi.plugin("email").service("email").send({
//       to: "your-email@gmail.com",
//       subject: "Test Email from Strapi",
//       text: "Hello! This is a test email.",
//     });
//     console.log("Test email sent successfully!");
//   } catch (err) {
//     console.error("Failed to send email:", err);
//   }

//   process.exit(0);
// }

// testEmail();