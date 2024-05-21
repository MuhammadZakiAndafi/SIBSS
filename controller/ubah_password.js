const modeluser = require('../models/user')
const {Op, where, Model} = require('sequelize')
const bcrypt = require('bcrypt')

const ubah_password = async (req,res) =>{
    try{
        const id = 1
        const{current_password, new_password, confirm_password} = req.body

        if(!current_password||!new_password||!confirm_password){
            res.status(400).json({ success: false, message: 'isi semua form'});
        }
        if(new_password!=confirm_password){
            res.status(400).json({ success: false, message: 'confimr password dan new password harus sama'});
        }

        const findaccount = await modeluser.findOne({
            where:{
                id : id
            }
        })
        console.log(findaccount.password);
        if(!findaccount){
            return res.status(400).json({
                success : false,
                message : "Data akun tidak ditemukan"
            })
        }

        const passwordAsli = findaccount.password
        const passwordmatch = bcrypt.compareSync(current_password, passwordAsli)
        
        if(!passwordmatch){
            return res.status(400).json({
                success : false,
                message : "password tidak sesuai"
            }) 
        }

        const salt = bcrypt.genSaltSync(10)
        const encryptPass = bcrypt.hashSync(new_password, salt)
        const updateaccount = await modeluser.update({
            password : encryptPass
        }, {
            where : {
                id : id
            }
        })
        
        if(!updateaccount){
            return res.status(400).json({
                success : false,
                message : "data gagal diperbarui"
            }) 
        }

        return res.status(200).json({
            success : true,
            message : "data berhasil diperbarui"
        }) 

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error });
    }
}

    const formUbahPassword = async (req,res) =>{
        res.render('ubah_password', { title: 'ubah_password' });
    }

module.exports = {
    ubah_password, 
    formUbahPassword
}