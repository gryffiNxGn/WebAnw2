const helper = require('../helper.js');
const UserDao = require('../dao/userDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service User');

serviceRouter.get('/user/', function(request, response) {
    helper.log('Service User: Client requested one record, id=' + request.params.id);

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.loadById(request.params.id);
        helper.log('Service User: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service User: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});


serviceRouter.get('/user/gib/:id', function(request, response) {
    helper.log('Service User: Client requested one record, id=' + request.params.id);

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.loadById(request.params.id);
        helper.log('Service User: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service User: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/user/alle', function(request, response) {
    helper.log('Service User: Client requested all records');

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.loadAll();
        helper.log('Service User: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service User: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/user/existiert/:id', function(request, response) {
    helper.log('Service User: Client requested check, if record exists, id=' + request.params.id);

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.exists(request.params.id);
        helper.log('Service User: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service User: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/user/unique', function(request, response) {
    helper.log('Service User: Client requested check, if email is unique, email=' + request.body.email);
	var errorMsgs=[];
    if (helper.isUndefined(request.body.email)) 
        errorMsgs.push('email fehlt');

    if (errorMsgs.length > 0) {
        helper.log('Service User: check not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Check not possible. Missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.isunique(request.body.email);
        helper.log('Service User: Check if record exists by email=' + request.body.email + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'email': request.body.email, 'unique': result }));
    } catch (ex) {
        helper.logError('Service User: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});


serviceRouter.post('/user/check', function(request, response) {
    helper.log('Service User: Client requested check, if user has access');
	
    var errorMsgs=[];
    if (helper.isUndefined(request.body.email)) 
        errorMsgs.push('email fehlt');
    if (helper.isUndefined(request.body.password)) 
        errorMsgs.push('password fehlt');

    if (errorMsgs.length > 0) {
        helper.log('Service User: check not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Check not possible. Missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }
	
    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.hasaccess(request.body.email, request.body.password);
        helper.log('Service User: Check if user has access, result=' + result);	
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service User: Error checking if user has access. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
	
	
});

serviceRouter.post('/user', function(request, response) {
    helper.log('Service User: Client requested creation of new record');

    var errorMsgs=[];
	if (helper.isUndefined(request.body.name)) 
        errorMsgs.push('name fehlt');
	if (helper.isUndefined(request.body.nickname)) 
        errorMsgs.push('nickname fehlt');
    if (helper.isUndefined(request.body.email)) 
        errorMsgs.push('email fehlt');
	if (helper.isUndefined(request.body.password)) 
        errorMsgs.push('password fehlt');
    
    if (errorMsgs.length > 0) {
        helper.log('Service User: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Hinzufügen nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.create(request.body.name, request.body.nickname, request.body.email, request.body.password);
        helper.log('Service User: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service User: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put('/user', function(request, response) {
    helper.log('Service User: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id fehlt');
    if (helper.isUndefined(request.body.email)) 
        errorMsgs.push('email fehlt');
	if (helper.isUndefined(request.body.password)) 
        errorMsgs.push('password fehlt');
	if (helper.isUndefined(request.body.personid)) 
        errorMsgs.push('personid fehlt');

    if (errorMsgs.length > 0) {
        helper.log('Service User: Update not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Update nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.update(request.body.id, request.body.email, request.body.password, request.body.personid);
        helper.log('Service User: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service User: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/user/:id', function(request, response) {
    helper.log('Service User: Client requested deletion of record, id=' + request.params.id);

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var obj = userDao.loadById(request.params.id);
        userDao.delete(request.params.id);
        helper.log('Service User: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }));
    } catch (ex) {
        helper.logError('Service User: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;