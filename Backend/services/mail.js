const express = require('express');
const helper = require('../helper.js');
const sgMail = require('@sendgrid/mail')
var serviceRouter = express.Router();
//const generateTemporaryUserPassword = require('./generateTemporaryUserPassword')
const sendgridAPIKey = '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'
const recMail = "gryffin@gmx.net";
sgMail.setApiKey(sendgridAPIKey)
// sgMail.setApiKey(false)

const sendGeneralEmail = (name, email, message) => {
    const msg = {
        to: 'animexx.contact@gmail.com',
        from: 'animexx.contact@gmail.com',
        subject: 'Anfrage: Allgemein',
        text: `Absender E-Mail: ${email}\n${message}`
    };
	sgMail
	  .send(msg)
	  .then(() => {}, error => {
		console.error(error);

		if (error.response) {
		  console.error(error.response.body)
		}
	  });
	//ES8
	(async () => {
	  try {
		await sgMail.send(msg);
	  } catch (error) {
		console.error(error);

		if (error.response) {
		  console.error(error.response.body)
		}
	  }
	})();
}

const sendLostItemsEmail = (name, email, message) => {
    const msg = {
        to: 'animexx.contact@gmail.com',
        from: 'animexx.contact@gmail.com',
        subject: 'Anfrage: Allgemein',
        text: `${message}\n Absender E-Mail: ${email}`
    };
	sgMail
	  .send(msg)
	  .then(() => {}, error => {
		console.error(error);

		if (error.response) {
		  console.error(error.response.body)
		}
	  });
	//ES8
	(async () => {
	  try {
		await sgMail.send(msg);
	  } catch (error) {
		console.error(error);

		if (error.response) {
		  console.error(error.response.body)
		}
	  }
	})();
}



//const view = 'contact';

helper.log('- Service User');

//serviceRouter.get('/contact/', (request, response) => response.render(view));

serviceRouter.post('/contact/', function(request, response, next) {
    helper.log('Service User: Client requested sending of mail');

    try {


		if (request.body.subject=='General') {
			sendGeneralEmail(request.body.name,request.body.email,request.body.message);
			// response.render(view,
				// { success: "Danke für deine Anfrage, wir werden uns schnellstens darum kümmern!"});
			response.status(200).json(helper.jsonMsgOK());
		}
		else {
			sendLostItemsEmail(request.body.name,request.body.email,request.body.message);
			// response.render(view,
				// { success: "Danke für deine Anfrage, wir werden uns schnellstens darum kümmern!"});
			response.status(200).json(helper.jsonMsgOK());
		}
    } catch (ex) {
        next(ex);
    }
});

module.exports = serviceRouter;