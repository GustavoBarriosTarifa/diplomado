import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

export const Task = sequelize.define('tasts',{
     id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{
                msg: 'Name is required'
            }
        }
    },
    done:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue :false
    },
});