const helper = require('../helper.js');
const StaffDao = require('../dao/staffDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Staff');

serviceRouter.get('/staff/gib/:id', function(request, response) {
    helper.log('Service Staff: Client requested one record, id=' + request.params.id);

    const staffDao = new StaffDao(request.app.locals.dbConnection);
    try {
        var result = staffDao.loadById(request.params.id);
        helper.log('Service Staff: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Staff: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/staff/alle', function(request, response) {
    helper.log('Service Staff: Client requested all records');

    const staffDao = new StaffDao(request.app.locals.dbConnection);
    try {
        var result = staffDao.loadAll();
        helper.log('Service Staff: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Staff: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/staff/existiert/:id', function(request, response) {
    helper.log('Service Staff: Client requested check, if record exists, id=' + request.params.id);

    const staffDao = new StaffDao(request.app.locals.dbConnection);
    try {
        var result = staffDao.exists(request.params.id);
        helper.log('Service Staff: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Staff: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/staff', function(request, response) {
    helper.log('Service Staff: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.picture)) 
        errorMsgs.push('picture fehlt');
	    if (helper.isUndefined(request.body.name)) 
			errorMsgs.push('name fehlt');
		if (helper.isUndefined(request.body.animexxprofile)) 
			errorMsgs.push('animexxprofile fehlt');
		if (helper.isUndefined(request.body.animexxprofilelink)) 
			errorMsgs.push('animexxprofilelink fehlt');
	    if (helper.isUndefined(request.body.description)) 
			errorMsgs.push('description fehlt');
	    if (helper.isUndefined(request.body.email)) 
			errorMsgs.push('email fehlt');
    
    if (errorMsgs.length > 0) {
        helper.log('Service Staff: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Hinzufügen nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const staffDao = new StaffDao(request.app.locals.dbConnection);
    try {
        var result = staffDao.create(request.body.picture, request.body.name, request.body.description, request.body.email);
        helper.log('Service Staff: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Staff: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put('/staff', function(request, response) {
    helper.log('Service Staff: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id fehlt');
    if (helper.isUndefined(request.body.picture)) 
        errorMsgs.push('picture fehlt');
	if (helper.isUndefined(request.body.name)) 
        errorMsgs.push('name fehlt');
	if (helper.isUndefined(request.body.animexxprofile)) 
        errorMsgs.push('animexxprofile fehlt');
	if (helper.isUndefined(request.body.animexxprofilelink)) 
        errorMsgs.push('animexxprofilelink fehlt');
	if (helper.isUndefined(request.body.description)) 
        errorMsgs.push('description fehlt');
	if (helper.isUndefined(request.body.email)) 
        errorMsgs.push('email fehlt');

    if (errorMsgs.length > 0) {
        helper.log('Service Staff: Update not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Update nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const staffDao = new StaffDao(request.app.locals.dbConnection);
    try {
        var result = staffDao.update(request.body.id, request.body.picture, request.body.name, request.body.description, request.body.email);
        helper.log('Service Staff: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Staff: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/staff/:id', function(request, response) {
    helper.log('Service Staff: Client requested deletion of record, id=' + request.params.id);

    const staffDao = new StaffDao(request.app.locals.dbConnection);
    try {
        var obj = staffDao.loadById(request.params.id);
        staffDao.delete(request.params.id);
        helper.log('Service Staff: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }));
    } catch (ex) {
        helper.logError('Service Staff: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;