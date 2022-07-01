require('dotenv').config();
const  { faker } = require ('@faker-js/faker');

const runScript = async() => {
    const knex = require('knex')({
        client: 'mysql',
        connection: {
          host : '127.0.0.1',
          port : 3306,
          user : 'root',
          password : process.env.MYSQL_PASSWORD,
          database : 'defaultDatabase'
        }
    });

    const createTableUsers = async () => {
        const createTableQuery = `CREATE TABLE IF NOT EXISTS users(
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            user_name VARCHAR(64),
            email VARCHAR(64),
            gender VARCHAR(64),
            job_area VARCHAR(64),
            job_title VARCHAR(64),
            age SMALLINT
            );`;

        await knex.raw(createTableQuery)
        .then(() =>{
            console.log("Table created or exists");
        })
        .catch((err)=>{
            console.log("An error, occured, table's not created " + err);
        });
    }
    const dropTable = async (table_name) => {
        await knex.raw(`DROP TABLE IF EXISTS ${table_name};`)
        .then(() => {
            console.log(`Table is dropped`);
        })
        .catch((err) => {
            console.log("An error occured " + err);
        });
    }
    function generateRandom(min = 0, max = 100) {
        // find diff
        let difference = max - min;
        // generate random number 
        let rand = Math.random();
        // multiply with difference 
        rand = Math.floor( rand * difference);
        // add with min value 
        rand = rand + min;
        return rand;
    }
    const generateUsers = (number) => {
        let users = [];
        for (let i = 0; i < number; i++){
            const name = faker.name.findName();
            const email = faker.internet.email();
            const gender = faker.name.gender();
            const jobArea = faker.name.jobArea();
            const jobTitle = faker.name.jobTitle();
            const age = generateRandom(20, 55);
            users.push({
                user_name: name,
                email: email,
                gender: gender, 
                job_area: jobArea,
                job_title: jobTitle,
                age: age
            })
        }
        return users;
    }
    const insertValues = async (values) => {
        // await knex('users').insert(values)
        await knex('users').insert(values)
        .then(() => {
            console.log(`${values.length} Values succesffully inserted`);
        })
        .catch((err) => {
            console.log("An error occured " + err);
        });
    }
    const createIndex = async (index_name, table_name, field) => {
        await knex.raw(`CREATE INDEX ${index_name} ON ${table_name} (${field});`)
        .then(() =>{
            console.log("Index created");
        })
        .catch((err)=>{
            console.log("An error, occured, index's not created " + err);
        });
    }
    const dropIndex = async (index_name, table_name) => {
        await knex.raw (`DROP INDEX ${index_name} ON ${table_name};`)
        .then(() =>{
            console.log("Index removed");
        })
        .catch((err)=>{
            console.log("An error, occured, index's not removed " + err);
        });
    }

    // generate 1 000 000 fake names
    const users = generateUsers(100_000);
    
    // create 'users' table
    await createTableUsers();

    // insert 1 000 000 names 
    await insertValues(users);

    // run performance test 2 times
    let hasIndex = false;
    for (let i = 0; i < 2; i++){
        
        // count time taken by the select operation
        const startTime = new Date().getTime();
        // perform selection
        await knex.raw(`SELECT user_name FROM users WHERE user_name LIKE 'mr%';`)
        .then (() => console.log("Selected names starting with 'mr'..."));

        const endTime = new Date().getTime();
        if (hasIndex === false){
            console.log("Query performance without index: ");
            console.log(endTime - startTime);

            // create index for the field 'user_name'
            await createIndex("user_name_index", "users", "user_name");

            hasIndex = true;
        } else {
            console.log("Query performance with index: ");
            console.log(endTime - startTime);
        }
    }

    //perform batch update
    await knex('users')
    .where('gender', 'Cis Male')
    .update({
      gender: 'CIS male',
    })
    .then(() =>{
        console.log("Batch updated ");
    })
    .catch((err)=>{
        console.log("An error occured " + err);
    });   

    // perform a complex query
    const query = await knex.select(
        'gender', 
        'job_area', 
        knex.raw('count(user_id) as "Cis male workers at job area"')
    )
    .from('users')
    .where('gender', 'CIS male')
    .groupBy('job_area')
    .orderBy('job_area');

    // perform a nested query
    const nestedQuery = await knex('users')
    .select("user_name", "job_area", "age")
    .where('age', knex("users").max("age"))
    .limit(5);

    console.log("\nComplex query: " + JSON.stringify(query)); 
    console.log("\nNested query: " + JSON.stringify(nestedQuery));

    // drop the 'users' table
    await dropTable("users");
    console.log("Done");
    knex.destroy();
};

runScript();