import client, { type MailDataRequired } from '@sendgrid/mail';

const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY
const SENDER_EMAIL = import.meta.env.VITE_SENDER_EMAIL;
const SENDER_NAME = import.meta.env.VITE_SENDER_NAME;

client.setApiKey(SENDGRID_API_KEY as string);

// This function is very limited.
export async function post({ body: data }) {
  const message = {
    to: SENDER_EMAIL,
    from: SENDER_EMAIL,
    name: SENDER_NAME,
    templateId: 'd-de232faf165a4c62ab0f20cda6513405',
    dynamic_template_data: {
      subject: 'Paint Library Account Request',
      firstName: data.firstName,
      email: data.email,
      message: data.message
    },
  };

  try {
    const response = await client.send(message as MailDataRequired);
    return response;
  } catch (error) {
    console.log(error);
    return {
      body: { message: error },
      status: 500,
    }
  }
}
