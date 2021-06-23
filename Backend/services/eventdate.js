const helper = require('../helper.js');
const EventDateDao = require('../dao/eventdateDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service EventDate');

serviceRouter.get('/eventdate/gib/:id', function(request, response) {
    helper.log('Service EventDate: Client requested one record, id=' + request.params.id);

    const eventdateDao = new EventDateDao(request.app.locals.dbConnection);
    try {
        var result = eventdateDao.loadById(request.params.id);
        helper.log('Service EventDate: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service EventDate: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/eventdate/alle', function(request, response) {
    helper.log('Service EventDate: Client requested all records');

    const eventdateDao = new EventDateDao(request.app.locals.dbConnection);
    try {
        var result = eventdateDao.loadAll();
        helper.log('Service EventDate: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service EventDate: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/eventdate/existiert/:id', function(request, response) {
    helper.log('Service EventDate: Client requested check, if record exists, id=' + request.params.id);

    const eventdateDao = new EventDateDao(request.app.locals.dbConnection);
    try {
        var result = eventdateDao.exists(request.params.id);
        helper.log('Service EventDate: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service EventDate: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/eventdate', function(request, response) {
    helper.log('Service EventDate: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.date)) 
        errorMsgs.push('date fehlt');
    if (helper.isUndefined(request.body.info)) 
        errorMsgs.push('info fehlt');
    
    if (errorMsgs.length > 0) {
        helper.log('Service EventDate: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Hinzufügen nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const eventdateDao = new EventDateDao(request.app.locals.dbConnection);
    try {
        var result = eventdateDao.create(request.body.date, request.body.info);
        helper.log('Service EventDate: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service EventDate: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put('/eventdate', function(request, response) {
    helper.log('Service EventDate: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id fehlt');
    if (helper.isUndefined(request.body.date)) 
        errorMsgs.push('date fehlt');
    if (helper.isUndefined(request.body.info)) 
        errorMsgs.push('info fehlt');

    if (errorMsgs.length > 0) {
        helper.log('Service EventDate: Update not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Update nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const eventdateDao = new EventDateDao(request.app.locals.dbConnection);
    try {
        var result = eventdateDao.update(request.body.id, request.body.date);
        helper.log('Service EventDate: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service EventDate: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/eventdate/:id', function(request, response) {
    helper.log('Service EventDate: Client requested deletion of record, id=' + request.params.id);

    const eventdateDao = new EventDateDao(request.app.locals.dbConnection);
    try {
        var obj = eventdateDao.loadById(request.params.id);
        eventdateDao.delete(request.params.id);
        helper.log('Service EventDate: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }));
    } catch (ex) {
        helper.logError('Service EventDate: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;