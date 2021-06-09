const helper = require('../helper.js');
const PersonDao = require('./personDao.js');


class UserDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM User WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error('No Record found by id=' + id);

        return helper.objectKeysToLower(result);
    }

    loadAll() {
        var sql = 'SELECT * FROM User';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        return helper.arrayObjectKeysToLower(result);
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM User WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

	isunique(email) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM User WHERE Email=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(email);

        return result.cnt;
    }

    hasaccess(email='', password='') {
        const userDao = new UserDao(this._conn);

        var sql = 'SELECT ID FROM User WHERE Email=? AND Password=?';
        var statement = this._conn.prepare(sql);
        var params = [email, password];
        var result = statement.get(params);
		var success = false;

        if (helper.isUndefined(result)){
            throw new Error('User has no access');
			success = false;}
		else {
			success = true;
		}

        //return this.loadById(result.ID);
		return success;
    }

	create(name = '', nickname = '', email = '', password = '') {
		var sql = 'SELECT COUNT(ID) AS cnt FROM User WHERE Email=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(email);
		var serverError = false;

        if (result.cnt == 0) {
            const personDao = new PersonDao(this._conn);
			var personID = personDao.create(nickname, name);
			sql = 'INSERT INTO User (Email,Password,PersonID) VALUES (?,?,' + personID.id + ')';
			statement = this._conn.prepare(sql);
			var params = [email, password];
			result = statement.run(params);

			if (result.changes != 1)
				throw new Error('Could not insert new Record. Data: ' + params);

			var newObj = this.loadById(result.lastInsertRowid);
			return newObj;
		} else {
			return serverError;
		}

		throw new Error('Server error');
		serverError = true;
		return serverError;
    }

    update(id, email = '', password = '', personid = '') {
        var sql = 'UPDATE User SET Email=?,Password=?,PersonID=? WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var params = [email, password, personid, id];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM User WHERE ID=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1)
                throw new Error('Could not delete Record by id=' + id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message);
        }
    }

    toString() {
        helper.log('UserDao [_conn=' + this._conn + ']');
    }
}

module.exports = UserDao;