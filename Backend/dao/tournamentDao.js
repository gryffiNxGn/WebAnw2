const helper = require('../helper.js');
const PersonDao = require('./personDao.js');
const UserDao = require('./userDao.js');

class TournamentDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Tournament WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        return helper.objectKeysToLower(result);
    }

    loadAll() {
        var sql = 'SELECT * FROM Tournament';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        return helper.arrayObjectKeysToLower(result);
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Tournament WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

	create(picture = '', title = '', date = '', shortdescription = '', description = '') {
        var sql = 'INSERT INTO Tournament (Picture,Title,Date,ShortDescription,Description) VALUES (?,?)';
        var statement = this._conn.prepare(sql);
        var params = [picture, title, date, shortdescription, description];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, picture = '', title = '', date = '', shortdescription = '', description = '') {
        var sql = 'UPDATE Tournament SET Picture=?,Title=?,Date=?,ShortDescription=?,Description=? WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var params = [picture, title, date, shortdescription, description, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }
	
	getTournamentPlaner(id) {
		var sql = 'SELECT TournamentRegistrantID FROM TournamentRegistration WHERE TournamentID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(id);
		var $usedArray = []
		
		for (var idArray of result) {
			var sql = 'SELECT Nickname, Name FROM TournamentRegistrant WHERE ID=?';
			var statement = this._conn.prepare(sql);
			var result = statement.get(idArray.TournamentRegistrantID);
			$usedArray.push(result.Nickname + ' (' + result.Name + ')');
		}
		
		var $arrayLength = $usedArray.length;
		var $result = [];
		var $arrayBuffer = [[]];
		var $arrayBufferCounter = 0;
		var $participants = 2;
		
		if ($arrayLength <= 4) { // 2 Initiale Runden
			$participants = 4;
		} else if ($arrayLength <= 8) { // 4 Initiale Runden
			$participants = 8;
		} else if ($arrayLength <= 16) { // 8 Initiale Runden
			$participants = 16;
		} else if ($arrayLength <= 32) { // 16 Initiale Runden
			$participants = 32;
		} else if ($arrayLength <= 64) { // 32 Initiale Runden
			$participants = 64;
		} else if ($arrayLength <= 128) { // 64 Initiale Runden
			$participants = 128;
		}
		
		for (var $i = 0; $i < $participants; $i++) {
			if (typeof $usedArray[$i] === "undefined") {
				$usedArray[$i] = null;
			}
		}
		
		sortTournament($usedArray, $participants);
		
		function sortTournament($array, $participants) {
			var $q1 = [];
			var $q2 = [];
			var $iq1 = 0;
			var $iq2 = 0;
			
			for (var $i = 0; $i < $participants; $i++) {
				if ($i % 2 == 0) {
					$q1[$iq1] = $array[$i];
					$iq1++;
				} else {
					$q2[$iq2] = $array[$i];
					$iq2++;
				}
			}
			$participants = $usedArray.length / 2;
			$arrayBufferCounter++;
			$arrayBuffer[$arrayBufferCounter] = [];
			$arrayBuffer[$arrayBufferCounter].push($q1);
			$arrayBuffer[$arrayBufferCounter].push($q2);
			
			if ($participants > 2) {
				$usedArray = $arrayBuffer[$arrayBufferCounter][0];
				sortTournament($usedArray, $participants);
				$usedArray = $arrayBuffer[$arrayBufferCounter][1];
				sortTournament($usedArray, $participants);
			} else {
				$result.push($arrayBuffer[$arrayBufferCounter][0]);
				$result.push($arrayBuffer[$arrayBufferCounter][1]);
			}
			
			$arrayBufferCounter--;
		}
		
		return $result;
	}
	
	checkRegister(id, email) {
		var sql = 'SELECT ID FROM User WHERE Email=?';
		var statement = this._conn.prepare(sql);
		var result = statement.get(email);
		var userid = result.ID;
		
		var sql = 'SELECT COUNT(ID) AS cnt FROM TournamentRegistrant WHERE UserID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(userid);
		
		if (result.cnt >= 1) {
			var sql = 'SELECT ID FROM TournamentRegistrant WHERE UserID=?';
			var statement = this._conn.prepare(sql);
			var result = statement.get(userid);
			var tournamentRegistrantID = result.ID;
			
			var sql = 'SELECT COUNT(ID) AS cnt FROM TournamentRegistration WHERE TournamentID=? AND TournamentRegistrantID=?';
			var statement = this._conn.prepare(sql);
			var result = statement.get(id, tournamentRegistrantID);
			
			if (result.cnt >= 1) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	
	register(id, nickname, name, email) {
		var sql = 'SELECT ID FROM User WHERE Email=?';
		var statement = this._conn.prepare(sql);
		var result = statement.get(email);
		var userid = result.ID;
		
		var sql = 'SELECT COUNT(ID) AS cnt FROM TournamentRegistrant WHERE UserID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(userid);

        if (result.cnt >= 1) {
			var sql = 'UPDATE TournamentRegistrant SET Nickname=?,Name=? WHERE UserID=?';
			var statement = this._conn.prepare(sql);
			var params = [nickname, name, userid];
			var result = statement.run(params);
			
			if (result.changes != 1) 
				throw new Error('Could not update existing Record. Data: ' + params);
			
			var sql = 'SELECT ID FROM TournamentRegistrant WHERE UserID=?';
			var statement = this._conn.prepare(sql);
			var result = statement.get(userid);
			
			var tournamentRegistrantID = result.ID;
		} else {
			var sql = 'INSERT INTO TournamentRegistrant (Nickname, Name, UserID) VALUES (?,?,?)';
			var statement = this._conn.prepare(sql);
			var params = [nickname, name, userid];
			var result = statement.run(params);
			var tournamentRegistrantID = result.lastInsertRowid;
			
			if (result.changes != 1)
				throw new Error('Could not insert new Record. Data: ' + params);
		}
		
		var sql = 'SELECT COUNT(ID) AS cnt FROM TournamentRegistration WHERE TournamentID=? and TournamentRegistrantID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id, tournamentRegistrantID);
		
		if (result.cnt == 1) {
			return result;
		} else {
			var sql = 'INSERT INTO TournamentRegistration (TournamentID, TournamentRegistrantID) VALUES (?,?)';
			var statement = this._conn.prepare(sql);
			var params = [id, tournamentRegistrantID];
			var result = statement.run(params);
			
			if (result.changes != 1)
				throw new Error('Could not insert new Record. Data: ' + params);
		}
	
		return result;
	}
	
	deregister(id, email) {
		var sql = 'SELECT ID FROM User WHERE Email=?';
		var statement = this._conn.prepare(sql);
		var result = statement.get(email);
		var userid = result.ID;
		
		var sql = 'SELECT ID FROM TournamentRegistrant WHERE UserID=?';
		var statement = this._conn.prepare(sql);
		var result = statement.get(userid);
		var tournamentRegistrantID = result.ID;
		
		try {
			var sql = 'DELETE FROM TournamentRegistration WHERE TournamentID=? AND TournamentRegistrantID=?';
			var statement = this._conn.prepare(sql);
			var result = statement.run(id, tournamentRegistrantID);
			
			return true;
		} catch (ex) {
			throw new Error('Could not delete Record by TournamentID=' + id + ' TournamentRegistrantID=' + tournamentRegistrantID + '. Reason: ' + ex.message);
		}
	}
	
	getUser(email) {
		var sql = 'SELECT ID FROM User WHERE Email=?';
		var statement = this._conn.prepare(sql);
		var result = statement.get(email);
		var userid = result.ID;
		
		var sql = 'SELECT COUNT(ID) AS cnt FROM TournamentRegistrant WHERE UserID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(userid);
		
		if (result.cnt == 1) {
			var sql = 'SELECT Name, Nickname FROM TournamentRegistrant WHERE UserID=?';
			var statement = this._conn.prepare(sql);
			var result = statement.get(userid);
		} else {
			const personDao = new PersonDao(this._conn);
			const userDao = new UserDao(this._conn);
			var personID = userDao.loadById(userid).personid;

			sql = 'SELECT Name, Nickname FROM Person WHERE ID=?';
			var statement = this._conn.prepare(sql);
			var result = statement.get(personID);
		}
		
		return result;
	}

    delete(id) {
        try {
            var sql = 'DELETE FROM Tournament WHERE ID=?';
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
        helper.log('TournamentDao [_conn=' + this._conn + ']');
    }
}

module.exports = TournamentDao;