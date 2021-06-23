const helper = require('../helper.js');

class StaffDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Staff WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        return helper.objectKeysToLower(result);
    }

    loadAll() {
        var sql = 'SELECT * FROM Staff';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        return helper.arrayObjectKeysToLower(result);
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Staff WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

	create(picture = '', name = '', animexxprofile = '', animexxprofilelink = '', description = '', email = '') {
        var sql = 'INSERT INTO Staff (Picture,Name,AnimexxProfile,AnimexxProfileLink,Description,Email) VALUES (?,?)';
        var statement = this._conn.prepare(sql);
        var params = [picture, name, animexxprofile, animexxprofilelink, description, email];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, picture = '', name = '', description = '', email = '') {
        var sql = 'UPDATE Staff SET Picture=?,Name=?,AnimexxProfile=?,AnimexxProfileLink=?,Description=?,Email=? WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var params = [picture, name, animexxprofile, animexxprofilelink, description, email, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Staff WHERE ID=?';
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
        helper.log('StaffDao [_conn=' + this._conn + ']');
    }
}

module.exports = StaffDao;