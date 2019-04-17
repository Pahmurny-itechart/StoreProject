module.exports = (sequalize, type) => {
    return sequalize.define( 'user', {
        username : {
            type : type.STRING(16),
            primaryKey : true
        },
        email : {
            type : type.STRING(255)
        },
        password : {
            type : type.STRING(32)   
        }, 
        create_time : {
            type : type.DATE
        },
        role: {
            type: type.STRING(45)
        }
    }, {
        timestamps : false,
        freezeTableName : true, 
        tableName : 'user'
    });
};