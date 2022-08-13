import * as sgMail from "@sendgrid/mail";
import { sendgridApiKey } from '$lib/config/secrets';


export function sendEmail(message) {
  sgMail.setApiKey(sendgridApiKey);

  sgMail
    .send(message)
    .then((response) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)
      return response[0]
    })
    .catch((error) => {
      console.error(error)
      return error
    })
}

export function sendRequestAccountEmail(accountRequest) {
  const message = {
    to: 'librarian@paintlibrary.art',
    from: 'info@paintlibrary.art',
    templateId: 'd-de232faf165a4c62ab0f20cda6513405',
    dynamic_template_data: {
      subject: 'Paint Library Account Request',
      firstName: accountRequest.firstName,
      email: accountRequest.email,
      message: accountRequest.message
    },
  }

  console.log(message)

  sendEmail(message)
}
