import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: env("SMTP_HOST", 'smtp.gmail.com'),
                port: env('SMTP_PORT', 465),
                secure: true,
                auth: {
                    user: env('ADMIN_GMAIL'),
                    pass: env("ADMIN_GOOGLE_PASS"),
                },
            },
            settings: {
                defaultFrom: `"${env("ADMIN_NAME")}" <${env("ADMIN_GMAIL")}>`,
                defaultReplyTo: env("ADMIN_GMAIL"),
            }
        }
    },
   
//     "plug-test": {
//     enabled: true,
//     resolve: './src/plugins/plug-test'
//   },

 'users-permissions': {
    config: {
      register: {
        allowedFields: ['username', 'email', 'password', 'fullName','phone', 'roleType'],
      },
    },
  },
});

export default config;
