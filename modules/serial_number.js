var pg = require('pg');
console.log("DATABASE_URL = " + process.env.DATABASE_URL);

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
    // connectionString: process.env.DATABASE_URL,
    // ssl: {
    //     rejectUnauthorized: false
    // }
});

module.exports.create_table = function (sql) {
    return create_table(sql)
};

module.exports.drop_table = function (table_name) {
    return rop_table(table_name)
};

module.exports.insert_serial = function (serial_data, sender) {
    return insert_serial(serial_data, sender)
};

module.exports.get_serial = function (id, recipient) {
    return get_serial(id, recipient)
};

module.exports.list_serial = function () {
    return list_serial()
};

module.exports.truncate_table = function (table_name) {
    return truncate_table(table_name)
};

// Create table
let create_table = (sql) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, (err, res) => {
            if (err) {
                console.log(err, res)
                resolve(false)
            }
            else {
                resolve(true)
            }
        })
    }).catch(error => { console.log(error); reject(false); });
};

// Drop table
let drop_table = (table_name) => {
    return new Promise((resolve, reject) => {
        console.log("drop table")
        sql = 'DROP TABLE IF EXISTS ' + table_name + ';'
        pool.query(sql, (err, res) => {
            if (err) {
                console.log(err, res)
                resolve(false)
            }
            else {
                resolve(res)
            }
        })
    }).catch(error => { console.log(error); reject(false); });
};

// Insert serial data to table
let insert_serial = (serial_data, sender) => {
    return new Promise((resolve, reject) => {
        //Check row numbers
        check_row_count('serial').then((res) => {
            if (res >= 10000)
            {
                delete_first_row('serial')
            }
        }).then(() => {
            console.log("===== Serial Info =====")
            parameters = serial_data.split('^');
            if (parameters.length < 2)
            {
                resolve(false)
            }
            else {
                name = parameters[0]
                serial_number = parameters[1]
                if (parameters[2] == undefined || parameters[2] == "")
                {
                    due_date = "NULL"
                }
                else
                {
                    due_date = "TO_TIMESTAMP('" + parameters[2] + "', 'YYYY-MM-DD HH:MI:SS')"
                }
                console.log("Name = " + name)
                console.log("serial_number = " + serial_number)
                console.log("due_date = " + due_date)
                console.log("share_by = " + sender)
                console.log("===== Serial Info =====")

                sql = `INSERT INTO serial (name, serial_number, due_date, available, share_time, share_by, recipient, send_time) VALUES ('${name}', '${serial_number}', ${due_date}, true, NOW(), '${sender}', NULL, NULL)`

                pool.query(sql, (err, res) => {
                    if (err) {
                        console.log(err, res)
                        resolve(false)
                    }
                    else {
                        console.log(res)
                        resolve(true)
                    }
                })
            }
        })
    }).catch(error => { console.log(error); reject(false); });
};

// Delete data from table
let get_serial = (id, recipient) => {
    return new Promise((resolve, reject) => {
        get_serial_sql = `SELECT id, name, serial_number, COALESCE(TO_CHAR(due_date, 'YYYY-MM-DD HH:MI:SS'), NULL) due_date, available, COALESCE(TO_CHAR(share_time, 'YYYY-MM-DD HH:MI:SS'), 'NULL') share_time, share_by, recipient, send_time FROM serial where id = ${id}`

        pool.query(get_serial_sql, (err, get_res) => {
            if (err) {
                console.log(err, get_res)
                resolve(false)
            }
            else {
                console.log(get_res)

                if (get_res.rowCount <= 0) {
                    resolve(false)
                }
                else {
                    //Check row numbers
                    check_row_count('used_serial').then((res) => {
                        if (res >= 10000)
                        {
                            delete_first_row('used_serial')
                        }
                    }).then(() => {
                        id = get_res.rows[0].id
                        name = "'" + get_res.rows[0].name + "'"
                        serial_number = "'" + get_res.rows[0].serial_number + "'"

                        if (get_res.rows[0].due_date == null) {
                            due_date = "NULL"
                        }
                        else {
                            due_date = "TO_TIMESTAMP('" + get_res.rows[0].due_date + "', 'YYYY-MM-DD HH:MI:SS')" 
                        }
                        available = get_res.rows[0].available
                        share_time = "TO_TIMESTAMP('" + get_res.rows[0].share_time + "', 'YYYY-MM-DD HH:MI:SS')" 
                        share_by = "'" + get_res.rows[0].share_by + "'"

                        insert_serial_sql = `INSERT INTO used_serial (serial_id, name, serial_number, due_date, available, share_time, share_by, recipient, send_time) VALUES (${id}, ${name}, ${serial_number}, ${due_date}, ${available}, ${share_time}, ${share_by}, ${recipient}, NOW())`
                        console.log(insert_serial_sql)

                        pool.query(insert_serial_sql, (err, res) => {
                            if (err) {
                                console.log(err, res)
                                resolve(false)
                            }
                            else {
                                delete_serial_sql = `DELETE FROM serial WHERE id = ${id}`

                                pool.query(delete_serial_sql, (err, res) => {
                                    if (err) {
                                        console.log(err, res)
                                        resolve(false)
                                    }
                                    else {
                                        delete_serial_sql = `DELETE FROM serial WHERE id = ${id}`
                                        console.log(`Serial was deleted, id = ${id}`)
                                        resolve(get_res)
                                    }
                                })
                            }
                        })
                    })
                }
            }
        })
    }).catch(error => { console.log(error); reject(false); });
};

// Get all available serial from table
let list_serial = () => {
    return new Promise((resolve, reject) => {
        sql = `SELECT id, name, serial_number, COALESCE(TO_CHAR(due_date, 'YYYY-MM-DD HH:MI:SS'), '') due_date, available, share_time, share_by, recipient, send_time FROM serial where available is not false order by id`

        pool.query(sql, (err, res) => {
            if (err) {
                console.log(err, res)
                resolve(false)
            }
            else {
                if (res.rowCount <= 0) {
                    resolve(false)
                }
                else {
                    resolve(res)
                }
            }
        })
    }).catch(error => { console.log(error); reject(false); });
};

// Check row count
let check_row_count = (table_name) => {
    return new Promise((resolve, reject) => {
        check_row_count_sql = `SELECT COUNT(*) count FROM ${table_name}`
        pool.query(check_row_count_sql, (err, check_res) => {
            if (err) {
                console.log(err, check_res)
                resolve(0)
            }
            else {
                row_count = check_res.rows[0].count
                console.log(`${table_name} row count = ${row_count}`)
                resolve(row_count)
            }
        })
    }).catch(error => { console.log(error); reject(0); });
};

// Delete first row data count
let delete_first_row = (table_name) => {
    return new Promise((resolve, reject) => {
        delete_first_row_sql = `DELETE FROM ${table_name} WHERE id = (SELECT min(id) FROM  ${table_name})`
        pool.query(delete_first_row_sql, (err, check_res) => {
            if (err) {
                console.log(err, check_res)
                resolve(false)
            }
            else {
                console.log(`Data over limit, delete first data`)
                resolve(true)
            }
        })
    }).catch(error => { console.log(error); reject(0); });
};

// truncate table
let truncate_table = (table_name) => {
    return new Promise((resolve, reject) => {
        sql = `TRUNCATE TABLE ${table_name} RESTART IDENTITY CASCADE`
        pool.query(sql, (err, res) => {
            if (err) {
                console.log(err, res)
                resolve(false)
            }
            else {
                console.log(`Table "${table_name}" truncated`)
                resolve(true)
            }
        })
    }).catch(error => { console.log(error); reject(false); });
};