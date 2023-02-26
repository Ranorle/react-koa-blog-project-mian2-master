import express from "express";
import {login, logout, passwordchange, register, updateinfo} from "../controllers/auth.js";


const router =express.Router()

router.post("/register",register)
router.post("/login",login)
router.post("/logout",logout)
router.post("/updateinfo",updateinfo)
router.post("/passwordchange",passwordchange)

export default router