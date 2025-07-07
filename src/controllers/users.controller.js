import { User } from '../models/user.js';
import { Task } from '../models/task.js';
import logger from '../logs/logger.js';
import { Status } from '../constants/index.js';
import { encriptar } from "../common/bycrypt.js";
import { Op } from 'sequelize';  

async function getUsers(req, res, next){
    try {
        const users = await User.findAll({
            attributes: ['id','username','password','status'],
            order: [['id','DESC']],
            where: {
                status: Status.ACTIVE,
            },
        });
        res.json(users);
    } catch (error) {
        next(error)
    }    
}

async function createUser(req, res, next) {
    console.log('Entro al controlador')
    console.log(req.body)
    const {username, password} = req.body;
    try {        
        const user = await User.create({
            username,
            password
        })
        res.json(user);
    } catch (error) {
        next(error)    
    }
}

async function getUser(req, res, next) {
    const {id} = req.params;
    try {       
        const user = await User.findOne({
            attributes: ['username','password','status'],
            where: {
                id,
            },
        });       
        if(!user) res.status(400).json({Message:'User not found'}) 
        res.json(user)
    } catch (error) {
        next(error)    
    }
}


async function updateUser(req, res, next) {
    const {id} = req.params;

    const {username, password} = req.body;
    
    try {       
        if(!username && !password){
            return res
                .status(400)
                .json({message: 'Username or password is required'})
        }
        
        const passwordEncriptado = await encriptar(password);
        const user = await User.update({
            username,
            password: passwordEncriptado,}
            ,{
            where: {
                id,
            },
        });                   
        res.json(user)
    } catch (error) {
        next(error)    
    }
}

async function deleteUser(req, res, next) {
    const {id} = req.params;
    try {       
        await User.destroy({
            where: {
                id,
            }
        })
        res.status(204).json({message:'User deleted'})        
    } catch (error) {
        next(error)    
    }
}

async function activateInactivate(req, res, next) {
    const {id} = req.params;
    const {status} = req.body
    try {       
        if(!status) 
            res.status(400).json({message:'Status is required'})           

        const user = await User.findByPk(id);

        if(!user) 
            res.status(404).json({message:'Status is User not found'})           

        if(user.status === status) 
            res.status(409).json({message:'Same status'})

        user.status = status;
        await user.save();
        res.json(user);

    } catch (error) {
        next(error)    
    }
}

async function getTask(req, res, next) {
    const {id} = req.params;
    try {       
        const user = await User.findOne({
            attributes: ['username'],
            include: [
                {
                    model:Task,
                    attributes:['name','done'],
                    /*where:{
                        done: false
                    }*/
                }
            ],
            where: {
                id,
            },
        });       
//        if(!user) res.status(400).json({Message:'User not found'}) 
        res.json(user)
    } catch (error) {
        next(error)    
    }
}

async function getPagination(req, res, next) {    
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const orderBy = req.query.orderBy || 'id';
    const orderDir = req.query.orderDir || 'DESC';

    console.log("page "+page)
    console.log("limit "+limit)
    console.log("search "+search)
    console.log("orderBy "+orderBy)
    console.log("orderDir "+orderDir)
    const offset = (page - 1) * limit;    
    try {       
            
        const { count, rows } = await User.findAndCountAll({
            attributes: ['id', 'username', 'status'],
            where: {
                username: {
                [Op.iLike]: `%${search}%`,
                },
            },
            order: [[orderBy, orderDir]],
            limit,
            offset,
            });
            const totalPages = Math.ceil(count / limit);

            res.json({
                total: count,
                page,
                pages: totalPages,
                data: rows,
            });
    } catch (error) {
        console.log(error)
        next(error)    
    }
}

export default{
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    activateInactivate,
    getTask,
    getPagination
};

